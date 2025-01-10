<script lang="ts">
	import TradeDialog from '$lib/components/TradeDialog.svelte';
	import TradesTable from '$lib/components/TradesTable.svelte';
	import { type Trade } from '$lib/data/Trade';
	import { gitStore } from '$lib/spells/GitStore.svelte';
	import { localStore } from '$lib/spells/LocalStore.svelte';
	import { TradeUtils } from '$lib/utils/TradeUtils';

	import { onMount } from 'svelte';
	const personalAccessToken = localStore('personalAccessToken', '');
	const localChanges = localStore('trades', [] as Partial<Trade>[]);
	const git = $derived(gitStore(personalAccessToken.value));

	const trades = $derived(TradeUtils.combineChanges(localChanges.value, git.trades));

	let dialog = $state<TradeDialog>();
	let currentIndex = $state(-1);

	const handleChange = (trades: Trade[]) => {
		console.log('change');
		localChanges.value = TradeUtils.getChanges(trades, git.trades);
	};
	const handleDblClick = (trade: Trade) => {
		currentIndex = trades.indexOf(trade);
		dialog?.show(trade, (updatedTrade) => {
			// updateTrade(trade, updatedTrade);
			currentIndex = -1;
		});
	};
	const handleAdd = () => {
		// addTrade();
	};

	onMount(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (currentIndex == -1) {
				return;
			}

			if (e.code == 'ArrowLeft') {
				const trade = trades[currentIndex - 1];
				trade && handleDblClick(trade);
			} else if (e.code == 'ArrowRight') {
				const trade = trades[currentIndex + 1];
				trade && handleDblClick(trade);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
	});
</script>

<header class="flex-row align-items-center gap-1">
	<h1 class="flexible">Trading journal v5</h1>
	<input bind:value={personalAccessToken.value} placeholder="Git personal access token" />
	<button onclick={handleAdd}>Add trade</button>
</header>

<div class="containerTable overflow-auto">
	<TradesTable {trades} onchange={handleChange} ondblclick={handleDblClick} />
</div>

<TradeDialog bind:this={dialog} />

<style>
	header {
		align-self: stretch;
		margin-top: 16px;
	}
	.containerTable {
		height: 100%;
		width: 100%;
		overflow: auto;
	}

	* {
		padding: 0px 16px;
	}
</style>
