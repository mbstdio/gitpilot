import { command } from 'cleye';
import fs from 'fs';
import path from 'path';
import os from 'os';

const configPath = path.join(os.homedir(), '.commitpilot');

export default command(
	{
		name: 'init',
		parameters: [],
	},
	(argv) => {
		if (fs.existsSync(configPath)) {
			console.log('Config file already exists');
			return;
		}

		fs.writeFileSync(
			configPath,
			JSON.stringify({
				count: 3,
				lang: 'en',
				type: 'conventional',
				key: '',
				model: 'gpt-4o',
				timeout: 1000,
				length: 50,
			})
		);
	}
);
