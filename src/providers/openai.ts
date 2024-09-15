import { ProviderComputeOptions } from '../../types/providers.js';
import PromptGenerator from '../core/prompt_generator.js';
import AIProvider from '../interfaces/ai_provider.js';

export default class OpenAI implements AIProvider {
	public readonly key: string;
	public readonly model: string;

	constructor(key: string, model: string) {
		this.key = key;
		this.model = model;
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
				model: this.model,
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
}
