<script lang="ts">
  import { t } from 'svelte-i18n';
  import WorkshopUpdateTimeCounters from './lib/WorkshopUpdateTimeCounters.svelte';
  import { LAST_BIG_UPDATE_DATE, LAST_OKAY_UPDATE_DATE } from './lib/env';
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
  <title>{$t('HomePage.tab-title')}</title>
</svelte:head>

<div class="counters">
  <WorkshopUpdateTimeCounters
    lastBigUpdate={LAST_BIG_UPDATE_DATE}
    lastOkayUpdate={LAST_OKAY_UPDATE_DATE}
  />
</div>
