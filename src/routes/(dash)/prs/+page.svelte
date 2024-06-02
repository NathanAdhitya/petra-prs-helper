<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronsUpDown, CircleMinus, SlidersHorizontal } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import type { MataKuliah } from '$lib/mata-kuliah';
	import { dowMap, timeToString } from '$lib/mock-data';
	import { cn } from '$lib/utils.js';
	import { onMount, tick } from 'svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import clsx from 'clsx';
	import Schedule from './schedule.svelte';
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

	// Quick TS Helper to tell TS that the value is not null or undefined
	function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
		return value !== null && value !== undefined;
	}

	$: computedSchedule = chosenMatkul
		.map((matkul) => {
			if (!(matkul.kode in chosenClasses)) return undefined;
			if (!chosenClasses[matkul.kode][currentPlanSelected.value]) return undefined;
			const matchedKelas = matkul.kelas.find(
				(v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
			);

			if (matchedKelas) {
				return {
					dayOfWeek: matchedKelas.jadwal[0].dayOfWeek - 1,
					startHour: matchedKelas.jadwal[0].startHour,
					startMinute: matchedKelas.jadwal[0].startMinute,
					lengthMinutes: matchedKelas.jadwal[0].durasi,
					...matkul,
					...matchedKelas
				};
			}
		})
		.filter(notEmpty);
</script>

<h1 class="text-4xl font-bold">Pendaftaran Rencana Studi</h1>
<div class="flex h-full w-full gap-4">
	<Card.Root class="flex h-full w-1/3 max-w-sm flex-col">
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
				<Popover.Content class="w-full max-w-md p-0" side="bottom-start">
					<Command.Root class="max-h-72">
						<div class="relative">
							<Command.Input class="w-full" placeholder="Cari mata kuliah..." />
							<div class="absolute right-0 top-0 m-0.5">
								<Popover.Root>
									<Popover.Trigger asChild let:builder>
										<Button builders={[builder]} variant="outline" size="icon">
											<SlidersHorizontal class="h-4 w-4" />
										</Button>
									</Popover.Trigger>
									<Popover.Content strategy="fixed" side="right-start" sideOffset={4}>
										<h2 class="text-lg font-semibold">Filters</h2>
									</Popover.Content>
								</Popover.Root>
							</div>
						</div>
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
									to select more
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
							<div class="flex items-center justify-center">
								<Card.Title class="text-wrap">
									{properCase(matkul.nama)}
								</Card.Title>
								<button
									class="ml-auto size-5 text-slate-500 transition-colors hover:text-slate-700"
									on:click={() => {
										chosenMatkul = chosenMatkul.filter((item) => item !== matkul);
									}}
								>
									<CircleMinus class="h-full w-full transition-colors" />
								</button>
							</div>

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
						<Card.Footer></Card.Footer>
					</Card.Root>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>

	<div class="flex h-full w-full flex-1 flex-col gap-4">
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
			<Schedule schedules={computedSchedule} let:schedule>
				<div
					class={clsx(
						'h-full w-full rounded-lg px-1 py-0.5',
						matkulColors[
							chosenMatkul.findIndex((v) => v.kode === schedule.kode) % matkulColors.length
						]
					)}
				>
					<div class="text-xs leading-3 text-muted-foreground">
						{timeToString(schedule.startHour, schedule.startMinute)} - {timeToString(
							schedule.startHour,
							schedule.startMinute + schedule.lengthMinutes
						)}
					</div>
					<div class="font-semibold leading-5 max-xl:text-sm">
						{properCase(schedule.nama)}
					</div>
					<div class="text-sm text-muted-foreground">
						Kelas {schedule.kelas}
					</div>
				</div>
			</Schedule>
		</div>
	</div>
</div>
