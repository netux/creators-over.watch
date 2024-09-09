import type { ComponentType, SvelteComponent } from 'svelte';

export type SveltePropsOf<C extends SvelteComponent> = C extends SvelteComponent<infer P, any, any> ? P : never;
// export type SvelteEventsOf<C extends SvelteComponent> = C extends SvelteComponent<any, any, infer S> ? S : never;
export type SvelteSlotsOf<C extends SvelteComponent> = C extends SvelteComponent<any, any, infer S> ? S : never;

export interface SvelteComponentAndProps<C extends SvelteComponent> {
  component: ComponentType<C>;
  props?: SveltePropsOf<C>;
  // events?: SvelteEventsOf<C>; // Maybe someday... ? Not needed right now, though.
  slots?: SvelteSlotsOf<C>;
}

export interface DOMElementAndAttrs<E extends Element> {
  tag: E["tagName"];
  attrs?: Record<string, unknown>;
  content?: string;
}

// TODO(netux): awful name
export type DynamicRenderConfig =
  | SvelteComponentAndProps<SvelteComponent>
  | DOMElementAndAttrs<HTMLElement>
  | string;
