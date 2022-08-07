import { Where } from '../src/sql';

test('simple where clause works', () => {
  const sql = Where().equals('myColumn', 20);
  expect(sql.toString()).toBe(' myColumn = 20');
});

test('JSON array contains', () => {
  const sql = Where().contains('$.labels', 'test');
  const expected =
    " (SELECT COUNT(1) FROM json_each(data, '$.labels') WHERE json_each.value = test) > 0";
  expect(sql.toString()).toEqual(expected);
});
