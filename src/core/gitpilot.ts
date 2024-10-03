import chalk from 'chalk';
import AIProvider from '../interfaces/ai_provider.js';
import AppConfig from './app_config.js';
import ProviderLoader from './provider_loader.js';
import Git from './git.js';
import { select } from '@inquirer/prompts';
import { lifeline } from '../ui/lifeline.js';
import { spinner } from '../ui/spinner.js';
import { input } from '../ui/input.js';

export default class GitPilot {
	private provider: AIProvider | null = null;
	private config: AppConfig = new AppConfig();

	public async generate(): Promise<void> {
		const uilifeline = lifeline();
		const uispinner = spinner();

		uilifeline.start(chalk.bgBlueBright(' GitPilot '));

		if (!this.config.initialized()) {
			uilifeline.step(chalk.yellow('Config not initialized'));

			uilifeline.end(`Please run ${chalk.cyanBright('gitpilot init')}`);
			return;
		}

		this.provider = new ProviderLoader().getInstance(
			this.config.get('provider'),
			this.config.get('key'),
			this.config.get('model')
		);

		if (this.provider !== null) {
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

			uispinner.start(
				`Generating commits with ${this.config.get('provider')}...`
			);

			let commits: string[] | undefined = undefined;
			try {
				commits = await this.provider.compute(
					{
						behavior: this.config.get('behavior'),
						lang: this.config.get('lang'),
						length: this.config.get('length'),
						count: this.config.get('count'),
					},
					diff
				);

				uispinner.stop();
			} catch (e) {
				// TODO: Improve error handling

				uispinner.stop();
				uilifeline.end(
					`${chalk.bgRed(' Error ')} Please check your configuration file.`
				);
			}

			if (commits === undefined) {
				return;
			}

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

			uilifeline.end(`${chalk.bgGreen(' Success ')} files commited`);
		} else {
			uilifeline.end(
				`${chalk.bgRed(' Error ')} Unknown provider "${this.config.get(
					'provider'
				)}". Please check your configuration file.`
			);
		}
	}
}
