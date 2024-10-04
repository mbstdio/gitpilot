import { AIModel } from '../../types/ai_model.js';
import { ProviderComputeOptions } from '../../types/providers.js';
import PromptGenerator from '../core/prompt_generator.js';
import AIProvider from '../interfaces/ai_provider.js';

export default class Anthropic implements AIProvider {
	public readonly key: string;
	public readonly currentModel: string;
	public readonly displayName: string;

	constructor(key: string, model: string) {
		this.key = key;
		this.currentModel = model;
		this.displayName = 'Anthropic';
	}

	async compute(
		options: ProviderComputeOptions,
		diff: string
	): Promise<string[]> {
		const completionTasks = [];

		for (let i = 0; i < options.count; i++) {
			completionTasks.push(this.generateCompletion(options, diff));
		}

		const completionTasksResult = await Promise.all(completionTasks);
		const uniqueChoices = new Set<string>(completionTasksResult);

		return Array.from(uniqueChoices);
	}

	getModels(): Promise<AIModel[]> {
		return Promise.resolve([
			{ name: 'Claude 3.5 Sonnet', id: 'claude-3-5-sonnet-20240620' },
			{ name: 'Claude 3 Opus', id: 'claude-3-opus-20240229' },
			{ name: 'Claude 3 Sonnet', id: 'claude-3-sonnet-20240229' },
		]);
	}

	async generateCompletion(
		options: ProviderComputeOptions,
		diff: string
	): Promise<string> {
		const generator = new PromptGenerator({
			behavior: options.behavior,
			lang: options.lang,
			length: options.length,
			count: options.count,
		});

		const resp = await fetch('https://api.anthropic.com/v1/messages', {
			method: 'POST',
			headers: {
				'x-api-key': this.key,
				'anthropic-version': '2023-06-01',
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				model: this.currentModel,
				system: generator.compute(),
				messages: [
					{
						role: 'user',
						content: diff,
					},
				],
				stream: false,
				temperature: 0.8,
				max_tokens: 1024,
			}),
		});

		const data = await resp.json();

		return data.content[0].text.split('\n')[0];
	}
}
