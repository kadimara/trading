<script lang="ts">
	import ExitTradeDialog from '$lib/components/ExitTradeDialog.svelte';
	import NewTradeDialog from '$lib/components/NewTradeDialog.svelte';
	import TradesTable from '$lib/components/TradesTable.svelte';
	import type { Trade } from '$lib/data/Trade';
	import { TradeApi } from '$lib/data/TradeApi';

	let newTradeDialog = $state<HTMLDialogElement>();
	let exitTrade = $state<Trade>();

	const handleAddClick = () => {
		newTradeDialog?.showModal();
	};
	const handleAdd = (trade: Trade) => {
		const trades = TradeApi.getJSON();
		TradeApi.setJSON([...trades, trade]);
	};
	const handleInfoClick = () => {
		// infoTradeDialog?.showModal();
	};
	const handleExitClick = (trade: Trade) => {
		exitTrade = trade;
	};
	const handleExit = (trade: Trade) => {
		const trades = TradeApi.getJSON();
		TradeApi.setJSON([...trades, trade]);
	};
</script>

<header class="flex-row align-items-center gap-2">
	<h1>Trading journal v5</h1>
	<button onclick={handleAddClick}>Add trade</button>
</header>

<div class="containerTable overflow-auto">
	<TradesTable oninfo={handleInfoClick} onexit={handleExitClick} />
</div>
<NewTradeDialog bind:dialog={newTradeDialog} onadd={handleAdd} />
{#if exitTrade}
	{#key exitTrade}
		<ExitTradeDialog trade={exitTrade} onexit={handleExit} />
	{/key}
{/if}

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
