import { Entity, Uuid, JsonObject } from './entity';

export class Edge extends Entity {
  readonly source!: string;
  readonly predicate!: string;
  readonly target!: string;

  getTable() {
    return 'edge';
  }

  static New(source: Uuid, predicate: string, target: Uuid): Edge {
    return new this({
      source: source,
      predicate: predicate,
      target: target,
    });
  }

  static Load(data: JsonObject | string): Edge {
    return new Edge(data);
  }

  protected get uniqueValues(): unknown {
    return [this.source, this.predicate, this.target];
  }
}
