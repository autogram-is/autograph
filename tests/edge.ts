import test from 'ava';
import { Node } from '../source/entity/node.js';
import { Edge } from '../source/entity/edge.js';
import { Entity, Reference } from '../source/entity/index.js';

class IsTestedWith extends Edge {
  type = 'is_tested_with';

  constructor(source: Reference, target: Reference) {
    super(source, 'is_tested_with', target);
  }
}

test('id collision', (t) => {
  const n1 = new Node('test', ['random label']);
  const n2 = new Node('test', ['different label']);
  const e1 = new Edge(n1, 'knows_of', n2);
  const e2 = new Edge(n1, 'knows_of', n2);
  const e3 = new Edge(n2, 'knows_of', n1);

  t.is(e1.id, e2.id);
  t.not(e1.id, e3.id);
});

test('serialization', (t) => {
  const n1 = new Node('test', ['random label']);
  const n2 = new Node('test', ['different label']);
  const e1 = new Edge(n1, 'knows_of', n2);

  const e2 = Edge.load(e1.serialize());
  t.deepEqual(e1, e2);
  t.is(e2.properties()['id'], e2.id);
});
