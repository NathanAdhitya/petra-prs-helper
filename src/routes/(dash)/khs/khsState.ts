import { writable } from 'svelte/store';

export const semesterFilterState = writable({
	label: 'Semester 4 (Genap 2024)',
	value: 'genap-2024'
});
