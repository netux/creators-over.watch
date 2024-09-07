<script lang="ts">
  import FancyCounter from './FancyCounter.svelte';
  import SimpleCounter from './SimpleCounter.svelte';
  import ExternalAnchor from './ExternalAnchor.svelte';
  import { getPatchNoteLink } from './util';

  export let lastBigUpdate!: Date;
  export let lastOkayUpdate: Date | null | undefined;
</script>

<style lang="scss">
  .before, .big-counter, .after {
    margin: 1rem 0;
  }

  .before {
    font-size: 1.5rem;
  }

  .big-counter {
    width: fit-content;
    margin: 0 auto;
  }
</style>

<div class="before">It's been</div>
<div class="big-counter">
  <FancyCounter since={lastBigUpdate} />
</div>
<div class="after">
  since the last important
  <ExternalAnchor href={getPatchNoteLink(lastBigUpdate)}>Overwatch Workshop update</ExternalAnchor>
</div>

{#if lastOkayUpdate != null}
  <hr />

  <small>
    and
    <SimpleCounter since={lastOkayUpdate} />
    since the last moderately okay
    <ExternalAnchor href={getPatchNoteLink(lastOkayUpdate)}>Overwatch Workshop update</ExternalAnchor>
  </small>
{/if}
