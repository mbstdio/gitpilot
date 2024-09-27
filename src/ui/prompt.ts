import readline from 'readline';
import { cursor, erase } from 'sisteransi';
import chalk from 'chalk';

export const prompt = async (options: {
	value?: string;
	pre?: string;
	onEnter?: (value: string) => void;
}): Promise<string> => {
	let input = options.value || '';
	const pre = options.pre || `│${chalk.black('_')}`;
	let terminalWidth = process.stdout.columns;
	let cursorPos = input.length;

	function pauseInput() {
		if (process.stdin.isTTY) process.stdin.setRawMode(false);
		process.stdin.pause();
		process.stdin.removeListener('keypress', handleKeypress);
	}

	function handleKeypress(chunk: string, key: readline.Key) {
		if (key.ctrl && key.name === 'c') {
			pauseInput();
			process.exit();
		}

		switch (key.name) {
			case 'return':
				process.stdout.write('\n');
				pauseInput();
				options.onEnter?.(input);
				return;
			case 'left':
				if (cursorPos > 0) {
					cursorPos--;
				}
				break;
			case 'right':
				if (cursorPos < input.length) {
					cursorPos++;
				}
				break;
			case 'home':
				cursorPos = 0;
				break;
			case 'end':
				cursorPos = input.length;
				break;
			case 'backspace':
				if (cursorPos > 0) {
					input = input.slice(0, cursorPos - 1) + input.slice(cursorPos);
					cursorPos--;
				}
				break;
			case 'delete':
				if (cursorPos < input.length) {
					input = input.slice(0, cursorPos) + input.slice(cursorPos + 1);
				}
				break;
			default:
				if (chunk && chunk.length === 1) {
					input = input.slice(0, cursorPos) + chunk + input.slice(cursorPos);
					cursorPos++;
				}
		}

		render(input, cursorPos);
	}

	function render(input: string, cursorPos: number) {
		process.stdout.write(cursor.move(0, 0));
		process.stdout.write(erase.lines(1));

		const { input: inputRange, cursorPos: cursorPosition } = getStringRange(
			input,
			terminalWidth - 3,
			cursorPos
		);
		process.stdout.write(pre + inputRange);
		process.stdout.write(cursor.to(cursorPosition + 2, 0));
	}

	function getStringRange(
		input: string,
		maxLength: number,
		cursorPosition: number
	) {
		if (input.length < maxLength) {
			return { input, cursorPos: cursorPosition };
		}

		let start = Math.max(0, cursorPosition - Math.floor(maxLength / 2));
		let end = Math.min(input.length, start + maxLength);

		if (end - start < maxLength) {
			start = Math.max(0, end - maxLength);
		}

		return {
			input: input.substring(start, end),
			cursorPos: cursorPosition - start,
		};
	}

	return new Promise((resolve) => {
		readline.emitKeypressEvents(process.stdin);

		if (process.stdin.isTTY) process.stdin.setRawMode(true);

		process.stdin.setEncoding('utf8');
		process.stdin.resume();

		process.stdin.on('keypress', handleKeypress);
		process.stdout.on('resize', () => {
			terminalWidth = process.stdout.columns;
			render(input, cursorPos);
		});

		render(input, cursorPos);
	});
};
