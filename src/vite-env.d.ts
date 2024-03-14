/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LAST_UPDATE_TIMESTAMP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
