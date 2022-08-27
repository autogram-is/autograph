import { accessSync, createReadStream, createWriteStream } from 'node:fs';
import is from '@sindresorhus/is';
import ndjson from 'ndjson';
import {
  Dictionary,
  Edge,
  isEdge,
  isEdgeData,
  Entity,
  Node,
  isNode,
  isNodeData,
  Reference,
  Uuid,
} from '../index.js';
import { Mutable, Persistable, Readable } from './interfaces.js';

export class JsonGraph implements Readable, Mutable, Persistable {
  lastSavePath?: string;

  protected nodeMap = new Map<string, Node>();
  protected edgeMap = new Map<string, Edge>();

  async load(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        accessSync('filePath');
      } catch {
        reject(new Error('File path inaccessible'));
      }

      createReadStream(filePath)
        .pipe(ndjson.parse())
        .on('data', (chunk: Dictionary) => {
          try {
            if (isNodeData(chunk)) this.add(Node.load(chunk));
            if (isEdgeData(chunk)) this.add(Edge.load(chunk));
          } catch {
            console.error(`Couldn't load entity from JSON`);
          }
        })
        .once('error', (error: Error) => {
          reject(error);
        })
        .once('end', () => {
          resolve();
        });
    });
  }

  async save(filePath?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const savePath = filePath ?? this.lastSavePath;
      if (is.undefined(savePath)) {
        reject(new Error('No path for save'));
      }

      try {
        accessSync(savePath!);
      } catch {
        reject(new Error('File path inaccessible'));
      }

      const writeStream = createWriteStream(savePath!, 'utf8');
      const stringer = ndjson.stringify().pipe(writeStream);

      for (const node of this.nodeMap.values()) {
        stringer.write(node.toJSON());
      }

      for (const edge of this.edgeMap.values()) {
        stringer.write(edge.toJSON());
      }

      stringer.end();
      writeStream.close();

      resolve();
    });
  }

  has(input: Reference): boolean {
    const id = Entity.idFromReference(input);
    return this.nodeMap.has(id) ?? this.edgeMap.has(id);
  }

  get(input: Uuid): Entity | undefined {
    const id = Entity.idFromReference(input);
    return this.nodeMap.get(id) ?? this.edgeMap.get(id);
  }

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
