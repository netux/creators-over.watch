<script lang="ts">
  import DynamicRender from './DynamicRender.svelte';
  import type { DynamicRenderConfig } from './model';

  export let t!: string;
  export let markers: Record<string, (text: string | undefined) => DynamicRenderConfig>;

  let content: DynamicRenderConfig[] = [];
  $: {
    content = [];

    const regex = /\<(?<markerName>[^:\>]*)(?::(?<text>[^\>]*))?\>/g;

    let match: RegExpExecArray | null = null;
    let lastMatchEnd = 0;
    while (match = regex.exec(t)) {
      const { markerName, text } = match.groups!;
      content.push(t.substring(lastMatchEnd, match.index));

      const markerFn = markers[markerName];
      if (!markerFn) {
        throw new Error(`Unknown marker ${markerName} in translation string '${t}'`);
      }

      content.push(markerFn(text ?? undefined));

      lastMatchEnd = match.index + match[0].length;
    }

    content.push(t.substring(lastMatchEnd));
  }
</script>

{#each content as part}
  <DynamicRender config={part} />
{/each}
