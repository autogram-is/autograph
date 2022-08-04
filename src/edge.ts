import { Entity, Uuid, EntityConstructorArgument } from './entity';

export class Edge extends Entity {
  readonly source!: string;
  readonly predicate!: string;
  readonly target!: string;

  getTable() {
    return 'edge';
  }

  static New(
    source: Uuid,
    predicate: string,
    target: Uuid,
    ...args: unknown[]
  ): Edge {
    return new this({
      source: source,
      predicate: predicate,
      target: target,
    });
  }

  static Load(data: EntityConstructorArgument): Edge {
    return new Edge(data);
  }

  protected get uniqueValues(): unknown {
    return [this.source, this.predicate, this.target];
  }
}
