import { validate as isValidUuid, NIL } from 'uuid';
import { Node, JsonObject } from '../src';

const testNode = Node.Load({ customProperty: [0, 1, 2, 3] });

class TestNodeType extends Node {
  readonly type: string = 'test_node';
  requiredProperty!: string;
  optionalProperty?: string;

  static New(requiredProperty: string) {
    return new this({ requiredProperty: requiredProperty });
  }

  static Load(data: JsonObject | string): TestNodeType {
    return new this(data);
  }

  protected override get uniqueValues(): unknown {
    return [this.requiredProperty];
  }
}

test('Nodes receive an id', () => {
  const idNode = Node.New();
  expect(idNode.id).not.toBe(NIL);
  expect(isValidUuid(idNode.id)).toBe(true);
});

test('Nodes constructed with arbitrary properties', () => {
  expect(testNode).toHaveProperty('customProperty');
  expect(Array.isArray(testNode.customProperty)).toBe(true);
});

test('Node serialization preserves id, structure', () => {
  const json = JSON.stringify(testNode);
  const testNode2 = Node.Load(json);
  const json2 = JSON.stringify(testNode2);

  expect(testNode.id).toBe(testNode2.id);
  expect(json).toBe(json2);
});

test('Deserialization preserves object identity', () => {
  const n = Node.New();
  expect(n.getTable).toBeDefined();

  const json = JSON.stringify(n);
  const fromJson = Node.Load(json);
  expect(fromJson.getTable).toBeDefined();
});
