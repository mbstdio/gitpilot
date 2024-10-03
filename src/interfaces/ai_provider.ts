import { AIModel } from '../../types/ai_model.js';
import { ProviderComputeOptions } from '../../types/providers.js';

export default interface AIProvider {
	readonly key: string;
	readonly currentModel: string;
	readonly displayName: string;

	/**
	 * Compute the prompt message based on the given options
	 * @param options The options to generate the prompt message
	 * @returns The prompt message
	 */
	compute(options: ProviderComputeOptions, diff: string): Promise<string[]>;

	/**
	 * Get the list of available models
	 * @returns The list of available models
	 */
	getModels(): Promise<AIModel[]>;
}
