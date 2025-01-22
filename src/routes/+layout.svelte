<script>
	import '../app.css';
	import 'trickling/lib/style.css';
	import { createTrickling } from 'trickling';
	import { navigating } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { titleStore } from '$lib/stores';

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
</script>

<svelte:head>
	<title>{$titleStore} • PRS Helper</title>
</svelte:head>

<ModeWatcher track={false} defaultMode="light" />
<Toaster theme="light" />
<slot></slot>

<style></style>
