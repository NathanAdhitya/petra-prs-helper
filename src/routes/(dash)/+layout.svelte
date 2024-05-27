<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import MdSidebar from './partials/md-sidebar.svelte';
	import TopBar from './partials/top-bar.svelte';

	import { Newspaper } from 'lucide-svelte';

	interface NavigationMenu {
		icon: typeof Newspaper;
		label: string;
		href: string;
	}

	interface NavigationSeparator {
		aterSeparator?: string;
	}

	type NavigationComponent = NavigationMenu | NavigationSeparator | NavigationComponent[];

	const navigationEntries: NavigationComponent[] = [
		{
			icon: Newspaper,
			label: 'Berita',
			href: '/home'
		}
	];
</script>

<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
	<MdSidebar />
	<div class="flex flex-col">
		<TopBar />
		<main class="flex flex-1 flex-col gap-4 bg-slate-300 p-4 lg:gap-6 lg:p-6">
			<slot />
		</main>
	</div>
</div>
