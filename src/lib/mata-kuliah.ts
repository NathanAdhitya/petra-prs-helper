export interface MataKuliah {
	nama: string;
	sks: number;
	unit: string;
	kode: string;
	recommended: boolean;

	kelas: KelasMataKuliah[];
}

export interface KelasMataKuliah {
	kelas: string;
	catatan?: string;

	jadwal: JadwalMataKuliah[];
}

export interface JadwalMataKuliah {
	dayOfWeek: number;
	startHour: number;
	startMinute: number;
	durasi: number;

	ruang: string;
}

import data from './jadwal.json';
export const jadwalKuliah: MataKuliah[] = data;
