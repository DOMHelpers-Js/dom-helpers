[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Collection Methods Deep Dive

Every method available on a reactive collection, explained with examples.

---

## CRUD Methods (Create, Read, Update, Delete)

These are the methods you'll use most often — adding, removing, updating, and clearing items.

---

### .add(item)

Adds a single item to the end of the collection.

```javascript
const todos = Collections.create();

todos.add({ id: 1, text: 'Buy milk', done: false });
todos.add({ id: 2, text: 'Walk dog', done: false });

console.log(todos.length);  // 2
```

**Returns:** the collection (for chaining)

```javascript
todos
  .add({ id: 1, text: 'First' })
  .add({ id: 2, text: 'Second' });
```

**What happens inside:**

```
todos.add(item)
   ↓
1️⃣ Calls this.items.push(item)
   ↓
2️⃣ The push triggers reactivity (array is patched)
   ↓
3️⃣ Effects re-run
   ↓
4️⃣ Returns this (the collection)
```

---

### .push(...items)

Adds one or more items to the end — just like `Array.push()`, but returns the collection instead of the new length.

```javascript
const list = Collections.create([1, 2]);

list.push(3);           // Add one
list.push(4, 5, 6);     // Add multiple

console.log(list.items);  // [1, 2, 3, 4, 5, 6]
```

**Returns:** the collection (for chaining)

**Difference from .add():**

```javascript
// .add() — one item at a time
todos.add(item1).add(item2);

// .push() — multiple items at once
todos.push(item1, item2);
```

Both work. Use whichever reads better for your situation.

---

### .remove(predicate)

Removes a single item from the collection. Accepts a value (exact match) or a function (conditional match).

```javascript
// Remove by value (for simple items)
const numbers = Collections.create([1, 2, 3, 4]);
numbers.remove(3);
console.log(numbers.items);  // [1, 2, 4]

// Remove by predicate (for objects)
const todos = Collections.create([
  { id: 1, text: 'Buy milk' },
  { id: 2, text: 'Walk dog' }
]);

todos.remove(t => t.id === 1);
console.log(todos.items);  // [{ id: 2, text: 'Walk dog' }]
```

**Returns:** the collection (for chaining)

**What happens inside:**

```
todos.remove(predicate)
   ↓
1️⃣ If predicate is a function → findIndex(predicate)
   If predicate is a value → indexOf(predicate)
   ↓
2️⃣ If index found (not -1) → splice(idx, 1)
   ↓
3️⃣ Effects re-run
   ↓
4️⃣ Returns this
```

**Only removes the first match.** If you need to remove all matching items, use `.removeWhere()`.

---

### .removeWhere(predicate)

Removes **all** items that match the predicate.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Task A', done: true },
  { id: 2, text: 'Task B', done: false },
  { id: 3, text: 'Task C', done: true }
]);

// Remove ALL completed todos
todos.removeWhere(t => t.done);

console.log(todos.items);
// [{ id: 2, text: 'Task B', done: false }]
```

**Returns:** the collection (for chaining)

**How it differs from .remove():**

```
.remove(predicate)       → Removes the FIRST match
.removeWhere(predicate)  → Removes ALL matches
```

**Key detail:** It iterates backwards (from the end to the start) to safely remove items without skipping any.

---

### .update(predicate, updates)

Finds a single item and merges new data into it.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false }
]);

// Mark a specific todo as done
todos.update(t => t.id === 1, { done: true });

console.log(todos.items[0]);
// { id: 1, text: 'Buy milk', done: true }
```

**Returns:** the collection (for chaining)

**What happens inside:**

```
todos.update(predicate, updates)
   ↓
1️⃣ Finds the index (by function or value)
   ↓
2️⃣ If found → Object.assign(items[idx], updates)
   ↓
3️⃣ The matching item is modified in place
   ↓
4️⃣ Returns this
```

You can update multiple fields at once:

```javascript
todos.update(t => t.id === 1, {
  text: 'Buy groceries',
  done: true,
  priority: 'high'
});
```

---

### .updateWhere(predicate, updates)

Updates **all** items that match the predicate.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Task A', priority: 'low' },
  { id: 2, text: 'Task B', priority: 'low' },
  { id: 3, text: 'Task C', priority: 'high' }
]);

// Set all low-priority tasks to medium
todos.updateWhere(t => t.priority === 'low', { priority: 'medium' });

console.log(todos.items[0].priority);  // 'medium'
console.log(todos.items[1].priority);  // 'medium'
console.log(todos.items[2].priority);  // 'high' (unchanged)
```

**Returns:** the collection (for chaining)

**How it differs from .update():**

```
.update(predicate, data)       → Updates the FIRST match
.updateWhere(predicate, data)  → Updates ALL matches
```

---

### .toggle(predicate, field)

Flips a boolean field on a single matching item.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Buy milk', done: false }
]);

todos.toggle(t => t.id === 1, 'done');
console.log(todos.items[0].done);  // true

todos.toggle(t => t.id === 1, 'done');
console.log(todos.items[0].done);  // false
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `predicate` | Function or value | — | How to find the item |
| `field` | String | `'done'` | Which boolean field to toggle |

**Returns:** the collection (for chaining)

The `field` parameter defaults to `'done'`, so for todo-style items:

```javascript
// These two are the same
todos.toggle(t => t.id === 1, 'done');
todos.toggle(t => t.id === 1);  // defaults to 'done'
```

For a different field name:

```javascript
const users = Collections.create([
  { id: 1, name: 'Alice', active: true }
]);

users.toggle(u => u.id === 1, 'active');
console.log(users.items[0].active);  // false
```

---

### .toggleAll(predicate, field)

Toggles a boolean field on **all** matching items. Returns the number of items toggled.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Task A', done: false },
  { id: 2, text: 'Task B', done: false },
  { id: 3, text: 'Task C', done: true }
]);

// Toggle 'done' on all undone tasks
const count = todos.toggleAll(t => !t.done, 'done');

console.log(count);  // 2
console.log(todos.items[0].done);  // true  (was false)
console.log(todos.items[1].done);  // true  (was false)
console.log(todos.items[2].done);  // true  (unchanged by this call)
```

**Returns:** the number of items toggled (not the collection)

**How it differs from .toggle():**

```
.toggle(predicate, field)     → Toggles the FIRST match, returns this
.toggleAll(predicate, field)  → Toggles ALL matches, returns count
```

---

### .clear()

Removes all items from the collection.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Task A' },
  { id: 2, text: 'Task B' }
]);

todos.clear();

console.log(todos.items);    // []
console.log(todos.length);   // 0
console.log(todos.isEmpty()); // true
```

**Returns:** the collection (for chaining)

---

### .reset(newItems)

Replaces all items with a new array. Like `.clear()` followed by `.push(...newItems)`.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Old task' }
]);

// Replace all items
todos.reset([
  { id: 10, text: 'Fresh task A' },
  { id: 11, text: 'Fresh task B' }
]);

console.log(todos.items);
// [{ id: 10, text: 'Fresh task A' }, { id: 11, text: 'Fresh task B' }]
```

**Returns:** the collection (for chaining)

**With no arguments, it clears the collection:**

```javascript
todos.reset();  // Same as todos.clear()
```

**What happens inside:**

```
todos.reset(newItems)
   ↓
1️⃣ this.items.length = 0  (clears the array)
   ↓
2️⃣ this.items.push(...newItems)  (adds the new items)
   ↓
3️⃣ Effects re-run
   ↓
4️⃣ Returns this
```

---

## Query Methods

These methods help you find and inspect items without modifying the collection.

---

### .find(predicate)

Returns the first item that matches.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true },
  { id: 3, text: 'Clean house', done: true }
]);

const firstDone = todos.find(t => t.done);
console.log(firstDone);  // { id: 2, text: 'Walk dog', done: true }

const notFound = todos.find(t => t.id === 99);
console.log(notFound);  // undefined
```

**Returns:** the matching item, or `undefined`

---

### .filter(predicate)

Returns a new array of all matching items.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Task A', done: true },
  { id: 2, text: 'Task B', done: false },
  { id: 3, text: 'Task C', done: true }
]);

const doneTodos = todos.filter(t => t.done);
console.log(doneTodos);
// [{ id: 1, text: 'Task A', done: true }, { id: 3, text: 'Task C', done: true }]
```

**Returns:** a new array (not the collection — this is a read operation)

---

### .includes(item)

Checks if the collection contains an exact item.

```javascript
const numbers = Collections.create([1, 2, 3, 4, 5]);

console.log(numbers.includes(3));   // true
console.log(numbers.includes(99));  // false
```

**Returns:** `true` or `false`

**Note:** For objects, this checks by reference, not by value:

```javascript
const obj = { id: 1 };
const list = Collections.create([obj]);

console.log(list.includes(obj));          // true (same reference)
console.log(list.includes({ id: 1 }));   // false (different reference)
```

To check by value, use `.find()`:

```javascript
const found = list.find(item => item.id === 1);
console.log(found !== undefined);  // true
```

---

### .indexOf(item)

Returns the index of the item in the collection.

```javascript
const fruits = Collections.create(['Apple', 'Banana', 'Cherry']);

console.log(fruits.indexOf('Banana'));  // 1
console.log(fruits.indexOf('Mango'));   // -1
```

**Returns:** the index (number), or `-1` if not found

---

### .at(index)

Returns the item at a specific index.

```javascript
const list = Collections.create(['a', 'b', 'c', 'd']);

console.log(list.at(0));   // 'a'
console.log(list.at(2));   // 'c'
```

**Returns:** the item at that index, or `undefined` if out of range

---

### .isEmpty()

Checks if the collection has no items.

```javascript
const list = Collections.create();
console.log(list.isEmpty());  // true

list.add('item');
console.log(list.isEmpty());  // false
```

**Returns:** `true` or `false`

---

## Convenience Getters

Quick-access properties that don't need parentheses.

---

### .length

The number of items in the collection.

```javascript
const list = Collections.create([1, 2, 3]);
console.log(list.length);  // 3

list.add(4);
console.log(list.length);  // 4
```

**This is a getter**, so no parentheses. It reads `this.items.length` under the hood and is fully reactive — effects that read `.length` will re-run when items change.

---

### .first

The first item in the collection.

```javascript
const list = Collections.create(['Apple', 'Banana', 'Cherry']);
console.log(list.first);  // 'Apple'
```

**Returns:** the first item, or `undefined` if the collection is empty.

---

### .last

The last item in the collection.

```javascript
const list = Collections.create(['Apple', 'Banana', 'Cherry']);
console.log(list.last);  // 'Cherry'
```

**Returns:** the last item, or `undefined` if the collection is empty.

---

## Iteration & Transformation

Methods for looping, transforming, and reordering.

---

### .map(fn)

Transforms each item and returns a new array.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Buy milk' },
  { id: 2, text: 'Walk dog' }
]);

const texts = todos.map(t => t.text);
console.log(texts);  // ['Buy milk', 'Walk dog']
```

**Returns:** a new array (not the collection)

This is commonly used inside effects to render lists:

```javascript
ReactiveUtils.effect(() => {
  document.getElementById('list').innerHTML = todos
    .map(t => `<li>${t.text}</li>`)
    .join('');
});
```

---

### .forEach(fn)

Iterates over each item without returning anything new.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Buy milk' },
  { id: 2, text: 'Walk dog' }
]);

todos.forEach(t => console.log(t.text));
// Output:
// 'Buy milk'
// 'Walk dog'
```

**Returns:** the collection (for chaining)

---

### .sort(compareFn)

Sorts the items in place.

```javascript
const numbers = Collections.create([3, 1, 4, 1, 5]);

numbers.sort((a, b) => a - b);
console.log(numbers.items);  // [1, 1, 3, 4, 5]
```

**Returns:** the collection (for chaining)

Sorting objects by a property:

```javascript
const people = Collections.create([
  { name: 'Charlie', age: 35 },
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
]);

people.sort((a, b) => a.name.localeCompare(b.name));
// Items are now sorted: Alice, Bob, Charlie
```

---

### .reverse()

Reverses the order of items in place.

```javascript
const list = Collections.create([1, 2, 3]);

list.reverse();
console.log(list.items);  // [3, 2, 1]
```

**Returns:** the collection (for chaining)

---

### .slice(start, end)

Returns a portion of the items as a new array.

```javascript
const list = Collections.create([1, 2, 3, 4, 5]);

console.log(list.slice(1, 3));   // [2, 3]
console.log(list.slice(2));      // [3, 4, 5]
console.log(list.slice(-2));     // [4, 5]
```

**Returns:** a new array (does not modify the collection)

---

### .splice(start, deleteCount, ...items)

Removes and/or inserts items at a specific position.

```javascript
const list = Collections.create(['a', 'b', 'c', 'd']);

// Remove 1 item at index 1
list.splice(1, 1);
console.log(list.items);  // ['a', 'c', 'd']

// Insert 'x' at index 1 (remove 0 items)
list.splice(1, 0, 'x');
console.log(list.items);  // ['a', 'x', 'c', 'd']

// Replace item at index 2
list.splice(2, 1, 'y');
console.log(list.items);  // ['a', 'x', 'y', 'd']
```

**Returns:** the collection (for chaining)

**Note:** Unlike `Array.splice()` which returns the removed items, the collection's `.splice()` returns the collection for chaining.

---

### .pop()

Removes and returns the last item.

```javascript
const list = Collections.create([1, 2, 3]);

const last = list.pop();
console.log(last);         // 3
console.log(list.items);   // [1, 2]
```

**Returns:** the removed item (not the collection)

---

### .shift()

Removes and returns the first item.

```javascript
const list = Collections.create([1, 2, 3]);

const first = list.shift();
console.log(first);        // 1
console.log(list.items);   // [2, 3]
```

**Returns:** the removed item (not the collection)

---

### .unshift(...items)

Adds one or more items to the beginning.

```javascript
const list = Collections.create([3, 4]);

list.unshift(1, 2);
console.log(list.items);  // [1, 2, 3, 4]
```

**Returns:** the collection (for chaining)

---

### .toArray()

Returns a plain array copy of the items.

```javascript
const list = Collections.create([1, 2, 3]);

const copy = list.toArray();
console.log(copy);       // [1, 2, 3]
console.log(Array.isArray(copy));  // true

// The copy is independent — modifying it doesn't affect the collection
copy.push(4);
console.log(list.items);  // [1, 2, 3] (unchanged)
console.log(copy);        // [1, 2, 3, 4]
```

**Returns:** a new plain array

---

## Quick reference: What does each method return?

| Method | Returns | Chainable? |
|--------|---------|------------|
| `.add(item)` | Collection | ✅ Yes |
| `.push(...items)` | Collection | ✅ Yes |
| `.remove(predicate)` | Collection | ✅ Yes |
| `.removeWhere(predicate)` | Collection | ✅ Yes |
| `.update(predicate, data)` | Collection | ✅ Yes |
| `.updateWhere(predicate, data)` | Collection | ✅ Yes |
| `.toggle(predicate, field)` | Collection | ✅ Yes |
| `.toggleAll(predicate, field)` | Count (number) | ❌ No |
| `.clear()` | Collection | ✅ Yes |
| `.reset(newItems)` | Collection | ✅ Yes |
| `.forEach(fn)` | Collection | ✅ Yes |
| `.sort(compareFn)` | Collection | ✅ Yes |
| `.reverse()` | Collection | ✅ Yes |
| `.splice(start, n, ...items)` | Collection | ✅ Yes |
| `.unshift(...items)` | Collection | ✅ Yes |
| `.find(predicate)` | Item or `undefined` | ❌ No |
| `.filter(predicate)` | New array | ❌ No |
| `.map(fn)` | New array | ❌ No |
| `.slice(start, end)` | New array | ❌ No |
| `.toArray()` | New array | ❌ No |
| `.pop()` | Removed item | ❌ No |
| `.shift()` | Removed item | ❌ No |
| `.includes(item)` | Boolean | ❌ No |
| `.indexOf(item)` | Number | ❌ No |
| `.at(index)` | Item | ❌ No |
| `.isEmpty()` | Boolean | ❌ No |
| `.length` | Number | — (getter) |
| `.first` | Item | — (getter) |
| `.last` | Item | — (getter) |

---

## The "single vs all" pattern

Several methods come in pairs — one for a single item, one for all matches:

```
Single item:                    All matches:
├── .remove(predicate)    →     .removeWhere(predicate)
├── .update(pred, data)   →     .updateWhere(pred, data)
└── .toggle(pred, field)  →     .toggleAll(pred, field)
```

**Simple rule:** Use the single version when you know there's one match. Use the "Where" / "All" version when multiple items might match.

---

## Key takeaways

1. **CRUD methods** (add, remove, update, toggle, clear, reset) modify the collection and return `this` for chaining
2. **Query methods** (find, filter, includes, indexOf, at, isEmpty) read without modifying
3. **Iteration methods** (map, forEach, sort, reverse) — `forEach`, `sort`, and `reverse` return the collection; `map` returns a new array
4. **Array-like methods** (push, pop, shift, unshift, splice, slice) work like their `Array` counterparts
5. **Predicates** accept either a value (exact match) or a function (conditional match)
6. **Getters** (.length, .first, .last) provide quick reads without parentheses

---

## What's next?

Let's see these methods in action with real-world examples and best practices.

Let's continue!