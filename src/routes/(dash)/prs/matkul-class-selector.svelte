<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronDown, TriangleAlert } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import { cn } from '$lib/utils.js';

	import type { MataKuliah } from '$lib/mata-kuliah';
	import { ChosenClassesUtils, chosenClasses } from '$lib/mk-state';
	import { stringifyKelas } from '$lib/mk-utils';
	import { createState } from 'cmdk-sv';
	import { onMount, tick } from 'svelte';
	import clsx from 'clsx';
	import { executeCallbacks, addEventListener } from '$lib/internal';

	let state = createState();
	export let planIdx: number;
	export let matkul: MataKuliah;

	export let onOpenChanged: (open: boolean) => void = () => {};
	export let onFocusedToChanged: (focusedTo: string | null) => void = () => {};
	export let open = false;
	export let next: () => void = () => {};

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

	let holdingShift = false;

	onMount(() => {
		const onKeyUp = (e: KeyboardEvent) => {
			if (e.key === 'Shift') holdingShift = false;
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Shift') holdingShift = true;
		};

		return executeCallbacks(
			addEventListener(document, 'keyup', onKeyUp),
			addEventListener(document, 'keydown', onKeyDown)
		);
	});
</script>

<Popover.Root
	let:ids
	bind:open
	onOutsideClick={(e) => {
		if (!(e instanceof PointerEvent)) return;
		if (
			!(
				e.target instanceof HTMLElement ||
				e.target instanceof SVGElement ||
				e.target instanceof SVGSVGElement
			)
		)
			return;

		// If clicking on anything which parent/current element has data-priority-click, don't close the popover
		const closestPriority = e.target.closest('[data-priority-click]');
		if (closestPriority) {
			e.preventDefault();

			// If the target also has data-priority-click-prevent-default, then prevent the next action
			const preventDefault = e.target.closest('[data-priority-click-prevent-default]');
			if (
				preventDefault &&
				!(preventDefault.getAttribute('data-priority-click-prevent-default') === 'false')
			) {
				return;
			}

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
				`Pilih kelas prioritas ${planIdx + 1}...`}
			<ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" side="bottom-start">
		<Command.Root class="max-h-72" {state}>
			<Command.Input placeholder="Cari kelas prioritas {planIdx + 1}..." />
			<Command.Empty>Kelas tidak ditemukan.</Command.Empty>
			<Command.Group class="!overflow-auto">
				{#each matkul.kelas as kelas}
					<Command.Item
						onSelect={(currentValue) => {
							// modify the chosenClasses object for the correct planIdx
							ChosenClassesUtils.setPlan(matkul.kode, planIdx, kelas.kelas);
							open = false;

							if (holdingShift) next();
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
						untuk memilih cepat
					</p>
				</div>
			</div>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
