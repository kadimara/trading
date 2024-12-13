const taker = 0.0005;

export const longShort = ['long', 'short'] as const;
export type LongShort = (typeof longShort)[number];

export const symbols = ['btc', 'eth', 'ada'] as const;
export type Symbol = (typeof symbols)[number];

export const timeFrames = ['1min', '3min', '15min'] as const;
export type TimeFrame = (typeof timeFrames)[number];

export const marketLimit = ['market', 'limit'] as const;
export type MarketLimit = (typeof marketLimit)[number];

export type Order = {
	amount: number;
	entry: number;
	exit: number;
	pnl: number;
};

export type Trade = {
	reports: string[];
	note: string;
	symbol: Symbol;
	longShort: LongShort;
	timeFrame: TimeFrame;
	risk: number;
	riskRewardRatio: string;

	account: number;
	amount: number;
	entry: number;
	takeProfit: number;
	stopLoss: number;
	exits: Order[];
	pnl: number;

	dateCreated: number;
	dateOpen: number;
	dateClosed: number;

	taker: number;
	maker: number;
};

/**
 * Calculate the risk based on stop loss price, entry price and taker (exchange market order fees).
 * @param sl Stop loss price.
 * @param entry Entry price.
 * @param fee Exhange market order fee.
 * @returns
 */
export function getRisk(entryPrice: number, stopLoss: number, fee: number): number {
	if (!stopLoss || !entryPrice) {
		return 0;
	}
	return Math.round(Math.abs(stopLoss / entryPrice - 1) * 10000) / 10000 + fee;
}

/**
 * Calculate the position size that is allowed for this trade (max loss 1% of the account).
 * If risk is below 1% we increase the position size.
 * If risk is above 1% we decrease the position size.
 * @param account The total balance on the account.
 * @param risk The risk 0.01 == 1%.
 * @returns
 */
export function getEntryAmount(
	account: number,
	entryPrice: number,
	stopLoss: number,
	fee: number
): number {
	const risk = getRisk(entryPrice, stopLoss, fee);
	if (!account || !risk) {
		return 0;
	}
	return Math.floor(account / (risk * 100) / 10) * 10;
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
export function getPnL(longShort: LongShort, entry: number, exit: number, amount: number): number {
	// TODO fees
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
	analyze: string,
	account: number,
	entry: number,
	takeProfit: number,
	stopLoss: number,
	symbol: Symbol = 'btc',
	timeFrame: TimeFrame = '15min'
): Trade {
	const taker = 0.0005;
	const longShort = getLongShort(entry, stopLoss);
	const risk = getRisk(entry, stopLoss, taker);
	const riskRewardRatio = getRiskRewardRatio(entry, takeProfit, stopLoss);
	const amount = getEntryAmount(account, entry, stopLoss, 0);

	return {
		reports: [analyze],
		note: '',
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
		exits: [],
		pnl: 0,
		dateCreated: Date.now(),
		dateOpen: -1,
		dateClosed: -1,
		taker: taker,
		maker: 0
	};
}

export function createExitOrder(
	trade: Trade,
	amount: number,
	entry: number,
	exit: number
	// type?: MarketLimit = "limit"
): Order {
	return {
		amount: amount,
		entry: entry,
		exit: exit,
		pnl: getPnL(trade.longShort, trade.entry, exit, amount)
	};
}

export function addExitOrder(trade: Trade, exit: Order) {
	return { ...trade, exits: [...trade.exits, exit] };
}

export function openTrade(trade: Trade, date: number): Trade {
	return { ...trade, dateOpen: date };
}
export function closeTrade(trade: Trade, result: string, date: number): Trade {
	const pnl = trade.exits.map((order) => order.pnl).reduce((a, b) => a + b);

	return {
		...trade,
		reports: [...trade.reports, result],
		dateClosed: date,
		pnl: pnl
	};
}

function round(value: number, fractionDigits?: number) {
	return Number(value.toFixed(fractionDigits));
}

export function isOpen(trade: Trade) {
	return trade.dateOpen != -1 && trade.dateClosed == -1;
}

export function isValid(trade: Trade) {
	const filledIn = [trade.entry, trade.takeProfit, trade.stopLoss, trade.amount, trade.risk].every(
		(value) => Boolean(value)
	);
	const inBetween =
		(trade.stopLoss < trade.entry && trade.entry < trade.takeProfit) ||
		(trade.takeProfit < trade.entry && trade.entry < trade.stopLoss);

	return filledIn && inBetween && trade.reports.length == 1;
}
// https://svelte.dev/playground/885653f873284f7880490dcdd1200238?version=3.48.0
// https://svelte.dev/docs/svelte/v5-migration-guide
