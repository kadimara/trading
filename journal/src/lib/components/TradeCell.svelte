<script lang="ts">
	import { statuses, symbols, timeFrames } from '$lib/data/Trade';
	import type { HTMLTdAttributes } from 'svelte/elements';
	type CellEvent = Event & { currentTarget: EventTarget & HTMLTableCellElement };
	type Props = {
		value: unknown;
		type: 'text' | 'currency' | 'date' | 'select';
		disabled?: boolean;
		options?: typeof statuses | typeof symbols | typeof timeFrames | string[];
		color?: 'red' | 'green' | '';
	} & HTMLTdAttributes;

	let {
		value = $bindable(),
		type,
		disabled = true,
		options = [],
		color = '',
		...props
	}: Props = $props();

	const handleFocus = (e: CellEvent) => {
		const element = e.currentTarget;
		const range = document.createRange();
		range.selectNodeContents(element);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};
	const handleBlur = (e: CellEvent) => {
		switch (type) {
			case 'text':
				value = e.currentTarget.innerText;
				break;
			case 'currency':
				value = Number(e.currentTarget.innerText);
				break;
			case 'date':
				value = new Date(e.currentTarget.innerText).valueOf();
				break;
		}
		// Create a new 'change' event
		const changeEvent = new Event('change', { bubbles: true });
		// Dispatch the event
		e.currentTarget.dispatchEvent(changeEvent);
	};
</script>

<td
	contenteditable={disabled || type == 'select' ? false : 'plaintext-only'}
	class={`${type}	${color}`}
	onfocus={handleFocus}
	onblur={handleBlur}
	ondblclick={(e) => !disabled && e.stopPropagation()}
	{...props}
>
	{#if type == 'text' || type == 'currency'}
		{value}
	{:else if type == 'date'}
		{new Date(Number(value)).toLocaleString('en-GB', { timeZone: 'UTC' })}
	{:else if type == 'select'}
		{#if disabled}
			{value}
		{:else}
			<select bind:value {disabled}>
				{#each options as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		{/if}
	{/if}
</td>

<style>
	td {
		text-align: center;
	}
	td[contenteditable='plaintext-only'] {
		cursor: text;
	}
	td.currency::before {
		content: '$';
	}
	td.currency {
		text-align: end;
	}

	select {
		border: none;
	}

	.red {
		color: rgb(242, 54, 69);
	}
	.green {
		color: rgb(8, 153, 129);
	}
</style>
