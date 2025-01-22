<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import CodeMirror from 'svelte-codemirror-editor';
	import { json } from '@codemirror/lang-json';

	import { titleStore } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { derived } from 'svelte/store';
	import { chosenClasses, chosenMatkul } from '$lib/mk-state';
	import { toast } from 'svelte-sonner';
	import { jadwalKuliah } from '$lib/mata-kuliah';

	onMount(() => ($titleStore = 'Edit Data'));

	let dataPilihanKelasJson = '';
	onMount(() => (dataPilihanKelasJson = JSON.stringify($chosenClasses, null, 2)));

	let dataPilihanMatkulJson = '';
	onMount(() => (dataPilihanMatkulJson = JSON.stringify($chosenMatkul, null, 2)));

	let customJadwalJson = '';
	onMount(() => {
		const localStorageJadwal = localStorage.getItem('customJadwal');

		if (localStorageJadwal) {
			try {
				// Parse the JSON and load it into the store
				customJadwalJson = JSON.stringify(JSON.parse(localStorageJadwal), null, 2);
			} catch (e) {
				console.error(e);
			}
		}

		if (customJadwalJson === '') customJadwalJson = JSON.stringify($jadwalKuliah, null, 2);
	});

	let useCustomJadwal = localStorage.getItem('useCustomJadwal') === 'true';
	$: {
		localStorage.setItem('useCustomJadwal', String(useCustomJadwal));

		if (useCustomJadwal) {
			try {
				// Parse the JSON and load it into the store
				$jadwalKuliah = JSON.parse(customJadwalJson);
				console.log('Parsed and loaded custom data');
			} catch (e) {}
		}
	}

	let pilihanKelasError: string | null = null;
	let pilihanMatkulError: string | null = null;
	let customJadwalError: string | null = null;

	function applyPilihanKelas() {
		try {
			$chosenClasses = JSON.parse(dataPilihanKelasJson);
			pilihanKelasError = null;

			toast.success('Berhasil menerapkan data pilihan kelas');
		} catch (e) {
			if (e instanceof Error) {
				pilihanKelasError = e.message;
			}
			toast.error('Gagal menerapkan data pilihan kelas');

			console.error(e);
		}
	}

	function applyPilihanMatkul() {
		try {
			$chosenMatkul = JSON.parse(dataPilihanMatkulJson);
			pilihanMatkulError = null;

			toast.success('Berhasil menerapkan data pilihan matkul');
		} catch (e) {
			if (e instanceof Error) {
				pilihanMatkulError = e.message;
			}
			toast.error('Gagal menerapkan data pilihan matkul');

			console.error(e);
		}
	}

	function saveCustomJadwal() {
		try {
			// Parse JSON, then back to string before saving to localStorage
			const parsed = JSON.parse(customJadwalJson);
			localStorage.setItem('customJadwal', JSON.stringify(parsed));

			customJadwalError = null;
			toast.success('Berhasil menyimpan data jadwal');
		} catch (e) {
			if (e instanceof Error) {
				customJadwalError = e.message;
			}
			toast.error('Gagal menyimpan data jadwal');
			console.error(e);
		}
	}

	function resetDataJadwal() {
		customJadwalJson = JSON.stringify($jadwalKuliah, null, 2);
		useCustomJadwal = false;
	}
</script>

<div class="flex flex-col">
	<h1 class="text-4xl font-bold">Edit Data</h1>
	Untuk pengguna yang ingin eksperimen secara langsung
</div>

<div class="grid grid-cols-2 gap-4">
	<Card.Card>
		<Card.Header>
			<h2 class="text-lg font-semibold">Data Jadwal</h2>
		</Card.Header>
		<Card.Content>
			<div class="mb-6 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Checkbox bind:checked={useCustomJadwal} /> Gunakan data custom (mungkin butuh reload)
				</div>
				<div>
					<Button variant="destructive" on:click={resetDataJadwal}>Reset</Button>
					<Button variant="default" on:click={saveCustomJadwal}>Save Custom</Button>
				</div>
			</div>
			<CodeMirror
				bind:value={customJadwalJson}
				lang={json()}
				styles={{
					'&': {
						height: '24rem'
					}
				}}
			/>
			{#if customJadwalError}
				<p class="text-red-500">{customJadwalError}</p>
			{/if}
		</Card.Content>
	</Card.Card>
	<Card.Card>
		<Card.Header>
			<h2 class="text-lg font-semibold">Data Pilihan Kelas</h2>
		</Card.Header>
		<Card.Content>
			<div class="mb-6 flex items-center justify-end">
				<Button variant="default" on:click={applyPilihanKelas}>Apply</Button>
			</div>
			<CodeMirror
				bind:value={dataPilihanKelasJson}
				lang={json()}
				styles={{
					'&': {
						height: '24rem'
					}
				}}
			/>
			{#if pilihanKelasError}
				<p class="text-red-500">{pilihanKelasError}</p>
			{/if}
		</Card.Content>
	</Card.Card>
	<Card.Card>
		<Card.Header>
			<h2 class="text-lg font-semibold">Data Pilihan Matkul</h2>
		</Card.Header>
		<Card.Content>
			<div class="mb-6 flex items-center justify-end">
				<Button variant="default" on:click={applyPilihanMatkul}>Apply</Button>
			</div>
			<CodeMirror
				bind:value={dataPilihanMatkulJson}
				lang={json()}
				styles={{
					'&': {
						height: '24rem'
					}
				}}
			/>
			{#if pilihanMatkulError}
				<p class="text-red-500">{pilihanMatkulError}</p>
			{/if}
		</Card.Content>
	</Card.Card>
</div>
