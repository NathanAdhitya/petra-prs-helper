<script context="module" lang="ts">
	import type { MatkulOption } from './+page.svelte';
	export type FilterFunction = (m: MatkulOption) => boolean;
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, Info, Plus, SlidersHorizontal, X } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import * as Command from '$lib/components/ui/command/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { Switch } from '$lib/components/ui/switch';
	import { cn } from '$lib/utils';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { tick } from 'svelte';
	import { chosenJurusanFilters } from '$lib/mk-state';

	export let listJurusan: string[];
	export let disabled: boolean;
	export let filterFunction: FilterFunction;

	let rekomFilter = false;

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

	$: filterFunction = rekomFilter
		? (m) => m.recommended === true
		: (m) => $chosenJurusanFilters.includes(m.reference.unit);
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
		<Popover.Content strategy="fixed" side="right-start" sideOffset={4}>
			<h2 class="text-lg font-semibold">Filter mata kuliah</h2>
			<Separator class="mb-2" />
			<div class="mb-2 flex items-center justify-between gap-2">
				<h3 class="font-semibold">Rekomendasi</h3>
				{#if displayTooltips}
					<div class="mr-auto flex items-center justify-center">
						<Tooltip.Root openDelay={0}>
							<Tooltip.Trigger>
								<Info class="h-4 w-4 opacity-50" />
							</Tooltip.Trigger>
							<Tooltip.Content side="right" strategy="fixed" class="max-w-sm">
								Mata kuliah rekomendasi adalah mata kuliah yang belum Anda ambil dan
								direkomendasikan sesuai dengan jurusan dan semester Anda.
							</Tooltip.Content>
						</Tooltip.Root>
					</div>
				{:else}
					<div class="h-4 w-4"></div>
				{/if}
				<Switch bind:checked={rekomFilter} />
			</div>

			<div>
				<h3 class="mb-1 font-semibold">Jurusan</h3>
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

			<Command.Root>
				<Command.Input placeholder="Tambah jurusan" />
				<Command.Empty>Jurusan tidak ditemukan...</Command.Empty>
				<div class="max-h-32 overflow-y-auto">
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
		</Popover.Content>
	</Popover.Root>
</div>
