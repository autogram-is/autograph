import { JsonGraph } from '../../source/json-graph/index.js';
import { Scion, Parent } from './scion.js';
import { where } from '../../source/index.js';

(async () => {
  const testFile = new URL('hapsburgs.ndjson', import.meta.url);
  const json = new JsonGraph();
  await json.load(testFile);

  const kidsOfEmperors = json
    .nodes(where('title', 'equals', 'Holy Roman Emperor'))
    .outbound(where('predicate', 'equals', 'is_parent_of'))
    .targets();

  for (let kid of kidsOfEmperors) {
    if (kid instanceof Scion) {
      console.log(`${kid.name}, ${kid.title} (${kid.birth}–${kid.death})`);
    }
  }
  console.log();
})()
