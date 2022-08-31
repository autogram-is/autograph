import { JsonGraph } from '../../source/json-graph/index.js';
import { where } from '../../source/index.js';
import { Scion, Parent } from './scion.js';

(async () => {
  const testFile = new URL('hapsburgs.ndjson', import.meta.url);
  const json = new JsonGraph();
  await json.load(testFile);

  const kidsOfEmperors = json
    .nodes(where('title', { eq: 'Holy Roman Emperor' }))
    .outbound(where('predicate', { eq: 'is_parent_of' }))
    .targets();

  for (const kid of kidsOfEmperors) {
    if (kid instanceof Scion) {
      console.log(
        `${kid.name}, ${kid.title ?? ''} (${kid.birth ?? 0}-${kid.death ?? 0})`,
      );
    }
  }

  console.log();
})();
