export interface MataKuliah {
    prsId: string;
    nama: string;
    semester: number | null;
    sks: number;
    unit: string;
    kode: string;

    kelas: KelasMataKuliah[];
}

export interface KelasMataKuliah {
    kelas: string;
    keterangan?: string;
    accepted?: number;
    capacity?: number;

    jadwal: JadwalMataKuliah[];
    jadwalUts: JadwalUjianMataKuliah[];
    jadwalUas: JadwalUjianMataKuliah[];
}

export interface JadwalUjianMataKuliah {
    date: string;
    lengthMinutes: number | null;

    ruang: string;
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
