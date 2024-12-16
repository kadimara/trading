<script lang="ts">
	import { createTrade, getPnL, type Trade } from '$lib/data/Trade';
	import Property from './Property.svelte';
	type Props = {
		dialog: HTMLDialogElement | undefined;
		onadd: (trade: Trade) => void;
	};
	let { dialog = $bindable(), onadd }: Props = $props();

	let analyzeLink = $state('');
	let analyzeNote = $state('');
	let account = $state(100);
	let entry = $state(0);
	let takeProfit = $state(0);
	let stopLoss = $state(0);

	let trade = $derived(
		createTrade(
			{ chart: analyzeLink, note: analyzeNote },
			account,
			entry,
			takeProfit,
			stopLoss,
			'btc',
			'3min'
		)
	);

	let loss = $derived(getPnL(trade.longShort, trade.entry, trade.stopLoss, trade.amount));
	let profit = $derived(getPnL(trade.longShort, trade.entry, trade.takeProfit, trade.amount));

	const handleAdd = () => {
		dialog?.close();
		onadd(trade);
	};

	const validate = () => {
		const isTradingViewLink = analyzeLink.includes('https://www.tradingview.com/');
		const inBetween =
			(trade.stopLoss < trade.entry && trade.entry < trade.takeProfit) ||
			(trade.takeProfit < trade.entry && trade.entry < trade.stopLoss);

		return isTradingViewLink && analyzeNote != '' && inBetween;
	};
</script>

<dialog bind:this={dialog} onclose={() => dialog?.close()}>
	<h1>Add trade</h1>
	<div class="grid">
		<Property label="Analyze" style="grid-column: 1 / span 2;">
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
		</div>
	</div>
	<footer class="flex-row gap-2 justify-content-end">
		<button onclick={() => dialog?.close()}>Cancel</button>
		<button disabled={!validate()} onclick={handleAdd}>Add</button>
	</footer>
</dialog>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto auto auto auto auto;
		grid-auto-flow: column;

		row-gap: 8px;
		column-gap: 32px;
	}
</style>
