import { browser } from '$app/environment';
import { OctokitApi } from '$lib/data/OctokitApi';
import type { Trade } from '$lib/data/Trade';
import { Octokit } from 'octokit';

type User = Awaited<ReturnType<typeof OctokitApi.getUser>>;

class GitStore {
	auth: string = '';
	#octokit: Octokit;
	user: User = $state.raw(null);
	trades: Trade[] = $state.raw([]);

	constructor(auth: string) {
		this.auth = auth;
		this.#octokit = new Octokit({ auth });
		OctokitApi.getUser(this.#octokit).then((user) => {
			this.user = user;
			OctokitApi.getTrades(this.#octokit, this.user?.login).then((trades) => {
				this.trades = trades;
			});
		});
	}

	async set(trades: Trade[]) {
		if (this.user) {
			if (await OctokitApi.setTrades(this.#octokit, this.user?.login, trades)) {
				this.trades = trades;
				return true;
			}
		}
		return false;
	}
}

export function gitStore(auth: string) {
	return new GitStore(auth);
}
