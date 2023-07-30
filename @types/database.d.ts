import { ComponentType } from 'svelte';

export const StoreNameList = ['bookmark', 'event_log'] as const;
export type StoreNameType = typeof StoreNameList[number];

export interface NNRYDBEvent extends Event {
  srcElement: IDBRequest|IDBTransaction;
  target: IDBRequest|IDBTransaction;
}

export interface NNRYTransaction extends IDBTransaction {
  objectStore(storeName:StoreNameType): IDBObjectStore;
}

export interface NNRYDatabase extends IDBDatabase {
  transaction(
    storeNames: StoreNameType|Iterable<StoreNameType>,
    mode?:IDBTransactionMode,
    options?:IDBTransactionOptions,
  ): NNRYTransaction;
  createObjectStore(
    storeName:StoreNameType|Iterable<StoreNameType>,
    options:IDBObjectStoreParameters,
  ): IDBObjectStore;
}

export interface WriteResult {
  success: Event[];
  error: Event[];
}
export interface WriteEvent extends Event {
  target: EventTarget & { result: WriteResult };
}

export interface DataDocumentType {
  _id: string;
}

export interface BookmarkDocType extends DataDocumentType {
  scanlator?: string;
  title?: string;
  timestamp?: string;
  chapter?: string;
  chapterLink?: string;
  titleLink?: string;
}

export interface RepositoryConfig<T extends StoreNameType> {
  name: T;
}

export interface DisplayConfig<T extends DataDocumentType> {
  [key:keyof T]: {
    label?: string;
  };
}

export type DocTypeMap<T extends StoreNameType> =
  T extends 'bookmark' ? BookmarkDocType :
  DataDocumentType;

interface Service<T extends DataDocumentType> {
  getAll(): Promise<T[]>;
  display: ComponentType;
}

export type StoreService<T extends StoreNameType> = Service<DocTypeMap<T>>;

export interface Store {
  name: StoreNameType;
  label: string;
  service: StoreService<StoreNameType>;
}

export interface PaginationInfo {
  index: number;
}
