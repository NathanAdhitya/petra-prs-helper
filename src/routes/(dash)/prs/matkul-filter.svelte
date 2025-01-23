<script context="module" lang="ts">
	import type { MatkulOption } from './+page.svelte';
	export type FilterFunction = (m: MatkulOption) => boolean;
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, SlidersHorizontal, X } from 'lucide-svelte';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { chosenJurusanFilters, semesterFilters } from '$lib/mk-state';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { Slider } from '$lib/components/ui/slider';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	export let listJurusan: string[];
	export let disabled: boolean;
	export let filterFunction: FilterFunction;

	let displayTooltips = false;
	let open = false;

	// Workaround for the tooltip showing up with the popover.
	$: {
		if (open) {
			tick().then(() => {
				displayTooltips = true;
			});
		} else {
			displayTooltips = false;
		}
	}

	$: filterFunction = (m) =>
		$chosenJurusanFilters.includes(m.reference.unit) &&
		// If m.reference.semester === null and $semesterFilters["null"] is true, accept
		// @ts-expect-error
		($semesterFilters[m.reference.semester] === true ||
			// If null, accept any outside 1-8
			($semesterFilters['null'] === true &&
				m.reference.semester !== null &&
				(m.reference.semester < 1 || m.reference.semester > 8)));

	const semesterKeys = ['null', '1', '2', '3', '4', '5', '6', '7', '8'];
	const semesterLabels = ['unknown/misc', '1', '2', '3', '4', '5', '6', '7', '8 / konsentrasi'];
</script>

<div class="absolute right-0 top-0 m-0.5">
	<Popover.Root bind:open>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="secondary"
				class="bg-slate-200 hover:bg-slate-200/75"
				size="icon"
			>
				<SlidersHorizontal class="h-5 w-5" />
			</Button>
		</Popover.Trigger>
		<Popover.Content strategy="fixed" side="right-start" sideOffset={4} class="w-auto max-w-xs">
			<h2 class="text-lg font-semibold">Filter mata kuliah</h2>
			<Separator class="mb-2" />
			<div>
				<h3 class="mb-1 font-semibold">Jurusan / Fakultas / Prodi</h3>
				{#each $chosenJurusanFilters as jurusan}
					<Badge variant="secondary" class="inline-flex items-center leading-none">
						{jurusan}
						<button
							on:click={() => {
								$chosenJurusanFilters = $chosenJurusanFilters.filter((item) => item !== jurusan);
							}}
						>
							<X class="ml-1 h-3 w-3 opacity-50" />
						</button>
					</Badge>
				{/each}
			</div>

			<Command.Root class="mb-4">
				<Command.Input placeholder="Tambah jurusan / fakultas / prodi" />
				<Command.Empty>Jurusan tidak ditemukan...</Command.Empty>
				<div class="max-h-48 overflow-y-auto">
					{#each listJurusan.sort() as jurusan}
						<Command.Item
							value={jurusan}
							onSelect={() => {
								if (!disabled) {
									// either remove or add
									if ($chosenJurusanFilters.includes(jurusan)) {
										$chosenJurusanFilters = $chosenJurusanFilters.filter(
											(item) => item !== jurusan
										);
									} else {
										$chosenJurusanFilters = [...$chosenJurusanFilters, jurusan];
									}
								}
							}}
						>
							<span>
								{jurusan}
							</span>
							<Check
								class={cn(
									'ml-auto mr-2 h-4 w-4',
									!$chosenJurusanFilters.includes(jurusan) && 'text-transparent'
								)}
							/>
						</Command.Item>
					{/each}
				</div>
			</Command.Root>
			<div>
				<h3 class="mb-1 font-semibold">Semester</h3>
				<ul class="mb-2 columns-2">
					{#each semesterKeys as sf, idx}
						<li class="mb-2 flex items-center space-x-2">
							<Checkbox
								id="filter-semester-{idx}"
								bind:checked={$semesterFilters[sf]}
								aria-labelledby="filter-semester-label-{idx}"
							/>
							<Label
								id="filter-semester-label-{idx}"
								for="filter-semester-{idx}"
								class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{semesterLabels[idx]}
							</Label>
						</li>
					{/each}
				</ul>
				<div class="text-xs">
					<span class="text-red-500">*</span> data pada filter semester belum tentu akurat, referensikan
					terhadap pedoman prodi Anda.
				</div>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
