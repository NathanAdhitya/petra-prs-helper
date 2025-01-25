import { get, writable, type Writable } from 'svelte/store';
import { jadwalKuliah, type JadwalMataKuliah, type MataKuliah } from './mata-kuliah';
import { properCase } from './mk-utils';
import { notEmpty } from './utils';
import { sleep } from './internal/helpers/sleep';

export interface MataKuliahWithColor extends MataKuliah {
	colorClasses: string;
}

export type ChosenMatkulStore = Writable<MataKuliahWithColor[]>;
export type ChosenClassesStore = Writable<Record<MataKuliah['kode'], string[]>>;

export const chosenMatkul: ChosenMatkulStore = writable([]);
export const chosenClasses: ChosenClassesStore = writable({});
export const prsSubmitted = writable(false);
export const chosenJurusanFilters = writable<string[]>(['Informatika', 'D.M.U']);
export const semesterFilters = writable<Record<string, boolean>>();
export const jadwalDiffs = writable<(false | null | MataKuliahWithColor)[]>([]);

try {
	chosenMatkul.set(JSON.parse(localStorage.getItem('chosenMatkul') || 'null') ?? []);
} catch (e) {
	console.error(e);
}

try {
	chosenClasses.set(JSON.parse(localStorage.getItem('chosenClasses') || 'null') ?? {});
} catch (e) {
	console.error(e);
}

try {
	chosenJurusanFilters.set(
		JSON.parse(localStorage.getItem('chosenJurusanFilters') || 'null') ?? ['D.M.U']
	);
} catch (e) {
	console.error(e);
}

try {
	semesterFilters.set(
		JSON.parse(localStorage.getItem('semesterFilters') || 'null') ?? {
			null: true,
			1: true,
			2: true,
			3: true,
			4: true,
			5: true,
			6: true,
			7: true,
			8: true
		}
	);
} catch (e) {
	console.error(e);
}

// Back the writable by localStorage
chosenMatkul.subscribe((value) => {
	localStorage.setItem('chosenMatkul', JSON.stringify(value));
});
chosenClasses.subscribe((value) => {
	localStorage.setItem('chosenClasses', JSON.stringify(value));
});
chosenJurusanFilters.subscribe((value) => {
	localStorage.setItem('chosenJurusanFilters', JSON.stringify(value));
});
semesterFilters.subscribe((value) => {
	localStorage.setItem('semesterFilters', JSON.stringify(value));
});

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
		'bg-teal-100',
		'bg-lime-200',
		'bg-orange-200',
		'bg-violet-200'
	];

	static availableColors = new Set(this.matkulColorClasses);

	static reset() {
		chosenMatkul.set([]);
		this.availableColors = new Set(this.matkulColorClasses);
	}

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

	static recalculateAvailableColors() {
		const $chosenMatkul = get(chosenMatkul);
		this.availableColors = new Set(this.matkulColorClasses);

		$chosenMatkul.forEach((matkul) => {
			this.availableColors.delete(matkul.colorClasses);
		});
	}

	// This should yield as often as possible as it's a heavy operation
	static async diffAgainstOriginal() {
		const { default: deepEql } = await import('deep-eql');
		const $chosenMatkul = get(chosenMatkul);
		const $jadwalKuliah = get(jadwalKuliah);

		/**
		 * resulting diff contains an array of:
		 * 1. false if jadwal kuliah does not contain matkul
		 * 2. null if no difference
		 * 3. new matkul object if difference exists
		 */
		const diff: (false | null | MataKuliahWithColor)[] = [];

		// Find each chosenMatkul based on kode or nama.
		for (const matkul of $chosenMatkul) {
			const matchedMatkul = $jadwalKuliah.find(
				(mk) => mk.kode === matkul.kode || mk.nama === matkul.nama
			);

			if (!matchedMatkul) {
				diff.push(false);
				continue;
			}

			// Create copy of matkul object without colorClasses
			const matkulCopy: MataKuliah = { ...matkul };

			// @ts-expect-error colorClasses is not in MataKuliah
			delete matkulCopy.colorClasses;

			// Check deep equality of matkul object
			const isEqual = deepEql(matkulCopy, matchedMatkul);
			if (!isEqual) {
				diff.push({ ...matchedMatkul, colorClasses: matkul.colorClasses });
			} else {
				diff.push(null);
			}

			await sleep(1);
		}

		console.log('Finished background migration check: ', diff);
		jadwalDiffs.update(() => diff);
	}

	// Migrate to new schedule
	static migrate() {
		const diffs = get(jadwalDiffs);

		diffs.forEach((diff, idx) => {
			if (diff === false) {
				// Do nothing
			} else if (diff === null) {
				// Do nothing
			} else {
				// Get the old kode and new kode
				const oldKode = get(chosenMatkul)[idx].kode;
				const newKode = diff.kode;

				// Remove the old matkul and then readd it
				chosenMatkul.update((matkul) => {
					matkul.splice(idx, 1);
					matkul.push(diff);
					return matkul;
				});

				// Migrate the class selections key
				chosenClasses.update((classes) => {
					if (newKode === oldKode) return classes;

					classes[newKode] = classes[oldKode];
					delete classes[oldKode];
					return classes;
				});
			}
		});

		ChosenMatkulUtils.diffAgainstOriginal();
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

			return true;
		}

		return false;
	}

	/**
	 * Remove a matkul
	 */
	static remove(matkul: MataKuliah | MataKuliahWithColor | string, updateDiff = false) {
		chosenMatkul.update(($chosenMatkul) => {
			const kode = typeof matkul === 'string' ? matkul : matkul.kode;
			const removed = $chosenMatkul.find((m) => m.kode === kode);

			// Return the colors
			if (removed) this.availableColors.add(removed.colorClasses);

			return $chosenMatkul.filter((m) => m.kode !== kode);
		});

		if (updateDiff) {
			this.diffAgainstOriginal();
		}

		return true;
	}
}

export class ChosenClassesUtils {
	static reset() {
		chosenClasses.set({});
	}

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

	static testCollisionJadwalMataKuliah(j1: JadwalMataKuliah, j2: JadwalMataKuliah) {
		if (j1.dayOfWeek !== j2.dayOfWeek) return false;

		const start1 = j1.startHour * 60 + j1.startMinute;
		const end1 = start1 + j1.durasi;

		const start2 = j2.startHour * 60 + j2.startMinute;
		const end2 = start2 + j2.durasi;

		return start1 < end2 && end1 > start2;
	}

	/**
	 * Validate the chosen classes
	 */
	static async validate() {
		/**
		 * Things to check:
		 * 1. The same class within the same matkul must not be chosen in more than one plan (fatal)
		 * 2. A matkul is taken, but not a single class is chosen (fatal)
		 * 3. There should not be a single collision within each plan/priority (warning)
		 */
		const messages: {
			type: 'info' | 'warning' | 'fatal' | 'success';
			message: string;
		}[] = [];

		const $chosenClasses = get(chosenClasses);
		const $chosenMatkul = get(chosenMatkul);

		// Check for the first condition
		const classes = Object.entries($chosenClasses);

		const classesWithKode = classes
			.map(([kode, plans]) => {
				const matkul = $chosenMatkul.find((m) => m.kode === kode);
				if (!matkul) return;
				return { kode, matkul, plans };
			})
			.filter(notEmpty);

		classesWithKode.forEach(({ matkul, plans }) => {
			if (!matkul) return;

			const classes = plans.flat();
			const uniqueClasses = new Set(classes);

			if (uniqueClasses.size !== classes.length) {
				messages.push({
					type: 'fatal',
					message: `Kelas yang sama digunakan dalam prioritas yang berbeda pada mata kuliah ${properCase(matkul.nama)}`
				});
			}
		});

		// Check for the second condition
		$chosenMatkul.forEach((matkul) => {
			if (!classesWithKode.find((m) => m.kode === matkul.kode)) {
				messages.push({
					type: 'fatal',
					message: `Mata kuliah ${properCase(matkul.nama)} harus memiliki setidaknya satu kelas yang dipilih`
				});
			}
		});

		// Check if any class is even chosen
		if (classesWithKode.length === 0) {
			messages.push({
				type: 'fatal',
				message: 'Tidak ada mata kuliah yang dipilih'
			});
		}

		// Over 24 SKS Error
		if ($chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0) > ChosenMatkulUtils.sksLimit) {
			messages.push({
				type: 'fatal',
				message: 'Total SKS melebihi batas maksimum (24 SKS)'
			});
		}

		return messages;
	}
}
