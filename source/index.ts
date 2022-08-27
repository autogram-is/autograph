export {
  Uuid,
  Entity,
  isEntity,
  Node,
  isNode,
  Edge,
  isEdge,
  Reference,
  hydrate,
  dehydrate,
  Type,
  Transform,
  ClassConstructor,
  ClassTransformOptions,
  TargetMap,
} from './entities/index.js';

export type Dictionary<T = unknown> = NodeJS.Dict<T>;
