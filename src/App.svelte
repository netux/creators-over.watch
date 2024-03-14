<script lang="ts">
  import * as env from './lib/env'
  import Counter from './lib/Counter.svelte'
</script>

<h2>Time since last big Overwatch Workshop update</h2>

<Counter since={env.LAST_UPDATE_TIMESTAMP} />
