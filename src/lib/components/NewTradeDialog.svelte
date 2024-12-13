<script lang="ts">
	import { createTrade, getPnL, isValid, type Trade } from '$lib/data/Trade';
	import Property from './Property.svelte';

	let {
		onclose = (trade: Trade) => {
			return null;
		}
	} = $props();

	let analyze = $state('');
	let account = $state(100);
	let entry = $state(0);
	let takeProfit = $state(0);
	let stopLoss = $state(0);

	let trade = $derived(createTrade(analyze, account, entry, takeProfit, stopLoss, 'btc', '3min'));

	let loss = $derived(getPnL(trade.longShort, trade.entry, trade.stopLoss, trade.amount));
	let profit = $derived(getPnL(trade.longShort, trade.entry, trade.takeProfit, trade.amount));
</script>

<dialog class="flex-column gap-2">
	<h1>Add trade</h1>
	<div class="grid">
		<Property label="Analyze" style="grid-column: 1 / span 2;">
			<input bind:value={analyze} />
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
		<div class="flex-column gap-2 notice" style="grid-row: 2 / span 4;">
			<Property label="type">
				{trade.longShort.toUpperCase()}
			</Property>
			<Property label="risk">
				%{(trade.risk * 100).toFixed(2)}
			</Property>
			<Property label="entry amount">
				{trade.amount} USD
			</Property>
		</div>
	</div>
	<div class="flex-row gap-2 align-self-end">
		<button onclick={() => onclose(null)}>Cancel</button>
		<button disabled={!isValid(trade)} onclick={() => onclose(trade)}>Add</button>
	</div>
</dialog>

<style>
	dialog {
		top: 100px;
	}

	h1 {
		margin: 0;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto auto auto auto;
		grid-auto-flow: column;

		row-gap: 8px;
		column-gap: 32px;
	}

	input {
		margin: 0;
	}
</style>
