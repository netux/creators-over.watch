import {
	differenceInYears,
	differenceInMonths,
	differenceInDays,
} from 'date-fns';

export function differenceSinceDate(since: Date) {
	const now = new Date();

	return {
		years: differenceInYears(now, since),
		months: differenceInMonths(now, since) % 12,
		days: differenceInDays(now, since) % 30
	}
}

export function padLeftWithZeroes(number: number, count = 2) {
	return Math.floor(number).toString().padStart(count, "0");
}

export function pluralize(string: string, count: number) {
	return string + (count === 1 ? '' : 's');
}

export function prettyJoin(array: string[]) {
	return array.map((item, index) => {
		let suffix: string;
		if (index === array.length - 2) {
			suffix = ' and ';
		} else if (index !== array.length - 1) {
			suffix =', ';
		} else {
			suffix = '';
		}

		return item + suffix;
	}).join('')
}
