/* eslint-disable import/no-unassigned-import */
import 'reflect-metadata';
import { Entity } from './entity.js';

export {
  plainToInstance as rehydrate,
  instanceToPlain as dehydrate,
  Type,
  Transform,
  ClassConstructor,
  ClassTransformOptions,
  TargetMap,
} from 'class-transformer';

export type Uuid = string;
export type Dictionary<T = unknown> = NodeJS.Dict<T>;
export type Reference<T extends Entity = Entity> = T | Uuid;
export type EntityFilter<T extends Entity = Entity> = (input: T) => boolean;

export { Node } from './node.js';
export { Edge } from './edge.js';
export { EntityMap } from './entity-map.js';
export { EntitySet } from './entity-set.js';
export { Entity } from './entity.js';
