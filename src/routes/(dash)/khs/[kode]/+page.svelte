<script lang="ts">
	export let data;

	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import { ArrowLeft } from 'lucide-svelte';
</script>

<div class="mb-6">
	<a href="/khs">
		<ArrowLeft class="float-left h-8 w-8 rounded-full p-1 transition-all hover:bg-slate-200" />
	</a>
	<h1 class="text-center text-2xl font-bold">{data.name} ({data.kode})</h1>
	<p class="text-center font-medium">Kelas {data.kelas}</p>
	{#each data.dosen as dosen}
		<p class="text-center text-xs text-muted-foreground">{dosen}</p>
	{/each}
</div>

<h2 class="pb-2 text-center text-xl font-bold">Nilai</h2>
<Table.Root class="mb-6">
	<Table.Header>
		<Table.Row>
			<Table.Head>#</Table.Head>
			<Table.Head>Nama</Table.Head>
			<Table.Head>Bobot</Table.Head>
			<Table.Head>Nilai</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.nilai as nilai, i (i)}
			<Table.Row>
				<Table.Cell class="font-medium">{i + 1}</Table.Cell>
				<Table.Cell>{nilai.nama}</Table.Cell>
				<Table.Cell>{nilai.bobot * 100}%</Table.Cell>
				<Table.Cell>{nilai.nilai}</Table.Cell>
			</Table.Row>
		{/each}
		<Table.Row>
			<Table.Cell></Table.Cell>
			<Table.Cell></Table.Cell>
			<Table.Cell class="font-medium">Weighted average</Table.Cell>
			<Table.Cell
				>{data.nilai.reduce((acc, curr) => acc + curr.nilai * curr.bobot, 0) /
					data.nilai.reduce((acc, curr) => acc + curr.bobot, 0)}</Table.Cell
			>
		</Table.Row>
	</Table.Body>
</Table.Root>

<h2 class="pb-2 text-center text-xl font-bold">Kehadiran</h2>
<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>#</Table.Head>
			<Table.Head>Tanggal</Table.Head>
			<Table.Head>Topik</Table.Head>
			<Table.Head>Status</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.kehadiran as kehadiran, i (i)}
			<Table.Row>
				<Table.Cell class="font-medium">{i + 1}</Table.Cell>
				<Table.Cell>{kehadiran.tanggal}</Table.Cell>
				<Table.Cell>
					{kehadiran.materi}
				</Table.Cell>
				<Table.Cell>
					{kehadiran.status}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
