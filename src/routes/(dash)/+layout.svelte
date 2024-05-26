<script lang="ts">
	import Sidebar from './partials/sidebar.svelte';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';

	import pcuBlueLogo from './partials/pcu-blue-logo.png';
	import Separator from '$lib/components/ui/separator/separator.svelte';
</script>

<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
	<div class="hidden border-r bg-white md:block">
		<div class="flex h-full max-h-screen flex-col">
			<div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
				<a href="/home" class="flex h-full w-full items-center py-2">
					<img src={pcuBlueLogo} alt="PCU Logo" class="max-w-auto h-auto max-h-full w-auto" />
				</a>
			</div>
			<div class="flex-1 bg-slate-700 pt-4 text-white">
				<nav class="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
					<a
						href="##"
						class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-300"
					>
						<!-- <Home class="h-4 w-4" /> -->
						Berita
					</a>
					<a
						href="##"
						class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-300"
					>
						<!-- <Home class="h-4 w-4" /> -->
						Biodata
					</a>
					<Separator />
					<a
						href="##"
						class="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2 text-white transition-all hover:text-white"
					>
						<!-- <Package class="h-4 w-4" /> -->
						Products
					</a>
				</nav>
			</div>
		</div>
	</div>
	<div class="flex flex-col">
		<header class="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
			<Sheet.Root>
				<Sheet.Trigger asChild let:builder>
					<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
						<!-- <Menu class="h-5 w-5" /> -->
						<span class="sr-only">Toggle navigation menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="flex flex-col">
					<nav class="grid gap-2 text-lg font-medium">
						<a href="##" class="flex items-center gap-2 text-lg font-semibold">
							<!-- <Package2 class="h-6 w-6" /> -->
							<span class="sr-only">Acme Inc</span>
						</a>
						<a
							href="##"
							class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<!-- <Home class="h-5 w-5" /> -->
							Dashboard
						</a>
						<a
							href="##"
							class="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
						>
							<!-- <ShoppingCart class="h-5 w-5" /> -->
							Orders
							<Badge class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
								6
							</Badge>
						</a>
						<a
							href="##"
							class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<!-- <Package class="h-5 w-5" /> -->
							Products
						</a>
						<a
							href="##"
							class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<!-- <Users class="h-5 w-5" /> -->
							Customers
						</a>
						<a
							href="##"
							class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<!-- <LineChart class="h-5 w-5" /> -->
							Analytics
						</a>
					</nav>
				</Sheet.Content>
			</Sheet.Root>
			<div class="w-full flex-1">
				<form>
					<div class="relative">
						<!-- <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> -->
						<Input
							type="search"
							placeholder="Search products..."
							class="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
						/>
					</div>
				</form>
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
						<!-- <CircleUser class="h-5 w-5" /> -->
						<span class="sr-only">Toggle user menu</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
					<DropdownMenu.Item>Support</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Logout</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</header>
		<main class="flex flex-1 flex-col gap-4 bg-slate-300 p-4 lg:gap-6 lg:p-6">
			<slot />
		</main>
	</div>
</div>
