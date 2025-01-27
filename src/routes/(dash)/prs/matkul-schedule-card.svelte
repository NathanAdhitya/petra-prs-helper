<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { ChosenClassesUtils, chosenClasses } from '$lib/mk-state';
	import { lazyShortenMatkulName, properCase } from '$lib/mk-utils';
	import { timeToString } from '$lib/mock-data';
	import { cn } from '$lib/utils';
	import clsx from 'clsx';
	import { ArrowUpNarrowWide, Check, ChevronDown, CircleSlash } from 'lucide-svelte';
	import type { ComputedSchedule } from './+page.svelte';
	import { builderActions, getAttrs, type Builder } from 'bits-ui';

	export let schedule: ComputedSchedule;
	export let openMatkulSelectionKode: string | null;
	export let emphasizeMatkulKode: string | null;
	export let emphasizePilihan: number | null;
	export let openMatkulPlanIdx: number | null;
	export let openMatkulFocusedClass: string | null;
	export let builders: Builder[] = [];
	$: coloredClasses = schedule.colorClasses;

	// Separated to easily use new bounding boxes to shorten text
	// and to make the text more readable
	let contentRect: DOMRect;
	let open = false;

	// $: forceShortenMatkulName = contentRect ? contentRect.width < 128 : false;
	const forceShortenMatkulName = false;
	$: isWide = contentRect ? contentRect.width > 70 : false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
	bind:contentRect
	use:builderActions={{ builders }}
	{...getAttrs(builders)}
	class={clsx(
		'z-10 flex h-full w-full flex-col overflow-hidden break-words rounded-sm p-1 transition-all cursor-pointer',
		schedule.currentlySelected ? coloredClasses : 'bg-slate-200',
		emphasizeMatkulKode && emphasizeMatkulKode !== schedule.kode && 'opacity-50 brightness-75',
		emphasizeMatkulKode === schedule.kode && 'shadow-2xl',
		schedule.currentlySelected && openMatkulSelectionKode === schedule.kode && 'shadow-2xl',
		openMatkulSelectionKode === schedule.kode && 'border-2 border-slate-300',
		openMatkulSelectionKode === schedule.kode &&
			schedule.kelas.length === 1 &&
			'pointer-events-auto cursor-pointer',

		// Deemphasize when not selected
		openMatkulSelectionKode !== null &&
			openMatkulSelectionKode !== schedule.kode &&
			'opacity-50 brightness-75',

		// Emphasize when plan pilihan is hovered on
		schedule.planIdx.some((v) => v === (emphasizePilihan ?? -1) - 1) && 'shadow-2xl',
		// Deemphasize if not selected
		emphasizePilihan !== null &&
			!schedule.planIdx.some((v) => v === (emphasizePilihan ?? -1) - 1) &&
			'opacity-50 brightness-75'
	)}
	on:mouseenter={() => {
		if (openMatkulSelectionKode === schedule.kode) {
			openMatkulFocusedClass = schedule.kelas[0].toLowerCase();
		}
	}}
	on:touchstart
	on:click={(e) => {
		if (e.isTrusted) return;

		if (openMatkulSelectionKode === schedule.kode && schedule.kelas.length === 1) {
			ChosenClassesUtils.setPlan(schedule.kode, openMatkulPlanIdx ?? 0, schedule.kelas[0]);

			document.dispatchEvent(
				new CustomEvent('selection-made', {
					detail: {
						kode: schedule.kode,
						planIdx: openMatkulPlanIdx
					}
				})
			);
		}
	}}
	data-priority-click
>
	<div class="mb-1 text-sm font-medium leading-4 max-xl:text-xs flex gap-x-1 flex-wrap">
		<div class="text-ellipsis text-nowrap overflow-hidden block">
			{#if forceShortenMatkulName}
				{lazyShortenMatkulName(properCase(schedule.nama), true)}
			{:else}
				{properCase(schedule.nama)}
			{/if}
		</div>
		<span class="text-xs"> ({schedule.kelas.join(', ')})</span>
	</div>
	{#if isWide}
		<div class="text-xs leading-3 text-muted-foreground max-xl:hidden">
			{timeToString(schedule.startHour, schedule.startMinute)} - {timeToString(
				schedule.startHour,
				schedule.startMinute + schedule.lengthMinutes
			)}
		</div>
		{#if openMatkulSelectionKode === schedule.kode && schedule.kelas.length === 1}
			{#if 'keterangan' in schedule.kelasObj[0]}
				<div class="flex text-xs text-muted-foreground opacity-50">
					{schedule.kelasObj[0].keterangan}
				</div>
			{/if}
		{/if}
	{/if}

	<div
		class={clsx(
			'mt-auto flex flex-wrap items-end',
			(openMatkulSelectionKode !== schedule.kode ||
				schedule.planIdx.length - schedule.planIdx.filter((v) => v === -1).length === 0) &&
				'ml-auto'
		)}
	>
		{#if !schedule.planIdx.every((v) => v === -1)}
			<div class="flex text-xs text-muted-foreground opacity-75">
				<ArrowUpNarrowWide class="h-4 w-4" />
				{schedule.planIdx
					.map((v) => v + 1)
					.sort()
					.join(', ')}
			</div>
		{/if}
		<div class="absolute bottom-0 right-0 ml-auto p-2 text-xs">
			{#if openMatkulSelectionKode === schedule.kode && schedule.kelas.length > 1}
				<Popover.Root let:ids bind:open>
					<Popover.Trigger asChild let:builder>
						<Button
							size="unstyled"
							class="gap-1 px-2 py-0.5 font-normal"
							builders={[builder]}
							data-priority-click
							data-priority-click-prevent-default
						>
							Pilih <ChevronDown class="h-4 w-4 opacity-50" />
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0">
						<Command.Root>
							<Command.Input placeholder="Cari kelas..." />
							<Command.Empty>Kelas tidak ditemukan.</Command.Empty>
							<Command.Group>
								{#each schedule.kelas as kelas, i}
									<Command.Item
										onSelect={(currentValue) => {
											// modify the chosenClasses object for the correct planIdx
											ChosenClassesUtils.setPlan(schedule.kode, openMatkulPlanIdx ?? 0, kelas);

											// Fire a global event to close all other popovers
											document.dispatchEvent(new CustomEvent('close-popovers'));

											// Fire an event to indicate that a selection has been made
											document.dispatchEvent(
												new CustomEvent('selection-made', {
													detail: {
														kode: schedule.kode,
														planIdx: openMatkulPlanIdx
													}
												})
											);
										}}
										value={kelas}
										data-priority-click-prevent-default={false}
										class="flex-wrap"
									>
										{#if $chosenClasses[schedule.kode] && $chosenClasses[schedule.kode].includes(kelas) && $chosenClasses[schedule.kode][openMatkulPlanIdx ?? 0] !== kelas}
											<Tooltip.Root openDelay={0}>
												<Tooltip.Trigger>
													<CircleSlash class="mr-2 h-4 w-4 text-yellow-500" />
												</Tooltip.Trigger>
												<Tooltip.Content side="right">
													Kelas ini sudah dipilih di prioritas lain.
												</Tooltip.Content>
											</Tooltip.Root>
										{:else if $chosenClasses[schedule.kode] && $chosenClasses[schedule.kode].filter((k) => k === kelas).length > 1 && $chosenClasses[schedule.kode][openMatkulPlanIdx ?? 0] === kelas}
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
														$chosenClasses[schedule.kode] &&
														$chosenClasses[schedule.kode][openMatkulPlanIdx ?? 0] === kelas
													) && 'text-transparent'
												)}
											/>
										{/if}

										{kelas}

										{#if isWide}
											{@const kelasObj = schedule.kelasObj[openMatkulPlanIdx ?? 0]}
											{#if kelasObj}
												{#if 'accepted' in kelasObj && 'capacity' in kelasObj}
													<span class="ml-auto pl-2 text-muted-foreground">
														{kelasObj.accepted}/{kelasObj.capacity}
													</span>
												{/if}

												{#if 'keterangan' in kelasObj}
													<div class="h-0 basis-full"></div>
													<div class="pl-6 text-xs text-muted-foreground">
														{kelasObj.keterangan}
													</div>
												{/if}
											{/if}
										{/if}
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			{:else if schedule.planIdx.every((v) => v === -1)}
				<Button size="unstyled" class="px-2 py-0.5 font-normal">Pilih</Button>
			{/if}
		</div>
	</div>
</button>
