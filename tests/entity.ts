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

test('Uuids generated from any propertie', () => {
  const randomUuid = Entity.generateId();
  expect(isValidUuid(randomUuid)).toBe(true);

  const stringUuid = Entity.generateId('test string');
  expect(isValidUuid(randomUuid)).toBe(true);

  const stringUuid2 = Entity.generateId('test string 2');
  expect(stringUuid === stringUuid2).toBe(false);

  const unknownStringUuid = Entity.generateId('test string 2' as unknown);
  expect(stringUuid2 === unknownStringUuid).toBe(true);

  const arrayUuid = Entity.generateId([1, 2]);
  expect(isValidUuid(arrayUuid)).toBe(true);

  const objectUuid = Entity.generateId({property: 'test', property2: 2});
  expect(isValidUuid(objectUuid)).toBe(true);
});

test('Unique properties extracted', () => {
  const obj = new testEntity();
  obj.customProperty = 'foo';
  expect(isValidUuid(obj.id)).toBe(true);
});
