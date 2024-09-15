import AIProvider from '../interfaces/ai_provider.js';
import OpenAI from '../providers/openai.js';
import AppConfig from './app_config.js';
import Git from './git.js';
import { input, select } from '@inquirer/prompts';

export default class GitPilot {
	private aiProvider: { [key: string]: AIProvider };

	constructor() {
		const config = new AppConfig();
		this.aiProvider = {
			openai: new OpenAI(config.get('key'), config.get('model')),
		};
	}

	public async generate(): Promise<void> {
		console.log('Generating git commit messages...');
		const config = new AppConfig();

		if (this.aiProvider[config.get('provider')]) {
			const files = await Git.stagedDiffFiles();
			const diff = await Git.stagedDiff();

			const provider = this.aiProvider[config.get('provider')];

			const commits = await provider.compute(
				{
					behavior: config.get('behavior'),
					lang: config.get('lang'),
					length: config.get('length'),
					count: config.get('count'),
				},
				diff
			);

			const selectedCommits = await select({
				message: 'Wich commit message do you want to use?',
				choices: commits.map((commit) => ({ name: commit, value: commit })),
			});

			const finalCommit = await input({
				message: 'Edit :\n',
				default: selectedCommits,
			});

			await Git.commit(finalCommit);
		} else {
			console.error(`Uknown provider ${config.get('provider')}`);
		}
	}
}
