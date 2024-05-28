<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronsUpDown } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import { cn } from '$lib/utils.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import type { MataKuliah } from '$lib/mata-kuliah';
	import { tick } from 'svelte';
	import { dowMap, timeToString } from '$lib/mock-data';

	import * as Dialog from '$lib/components/ui/dialog';
	export let data;

	function properCase(str: string) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
		});
	}

	let matkulOptions = data.pilihanMataKuliah.map((item) => ({
		label: properCase(item.nama).trim(),
		value: item.kode + ' - ' + properCase(item.nama).trim(),
		kode: item.kode,
		reference: item
	}));

	const chosenMatkulLimit = 10;
	const matkulColors = [
		'bg-red-100/75',
		'bg-yellow-100/75',
		'bg-green-100/75',
		'bg-blue-100/75',
		'bg-indigo-100/75',
		'bg-purple-100/75',
		'bg-pink-100/75',
		'bg-red-200/75',
		'bg-yellow-200/75',
		'bg-green-200/75'
	];
	let chosenMatkul: MataKuliah[] = [];
	let validationDialogOpen = false;

	let chosenClasses: Record<string, string[]> = {};

	let open = false;
	let value = '';

	let startingTimeHour = 7;
	let startingTimeMinute = 0;
	let endingTimeHour = 21;
	let endingTimeMinute = 0;

	let submitted = false;

	function closeAndFocusTrigger(triggerId: string) {
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<h1 class="text-4xl font-bold">Pendaftaran Rencana Studi</h1>
<div class="flex h-full w-full gap-4">
	<Card.Root class="h-full w-full max-w-sm">
		<Card.Header>
			<Popover.Root bind:open let:ids>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						class="w-full justify-between"
					>
						Cari mata kuliah...
						<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-96 p-0">
					<Command.Root class="max-h-52">
						<Command.Input placeholder="Cari mata kuliah..." />
						<Command.Empty>Mata kuliah tidak ditemukan...</Command.Empty>
						<Command.Group class="!overflow-auto">
							{#each matkulOptions as matkul}
								<Command.Item
									value={matkul.value}
									onSelect={() => {
										if (!submitted) {
											// either remove or add
											if (chosenMatkul.includes(matkul.reference)) {
												chosenMatkul = chosenMatkul.filter((item) => item !== matkul.reference);
											} else {
												if (chosenMatkul.length < chosenMatkulLimit) {
													chosenMatkul = [...chosenMatkul, matkul.reference];
												}
											}
										}
									}}
								>
									<span class="mr-4 text-muted-foreground">{matkul.kode} </span>
									{matkul.label}
									<Check
										class={cn(
											'ml-auto mr-2 h-4 w-4',
											!chosenMatkul.includes(matkul.reference) && 'text-transparent'
										)}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
						<div class="px-4 py-2">{chosenMatkul.length}/{chosenMatkulLimit} dipilih</div>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</Card.Header>
		<Card.Content class="overflow-y-auto">
			<div class="flex flex-col gap-2">
				{#each chosenMatkul as matkul, i}
					<Card.Root class={matkulColors[i]}>
						<Card.Header class="pb-2">
							<Card.Title class="text-wrap">{properCase(matkul.nama)}</Card.Title>
							<Card.Description>{matkul.kode} - {matkul.sks} SKS</Card.Description>
						</Card.Header>
						<Card.Content class="pb-2">
							<Popover.Root let:ids>
								<Popover.Trigger asChild let:builder>
									<Button
										builders={[builder]}
										variant="outline"
										role="combobox"
										class="w-[200px] justify-between"
									>
										{chosenClasses[matkul.kode] || 'Pilih kelas...'}
										<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0">
									<Command.Root>
										<Command.Input placeholder="Cari kelas..." />
										<Command.Empty>Kelas tidak ditemukan.</Command.Empty>
										<Command.Group>
											{#each matkul.kelas as kelas}
												<Command.Item
													onSelect={(currentValue) => {
														chosenClasses = {
															...chosenClasses,
															[matkul.kode]: [kelas.kelas]
														};
													}}
												>
													<Check
														class={cn(
															'mr-2 h-4 w-4',
															!(
																chosenClasses[matkul.kode] &&
																chosenClasses[matkul.kode][0] === kelas.kelas
															) && 'text-transparent'
														)}
													/>
													{kelas.kelas} ({dowMap[kelas.jadwal[0].dayOfWeek]}, {timeToString(
														kelas.jadwal[0].startHour,
														kelas.jadwal[0].startMinute
													)} - {timeToString(
														kelas.jadwal[0].startHour,
														kelas.jadwal[0].startMinute + kelas.jadwal[0].durasi
													)}) <span class="ml-4 text-muted-foreground">0/75</span>
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.Root>
								</Popover.Content>
							</Popover.Root>
						</Card.Content>
						<Card.Footer>
							<Button
								class="ml-auto"
								variant="outline"
								on:click={() => {
									chosenMatkul = chosenMatkul.filter((item) => item !== matkul);
								}}
							>
								-
							</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>

	<div class="flex h-full w-full flex-col gap-4">
		<div class="flex items-center gap-4">
			<div>Total SKS: {chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0)}</div>
			<div>Status: {submitted ? 'Menunggu validasi' : 'Menunggu dikirim'}</div>
			<Dialog.Root bind:open={validationDialogOpen}>
				<Dialog.Trigger class="ml-auto">
					<Button disabled={submitted}>{submitted ? 'Terkirim' : 'Kirim untuk Validasi'}</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Apakah Anda yakin?</Dialog.Title>
						<Dialog.Description>
							PRS tidak dapat diubah setelah dikirim. Pastikan Anda telah memilih kelas yang benar.
							Hubungi dosen wali jika terdapat kesalahan.
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer>
						<Button
							on:click={() => {
								validationDialogOpen = false;
							}}>Batal</Button
						>
						<Button
							disabled={submitted}
							on:click={() => {
								submitted = true;
								validationDialogOpen = false;
							}}
						>
							Kirim
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>
		<table class="border-collapse rounded-lg bg-slate-50 p-4">
			<thead>
				<th class="border p-2">Waktu</th>
				{#each ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as day}
					<th class="border p-2">{day}</th>
				{/each}
			</thead>
			<tbody>
				{#each Array.from({ length: (endingTimeHour - startingTimeHour) * 2 }, (_, i) => i) as hour}
					<tr>
						<td class="border px-4 py-1">
							{`${String(startingTimeHour + Math.floor(hour / 2)).padStart(2, '0')}:${String(
								(hour % 2) * 30
							).padStart(2, '0')}`}
							-
							{`${String(
								startingTimeHour + Math.floor(hour / 2) + Math.floor(((hour % 2) * 30 + 30) / 60)
							).padStart(2, '0')}:${String(((hour % 2) * 30 + 30) % 60).padStart(2, '0')}`}
						</td>
						{#each [1, 2, 3, 4, 5, 6] as day}
							<td class="relative border">
								{#each chosenMatkul as matkul, i}
									{#if chosenClasses[matkul.kode] && chosenClasses[matkul.kode][0] && matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][0])?.jadwal[0].dayOfWeek === day && matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][0])?.jadwal[0].startHour === startingTimeHour + Math.floor(hour / 2) && matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][0])?.jadwal[0].startMinute === (hour % 2) * 30}
										<div
											style={`height: ${((matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][0])?.jadwal[0].durasi ?? 0) * 100) / 30}%`}
											class={`absolute top-1 w-full rounded-lg p-1 px-2 ${matkulColors[i]}`}
										>
											<div class="font-bold">{properCase(matkul.nama)}</div>
											<div class="text-muted-foreground">
												Kelas {matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][0])
													?.kelas}
											</div>
										</div>
									{/if}
								{/each}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
