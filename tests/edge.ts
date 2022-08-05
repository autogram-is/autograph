import { Node, Edge, Uuid } from '../src';

class EdgeSubclass extends Edge {
  readonly predicate = 'edge_subclass';

  requiredProperty!: string;
  optionalProperty?: string;

  static New(source: Uuid, target: Uuid, requiredProperty: string) {
    return new this({
      source: source,
      predicate: 'edge_subclass',
      target: target,
      requiredProperty: requiredProperty,
    });
  }

  protected override get uniqueValues(): unknown {
    return [this.requiredProperty];
  }
}

test('Edge ID is unique and well-formed', () => {
  const n1 = new Node();
  const n2 = new Node();
  const n3 = new Node();

  const edge = Edge.connect(n1, 'knows', n2);
  const edgeEquivalent = Edge.connect(n1, 'knows', n2);
  const edgeInverse = Edge.connect(n2, 'knows', n1);
  const edgeSimilar = Edge.connect(n2, 'knows', n3);

  expect(edge.id).toBe(edgeEquivalent.id);
  expect(edge.id).not.toBe(edgeInverse.id);
  expect(edge.id).not.toBe(edgeSimilar.id);
});

test('Edge subclass roundtrips', () => {
  const n1 = Node.new();
  const n2 = Node.new();
  const edge = EdgeSubclass.New(n1.id, n2.id, 'Additional data');
  expect(edge.requiredProperty).toBeDefined();

  const json = JSON.stringify(edge);
  const edge2 = EdgeSubclass.load(json);

  expect(edge).toMatchObject(edge2);
});

test('Edge mixins work', () => {
  const n1 = new Node();
  const n2 = Node.new();
  expect(n1.defineEdge('test', n2)).toBeDefined();
});
