import { Entity, Reference, Uuid } from '../entities/index.js';
import { Readable, Searchable } from '../graph/interfaces.js';
import { Match, MatchMaker } from '../graph/match.js';
import { JsonGraph } from './json-graph.js';

export abstract class JsonEntities<T extends Entity>
  implements Readable<T>, Searchable<T>, IterableIterator<T>
{
  protected internalMap: Map<Uuid, T>;

  constructor(protected graph: JsonGraph, incoming: T[] = []) {
    this.internalMap = new Map<Uuid, T>(incoming.map((i) => [i.id, i]));
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.internalMap.values()[Symbol.iterator]();
  }

  next(...args: unknown[]): IteratorResult<T> {
    return this.internalMap.values().next();
  }

  ids(): Uuid[] {
    return [...this.internalMap.keys()];
  }

  values(): T[] {
    return [...this.internalMap.values()];
  }

  has(input: Reference<T>): boolean {
    return this.internalMap.has(Entity.idFromReference(input));
  }

  get(input: Uuid): T | undefined {
    return this.internalMap.get(input);
  }

  find(...criteria: Array<Match<T>>): T | undefined {
    const m = new MatchMaker<T>(criteria);
    return [...this.internalMap.values()].find((input) => m.match(input));
  }

  count(...criteria: Array<Match<T>>): number {
    const m = new MatchMaker<T>(criteria);
    return [...this.internalMap.values()].filter((input) => m.match(input))
      .length;
  }

  abstract filter(...criteria: Array<Match<T>>): JsonEntities<T>;
}
