import readline from 'readline';
import chalk from 'chalk';
import { prompt } from './prompt.js';

export const input = async (options: {
	message: string;
	default?: string;
}): Promise<string> => {
	process.stdout.write(`├ ${chalk.gray(options.message + ':')}\n`);

	return new Promise(async (resolve) => {
		const value = await prompt({ value: options.default, onEnter: resolve });

		resolve(value);
		return;
	});
};
