<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Card from '$lib/components/ui/card';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	let value = today(getLocalTimeZone());
</script>

<div class="flex gap-3">
	<Card.Root>
		<Card.Header>
			<Card.Title>Calendar</Card.Title>
		</Card.Header>
		<Card.Content>
			<Calendar bind:value class="rounded-md border" />
		</Card.Content>
	</Card.Root>

	<Carousel.Root class="w-full flex-row flex-wrap">
		<Carousel.Content>
			{#each Array(5) as _, i (i)}
				<Carousel.Item>
					<div class="p-1">
						<Card.Root>
							<Card.Content class="flex aspect-square items-center justify-center p-6">
								<span class="text-4xl font-semibold">{i + 1}</span>
							</Card.Content>
						</Card.Root>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<div class="flex justify-center gap-2">
			<Carousel.Previous class="relative left-0 " />
			<Carousel.Next class="relative left-0 top-0" />
		</div>
	</Carousel.Root>
</div>
