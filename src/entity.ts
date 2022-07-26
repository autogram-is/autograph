import {v4 as uuidv4} from 'uuid';
import {v5 as uuidv5} from 'uuid';
import {NIL} from 'uuid';
import * as hash from 'object-hash';

export const NSG_UUID_NAMESPACE = '9fc3e7e5-59d7-4d55-afa0-98a978f49bab';
export abstract class Entity {
  id: string = NIL;
  [propName: string]: unknown;

  abstract getTable(): string;

  protected assignId() {
    this.id = Entity.generateId(this.uniqueValues);
  }

  protected get uniqueValues(): unknown {
    return false;
  }

  static generateId(hashValue?: unknown): string {
    if (hashValue) {
      if (typeof hashValue !== 'object') {
        hashValue = {data: hashValue};
      }
      const hashOutput: Buffer = hash(<object>hashValue, {encoding: 'buffer'});
      return uuidv5(hashOutput, NSG_UUID_NAMESPACE);
    } else {
      return uuidv4();
    }
  }
}
