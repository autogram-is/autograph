import * as DatabaseConstructor from 'better-sqlite3';
import {Database, SqliteError, Statement} from 'better-sqlite3';
import {Where, WhereBuilder} from './sql';
import {Entify, Statements} from './sql';

import {Entity, Node, Edge} from './';

type GraphOptions = {
  filename: string;
  useSoftDeletes: boolean;
  supportsSoftDelete: boolean;
  saveTimestamp: boolean;
  supportsTimestamp: boolean;
  databaseConfig: Partial<DatabaseConstructor.Options>;
};
export class Graph {
  readonly db: Database;
  readonly config: GraphOptions;

  constructor(options: Partial<GraphOptions>) {
    this.config = {
      ...{
        filename: ':memory',
        useSoftDeletes: false,
        supportsSoftDelete: false,
        saveTimestamp: false,
        supportsTimestamp: false,
        databaseConfig: {},
      },
      ...options,
    };
    this.db = DatabaseConstructor(
      this.config.filename,
      this.config.databaseConfig
    );
    this.verifySchema();
  }

  private verifySchema() {
    const schemaState = this.db
      .prepare<string[]>(Statements.schemaInfo)
      .raw()
      .all();

    if (!schemaState.includes('node.id') || !schemaState.includes('edge.id')) {
      this.db.exec(Statements.schemaTables);
      this.db.exec(Statements.schemaIndexes);
    }

    if (schemaState.includes('node.deleted')) {
      this.config.supportsSoftDelete = true;
    } else {
      if (this.config.useSoftDeletes) {
        this.db.exec(Statements.schemaSoftDelete);
      }
    }

    if (this.config.saveTimestamp) {
      if (!schemaState.includes('node.created')) {
        this.db.exec(Statements.schemaTimeStamp);
      }
    }
  }

  getNode<N extends Node = Node>(
    id: string,
    includeDeleted = false
  ): N | undefined {
    return this.get<N>('node', id, includeDeleted);
  }
  getEdge<E extends Edge = Edge>(
    id: string,
    includeDeleted = false
  ): E | undefined {
    return this.get<E>('edge', id, includeDeleted);
  }
  private get<T extends Entity = Entity>(
    table: string,
    id: string,
    includeDeleted = false
  ): T | undefined {
    return (
      this.match<T>(table, Where().equals('id', id), includeDeleted)[0] ??
      undefined
    );
  }

  matchNode<N extends Node = Node>(
    where: WhereBuilder,
    includeDeleted = false,
    limit?: number
  ): N[] {
    return this.match<N>('node', where, includeDeleted, limit);
  }

  matchEdge<E extends Edge = Edge>(
    where: WhereBuilder,
    includeDeleted = false,
    limit?: number
  ): E[] {
    return this.match<E>('edge', where, includeDeleted, limit);
  }

  private match<T extends Entity = Entity>(
    table: string,
    where: WhereBuilder,
    includeDeleted = false,
    limit?: number
  ): T[] {
    if (this.config.supportsSoftDelete && !includeDeleted) {
      where.equals('deleted', 0);
    }
    let sql = '';
    try {
      sql = Entify(Statements.select, 'edge') + where.sql;
      if (limit) sql += ` LIMIT ${limit}`;
      return this.db
        .prepare(sql)
        .all(where.parameters)
        .map(r => JSON.parse(r.data) as T);
    } catch (e: unknown) {
      if (e instanceof SqliteError) {
        console.log(sql);
        throw e;
      }
      throw e;
    }
  }

  connect(
    source: Node,
    predicate: string,
    target: Node,
    data: Record<string, unknown>
  ): Edge {
    const edge = new Edge(source.id, predicate, target.id, data);
    this.save(edge);
    return edge;
  }

  save(entities: Entity | Entity[]): number {
    let affected = 0;
    let stmt: Statement;
    if (entities instanceof Entity) {
      stmt = this.db.prepare(Entify(Statements.save, entities.getTable()));
      affected += stmt.run(JSON.stringify(entities)).changes;
    } else {
      ['node', 'edge'].forEach((table: string) => {
        entities
          .filter(e => e.getTable() === table)
          .forEach(e => {
            stmt = this.db.prepare(Entify(Statements.save, table));
            affected += stmt.run(JSON.stringify(e)).changes;
          });
      });
    }

    return affected;
  }

  delete(e: Entity): number {
    let sql = '';
    let edgeCascadeSql = '';
    let affected = 0;

    if (this.config.useSoftDeletes && this.config.supportsSoftDelete) {
      sql = Entify(Statements.softDeleteEntity, e.getTable()) + 'id=?';
    } else {
      sql = Entify(Statements.deleteEntity, e.getTable()) + 'id=?';
    }

    // First handle inbound, outbound edges
    if (e.getTable() === 'node') {
      if (this.config.useSoftDeletes && this.config.supportsSoftDelete) {
        edgeCascadeSql =
          Entify('Statements.softDeleteEntity', 'edge') +
          'target=?id OR edge=?id';
      } else {
        edgeCascadeSql =
          Entify('Statements.deleteEntity', 'edge') + 'target=?id OR edge=?id';
      }

      affected = this.db.prepare(edgeCascadeSql).run(e.id).changes;
    }

    affected = this.db.prepare(sql).run(e.id).changes;
    return affected;
  }

  exists(table: string, id: string, includeDeleted = false): boolean {
    return this.count(table, Where().equals('id', id), includeDeleted) > 0;
  }

  nodeExists(id: string, includeDeleted = false): boolean {
    const where = Where().equals('id', id);
    return this.count('node', where, includeDeleted) > 0;
  }

  edgeExists(
    source: string,
    target: string,
    predicate?: string,
    includeDeleted = false
  ): boolean {
    const where = Where().equals('source', source).equals('target', target);
    if (predicate) where.equals('predicate', predicate);
    return this.count('edge', where, includeDeleted) > 0;
  }

  count(table: string, where: WhereBuilder, includeDeleted = false): number {
    if (this.config.supportsSoftDelete && !includeDeleted) {
      where.equals('deleted', 0);
    }
    const sql = Entify(Statements.count, table) + where.sql;
    return this.db.prepare(sql).pluck().get(where.parameters);
  }
}
