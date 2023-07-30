import { StoreNameConst } from '@consts';
import { initParams } from '@lib/app.store';
import type { StoreNameType } from '@types';
import { writable } from 'svelte/store';

export const initialCollection = initParams.get('collection') as StoreNameType ?? 'bookmark';
let collectionVal:StoreNameType = StoreNameConst.includes(initialCollection) ? initialCollection : 'bookmark';
export const collectionStore = writable(collectionVal);
collectionStore.subscribe(val => {
  collectionVal = val;
  const url = new URL(window.location.href);
  if (val) url.searchParams.set('collection', val);
  else url.searchParams.delete('collection');
  history.pushState({}, '', url);
});
