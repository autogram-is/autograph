import is from "@sindresorhus/is";
import { Edge, isEdge, Entity, Node, isNode } from "..";
import { EdgeLike, GraphData, NodeLike, GraphMutable } from "./interface";
import { Match } from "./match.js";
import { MatchMaker } from "./match";

export class Graph implements GraphData<Entity> {
  protected nodeMap = new Map<string, Node>();
  protected edgeMap = new Map<string, Edge>();

  add(input: Entity | Entity[]): GraphData<Entity> {
    if (!is.array(input)) input = [input];

    for (let entity of input) {
      if (isNode(entity)) {
        if (!this.nodeMap.has(entity.id)) this.nodeMap.set(entity.id, entity);
      } else if (isEdge(entity)) {
        if (!this.edgeMap.has(entity.id)) this.edgeMap.set(entity.id, entity);
      }
    }
    return this;
  }

  remove(input: Entity | Entity[]): GraphData<Entity> {
    if (!is.array(input)) input = [input];

    for (let entity of input) {
      if (isNode(entity)) {
        this.nodeMap.delete(entity.id);
      } else {
        this.edgeMap.delete(entity.id);
      }
    }
    return this;
  }

  set(input: Entity | Entity[]): GraphData<Entity> {
    if (!is.array(input)) input = [input];

    for (let entity of input) {
      if (isNode(entity)) {
        this.nodeMap.set(entity.id, entity);
      } else if (isEdge(entity)) {
        this.edgeMap.set(entity.id, entity);
      }
    }
    return this;
  }

  get(input: string): Entity | undefined {
     return this.nodeMap.get(input) ?? this.edgeMap.get(input);
  }

  find(...criteria: Match<Entity>[]): Entity | undefined {
    const filter = new MatchMaker<Entity>(criteria);
    throw new Error("Method not implemented.");
  }

  has(...criteria: Match<Entity>[]): true {
    const filter = new MatchMaker<Entity>(criteria);
    throw new Error("Method not implemented.");
  }

  count(...criteria: Match<Entity>[]): number {
    const filter = new MatchMaker<Entity>(criteria);
    throw new Error("Method not implemented.");
  }
}

