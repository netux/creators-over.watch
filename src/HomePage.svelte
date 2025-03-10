<script lang="ts">
  import { t } from 'svelte-i18n';
	import StatsChart from 'svelte-ionicons/StatsChart.svelte';
  import WorkshopUpdateTimeCounters from './lib/WorkshopUpdateTimeCounters.svelte';
  import { LAST_BIG_UPDATE_DATE, LAST_OKAY_UPDATE_DATE } from './lib/env';
	import { Link } from 'svelte-routing';
</script>

<style lang="scss">
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    padding: 1rem;
    display: flex;

    &__buttons {
      width: fit-content;
      margin-left: auto;

      :global(> svg), :global(> a > svg) {
        width: 3vmin;
        height: auto;
        aspect-ratio: 1;
      }
    }
  }

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

<header class="header">
  <div class="header__buttons">
    <Link to="/timeline" title={$t("HomePage.header.buttons.timeline-link-tooltip")}>
      <StatsChart role="button" />
    </Link>
  </div>
</header>

<div class="counters">
  <WorkshopUpdateTimeCounters
    lastBigUpdate={LAST_BIG_UPDATE_DATE}
    lastOkayUpdate={LAST_OKAY_UPDATE_DATE}
  />
</div>
