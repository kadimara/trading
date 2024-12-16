<script lang="ts">
	import { getPnL, type Trade } from '$lib/data/Trade';
	import { onMount } from 'svelte';
	import Property from './Property.svelte';
	type Props = {
		trade: Trade;
		onexit: (trade: Trade) => void;
	};
	let { trade, onexit }: Props = $props();
	let dialog = $state<HTMLDialogElement>();

	let amount = $state(trade.amount);
	let exit = $state(trade.entry);
	let pnl = $derived(getPnL(trade.longShort, trade.entry, exit, amount));

	let reportLink = $state('');
	let reportNote = $state('');
	let dateEntry = $state();
	let dateExit = $state();
	// let analyzeNote = $state('');
	// let account = $state(100);
	// let entry = $state(0);
	// let takeProfit = $state(0);
	// let stopLoss = $state(0);

	// let loss = $derived(getPnL(trade.longShort, trade.entry, trade.stopLoss, trade.amount));
	// let profit = $derived(getPnL(trade.longShort, trade.entry, trade.takeProfit, trade.amount));

	// const handleAdd = () => {
	// 	dialog.close();
	// 	onadd(trade);
	// };
	const handleExit = () => {};

	const handleDateExitInput = () => {
		// const date = new Date(e.target.value);
		// const timestamp = date.valueOf();
		// const date = new Date(dateEntry);
		// const timestamp = date.valueOf();
		onexit({ ...trade });
	};

	// const validate = () => {
	// 	const isTradingViewLink = analyzeLink.includes('https://www.tradingview.com/');
	// 	const inBetween =
	// 		(trade.stopLoss < trade.entry && trade.entry < trade.takeProfit) ||
	// 		(trade.takeProfit < trade.entry && trade.entry < trade.stopLoss);

	// 	return isTradingViewLink && analyzeNote != '' && inBetween;
	// };

	onMount(() => {
		dialog?.showModal();
	});
</script>

<dialog bind:this={dialog} onclose={() => dialog?.close()}>
	<h1>Exit</h1>
	<div class="grid">
		<Property label="Amount">
			<input bind:value={amount} type="number" min="0" max={trade?.amount} />
		</Property>
		<Property label="Exit">
			<input bind:value={exit} type="number" />
		</Property>
		<Property label="Date entry">
			<input bind:value={dateEntry} disabled={amount != trade.amount} />
		</Property>
		<Property label="Date exit">
			<input bind:value={dateExit} disabled={amount != trade.amount} />
		</Property>
		<Property label="Report" style="grid-column: 1 / span 2;">
			<input bind:value={reportLink} disabled={amount != trade.amount} />
		</Property>
		<Property label="Note" style="grid-column: 1 / span 2;">
			<textarea bind:value={reportNote} disabled={amount != trade.amount}></textarea>
		</Property>
		<!-- <Property label="Analyze" style="grid-column: 1 / span 2;">
			<input bind:value={analyzeLink} />
		</Property>
		<Property label="Note" style="grid-column: 1 / span 2;">
			<textarea bind:value={analyzeNote}></textarea>
		</Property>
		<Property label="acount">
			<input type="number" step="10" bind:value={account} />
		</Property>
		<Property label="entry">
			<input type="number" bind:value={entry} />
		</Property>
		<Property
			label="Take profit"
			aside="Estimated profit <span style='color: limegreen'>{profit} USD</span>"
		>
			<input type="number" bind:value={takeProfit} />
		</Property>
		<Property
			label="stop loss"
			aside="Estimated loss <span style='color: orangered'>{loss} USD</span>"
		>
			<input type="number" bind:value={stopLoss} />
		</Property>
		<div class="flex-column gap-2 notice" style="grid-row: 3 / span 4;">
			<Property label="type">
				{trade.longShort.toUpperCase()}
			</Property>
			<Property label="risk">
				%{(trade.risk * 100).toFixed(2)}
			</Property>
			<Property label="risk reward">
				{trade.riskRewardRatio}
			</Property>
			<Property label="entry amount">
				{trade.amount} USD
			</Property>
		</div> -->
	</div>
	<footer class="flex-row gap-2 justify-content-end align-items-center">
		<span style="color: {pnl < 0 ? 'orangered' : 'limegreen'}">{pnl} USD</span>
		<button onclick={() => dialog?.close()}>Cancel</button>
		<button disabled onclick={handleExit}>Exit</button>
	</footer>
</dialog>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		/* grid-template-rows: auto auto auto auto auto auto; */

		row-gap: 8px;
		column-gap: 32px;
	}
</style>
