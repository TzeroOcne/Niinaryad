import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import defaultAlias from './vite.alias.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
  ],
  resolve: {
    alias: defaultAlias,
  },
});
