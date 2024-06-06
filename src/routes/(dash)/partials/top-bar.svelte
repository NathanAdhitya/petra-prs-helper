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

	import pcuBlueLogo from './pcu-blue-logo.png';
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

	const activeClasses = 'bg-slate-800 hover:text-white';
	let currentlyOpenDropdown: NavDropdown | null = null;
</script>

<header
	class="flex h-16 items-center gap-4 border-b-4 border-b-[#a9a9a9] bg-slate-50 px-4 py-2 lg:h-[60px] lg:px-6"
>
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button variant="outline" size="icon" class="shrink-0 2xl:hidden" builders={[builder]}>
				<Menu class="h-5 w-5" />
				<span class="sr-only">Toggle navigation menu</span>
			</Button>
		</Sheet.Trigger>

		<Sheet.Content side="left" class="flex max-w-[100vw] flex-col bg-slate-700 p-0 text-white">
			<ScrollArea class="flex-1 p-4">
				<nav class="grid gap-2 text-lg font-medium">
					<a href="/berita" class="flex items-center gap-2 text-lg font-semibold">
						<img
							src={pcuBlueLogo}
							alt="PCU Logo"
							class="max-w-auto mb-2 h-24 max-h-full w-auto rounded-lg bg-slate-50 p-4 pb-3"
						/>
						<span class="sr-only">SIM Petra</span>
					</a>
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
				</nav>
			</ScrollArea>
		</Sheet.Content>
	</Sheet.Root>
	<a href="/berita" class="block h-full 2xl:hidden">
		<img
			src={pcuBlueLogo}
			alt="PCU Logo"
			class="max-w-auto mb-2 h-auto max-h-full w-auto rounded-lg bg-slate-50 pt-1"
		/>
		<span class="sr-only">SIM Petra</span>
	</a>
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
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="secondary"
				class="h-full rounded-xl bg-neutral-200/80 hover:bg-neutral-300"
			>
				<div class="flex items-center gap-2 align-middle">
					<div class="text-right leading-3">
						<p>{namaUser}</p>
						<p class="text-xs text-muted-foreground">{nrpUser}</p>
					</div>
					<CircleUser class="h-8 w-8" />
				</div>
				<span class="sr-only">Toggle user menu</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Label class="pb-0">{namaUser}</DropdownMenu.Label>
			<DropdownMenu.Label class="pt-0 text-xs text-muted-foreground">{nrpUser}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Biodata</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item href="/login">Logout</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</header>
