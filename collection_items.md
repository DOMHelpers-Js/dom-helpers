# Understanding `collection.items` - A Beginner's Guide

## Quick Start (30 seconds)

```js
// Create a reactive collection
const todos = collection([
  { id: 1, text: 'Buy milk' },
  { id: 2, text: 'Call mom' }
]);

// Access items directly
console.log(todos.items);  // [{ id: 1, ... }, { id: 2, ... }]
console.log(todos.items.length);  // 2
console.log(todos.items[0].text);  // "Buy milk"

// Any change triggers reactivity
effect(() => {
  console.log(`You have ${todos.items.length} todos`);
});

todos.items.push({ id: 3, text: 'Walk dog' });  // Effect runs! ✨
```

**That's it!** `items` is a reactive array - read it, modify it, reactivity works automatically. ✨

**Want to understand how this works?** Keep reading below!

---

## What is `collection.items`?

`collection.items` is a **property on reactive collections** that contains the actual reactive array. It's the underlying data structure that holds your collection items and tracks all changes automatically.

Think of it as **the storage box with sensors** - it's where your data lives, and it automatically notifies everyone when anything inside changes.

---

## Syntax

```js
// Access the items array
collection.items

// Example
const todos = collection([{ text: 'Task 1' }]);
const allItems = todos.items;  // Get the reactive array
const firstItem = todos.items[0];  // Access by index
const count = todos.items.length;  // Get length
```

**Property type:**
- **Type**: Reactive Proxy Array
- **Access**: Read and write
- **Reactivity**: Fully reactive - all operations trigger effects

---

## Why Does This Exist?

### The Problem: Working with Collection Data

When you have a reactive collection, you need to access the actual data to:
1. Read items
2. Check the length
3. Iterate over items
4. Use array methods like `filter`, `map`, `find`
5. Modify items directly

**The Problem Visualized:**

**Without `.items` - No direct access:**
```
You: "Give me the first todo"
       ↓
Collection: "How? I'm just a wrapper!"
       ↓
   ❌ No way to access data
```

**With `.items` - Direct access:**
```
You: "Give me todos.items[0]"
       ↓
Collection: "Here's the reactive array!"
       ↓
   ✅ Access data + reactivity works
```

### ❌ If `.items` Didn't Exist

```js
const todos = collection([...]);

// How would you access the data?
console.log(todos[0]);  // ❌ Doesn't work - todos is not an array
console.log(todos.length);  // ❌ Undefined
todos.forEach(...);  // ❌ Not a function

// You'd be stuck! No way to work with the data!
```

### ✅ With `.items` Property

```js
const todos = collection([...]);

// Access data naturally
console.log(todos.items[0]);  // ✅ Works!
console.log(todos.items.length);  // ✅ Works!
todos.items.forEach(...);  // ✅ Works!

// Reactivity still works!
effect(() => {
  console.log(todos.items.length);  // Tracks changes! ✨
});
```

---

## Mental Model: The Smart Storage Box

Think of `collection.items` like a **smart storage box with sensors**:

**Regular box (plain array):**
```
You open the box
       ↓
You take items out
       ↓
Nobody knows what you did
```

**Smart box (reactive array via .items):**
```
You access box.items
       ↓
Sensors detect you're watching
       ↓
Any change to items triggers notifications
       ↓
┌──────────────┬──────────────┬──────────────┐
↓              ↓              ↓
Effect 1       Effect 2       Effect 3
runs!          runs!          runs!
```

**Real-world analogy:** It's like a warehouse with motion sensors. The `.items` property is the warehouse inventory - you can see it, count it, modify it, and sensors automatically detect every change!

**With `.items`:**
- The collection wrapper is like the warehouse building
- `.items` is the actual inventory inside
- Sensors detect any change to the inventory
- Effects are like automated alerts that trigger on changes

---

## How Does It Work?

### How It Works (Simple Version)

Here's the simple 3-step flow:

```
1. You access collection.items
              ↓
2. You get a reactive array (Proxy)
              ↓
3. Any read/write is tracked automatically
              ↓
      Effects run when changes happen! ✨
```

**Example:**
```js
const todos = collection([
  { id: 1, text: 'Buy milk' }
]);

// Step 1: Access .items
const items = todos.items;  // Get reactive array

// Step 2: Effects track access
effect(() => {
  console.log(items.length);  // Tracks .length access
});

// Step 3: Changes trigger effects
items.push({ id: 2, text: 'Call mom' });  // Effect runs! ✨
```

That's it! `.items` gives you direct access to reactive data.

---

### How It Works (Technical Details)

When you access `.items`, here's what happens:

```
┌──────────────────────────────────────────┐
│  YOU ACCESS:  todos.items                │
└──────────────┬───────────────────────────┘
               ↓
       ┌───────────────┐
       │  Collection   │
       │   returns     │
       │ reactive array│
       └───────┬───────┘
               ↓
    ┌──────────────────────┐
    │   Proxy Array        │
    │  (wraps your data)   │
    └──────────┬───────────┘
               ↓
    Every operation is intercepted:
    - Read: tracks dependency
    - Write: notifies effects
               ↓
    ┌──────────────────────┐
    │  Reactivity System   │
    │  - Tracks reads      │
    │  - Notifies on write │
    └──────────┬───────────┘
               ↓
       Effects run! ✨
```

**Key points:**
1. `.items` returns a Proxy that wraps the actual array
2. The Proxy intercepts all array operations
3. Reads are tracked as dependencies
4. Writes trigger effect updates
5. Everything happens automatically!

---

## Basic Usage

### Reading Items

```js
const todos = collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Call mom', done: true }
]);

// Access by index
const first = todos.items[0];
console.log(first.text);  // "Buy milk"

// Get length
console.log(todos.items.length);  // 2

// Check if empty
if (todos.items.length === 0) {
  console.log('No todos!');
}

// Iterate
todos.items.forEach(todo => {
  console.log(todo.text);
});

// Use array methods
const incomplete = todos.items.filter(t => !t.done);
const texts = todos.items.map(t => t.text);
const found = todos.items.find(t => t.id === 1);
```

### Modifying Items

```js
// Add items
todos.items.push({ id: 3, text: 'Walk dog', done: false });

// Remove items
todos.items.pop();
todos.items.splice(0, 1);  // Remove first item

// Modify items
todos.items[0].done = true;
todos.items[0] = { id: 1, text: 'Updated', done: true };

// Replace all
todos.items.length = 0;  // Clear all
todos.items.push(...newItems);  // Add new ones

// All changes trigger reactivity automatically! ✨
```

### Using in Effects

```js
// Track length changes
effect(() => {
  document.querySelector('#count').textContent = todos.items.length;
});

// Track specific items
effect(() => {
  const completed = todos.items.filter(t => t.done).length;
  document.querySelector('#completed').textContent = completed;
});

// Render list
effect(() => {
  const html = todos.items
    .map(t => `<div>${t.text}</div>`)
    .join('');
  document.querySelector('#list').innerHTML = html;
});
```

---

## Common Use Cases

### 1. Display Item Count

```js
const cart = collection([]);

effect(() => {
  const count = cart.items.length;
  document.querySelector('#cart-count').textContent = count;

  if (count === 0) {
    document.querySelector('#empty-message').style.display = 'block';
  } else {
    document.querySelector('#empty-message').style.display = 'none';
  }
});

// Add items - UI updates automatically
cart.items.push({ id: 1, name: 'Laptop', price: 999 });
```

### 2. Filter and Display Subset

```js
const todos = collection([...]);
const filter = state({ show: 'all' });

effect(() => {
  let filtered = todos.items;

  if (filter.show === 'active') {
    filtered = todos.items.filter(t => !t.done);
  } else if (filter.show === 'completed') {
    filtered = todos.items.filter(t => t.done);
  }

  renderTodos(filtered);
});

// Change filter - UI updates automatically
filter.show = 'active';
```

### 3. Calculate Derived Values

```js
const products = collection([
  { name: 'Laptop', price: 999, quantity: 2 },
  { name: 'Mouse', price: 29, quantity: 5 }
]);

effect(() => {
  const total = products.items.reduce((sum, p) => {
    return sum + (p.price * p.quantity);
  }, 0);

  document.querySelector('#total').textContent = `$${total}`;
});

// Update quantity - total recalculates automatically
products.items[0].quantity = 3;
```

### 4. Search and Find Items

```js
const users = collection([...]);

function findUser(id) {
  return users.items.find(u => u.id === id);
}

function searchUsers(query) {
  return users.items.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );
}

// Use in effect for reactive search
const searchQuery = state({ text: '' });

effect(() => {
  const results = users.items.filter(u =>
    u.name.toLowerCase().includes(searchQuery.text.toLowerCase())
  );
  renderSearchResults(results);
});
```

### 5. Sort and Reorder

```js
const tasks = collection([...]);
const sortBy = state({ field: 'priority' });

effect(() => {
  // Create sorted copy
  const sorted = [...tasks.items].sort((a, b) => {
    return a[sortBy.field] - b[sortBy.field];
  });

  renderTasks(sorted);
});

// Change sort - UI updates automatically
sortBy.field = 'dueDate';
```

---

## Common Questions

### Q: Is `.items` the same as the collection?

**A:** No! The collection is a wrapper object. `.items` is the actual reactive array:

```js
const todos = collection([1, 2, 3]);

console.log(todos);  // Collection { items: [...], $add: fn, ... }
console.log(todos.items);  // [1, 2, 3] (reactive array)

// Use .items to access the data
console.log(todos.items[0]);  // 1
console.log(todos.items.length);  // 3
```

### Q: Can I replace the entire `.items` array?

**A:** No, don't replace `.items` itself. Instead, clear and refill it:

```js
// ❌ BAD - breaks reactivity
todos.items = [1, 2, 3];

// ✅ GOOD - maintains reactivity
todos.items.length = 0;  // Clear
todos.items.push(...[1, 2, 3]);  // Refill

// ✅ ALSO GOOD - use $clear and $add
todos.$clear();
[1, 2, 3].forEach(item => todos.$add(item));
```

### Q: Is `.items` a copy or reference?

**A:** It's a reference to the reactive array. Changes to `.items` affect the collection:

```js
const todos = collection([1, 2, 3]);

const items = todos.items;
items.push(4);  // Modifies the collection

console.log(todos.items.length);  // 4
```

### Q: Can I use all array methods on `.items`?

**A:** Yes! All standard array methods work:

```js
todos.items.push(item);       // ✅ Add
todos.items.pop();            // ✅ Remove last
todos.items.shift();          // ✅ Remove first
todos.items.unshift(item);    // ✅ Add at start
todos.items.splice(1, 2);     // ✅ Remove range
todos.items.map(fn);          // ✅ Transform
todos.items.filter(fn);       // ✅ Filter
todos.items.find(fn);         // ✅ Find
todos.items.forEach(fn);      // ✅ Iterate
// And all other array methods!
```

### Q: Does spreading `.items` break reactivity?

**A:** The spread creates a non-reactive copy, but the original `.items` stays reactive:

```js
const todos = collection([1, 2, 3]);

// Spread creates a copy (not reactive)
const copy = [...todos.items];
copy.push(4);  // Doesn't trigger effects

// Original still reactive
todos.items.push(4);  // Triggers effects ✨

// Use spread for sorting without mutating
const sorted = [...todos.items].sort();
```

---

## Summary

**`collection.items` is the reactive array property that holds your collection data.**

**Key takeaways:**
- ✅ **Direct access** - Access the underlying reactive array
- ✅ **Fully reactive** - All reads and writes are tracked
- ✅ **Standard array** - Use all array methods normally
- ✅ **Reference** - It's the actual data, not a copy
- ✅ **Always use it** - To access or modify collection data

**Remember:**
- Access data via `.items`: `collection.items[0]`
- Don't replace `.items`: clear and refill instead
- All array methods work and trigger reactivity
- Use `.items` in effects for automatic updates

**Quick Reference:**
```js
const todos = collection([...]);

// Read
todos.items[0]           // First item
todos.items.length       // Count
todos.items.find(...)    // Find item

// Modify
todos.items.push(...)    // Add
todos.items[0] = ...     // Update
todos.items.splice(...)  // Remove

// In effects
effect(() => {
  console.log(todos.items.length);  // Auto-updates! ✨
});
```
