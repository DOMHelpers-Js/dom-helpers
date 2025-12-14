# Understanding `toggle()` - A Beginner's Guide

## What is `toggle()`?

`toggle()` is a method for reactive collections that toggles a boolean field on a **single item** that matches a condition. It's a convenient shortcut for flipping a true/false value without writing the full `!item.field` logic.

Think of it as **boolean flipper** - find one item and switch its boolean field.

---

## Why Does This Exist?

### The Problem: Toggling Boolean Fields

You need to flip a boolean value on a specific item:

```javascript
// ❌ Without toggle - manual toggle
const todos = Reactive.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false }
]);

const todo = todos.find(t => t.id === 1);
if (todo) {
  todo.done = !todo.done;
}

// ✅ With toggle() - clean
todos.toggle(t => t.id === 1, 'done');
```

**Why this matters:**
- Cleaner syntax
- No need to find first
- Single method call
- Triggers reactivity

---

## How Does It Work?

### The Toggle Process

```javascript
collection.toggle(predicate, field)
    ↓
Finds FIRST matching item
    ↓
Flips boolean: true → false, false → true
Triggers reactive updates
Returns collection for chaining
```

---

## Basic Usage

### Toggle by Predicate

```javascript
const todos = Reactive.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false }
]);

// Toggle the done field on todo with id 1
todos.toggle(t => t.id === 1, 'done');

console.log(todos.find(t => t.id === 1).done); // true

// Toggle again
todos.toggle(t => t.id === 1, 'done');

console.log(todos.find(t => t.id === 1).done); // false
```

### Toggle by Item Reference

```javascript
const todos = Reactive.collection([
  { id: 1, text: 'Buy milk', done: false }
]);

const item = todos.first;
todos.toggle(item, 'done');

console.log(item.done); // true
```

### Default Field (done)

```javascript
const todos = Reactive.collection([
  { id: 1, text: 'Buy milk', done: false }
]);

// If you don't specify a field, it defaults to 'done'
todos.toggle(t => t.id === 1);

console.log(todos.first.done); // true
```

---

## Important: Only Toggles ONE Item

**Critical to understand:** `toggle()` only affects the **first matching item**.

```javascript
const items = Reactive.collection([
  { id: 1, active: false },
  { id: 2, active: false },
  { id: 3, active: false }
]);

// Only toggles the FIRST item
items.toggle(i => i.active === false, 'active');

console.log(items[0].active); // true
console.log(items[1].active); // false (unchanged)
console.log(items[2].active); // false (unchanged)
```

**To toggle ALL items**, use a loop:

```javascript
// Toggle all active fields
items.forEach(item => {
  item.active = !item.active;
});

// Or more specifically
items.forEach(item => {
  if (item.someCondition) {
    item.active = !item.active;
  }
});
```

---

## Simple Examples Explained

### Example 1: Todo List

```javascript
const todos = Reactive.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false },
  { id: 3, text: 'Read book', done: false }
]);

// Toggle completion status
function toggleTodo(id) {
  todos.toggle(t => t.id === id, 'done');
}

// Display todos
Reactive.effect(() => {
  const container = document.getElementById('todos');
  container.innerHTML = todos
    .map(todo => `
      <div class="todo ${todo.done ? 'completed' : ''}">
        <input type="checkbox"
               ${todo.done ? 'checked' : ''}
               onchange="toggleTodo(${todo.id})">
        <span>${todo.text}</span>
      </div>
    `)
    .join('');
});

// Usage
toggleTodo(1); // Mark as done
toggleTodo(1); // Mark as not done
```

---

### Example 2: Favorite Items

```javascript
const products = Reactive.collection([
  { id: 1, name: 'Laptop', price: 999, favorite: false },
  { id: 2, name: 'Mouse', price: 25, favorite: false },
  { id: 3, name: 'Keyboard', price: 89, favorite: false }
]);

// Toggle favorite status
function toggleFavorite(productId) {
  products.toggle(p => p.id === productId, 'favorite');
}

// Display products
Reactive.effect(() => {
  const container = document.getElementById('products');
  container.innerHTML = products
    .map(product => `
      <div class="product">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="toggleFavorite(${product.id})">
          ${product.favorite ? '❤️' : '🤍'}
        </button>
      </div>
    `)
    .join('');
});

// Usage
toggleFavorite(1); // Add to favorites
toggleFavorite(1); // Remove from favorites
```

---

### Example 3: Visibility Toggle

```javascript
const layers = Reactive.collection([
  { id: 1, name: 'Background', visible: true },
  { id: 2, name: 'Foreground', visible: true },
  { id: 3, name: 'UI', visible: true }
]);

// Toggle layer visibility
function toggleLayer(layerId) {
  layers.toggle(l => l.id === layerId, 'visible');
}

// Display layers
Reactive.effect(() => {
  const container = document.getElementById('layers');
  container.innerHTML = layers
    .map(layer => `
      <div class="layer">
        <button onclick="toggleLayer(${layer.id})">
          ${layer.visible ? '👁️' : '👁️‍🗨️'}
        </button>
        <span>${layer.name}</span>
        <span class="status">${layer.visible ? 'Visible' : 'Hidden'}</span>
      </div>
    `)
    .join('');
});

// Usage
toggleLayer(1); // Hide background
toggleLayer(1); // Show background
```

---

## Real-World Example: Task Manager

```javascript
const tasks = Reactive.collection([
  { id: 1, title: 'Design homepage', completed: false, starred: false },
  { id: 2, title: 'Write documentation', completed: false, starred: true },
  { id: 3, title: 'Fix bug #123', completed: true, starred: false },
  { id: 4, title: 'Code review', completed: false, starred: false }
]);

// Toggle task completion
function toggleComplete(taskId) {
  tasks.toggle(t => t.id === taskId, 'completed');
}

// Toggle task star
function toggleStar(taskId) {
  tasks.toggle(t => t.id === taskId, 'starred');
}

// Display tasks
Reactive.effect(() => {
  const container = document.getElementById('tasks');
  
  container.innerHTML = tasks
    .map(task => `
      <div class="task ${task.completed ? 'completed' : ''}">
        <input type="checkbox"
               ${task.completed ? 'checked' : ''}
               onchange="toggleComplete(${task.id})">
        <span class="title">${task.title}</span>
        <button onclick="toggleStar(${task.id})" class="star-btn">
          ${task.starred ? '⭐' : '☆'}
        </button>
      </div>
    `)
    .join('');
});

// Display statistics
Reactive.effect(() => {
  const completed = tasks.filter(t => t.completed).length;
  const starred = tasks.filter(t => t.starred).length;
  
  document.getElementById('stats').innerHTML = `
    <span>Completed: ${completed}/${tasks.length}</span>
    <span>Starred: ${starred}</span>
  `;
});

// Usage
toggleComplete(1); // Mark task 1 as done
toggleStar(3);     // Star task 3
```

---

## Advanced Example: Multi-Field Toggle

```javascript
const items = Reactive.collection([
  { 
    id: 1, 
    name: 'Item 1', 
    active: false, 
    selected: false,
    pinned: false 
  },
  { 
    id: 2, 
    name: 'Item 2', 
    active: true, 
    selected: false,
    pinned: false 
  }
]);

// Toggle different fields
function toggleActive(id) {
  items.toggle(i => i.id === id, 'active');
}

function toggleSelected(id) {
  items.toggle(i => i.id === id, 'selected');
}

function togglePinned(id) {
  items.toggle(i => i.id === id, 'pinned');
}

// Display with multiple toggleable properties
Reactive.effect(() => {
  const container = document.getElementById('items');
  
  container.innerHTML = items
    .map(item => `
      <div class="item ${item.active ? 'active' : ''}">
        <span>${item.name}</span>
        <div class="controls">
          <label>
            <input type="checkbox" 
                   ${item.active ? 'checked' : ''}
                   onchange="toggleActive(${item.id})">
            Active
          </label>
          <label>
            <input type="checkbox" 
                   ${item.selected ? 'checked' : ''}
                   onchange="toggleSelected(${item.id})">
            Selected
          </label>
          <button onclick="togglePinned(${item.id})">
            ${item.pinned ? '📌' : '📍'}
          </button>
        </div>
      </div>
    `)
    .join('');
});
```

---

## Common Patterns

### Pattern 1: Simple Toggle

```javascript
// Toggle with predicate
collection.toggle(item => item.id === targetId, 'done');
```

### Pattern 2: Toggle by Reference

```javascript
// Get item first
const item = collection.find(i => i.id === targetId);
collection.toggle(item, 'active');
```

### Pattern 3: Default Field

```javascript
// Uses 'done' as default field
collection.toggle(item => item.id === targetId);
```

### Pattern 4: Chaining

```javascript
// Chain with other methods
collection
  .toggle(item => item.id === 1, 'done')
  .toggle(item => item.id === 2, 'done')
  .sort((a, b) => a.id - b.id);
```

---

## Common Questions

### Q: Does it toggle ALL matching items?

**Answer:** **NO!** Only the **first match**:

```javascript
const items = Reactive.collection([
  { id: 1, active: false },
  { id: 2, active: false },
  { id: 3, active: false }
]);

// Only toggles the FIRST item
items.toggle(i => i.active === false, 'active');

console.log(items[0].active); // true
console.log(items[1].active); // false
console.log(items[2].active); // false
```

**To toggle all, use forEach:**

```javascript
items.forEach(item => {
  item.active = !item.active;
});
```

### Q: What if the item doesn't exist?

**Answer:** Nothing happens, no error:

```javascript
const items = Reactive.collection([
  { id: 1, active: false }
]);

// No item with id 999
items.toggle(i => i.id === 999, 'active');

// No error, collection unchanged
console.log(items.length); // Still 1
```

### Q: What if the field doesn't exist?

**Answer:** Creates it as `true`:

```javascript
const items = Reactive.collection([
  { id: 1, name: 'Item 1' }
]);

// 'active' field doesn't exist yet
items.toggle(i => i.id === 1, 'active');

console.log(items.first);
// { id: 1, name: 'Item 1', active: true }
```

### Q: What if the field isn't a boolean?

**Answer:** Applies the `!` operator:

```javascript
const items = Reactive.collection([
  { id: 1, count: 0 }
]);

items.toggle(i => i.id === 1, 'count');

console.log(items.first.count);
// true (because !0 === true)
```

### Q: Does it trigger reactivity?

**Answer:** Yes!

```javascript
Reactive.effect(() => {
  console.log(items.first.done);
});

items.toggle(i => i.id === 1, 'done');
// Effect runs, logs new value
```

---

## When to Use `toggle()` vs Manual Toggle

### Use `toggle()` when:

```javascript
// ✅ Toggling by ID or unique property
todos.toggle(t => t.id === targetId, 'done');

// ✅ Toggling by item reference
const item = todos.first;
todos.toggle(item, 'done');

// ✅ You want method chaining
todos
  .toggle(t => t.id === 1, 'done')
  .sort((a, b) => a.id - b.id);
```

### Use manual toggle when:

```javascript
// ✅ Toggling ALL items
items.forEach(item => {
  item.active = !item.active;
});

// ✅ Conditional toggle on all
items.forEach(item => {
  if (item.category === 'work') {
    item.done = !item.done;
  }
});

// ✅ You already have the item
const item = items.find(i => i.id === targetId);
item.done = !item.done;
```

---

## Toggle All Items (Workaround)

Since `toggle()` only affects one item, here's how to toggle all:

```javascript
const items = Reactive.collection([
  { id: 1, selected: false },
  { id: 2, selected: false },
  { id: 3, selected: false }
]);

// Toggle ALL items
function toggleAll(field) {
  items.forEach(item => {
    item[field] = !item[field];
  });
}

// Toggle all matching a condition
function toggleWhere(predicate, field) {
  items.forEach(item => {
    if (predicate(item)) {
      item[field] = !item[field];
    }
  });
}

// Usage
toggleAll('selected'); // All items now selected = true
toggleWhere(i => i.id > 1, 'selected'); // Toggle items 2 and 3
```

---

## Tips for Success

### 1. Use for Single Item Toggle

```javascript
// ✅ Perfect use case
function toggleTodo(id) {
  todos.toggle(t => t.id === id, 'done');
}
```

### 2. Always Use Unique Identifiers

```javascript
// ✅ Safe - uses unique ID
items.toggle(i => i.id === targetId, 'active');

// ⚠️ Risky - might toggle wrong item
items.toggle(i => i.name === 'John', 'active');
```

### 3. Remember: One Item Only

```javascript
// ✅ Correct expectation
items.toggle(i => i.category === 'work', 'done');
// Only toggles FIRST work item

// ✅ To toggle all, use forEach
items.forEach(i => {
  if (i.category === 'work') {
    i.done = !i.done;
  }
});
```

### 4. Use with UI Event Handlers

```javascript
// ✅ Perfect for click handlers
<button onclick="toggleItem(${item.id})">
  ${item.active ? 'Active' : 'Inactive'}
</button>

function toggleItem(id) {
  items.toggle(i => i.id === id, 'active');
}
```

---

## Summary

### What `toggle()` Does:

1. ✅ Finds the **first** matching item
2. ✅ Flips a boolean field: `true` → `false`, `false` → `true`
3. ✅ Accepts predicate function or item reference
4. ✅ Default field is `'done'` if not specified
5. ✅ Returns collection for chaining
6. ✅ Triggers reactive updates
7. ⚠️ **Only affects ONE item** (first match)

### The Basic Pattern:

```javascript
const collection = Reactive.collection([
  { id: 1, done: false },
  { id: 2, done: false }
]);

// Toggle by predicate
collection.toggle(item => item.id === 1, 'done');

// Toggle by reference
const item = collection.first;
collection.toggle(item, 'done');

// Toggle with default field ('done')
collection.toggle(item => item.id === 1);
```

### Key Points:

- **Toggles**: Only the **first** matching item
- **Field**: Defaults to `'done'` if not specified
- **Safe**: Does nothing if no match found
- **Chainable**: Returns collection for chaining
- **Reactive**: Triggers updates automatically

---

## Quick Reference

```javascript
// Basic usage
collection.toggle(item => item.id === 1, 'done');

// By reference
collection.toggle(actualItem, 'active');

// Default field
collection.toggle(item => item.id === 1); // Uses 'done'

// Chain
collection
  .toggle(i => i.id === 1, 'done')
  .toggle(i => i.id === 2, 'done');

// Toggle ALL items (use forEach instead)
collection.forEach(item => {
  item.done = !item.done;
});
```

---

**Remember:** `toggle()` is perfect for flipping a boolean on a **specific item** (by ID or reference). It only affects the **first matching item**, NOT all items. For toggling multiple items, use `forEach()` or `updateWhere()`! 🎉