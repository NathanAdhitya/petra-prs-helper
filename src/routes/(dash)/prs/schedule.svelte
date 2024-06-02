<script lang="ts" context="module">
	export const dayLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

	export interface ScheduleEvent {
		dayOfWeek: keyof typeof dayLabels;
		startHour: number;
		startMinute: number;
		lengthMinutes: number;
	}
</script>

<script lang="ts" generics="Schedule extends ScheduleEvent">
	import { timeToString } from '$lib/mock-data';
	import clsx from 'clsx';

	export const startingTimeHour = 7;
	export const endingTimeHour = 19;

	export let schedules: Schedule[] = [];

	// This code is adapted from the following StackOverflow answer.
	// @see {@link https://stackoverflow.com/a/66252263}

	// Checks if two schedules collide.
	function collides(a: Schedule, b: Schedule) {
		return (
			a.dayOfWeek === b.dayOfWeek &&
			a.startHour + a.startMinute / 60 + a.lengthMinutes / 60 > b.startHour + b.startMinute / 60 &&
			a.startHour + a.startMinute / 60 < b.startHour + b.startMinute / 60 + b.lengthMinutes / 60
		);
	}

	// Expand schedule to the right until it doesn't collide with any other schedule.
	function expand(schedule: Schedule, colIdx: number, cols: Schedule[][]) {
		let colSpan = 1;
		cols.slice(colIdx + 1).some((col) => {
			if (col.some((v) => collides(v, schedule))) {
				return true;
			}
			colSpan++;
			return false;
		});

		return colSpan;
	}

	let computedSchedules: Schedule[][][][] = [];

	$: {
		// Reactively compute schedules for each day
		computedSchedules = dayLabels.map((day, di) => {
			// Filter schedules for the current day
			const daySchedules = schedules.filter((v) => v.dayOfWeek === di);

			// Sort schedules by start time
			const sortedSchedules = daySchedules.sort((a, b) => {
				if (a.startHour === b.startHour) {
					return a.startMinute - b.startMinute;
				}
				return a.startHour - b.startHour;
			});

			const groups: Schedule[][][] = [];
			let columns: Schedule[][] = [];
			let lastEventEnding: number | undefined;

			// Place each schedule in a column within a group
			sortedSchedules.forEach((schedule) => {
				// Check if a new event group needs to be started
				if (
					lastEventEnding !== undefined &&
					schedule.startHour + schedule.startMinute / 60 >= lastEventEnding
				) {
					groups.push(columns);
					columns = [];
					lastEventEnding = undefined;
				}

				// Try to place the event inside an existing column
				let placed = false;
				columns.some((col) => {
					if (!collides(col[col.length - 1], schedule)) {
						col.push(schedule);
						placed = true;
					}
					return placed;
				});

				// It was not possible to place the event (it overlaps
				// with events in each existing column). Add a new column
				// to the current event group with the event in it.
				if (!placed) columns.push([schedule]);

				// Remember the last event end time of the current group.
				lastEventEnding = Math.max(
					lastEventEnding ?? 0,
					schedule.startHour + schedule.startMinute / 60 + schedule.lengthMinutes / 60
				);
			});

			groups.push(columns);

			return groups;
		});
	}

	// // Function for calculating overlapping schedules and assigning them different sizes.
	// // Also calculate their left offset.
	// function calculateDaySizes(dayOfWeek: keyof typeof dayLabels) {
	// 	const daySchedules = schedules.filter((v) => v.dayOfWeek === dayOfWeek);
	// 	const sortedSchedules = daySchedules.sort((a, b) => {
	// 		if (a.startHour === b.startHour) {
	// 			return a.startMinute - b.startMinute;
	// 		}
	// 		return a.startHour - b.startHour;
	// 	});

	// 	const scheduleSizes = sortedSchedules.map((v) => {
	// 		const overlappingSchedules = sortedSchedules.filter(
	// 			(v2) =>
	// 				v2.startHour < v.startHour + v.lengthMinutes / 60 &&
	// 				v2.startHour + v2.lengthMinutes / 60 > v.startHour
	// 		);
	// 		const leftOffset = overlappingSchedules.indexOf(v) / overlappingSchedules.length;
	// 		const width = 1 / overlappingSchedules.length;
	// 		return { ...v, leftOffset, width };
	// 	});

	// 	return scheduleSizes;
	// }
</script>

<table class="h-full w-full border-collapse overflow-auto rounded-lg bg-slate-50 p-4">
	<thead>
		<th class="sticky top-0 bg-slate-100 p-2"></th>
		<th class="sticky top-0 bg-slate-100 p-2"></th>
		{#each dayLabels as day}
			<th class="sticky top-0 border bg-slate-100 p-2">{day}</th>
		{/each}
	</thead>
	<tbody>
		{#each Array.from({ length: (endingTimeHour - startingTimeHour) * 2 }, (_, i) => i) as stepTime}
			<tr>
				<td class="h-6 w-0 bg-slate-100 px-4 py-0.5 pr-2 text-xs text-muted-foreground">
					<div class="h-full w-full -translate-y-1/2">
						{stepTime % 2 === 0 ? `${timeToString(startingTimeHour + stepTime / 2, 0)}` : ''}
					</div>
				</td>
				<td class="w-2 border-y bg-slate-100"></td>
				{#each dayLabels as day, di}
					<td class="relative border">
						{#each computedSchedules[di] as cols}
							{#each cols as col, colIdx}
								{#each col as schedule}
									{#if schedule.startHour === Math.floor(startingTimeHour + stepTime / 2) && schedule.startMinute === (stepTime % 2) * 30}
										<div
											style={`height: calc(${(schedule.lengthMinutes / 30) * 100}% + ${schedule.lengthMinutes / 30}px); left: ${(colIdx / cols.length) * 100}%; width: ${(expand(schedule, colIdx, cols) / cols.length) * 100}%;`}
											class={clsx(`absolute top-0 p-0.5`)}
										>
											<slot {schedule} {day} {stepTime} />
										</div>
									{/if}
								{/each}
							{/each}
							<!-- {#if schedule.startHour === Math.floor(startingTimeHour + stepTime / 2) && schedule.startMinute === (stepTime % 2) * 30}
								<div
									style={`height: calc(${(schedule.lengthMinutes / 30) * 100}% + ${schedule.lengthMinutes / 30}px); left: ${schedule.leftOffset * 100}%; width: ${schedule.width * 100}%;`}
									class={clsx(`absolute top-0 p-0.5`)}
								>
									<slot {schedule} {day} {stepTime} />
								</div>
							{/if} -->
						{/each}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
