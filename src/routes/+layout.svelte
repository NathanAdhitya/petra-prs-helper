<script>
	import '../app.css';
	import 'trickling/lib/style.css';
	import { createTrickling } from 'trickling';
	import { navigating } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

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

<ModeWatcher track={false} defaultMode="light" />
<Toaster theme="light" />
<slot></slot>

<style></style>
