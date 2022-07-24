import {Node, Edge, Graph} from '../src';

let g:Graph;

test('Graph initializes schema', () => {
  g = new Graph();
  expect(g.db.prepare('SELECT * from node').pluck().get()).toBe(undefined);
});

test('Nodes and edges persist', () => {
  const n1 = new Node();
  const n2 = new Node();
  const e = new Edge(n1.id, 'knows', n2.id);

  g.save([n1, n2, e]);

  expect(g.db.prepare('SELECT COUNT(1) FROM node').pluck().get()).toBe(2);
  expect(g.db.prepare('SELECT COUNT(1) FROM edge').pluck().get()).toBe(1);
 
  const n1Loaded = g.getNode(n1.id) as Node;
  expect(n1).toMatchObject(n1Loaded);
});
