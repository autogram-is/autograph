import { JsonGraph, Entity, Node, Edge } from '../../source/index.js';

const nodeCount = 20;
const edgeCount = 100;

function rand<T = Entity>(list: T[]): T {
  return list[Math.floor(Math.random()*list.length)] as T
}

const nodes: Node[] = [];
for (let i = 0; i < nodeCount; i++) {
  const n = new Node();
  n.order = i;
  nodes.push(n);
}

const edges: Edge[] = [];
for (let i = 0; i < edgeCount; i++) {
  const edge = new Edge(rand<Node>(nodes), 'links_to', rand<Node>(nodes));
  edges.push(edge);
}

const jg = new JsonGraph().set([...nodes, ...edges]);
