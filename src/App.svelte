<script lang="ts">
  import * as env from './lib/env'
  import Counter from './lib/Counter.svelte'
</script>

<h2>Time since last <a href={env.LAST_UPDATE_PATCH_NOTES_LINK} target="_blank">big Overwatch Workshop update</a></h2>

<Counter since={env.LAST_UPDATE_TIMESTAMP} />
