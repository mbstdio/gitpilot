import fs from 'fs';
import path from 'path';
import os from 'os';

export default class AppConfig {
	private configPath: string = path.join(os.homedir(), '.gitpilot');
	private config: any = {};

	public load() {
		this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
	}

	public initialized(): boolean {
		return fs.existsSync(this.configPath);
	}

	public get(param: string = ''): string | any | undefined {
		if (param === '') {
			return this.config;
		}

		return this.config[param];
	}

	public set(param: string, value: string) {
		if (this.config[param] === undefined) return;

		this.config[param] = value;
		fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
	}
}
