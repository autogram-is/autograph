import is from '@sindresorhus/is';
import {
  Edge,
  isEdge,
  Entity,
  Node,
  isNode,
  Reference,
  Uuid,
} from '../index.js';
import { Mutable, Persistable, Readable } from './interfaces.js';

export class JsonNodes {
  protected nodes = new Map<string, Node>();
}
