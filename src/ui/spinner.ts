import { cursor, erase } from 'sisteransi';

export const spinner = () => {
	const frames = ['-', '\\', '|', '/'];
	const frameTime = 120;

	let active: boolean = false;
	let message: string = '';

	const start = (msg: string) => {
		active = true;
		message = msg;

		console.log(`│`);

		let i = 0;
		const interval = setInterval(() => {
			if (!active) {
				clearInterval(interval);
				return;
			}

			const frame = frames[(i = ++i % frames.length)];
			const output = `${erase.line}${cursor.to(0)}├ ${frame} ${message}`;

			process.stdout.write(output);
		}, frameTime);
	};

	const stop = () => {
		active = false;
		process.stdout.write(`${erase.line}${cursor.to(0)}├ ${message}\n`);
		process.stdout.write('│\n');
	};

	return {
		start,
		stop,
	};
};
