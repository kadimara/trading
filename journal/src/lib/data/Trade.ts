const taker = 0.0005;

export const statuses = ['created', 'open', 'closed', 'canceled'] as const;
export type Status = (typeof statuses)[number];

export const longShort = ['long', 'short'] as const;
export type LongShort = (typeof longShort)[number];

export const symbols = ['btc', 'eth', 'ada'] as const;
export type Symbol = (typeof symbols)[number];

export const timeFrames = ['1min', '3min', '15min'] as const;
export type TimeFrame = (typeof timeFrames)[number];

export type Trade = {
	status: Status;
	date: number;
	report: string;
	note: string;
	symbol: Symbol;
	timeFrame: TimeFrame;
	longShort: LongShort;

	risk: number;
	riskRewardRatio: string;

	account: number;
	amount: number;
	entry: number;
	takeProfit: number;
	stopLoss: number;
	exit?: number;
	pnl: number;

	taker: number;
	maker: number;

	[key: string]: any;
};

type KeyTrade = keyof Trade;

export function getDefaultTrade(): Trade {
	return {
		status: 'created',
		date: Date.now(),
		report: '',
		note: '',
		symbol: 'btc',
		timeFrame: '3min',
		longShort: 'long',
		risk: 0,
		riskRewardRatio: '',
		account: 0,
		amount: 0,
		entry: 0,
		takeProfit: 0,
		stopLoss: 0,
		pnl: 0,
		taker: taker,
		maker: 0
	};
}

/**
 * Calculate the risk
 * @param sl Stop loss price.
 * @param entry Entry price.
 * @param fee Exhange market order fee.
 * @returns
 */
export function getRisk(
	acount: number,
	amount: number,
	entryPrice: number,
	stopLoss: number
): number {
	if (!stopLoss || !entryPrice) {
		return 0;
	}
	const risk = Math.abs(stopLoss / entryPrice - 1);
	return round((amount / acount) * risk, 4);
}

/**
 * Long or short
 * @param sl Stop loss price.
 * @param entry Entry price.
 * @returns
 */
export function getLongShort(entryPrice: number, stopLoss: number): LongShort {
	return stopLoss < entryPrice ? 'long' : 'short';
}

/**
 * Long or short
 * @param sl Stop loss price.
 * @param entry Entry price.
 * @returns
 */
export function getPnL(
	longShort: LongShort,
	amount: number | undefined,
	entry: number | undefined,
	exit: number | undefined
): number {
	if (!amount || !entry || !exit) {
		return 0;
	}
	const pnl = amount - (exit / entry) * amount;
	return round(longShort == 'long' ? pnl * -1 : pnl, 2);
}

export function getRiskRewardRatio(entry: number, takeProfit: number, stopLoss: number): string {
	const lossDifference = Math.abs(entry - stopLoss);
	const profitDifference = Math.abs(entry - takeProfit);

	const min = Math.min(lossDifference, profitDifference);

	const numerator = Math.round((lossDifference / min) * 10) / 10;
	const denominator = Math.round((profitDifference / min) * 10) / 10;

	return numerator + ' / ' + denominator;
}

export function createTrade(
	note: string,
	account: number,
	amount: number,
	entry: number,
	takeProfit: number,
	stopLoss: number,
	symbol: Symbol = 'btc',
	timeFrame: TimeFrame = '15min'
): Trade {
	const taker = 0.0005;
	const longShort = getLongShort(entry, stopLoss);
	const risk = getRisk(account, amount, entry, stopLoss);
	const riskRewardRatio = getRiskRewardRatio(entry, takeProfit, stopLoss);

	return {
		status: 'created',
		date: Date.now(),
		report: '',
		note: note,
		symbol: symbol,
		longShort: longShort,
		timeFrame: timeFrame,
		risk: risk,
		riskRewardRatio: riskRewardRatio,
		account: account,
		amount: amount,
		entry: entry,
		takeProfit: takeProfit,
		stopLoss: stopLoss,
		pnl: 0,
		taker: taker,
		maker: 0
	};
}

function round(value: number, fractionDigits?: number) {
	return Number(value.toFixed(fractionDigits));
}

// https://svelte.dev/playground/885653f873284f7880490dcdd1200238?version=3.48.0
// https://svelte.dev/docs/svelte/v5-migration-guide
