import { TextEncoder } from 'util';
import { v4 as uuidv4} from 'uuid';
import { stringify as bytesToUuid } from 'uuid';
import * as hash from 'object-hash'
import { TcpNetConnectOpts } from 'net';

export abstract class Entity {
  protected _id?:string;
  abstract getTable():string

  get id():string {
    if (this._id === undefined) this._id = this.generateEntityId();
    return this._id;
  }
  set id(value:string) {
    this._id = value;
  }

  serialize() {
    return JSON.stringify(this)
  }

  protected generateEntityId(): string {
    return Entity.generateId(this.uniqueProperties);
  }

  protected get uniqueProperties():any {
    return false;
  }

  static generateId(hashValue?:any): string {
    if (hashValue) {
      const sha1 = hash(hashValue);
      const byteArr = new TextEncoder().encode(sha1);
      return bytesToUuid(byteArr);
    } else {
      return uuidv4();
    }
  }
}