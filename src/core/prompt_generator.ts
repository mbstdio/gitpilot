import { PromptOptions } from '../../types/prompt';

export default class PromptGenerator {
	private basePrompt = `You are an senior developer expert in your field.
		You are working on a project with a team of developers and your response will be used directly into git commit.
		Generate a concise git commit message for the following code diff with the given instructions below:`;

	private options: PromptOptions = {
		behavior: 'conventional',
		lang: 'en',
		length: 50,
	};

	constructor(options: PromptOptions) {
		this.options = { ...this.options, ...options };
	}

	private behaviorInstruction(): string {
		switch (this.options.behavior) {
			case 'natural':
				return `Write a commit message that sounds like a human wrote it.`;
			case 'conventional':
				return `Write a commit message that follows the conventional commit message format.`;
			case 'imitate':
				return `Write a commit message that imitates the style of the original commit message.`;
			default:
				return '';
		}
	}

	public compute(): string {
		let prompt = this.basePrompt;

		return [
			`Commit language : ${this.options.lang}`,
			`Commit max length : ${this.options.length}`,
			`Ignore changes that appear to be unrelevant.`,
			this.behaviorInstruction(),
		].join('\n');
	}
}
