<script lang="ts">
	import AddTradeDialog from '$lib/components/AddTradeDialog.svelte';
	import TradesTable from '$lib/components/TradesTable.svelte';
	import UpdateTradeDialog from '$lib/components/UpdateTradeDialog.svelte';
	import type { Trade } from '$lib/data/Trade';
	import { TradeApi } from '$lib/data/TradeApi';

	let addTradeDialog = $state<AddTradeDialog>();
	let updateTradeDialog = $state<UpdateTradeDialog>();

	const handleAdd = () => {
		addTradeDialog?.confirm((trade) => {
			TradeApi.add(trade);
		});
	};
	const handleChange = (trade: Trade) => {
		updateTradeDialog?.confirm(trade, (trade) => {
			TradeApi.update(trade);
		});
	};
</script>

<header class="flex-row align-items-center gap-2">
	<h1>Trading journal v5</h1>
	<button onclick={handleAdd}>Add trade</button>
</header>

<div class="containerTable overflow-auto">
	<TradesTable onchange={handleChange} />
</div>
<AddTradeDialog bind:this={addTradeDialog} />
<UpdateTradeDialog bind:this={updateTradeDialog} />

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
