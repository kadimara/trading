import { browser } from '$app/environment';

class LocalStore<T> {
	key: string = '';
	value: T = $state.raw<T>() as T;

	constructor(key: string, value: T) {
		this.key = key;
		this.value = value;

		if (browser) {
			this.value = localStorage[key] ? JSON.parse(localStorage[key]) : value;
			$effect(() => {
				if (this.value) {
					localStorage[key] = JSON.stringify(this.value);
				}
			});
		}
	}
}

export function localStore<T>(key: string, value: T) {
	return new LocalStore(key, value);
}
