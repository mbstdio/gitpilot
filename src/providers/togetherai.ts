import { AIModel } from '../../types/ai_model.js';
import { ProviderComputeOptions } from '../../types/providers.js';
import PromptGenerator from '../core/prompt_generator.js';
import AIProvider from '../interfaces/ai_provider.js';

export default class TogetherAI implements AIProvider {
	public readonly key: string;
	public readonly currentModel: string;
	public readonly displayName: string;

	constructor(key: string, model: string) {
		this.key = key;
		this.currentModel = model;
		this.displayName = 'together.ai';
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

		const resp = await fetch('https://api.together.xyz/v1/chat/completions', {
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
						content: await generator.compute(),
					},
					{
						role: 'user',
						content: diff,
					},
				],
				temperature: 0.8,
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
			{
				name: 'Meta Llama 3.3 70B Instruct Turbo',
				id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
			},
			{
				name: 'Meta Llama 3.3 70B Instruct Turbo Free',
				id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
			},
			{
				name: 'Meta Llama 3.2 3B Instruct Turbo',
				id: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
			},
			{
				name: 'Meta Llama 3.1 8B Instruct Turbo',
				id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K',
			},
			{
				name: 'Meta Llama 3.1 70B Instruct Turbo',
				id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
			},
		]);
	}
}
