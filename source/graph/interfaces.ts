import { Entity, Node, Edge, Uuid, Reference } from '../entities/index.js';
import { Match } from './match.js';

export type EntityFilter<T extends Entity = Entity> = (entity: T) => boolean;

export interface Persistable {
  save(): boolean;
  load(): boolean;
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
  match(...criteria: Array<Match<T>>): Searchable<T> | undefined;
  count(...criteria: Array<Match<T>>): number;
}

export interface NodeLike<T extends Node = Node> {
  edges(...criteria: Array<Match<T>>): EdgeLike;
  outgoing(...criteria: Array<Match<T>>): EdgeLike;
  incoming(...criteria: Array<Match<T>>): EdgeLike;
  siblings(...criteria: Array<Match<T>>): NodeLike;
}

export interface EdgeLike<T extends Edge = Edge> {
  nodes(...criteria: Array<Match<T>>): NodeLike;
  sources(...criteria: Array<Match<T>>): NodeLike;
  targets(...criteria: Array<Match<T>>): NodeLike;
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
