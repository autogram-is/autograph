import {Entity} from '../src';
import {validate as isValidUuid} from 'uuid';

test('Uuid-from-anything works', () => {
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
