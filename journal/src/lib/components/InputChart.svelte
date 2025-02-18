<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = {} & HTMLInputAttributes;
	let { value = $bindable(), disabled, ...props }: Props = $props();

	let imageSrc = $derived.by(() => {
		if (!value) {
			return '';
		}
		const results = value.match(/(?<=https:\/\/www.tradingview.com\/x\/)(.*)(?=\/)/g);
		const result = results?.[0];
		const char = result?.[0]?.toLowerCase();
		return `https://s3.tradingview.com/snapshots/${char}/${result}.png`;
	});
</script>

<div class="flex-column gap-1">
	{#if disabled}
		<a href={value} target="_blank">{value}</a>
	{:else}
		<input bind:value placeholder="https://www.tradingview.com/x/HEUPOgtN/" {disabled} {...props} />
	{/if}
	<img tabindex="-1" src={imageSrc} alt="Chart" />
</div>

<style>
	div {
		width: 100%;
	}
	img {
		border: 1px solid var(--color-border);
		height: auto;
		cursor: zoom-in;
	}
	img:focus {
		place-self: anchor-center;
		position: absolute;
		width: 80%;
		max-height: 80%;
	}
</style>
