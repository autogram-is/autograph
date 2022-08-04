import {Entity} from './entity';

export class Node extends Entity {
  readonly type: string = 'node';

  static Create(): Node {
    return new this();
  }

  getTable() {
    return 'node';
  }
}
