import objectHash = require('object-hash');
import { getId, Uuid } from './id';

export abstract class Entity {
  private _id!: Uuid;
  [key:string]: any;

  get id():Uuid {
    this.generateId();
    return this._id;
  }
  set id(value:Uuid) {
    this._id = value;
  }

  protected generateId() {
    if (this._id === undefined) this._id = getId(this.uniqueValues());
  }

  protected uniqueValues():any {
    return;
  }

  displayName():string {
    return this.id;
  }
}

export type EntityReference = Entity | Uuid;
export const uuidFromReference = (v:EntityReference) => (typeof(v) === 'string') ? v as Uuid : v.id;
export const isEntity = (e:any):boolean => {
  return ('id' in e && typeof(e.id) === 'string');
}