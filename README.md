# Autograph

TLDR: Strongly typed but schema-light JSON documents in a [directed multigraph with distinct edge identities](https://en.wikipedia.org/wiki/Multigraph#Directed_multigraph_(edges_with_own_identity).

It's a very specific niche, but you might try Autograph if you need to:

1. Store lots of evolving data about a medium number of nodes (1K-100K of JSON per 500-50K nodes)
2. Store many metadata-rich relationships (1-5k of JSON per 5K-5M edges)
3. Switch up storage as your needs evolve (use serialized JSON files, then SQLite, then Couch or Redis, etc.)

## Adding population

```
import { Node, Edge, JsonGraph as Graph } from '@autogram/autograph';

const n1 = new Node();
n1.someData = Api.getData(value1);

const n2 = new Node();
n2.random = Math.random();
n2.otherData = AnotherApi.getData(value1);

const e = new Edge(n1, 'links_to', n2);

const g = new Graph()
  .add([n1, n2, e])
  .save('my_graph.json');
```

## Simple traversal
```
const g = new Graph().load('my_graph.json');
const livingSiblings = g
  .nodes(['type', 'equals', 'person'])
  .siblings(['predicate', 'equals', 'is_child_of'])
  .match(['deathDate', 'undefined'])
  .map((n: Node) => console.log(n.firstName));
```