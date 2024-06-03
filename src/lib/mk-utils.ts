export function properCase(str: string) {
	return str.replace(/\w\S*/g, function (txt) {
		if (txt.toLowerCase() === 'dan') return txt.toLowerCase();
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
	const words = str.split(' ');

	// Remove any words that are "dan"
	const filteredWords = words.filter(
		(word) => word.toLowerCase() !== 'dan' && word.toLowerCase() !== 'and'
	);

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
		let combined = firstSyllables.join('');

		// If the combined name is longer than 8 characters, then only take the initials of each word
		if (combined.length > 8 || force) {
			const initials = filteredWords.map((word) => word[0]);
			combined = initials.join('');
		}

		return combined;
	}

	// If there are more than two words, then take the initial of each word
	const initials = filteredWords.map((word) => word[0]);
	return initials.join('');
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
