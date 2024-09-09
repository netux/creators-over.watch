<script lang="ts">
	import { t } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { differenceSinceDate, padLeftWithZeroes } from './util';

	export let since: Date;

	let years: number, months: number, days: number;

	function update() {
		const diff = differenceSinceDate(since);

		years = diff.years;
		months = diff.months;
		days = diff.days;
	}

	onMount(() => {
		const updateInterval = setInterval(update, 500);
		update();

		return () => { // onUnmount()
			clearInterval(updateInterval);
		}
	})
</script>

<style lang="scss">
	:root {
		--Counter__border-color: #242424;
		--Counter__background-color: #1c1c1c;

		@media (prefers-color-scheme: light) {
			--Counter__border-color: #d6d6d6;
			--Counter__background-color: #d9d9d9;
		}
	}

	.counter {
		padding: 1rem;
		border: 1px solid var(--Counter__border-color);
		background-color: var(--Counter__background-color);
		border-radius: 1rem;
		font-size: 4rem;

		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		grid-template-rows: 1fr auto;
	}

	.digit, .separator {
		font-family: monospace;
		line-height: 1.2;
	}

	.separator {
		align-self: start;
		grid-row-start: span 2;
	}

	.label {
		font-size: 1rem;
	}
</style>

<div class="counter">
	<span class="digit">{padLeftWithZeroes(years)}</span>
	<span class="separator">:</span>
	<span class="digit">{padLeftWithZeroes(months)}</span>
	<span class="separator">:</span>
	<span class="digit">{padLeftWithZeroes(days)}</span>

	<span class="label">{$t('_misc.date.parts.years', {
		values: {
			years
		}
	})}</span>
	<span class="label">{$t('_misc.date.parts.months', {
		values: {
			months
		}
	})}</span>
	<span class="label">{$t('_misc.date.parts.days', {
		values: {
			days
		}
	})}</span>
</div>
