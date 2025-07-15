import type { KeyboardEventHandler } from 'svelte/elements';

export const handleKeydownToClick: KeyboardEventHandler<any> = (event) => {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		event.currentTarget.click();
	}
};
