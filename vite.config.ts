import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	optimizeDeps: {
		exclude: ["svelte-codemirror-editor", "codemirror", "@codemirror/lang-json"]
	},
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	]
});
