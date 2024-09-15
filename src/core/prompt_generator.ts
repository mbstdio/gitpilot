import { PromptOptions } from '../../types/prompt.js';

export default class PromptGenerator {
	private basePrompt = `You are a senior developer expert in your field.
You are working on a project with a team of developers and your response will be used directly into git commit.
Generate a concise git commit message for the following code diff with the given instructions below:`;

	private options: PromptOptions = {
		behavior: 'conventional',
		lang: 'en',
		length: 50,
		count: 1,
	};

	constructor(options: PromptOptions) {
		this.options = { ...this.options, ...options };
	}

	private behaviorInstruction(): string {
		switch (this.options.behavior) {
			case 'natural':
				return `Write a commit message that sounds like a human wrote it.`;
			case 'conventional':
				return `Write a commit message that follows the conventional commit message format.
Here are the concise rules : The keywords “MUST”, “MUST NOT”, “SHALL”, etc., are defined as per RFC 2119.
Commits MUST start with a type (e.g., feat, fix) followed by an OPTIONAL scope, an OPTIONAL ! for breaking changes, and a REQUIRED colon and space. feat is for new features. fix is for bug fixes. Other types MAY be used (e.g., docs). A scope is an OPTIONAL noun in parentheses (e.g., fix(parser)). The description MUST follow immediately after the type/scope prefix and briefly summarize the change. An OPTIONAL body starts one blank line after the description and MAY have any number of paragraphs. OPTIONAL footers start one blank line after the body and MUST use tokens with a : or # separator, and - instead of spaces, except for BREAKING CHANGE, which MAY also be used. Breaking changes MUST be indicated by a ! in the prefix or as a footer with BREAKING CHANGE: and a description. Commits are case-insensitive, except for BREAKING CHANGE.`;
			case 'imitate':
				return `Write a commit message that imitates the style of the original commit message.`;
			default:
				return '';
		}
	}

	public compute(): string {
		return [
			this.basePrompt,
			`Commit language : ${this.options.lang}`,
			`Commit max length : ${this.options.length}`,
			`Ignore changes that appear to be unrelevant.`,
			this.behaviorInstruction(),
		].join('\n');
	}
}
