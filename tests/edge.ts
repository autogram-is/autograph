import {Edge} from '../src';

test('Edge ID is properly unique', () => {
  const edge1 = new Edge('id1', 'knows', 'id2');
  const edge2 = new Edge('id1', 'knows', 'id2');
  const edge3 = new Edge('id1', 'knows', 'id3');

  expect(edge1.id).toBe(edge2.id);
  expect(edge1.id).not.toBe(edge3.id);
});
