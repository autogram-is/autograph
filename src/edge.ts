import {Entity, Uuid} from './entity';

export class Edge extends Entity {
  readonly source!: string;
  readonly predicate!: string;
  readonly target!: string;

  getTable() {
    return 'edge';
  }

  static Create(source: Uuid, predicate: string, target: Uuid): Edge {
    return new Edge({
      source: source,
      predicate: predicate,
      target: target,
    });
  }

  static Load(json: string): Edge {
    return new Edge(json);
  }

  protected get uniqueValues(): unknown {
    return [this.source, this.predicate, this.target];
  }
}
