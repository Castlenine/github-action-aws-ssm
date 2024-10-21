import { CancelCommandCommand, SSMClient } from '@aws-sdk/client-ssm';

import * as core from '@actions/core';

interface SanitizedInputs {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	instanceIds: string[];
}

const sanitizeInputs = (): SanitizedInputs => {
	const INPUTS = {
		accessKeyId: core.getInput('aws-access-key-id', { required: true }),
		secretAccessKey: core.getInput('aws-secret-access-key', { required: true }),
		region: core.getInput('aws-region', { required: true }),
		instanceIds: core.getInput('instance-ids', { required: true }).split(/\n/),
	};

	if (!INPUTS.accessKeyId || !INPUTS.secretAccessKey || !INPUTS.region || INPUTS.instanceIds.length === 0) {
		throw new Error('Missing required inputs');
	}

	return {
		...INPUTS,
	};
};

const handleCancellation = async (inputs: SanitizedInputs): Promise<void> => {
	const SSM_CLIENT = new SSMClient({
		region: inputs.region,
		credentials: {
			accessKeyId: inputs.accessKeyId,
			secretAccessKey: inputs.secretAccessKey,
		},
	});

	const COMMAND_ID = core.getState('command-id');

	if (COMMAND_ID) {
		try {
			await SSM_CLIENT.send(new CancelCommandCommand({ InstanceIds: inputs.instanceIds, CommandId: COMMAND_ID }));
			console.log(`Cancelled command: ${COMMAND_ID} on instance(s):`, inputs.instanceIds);
		} catch (error) {
			console.warn(`Failed to cancel command: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
};

const main = async (): Promise<void> => {
	try {
		const INPUTS = sanitizeInputs();

		await handleCancellation(INPUTS);
	} catch (error) {
		console.error(error instanceof Error ? error.message : 'An unknown error occurred');

		core.setFailed(error instanceof Error ? error.message : 'An unknown error occurred');
	}
};

void main();
