export type AppConfigParams = {
	count: number;
	lang: 'en' | 'fr' | 'de' | 'it' | 'jp' | string;
	behavior: 'natural' | 'conventional' | 'imitate' | string;
	provider: 'openai' | 'anthropic' | string;
	model: string;
	key: string;
	timeout: number;
	length: number;
};

export type AppConfigParamsKeys = keyof AppConfigParams;
