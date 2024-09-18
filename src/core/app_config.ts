import fs from 'fs';
import path from 'path';
import os from 'os';
import {
	AppConfigParams,
	AppConfigParamsKeys,
} from '../../types/app_config.js';

export default class AppConfig {
	private configPath: string = path.join(os.homedir(), '.gitpilot');
	private config: AppConfigParams = {
		behavior: 'conventional',
		lang: 'en',
		length: 50,
		provider: 'openai',
		model: 'gpt-3.5-turbo',
		key: '',
		timeout: 5000,
		count: 1,
	};

	constructor() {
		this.load();
	}

	public load() {
		if (this.initialized()) {
			this.config = JSON.parse(
				fs.readFileSync(this.configPath, 'utf8')
			) as AppConfigParams;
		}
	}

	public initialized(): boolean {
		return fs.existsSync(this.configPath);
	}

	public get(param: AppConfigParamsKeys | '' = ''): string | any | undefined {
		if (param === '') {
			return this.config;
		}

		return this.config[param];
	}

	public set(param: AppConfigParamsKeys, value: string): void {
		if (this.config[param] === undefined) return;

		this.config[param] = value;
		fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
	}
}
