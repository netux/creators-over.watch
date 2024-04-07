<script lang="ts">
  import {
    LAST_BIG_UPDATE_TIMESTAMP,
    LAST_OKAY_UPDATE_TIMESTAMP,
    FOOTER_BANNER_TEXT
  } from './lib/env';
  import FancyCounter from './lib/FancyCounter.svelte';
  import SimpleCounter from './lib/SimpleCounter.svelte';
  import ExternalAnchor from './lib/ExternalAnchor.svelte';
  import { padLeftWithZeroes } from './lib/util';

  function getPatchNoteLink(update: Date) {
    const year = update.getFullYear(),
          month = update.getMonth() + 1,
          day = update.getDate();
    return "https://overwatch.blizzard.com/en-us/news/patch-notes/live/" +
      `${year}/${padLeftWithZeroes(month)}` +
      `#patch-${padLeftWithZeroes(year, 4)}-${padLeftWithZeroes(month)}-${padLeftWithZeroes(day)}`
  }
</script>

<style lang="scss">
  :root {
    --App__footer-text-color: rgba(255, 255, 255, 0.69);
    --App__footer-outline-color: #5d5d5d;

    @media (prefers-color-scheme: light) {
      --App__footer-text-color: var(--text-color);
      // --App__footer-outline-color: /* same */;
    }
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

  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0.5rem 0.25rem;
    text-align: left;
    font-size: 0.8rem;
    color: var(--App__footer-text-color);
    border-top: 1px solid var(--App__footer-outline-color);
  }
</style>

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

{#if FOOTER_BANNER_TEXT}
  <footer>
    { FOOTER_BANNER_TEXT }
  </footer>
{/if}
