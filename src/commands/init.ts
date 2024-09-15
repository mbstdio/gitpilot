import { command } from 'cleye';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { input, select } from '@inquirer/prompts';

const configPath = path.join(os.homedir(), '.gitpilot');

export default command(
	{
		name: 'init',
		parameters: [],
	},
	async (argv) => {
		if (fs.existsSync(configPath)) {
			console.log('Config file already exists');
			return;
		}

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

		options.behavior = await select({
			message: 'What type of commit message do you want to generate?',
			choices: [
				{ name: 'Natural', value: 'natural' },
				{ name: 'Conventional', value: 'conventional' },
				{ name: 'Imitate', value: 'imitate' },
			],
			default: 'conventional',
		});

		options.count = await select({
			message: 'How many commit messages do you want to generate?',
			choices: [
				{ name: '1', value: 1 },
				{ name: '2', value: 2 },
				{ name: '3', value: 3 },
				{ name: '4', value: 4 },
				{ name: '5', value: 5 },
			],
			default: 3,
		});

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
			default: 'en',
		});

		options.provider = await select({
			message: 'Which AI provider do you want to use?',
			choices: [{ name: 'OpenAI', value: 'openai' }],
			default: 'openai',
		});

		options.model = await select({
			message: 'Which model do you want to use?',
			choices: [
				{ name: 'GPT-4o', value: 'gpt-4o' },
				{ name: 'GPT-4o-mini', value: 'gpt-4o-mini' },
				{ name: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
				{ name: 'GPT-3.5 Turbo (old)', value: 'gpt-3.5-turbo' },
			],
			default: 'gpt-4o-mini',
		});

		options.key = await input({
			message: 'Enter your API key',
		});

		fs.writeFileSync(configPath, JSON.stringify(options));
	}
);
