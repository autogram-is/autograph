import {
  Entity,
  Edge,
  Node,
  Uuid,
  Reference,
  Dictionary,
  EntityMap,
  EntityFilter,
} from '../entity/index.js';

export type Predicate = string | typeof Edge;

export interface GraphData {
  nodes: EntityMap<Node>;
  edges: EntityMap<Edge>;
}

export interface Graph {
  get(id: Uuid): Entity | undefined;
  set(entity: Entity): this;
  has(r: Reference): boolean;
  delete(r: Reference): void;
  find<T extends Entity = Entity>(f: EntityFilter<T>): T | undefined;
  filter<T extends Entity = Entity>(f: EntityFilter<T>): T[];
  traverse(
    start: Reference<Node>,
    predicate: string,
    end: Reference<Node>,
  ): GraphData;
}

export interface GraphStorage {
  load(options?: Dictionary): Promise<void>;
  save(options?: Dictionary): Promise<void>;
}
