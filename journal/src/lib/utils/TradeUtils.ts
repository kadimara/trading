// @ts-nocheck
import { getDefaultTrade, type Trade } from '$lib/data/Trade';
export class TradeUtils {
	public static combineChanges(changes: Partial<Trade>[], remote: Trade[]): Trade[] {
		const updatedTrades = [...remote];
		for (const change of changes) {
			const index = updatedTrades.findIndex((trade) => trade.date === change.date);
			if (index !== -1) {
				updatedTrades[index] = { ...updatedTrades[index], ...change };
			} else {
				updatedTrades.push({ ...getDefaultTrade(), ...change });
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
}
