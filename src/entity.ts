import { SnakeCase } from 'type-fest';
import { v4 as uuidv4, v5 as uuidv5, NIL as NilUuid, validate } from 'uuid';
import * as hash from 'object-hash';

// A slightly modified version of the JsonObject set from type-fest.
// It allows unknowns, even though that's probably not a great idea.
export type JsonArray = JsonValue[];
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray | unknown;
export type JsonObject = { [Key in string]?: JsonValue };

export type Uuid = string;

export const NIL: Uuid = NilUuid;

const NSG_UUID_NAMESPACE: Uuid = '9fc3e7e5-59d7-4d55-afa0-98a978f49bab';

export abstract class Entity {
  id = NIL;
  [propName: string]: unknown;

  abstract getTable(): SnakeCase<string>;

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

  toJSON(): JsonObject {
    const data: JsonObject = { ...this };
    return data;
  }
}
