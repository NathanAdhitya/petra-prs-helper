<script>
	import '../app.css';
	import 'trickling/lib/style.css';
	import { createTrickling } from 'trickling';
	import { navigating } from '$app/stores';

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

<slot></slot>

<style></style>
