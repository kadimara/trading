<script lang="ts">
	import { type Trade } from '$lib/data/Trade';

	let dialog = $state<HTMLDialogElement>();
	let trade = $state<Trade>();
	let callback = $state((trade: Trade) => {});
	let disabled = $derived(trade == null || trade.status == 'closed' || trade.status == 'canceled');
	let imageSrc = $state('');

	$effect(() => {
		const results = trade?.report.match(/(?<=https:\/\/www.tradingview.com\/x\/)(.*)(?=\/)/g);
		const result = results?.[0];
		const char = result?.[0]?.toLowerCase();
		imageSrc = `https://s3.tradingview.com/snapshots/${char}/${result}.png`;
	});

	// let imageSrc = $derived();
	const handleClose = () => {
		callback(trade as Trade);
		dialog?.close();
	};

	export const show = (_trade: Trade, _callback: (trade: Trade) => void) => {
		trade = _trade;
		callback = _callback;
		dialog?.showModal();
	};
</script>

<dialog bind:this={dialog} onclose={handleClose}>
	<div class="flex-column gap-1">
		{#if trade}
			{#key trade?.date}
				<textarea bind:value={trade.note} placeholder="Describe how the trade went" {disabled}
				></textarea>
				<input
					bind:value={trade.report}
					placeholder="https://www.tradingview.com/x/HEUPOgtN/"
					{disabled}
				/>
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
