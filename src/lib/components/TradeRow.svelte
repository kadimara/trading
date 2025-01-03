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
	let { trade, onchange = () => {}, ondblclick = () => {} }: Props = $props();
	let state = $state(trade);
	let disabled = $derived(state.status == 'closed' || state.status == 'canceled');

	const handleChange = () => {
		onchange({
			...state,
			longShort: getLongShort(state.entry, state.stopLoss),
			risk: getRisk(state.account, state.amount, state.entry, state.stopLoss),
			riskRewardRatio: getRiskRewardRatio(state.entry, state.takeProfit, state.stopLoss),
			pnl: getPnL(state.longShort, state.amount, state.entry, state.exit)
		});
	};
</script>

<tr class={state.status} ondblclick={() => ondblclick(state)} onchange={handleChange}>
	<TradeCell type="select" bind:value={state.status} options={statuses} disabled={false} />
	<TradeCell type="date" bind:value={state.date} {disabled} />
	<TradeCell type="select" bind:value={state.symbol} options={symbols} {disabled} />
	<TradeCell type="select" bind:value={state.timeFrame} options={timeFrames} {disabled} />
	<TradeCell type="text" value={state.longShort} />
	<TradeCell type="currency" bind:value={state.account} {disabled} />
	<TradeCell type="currency" bind:value={state.amount} {disabled} />
	<TradeCell type="currency" bind:value={state.entry} {disabled} />
	<TradeCell type="currency" bind:value={state.takeProfit} {disabled} />
	<TradeCell type="currency" bind:value={state.stopLoss} {disabled} />
	<TradeCell type="currency" bind:value={state.exit} {disabled} />
	<TradeCell type="text" value={'%' + (state.risk * 100).toFixed(2)} />
	<TradeCell type="text" value={state.riskRewardRatio} />
	<TradeCell type="currency" value={state.pnl} />
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
