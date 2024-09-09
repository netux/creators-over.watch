<script lang="ts">
	import { t } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { differenceSinceDate, prettyJoin } from './util'

	export let since: Date;

	let text: string = '';

	function update() {
		const { years, months, days } = differenceSinceDate(since);

		text = prettyJoin(
			([[years, 'years'], [months, 'months'], [days, 'days']] as const)
				.filter(([count]) => count > 0)
				.map(
					([count, part]) =>
						`${count} ${$t(`_misc.date.parts.${part}`, {
							values: {
								[part]: count
							}
						})}`
					)
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
