import json from '$lib/data/trades.json';
import type { Trade } from './Trade';

export class TradeApi {
	public static set(trades: Trade[]) {
		fetch('/', {
			method: 'POST',
			body: JSON.stringify({
				trades: trades
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	public static get(): Trade[] {
		return json as Trade[];
	}

	public static add(trade: Trade): void {
		const trades = this.get();
		const index = trades.findIndex((value) => value.date == trade.date);
		if (index == -1) {
			this.set([trade, ...trades]);
		}
	}

	public static update(trade: Trade): void {
		const trades = this.get();
		const index = trades.findIndex((value) => value.date == trade.date);
		if (index != -1) {
			trades[index] = trade;
			this.set(trades);
		}
	}
}
