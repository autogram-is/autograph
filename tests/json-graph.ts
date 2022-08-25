import test from 'ava';
import { Node, Edge } from '../source/index.js';
import { JsonGraph } from '../source/json-graph.js';

const j = new JsonGraph();

test('graph population', (t) => {
  const nodeCount = 100;
  const edgeCount = 400;

  for (let i = 1; i < nodeCount; i++) {
    const n = new Node();
    n.customProperty = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .slice(0, 5);
    j.set(n);
  }

  const nodes = [...j.nodes.values()];
  for (let i = 1; i < edgeCount; i++) {
    const edge = new Edge(
      nodes[Math.floor(Math.random() * nodes.length)],
      'knows_of',
      nodes[Math.floor(Math.random() * nodes.length)],
    );
    j.set(edge);
  }

  t.assert(j.nodes.size > 0);
  t.assert(j.edges.size > 0);
});

test('criteria matching', (t) => {
  const nodeCount = 10;
  const edgeCount = 20;

  for (let i = 1; i < nodeCount; i++) {
    const n = new Node();
    n.customProperty = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .slice(0, 5);
    j.set(n);
  }

  const nodes = [...j.nodes.values()];
  for (let i = 1; i < edgeCount; i++) {
    const edge = new Edge(
      nodes[Math.floor(Math.random() * nodes.length)],
      'knows_of',
      nodes[Math.floor(Math.random() * nodes.length)],
    );
    j.set(edge);
  }

  const nid = nodes[0].id;
  const edges = j.matchEdges({ sourceOrTarget: nid });
  t.truthy(edges);
});
