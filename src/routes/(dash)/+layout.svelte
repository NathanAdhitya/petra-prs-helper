<script lang="ts">
	import MdSidebar from './partials/md-sidebar.svelte';
	import TopBar from './partials/top-bar.svelte';
</script>

<div class="grid min-h-screen w-full 3xl:grid-cols-[240px_1fr]">
	<MdSidebar />
	<div class="flex flex-col">
		<TopBar />
		<main class="flex flex-1 flex-col gap-4 bg-slate-300 p-4 lg:gap-6 lg:p-6">
			<slot />
		</main>
	</div>
</div>
