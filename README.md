# Simple Graph for Node

Inspired by David Leadbeater's [SQLite as a document database](https://dgl.cx/2020/06/sqlite-json-support) post and [Denis Papathanasiou's Python library](https://github.com/dpapathanasiou/simple-graph). `simple-graph` uses an extremely simple nodes-and-edges storage model; both nodes and edges support a simple 'body' property where a JSON version of each entity is stored.

This project adds a few conveniences:

* Optional `created` and `modified` timestamp fields on each entity
* Optional soft delete in place of hard SQL DELETEs
* Optional `type` column for each entity to keep that metadata out of the JSON `body` column. 
* Typescript interfaces and base classes that leverage the 'type' column

It's very much a work in progress; in addition, while it supports storage of _graphlike_ data, SQLite lacks support for graph query languages and other conveniences from more advances systems.
