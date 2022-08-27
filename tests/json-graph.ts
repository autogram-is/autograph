import test from 'ava';
import { JsonGraph } from '../source/graph/json-graph.js';
import { Entity, Node, Edge } from '../source/index.js';

function randomItem<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

test('populate', (t) => {
  const na: Node[] = [];
  for (let i = 0; i < 10; i++) {
    na.push(new Node());
  }

  const ea: Edge[] = [];
  for (let i = 0; i < 50; i++) {
    ea.push(new Edge(randomItem<Node>(na), 'knows', randomItem<Node>(na)));
  }

  t.assert(ea.length === 50);

  const j = new JsonGraph();
  const newEntities: Entity[] = [...na, ...ea];
  j.add(newEntities);
  t.is(j.nodeMap.size, na.length);
  t.assert(j.edgeMap.size > 0);
});
