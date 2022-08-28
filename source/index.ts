export type Dictionary<T = unknown> = NodeJS.Dict<T>;

export {
  Uuid,
  UuidFactory,
  EntityFilter,
  Entity,
  isEntity,
  isEntityData,
  Reference,
  hydrate,
  dehydrate,
  Type,
  Transform,
  ClassConstructor,
  ClassTransformOptions,
  TargetMap,
  Node,
  isNode,
  isNodeData,
  Edge,
  isEdge,
  isEdgeData,
} from './entities/index.js';

export {
  Graph,
  Readable,
  Searchable,
  Mutable,
  Persistable,
  NodeSet,
  EdgeSet,
  TraversalCost,
  TraversalOptions,
  Traversable,
  Match,
  MatchMaker,
  Predicate,
  where,
} from './graph/index.js';

export { JsonGraph, JsonNodes, JsonEdges } from './json-graph/index.js';
