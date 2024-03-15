<script lang="ts">
  import * as env from './lib/env'
  import Counter from './lib/Counter.svelte'
</script>

<style lang="scss">
  .header, .footer {
    margin: 1rem 0;
  }

  .header {
    font-size: 1.5rem;
  }
</style>

<div class="header">It's been</div>

<Counter since={env.LAST_UPDATE_TIMESTAMP} />

<div class="footer">
  since the last big
  <a href={env.LAST_UPDATE_PATCH_NOTES_LINK} target="_blank">Overwatch Workshop update</a>
</div>
