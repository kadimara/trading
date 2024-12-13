import type { Trade } from './Trade';
import json from '$lib/data/trades.json';

export class TradeApi {
	public static setJSON(trades: Trade[]) {
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

	public static getJSON(): Trade[] {
		return json as Trade[];
	}
}
