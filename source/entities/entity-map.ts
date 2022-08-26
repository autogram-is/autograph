import { Dictionary } from '../index.js';
import { Uuid, Reference, Entity, isEntity } from './entity.js';
import { Node, isNode } from './node.js';
import { Edge, isEdge } from './edge.js';

export class EntityMap<T extends Entity = Entity> extends Map<Uuid, T> {
  constructor(values?: T[]) {
    super(values?.map((v) => [v.id, v]));
  }

  add(value: T): this {
    return super.set(value.id, value);
  }

  addItems(values: T[]): this {
    for (const t of values) {
      this.add(t);
    }

    return this;
  }
}
