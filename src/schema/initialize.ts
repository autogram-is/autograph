export const REPOSITORY_SCHEMA:string = `

CREATE TABLE IF NOT EXISTS edge (
    id         TEXT GENERATED ALWAYS AS (json_extract(body, '$.id')) VIRTUAL NOT NULL UNIQUE
    source     TEXT GENERATED ALWAYS AS (json_extract(properties, '$.source')) VIRTUAL NOT NULL
    predicate  TEXT GENERATED ALWAYS AS (json_extract(properties, '$.predicate')) VIRTUAL NOT NULL
    target     TEXT GENERATED ALWAYS AS (json_extract(properties, '$.target')) VIRTUAL NOT NULL
    properties TEXT,
    UNIQUE(id) ON CONFLICT REPLACE,
    FOREIGN KEY(source) REFERENCES node(id),
    FOREIGN KEY(target) REFERENCES node(id)
);

CREATE TABLE IF NOT EXISTS node (
    id   TEXT GENERATED ALWAYS AS (json_extract(body, '$.id')) VIRTUAL NOT NULL UNIQUE
    type TEXT GENERATED ALWAYS AS (json_extract(body, '$.type')) VIRTUAL NOT NULL
    body TEXT,
    UNIQUE(id) ON CONFLICT REPLACE,
);

CREATE INDEX IF NOT EXISTS id_idx ON node(id);
CREATE INDEX IF NOT EXISTS id_idx ON node(type);

CREATE INDEX IF NOT EXISTS source_idx ON edge(source);
CREATE INDEX IF NOT EXISTS edge_idx ON node(predicate);
CREATE INDEX IF NOT EXISTS target_idx ON edge(target);

`;