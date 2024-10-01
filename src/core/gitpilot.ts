import chalk from 'chalk';
import AIProvider from '../interfaces/ai_provider.js';
import OpenAI from '../providers/openai.js';
import AppConfig from './app_config.js';
import Git from './git.js';
import { select } from '@inquirer/prompts';
import { lifeline } from '../ui/lifeline.js';
import { spinner } from '../ui/spinner.js';
import { input } from '../ui/input.js';

export default class GitPilot {
	private aiProvider: { [key: string]: AIProvider };

	constructor() {
		const config = new AppConfig();
		this.aiProvider = {
			openai: new OpenAI(config.get('key'), config.get('model')),
		};
	}

	public async generate(): Promise<void> {
		const config = new AppConfig();
		const uilifeline = lifeline();
		const uispinner = spinner();

		uilifeline.start(chalk.bgBlueBright(' GitPilot '));

		if (!config.initialized()) {
			uilifeline.step(chalk.yellow('Config not initialized'));

			uilifeline.end(`Please run ${chalk.cyanBright('gitpilot init')}`);
			return;
		}

		if (this.aiProvider[config.get('provider')]) {
			uilifeline.step('Checking staged files...');

			const files = await Git.stagedDiffFiles();

			if (files.length === 0) {
				uilifeline.end(chalk.bgYellow('No files to commit'));
				return;
			}

			uilifeline.step(chalk.green(`${files.length} files staged`));
			for (const file of files) {
				uilifeline.line(`  ${file}`);
			}

			const diff = await Git.stagedDiff();

			const provider = this.aiProvider[config.get('provider')];

			uispinner.start(`Generating commits with ${config.get('provider')}...`);
			const commits = await provider.compute(
				{
					behavior: config.get('behavior'),
					lang: config.get('lang'),
					length: config.get('length'),
					count: config.get('count'),
				},
				diff
			);
			uispinner.stop();

			const selectedCommits = await select({
				message: 'Wich commit message do you want to use?',
				choices: commits.map((commit) => ({ name: commit, value: commit })),
			});

			uilifeline.step(`Commit selected...`);

			const finalCommit = await input({
				message: 'Edit',
				default: selectedCommits,
			});

			await Git.commit(finalCommit);

			uilifeline.end(chalk.bgGreen('Commited'));
		} else {
			console.error(`Uknown provider ${config.get('provider')}`);
		}
	}
}
