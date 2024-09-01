/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-jsonx/client" />
/// <reference types="jsonc-assets" />

interface ImportMetaEnv {
  readonly PUBLIC_LAST_UPDATE_TIMESTAMP: string;
  readonly PUBLIC_LAST_OKAY_UPDATE_TIMESTAMP: string;
  readonly PUBLIC_FOOTER_BANNER_TEXT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
