import is from "@sindresorhus/is";
import { Entity } from "../index.js";

export type PredicateValue = string  | string[] | number | number[] | null;
export type PredicateStructure = [property: string, operator: Operator, value?: PredicateValue];
export type Operator = 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'notGreaterThan' | 'notLessThan' | 'between' | 'outside' | 'contains' | 'excludes' | 'in' | 'notIn' | 'startsWith' | 'endsWith' | 'exists' | 'missing' | 'empty';

export class Predicate {
  constructor(
    public property: string,
    public operator: Operator,
    public value: PredicateValue = null,
  ) {}

  toStructure(): PredicateStructure {
    return [this.property, this.operator, this.value];
  }

  toString(): string {
    return `${this.property} ${this.operator} ${this.property}`;
  }

  match(input: Entity): boolean {
    return matchesPredicate(input, this.toStructure());
  }
}

export const matchesPredicate = (
  input: Entity,
  predicate?: PredicateStructure
): boolean => { 
  if (is.undefined(predicate)) return false
  const propValue = input.get(predicate[0]);

  // CASE ALL THE THINGS

  return false;
}

export const property = (
  property: string, 
  operator: Operator, 
  value: PredicateValue = null
): Predicate => new Predicate(property, operator, value);