<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { namaUser, nrpUser } from '$lib/mock-data';

	const khsData: Record<
		string,
		{
			kode: string;
			nama: string;
			sks: number;
			nilai: string;
		}[]
	> = {
		'genap-2024': [
			{
				// contains: kode MK, nama MK, sks, nilai
				kode: 'IF1234',
				nama: 'Kecerdasan Buatan',
				sks: 3,
				nilai: 'A'
			},
			{
				kode: 'IF1235',
				nama: 'Grafik Komputer',
				sks: 3,
				nilai: 'A'
			},
			{
				kode: 'IF1236',
				nama: 'Cyber Operations',
				sks: 2,
				nilai: 'A'
			}
		]
	};

	let semesterFilter = {
		label: 'Semua Semester',
		value: 'all'
	};
</script>

<div class="flex h-full w-full flex-col items-center">
	<div class="flex h-full w-full max-w-screen-lg flex-col items-center gap-4">
		<Card.Root class="w-full overflow-hidden rounded-xl">
			<Card.Header class="bg-blue-300">
				<Card.Title>Informasi Transkrip</Card.Title>
			</Card.Header>
			<Card.Content class="pt-4">
				<table class="w-full p-4">
					<tr>
						<td>Nama</td>
						<td>:</td>
						<td>{namaUser}</td>

						<td>Fakultas</td>
						<td>:</td>
						<td>Teknologi Industri</td>
					</tr>
					<tr>
						<td>NRP</td>
						<td>:</td>
						<td>{nrpUser}</td>

						<td>Jurusan</td>
						<td>:</td>
						<td>Informatika</td>
					</tr>
					<tr>
						<td>Dosen Wali</td>
						<td>:</td>
						<td>Dosen, S. Kom</td>

						<td>Track</td>
						<td>:</td>
						<td>Reguler</td>
					</tr>
					<tr>
						<td>SKS Lulus</td>
						<td>:</td>
						<td>48</td>

						<td>IPK</td>
						<td>:</td>
						<td>3.68</td>
					</tr>
				</table>
			</Card.Content>
		</Card.Root>
		<Card.Root class="w-full overflow-hidden rounded-xl">
			<Card.Content class="pt-4">
				<slot />
			</Card.Content>
		</Card.Root>
	</div>
</div>
