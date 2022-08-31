import test from 'ava';
import { UuidFactory, Node, Predicate, where } from '../source/index.js';

test('basic evaluation', (t) => {
  const predicates = new Map<Predicate, boolean>();
  const testEntity = new Node('dummy', ['label1', 'label2']);
  testEntity.deep = { property: true };

  predicates.set(new Predicate('id', { eq: UuidFactory.nil }), false);

  for (const [predicate, result] of predicates) {
    t.is(predicate.match(testEntity), result);
  }
});
