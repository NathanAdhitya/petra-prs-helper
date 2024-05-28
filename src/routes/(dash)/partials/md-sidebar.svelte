<script lang="ts">
	import { page } from '$app/stores';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import {
		NavDropdown,
		NavLink,
		NavigationSeparator,
		isNavigationActive,
		navigationEntries
	} from '$lib/navigation';
	import clsx from 'clsx';
	import { ChevronRight, ExternalLink } from 'lucide-svelte';
	import pcuBlueLogo from './pcu-blue-logo.png';
	import { toast } from 'svelte-sonner';

	const activeClasses = 'bg-slate-800 hover:text-white';

	let currentlyOpenDropdown: NavDropdown | null = null;
</script>

<div class="hidden bg-slate-50 md:block">
	<div class="flex h-full min-h-screen flex-col">
		<div class="flex h-16 items-center border-b-4 border-b-[#a9a9a9] px-4 lg:h-[60px] lg:px-6">
			<a href="/home" class="flex h-full w-full items-center py-2 pt-3">
				<img src={pcuBlueLogo} alt="PCU Logo" class="max-w-auto h-auto max-h-full w-auto" />
			</a>
		</div>
		<ScrollArea class="flex-1 bg-slate-700 pt-4 text-white">
			<nav class="grid items-start gap-1 px-4 text-sm font-medium lg:px-4">
				{#each navigationEntries as n}
					{#if n instanceof NavigationSeparator}
						<Separator class="my-2 h-[2px] rounded-sm bg-white/50" />
						{#if n.afterSeparator}
							<p class="pl-1 pt-1 text-white/50">{n.afterSeparator}</p>
						{/if}
					{:else if n instanceof NavLink}
						<a
							href={n.isDisabled ? undefined : n.href}
							on:click={n.isDisabled ? () => toast.error('Fitur belum tersedia') : undefined}
							class={clsx(
								'flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 pl-6 transition-all hover:text-gray-300',
								isNavigationActive(n.href, $page.url.pathname) && activeClasses
							)}
						>
							{n.label}
							{#if n.isExternal}
								<ExternalLink class="ml-auto h-4 w-4" />
							{/if}
						</a>
					{:else if n instanceof NavDropdown}
						<Collapsible.Root
							class={clsx('rounded-lg px-2 py-2', currentlyOpenDropdown === n && activeClasses)}
							open={currentlyOpenDropdown === n}
						>
							<Collapsible.Trigger
								class="relative items-center gap-3 pl-6 transition-all hover:text-gray-300"
								on:click={() => {
									currentlyOpenDropdown = currentlyOpenDropdown === n ? null : n;
								}}
							>
								<ChevronRight
									class={'absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground transition-all' +
										(currentlyOpenDropdown === n ? ' rotate-90' : '')}
								/>
								{n.label}
							</Collapsible.Trigger>
							<Collapsible.Content class="grid items-start gap-1">
								<Separator class="mt-2 h-[2px] rounded-sm bg-white/50" />
								{#each n.children as c}
									<a
										href={c.isDisabled ? undefined : c.href}
										on:click={c.isDisabled ? () => toast.error('Fitur belum tersedia') : undefined}
										class={clsx(
											'flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 pl-6 transition-all hover:text-gray-300',
											isNavigationActive(c.href, $page.url.pathname) && activeClasses
										)}
									>
										{c.label}
									</a>
								{/each}
							</Collapsible.Content>
						</Collapsible.Root>
					{/if}
				{/each}
			</nav>
		</ScrollArea>
	</div>
</div>
