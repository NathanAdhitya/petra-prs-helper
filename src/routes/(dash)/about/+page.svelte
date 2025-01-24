<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { getLocalTimeZone, today } from '@internationalized/date';

	import { titleStore } from '$lib/stores.js';
	import { onMount } from 'svelte';

	onMount(() => ($titleStore = 'About'));
</script>

<div class="flex w-full justify-center gap-3">
	<Card.Root class="max-w-screen-md">
		<Card.Header>
			<span class="text-lg font-semibold">About the Project</span>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<div class="flex flex-col gap-4">
				This project was made as a part of the Human Computer Interaction (IMK) course in PCU. Due
				to the need of an easy-to-use method to plan for courses to take, this project has then been
				further developed into a separate website.

				<div>
					Thank you to all of the people who contributed in the development of the project, notably:
					<ul class="list-disc pl-8">
						<li>Adi Wibowo (Lecturer of the IMK course)</li>
						<li>Nathan Adhitya (Maintainer, Team member)</li>
						<li>Aubrey Ruizhi (Team member)</li>
						<li>Defnie Wendie (Team member)</li>
						<li>Kevin Alexander (Team member)</li>
						<li>Leonardo Tanaya (Team member)</li>
						<li>Nathanael Gladwin (Team member)</li>
						<li>and the many testers who helped us find bugs and improve the project</li>
					</ul>
				</div>

				<div class="font-semibold">
					Have ideas to improve this project? Create an issue at <a
						href="https://github.com/NathanAdhitya/petra-prs-helper/issues"
						class="text-blue-400 hover:underline">the issues page</a
					>
					or contribute directly at
					<a
						href="https://github.com/NathanAdhitya/petra-prs-helper"
						class="text-blue-400 hover:underline">the GitHub repository!</a
					>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
