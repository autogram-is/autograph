import { createReadStream, createWriteStream, PathLike } from 'node:fs';
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
import { Mutable, Persistable, Readable, Graph } from '../graph/interfaces.js';
import { Match, MatchMaker } from '../graph/match.js';
import { JsonNodes } from './json-nodes.js';
import { JsonEdges } from './json-edges.js';

export class JsonGraph implements Readable, Mutable, Persistable, Graph {
  lastSavePath?: PathLike;

  readonly nodeMap = new Map<string, Node>();
  readonly edgeMap = new Map<string, Edge>();

  /* Graph methods */

  nodes(...criteria: Array<Match<Node>>): JsonNodes {
    const m = new MatchMaker<Node>(criteria);
    const results = [...this.nodeMap.values()].filter((input) =>
      m.match(input),
    );
    return new JsonNodes(this, results);
  }

  edges(...criteria: Array<Match<Edge>>): JsonEdges {
    const m = new MatchMaker<Edge>(criteria);
    const results = [...this.edgeMap.values()].filter((input) =>
      m.match(input),
    );
    return new JsonEdges(this, results);
  }

  /* Persistable methods */

  async load(filePath: PathLike): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
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
      } catch (error: unknown) {
        reject(error);
      }
    });
  }

  async save(filePath?: PathLike): Promise<void> {
    return new Promise((resolve, reject) => {
      const savePath = filePath ?? this.lastSavePath;
      if (is.undefined(savePath)) {
        reject(new Error('No path for save'));
      } else {
        this.lastSavePath = savePath;
      }

      try {
        const writeStream = createWriteStream(savePath!, 'utf8');
        writeStream
          .once('open', () => {
            for (const entity of [
              ...this.nodeMap.values(),
              ...this.edgeMap.values(),
            ]) {
              writeStream.write(entity.serialize() + `\n`);
            }

            writeStream.end();
          })
          .once('finish', () => {
            resolve();
          })
          .once('error', (error: Error) => {
            reject(error);
          });
      } catch (error: unknown) {
        reject(error);
      }
    });
  }

  /* Readable methods */

  has(input: Reference): boolean {
    const id = Entity.idFromReference(input);
    return this.nodeMap.has(id) ?? this.edgeMap.has(id);
  }

  get(input: Uuid): Entity | undefined {
    const id = Entity.idFromReference(input);
    return this.nodeMap.get(id) ?? this.edgeMap.get(id);
  }

  /* Mutable methods */

  add(input: Entity | Entity[]): this {
    if (!is.array(input)) input = [input];
    for (const entity of input) {
      if (isNode(entity) && !this.nodeMap.has(entity.id)) {
        this.nodeMap.set(entity.id, entity);
      } else if (isEdge(entity) && !this.edgeMap.has(entity.id)) {
        this.edgeMap.set(entity.id, entity);
      }
    }

    return this;
  }

  remove(input: Entity | Entity[]): this {
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

  set(input: Entity | Entity[]): this {
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
