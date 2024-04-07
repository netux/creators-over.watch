/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_LAST_UPDATE_TIMESTAMP: string;
  readonly PUBLIC_LAST_OKAY_UPDATE_TIMESTAMP: string;
  readonly PUBLIC_FOOTER_BANNER_TEXT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
