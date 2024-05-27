export class NavLink {
	constructor(
		public label: string,
		public href: string,
		public isExternal: boolean = false
	) {}
}

export class NavDropdown {
	constructor(
		public label: string,
		public children: NavLink[]
	) {}
}

export class NavigationSeparator {
	constructor(public afterSeparator: string = '') {}
}

export const navigationEntries = [
	new NavLink('Berita', '/home'),
	new NavLink('Jadwal Perkuliahan', '/jadwal-perkuliahan'),
	new NavigationSeparator('Perkuliahan'),
	new NavLink('PRS', '/prs'),
	new NavLink('KHS dan Transkrip', '/khs'),
	new NavLink('SKKK', '/skkk'),
	new NavDropdown('Informasi Akademik', [
		new NavLink('Pengulangan Mata Kuliah', '/pengulangan-mata-kuliah'),
		new NavLink('Status Perwalian', '/status-perwalian'),
		new NavLink('Kecurangan', '/kecurangan')
	]),
	new NavDropdown('Informasi Tambahan', [
		new NavLink('Beasiswa', '/beasiswa'),
		new NavLink('Keuangan', '/keuangan'),
		new NavLink('Surat ke Orang Tua', '/surat-ke-orang-tua')
	]),
	new NavDropdown('Skripsi/Thesis/Disertasi', [
		new NavLink('Pendaftaran', '/pendaftaran'),
		new NavLink('Pengajuan', '/pengajuan'),
		new NavLink('Pembimbing', '/pembimbing')
	]),
	new NavDropdown('Permohonan', [
		new NavLink('Cuti Studi', '/cuti-studi'),
		new NavLink('Undur Diri', '/undur-diri'),
		new NavLink('Pinjam Ruang', '/pinjam-ruang'),
		new NavLink('Mengawas', '/mengawas'),
		new NavLink('Presensi MPW', '/presensi-mpw'),
		new NavLink('Tes EPT', '/tes-ept'),
		new NavLink('List Surat Keterangan', '/list-surat-keterangan')
	]),
	new NavigationSeparator(),
	new NavLink('Angket', 'https://survey.petra.ac.id', true)
] as const;
