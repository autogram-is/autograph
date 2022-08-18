import { v4 as uuidv4, v5 as uuidv5, NIL as NilUuid, validate } from 'uuid';
import hash from 'object-hash';
import {
  Uuid,
  Reference,
  Dictionary,
  dehydrate,
  ClassTransformOptions,
  TargetMap,
} from './index.js';

export abstract class Entity {
  [propName: string]: unknown;

  static emptyId: Uuid = NilUuid;
  static namespace: Uuid = '9fc3e7e5-59d7-4d55-afa0-98a978f49bab';

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

  static idFromReference(r: Reference): Uuid {
    return typeof r === 'string' ? r : r.id;
  }

  static checkId(id: Uuid): boolean {
    return validate(id);
  }

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

  serialize(): string {
    return JSON.stringify(dehydrate(this, Entity.getSerializerOptions()));
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON(): Dictionary {
    return dehydrate(this, Entity.getSerializerOptions());
  }

  protected getIdSeed(): unknown {
    return null;
  }

  protected assignId(): void {
    this.id = Entity.generateId(this.getIdSeed());
  }
}
