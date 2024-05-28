<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Card from '$lib/components/ui/card';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	let value = today(getLocalTimeZone());

	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import clsx from 'clsx';

	let api: CarouselAPI;
	let current = 0;
	let count = 0;

	$: if (api) {
		count = api.scrollSnapList().length;
		current = api.selectedScrollSnap() + 1;

		api.on('select', () => {
			current = api.selectedScrollSnap() + 1;
		});
	}

	export let data;
</script>

<div class="flex gap-3">
	<Card.Root class="h-auto">
		<Card.Content class="p-6">
			<Calendar bind:value class="rounded-md" />
		</Card.Content>
	</Card.Root>

	<div class="h-full w-full flex-1">
		<Carousel.Root bind:api class="flex h-full w-full flex-1">
			<Carousel.Content class="h-full w-full">
				{#each data.newsFlash as content, i (i)}
					<Carousel.Item class="h-full w-full">
						<Card.Root class="h-full w-full">
							<Card.Content class="prose p-6 px-8">
								{@html content}
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>

		<div class="flex items-center justify-center py-2 text-sm text-muted-foreground">
			<button
				class="text-muted-foreground transition-all hover:text-gray-700"
				on:click={() => api.scrollPrev()}
			>
				<ArrowLeft class="h-4" />
			</button>

			{#each Array(count) as _, i (i)}
				<button
					class={clsx(
						'mx-1 h-2 w-2 rounded-full p-1 transition-all hover:bg-blue-800',
						i + 1 === current ? 'bg-blue-600' : 'bg-gray-400'
					)}
					on:click={() => api.scrollTo(i)}
				>
				</button>
			{/each}

			<button
				class="text-muted-foreground transition-all hover:text-gray-700"
				on:click={() => api.scrollNext()}
			>
				<ArrowRight class="h-4" />
			</button>
		</div>
	</div>
	<div class="grid grid-cols-4"></div>
</div>
