<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	type FocusCellEvent = FocusEvent & { currentTarget: EventTarget & HTMLTableCellElement };

	export type TdInputProps = {
		value: number | string;
		disabled?: boolean;
	} & HTMLTdAttributes;
	let { value = $bindable(''), disabled = true, ...props }: TdInputProps = $props();
	let innerText = $state(String(value));

	const handleFocus = (e: FocusCellEvent) => {
		const element = e.currentTarget;
		const range = document.createRange();
		range.selectNodeContents(element);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};

	const handleBlur = (e: FocusCellEvent) => {
		const innerText = e.currentTarget.innerText.trim();
		if (typeof value === 'number') {
			value = Number(innerText);
		} else if (typeof value == 'string') {
			value = innerText;
		}
		// Dispatch the event
		const changeEvent = new Event('change', { bubbles: true });
		e.currentTarget.dispatchEvent(changeEvent);
	};
</script>

{#if disabled}
	<td contenteditable={false} {...props}>
		{value}
	</td>
{:else}
	<td
		contenteditable="plaintext-only"
		onfocus={handleFocus}
		onblur={handleBlur}
		ondblclick={(e) => !disabled && e.stopPropagation()}
		{...props}
		bind:innerText
	>
	</td>
{/if}

<style>
	td[contenteditable='plaintext-only'] {
		cursor: text;
	}
	td:not(:empty)[contenteditable='false']::before {
		content: '$';
	}
	td {
		text-align: end;
	}
</style>
