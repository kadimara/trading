<script lang="ts">
	import { PAT } from '$env/static/private';
	import { Octokit } from 'octokit';
	import { onMount } from 'svelte';

	let input = $state('Test');

	const personalAccessToken = PAT;
	const octokit = new Octokit({
		auth: personalAccessToken
	});

	const owner = 'kadimara';
	const repo = 'trading-journal';
	const path = 'OUTPUT.md'; // This is the file you want to update

	async function getContent(format: string = 'sha') {
		// Check if the file exists and get the SHA for updating
		const { data } = await octokit.rest.repos.getContent({
			owner,
			repo,
			path
		});

		// Check if it's an array (directory) or a single file
		return Array.isArray(data) ? data[0] : data;
	}

	async function createOrUpdateFile() {
		// const encoder = new TextEncoder();
		// const encodedContent = encoder.encode(input);
		const base64Content = btoa(input);

		try {
			const file = await getContent();
			// Update the file
			if ('sha' in file) {
				await octokit.rest.repos.createOrUpdateFileContents({
					owner,
					repo,
					path,
					message: `This updated programatically (${input})!`,
					content: base64Content,
					sha: file.sha // This is the file's SHA (needed for updates)
				});
				console.log('File updated successfully!');
			}
		} catch (error) {
			console.error('Error updating file:', error);
		}
	}

	onMount(async () => {
		const { data } = await octokit.rest.repos.getContent({
			mediaType: { format: 'raw' },
			owner,
			repo,
			path
		});
		input = data as unknown as string;
		// const octokit = new Octokit({ auth: personalAccessToken });
		// const {
		// 	data: { login }
		// } = await octokit.rest.users.getAuthenticated();
		// console.log('Hello, %s', login);

		// const { data } = await octokit.rest.repos.getContent({
		// 	mediaType: {
		// 		format: 'raw'
		// 	},
		// 	owner: 'kadimara',
		// 	repo: 'trading-journal',
		// 	path: 'src/lib/data/trades.json'
		// });
		// // console.log('package name: %s', data.toString());
	});
</script>

<header class="flex-row align-items-center gap-2">
	<h1>Trading journal v5</h1>
</header>
<div>
	<input bind:value={input} />
	<button onclick={createOrUpdateFile}>Update git</button>
</div>

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
