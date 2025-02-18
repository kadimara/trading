<script lang="ts">
	import TradeDialog from '$lib/components/TradeDialog.svelte';
	import TradesTable from '$lib/components/TradesTable.svelte';
	import { getDefaultTrade, type Trade } from '$lib/data/Trade';
	import { gitStore } from '$lib/spells/GitStore.svelte';
	import { localStore } from '$lib/spells/LocalStore.svelte';
	import { TradeUtils } from '$lib/utils/TradeUtils';
	import { LoaderIcon } from 'svelte-feather-icons';

	const personalAccessToken = localStore('personalAccessToken', '');
	const localChanges = localStore('trades', [] as Partial<Trade>[]);
	const git = $derived(gitStore(personalAccessToken.value));

	const trades = $derived(TradeUtils.combineChanges(localChanges.value, git.trades));
	const canSync = $derived(localChanges.value.length > 0 && Boolean(git.user));

	let dialog = $state<TradeDialog>();
	let currentIndex = $state(-1);
	let isSyncing = $state(false);

	const handleChange = (trades: Trade[]) => {
		localChanges.value = TradeUtils.getChanges(trades, git.trades);
	};
	const handleDblClick = (trade: Trade) => {
		dialog?.show(trade, trades, (updatedTrade) => {
			if (TradeUtils.isEditable(updatedTrade)) {
				const index = trades.findIndex((t) => trade.date == t.date);
				handleChange(trades.toSpliced(index, 1, updatedTrade));
			}
		});
	};
	const handleAdd = () => {
		localChanges.value = [getDefaultTrade(trades[0]), ...localChanges.value];
	};
	const handleSync = async () => {
		isSyncing = true;
		try {
			const result = await git.set(trades);
			if (result) localChanges.value = [];
		} catch (e) {
			alert(e);
		}
		isSyncing = false;
	};
</script>

<header class="flex-row align-items-center gap-1">
	<h1 class="flexible">Trading journal v5</h1>
	<input
		class="patInput"
		bind:value={personalAccessToken.value}
		placeholder="Git personal access token"
	/>
	<button onclick={handleAdd}>Add</button>
	<button onclick={handleSync} disabled={!canSync || isSyncing}>
		{#if isSyncing}
			<LoaderIcon />
		{:else}
			Sync
		{/if}
	</button>
</header>

<div class="containerTable overflow-auto">
	<TradesTable {trades} onchange={handleChange} ondblclick={handleDblClick} />
</div>

<TradeDialog bind:this={dialog} />

<style>
	header {
		align-self: stretch;
		margin-top: 16px;
		margin: 16px 16px 0 16px;
	}
	.containerTable {
		height: 100%;
		width: 100%;
		overflow: auto;
	}

	.patInput {
		content-visibility: hidden;
	}
	.patInput:hover,
	.patInput:focus {
		content-visibility: visible;
	}
</style>
