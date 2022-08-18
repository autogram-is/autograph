import test from 'ava';
import { Transform, Type } from 'class-transformer';
import { Node } from '../source/entity/node.js';
import { Dictionary, Entity } from '../source/entity/index.js';
import { EntitySet } from '../source/entity/entity-set.js';

class CustomNode extends Node {
  /* eslint-disable new-cap */
  @Type(() => URL)
  @Transform(({ value }) => new URL(value), { toClassOnly: true })
  @Transform(({ value }) => (value as URL).href, { toPlainOnly: true })
  url: URL;
  /* eslint-enable new-cap */

  type = 'custom';

  constructor(
    url: URL,
    public defaultProperty: number,
    public optionalProperty?: string,
    labels: string[] = [],
  ) {
    super();
    this.url = url;
    this.assignId();
  }

  override getIdSeed(): unknown {
    return [this.url];
  }
}
Node.types.set('custom', CustomNode);

test('object creation', (t) => {
  const n = new Node('test', ['random label']);
  t.not(n.id, Entity.emptyId);
  t.assert(n.labels.size === 1);
  t.assert(n.labels.has('random label'));
});

test('automatic serialization', (t) => {
  const n = new Node('test', ['random label']);
  n.property = 'Test property';
  const json = n.serialize();
  const nn = Node.load(json);
  t.assert(nn.property === 'Test property');
  t.assert(nn.labels instanceof Set);
});

test('explicit subclass deserialization', (t) => {
  const n = new CustomNode(new URL('https://test.com'), 5);
  const nn = CustomNode.load(n.serialize());
  t.is(n.url.hostname, nn.url.hostname);
});

test('unique ids', (t) => {
  const n1 = new Node();
  const n2 = new Node();
  t.not(n1.id, n2.id);
});

test('custom class id generation', (t) => {
  const n1 = new CustomNode(new URL('http://test.com'), 1);
  const n2 = new CustomNode(new URL('http://test.com'), 2);
  const n3 = new CustomNode(new URL('http://subsite.test.com'), 3);

  t.is(n1.id, n2.id);
  t.not(n1.id, n3.id);
});

test('mixed subclass deserialization', (t) => {
  const n1 = new CustomNode(new URL('http://test.com'), 1);
  const n2 = new Node('example');
  n2.arbitrary = [1, 2, 3];

  const a = new EntitySet<Node>([n1, n2]);
  const json = JSON.stringify([...a].map((n) => n.serialize()));
  const b: Node[] = (JSON.parse(json) as Dictionary[]).map((n) => Node.load(n));

  t.assert((b[0] as CustomNode).url.href !== undefined);
  t.assert(Array.isArray(b[1].arbitrary));
});
