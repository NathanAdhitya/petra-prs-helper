export interface MataKuliah {
	nama: string;
	sks: number;
	unit: string;
	kode: string;

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

// export const jadwalKuliah: MataKuliah[] = [
// 	{
// 		nama: 'APLIKASI MOBILE BERBASIS WEB',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB. SI'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.PG'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'GRAFIKA KOMPUTER',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 8,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'P.504'
// 					},
// 					{
// 						dayOfWeek: 1,
// 						startHour: 13,
// 						startMinute: 0,
// 						durasi: 180,
// 						ruang: 'LAB.PG'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 8,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'P.504'
// 					},
// 					{
// 						dayOfWeek: 1,
// 						startHour: 16,
// 						startMinute: 0,
// 						durasi: 180,
// 						ruang: 'LAB.PG'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'C',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 8,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'P.504'
// 					},
// 					{
// 						dayOfWeek: 3,
// 						startHour: 15,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.PG'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'TEORI BAHASA DAN AUTOMATA',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 13,
// 						startMinute: 0,
// 						durasi: 120,
// 						ruang: 'W.303'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 5,
// 						startHour: 14,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'W.303'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'MATEMATIKA DISKRIT',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.626'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 16,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.614'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'C',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 16,
// 						startMinute: 0,
// 						durasi: 180,
// 						ruang: 'P.203'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'CLOUD COMPUTING',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 17,
// 						startMinute: 0,
// 						durasi: 180,
// 						ruang: 'LAB. SI'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'ARSITEKTUR DAN ORGANISASI KOMPUTER',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.708'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'COMPUTER VISION',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.MM'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'METODE NUMERIK',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 13,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'P.505'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'P.504'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'C',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.708'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'NATURAL LANGUAGE PROCESSING',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.PG'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'USER EXPERIENCE',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB. SI'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'INCIDENT RESPONSE AND MALWARE ANALYSIS',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 13,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.503A'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'VIRTUAL REALITY',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 12,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.MM'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'PENGEMBANGAN APLIKASI BERBASIS ANDROID',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 17,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB. SI'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'MACHINE LEARNING',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.202'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'DEEP LEARNING',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.PG'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'SENI KONSEP DAN PEMODELAN UNTUK GAME',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.202'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'ARSITEKTUR BERORIENTASI LAYANAN',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 13,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.614'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'KECERDASAN BUATAN DALAM GAME',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 13,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.202'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'ROUTING AND SWITCHING',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 13,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.707'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'SISTEM TERDISTRIBUSI',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 16,
// 						startMinute: 0,
// 						durasi: 180,
// 						ruang: 'P.203'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'ANALISIS BIG DATA',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 5,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB. SI'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'NETWORK DEFENSE',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 5,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.502'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'KEAMANAN PERANGKAT MOBILE',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 6,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.505'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'JARINGAN KOMPUTER',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 13,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.204'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 13,
// 						startMinute: 0,
// 						durasi: 180,
// 						ruang: 'P.203'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'C',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.203'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'D',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 13,
// 						startMinute: 0,
// 						durasi: 180,
// 						ruang: 'P.615'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'BASIS DATA',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 8,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'LAB.P-A'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 6,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'LAB. SI'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'C',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'LAB. SI'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'D',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 8,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'LAB.P-A'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'PEMROGRAMAN BERORIENTASI OBYEK',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 8,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'LAB.P-D'
// 					},
// 					{
// 						dayOfWeek: 4,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.P-A'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 5,
// 						startHour: 8,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'LAB.P-A'
// 					},
// 					{
// 						dayOfWeek: 6,
// 						startHour: 12,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.MOBDEV'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'C',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 8,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'LAB.P-A'
// 					},
// 					{
// 						dayOfWeek: 4,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'DUMMY'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'D',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 8,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'LAB.P-D'
// 					},
// 					{
// 						dayOfWeek: 6,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.PG'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'E',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 13,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.P-A'
// 					},
// 					{
// 						dayOfWeek: 4,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.P-A'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'F',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.P-A'
// 					},
// 					{
// 						dayOfWeek: 6,
// 						startHour: 9,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'LAB.MOBDEV'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'ANALISIS DAN DESAIN SISTEM INFORMASI',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 13,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB. SI'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB.P-A'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'C',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'LAB. SI'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'D',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 13,
// 						startMinute: 0,
// 						durasi: 180,
// 						ruang: 'LAB. SI'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'TEORI BAHASA DAN AUTOMATA',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 13,
// 						startMinute: 0,
// 						durasi: 120,
// 						ruang: 'W.303'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 5,
// 						startHour: 14,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'W.303'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'METODOLOGI PENELITIAN',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.204'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 13,
// 						startMinute: 0,
// 						durasi: 180,
// 						ruang: 'P.503'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'C',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 7,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.708'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'D',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 10,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.708'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'E',
// 				jadwal: [
// 					{
// 						dayOfWeek: 4,
// 						startHour: 8,
// 						startMinute: 30,
// 						durasi: 180,
// 						ruang: 'P.707'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'F',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 18,
// 						startMinute: 0,
// 						durasi: 180,
// 						ruang: 'P.202'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	},
// 	{
// 		nama: 'STATISTIKA DASAR',
// 		sks: 3,
// 		unit: 'Informatika',
// 		kelas: [
// 			{
// 				kelas: 'A',
// 				jadwal: [
// 					{
// 						dayOfWeek: 2,
// 						startHour: 13,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'P.708'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'B',
// 				jadwal: [
// 					{
// 						dayOfWeek: 1,
// 						startHour: 15,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'E.01.09 B'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'C',
// 				jadwal: [
// 					{
// 						dayOfWeek: 3,
// 						startHour: 13,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'P.708'
// 					}
// 				],
// 				jadwalUjian: []
// 			},
// 			{
// 				kelas: 'D',
// 				jadwal: [
// 					{
// 						dayOfWeek: 6,
// 						startHour: 9,
// 						startMinute: 30,
// 						durasi: 120,
// 						ruang: 'P.202'
// 					}
// 				],
// 				jadwalUjian: []
// 			}
// 		]
// 	}
// ].map((mataKuliah, index) => ({
// 	...mataKuliah,
// 	kode: `TF${index.toString().padStart(3, '0')}`
// }));
