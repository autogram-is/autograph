import {Where} from '../src/sql/where-builder';

test('simple where clause works', () => {
  const sql = Where().equals('myColumn', 20);
  expect(sql.toString()).toBe(' myColumn = 20');
});
