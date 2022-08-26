import { Entity, Node, Edge, Uuid, Reference } from '../entities/index.js';
import { Match } from './match.js';

export type EntityFilter<T extends Entity = Entity> = (entity: T) => boolean;

export interface Persistable {
  save(): boolean;
  load(): boolean;
}

export interface GraphMutable<T extends Entity = Entity> {
  add(input: Entity | Entity[]): GraphData<T>;
  remove(input: Entity | Entity[]): GraphData<T>;
  set(input: Entity | Entity[]): GraphData<T>;
}

export interface GraphData<T extends Entity = Entity> {
  get(input: Uuid): T | undefined;
  find(...criteria: Array<Match<T>>): T | undefined;
  match(...criteria: Array<Match<T>>): GraphData<T> | undefined;
  has(...criteria: Array<Match<T>>): true;
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

export type TraversalCost = (source: Node, edge: Edge, target: Node) => number;

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
