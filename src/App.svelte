<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import { isLoading as areTranslationsLoading } from 'svelte-i18n';
	import HomePage from './HomePage.svelte';
	import TimelinePage from './TimelinePage.svelte';
  import { FOOTER_BANNER_TEXT } from './lib/env';

  import './lib/i18n';
</script>

<style lang="scss">
  :root {
    --App__footer-text-color: rgba(255, 255, 255, 0.69);
    --App__footer-outline-color: #5d5d5d;

    @media (prefers-color-scheme: light) {
      --App__footer-text-color: var(--primary-text-color);
      // --App__footer-outline-color: /* same */;
    }
  }

  .footer-banner {
    padding: 0.5rem 0.25rem;
    text-align: left;
    font-size: 0.8rem;
    color: var(--App__footer-text-color);
    white-space: break-spaces;
    border-top: 1px solid var(--App__footer-outline-color);
  }
</style>

{#if !$areTranslationsLoading}
  <Router>
    <Route
      component={HomePage}
    />
    <Route
      path="/timeline"
      component={TimelinePage}
    />
  </Router>

  {#if FOOTER_BANNER_TEXT}
    <footer class="footer-banner">
      {@html FOOTER_BANNER_TEXT.replace('\\n', '\n')}
    </footer>
  {/if}
{/if}
