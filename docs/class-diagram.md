## High-level overview
This picture glosses over a few details — there are several distinct interfaces (Searchable, Persistable, etc) that mark Graph and Subgraph classes as having certain capabilities, for example. But for a given graph implementation, this is how the interfaces are generally meant to come together.

Not depicted here are the Match, Predicate, and Path classes; they're important for specific operations but don't change the big picture.

```mermaid
classDiagram
direction RL

class Node {
  id: Uuid
  load(string | JSON)
  type: string
  labels: Set~string~
  serialize() string
  toJSON() Dictionary
}

class Edge {
  id: Uuid
  load(string | JSON): void
  source: Uuid
  predicate: string
  target: Uuid
  serialize() string
  toJSON() Dictionary
}

class Graph {
    nodes(Array~Match~) Nodes
    edges(Array~Match~) Edges
    add(Entity | Array~Entity~)
    set(Entity | Array~Entity~)
    remove(Reference | Array~Reference~)
    save() self
    load() self
}

class Edges {
    sources(Array~Match~) Nodes
    targets(Array~Match~) Nodes
    nodes(Array~Match~) Nodes
    has(Reference) boolean
    get(Uuid) Entity
    filter(Array~Match~) Edges
    find(Array~Match~) Edge
    count(Array~Match~) number
}

class Nodes {
    edges(Array~Match~) Edges
    inbound(Array~Match~) Edges
    outbound(Array~Match~) Edges
    has(Reference) boolean
    get(Uuid) Entity
    filter(Array~Match~) Nodes
    find(Array~Match~) Node
    count(Array~Match~) number
}


Edge o-- Edges
Node o-- Nodes

Nodes o-- Graph
Edges o-- Graph
```