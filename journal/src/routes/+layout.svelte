<script>
	import { browser } from '$app/environment';
	import '../app.css';
	let { children } = $props();
</script>

{#if browser}
	<main>
		{@render children()}
	</main>
{/if}

<style>
</style>
