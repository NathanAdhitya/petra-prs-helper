<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronDown, CircleMinus, Trash } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import { dowMap, timeToString } from '$lib/mock-data';
	import { cn } from '$lib/utils.js';

	import { properCase } from '$lib/mk-utils';
	import type { MataKuliah } from '$lib/mata-kuliah';
	import { createState } from 'cmdk-sv';
	import { tick } from 'svelte';
	import MatkulClassSelector from './matkul-class-selector.svelte';

	export let matkulColors: string[];
	export let emphasizeMatkulKode: string | null;
	export let matkul: MataKuliah;
	export let chosenMatkul: MataKuliah[];
	export let i: number;
	export let chosenClasses: Record<string, string[]>;
	export let currentPlanSelected: { value: number };

	export let onOpenChanged: (open: boolean) => void = () => {};
	export let onFocusedToChanged: (focusedTo: string | null) => void = () => {};

	const state = createState();
	let open = false;

	$: onFocusedToChanged(open ? $state.value.split(' (')[0].toLowerCase() : null);
	$: onOpenChanged(open);
	$: maximumPlanCount = Math.min(3, matkul.kelas.length);

	let planCount = 1;

	$: {
		// Make sure to cut the chosenClasses array to the maximum plan count
		if (chosenClasses[matkul.kode])
			chosenClasses[matkul.kode].length = Math.min(
				chosenClasses[matkul.kode].length,
				maximumPlanCount
			);
	}

	$: {
		// UX: If there is only one available class for the matkul, select it
		if (matkul.kelas.length === 1) {
			chosenClasses = {
				...chosenClasses,
				[matkul.kode]: [matkul.kelas[0].kelas]
			};
		}
	}
</script>

<Card.Root
	class={matkulColors[i]}
	on:mouseenter={() => {
		emphasizeMatkulKode = matkul.kode;
	}}
	on:mouseleave={() => {
		if (emphasizeMatkulKode === matkul.kode) emphasizeMatkulKode = null;
	}}
>
	<Card.Header class="pb-2">
		<div class="flex items-center justify-center gap-4">
			<Card.Title class="text-wrap">
				{properCase(matkul.nama)}
			</Card.Title>
			<button
				class="ml-auto size-5 shrink-0 text-slate-500 transition-colors hover:text-slate-700"
				on:click={() => {
					chosenMatkul = chosenMatkul.filter((item) => item !== matkul);
				}}
			>
				<CircleMinus class="h-full w-full transition-colors" />
			</button>
		</div>

		<Card.Description>{matkul.kode} - {matkul.sks} SKS</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2 pb-2">
		{#each Array.from({ length: planCount }) as _, planIdx}
			<div class="flex gap-2">
				<MatkulClassSelector {planIdx} bind:matkul bind:chosenClasses />
				{#if planCount > 1}
					<Button
						variant="outline"
						size="icon"
						on:click={() => {
							// Slice at planIdx to remove the selected plan, then reduce the plan count
							chosenClasses[matkul.kode] = [
								...chosenClasses[matkul.kode].slice(0, planIdx),
								...chosenClasses[matkul.kode].slice(planIdx + 1)
							];
							planCount--;
						}}
					>
						<Trash class="h-4 w-4" />
					</Button>
				{/if}
			</div>
			<!-- <Popover.Root
				let:ids
				bind:open
				onOutsideClick={(e) => {
					if (!(e instanceof PointerEvent)) return;
					if (!(e.target instanceof HTMLElement)) return;

					// If clicking on anything which parent/current element has data-priority-click, don't close the popover
					const closestPriority = e.target.closest('[data-priority-click]');
					if (closestPriority) {
						e.preventDefault();

						closestPriority.dispatchEvent(new PointerEvent('click', { pointerType: 'mouse' }));

						// Hacky fix to make sure the other card gets clicked before the popover closes.
						tick().then(() => {
							open = false;
						});
					}
				}}
			>
				<Popover.Trigger asChild let:builder>
					{@const jadwal =
						chosenClasses[matkul.kode] &&
						matkul.kelas.find(
							(v) => v.kelas === chosenClasses[matkul.kode][currentPlanSelected.value]
						)?.jadwal[0]}
					<Button
						builders={[builder]}
						variant="outline"
						role="combobox"
						class="w-full justify-between overflow-hidden"
					>
						{(chosenClasses[matkul.kode] &&
							`${chosenClasses[matkul.kode][currentPlanSelected.value]} (${
								dowMap[jadwal?.dayOfWeek ?? 0]
							}, ${timeToString(jadwal?.startHour ?? 0, jadwal?.startMinute ?? 0)} - ${timeToString(
								jadwal?.startHour ?? 0,
								(jadwal?.startMinute ?? 0) + (jadwal?.durasi ?? 0)
							)})`) ||
							'Pilih kelas...'}
						<ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0">
					<Command.Root {state}>
						<Command.Input placeholder="Cari kelas..." />
						<Command.Empty>Kelas tidak ditemukan.</Command.Empty>
						<Command.Group>
							{#each matkul.kelas as kelas}
								{@const jadwal = kelas.jadwal[0]}
								<Command.Item
									onSelect={(currentValue) => {
										// replace first element of the array
										chosenClasses = {
											...chosenClasses,
											[matkul.kode]: [kelas.kelas, ...(chosenClasses[matkul.kode] ?? []).slice(1)]
										};

										open = false;
									}}
								>
									<Check
										class={cn(
											'mr-2 h-4 w-4',
											!(
												chosenClasses[matkul.kode] &&
												chosenClasses[matkul.kode][currentPlanSelected.value] === kelas.kelas
											) && 'text-transparent'
										)}
									/>
									{kelas.kelas} ({dowMap[jadwal.dayOfWeek]}, {timeToString(
										jadwal.startHour,
										jadwal.startMinute
									)} - {timeToString(jadwal.startHour, jadwal.startMinute + jadwal.durasi)})<span
										class="ml-4 text-muted-foreground">0/75</span
									>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root> -->
		{/each}
		{#if planCount < maximumPlanCount}
			<Button
				size="sm"
				on:click={() => {
					if (planCount < maximumPlanCount) planCount++;
				}}>Tambah Pilihan</Button
			>
		{/if}
	</Card.Content>
	<Card.Footer></Card.Footer>
</Card.Root>
