import * as DatabaseConstructor from 'better-sqlite3';
import { Database, SqliteError, Statement } from 'better-sqlite3';
import { Where, WhereBuilder } from './sql';
import { Entify, Statements } from './sql';

import { Entity, Uuid, JsonObject } from './';

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
        filename: ':memory:',
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

  getNodeById(id: Uuid): JsonObject | undefined {
    return this.get('node', id);
  }

  getEdgeById(id: Uuid): JsonObject | undefined {
    return this.get('edge', id);
  }

  private get(table: string, id: Uuid): JsonObject | undefined {
    return this.match(table, Where().equals('id', id))[0] ?? undefined;
  }

  matchNode(
    where: WhereBuilder = Where(),

    limit?: number
  ): JsonObject[] {
    return this.match('node', where, limit);
  }

  matchEdge(
    where: WhereBuilder = Where(),

    limit?: number
  ): JsonObject[] {
    return this.match('edge', where, limit);
  }

  private match(
    table: string,
    where: WhereBuilder,

    limit?: number
  ): JsonObject[] {
    let sql = '';
    try {
      sql = Entify(Statements.select, table) + where.sql;
      if (limit) sql += ` LIMIT ${limit}`;
      return this.db
        .prepare(sql)
        .all(where.parameters)
        .map(r => JSON.parse(r.data));
    } catch (e: unknown) {
      if (e instanceof SqliteError) {
        console.error(sql);
        throw e;
      }
      throw e;
    }
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

    sql = Entify(Statements.deleteEntity, e.getTable()) + 'id=?';

    // First handle inbound, outbound edges
    if (e.getTable() === 'node') {
      edgeCascadeSql =
        Entify(Statements.deleteEntity, 'edge') + 'target=? OR source=?';
      affected += this.db.prepare(edgeCascadeSql).run(e.id, e.id).changes;
    }
    affected += this.db.prepare(sql).run(e.id).changes;
    return affected;
  }

  exists(table: string, id: Uuid): boolean {
    return this.count(table, Where().equals('id', id)) > 0;
  }

  nodeExists(id: Uuid): boolean {
    return this.exists('node', id);
  }

  edgeExists(source: Uuid, target: Uuid, predicate?: string): boolean {
    const where = Where().equals('source', source).equals('target', target);
    if (predicate) where.equals('predicate', predicate);
    return this.count('edge', where) > 0;
  }

  count(table: string, where: WhereBuilder = Where()): number {
    const sql = Entify(Statements.count, table) + where.sql;
    return this.db.prepare(sql).pluck().get(where.parameters);
  }
}
