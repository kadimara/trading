<script lang="ts">
	import { type Trade } from '$lib/data/Trade';
	import Property from './Property.svelte';

	let dialog = $state<HTMLDialogElement>();
	let confirmCallback = $state<(trade: Trade) => void>();
	let trade = $state<Trade>();

	let report = $state<string>('');
	let note = $state<string>('');

	const handleUpdate = () => {
		if (trade != null && typeof confirmCallback == 'function') {
			confirmCallback({ ...trade, report: report, note: note });
			dialog?.close();
		}
	};

	export const confirm = (value: Trade, callback: (trade: Trade) => void) => {
		trade = value;
		report = trade?.report;
		note = trade?.note;
		confirmCallback = callback;
		dialog?.showModal();
	};
</script>

<dialog bind:this={dialog} onclose={() => dialog?.close()}>
	<h1>Update trade</h1>
	<div class="flex-column gap-1">
		<Property label="report">
			<input bind:value={report} />
		</Property>
		<Property label="Note">
			<textarea bind:value={note} placeholder="Reason for the trade..."></textarea>
		</Property>
	</div>
	<footer class="flex-row gap-2 justify-content-end">
		<button onclick={() => dialog?.close()}>Cancel</button>
		<button onclick={handleUpdate}>Update</button>
	</footer>
</dialog>

<style>
	dialog {
		min-width: 480px;
	}
</style>
