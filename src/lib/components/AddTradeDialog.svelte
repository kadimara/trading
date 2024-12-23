<script lang="ts">
	import { createTrade, getPnL, type Trade } from '$lib/data/Trade';
	import Property from './Property.svelte';

	let dialog = $state<HTMLDialogElement>();
	let confirmCallback = $state<(trade: Trade) => void>();

	let note = $state('');
	let account = $state(100);
	let amount = $state(0);
	let entry = $state(0);
	let takeProfit = $state(0);
	let stopLoss = $state(0);

	let trade = $derived(
		createTrade(note, account, amount, entry, takeProfit, stopLoss, 'btc', '3min')
	);

	let loss = $derived(getPnL(trade.longShort, trade.entry, trade.stopLoss, trade.amount));
	let profit = $derived(getPnL(trade.longShort, trade.entry, trade.takeProfit, trade.amount));

	const handlePaste = (e: ClipboardEvent) => {
		const paste = e.clipboardData?.getData('text') as string;
		const values = paste.split('\r\n');
		if (values.length == 4) {
			amount = Number(values[0]);
			entry = Number(values[1]);
			takeProfit = Number(values[2]);
			stopLoss = Number(values[3]);
		}
	};

	const handleAdd = () => {
		if (trade == null || typeof confirmCallback != 'function') {
			return;
		}

		confirmCallback(trade);
		dialog?.close();
	};

	const validate = () => {
		const inBetween =
			(trade.stopLoss < trade.entry && trade.entry < trade.takeProfit) ||
			(trade.takeProfit < trade.entry && trade.entry < trade.stopLoss);

		return inBetween && note != '';
	};

	export const confirm = (callback: (trade: Trade) => void) => {
		confirmCallback = callback;
		dialog?.showModal();
	};
</script>

<dialog bind:this={dialog} onclose={() => dialog?.close()} onpaste={handlePaste}>
	<h1>Add trade</h1>
	<div class="flex-column gap-1">
		<Property label="acount">
			<input type="number" step="1" bind:value={account} />
		</Property>
		<Property label="amount">
			<input type="number" step="10" bind:value={amount} />
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
		<Property label="Note">
			<textarea bind:value={note} placeholder="Reason for the trade..."></textarea>
		</Property>
	</div>
	<footer class="flex-row gap-2 justify-content-end">
		<button onclick={() => dialog?.close()}>Cancel</button>
		<button disabled={!validate()} onclick={handleAdd}>Add</button>
	</footer>
</dialog>

<style>
	dialog {
		min-width: 480px;
	}
</style>
