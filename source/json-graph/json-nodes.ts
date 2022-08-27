import { Node } from '../index.js';
import { NodeSet } from '../graph/interfaces.js';
import { Match, MatchMaker } from '../graph/match.js';
import { where } from '../graph/predicate.js';
import { JsonEntities } from './json-entities.js';
import { JsonEdges } from './json-edges.js';

export class JsonNodes extends JsonEntities<Node> implements NodeSet {
  filter(...criteria: Array<Match<Node>>): JsonNodes {
    const m = new MatchMaker<Node>(criteria);
    const results = [...this.internalMap.values()].filter((input) =>
      m.match(input),
    );
    return new JsonNodes(this.graph, results);
  }

  edges(...criteria: Array<Match<Node>>): JsonEdges {
    return new JsonEdges(this.graph, [
      ...this.incoming(...criteria),
      ...this.outgoing(...criteria),
    ]);
  }

  outgoing(...criteria: Array<Match<Node>>): JsonEdges {
    return this.graph.edges(where('source', 'in', this.ids()));
  }

  incoming(...criteria: Array<Match<Node>>): JsonEdges {
    return this.graph.edges(where('target', 'in', this.ids()));
  }

  siblings(...criteria: Array<Match<Node>>): JsonNodes {
    throw new Error('Method not implemented.');
  }
}
