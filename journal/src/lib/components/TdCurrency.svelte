<script lang="ts">
	import { statuses, symbols, timeFrames } from '$lib/data/Trade';
	import type { HTMLTdAttributes } from 'svelte/elements';
	type CellEvent = Event & { currentTarget: EventTarget & HTMLTableCellElement };
	type Props = {
		value: number;
		disabled?: boolean;
	} & HTMLTdAttributes;

	let { value = $bindable(), disabled = true, ...props }: Props = $props();

	const handleFocus = (e: CellEvent) => {
		const element = e.currentTarget;
		const range = document.createRange();
		range.selectNodeContents(element);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};
	const handleBlur = (e: CellEvent) => {
		value = Number(e.currentTarget.innerText);
		// Create a new 'change' event
		const changeEvent = new Event('change', { bubbles: true });
		// Dispatch the event
		e.currentTarget.dispatchEvent(changeEvent);
	};
</script>

<td
	contenteditable={disabled ? false : 'plaintext-only'}
	onfocus={handleFocus}
	onblur={handleBlur}
	ondblclick={(e) => !disabled && e.stopPropagation()}
	{...props}
>
	{#if disabled}
		${Math.round(value)}
	{:else}
		{Math.round(value)}
	{/if}
</td>

<style>
	td[contenteditable='plaintext-only'] {
		cursor: text;
	}
</style>
