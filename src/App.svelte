<script lang="ts">
  import { LAST_BIG_UPDATE_TIMESTAMP, LAST_OKAY_UPDATE_TIMESTAMP } from './lib/env';
  import FancyCounter from './lib/FancyCounter.svelte';
  import SimpleCounter from './lib/SimpleCounter.svelte';
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
  <FancyCounter since={LAST_BIG_UPDATE_TIMESTAMP} />
</div>
<div class="after">
  since the last important
  <a href={getPatchNoteLink(LAST_BIG_UPDATE_TIMESTAMP)} target="_blank">Overwatch Workshop update</a>
</div>

{#if LAST_OKAY_UPDATE_TIMESTAMP}
  <hr />

  <small>
    and
    <SimpleCounter since={LAST_OKAY_UPDATE_TIMESTAMP} />
    since the last moderately okay
    <a href={getPatchNoteLink(LAST_OKAY_UPDATE_TIMESTAMP)} target="_blank">Overwatch Workshop update</a>
  </small>
{/if}
