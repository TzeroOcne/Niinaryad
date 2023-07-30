import { dbIsOpen } from '@lib/app.store';
import type { DataDocumentType, NNRYDBEvent, NNRYDatabase, StoreNameType, WriteEvent, WriteResult } from '@types';
import Papa from 'papaparse';
import { FileType } from '../app.enum';

let db:NNRYDatabase;

const parseIDBDatabase = (database:IDBDatabase) => ({
  name: database.name,
  objectStoreNames: [...database.objectStoreNames],
  version: database.version,
});

const parseOpenDBRequest = (request:IDBOpenDBRequest) => ({
  error: request.error,
  readyState: request.readyState,
  result: request.result ? parseIDBDatabase(request.result) : undefined,
});

const parseIDBTransaction = (transaction:IDBTransaction) => ({
  db: parseIDBDatabase(transaction.db),
  durability: transaction.durability,
  error: transaction.error,
  mode: transaction.mode,
  objectStoreName: [...transaction.objectStoreNames],
});

const parseRequestSource = (source:IDBObjectStore|IDBIndex|IDBCursor) => (source instanceof IDBObjectStore) ?
  {
    autoIncrement: source.autoIncrement,
    indexName: [...source.indexNames],
    keyPath: source.keyPath,
    name: source.name,
  } :
  {};

const parseIDBRequest = (request:IDBRequest) => ({
  error: request.error,
  result: request.result,
  readyState: request.readyState,
  source: request.source ? parseRequestSource(request.source) : undefined,
  transaction: request.transaction ? parseIDBTransaction(request.transaction) : undefined,
});

const logToDb = (ev:NNRYDBEvent) => {
  try {
    const transaction = db.transaction('event_log', 'readwrite');
    const loggerStore = transaction.objectStore('event_log');
    let target,source:Record<string, unknown>;
    if (ev.target instanceof IDBOpenDBRequest) target = parseOpenDBRequest(ev.target);
    else if (ev.target instanceof IDBRequest) target = parseIDBRequest(ev.target);
    else if (ev.target instanceof IDBTransaction) target = parseIDBTransaction(ev.target);
    if (ev.srcElement instanceof IDBOpenDBRequest) source = parseOpenDBRequest(ev.srcElement);
    else if (ev.srcElement instanceof IDBRequest) source = parseIDBRequest(ev.srcElement);
    else if (ev.srcElement instanceof IDBTransaction) source = parseIDBTransaction(ev.srcElement);
    loggerStore.add({
      timestamp: new Date().toISOString(),
      source,
      target,
      type: ev.type,
    });
    console.log(ev);
  } catch (error) {
    console.error('error while logging', error);
  }
};
const onSuccessDef = (ev:Event) => {
  ev.preventDefault();
  logToDb(ev as NNRYDBEvent);
};
const onErrorDef = (ev:Event) => {
  ev.preventDefault();
  logToDb(ev as NNRYDBEvent);
};
const requestOnSuccess = (result:WriteResult) => (ev:Event) => {
  onSuccessDef(ev);
  result.success.push(ev);
};
const requestOnError = (result:WriteResult) => (ev:Event) => {
  onErrorDef(ev);
  result.error.push(ev);
};

const dbConnection = indexedDB.open('niinaryad', 1);

dbConnection.onerror = onErrorDef;
dbConnection.onsuccess = (ev) => {
  db = (ev.target as IDBOpenDBRequest).result as NNRYDatabase;
  onSuccessDef(ev);
  dbIsOpen.set(true);
};
dbConnection.onupgradeneeded = (ev) => {
  const database = (ev.target as IDBOpenDBRequest).result as NNRYDatabase;
  database.createObjectStore('bookmark', {
    autoIncrement: true,
    keyPath: '_id',
  });
  database.createObjectStore('event_log', {
    autoIncrement: true,
    keyPath: '_id',
  });
};

const dbWrite = <DocType extends DataDocumentType>(
  storeName: StoreNameType,
  docList: DocType[],
): Promise<WriteEvent> => {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, 'readwrite');
      transaction.onerror = onErrorDef;
      const result:WriteResult = { success: [], error: [] };
      transaction.oncomplete = (ev) => {
        logToDb(ev as NNRYDBEvent);
        resolve({
          ...ev,
          target: {
            ...ev.target,
            result,
          },
        });
      };
      const objectStore = transaction.objectStore(storeName);
      const reqOnSuccess = requestOnSuccess(result);
      const reqOnError = requestOnError(result);
      for (const doc of docList) {
        const request = objectStore.add(doc);
        request.onsuccess = reqOnSuccess;
        request.onerror = reqOnError;
      }
    } catch (error) {
      reject(error);
    }
  });
};

const dbRead = <DocType extends DataDocumentType>(
  storeName:StoreNameType,
): Promise<DocType[]> => {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, 'readonly');
      transaction.onerror = onErrorDef;
      const objectStore = transaction.objectStore(storeName);
      transaction.oncomplete = (ev) => {
        logToDb(ev as NNRYDBEvent);
      };
      const request:IDBRequest<DocType[]> = objectStore.getAll();
      request.onerror = onErrorDef;
      request.onsuccess = (ev) => {
        onSuccessDef(ev);
        const { result } = ev.target as IDBRequest;
        resolve(result);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const loadData = async <DocType extends DataDocumentType>(
  storeName:StoreNameType,
  dataList:DocType[],
) => {
  return await dbWrite(storeName, dataList);
};

export const dbLoadCSV = async <DocType extends DataDocumentType>(file:File, storeName:StoreNameType) => {
  const fileText = await file.text();
  const parsed = Papa.parse<DocType>(fileText, {
    header: true,
  });
  const { data } = parsed;
  return await loadData(storeName, data);
};

export const dbLoadJSON = async <DocType extends DataDocumentType>(file:File, storeName:StoreNameType) => {
  const fileText = await file.text();
  const data = (JSON.parse(fileText) as DocType[]);
  return await loadData(storeName, data);
};

export const dbLoadFromFile = async <DocType extends DataDocumentType>(file:File, storeName:StoreNameType) => {
  switch (file.type) {
  case FileType.CSV:
    return await dbLoadCSV<DocType>(file, storeName);
  case FileType.JSON:
    return await dbLoadJSON<DocType>(file, storeName);
  default:
    return;
  }
};

export const dbGetData = async <DocType extends DataDocumentType>(storeName:StoreNameType) => {
  return await dbRead<DocType>(storeName);
};

export const useDb = () => db;
