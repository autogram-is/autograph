import {
  Entity,
  Node,
  Edge,
  Reference,
  EntityMap,
  EntityFilter,
  Dictionary,
  dehydrate,
} from '../entity/index.js';
import { Graph, GraphData } from './index.js';

export class MemoryGraph implements Graph, GraphData {
  nodes = new EntityMap<Node>();
  edges = new EntityMap<Edge>();

  get(id: string): Entity | undefined {
    return this.nodes.get(id) ?? this.edges.get(id);
  }

  set(entity: Entity): this {
    if (entity instanceof Node) {
      this.nodes.set(entity.id, entity);
    } else if (entity instanceof Edge) {
      this.edges.set(entity.id, entity);
    }

    return this;
  }

  has(r: Reference): boolean {
    if (this.nodes.has(Entity.idFromReference(r))) {
      return true;
    }

    if (this.edges.has(Entity.idFromReference(r))) {
      return true;
    }

    return false;
  }

  delete(r: Reference): void {
    throw new Error('Method not implemented.');
  }

  find<T extends Entity = Entity>(f: EntityFilter<T>): T | undefined {
    throw new Error('Method not implemented.');
  }

  filter<T extends Entity = Entity>(f: EntityFilter<T>): T[] {
    throw new Error('Method not implemented.');
  }

  traverse(
    start: Reference<Node>,
    predicate: string,
    end: Reference<Node>,
  ): GraphData {
    throw new Error('Method not implemented.');
  }

  toJSON(): Dictionary {
    const options = Entity.getSerializerOptions();
    return {
      nodes: instanceToPlain([...this.nodes.values()], options),
      edges: instanceToPlain([...this.edges.values()], options),
    }
  }
}
