// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface HTMLElementEventMap {
		/** Close all open popovers/dialogs/whatever */
		'close-popovers': CustomEvent;

		/** Used for certain behaviours to advance to the next section automatically */
		'selection-made': CustomEvent;
	}

	declare const BUILD_TS: Date;
}
import 'unplugin-icons/types/svelte';
export {};
