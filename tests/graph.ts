import { Node, Edge, Graph } from '../src';

let g: Graph;

test('Graph initializes schema', () => {
  g = new Graph({ filename: ':memory:' });
  expect(g.db.prepare('SELECT id from node').pluck().get()).toBe(undefined);
});

test('Nodes and edges persist', () => {
  const n1 = new Node();
  const n2 = new Node();
  const e = Edge.connect(n1, 'knows', n2.id);

  g.save([n1, n2, e]);

  expect(g.db.prepare('SELECT COUNT(1) FROM node').pluck().get()).toBe(2);
  expect(g.db.prepare('SELECT COUNT(1) FROM edge').pluck().get()).toBe(1);

  const n1Loaded = g.getNodeById(n1.id) ?? {};
  expect(n1).toMatchObject(n1Loaded);
});

test('Node count works', () => {
  const n1 = Node.new();
  g.save(n1);
  expect(g.nodeExists(n1.id)).toBe(true);
});

test('Deletes work', () => {
  const n1 = Node.new();
  const n2 = Node.new();
  const e = Edge.connect(n1, 'knows', n2);

  g.save([n1, n2, e]);

  expect(g.nodeExists(n1.id)).toEqual(true);
  expect(g.nodeExists(n2.id)).toEqual(true);
  expect(g.edgeExists(n1.id, n2.id)).toEqual(true);

  expect(g.delete(n1)).toEqual(2);

  expect(g.nodeExists(n1.id)).toEqual(false);
  expect(g.nodeExists(n2.id)).toEqual(true);
  expect(g.edgeExists(n1.id, n2.id)).toEqual(false);
});
