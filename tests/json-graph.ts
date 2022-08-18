import * as fs from 'node:fs';
import test from 'ava';
import { Node } from '../source/entity/node.js';
import { Edge } from '../source/entity/edge.js';
import { JsonGraph } from '../source/graph/json-graph.js';

const testFile = 'test.json';

test.after('clean up', (t) => {
  fs.rm(testFile, (error) => {
    if (error) throw error;
  });
});

const g = new JsonGraph({ filename: testFile });

test('graph population', async (t) => {
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

test('loading file data', (t) => {
  g.nodes.clear();
  g.edges.clear();
  t.assert(g.nodes.size === 0);
  t.assert(g.edges.size === 0);

  g.load();
  
  t.assert(g.nodes.size > 0);
  t.assert(g.edges.size > 0);
});
