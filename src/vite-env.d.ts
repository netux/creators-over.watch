/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LAST_UPDATE_TIMESTAMP: string;
  readonly VITE_LAST_UPDATE_PATCH_NOTES_LINK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
