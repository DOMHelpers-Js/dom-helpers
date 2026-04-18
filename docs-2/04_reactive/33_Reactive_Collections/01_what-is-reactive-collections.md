[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive Collections

## What is it?

`Collections.create()` (or `ReactiveUtils.collection()`) creates a **reactive list** — a reactive state object with a built-in `.items` array and a rich set of methods for managing that array.

Instead of writing your own add/remove/update/find logic every time you work with a list, collections give you ready-made, chainable methods that all work reactively out of the box.

Think of it as a reactive array with **superpowers** — it knows how to add, remove, update, toggle, filter, sort, and clear items, all while keeping your effects and UI in sync.

---

## Why does this exist?

### The situation: managing lists manually

When you work with arrays in reactive state, you end up writing the same patterns again and again:

```javascript
const app = ReactiveUtils.state({ items: [] });

// Add an item
app.items.push({ id: 1, text: 'Buy milk', done: false });

// Remove an item by predicate
const idx = app.items.findIndex(i => i.id === 1);
if (idx !== -1) app.items.splice(idx, 1);

// Update an item
const item = app.items.find(i => i.id === 2);
if (item) Object.assign(item, { done: true });

// Toggle a boolean field
const target = app.items.find(i => i.id === 3);
if (target) target.done = !target.done;

// Clear all
app.items.length = 0;
```

Every list in your app needs the same boilerplate — find the index, check if it exists, splice or assign.

### With Reactive Collections

```javascript
const todos = Collections.create([
  { id: 1, text: 'Buy milk', done: false }
]);

// Add
todos.add({ id: 2, text: 'Clean house', done: false });

// Remove
todos.remove(i => i.id === 1);

// Update
todos.update(i => i.id === 2, { done: true });

// Toggle
todos.toggle(i => i.id === 2, 'done');

// Clear
todos.clear();
```

**What changed?**
- ✅ No manual index lookups
- ✅ No `findIndex` + `splice` boilerplate
- ✅ Chainable methods — `todos.add(item1).add(item2).sort(fn)`
- ✅ All operations are reactive — effects re-run automatically
- ✅ Consistent API for every list in your app

---

## Mental model: The smart notebook

Think of a reactive collection like a **smart notebook** with a table of contents built in.

```
Plain array (regular notebook):
├── You write items on pages
├── To find something, flip through every page
├── To remove something, erase and shift pages manually
├── To sort, rewrite everything in order
└── No one knows when you made changes

Reactive collection (smart notebook):
├── You say "add this" — it writes it on the next page
├── You say "find the one where..." — it jumps to the right page
├── You say "remove where..." — it removes and reorganizes automatically
├── You say "sort by..." — it rearranges all pages
└── Everyone watching the notebook is notified of every change
```

---

## The big picture

A reactive collection wraps a reactive state object with these layers:

```
Layer 1: Data
└── .items         → The reactive array holding your data

Layer 2: CRUD Methods (Create, Read, Update, Delete)
├── .add(item)          → Add one item
├── .push(...items)     → Add multiple items
├── .remove(predicate)  → Remove by value or predicate
├── .removeWhere(fn)    → Remove all matching items
├── .update(pred, data) → Update one matching item
├── .updateWhere(fn, data) → Update all matching items
├── .toggle(pred, field)   → Toggle a boolean field
├── .toggleAll(pred, field) → Toggle matching items
├── .clear()            → Remove all items
└── .reset(newItems)    → Replace all items

Layer 3: Query Methods
├── .find(predicate)    → Find one item
├── .filter(predicate)  → Get matching items
├── .includes(item)     → Check if item exists
├── .indexOf(item)      → Get index of item
├── .at(index)          → Get item by index
├── .isEmpty()          → Check if empty

Layer 4: Iteration & Transformation
├── .map(fn)            → Transform items
├── .forEach(fn)        → Iterate items
├── .sort(compareFn)    → Sort items
├── .reverse()          → Reverse order
├── .slice(start, end)  → Get a portion
├── .splice(start, n, ...items) → Insert/remove at position
└── .toArray()          → Get a plain array copy

Layer 5: Convenience Getters
├── .length             → Number of items
├── .first              → First item
└── .last               → Last item
```

---

## The basic syntax

### Creating a collection

```javascript
// Empty collection
const todos = Collections.create();

// With initial items
const todos = Collections.create([
  { id: 1, text: 'Learn DOMHelpers', done: false },
  { id: 2, text: 'Build an app', done: false }
]);
```

### Also available through

```javascript
// All of these do the same thing
Collections.create(items);
Collections.collection(items);
Collections.list(items);
ReactiveUtils.collection(items);
ReactiveUtils.list(items);
ReactiveUtils.createCollection(items);
```

### Reading data

```javascript
console.log(todos.items);       // The array
console.log(todos.length);      // Number of items
console.log(todos.first);       // First item
console.log(todos.last);        // Last item
console.log(todos.isEmpty());   // true or false
```

### Modifying data

```javascript
todos.add({ id: 3, text: 'Deploy', done: false });
todos.remove(i => i.id === 2);
todos.update(i => i.id === 1, { done: true });
todos.clear();
```

### Chaining

Most methods return `this`, so you can chain:

```javascript
todos
  .add({ id: 1, text: 'First', done: false })
  .add({ id: 2, text: 'Second', done: false })
  .sort((a, b) => a.text.localeCompare(b.text))
  .forEach(item => console.log(item.text));
```

---

## With effects

Collections are fully reactive. Effects that read `.items`, `.length`, `.first`, or `.last` will re-run when the collection changes:

```javascript
const todos = Collections.create();

ReactiveUtils.effect(() => {
  console.log(`${todos.length} todos`);
});
// Output: "0 todos"

todos.add({ text: 'Buy milk' });
// Output: "1 todos"

todos.add({ text: 'Clean house' });
// Output: "2 todos"

todos.clear();
// Output: "0 todos"
```

---

## Integration

The Collections API is available through multiple access points:

```javascript
// Through Collections global
Collections.create([]);

// Through ReactiveUtils
ReactiveUtils.collection([]);

// Through ReactiveState
ReactiveState.collection([]);
```

---

## Key principles

### 1. Items live in .items

```javascript
const list = Collections.create([1, 2, 3]);
console.log(list.items);  // [1, 2, 3]
```

### 2. Methods are chainable

```javascript
list.add(4).add(5).sort((a, b) => b - a).reverse();
```

### 3. Predicates find items

Most methods accept either a **value** or a **function**:

```javascript
// By value — finds exact match
list.remove(3);

// By predicate function — finds by condition
list.remove(item => item.id === 3);
```

### 4. Everything is reactive

```javascript
ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = list.length;
});

list.add('new item');  // Effect re-runs automatically
```

---

## Key takeaways

1. **Collections** give you a reactive array with built-in CRUD methods
2. **No boilerplate** — no manual `findIndex` + `splice` patterns
3. **Chainable** — most methods return `this` for fluent APIs
4. **Reactive** — all mutations trigger effects automatically
5. **Predicates** — find items by value or by function
6. **Multiple access points** — `Collections.create()`, `ReactiveUtils.collection()`, etc.
7. **Convenience getters** — `.length`, `.first`, `.last` for quick reads

---

## What's next?

Let's break down a basic example step by step, then explore every method in detail.

Let's continue!