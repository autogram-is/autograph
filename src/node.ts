import { Entity, JsonObject } from './entity';

export class Node extends Entity {
  readonly type: string = 'node';

  labels: string[] = [];

  constructor(data?: JsonObject | string) {
    super();
    if (data !== undefined) {
      if (typeof data === 'string') data = JSON.parse(data);
      Object.assign(this, data);
    }
    this.assignId();
  }

  static new(...args: unknown[]): Node {
    return new Node();
  }

  static load<T extends typeof Node = typeof this>(
    this: T,
    data: JsonObject | string
  ): InstanceType<T> {
    return new this(data) as InstanceType<T>;
  }

  getTable() {
    return 'node';
  }
}
