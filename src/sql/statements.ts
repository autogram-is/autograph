export const Statements = {
  selectNodes: 'SELECT data FROM node ',
  countNodes: 'SELECT COUNT(id) as ids FROM node ',
  saveNode: 'INSERT INTO node VALUES(json(@)) ',
  deleteNodes: 'DELETE FROM node ',

  selectEdges: 'SELECT data FROM edge ',
  countEdges: 'SELECT COUNT(id) as ids FROM edge ',
  saveEdge: 'INSERT INTO edge VALUES(json(@)) ',
  deleteEdges: 'DELETE FROM edge ',

  schema: `
      CREATE TABLE IF NOT EXISTS node (
        id   TEXT GENERATED ALWAYS AS (json_extract(data, '$.id')) VIRTUAL NOT NULL UNIQUE,
        type TEXT GENERATED ALWAYS AS (json_extract(data, '$.type')) VIRTUAL NOT NULL,
        labels JSON GENERATED ALWAYS AS (json_extract(data, '$.labels')) VIRTUAL NOT NULL,
        data JSON,
        UNIQUE(id) ON CONFLICT REPLACE
      );
    
      CREATE INDEX IF NOT EXISTS id_idx ON node(id);
      CREATE INDEX IF NOT EXISTS id_idx ON node(type);

      CREATE TABLE IF NOT EXISTS edge (
        id         TEXT GENERATED ALWAYS AS (json_extract(data, '$.id')) VIRTUAL NOT NULL UNIQUE,
        source     TEXT GENERATED ALWAYS AS (json_extract(data, '$.source')) VIRTUAL NOT NULL,
        predicate  TEXT GENERATED ALWAYS AS (json_extract(data, '$.predicate')) VIRTUAL NOT NULL,
        target     TEXT GENERATED ALWAYS AS (json_extract(data, '$.target')) VIRTUAL NOT NULL,
        data JSON,
        UNIQUE(id) ON CONFLICT REPLACE,
        FOREIGN KEY(source) REFERENCES node(id),
        FOREIGN KEY(target) REFERENCES node(id)
      );
      
      CREATE INDEX IF NOT EXISTS source_idx ON edge(source);
      CREATE INDEX IF NOT EXISTS edge_idx ON edge(predicate);
      CREATE INDEX IF NOT EXISTS target_idx ON edge(target);
    `,
};
