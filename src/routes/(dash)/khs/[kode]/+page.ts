import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const kode = event.params.kode;

	if (kode === 'IF1234') {
		return {
			name: 'Kecerdasan Buatan',
			kode,
			sks: 3,
			kelas: 'A',
			dosen: ['Dr. Dosen 1, S.Kom'],

			nilai: [
				{ nama: 'Ujian Tengah Semester', bobot: 0.3, nilai: 80 },
				{ nama: 'Ujian Akhir Semester', bobot: 0.5, nilai: 90 }
			],

			kehadiran: [
				{
					pertemuan: 1,
					tanggal: '2023-04-01',
					materi: 'Pengenalan Kecerdasan Buatan',
					status: 'Hadir'
				},
				{
					pertemuan: 2,
					tanggal: '2023-04-08',
					materi: 'Pengenalan Machine Learning',
					status: 'Hadir'
				},
				{
					pertemuan: 3,
					tanggal: '2023-04-15',
					materi: 'Pengenalan Deep Learning',
					status: 'Hadir'
				}
			]
		};
	} else if (kode === 'IF1235') {
		return {
			name: 'Grafik Komputer',
			kode,
			sks: 3,
			kelas: 'A',
			dosen: ['Dr. Dosen 1, S.Kom'],
			nilai: [
				{ nama: 'Ujian Tengah Semester', bobot: 0.3, nilai: 80 },
				{ nama: 'Ujian Akhir Semester', bobot: 0.5, nilai: 90 }
			],
			kehadiran: [
				{
					pertemuan: 1,
					tanggal: '2023-04-01',
					materi: 'Pengenalan Grafik Komputer',
					status: 'Hadir'
				},
				{
					pertemuan: 2,
					tanggal: '2023-04-08',
					materi: 'Pengenalan OpenGL',
					status: 'Hadir'
				},
				{
					pertemuan: 3,
					tanggal: '2023-04-15',
					materi: 'Pengenalan WebGL',
					status: 'Hadir'
				}
			]
		};
	} else if (kode === 'IF1236') {
		return {
			name: 'Cyber Operations',
			kode,
			sks: 2,

			kelas: 'A',
			dosen: ['Dr. Dosen 1, S.Kom'],

			nilai: [
				{ nama: 'Ujian Tengah Semester', bobot: 0.3, nilai: 80 },
				{ nama: 'Ujian Akhir Semester', bobot: 0.5, nilai: 90 }
			],

			kehadiran: [
				{
					pertemuan: 1,
					tanggal: '2023-04-01',
					materi: 'Pengenalan Cyber Operations',
					status: 'Hadir'
				},
				{
					pertemuan: 2,
					tanggal: '2023-04-08',
					materi: 'Pengenalan Penetration Testing',
					status: 'Hadir'
				},
				{
					pertemuan: 3,
					tanggal: '2023-04-15',
					materi: 'Pengenalan Incident Response',
					status: 'Hadir'
				}
			]
		};
	} else {
		error(404, 'Not Found');
	}
};
