import { validate as isValidUuid, NIL } from 'uuid';
import { Node } from '../src';

const testNode = new Node({ customProperty: [0, 1, 2, 3] });

test('Nodes receive an id', () => {
  const idNode = new Node();
  expect(idNode.id).not.toBe(NIL);
  expect(isValidUuid(idNode.id)).toBe(true);
});

test('Nodes constructed with arbitrary properties', () => {
  expect(testNode).toHaveProperty('customProperty');
  expect(Array.isArray(testNode.customProperty)).toBe(true);
});

test('Node serialization preserves id, structure', () => {
  const json = JSON.stringify(testNode);
  const testNode2 = JSON.parse(json);
  const json2 = JSON.stringify(testNode2);

  expect(testNode.id).toBe(testNode2.id);
  expect(json).toBe(json2);
});

test('Deserialization preserves object identity', () => {
  const n = new Node();
  expect(n.getTable).toBeDefined();

  const json = JSON.stringify(n);
  const fromJson = JSON.parse(json) as Node;
  expect(fromJson.getTable).toBeUndefined();
});
