import test from 'ava';
import { UuidFactory, Node, Predicate, where } from '../source/index.js';

function dummyNode(): Node {
  const n = new Node('dummy', ['label1', 'label2']);
  n.deep = { property: true };
  return n;
}

test('basic equality', (t) => {
  const p = new Predicate('id', { eq: UuidFactory.nil });
  t.is(p.match(dummyNode()), false);
});

test('property in value', (t) => {
  const p = new Predicate('type', { in: ['node', 'dummy'] });
  t.is(p.match(dummyNode()), true);
});

test('value in property', (t) => {
  const p = new Predicate('labels', { has: 'label1' });
  t.is(p.match(dummyNode()), true);
});
