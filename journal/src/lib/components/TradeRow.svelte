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

	let disabled = $derived(
		trade.status == 'reflecting' || trade.status == 'closed' || trade.status == 'canceled'
	);

	const handleChange = () => {
		const pnl1 = getPnL(trade.longShort, trade.amount / 2, trade.entry, trade.exit);
		const pnl2 = getPnL(
			trade.longShort,
			trade.amount / 2,
			trade.entry,
			trade.takeProfitHalf || trade.exit
		);
		trade = {
			...trade,
			longShort: getLongShort(trade.entry, trade.stopLoss),
			risk: getRisk(trade.account, trade.amount, trade.entry, trade.stopLoss),
			riskRewardRatio: getRiskRewardRatio(trade.entry, trade.takeProfit, trade.stopLoss),
			pnl: pnl1 + pnl2
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
	<TradeCell
		type="text"
		value={trade.longShort}
		color={trade.longShort == 'short' ? 'red' : 'green'}
	/>
	<TradeCell type="currency" bind:value={trade.account} {disabled} />
	<TradeCell type="currency" bind:value={trade.amount} {disabled} />
	<TradeCell type="currency" bind:value={trade.entry} {disabled} />
	<TradeCell type="currency" bind:value={trade.takeProfit} {disabled} />
	<TradeCell type="currency" bind:value={trade.stopLoss} {disabled} />
	<TradeCell type="currency" bind:value={trade.takeProfitHalf} {disabled} />
	<TradeCell type="currency" bind:value={trade.exit} {disabled} />
	<TradeCell type="text" value={'%' + (trade.risk * 100).toFixed(2)} />
	<TradeCell
		type="currency"
		value={trade.pnl.toFixed(2)}
		color={trade.pnl == 0 ? '' : trade.pnl < 0 ? 'red' : 'green'}
		title={((100 / trade.account) * trade.pnl).toFixed(2) + '%'}
	/>
</tr>

<style>
	tr {
		cursor: pointer;
	}
	tr.canceled {
		opacity: 0.5;
	}
</style>
