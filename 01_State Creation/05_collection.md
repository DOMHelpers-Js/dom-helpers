# Understanding `collection()` - A Beginner's Guide

## What is `collection()`?

`collection()` is a **specialized state function** in the Reactive library designed specifically for managing **arrays of items**. It provides convenient methods for common collection operations like adding, removing, updating, and clearing items - all with reactive updates.

Think of it as **a smart array manager** - instead of manually manipulating arrays with `push()`, `splice()`, and `findIndex()`, you get clean, high-level methods that automatically trigger reactive updates.

---

## Syntax

```js
// Using the shortcut
collection(initialItems)

// Using the full namespace
ReactiveUtils.collection(initialItems)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`collection()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.collection()`) - Explicit and clear

**Parameters:**
- `initialItems` (Array, optional): The initial array of items (defaults to `[]`)

**Returns:**
- A reactive state object with:
  - `items` - The reactive array of items
  - `$add(item)` - Add an item to the collection
  - `$remove(predicate)` - Remove an item from the collection
  - `$update(predicate, updates)` - Update an item in the collection
  - `$clear()` - Remove all items from the collection

---

## Why Does This Exist?

### The Problem with Manual Array Management

When managing arrays in reactive state, you need to perform common operations manually:

```javascript
// Manual array management - verbose and repetitive
const todos = state({
  items: []
});

// Add an item - manual push
todos.items.push({
  id: Date.now(),
  text: 'Buy milk',
  completed: false
});

// Remove an item - manual findIndex + splice
const indexToRemove = todos.items.findIndex(t => t.id === 123);
if (indexToRemove !== -1) {
  todos.items.splice(indexToRemove, 1);
}

// Update an item - manual findIndex + assign
const indexToUpdate = todos.items.findIndex(t => t.id === 123);
if (indexToUpdate !== -1) {
  Object.assign(todos.items[indexToUpdate], { completed: true });
}

// Clear all items - manual length = 0
todos.items.length = 0;

// Too repetitive and verbose for such common operations!
```

**What's the Real Issue?**

**Problems:**
- Must manually use `push()`, `splice()`, `findIndex()` every time
- Repetitive code for common operations
- Easy to make mistakes (forgetting to check if index !== -1)
- Verbose and cluttered
- No standard pattern for collection operations
- Same boilerplate repeated across your app

**Why This Becomes a Problem:**

For every array operation:
❌ Same verbose code repeated everywhere
❌ Easy to forget null checks (index !== -1)
❌ No clean, semantic methods
❌ Hard to read and maintain
❌ More code, more bugs

In other words, **managing collections requires too much boilerplate**.
There should be simple, semantic methods for common array operations.

---

### The Solution with `collection()`

When you use `collection()`, you get clean, semantic methods:

```javascript
// Automatic collection management - clean and simple
const todos = collection([]);

// Add an item - clean method
todos.$add({
  id: Date.now(),
  text: 'Buy milk',
  completed: false
});

// Remove an item - clean method with predicate
todos.$remove(t => t.id === 123);

// Or remove by direct reference
const item = todos.items[0];
todos.$remove(item);

// Update an item - clean method
todos.$update(t => t.id === 123, { completed: true });

// Clear all items - clean method
todos.$clear();

// Clean, semantic, and easy to understand!
```

**What Just Happened?**

With `collection()`:
- `$add()` instead of manual `push()`
- `$remove()` with smart predicate matching
- `$update()` with automatic find and assign
- `$clear()` instead of manual `length = 0`
- All operations trigger reactive updates

**Benefits:**
- Clean, semantic methods
- No boilerplate code
- Built-in null checks
- Supports predicates or direct values
- Less code, fewer bugs
- Standard collection pattern

---

## How Does It Work?

### Under the Hood

`collection()` creates a reactive state with enhanced array methods:

```
collection(initialItems)
        ↓
Creates reactive state with:
  - items: initialItems (reactive array)
  - $add(item): Push item to array
  - $remove(predicate): Find and remove item
  - $update(predicate, updates): Find and update item
  - $clear(): Empty the array
        ↓
All methods automatically trigger reactive updates
```

**What happens:**

1. Creates reactive state with an `items` array
2. Adds `$add()` method that pushes items to the array
3. Adds `$remove()` method that:
   - Accepts a function predicate or direct value
   - Finds the item using `findIndex()` or `indexOf()`
   - Removes it with `splice()`
4. Adds `$update()` method that:
   - Accepts a function predicate or direct value
   - Finds the item
   - Updates it with `Object.assign()`
5. Adds `$clear()` method that empties the array
6. All changes are reactive and trigger UI updates

---

## Basic Usage

### Creating a Collection

The simplest way to use `collection()`:

```js
// Using the shortcut style
const todos = collection([]);

// Or using the namespace style
const todos = ReactiveUtils.collection([]);

// Or with initial items
const todos = collection([
  { id: 1, text: 'Task 1', completed: false },
  { id: 2, text: 'Task 2', completed: true }
]);

console.log(todos.items);        // Array of items
console.log(todos.items.length); // 2
```

### Adding Items

Use `$add()` to add items:

```js
const todos = collection([]);

// Add a single item
todos.$add({ id: 1, text: 'Buy milk', completed: false });

console.log(todos.items.length); // 1

// Add more items
todos.$add({ id: 2, text: 'Do laundry', completed: false });
todos.$add({ id: 3, text: 'Clean room', completed: false });

console.log(todos.items.length); // 3
```

### Removing Items

Use `$remove()` with a predicate or value:

```js
const todos = collection([
  { id: 1, text: 'Task 1', completed: false },
  { id: 2, text: 'Task 2', completed: false }
]);

// Remove by predicate function
todos.$remove(t => t.id === 1);
console.log(todos.items.length); // 1

// Remove by direct value
const item = todos.items[0];
todos.$remove(item);
console.log(todos.items.length); // 0
```

### Updating Items

Use `$update()` to modify items:

```js
const todos = collection([
  { id: 1, text: 'Task 1', completed: false }
]);

// Update by predicate
todos.$update(t => t.id === 1, { completed: true });

console.log(todos.items[0].completed); // true

// Update multiple properties
todos.$update(t => t.id === 1, {
  text: 'Updated Task',
  completed: false
});
```

### Clearing Items

Use `$clear()` to remove all items:

```js
const todos = collection([
  { id: 1, text: 'Task 1' },
  { id: 2, text: 'Task 2' },
  { id: 3, text: 'Task 3' }
]);

console.log(todos.items.length); // 3

todos.$clear();

console.log(todos.items.length); // 0
```

### Reactive UI Updates

Combine with effects for automatic UI updates:

```js
const todos = collection([]);

effect(() => {
  const count = todos.items.length;
  const completed = todos.items.filter(t => t.completed).length;
  document.getElementById('status').textContent = `${completed} / ${count} completed`;
});

todos.$add({ id: 1, text: 'Task 1', completed: false });
// UI updates automatically: "0 / 1 completed"

todos.$update(t => t.id === 1, { completed: true });
// UI updates automatically: "1 / 1 completed"
```

---

## Common Use Cases

### Use Case 1: Todo List

Manage a list of todos:

```js
const todoList = collection([]);

// Bind to UI
effect(() => {
  const container = document.getElementById('todos');
  container.innerHTML = todoList.items.map((todo, index) => `
    <div class="todo ${todo.completed ? 'completed' : ''}">
      <input type="checkbox"
             ${todo.completed ? 'checked' : ''}
             onchange="toggleTodo(${todo.id})">
      <span>${todo.text}</span>
      <button onclick="removeTodo(${todo.id})">Delete</button>
    </div>
  `).join('');
});

// Show count
effect(() => {
  const active = todoList.items.filter(t => !t.completed).length;
  document.getElementById('count').textContent = `${active} items left`;
});

// Functions
function addTodo(text) {
  todoList.$add({
    id: Date.now(),
    text: text,
    completed: false
  });
}

function toggleTodo(id) {
  const todo = todoList.items.find(t => t.id === id);
  if (todo) {
    todoList.$update(t => t.id === id, { completed: !todo.completed });
  }
}

function removeTodo(id) {
  todoList.$remove(t => t.id === id);
}

function clearCompleted() {
  const completed = todoList.items.filter(t => t.completed);
  completed.forEach(todo => {
    todoList.$remove(todo);
  });
}
```

### Use Case 2: Shopping Cart

Manage cart items with quantities:

```js
const cart = collection([]);

// Add computed for total
cart.$computed('total', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

// Bind to UI
effect(() => {
  document.getElementById('cartTotal').textContent = `$${cart.total.toFixed(2)}`;
  document.getElementById('itemCount').textContent = cart.items.length;
});

// Functions
function addToCart(product) {
  // Check if item already in cart
  const existing = cart.items.find(i => i.id === product.id);

  if (existing) {
    // Update quantity
    cart.$update(i => i.id === product.id, {
      quantity: existing.quantity + 1
    });
  } else {
    // Add new item
    cart.$add({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
}

function removeFromCart(productId) {
  cart.$remove(i => i.id === productId);
}

function updateQuantity(productId, quantity) {
  if (quantity <= 0) {
    removeFromCart(productId);
  } else {
    cart.$update(i => i.id === productId, { quantity });
  }
}

function clearCart() {
  cart.$clear();
}
```

### Use Case 3: User List with Filtering

Manage and filter users:

```js
const users = collection([]);

// Add computed for filtered list
users.$computed('activeUsers', function() {
  return this.items.filter(u => u.active);
});

users.$computed('inactiveUsers', function() {
  return this.items.filter(u => !u.active);
});

// Display users
effect(() => {
  const list = document.getElementById('userList');
  list.innerHTML = users.items.map(user => `
    <div class="user ${user.active ? 'active' : 'inactive'}">
      <span>${user.name}</span>
      <span>${user.email}</span>
      <button onclick="toggleUserStatus(${user.id})">
        ${user.active ? 'Deactivate' : 'Activate'}
      </button>
      <button onclick="removeUser(${user.id})">Remove</button>
    </div>
  `).join('');
});

// Display counts
effect(() => {
  document.getElementById('activeCount').textContent = users.activeUsers.length;
  document.getElementById('inactiveCount').textContent = users.inactiveUsers.length;
});

// Functions
function addUser(name, email) {
  users.$add({
    id: Date.now(),
    name: name,
    email: email,
    active: true
  });
}

function toggleUserStatus(id) {
  const user = users.items.find(u => u.id === id);
  if (user) {
    users.$update(u => u.id === id, { active: !user.active });
  }
}

function removeUser(id) {
  users.$remove(u => u.id === id);
}
```

### Use Case 4: Message Queue

Manage a queue of messages:

```js
const messages = collection([]);

// Auto-remove old messages
messages.$watch('items', () => {
  if (messages.items.length > 5) {
    // Keep only last 5 messages
    messages.items.splice(0, messages.items.length - 5);
  }
});

// Display messages
effect(() => {
  const container = document.getElementById('messages');
  container.innerHTML = messages.items.map(msg => `
    <div class="message ${msg.type}">
      <span>${msg.text}</span>
      <button onclick="dismissMessage(${msg.id})">×</button>
    </div>
  `).join('');
});

// Functions
function showMessage(text, type = 'info') {
  messages.$add({
    id: Date.now(),
    text: text,
    type: type,
    timestamp: new Date()
  });

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    messages.$remove(m => m.id === messages.items[0]?.id);
  }, 5000);
}

function dismissMessage(id) {
  messages.$remove(m => m.id === id);
}

function clearAllMessages() {
  messages.$clear();
}

// Usage
showMessage('Welcome!', 'success');
showMessage('Error occurred', 'error');
showMessage('Loading...', 'info');
```

### Use Case 5: Notification System

Manage notifications with priorities:

```js
const notifications = collection([]);

// Add computed for sorted notifications
notifications.$computed('sortedByPriority', function() {
  return [...this.items].sort((a, b) => b.priority - a.priority);
});

// Display notifications
effect(() => {
  const container = document.getElementById('notifications');
  container.innerHTML = notifications.sortedByPriority.map(notif => `
    <div class="notification priority-${notif.priority}">
      <h4>${notif.title}</h4>
      <p>${notif.message}</p>
      <button onclick="markAsRead(${notif.id})">Mark as Read</button>
      <button onclick="removeNotification(${notif.id})">Dismiss</button>
    </div>
  `).join('');
});

// Display unread count
effect(() => {
  const unread = notifications.items.filter(n => !n.read).length;
  document.getElementById('unreadCount').textContent = unread;
  document.getElementById('unreadBadge').style.display = unread > 0 ? 'inline' : 'none';
});

// Functions
function addNotification(title, message, priority = 1) {
  notifications.$add({
    id: Date.now(),
    title: title,
    message: message,
    priority: priority,
    read: false,
    timestamp: new Date()
  });
}

function markAsRead(id) {
  notifications.$update(n => n.id === id, { read: true });
}

function removeNotification(id) {
  notifications.$remove(n => n.id === id);
}

function clearReadNotifications() {
  const read = notifications.items.filter(n => n.read);
  read.forEach(notif => {
    notifications.$remove(notif);
  });
}

// Usage
addNotification('New Message', 'You have a new message', 2);
addNotification('System Update', 'System will restart in 10 minutes', 3);
addNotification('Reminder', 'Meeting at 3 PM', 1);
```

---

## Advanced Patterns

### Pattern 1: Collection with Validation

Validate items before adding:

```js
const validatedTodos = collection([]);

// Override $add with validation
const originalAdd = validatedTodos.$add.bind(validatedTodos);
validatedTodos.$add = function(item) {
  if (!item.text || item.text.trim() === '') {
    console.error('Todo text is required');
    return;
  }

  if (!item.id) {
    item.id = Date.now();
  }

  originalAdd(item);
};

// Now adds are validated
validatedTodos.$add({ text: 'Valid todo' }); // Works
validatedTodos.$add({ text: '' });           // Rejected
```

### Pattern 2: Collection with Persistence

Auto-save to localStorage:

```js
const persistedTodos = collection([]);

// Load from localStorage
const saved = localStorage.getItem('todos');
if (saved) {
  persistedTodos.items = JSON.parse(saved);
}

// Watch for changes and save
persistedTodos.$watch('items', () => {
  localStorage.setItem('todos', JSON.stringify(persistedTodos.items));
});

// Now changes are automatically saved
persistedTodos.$add({ id: 1, text: 'Task' });
// Saved to localStorage automatically
```

### Pattern 3: Batch Operations

Perform multiple operations efficiently:

```js
const todos = collection([]);

function addMultipleTodos(items) {
  todos.$batch(() => {
    items.forEach(item => {
      todos.$add(item);
    });
  });
}

function removeMultipleTodos(ids) {
  todos.$batch(() => {
    ids.forEach(id => {
      todos.$remove(t => t.id === id);
    });
  });
}

// Batch add
addMultipleTodos([
  { id: 1, text: 'Task 1' },
  { id: 2, text: 'Task 2' },
  { id: 3, text: 'Task 3' }
]);
// Only triggers one update!
```

### Pattern 4: Collection with Undo/Redo

Track history for undo/redo:

```js
const todos = collection([]);
const history = [];
let historyIndex = -1;

// Save state to history
function saveState() {
  const state = JSON.parse(JSON.stringify(todos.items));
  history.splice(historyIndex + 1);
  history.push(state);
  historyIndex++;
}

// Override methods to track history
const originalAdd = todos.$add.bind(todos);
todos.$add = function(item) {
  originalAdd(item);
  saveState();
};

const originalRemove = todos.$remove.bind(todos);
todos.$remove = function(predicate) {
  originalRemove(predicate);
  saveState();
};

const originalUpdate = todos.$update.bind(todos);
todos.$update = function(predicate, updates) {
  originalUpdate(predicate, updates);
  saveState();
};

// Undo/Redo functions
function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    todos.items = JSON.parse(JSON.stringify(history[historyIndex]));
  }
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    todos.items = JSON.parse(JSON.stringify(history[historyIndex]));
  }
}

// Initialize history
saveState();
```

---

## Performance Tips

### Tip 1: Use Computed for Derived Collections

Don't create new arrays on every render:

```js
const todos = collection([]);

// Good - computed (cached)
todos.$computed('completedTodos', function() {
  return this.items.filter(t => t.completed);
});

// Use in effects
effect(() => {
  console.log(todos.completedTodos); // Uses cached value
});
```

### Tip 2: Batch Multiple Operations

Use `$batch()` when adding/removing many items:

```js
const items = collection([]);

// Good - batched
items.$batch(() => {
  for (let i = 0; i < 100; i++) {
    items.$add({ id: i, text: `Item ${i}` });
  }
});
// Only one update!

// Bad - not batched
for (let i = 0; i < 100; i++) {
  items.$add({ id: i, text: `Item ${i}` });
}
// 100 updates!
```

### Tip 3: Use Direct Array Methods When Appropriate

For non-reactive operations, access `.items` directly:

```js
const todos = collection([]);

// Good - direct access for reading
const count = todos.items.length;
const first = todos.items[0];
const found = todos.items.find(t => t.id === 5);

// Use collection methods only for modifications
todos.$add({ id: 1, text: 'New' });
todos.$remove(t => t.id === 1);
```

---

## Common Pitfalls

### Pitfall 1: Forgetting to Access .items

**Problem:** Treating collection as an array:

```js
// WRONG - collection is not an array
const todos = collection([]);
todos.forEach(item => { /* ... */ }); // Error!

// RIGHT - access .items property
todos.items.forEach(item => { /* ... */ }); // Works
```

### Pitfall 2: Modifying Items Directly

**Problem:** Modifying array without using collection methods:

```js
// BAD - bypasses reactive methods
todos.items.push({ id: 1, text: 'Task' });
todos.items.splice(0, 1);

// GOOD - use collection methods
todos.$add({ id: 1, text: 'Task' });
todos.$remove(t => t.id === 1);
```

### Pitfall 3: Wrong Predicate Type

**Problem:** Using wrong type for predicate:

```js
const todos = collection([
  { id: 1, text: 'Task 1' }
]);

// WRONG - predicate should return boolean
todos.$remove(t => t.id); // Returns number, not boolean

// RIGHT - predicate returns boolean
todos.$remove(t => t.id === 1); // Returns true/false
```

### Pitfall 4: Not Checking if Item Exists

**Problem:** Assuming update/remove succeeded:

```js
// BAD - might not find the item
todos.$update(t => t.id === 999, { completed: true });
// No error, but nothing happens

// GOOD - check if item exists first
const item = todos.items.find(t => t.id === 999);
if (item) {
  todos.$update(t => t.id === 999, { completed: true });
} else {
  console.warn('Item not found');
}
```

---

## Real-World Example

Here's a complete example using `collection()`:

```js
// Create a task manager application
const tasks = collection([]);

// Add computed properties
tasks.$computed('activeTasks', function() {
  return this.items.filter(t => !t.completed);
});

tasks.$computed('completedTasks', function() {
  return this.items.filter(t => t.completed);
});

tasks.$computed('highPriorityTasks', function() {
  return this.items.filter(t => t.priority === 'high' && !t.completed);
});

tasks.$computed('stats', function() {
  return {
    total: this.items.length,
    active: this.activeTasks.length,
    completed: this.completedTasks.length,
    highPriority: this.highPriorityTasks.length
  };
});

// Persistence
const savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
  tasks.items = JSON.parse(savedTasks);
}

tasks.$watch('items', () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.items));
});

// UI Bindings
effect(() => {
  const list = document.getElementById('taskList');
  list.innerHTML = tasks.items.map(task => `
    <div class="task ${task.completed ? 'completed' : ''} priority-${task.priority}">
      <input type="checkbox"
             ${task.completed ? 'checked' : ''}
             onchange="toggleTask(${task.id})">
      <div class="task-content">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <span class="priority">${task.priority}</span>
        <span class="due-date">${new Date(task.dueDate).toLocaleDateString()}</span>
      </div>
      <div class="task-actions">
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="removeTask(${task.id})">Delete</button>
      </div>
    </div>
  `).join('');
});

effect(() => {
  const stats = tasks.stats;
  document.getElementById('totalCount').textContent = stats.total;
  document.getElementById('activeCount').textContent = stats.active;
  document.getElementById('completedCount').textContent = stats.completed;
  document.getElementById('highPriorityCount').textContent = stats.highPriority;
});

effect(() => {
  const progress = tasks.items.length > 0
    ? (tasks.completedTasks.length / tasks.items.length) * 100
    : 0;
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${Math.round(progress)}%`;
});

// Functions
function addTask(title, description, priority = 'medium', dueDate = new Date()) {
  tasks.$add({
    id: Date.now(),
    title: title,
    description: description,
    priority: priority,
    dueDate: dueDate,
    completed: false,
    createdAt: new Date()
  });
}

function toggleTask(id) {
  const task = tasks.items.find(t => t.id === id);
  if (task) {
    tasks.$update(t => t.id === id, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date() : null
    });
  }
}

function editTask(id) {
  const task = tasks.items.find(t => t.id === id);
  if (task) {
    const newTitle = prompt('Edit task title:', task.title);
    const newDescription = prompt('Edit task description:', task.description);

    if (newTitle !== null && newDescription !== null) {
      tasks.$update(t => t.id === id, {
        title: newTitle,
        description: newDescription,
        updatedAt: new Date()
      });
    }
  }
}

function removeTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.$remove(t => t.id === id);
  }
}

function clearCompleted() {
  if (confirm('Clear all completed tasks?')) {
    tasks.$batch(() => {
      const completed = tasks.completedTasks;
      completed.forEach(task => {
        tasks.$remove(t => t.id === task.id);
      });
    });
  }
}

function filterByPriority(priority) {
  const filtered = tasks.items.filter(t => t.priority === priority);
  console.log(`${priority} priority tasks:`, filtered);
}

function sortByDueDate() {
  tasks.items.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

// Initialize with some tasks
addTask('Complete project', 'Finish the reactive library documentation', 'high', new Date('2025-12-25'));
addTask('Review code', 'Review pull requests', 'medium', new Date('2025-12-20'));
addTask('Update README', 'Add examples to README', 'low', new Date('2025-12-22'));
```

---

## Summary

**`collection()` provides convenient methods for managing reactive arrays.**

Key takeaways:
- ✅ **Specialized for arrays** - designed for collection management
- ✅ Both **shortcut** (`collection()`) and **namespace** (`ReactiveUtils.collection()`) styles are valid
- ✅ Provides `items` array with **reactive updates**
- ✅ **$add(item)** - Add items cleanly
- ✅ **$remove(predicate)** - Remove with predicate or value
- ✅ **$update(predicate, updates)** - Update items easily
- ✅ **$clear()** - Empty the collection
- ✅ Supports **function predicates** or **direct values**
- ✅ All standard **state methods** available ($computed, $watch, $batch, etc.)
- ⚠️ Access `.items` property, not the collection itself
- ⚠️ Use collection methods for modifications, not direct array methods

**Remember:** `collection()` eliminates boilerplate for array management and provides a clean, semantic API for common collection operations. Perfect for managing lists, queues, and any array-based data! 🎉

➡️ Next, explore [`state()`](state.md) for general state management or [`store()`](store.md) for organized application state!
