<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronDown, CircleSlash, TriangleAlert } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import { cn } from '$lib/utils.js';

	import type { MataKuliah } from '$lib/mata-kuliah';
	import { ChosenClassesUtils, chosenClasses } from '$lib/mk-state';
	import { stringifyKelas } from '$lib/mk-utils';
	import { createState } from 'cmdk-sv';
	import { onMount, tick } from 'svelte';
	import clsx from 'clsx';
	import { executeCallbacks, addEventListener } from '$lib/internal';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { keyboardStore } from '$lib/kbd';

	let state = createState();
	export let planIdx: number;
	export let matkul: MataKuliah;
	export let pilihanIndexes: number[];

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

	$: holdingShift = $keyboardStore.shift;

	onMount(() => {
		const onPopoverClose = (e: CustomEvent) => {
			open = false;
		};

		return executeCallbacks(addEventListener(document, 'close-popovers', onPopoverClose));
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
			class={clsx(
				'w-full justify-between overflow-hidden',
				!pilihanIndexes.includes(planIdx) && 'brightness-75'
			)}
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
						class="flex-wrap"
					>
						{#if $chosenClasses[matkul.kode] && $chosenClasses[matkul.kode].includes(kelas.kelas) && $chosenClasses[matkul.kode][planIdx] !== kelas.kelas}
							<Tooltip.Root openDelay={0}>
								<Tooltip.Trigger>
									<CircleSlash class="mr-2 h-4 w-4 text-yellow-500" />
								</Tooltip.Trigger>
								<Tooltip.Content side="right">
									Kelas ini sudah dipilih di prioritas lain.
								</Tooltip.Content>
							</Tooltip.Root>
						{:else if $chosenClasses[matkul.kode] && $chosenClasses[matkul.kode].filter((k) => k === kelas.kelas).length > 1 && $chosenClasses[matkul.kode][planIdx] === kelas.kelas}
							<Tooltip.Root openDelay={0}>
								<Tooltip.Trigger>
									<Check class="mr-2 h-4 w-4 text-yellow-500" />
								</Tooltip.Trigger>
								<Tooltip.Content side="right">
									Kelas ini digunakan di prioritas ini dan prioritas lain.
								</Tooltip.Content>
							</Tooltip.Root>
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

						{stringifyKelas(kelas)}

						{#if 'accepted' in kelas && 'capacity' in kelas}
							<span class="ml-auto pl-2 text-muted-foreground">
								{kelas.accepted}/{kelas.capacity}
							</span>
						{/if}

						{#if 'keterangan' in kelas}
							<div class="basis-full h-0"></div>
							<div class="pl-6 text-xs text-muted-foreground">{kelas.keterangan}</div>
						{/if}
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
