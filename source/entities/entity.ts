/* eslint-disable import/no-unassigned-import */
import 'reflect-metadata';
import { v4 as uuidv4, v5 as uuidv5, NIL as NilUuid, validate } from 'uuid';
import hash from 'object-hash';
import {
  instanceToPlain as dehydrate,
  ClassTransformOptions,
  TargetMap,
} from 'class-transformer';
import { getProperty, setProperty, hasProperty, deepKeys } from 'dot-prop';
import { JsonObject } from 'type-fest';
import { Dictionary } from '../index.js';

interface Flavoring<FlavorT> { _type?: FlavorT; }
type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;
export type Uuid = Flavor<string, 'uuid'>;

export type Reference<T extends Entity = Entity> = T | Uuid;

export {
  plainToInstance as hydrate,
  instanceToPlain as dehydrate,
  Type,
  Transform,
  ClassConstructor,
  ClassTransformOptions,
  TargetMap,
} from 'class-transformer';

/**
 * Description placeholder
 *
 * @export
 * @typedef {EntityFilter}
 * @template T extends Entity = Entity
 */
export type EntityFilter<T extends Entity = Entity> = (input: T) => boolean;

/**
 * Base class for all graph entities; handles ID generation, universal property access, and wraps serialization functions.
 *
 * @export
 * @abstract
 * @class Entity
 * @typedef {Entity}
 */
export abstract class Entity {
  [propName: string]: unknown;

  /**
   * The Nil Uuid; usually indicates an error if it appears in real data.
   *
   * @static
   * @type {Uuid}
   */
  static emptyId: Uuid = NilUuid;
  /**
   * Unique namespace for Autograph-generated Uuids.
   *
   * @static
   * @type {Uuid}
   */
  static namespace: Uuid = '9fc3e7e5-59d7-4d55-afa0-98a978f49bab';

  /**
   * Default options for the entity serializer.
   *
   * @static
   * @returns {*}
   */
  static getSerializerOptions() {
    const result: ClassTransformOptions = {
      strategy: 'exposeAll',
      excludeExtraneousValues: false,
      excludePrefixes: ['_'],
      targetMaps: [] as TargetMap[],
      enableImplicitConversion: true,
      exposeDefaultValues: true,
      exposeUnsetFields: true,
    };

    return result;
  }

  /**
   * Takes an ID-bearing entity or a Uuid and returns a Uuid.
   *
   * @static
   * @param {Reference} r
   * @returns {Uuid}
   */
  static idFromReference(r: Reference): Uuid {
    return r instanceof Entity ? r.id : r;
  }

  /**
   * Validates Uuid integrity.
   *
   * @static
   * @param {Uuid} id
   * @returns {boolean}
   */
  static checkId(id: Uuid): boolean {
    return validate(id);
  }

  /**
   * Given an input value, generates a Uuid that serves as a hash for the object. If no input is given, generates a random Uuid.
   *
   * @static
   * @param {?unknown} [hashValue]
   * @returns {Uuid}
   */
  static generateId(hashValue?: unknown): Uuid {
    if (hashValue) {
      if (typeof hashValue !== 'object') {
        hashValue = { data: hashValue };
      }

      const hashOutput = hash(hashValue as Dictionary, {
        encoding: 'buffer',
      });
      return uuidv5(hashOutput, Entity.namespace);
    }

    return uuidv4();
  }

  id: Uuid = Entity.emptyId;

  /**
   * Checks whether the property at the given path exists.
   *
   * @param {string} path Path of the property in the object, using `.` to separate each nested key.
   * @returns {boolean}
   */
  has(path: string): boolean {
    return hasProperty(this, path);
  }

  /**
   * Get the value of the property at the given path.
   *
   * @param {string} path Path of the property in the object, using `.` to separate each nested key.
   * @returns {unknown}
   */
  get(path: string): unknown {
    return getProperty(this, path);
  }

  /**
   * Set the value of the property at the given path.
   *
   * @param {string} path Path of the property in the object, using `.` to separate each nested key.
   * @param {unknown} value
   * @returns {this}
   */
  set(path: string, value: unknown): this {
    return setProperty(this, path, value);
  }

  /**
   * Returns an array of every property-path on the object.
   *
   * @returns {string[]}
   */
  keys(): string[] {
    return deepKeys(this);
  }

  /**
   * Returns a flat Dictionary of all properties on the object, keyed by property-path.
   *
   * @returns {Dictionary}
   */
  properties(): Dictionary {
    const props: Dictionary = {};
    for (const k of this.keys()) {
      props[k] = this.get(k);
    }

    return props;
  }

  /**
   * Returns a JSON-serialized copy of the object, using custom rules to ensure complex object data is preserved.
   *
   * @returns {string}
   */
  serialize(): string {
    return JSON.stringify(dehydrate(this, Entity.getSerializerOptions()));
  }

  /**
   * Returns a nested Dictionary of the object's properties, suitable for serialization.
   *
   * @returns {Dictionary}
   */
  /* eslint-disable @typescript-eslint/naming-convention */
  toJSON(): JsonObject {
    return dehydrate(this, Entity.getSerializerOptions());
  }
  /* eslint-enable @typescript-eslint/naming-convention */

  /**
   * Returns the unique values that should be used to generate the object's ID. If null, a random Uuid will be generated.
   *
   * @protected
   * @returns {unknown}
   */
  protected getIdSeed(): unknown {
    return null;
  }

  /**
   * Triggers the creation of a fresh Uuid and overwrites the object's existing ID.
   *
   * @protected
   */
  protected assignId(): void {
    this.id = Entity.generateId(this.getIdSeed());
  }
}

export function isEntity(input: unknown): input is Entity {
  return input instanceof Entity;
}
