<script lang="ts">
	import { chosenClasses, chosenMatkul, prsSubmitted, ChosenClassesUtils } from '$lib/mk-state';
	import { LoaderCircle, CircleCheck, CircleX, TriangleAlert, Info } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Accordion from '$lib/components/ui/accordion';
</script>

<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button builders={[builder]}>Cek Bentrok</Button>
	</Dialog.Trigger>
	{#key $chosenClasses}
		{#key $chosenMatkul}
			{#await ChosenClassesUtils.validate()}
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Cek Bentrok</Dialog.Title>
					</Dialog.Header>
					<Dialog.Description>
						<div class="flex items-center gap-2">
							<LoaderCircle class="inline h-4 w-4 animate-spin text-blue-800" />
							<p class="text-blue-800">Melakukan pengecekan otomatis...</p>
						</div>
					</Dialog.Description>
					<Dialog.Footer>
						<Dialog.Close asChild let:builder>
							<Button variant="secondary" builders={[builder]}>Batal</Button>
						</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			{:then messages}
				{@const fatalCount = messages.filter((v) => v.type === 'fatal').length}
				{@const warningCount = messages.filter((v) => v.type === 'warning').length}
				<Dialog.Content class="flex max-h-screen flex-col">
					<Dialog.Header>
						<Dialog.Title>Cek Bentrok</Dialog.Title>
					</Dialog.Header>
					<Dialog.Description class="overflow-auto">
						<div class="mb-2">
							<p class="mb-2 text-xs text-red-500">
								*Ini adalah fitur eksperimental, pastikan Anda cek kembali PRS dengan cermat.
							</p>
							{#if fatalCount === 0 && warningCount === 0}
								<p class="flex items-center gap-2 text-green-700">
									<CircleCheck class="h-4 w-4" /> PRS tidak memiliki masalah.
								</p>
							{:else if fatalCount > 0}
								<p class="flex items-center gap-2 text-red-800">
									<CircleX class="h-4 w-4" /> Terdapat {fatalCount} masalah yang perlu diperbaiki.
								</p>
							{:else}
								<p class="flex items-center gap-2 text-yellow-800">
									<TriangleAlert class="h-4 w-4" /> Terdapat {warningCount} peringatan yang butuh diteliti.
								</p>
							{/if}
							<Accordion.Root>
								<Accordion.Item value="item-1">
									<Accordion.Trigger>Detail hasil pengecekan</Accordion.Trigger>
									<Accordion.Content>
										<ul>
											{#each messages as { type, message }}
												<li class="flex w-full">
													<div>
														{#if type === 'fatal'}
															<CircleX class="inline-block h-4 w-4 text-red-800" />
														{:else if type === 'warning'}
															<TriangleAlert class="inline-block h-4 w-4 text-yellow-800" />
														{:else if type === 'success'}
															<CircleCheck class="inline-block h-4 w-4 text-green-700" />
														{:else}
															<Info class="inline-block h-4 w-4" />
														{/if}
													</div>

													<div class="ml-2">{message}</div>
												</li>
											{/each}
										</ul>
									</Accordion.Content>
								</Accordion.Item>
							</Accordion.Root>
						</div>
					</Dialog.Description>
					<Dialog.Footer>
						<Dialog.Close asChild let:builder>
							<Button builders={[builder]}>Ok</Button>
						</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			{/await}
		{/key}
	{/key}
</Dialog.Root>
