import is from '@sindresorhus/is';
import { Dictionary } from '../index.js';
import { Uuid } from './uuid.js';
import {
  Entity,
  isEntityData,
  Reference,
  hydrate,
  ClassConstructor,
} from './entity.js';
import { Node } from './node.js';

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
  constructor(
    source: Reference<Node>,
    predicate: string,
    target: Reference<Node>,
  ) {
    super();
    this.source = Entity.idFromReference(source);
    this.predicate = predicate;
    this.target = Entity.idFromReference(target);
    this.assignId();
  }
}

export function isEdge(input: unknown): input is Edge {
  return input instanceof Edge;
}

export function isEdgeData(input: unknown): input is Dictionary {
  return is.nonEmptyObject(input) && 'predicate' in input;
}
