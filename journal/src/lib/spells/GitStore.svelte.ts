import { browser } from '$app/environment';
import { OctokitApi } from '$lib/data/OctokitApi';
import type { Trade } from '$lib/data/Trade';
import { Octokit } from 'octokit';

type User = Awaited<ReturnType<typeof OctokitApi.getUser>>;

class GitStore {
	user: User = $state.raw(null);
	trades: Trade[] = $state.raw([]);

	constructor(auth: string) {
		const octokit = new Octokit({ auth });
		OctokitApi.getUser(octokit).then((user) => {
			this.user = user;
			OctokitApi.getTrades(octokit, this.user?.login).then((trades) => {
				this.trades = trades;
			});
		});
	}
}

export function gitStore(auth: string) {
	return new GitStore(auth);
}
