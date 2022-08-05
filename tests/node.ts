import { validate as isValidUuid, NIL } from 'uuid';
import { Node } from '../src';

const testNode = Node.load({ customProperty: [0, 1, 2, 3] });

class NodeSubclass extends Node {
  readonly type: string = 'node_subclass';
  requiredProperty!: string;
  optionalProperty?: string;

  static new(requiredProperty: string): NodeSubclass {
    return new this({ requiredProperty: requiredProperty });
  }

  protected override get uniqueValues(): unknown {
    return [this.requiredProperty];
  }
}

test('Nodes receive an id', () => {
  const idNode = Node.new();
  expect(idNode.id).not.toBe(NIL);
  expect(isValidUuid(idNode.id)).toBe(true);
});

test('Nodes constructed with arbitrary properties', () => {
  expect(testNode).toHaveProperty('customProperty');
  expect(Array.isArray(testNode.customProperty)).toBe(true);
});

test('Node serialization preserves id, structure', () => {
  const json = JSON.stringify(testNode);
  const testNode2 = Node.load(json);
  const json2 = JSON.stringify(testNode2);

  expect(testNode.id).toBe(testNode2.id);
  expect(json).toBe(json2);
});

test('Deserialization preserves object identity', () => {
  const n = Node.new();
  expect(n.getTable).toBeDefined();

  const json = JSON.stringify(n);
  const fromJson = Node.load(json);
  expect(fromJson.getTable).toBeDefined();
});

test('Node subclass works', () => {
  const n = NodeSubclass.new('Test message');
  expect(n.requiredProperty).toBeDefined();
});
