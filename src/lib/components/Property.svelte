<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		label: string;
		aside?: string;
		style?: string;
	};
	let { children, label, aside = '', style = '' }: Props = $props();
</script>

<label class="flex-column" {style}>
	<span class="label">
		{@html label.toUpperCase()}
	</span>
	{@render children?.()}
	<span class="aside">{@html aside}</span>
</label>

<style>
	span.label,
	span.aside {
		color: gray;
		font-size: 12px;
	}
	span.label {
		font-weight: bold;
	}
</style>
