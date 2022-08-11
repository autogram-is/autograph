
## Improvements to existing components
- [ ] Generalized traversal functions for edges
- [ ] Improved load/create mechanics

## Potential refactoring
- [ ] Use the Graph instantiation phase to centralize loading/initializing Entity types and Views
- [ ] Expose Entity and View specific factories and helper functions via the Graph instance
- [ ] Use decorators to standardize metadata like classname/tablename mapping, etc.

## Potential features
- [ ] Automatic creation/modification timestamps on every entity
- [ ] Soft deletion managed by the Graph instance
- [ ] Integrate an existing Cypher parser as an optional node/edge creation mechanism