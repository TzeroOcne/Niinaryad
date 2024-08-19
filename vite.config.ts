import webExtension from '@samrum/vite-plugin-web-extension';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import defaultConfig from './manifest.config.js';
import defaultAlias from './vite.alias.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    webExtension({
      manifest: {
        ...defaultConfig,
        background: {
          service_worker: 'src/background.ts'
        },
      },
    }),
  ],
  resolve: {
    alias: defaultAlias,
  },
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
      },
    },
  },
});
