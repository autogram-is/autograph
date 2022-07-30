import {Graph} from './graph';
import {Entity} from './entity';
import {WhereBuilder} from './sql';

export abstract class View {
  constructor(protected graph: Graph) {
    this.ensureView();
  }

  abstract readonly viewName: string;
  abstract ensureView(): boolean;

  get<T extends Entity | Record<string, unknown> = Entity>(
    clauses?: WhereBuilder,
    limit = 0
  ): T[] {
    const sql = `
      SELECT data FROM ${this.viewName}
      ${clauses?.sql}
      ${limit > 0 ? 'LIMIT ' + limit : ''};
    `;

    return this.graph.db
      .prepare(sql)
      .all(clauses?.parameters)
      .map(r => JSON.parse(r) as T);
  }

  count(): number {
    const stmt = this.graph.db.prepare(
      `SELECT COUNT(1) FROM ${this.viewName};`
    );
    return stmt.pluck().get() as number;
  }
}
