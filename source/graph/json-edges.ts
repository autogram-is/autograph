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

export class JsonEdges {
  protected edges = new Map<string, Edge>();
}
