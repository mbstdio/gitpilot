import { command } from 'cleye';
import AppConfig from '../core/app_config.js';
import { AppConfigParamsKeys } from '../../types/app_config.js';

export default command(
	{
		name: 'config',
		parameters: ['<param>', '[value]'],
	},
	(argv) => {
		const config = new AppConfig();

		if (!config.initialized()) {
			console.log('Config file not found, please run init command');
			return;
		}

		config.load();

		const { param, value } = argv._ as {
			param: AppConfigParamsKeys;
			value?: string;
		};

		if (value === undefined) {
			if (config.get(param) === undefined) {
				console.log(`Param: ${param} not found`);
				return;
			}

			console.log(`${param}=${config.get(param)}`);
		}

		if (value !== undefined) {
			config.set(param, value);
			console.log(`Set param: ${param} with value: ${value}`);
		}
	}
);
