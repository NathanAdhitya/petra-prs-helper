<script lang="ts">
	import MdSidebar from './partials/md-sidebar.svelte';
	import TopBar from './partials/top-bar.svelte';
</script>

<div class="flex flex-col min-h-screen h-full w-full 3xl:flex-row">
	<MdSidebar />
	<TopBar />
	<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
		<slot />
	</main>
</div>
