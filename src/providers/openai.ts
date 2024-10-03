import { AIModel } from '../../types/ai_model.js';
import { ProviderComputeOptions } from '../../types/providers.js';
import PromptGenerator from '../core/prompt_generator.js';
import AIProvider from '../interfaces/ai_provider.js';

export default class OpenAI implements AIProvider {
	public readonly key: string;
	public readonly currentModel: string;
	public readonly displayName: string;

	constructor(key: string, model: string) {
		this.key = key;
		this.currentModel = model;
		this.displayName = 'OpenAI';
	}

	async compute(
		options: ProviderComputeOptions,
		diff: string
	): Promise<string[]> {
		const generator = new PromptGenerator({
			behavior: options.behavior,
			lang: options.lang,
			length: options.length,
			count: options.count,
		});

		const resp = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.key}`,
			},
			body: JSON.stringify({
				model: this.currentModel,
				messages: [
					{
						role: 'system',
						content: generator.compute(),
					},
					{
						role: 'user',
						content: diff,
					},
				],
				n: options.count,
			}),
		});

		const data = await resp.json();

		const uniqueChoices = new Set<string>(
			data.choices.map(
				(choice: { message: { content: string } }) => choice.message.content
			)
		);

		return Array.from(uniqueChoices);
	}

	getModels(): Promise<AIModel[]> {
		return Promise.resolve([
			{ name: 'GPT-4o', id: 'gpt-4o' },
			{ name: 'GPT-4o-mini', id: 'gpt-4o-mini' },
			{ name: 'GPT-4 Turbo', id: 'gpt-4-turbo' },
			{ name: 'GPT-3.5 Turbo', id: 'gpt-3.5-turbo' },
		]);
	}
}
