import { Entity, Dictionary } from './entity.js';
import { Transform, Type, hydrate, ClassConstructor } from './index.js';

/**
 * Description placeholder
 *
 * @export
 * @class Node
 * @typedef {Node}
 * @extends {Entity}
 */
export class Node extends Entity {
  /**
   * Registry of types for Node subclasses; keyed by the string a given class stores in its `type` property; the value is a reference to its Constructor.
   *
   * @static
   * @readonly
   * @type {*}
   */
  static readonly types = new Map<string, ClassConstructor<any>>();

  /**
   * Given a string or simple object, instantiate a true instance of a given Node type. Uses the `type` property on the object to determine what subclass should be used, if any.
   *
   * @static
   * @template T A subclass of Node
   * @param {(string | Dictionary)} data JSON-serialized string or a simple object
   * @returns {InstanceType<T>} A populated instance of the Node subclass
   */
  static load<T extends typeof Node = typeof this>(
    this: T,
    data: string | Dictionary,
  ): InstanceType<T> {
    const object = (
      typeof data === 'string' ? JSON.parse(data) : data
    ) as Dictionary;

    if ('id' in object && 'type' in object) {
      const ctor = Node.types.get(object.type as string) ?? Node;
      return hydrate(
        ctor,
        object,
        Entity.getSerializerOptions(),
      ) as InstanceType<T>;
    }

    throw new TypeError('Node requires type and id');
  }

  /**
   * Convenience labels used to organize and group Nodes
   *
   * @type {Set<string>}
   */
  @Type(() => String)
  @Transform(({ value }) => new Set(value), { toClassOnly: true })
  @Transform(({ value }) => [...(value as Set<string>)], { toPlainOnly: true })
  labels: Set<string> = new Set<string>();

  /**
   * Identifies the node's primary meaning in the graph; Node subclasses hard-code this value, but it can vary for generic nodes.
   *
   * @type {string}
   */
  type: string;

  constructor(...args: unknown[]);
  /**
   * Creates an instance of Node.
   *
   * @constructor
   * @param {string} [type='node']
   * @param {string[]} [labels=[]]
   */
  constructor(type = 'node', labels: string[] = []) {
    super();
    this.type = type;
    this.labels = new Set<string>(labels);
    this.assignId();
  }
}
