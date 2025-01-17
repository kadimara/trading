<script lang="ts">
	import { type Trade } from '$lib/data/Trade';
	import { TradeUtils } from '$lib/utils/TradeUtils';
	import { onMount } from 'svelte';

	let dialog = $state<HTMLDialogElement>();
	let trade = $state<Trade>();
	let trades = $state.raw<Trade[]>([]);

	let editable = $derived(TradeUtils.isEditable(trade));

	let callback = $state((trade: Trade) => {});
	let disabled = $derived(trade == null || trade.status == 'closed' || trade.status == 'canceled');
	let imageSrc = $state('');

	$effect(() => {
		const results = trade?.report.match(/(?<=https:\/\/www.tradingview.com\/x\/)(.*)(?=\/)/g);
		const result = results?.[0];
		const char = result?.[0]?.toLowerCase();
		imageSrc = `https://s3.tradingview.com/snapshots/${char}/${result}.png`;
	});

	const handleClose = () => {
		callback(trade as Trade);
		dialog?.close();
	};

	export const show = (_trade: Trade, _trades: Trade[], _callback: (trade: Trade) => void) => {
		trade = _trade;
		trades = _trades;
		callback = _callback;
		dialog?.showModal();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (editable) {
			return;
		}
		if (e.code == 'ArrowLeft' || e.code == 'ArrowRight') {
			const index = trades.findIndex((t) => trade?.date == t.date);
			const increment = e.code == 'ArrowLeft' ? -1 : 1;
			const newIndex = Math.min(Math.max(index + increment, 0), trades.length - 1);
			trade = trades[newIndex];
		}
	};

	onMount(() => {
		dialog?.addEventListener('keydown', handleKeyDown);
	});
</script>

<dialog bind:this={dialog} onclose={handleClose}>
	<div class="flex-column gap-1">
		{#if trade}
			{#key trade?.date}
				{#if editable}
					<textarea bind:value={trade.note} placeholder="Describe how the trade went" {disabled}
					></textarea>
					<input
						bind:value={trade.report}
						placeholder="https://www.tradingview.com/x/HEUPOgtN/"
						{disabled}
					/>
				{:else}
					<p>{trade.note}</p>
					<a href={trade.report} target="_blank">https://www.tradingview.com/x/HEUPOgtN/</a>
				{/if}
				<img src={imageSrc} alt="Chart" />
			{/key}
		{/if}
	</div>
</dialog>

<style>
	dialog {
		width: 90%;
		min-height: 60%;
	}
	img {
		border: 1px solid var(--color-border);
	}
</style>
