<script lang="ts">
	import { statuses, symbols, timeFrames, type Trade } from '$lib/data/Trade';
	import { TradeUtils } from '$lib/utils/TradeUtils';
	import TdExit from './TdExit.svelte';
	import TdInput from './TdInput.svelte';
	import TdSelect from './TdSelect.svelte';

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
			longShort: TradeUtils.getLongShort(trade.entry, trade.stopLoss),
			risk: TradeUtils.getRisk(trade.account, trade.amount, trade.entry, trade.stopLoss),
			pnl: TradeUtils.getPnL(trade)
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
	<TdSelect bind:value={trade.status} options={statuses} disabled={false} />
	<td
		>{new Date(Number(trade.date)).toLocaleString('en-GB', {
			timeZone: 'UTC',
			dateStyle: 'short',
			timeStyle: 'short'
		})}</td
	>
	<TdSelect bind:value={trade.symbol} options={symbols} {disabled} />
	<TdSelect bind:value={trade.timeFrame} options={timeFrames} {disabled} />
	<td class={trade.longShort}>{trade.longShort}</td>
	<TdInput bind:value={trade.account} {disabled} />
	<TdInput bind:value={trade.amount} {disabled} />
	<TdInput bind:value={trade.entry} {disabled} />
	<TdInput bind:value={trade.stopLoss} {disabled} />
	<TdExit bind:exit={trade.exit1} {disabled} />
	<TdExit bind:exit={trade.exit2} {disabled} />
	<td>{'%' + (trade.risk * 100).toFixed(2)}</td>
	<td class="pnl{Math.sign(trade.pnl)}" title={((100 / trade.account) * trade.pnl).toFixed(2) + '%'}
		>${trade.pnl.toFixed(2)}</td
	>
</tr>

<style>
	tr {
		cursor: pointer;
		white-space: nowrap;
	}
	tr.canceled {
		opacity: 0.5;
	}
</style>
