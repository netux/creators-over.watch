<script lang="ts">
  import { Router, Route } from "svelte-routing";
	import HomePage from './HomePage.svelte';
	import TimelinePage from './TimelinePage.svelte';
  import { FOOTER_BANNER_TEXT } from './lib/env';
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
    border-top: 1px solid var(--App__footer-outline-color);
  }
</style>

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
    { FOOTER_BANNER_TEXT }
  </footer>
{/if}
