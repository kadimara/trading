import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// options
			pages: 'build', // Where to output static files
			assets: 'build', // Where to output static assets
			fallback: null
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/trading-journal' : ''
		}
	}
};

export default config;
