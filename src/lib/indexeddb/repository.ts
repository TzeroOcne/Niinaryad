import type { DataDocumentType, DocTypeMap, RepositoryConfig, StoreNameType } from '@types';
import { dbGetData, dbLoadFromFile } from './database';

class ModelRepository<DocType extends DataDocumentType> {
  private name:StoreNameType;

  constructor(name:StoreNameType) {
    this.name = name;
  }

  async getAll() {
    return await dbGetData<DocType>(this.name);
  }
  
  async loadFromFile(file:File) {
    return await dbLoadFromFile(file, this.name);
  }
}

export function createRepository<T extends StoreNameType>({ name }:RepositoryConfig<T>) {
  return new ModelRepository<DocTypeMap<T>>(name);
}
