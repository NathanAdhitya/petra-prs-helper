import type { KelasMataKuliah } from './mata-kuliah';
import { dowMap, timeToString } from './mock-data';

export function isRomanNumeral(str: string) {
	return /^[IVXLCDM]+$/.test(str);
}

export function properCase(str: string) {
	return str.replace(/\w\S*/g, function (txt) {
		if (txt.toLowerCase() === 'dan') return txt.toLowerCase();
		if (isRomanNumeral(txt)) return txt.toUpperCase();

		// If it ends with a ), then don't change it
		if (txt[txt.length - 1] === ')') return txt;

		return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
	});
}

export function lazyShortenMatkulName(str: string, force = false) {
	/**
	 * Only run shortedMatkulName if:
	 * 1. Consists of more than two words; or
	 * 2. Is longer than 15 characters
	 */
	const words = str.split(' ');
	if (words.length > 2 || str.length > 12 || force) {
		return shortenMatkulName(str, force);
	} else {
		return str;
	}
}

export function shortenMatkulName(str: string, force = false) {
	/**
	 * Rules for shortening matkul name:
	 * 1. If the matkul name consists of two words excluding "dan" or "and", take the first syllable of each word
	 * and combine them. If the combined name is longer than 8 characters, then only take the initials of each word.
	 * 2. If the matkul name consists of more than two words, take the initial of each word excluding "dan" or "and"
	 */

	// Split the string into words
	const originalWords = str.split(' ');

	// Remove any parentheses
	const words = originalWords.map((word) => word.replace(/\(.*\)/, ''));

	// If the last word is a roman numeral, preserve as-is
	const postfix = isRomanNumeral(words[words.length - 1]) ? ` ${words.pop()}` : '';

	// Remove any words that are "dan"
	const filteredWords = words.filter(
		(word) => word.toLowerCase() !== 'dan' && word.toLowerCase() !== 'and'
	);

	// If it only contains one word, then return the entire word
	if (filteredWords.length === 1) {
		return filteredWords[0] + postfix;
	}

	// If there are only two words, then take the first syllable of each word
	if (filteredWords.length === 2 && !force) {
		const firstSyllables = filteredWords.map((word) => {
			// Find the first vowel in the word followed by a consonant
			const match = word.match(/[aeiou][^aeiou]/i);
			if (match && match.index !== undefined) {
				return word.substring(0, match.index + 2);
			} else {
				// If no match is found, return the entire word
				return word;
			}
		});

		// Combine the first syllables
		let combined = firstSyllables.join('') + postfix;

		// If the combined name is longer than 8 characters, then only take the initials of each word
		if (combined.length > 8 || force) {
			const initials = filteredWords.map((word) => word[0]);
			combined = initials.join('');
		}

		return combined + postfix;
	}

	// If there are more than two words, then take the initial of each word if the word is not a roman numeral
	const initials = filteredWords.map((word) => (isRomanNumeral(word) ? word : word[0]));
	return initials.join('') + postfix;
}

export function guessMatkulSks(durationMinutes: number[]) {
	// Guess the SKS of a matkul based on the duration of its classes
	// The duration of a class is an array of integers representing the duration of each class in minutes

	// Take the median duration to account for input errors
	const sorted = durationMinutes.sort((a, b) => a - b);
	const median = sorted[Math.floor(sorted.length / 2)];

	// Guess the SKS based on the median duration
	return Math.floor(median / 60);
}

export function stringifyKelas(kelas: KelasMataKuliah) {
	if (!kelas.jadwal || kelas.jadwal.length === 0) return `${kelas.kelas} (Jadwal tidak tersedia)`;

	const mappedJadwal = kelas.jadwal.map(
		(jadwal) =>
			`${dowMap[jadwal.dayOfWeek]}, ${timeToString(
				jadwal.startHour,
				jadwal.startMinute
			)} - ${timeToString(jadwal.startHour, jadwal.startMinute + jadwal.durasi)}`
	);

	return `${kelas.kelas} (${mappedJadwal.join('; ')})`;
}
