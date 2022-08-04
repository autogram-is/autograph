import { Node, Edge } from '../src';

test('Edge ID is unique and well-formed', () => {
  const n1 = Node.New();
  const n2 = Node.New();
  const n3 = Node.New();

  const edge = Edge.New(n1.id, 'knows', n2.id);
  const edgeEquivalent = Edge.New(n1.id, 'knows', n2.id);
  const edgeInverse = Edge.New(n2.id, 'knows', n1.id);
  const edgeSimilar = Edge.New(n2.id, 'knows', n3.id);

  expect(edge.id).toBe(edgeEquivalent.id);
  expect(edge.id).not.toBe(edgeInverse.id);
  expect(edge.id).not.toBe(edgeSimilar.id);
});
