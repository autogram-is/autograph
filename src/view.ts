import {Graph} from './graph';
import {Entity} from './entity';

export abstract class View {
  constructor(protected graph: Graph) {
    this.ensureView();
  }

  abstract readonly viewName: string;
  abstract ensureView(): boolean;
  abstract get<
    T extends Entity | Record<string, unknown> = Record<string, unknown>
  >(): T[];

  count(): number {
    const stmt = this.graph.db.prepare(
      `SELECT COUNT(1) FROM ${this.viewName};`
    );
    return stmt.pluck().get() as number;
  }
}
