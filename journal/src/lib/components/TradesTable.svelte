<script lang="ts">
	import { type Trade } from '$lib/data/Trade';
	import { TradeUtils } from '$lib/utils/TradeUtils';
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

	const tradesByMonth = $derived.by(() => {
		const map = new Map<string, Trade[]>();
		trades.forEach((trade) => {
			const month = new Date(trade.date).toLocaleString('default', { month: 'long' });
			if (!map.has(month)) {
				map.set(month, []);
			}
			map.get(month)?.push(trade);
		});
		return map;
	});
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
			<th>SL</th>
			<th>EXIT 1</th>
			<th>EXIT 2</th>
			<th>EXIT 3</th>
			<th>RISK</th>
			<th>PNL</th>
		</tr>
	</thead>
	<tbody>
		{#each tradesByMonth as [month, trades]}
			{@const totalPnl = TradeUtils.getTotalPnl(trades)}
			{@const percentage = (100 / TradeUtils.getAvarageAccount(trades)) * totalPnl}
			<tr class="summary">
				<td> {month.toUpperCase()} ({trades.length})</td>
				<td colspan="12"></td>
				<td class="pnl{Math.sign(totalPnl)}" title={percentage.toFixed(2) + '%'}>${totalPnl}</td>
			</tr>
			{#each trades as trade, i (trade.date)}
				<TradeRow {trade} onchange={(trade) => handleChange(i, trade)} {ondblclick} />
			{/each}
		{/each}
	</tbody>
</table>

<style>
	.summary {
		font-weight: 700;
		background-color: var(--color-bg-highlight);
	}

	th {
		white-space: nowrap;
	}
</style>
