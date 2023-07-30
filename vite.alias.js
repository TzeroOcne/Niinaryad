import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicResolve = (process.env.NODE_ENV === 'development') ?
  resolve(__dirname) :
  resolve(__dirname, 'public');
const srcPath = resolve(__dirname, 'src');

/** @type {import('vite').AliasOptions} */
export default [
  {
    find: '@public',
    replacement: publicResolve,
  },
  {
    find: '@app',
    replacement: resolve(srcPath, 'App.ts'),
  },
  {
    find: '@lib',
    replacement: resolve(srcPath, 'lib'),
  },
  {
    find: '@page',
    replacement: resolve(srcPath, 'page'),
  },
  {
    find: '@features',
    replacement: resolve(srcPath, 'features'),
  },
  {
    find: '@components',
    replacement: resolve(srcPath, 'components'),
  },
  {
    find: '@consts',
    replacement: resolve(__dirname, '@consts', 'index.ts'),
  },
];