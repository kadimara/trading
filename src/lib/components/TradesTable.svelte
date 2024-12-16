<script lang="ts">
	import { isClosed, type Trade } from '$lib/data/Trade';
	import json from '$lib/data/trades.json';

	type Props = {
		oninfo: (trade: Trade) => void;
		onexit: (trade: Trade) => void;
	};
	let { oninfo, onexit }: Props = $props();
	let trades = json as Trade[];

	type DataTableColumn = {
		key: keyof Trade;
	};

	const columns: DataTableColumn[] = [
		{ key: 'dateCreated' },
		{ key: 'symbol' },
		{ key: 'timeFrame' },
		{ key: 'longShort' },
		{ key: 'account' },
		{ key: 'amount' },
		{ key: 'entry' },
		{ key: 'takeProfit' },
		{ key: 'stopLoss' },
		{ key: 'risk' },
		{ key: 'riskRewardRatio' },
		{ key: 'pnl' }
	];
</script>

<table>
	<thead>
		<tr>
			<th>ACTIONS</th>
			{#each columns as column, i (i)}
				<th>{column.key.toUpperCase()}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each trades as trade, i (i)}
			<tr>
				<td>
					<button onclick={() => oninfo(trade)}>Info</button>
					{#if !isClosed(trade)}
						<button onclick={() => onexit(trade)}>Exit</button>
					{/if}
				</td>
				{#each columns as column, i (i)}
					<td>{trade[column.key]}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	td {
		text-align: center;
	}

	td button:not(:first-child) {
		margin-left: 4px;
	}
</style>
