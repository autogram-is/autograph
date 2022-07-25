import {Entity} from './entity';

export class Node extends Entity {
  readonly type: string = 'node';
  labels: string[] = [];
  [propName: string]: unknown;

  getTable() {
    return 'node';
  }

  constructor(data: Record<string, unknown> = {}) {
    super();
    for (const k in data) this[k] = data[k];
    this.assignId();
  }
}
