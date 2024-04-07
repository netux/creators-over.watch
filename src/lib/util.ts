import {
	differenceInYears,
	differenceInMonths,
} from 'date-fns';

function differenceInDays(now: Date, since: Date) {
	const ONE_DAY = 24 * 60 * 60 * 1000;

	const lastDayOfThenMonth = new Date(
		new Date(since.getFullYear(), since.getMonth() + 1, 0)
			.getTime() - (ONE_DAY - 1000)
	);
	const totalDaysInThenMonth = lastDayOfThenMonth.getDate() + 1; // +1 because timezones are annoying
	const daysPassedThenMonth = since.getDate();
	const daysPassedThisMonth = now.getDate();

	return (totalDaysInThenMonth - daysPassedThenMonth) + daysPassedThisMonth;
}

export function differenceSinceDate(since: Date) {
	const now = new Date();

	return {
		years: differenceInYears(now, since),
		months: differenceInMonths(now, since) % 12,
		days: differenceInDays(now, since)
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
