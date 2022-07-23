import * as DatabaseConstructor from "better-sqlite3";
import { Database, Statement, Transaction, RunResult, SqliteError } from "better-sqlite3";
import { Entity, Node, Edge } from '.'

export enum Operator {
  '<',
  '<=',
  '=',
  '!=',
  '=>',
  '>',
  'BETWEEN',
  'LIKE',
  'IN',
  'IS NULL',
  'IS NOT NULL'
}

export class Graph {
  readonly db:Database;

  constructor(filename:string = ':memory:', customConfig:Partial<DatabaseConstructor.Options> = {}) {
    this.db = DatabaseConstructor(filename, customConfig);
  }

  private createTables() {
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS node (
            id   TEXT GENERATED ALWAYS AS (json_extract(data, '$.id')) VIRTUAL NOT NULL UNIQUE
            type TEXT GENERATED ALWAYS AS (json_extract(data, '$.type')) VIRTUAL NOT NULL
            labels JSON GENERATED ALWAYS AS (json_extract(data, '$.labels')) VIRTUAL NOT NULL,
            data JSON,
            UNIQUE(id) ON CONFLICT REPLACE,
        );
        
        CREATE INDEX IF NOT EXISTS id_idx ON node(id);
        CREATE INDEX IF NOT EXISTS id_idx ON node(type);
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS edge (
        id         TEXT GENERATED ALWAYS AS (json_extract(data, '$.id')) VIRTUAL NOT NULL UNIQUE
        source     TEXT GENERATED ALWAYS AS (json_extract(data, '$.source')) VIRTUAL NOT NULL
        predicate  TEXT GENERATED ALWAYS AS (json_extract(data, '$.predicate')) VIRTUAL NOT NULL
        target     TEXT GENERATED ALWAYS AS (json_extract(data, '$.target')) VIRTUAL NOT NULL
        data JSON,
        UNIQUE(id) ON CONFLICT REPLACE,
        FOREIGN KEY(source) REFERENCES node(id),
        FOREIGN KEY(target) REFERENCES node(id)
      );
      
      CREATE INDEX IF NOT EXISTS source_idx ON edge(source);
      CREATE INDEX IF NOT EXISTS edge_idx ON node(predicate);
      CREATE INDEX IF NOT EXISTS target_idx ON edge(target);
    `);
  }

  getNode(id:string):Node {
    const sql = `SELECT data FROM node WHERE id='?'`;
    const resultString = this.db.prepare(sql).pluck().get(id) as string;
    return JSON.parse(resultString) as Node;
  }
  matchNodes(properties:Record<string, any>):Node[] {
    return [];
  }

  getEdge(id:string) {
    const sql = `SELECT data FROM edge WHERE id='?'`;
    const resultString = this.db.prepare(sql).pluck().get(id) as string;
    return JSON.parse(resultString) as Edge;
  }
  
  getEdges(source:string, target:string):Edge[]
  getEdges(source:string, predicate:string, target?:string):Edge[] {
    let sql:string = `SELECT data FROM edge WHERE `;
    if (source && predicate && target) {
      sql += `source='?' AND predicate='?' AND target='?'`;
    } else {
      sql += `source='?' AND target='?'`;
    }
    return this.db.prepare(sql).all(arguments).map(r => JSON.parse(r.data) as Edge)
  }

  getInboundEdges(target:string, predicate?:string, properties?:Record<string, any>):Edge[] {
    let sql:string = `SELECT data FROM edge WHERE `;
    if (target && predicate && properties) {
      sql += `target='?' AND predicate='?'`;
    } else if (target && predicate) {
      sql += `target='?' AND predicate='?'`;
    } else {
      sql += `target='?'`;
    }
    return this.db.prepare(sql).all(arguments).map(r => JSON.parse(r.data) as Edge)
  }

  getOutboundEdges(source:string, predicate?:string, properties?:Record<string, any>):Edge[] {
    let sql:string = `SELECT data FROM edge WHERE `;
    if (source && predicate && properties) {
      sql += `source='?' AND predicate='?'`;
    } else if (source && predicate) {
      sql += `source='?' AND predicate='?'`;
    } else {
      sql += `source='?'`;
    }
    return this.db.prepare(sql).all(arguments).map(r => JSON.parse(r.data) as Edge)
  }

  save(e:Entity):boolean {
    const sql = `INSERT INTO ${e.getTable()} VALUES(json(?))`;
    return (this.db.prepare(sql).run(e.serialize()).changes) ? true : false;
  }

  delete(e:Entity): boolean { 
    const sql = `DELETE FROM ${e.getTable()} WHERE id='?')`;
    return (this.db.prepare(sql).run(e.id).changes) ? true : false;
  }
}