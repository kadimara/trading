<script lang="ts">
	import NewTradeDialog from '$lib/components/NewTradeDialog.svelte';
	import TradesTable from '$lib/components/TradesTable.svelte';
	import type { Trade } from '$lib/data/Trade';
	import { TradeApi } from '$lib/data/TradeApi';

	let dialogOpen = $state(false);

	$effect(() => {
		console.log(dialogOpen);
	});

	const handleAdd = async () => {
		dialogOpen = true;
		// fetch('/', {
		// 	method: 'POST',
		// 	body: JSON.stringify({
		// 		trade: defaultTrade
		// 	}),
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// });
	};

	function handleClose(trade: Trade) {
		console.log(trade);
		dialogOpen = false;
		if (trade != null) {
			const trades = TradeApi.getJSON();
			TradeApi.setJSON([...trades, trade]);
		}
	}
</script>

<h1>Trading journal v5</h1>
<button onclick={handleAdd}>Add trade</button>

{#if dialogOpen}
	<NewTradeDialog onclose={handleClose} />
{/if}
<TradesTable />
