import { ClassConstructor } from 'class-transformer';
import { Edge } from '../entity/edge.js';
import { Node } from '../entity/node.js';
import { Uuid, Reference, Entity, Dictionary } from '../entity/entity.js';
import { EntityMap } from '../entity/entity-map.js';

export type EntityFilter<E extends Entity = Entity> = (entity: E) => boolean;
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
