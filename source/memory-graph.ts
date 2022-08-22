import is from '@sindresorhus/is';
import { EdgeSelector, Graph, GraphData, NodeSelector } from './graph.js';
import {
  Entity,
  Node,
  Edge,
  Reference,
  EntityMap,
  EntityFilter,
  Dictionary,
} from './index.js';

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

  matchNodes<T extends Node = Node>(
    r: NodeSelector,
    fn?: EntityFilter<Node>,
  ): T[] {
    const result: T[] = [];
    const typeFunc = is.string(r.label)
      ? (v: Node) => v.labels.has(r.label!)
      : () => true;

    const labelFunc = is.string(r.label)
      ? (v: Node) => v.labels.has(r.label!)
      : () => true;

    const customFunc = is.function_(fn) ? fn : () => true;

    for (const n of this.nodes.values()) {
      if (labelFunc(n) && typeFunc(n) && customFunc(n)) result.push(n as T);
    }

    return result;
  }

  matchEdges<T extends Edge = Edge>(
    r: EdgeSelector,
    fn?: EntityFilter<Edge>,
  ): T[] {
    const result: T[] = [];
    const predFunc = is.string(r.predicate)
      ? (edge: Edge) => edge.predicate === r.predicate
      : () => true;

    const sourceFunc = is.string(r.source)
      ? (edge: Edge) => edge.source === r.source
      : () => true;

    const targetFunc = is.string(r.target)
      ? (edge: Edge) => edge.target === r.target
      : () => true;

    const eitherFunc = is.string(r.sourceOrTarget)
      ? (edge: Edge) =>
          edge.source === r.sourceOrTarget || edge.target === r.sourceOrTarget
      : () => true;

    const customFunc = is.function_(fn) ? fn : () => true;

    for (const edge of this.edges.values()) {
      if (
        predFunc(edge) &&
        sourceFunc(edge) &&
        targetFunc(edge) &&
        eitherFunc(edge) &&
        customFunc(edge)
      )
        result.push(edge as T);
    }

    return result;
  }
}
