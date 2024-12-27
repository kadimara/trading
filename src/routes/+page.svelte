<script lang="ts">
	import AddTradeDialog from '$lib/components/AddTradeDialog.svelte';
	import InfoTradeDialog from '$lib/components/InfoTradeDialog.svelte';
	import TradesTable from '$lib/components/TradesTable.svelte';
	import UpdateTradeDialog from '$lib/components/UpdateTradeDialog.svelte';
	import type { Trade } from '$lib/data/Trade';
	import { TradeApi } from '$lib/data/TradeApi';

	let addTradeDialog = $state<AddTradeDialog>();
	let updateTradeDialog = $state<UpdateTradeDialog>();
	let infoTradeDialog = $state<InfoTradeDialog>();

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
	const handleDblClick = (trade: Trade) => {
		infoTradeDialog?.show(trade);
	};
</script>

<header class="flex-row align-items-center gap-2">
	<h1>Trading journal v5</h1>
	<button onclick={handleAdd}>Add trade</button>
</header>

<div class="containerTable overflow-auto">
	<TradesTable onchange={handleChange} ondblclick={handleDblClick} />
</div>
<AddTradeDialog bind:this={addTradeDialog} />
<UpdateTradeDialog bind:this={updateTradeDialog} />
<InfoTradeDialog bind:this={infoTradeDialog} />

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
