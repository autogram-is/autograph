import { Entity } from './entity'

export class Node extends Entity {
  readonly type:string = 'node';
  labels:string[] = [];
  [key:string]: any;

  getTable() {
    return 'node';
  }

  constructor(data:Record<string, any> = {}) {
    super();
    for (let k in data) this[k] = data[k];
  }
}