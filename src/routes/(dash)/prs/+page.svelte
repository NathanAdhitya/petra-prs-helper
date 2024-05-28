<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, ChevronsUpDown } from 'lucide-svelte';

	import * as Command from '$lib/components/ui/command/index.js';
	import { cn } from '$lib/utils.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import type { MataKuliah } from '$lib/mata-kuliah';
	export let data;

	function properCase(str: string) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
		});
	}

	let matkulOptions = data.pilihanMataKuliah.map((item) => ({
		label: properCase(item.nama).trim(),
		value: item.kode + ' - ' + properCase(item.nama).trim(),
		kode: item.kode,
		reference: item
	}));

	const chosenMatkulLimit = 10;
	let chosenMatkul: MataKuliah[] = [];

	let chosenClasses: Record<string, boolean> = {};

	let open = false;
	let value = '';
</script>

<h1 class="text-4xl font-bold">Pendaftaran Rencana Studi</h1>
<div class="flex h-full w-full">
	<Card.Root class="h-full w-full max-w-sm">
		<Card.Header>
			<Popover.Root bind:open let:ids>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						class="w-full justify-between"
					>
						Cari mata kuliah...
						<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-96 p-0">
					<Command.Root class="max-h-52">
						<Command.Input placeholder="Cari mata kuliah..." />
						<Command.Empty>Mata kuliah tidak ditemukan...</Command.Empty>
						<Command.Group class="!overflow-auto">
							{#each matkulOptions as matkul}
								<Command.Item
									value={matkul.value}
									onSelect={() => {
										// either remove or add
										if (chosenMatkul.includes(matkul.reference)) {
											chosenMatkul = chosenMatkul.filter((item) => item !== matkul.reference);
										} else {
											if (chosenMatkul.length < chosenMatkulLimit) {
												chosenMatkul = [...chosenMatkul, matkul.reference];
											}
										}
									}}
								>
									<span class="mr-4 text-muted-foreground">{matkul.kode} </span>
									{matkul.label}
									<Check
										class={cn(
											'ml-auto mr-2 h-4 w-4',
											!chosenMatkul.includes(matkul.reference) && 'text-transparent'
										)}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
						<div class="px-4 py-2">{chosenMatkul.length}/{chosenMatkulLimit} dipilih</div>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</Card.Header>
		<Card.Content class="overflow-y-auto">
			<div class="flex flex-col gap-2">
				{#each chosenMatkul as matkul}
					<Card.Root>
						<Card.Header class="pb-2">
							<Card.Title class="text-wrap">{properCase(matkul.nama)}</Card.Title>
							<Card.Description>{matkul.kode}</Card.Description>
						</Card.Header>
						<Card.Content class="pb-2">
							<p>Card Content</p>
						</Card.Content>
						<Card.Footer>
							<Button
								class="ml-auto"
								variant="outline"
								on:click={() => {
									chosenMatkul = chosenMatkul.filter((item) => item !== matkul);
								}}
							>
								-
							</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</div>
