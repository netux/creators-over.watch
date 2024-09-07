<script lang="ts">
  import {
    LAST_BIG_UPDATE_DATE,
    LAST_OKAY_UPDATE_DATE
  } from './lib/env';
  import WorkshopUpdateTimeCounters from './lib/WorkshopUpdateTimeCounters.svelte';
</script>

<style lang="scss">
  .counters {
    max-width: 1280px;
    padding: 2rem;
    margin: auto;
    text-align: center;
    place-self: center;
  }
</style>

<svelte:head>
  <title>Creators of Overwatch</title>
</svelte:head>

<div class="counters">
  <WorkshopUpdateTimeCounters
    lastBigUpdate={LAST_BIG_UPDATE_DATE}
    lastOkayUpdate={LAST_OKAY_UPDATE_DATE}
  />
</div>
