import * as DatabaseConstructor from 'better-sqlite3';
import {Database} from 'better-sqlite3';
import {Entity, Node, Edge} from '.';
import {Where, WhereBuilder} from './sql/where-builder';
import {Statements} from './sql/statements';

export class Graph {
  readonly db: Database;

  constructor(
    filename = ':memory:',
    customConfig: Partial<DatabaseConstructor.Options> = {}
  ) {
    this.db = DatabaseConstructor(filename, customConfig);
  }

  private createTables() {
    this.db.exec(Statements.schema);
  }

  getNode(id: string): Node | undefined {
    return this.matchNodes(Where().equals('id', id))[0] ?? undefined;
  }

  matchNodes(clauses: WhereBuilder, limit?: number): Node[] {
    let sql: string = Statements.selectNodes + clauses.sql;
    if (limit) sql += ` LIMIT ${limit}`;
    return this.db
      .prepare(sql)
      .all(clauses.parameters)
      .map(r => JSON.parse(r.data) as Node);
  }

  getEdge(id: string): Edge | undefined {
    return this.matchEdges(Where().equals('id', id))[0] ?? undefined;
  }

  matchEdges(clauses: WhereBuilder, limit?: number): Edge[] {
    let sql: string = Statements.selectEdges + clauses.sql;
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
    data: Record<string, any>
  ): Edge {
    const edge = new Edge(source.id, predicate, target.id, data);
    this.save(edge);
    return edge;
  }

  save(e: Entity): boolean {
    const sql = `INSERT INTO ${e.getTable()} VALUES(json(?))`;
    return this.db.prepare(sql).run(e.serialize()).changes ? true : false;
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
