<script lang="ts">
	import { fees, type Exit, type Fee } from '$lib/data/Trade';
	import { TradeUtils } from '$lib/utils/TradeUtils';
	import { SquareIcon, XSquareIcon } from 'svelte-feather-icons';
	import type { HTMLTdAttributes } from 'svelte/elements';

	type CellEvent = Event & { currentTarget: EventTarget & HTMLTableCellElement };

	type Props = {
		exit: Exit | undefined;
		disabled?: boolean;
	} & HTMLTdAttributes;
	let { exit = $bindable(), disabled = true, ...props }: Props = $props();
	let fee = $derived(exit ? TradeUtils.round(fees[exit.type] * (exit.amount || 0), 2) : 0);

	const dispatchChangeEvent = (e: CellEvent) => {
		// Create a new 'change' event
		const changeEvent = new Event('change', { bubbles: true });
		// Dispatch the event
		e.currentTarget.dispatchEvent(changeEvent);
	};

	const handleFocus = (e: CellEvent) => {
		const element = e.currentTarget;
		const range = document.createRange();
		range.selectNodeContents(element);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};

	const handleBlur = (e: CellEvent) => {
		var parts = e.currentTarget.innerText.split('/');
		var amount = Math.round(Number(parts[0])) || 0;
		var price = Math.round(Number(parts[1])) || 0;
		if (price || amount) {
			exit = { ...exit, price, amount, type: 'maker' };
		} else {
			exit = undefined;
		}

		dispatchChangeEvent(e);
	};

	const handleFees = (e: CellEvent) => {
		if (disabled || !exit) return;

		exit = {
			...exit,
			type: exit.type === 'maker' ? 'taker' : 'maker'
		};
		dispatchChangeEvent(e);
	};
</script>

<td
	contenteditable={disabled ? false : 'plaintext-only'}
	onfocus={handleFocus}
	onblur={handleBlur}
	ondblclick={(e) => !disabled && e.stopPropagation()}
	{...props}
	class="input"
>
	{#if exit}
		{#if disabled}
			${exit.amount} / ${exit.price}
		{:else}
			{exit.amount} / {exit.price}
		{/if}
	{/if}
</td>
<td
	class="fees"
	onclick={handleFees}
	ondblclick={(e) => !disabled && e.stopPropagation()}
	title={`${exit?.type}: ${fee} `}
>
	{#if exit}
		{#if exit?.type === 'taker'}
			<XSquareIcon size="0.9x" />
		{:else}
			<SquareIcon size="0.9x" />
		{/if}
	{/if}
</td>

<style>
	td[contenteditable='plaintext-only'] {
		cursor: text;
	}

	td {
		text-align: end;
		white-space: nowrap;
	}

	/* td:not(.fees) {
		padding-right: 0;
	} */
	td.fees {
		padding-left: 0;
	}
</style>
