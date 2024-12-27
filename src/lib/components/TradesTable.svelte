<script lang="ts">
	import { getPnL, status, type Trade } from '$lib/data/Trade';
	import json from '$lib/data/trades.json';

	type Props = {
		onchange: (trade: Trade) => void;
		ondblclick: (trade: Trade) => void;
	};
	let { onchange, ondblclick }: Props = $props();
	let trades = json as Trade[];

	const handleChangeStatus = (trade: Trade) => {
		if (trade.exit) {
			trade.pnl = getPnL(trade.longShort, trade.entry, trade.exit, trade.amount);
		}
		onchange(trade);
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
		{#each trades as trade, i (i)}
			{@const isEditable = trade.status == 'created' || trade.status == 'open'}
			<tr style="border-bottom: 1px solid red" ondblclick={() => ondblclick(trade)}>
				<td>
					{#if isEditable}
						<select bind:value={trade.status} onchange={(e) => handleChangeStatus(trade)}>
							{#each status as value}
								<option {value}>{value}</option>
							{/each}
						</select>
					{:else}
						{trade.status}
					{/if}
				</td>
				<td>{new Date(trade.date).toLocaleString()}</td>
				<td>{trade.symbol}</td>
				<td>{trade.timeFrame}</td>
				<td>{trade.longShort}</td>
				<td>${trade.account}</td>
				<td>${trade.amount}</td>
				<td>${trade.entry}</td>
				<td>${trade.takeProfit}</td>
				<td>${trade.stopLoss}</td>
				<td>
					{#if trade.status == 'created' || trade.status == 'open'}
						<input bind:value={trade.exit} type="number" />
					{:else}
						${trade.exit}
					{/if}
				</td>
				<td>%{(trade.risk * 100).toFixed(2)}</td>
				<td>{trade.riskRewardRatio}</td>
				<td class={trade.pnl == 0 ? '' : trade.pnl < 0 ? 'bg-loss' : 'bg-win'}>${trade.pnl}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	tr:hover {
		font-weight: bold;
		cursor: pointer;
	}

	td {
		text-align: center;
		width: 1%;
		white-space: nowrap;
	}

	.bg-loss {
		font-weight: bold;
		background-color: rgb(121, 43, 43);
	}
	.bg-win {
		font-weight: bold;
		background-color: rgb(43, 116, 43);
	}

	input {
		width: 80px;
	}
</style>
