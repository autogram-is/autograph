import { Graph } from './graph';
import { Where, WhereBuilder } from './sql';

export abstract class View {
  constructor(protected readonly graph: Graph) {
    this.ensureView();
  }

  abstract readonly viewName: string;
  abstract viewDefinitionSql(): string;

  protected ensureView() {
    const sql = `
      CREATE VIEW IF NOT EXISTS ${this.viewName} AS ${this.viewDefinitionSql()}
    `;
    this.graph.db.exec(sql);
  }
  count(where: WhereBuilder = Where()): number {
    const stmt = this.graph.db.prepare(
      `SELECT COUNT(1) FROM ${this.viewName}
       WHERE ${where.toString()};`
    );
    return stmt.pluck().get() as number;
  }
}
