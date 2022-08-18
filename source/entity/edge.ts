import { Entity, Uuid, Reference, Dictionary } from './entity.js';
import { hydrate, ClassConstructor } from './index.js';

export class Edge extends Entity {
  static readonly types = new Map<string, ClassConstructor<any>>();

  static load<T extends typeof Edge = typeof this>(
    this: T,
    data: string | Dictionary,
  ): InstanceType<T> {
    const object = (
      typeof data === 'string' ? JSON.parse(data) : data
    ) as Dictionary;
    if ('id' in object && 'predicate' in object) {
      const ctor = Edge.types.get(object.predicate as string) ?? Edge;
      return hydrate(
        ctor,
        object,
        Entity.getSerializerOptions(),
      ) as InstanceType<T>;
    }

    throw new TypeError('Edge requires predicate and id');
  }

  source: Uuid;
  predicate: string;
  target: Uuid;

  constructor(...args: unknown[]);
  constructor(source: Reference, predicate: string, target: Reference) {
    super();
    this.source = Entity.idFromReference(source);
    this.predicate = predicate;
    this.target = Entity.idFromReference(target);
    this.assignId();
  }

  protected getIdSeed(): unknown {
    return [this.source, this.predicate, this.target];
  }
}
