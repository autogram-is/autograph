import {v4 as uuidv4} from 'uuid';
import {v5 as uuidv5} from 'uuid';
import * as hash from 'object-hash';

export abstract class Entity {
  protected _id?: string;
  abstract getTable(): string;

  get id(): string {
    if (this._id === undefined) this._id = this.generateEntityId();
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  serialize() {
    return JSON.stringify(this);
  }

  protected generateEntityId(): string {
    return Entity.generateId(this.uniqueProperties);
  }

  protected get uniqueProperties(): unknown {
    return false;
  }

  static generateId(hashValue?: unknown): string {
    if (hashValue) {
      if (typeof hashValue !== 'object') {
        hashValue = {data: hashValue};
      }
      const hashOutput: Buffer = hash(<object>hashValue, {encoding: 'buffer'});
      return uuidv5(hashOutput, uuidv5.URL);
    } else {
      return uuidv4();
    }
  }
}
