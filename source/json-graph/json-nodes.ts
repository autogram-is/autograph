import { NodeSet, EdgeSet } from '../graph/interfaces.js';
import { Node } from '../entities/index.js';
import { Match, MatchMaker } from '../graph/match.js';
import { where } from '../graph/predicate.js';
import { JsonEntities } from './json-entities.js';
import { JsonEdges } from './json-edges.js';

export class JsonNodes extends JsonEntities<Node> implements NodeSet {
  filter(...criteria: Array<Match<Node>>): NodeSet {
    const m = new MatchMaker<Node>(criteria);
    const results = [...this.internalMap.values()].filter((input) =>
      m.match(input),
    );
    return new JsonNodes(this.graph, results);
  }

  edges(...criteria: Array<Match<Node>>): EdgeSet {
    return new JsonEdges(this.graph, [
      ...this.inbound(...criteria),
      ...this.outbound(...criteria),
    ]);
  }

  outbound(...criteria: Array<Match<Node>>): EdgeSet {
    return this.graph.edges(where('source', { in: this.ids() }));
  }

  inbound(...criteria: Array<Match<Node>>): EdgeSet {
    return this.graph.edges(where('target', { in: this.ids() }));
  }
}
