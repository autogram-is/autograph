import * as fs from 'node:fs';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Dictionary, Entity, Reference } from '../entity/entity.js';
import { Node } from '../entity/node.js';
import { Edge } from '../entity/edge.js';
import { EntityMap } from '../entity/entity-map.js';
import { EntityFilter, Graph, GraphData, GraphStorage } from './interfaces.js';

type JsonGraphOptions = {
  filename: string;
  compression: boolean;
};
const jsonGraphDefaults: JsonGraphOptions = {
  filename: ':memory:',
  compression: false,
};

export class JsonGraph implements Graph, GraphData, GraphStorage {
  nodes = new EntityMap<Node>();
  edges = new EntityMap<Edge>();
  config: JsonGraphOptions;

  constructor(options?: Partial<JsonGraphOptions>) {
    this.config = {
      ...jsonGraphDefaults,
      ...options,
    };
  }

  async load(options?: Partial<JsonGraphOptions>): Promise<void> {
    this.config = {
      ...jsonGraphDefaults,
      ...options,
    };

    if (this.config.filename !== ':memory:') {
      const options = Entity.getSerializerOptions();
      fs.readFile(this.config.filename, (error, data) => {
        if (error !== null) throw error;
        const { nodes, edges } = JSON.parse(data.toString());
        this.nodes = new EntityMap(
          plainToInstance<Node, Dictionary>(Node, nodes, options),
        );
        this.edges = new EntityMap(
          plainToInstance<Edge, Dictionary>(Edge, edges, options),
        );
      });
    }
  }

  async save(options?: Partial<JsonGraphOptions>): Promise<void> {
    const config = {
      ...this.config,
      ...options,
    };
    return new Promise((resolve, reject) => {
      const options = Entity.getSerializerOptions();
      const data = {
        nodes: instanceToPlain([...this.nodes.values()], options),
        edges: instanceToPlain([...this.edges.values()], options),
      };

      fs.writeFile(config.filename, JSON.stringify(data), (error) => {
        if (error !== null) {
          reject(error);
        }

        resolve();
      });
    });
  }

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
}
