import { version } from '../package.json';
import { cli } from 'cleye';
import config from './commands/config';
import init from './commands/init';

cli(
	{
		name: 'gitpilot',
		version: version,
		flags: {
			generate: {
				type: Number,
				alias: 'g',
			},
		},
		commands: [init, config],
		ignoreArgv: (type) => type === 'unknown-flag' || type === 'argument',
	},
	(argv) => {
		console.log(argv);
	}
);
