<script lang="ts">
  import {
    LAST_BIG_UPDATE_TIMESTAMP,
    LAST_OKAY_UPDATE_TIMESTAMP
  } from './lib/env';
  import FancyCounter from './lib/FancyCounter.svelte';
  import SimpleCounter from './lib/SimpleCounter.svelte';
  import ExternalAnchor from './lib/ExternalAnchor.svelte';
  import { getPatchNoteLink } from './lib/util';
</script>

<style lang="scss">
  .container {
    margin: 0 auto;
    max-width: 1280px;
    margin: auto;
    padding: 2rem;
    text-align: center;
    place-self: center;
  }

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

<div class="container">
  <div class="before">It's been</div>
  <div class="big-counter">
    <FancyCounter since={LAST_BIG_UPDATE_TIMESTAMP} />
  </div>
  <div class="after">
    since the last important
    <ExternalAnchor href={getPatchNoteLink(LAST_BIG_UPDATE_TIMESTAMP)}>Overwatch Workshop update</ExternalAnchor>
  </div>

  {#if LAST_OKAY_UPDATE_TIMESTAMP}
    <hr />

    <small>
      and
      <SimpleCounter since={LAST_OKAY_UPDATE_TIMESTAMP} />
      since the last moderately okay
      <ExternalAnchor href={getPatchNoteLink(LAST_OKAY_UPDATE_TIMESTAMP)}>Overwatch Workshop update</ExternalAnchor>
    </small>
  {/if}
</div>
