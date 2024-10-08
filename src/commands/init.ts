import { command } from 'cleye';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { input, select } from '@inquirer/prompts';
import ProviderLoader from '../core/provider_loader.js';
import chalk from 'chalk';
import { lifeline } from '../ui/lifeline.js';
import AppConfig from '../core/app_config.js';

const configPath = path.join(os.homedir(), '.gitpilot');

export default command(
	{
		name: 'init',
		parameters: [],
	},
	async (argv) => {
		const config = new AppConfig();
		const options = {
			count: 3,
			lang: 'en',
			behavior: 'conventional',
			provider: 'openai',
			model: 'gpt-4o',
			key: '',
			timeout: 1000,
			length: 50,
		};
		const uilifeline = lifeline();

		uilifeline.start(chalk.bgBlueBright(' GitPilot '));

		if (config.initialized()) {
			uilifeline.step(`${chalk.bgYellow(' /!\\ ')} Config file already exists`);
			uilifeline.space();

			const overwrite = await select({
				message: 'Do you want to rerun the configuration?',
				choices: [
					{ name: 'Yes', value: true },
					{ name: 'No', value: false },
				],
				default: false,
			});

			if (!overwrite) {
				uilifeline.end('Configuration not modified');
				return;
			} else {
				options.behavior = config.get('behavior');
				options.lang = config.get('lang');
				options.count = config.get('count');
				options.key = config.get('key');
			}
		}

		uilifeline.space();

		const providerLoader = new ProviderLoader();

		options.behavior = await select({
			message: 'What type of commit message do you want to generate?',
			choices: [
				{ name: 'Natural', value: 'natural' },
				{ name: 'Conventional', value: 'conventional' },
				{ name: 'Imitate', value: 'imitate' },
			],
			default: options.behavior,
		});

		uilifeline.space();

		options.count = await select({
			message: 'How many commit messages do you want to generate?',
			choices: [
				{ name: '1', value: 1 },
				{ name: '2', value: 2 },
				{ name: '3', value: 3 },
				{ name: '4', value: 4 },
				{ name: '5', value: 5 },
			],
			default: options.count,
		});

		uilifeline.space();

		options.lang = await select({
			message: 'In what language do you want to generate commits ?',
			choices: [
				{ name: 'English', value: 'en' },
				{ name: 'French', value: 'fr' },
				{ name: 'German', value: 'de' },
				{ name: 'Italian', value: 'it' },
				{ name: 'Japanese', value: 'jp' },
				{ name: 'Korean', value: 'kr' },
				{ name: 'Portuguese', value: 'pt' },
				{ name: 'Russian', value: 'ru' },
				{ name: 'Simplified Chinese', value: 'zh' },
				{ name: 'Spanish', value: 'es' },
			],
			default: options.lang,
		});

		uilifeline.space();

		// TODO: Load providers dynamically from the provider loader
		options.provider = await select({
			message: 'Which AI provider do you want to use?',
			choices: [
				{ name: 'Anthropic', value: 'anthropic' },
				{ name: 'OpenAI', value: 'openai' },
			],
		});

		const provider = providerLoader.getInstance(options.provider, '', '');

		if (provider === null) {
			uilifeline.end(`${chalk.bgRed(' Error ')} Provider not found`);
			return;
		}

		uilifeline.space();

		const models = await provider.getModels();

		options.model = await select({
			message: 'Which model do you want to use?',
			choices: [
				...models.map((model) => ({
					name: model.name,
					value: model.id,
				})),
			],
		});

		uilifeline.space();

		options.key = await input({
			message: 'Enter your API key',
			default: options.key,
		});

		fs.writeFileSync(configPath, JSON.stringify(options));

		if (!config.initialized()) {
			uilifeline.end(`${chalk.bgGreen(' Success ')} Configuration initialized`);
		} else {
			uilifeline.end(`${chalk.bgGreen(' Success ')} Configuration updated`);
		}
	}
);
