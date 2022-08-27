import is from '@sindresorhus/is';
import { Edge, isEdge, Entity, Node, isNode } from '../index.js';
import { Mutable } from './interfaces.js';

export class Graph implements Mutable {
  protected nodeMap = new Map<string, Node>();
  protected edgeMap = new Map<string, Edge>();

  add(input: Entity | Entity[]): Mutable {
    if (!is.array(input)) input = [input];

    for (const entity of input) {
      if (isNode(entity)) {
        if (!this.nodeMap.has(entity.id)) this.nodeMap.set(entity.id, entity);
      } else if (isEdge(entity) && !this.edgeMap.has(entity.id))
        this.edgeMap.set(entity.id, entity);
    }

    return this;
  }

  remove(input: Entity | Entity[]): Mutable {
    if (!is.array(input)) input = [input];

    for (const entity of input) {
      if (isNode(entity)) {
        this.nodeMap.delete(entity.id);
      } else {
        this.edgeMap.delete(entity.id);
      }
    }

    return this;
  }

  set(input: Entity | Entity[]): Mutable {
    if (!is.array(input)) input = [input];

    for (const entity of input) {
      if (isNode(entity)) {
        this.nodeMap.set(entity.id, entity);
      } else if (isEdge(entity)) {
        this.edgeMap.set(entity.id, entity);
      }
    }

    return this;
  }
}
