import { Entity, isEntity, EntityReference, uuidFromReference } from './entity'

export class Node extends Entity {
  constructor(readonly type:string='node') {
    super();
    this.type = type;
    this.generateId();
  }
}

export const isNode = (e:any):boolean => {
  return (isEntity(e) && 'type' in e && typeof(e.type) === 'string');
}