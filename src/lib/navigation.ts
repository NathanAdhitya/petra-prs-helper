import { base } from '$app/paths';

export class NavLink {
	public href: string;

	constructor(
		public label: string,
		href: string,
		public isExternal: boolean = false,
		public isDisabled: boolean = false
	) {
		this.href = isExternal ? href : `${base}${href}`;
	}
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

export function isNavigationActive(href: string, currentPath: string) {
	// if currentPath is a subpath of href, then it is active
	return currentPath.startsWith(href);
}

export const navigationEntries = [
	new NavLink('Berita', '/berita'),
	new NavLink('Jadwal Perkuliahan', '/jadwal-perkuliahan', false, true),
	new NavigationSeparator('Perkuliahan'),
	new NavLink('PRS', '/prs'),
	new NavLink('KHS dan Transkrip', '/khs'),
	new NavLink('SKKK', '/skkk', false, true),
	new NavDropdown('Informasi Akademik', [
		new NavLink('Pengulangan Mata Kuliah', '/pengulangan-mata-kuliah', false, true),
		new NavLink('Status Perwalian', '/status-perwalian', false, true),
		new NavLink('Kecurangan', '/kecurangan', false, true)
	]),
	new NavDropdown('Informasi Tambahan', [
		new NavLink('Beasiswa', '/beasiswa', false, true),
		new NavLink('Keuangan', '/keuangan', false, true),
		new NavLink('Surat ke Orang Tua', '/surat-ke-orang-tua', false, true)
	]),
	new NavDropdown('Skripsi/Thesis/Disertasi', [
		new NavLink('Pendaftaran', '/pendaftaran', false, true),
		new NavLink('Pengajuan', '/pengajuan', false, true),
		new NavLink('Pembimbing', '/pembimbing', false, true)
	]),
	new NavDropdown('Permohonan', [
		new NavLink('Cuti Studi', '/cuti-studi', false, true),
		new NavLink('Undur Diri', '/undur-diri', false, true),
		new NavLink('Pinjam Ruang', '/pinjam-ruang', false, true),
		new NavLink('Mengawas', '/mengawas', false, true),
		new NavLink('Presensi MPW', '/presensi-mpw', false, true),
		new NavLink('Tes EPT', '/tes-ept', false, true),
		new NavLink('List Surat Keterangan', '/list-surat-keterangan', false, true)
	]),
	new NavigationSeparator(),
	new NavLink('Angket', 'https://survey.petra.ac.id', true)
] as const;
