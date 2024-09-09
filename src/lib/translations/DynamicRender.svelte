<script lang="ts">
  import type { DynamicRenderConfig } from './model';

  export let config!: DynamicRenderConfig;
</script>

{#if typeof config === 'string'}
  {config}
{:else if 'tag' in config}
  <svelte:element
    this={config.tag}
    {... config.attrs ?? []}
  >{
    config.content ?? ''
  }</svelte:element>
{:else if 'component' in config}
  {#if config.slots}
    <svelte:component
      this={config.component}
      {... config.props ?? []}
    >
      {#if config.slots}
        {#each Object.entries(config.slots) as [key, slotContent]}
          {#if key === 'default'}{
            slotContent
          }{/if}
          <!-- TODO(netux): support other slots, somehow? -->
        {/each}
      {/if}
    </svelte:component>
  {:else}
    <!-- Svelte logs a warning if we try providing slots for components that don't need them -->
    <svelte:component
      this={config.component}
      {... config.props ?? []}
    />
  {/if}
{/if}
