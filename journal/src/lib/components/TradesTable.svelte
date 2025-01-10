<script lang="ts">
	import { type Trade } from '$lib/data/Trade';
	import TradeRow from './TradeRow.svelte';

	type Props = {
		trades: Trade[];
		onchange: (trades: Trade[]) => void;
		ondblclick: (trade: Trade) => void;
	};

	let { trades, onchange, ondblclick }: Props = $props();

	const handleChange = (index: number, trade: Trade) => {
		onchange(trades.toSpliced(index, 1, trade));
	};
</script>

<table>
	<thead>
		<tr>
			<th>STATUS</th>
			<th>DATE</th>
			<th>SYMBOL</th>
			<th>TF</th>
			<th>L / S</th>
			<th>ACCOUNT</th>
			<th>AMOUNT</th>
			<th>ENTRY</th>
			<th>TP</th>
			<th>SL</th>
			<th>EXIT</th>
			<th>RISK</th>
			<th>R/R</th>
			<th>PNL</th>
		</tr>
	</thead>
	<tbody>
		{#each trades as trade, i (trade.date)}
			<TradeRow {trade} onchange={(trade) => handleChange(i, trade)} {ondblclick} />
		{/each}
	</tbody>
</table>

<style>
</style>
