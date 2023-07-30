import { lookup } from '@lib/mime-types';

export const FileType = {
  JSON: lookup('json'),
  CSV: lookup('csv'),
} as const;
