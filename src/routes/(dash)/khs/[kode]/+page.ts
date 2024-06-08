import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const kode = event.params.kode;

	const data = {
		IF1234: {
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
		},
		IF1235: {
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
		},
		IF1236: {
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
		},
		TF1236: {
			name: 'Sistem Operasi',
			kode,
			sks: 3,
			kelas: 'A',
			dosen: ['Dr. Dosen X, S.Kom'],
			nilai: [
				{ nama: 'Ujian Tengah Semester', bobot: 0.3, nilai: 90 },
				{ nama: 'Ujian Akhir Semester', bobot: 0.5, nilai: 92 }
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
		},
		TF1230: {
			name: 'Metode Numerik',
			kode,
			sks: 2,
			kelas: 'A',
			dosen: ['Dr. Dosen JJ, S.Kom'],
			nilai: [
				{ nama: 'Ujian Tengah Semester', bobot: 0.3, nilai: 85 },
				{ nama: 'Ujian Akhir Semester', bobot: 0.5, nilai: 94 }
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
		},

		DU4164: {
			name: 'Pendidikan Kewarganegaraan',
			kode: 'DU4164',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 2,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		FD1234: {
			name: 'Aljabar Linear',
			kode: 'FD1234',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 3,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF8236: {
			name: 'Struktur Data',
			kode: 'TF8236',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 3,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF4287: {
			name: 'Pengantar Akutansi',
			kode: 'TF4287',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 2,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF4545: {
			name: 'Teknologi Web',
			kode: 'TF4545',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 3,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF9898: {
			name: 'Arsitektur dan Organisasi Komputer',
			kode: 'TF9898',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 3,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF4356: {
			name: 'Jaringan Komputer',
			kode: 'TF4356',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 3,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		DU4561: {
			name: 'Pancasila',
			kode: 'DU4561',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 2,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF4234: {
			name: 'Basis Data',
			kode: 'TF4234',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 3,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF4237: {
			name: 'Pemrograman Berorientasi Objek',
			kode: 'TF4237',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 3,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF4211: {
			name: 'Matematika Diskrit',
			kode: 'TF4211',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 3,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		DU1230: {
			name: 'Bahasa Indonesia',
			kode: 'DU1230',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 2,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		DU0008: {
			name: 'Agama dan Hidup Bermakna',
			kode: 'DU0008',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 3,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF4422: {
			name: 'Dasar Sistem Komputer',
			kode: 'TF4422',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 2,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF7777: {
			name: 'Dasar Pemrograman',
			kode: 'TF7777',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 4,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		},
		TF6753: {
			name: 'Kalkulus 1',
			kode: 'TF6753',
			kelas: 'A',
			dosen: ['Dr. Dosen X, S. Kom'],
			sks: 3,
			nilai: [
				{
					nama: 'Tugas 1',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Tengah Semester',
					bobot: 0.3,
					nilai: 85
				},
				{
					nama: 'Tugas 2',
					bobot: 0.2,
					nilai: 80
				},
				{
					nama: 'Ujian Akhir Semester',
					bobot: 0.3,
					nilai: 94
				}
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
		}
	};

	if (kode in data) {
		return {
			...data[kode as keyof typeof data]
		};
	} else {
		error(404, 'Not Found');
	}
};
