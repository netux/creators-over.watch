<script lang="ts">
  import * as env from './lib/env'
  import FancyCounter from './lib/FancyCounter.svelte'
  import SimpleCounter from './lib/SimpleCounter.svelte'
</script>

<style lang="scss">
  .header, .counter, .footer {
    margin: 1rem 0;
  }

  .header {
    font-size: 1.5rem;
  }
</style>

<div class="header">It's been</div>
<div class="counter">
  <FancyCounter since={env.LAST_BIG_UPDATE_TIMESTAMP} />
</div>
<div class="footer">
  since the last big
  <a href={env.LAST_BIG_UPDATE_PATCH_NOTES_LINK} target="_blank">Overwatch Workshop update</a>
</div>

<hr />

<small>
  And
  <SimpleCounter since={env.LAST_OKAY_UPDATE_TIMESTAMP} />
  since the last moderately okay
  <a href={env.LAST_OKAY_UPDATE_PATCH_NOTES_LINK} target="_blank">Overwatch Workshop update</a>
</small>
