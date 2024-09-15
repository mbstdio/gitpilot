import { spawn } from 'child_process';

export default class Git {
	public static ecludedFiles: string[] = [
		'package-lock.json',
		'pnpm-lock.yaml',
		'*.lock',
	].map((file) => `:(exclude)${file}`);

	public static async stagedDiffFiles(): Promise<string[]> {
		const files = await this.execute('git', [
			'diff',
			'--cached',
			'--diff-algorithm=minimal',
			'--name-only',
			...this.ecludedFiles,
		]);

		return files.split('\n').filter((file) => file.length > 0);
	}

	public static async stagedDiff(): Promise<string> {
		return this.execute('git', [
			'diff',
			'--cached',
			'--diff-algorithm=minimal',
			'--no-color',
			...this.ecludedFiles,
		]);
	}

	public static async commit(message: string): Promise<void> {
		await this.execute('git', ['commit', '-m', message]);
	}

	public static async execute(
		command: string,
		options: string[]
	): Promise<string> {
		return new Promise((resolve, reject) => {
			const output: string[] = [];

			const process = spawn(command, options, {});

			process.stdout.on('data', (data) => {
				output.push(data.toString());
			});

			process.on('close', (code) => {
				if (code === 0) {
					resolve(output.join(''));
				} else {
					reject();
				}
			});
		});
	}
}
