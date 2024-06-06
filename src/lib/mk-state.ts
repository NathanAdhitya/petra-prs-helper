import { get, writable, type Writable } from 'svelte/store';
import type { MataKuliah } from './mata-kuliah';

export interface MataKuliahWithColor extends MataKuliah {
	colorClasses: string;
}

export type ChosenMatkulStore = Writable<MataKuliahWithColor[]>;
export type ChosenClassesStore = Writable<Record<MataKuliah['kode'], string[]>>;

export const chosenMatkul: ChosenMatkulStore = writable([]);
export const chosenClasses: ChosenClassesStore = writable({});

export class ChosenMatkulUtils {
	static sksLimit = 24;
	static matkulLimit = 12;

	static matkulColorClasses = [
		'bg-blue-200',
		'bg-green-200',
		'bg-yellow-200',
		'bg-red-200',
		'bg-purple-200',
		'bg-pink-200',
		'bg-indigo-200',
		'bg-cyan-200',
		'bg-teal-200',
		'bg-lime-200',
		'bg-orange-200',
		'bg-violet-200'
	];

	static availableColors = new Set(this.matkulColorClasses);

	static has(matkul: MataKuliah | MataKuliahWithColor) {
		if (!('colorClasses' in matkul)) return get(chosenMatkul).some((m) => m.kode === matkul.kode);
		return get(chosenMatkul).includes(matkul);
	}

	/**
	 * Toggle a matkul
	 */
	static toggle(matkul: MataKuliah | MataKuliahWithColor) {
		if (this.has(matkul)) {
			return this.remove(matkul);
		} else {
			return this.add(matkul);
		}
	}

	static add(matkul: MataKuliah) {
		const $chosenMatkul = get(chosenMatkul);
		if (
			$chosenMatkul.length < this.matkulLimit &&
			$chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0) + matkul.sks <= this.sksLimit
		) {
			// Find a color
			const color = this.availableColors.values().next().value;
			if (!color) return false;

			// Remove the color from the available colors
			this.availableColors.delete(color);

			chosenMatkul.update(($chosenMatkul) => {
				return [{ ...matkul, colorClasses: color }, ...$chosenMatkul];
			});
		}
	}

	/**
	 * Remove a matkul
	 */
	static remove(matkul: MataKuliah | MataKuliahWithColor) {
		chosenMatkul.update(($chosenMatkul) => {
			const removed = $chosenMatkul.find((m) => m.kode === matkul.kode);

			// Return the colors
			if (removed) this.availableColors.add(removed.colorClasses);

			return $chosenMatkul.filter((m) => m.kode !== matkul.kode);
		});

		return true;
	}
}

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
