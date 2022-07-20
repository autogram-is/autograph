import { Uuid, getId } from './schema/id';
import * as dbConstructor from 'better-sqlite3';
import { Database, SqliteError } from 'better-sqlite3'
import { Node, isNode, Edge, isEdge } from './schema'
import { REPOSITORY_SCHEMA } from './schema';

export type StorageOptions = Database | string;
export class Repository {
  public db:Database;

  constructor(options:StorageOptions = ':memory:') {
    this.db = (typeof(options) === 'string') ? dbConstructor(options) : options;
    this.setupTables();
  }

  private setupTables() {
    this.db.exec(REPOSITORY_SCHEMA);
  }
}