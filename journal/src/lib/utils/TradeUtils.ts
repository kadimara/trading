import { fees, type Exit, type Fee, type LongShort, type Trade } from '$lib/data/Trade';
export class TradeUtils {
	public static combineChanges(changes: Partial<Trade>[], remote: Trade[]): Trade[] {
		const updatedTrades = [...remote];
		for (const change of changes) {
			const index = updatedTrades.findIndex((trade) => trade.date === change.date);
			if (index !== -1) {
				updatedTrades[index] = { ...updatedTrades[index], ...change };
			} else {
				updatedTrades.push({ ...TradeUtils.getDefaultTrade(), ...change });
			}
		}
		return updatedTrades.sort((a, b) => b.date - a.date);
	}

	public static getChanges(trades: Trade[], remote: Trade[]): Partial<Trade>[] {
		const changes: Partial<Trade>[] = [];
		const remoteTradesMap = new Map<string, Trade>();

		for (const trade of remote) {
			remoteTradesMap.set(trade.date.toString(), trade);
		}

		for (const trade of trades) {
			const remoteTrade = remoteTradesMap.get(trade.date?.toString());
			if (remoteTrade) {
				const diff: Partial<Trade> = {};
				for (const key in trade) {
					if (trade[key] !== remoteTrade[key]) {
						diff.date = trade.date;
						diff[key] = trade[key];
					}
				}
				if (Object.keys(diff).length > 0) {
					changes.push(diff);
				}
			} else {
				changes.push(trade);
			}
		}

		return changes;
	}

	public static getTotalPnl(trades: Trade[]) {
		return parseFloat(
			trades
				.filter((trade) => trade.status != 'canceled')
				.reduce((acc, trade) => acc + trade.pnl, 0)
				.toFixed(2)
		);
	}

	public static getAvarageAccount(trades: Trade[]) {
		return Math.round(
			trades
				.filter((trade) => trade.status != 'canceled')
				.reduce((acc, trade) => acc + trade.account, 0) / trades.length
		);
	}

	/**
	 * Default trade op basis van trade als die is meegestuurd.
	 * @param trade
	 * @returns
	 */
	public static getDefaultTrade(trade: Trade | null = null): Trade {
		return {
			status: 'created',
			date: Date.now(),
			link: '',
			htfLink: '',
			plan: '',
			reflection: '',
			symbol: trade?.symbol || 'btc',
			timeFrame: trade?.timeFrame || '5min',
			longShort: 'long',
			risk: 0,
			riskRewardRatio: '',
			account: trade?.account || 0,
			amount: 0,
			entry: 0,
			stopLoss: 0,
			pnl: 0
		};
	}

	/**
	 * Calculate the risk
	 * @param sl Stop loss price.
	 * @param entry Entry price.
	 * @param fee Exhange market order fee.
	 * @returns
	 */
	public static getRisk(
		acount: number,
		amount: number,
		entryPrice: number,
		stopLoss: number
	): number {
		if (!stopLoss || !entryPrice) {
			return 0;
		}
		const ratio = amount / acount;
		const risk = Math.abs(stopLoss / entryPrice - 1);
		return TradeUtils.round(ratio * risk, 4);
	}

	/**
	 * Long or short
	 * @param sl Stop loss price.
	 * @param entry Entry price.
	 * @returns
	 */
	public static getLongShort(entryPrice: number, stopLoss: number): LongShort {
		return stopLoss < entryPrice ? 'long' : 'short';
	}

	/**
	 * Long or short
	 * @param sl Stop loss price.
	 * @param entry Entry price.
	 * @returns
	 */
	public static getPnL({ longShort, entry, exit1, exit2 }: Trade): number {
		if (!entry) {
			return 0;
		}

		const pnl1 = TradeUtils.getPnlExit(exit1, entry, longShort);
		const pnl2 = TradeUtils.getPnlExit(exit2, entry, longShort);
		return TradeUtils.round(pnl1 + pnl2, 2);
	}

	public static getPnlExit(exit: Exit | undefined, entry: number, longShort: LongShort): number {
		if (!exit || !entry) {
			return 0;
		}
		const fee = fees[exit.type] * exit.amount;
		const pnl = exit.amount - (exit.price / entry) * exit.amount;
		return (longShort == 'long' ? pnl * -1 : pnl) - fee;
	}

	public static getRiskRewardRatio(entry: number, takeProfit: number, stopLoss: number): string {
		const lossDifference = Math.abs(entry - stopLoss);
		const profitDifference = Math.abs(entry - takeProfit);

		const min = Math.min(lossDifference, profitDifference);

		const numerator = Math.round((lossDifference / min) * 10) / 10;
		const denominator = Math.round((profitDifference / min) * 10) / 10;

		return numerator + ' / ' + denominator;
	}

	public static round(value: number, fractionDigits?: number) {
		return parseFloat(value.toFixed(fractionDigits));
	}

	public static getFee(amount: number, type: Fee): number {
		return amount * fees[type];
	}
}
