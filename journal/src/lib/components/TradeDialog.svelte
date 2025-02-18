<script lang="ts">
	import { planTags, reflectionTags } from '$lib/data/Tags';
	import { type Trade } from '$lib/data/Trade';
	import { onMount } from 'svelte';
	import InputChart from './InputChart.svelte';
	import InputTags from './InputTags.svelte';

	let dialog = $state<HTMLDialogElement>();
	let trade = $state<Trade>();
	let trades = $state.raw<Trade[]>([]);

	let callback = $state((trade: Trade) => {});
	let disabled = $derived(trade == null || trade.status == 'closed' || trade.status == 'canceled');

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
		if (!disabled) {
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
	{#if trade}
		{#key trade?.date}
			<div class="flex-column gap-1">
				<InputTags
					bind:value={trade.plan}
					suggestions={planTags}
					placeholder="Plan of the trade"
					{disabled}
				/>
				<InputTags
					bind:value={trade.reflection}
					suggestions={reflectionTags}
					placeholder="Reflection of the trade"
					{disabled}
				/>
				<hr />
				<div class="flex-row gap-1 charts">
					<InputChart
						bind:value={trade.htfLink}
						placeholder="Higher time frame https://www.tradingview.com/x/HEUPOgtN/"
						{disabled}
					/>
					<hr class="vertical" />
					<InputChart
						bind:value={trade.link}
						placeholder="Link https://www.tradingview.com/x/HEUPOgtN/"
						{disabled}
					/>
				</div>
			</div>
		{/key}
	{/if}
</dialog>

<style>
	dialog {
		width: 100%;
		height: 100vh;
	}
	.flex-column {
		height: 100%;
	}
	.flex-row {
		height: 100%;
	}
</style>
