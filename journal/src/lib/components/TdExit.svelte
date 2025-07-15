<script lang="ts">
	import { fees, type Exit, type Fee } from '$lib/data/Trade';
	import { TradeUtils } from '$lib/utils/TradeUtils';
	import { SquareIcon, XSquareIcon } from 'svelte-feather-icons';
	import type { HTMLTdAttributes } from 'svelte/elements';
	import TdInput from './TdInput.svelte';
	import { handleKeydownToClick } from '$lib/utils/Handlers';

	type CellEvent = Event & { currentTarget: EventTarget & HTMLTableCellElement };

	type Props = {
		exit: Exit | undefined;
		disabled?: boolean;
	} & HTMLTdAttributes;
	let { exit = $bindable(), disabled = true, ...props }: Props = $props();

	let fee = $derived(exit ? TradeUtils.round(fees[exit.type] * (exit.amount || 0), 2) : 0);
	let value = $derived(exit ? `${Math.round(exit.amount)} / ${Math.round(exit.price)}` : '');

	const dispatchChangeEvent = (e: CellEvent) => {
		// Create a new 'change' event
		const changeEvent = new Event('change', { bubbles: true });
		// Dispatch the event
		e.currentTarget.dispatchEvent(changeEvent);
	};

	const handleFees = (e: CellEvent) => {
		if (disabled || !exit) return;

		exit = {
			...exit,
			type: exit.type === 'maker' ? 'taker' : 'maker'
		};
		dispatchChangeEvent(e);
	};

	const handleChange = (e: CellEvent) => {
		const innerText = e.currentTarget.innerText.trim();
		var parts = innerText.split('/');
		var amount = Math.round(Number(parts[0])) || 0;
		var price = Math.round(Number(parts[1])) || 0;
		if (price || amount) {
			exit = { price, amount, type: exit?.type || 'maker' };
		} else {
			exit = undefined;
		}
	};
</script>

<TdInput {value} onchange={handleChange} {disabled} {...props} />
<td
	class="fees"
	title={`${exit?.type}: ${fee} `}
	aria-label="Toggle fees type"
	tabindex="0"
	onclick={handleFees}
	onkeydown={handleKeydownToClick}
	ondblclick={(e) => !disabled && e.stopPropagation()}
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
	td.fees {
		padding-left: 0;
	}
</style>
