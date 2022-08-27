import { Entity, Node, Edge, Uuid, Reference } from '../entities/index.js';
import { Match } from './match.js';

export type EntityFilter<T extends Entity = Entity> = (entity: T) => boolean;

export interface Graph {
  nodes(...criteria: Array<Match<Node>>): NodeSet;
  edges(...criteria: Array<Match<Edge>>): EdgeSet;
}

export interface NodeSet<T extends Node = Node> {
  edges(...criteria: Array<Match<T>>): EdgeSet;
  outgoing(...criteria: Array<Match<T>>): EdgeSet;
  incoming(...criteria: Array<Match<T>>): EdgeSet;
}

export interface EdgeSet<T extends Edge = Edge> {
  nodes(...criteria: Array<Match<T>>): NodeSet;
  sources(...criteria: Array<Match<T>>): NodeSet;
  targets(...criteria: Array<Match<T>>): NodeSet;
}

export interface Persistable {
  load(...args: unknown[]): Promise<void>;
  save(...args: unknown[]): Promise<void>;
}

export interface Readable<T extends Entity = Entity> {
  has(input: Reference): boolean;
  get(input: Uuid): T | undefined;
}

export interface Mutable<T extends Entity = Entity> {
  add(input: Entity | Entity[]): Mutable<T>;
  remove(input: Reference | Reference[]): Mutable<T>;
  set(input: Entity | Entity[]): Mutable<T>;
}

export interface Searchable<T extends Entity = Entity> {
  find(...criteria: Array<Match<T>>): T | undefined;
  filter(...criteria: Array<Match<T>>): Searchable<T>;
  count(...criteria: Array<Match<T>>): number;
}

export type TraversalCost = (
  source: Reference<Node>,
  edge: Reference<Edge>,
  target: Reference<Node>,
) => number;

export type TraversalPath = {
  nodes: Node[];
  edges: Edge[];
  length: number;
  cost: number;
};

export interface TraversalOptions {
  edgeFilter?: Match<Edge> | Array<Match<Edge>>;
  nodeFilter?: Match<Node> | Array<Match<Node>>;
  cost?: TraversalCost;
}

export interface Traversable {
  findPath(
    source: Reference<Node>,
    target: Reference<Node>,
    options?: TraversalOptions,
  ): TraversalPath;

  findShortestPath(
    source: Reference<Node>,
    target: Reference<Node>,
    options?: TraversalOptions,
  ): TraversalPath;
}
