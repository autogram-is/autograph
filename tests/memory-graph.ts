import * as fs from 'node:fs';
import test from 'ava';
import { Node, Edge } from '../source/entity/index.js';
import { MemoryGraph } from '../source/graph/memory-graph.js';

const g = new MemoryGraph();

test('graph population', (t) => {
  const nodeCount = 10;
  const edgeCount = 20;

  for (let i = 1; i < nodeCount; i++) {
    const n = new Node();
    n.customProperty = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .slice(0, 5);
    g.set(n);
  }

  const nodes = [...g.nodes.values()];
  for (let i = 1; i < edgeCount; i++) {
    const edge = new Edge(
      nodes[Math.floor(Math.random() * nodes.length)],
      'knows_of',
      nodes[Math.floor(Math.random() * nodes.length)],
    );
    g.set(edge);
  }

  t.assert(g.nodes.size > 0);
  t.assert(g.edges.size > 0);
});
