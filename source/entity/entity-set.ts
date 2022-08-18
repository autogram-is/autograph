import { Uuid, Entity, Reference } from '../entity/entity.js';

export class EntitySet<T extends Entity = Entity> extends Set<T> {
  private readonly ids: Set<Uuid> = new Set<Uuid>();

  public constructor(values?: T[]) {
    super();
    if (values !== undefined) {
      this.addItems(values);
    }
  }

  override add(value: T | T): this {
    if (!this.ids.has(value.id)) {
      super.add(value);
      this.ids.add(value.id);
    }

    return this;
  }

  override has(value: Reference<T>): boolean {
    return this.ids.has(Entity.idFromReference(value));
  }

  override delete(value: Reference<T>): boolean {
    const id = Entity.idFromReference(value);
    this.ids.delete(id);
    for (const u of this) {
      if (u.id === id) {
        return super.delete(u);
      }
    }

    return false;
  }

  override clear(): void {
    this.ids.clear();
    super.clear();
  }

  addItems(values: T[]): this {
    for (const v of values) {
      this.add(v);
    }

    return this;
  }
}
