import * as DatabaseConstructor from 'better-sqlite3';
import {Database, SqliteError} from 'better-sqlite3';
import {Where, WhereBuilder} from './sql/where-builder';
import {Statements} from './sql/statements';

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
    this.db.exec(Statements.schema);
  }

  getNode(id: string): Node | undefined {
    return this.matchNodes(Where().equals('id', id))[0] ?? undefined;
  }

  matchNodes(clauses: WhereBuilder, limit?: number): Node[] {
    let sql = '';
    try {
      sql = `${Statements.selectNodes} WHERE ${clauses.sql}`;
      if (limit) sql += ` LIMIT ${limit}`;
      return this.db
        .prepare(sql)
        .all(clauses.parameters)
        .map(r => JSON.parse(r.data) as Node);
    } catch(e: unknown) {
      if (e instanceof SqliteError) {
        console.log(sql);
        throw(e);
      }
      throw(e);
    }
  }

  getEdge(id: string): Edge | undefined {
    return this.matchEdges(Where().equals('id', id))[0] ?? undefined;
  }

  matchEdges(clauses: WhereBuilder, limit?: number): Edge[] {
    let sql = '';
    sql = `${Statements.selectEdges} WHERE ${clauses.sql}`;
    if (limit) sql += ` LIMIT ${limit}`;
    return this.db
      .prepare(sql)
      .all(clauses.parameters)
      .map(r => JSON.parse(r.data) as Edge);
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

  save(entities: Entity|Entity[]): number {
    let affected = 0;
    let sql:string = '';

    if (entities instanceof Entity) {
      sql = `INSERT INTO ${entities.getTable()} VALUES(json('@'))`;
      affected += this.db.prepare(sql).run(entities.getTable(), entities.serialize()).changes
    }
    else {
      const nodes = entities.filter(e => e.getTable() == 'node');
      const edges = entities.filter(e => e.getTable() == 'edge');
      nodes.forEach(n => {
        sql = `INSERT INTO node VALUES(json('@'))`;
        affected += this.db.prepare(sql).run(n.serialize()).changes;
      })
      edges.forEach(e => {
        sql = `INSERT INTO edge VALUES(json('@'))`;
        affected += this.db.prepare(sql).run(e.serialize()).changes;
      })
    }

    return affected;
  }

  delete(e: Entity): number {
    let affected = 0;

    const sql = `DELETE FROM ${e.getTable()} WHERE id='@')`;
    affected = this.db.prepare(sql).run(e.id).changes;

    if (e instanceof Node) {
      affected += this.deleteNodeEdges(e);
    }
    return affected;
  }

  deleteNodeEdges(n: Node): number {
    const sql = Statements.deleteEdges + " WHERE source = '@' OR target = '@'";
    return this.db.prepare(sql).run(n.id).changes;
  }

  nodeExists(id: string): boolean {
    return this.nodeCount(Where().equals('id', id)) > 0;
  }
  edgeExists(source: string, target: string, predicate?: string): boolean {
    const where = Where().equals('source', source).equals('target', target);
    if (predicate) where.equals('predicate', predicate);
    return this.nodeCount(where) > 0;
  }
  nodeCount(where: WhereBuilder): number {
    const sql = Statements.countNodes + where.sql;
    return this.db.prepare(sql).pluck().get(where.parameters);
  }
  edgeCount(where: WhereBuilder): number {
    const sql = Statements.countEdges + where.sql;
    return this.db.prepare(sql).pluck().get(where.parameters);
  }
}
