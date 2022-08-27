
## Graph abstraction
- [x] Composable interface for graph implementations
- [ ] MVP in-memory/JSON-serialized graph store
- [x] Move SQLite-backed implementation to separate project
- [x] SQL-mappable filter functions

## Entity Management
- [ ] Bucket-brigade property mapping to load from JSON
- [ ] Review constructor/loader and class/class data division of labor
- [ ] Use decorators to capture class metadata, including:
  - Type discriminator
  - Serialization handling
  - Interface extensions to other classes

## Documentation
- [ ] Overview docs 
  - [ ] Entity types
  - [ ] Graph interfaces
  - [ ] Predicate/Match system
  - [ ] Example code
- [ ] JSDoc for public interfaces and classes
- [ ] JSDoc for public methods