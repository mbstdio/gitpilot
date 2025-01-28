import AIProvider from '../interfaces/ai_provider.js';
import Anthropic from '../providers/anthropic.js';
import OpenAI from '../providers/openai.js';
import TogetherAI from '../providers/togetherai.js';

export default class ProviderLoader {
	private providers: { [key: string]: any };

	constructor() {
		this.providers = {
			openai: OpenAI,
			anthropic: Anthropic,
			togetherai: TogetherAI,
		};
	}

	public getInstance(
		providerId: string,
		key: string,
		model: string
	): AIProvider | null {
		if (!this.providers[providerId]) {
			return null;
		}

		return new this.providers[providerId](key, model);
	}

	public getProviders(): string[] {
		return Object.keys(this.providers);
	}

	public listProviders(): any[] {
		return Object.keys(this.providers).map((provider) => ({
			name: this.getInstance(provider, '', '')!.displayName,
			value: provider,
		}));
	}
}
