<script lang="ts">
	import { lazyShortenMatkulName, properCase } from '$lib/mk-utils';
	import { timeToString } from '$lib/mock-data';
	import { Button } from '$lib/components/ui/button';
	import type { ComputedSchedule } from './+page.svelte';
	import clsx from 'clsx';
	import { ChosenClassesUtils, chosenMatkul } from '$lib/mk-state';

	export let matkulColors: string[];
	export let schedule: ComputedSchedule;
	export let openMatkulSelectionKode: string | null;
	export let emphasizeMatkulKode: string | null;
	export let emphasizePilihan: number | null;
	export let openMatkulPlanIdx: number | null;
	export let openMatkulFocusedClass: string | null;

	// Separated to easily use new bounding boxes to shorten text
	// and to make the text more readable
	let contentRect: DOMRect;

	$: forceShortenMatkulName = contentRect ? contentRect.width < 50 : false;
	$: showKelasLabel = contentRect ? contentRect.width > 60 : false;
	$: showTime = contentRect ? contentRect.width > 70 : false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	bind:contentRect
	class={clsx(
		'z-10 flex h-full w-full flex-col overflow-hidden break-words rounded-lg p-2 transition-all',
		schedule.currentlySelected
			? matkulColors[$chosenMatkul.findIndex((v) => v.kode === schedule.kode) % matkulColors.length]
			: 'bg-slate-200',
		emphasizeMatkulKode === schedule.kode && 'shadow-2xl',
		schedule.currentlySelected && openMatkulSelectionKode === schedule.kode && 'shadow-2xl',
		openMatkulSelectionKode === schedule.kode &&
			'pointer-events-auto cursor-pointer border-2 border-slate-300',

		// Deemphasize when not selected
		openMatkulSelectionKode !== null && openMatkulSelectionKode !== schedule.kode && 'opacity-50',

		// Emphasize when plan pilihan is hovered on
		schedule.planIdx.some((v) => v === (emphasizePilihan ?? -1) - 1) && 'shadow-2xl',
		// Deemphasize if not selected
		emphasizePilihan !== null &&
			!schedule.planIdx.some((v) => v === (emphasizePilihan ?? -1) - 1) &&
			'opacity-50'
	)}
	on:mouseenter={() => {
		if (openMatkulSelectionKode === schedule.kode) {
			openMatkulFocusedClass = schedule.kelas[0].toLowerCase();
		}
	}}
	on:click={(e) => {
		if (openMatkulSelectionKode === schedule.kode) {
			ChosenClassesUtils.setPlan(schedule.kode, openMatkulPlanIdx ?? 0, schedule.kelas[0]);
		}
	}}
	data-priority-click
>
	<div class="font-medium leading-5 max-xl:text-sm">
		{lazyShortenMatkulName(properCase(schedule.nama), forceShortenMatkulName)}
		{#if !showKelasLabel}<span class="text-xs"> ({schedule.kelas.join(', ')})</span>{/if}
	</div>
	<div class="text-sm leading-5 text-muted-foreground">
		{#if openMatkulSelectionKode === schedule.kode && schedule.kelas.length > 1}
			{#each schedule.kelas as kelas, i}
				<Button
					class="mr-1 px-1 py-1 font-normal leading-3"
					size="unstyled"
					on:click={(e) => {
						ChosenClassesUtils.setPlan(schedule.kode, openMatkulPlanIdx ?? 0, kelas);
					}}
					data-priority-click
				>
					{kelas}
				</Button>
			{/each}
		{:else if showKelasLabel}
			<span>Kelas</span>
			{schedule.kelas.join(', ')}
		{/if}
	</div>
	{#if showTime}
		<div class="text-xs leading-3 text-muted-foreground max-xl:hidden">
			{timeToString(schedule.startHour, schedule.startMinute)} - {timeToString(
				schedule.startHour,
				schedule.startMinute + schedule.lengthMinutes
			)}
		</div>
	{/if}
	<div class="ml-auto mt-auto text-xs">
		{#if schedule.planIdx.every((v) => v === -1)}
			<Button size="unstyled" class="px-2 py-0.5">Pilih</Button>
		{:else}
			Pilihan {schedule.planIdx.map((v) => v + 1).join(', ')}
		{/if}
	</div>
</div>
