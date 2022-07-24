import {Entity} from './entity';

export class Node extends Entity {
  readonly type: string = 'node';
  labels: string[] = [];
  [key: string]: any;

  getTable() {
    return 'node';
  }

  constructor(data: Record<string, any> = {}) {
    super();
    for (const k in data) this[k] = data[k];
  }
}
