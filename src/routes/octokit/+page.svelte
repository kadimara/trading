<script lang="ts">
	import { personalAccessToken } from '$lib/data/LocaleStorage';
	import { getTrades, getUser } from '$lib/data/Storage';
	import type { Trade } from '$lib/data/Trade';
	import { Octokit } from 'octokit';

	let octokit = $state<Octokit>();
	let user = $state<{ login: string }>();

	let trades = $state<Trade[]>([]);

	const initialize = async () => {
		console.log('initialize');
		octokit = new Octokit({ auth: $personalAccessToken });
		user = await getUser(octokit);
		trades = await getTrades(octokit, user.login);
	};
	personalAccessToken.subscribe((value) => {
		initialize();
	});
</script>

<header class="flex-row align-items-center gap-2">
	<h1>Welcome {user?.login}</h1>
</header>
<div>
	<input bind:value={$personalAccessToken} />
</div>
<div>
	{JSON.stringify(trades)}
</div>

<style>
	header {
		align-self: stretch;
		justify-content: space-between;
		margin-top: 16px;
	}

	* {
		padding: 0px 16px;
	}
</style>
