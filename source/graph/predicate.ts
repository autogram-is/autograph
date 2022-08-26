import is from "@sindresorhus/is";
import { stringify } from "querystring";
import { Entity } from "../index.js";

export type PredicateValue = string  | string[] | number | number[] | boolean | null;
export type PredicateStructure = [property: string, operator: Operator, value?: PredicateValue];
export type Operator = 'equals' | 'notequals' | 'greaterthan' | 'lessthan' | 'notgreaterthan' | 'notlessthan' | 'between' | 'within' | 'outside' | 'contains' | 'excludes' | 'in' | 'notin' | 'startswith' | 'endswith' | 'exists' | 'missing' | 'empty';

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

export const where = (
  property: string, 
  operator: Operator, 
  value: PredicateValue = null
): Predicate => new Predicate(property, operator, value);

export const matchesPredicate = (
  input: Entity,
  predicate?: PredicateStructure
): boolean => { 
  if (is.undefined(predicate)) return false
  const propValue = input.get(predicate[0]);

  // This might be a bad precedent; do we want to do data type conversions? I don't think so.
  let compareValue = is.numericString(predicate[2]) ? Number(predicate[2]) : predicate;

  switch (predicate[1]) {
    case 'equals':
      return (propValue === compareValue);
      break;
    
    case 'notequals':
      return (propValue !== compareValue);
      break;
    
    case 'greaterthan':
      if (is.number(propValue) && is.number(compareValue)) {
        return propValue > compareValue;
      }
      break;
    
    case 'lessthan':
      if (is.number(propValue) && is.number(compareValue)) {
        return propValue < compareValue;
      }
      break;
    
    case 'notgreaterthan':
      if (is.number(propValue) && is.number(compareValue)) {
        return propValue <= compareValue;
      }
      break;
    
    case 'notlessthan':
      if (is.number(propValue) && is.number(compareValue)) {
        return propValue >= compareValue;
      }
      break;
    
    case 'between':
      if (is.number(propValue) && is.nonEmptyArray(compareValue) && is.number(compareValue[0])) {
        const min = Number(compareValue.sort()[0]);
        const max = Number(compareValue[compareValue.length - 1]);
        return (propValue > min) && (propValue < max);
      }
      break;

    case 'within':
      if (is.number(propValue) && is.nonEmptyArray(compareValue) && is.number(compareValue[0])) {
        const min = Number(compareValue.sort()[0]);
        const max = Number(compareValue[compareValue.length - 1]);
        return (propValue >= min) && (propValue <= max);
      }
      break;
    
    case 'outside':
      if (is.number(propValue) && is.nonEmptyArray(compareValue) && is.number(compareValue[0])) {
        const min = Number(compareValue.sort()[0]);
        const max = Number(compareValue[compareValue.length - 1]);
        return (propValue < min) && (propValue > max);
      }
      break;
    
    case 'contains':
      if (is.array(propValue)) {
        return propValue.includes(compareValue);
      }
      if (is.string(propValue)) {
        return propValue.includes(compareValue.toString())
      }
      break;
    
    case 'excludes':
      if (is.array(propValue)) {
        return !propValue.includes(compareValue);
      }
      if (is.string(propValue)) {
        return !propValue.includes(compareValue.toString())
      }
      break;
    
    case 'in':
      if (is.array<string>(compareValue) && is.string(propValue)) {
        return compareValue.includes(propValue);
      } else if (is.array<number>(compareValue) && is.number(propValue)) {
        return compareValue.includes(propValue);
      } else 
      break;
    
    case 'notin':
      if (is.array<string>(compareValue) && is.string(propValue)) {
        return !compareValue.includes(propValue);
      } else if (is.array<number>(compareValue) && is.number(propValue)) {
        return !compareValue.includes(propValue);
      } else 
      break;
    
    case 'startswith':
      if (is.string(compareValue) && is.string(propValue)) {
        return propValue.startsWith(compareValue);
      }
      break;
    
    case 'endswith':
      if (is.string(compareValue) && is.string(propValue)) {
        return propValue.endsWith(compareValue);
      }
      break;
    
    case 'exists':
      return (!is.undefined(propValue))
      break;
    
    case 'missing':
      return (is.nullOrUndefined(propValue))
      break;
    
    case 'empty':
      isEmpty(propValue);
      break;
  }
  return false;

  function isEmpty(val: unknown): boolean {
    return is.emptyArray(val) ||
      is.emptyObject(val) ||
      is.emptyStringOrWhitespace(val) ||
      is.undefined(val);
  }
}