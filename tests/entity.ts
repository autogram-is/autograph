import {Entity} from '../src';

export class TestEntity extends Entity {
  customProperty = '';
  protected get uniqueValues(): string {
    return this.customProperty;
  }
  getTable() {
    return 'none';
  }
}

test('Uuids generated from any property', () => {
  const randomUuid = Entity.generateId();
  const stringUuid = Entity.generateId('test string');
  const stringUuid2 = Entity.generateId('test string 2');
  const unknownStringUuid = Entity.generateId('test string 2' as unknown);
  const arrayUuid = Entity.generateId([1, 2]);
  const objectUuid = Entity.generateId({property: 'test', property2: 2});

  expect(Entity.isValidId(randomUuid)).toBe(true);
  expect(Entity.isValidId(randomUuid)).toBe(true);
  expect(stringUuid).not.toBe(stringUuid2);
  expect(stringUuid2).toBe(unknownStringUuid);
  expect(Entity.isValidId(arrayUuid)).toBe(true);
  expect(Entity.isValidId(objectUuid)).toBe(true);
});

test('Unique properties extracted', () => {
  const obj = new TestEntity();
  obj.customProperty = 'foo';
  expect(Entity.isValidId(obj.id)).toBe(true);
});
