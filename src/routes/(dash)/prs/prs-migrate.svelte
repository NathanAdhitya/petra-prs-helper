<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { chosenMatkul, ChosenMatkulUtils, jadwalDiffs } from '$lib/mk-state';
	import { properCase } from '$lib/mk-utils';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	$: foundDiffs = $jadwalDiffs.filter((d) => d !== null).length > 0;
	$: existingDiffs = $jadwalDiffs.filter((d) => d !== null && d !== false);
	$: missingDiffsExists = $jadwalDiffs.filter((d) => d === false).length > 0;

	onMount(() => {
		// Compare diffs in the background
		ChosenMatkulUtils.diffAgainstOriginal();
	});
</script>

{#if foundDiffs}
	<AlertDialog.Root>
		<AlertDialog.Trigger asChild let:builder>
			<div
				class="bg-slate-150 flex items-center gap-4 rounded-md border-2 border-solid border-gray-700 px-4 py-1 text-sm"
			>
				Terdapat perubahan jadwal sejak penyimpanan terakhir
				<Button builders={[builder]} variant="default" size="unstyled" class="px-4 py-1">
					Migrasi
				</Button>
			</div>
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Apakah Anda yakin?</AlertDialog.Title>
				<AlertDialog.Description>
					<p class="">
						Migrasi akan melakukan penggabungan data jadwal yang tersimpan dengan yang pada jadwal
						data sebenarnya.
					</p>
					<p class="mb-4 font-bold text-red-600">
						Pastikan Anda telah melakukan backup dengan melakukan export.
					</p>

					{#if existingDiffs.length > 0}
						<p class="font-bold mb-4">Perubahan terdeteksi untuk mata kuliah:</p>
						<ul class="list-disc pl-4">
							{#each existingDiffs as diff, idx}
								<li>
									{properCase(diff.nama)} ({diff.kode})
								</li>
							{/each}
						</ul>
						Perubahan di atas dapat dilakukan secara otomatis.
					{/if}

					{#if missingDiffsExists}
						<p class="font-bold">Mata kuliah yang tidak ada pada jadwal:</p>
						<ul class="list-disc pl-4">
							{#each $jadwalDiffs as diff, idx}
								{#if diff === false}
									<li>
										{properCase($chosenMatkul[idx].nama)} ({$chosenMatkul[idx].kode})
									</li>
								{/if}
							{/each}
						</ul>
						Mata kuliah yang tidak ada pada jadwal butuh dihapus secara manual dari pilihan.
					{/if}
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action
					on:click={() => {
						if (existingDiffs.length > 0) {
							ChosenMatkulUtils.migrate();
							toast.success('Migrasi berhasil');
						} else if (missingDiffsExists) {
							toast.info(
								'Migrasi butuh dilakukan secara manual. Silahkan hapus mata kuliah yang tidak ada pada jadwal.'
							);
						}
					}}
				>
					Continue
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
