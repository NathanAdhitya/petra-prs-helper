import { writable } from 'svelte/store';

export const keyboardStore = writable({
	shift: false
});

window.addEventListener('keydown', (e) => {
	if (e.key === 'Shift') {
		keyboardStore.update((state) => {
			state.shift = true;
			return state;
		});
	}
});

window.addEventListener('keyup', (e) => {
	if (e.key === 'Shift') {
		keyboardStore.update((state) => {
			state.shift = false;
			return state;
		});
	}
});
