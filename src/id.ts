import { TextEncoder } from 'util';
import { v4 as uuidv4} from 'uuid';
import { stringify as bytesToUuid } from 'uuid';
import * as hash from 'object-hash'

export function getId(hashValue?:any): string {
  if (hashValue) {
    const sha1 = hash(hashValue);
    const byteArr = new TextEncoder().encode(sha1);
    return bytesToUuid(byteArr);
  } else {
    return uuidv4();
  }
}

export type Uuid = string;