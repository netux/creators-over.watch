<script lang="ts">
  import { t } from 'svelte-i18n';
  import FancyCounter from './FancyCounter.svelte';
  import SimpleCounter from './SimpleCounter.svelte';
  import ExternalAnchor from './ExternalAnchor.svelte';
	import ComplexTranslation from './translations/ComplexTranslation.svelte';
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

<div class="before">{$t('WorkshopUpdateTimeCounters.last-big-update.before')}</div>
<div class="big-counter">
  <FancyCounter since={lastBigUpdate} />
</div>
<div class="after">
  <ComplexTranslation
    t={$t('WorkshopUpdateTimeCounters.last-big-update.after')}
    markers={{
      link: (text) => ({
        component: ExternalAnchor,
        props: {
          href: getPatchNoteLink(lastBigUpdate)
        },
        slots: {
          default: text
        }
      })
    }}
  />
</div>

{#if lastOkayUpdate != null}
  <hr />

  <small>
    <ComplexTranslation
      t={$t('WorkshopUpdateTimeCounters.last-okay-update')}
      markers={{
        timeSince: (text) => ({
          component: SimpleCounter,
          props: {
            since: lastOkayUpdate
          }
        }),
        link: (text) => ({
          component: ExternalAnchor,
          props: {
            href: getPatchNoteLink(lastOkayUpdate)
          },
          slots: {
            default: text
          }
        })
      }}
    />
  </small>
{/if}
