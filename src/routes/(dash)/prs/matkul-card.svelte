<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ArrowUpNarrowWide, CircleMinus, Plus, Trash } from 'lucide-svelte';

	import { addEventListener, executeCallbacks } from '$lib/internal';
	import {
		ChosenClassesUtils,
		ChosenMatkulUtils,
		chosenClasses,
		type MataKuliahWithColor
	} from '$lib/mk-state';
	import { lazyShortenMatkulName, properCase } from '$lib/mk-utils';
	import clsx from 'clsx';
	import { onMount, tick } from 'svelte';
	import { quartOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import MatkulClassSelector from './matkul-class-selector.svelte';
	import { keyboardStore } from '$lib/kbd';
	import { get } from 'svelte/store';
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let matkul: MataKuliahWithColor;
	export let pilihanIndexes: number[];
	$: coloredClasses = matkul.colorClasses;

	export let onOpenChanged: (open: boolean, planIdx: number) => void = () => {};
	export let onFocusedToChanged: (focusedTo: string | null) => void = () => {};

	$: planCount = 1;
	$: maximumPlanCount = Math.min(3, matkul.kelas.length);

	let open: boolean[] = [];
	let search = '';

	const attemptAddPlan = () => {
		if (planCount < maximumPlanCount) planCount++;
	};

	const nextPlan = (currentIdx: number) => () => {
		// If the currentIdx is the last index, try adding a new plan
		if (currentIdx === planCount - 1) {
			attemptAddPlan();
		}

		tick().then(() => {
			// If the currentIdx is not the last plan count, then move to the next plan
			if (currentIdx < planCount - 1) {
				open[currentIdx] = false;
				tick().then(() => {
					open[currentIdx + 1] = true;
				});
			}
		});
	};

	$: {
		// Make sure to cut the chosenClasses array to the maximum plan count
		ChosenClassesUtils.trimPlans(matkul.kode, maximumPlanCount);
	}

	$: {
		open.length = Math.min(open.length, planCount);
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
			planCount = Math.max($chosenClasses[matkul.kode].length, 1);
		}

		return executeCallbacks(
			addEventListener(document, 'selection-made', (e: CustomEvent) => {
				if (e.detail) {
					if (
						typeof e.detail.planIdx === 'number' &&
						typeof e.detail.kode === 'string' &&
						open &&
						e.detail.kode === matkul.kode &&
						get(keyboardStore).shift
					)
						nextPlan(e.detail.planIdx)();
				}
			})
		);
	});
</script>

<Card.Root class={clsx(coloredClasses, 'transition-all contain-content')}>
	<Card.Header class="pb-2">
		<div class="flex items-start justify-center gap-4 max-lg:px-4">
			<Card.Title class="max-w-full text-wrap break-words">
				{properCase(matkul.nama)} ({lazyShortenMatkulName(properCase(matkul.nama), true)})
			</Card.Title>
			<button
				class="ml-auto size-5 shrink-0 text-slate-500 transition-colors hover:text-slate-700"
				on:click={() => {
					ChosenMatkulUtils.remove(matkul);
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
						{pilihanIndexes}
						{onFocusedToChanged}
						open={open[planIdx]}
						next={nextPlan(planIdx)}
						onOpenChanged={(v) => onOpenChanged(v, planIdx)}
					/>
				</div>
				{#if planCount > 1}
					<div transition:slide={{ easing: quartOut, axis: 'x' }} class="pl-2">
						<Button
							variant="outline"
							size="icon"
							class={clsx(!pilihanIndexes.includes(planIdx) && 'brightness-75')}
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
				<Tooltip.Root openDelay={25}>
					<Tooltip.Trigger asChild let:builder>
						<Button
							variant="outline"
							size="icon"
							class="w-full"
							on:click={attemptAddPlan}
							builders={[builder]}
						>
							<Plus class="h-4 w-4 opacity-75" />
							<!-- <ArrowUpNarrowWide class="h-4 w-4 opacity-50" /> -->
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="right" class="max-w-sm">
						Tambah pilihan prioritas mata kuliah. <br /> Setiap mata kuliah dapat memiliki 3 pilihan
						prioritas kelas berbeda.
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		{/if}
	</Card.Content>
	<Card.Footer></Card.Footer>
</Card.Root>
