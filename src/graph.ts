import * as bsql from 'better-sqlite3';
import { Database, SqliteError } from 'better-sqlite3'
import { SourceMap } from 'module';
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

  constructor(filename:string = ':memory:', customConfig:Partial<bsql.Options> = {}) {
    this.db = bsql(filename, customConfig);
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

  
  getNode(id:string) {

  }
  matchNode(properties:Record<string, any>):Node[] {
    return [];
  }


  getEdge(id:string) {
    
  }
  
  getEdges(source:string, target:string):Edge[]
  getEdges(source:string, predicate:string, target?:string):Edge[] {
    if (source && predicate && target) {
      // load by all
    } else {
      // load just one
    }
    return [];
  }

  getInboundEdges(target:string):Edge[]
  getInboundEdges(target:string, predicate?:string):Edge[]
  getInboundEdges(target:string, predicate?:string, properties?:Record<string, any>):Edge[] {
    if (target && predicate && properties) {

    } else if (target && predicate) {

    } else {

    }
    return [];
  }

  getOutboundEdges(source:string):Edge[]
  getOutboundEdges(source:string, predicate?:string):Edge[]
  getOutboundEdges(source:string, predicate?:string, properties?:Record<string, any>):Edge[] {
    if (source && predicate && properties) {

    } else if (source && predicate) {

    } else {

    }
    return [];
  }

  save(e:Entity):boolean {
    const sql = `INSERT INTO ${e.getTable()} VALUES(json($))`;
    return (this.db.prepare(sql).run(e).changes) ? true : false;
  }

  delete(e:Entity): boolean { 
    const sql = `DELETE FROM ${e.getTable()} WHERE id=?)`;
    return (this.db.prepare(sql).run(e.id).changes) ? true : false;
  }
}