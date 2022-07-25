export const Entify = (query: string, table: string): string => {
  return query.replace('$TABLE', table);
};
export const Statements = {
  select: 'SELECT data FROM $TABLE WHERE ',
  count: 'SELECT COUNT(id) as ids FROM $TABLE ',
  save: `INSERT INTO $TABLE (data)
    VALUES(json(?))
    ON CONFLICT(id) DO UPDATE SET data=data;
  `,
  deleteEntity: 'DELETE FROM $TABLE WHERE ',
  softDeleteEntity: 'UPDATE $TABLE SET (deleted = 1) WHERE ',

  schemaInfo: `
    SELECT 'node.' || node.name AS column FROM pragma_table_info('node') node
    UNION
    SELECT 'edge.' || edge.name AS column FROM pragma_table_info('edge') edge
  `,
  schemaTables: `
    CREATE TABLE IF NOT EXISTS node (
      id   TEXT GENERATED ALWAYS AS (json_extract(data, '$.id')) VIRTUAL NOT NULL,
      type TEXT GENERATED ALWAYS AS (json_extract(data, '$.type')) VIRTUAL NOT NULL,
      labels JSON GENERATED ALWAYS AS (json_extract(data, '$.labels')) VIRTUAL NOT NULL,
      data JSON,
      UNIQUE(id)
    );

    CREATE TABLE IF NOT EXISTS edge (
      id         TEXT GENERATED ALWAYS AS (json_extract(data, '$.id')) VIRTUAL NOT NULL,
      source     TEXT GENERATED ALWAYS AS (json_extract(data, '$.source')) VIRTUAL NOT NULL,
      predicate  TEXT GENERATED ALWAYS AS (json_extract(data, '$.predicate')) VIRTUAL NOT NULL,
      target     TEXT GENERATED ALWAYS AS (json_extract(data, '$.target')) VIRTUAL NOT NULL,
      data JSON,
      UNIQUE(id),
      FOREIGN KEY(source) REFERENCES node(id),
      FOREIGN KEY(target) REFERENCES node(id)
    );
      
  `,
  schemaIndexes: `
    CREATE INDEX IF NOT EXISTS id_idx ON node(id);
    CREATE INDEX IF NOT EXISTS id_idx ON node(type);

    CREATE INDEX IF NOT EXISTS source_idx ON edge(source);
    CREATE INDEX IF NOT EXISTS edge_idx ON edge(predicate);
    CREATE INDEX IF NOT EXISTS target_idx ON edge(target);
  `,
  schemaSoftDelete: `
    ALTER TABLE node ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE edge ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0;
  `,
  schemaTimeStamp: `
    ALTER TABLE node ADD COLUMN created TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE edge ADD COLUMN created TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  `,
};
