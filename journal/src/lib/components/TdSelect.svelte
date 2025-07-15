<script lang="ts">
	import {
		statuses,
		symbols,
		timeFrames,
		type Status,
		type Symbol,
		type TimeFrame
	} from '$lib/data/Trade';
	import type { HTMLTdAttributes } from 'svelte/elements';

	type Props = {
		value: Status | Symbol | TimeFrame | string;
		options: typeof statuses | typeof symbols | typeof timeFrames | string[];
		disabled?: boolean;
	} & HTMLTdAttributes;
	let { value = $bindable(), options = [], disabled = true, ...props }: Props = $props();
</script>

<td ondblclick={(e) => !disabled && e.stopPropagation()} {...props}>
	{#if disabled}
		{value}
	{:else}
		<select bind:value {disabled} tabindex="0">
			{#each options as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
	{/if}
</td>

<style>
	select:not(:focus) {
		border-color: transparent;
	}
</style>
