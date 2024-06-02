<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronDown, ChevronsUpDown, SlidersHorizontal } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import type { MataKuliah } from '$lib/mata-kuliah';
	import { timeToString } from '$lib/mock-data';
	import { cn } from '$lib/utils.js';
	import { onMount, tick } from 'svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	import * as Dialog from '$lib/components/ui/dialog';
	import { lazyShortenMatkulName, properCase } from '$lib/mk-utils';
	import clsx from 'clsx';
	import Schedule from './schedule.svelte';
	import MatkulCard from './matkul-card.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	export let data;

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

	let emphasizeMatkulKode: string | null = null;
	let openMatkulSelectionKode: string | null = null;
	let openMatkulFocusedClass: string | null = null;

	let pilihanValue = ['1', '2', '3'];
	$: pilihanIndexes = pilihanValue.map((v) => parseInt(v) - 1);

	const onOpenChanged = (kodeMatkul: string) => {
		return (v: boolean) => {
			openMatkulSelectionKode = v ? kodeMatkul : null;
		};
	};

	const onFocusedToChanged = (focusedTo: string | null) => {
		openMatkulFocusedClass = focusedTo;
	};

	$: computedSchedule = chosenMatkul
		.map((matkul) => {
			if (openMatkulSelectionKode === matkul.kode) {
				// If current matkul is open, show all classes
				return matkul.kelas
					.map((kelas) =>
						kelas.jadwal.map((jadwal) => ({
							dayOfWeek: jadwal.dayOfWeek - 1,
							startHour: jadwal.startHour,
							startMinute: jadwal.startMinute,
							lengthMinutes: jadwal.durasi,
							...matkul,
							...kelas,
							currentlySelected: openMatkulFocusedClass === kelas.kelas.toLowerCase(),
							planIdx: chosenClasses[matkul.kode]?.indexOf(kelas.kelas) ?? -1
						}))
					)
					.flat(1);
			} else {
				if (!(matkul.kode in chosenClasses)) return undefined;
				return pilihanIndexes
					.map((idx) => {
						if (!chosenClasses[matkul.kode][idx]) return undefined;

						const matchedKelas = matkul.kelas.find(
							(v) => v.kelas === chosenClasses[matkul.kode][idx]
						);

						if (matchedKelas) {
							return matchedKelas.jadwal
								.map((jadwal) => ({
									dayOfWeek: jadwal.dayOfWeek - 1,
									startHour: jadwal.startHour,
									startMinute: jadwal.startMinute,
									lengthMinutes: jadwal.durasi,
									...matkul,
									...matchedKelas,
									currentlySelected: true,
									planIdx: idx
								}))
								.flat(1);
						}
					})
					.flat(1);
				// if (!chosenClasses[matkul.kode][currentPlanSelected.value]) return undefined;

				// const matchedKelas = matkul.kelas.find(
				// 	(v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
				// );

				// if (matchedKelas) {
				// 	return matchedKelas.jadwal
				// 		.map((jadwal) => ({
				// 			dayOfWeek: jadwal.dayOfWeek - 1,
				// 			startHour: jadwal.startHour,
				// 			startMinute: jadwal.startMinute,
				// 			lengthMinutes: jadwal.durasi,
				// 			...matkul,
				// 			...matchedKelas,
				// 			currentlySelected: true,
				// 			planIdx: currentPlanSelected.value
				// 		}))
				// 		.flat(1);
				// }
			}
		})
		.flat(1)
		.filter(notEmpty);
</script>

<h1 class="text-4xl font-bold">Pendaftaran Rencana Studi</h1>
<div class="flex h-full w-full gap-4">
	<Resizable.PaneGroup direction="horizontal" class="gap-2">
		<Resizable.Pane minSize={10} defaultSize={20}>
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
												<span class="text-xs text-muted-foreground">
													{matkul.reference.sks} SKS</span
												>
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
										{chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0)} / {sksMatkulLimit} SKS
										dipilih
									</div>
								</div>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</Card.Header>
				<Card.Content class="relative h-full overflow-hidden">
					<div
						class="absolute left-0 top-0 flex h-full w-full flex-col gap-2 overflow-y-auto p-4 pt-0"
					>
						{#each chosenMatkul as matkul, i}
							<MatkulCard
								{matkul}
								{matkulColors}
								bind:emphasizeMatkulKode
								bind:chosenMatkul
								bind:chosenClasses
								bind:currentPlanSelected
								{i}
								onOpenChanged={onOpenChanged(matkul.kode)}
								{onFocusedToChanged}
							/>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane minSize={60} defaultSize={70}>
			<div class="flex h-full w-full flex-1 flex-col gap-4">
				<div class="flex items-center gap-4 rounded-lg border-2 bg-slate-50 p-2 px-4">
					<div class="flex items-center gap-4 rounded-lg">
						<div class="text-lg font-medium">Pilihan</div>
						<ToggleGroup.Root size="sm" type="multiple" bind:value={pilihanValue}>
							{#each [1, 2, 3] as i}
								<ToggleGroup.Item
									value={i.toString()}
									class="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
								>
									{i}
								</ToggleGroup.Item>
							{/each}
						</ToggleGroup.Root>
					</div>
					<div class="ml-auto">
						Total SKS: {chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0)} / {sksMatkulLimit}
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
					<Schedule schedules={computedSchedule} let:schedule>
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class={clsx(
								'z-10 flex h-full w-full flex-col overflow-hidden break-words rounded-lg p-2 transition-all',
								schedule.currentlySelected
									? matkulColors[
											chosenMatkul.findIndex((v) => v.kode === schedule.kode) % matkulColors.length
										]
									: 'bg-slate-200',
								emphasizeMatkulKode === schedule.kode && 'shadow-xl',
								schedule.currentlySelected &&
									openMatkulSelectionKode === schedule.kode &&
									'shadow-xl',
								openMatkulSelectionKode === schedule.kode &&
									'pointer-events-auto cursor-pointer border-2 border-slate-300'
							)}
							on:mouseenter={() => {
								if (openMatkulSelectionKode === schedule.kode) {
									openMatkulFocusedClass = schedule.kelas.toLowerCase();
								}
							}}
							on:click={(e) => {
								if (openMatkulSelectionKode === schedule.kode) {
									chosenClasses = {
										...chosenClasses,
										[schedule.kode]: [schedule.kelas]
									};
								}
							}}
							data-priority-click
						>
							<div class="font-medium leading-5 max-xl:text-sm">
								{lazyShortenMatkulName(properCase(schedule.nama))}
							</div>
							<div class="text-sm leading-5 text-muted-foreground">
								Kelas {schedule.kelas}
							</div>
							<div class="text-xs leading-3 text-muted-foreground">
								{timeToString(schedule.startHour, schedule.startMinute)} - {timeToString(
									schedule.startHour,
									schedule.startMinute + schedule.lengthMinutes
								)}
							</div>
							<div class="ml-auto mt-auto text-xs">
								{#if schedule.planIdx === -1}
									Pilih
								{:else}
									Pilihan {schedule.planIdx + 1}
								{/if}
							</div>
						</div>
					</Schedule>
				</div>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
