<script lang="ts">
	import { type Trade } from '$lib/data/Trade';

	let dialog = $state<HTMLDialogElement>();
	let trade = $state<Trade>();
	let imageSrc = $state<string>('');

	export const show = (value: Trade) => {
		trade = value;
		const values = trade.report.split('/').filter((value) => value != '');
		const imageId = values ? values[values.length - 1] : '';
		imageSrc = `https://s3.tradingview.com/snapshots/c/${imageId}.png`;
		console.log(imageSrc, imageId, values, trade?.report);

		dialog?.showModal();
	};

	$effect(() => {
		console.log(trade);
	});
</script>

<dialog bind:this={dialog} onclose={() => dialog?.close()}>
	<div class="flex-column gap-1 flexible">
		{#key trade?.date}
			<img src={imageSrc} alt="Chart" />
		{/key}
	</div>
	<footer class="flex-row gap-2 justify-content-end">
		<button onclick={() => dialog?.close()}>Close</button>
	</footer>
</dialog>

<style>
	dialog {
		width: 80%;
		height: 80%;
	}
</style>
