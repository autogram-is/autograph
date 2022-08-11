# Node-Simple-Graph

Inspired by David Leadbeater's [SQLite as a document database](https://dgl.cx/2020/06/sqlite-json-support) post and [Denis Papathanasiou's Python library](https://github.com/dpapathanasiou/simple-graph). `node-simple-graph` uses an extremely simple nodes-and-edges storage model. Nodes store data, edges connect nodes, and both can store arbitrary information in random properties property. It's the "Bag of stuff" data model.

## The highlights:

- Minimum Viable ORM: CRUD operations and finding/matching with minimal schema fussing.
- `Node` and `Edge` classes that can be inherited to provide type definitions, enforce defaults, and add helper functions 
  - `type` and `predicate` properties for nodes and edges to make mapping complex domains easier
  - Per-type/per-predicate uniqueness functions that control object Uuid generation
- A `Graph` class that centralizes CRUD and graph traversal, with optional raw access to the underlying Sqlite db
- `View` classes that wrap Sqlite view definitions and expose strongly-typed subsets of the graph

It's very much a work in progress, but it's already useful for small to medium-sized data sets. In addition, while this project is designed to store _graphlike_ data, SQLite lacks support for actual an graph query language and other common conveniences in genuine graph databases. Think of this as a building block for _graph-like pools of documents_, not a replacement for Neo4j.
