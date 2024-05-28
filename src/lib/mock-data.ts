export const dataLatencyMs = 50;

export const namaUser = 'John Doe';
export const nrpUser = 'C14220000';

export const dowMap = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
export function timeToString(hour: number, minute: number) {
	hour += Math.floor(minute / 60);
	minute %= 60;

	return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}
