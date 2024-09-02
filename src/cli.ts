import { version } from '../package.json';
import { cli } from 'cleye';
import config from './commands/config';
import init from './commands/init';
import GitPilot from './core/gitpilot';

const gitPilot = new GitPilot();

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
		ignoreArgv: (type: any) => type === 'unknown-flag' || type === 'argument',
	},
	(argv: any) => {
		console.log('Unknown command:');
		gitPilot.generate();
	}
);
