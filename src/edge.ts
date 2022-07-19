import { Entity, isEntity, EntityReference, uuidFromReference } from './entity'

export class Edge extends Entity {
  constructor(readonly source:EntityReference, readonly predicate:string, readonly target:EntityReference) {
    super();
    super.generateId();
  }

  protected uniqueValues() {
    return [this.source, this.predicate, this.target];
  }
}

export const isEdge = (e:any):boolean => {
  return (isEntity(e) && 'predicate' in e && typeof(e.type) === 'string');
}