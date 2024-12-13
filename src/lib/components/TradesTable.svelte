<script lang="ts">
	import type { Trade } from '$lib/data/Trade';
	import json from '$lib/data/trades.json';

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

<div class="container">
	<table>
		<thead>
			<tr>
				{#each columns as column, i (i)}
					<th>{column.key.toUpperCase()}</th>
				{/each}
				<!-- <th>ACTIONS</th> -->
			</tr>
		</thead>
		<tbody>
			{#each trades as row, i (i)}
				<tr>
					{#each columns as column, i (i)}
						<td>{row[column.key]}</td>
					{/each}
					<!-- <td><button>close</button>&nbsp;<button>remove</button></td> -->
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.container {
		overflow: auto;
		width: 100%;
	}
</style>
