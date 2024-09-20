import readline from 'readline';
import { cursorTo, clearLine } from 'readline';

export const prompt = async (options: {
	value?: string;
	pre?: string;
	onEnter?: (value: string) => void;
}): Promise<string> => {
	let input = options.value || '';
	const pre = options.pre || `│ `;
	let terminalWidth = process.stdout.columns;
	let cursorPos = input.length;
	let lastLines = 0;

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
				pauseInput();
				process.stdout.write('\n');
				options.onEnter?.(input);
				return;
			case 'left':
				if (cursorPos > 0) cursorPos--;
				break;
			case 'right':
				if (cursorPos < input.length) cursorPos++;
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

		refreshLine(input, cursorPos);
	}

	function refreshLine(input: string, cursorPos: number) {
		const fullText = pre + input;
		const currentLines = Math.ceil(fullText.length / terminalWidth);
		const maxLines = Math.max(currentLines, lastLines);
		lastLines = currentLines;

		// Clear all lines potentially used by the prompt and input
		for (let i = 0; i < maxLines; i++) {
			cursorTo(process.stdout, 0, process.stdout.rows - maxLines + i);
			clearLine(process.stdout, 0);
		}

		// Move cursor back to the beginning of where we will write the full text
		cursorTo(process.stdout, 0, process.stdout.rows - maxLines);

		// Write the full text, breaking lines if necessary
		let remainingText = fullText;
		while (remainingText.length > terminalWidth) {
			process.stdout.write(remainingText.slice(0, terminalWidth) + '\n');
			remainingText = remainingText.slice(terminalWidth);
		}
		process.stdout.write(remainingText);

		// Adjust cursor position based on cursorPos
		const totalOffset = pre.length + cursorPos;
		const targetRow = Math.floor(totalOffset / terminalWidth);
		const targetCol = totalOffset % terminalWidth;
		cursorTo(
			process.stdout,
			targetCol,
			process.stdout.rows - currentLines + targetRow
		);
	}

	return new Promise((resolve) => {
		readline.emitKeypressEvents(process.stdin);

		if (process.stdin.isTTY) process.stdin.setRawMode(true);

		process.stdin.setEncoding('utf8');
		process.stdin.on('keypress', handleKeypress);
		process.stdout.on('resize', () => {
			terminalWidth = process.stdout.columns;
			refreshLine(input, cursorPos);
		});

		refreshLine(input, cursorPos);
	});
};
