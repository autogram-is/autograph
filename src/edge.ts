import {Entity} from './entity';

export class Edge extends Entity {
  readonly source: string;
  readonly predicate: string;
  readonly target: string;
  [propName: string]: unknown;

  getTable() {
    return 'edge';
  }

  constructor(
    source: string,
    predicate: string,
    target: string,
    data: Record<string, unknown> = {}
  ) {
    super();
    this.source = source;
    this.predicate = predicate;
    this.target = target;

    for (const k in data) this[k] = data[k];
    this.assignId();
  }

  protected get uniqueValues(): unknown {
    return [this.source, this.predicate, this.target];
  }
}
