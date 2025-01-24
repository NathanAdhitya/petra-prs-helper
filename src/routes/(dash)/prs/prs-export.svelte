<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { chosenClasses, chosenMatkul, ChosenMatkulUtils } from '$lib/mk-state';
	import { Download, Upload } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { get } from 'svelte/store';

	function exportJSON(): string {
		const obj = {
			chosenMatkul: get(chosenMatkul),
			chosenClasses: get(chosenClasses)
		};

		return JSON.stringify(obj, null, 2);
	}

	function importJSON(s: string) {
		try {
			const obj = JSON.parse(s);

            if (!obj.chosenMatkul || !obj.chosenClasses) {
                throw new Error('Keys chosenMatkul and chosenClasses are required');
            }

			chosenMatkul.set(obj.chosenMatkul);
			chosenClasses.set(obj.chosenClasses);
            ChosenMatkulUtils.recalculateAvailableColors();
            
            toast.success('Imported successfully');
		} catch (e) {
            console.error(e);
			toast.error('Invalid import file, check the console for more info');
		}
	}

	function onExportClick() {
		const blob = new Blob([exportJSON()], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');

		const fileSuffix = new Date().toLocaleString("id-ID", {
            dateStyle: "short",
            timeStyle: "medium",
        }).replaceAll('/', '-').replaceAll(", ", '-');

		a.href = url;
		a.download = `prs.natha.my.id-${fileSuffix}.json`;
		a.click();

		URL.revokeObjectURL(url);
        toast.success('Exported successfully, check your downloads.');
	}

	function onImportClick() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';
		input.onchange = () => {
			if (!input.files) return;

			const file = input.files[0];
			const reader = new FileReader();
			reader.readAsText(file);
			reader.onload = () => {
				importJSON(reader.result as string);
			};
		};
		input.click();
	}
</script>

<Button variant="outline" on:click={onExportClick}>
	Export <Download class="ml-2 h-4 w-4" />
</Button>

<Button variant="outline" on:click={onImportClick}>
	Import <Upload class="ml-2 h-4 w-4" />
</Button>
