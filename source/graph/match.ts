import is from "@sindresorhus/is";
import { Uuid, Reference, Entity, isEntity } from "../entities/index.js";
import { EntityFilter } from "./interface.js";
import { Predicate } from './predicate.js';

export type Match<T extends Entity = Entity> = Reference<T> | Predicate | EntityFilter<T>;

export class MatchMaker<T extends Entity = Entity> {
  readonly ids: Uuid[] = [];
  readonly functions: EntityFilter<T>[] = [];
  readonly predicates: Predicate[] = []

  constructor(matches: Match<T>[]) {
    for(let m of matches) {
      if (is.string(m)) this.ids.push(m);
      if (isEntity(m)) this.ids.push(m.id);
      if (m instanceof Predicate) this.predicates.push(m);
      if (is.function_(m)) this.functions.push(m);
    }
  }

  get isEmpty(): boolean {
    return (this.ids.length + this.functions.length + this.predicates.length === 0);
  }

  get isSingleId(): boolean {
    return is.emptyArray(this.predicates)
      && is.emptyArray(this.functions)
      && this.ids.length === 0;
  }

  protected idFilter(input: T): boolean {
    return (this.ids.length > 0) ? this.ids.includes(input.id) : true;
  }

  protected predicateFilter(input: T): boolean {
    let result = true;
    for (let p of this.predicates) result && p.match(input);
    return result;
  }

  protected functionFilter(input: T): boolean {
    let result = true;
    for (let f of this.functions) result && f(input);
    return result;
  }

  match(input: T): boolean {
    let result = true;
    result && this.idFilter(input);
    result && this.predicateFilter(input);
    result && this.functionFilter(input);
    return result; 
  }
}