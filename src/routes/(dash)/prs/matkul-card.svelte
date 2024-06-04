<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { CircleMinus, Plus, Trash } from 'lucide-svelte';

	import type { MataKuliah } from '$lib/mata-kuliah';
	import { properCase } from '$lib/mk-utils';
	import clsx from 'clsx';
	import { onMount, tick } from 'svelte';
	import { quartOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import MatkulClassSelector from './matkul-class-selector.svelte';
	import { ChosenClassesUtils, chosenClasses, chosenMatkul } from '$lib/mk-state';

	export let matkulColors: string[];
	export let matkul: MataKuliah;
	export let i: number;

	export let onOpenChanged: (open: boolean, planIdx: number) => void = () => {};
	export let onFocusedToChanged: (focusedTo: string | null) => void = () => {};

	$: planCount = 1;
	$: maximumPlanCount = Math.min(3, matkul.kelas.length);

	$: {
		// Make sure to cut the chosenClasses array to the maximum plan count
		ChosenClassesUtils.trimPlans(matkul.kode, maximumPlanCount);
	}

	onMount(() => {
		// UX: If there is only one available class for the matkul, select it
		if (matkul.kelas.length === 1) {
			tick().then(() => {
				ChosenClassesUtils.setPlan(matkul.kode, 0, matkul.kelas[0].kelas);
			});
		}

		// Sync the current planCount to the length of the chosenClasses array
		if ($chosenClasses[matkul.kode]) {
			planCount = $chosenClasses[matkul.kode].length;
		}
	});
</script>

<Card.Root class={clsx(matkulColors[i], 'transition-all')}>
	<Card.Header class="pb-2">
		<div class="flex items-start justify-center gap-4">
			<Card.Title class="text-wrap">
				{properCase(matkul.nama)}
			</Card.Title>
			<button
				class="ml-auto size-5 shrink-0 text-slate-500 transition-colors hover:text-slate-700"
				on:click={() => {
					$chosenMatkul = $chosenMatkul.filter((item) => item !== matkul);
				}}
			>
				<CircleMinus class="h-full w-full transition-colors" />
			</button>
		</div>

		<Card.Description>{matkul.kode} - {matkul.sks} SKS</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col pb-0">
		{#each Array.from({ length: planCount }) as _, planIdx}
			<div class="mb-2 flex w-full" transition:slide={{ easing: quartOut }}>
				<div class="flex min-w-0 flex-1">
					<MatkulClassSelector
						{planIdx}
						{matkul}
						{onFocusedToChanged}
						onOpenChanged={(v) => onOpenChanged(v, planIdx)}
					/>
				</div>
				{#if planCount > 1}
					<div transition:slide={{ easing: quartOut, axis: 'x' }} class="pl-2">
						<Button
							variant="outline"
							size="icon"
							on:click={() => {
								// Slice at planIdx to remove the selected plan, then reduce the plan count
								ChosenClassesUtils.removePlan(matkul.kode, planIdx);
								planCount--;
							}}
						>
							<Trash class="h-4 w-4" />
						</Button>
					</div>
				{/if}
			</div>
		{/each}
		{#if planCount < maximumPlanCount}
			<div transition:slide={{ easing: quartOut }} class="flex w-full flex-col">
				<Button
					variant="outline"
					size="icon"
					class="w-full"
					on:click={() => {
						if (planCount < maximumPlanCount) planCount++;
					}}
				>
					<Plus class="h-4 w-4" />
				</Button>
			</div>
		{/if}
	</Card.Content>
	<Card.Footer></Card.Footer>
</Card.Root>
