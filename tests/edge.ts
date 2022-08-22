import test from 'ava';
import { Node } from '../source/node.js';
import { Edge } from '../source/edge.js';
import { Entity, Reference } from '../source/index.js';

class IsTestedWith extends Edge {
  type = 'is_tested_with';

  constructor(source: Reference<Node>, target: Reference<Node>) {
    super(source, 'is_tested_with', target);
  }
}

test('id collision', (t) => {
  const n1 = new Node('test', ['random label']);
  const n2 = new Node('test', ['different label']);
  const ed1 = new Edge(n1, 'knows_of', n2);
  const ed2 = new Edge(n1, 'knows_of', n2);
  const ed3 = new Edge(n2, 'knows_of', n1);

  t.is(ed1.id, ed2.id);
  t.not(ed1.id, ed3.id);
});

test('serialization', (t) => {
  const n1 = new Node('test', ['random label']);
  const n2 = new Node('test', ['different label']);
  const ed1 = new Edge(n1.id, 'knows_of', n2.id);

  const ed2 = Edge.load(ed1.serialize());
  t.deepEqual(ed1, ed2);
  t.is(ed2.properties().id, ed2.id);
});
