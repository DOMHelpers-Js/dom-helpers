[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

## Module 03: Collections Extension (`03_dh-reactive-collections.js`)

### Collections Extension Namespace

- **`Collections.create(items)`** - Create collection with extended methods
- **`Collections.createWithComputed(items, computed)`** - Create collection with computed properties
- **`Collections.createFiltered(collection, predicate)`** - Create filtered view that syncs with source
- **`Collections.collection(items)`** - Alias for create
- **`Collections.list(items)`** - Alias for create

### Basic Operations

When using `Collections.create()`, `Collections.collection()`, or `Collections.list()`:

- **`add(item)`** - Add item to collection (returns this for chaining)
- **`remove(predicate)`** - Remove item by predicate or value (returns this)
- **`update(predicate, updates)`** - Update item by predicate or value (returns this)
- **`clear()`** - Clear all items (returns this)

### Search & Filter

- **`find(predicate)`** - Find item in collection
- **`filter(predicate)`** - Filter items and return new array
- **`map(fn)`** - Map over items and return new array
- **`forEach(fn)`** - Iterate over items (returns this)

### Sorting & Ordering

- **`sort(compareFn)`** - Sort items in place (returns this)
- **`reverse()`** - Reverse items in place (returns this)

### Getters

- **`length`** - Get collection length (getter property)
- **`first`** - Get first item (getter property)
- **`last`** - Get last item (getter property)

### Array Methods

- **`at(index)`** - Get item at index
- **`includes(item)`** - Check if includes item
- **`indexOf(item)`** - Get index of item
- **`slice(start, end)`** - Get slice of items
- **`splice(start, deleteCount, ...items)`** - Splice items (returns this)
- **`push(...items)`** - Push items to end (returns this)
- **`pop()`** - Pop item from end
- **`shift()`** - Shift item from start
- **`unshift(...items)`** - Unshift items to start (returns this)

### Advanced Operations

- **`toggle(predicate, field)`** - Toggle boolean field on single item (returns this)
- **`toggleAll(predicate, field)`** - Toggle boolean field on all matching items (returns count)
- **`removeWhere(predicate)`** - Remove all matching items (returns this)
- **`updateWhere(predicate, updates)`** - Update all matching items (returns this)
- **`reset(newItems)`** - Reset collection with new items (returns this)
- **`toArray()`** - Convert to plain array
- **`isEmpty()`** - Check if empty

---