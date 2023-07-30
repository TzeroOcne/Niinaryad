import { BookmarkTable } from '@components/store/table';
import { createRepository } from '@lib/indexeddb/repository';
import type { StoreService } from '@types';

const repository = createRepository({
  name: 'bookmark',
});

export async function loadFromFile(file:File) {
  return await repository.loadFromFile(file);
}

async function getAll() {
  return await repository.getAll();
}

export default {
  getAll,
  display: BookmarkTable,
} satisfies StoreService<'bookmark'>;
