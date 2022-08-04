import { Entity, JsonObject } from './entity';

export class Node extends Entity {
  readonly type: string = 'node';
  labels: string[] = [];

  static New(): Node {
    return new this();
  }

  static Load(data: JsonObject | string): Node {
    return new this(data);
  }

  getTable() {
    return 'node';
  }
}
