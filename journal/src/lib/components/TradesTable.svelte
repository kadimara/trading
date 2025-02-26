<script lang="ts">
	import { type Trade } from '$lib/data/Trade';
	import { TradeUtils } from '$lib/utils/TradeUtils';
	import TradeCell from './TradeCell.svelte';
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
			<th>TP</th>
			<th>SL</th>
			<th>TP 1/2</th>
			<th>EXIT</th>
			<th>RISK</th>
			<th>PNL</th>
		</tr>
	</thead>
	<tbody>
		{#each tradesByMonth as [month, trades]}
			{@const totalPnl = TradeUtils.getTotalPnl(trades)}
			<tr class="summary">
				<td colspan="13"> {month.toUpperCase()} ({trades.length})</td>
				<TradeCell type="currency" value={totalPnl} color={totalPnl > 0 ? 'green' : 'red'} />
			</tr>
			{#each trades as trade, i (trade.date)}
				<TradeRow {trade} onchange={(trade) => handleChange(i, trade)} {ondblclick} />
			{/each}
		{/each}
		<!-- {#each trades as trade, i (trade.date)}
			<TradeRow {trade} onchange={(trade) => handleChange(i, trade)} {ondblclick} />
		{/each} -->
	</tbody>
</table>

<style>
	.summary {
		font-weight: 700;
		background-color: var(--color-bg-highlight);
	}
</style>
