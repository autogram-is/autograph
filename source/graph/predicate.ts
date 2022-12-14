import is from '@sindresorhus/is';
import { Entity } from '../entities/index.js';

export interface PredicateComparisons {
  [keyof: string]: PredicateValue | PredicateValue[] | undefined;
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

export type PredicateMode = 'all' | 'any' | 'none';
export type PredicateValue = number | string | boolean;

export interface PredicateStruct extends PredicateComparisons {
  propertyName: string;
  mode?: PredicateMode;
}

export type PredicateTuple = [
  propertyName: string,
  comparisons: PredicateComparisons,
  mode?: PredicateMode,
];

type PredicateFunction = (input: unknown, compare: unknown) => boolean;
const defaultPredicateComparison = { exists: true };

export const where = (
  property: string,
  comparisons: PredicateComparisons = defaultPredicateComparison,
  mode: PredicateMode = 'all',
): Predicate => new Predicate(property, comparisons, mode);

export class Predicate {
  constructor(
    public readonly propertyName: string,
    public readonly comparisons: PredicateComparisons = { exists: true },
    public readonly mode: PredicateMode = 'all',
  ) {}

  match(input: Entity): boolean {
    let aggregateResult: boolean;
    switch (this.mode) {
      case 'any':
        aggregateResult = false;
        break;
      case 'none':
        aggregateResult = true;
        break;
      default: // 'all'
        aggregateResult = true;
        break;
    }

    const value = input.get(this.propertyName);

    for (const operator in this.comparisons) {
      const func = predicateFunctions[operator];
      if (is.undefined(func)) {
        throw new Error(`Unknown operator '${operator}'`);
      }

      const compare = this.comparisons[operator];

      switch (this.mode) {
        case 'any':
          if (func(value, compare)) return true;
          break;
        case 'none':
          if (func(value, compare)) return false;
          break;
        default: // 'all'
          if (!func(value, compare)) return false;
          break;
      }
    }

    return aggregateResult;
  }
}

const predicateFunctions: Record<string, PredicateFunction> = {
  eq(input: unknown, compare: unknown): boolean {
    if (!(is.number(compare) || is.string(compare) || is.boolean(compare)))
      return false;
    if (is.numericString(input) && is.number(compare)) input = Number(input);
    return input === compare;
  },

  gt(input: unknown, compare: unknown): boolean {
    if (!is.number(compare)) return false;
    if (is.numericString(input)) input = Number(input);
    if (is.number(input)) {
      return input > compare;
    }

    return false;
  },

  gte(input: unknown, compare: unknown): boolean {
    if (!is.number(compare)) return false;
    if (is.numericString(input)) input = Number(input);
    if (is.number(input)) {
      return input >= compare;
    }

    return false;
  },

  lt(input: unknown, compare: unknown): boolean {
    if (!is.number(compare)) return false;
    if (is.numericString(input)) input = Number(input);
    if (is.number(input)) {
      return input < compare;
    }

    return false;
  },

  lte(input: unknown, compare: unknown): boolean {
    if (!is.number(compare)) return false;
    if (is.numericString(input)) input = Number(input);
    if (is.number(input)) {
      return input <= compare;
    }

    return false;
  },

  in(input: unknown, compare: unknown): boolean {
    if (!is.array(compare) || is.emptyArray(compare)) return false;
    if (is.string(input) && is.arrayLike<string>(compare)) {
      return compare.includes(input);
    }

    if (is.number(input) && is.arrayLike<number>(compare)) {
      return compare.includes(input);
    }

    return false;
  },

  has(input: unknown, compare: unknown): boolean {
    if (is.set(input)) input = [...input];
    if (!is.array(input) || !(is.string(compare) || is.number(compare)))
      return false;
    if (is.string(compare) && is.arrayLike<string>(input)) {
      return [...input].includes(compare);
    }

    if (is.number(compare) && is.arrayLike<number>(input)) {
      return [...input].includes(compare);
    }

    return false;
  },

  sw(input: unknown, compare: unknown): boolean {
    if (!is.string(compare)) return false;
    return is.string(input) && input.endsWith(compare);
  },

  ew(input: unknown, compare: unknown): boolean {
    if (!is.string(compare)) return false;
    return is.string(input) && input.startsWith(compare);
  },

  exists(input: unknown, compare: unknown): boolean {
    if (!is.boolean(compare)) return false;
    const result = is.undefined(input);
    return result !== compare;
  },

  empty(input: unknown, compare: unknown): boolean {
    if (!is.boolean(compare)) return false;
    const result =
      is.emptyArray(input) ||
      is.emptyObject(input) ||
      is.emptyStringOrWhitespace(input);
    return result === compare;
  },
};
