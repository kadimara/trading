<script lang="ts">
	import {
		getLongShort,
		getPnL,
		getRisk,
		getRiskRewardRatio,
		statuses,
		symbols,
		timeFrames,
		type Trade
	} from '$lib/data/Trade';
	import TradeCell from './TradeCell.svelte';

	type Props = {
		trade: Trade;
		onchange?: (trade: Trade) => void;
		ondblclick?: (trade: Trade) => void;
	};
	let { trade: tradeProp, onchange = () => {}, ondblclick = () => {} }: Props = $props();
	let trade = $state(tradeProp);
	$effect(() => {
		trade = tradeProp;
	});

	let disabled = $derived(trade.status == 'closed' || trade.status == 'canceled');

	const handleChange = () => {
		trade = {
			...trade,
			longShort: getLongShort(trade.entry, trade.stopLoss),
			risk: getRisk(trade.account, trade.amount, trade.entry, trade.stopLoss),
			riskRewardRatio: getRiskRewardRatio(trade.entry, trade.takeProfit, trade.stopLoss),
			pnl: getPnL(trade.longShort, trade.amount, trade.entry, trade.exit)
		};
		onchange($state.snapshot(trade));
	};
</script>

<tr
	class={trade.status}
	ondblclick={() => ondblclick($state.snapshot(trade))}
	onblur={handleChange}
	onchange={handleChange}
>
	<TradeCell type="select" bind:value={trade.status} options={statuses} disabled={false} />
	<TradeCell type="date" value={trade.date} />
	<TradeCell type="select" bind:value={trade.symbol} options={symbols} {disabled} />
	<TradeCell type="select" bind:value={trade.timeFrame} options={timeFrames} {disabled} />
	<TradeCell type="text" value={trade.longShort} />
	<TradeCell type="currency" bind:value={trade.account} {disabled} />
	<TradeCell type="currency" bind:value={trade.amount} {disabled} />
	<TradeCell type="currency" bind:value={trade.entry} {disabled} />
	<TradeCell type="currency" bind:value={trade.takeProfit} {disabled} />
	<TradeCell type="currency" bind:value={trade.stopLoss} {disabled} />
	<TradeCell type="currency" bind:value={trade.exit} {disabled} />
	<TradeCell type="text" value={'%' + (trade.risk * 100).toFixed(2)} />
	<TradeCell type="text" value={trade.riskRewardRatio} />
	<TradeCell
		type="currency"
		value={trade.pnl.toFixed(2)}
		color={trade.pnl == 0 ? '' : trade.pnl < 0 ? 'red' : 'green'}
	/>
</tr>

<style>
	tr:hover {
		font-weight: bold;
		cursor: pointer;
	}

	tr:nth-child(odd) {
		background: var(--accent-bg);
	}

	tr.canceled {
		opacity: 0.5;
	}
</style>
