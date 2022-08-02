import {Graph} from './graph';
import {Where, WhereBuilder} from './sql';

export abstract class View {
  constructor(protected graph: Graph) {
    this.ensureView();
  }

  abstract readonly viewName: string;
  abstract ensureView(): void;

  count(where: WhereBuilder = Where()): number {
    const stmt = this.graph.db.prepare(
      `SELECT COUNT(1) FROM ${this.viewName}
       WHERE ${where.toString()};`
    );
    return stmt.pluck().get() as number;
  }
}