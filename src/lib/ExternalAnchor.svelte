<script lang="ts">
  import Exit from 'svelte-ionicons/ExitOutline.svelte';
	import type { HTMLAnchorAttributes, HTMLAttributeAnchorTarget } from 'svelte/elements';

	interface $$Props extends HTMLAnchorAttributes {
		target?: HTMLAttributeAnchorTarget | undefined;
	}

	export let target = "_blank";
</script>

<style lang="scss">
	.icon {
		margin-left: 0.5ch;

		:global(> svg) {
			width: 1em;
			height: 1em;
			vertical-align: text-bottom;
		}
	}
</style>

<!-- svelte-ignore a11y-missing-attribute -->
<a {target} { ... $$restProps}>
	<slot /><span class="icon"><Exit /></span>
</a>
