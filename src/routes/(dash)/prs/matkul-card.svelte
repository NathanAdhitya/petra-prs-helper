<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { CircleMinus, Trash } from 'lucide-svelte';

	import type { MataKuliah } from '$lib/mata-kuliah';
	import { properCase } from '$lib/mk-utils';
	import { onDestroy } from 'svelte';
	import MatkulClassSelector from './matkul-class-selector.svelte';

	export let matkulColors: string[];
	export let emphasizeMatkulKode: string | null;
	export let matkul: MataKuliah;
	export let chosenMatkul: MataKuliah[];
	export let i: number;
	export let chosenClasses: Record<string, string[]>;

	export let onOpenChanged: (open: boolean, planIdx: number) => void = () => {};
	export let onFocusedToChanged: (focusedTo: string | null) => void = () => {};

	$: maximumPlanCount = Math.min(3, matkul.kelas.length);

	$: planCount = 1;

	$: {
		// Make sure to cut the chosenClasses array to the maximum plan count
		if (chosenClasses[matkul.kode])
			chosenClasses[matkul.kode].length = Math.min(
				chosenClasses[matkul.kode].length,
				maximumPlanCount
			);
	}

	onDestroy(() => {
		delete chosenClasses[matkul.kode];
	});

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
				<MatkulClassSelector
					{planIdx}
					{matkul}
					bind:chosenClasses
					{onFocusedToChanged}
					onOpenChanged={(v) => {
						onOpenChanged(v, planIdx);
					}}
				/>
				{#if planCount > 1}
					<Button
						variant="outline"
						size="icon"
						on:click={() => {
							// Slice at planIdx to remove the selected plan, then reduce the plan count
							chosenClasses[matkul.kode] = [
								...(chosenClasses[matkul.kode] ?? []).slice(0, planIdx),
								...(chosenClasses[matkul.kode] ?? []).slice(planIdx + 1)
							];
							planCount--;
						}}
					>
						<Trash class="h-4 w-4" />
					</Button>
				{/if}
			</div>
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
