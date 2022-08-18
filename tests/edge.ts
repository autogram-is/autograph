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

test('edge id collision', (t) => {
  const n = new Node('test', ['random label']);
  t.not(n.id, Entity.emptyId);
  t.assert(n.labels.size === 1);
  t.assert(n.labels.has('random label'));
});
