import { svelte } from '@sveltejs/vite-plugin-svelte';
import { writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import manifestConfig from './manifest.config.js';
import defaultAlias from './vite.alias.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function buildExtension() {
  await build({
    plugins: [
      svelte(),
    ],
    resolve: {
      alias: defaultAlias,
    },
    configFile: false,
    publicDir: false,
    build: {
      rollupOptions: {
        input: {
          index: 'index.html',
          background: 'src/background.ts',
        },
        output: {
          assetFileNames: '[name].[ext]',
          entryFileNames: '[name].js',
        },
      },
    },
  });
  
  await writeFile(
    resolve(__dirname, 'dist', 'manifest.json'),
    JSON.stringify(manifestConfig, undefined, '  '),
  );
}

buildExtension();