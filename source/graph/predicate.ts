import is from '@sindresorhus/is';
import { Entity } from '../entities/index.js';

export type PredicateStructure = [
  property: string,
  operator: Operator,
  value?: PredicateValue,
];

export type PredicateValue = string | string[] | number | number[] | boolean;

export type Operator =
  | 'equals'
  | 'notequals'
  | 'greaterthan'
  | 'lessthan'
  | 'notgreaterthan'
  | 'notlessthan'
  | 'between'
  | 'within'
  | 'outside'
  | 'contains'
  | 'excludes'
  | 'in'
  | 'notin'
  | 'startswith'
  | 'endswith'
  | 'exists'
  | 'missing'
  | 'empty';

export class Predicate {
  constructor(
    public property: string,
    public operator: Operator,
    public value?: PredicateValue,
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

export const where = (
  property: string,
  operator: Operator,
  value?: PredicateValue,
): Predicate => new Predicate(property, operator, value);

export const matchesPredicate = (
  input: Entity,
  predicate?: PredicateStructure,
): boolean => {
  if (is.undefined(predicate)) return false;
  const existingValue = input.get(predicate[0]);
  const operator = predicate[1];
  let comparisonValue = predicate[2];

  const testFunction = predicateTests[operator];
  if (is.undefined(testFunction)) {
    throw new Error(`No test for '${predicate[1]}' exists`);
  }

  if (is.undefined(comparisonValue)) {
    if (['exists', 'missing', 'empty'].includes(predicate[1])) {
      comparisonValue = false; // Assign a dummy value; those tests won't use it
    } else {
      throw new Error(`Operator '${predicate[1]} requires comparison value`);
    }
  }

  return testFunction(existingValue, comparisonValue);
};

type PredicateTestFunction = (
  propValue: unknown,
  compareValue: PredicateValue,
) => boolean;

const predicateTests: Record<Operator, PredicateTestFunction> = {
  equals(property: unknown, value: PredicateValue): boolean {
    return property === value;
  },

  notequals(property: unknown, value: PredicateValue): boolean {
    return property !== value;
  },

  greaterthan(property: unknown, value: PredicateValue): boolean {
    if (is.number(property) && is.number(value)) {
      return property > value;
    }

    return false;
  },

  lessthan(property: unknown, value: PredicateValue): boolean {
    if (is.number(property) && is.number(value)) {
      return property < value;
    }

    return false;
  },

  notgreaterthan(property: unknown, value: PredicateValue): boolean {
    if (is.number(property) && is.number(value)) {
      return property <= value;
    }

    return false;
  },

  notlessthan(property: unknown, value: PredicateValue): boolean {
    if (is.number(property) && is.number(value)) {
      return property >= value;
    }

    return false;
  },

  between(property: unknown, value: PredicateValue): boolean {
    if (is.number(property) && is.nonEmptyArray(value) && is.number(value[0])) {
      const min = Number(value.sort()[0]);
      const max = Number(value[value.length - 1]);
      return property > min && property < max;
    }

    return false;
  },

  within(property: unknown, value: PredicateValue): boolean {
    if (is.number(property) && is.nonEmptyArray(value) && is.number(value[0])) {
      const min = Number(value.sort()[0]);
      const max = Number(value[value.length - 1]);
      return property >= min && property <= max;
    }

    return false;
  },

  outside(property: unknown, value: PredicateValue): boolean {
    if (is.number(property) && is.nonEmptyArray(value) && is.number(value[0])) {
      const min = Number(value.sort()[0]);
      const max = Number(value[value.length - 1]);
      return property < min && property > max;
    }

    return false;
  },

  contains(property: unknown, value: PredicateValue): boolean {
    if (is.array(property)) {
      return property.includes(value);
    }

    if (is.string(property)) {
      return property.includes(value.toString());
    }

    return false;
  },

  excludes(property: unknown, value: PredicateValue): boolean {
    if (is.array(property)) {
      return !property.includes(value);
    }

    if (is.string(property)) {
      return !property.includes(value.toString());
    }

    return false;
  },

  in(property: unknown, value: PredicateValue): boolean {
    if (is.array<string>(value) && is.string(property)) {
      return value.includes(property);
    }

    if (is.array<number>(value) && is.number(property)) {
      return value.includes(property);
    }

    return false;
  },

  notin(property: unknown, value: PredicateValue): boolean {
    if (is.array<string>(value) && is.string(property)) {
      return !value.includes(property);
    }

    if (is.array<number>(value) && is.number(property)) {
      return !value.includes(property);
    }

    return false;
  },

  startswith(property: unknown, value: PredicateValue): boolean {
    if (is.string(value) && is.string(property)) {
      return property.startsWith(value);
    }

    return false;
  },

  endswith(property: unknown, value: PredicateValue): boolean {
    if (is.string(value) && is.string(property)) {
      return property.endsWith(value);
    }

    return false;
  },

  exists(property: unknown, value: PredicateValue): boolean {
    return !is.undefined(property);
  },

  missing(property: unknown, value: PredicateValue): boolean {
    return is.nullOrUndefined(property);
  },

  empty(property: unknown, value: PredicateValue): boolean {
    return (
      is.emptyArray(property) ||
      is.emptyObject(property) ||
      is.emptyStringOrWhitespace(property)
    );
  },
};
