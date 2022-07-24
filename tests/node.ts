import {validate as isValidUuid, NIL} from 'uuid';
import {Node} from '../src';

const testNode = new Node({customProperty: [0, 1, 2, 3]});

test('Nodes receive an id', () => {
  const idNode = new Node();
  expect(idNode.id === NIL).toBe(false);
  expect(isValidUuid(idNode.id)).toBe(true);
});

test('Nodes constructed with arbitrary properties', () => {
  expect(testNode).toHaveProperty('customProperty');
  expect(Array.isArray(testNode.customProperty)).toBe(true);
});

test('Node serialization preserves id, properties', () => {
  const json = JSON.stringify(testNode);
  const testNode2 = JSON.parse(json);

  expect(testNode.id).toBe(testNode2.id);
  expect(testNode).toMatchObject(testNode2);
});
