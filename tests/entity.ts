import {Entity} from '../src';
import {validate as isValidUuid} from 'uuid';

test('Generated Uuid is valid', () => {
  const test = Entity.generateId();
  expect(isValidUuid(test)).toBe(true);
});
