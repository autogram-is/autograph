import { RequireAtLeastOne } from 'type-fest';
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

export interface GraphData {
  nodes: EntityMap<Node>;
  edges: EntityMap<Edge>;
}

export type NodeSelector = RequireAtLeastOne<{
  id: Uuid;
  type: string;
  label: string;
  anyLabel: string[];
}>;

export type EdgeSelector = RequireAtLeastOne<{
  id: Uuid;
  predicate: string;
  source: Uuid;
  target: Uuid;
  sourceOrTarget: Uuid;
}>;

export interface Graph {
  set(input: Entity | Entity[]): this;

  getNode(id: Uuid): Node | undefined;
  getEdge(id: Uuid): Edge | undefined;

  deleteNode(r: Reference<Node> | Array<Reference<Node>>): number;
  deleteEdge(r: Reference<Edge> | Array<Reference<Edge>>): number;

  findNode<T extends Node = Node>(
    r: NodeSelector,
    fn?: EntityFilter<Node>,
  ): T | undefined;
  findEdge<T extends Edge = Edge>(
    r: EdgeSelector,
    fn?: EntityFilter<Edge>,
  ): T | undefined;

  matchNodes<T extends Node = Node>(
    r: NodeSelector,
    fn?: EntityFilter<Node>,
  ): T[];
  matchEdges<T extends Edge = Edge>(
    r: EdgeSelector,
    fn?: EntityFilter<Edge>,
  ): T[];

  countNodes(r: NodeSelector, fn?: EntityFilter<Node>): number;
  countEdges(r: EdgeSelector, fn?: EntityFilter<Edge>): number;
}

export interface GraphStorage {
  load(options?: Dictionary): Promise<void>;
  save(options?: Dictionary): Promise<void>;
}

export { MemoryGraph } from './memory-graph.js';
export { SqliteGraph } from './sqlite/sqlite-graph.js';
