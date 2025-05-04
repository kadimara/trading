<script lang="ts">
	import type { Exit } from '$lib/data/Trade';
	import type { HTMLTdAttributes } from 'svelte/elements';
	type CellEvent = Event & { currentTarget: EventTarget & HTMLTableCellElement };

	type Props = {
		exit: Exit | undefined;
		disabled?: boolean;
	} & HTMLTdAttributes;
	let { exit = $bindable(), disabled = true, ...props }: Props = $props();

	const value = $derived(exit ? exit.price + ' / ' + exit.amount : '');

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
		var price = Math.round(Number(parts[0])) || 0;
		var amount = Math.round(Number(parts[1])) || 0;
		if (price && amount) {
			exit = { price, amount };
		} else {
			exit = undefined;
		}

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
	class:exit
>
	{value}
</td>

<style>
	td[contenteditable='plaintext-only'] {
		cursor: text;
	}
	td.exit::before {
		content: '$';
	}
	/* td.exit::after {
		content: '%';
	} */
	td {
		text-align: end;
		white-space: nowrap;
	}
</style>
