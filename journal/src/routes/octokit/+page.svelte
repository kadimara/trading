<script lang="ts">
	import { personalAccessToken } from '$lib/spells/LocalStorage.svelte';
</script>

<header class="flex-row align-items-center gap-2">
	<h1>Welcome {'user?.login'}</h1>
</header>
<div>
	<input bind:value={personalAccessToken.value} />
</div>
<div></div>

<style>
	header {
		align-self: stretch;
		justify-content: space-between;
		margin-top: 16px;
	}

	* {
		padding: 0px 16px;
	}
</style>
