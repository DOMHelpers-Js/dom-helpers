# Understanding `collection()` - A Beginner's Guide

## Quick Start (30 seconds)

Want to manage arrays with clean, semantic methods? Here's how:

```js
// Create a reactive collection
const todos = collection([]);

// Add items with a clean method
todos.$add({ id: 1, text: 'Buy milk', completed: false });
todos.$add({ id: 2, text: 'Do laundry', completed: false });

// Remove items by predicate or value
todos.$remove(t => t.id === 1);

// Update items easily
todos.$update(t => t.id === 2, { completed: true });

// Clear all items
todos.$clear();
```

**That's it!** The `collection()` function provides clean, semantic methods for array operations - no more manual `findIndex()`, `splice()`, or `push()` boilerplate!

---

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

```
Manual Array Operations:
┌──────────────────────┐
│ Add item:            │
│ - push()             │
└──────────────────────┘
┌──────────────────────┐
│ Remove item:         │
│ - findIndex()        │
│ - check !== -1       │
│ - splice()           │
└──────────────────────┘
┌──────────────────────┐
│ Update item:         │
│ - findIndex()        │
│ - check !== -1       │
│ - Object.assign()    │
└──────────────────────┘
┌──────────────────────┐
│ Clear items:         │
│ - length = 0         │
└──────────────────────┘

So much boilerplate!
Easy to forget checks!
Same code everywhere!
```

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

In other words, **managing collections requires too much boilerplate**. There should be simple, semantic methods for common array operations.

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

```
collection() Methods:
┌──────────────────────┐
│ Add item:            │
│ - $add(item)         │ ✓ Simple!
└──────────────────────┘
┌──────────────────────┐
│ Remove item:         │
│ - $remove(predicate) │ ✓ Clean!
└──────────────────────┘
┌──────────────────────┐
│ Update item:         │
│ - $update(pred, obj) │ ✓ Semantic!
└──────────────────────┘
┌──────────────────────┐
│ Clear items:         │
│ - $clear()           │ ✓ Clear!
└──────────────────────┘

No boilerplate!
No manual checks!
Consistent pattern!
```

With `collection()`:
- `$add()` instead of manual `push()`
- `$remove()` with smart predicate matching
- `$update()` with automatic find and assign
- `$clear()` instead of manual `length = 0`
- All operations trigger reactive updates

**Benefits:**
- ✅ Clean, semantic methods
- ✅ No boilerplate code
- ✅ Built-in null checks
- ✅ Supports predicates or direct values
- ✅ Less code, fewer bugs
- ✅ Standard collection pattern

---

## Mental Model

Think of `collection()` like a **smart library with an organized catalog system**:

```
Regular Array (Manual Library):
┌────────────────────────┐
│  Books scattered       │
│  on the floor          │
│                        │
│  To find a book:       │
│  1. Look at each book  │
│  2. Check if it's      │
│     the right one      │
│  3. Pick it up         │
│                        │
│  To remove a book:     │
│  1. Find its position  │
│  2. Check if found     │
│  3. Manually remove    │
└────────────────────────┘

Manual, tedious, error-prone


collection() (Smart Catalog System):
┌────────────────────────┐
│  📚 Organized Library  │
│  with Smart Catalog    │
│                        │
│  $add(book)            │
│  → Catalog adds it     │
│                        │
│  $remove(criteria)     │
│  → Catalog finds &     │
│     removes it         │
│                        │
│  $update(criteria,     │
│           changes)     │
│  → Catalog finds &     │
│     updates it         │
│                        │
│  $clear()              │
│  → Catalog clears all  │
└────────────────────────┘

Automated, clean, reliable
```

**Key Insight:** Just like a smart library catalog system handles finding, adding, updating, and removing books automatically, `collection()` provides semantic methods that handle all the boilerplate array operations for you.

---

## How Does It Work?

### Under the Hood

`collection()` creates a reactive state with enhanced array methods:

```
collection(initialItems)
        ↓
┌──────────────────────────┐
│ Creates reactive state:  │
│                          │
│ {                        │
│   items: [...],          │
│                          │
│   $add(item) {           │
│     items.push(item)     │
│   },                     │
│                          │
│   $remove(pred) {        │
│     find & splice        │
│   },                     │
│                          │
│   $update(pred, obj) {   │
│     find & assign        │
│   },                     │
│                          │
│   $clear() {             │
│     empty array          │
│   }                      │
│ }                        │
└──────────┬───────────────┘
           │
           ▼
All methods trigger
reactive updates!
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

// Add computed for filtered lists
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

### Use Case 6: Activity Log

Track user activities:

```js
const activityLog = collection([]);

// Auto-limit to last 100 entries
activityLog.$watch('items', () => {
  if (activityLog.items.length > 100) {
    activityLog.items.splice(0, activityLog.items.length - 100);
  }
});

// Display activities
effect(() => {
  const container = document.getElementById('activity-log');
  container.innerHTML = activityLog.items.slice().reverse().map(activity => `
    <div class="activity ${activity.type}">
      <span class="time">${new Date(activity.timestamp).toLocaleTimeString()}</span>
      <span class="action">${activity.action}</span>
      <span class="details">${activity.details}</span>
    </div>
  `).join('');
});

function logActivity(action, details, type = 'info') {
  activityLog.$add({
    id: Date.now(),
    action: action,
    details: details,
    type: type,
    timestamp: new Date()
  });
}

// Usage
logActivity('User Login', 'John Doe logged in', 'success');
logActivity('File Uploaded', 'document.pdf', 'info');
logActivity('Error', 'Failed to save changes', 'error');
```

### Use Case 7: Playlist Management

Manage music playlist:

```js
const playlist = collection([]);

// Computed for total duration
playlist.$computed('totalDuration', function() {
  return this.items.reduce((total, song) => total + song.duration, 0);
});

// Display playlist
effect(() => {
  const list = document.getElementById('playlist');
  list.innerHTML = playlist.items.map((song, index) => `
    <div class="song ${song.playing ? 'playing' : ''}">
      <span class="index">${index + 1}</span>
      <span class="title">${song.title}</span>
      <span class="artist">${song.artist}</span>
      <span class="duration">${formatDuration(song.duration)}</span>
      <button onclick="playSong(${song.id})">Play</button>
      <button onclick="removeSong(${song.id})">Remove</button>
    </div>
  `).join('');
});

// Display total duration
effect(() => {
  document.getElementById('total-duration').textContent =
    formatDuration(playlist.totalDuration);
});

function addSong(title, artist, duration) {
  playlist.$add({
    id: Date.now(),
    title: title,
    artist: artist,
    duration: duration,
    playing: false
  });
}

function playSong(id) {
  // Stop all other songs
  playlist.items.forEach(song => {
    if (song.playing) {
      playlist.$update(s => s.id === song.id, { playing: false });
    }
  });

  // Play selected song
  playlist.$update(s => s.id === id, { playing: true });
}

function removeSong(id) {
  playlist.$remove(s => s.id === id);
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
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

### Pattern 5: Paginated Collection

Implement pagination:

```js
const items = collection([]);

const pagination = state({
  currentPage: 1,
  itemsPerPage: 10
});

// Computed for paginated items
items.$computed('paginatedItems', function() {
  const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const end = start + pagination.itemsPerPage;
  return this.items.slice(start, end);
});

items.$computed('totalPages', function() {
  return Math.ceil(this.items.length / pagination.itemsPerPage);
});

// Display paginated items
effect(() => {
  const container = document.getElementById('items');
  container.innerHTML = items.paginatedItems.map(item => `
    <div class="item">${item.name}</div>
  `).join('');
});

// Display pagination controls
effect(() => {
  document.getElementById('page-info').textContent =
    `Page ${pagination.currentPage} of ${items.totalPages}`;

  document.getElementById('prev').disabled = pagination.currentPage === 1;
  document.getElementById('next').disabled = pagination.currentPage === items.totalPages;
});

function nextPage() {
  if (pagination.currentPage < items.totalPages) {
    pagination.currentPage++;
  }
}

function prevPage() {
  if (pagination.currentPage > 1) {
    pagination.currentPage--;
  }
}
```

### Pattern 6: Searchable Collection

Add search functionality:

```js
const products = collection([]);

const searchState = state({
  query: '',
  category: 'all'
});

// Computed for filtered items
products.$computed('searchResults', function() {
  return this.items.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(searchState.query.toLowerCase());
    const matchesCategory = searchState.category === 'all' || product.category === searchState.category;
    return matchesQuery && matchesCategory;
  });
});

// Display search results
effect(() => {
  const container = document.getElementById('results');
  container.innerHTML = products.searchResults.map(product => `
    <div class="product">
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <span>$${product.price}</span>
    </div>
  `).join('');

  document.getElementById('result-count').textContent =
    `${products.searchResults.length} results`;
});

// Bind search input
document.getElementById('search').oninput = (e) => {
  searchState.query = e.target.value;
};

document.getElementById('category').onchange = (e) => {
  searchState.category = e.target.value;
};
```

---

## Performance Tips

### Tip 1: Use Computed for Derived Collections

Don't create new arrays on every render:

```js
const todos = collection([]);

// ✅ Good - computed (cached)
todos.$computed('completedTodos', function() {
  return this.items.filter(t => t.completed);
});

// Use in effects
effect(() => {
  console.log(todos.completedTodos); // Uses cached value
});

// ❌ Bad - recalculates every time
effect(() => {
  const completed = todos.items.filter(t => t.completed); // Recalculates!
  console.log(completed);
});
```

### Tip 2: Batch Multiple Operations

Use `$batch()` when adding/removing many items:

```js
const items = collection([]);

// ✅ Good - batched
items.$batch(() => {
  for (let i = 0; i < 100; i++) {
    items.$add({ id: i, text: `Item ${i}` });
  }
});
// Only one update!

// ❌ Bad - not batched
for (let i = 0; i < 100; i++) {
  items.$add({ id: i, text: `Item ${i}` });
}
// 100 updates!
```

### Tip 3: Use Direct Array Methods When Appropriate

For non-reactive operations, access `.items` directly:

```js
const todos = collection([]);

// ✅ Good - direct access for reading
const count = todos.items.length;
const first = todos.items[0];
const found = todos.items.find(t => t.id === 5);

// ✅ Use collection methods only for modifications
todos.$add({ id: 1, text: 'New' });
todos.$remove(t => t.id === 1);
```

### Tip 4: Avoid Frequent Clears and Re-adds

Replace items instead of clearing and re-adding:

```js
const items = collection([]);

// ❌ Bad - inefficient
items.$clear();
newItems.forEach(item => items.$add(item));

// ✅ Better - replace array
items.items = newItems;
```

---

## Common Pitfalls

### Pitfall 1: Forgetting to Access .items

**Problem:** Treating collection as an array:

```js
const todos = collection([]);

// ❌ Wrong - collection is not an array
todos.forEach(item => { /* ... */ }); // Error!
console.log(todos.length); // undefined

// ✅ Right - access .items property
todos.items.forEach(item => { /* ... */ }); // Works
console.log(todos.items.length); // Works
```

### Pitfall 2: Modifying Items Directly

**Problem:** Modifying array without using collection methods:

```js
// ❌ Bad - bypasses reactive methods
todos.items.push({ id: 1, text: 'Task' });
todos.items.splice(0, 1);

// ✅ Good - use collection methods
todos.$add({ id: 1, text: 'Task' });
todos.$remove(t => t.id === 1);
```

**Note:** Direct array modifications still work and trigger reactivity, but using collection methods provides better semantics and consistency.

### Pitfall 3: Wrong Predicate Type

**Problem:** Using wrong type for predicate:

```js
const todos = collection([
  { id: 1, text: 'Task 1' }
]);

// ❌ Wrong - predicate should return boolean
todos.$remove(t => t.id); // Returns number, not boolean

// ✅ Right - predicate returns boolean
todos.$remove(t => t.id === 1); // Returns true/false
```

### Pitfall 4: Not Checking if Item Exists

**Problem:** Assuming update/remove succeeded:

```js
// ❌ Bad - might not find the item
todos.$update(t => t.id === 999, { completed: true });
// No error, but nothing happens

// ✅ Good - check if item exists first
const item = todos.items.find(t => t.id === 999);
if (item) {
  todos.$update(t => t.id === 999, { completed: true });
} else {
  console.warn('Item not found');
}
```

### Pitfall 5: Mutating Objects Inside Items

**Problem:** Directly mutating nested properties doesn't always trigger updates:

```js
const users = collection([
  { id: 1, profile: { name: 'John' } }
]);

// ⚠️ May not trigger updates in all cases
users.items[0].profile.name = 'Jane';

// ✅ Better: Use $update to ensure reactivity
users.$update(u => u.id === 1, {
  profile: { ...users.items[0].profile, name: 'Jane' }
});
```

---

## Real-World Example: Task Manager

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

## FAQ

**Q: When should I use `collection()` vs `state()` with an array?**

A: Use `collection()` when you need **frequent array operations** (add, remove, update). Use `state()` for **complex objects with nested arrays**:

```js
// ✅ Good use of collection() - frequent operations
const todos = collection([]);
todos.$add(item);
todos.$remove(t => t.id === 1);

// ✅ Good use of state() - complex nested structure
const app = state({
  user: { name: 'John' },
  todos: [],
  settings: { theme: 'dark' }
});
```

**Q: Can I use array methods like `map()`, `filter()`, `find()` on a collection?**

A: Yes! Access `.items` to use all standard array methods:

```js
const todos = collection([...]);

const active = todos.items.filter(t => !t.completed);
const first = todos.items.find(t => t.id === 1);
const names = todos.items.map(t => t.text);
```

**Q: Do I always need to use collection methods for changes?**

A: No! Direct array methods work too, but collection methods provide better semantics:

```js
const todos = collection([]);

// Both work and are reactive:
todos.$add(item);        // ✅ Semantic
todos.items.push(item);  // ✅ Also works

// But collection methods are clearer:
todos.$remove(t => t.id === 1);  // ✅ Clear intent
todos.items.splice(todos.items.findIndex(t => t.id === 1), 1); // ❌ Verbose
```

**Q: Can I use `$remove()` with a direct value instead of a predicate?**

A: Yes! `$remove()` accepts both predicates and direct values:

```js
const todos = collection([...]);

// With predicate
todos.$remove(t => t.id === 1);

// With direct value
const item = todos.items[0];
todos.$remove(item);
```

**Q: How do I sort or reverse a collection?**

A: Use array methods on `.items`:

```js
const todos = collection([...]);

// Sort
todos.items.sort((a, b) => a.id - b.id);

// Reverse
todos.items.reverse();

// These trigger reactive updates!
```

**Q: Can I add multiple items at once?**

A: Yes, but use `$batch()` for better performance:

```js
const todos = collection([]);

// Add multiple items
todos.$batch(() => {
  items.forEach(item => todos.$add(item));
});

// Or directly assign
todos.items = [...newItems];
```

**Q: Does `collection()` support computed properties?**

A: Absolutely! All `state()` methods work on collections:

```js
const todos = collection([]);

todos.$computed('activeCount', function() {
  return this.items.filter(t => !t.completed).length;
});

console.log(todos.activeCount); // Cached computed value
```

**Q: Can I nest collections?**

A: Yes, but consider if you really need nested collections:

```js
// Nested collections work
const projects = collection([]);
projects.$add({
  id: 1,
  name: 'Project 1',
  tasks: collection([])
});

// Access nested collection
projects.items[0].tasks.$add({ text: 'Task 1' });
```

**Q: How do I check if a collection is empty?**

A: Check the `.items.length`:

```js
const todos = collection([]);

if (todos.items.length === 0) {
  console.log('No todos');
}

// Or create a computed
todos.$computed('isEmpty', function() {
  return this.items.length === 0;
});
```

---

## Summary

**`collection()` provides convenient methods for managing reactive arrays.**

Key takeaways:

✅ **Specialized for arrays** - designed for collection management
✅ Both **shortcut** (`collection()`) and **namespace** (`ReactiveUtils.collection()`) styles are valid
✅ Provides `items` array with **reactive updates**
✅ **$add(item)** - Add items cleanly
✅ **$remove(predicate)** - Remove with predicate or value
✅ **$update(predicate, updates)** - Update items easily
✅ **$clear()** - Empty the collection
✅ Supports **function predicates** or **direct values**
✅ All standard **state methods** available ($computed, $watch, $batch, etc.)
✅ Access `.items` for array methods (map, filter, find, etc.)

**Mental Model:** Think of `collection()` as a **smart library with an organized catalog system** - it provides semantic methods that handle all the boilerplate array operations (finding, adding, updating, removing) automatically.

**Remember:** `collection()` eliminates boilerplate for array management and provides a clean, semantic API for common collection operations. Perfect for managing lists, queues, and any array-based data!

**Next Steps:**
- Learn about [`state()`](01_state.md) for general state management
- Explore [`ref()`](03_ref.md) for single reactive values
- Check out [`$computed`](../03_Computed/01_computed.md) for derived values
- Master [`effect()`](../02_Effects/01_effect.md) for reactive UI updates
