<script lang="ts">
	import TradeDialog from '$lib/components/TradeDialog.svelte';
	import TradesTable from '$lib/components/TradesTable.svelte';
	import { defaultTrade, type Trade } from '$lib/data/Trade';
	import { TradeApi } from '$lib/data/TradeApi';
	import { onMount } from 'svelte';

	let dialog = $state<TradeDialog>();
	let trades = $state<Trade[]>([]);
	let currentIndex = $state(-1);
	const handleChange = (trades: Trade[]) => {
		TradeApi.set(trades);
		trades = trades;
	};
	const handleDblClick = (trade: Trade) => {
		currentIndex = trades.indexOf(trade);
		dialog?.show(trade, (trade) => {
			TradeApi.update(trade);
			currentIndex = -1;
		});
	};
	const handleAdd = () => {
		TradeApi.add(defaultTrade);
	};

	onMount(() => {
		trades = TradeApi.get();

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

<header class="flex-row align-items-center gap-2">
	<h1>Trading journal v5</h1>
	<button onclick={handleAdd}>Add trade</button>
</header>

<div class="containerTable overflow-auto">
	<TradesTable {trades} onchange={handleChange} ondblclick={handleDblClick} />
</div>

<TradeDialog bind:this={dialog} />

<style>
	header {
		align-self: stretch;
		justify-content: space-between;
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
