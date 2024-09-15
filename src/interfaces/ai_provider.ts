import { ProviderComputeOptions } from '../../types/providers.js';

export default interface AIProvider {
	readonly key: string;
	readonly model: string;

	/**
	 * Compute the prompt message based on the given options
	 * @param options The options to generate the prompt message
	 * @returns The prompt message
	 */
	compute(options: ProviderComputeOptions, diff: string): Promise<string[]>;
}
