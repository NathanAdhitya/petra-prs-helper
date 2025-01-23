export interface MataKuliah {
	nama: string;
	sks: number;
	unit: string;
	kode: string;
	semester: number | null;

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

import { writable, type Writable } from 'svelte/store';
import data from './jadwal.json';
export const jadwalKuliah: Writable<MataKuliah[]> = writable(data);

// If useCustomJadwal is true, then attempt to load the customJadwalJson
if (localStorage.getItem('useCustomJadwal') === 'true') {
	const data = localStorage.getItem('customJadwal');
	try {
		if (data) {
			jadwalKuliah.set(JSON.parse(data));
			console.log('Using custom data');
		}
	} catch (e) {
		console.error(e);
	}
}
