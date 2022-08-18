/* eslint-disable new-cap */
import {
  Transform,
  Type,
  hydrate,
  ClassConstructor,
  Entity,
  Dictionary,
} from './index.js';

export class Node extends Entity {
  static readonly types = new Map<string, ClassConstructor<any>>();

  static load<T extends typeof Node = typeof this>(
    this: T,
    data: string | Dictionary,
  ): InstanceType<T> {
    const object = (
      typeof data === 'string' ? JSON.parse(data) : data
    ) as Dictionary;
    if ('id' in object && 'type' in object) {
      const ctor = Node.types.get(object.type as string) ?? Node;
      return hydrate(
        ctor,
        object,
        Entity.getSerializerOptions(),
      ) as InstanceType<T>;
    }

    throw new TypeError('Node requires type and id');
  }

  @Type(() => String)
  @Transform(({ value }) => new Set(value), { toClassOnly: true })
  @Transform(({ value }) => [...(value as Set<string>)], { toPlainOnly: true })
  labels: Set<string> = new Set<string>();

  type: string;

  constructor(...args: unknown[]);
  constructor(type = 'node', labels: string[] = []) {
    super();
    this.type = type;
    this.labels = new Set<string>(labels);
    this.assignId();
  }
}
