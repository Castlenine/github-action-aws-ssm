import type { GetCommandInvocationCommandOutput, SendCommandCommandInput } from '@aws-sdk/client-ssm';

import { GetCommandInvocationCommand, SSMClient, SendCommandCommand } from '@aws-sdk/client-ssm';

import * as core from '@actions/core';

import * as fs from 'fs';
import * as path from 'path';

interface SanitizedInputs {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	instanceIds: string[];
	command: string;
	user: string;
	homeEnv: string;
	workingDirectory: string;
	scriptParentFolderPath: string;
	waitForCompletion: boolean;
	pollingIntervalSeconds: number;
	timeoutSeconds: number;
	comment: string;
	haveActionOutputs: boolean;
	haveConsoleLog: boolean;
	documentName: string;
	environmentVariables: Record<string, string>;
}

const sanitizeInputs = (): SanitizedInputs => {
	const INPUTS = {
		accessKeyId: core.getInput('aws-access-key-id', { required: true }),
		secretAccessKey: core.getInput('aws-secret-access-key', { required: true }),
		region: core.getInput('aws-region', { required: true }),
		instanceIds: core.getInput('instance-ids', { required: true }).split(/\n/),
		command: core.getInput('command', { required: true }),
		user: core.getInput('user'),
		homeEnv: core.getInput('home-env'),
		workingDirectory: core.getInput('working-directory'),
		scriptParentFolderPath: core.getInput('script-parent-folder-path'),
		waitForCompletion: core.getInput('wait-for-completion')?.toLowerCase() === 'true',
		pollingIntervalSeconds: parseInt(core.getInput('polling-interval-seconds') || '5', 10),
		timeoutSeconds: parseInt(core.getInput('timeout-seconds') || '1200', 10),
		comment: core.getInput('comment'),
		haveActionOutputs: core.getInput('action-outputs')?.toLowerCase() === 'true',
		haveConsoleLog: core.getInput('console-log')?.toLowerCase() === 'true',
		documentName: 'AWS-RunShellScript',
	};

	if (
		!INPUTS.accessKeyId ||
		!INPUTS.secretAccessKey ||
		!INPUTS.region ||
		INPUTS.instanceIds.length === 0 ||
		!INPUTS.command
	) {
		throw new Error('Missing required inputs');
	}

	let sanitizedCommand = INPUTS.command;
	const environmentVariables: Record<string, string> = {};

	// Check if the command is a script in the parent folder path
	if (INPUTS.command.startsWith(INPUTS.scriptParentFolderPath + '/')) {
		const SCRIPT_PATH = path.join(process.env.GITHUB_WORKSPACE || '', INPUTS.command);

		// eslint-disable-next-line security/detect-non-literal-fs-filename
		if (fs.existsSync(SCRIPT_PATH)) {
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			sanitizedCommand = fs.readFileSync(SCRIPT_PATH, 'utf8');
		} else {
			throw new Error(`Script file not found: ${INPUTS.command}`);
		}
	}

	// Collect all environment variables
	// eslint-disable-next-line no-loops/no-loops
	for (const [key, value] of Object.entries(process.env)) {
		if (value !== undefined) {
			// eslint-disable-next-line security/detect-object-injection
			environmentVariables[key] = value;
		}
	}

	return {
		...INPUTS,
		command: sanitizedCommand,
		environmentVariables,
	};
};

const runSSMCommand = async (inputs: SanitizedInputs): Promise<void> => {
	const SSM_CLIENT = new SSMClient({
		region: inputs.region,
		credentials: {
			accessKeyId: inputs.accessKeyId,
			secretAccessKey: inputs.secretAccessKey,
		},
	});

	const COMMAND_INPUT: SendCommandCommandInput = {
		Comment: inputs.comment,
		DocumentName: inputs.documentName,
		InstanceIds: inputs.instanceIds,
		TimeoutSeconds: inputs.timeoutSeconds,
		Parameters: {
			workingDirectory: [inputs.workingDirectory],
			commands: [
				// If the user is not root, We switch to the desired user environment. SSM uses the root user by default
				inputs.user !== 'root' ? `sudo su - ${inputs.user}` : '',

				// Set environment variables before running the command
				`export ${Object.entries(inputs.environmentVariables)
					.map(([key, value]) => {
						// Remove quotes from the environment variable name and replace - with _
						const SANITIZED_KEY = key.replace(/['""`]/g, '').replace(/-/g, '_');

						// Export all environment variables except those with 'runner' or 'SSM_IGNORE' in the value and not including HOME or PATH
						if (!value.includes('runner') && !key.includes('SSM_IGNORE') && key !== 'HOME' && key !== 'PATH') {
							return `${SANITIZED_KEY}=${JSON.stringify(value)}`;
						}

						return '';
					})
					.join(' ')
					.trim()}`,

				// Reset the HOME environment variable to the desired value (default is '/home/ubuntu')
				`export HOME=${inputs.homeEnv}`,

				inputs.command,
			],
		},
	};

	try {
		const RESPONSE = await SSM_CLIENT.send(new SendCommandCommand(COMMAND_INPUT));
		const COMMAND_ID = RESPONSE.Command?.CommandId;

		// Save the command ID to the GitHub Actions context to be used in the cancel file
		core.saveState('command-id', COMMAND_ID);

		if (inputs.haveConsoleLog) {
			console.log('Request response:', RESPONSE);
		}

		if (inputs.haveActionOutputs) {
			core.setOutput('request-id', COMMAND_ID);
			core.setOutput('request-date-time', RESPONSE.Command?.RequestedDateTime?.toISOString());
			core.setOutput('request-status', RESPONSE.Command?.Status);
			core.setOutput('request-status-details', RESPONSE.Command?.StatusDetails);
		}

		if (inputs.waitForCompletion && COMMAND_ID) {
			const RESULT = await waitForCommandCompletion(
				SSM_CLIENT,
				COMMAND_ID,
				inputs.instanceIds[0],
				inputs.pollingIntervalSeconds,
				inputs.timeoutSeconds,
			);

			if (inputs.haveConsoleLog) {
				console.log('Command result:', RESULT);
			}

			if (inputs.haveActionOutputs) {
				core.setOutput('command-status', RESULT?.Status);
				core.setOutput('command-status-details', RESULT?.StatusDetails);
				core.setOutput('command-output', RESULT?.StandardOutputContent);
				core.setOutput('command-error', RESULT?.StandardErrorContent);
			}

			if (RESULT?.Status === 'Failed') {
				throw new Error(`Command execution failed`);
			} else if (RESULT?.Status === 'Cancelled') {
				throw new Error(`Command execution was cancelled`);
			} else if (RESULT?.Status === 'Cancelling') {
				throw new Error(`Command execution is being cancelled`);
			} else if (RESULT?.Status === 'TimedOut') {
				throw new Error(`Command execution timed out`);
			}
		}
	} catch (error) {
		throw new Error(
			`Failed to send or execute SSM command: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
};

const waitForCommandCompletion = async (
	client: SSMClient,
	commandId: string,
	instanceId: string,
	pollingIntervalSeconds: number,
	timeoutSeconds: number,
): Promise<GetCommandInvocationCommandOutput> => {
	const START_TIME = Date.now();
	const END_TIME = START_TIME + timeoutSeconds * 1000;

	// eslint-disable-next-line no-loops/no-loops
	while (Date.now() < END_TIME) {
		const INVOCATION_RESULT = await client.send(
			new GetCommandInvocationCommand({
				CommandId: commandId,
				InstanceId: instanceId,
			}),
		);

		if (['Success', 'Failed', 'Cancelled', 'Cancelling', 'TimedOut'].includes(INVOCATION_RESULT.Status || '')) {
			return INVOCATION_RESULT;
		}

		await new Promise((resolve) => setTimeout(resolve, pollingIntervalSeconds * 1000));
	}

	throw new Error(`Command execution timed out after ${timeoutSeconds} seconds`);
};

const main = async (): Promise<void> => {
	try {
		const INPUTS = sanitizeInputs();

		await runSSMCommand(INPUTS);
	} catch (error) {
		console.error(error instanceof Error ? error.message : 'An unknown error occurred');

		core.setFailed(error instanceof Error ? error.message : 'An unknown error occurred');
	}
};

void main();
