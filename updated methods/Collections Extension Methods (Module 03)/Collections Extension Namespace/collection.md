# Understanding `collection()` - A Beginner's Guide

## What is `collection()`?

`collection()` creates a **reactive array** with **30+ built-in methods** for managing lists of items. It's like a supercharged array that automatically updates your UI whenever items are added, removed, or changed.

Think of it as a **smart list manager** - you get a reactive array plus tons of helpful methods to work with it.

---

## Why Does `collection()` Exist?

### The Problem: Managing Arrays is Hard

When working with regular arrays in reactive state, you run into problems:

```javascript
// ❌ Regular array in state - awkward
const state = ReactiveUtils.state({
  todos: []
});

// Adding items is verbose
state.todos.push({ id: 1, text: 'Learn', done: false });

// Finding items requires manual code
const item = state.todos.find(t => t.id === 1);

// Removing items is complicated
const index = state.todos.findIndex(t => t.id === 1);
if (index !== -1) {
  state.todos.splice(index, 1);
}

// Updating items is even worse
const todo = state.todos.find(t => t.id === 1);
if (todo) {
  Object.assign(todo, { done: true });
}

// No helper methods for common operations
```

**Problems:**
- Lots of repetitive code
- No built-in methods for common tasks
- Have to write find/filter/update logic manually
- Easy to make mistakes
- Boring and error-prone

### The Solution: `collection()` Has Everything Built-In

```javascript
// ✅ Collection - clean and powerful
const todos = ReactiveUtils.collection([]);

// Clean methods for everything
todos.add({ id: 1, text: 'Learn', done: false });
todos.remove(item => item.id === 1);
todos.update(item => item.id === 1, { done: true });
todos.toggle(item => item.id === 1, 'done');
todos.clear();

// Plus 25+ more methods!
```

**Benefits:**
- Clean, readable code
- 30+ built-in methods
- Automatic reactivity
- No boilerplate
- Less bugs

---

## How `collection()` Works

### What You Get

When you create a collection, you get a **reactive state object** with:

1. An `items` property (the array)
2. 30+ methods to manage the array
3. Computed properties (length, first, last)
4. Full reactivity

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'First todo', done: false }
]);

// Access the array
console.log(todos.items); // [{ id: 1, ... }]

// Use built-in methods
todos.add({ id: 2, text: 'Second todo', done: false });
todos.remove(item => item.id === 1);

// Access computed properties
console.log(todos.length); // 1
console.log(todos.first);  // { id: 2, ... }
console.log(todos.last);   // { id: 2, ... }
```

### The Structure

```javascript
const collection = ReactiveUtils.collection([item1, item2]);

// Internal structure (simplified):
// {
//   items: [item1, item2],        // The actual array
//   add: function() { ... },      // Method to add items
//   remove: function() { ... },   // Method to remove items
//   update: function() { ... },   // Method to update items
//   // ... 27+ more methods
//   length: 2,                    // Computed property
//   first: item1,                 // Computed property
//   last: item2                   // Computed property
// }
```

---

## Basic Usage

### Creating a Collection

```javascript
// Empty collection
const todos = ReactiveUtils.collection([]);

// Collection with initial items
const users = ReactiveUtils.collection([
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false }
]);

// Any type of items
const numbers = ReactiveUtils.collection([1, 2, 3, 4, 5]);
const strings = ReactiveUtils.collection(['apple', 'banana', 'cherry']);
```

### Accessing Items

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Learn Reactive', done: false }
]);

// Access the array directly
console.log(todos.items);        // [{ id: 1, ... }]
console.log(todos.items[0]);     // { id: 1, ... }

// Use computed properties
console.log(todos.length);       // 1
console.log(todos.first);        // { id: 1, ... }
console.log(todos.last);         // { id: 1, ... }
```

### Automatic Reactivity

```javascript
const todos = ReactiveUtils.collection([]);

// This automatically updates the UI
ReactiveUtils.effect(() => {
  console.log(`You have ${todos.length} todos`);
});
// Logs: "You have 0 todos"

todos.add({ id: 1, text: 'First todo', done: false });
// Logs: "You have 1 todos" (automatically!)

todos.add({ id: 2, text: 'Second todo', done: false });
// Logs: "You have 2 todos" (automatically!)
```

---

## Essential Methods (The Top 10)

### 1. `add()` - Add an Item

Add a single item to the end of the collection:

```javascript
const todos = ReactiveUtils.collection([]);

todos.add({ id: 1, text: 'Buy milk', done: false });
todos.add({ id: 2, text: 'Walk dog', done: false });

console.log(todos.length); // 2
```

### 2. `remove()` - Remove an Item

Remove an item by predicate function or the item itself:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false }
]);

// Remove by predicate
todos.remove(item => item.id === 1);

// Remove by item reference
const item = todos.first;
todos.remove(item);

console.log(todos.length); // 0
```

### 3. `update()` - Update an Item

Update properties of an item that matches a predicate:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false }
]);

// Update item with id === 1
todos.update(
  item => item.id === 1,  // Find this item
  { done: true }           // Apply these updates
);

console.log(todos.first.done); // true
```

### 4. `find()` - Find an Item

Find a single item that matches:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true }
]);

const item = todos.find(t => t.id === 2);
console.log(item.text); // "Walk dog"

// Can also pass the item directly
const found = todos.find(item);
console.log(found === item); // true
```

### 5. `filter()` - Filter Items

Get all items that match a condition:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true },
  { id: 3, text: 'Read book', done: false }
]);

const completed = todos.filter(t => t.done);
console.log(completed.length); // 1

const active = todos.filter(t => !t.done);
console.log(active.length); // 2
```

### 6. `clear()` - Remove All Items

Empty the entire collection:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false }
]);

console.log(todos.length); // 2

todos.clear();

console.log(todos.length); // 0
```

### 7. `toggle()` - Toggle a Boolean Field

Toggle a boolean property on an item:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false }
]);

// Toggle the 'done' field (default)
todos.toggle(item => item.id === 1);
console.log(todos.first.done); // true

todos.toggle(item => item.id === 1);
console.log(todos.first.done); // false

// Toggle a different field
todos.items[0].important = false;
todos.toggle(item => item.id === 1, 'important');
console.log(todos.first.important); // true
```

### 8. `map()` - Transform Items

Create a new array with transformed values:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true }
]);

const texts = todos.map(t => t.text);
console.log(texts); // ["Buy milk", "Walk dog"]

const ids = todos.map(t => t.id);
console.log(ids); // [1, 2]
```

### 9. `forEach()` - Iterate Over Items

Execute a function for each item:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true }
]);

todos.forEach(item => {
  console.log(`${item.text}: ${item.done ? '✓' : '✗'}`);
});
// Logs:
// "Buy milk: ✗"
// "Walk dog: ✓"
```

### 10. `sort()` - Sort Items

Sort the collection in place:

```javascript
const todos = ReactiveUtils.collection([
  { id: 3, text: 'Charlie', priority: 2 },
  { id: 1, text: 'Alice', priority: 1 },
  { id: 2, text: 'Bob', priority: 3 }
]);

// Sort by id
todos.sort((a, b) => a.id - b.id);

// Sort by priority
todos.sort((a, b) => a.priority - b.priority);

// Sort by text (alphabetically)
todos.sort((a, b) => a.text.localeCompare(b.text));

console.log(todos.items.map(t => t.text));
// ["Alice", "Bob", "Charlie"]
```

---

## Complete Example: Todo List

Let's build a full todo list application:

```javascript
// Create the collection
const todos = ReactiveUtils.collection([]);

// Add computed properties for filtered views
todos.$computed('active', function() {
  return this.items.filter(t => !t.done);
});

todos.$computed('completed', function() {
  return this.items.filter(t => t.done);
});

todos.$computed('activeCount', function() {
  return this.active.length;
});

// Auto-update the UI
ReactiveUtils.effect(() => {
  // Update counter
  document.getElementById('count').textContent = 
    `${todos.activeCount} item${todos.activeCount !== 1 ? 's' : ''} left`;
  
  // Render todo list
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  
  todos.items.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.done ? 'completed' : '';
    li.innerHTML = `
      <input 
        type="checkbox" 
        ${todo.done ? 'checked' : ''}
        onchange="toggleTodo(${todo.id})"
      >
      <span>${todo.text}</span>
      <button onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    list.appendChild(li);
  });
});

// Add todo
let nextId = 1;

function addTodo(text) {
  if (!text.trim()) return;
  
  todos.add({
    id: nextId++,
    text: text.trim(),
    done: false,
    createdAt: new Date()
  });
}

// Toggle todo
function toggleTodo(id) {
  todos.toggle(item => item.id === id, 'done');
}

// Delete todo
function deleteTodo(id) {
  todos.remove(item => item.id === id);
}

// Clear completed
function clearCompleted() {
  todos.removeWhere(item => item.done);
}

// Mark all complete
function completeAll() {
  todos.updateWhere(
    item => !item.done,
    { done: true }
  );
}

// HTML event handlers
document.getElementById('new-todo').onkeypress = (e) => {
  if (e.key === 'Enter') {
    addTodo(e.target.value);
    e.target.value = '';
  }
};

document.getElementById('clear-completed').onclick = clearCompleted;
document.getElementById('mark-all').onclick = completeAll;
```

**HTML:**
```html
<div id="todo-app">
  <input id="new-todo" placeholder="What needs to be done?" />
  <div id="count">0 items left</div>
  <ul id="todo-list"></ul>
  <button id="mark-all">Mark all complete</button>
  <button id="clear-completed">Clear completed</button>
</div>
```

---

## All 30+ Methods Explained

### Basic Operations (4 methods)

#### `add(item)` - Add an item
```javascript
todos.add({ id: 1, text: 'New todo', done: false });
```

#### `remove(predicate)` - Remove one item
```javascript
todos.remove(item => item.id === 1);
// or
todos.remove(actualItemObject);
```

#### `update(predicate, updates)` - Update one item
```javascript
todos.update(item => item.id === 1, { done: true });
```

#### `clear()` - Remove all items
```javascript
todos.clear();
```

---

### Search & Filter (4 methods)

#### `find(predicate)` - Find one item
```javascript
const item = todos.find(t => t.id === 1);
```

#### `filter(predicate)` - Get matching items
```javascript
const completed = todos.filter(t => t.done);
```

#### `map(fn)` - Transform items to new array
```javascript
const texts = todos.map(t => t.text);
```

#### `forEach(fn)` - Iterate over items
```javascript
todos.forEach(item => console.log(item.text));
```

---

### Sorting & Ordering (2 methods)

#### `sort(compareFn)` - Sort items in place
```javascript
todos.sort((a, b) => a.id - b.id);
```

#### `reverse()` - Reverse item order
```javascript
todos.reverse();
```

---

### Getters (3 computed properties)

#### `length` - Number of items
```javascript
console.log(todos.length);
```

#### `first` - First item
```javascript
console.log(todos.first);
```

#### `last` - Last item
```javascript
console.log(todos.last);
```

---

### Array Access Methods (6 methods)

#### `at(index)` - Get item at index (supports negative)
```javascript
const first = todos.at(0);
const last = todos.at(-1);
```

#### `includes(item)` - Check if item exists
```javascript
if (todos.includes(someItem)) {
  // ...
}
```

#### `indexOf(item)` - Get index of item
```javascript
const index = todos.indexOf(someItem);
```

#### `slice(start, end)` - Get a portion of items
```javascript
const firstThree = todos.slice(0, 3);
```

#### `splice(start, deleteCount, ...items)` - Add/remove at index
```javascript
todos.splice(1, 1); // Remove 1 item at index 1
todos.splice(1, 0, newItem); // Insert at index 1
```

#### `push(...items)` - Add items to end
```javascript
todos.push(item1, item2, item3);
```

---

### Stack Operations (4 methods)

#### `pop()` - Remove and return last item
```javascript
const lastItem = todos.pop();
```

#### `shift()` - Remove and return first item
```javascript
const firstItem = todos.shift();
```

#### `unshift(...items)` - Add items to start
```javascript
todos.unshift(newFirstItem);
```

---

### Advanced Operations (7 methods)

#### `toggle(predicate, field)` - Toggle boolean field
```javascript
todos.toggle(item => item.id === 1, 'done');
```

#### `removeWhere(predicate)` - Remove all matching
```javascript
todos.removeWhere(item => item.done);
```

#### `updateWhere(predicate, updates)` - Update all matching
```javascript
todos.updateWhere(item => !item.done, { priority: 'high' });
```

#### `reset(newItems)` - Replace all items
```javascript
todos.reset([
  { id: 1, text: 'New list', done: false }
]);
```

#### `toArray()` - Get copy as plain array
```javascript
const plainArray = todos.toArray();
```

#### `isEmpty()` - Check if collection is empty
```javascript
if (todos.isEmpty()) {
  console.log('No todos');
}
```

---

## Real-World Examples

### Example 1: User Management

```javascript
const users = ReactiveUtils.collection([]);

// Add computed for active users
users.$computed('activeUsers', function() {
  return this.items.filter(u => u.active);
});

users.$computed('adminUsers', function() {
  return this.items.filter(u => u.role === 'admin');
});

// Add users
users.add({ id: 1, name: 'Alice', role: 'admin', active: true });
users.add({ id: 2, name: 'Bob', role: 'user', active: true });
users.add({ id: 3, name: 'Charlie', role: 'user', active: false });

// Find user by name
function getUserByName(name) {
  return users.find(u => u.name === name);
}

// Deactivate user
function deactivateUser(id) {
  users.update(u => u.id === id, { active: false });
}

// Delete user
function deleteUser(id) {
  users.remove(u => u.id === id);
}

// Promote to admin
function makeAdmin(id) {
  users.update(u => u.id === id, { role: 'admin' });
}

// Display user list automatically
ReactiveUtils.effect(() => {
  const list = document.getElementById('user-list');
  list.innerHTML = '';
  
  users.items.forEach(user => {
    const div = document.createElement('div');
    div.className = user.active ? 'user active' : 'user inactive';
    div.innerHTML = `
      <strong>${user.name}</strong>
      <span class="badge">${user.role}</span>
      <button onclick="deactivateUser(${user.id})">Deactivate</button>
      <button onclick="deleteUser(${user.id})">Delete</button>
    `;
    list.appendChild(div);
  });
  
  // Show stats
  document.getElementById('total-users').textContent = users.length;
  document.getElementById('active-users').textContent = users.activeUsers.length;
  document.getElementById('admin-users').textContent = users.adminUsers.length;
});
```

### Example 2: Shopping Cart

```javascript
const cart = ReactiveUtils.collection([]);

// Add computed properties
cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

cart.$computed('itemCount', function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Add item to cart
function addToCart(product) {
  // Check if already in cart
  const existing = cart.find(item => item.productId === product.id);
  
  if (existing) {
    // Increment quantity
    cart.update(
      item => item.productId === product.id,
      { quantity: existing.quantity + 1 }
    );
  } else {
    // Add new item
    cart.add({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  }
}

// Update quantity
function updateQuantity(productId, quantity) {
  if (quantity <= 0) {
    cart.remove(item => item.productId === productId);
  } else {
    cart.update(
      item => item.productId === productId,
      { quantity }
    );
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart.remove(item => item.productId === productId);
}

// Clear cart
function clearCart() {
  cart.clear();
}

// Display cart automatically
ReactiveUtils.effect(() => {
  const list = document.getElementById('cart-items');
  list.innerHTML = '';
  
  if (cart.isEmpty()) {
    list.innerHTML = '<p class="empty">Your cart is empty</p>';
    return;
  }
  
  cart.items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="details">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <input 
        type="number" 
        value="${item.quantity}"
        min="0"
        onchange="updateQuantity(${item.productId}, parseInt(this.value))"
      >
      <button onclick="removeFromCart(${item.productId})">Remove</button>
      <div class="item-total">
        $${(item.price * item.quantity).toFixed(2)}
      </div>
    `;
    list.appendChild(div);
  });
  
  // Update totals
  document.getElementById('item-count').textContent = cart.itemCount;
  document.getElementById('subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
});
```

### Example 3: Message/Chat System

```javascript
const messages = ReactiveUtils.collection([]);

// Add computed for unread count
messages.$computed('unreadCount', function() {
  return this.items.filter(m => !m.read).length;
});

messages.$computed('unreadMessages', function() {
  return this.items.filter(m => !m.read);
});

// Add message
function addMessage(from, text) {
  messages.add({
    id: Date.now(),
    from,
    text,
    timestamp: new Date(),
    read: false
  });
  
  // Auto-scroll to bottom
  scrollToBottom();
}

// Mark message as read
function markAsRead(id) {
  messages.update(m => m.id === id, { read: true });
}

// Mark all as read
function markAllAsRead() {
  messages.updateWhere(m => !m.read, { read: true });
}

// Delete message
function deleteMessage(id) {
  messages.remove(m => m.id === id);
}

// Clear all messages
function clearMessages() {
  messages.clear();
}

// Display messages automatically
ReactiveUtils.effect(() => {
  const list = document.getElementById('message-list');
  list.innerHTML = '';
  
  if (messages.isEmpty()) {
    list.innerHTML = '<p class="empty">No messages yet</p>';
    return;
  }
  
  messages.items.forEach(msg => {
    const div = document.createElement('div');
    div.className = msg.read ? 'message read' : 'message unread';
    div.innerHTML = `
      <div class="message-header">
        <strong>${msg.from}</strong>
        <span class="time">${formatTime(msg.timestamp)}</span>
      </div>
      <div class="message-body">${msg.text}</div>
      <div class="message-actions">
        <button onclick="markAsRead(${msg.id})">Mark Read</button>
        <button onclick="deleteMessage(${msg.id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
  
  // Update unread badge
  const badge = document.getElementById('unread-badge');
  if (messages.unreadCount > 0) {
    badge.textContent = messages.unreadCount;
    badge.style.display = 'inline';
  } else {
    badge.style.display = 'none';
  }
});

function formatTime(date) {
  return date.toLocaleTimeString();
}

function scrollToBottom() {
  const list = document.getElementById('message-list');
  list.scrollTop = list.scrollHeight;
}
```

### Example 4: File Manager

```javascript
const files = ReactiveUtils.collection([]);

// Add computed properties
files.$computed('totalSize', function() {
  return this.items.reduce((sum, file) => sum + file.size, 0);
});

files.$computed('selectedFiles', function() {
  return this.items.filter(f => f.selected);
});

files.$computed('selectedCount', function() {
  return this.selectedFiles.length;
});

// Add file
function addFile(file) {
  files.add({
    id: Date.now(),
    name: file.name,
    size: file.size,
    type: file.type,
    uploadDate: new Date(),
    selected: false
  });
}

// Toggle file selection
function toggleFileSelection(id) {
  files.toggle(f => f.id === id, 'selected');
}

// Select all files
function selectAll() {
  files.updateWhere(f => true, { selected: true });
}

// Deselect all files
function deselectAll() {
  files.updateWhere(f => true, { selected: false });
}

// Delete selected files
function deleteSelected() {
  files.removeWhere(f => f.selected);
}

// Delete file
function deleteFile(id) {
  files.remove(f => f.id === id);
}

// Sort files
function sortByName() {
  files.sort((a, b) => a.name.localeCompare(b.name));
}

function sortBySize() {
  files.sort((a, b) => b.size - a.size);
}

function sortByDate() {
  files.sort((a, b) => b.uploadDate - a.uploadDate);
}

// Display files automatically
ReactiveUtils.effect(() => {
  const list = document.getElementById('file-list');
  list.innerHTML = '';
  
  if (files.isEmpty()) {
    list.innerHTML = '<p class="empty">No files uploaded</p>';
    return;
  }
  
  files.items.forEach(file => {
    const div = document.createElement('div');
    div.className = file.selected ? 'file selected' : 'file';
    div.innerHTML = `
      <input 
        type="checkbox" 
        ${file.selected ? 'checked' : ''}
        onchange="toggleFileSelection(${file.id})"
      >
      <div class="file-icon">${getFileIcon(file.type)}</div>
      <div class="file-details">
        <div class="file-name">${file.name}</div>
        <div class="file-info">
          ${formatSize(file.size)} • ${formatDate(file.uploadDate)}
        </div>
      </div>
      <button onclick="deleteFile(${file.id})">Delete</button>
    `;
    list.appendChild(div);
  });
  
  // Update stats
  document.getElementById('total-files').textContent = files.length;
  document.getElementById('total-size').textContent = formatSize(files.totalSize);
  document.getElementById('selected-count').textContent = files.selectedCount;
});

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function formatDate(date) {
  return date.toLocaleDateString();
}

function getFileIcon(type) {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎥';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📄';
  return '📎';
}
```

---

## Method Chaining

Many collection methods return `this`, allowing you to chain operations:

```javascript
const todos = ReactiveUtils.collection([]);

// Chain multiple operations
todos
  .add({ id: 1, text: 'First', done: false })
  .add({ id: 2, text: 'Second', done: false })
  .add({ id: 3, text: 'Third', done: true })
  .sort((a, b) => a.id - b.id)
  .forEach(item => console.log(item.text));
```

**Methods that support chaining:**
- `add()`
- `remove()`
- `update()`
- `clear()`
- `sort()`
- `reverse()`
- `splice()`
- `push()`
- `unshift()`
- `toggle()`
- `removeWhere()`
- `updateWhere()`
- `reset()`

**Methods that don't support chaining** (they return values):
- `find()` - returns item or undefined
- `filter()` - returns array
- `map()` - returns array
- `pop()` - returns removed item
- `shift()` - returns removed item
- `toArray()` - returns array
- `isEmpty()` - returns boolean

---

## Common Beginner Questions

### Q: What's the difference between `collection()` and `state()` with an array?

**Answer:**

`collection()` gives you 30+ built-in methods:

```javascript
// ✅ Collection - has built-in methods
const todos = ReactiveUtils.collection([]);
todos.add(item);
todos.remove(item => item.id === 1);
todos.toggle(item => item.id === 1, 'done');

// ⚠️ State - manual array manipulation
const state = ReactiveUtils.state({ todos: [] });
state.todos.push(item);
const index = state.todos.findIndex(item => item.id === 1);
state.todos.splice(index, 1);
```

**Use `collection()` when:**
- Managing a list of items
- Need built-in methods
- Want cleaner code

**Use `state()` with array when:**
- The array is just one property among many
- You don't need collection methods

### Q: How do I access the actual array?

**Answer:** Use the `.items` property:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'First' }
]);

console.log(todos.items);       // [{ id: 1, text: 'First' }]
console.log(todos.items[0]);    // { id: 1, text: 'First' }
console.log(todos.items.length); // 1
```

### Q: Can I use regular array methods on `.items`?

**Answer:** Yes, but use collection methods when available:

```javascript
const todos = ReactiveUtils.collection([...]);

// ✅ Use collection methods (better)
todos.add(item);
todos.remove(item => item.id === 1);

// ⚠️ Can use array methods, but not as clean
todos.items.push(item);
todos.items.splice(index, 1);
```

### Q: Do changes to `.items` trigger reactivity?

**Answer:** Yes! The `.items` array is reactive:

```javascript
const todos = ReactiveUtils.collection([]);

ReactiveUtils.effect(() => {
  console.log('Length:', todos.items.length);
});

todos.items.push({ id: 1, text: 'New' }); // Triggers effect
```

### Q: Can I add computed properties to a collection?

**Answer:** Yes! Use `$computed()`:

```javascript
const todos = ReactiveUtils.collection([...]);

todos.$computed('completedCount', function() {
  return this.items.filter(t => t.done).length;
});

console.log(todos.completedCount);
```

---

## Tips for Beginners

### 1. Use Collection Methods Over Array Methods

```javascript
// ✅ Clean - use collection methods
todos.add(item);
todos.remove(item => item.id === 1);

// ❌ Verbose - direct array manipulation
todos.items.push(item);
const index = todos.items.findIndex(item => item.id === 1);
todos.items.splice(index, 1);
```

### 2. Add Computed Properties for Filtered Views

```javascript
const todos = ReactiveUtils.collection([...]);

// ✅ Add computed for common filters
todos.$computed('active', function() {
  return this.items.filter(t => !t.done);
});

todos.$computed('completed', function() {
  return this.items.filter(t => t.done);
});

// Now easy to access
console.log(todos.active);
console.log(todos.completed);
```

### 3. Use Descriptive Predicates

```javascript
// ❌ Hard to read
todos.remove(t => t.i === 1);

// ✅ Clear and readable
todos.remove(todo => todo.id === 1);
```

### 4. Chain Methods When Appropriate

```javascript
// ✅ Clean chaining
todos
  .add(item1)
  .add(item2)
  .sort((a, b) => a.id - b.id);

// ❌ Separate statements
todos.add(item1);
todos.add(item2);
todos.sort((a, b) => a.id - b.id);
```

### 5. Remember: Collections Are for Lists

```javascript
// ✅ Good - list of items
const todos = ReactiveUtils.collection([...]);
const users = ReactiveUtils.collection([...]);
const products = ReactiveUtils.collection([...]);

// ❌ Bad - not a list
const user = ReactiveUtils.collection([{ name: 'John', age: 25 }]);
// Use state() instead:
const user = ReactiveUtils.state({ name: 'John', age: 25 });
```

---

## Summary

### What `collection()` Does:

1. ✅ Creates a reactive array with 30+ built-in methods
2. ✅ Provides clean API for common operations
3. ✅ Automatically updates UI when items change
4. ✅ Supports computed properties
5. ✅ Perfect for managing lists of items
6. ✅ Chainable methods for fluent code

### The Basic Pattern:

```javascript
// Create a collection
const items = ReactiveUtils.collection([initialItems]);

// Use built-in methods
items.add(newItem);
items.remove(item => item.id === 1);
items.update(item => item.id === 1, { field: 'value' });
items.filter(item => item.active);

// Access properties
console.log(items.length);
console.log(items.first);
console.log(items.items); // The actual array
```

### When to Use `collection()`:

- ✅ Managing lists (todos, users, products, messages)
- ✅ Need built-in methods (add, remove, update, filter)
- ✅ Want clean, readable code
- ✅ Working with arrays that change frequently
- ✅ Need automatic UI updates

### When NOT to Use `collection()`:

- ❌ Single value (use `ref()` or `state()`)
- ❌ Object with properties (use `state()`)
- ❌ Form data (use `form()`)
- ❌ Static array that never changes

---

**Remember:** `collection()` is your **go-to tool for managing lists**. It gives you a reactive array plus 30+ helpful methods to add, remove, update, filter, and manipulate items with clean, readable code. Perfect for todos, users, products, messages, or any list of items! 🎉