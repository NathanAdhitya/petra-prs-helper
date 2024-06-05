import { jadwalKuliah } from '$lib/mata-kuliah';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		pilihanMataKuliah: jadwalKuliah,
		dataUser: {
			semester: 4,
			jurusan: "Informatika"
		}
	};
};
