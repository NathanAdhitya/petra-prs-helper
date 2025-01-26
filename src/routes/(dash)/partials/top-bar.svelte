<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import {
		ChevronRight,
		CircleUser,
		ExternalLink,
		Home,
		Menu,
		Search,
		ShoppingCart
	} from 'lucide-svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import {
		navigationEntries,
		NavigationSeparator,
		NavLink,
		NavDropdown,
		isNavigationActive
	} from '$lib/navigation';
	import { Separator } from '$lib/components/ui/separator';
	import clsx from 'clsx';
	import { page } from '$app/stores';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { toast } from 'svelte-sonner';
	import { namaUser, nrpUser } from '$lib/mock-data';
	import { base } from '$app/paths';

	const activeClasses = 'bg-slate-800 hover:text-white';
	let currentlyOpenDropdown: NavDropdown | null = null;
</script>

<header
	class="flex h-16 items-center gap-4 border-b-4 border-b-[#a9a9a9] bg-slate-50 px-4 py-2 lg:h-[60px] lg:px-6 3xl:hidden"
>
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button variant="outline" size="icon" class="shrink-0 3xl:hidden" builders={[builder]}>
				<Menu class="h-5 w-5" />
				<span class="sr-only">Toggle navigation menu</span>
			</Button>
		</Sheet.Trigger>

		<Sheet.Content side="left" class="flex max-w-[100vw] flex-col bg-slate-700 p-0 text-white">
			<ScrollArea class="flex-1 p-4">
				<nav class="grid gap-2 text-lg font-medium">
					<a href="/" class="flex items-center gap-2 text-lg font-extrabold"> prs.natha.my.id </a>
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
									'flex items-center gap-3 rounded-lg px-2 py-2 pl-6 transition-all hover:text-gray-300',
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
								<Collapsible.Content class="grid gap-2">
									<Separator class="mt-2 h-[2px] rounded-sm bg-white/50" />
									{#each n.children as c}
										<a
											href={c.isDisabled ? undefined : c.href}
											on:click={c.isDisabled
												? () => toast.error('Fitur belum tersedia')
												: undefined}
											class={clsx(
												'flex items-center gap-3 rounded-lg px-2 py-2 pl-6 transition-all hover:text-gray-300',
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
					<!-- <a
					href="##"
					class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
				>
					<Home class="h-5 w-5" />
					Dashboard
				</a> -->
					<div class="px-2 text-xs text-gray-300">
						<!-- svelte-ignore missing-declaration -->
						Last Updated: {new Date(BUILD_TS).toLocaleString('en-GB', {
							timeZoneName: 'short',
							timeZone: 'Asia/Jakarta'
						})}
					</div>
					<div class="px-2 text-xs">
						This app is optimized for desktops and tablets. Please view in a desktop or a tablet for a better
						experience.
					</div>
				</nav>
			</ScrollArea>
		</Sheet.Content>
	</Sheet.Root>
	<div class="flex h-full align-middle 2xl:hidden">
		<a href="/" class="text-lg font-extrabold leading-10">prs.natha.my.id</a>
	</div>
	<div class="w-full flex-1">
		<!-- <form>
			<div class="relative">
				<Search class="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Cari halaman..."
					class="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
				/>
			</div>
		</form> -->
	</div>
	<!-- svelte-ignore missing-declaration -->
	<!-- <div class="text-gray-500">
		Last Updated: {new Date(BUILD_TS).toLocaleString('en-GB', {
			timeZoneName: "short",
			timeZone: 'Asia/Jakarta'
		})}
	</div> -->
</header>
