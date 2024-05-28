import type { PageLoad } from './$types';

function createAnnouncement(title: string, shortDesc: string, detail: string) {
	return {
		title,
		shortDesc,
		detail
	};
}

export const load: PageLoad = async () => {
	return {
		newsFlash: [
			`<h1>Biro Administrasi Akademik (BAA)</h1>
      <p>Mahasiswa yang akan maju sidang proposal Skripsi/Tesis/Disertasi WAJIB mengisi data Tugas Akhir di sim.petra.ac.id > pilih perkuliahan > Skripsi/Tesis > Pengajuan > isi judul skripsi dan nama pembimbing</p>`,
			`<h1>Biro Administrasi Keuangan (BAK)</h1>
      <p>»Pembayaran biaya kuliah angsuran bulan Mei 2024 hingga  9 Mei 2024</p>
      <p>(cek email @john.petra.ac.id anda):</p>
      <p>»Jadwal & Nilai Tagihan untuk Semester Genap 2023/2024 dapat dilihat di</p>
      <p>sim.petra.ac.id > perkuliahan > informasi tambahan > keuangan</p>`
		],
		announcements: [
			createAnnouncement(
				'YUDISIUM PERTENGAHAN SEMESTER GENAP 2023/2024',
				'YUDISIUM PERTENGAHAN SEMESTER GENAP 2023/2024 SELAMBAT LAMBATNYA TANGGAL26 APRIL 2024 TELAH DISELESAIKAN DI PRODI/PROGRAM MASING-MASING DAN DISERAHKAN KE BAA OLEH PRODI/PROGRAM TERSEBUT',
				`YUDISIUM PERTENGAHAN SEMESTER GENAP 2023/2024
					SELAMBAT LAMBATNYA TANGGAL 26 APRIL 2024
					TELAH DISELESAIKAN DI PRODI/PROGRAM MASING-MASING DAN DISERAHKAN KE BAA OLEH PRODI/PROGRAM TERSEBUT`
			)
		]
	};
};
