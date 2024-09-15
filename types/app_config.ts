export type AppConfigParams = {
	count: number;
	lang: string;
	behavior: 'natural' | 'conventional' | 'imitate';
	provider: string;
	model: string;
	key: string;
	timeout: number;
	length: number;
};

export type AppConfigParamsKeys = keyof AppConfigParams;
