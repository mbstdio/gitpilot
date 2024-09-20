export const lifeline = () => {
	const start = (msg: string) => {
		console.log(`┌ ${msg}`);
	};

	const space = () => {
		console.log('│');
	};

	const line = (msg: string) => {
		console.log(`│ ${msg}`);
	};

	const step = (msg: string) => {
		space();
		console.log(`├ ${msg}`);
	};

	const end = (msg: string) => {
		space();
		console.log(`└ ${msg}`);
	};

	return {
		start,
		step,
		line,
		end,
	};
};
