import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicKey = readFileSync(resolve(__dirname, 'manifest.key.pub'), 'utf8');

/** @type {import('./@types/manifest').ManifestV3} */
export default {
  manifest_version: 3,
  name: 'Niinaryad',
  version: '1.0.0',
  action: {
    default_title: 'Open Niinaryad'
  },
  background: {
    service_worker: 'background.js',
  },
  permissions: [
    'storage',
    'tabs',
    'unlimitedStorage',
  ],
  key: publicKey,
};