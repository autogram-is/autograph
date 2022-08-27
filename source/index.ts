export {
  Uuid,
  Entity,
  isEntity,
  isEntityData,
  Node,
  isNode,
  isNodeData,
  Edge,
  isEdge,
  isEdgeData,
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
