import fs from 'node:fs';
import { URL } from 'node:url';
import test from 'ava';
import { JsonGraph } from '../source/json-graph/index.js';
import { Node, Edge, isNode } from '../source/index.js';

const testFile = new URL('fixtures/test.ndjson', import.meta.url);
let j: JsonGraph;

function randomItem<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

test.before('set up graph', (t) => {
  j = new JsonGraph();
});

test.serial('populate', (t) => {
  const na: Node[] = [];
  for (let i = 0; i < 10; i++) {
    na.push(new Node());
  }

  const ea: Edge[] = [];
  for (let i = 0; i < 50; i++) {
    ea.push(new Edge(randomItem<Node>(na), 'knows', randomItem<Node>(na)));
  }

  j.add([...na, ...ea]);
  t.assert(ea.length === 50);
  t.is(j.nodeMap.size, na.length);
  t.assert(j.edgeMap.size > 0);
});

test.serial('persist', async (t) => {
  await j.save(testFile);
  t.assert(fs.statSync(testFile) !== undefined);
});

test.serial('reload', async (t) => {
  const j2 = new JsonGraph();
  await j2.load(testFile);

  t.assert(j2.nodeMap.size > 0);
  t.assert(j2.edgeMap.size > 0);
  const n = [...j2.nodeMap.values()][0];
  t.assert(isNode(n));
});

test.serial('reload, clone, and merge', async (t) => {
  const initialCount = j.nodeMap.size;

  const j2 = new JsonGraph();
  await j2.load(testFile);
  j2.add(new Node());

  j.add([...j2.nodeMap.values()]);
  await j.save();

  t.is(initialCount + 1, j.nodeMap.size);
});
