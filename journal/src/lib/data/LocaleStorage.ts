import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Trade } from './Trade';

export const personalAccessToken = writable(
	browser ? (window.localStorage.getItem('personalAccessToken') ?? '') : ''
);
personalAccessToken.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('personalAccessToken', value);
	}
});

export const localTrades = writable<Trade[]>(
	browser ? JSON.parse(window.localStorage.getItem('localTrades') || '[]') : []
);
localTrades.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('localTrades', JSON.stringify(value));
	}
});
