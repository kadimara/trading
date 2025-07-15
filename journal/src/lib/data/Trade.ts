export const statuses = ['created', 'open', 'closed', 'canceled'] as const;
export type Status = (typeof statuses)[number];

export const longShort = ['long', 'short'] as const;
export type LongShort = (typeof longShort)[number];

export const symbols = ['btc', 'eth', 'ada'] as const;
export type Symbol = (typeof symbols)[number];

export const timeFrames = ['1m', '3m', '5m', '15m', '1h', '4h', 'D'] as const;
export type TimeFrame = (typeof timeFrames)[number];

export const fees = { taker: 0.0005, maker: 0 } as const;
export type Fee = keyof typeof fees;

export type Exit = {
	price: number;
	amount: number;
	type: Fee;
};

export type Trade = {
	status: Status;
	date: number;

	plan: string;
	reflection: string;
	link: string;
	htfLink: string;

	symbol: Symbol;
	timeFrame: TimeFrame;
	longShort: LongShort;

	risk: number;

	account: number;
	amount: number;
	entry: number;
	stopLoss: number;

	exit1?: Exit;
	exit2?: Exit;

	pnl: number;

	[key: string]: any;
};

type KeyTrade = keyof Trade;

// https://svelte.dev/playground/885653f873284f7880490dcdd1200238?version=3.48.0
// https://svelte.dev/docs/svelte/v5-migration-guide

enum PreTradeTags {
	'entry price' = 'entry price',
	'stop loss' = 'stop loss',
	'take profit' = 'take profit',
	'risk' = 'risk'
}

enum TradeTags {
	'test' = 'test test'
}
