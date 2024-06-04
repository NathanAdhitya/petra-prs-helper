import { writable, type Writable } from 'svelte/store';
import type { MataKuliah } from './mata-kuliah';

export type ChosenMatkulStore = Writable<MataKuliah[]>;
export type ChosenClassesStore = Writable<Record<MataKuliah['kode'], string[]>>;

export const chosenMatkul: ChosenMatkulStore = writable([]);
export const chosenClasses: ChosenClassesStore = writable({});

export class ChosenClassesUtils {
	/**
	 * Trims the chosen classes to the maximum plan amount
	 */
	static trimPlans(kode: MataKuliah['kode'], max: number) {
		chosenClasses.update((classes) => {
			if (!classes[kode]) {
				return classes;
			}

			classes[kode] = classes[kode].slice(0, max);
			return classes;
		});
	}

	/**
	 * Set the chosen classes for a specific plan
	 */
	static setPlan(
		kode: MataKuliah['kode'],
		plan: number,
		kelas: MataKuliah['kelas'][number]['kelas']
	) {
		chosenClasses.update((classes) => {
			if (!classes[kode]) {
				classes[kode] = [];
			}
			classes[kode][plan] = kelas;
			return classes;
		});
	}

	/**
	 * Delete a plan from the chosen classes
	 */
	static removePlan(kode: MataKuliah['kode'], plan: number) {
		chosenClasses.update((classes) => {
			if (!classes[kode]) {
				return classes;
			}
			classes[kode].splice(plan, 1);

			return classes;
		});
	}
}
