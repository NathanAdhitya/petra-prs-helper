<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { namaUser, nrpUser } from '$lib/mock-data';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import { titleStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import { semesterFilterState } from './khsState';

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
			},
			{
				kode: 'TF1236',
				nama: 'Sistem Operasi',
				sks: 3,
				nilai: 'B+'
			},
			{
				kode: 'TF1230',
				nama: 'Metode Numerik',
				sks: 2,
				nilai: 'B+'
			}
		],
		'ganjil-2023': [
			{
				kode: 'DU4164',
				nama: 'Pendidikan Kewarganegaraan',
				sks: 2,
				nilai: 'A'
			},
			{
				kode: 'FD1234',
				nama: 'Aljabar Linear',
				sks: 3,
				nilai: 'B+'
			},
			{
				kode: 'TF8236',
				nama: 'Struktur Data',
				sks: 3,
				nilai: 'B'
			},
			{
				kode: 'TF4287',
				nama: 'Pengantar Akutansi',
				sks: 2,
				nilai: 'A'
			},
			{
				kode: 'TF4545',
				nama: 'Teknologi Web',
				sks: 3,
				nilai: 'B'
			},
			{
				kode: 'TF9898',
				nama: 'Arsitektur dan Organisasi Komputer',
				sks: 3,
				nilai: 'A'
			}
		],
		'genap-2023': [
			{
				// contains: kode MK, nama MK, sks, nilai
				kode: 'TF4356',
				nama: 'Jaringan Komputer',
				sks: 3,
				nilai: 'B'
			},
			{
				kode: 'DU4561',
				nama: 'Pancasila',
				sks: 2,
				nilai: 'A'
			},
			{
				kode: 'TF4234',
				nama: 'Basis Data',
				sks: 3,
				nilai: 'B'
			},
			{
				kode: 'TF4237',
				nama: 'Pemrograman Berorientasi Objek',
				sks: 3,
				nilai: 'A'
			},
			{
				kode: 'TF4211',
				nama: 'Matematika Diskrit',
				sks: 3,
				nilai: 'B+'
			}
		],
		'ganjil-2022': [
			{
				// contains: kode MK, nama MK, sks, nilai
				kode: 'DU1230',
				nama: 'Bahasa Indonesia',
				sks: 2,
				nilai: 'A'
			},
			{
				kode: 'DU0008',
				nama: 'Agama dan Hidup Bermakna',
				sks: 3,
				nilai: 'B+'
			},
			{
				kode: 'TF4422',
				nama: 'Dasar Sistem Komputer',
				sks: 2,
				nilai: 'B'
			},
			{
				kode: 'TF7777',
				nama: 'Dasar Pemrograman',
				sks: 4,
				nilai: 'A'
			},
			{
				kode: 'TF6753',
				nama: 'Kalkulus 1',
				sks: 3,
				nilai: 'B+'
			}
		]
	};

	onMount(() => ($titleStore = 'Berita'));
</script>

<h1 class="pb-2 text-center text-2xl font-bold">Transkrip</h1>
<Select.Root bind:selected={$semesterFilterState}>
	<Select.Trigger class="mx-auto w-56 text-center">
		<Select.Value />
	</Select.Trigger>
	<Select.Content>
		<Select.Item value="all">Semua Semester</Select.Item>
		<Select.Item value="genap-2024">Semester 4 (Genap 2024)</Select.Item>
		<Select.Item value="ganjil-2023">Semester 3 (Ganjil 2023)</Select.Item>
		<Select.Item value="genap-2023">Semester 2 (Genap 2023)</Select.Item>
		<Select.Item value="ganjil-2022">Semester 1 (Ganjil 2022)</Select.Item>
	</Select.Content>
</Select.Root>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">#</Table.Head>
			<Table.Head>Kode MK</Table.Head>
			<Table.Head>Nama</Table.Head>
			<Table.Head>SKS</Table.Head>
			<Table.Head>Nilai</Table.Head>
			<Table.Head>Kehadiran</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each $semesterFilterState.value === 'all' ? Object.values(khsData).flat() : khsData[$semesterFilterState.value] ?? [] as matkul, i (i)}
			<Table.Row>
				<Table.Cell class="font-medium">{i + 1}</Table.Cell>
				<Table.Cell>{matkul.kode}</Table.Cell>
				<Table.Cell>{matkul.nama}</Table.Cell>
				<Table.Cell>{matkul.sks}</Table.Cell>
				<Table.Cell>{matkul.nilai}</Table.Cell>
				<Table.Cell><span class="text-xs text-muted-foreground">(10/10)</span> 100%</Table.Cell>
				<Table.Cell>
					<a class="text-blue-500" href={`/khs/${matkul.kode}`}>Lihat Detail</a>
				</Table.Cell>
			</Table.Row>
		{/each}
		{#if ($semesterFilterState.value === 'all' ? Object.values(khsData).flat() : khsData[$semesterFilterState.value] ?? []).length === 0}
			<Table.Row>
				<Table.Cell class="text-center" colspan={7}>Data tidak ditemukan.</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>

<table class="mt-8 w-full p-4 xl:w-1/2">
	<tr>
		<td>Jumlah SKS</td>
		<td>:</td>
		<td>8</td>
	</tr>
	<tr>
		<td>IPS yang diperoleh</td>
		<td>:</td>
		<td>3.89</td>
	</tr>
	<tr>
		<td>Total SKS yang ditempuh</td>
		<td>:</td>
		<td>48 SKS</td>
	</tr>
	<tr>
		<td>Total SKS lulus yang ditempuh</td>
		<td>:</td>
		<td>48 SKS</td>
	</tr>
</table>
