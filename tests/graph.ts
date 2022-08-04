import { Node, Edge, Graph } from '../src';

let g: Graph;

test('Graph initializes schema', () => {
  g = new Graph({ filename: ':memory:' });
  expect(g.db.prepare('SELECT id from node').pluck().get()).toBe(undefined);
});

test('Nodes and edges persist', () => {
  const n1 = Node.New();
  const n2 = Node.New();
  const e = Edge.New(n1.id, 'knows', n2.id);

  g.save([n1, n2, e]);

  expect(g.db.prepare('SELECT COUNT(1) FROM node').pluck().get()).toBe(2);
  expect(g.db.prepare('SELECT COUNT(1) FROM edge').pluck().get()).toBe(1);

  const n1Loaded = g.getNode(n1.id) ?? {};
  expect(n1).toMatchObject(n1Loaded);
  console.log(n1.getTable());
});

test('Node count works', () => {
  const n1 = Node.New();
  g.save(n1);
  expect(g.nodeExists(n1.id)).toBe(true);
});
