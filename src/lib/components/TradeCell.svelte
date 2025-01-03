<script lang="ts">
	import { statuses, symbols, timeFrames } from '$lib/data/Trade';

	type Props = {
		value: unknown;
		type: 'text' | 'currency' | 'date' | 'select';
		disabled?: boolean;
		options?: typeof statuses | typeof symbols | typeof timeFrames | string[];
	};
	let { value = $bindable(), type, disabled = true, options = [] }: Props = $props();

	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLTableCellElement }) => {
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
	};
</script>

<td
	contenteditable={disabled || type == 'select' ? false : 'plaintext-only'}
	class={type}
	onblur={handleInput}
	ondblclick={(e) => !disabled && e.stopPropagation()}
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
		cursor: pointer;
		background: inherit;
		border: none;
		outline: none;
	}
	select option {
		cursor: pointer;
		background: var(--bg);
	}
</style>
