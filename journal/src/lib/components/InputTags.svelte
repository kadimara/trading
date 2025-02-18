<script lang="ts">
	import { XIcon } from 'svelte-feather-icons';
	import type { HTMLInputAttributes, KeyboardEventHandler } from 'svelte/elements';

	type Props = {} & HTMLInputAttributes;

	let { value = $bindable(), disabled, ...props }: Props = $props();

	let inputValue = $state('');
	let tags: string[] = $derived.by(() => {
		if (typeof value == 'string') {
			return (value.split('.') || [])?.map((val) => val.trim())?.filter((val) => val !== '');
		}
		return [];
	});

	const handleKeyup = (e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.key == 'Enter') {
			value = [...tags, inputValue].join('. ');
			inputValue = '';
		}
	};

	const handleRemoveTag = (index: number) => {
		value = tags.toSpliced(index, 1).join('. ');
		inputValue = '';
	};
</script>

{#if !disabled}
	<input type="text" bind:value={inputValue} onkeyup={handleKeyup} {...props} />
{/if}

<div class="flex-row flex-wrap gap-1">
	{#each tags as tag, index}
		<span class="tag">
			{tag}
			{#if !disabled}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<span class="icon" onclick={() => handleRemoveTag(index)}>
					<XIcon />
				</span>
			{/if}
		</span>
	{/each}
	{#if inputValue}
		<span class="tag">
			{inputValue}
		</span>
	{/if}
</div>

<style>
	.tag {
		display: inline-flex;
		align-items: center;

		background-color: var(--color-bg-highlight);
		border-radius: var(--border-radius);
		padding: 0.2rem 0.5rem;
	}

	.icon:hover {
		color: var(--color-text-highlight);
	}
</style>
