<script lang="ts">
	import { chosenClasses, chosenMatkul, prsSubmitted, ChosenClassesUtils } from '$lib/mk-state';
	import { LoaderCircle, CircleCheck, CircleX, TriangleAlert, Info } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
</script>

<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button builders={[builder]}>Periksa</Button>
	</Dialog.Trigger>
	{#key $chosenClasses}
		{#key $chosenMatkul}
			{#await ChosenClassesUtils.validate()}
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Cek PRS</Dialog.Title>
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
				<Dialog.Content class="flex max-h-screen flex-col">
					<Dialog.Header>
						<Dialog.Title>Cek PRS</Dialog.Title>
					</Dialog.Header>
					<Dialog.Description class="overflow-auto">
						<div class="mb-2">
							{#if messages.length === 0}
								<p class="flex items-center gap-2 text-green-700">
									<CircleCheck class="h-4 w-4" /> PRS tidak memiliki masalah.
								</p>
							{:else}
								<p class="text-xs text-red-500 mb-2">
									*Ini adalah fitur eksperimental, pastikan Anda cek kembali PRS dengan cermat.
								</p>
								<p class="font-medium">Hasil pengecekan otomatis:</p>
								<ul class="list-disc">
									{#each messages as { type, message }}
										<li class="ml-6">
											{#if type === 'fatal'}
												<CircleX class="inline-block h-4 w-4 text-red-800" />
											{:else if type === 'warning'}
												<TriangleAlert class="inline-block h-4 w-4 text-yellow-800" />
											{:else if type === 'success'}
												<CircleCheck class="inline-block h-4 w-4 text-green-700" />
											{:else}
												<Info class="inline-block h-4 w-4" />
											{/if}

											{message}
										</li>
									{/each}
								</ul>
							{/if}
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
