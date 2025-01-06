import { browser } from '$app/environment';

export const personalAccessToken = $state({
	value: browser ? (localStorage.getItem('personalAccessToken') ?? '') : ''
});
$effect.root(() => {
	$effect(() => {
		localStorage.setItem('personalAccessToken', personalAccessToken.value);
	});
});
