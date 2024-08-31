import { command } from 'cleye';
import fs from 'fs';
import path from 'path';
import os from 'os';

const configPath = path.join(os.homedir(), '.gitpilot');

export default command(
	{
		name: 'config',
		parameters: ['<param>', '[value]'],
	},
	(argv) => {
		if (!isInitialized()) {
			console.log('Config file not found, please run init command');
			return;
		}

		const { param, value } = argv._;

		if (value === undefined) {
			const config = getConfig();

			if (config[param] === undefined) {
				console.log(`Param: ${param} not found`);
				return;
			}

			console.log(`${param}=${config[param]}`);
		}

		if (value !== undefined) {
			console.log(`Set param: ${param} with value: ${value}`);
		}
	}
);

function isInitialized() {
	return fs.existsSync(configPath);
}

function getConfig(): any {
	return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}
