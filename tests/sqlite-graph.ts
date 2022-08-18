import test from 'ava';
import { SqliteGraph } from '../source/graph/index.js';

test('graph instantiation works', (t) => {
  const g = new SqliteGraph();
  t.notThrows(async () => g.load());
});
