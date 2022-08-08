import { validate as isValidUuid, NIL } from 'uuid';
import { Node } from '../src';

const testNode = Node.load({ customProperty: [0, 1, 2, 3] });

class NodeSubclass extends Node {
  readonly type: string = 'node_subclass';
  requiredProperty!: string;
  optionalProperty?: string;
  defaultProperty!: string;

  static new(
    requiredProperty: string,
    optionalProperty?: string,
    defaultProperty = 'Default'
  ): NodeSubclass {
    return new this({
      requiredProperty: requiredProperty,
      optionalProperty: optionalProperty,
      defaultProperty: defaultProperty,
    });
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

test('Default valued properties can be overwritten', () => {
  const n = NodeSubclass.new('prop 1', 'prop 2', 'prop 3');

  expect(n.requiredProperty).toEqual('prop 1');
  expect(n.optionalProperty).toEqual('prop 2');
  expect(n.defaultProperty).toEqual('prop 3');
});

test('Label data roundtripped', () => {
  const n = Node.new();
  n.labels.push('test');
  n.labels.push('second test');

  const j = JSON.stringify(n);

  const n1 = Node.load(j);
  expect(n1.labels.includes('second test')).toBeTruthy();
  expect(n1.labels.length).toEqual(2);
});
