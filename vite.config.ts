import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { jsonX } from 'vite-plugin-jsonx'
import tsConfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsConfigPaths(), svelte(), jsonX()],
  server: {
    watch: {
      usePolling: true
    }
  },
  envPrefix: 'PUBLIC_'
})
