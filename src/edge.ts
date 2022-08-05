import { Entity, JsonObject, Uuid, NIL } from './entity';
import { Node } from './node';

export class Edge extends Entity {
  source: Uuid = NIL;
  predicate!: string;
  target: Uuid = NIL;

  getTable() {
    return 'edge';
  }

  constructor(data?: JsonObject | string) {
    super();
    if (data !== undefined) {
      if (typeof data === 'string') data = JSON.parse(data);
      Object.assign(this, data);
    }
    this.assignId();
  }

  static load<T extends typeof Edge = typeof this>(
    this: T,
    data: JsonObject | string
  ): InstanceType<T> {
    return new this(data) as InstanceType<T>;
  }

  static connect(
    source: Uuid | Node,
    predicate: string,
    target: Uuid | Node,
    extra: JsonObject = {}
  ): Edge {
    const data = {
      source: source instanceof Node ? source.id : source,
      predicate: predicate,
      target: target instanceof Node ? target.id : target,
      ...extra,
    };
    return new Edge(data);
  }

  protected get uniqueValues(): unknown {
    return [this.source, this.predicate, this.target];
  }
}

declare module './node' {
  export interface Node {
    defineEdge(
      predicate: string,
      target: Uuid | Node,
      extra?: JsonObject
    ): Edge;
  }
}

Node.prototype.defineEdge = function (
  this: Node,
  predicate: string,
  target: Uuid | Node,
  extra: JsonObject = {}
): Edge {
  return Edge.connect(this, predicate, target, extra);
};
