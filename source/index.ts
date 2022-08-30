export type Dictionary<T = unknown> = NodeJS.Dict<T>;

export {
  Uuid,
  UuidFactory,
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
  Operator,
  PredicateStructure,
  PredicateValue,
  where
} from './graph/index.js';
