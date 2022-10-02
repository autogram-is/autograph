import test from 'ava';
import { Reference, Node, Edge } from '../source/entities/index.js';

class IsTestedWith extends Edge {
  type = 'is_tested_with';

  getIdSeed(): unknown {
    return {
      source: this.source,
      predicate: this.predicate,
      target: this.target,
    };
  }

  constructor(source: Reference<Node>, target: Reference<Node>) {
    super(source, 'is_tested_with', target);
  }
}

test('id collision', (t) => {
  const n1 = new Node('test', ['random label']);
  const n2 = new Node('test', ['different label']);
  const ed1 = new IsTestedWith(n1, n2);
  const ed2 = new IsTestedWith(n1, n2);
  const ed3 = new IsTestedWith(n2, n1);

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
