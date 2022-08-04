import { v4 as uuidv4, v5 as uuidv5, NIL, validate } from 'uuid';
import * as hash from 'object-hash';

export type JsonObject = { [Key in string]?: JsonValue };
export type JsonArray = JsonValue[];
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type Uuid = string & { readonly __uuid: true };
export type EntityConstructorArgument =
  | JsonObject
  | string
  | unknown[]
  | undefined;

export const NSG_UUID_NAMESPACE =
  '9fc3e7e5-59d7-4d55-afa0-98a978f49bab' as Uuid;

export abstract class Entity {
  id = NIL as Uuid;
  [propName: string]: unknown;

  abstract getTable(): string;

  protected constructor(data?: EntityConstructorArgument) {
    if (data !== undefined) {
      if (typeof data === 'string') data = JSON.parse(data);
      Object.assign(this, data);
    }
    this.assignId();
  }

  protected assignId() {
    if (this.id === NIL) {
      this.id = Entity.generateId(this.uniqueValues);
    }
  }

  static generateId(hashValue?: unknown): Uuid {
    if (hashValue) {
      if (typeof hashValue !== 'object') {
        hashValue = { data: hashValue };
      }
      const hashOutput: Buffer = hash(<object>hashValue, {
        encoding: 'buffer',
      });
      return uuidv5(hashOutput, NSG_UUID_NAMESPACE) as Uuid;
    } else {
      return uuidv4() as Uuid;
    }
  }

  protected get uniqueValues(): unknown {
    return false;
  }

  static isValidId(id: string): boolean {
    return validate(id);
  }
}
