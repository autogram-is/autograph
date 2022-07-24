import {Entity} from './entity';

export class Edge extends Entity {
  readonly source: string;
  readonly predicate: string;
  readonly target: string;
  [key: string]: any;

  getTable() {
    return 'edge';
  }

  constructor(
    source: string,
    predicate: string,
    target: string,
    data: Record<string, any> = {}
  ) {
    super();
    this.source = source;
    this.predicate = predicate;
    this.target = target;

    for (const k in data) this[k] = data[k];
  }

  protected get uniqueProperties(): any {
    return [this.source, this.predicate, this.target];
  }
}
