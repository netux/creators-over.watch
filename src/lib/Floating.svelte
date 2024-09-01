<script lang="ts">
  import { computePosition } from '@floating-ui/dom';
  import type { ComputePositionConfig, ComputePositionReturn} from '@floating-ui/dom';

  export let referenceElement!: Element;
  export let config: Partial<ComputePositionConfig> | undefined = undefined;

  let floatingElement: HTMLElement;
  let coords: Pick<ComputePositionReturn, 'x' | 'y'> = { x: 0, y: 0 };

  $: if (floatingElement && referenceElement) {
    recompute();
  }

  async function recompute() {
    coords = await computePosition(referenceElement, floatingElement, config);
  }
</script>

<style lang="scss">
  .floating {
    width: max-content;
    position: absolute;
  }
</style>

<svelte:window on:resize={recompute} />

<div
  {... $$restProps}
  class:floating={true}
  style:left={`${coords.x}px`}
  style:top={`${coords.y}px`}
  bind:this={floatingElement}
><slot /></div>
