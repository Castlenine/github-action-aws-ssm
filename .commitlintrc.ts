const Configuration = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'body-leading-blank': [2, 'always'],
		'body-max-line-length': [2, 'always', 120],
		'footer-leading-blank': [2, 'always'],
		'footer-max-line-length': [2, 'always', 120],
		'header-max-length': [2, 'always', 120],
		'header-trim': [2, 'always'],
		'scope-case': [1, 'always', 'lower-case'],
		'subject-case': [
			1,
			'always',
			[
				'lower-case', // lower case
				'upper-case', // UPPERCASE
				'camel-case', // camelCase
				'kebab-case', // kebab-case
				'pascal-case', // PascalCase
				'sentence-case', // Sentence case
				'snake-case', // snake_case
				'start-case', // Start Case
			],
		],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [2, 'never', '.'],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'type-enum': [
			2,
			'always',
			[
				'BREAKING-CHANGE',
				'build',
				'cherry-pick',
				'chore',
				'ci',
				'comment',
				'config',
				'docs',
				'feat',
				'fix',
				'hotfix',
				'perf',
				'prune',
				'refactor',
				'revert',
				'security',
				'style',
				'temp',
				'test',
				'version',
				'wip',
			],
		],
	},
	prompt: {
		questions: {
			type: {
				description: 'Select the type of change you are committing',
				enum: {
					'BREAKING-CHANGE': {
						description: 'A commit that introduces a breaking change',
						title: 'BREAKING-CHANGE',
						emoji: '💥',
					},
					build: {
						description:
							'Changes that affect the build process or external dependencies (example scopes: vite.js, npm, etc.)',
						title: 'Build',
						emoji: '👷',
					},
					'cherry-pick': {
						description: 'A commit that is a cherry-pick from another branch',
						title: 'Cherry-pick',
						emoji: '🍒',
					},
					chore: {
						description:
							'Changes that do not affect the source code (e.g.: adding, updating or removing dependencies, etc.)',
						title: 'Chore',
						emoji: '🧹',
					},
					ci: {
						description: 'Changes to our CI/CD configuration files and scripts (example scopes: GitHub Actions, etc.)',
						title: 'CI',
						emoji: '🎡',
					},
					comment: {
						description: 'A commit that only contains comment(s) changes',
						title: 'Comment',
						emoji: '💬',
					},
					config: {
						description: 'Changes to configuration files (e.g.: eslint, prettier, tsconfig.json, etc.)',
						title: 'Config',
						emoji: '⚙️',
					},
					docs: {
						description: 'Documentation only changes',
						title: 'Documentation',
						emoji: '📝',
					},
					feat: {
						description: 'A new feature',
						title: 'Feature',
						emoji: '✨',
					},
					fix: {
						description: 'A bug fix',
						title: 'Fix',
						emoji: '🐛',
					},
					hotfix: {
						description: 'A critical bug fix in production',
						title: 'Hotfix',
						emoji: '🚑️',
					},
					perf: {
						description: 'A code change that improves performance',
						title: 'Performance',
						emoji: '⚡',
					},
					prune: {
						description: 'A commit that removes files, directories, or code',
						title: 'Prune',
						emoji: '🪓',
					},
					refactor: {
						description: 'A code change that neither fixes a bug nor adds a feature',
						title: 'Refactor',
						emoji: '🔧',
					},
					revert: {
						description: 'Reverts a previous commit',
						title: 'Revert',
						emoji: '⏪',
					},
					security: {
						description: 'A change that improves security',
						title: 'Security',
						emoji: '🔒',
					},
					style: {
						description:
							'Changes that do not affect the meaning of the code, just the formatting (whitespace, formatting, missing semicolons, etc.)',
						title: 'Style',
						emoji: '🎨',
					},
					temp: {
						description: 'Temporary commit that will be removed before merging into the main branch',
						title: 'Temp',
						emoji: '⏰',
					},
					test: {
						description: 'Adding missing tests or correcting existing tests',
						title: 'Test',
						emoji: '🧪',
					},
					version: {
						description: 'A commit that changes the version of the project',
						title: 'Version',
						emoji: '🔖',
					},
					wip: {
						description: 'Work in progress',
						title: 'WIP',
						emoji: '🚧',
					},
				},
			},
			scope: {
				description:
					'What is the scope of this change? Please provide details such as the component, file name, etc.\nIf the commit is related to an issue number or specific task, include the ID between square brackets (e.g.: "scope[task-id])"\nNote: parentheses will be automatically added around the scope',
			},
			subject: {
				description: 'Write a brief, imperative tense subject of the change',
			},
			body: {
				description: 'Please provide a more detailed description of the change',
			},
			isBreaking: {
				description: 'Are there any breaking changes?',
			},
			breakingBody: {
				description:
					'A BREAKING CHANGE commit requires a detailed description in the body. Please enter a comprehensive explanation of the commit',
			},
			breaking: {
				description: 'Describe the breaking changes',
			},
			isIssueAffected: {
				description: 'Does this change affect any open issues?',
			},
			issues: {
				description: 'Add issue number or task ID (e.g.: "fix #123", "feat #123")',
			},
			issuesBody: {
				description:
					'If issues are closed, the commit requires a body. Please enter a detailed description of the commit',
			},
		},
	},
};

export default Configuration;
