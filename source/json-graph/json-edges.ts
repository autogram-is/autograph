import { Edge, Uuid } from '../index.js';
import { EdgeSet, NodeSet } from '../graph/interfaces.js';
import { Match, MatchMaker } from '../graph/match.js';
import { where } from '../graph/predicate.js';
import { JsonEntities } from './json-entities.js';
import { JsonNodes } from './json-nodes.js';

export class JsonEdges extends JsonEntities<Edge> implements EdgeSet {
  filter(...criteria: Array<Match<Edge>>): EdgeSet {
    const m = new MatchMaker<Edge>(criteria);
    const results = [...this.internalMap.values()].filter((input) =>
      m.match(input),
    );
    return new JsonEdges(this.graph, results);
  }

  nodes(...criteria: Array<Match<Edge>>): NodeSet {
    return new JsonNodes(this.graph, [
      ...this.sources(...criteria),
      ...this.targets(...criteria),
    ]);
  }

  sources(...criteria: Array<Match<Edge>>): NodeSet {
    const sourceIds = new Set<Uuid>();
    for (const edge of this.internalMap.values()) {
      sourceIds.add(edge.source);
    }

    return this.graph.nodes(where('id', { in: [...sourceIds.values()] }));
  }

  targets(...criteria: Array<Match<Edge>>): NodeSet {
    const targetIds = new Set<Uuid>();
    for (const edge of this.internalMap.values()) {
      targetIds.add(edge.target);
    }

    return this.graph.nodes(where('id', { in: [...targetIds.values()] }));
  }
}
