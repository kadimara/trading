<script>
	import '../app.css';
	let { children } = $props();
</script>

<main class="flex-column gap-2 align-items-start">
	{@render children()}
</main>

<style>
	main {
		height: 100%;
	}
</style>
