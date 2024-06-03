<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronDown, TriangleAlert } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import { dowMap, timeToString } from '$lib/mock-data';
	import { cn, focusTriggerNextTick } from '$lib/utils.js';

	import type { KelasMataKuliah, MataKuliah } from '$lib/mata-kuliah';
	import { createState } from 'cmdk-sv';
	import { tick } from 'svelte';
	import { ChosenClassesUtils, chosenClasses } from '$lib/mk-state';

	let open = false;
	let state = createState();

	export let planIdx: number;
	export let matkul: MataKuliah;

	export let onOpenChanged: (open: boolean) => void = () => {};
	export let onFocusedToChanged: (focusedTo: string | null) => void = () => {};

	$: onFocusedToChanged(open ? $state.value.split(' (')[0].toLowerCase() : null);
	$: onOpenChanged(open);

	function correctCurrentFocused(isOpen: boolean) {
		if (isOpen) {
			tick().then(() => {
				const selected = $chosenClasses[matkul.kode] && $chosenClasses[matkul.kode][planIdx];

				if (selected) {
					const findKelas = matkul.kelas.find(
						(v) => v.kelas === $chosenClasses[matkul.kode][planIdx]
					);
					if (findKelas) $state.value = stringifyKelas(findKelas) ?? $state.value;
				}
			});
		}
	}

	// When the popover is opened, make sure the selected state is in sync with the chosenClasses
	$: correctCurrentFocused(open);

	function stringifyKelas(kelas: KelasMataKuliah) {
		const jadwal = kelas.jadwal[0];

		return `${kelas.kelas} (${dowMap[jadwal.dayOfWeek]}, ${timeToString(
			jadwal.startHour,
			jadwal.startMinute
		)} - ${timeToString(jadwal.startHour, jadwal.startMinute + jadwal.durasi)})`;
	}
</script>

<Popover.Root
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
				// focusTriggerNextTick(ids.trigger);
				open = false;
			});
		}
	}}
>
	<Popover.Trigger asChild let:builder>
		{@const currentKelas =
			$chosenClasses[matkul.kode] &&
			matkul.kelas.find((v) => v.kelas === $chosenClasses[matkul.kode][planIdx])}
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			class="w-full justify-between overflow-hidden"
		>
			{(currentKelas && $chosenClasses[matkul.kode][planIdx] && stringifyKelas(currentKelas)) ||
				`Pilih kelas pilihan ${planIdx + 1}...`}
			<ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Command.Root {state}>
			<Command.Input placeholder="Cari kelas..." />
			<Command.Empty>Kelas tidak ditemukan.</Command.Empty>
			<Command.Group>
				{#each matkul.kelas as kelas}
					<Command.Item
						onSelect={(currentValue) => {
							// modify the chosenClasses object for the correct planIdx
							ChosenClassesUtils.setPlan(matkul.kode, planIdx, kelas.kelas);
							open = false;
						}}
						value={stringifyKelas(kelas)}
					>
						{#if $chosenClasses[matkul.kode] && $chosenClasses[matkul.kode].includes(kelas.kelas) && $chosenClasses[matkul.kode][planIdx] !== kelas.kelas}
							<TriangleAlert class="mr-2 h-4 w-4 text-yellow-500" />
						{:else}
							<Check
								class={cn(
									'mr-2 h-4 w-4',
									!(
										$chosenClasses[matkul.kode] &&
										$chosenClasses[matkul.kode][planIdx] === kelas.kelas
									) && 'text-transparent'
								)}
							/>
						{/if}

						{stringifyKelas(kelas)} <span class="ml-auto pl-2 text-muted-foreground">0/75</span>
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
