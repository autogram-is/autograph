import {Graph} from './graph';
import {Entity} from './entity';
import {WhereBuilder} from './sql';

export abstract class View {
  constructor(protected graph: Graph) {
    this.ensureView();
  }

  abstract readonly viewName: string;
  abstract ensureView(): boolean;

  count(): number {
    const stmt = this.graph.db.prepare(
      `SELECT COUNT(1) FROM ${this.viewName};`
    );
    return stmt.pluck().get() as number;
  }
}
