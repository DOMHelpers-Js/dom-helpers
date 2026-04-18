[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Advanced Features and API Reference

Beyond the basic collection, there are specialized factories for collections with computed properties, filtered views, and the `toggleAll` extension. This page also contains the complete API reference.

---

## Collections with Computed Properties

### What is it?

`Collections.createWithComputed()` creates a collection that has **computed properties** — values that automatically recalculate whenever the items change.

### Syntax

```javascript
Collections.createWithComputed(items, computedProperties);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `items` | Array | Initial items (default: `[]`) |
| `computedProperties` | Object | Key-value pairs where each value is a function |

### Example

```javascript
const todos = Collections.createWithComputed(
  [
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Walk dog', done: true }
  ],
  {
    doneCount: function() { return this.items.filter(t => t.done).length; },
    remaining: function() { return this.items.filter(t => !t.done).length; },
    allDone: function() { return this.items.every(t => t.done); }
  }
);

console.log(todos.doneCount);  // 1
console.log(todos.remaining);  // 1
console.log(todos.allDone);    // false
```

### How it works

```
Collections.createWithComputed(items, computed)
   ↓
1️⃣ Creates a normal collection with createCollection(items)
   ↓
2️⃣ For each key in computed:
   └── Calls collection.$computed(key, fn)
   ↓
3️⃣ Computed properties are now reactive
   → They recalculate when items change
   ↓
4️⃣ Returns the collection
```

### Practical use

```javascript
const cart = Collections.createWithComputed([], {
  total: function() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  itemCount: function() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  }
});

cart.add({ id: 1, name: 'Widget', price: 9.99, qty: 2 });
cart.add({ id: 2, name: 'Gadget', price: 24.99, qty: 1 });

console.log(cart.total);      // 44.97
console.log(cart.itemCount);  // 3

// Use in effects
ReactiveUtils.effect(() => {
  document.getElementById('cartTotal').textContent = `$${cart.total.toFixed(2)}`;
  document.getElementById('cartItems').textContent = `${cart.itemCount} items`;
});
```

The computed properties recalculate automatically whenever items are added, removed, or changed.

---

## Filtered Collections

### What is it?

`Collections.createFiltered()` creates a **live filtered view** of another collection. Whenever the source collection changes, the filtered view updates automatically.

### Syntax

```javascript
Collections.createFiltered(sourceCollection, filterPredicate);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `sourceCollection` | Collection | The source collection to filter |
| `filterPredicate` | Function | A function that returns `true` for items to include |

### Example

```javascript
const todos = Collections.create([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true },
  { id: 3, text: 'Clean house', done: false }
]);

// Create a filtered view that only shows active (not done) items
const activeTodos = Collections.createFiltered(todos, t => !t.done);

console.log(activeTodos.items);
// [{ id: 1, text: 'Buy milk', done: false }, { id: 3, text: 'Clean house', done: false }]

console.log(activeTodos.length);  // 2
```

### How it works

```
Collections.createFiltered(source, predicate)
   ↓
1️⃣ Creates an empty collection
   ↓
2️⃣ Sets up an effect:
   └── Runs source.items.filter(predicate)
   └── Calls filtered.reset(newItems)
   ↓
3️⃣ The effect re-runs whenever source.items changes
   → The filtered collection stays in sync automatically
   ↓
4️⃣ Returns the filtered collection
```

### Live updating

The filtered view stays in sync with the source:

```javascript
const todos = Collections.create([
  { id: 1, text: 'Task A', done: false },
  { id: 2, text: 'Task B', done: false }
]);

const doneTodos = Collections.createFiltered(todos, t => t.done);
console.log(doneTodos.length);  // 0

// Mark one as done — the filtered view updates automatically
todos.toggle(t => t.id === 1, 'done');
// doneTodos now contains: [{ id: 1, text: 'Task A', done: true }]

// Add a new done item
todos.add({ id: 3, text: 'Task C', done: true });
// doneTodos now contains both done items
```

### Multiple filtered views

You can create multiple views from the same source:

```javascript
const tasks = Collections.create([
  { id: 1, text: 'Task A', priority: 'high', done: false },
  { id: 2, text: 'Task B', priority: 'low', done: true },
  { id: 3, text: 'Task C', priority: 'high', done: true }
]);

const highPriority = Collections.createFiltered(tasks, t => t.priority === 'high');
const completed = Collections.createFiltered(tasks, t => t.done);
const active = Collections.createFiltered(tasks, t => !t.done);

console.log(highPriority.length);  // 2
console.log(completed.length);     // 2
console.log(active.length);        // 1
```

---

## The toggleAll Extension

### What is it?

The `toggleAll` method is added by a second IIFE (Immediately Invoked Function Expression) that extends the collection factory. It toggles a boolean field on **all items** that match a predicate.

### How it gets added

```
Second IIFE loads
   ↓
1️⃣ Stores the original collection factory
   ↓
2️⃣ Creates a new factory that:
   ├── Calls the original factory
   └── Adds .toggleAll() to the result
   ↓
3️⃣ Replaces the factory on all globals:
   ├── ReactiveUtils.collection
   ├── ReactiveUtils.list
   ├── ReactiveUtils.createCollection
   ├── Collections.create
   ├── Collections.collection
   └── Collections.list
```

### Usage

```javascript
const todos = Collections.create([
  { id: 1, text: 'Task A', done: false },
  { id: 2, text: 'Task B', done: false },
  { id: 3, text: 'Task C', done: true }
]);

// Toggle all items that are not done
const count = todos.toggleAll(t => !t.done, 'done');
console.log(count);  // 2

// Toggle ALL items (pass a predicate that matches everything)
const allCount = todos.toggleAll(() => true, 'done');
console.log(allCount);  // 3
```

### Key difference from .toggle()

```
.toggle(predicate, field)
   → Finds the FIRST matching item
   → Toggles its boolean field
   → Returns the collection (chainable)

.toggleAll(predicate, field)
   → Finds ALL matching items
   → Toggles their boolean field
   → Returns the count of toggled items (not chainable)
```

---

## Complete API Reference

### Factory Functions

| Function | Available on | Description |
|----------|-------------|-------------|
| `create(items)` | `Collections` | Create a collection |
| `collection(items)` | `Collections`, `ReactiveUtils` | Alias for `create` |
| `list(items)` | `Collections`, `ReactiveUtils` | Alias for `create` |
| `createCollection(items)` | `ReactiveUtils` | Alias for `create` |
| `createWithComputed(items, computed)` | `Collections` | Collection + computed properties |
| `createFiltered(source, predicate)` | `Collections` | Live filtered view |

### Also available on

```javascript
// Through ReactiveState (if loaded)
ReactiveState.collection(items);
ReactiveState.list(items);
```

### CRUD Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `.add(item)` | item: any | Collection | Add one item |
| `.push(...items)` | items: any[] | Collection | Add one or more items |
| `.remove(predicate)` | predicate: fn or value | Collection | Remove first match |
| `.removeWhere(predicate)` | predicate: fn | Collection | Remove all matches |
| `.update(predicate, updates)` | predicate: fn or value, updates: object | Collection | Update first match |
| `.updateWhere(predicate, updates)` | predicate: fn, updates: object | Collection | Update all matches |
| `.toggle(predicate, field?)` | predicate: fn or value, field: string (default: `'done'`) | Collection | Toggle boolean on first match |
| `.toggleAll(predicate, field?)` | predicate: fn or value, field: string (default: `'done'`) | Number | Toggle boolean on all matches |
| `.clear()` | — | Collection | Remove all items |
| `.reset(newItems?)` | newItems: array (default: `[]`) | Collection | Replace all items |

### Query Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `.find(predicate)` | predicate: fn or value | Item or undefined | Find first match |
| `.filter(predicate)` | predicate: fn | Array | Get all matches |
| `.includes(item)` | item: any | Boolean | Check if item exists (by reference) |
| `.indexOf(item)` | item: any | Number | Get index of item |
| `.at(index)` | index: number | Item | Get item by index |
| `.isEmpty()` | — | Boolean | Check if collection is empty |

### Iteration & Transformation

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `.map(fn)` | fn: function | Array | Transform items into new array |
| `.forEach(fn)` | fn: function | Collection | Iterate over items |
| `.sort(compareFn?)` | compareFn: function | Collection | Sort items in place |
| `.reverse()` | — | Collection | Reverse item order |
| `.slice(start?, end?)` | start: number, end: number | Array | Get a portion as new array |
| `.splice(start, count, ...items)` | start: number, count: number, items: any[] | Collection | Remove/insert at position |
| `.pop()` | — | Item | Remove and return last item |
| `.shift()` | — | Item | Remove and return first item |
| `.unshift(...items)` | items: any[] | Collection | Add items to the beginning |
| `.toArray()` | — | Array | Get a plain array copy |

### Convenience Getters

| Getter | Returns | Description |
|--------|---------|-------------|
| `.length` | Number | Number of items |
| `.first` | Item or undefined | First item |
| `.last` | Item or undefined | Last item |

### Inherited Instance Methods

Since collections are built on reactive state, they also inherit all reactive instance methods:

| Method | Description |
|--------|-------------|
| `.$computed(key, fn)` | Add a computed property |
| `.$watch(key, callback)` | Watch a property for changes |
| `.$batch(fn)` | Batch multiple changes |
| `.$update(updates)` | Update multiple properties |
| `.$set(key, value)` | Set a property |
| `.$bind(el, bindings)` | Bind to a DOM element |
| `.$notify(key)` | Manually trigger effects for a key |
| `.$raw` | Access the raw (unproxied) data |

---

## Load Order

```html
<!-- 1. DOMHelpers Core (optional) -->
<script src="01_dh-elements.js"></script>
<script src="02_dh-collections.js"></script>
<script src="03_dh-selector.js"></script>

<!-- 2. Reactive State (required) -->
<script src="04_reactive/01_dh-reactive.js"></script>

<!-- 3. Array Patch (required — collections rely on patched arrays) -->
<script src="04_reactive/02_dh-reactive-array-patch.js"></script>

<!-- 4. Collections (must come after reactive state and array patch) -->
<script src="04_reactive/03_dh-reactive-collections.js"></script>
```

**Order matters:**
1. `01_dh-reactive.js` provides `ReactiveUtils.state()`
2. `02_dh-reactive-array-patch.js` patches array methods to trigger effects
3. `03_dh-reactive-collections.js` uses both to create reactive collections

---

## Module Structure

The collections file contains two IIFEs:

```
IIFE 1 — Main Collections Extension
├── createCollection(items)
├── createCollectionWithComputed(items, computed)
├── createFilteredCollection(collection, predicate)
└── Exports to Collections, ReactiveUtils, ReactiveState

IIFE 2 — toggleAll Extension
├── Wraps the original collection factory
├── Adds .toggleAll() method to every new collection
└── Replaces factory on all globals
```

---

## Common Questions

### Can I use reactive instance methods on a collection?

Yes. Collections are reactive state objects, so all instance methods work:

```javascript
const todos = Collections.create([]);

// Add a computed property
todos.$computed('doneCount', function() {
  return this.items.filter(t => t.done).length;
});

// Watch for changes
todos.$watch('items', (newItems, oldItems) => {
  console.log('Items changed:', newItems.length);
});

// Batch changes
todos.$batch(() => {
  todos.add({ id: 1, text: 'Task A', done: false });
  todos.add({ id: 2, text: 'Task B', done: false });
  todos.add({ id: 3, text: 'Task C', done: false });
});
// Only one effect re-run for all three adds
```

### Can I nest collections?

Collections are designed for flat lists. For nested data, use reactive state directly:

```javascript
// ✅ Flat list — use a collection
const todos = Collections.create([
  { id: 1, text: 'Task', done: false }
]);

// ✅ Nested or complex state — use reactive state
const app = ReactiveUtils.state({
  user: { name: 'Alice' },
  settings: { theme: 'dark' },
  todos: []
});
```

### What's the difference between .items and .toArray()?

```javascript
const list = Collections.create([1, 2, 3]);

list.items;      // The reactive array (tracked by the proxy)
list.toArray();  // A plain copy (modifying it won't affect the collection)
```

Use `.items` when you need reactivity (inside effects). Use `.toArray()` when you need a snapshot to pass elsewhere.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **createCollection** | Factory that creates a reactive state with `.items` and 25+ methods |
| **createWithComputed** | Collection + computed properties that auto-recalculate |
| **createFiltered** | Live filtered view that stays in sync with the source |
| **toggleAll** | Extension that toggles boolean fields on all matching items |
| **Chainable** | Most methods return `this` for fluent APIs |
| **Predicates** | Accept a value (exact match) or function (conditional match) |
| **Reactive** | All mutations trigger effects automatically |
| **Inherited** | Collections have all reactive instance methods ($computed, $watch, etc.) |

---

## Congratulations!

You've completed the Reactive Collections learning path. You now understand:

- ✅ What reactive collections are and why they exist
- ✅ How to create and use collections with the basic API
- ✅ Every CRUD, query, iteration, and convenience method in detail
- ✅ Real-world patterns for todos, carts, chats, and more
- ✅ Advanced features: computed properties, filtered views, and toggleAll
- ✅ The complete API reference and load order

**Your reactive collections are ready for production!**