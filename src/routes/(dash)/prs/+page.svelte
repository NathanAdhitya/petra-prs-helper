<script lang="ts" context="module">
	export interface ComputedSchedule extends Omit<MataKuliah, 'kelas'> {
		dayOfWeek: number;
		startHour: number;
		startMinute: number;
		lengthMinutes: number;
		kelas: string[];
		currentlySelected: boolean;
		planIdx: number[];
	}
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronDown, SlidersHorizontal } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import type { MataKuliah } from '$lib/mata-kuliah';
	import { focusTriggerNextTick, cn, notEmpty } from '$lib/utils.js';
	import { onDestroy, onMount, tick } from 'svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Resizable from '$lib/components/ui/resizable';
	import { properCase } from '$lib/mk-utils';
	import clsx from 'clsx';
	import { quartOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import MatkulCard from './matkul-card.svelte';
	import MatkulScheduleCard from './matkul-schedule-card.svelte';
	import Schedule from './schedule.svelte';
	import { chosenClasses, chosenMatkul } from '$lib/mk-state';
	import { derived } from 'svelte/store';
	import Input from '$lib/components/ui/input/input.svelte';
	export let data;
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	// console.log(data.pilihanMataKuliah.slice(10));

	let matkulOptions = data.pilihanMataKuliah.map((item) => ({
		label: properCase(item.nama).trim(),
		value: item.kode + ' - ' + properCase(item.nama).trim(),
		kode: item.kode,
		recommended: item.recommended,
		reference: item
	}));

	let listJurusan = Array.from(new Set(data.pilihanMataKuliah.map((m) => m.unit)));
	let rekomFilter = false;

	let chosenFilters: string[] = [data.dataUser.jurusan];

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

	const chosenMatkulLimit = 15;
	const sksMatkulLimit = 24;
	const matkulColors = [
		'bg-blue-200',
		'bg-green-200',
		'bg-yellow-200',
		'bg-red-200',
		'bg-purple-200',
		'bg-pink-200',
		'bg-indigo-200',
		'bg-cyan-200',
		'bg-teal-200',
		'bg-lime-200'
	];

	const chosenSksCount = derived(chosenMatkul, ($chosenMatkul) =>
		$chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0)
	);

	let validationDialogOpen = false;

	let open = false;
	let submitted = false;

	let emphasizeMatkulKode: string | null = null;
	let openMatkulSelectionKode: string | null = null;
	let openMatkulFocusedClass: string | null = null;
	let openMatkulPlanIdx: number | null = null;
	let emphasizePilihan: number | null = null;

	let pilihanValue: string | undefined = 'Semua';
	$: {
		if (pilihanValue === undefined) {
			tick().then(() => {
				pilihanValue = 'Semua';
			});
		}
	}

	$: pilihanIndexes =
		!pilihanValue || pilihanValue === 'Semua' ? [0, 1, 2] : [parseInt(pilihanValue) - 1];

	const onOpenChanged = (kodeMatkul: string) => {
		return (v: boolean, planIdx: number) => {
			openMatkulSelectionKode = v ? kodeMatkul : null;
			openMatkulPlanIdx = v ? planIdx : null;
		};
	};

	const onFocusedToChanged = (focusedTo: string | null) => {
		openMatkulFocusedClass = focusedTo;
	};

	const onSelectMatkul = (matkul: (typeof matkulOptions)[number], ids: { trigger: string }) => {
		if (!submitted) {
			// either remove or add
			if ($chosenMatkul.includes(matkul.reference)) {
				$chosenMatkul = $chosenMatkul.filter((item) => item !== matkul.reference);
			} else {
				if (
					$chosenMatkul.length < chosenMatkulLimit &&
					$chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0) + matkul.reference.sks <=
						sksMatkulLimit
				) {
					$chosenMatkul = [...$chosenMatkul, matkul.reference];
				}
			}
		}

		if (!holdingShift) {
			open = false;
			focusTriggerNextTick(ids.trigger);
		}
	};

	function mergeSimilarSchedules(acc: ComputedSchedule[], val: ComputedSchedule) {
		const existing = acc.find(
			(v) =>
				v.dayOfWeek === val.dayOfWeek &&
				v.startHour === val.startHour &&
				v.startMinute === val.startMinute &&
				v.lengthMinutes === val.lengthMinutes
		);

		// If the schedule already exists, then turn kelas into a string array, and planIdx into a number array
		if (existing) {
			existing.kelas = [...existing.kelas, ...val.kelas];
			existing.planIdx = [...existing.planIdx, ...val.planIdx];
			existing.currentlySelected ||= val.currentlySelected;
		} else {
			acc.push(val);
		}

		return acc;
	}
	let filteredMakul = [];
	$: filteredMakul = rekomFilter
		? matkulOptions.filter((m) => m.recommended === true)
		: matkulOptions.filter((m) => chosenFilters.includes(m.reference.unit));

	$: computedSchedule = $chosenMatkul
		.map((matkul) => {
			if (openMatkulSelectionKode === matkul.kode) {
				// If current matkul is open, show all classes
				return (
					matkul.kelas
						.map((kelas) =>
							kelas.jadwal.map((jadwal) => ({
								dayOfWeek: jadwal.dayOfWeek - 1,
								startHour: jadwal.startHour,
								startMinute: jadwal.startMinute,
								lengthMinutes: jadwal.durasi,
								...matkul,
								kelas: [kelas.kelas],
								currentlySelected: openMatkulFocusedClass === kelas.kelas.toLowerCase(),
								planIdx: $chosenClasses[matkul.kode]
									?.map((v, i) => (v === kelas.kelas ? i : null))
									.filter(notEmpty) ?? [-1]
							}))
						)
						.flat(1)
						// Merge schedules that has the same: dayOfWeek, startHour, startMinute, lengthMinute
						.reduce(mergeSimilarSchedules, [])
				);
			} else {
				if (!(matkul.kode in $chosenClasses)) return undefined;
				return pilihanIndexes
					.map((idx) => {
						if (!$chosenClasses[matkul.kode][idx]) return [];

						const matchedKelas = matkul.kelas.find(
							(v) => v.kelas === $chosenClasses[matkul.kode][idx]
						);

						if (matchedKelas) {
							return matchedKelas.jadwal
								.map((jadwal) => ({
									dayOfWeek: jadwal.dayOfWeek - 1,
									startHour: jadwal.startHour,
									startMinute: jadwal.startMinute,
									lengthMinutes: jadwal.durasi,
									...matkul,
									kelas: [matchedKelas.kelas],
									currentlySelected: true,
									planIdx: [idx]
								}))
								.flat(1);
						}

						return [];
					})
					.flat(1) // Merge schedules that has the same: dayOfWeek, startHour, startMinute, lengthMinute
					.reduce(mergeSimilarSchedules, []);
			}
		})
		.flat(1)
		.filter(notEmpty);

	// $: console.log(matkulOptions.length);
</script>

<h1 class="text-4xl font-bold">Pendaftaran Rencana Studi</h1>
<div class="flex h-full w-full gap-4">
	<Resizable.PaneGroup direction="horizontal" class="gap-2">
		<Resizable.Pane minSize={20} defaultSize={20}>
			<Card.Root class="flex h-full flex-col">
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
								<ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-full max-w-md p-0" side="bottom-start">
							<Command.Root class="max-h-72">
								<div class="relative">
									<Command.Input class="w-full" placeholder="Cari mata kuliah..." />

									<!-- This part is filter, should be moved because I kept editing the wrong code... -->
									<div class="absolute right-0 top-0 m-0.5">
										<Popover.Root>
											<Popover.Trigger asChild let:builder>
												<Button builders={[builder]} variant="outline" size="icon">
													<SlidersHorizontal class="h-5 w-5" />
												</Button>
											</Popover.Trigger>
											<Popover.Content strategy="fixed" side="right-start" sideOffset={4}>
												<h2 class="text-lg font-semibold">Filter mata kuliah</h2>
												<Separator />
												<div class="flex items-center justify-between gap-2">
													<h3 class="my-4 font-semibold">Rekomendasi</h3>
													<Switch bind:checked={rekomFilter} />
												</div>
												<Command.Root>
													<Command.Input placeholder="Cari jurusan" />
													<Command.Empty>Jurusan tidak ditemukan...</Command.Empty>
													<div class="max-h-72 overflow-y-auto">
														{#each listJurusan as jurusan}
															<Command.Item
																value={jurusan}
																onSelect={() => {
																	if (!submitted) {
																		// either remove or add
																		if (chosenFilters.includes(jurusan)) {
																			chosenFilters = chosenFilters.filter(
																				(item) => item !== jurusan
																			);
																		} else {
																			chosenFilters = [...chosenFilters, jurusan];
																		}
																	}

																	if (!holdingShift) {
																		open = true;
																		focusTriggerNextTick(ids.trigger);
																	}
																}}
															>
																<span>
																	{jurusan}
																</span>
																<Check
																	class={cn(
																		'ml-auto mr-2 h-4 w-4',
																		!chosenFilters.includes(jurusan) && 'text-transparent'
																	)}
																/>
															</Command.Item>
														{/each}
													</div>
												</Command.Root>
											</Popover.Content>
										</Popover.Root>
									</div>

									<!-- end of filter -->
								</div>

								<Command.List>
									<Command.Empty>Mata kuliah tidak ditemukan...</Command.Empty>
									<Command.Group class="!overflow-auto">
										{#each matkulOptions as matkul (matkul.kode)}
											<Command.Item
												value={matkul.value}
												onSelect={() => onSelectMatkul(matkul, ids)}
											>
												<span class="mr-4 text-muted-foreground">{matkul.kode} </span>
												<span>
													{matkul.label}
													<span class="text-xs text-muted-foreground">
														{matkul.reference.sks} SKS</span
													>
												</span>
												<Check
													class={cn(
														'ml-auto mr-2 h-4 w-4',
														!$chosenMatkul.includes(matkul.reference) && 'text-transparent'
													)}
												/>
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
								<div class="flex items-center justify-center px-4 py-2">
									<div>
										<p class="text-sm text-muted-foreground">
											Tahan
											<kbd
												class={clsx(
													'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 transition-colors',
													holdingShift
														? 'bg-primary text-primary-foreground'
														: 'bg-muted text-muted-foreground'
												)}
											>
												<span class="text-xs">Shift</span>
											</kbd>
											untuk memilih massal
										</p>
									</div>
									<div class="ml-auto text-sm text-muted-foreground">
										{$chosenSksCount} / {sksMatkulLimit} SKS dipilih
									</div>
								</div>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</Card.Header>
				<Card.Content class="relative h-full overflow-hidden">
					<div class="absolute left-0 top-0 flex h-full w-full flex-col overflow-y-auto p-4 pt-0">
						{#if $chosenMatkul.length === 0}
							<div class="px-4 text-center text-muted-foreground">
								Mata kuliah yang telah dipilih akan muncul di sini. Pilih mata kuliah yang ingin
								diambil.
							</div>
						{:else}
							{#each $chosenMatkul as matkul, i (matkul)}
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<div
									class="mb-2"
									in:slide={{ easing: quartOut }}
									on:mouseenter={() => {
										emphasizeMatkulKode = matkul.kode;
									}}
									on:mouseleave={() => {
										if (emphasizeMatkulKode === matkul.kode) emphasizeMatkulKode = null;
									}}
								>
									<MatkulCard
										{matkul}
										{matkulColors}
										{i}
										onOpenChanged={onOpenChanged(matkul.kode)}
										{onFocusedToChanged}
									/>
								</div>
							{/each}
						{/if}
					</div>
				</Card.Content>
			</Card.Root>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane minSize={60} defaultSize={70}>
			<div class="flex h-full w-full flex-1 flex-col gap-4">
				<div class="flex items-center gap-4 rounded-lg border-2 bg-slate-50 p-2 px-4">
					<div class="ml-auto">
						Total SKS: {$chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0)} / {sksMatkulLimit}
					</div>
					<div>Status: {submitted ? 'Menunggu validasi' : 'Menunggu dikirim'}</div>
					<Dialog.Root bind:open={validationDialogOpen}>
						<Dialog.Trigger>
							<Button disabled={submitted}>{submitted ? 'Terkirim' : 'Kirim untuk Validasi'}</Button
							>
						</Dialog.Trigger>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Apakah Anda yakin?</Dialog.Title>
								<Dialog.Description>
									PRS tidak dapat diubah setelah dikirim. Pastikan Anda telah memilih kelas yang
									benar. Hubungi dosen wali jika terdapat kesalahan.
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
					<Schedule
						bind:emphasizePilihan
						bind:pilihanValue
						schedules={computedSchedule}
						let:schedule
					>
						<MatkulScheduleCard
							{schedule}
							{matkulColors}
							{openMatkulSelectionKode}
							bind:openMatkulFocusedClass
							{openMatkulPlanIdx}
							{emphasizeMatkulKode}
							{emphasizePilihan}
						/>
					</Schedule>
				</div>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
