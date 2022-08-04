import { Entity, JsonObject } from './entity';

export class Node extends Entity {
  readonly type: string = 'node';
  labels: string[] = [];

  static New(...args: unknown[]): Node {
    return new this(args);
  }

  static Load(data: JsonObject | string): Node {
    return new this(data);
  }

  getTable() {
    return 'node';
  }
}
