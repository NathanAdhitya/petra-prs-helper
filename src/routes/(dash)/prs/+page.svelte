<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronsUpDown } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import { cn } from '$lib/utils.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import type { MataKuliah } from '$lib/mata-kuliah';
	import { onMount, tick } from 'svelte';
	import { dowMap, timeToString } from '$lib/mock-data';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select/index.js';
	import clsx from 'clsx';
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

	let holdingShift = false;

	onMount(() => {
		const onKeyUp = (e: KeyboardEvent) => {
			if (e.key === 'Shift') {
				holdingShift = false;
			}
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Shift') {
				holdingShift = true;
			}
		};

		document.addEventListener('keyup', onKeyUp);
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('keyup', onKeyUp);
			document.removeEventListener('keydown', onKeyDown);
		};
	});

	const chosenMatkulLimit = 10;
	const sksMatkulLimit = 24;
	const matkulColors = [
		'bg-blue-100',
		'bg-green-100',
		'bg-yellow-100',
		'bg-red-100',
		'bg-purple-100',
		'bg-pink-100',
		'bg-indigo-100',
		'bg-cyan-100',
		'bg-teal-100',
		'bg-lime-100'
	];
	let chosenMatkul: MataKuliah[] = [];
	let validationDialogOpen = false;

	let chosenClasses: Record<string, string[]> = {};

	let open = false;
	let value = '';

	let startingTimeHour = 7;
	let endingTimeHour = 21;

	let currentPlanSelected = {
		label: 'Pilihan 1',
		value: 0
	};

	let submitted = false;

	function closeAndFocusTrigger(triggerId: string) {
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<h1 class="text-4xl font-bold">Pendaftaran Rencana Studi</h1>
<div class="flex h-full w-full gap-4">
	<Card.Root class="flex h-full w-full max-w-sm flex-col">
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
												if (
													chosenMatkul.length < chosenMatkulLimit &&
													chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0) +
														matkul.reference.sks <=
														sksMatkulLimit
												) {
													chosenMatkul = [...chosenMatkul, matkul.reference];
												}
											}
										}

										if (!holdingShift) {
											closeAndFocusTrigger(ids.trigger);
											open = false;
										}
									}}
								>
									<span class="mr-4 text-muted-foreground">{matkul.kode} </span>
									<span>
										{matkul.label}
										<span class="text-xs text-muted-foreground"> {matkul.reference.sks} SKS</span>
									</span>
									<Check
										class={cn(
											'ml-auto mr-2 h-4 w-4',
											!chosenMatkul.includes(matkul.reference) && 'text-transparent'
										)}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
						<div class="flex items-center justify-center px-4 py-2">
							<div>
								<p class="text-sm text-muted-foreground">
									Hold
									<kbd
										class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
									>
										<span class="text-xs">Shift</span>
									</kbd>
									to stay
								</p>
							</div>
							<div class="ml-auto text-sm text-muted-foreground">
								{chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0)} / {sksMatkulLimit} SKS dipilih
							</div>
						</div>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</Card.Header>
		<Card.Content class="relative h-full overflow-hidden">
			<div class="absolute left-0 top-0 flex h-full w-full flex-col gap-2 overflow-y-auto p-4 pt-0">
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
										class="w-full justify-between"
									>
										{(chosenClasses[matkul.kode] &&
											`${chosenClasses[matkul.kode][currentPlanSelected.value]} (${
												dowMap[
													matkul.kelas.find(
														(v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
													)?.jadwal[0].dayOfWeek ?? 0
												]
											}, ${timeToString(
												matkul.kelas.find(
													(v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
												)?.jadwal[0].startHour ?? 0,
												matkul.kelas.find(
													(v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
												)?.jadwal[0].startMinute ?? 0
											)} - ${timeToString(
												matkul.kelas.find(
													(v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
												)?.jadwal[0].startHour ?? 0,
												(matkul.kelas.find(
													(v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
												)?.jadwal[0].startMinute ?? 0) +
													(matkul.kelas.find(
														(v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
													)?.jadwal[0].durasi ?? 0)
											)})`) ||
											'Pilih kelas...'}
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
																chosenClasses[matkul.kode][currentPlanSelected.value] ===
																	kelas.kelas
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
			<div>
				Total SKS: {chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0)} / {sksMatkulLimit}
			</div>
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
		<div class="h-full w-full overflow-auto rounded-lg border-2">
			<table class="h-full w-full border-collapse overflow-auto rounded-lg bg-slate-50 p-4">
				<thead>
					<th class="sticky top-0 bg-slate-100 p-2"></th>
					<th class="sticky top-0 bg-slate-100 p-2"></th>
					{#each ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as day}
						<th class="sticky top-0 border bg-slate-100 p-2">{day}</th>
					{/each}
				</thead>
				<tbody>
					{#each Array.from({ length: (endingTimeHour - startingTimeHour) * 2 }, (_, i) => i) as hour}
						<tr>
							<td
								class="h-6 w-0 -translate-y-1/2 bg-slate-100 px-4 py-1 pr-2 text-xs text-muted-foreground"
							>
								{hour % 2 === 0
									? `${String(startingTimeHour + Math.floor(hour / 2)).padStart(2, '0')}:${String(
											(hour % 2) * 30
										).padStart(2, '0')}`
									: ''}
							</td>
							<td class="w-2 border-y bg-slate-100"></td>
							{#each [1, 2, 3, 4, 5, 6] as day}
								<td class="relative border">
									{#each chosenMatkul as matkul, i}
										{#if chosenClasses[matkul.kode] && chosenClasses[matkul.kode][currentPlanSelected.value] && matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value])?.jadwal[0].dayOfWeek === day && matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value])?.jadwal[0].startHour === startingTimeHour + Math.floor(hour / 2) && matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value])?.jadwal[0].startMinute === (hour % 2) * 30}
											<div
												style={`height: calc(${((matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value])?.jadwal[0].durasi ?? 0) * 100) / 30}% + ${(matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value])?.jadwal[0].durasi ?? 0) / 30}px)`}
												class={clsx(
													`absolute right-0 top-0 w-full break-words rounded-lg p-2 shadow-sm`,
													matkulColors[i]
												)}
											>
												<div class="lading-3 text-xs text-muted-foreground">
													{timeToString(
														matkul.kelas.find(
															(v) =>
																v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
														)?.jadwal[0].startHour ?? 0,
														matkul.kelas.find(
															(v) =>
																v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
														)?.jadwal[0].startMinute ?? 0
													)} - {timeToString(
														matkul.kelas.find(
															(v) =>
																v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
														)?.jadwal[0].startHour ?? 0,
														(matkul.kelas.find(
															(v) =>
																v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
														)?.jadwal[0].startMinute ?? 0) +
															(matkul.kelas.find(
																(v) =>
																	v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
															)?.jadwal[0].durasi ?? 0)
													)}
												</div>
												<div class="font-semibold leading-5 max-xl:text-sm">
													{properCase(matkul.nama)}
												</div>
												<div class="text-muted-foreground">
													Kelas {matkul.kelas.find(
														(v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
													)?.kelas}
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
</div>
