<script lang="ts" context="module">
	import { jadwalKuliah, type MataKuliah } from '$lib/mata-kuliah';

	export interface ComputedSchedule extends Omit<MataKuliahWithColor, 'kelas'> {
		dayOfWeek: number;
		startHour: number;
		startMinute: number;
		lengthMinutes: number;
		priority: number;
		kelas: string[];
		kelasObj: MataKuliah['kelas'];
		currentlySelected: boolean;
		planIdx: number[];
	}

	export interface MatkulOption {
		label: string;
		value: string;
		kode: string;
		reference: MataKuliah;
	}
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronDown, Info, ArrowUpNarrowWide } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import { cn, focusTriggerNextTick, notEmpty } from '$lib/utils.js';
	import { onMount, tick } from 'svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Resizable from '$lib/components/ui/resizable';
	import {
		ChosenClassesUtils,
		ChosenMatkulUtils,
		chosenClasses,
		chosenMatkul,
		jadwalDiffs,
		prsSubmitted,
		type MataKuliahWithColor
	} from '$lib/mk-state';
	import { lazyShortenMatkulName, properCase } from '$lib/mk-utils';
	import clsx from 'clsx';
	import { quartOut } from 'svelte/easing';
	import { derived } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import MatkulFilter, { type FilterFunction } from './matkul-filter.svelte';
	import MatkulCard from './matkul-card.svelte';
	import MatkulScheduleCard from './matkul-schedule-card.svelte';
	import Schedule from './schedule.svelte';
	import { keyboardStore } from '$lib/kbd';
	import { titleStore } from '$lib/stores';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import PrsExport from './prs-export.svelte';
	import PrsMigrate from './prs-migrate.svelte';

	onMount(() => ($titleStore = 'PRS'));

	$: matkulOptions = $jadwalKuliah.map((item) => ({
		label: properCase(item.nama).trim(),
		value: item.kode + ' - ' + properCase(item.nama).trim(),
		kode: item.kode,
		reference: item
	})) satisfies MatkulOption[];

	let listJurusan = Array.from(new Set($jadwalKuliah.map((m) => m.unit)));
	$: holdingShift = $keyboardStore.shift;

	const chosenSksCount = derived(chosenMatkul, ($chosenMatkul) =>
		$chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0)
	);

	let validationDialogOpen = false;

	let open = false;

	let emphasizeMatkulKode: string | null = null;
	let openMatkulSelectionKode: string | null = null;
	let openMatkulFocusedClass: string | null = null;
	let openMatkulPlanIdx: number | null = null;
	let emphasizePilihan: number | null = null;

	let pilihanValue: string | undefined = 'Semua';
	let lastPilihanValue: string | undefined = pilihanValue;
	$: {
		tick().then(() => {
			if (pilihanValue === undefined) {
				pilihanValue = lastPilihanValue;
			} else {
				lastPilihanValue = pilihanValue;
			}
		});
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
		if (!$prsSubmitted) {
			const result = ChosenMatkulUtils.toggle(matkul.reference);
			if (!result) {
				toast.error('Mata kuliah tidak dapat ditambahkan karena melebihi batas SKS');
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
			existing.kelasObj = [...existing.kelasObj, ...val.kelasObj];
			existing.planIdx = [...existing.planIdx, ...val.planIdx];
			existing.currentlySelected ||= val.currentlySelected;
			existing.priority = Math.max(existing.priority, val.priority);
		} else {
			acc.push(val);
		}

		return acc;
	}
	let filteredMakul = [];
	let filterFunction: FilterFunction = () => false;
	$: filteredMakul = matkulOptions.filter(filterFunction);

	$: computedSchedule = $chosenMatkul
		.map((matkul) => {
			if (openMatkulSelectionKode === matkul.kode) {
				// If current matkul is open, show all classes
				return (
					matkul.kelas
						.map((kelas) =>
							kelas.jadwal.map(
								(jadwal) =>
									({
										dayOfWeek: jadwal.dayOfWeek - 1,
										startHour: jadwal.startHour,
										startMinute: jadwal.startMinute,
										lengthMinutes: jadwal.durasi,
										...matkul,
										kelas: [kelas.kelas],
										kelasObj: [kelas],
										priority: 1,
										currentlySelected: openMatkulFocusedClass === kelas.kelas.toLowerCase(),
										planIdx: $chosenClasses[matkul.kode]
											?.map((v, i) => (v === kelas.kelas ? i : null))
											.filter(notEmpty) ?? [-1]
									}) satisfies ComputedSchedule
							)
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
								.map(
									(jadwal) =>
										({
											dayOfWeek: jadwal.dayOfWeek - 1,
											startHour: jadwal.startHour,
											startMinute: jadwal.startMinute,
											lengthMinutes: jadwal.durasi,
											priority: 0,
											...matkul,
											kelas: [matchedKelas.kelas],
											kelasObj: [matchedKelas],
											currentlySelected: true,
											planIdx: [idx]
										}) satisfies ComputedSchedule
								)
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

<div class="flex min-w-96 items-center justify-between gap-8">
	<h1 class="text-4xl font-bold">Penyusun Rencana Studi</h1>
	<div class="flex flex-col items-end">
		<Tooltip.Root openDelay={0}>
			<Tooltip.Trigger>
				<div class="flex items-center gap-2 text-sm">
					Tentang akurasi data <Info class="h-4 w-4 opacity-50" />
				</div>
			</Tooltip.Trigger>
			<Tooltip.Content side="left" class="max-w-sm">
				Sumber data adalah hasil scraping. Data mungkin tidak akurat / sudah ketinggalan. Jika
				menurut Anda data ini terlalu jauh dari realita, silahkan buka isu di GitHub atau hubungi
				maintainer.
			</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root openDelay={0}>
			<Tooltip.Trigger>
				<div class="flex items-center gap-2 text-sm">
					Tentang kemampuan alat <Info class="h-4 w-4 opacity-50" />
				</div>
			</Tooltip.Trigger>
			<Tooltip.Content side="left" class="max-w-sm">
				Alat ini tidak terhubung dengan sistem PRS. Alat ini adalah alat bantuan terpisah dari
				sistem Petra. Gunakanlah dengan bijak. Pembuat alat ini tidak bertanggung jawab atas segala
				akibat dari penggunaan alat ini.
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
<div class="flex h-full w-full gap-4">
	<Resizable.PaneGroup direction="horizontal" class="gap-2">
		{#if !$prsSubmitted}
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
										<MatkulFilter {listJurusan} disabled={$prsSubmitted} bind:filterFunction />
									</div>

									<Command.List>
										<Command.Empty
											>Mata kuliah tidak ditemukan.<br />Pastikan filter sudah sesuai 😉</Command.Empty
										>
										<Command.Group class="!overflow-auto">
											{#each filteredMakul as matkul (matkul.kode)}
												<Command.Item
													value={matkul.value}
													onSelect={() => onSelectMatkul(matkul, ids)}
												>
													<span class="absolute text-muted-foreground">{matkul.kode} </span>
													<span class="ml-[8ch]">
														{matkul.label}
														<span class="text-xs text-muted-foreground">
															{matkul.reference.sks} SKS</span
														>
													</span>
													<Check
														class={cn(
															'ml-auto mr-2 h-4 w-4',
															!$chosenMatkul.some((v) => v.kode === matkul.reference.kode) &&
																'text-transparent'
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
											{$chosenSksCount} / {ChosenMatkulUtils.sksLimit} SKS dipilih
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
								{#each $chosenMatkul as matkul, i (matkul.kode)}
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										class="mb-2"
										on:mouseenter={() => {
											emphasizeMatkulKode = matkul.kode;
										}}
										on:mouseleave={() => {
											if (emphasizeMatkulKode === matkul.kode) emphasizeMatkulKode = null;
										}}
									>
										<MatkulCard
											isMissing={$jadwalDiffs[i] === false}
											{pilihanIndexes}
											{matkul}
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
		{/if}
		<Resizable.Pane minSize={60} defaultSize={70}>
			<div class="flex h-full w-full flex-1 flex-col gap-4">
				<div class="flex flex-wrap items-center gap-4 rounded-lg border-2 bg-slate-50 p-2 px-4">
					<div class="flex-1 text-sm">
						<span class="font-medium">Total SKS:</span>
						{$chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0)} / {ChosenMatkulUtils.sksLimit}
					</div>
					<PrsMigrate />
					<div class="flex flex-wrap justify-end gap-4">
						<PrsExport />
						<Dialog.Root>
							<Dialog.Trigger asChild let:builder>
								<Button variant="destructive" builders={[builder]}>Reset</Button>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Reset</Dialog.Title>
								</Dialog.Header>
								<Dialog.Description>
									Isi PRS akan dihapus. Apakah Anda yakin? Aksi ini tidak dapat dibatalkan.
								</Dialog.Description>
								<Dialog.Footer>
									<Dialog.Close asChild let:builder>
										<Button
											variant="secondary"
											builders={[builder]}
											on:click={() => {
												validationDialogOpen = false;
											}}
										>
											Batal
										</Button>
									</Dialog.Close>
									<Dialog.Close asChild let:builder>
										<Button
											builders={[builder]}
											on:click={() => {
												ChosenMatkulUtils.reset();
												ChosenClassesUtils.reset();
												$prsSubmitted = false;
											}}
											variant="destructive"
										>
											Reset
										</Button>
									</Dialog.Close>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
					</div>
					<!-- <Dialog.Root bind:open={validationDialogOpen}>
						<Dialog.Trigger asChild let:builder>
							<Button builders={[builder]}>Cek</Button>
						</Dialog.Trigger>
						{#key $chosenClasses}
							{#key $chosenMatkul}
								{#await ChosenClassesUtils.validate()}
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Cek PRS</Dialog.Title>
										</Dialog.Header>
										<Dialog.Description>
											<div class="flex items-center gap-2">
												<LoaderCircle class="inline h-4 w-4 animate-spin text-blue-800" />
												<p class="text-blue-800">Memastikan PRS yang akan dikirim valid...</p>
											</div>
										</Dialog.Description>
										<Dialog.Footer>
											<Dialog.Close asChild let:builder>
												<Button variant="secondary" builders={[builder]}>Batal</Button>
											</Dialog.Close>
										</Dialog.Footer>
									</Dialog.Content>
								{:then messages}
									{@const fatalCount = messages.filter((v) => v.type === 'fatal').length}
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Kirim untuk validasi</Dialog.Title>
										</Dialog.Header>
										<Dialog.Description>
											<div class="mb-2">
												{#if messages.length === 0}
													<p class="flex items-center gap-2 text-green-700">
														<CircleCheck class="h-4 w-4" /> PRS tidak memiliki masalah.
													</p>
												{:else}
													<p class="font-medium">
														Ditemukan beberapa masalah dalam pengecekan otomatis:
													</p>
													<ul class="list-disc">
														{#each messages as { type, message }}
															<li class="ml-6">
																{#if type === 'fatal'}
																	<CircleX class="inline-block h-4 w-4 text-red-800" />
																{:else if type == 'warning'}
																	<TriangleAlert class="inline-block h-4 w-4 text-yellow-800" />
																{:else}
																	<Info class="inline-block h-4 w-4" />
																{/if}

																{message}
															</li>
														{/each}
													</ul>
												{/if}
											</div>

											{#if fatalCount === 0}
												<p>
													PRS tidak dapat diubah setelah dikirim. Pastikan Anda telah memilih kelas
													yang benar. Hubungi dosen wali jika terdapat kesalahan.
												</p>
											{:else}
												<p>
													PRS butuh perbaikan sebelum dapat dikirim. Perbaiki masalah fatal (<CircleX
														class="inline-block h-4 w-4 text-red-800"
													/>) terlebih dahulu sebelum mencoba lagi.
												</p>
											{/if}
										</Dialog.Description>
										<Dialog.Footer>
											<Dialog.Close asChild let:builder>
												<Button variant="secondary" builders={[builder]}>Batal</Button>
											</Dialog.Close>
											{#if fatalCount === 0}
												<Dialog.Close asChild let:builder>
													<Button
														builders={[builder]}
														on:click={() => {
															$prsSubmitted = true;
														}}
													>
														Kirim
													</Button>
												</Dialog.Close>
											{/if}
										</Dialog.Footer>
									</Dialog.Content>
								{/await}
							{/key}
						{/key}
					</Dialog.Root> -->
				</div>
				<div class="h-full w-full overflow-auto rounded-lg border-2">
					<Schedule
						bind:emphasizePilihan
						bind:pilihanValue
						schedules={computedSchedule}
						let:schedule
					>
						{@const busy = openMatkulSelectionKode !== null}
						<Popover.Root>
							<Popover.Trigger asChild let:builder>
								{#key busy}
									<MatkulScheduleCard
										builders={busy ? [] : [builder]}
										{schedule}
										{openMatkulSelectionKode}
										bind:openMatkulFocusedClass
										{openMatkulPlanIdx}
										{emphasizeMatkulKode}
										{emphasizePilihan}
									/>
								{/key}
							</Popover.Trigger>
							<Popover.Content side="right-start" class="w-96 max-w-96">
								<div class="flex-col gap-2">
									<h4 class="font-medium leading-none">
										{properCase(schedule.nama)} ({lazyShortenMatkulName(
											properCase(schedule.nama),
											true
										)})
									</h4>
									<div class="mb-2 text-sm text-muted-foreground">
										{schedule.kode} - {schedule.sks} SKS
									</div>
									<div class="text-sm text-muted-foreground">
										<span class="font-semibold">Unit:</span>
										{schedule.unit}
									</div>
									{#if schedule.kelasObj.length > 0}
										{@const kelasObj = schedule.kelasObj[0]}
										{#if 'keterangan' in kelasObj}
											<div class="text-sm text-muted-foreground">
												<span class="font-semibold">Keterangan:</span>
												{kelasObj.keterangan}
											</div>
										{/if}

										<div class="text-sm text-muted-foreground">
											<span class="font-semibold">Diterima/kapasitas:</span>
											{kelasObj.accepted}/{kelasObj.capacity}
										</div>

										{#if kelasObj.jadwalUts.length > 0}
											<div class="text-sm text-muted-foreground">
												<span class="font-semibold">UTS:</span>
												{#if kelasObj.jadwalUts.length === 1}
													{new Date(kelasObj.jadwalUts[0].date).toLocaleString('id-ID', {
														weekday: 'long',
														day: 'numeric',
														month: 'long',
														year: 'numeric',
														hour: 'numeric',
														minute: 'numeric',
														timeZoneName: 'short'
													})} ({kelasObj.jadwalUts[0].lengthMinutes} menit)
												{:else}
													<ul class="list-disc pl-6">
														{#each kelasObj.jadwalUts as jadwal}
															<li>
																{new Date(jadwal.date).toLocaleString('id-ID', {
																	weekday: 'long',
																	day: 'numeric',
																	month: 'long',
																	year: 'numeric',
																	hour: 'numeric',
																	minute: 'numeric',
																	timeZoneName: 'short'
																})} ({jadwal.lengthMinutes} menit)
															</li>
														{/each}
													</ul>
												{/if}
											</div>
										{/if}

										{#if kelasObj.jadwalUas.length > 0}
											<div class="text-sm text-muted-foreground">
												<span class="font-semibold">UAS:</span>
												{#if kelasObj.jadwalUas.length === 1}
													{new Date(kelasObj.jadwalUas[0].date).toLocaleString('id-ID', {
														weekday: 'long',
														day: 'numeric',
														month: 'long',
														year: 'numeric',
														hour: 'numeric',
														minute: 'numeric',
														timeZoneName: 'short'
													})} ({kelasObj.jadwalUas[0].lengthMinutes} menit)
												{:else}
													<ul class="list-disc pl-6">
														{#each kelasObj.jadwalUas as jadwal}
															<li>
																{new Date(jadwal.date).toLocaleString('id-ID', {
																	weekday: 'long',
																	day: 'numeric',
																	month: 'long',
																	year: 'numeric',
																	hour: 'numeric',
																	minute: 'numeric',
																	timeZoneName: 'short'
																})} ({jadwal.lengthMinutes} menit)
															</li>
														{/each}
													</ul>
												{/if}
											</div>
										{/if}
									{/if}
									<div class="mt-2 flex items-center text-sm text-muted-foreground">
										Terpilih pada prioritas
										<div class="flex items-center pl-1 text-muted-foreground">
											<ArrowUpNarrowWide class="h-4 w-4 opacity-50" />
											<p>
												{schedule.planIdx
													.map((v) => v + 1)
													.sort()
													.join(', ')}
											</p>
										</div>
									</div>
								</div>
							</Popover.Content>
						</Popover.Root>
					</Schedule>
				</div>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
