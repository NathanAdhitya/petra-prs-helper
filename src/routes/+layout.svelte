<script>
	import '@fontsource-variable/open-sans/wdth.css';

	import '../app.css';
	import 'trickling/lib/style.css';
	import { createTrickling } from 'trickling';
	import { navigating } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { titleStore } from '$lib/stores';
	import { onMount } from 'svelte';

	const tricklingProgress = createTrickling({
		showSpinner: false
	});

	$: {
		if ($navigating) {
			tricklingProgress.start();
		} else {
			tricklingProgress.done();
		}
	}

	onMount(() => {
		document.getElementById('static-load')?.remove();
	});
</script>

<svelte:head>
	<title>{$titleStore} • Petra PRS Helper</title>
</svelte:head>

<ModeWatcher track={false} defaultMode="light" />
<Toaster theme="light" />
<slot></slot>

<style></style>
