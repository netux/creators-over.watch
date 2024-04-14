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
		margin-left: 0.25ch;
		user-select: none;

		:global(> svg) {
			width: 1.2em;
			aspect-ratio: 1;
			vertical-align: middle;
		}
	}
</style>

<!-- svelte-ignore a11y-missing-attribute -->
<a {target} { ... $$restProps}>
	<slot /><span class="icon"><Exit /></span>
</a>
