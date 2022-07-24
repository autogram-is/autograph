import {Entity} from '../src';
import {validate as isValidUuid} from 'uuid';

class testEntity extends Entity {
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

  expect(isValidUuid(randomUuid)).toBe(true);
  expect(isValidUuid(randomUuid)).toBe(true);
  expect(stringUuid).not.toBe(stringUuid2);
  expect(stringUuid2).toBe(unknownStringUuid);
  expect(isValidUuid(arrayUuid)).toBe(true);
  expect(isValidUuid(objectUuid)).toBe(true);
});

test('Unique properties extracted', () => {
  const obj = new testEntity();
  obj.customProperty = 'foo';
  expect(isValidUuid(obj.id)).toBe(true);
});
