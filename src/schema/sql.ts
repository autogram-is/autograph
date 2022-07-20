export const UnusedSql = {
  deleteNodeEdges: `DELETE FROM edge WHERE source = ? OR target = ?`,
  searchEdgeInbound: `SELECT * FROM edge WHERE source = ?`,
  searchEdgeOutbound: `SELECT * FROM edge WHERE target = ?`,
  searchEdge: `
    SELECT * FROM edge WHERE source = ? 
    UNION
    SELECT * FROM edge WHERE target = ?`,
  searchNodeById: `SELECT body FROM node WHERE id = ?`,
  searchNode: `SELECT body FROM node WHERE `,
  traverseInbound: `
    WITH RECURSIVE traverse(id, p) AS (
      SELECT :source
      UNION
      SELECT source FROM edge JOIN traverse ON target = id AND predicate = p
    ) SELECT id FROM traverse;
  `,
  traverseOutbound: `
    WITH RECURSIVE traverse(id, p) AS (
      SELECT :source
      UNION
      SELECT target FROM edge JOIN traverse ON source = id AND predicate = p
    ) SELECT id FROM traverse;    
  `,
  traverseWithBodiesInbound: `
    WITH RECURSIVE traverse(x, y, obj) AS (
      SELECT :source, '()', '{}'
      UNION
      SELECT id, '()', body FROM node JOIN traverse ON id = x
      UNION
      SELECT source, '<-', properties FROM edge JOIN traverse ON target = x
    ) SELECT x, y, obj FROM traverse;
  `,
  traverseWithBodiesOutbound: `
    WITH RECURSIVE traverse(x, y, obj) AS (
      SELECT :source, '()', '{}'
      UNION
      SELECT id, '()', body FROM node JOIN traverse ON id = x
      UNION
      SELECT target, '->', properties FROM edge JOIN traverse ON source = x
    ) SELECT x, y, obj FROM traverse;    
  `,
  traverseWithBodies: `
    WITH RECURSIVE traverse(x, y, obj) AS (
      SELECT :source, '()', '{}'
      UNION
      SELECT id, '()', body FROM node JOIN traverse ON id = x
      UNION
      SELECT source, '<-', properties FROM edge JOIN traverse ON target = x
      UNION
      SELECT target, '->', properties FROM edge JOIN traverse ON source = x
    ) SELECT x, y, obj FROM traverse;    
  `,
  traverse: `
    WITH RECURSIVE traverse(id) AS (
      SELECT :source
      UNION
      SELECT source FROM edge JOIN traverse ON target = id
      UNION
      SELECT target FROM edge JOIN traverse ON source = id
    ) SELECT id FROM traverse;
  `
}

