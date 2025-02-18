<script lang="ts">
	import { XIcon } from 'svelte-feather-icons';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = { suggestions?: string[] } & HTMLInputAttributes;

	let { value = $bindable(), suggestions, disabled, ...props }: Props = $props();

	let inputElement: HTMLInputElement | undefined = $state();
	let inputValue = $state('');
	let tags: string[] = $derived.by(() => {
		if (typeof value == 'string') {
			return (value.split('.') || [])?.map((val) => val.trim())?.filter((val) => val !== '');
		}
		return [];
	});

	let suggestionsFiltered = $derived.by(() => {
		if (inputValue) {
			return suggestions?.filter((suggestion) =>
				suggestion.toLowerCase().includes(inputValue.toLowerCase())
			);
		}
		return [];
	});

	const addTag = (tag: string) => {
		value = [...tags, tag].join('. ');
		inputValue = '';
	};
	const removeTag = (index: number) => {
		value = tags.toSpliced(index, 1).join('. ');
		inputValue = '';
	};
	const handleKeyup = (e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.key == 'Enter') {
			addTag(suggestionsFiltered?.length == 1 ? suggestionsFiltered[0] : inputValue);
		}
	};
</script>

{#if !disabled}
	<div>
		<input
			bind:this={inputElement}
			bind:value={inputValue}
			type="text"
			onkeyup={handleKeyup}
			{...props}
		/>
		{#if suggestionsFiltered}
			<div class="suggestions">
				{#each suggestionsFiltered as suggestion}
					<button onpointerdown={() => addTag(suggestion)}>{suggestion}</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<div class="flex-row flex-wrap gap-1">
	{#each tags as tag, index}
		<div class="tag">
			{tag}
			{#if !disabled}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<span class="icon" onclick={() => removeTag(index)}>
					<XIcon />
				</span>
			{/if}
		</div>
	{/each}
	{#if inputValue}
		<div class="tag">
			{inputValue}
		</div>
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

	.suggestions {
		display: none;
		position: absolute;
		flex-direction: column;
		border-radius: var(--border-radius);
		overflow: hidden;
	}
	.suggestions > * {
		padding: 0.2rem 0.5rem;
		border-radius: unset;
		text-align: left;
	}

	input:focus + .suggestions {
		display: flex;
	}

	input {
		width: 100%;
	}

	.icon:hover {
		color: var(--color-text-highlight);
	}
</style>
