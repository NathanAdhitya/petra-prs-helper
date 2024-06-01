export type MataKuliah = string;
export type NamaUnit = string;

export interface JadwalGlobal {
	periode: string;
	unit: string;

	jadwal: Record<
		MataKuliah,
		{
			kuliah: EntryJadwalKuliahGlobal[];
			uts: EntryJadwalUjianGlobal[];
			uas: EntryJadwalUjianGlobal[];
		}
	>;
}

export type DayString =
	| 'Senin'
	| 'Selasa'
	| 'Rabu'
	| 'Kamis'
	| 'Jumat'
	| 'Sabtu'
	| 'Minggu'
	| 'DUMMY';

export interface EntryJadwalUjianGlobal {
	date: Date;
	lengthMinutes: number;

	ruang: string;
	kelas: string;
	catatan?: string;
}

export interface EntryJadwalKuliahGlobal {
	hari: DayString;
	jamMulai: number;
	menitMulai: number;
	lengthMinutes: number;

	ruang: string;
	kelas: string;
	catatan?: string;
}

import data from './jadwal.json';
const jadwal: Record<string, JadwalGlobal> = {};

Object.values(data).forEach((v) => {
	// Parse all dates as Date objects
	const unit = v.unit;

	jadwal[unit] = {
		unit,
		periode: v.periode,
		jadwal: {}
	};

	Object.entries(v.jadwal).forEach(([mk, entry]) => {
		jadwal[unit].jadwal[mk] = {
			kuliah: entry.kuliah as EntryJadwalKuliahGlobal[],
			uts: entry.uts.map((e) => ({
				...e,
				date: new Date(e.date)
			})),

			uas: entry.uas.map((e) => ({
				...e,
				date: new Date(e.date)
			}))
		};
	});
});

export { jadwal };
