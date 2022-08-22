import { Uuid, Entity } from './index.js';

export class EntityMap<T extends Entity = Entity> extends Map<Uuid, T> {
  constructor(values?: T[]) {
    super(values?.map((v) => [v.id, v]));
  }

  add(value: T): this {
    return super.set(value.id, value);
  }

  addItems(values: T[]): this {
    for (const t of values) {
      this.add(t);
    }

    return this;
  }
}
