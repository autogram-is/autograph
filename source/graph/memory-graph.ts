import is from '@sindresorhus/is';
import {
  Entity,
  Node,
  Edge,
  Reference,
  EntityMap,
  EntityFilter,
  Dictionary,
} from '../entity/index.js';
import { EdgeSelector, Graph, GraphData, NodeSelector } from './index.js';

export class MemoryGraph implements Graph, GraphData {
  nodes = new EntityMap<Node>();
  edges = new EntityMap<Edge>();

  set(input: Entity | Entity[]): this {
    if (!is.array(input)) input = [input];
    for (const ent of input) {
      if (ent instanceof Node) this.nodes.add(ent);
      else if (ent instanceof Edge) this.edges.add(ent);
    }

    return this;
  }

  getNode(id: string): Node | undefined {
    return this.nodes.get(id);
  }

  getEdge(id: string): Edge | undefined {
    return this.edges.get(id);
  }

  deleteNode(r: Reference<Node> | Array<Reference<Node>>): number {
    if (!is.array(r)) r = [r];
    let count = 0;
    for (const ref of r) {
      if (this.nodes.delete(Entity.idFromReference(ref))) count++;
    }

    return count;
  }

  deleteEdge(r: Reference<Edge> | Array<Reference<Edge>>): number {
    if (!is.array(r)) r = [r];
    let count = 0;
    for (const ref of r) {
      if (this.edges.delete(Entity.idFromReference(ref))) count++;
    }

    return count;
  }

  findNode<T extends Node = Node>(
    r: NodeSelector,
    fn?: EntityFilter<Node> | undefined,
  ): T | undefined {
    throw new Error('Method not implemented.');
  }

  findEdge<T extends Edge = Edge>(
    r: EdgeSelector,
    fn?: EntityFilter<Edge> | undefined,
  ): T | undefined {
    throw new Error('Method not implemented.');
  }

  matchNodes<T extends Node = Node>(
    r: NodeSelector,
    fn?: EntityFilter<Node> | undefined,
  ): T[] {
    throw new Error('Method not implemented.');
  }

  matchEdges<T extends Edge = Edge>(
    r: EdgeSelector,
    fn?: EntityFilter<Edge> | undefined,
  ): T[] {
    throw new Error('Method not implemented.');
  }

  countNodes(r: NodeSelector, fn?: EntityFilter<Node> | undefined): number {
    throw new Error('Method not implemented.');
  }

  countEdges(r: EdgeSelector, fn?: EntityFilter<Edge> | undefined): number {
    throw new Error('Method not implemented.');
  }
}
