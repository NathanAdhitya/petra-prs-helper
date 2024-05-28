<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { namaUser, nrpUser } from '$lib/mock-data';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';

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

<h1 class="pb-2 text-center text-2xl font-bold">Transkrip</h1>
<Select.Root bind:selected={semesterFilter}>
	<Select.Trigger class="mx-auto w-[180px]">
		<Select.Value />
	</Select.Trigger>
	<Select.Content>
		<Select.Item value="all">Semua Semester</Select.Item>
		<Select.Item value="genap-2024">Genap 2024</Select.Item>
		<Select.Item value="ganjil-2023">Ganjil 2023</Select.Item>
		<Select.Item value="genap-2023">Genap 2023</Select.Item>
		<Select.Item value="ganjil-2022">Ganjil 2022</Select.Item>
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
		{#each semesterFilter.value === 'all' ? Object.values(khsData).flat() : khsData[semesterFilter.value] ?? [] as matkul, i (i)}
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
		{#if (semesterFilter.value === 'all' ? Object.values(khsData).flat() : khsData[semesterFilter.value] ?? []).length === 0}
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
