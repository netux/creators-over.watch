<script lang="ts">
	import { onMount } from 'svelte';
	import { differenceSinceDate, pluralize, prettyJoin } from './util'

	export let since: Date;

	let text: string = '';

	function update() {
		const { years, months, days } = differenceSinceDate(since);

		text = prettyJoin(
			([[years, 'year'], [months, 'month'], [days, 'day']] as const)
				.filter(([count]) => count > 0)
				.map(([count, label]) => `${count} ${pluralize(label, count)}`)
		);
	}

	onMount(() => {
		const updateInterval = setInterval(update, 500);
		update();

		return () => { // onUnmount()
			clearInterval(updateInterval);
		}
	})
</script>

{text}
