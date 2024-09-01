<script lang="ts">
	import { formatDate } from 'date-fns';
  import { flip, shift } from '@floating-ui/core';
	import Floating from './Floating.svelte';
	import ExternalAnchor from './ExternalAnchor.svelte';
	import { getPatchNoteLink } from './util';
  import { PlotPointType } from './model';
	import type { PlotPoint } from './model';

  export let plotPoint!: PlotPoint;
  export let plotPointElement!: Element;

  let plotPointDateAsISO: string;
  $: plotPointDateAsISO = formatDate(plotPoint.date, 'LLLL dd, yyyy');
</script>

<style lang="scss">
  :root {
    --TimelinePlotPointPopover--background-color: #2C2C2C;
    --TimelinePlotPointPopover--header-bottom-border-color: #8D8D8D;

    --TimelinePlotPointPopover--workshop-highlight-color: #FFA536;

    @media (prefers-color-scheme: light) {
      --TimelinePlotPointPopover--background-color: #F1F1F1;
      --TimelinePlotPointPopover--header-bottom-border-color: #D1D1D1;

      --TimelinePlotPointPopover--workshop-highlight-color: #E18B20;
    }
  }

  .container {
    margin-bottom: 1rem;
    max-width: 400px;
    font-size: 0.8rem;
    background-color: var(--TimelinePlotPointPopover--background-color);
    border-radius: 0.5rem;
  }

  .content {
    padding: 0.5rem;
  }

  .header {
    font-weight: bold;
    padding: 0.5rem 0.5rem 0.25rem 0.5rem;
    border-bottom: 1px solid var(--TimelinePlotPointPopover--header-bottom-border-color);
  }

  .highlights {
    padding: 0;
    padding-left: 1rem;
    margin: 0;

    &__item--workshop {
      color: var(--TimelinePlotPointPopover--workshop-highlight-color);
      font-weight: bold;
    }
  }
</style>

<Floating
  {...$$restProps}
  referenceElement={plotPointElement}
  config={{
    placement: 'top-start',
    middleware: [flip(), shift()]
  }}
>
  <div class="container">
    <header class="header">
      {#if plotPoint.type === PlotPointType.OVERWATCH_PATCH_NOTE}
        {@const patchNoteLink = getPatchNoteLink(plotPoint.date)}
        {plotPointDateAsISO} Patch (<ExternalAnchor href={patchNoteLink}>notes</ExternalAnchor>)
      {:else if plotPoint.type === PlotPointType.EMPLOYEE_STATUS_CHANGE}
        {plotPointDateAsISO}
      {/if}
    </header>
    <div class="content">
      {#if plotPoint.type === PlotPointType.OVERWATCH_PATCH_NOTE}
        {#if plotPoint.stat.highlights.length + plotPoint.stat.workshopHighlights.length > 0}
          <ul class="highlights">
            {#each plotPoint.stat.workshopHighlights as highlight}
              <li class="highlights__item highlights__item--workshop">{highlight}</li>
            {/each}
            {#each plotPoint.stat.highlights as highlight}
              <li class="highlights__item">{highlight}</li>
            {/each}
          </ul>
        {:else}
          <i>Nothing interesting</i>
        {/if}
      {:else if plotPoint.type === PlotPointType.EMPLOYEE_STATUS_CHANGE}
        <b>{plotPoint.stat.employee}</b> leaves Blizzard Entertainment
      {/if}
    </div>
  </div>
</Floating>
