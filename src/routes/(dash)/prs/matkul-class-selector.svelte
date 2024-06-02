<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { Ban, Check, ChevronDown, CircleMinus, TriangleAlert } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import { dowMap, timeToString } from '$lib/mock-data';
	import { cn } from '$lib/utils.js';

	import { properCase } from '$lib/mk-utils';
	import type { MataKuliah } from '$lib/mata-kuliah';
	import { createState } from 'cmdk-sv';
	import { tick } from 'svelte';

	let open = false;
	let state = createState();

	export let planIdx: number;
	export let matkul: MataKuliah;
	export let chosenClasses: Record<string, string[]>;
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
				open = false;
			});
		}
	}}
>
	<Popover.Trigger asChild let:builder>
		{@const jadwal =
			chosenClasses[matkul.kode] &&
			matkul.kelas.find((v) => v.kelas === chosenClasses[matkul.kode][planIdx])?.jadwal[0]}
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			class="w-full justify-between overflow-hidden"
		>
			{(chosenClasses[matkul.kode] &&
				chosenClasses[matkul.kode][planIdx] &&
				`${chosenClasses[matkul.kode][planIdx]} (${
					dowMap[jadwal?.dayOfWeek ?? 0]
				}, ${timeToString(jadwal?.startHour ?? 0, jadwal?.startMinute ?? 0)} - ${timeToString(
					jadwal?.startHour ?? 0,
					(jadwal?.startMinute ?? 0) + (jadwal?.durasi ?? 0)
				)})`) ||
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
					{@const jadwal = kelas.jadwal[0]}
					<Command.Item
						onSelect={(currentValue) => {
							// do not allow select if class is already picked
							// if (chosenClasses[matkul.kode] && chosenClasses[matkul.kode].includes(kelas.kelas))
							// 	return;

							// modify the chosenClasses object for the correct planIdx
							chosenClasses = {
								...chosenClasses,
								[matkul.kode]: [
									...(chosenClasses[matkul.kode] ?? []).slice(0, planIdx),
									kelas.kelas,
									...(chosenClasses[matkul.kode] ?? []).slice(planIdx + 1)
								]
							};

							// // replace first element of the array
							// chosenClasses = {
							// 	...chosenClasses,
							// 	[matkul.kode]: [kelas.kelas, ...(chosenClasses[matkul.kode] ?? []).slice(1)]
							// };

							open = false;
						}}
					>
						{#if chosenClasses[matkul.kode] && chosenClasses[matkul.kode].includes(kelas.kelas) && chosenClasses[matkul.kode][planIdx] !== kelas.kelas}
							<TriangleAlert class="mr-2 h-4 w-4 text-yellow-400" />
						{:else}
							<Check
								class={cn(
									'mr-2 h-4 w-4',
									!(
										chosenClasses[matkul.kode] &&
										chosenClasses[matkul.kode][planIdx] === kelas.kelas
									) && 'text-transparent'
								)}
							/>
						{/if}

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
</Popover.Root>
