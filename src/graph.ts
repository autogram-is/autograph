import * as DatabaseConstructor from 'better-sqlite3';
import {Database, SqliteError, Statement} from 'better-sqlite3';
import {Where, WhereBuilder} from './sql/where-builder';
import {Entify, Statements} from './sql/statements';

import {Entity, Node, Edge} from './';

export class Graph {
  readonly db: Database;

  constructor(
    filename = ':memory:',
    customConfig: Partial<DatabaseConstructor.Options> = {}
  ) {
    this.db = DatabaseConstructor(filename, customConfig);
    this.verifyTablesExist();
  }

  private verifyTablesExist() {
    this.db.exec(Statements.schemaTables);
    this.db.exec(Statements.schemaIndexes);
  }

  getNode<N extends Node = Node>(id: string): N | undefined {
    return this.get<N>('node', id);
  }
  getEdge<E extends Edge = Edge>(id: string): E | undefined {
    return this.get<E>('edge', id);
  }
  private get<T extends Entity = Entity>(
    table: string,
    id: string
  ): T | undefined {
    return this.match<T>(table, Where().equals('id', id))[0] ?? undefined;
  }

  matchNode<N extends Node = Node>(clauses: WhereBuilder, limit?: number): N[] {
    return this.match<N>('node', clauses, limit);
  }
  matchEdge<E extends Edge = Edge>(clauses: WhereBuilder, limit?: number): E[] {
    return this.match<E>('edge', clauses, limit);
  }
  private match<T extends Entity = Entity>(
    table: string,
    clauses: WhereBuilder,
    limit?: number
  ): T[] {
    let sql = '';
    try {
      sql = Entify(Statements.select, 'edge') + clauses.sql;
      if (limit) sql += ` LIMIT ${limit}`;
      return this.db
        .prepare(sql)
        .all(clauses.parameters)
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
      affected += stmt.run(entities.serialize()).changes;
    } else {
      ['node', 'edge'].forEach((table: string) => {
        entities
          .filter(e => e.getTable() === table)
          .forEach(e => {
            stmt = this.db.prepare(Entify(Statements.save, table));
            affected += stmt.run(e.serialize()).changes;
          });
      });
    }

    return affected;
  }

  delete(e: Entity): number {
    let affected = 0;

    const sql = Entify(Statements.deleteEntity, e.getTable()) + 'id=?';
    affected = this.db.prepare(sql).run(e.id).changes;

    if (e instanceof Node) {
      affected += this.deleteNodeEdges(e);
    }
    return affected;
  }

  deleteNodeEdges(n: Node): number {
    const sql =
      Entify(Statements.deleteEntity, 'node') + ' source = ? OR target = ?';
    return this.db.prepare(sql).run(n.id).changes;
  }

  exists(table: string, id: string): boolean {
    return this.count(table, Where().equals('id', id)) > 0;
  }
  count(table: string, where: WhereBuilder): number {
    const sql = Entify(Statements.count, table) + where.sql;
    return this.db.prepare(sql).pluck().get(where.parameters);
  }
  edgeExists(source: string, target: string, predicate?: string): boolean {
    const where = Where().equals('source', source).equals('target', target);
    if (predicate) where.equals('predicate', predicate);
    return this.count('edge', where) > 0;
  }
}
