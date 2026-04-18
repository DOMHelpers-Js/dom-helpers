[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples and Best Practices

Let's see the Reactive Array Patch solving real problems you'll encounter in web development.

---

## Example 1: Todo List

### The scenario

A todo list where items can be added, removed, and toggled.

```javascript
const app = ReactiveUtils.state({
  todos: [
    { id: 1, text: 'Learn DOMHelpers', done: false },
    { id: 2, text: 'Build something', done: false }
  ]
});

// UI stays in sync automatically
ReactiveUtils.effect(() => {
  const remaining = app.todos.filter(t => !t.done).length;
  document.getElementById('remaining').textContent = `${remaining} remaining`;
});

// Add a todo
function addTodo(text) {
  app.todos.push({ id: Date.now(), text, done: false });
  // Effect re-runs — count updates ✅
}

// Remove a todo
function removeTodo(id) {
  const idx = app.todos.findIndex(t => t.id === id);
  if (idx !== -1) app.todos.splice(idx, 1);
  // Effect re-runs — count updates ✅
}

addTodo('Deploy app');
removeTodo(1);
```

---

## Example 2: Chat Messages

### The scenario

A chat where new messages appear at the bottom and old ones can be removed.

```javascript
const chat = ReactiveUtils.state({
  messages: []
});

ReactiveUtils.effect(() => {
  const container = document.getElementById('messages');
  container.innerHTML = chat.messages
    .map(m => `<div class="msg"><b>${m.user}</b>: ${m.text}</div>`)
    .join('');

  // Auto-scroll to bottom
  container.scrollTop = container.scrollHeight;
});

function sendMessage(user, text) {
  chat.messages.push({ user, text, time: Date.now() });
}

function clearOldMessages() {
  // Keep only the last 50 messages
  if (chat.messages.length > 50) {
    chat.messages.splice(0, chat.messages.length - 50);
  }
}

sendMessage('Alice', 'Hello!');
sendMessage('Bob', 'Hey there!');
```

---

## Example 3: Sortable Table

### The scenario

A table with data that can be sorted by column.

```javascript
const table = ReactiveUtils.state({
  rows: [
    { name: 'Alice', age: 30, score: 92 },
    { name: 'Bob', age: 25, score: 88 },
    { name: 'Charlie', age: 35, score: 95 }
  ],
  sortBy: 'name'
});

ReactiveUtils.effect(() => {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = table.rows
    .map(r => `<tr><td>${r.name}</td><td>${r.age}</td><td>${r.score}</td></tr>`)
    .join('');
});

function sortByColumn(column) {
  table.rows.sort((a, b) => {
    if (typeof a[column] === 'string') return a[column].localeCompare(b[column]);
    return a[column] - b[column];
  });
  // Effect re-runs — table re-renders sorted ✅
  table.sortBy = column;
}

sortByColumn('score');  // Sorts by score, table updates
sortByColumn('name');   // Sorts by name, table updates
```

---

## Example 4: Shopping Cart

### The scenario

A cart where products are added, quantities changed, and items removed.

```javascript
const cart = ReactiveUtils.state({
  items: []
});

ReactiveUtils.effect(() => {
  const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
  document.getElementById('cartCount').textContent = cart.items.length;
});

function addToCart(product) {
  const existing = cart.items.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
    // Need to trigger reactivity for in-place object mutation
    cart.items.splice(cart.items.indexOf(existing), 1, existing);
  } else {
    cart.items.push({ ...product, qty: 1 });
  }
}

function removeFromCart(productId) {
  const idx = cart.items.findIndex(i => i.id === productId);
  if (idx !== -1) cart.items.splice(idx, 1);
}

addToCart({ id: 1, name: 'Widget', price: 9.99 });
addToCart({ id: 2, name: 'Gadget', price: 24.99 });
removeFromCart(1);
```

---

## Example 5: Notification Stack

### The scenario

Notifications that stack up and auto-dismiss.

```javascript
const notifications = ReactiveUtils.state({
  items: []
});

ReactiveUtils.effect(() => {
  const container = document.getElementById('notifications');
  container.innerHTML = notifications.items
    .map(n => `<div class="notification ${n.type}">${n.message}</div>`)
    .join('');
});

function notify(message, type = 'info', duration = 3000) {
  const id = Date.now();
  notifications.items.push({ id, message, type });

  // Auto-dismiss
  setTimeout(() => {
    const idx = notifications.items.findIndex(n => n.id === id);
    if (idx !== -1) notifications.items.splice(idx, 1);
  }, duration);
}

notify('Welcome!', 'success');
notify('New message received', 'info');
notify('Disk almost full', 'warning', 5000);
```

---

## Example 6: Undo/Redo History

### The scenario

Track changes with undo and redo using push and pop.

```javascript
const editor = ReactiveUtils.state({
  content: '',
  history: [],
  future: []
});

function updateContent(newContent) {
  editor.history.push(editor.content);  // Save current state
  editor.future.splice(0);              // Clear redo stack
  editor.content = newContent;
}

function undo() {
  if (editor.history.length === 0) return;
  editor.future.push(editor.content);
  editor.content = editor.history.pop();
}

function redo() {
  if (editor.future.length === 0) return;
  editor.history.push(editor.content);
  editor.content = editor.future.pop();
}

ReactiveUtils.effect(() => {
  document.getElementById('undoBtn').disabled = editor.history.length === 0;
  document.getElementById('redoBtn').disabled = editor.future.length === 0;
  document.getElementById('historyCount').textContent = editor.history.length;
});

updateContent('First draft');
updateContent('Second draft');
undo();   // Back to "First draft"
redo();   // Forward to "Second draft"
```

---

## Example 7: Tag Input

### The scenario

A tag input where tags can be added and removed.

```javascript
const tagInput = ReactiveUtils.state({
  tags: ['javascript', 'css']
});

ReactiveUtils.effect(() => {
  document.getElementById('tagList').innerHTML = tagInput.tags
    .map(tag => `<span class="tag">${tag} <button onclick="removeTag('${tag}')">×</button></span>`)
    .join('');
  document.getElementById('tagCount').textContent = `${tagInput.tags.length} tags`;
});

function addTag(tag) {
  const cleaned = tag.trim().toLowerCase();
  if (cleaned && !tagInput.tags.includes(cleaned)) {
    tagInput.tags.push(cleaned);
  }
}

function removeTag(tag) {
  const idx = tagInput.tags.indexOf(tag);
  if (idx !== -1) tagInput.tags.splice(idx, 1);
}

addTag('html');
removeTag('css');
```

---

## Example 8: Queue System

### The scenario

A queue that processes items from the front and adds to the back.

```javascript
const queue = ReactiveUtils.state({
  items: [],
  processing: false
});

ReactiveUtils.effect(() => {
  document.getElementById('queueSize').textContent = queue.items.length;
  document.getElementById('queueStatus').textContent =
    queue.processing ? 'Processing...' : 'Idle';
});

function enqueue(task) {
  queue.items.push(task);
}

async function processNext() {
  if (queue.items.length === 0 || queue.processing) return;

  queue.processing = true;
  const task = queue.items.shift();  // Remove from front — triggers effect ✅

  await task.execute();
  queue.processing = false;

  // Process next if available
  if (queue.items.length > 0) processNext();
}

enqueue({ name: 'Task 1', execute: () => fetch('/api/task1') });
enqueue({ name: 'Task 2', execute: () => fetch('/api/task2') });
processNext();
```

---

## Best practices

### ✅ Use mutation methods naturally

```javascript
// ✅ Just use array methods normally — they work
app.items.push(newItem);
app.items.splice(2, 1);
app.items.sort((a, b) => a.name.localeCompare(b.name));
```

### ✅ Use non-mutating methods with reassignment

```javascript
// ✅ filter, map, slice return new arrays — reassign to trigger effects
app.items = app.items.filter(item => !item.done);
app.items = app.items.map(item => ({ ...item, selected: false }));
```

### ✅ Use splice for remove-by-index

```javascript
// ✅ splice triggers effects
const idx = app.items.findIndex(i => i.id === targetId);
if (idx !== -1) app.items.splice(idx, 1);
```

### ✅ Use splice for replace-in-place

```javascript
// ✅ Replace an item at a specific index
const idx = app.items.findIndex(i => i.id === targetId);
if (idx !== -1) app.items.splice(idx, 1, updatedItem);
```

### ✅ Manually patch dynamically added arrays

```javascript
// ✅ Patch arrays that didn't exist at state creation time
app.newList = [1, 2, 3];
ReactiveUtils.patchArray(app, 'newList');
```

### ❌ Don't expect filter/map to trigger effects

```javascript
// ❌ This modifies nothing — returns a new array that's discarded
app.items.filter(i => i.active);  // No effect re-run, result is lost

// ✅ Reassign to update
app.items = app.items.filter(i => i.active);  // Effect re-runs
```

---

## Key takeaways

1. **push/pop/splice/sort/etc.** all trigger effects — use them naturally
2. **filter/map/slice** don't trigger effects — reassign the result
3. **splice** is your go-to for removing, replacing, and inserting at specific positions
4. **Dynamically added arrays** need manual patching
5. **Return values** from array methods are preserved exactly as expected
6. The patch is **transparent** — your code reads like normal JavaScript

---

## What's next?

Let's explore the manual patching API and the complete reference.

Let's wrap up!