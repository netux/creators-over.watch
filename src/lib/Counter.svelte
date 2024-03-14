<script lang="ts">
	import {
		differenceInYears,
		differenceInMonths,
		differenceInDays,
		differenceInHours,
		differenceInMinutes,
		differenceInSeconds,
		addMonths
	} from 'date-fns';
	import { onMount } from 'svelte';

	export let since: Date;

	let years: number, months: number, days: number,
			hours: number, minutes: number, seconds: number;

	function update() {
		const now = new Date();
		const remainingMonthsDate = addMonths(since, years * 12 + months);

		years = differenceInYears(now, since);
		months = differenceInMonths(now, since) - years * 12;
		days = differenceInDays(now, remainingMonthsDate);
		hours = differenceInHours(now, remainingMonthsDate) % 24;
		minutes = differenceInMinutes(now, remainingMonthsDate) % 60;
		seconds = differenceInSeconds(now, remainingMonthsDate) % 60;
	}

	function formatClockDigits(number: number) {
		return Math.floor(number).toString().padStart(2, "0");
	}

	onMount(() => {
		const updateInterval = setInterval(update, 500);
		update();

		return () => { // onUnmount()
			clearInterval(updateInterval);
		}
	})
</script>

{
[hours, minutes, seconds]
	.map((number) => formatClockDigits(number))
	.join(':')
}

{#if days > 0}
	{days} day{days === 1 ? '' : 's'}
{/if}

{#if months > 0}
	{months} month{months === 1 ? '' : 's'}
{/if}

{#if years > 0}
	{years} year{years === 1 ? '' : 's'}
{/if}
