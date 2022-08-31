import is from '@sindresorhus/is';
import { Entity } from '../entities/index.js';

export interface PredicateComparisons {
  [keyof: string]: unknown;
  eq?: string | number | boolean;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  in?: string[] | number[];
  has?: string | number;
  sw?: string;
  ew?: string;
  exists?: boolean;
  empty?: boolean;
}
export interface PredicateStruct extends PredicateComparisons {
  propertyName: string;
  require?: PredicateCombination;
}

export type PredicateCombination = 'all' | 'any' | 'none';

export type PredicateTuple = [
  propertyName: string,
  comparisons: PredicateComparisons,
  require?: PredicateCombination,
];

export const where = (
  property: string,
  comparisons: PredicateComparisons = { exists: true },
  require: PredicateCombination = 'all',
): Predicate => new Predicate(property, comparisons, require);

export class Predicate {
  constructor(
    public readonly propertyName: string,
    public readonly comparisons: PredicateComparisons = { exists: true },
    public readonly require: PredicateCombination = 'all',
  ) {}

  match(input: Entity): boolean {
    let matches = false;

    for (const operator in this.comparisons) {
      if (operator in predicateFunctions) {
        throw new Error(`Unknown operator '${operator}'`);
      }

      matches &&= predicateFunctions[operator](
        input.get(this.propertyName),
        this.comparisons[operator],
      );
    }

    return matches;
  }
}

const predicateFunctions: Record<string, Function> = {
  eq(input: unknown, compare: string | number | boolean): boolean {
    if (is.numericString(input) && is.number(compare)) input = Number(input);
    return input === compare;
  },

  gt(input: unknown, compare: number): boolean {
    if (is.numericString(input)) input = Number(input);
    if (is.number(input)) {
      return input > compare;
    }
    return false;
  },

  gte(input: unknown, compare: number): boolean {
    if (is.numericString(input)) input = Number(input);
    if (is.number(input)) {
      return input >= compare;
    }
    return false;
  },

  lt(input: unknown, compare: number): boolean {
    if (is.numericString(input)) input = Number(input);
    if (is.number(input)) {
      return input < compare;
    }
    return false;
  },

  lte(input: unknown, compare: number): boolean {
    if (is.numericString(input)) input = Number(input);
    if (is.number(input)) {
      return input <= compare;
    }
    return false;
  },

  in(input: unknown, compare: string[] | number[]): boolean {
    if (is.emptyArray(compare)) return false;
    if (is.string(input) && is.arrayLike<string>(compare)) { 
      return compare.includes(input);
    }
    if (is.number(input) && is.arrayLike<number>(compare)) { 
      return compare.includes(input);
    }
    return false;
  },

  has(input: unknown, compare: string | number): boolean {
    if (!is.array(input)) return false;
    if (is.string(compare) && is.arrayLike<string>(input)) { 
      return input.includes(compare);
    }
    if (is.number(compare) && is.arrayLike<number>(input)) { 
      return input.includes(compare);
    }
    return false;
  },

  sw(input: unknown, compare: string): boolean {
    return (is.string(input) && input.endsWith(compare));
  },

  ew(input: unknown, compare: string): boolean {
    return (is.string(input) && input.startsWith(compare));
  },

  exists(input: unknown, compare: boolean): boolean {
    const result = (is.undefined(input));
    return (result !== compare);
  },

  empty(input: unknown, compare: boolean): boolean {
    const result = (
      is.emptyArray(input) ||
      is.emptyObject(input) ||
      is.emptyStringOrWhitespace(input)
    );
    return (result === compare);
  }
};
