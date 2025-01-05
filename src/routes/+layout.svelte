<script>
	import { browser } from '$app/environment';
	import '../app.css';
	let { children } = $props();
</script>

{#if browser}
	<main class="flex-column gap-2 align-items-start">
		{@render children()}
	</main>
{/if}

<style>
	main {
		height: 100%;
	}
</style>
