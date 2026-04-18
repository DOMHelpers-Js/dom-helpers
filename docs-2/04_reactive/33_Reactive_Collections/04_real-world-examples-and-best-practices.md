[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples and Best Practices

Let's see reactive collections solving real problems you'll encounter in web development.

---

## Example 1: Todo List with Filters

### The scenario

A todo app where users can add tasks, mark them done, and filter by status.

```javascript
const todos = Collections.create([
  { id: 1, text: 'Learn DOMHelpers', done: false },
  { id: 2, text: 'Build an app', done: false }
]);

const app = ReactiveUtils.state({ filter: 'all' });

// Render the list based on the current filter
ReactiveUtils.effect(() => {
  let visible = todos.items;

  if (app.filter === 'active') {
    visible = todos.filter(t => !t.done);
  } else if (app.filter === 'completed') {
    visible = todos.filter(t => t.done);
  }

  document.getElementById('todoList').innerHTML = visible
    .map(t => `<li>${t.done ? '✅' : '⬜'} ${t.text}</li>`)
    .join('');

  const remaining = todos.filter(t => !t.done).length;
  document.getElementById('count').textContent = `${remaining} remaining`;
});

// Add a new todo
function addTodo(text) {
  todos.add({ id: Date.now(), text, done: false });
}

// Toggle a todo's done state
function toggleTodo(id) {
  todos.toggle(t => t.id === id, 'done');
}

// Remove completed todos
function clearCompleted() {
  todos.removeWhere(t => t.done);
}
```

**Key methods used:** `.add()`, `.toggle()`, `.filter()`, `.removeWhere()`

---

## Example 2: Shopping Cart

### The scenario

A cart where products can be added, quantities updated, and items removed.

```javascript
const cart = Collections.create();

ReactiveUtils.effect(() => {
  const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
  document.getElementById('cartCount').textContent = `${cart.length} items`;
});

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    // Increase quantity
    cart.update(item => item.id === product.id, { qty: existing.qty + 1 });
  } else {
    // Add new item
    cart.add({ ...product, qty: 1 });
  }
}

function removeFromCart(id) {
  cart.remove(item => item.id === id);
}

function emptyCart() {
  cart.clear();
}

addToCart({ id: 1, name: 'Widget', price: 9.99 });
addToCart({ id: 2, name: 'Gadget', price: 24.99 });
addToCart({ id: 1, name: 'Widget', price: 9.99 });  // qty becomes 2
```

**Key methods used:** `.add()`, `.find()`, `.update()`, `.remove()`, `.clear()`

---

## Example 3: Chat Messages

### The scenario

A chat where new messages appear and old ones can be removed.

```javascript
const messages = Collections.create();

ReactiveUtils.effect(() => {
  const container = document.getElementById('chat');
  container.innerHTML = messages
    .map(m => `<div class="msg"><b>${m.user}</b>: ${m.text}</div>`)
    .join('');
});

function sendMessage(user, text) {
  messages.add({ id: Date.now(), user, text, time: new Date() });

  // Keep only the last 100 messages
  if (messages.length > 100) {
    messages.splice(0, messages.length - 100);
  }
}

function deleteMessage(id) {
  messages.remove(m => m.id === id);
}

sendMessage('Alice', 'Hello!');
sendMessage('Bob', 'Hey there!');
```

**Key methods used:** `.add()`, `.map()`, `.splice()`, `.remove()`

---

## Example 4: User List with Roles

### The scenario

Managing a list of users with role changes and bulk operations.

```javascript
const users = Collections.create([
  { id: 1, name: 'Alice', role: 'admin', active: true },
  { id: 2, name: 'Bob', role: 'user', active: true },
  { id: 3, name: 'Charlie', role: 'user', active: false }
]);

// Get active users
function getActiveUsers() {
  return users.filter(u => u.active);
}

// Promote a user
function promoteToAdmin(id) {
  users.update(u => u.id === id, { role: 'admin' });
}

// Deactivate all users with a specific role
function deactivateRole(role) {
  users.updateWhere(u => u.role === role, { active: false });
}

// Remove all inactive users
function removeInactive() {
  users.removeWhere(u => !u.active);
}

promoteToAdmin(2);          // Bob is now admin
deactivateRole('user');     // All 'user' role → inactive
removeInactive();           // Remove all inactive users
```

**Key methods used:** `.filter()`, `.update()`, `.updateWhere()`, `.removeWhere()`

---

## Example 5: Sortable Data Table

### The scenario

A table that can be sorted by different columns.

```javascript
const table = Collections.create([
  { name: 'Alice', age: 30, score: 92 },
  { name: 'Bob', age: 25, score: 88 },
  { name: 'Charlie', age: 35, score: 95 }
]);

ReactiveUtils.effect(() => {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = table
    .map(r => `<tr><td>${r.name}</td><td>${r.age}</td><td>${r.score}</td></tr>`)
    .join('');
});

function sortByColumn(column) {
  table.sort((a, b) => {
    if (typeof a[column] === 'string') return a[column].localeCompare(b[column]);
    return a[column] - b[column];
  });
}

sortByColumn('score');  // Table re-renders sorted by score
sortByColumn('name');   // Table re-renders sorted by name
```

**Key methods used:** `.map()`, `.sort()`

---

## Example 6: Tag Input

### The scenario

A tag input where tags can be added and removed, with duplicate prevention.

```javascript
const tags = Collections.create(['javascript', 'css']);

ReactiveUtils.effect(() => {
  document.getElementById('tagList').innerHTML = tags
    .map(tag => `<span class="tag">${tag} <button onclick="removeTag('${tag}')">×</button></span>`)
    .join('');
  document.getElementById('tagCount').textContent = `${tags.length} tags`;
});

function addTag(tag) {
  const cleaned = tag.trim().toLowerCase();
  if (cleaned && !tags.includes(cleaned)) {
    tags.add(cleaned);
  }
}

function removeTag(tag) {
  tags.remove(tag);
}

addTag('html');         // Added
addTag('JavaScript');   // Not added — already exists (case-insensitive)
removeTag('css');       // Removed
```

**Key methods used:** `.add()`, `.includes()`, `.remove()`, `.map()`

---

## Example 7: Notification Stack

### The scenario

Notifications that appear and auto-dismiss after a delay.

```javascript
const notifications = Collections.create();

ReactiveUtils.effect(() => {
  document.getElementById('notifications').innerHTML = notifications
    .map(n => `<div class="notification ${n.type}">${n.message}</div>`)
    .join('');
});

function notify(message, type = 'info', duration = 3000) {
  const id = Date.now();
  notifications.add({ id, message, type });

  // Auto-dismiss after duration
  setTimeout(() => {
    notifications.remove(n => n.id === id);
  }, duration);
}

notify('Welcome!', 'success');
notify('New message received', 'info');
notify('Disk almost full', 'warning', 5000);
```

**Key methods used:** `.add()`, `.remove()`, `.map()`

---

## Example 8: Undo Stack

### The scenario

Track actions for undo/redo using push and pop.

```javascript
const undoStack = Collections.create();
const redoStack = Collections.create();

const doc = ReactiveUtils.state({ content: '' });

function editContent(newContent) {
  undoStack.add(doc.content);
  redoStack.clear();
  doc.content = newContent;
}

function undo() {
  if (undoStack.isEmpty()) return;
  redoStack.add(doc.content);
  doc.content = undoStack.pop();
}

function redo() {
  if (redoStack.isEmpty()) return;
  undoStack.add(doc.content);
  doc.content = redoStack.pop();
}

ReactiveUtils.effect(() => {
  document.getElementById('undoBtn').disabled = undoStack.isEmpty();
  document.getElementById('redoBtn').disabled = redoStack.isEmpty();
});

editContent('First draft');
editContent('Second draft');
undo();   // Back to "First draft"
redo();   // Forward to "Second draft"
```

**Key methods used:** `.add()`, `.pop()`, `.isEmpty()`, `.clear()`

---

## Best practices

### ✅ Use the right method for the job

```javascript
// ✅ Use .remove() for one item, .removeWhere() for multiple
todos.remove(t => t.id === 5);           // Remove one
todos.removeWhere(t => t.done);          // Remove all completed

// ✅ Use .update() for one item, .updateWhere() for multiple
todos.update(t => t.id === 5, { done: true });      // Update one
todos.updateWhere(t => t.done, { archived: true });  // Update all done
```

### ✅ Chain methods for concise operations

```javascript
// ✅ Clear and repopulate in one statement
todos
  .clear()
  .add({ id: 1, text: 'New task 1' })
  .add({ id: 2, text: 'New task 2' })
  .sort((a, b) => a.text.localeCompare(b.text));

// ✅ Or use .reset() when replacing all items
todos.reset(fetchedItems);
```

### ✅ Use .find() before modifying when you need the item

```javascript
// ✅ Check if an item exists before deciding what to do
const existing = cart.find(item => item.id === productId);
if (existing) {
  cart.update(item => item.id === productId, { qty: existing.qty + 1 });
} else {
  cart.add({ id: productId, name, price, qty: 1 });
}
```

### ✅ Use .isEmpty() instead of checking length

```javascript
// ✅ Clearer intent
if (todos.isEmpty()) {
  showEmptyState();
}

// Also works, but .isEmpty() is more expressive
if (todos.length === 0) {
  showEmptyState();
}
```

### ❌ Don't modify .items directly when collection methods exist

```javascript
// ❌ Bypasses the collection API
todos.items.push({ id: 1, text: 'Task' });

// ✅ Use the collection method
todos.add({ id: 1, text: 'Task' });
```

Both work (the array is patched), but using collection methods keeps your code consistent and chainable.

### ❌ Don't forget that .filter() and .map() return new arrays

```javascript
// ❌ This doesn't modify the collection
todos.filter(t => t.done);  // Result is discarded

// ✅ Use the result
const doneTodos = todos.filter(t => t.done);

// ✅ Or use .removeWhere() to actually remove items
todos.removeWhere(t => t.done);
```

### ❌ Don't confuse .toggle() and .toggleAll()

```javascript
// .toggle() — one item, returns the collection
todos.toggle(t => t.id === 1, 'done');

// .toggleAll() — all matching items, returns count
const count = todos.toggleAll(t => !t.done, 'done');
```

---

## Key takeaways

1. **Collections shine** for managing lists of data with built-in CRUD methods
2. **Chain methods** for concise, readable operations
3. Use the **single/all pairs**: `.remove()` vs `.removeWhere()`, `.update()` vs `.updateWhere()`
4. **Query methods** (find, filter, includes) help you inspect without modifying
5. **Effects re-run** automatically whenever any method changes the items
6. **Prefer collection methods** over direct array manipulation for consistency

---

## What's next?

Let's explore the advanced features — collections with computed properties, filtered collections, and the complete API reference.

Let's continue!