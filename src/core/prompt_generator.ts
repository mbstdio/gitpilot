import { PromptOptions } from '../../types/prompt';

export default class PromptGenerator {
	private options: PromptOptions = {
		type: 'conventional',
	};

	constructor(options: PromptOptions) {
		this.options = { ...this.options, ...options };
	}
}
