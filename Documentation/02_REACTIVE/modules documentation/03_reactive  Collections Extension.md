# DOM Helpers - Collections Extension v1.0.0

## 📚 Overview

The **Collections Extension** provides enhanced reactive collection management with a rich set of array manipulation methods. It's a standalone extension that works with the Reactive State system to provide a more intuitive API for managing lists of items.

---

## 🎯 Core Creation Methods

### 1. **Collections.create(items) / ReactiveUtils.collection(items)**
Creates a reactive collection with enhanced methods.

```javascript
// Using Collections
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true }
]);

// Or using ReactiveUtils
const todos = ReactiveUtils.collection([
  { id: 1, text: "Task 1", done: false }
]);

// Or alias
const todos = ReactiveUtils.list([...]);
```

### 2. **Collections.createWithComputed(items, computed)**
Creates a collection with computed properties.

```javascript
const todos = Collections.createWithComputed(
  [
    { id: 1, text: "Task 1", done: false },
    { id: 2, text: "Task 2", done: true }
  ],
  {
    // Computed properties
    remaining() {
      return this.items.filter(t => !t.done).length;
    },
    completed() {
      return this.items.filter(t => t.done).length;
    },
    progress() {
      return this.items.length > 0 
        ? (this.completed / this.items.length) * 100 
        : 0;
    }
  }
);

console.log(todos.remaining);   // 1
console.log(todos.completed);   // 1
console.log(todos.progress);    // 50
```

### 3. **Collections.createFiltered(collection, predicate)**
Creates a filtered view that auto-syncs with source collection.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true },
  { id: 3, text: "Task 3", done: false }
]);

// Create filtered view
const activeTodos = Collections.createFiltered(
  todos,
  todo => !todo.done
);

console.log(activeTodos.length);  // 2

// When source changes, filtered view updates automatically
todos.add({ id: 4, text: "Task 4", done: false });
console.log(activeTodos.length);  // 3 (auto-updated!)
```

---

## 🔧 Collection Methods

### 4. **collection.add(item)**
Adds an item to the collection.

```javascript
const todos = Collections.create([]);

todos.add({ id: 1, text: "New task", done: false });
todos.add({ id: 2, text: "Another task", done: false });

console.log(todos.length);  // 2
```

### 5. **collection.remove(predicate)**
Removes an item by predicate function or value.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true }
]);

// Remove by predicate function
todos.remove(todo => todo.id === 1);

// Remove by value
const item = todos.first;
todos.remove(item);

console.log(todos.length);  // 0
```

### 6. **collection.update(predicate, updates)**
Updates an item by predicate or value.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: false }
]);

// Update by predicate
todos.update(
  todo => todo.id === 1,
  { done: true, text: "Updated task" }
);

// Update by value
const item = todos.first;
todos.update(item, { done: true });
```

### 7. **collection.clear()**
Removes all items from the collection.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1" },
  { id: 2, text: "Task 2" }
]);

todos.clear();
console.log(todos.length);  // 0
console.log(todos.isEmpty());  // true
```

### 8. **collection.find(predicate)**
Finds an item by predicate or value.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true }
]);

// Find by predicate
const todo = todos.find(t => t.id === 2);
console.log(todo.text);  // "Task 2"

// Find by value
const found = todos.find(todos.first);
```

### 9. **collection.filter(predicate)**
Filters items by predicate (returns array).

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true },
  { id: 3, text: "Task 3", done: false }
]);

const activeTodos = todos.filter(t => !t.done);
console.log(activeTodos.length);  // 2
```

### 10. **collection.map(fn)**
Maps items to new array.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true }
]);

const texts = todos.map(t => t.text);
console.log(texts);  // ["Task 1", "Task 2"]
```

### 11. **collection.forEach(fn)**
Iterates over items.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1" },
  { id: 2, text: "Task 2" }
]);

todos.forEach((todo, index) => {
  console.log(`${index + 1}. ${todo.text}`);
});
// 1. Task 1
// 2. Task 2
```

### 12. **collection.sort(compareFn)**
Sorts items in place.

```javascript
const todos = Collections.create([
  { id: 3, text: "C", priority: 2 },
  { id: 1, text: "A", priority: 1 },
  { id: 2, text: "B", priority: 3 }
]);

// Sort by priority
todos.sort((a, b) => a.priority - b.priority);

// Sort by text
todos.sort((a, b) => a.text.localeCompare(b.text));
```

### 13. **collection.reverse()**
Reverses the order of items.

```javascript
const items = Collections.create([1, 2, 3, 4, 5]);

items.reverse();
console.log(items.items);  // [5, 4, 3, 2, 1]
```

### 14. **collection.toggle(predicate, field)**
Toggles a boolean field on an item.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true }
]);

// Toggle 'done' field (default)
todos.toggle(t => t.id === 1);
console.log(todos.first.done);  // true

// Toggle custom field
todos.toggle(t => t.id === 1, 'archived');
```

### 15. **collection.removeWhere(predicate)**
Removes all items matching predicate.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true },
  { id: 3, text: "Task 3", done: true }
]);

// Remove all completed todos
todos.removeWhere(todo => todo.done);
console.log(todos.length);  // 1
```

### 16. **collection.updateWhere(predicate, updates)**
Updates all items matching predicate.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: false },
  { id: 3, text: "Task 3", done: true }
]);

// Mark all incomplete todos as urgent
todos.updateWhere(
  todo => !todo.done,
  { urgent: true }
);
```

### 17. **collection.reset(newItems)**
Replaces all items with new array.

```javascript
const todos = Collections.create([
  { id: 1, text: "Old task" }
]);

// Replace with new items
todos.reset([
  { id: 2, text: "New task 1" },
  { id: 3, text: "New task 2" }
]);

console.log(todos.length);  // 2
```

### 18. **collection.push(...items)**
Adds items to end (standard array method).

```javascript
const items = Collections.create([1, 2, 3]);

items.push(4, 5, 6);
console.log(items.length);  // 6
```

### 19. **collection.pop()**
Removes and returns last item.

```javascript
const items = Collections.create([1, 2, 3]);

const last = items.pop();
console.log(last);  // 3
console.log(items.length);  // 2
```

### 20. **collection.shift()**
Removes and returns first item.

```javascript
const items = Collections.create([1, 2, 3]);

const first = items.shift();
console.log(first);  // 1
console.log(items.length);  // 2
```

### 21. **collection.unshift(...items)**
Adds items to beginning.

```javascript
const items = Collections.create([3, 4, 5]);

items.unshift(1, 2);
console.log(items.items);  // [1, 2, 3, 4, 5]
```

### 22. **collection.splice(start, deleteCount, ...items)**
Adds/removes items at index.

```javascript
const items = Collections.create([1, 2, 3, 4, 5]);

// Remove 2 items starting at index 1
items.splice(1, 2);
console.log(items.items);  // [1, 4, 5]

// Insert items at index 1
items.splice(1, 0, 2, 3);
console.log(items.items);  // [1, 2, 3, 4, 5]
```

### 23. **collection.at(index)**
Gets item at index.

```javascript
const items = Collections.create([10, 20, 30, 40, 50]);

console.log(items.at(0));   // 10
console.log(items.at(2));   // 30
console.log(items.at(-1));  // 50 (last)
```

### 24. **collection.includes(item)**
Checks if item exists in collection.

```javascript
const items = Collections.create([1, 2, 3, 4, 5]);

console.log(items.includes(3));  // true
console.log(items.includes(10)); // false
```

### 25. **collection.indexOf(item)**
Gets index of item.

```javascript
const items = Collections.create([10, 20, 30, 40]);

console.log(items.indexOf(30));  // 2
console.log(items.indexOf(99));  // -1
```

### 26. **collection.slice(start, end)**
Returns shallow copy of portion.

```javascript
const items = Collections.create([1, 2, 3, 4, 5]);

const subset = items.slice(1, 4);
console.log(subset);  // [2, 3, 4]
```

### 27. **collection.toArray()**
Converts collection to plain array.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1" },
  { id: 2, text: "Task 2" }
]);

const array = todos.toArray();
console.log(Array.isArray(array));  // true
```

### 28. **collection.isEmpty()**
Checks if collection is empty.

```javascript
const items = Collections.create([]);

console.log(items.isEmpty());  // true

items.add(1);
console.log(items.isEmpty());  // false
```

---

## 🔑 Collection Properties (Getters)

### 29. **collection.length**
Gets number of items.

```javascript
const items = Collections.create([1, 2, 3]);
console.log(items.length);  // 3
```

### 30. **collection.first**
Gets first item.

```javascript
const items = Collections.create([10, 20, 30]);
console.log(items.first);  // 10
```

### 31. **collection.last**
Gets last item.

```javascript
const items = Collections.create([10, 20, 30]);
console.log(items.last);  // 30
```

### 32. **collection.items**
Direct access to underlying array.

```javascript
const todos = Collections.create([
  { id: 1, text: "Task 1" }
]);

console.log(todos.items);  // [{ id: 1, text: "Task 1" }]
console.log(Array.isArray(todos.items));  // true
```

---

## 📝 Practical Examples

### Example 1: Todo List Manager
```javascript
const todos = Collections.createWithComputed(
  [],
  {
    remaining() {
      return this.items.filter(t => !t.done).length;
    },
    completed() {
      return this.items.filter(t => t.done).length;
    },
    allDone() {
      return this.items.length > 0 && this.remaining === 0;
    }
  }
);

// Bind to DOM
todos.$bind({
  '#todoCount': () => `${todos.remaining} remaining`,
  '#completedCount': () => `${todos.completed} completed`,
  '#allDoneMessage': {
    hidden: () => !todos.allDone,
    textContent: () => 'All tasks completed! 🎉'
  }
});

// Add todo
function addTodo(text) {
  todos.add({
    id: Date.now(),
    text,
    done: false,
    createdAt: new Date()
  });
}

// Toggle todo
function toggleTodo(id) {
  todos.toggle(t => t.id === id, 'done');
}

// Remove todo
function removeTodo(id) {
  todos.remove(t => t.id === id);
}

// Clear completed
function clearCompleted() {
  todos.removeWhere(t => t.done);
}

// Mark all done
function markAllDone() {
  todos.updateWhere(
    t => !t.done,
    { done: true }
  );
}
```

### Example 2: Shopping Cart
```javascript
const cart = Collections.createWithComputed(
  [],
  {
    subtotal() {
      return this.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
    },
    tax() {
      return this.subtotal * 0.1;
    },
    total() {
      return this.subtotal + this.tax;
    },
    itemCount() {
      return this.items.reduce((sum, item) => 
        sum + item.quantity, 0
      );
    }
  }
);

// Bind to DOM
cart.$bind({
  '#cartCount': () => cart.itemCount,
  '#subtotal': () => `$${cart.subtotal.toFixed(2)}`,
  '#tax': () => `$${cart.tax.toFixed(2)}`,
  '#total': () => `$${cart.total.toFixed(2)}`,
  '#emptyMessage': {
    hidden: () => !cart.isEmpty()
  }
});

// Add to cart
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  
  if (existing) {
    cart.update(existing, { 
      quantity: existing.quantity + 1 
    });
  } else {
    cart.add({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
}

// Update quantity
function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    cart.remove(item => item.id === productId);
  } else {
    cart.update(
      item => item.id === productId,
      { quantity: newQuantity }
    );
  }
}

// Empty cart
function emptyCart() {
  cart.clear();
}
```

### Example 3: User List with Filtering
```javascript
const users = Collections.create([
  { id: 1, name: "John", role: "admin", active: true },
  { id: 2, name: "Jane", role: "user", active: true },
  { id: 3, name: "Bob", role: "user", active: false }
]);

// Create filtered views
const activeUsers = Collections.createFiltered(
  users,
  u => u.active
);

const admins = Collections.createFiltered(
  users,
  u => u.role === "admin"
);

// Bind counts
activeUsers.$bind({
  '#activeUserCount': () => activeUsers.length
});

admins.$bind({
  '#adminCount': () => admins.length
});

// Add user (automatically updates filtered views)
function addUser(name, role) {
  users.add({
    id: Date.now(),
    name,
    role,
    active: true
  });
  // activeUsers and admins automatically update!
}

// Deactivate user
function deactivateUser(id) {
  users.update(
    u => u.id === id,
    { active: false }
  );
  // activeUsers automatically updates!
}
```

### Example 4: Message Queue
```javascript
const messages = Collections.createWithComputed(
  [],
  {
    unreadCount() {
      return this.items.filter(m => !m.read).length;
    },
    hasUnread() {
      return this.unreadCount > 0;
    }
  }
);

// Auto-remove old messages
messages.$watch('items', () => {
  if (messages.length > 50) {
    messages.splice(0, messages.length - 50);
  }
});

// Bind to DOM
messages.$bind({
  '#messageCount': () => messages.length,
  '#unreadBadge': {
    textContent: () => messages.unreadCount,
    hidden: () => !messages.hasUnread
  }
});

// Add message
function addMessage(text, sender) {
  messages.add({
    id: Date.now(),
    text,
    sender,
    read: false,
    timestamp: new Date()
  });
}

// Mark as read
function markAsRead(id) {
  messages.update(
    m => m.id === id,
    { read: true }
  );
}

// Mark all as read
function markAllRead() {
  messages.updateWhere(
    m => !m.read,
    { read: true }
  );
}

// Delete old messages
function deleteOldMessages(days = 30) {
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  messages.removeWhere(m => m.timestamp < cutoff);
}
```

### Example 5: Task Priority Queue
```javascript
const tasks = Collections.create([
  { id: 1, text: "Low priority", priority: 1 },
  { id: 2, text: "High priority", priority: 3 },
  { id: 3, text: "Medium priority", priority: 2 }
]);

// Auto-sort by priority
tasks.$watch('items', () => {
  tasks.sort((a, b) => b.priority - a.priority);
});

// Get next task
function getNextTask() {
  return tasks.first;  // Highest priority
}

// Complete task
function completeTask() {
  const task = tasks.shift();  // Remove first (highest priority)
  console.log('Completed:', task.text);
}

// Add urgent task
function addUrgentTask(text) {
  tasks.add({
    id: Date.now(),
    text,
    priority: 3
  });
  // Auto-sorts to top!
}
```

---

## ⚡ Method Chaining

Most methods return `this` for chaining:

```javascript
const todos = Collections.create([])
  .add({ id: 1, text: "Task 1", done: false })
  .add({ id: 2, text: "Task 2", done: false })
  .add({ id: 3, text: "Task 3", done: true })
  .removeWhere(t => t.done)
  .updateWhere(t => !t.done, { urgent: true })
  .sort((a, b) => a.text.localeCompare(b.text));

console.log(todos.length);  // 2 (after chaining)
```

---

## 🚨 Important Notes

1. **Reactive by Default** - All collections are reactive
2. **Direct Array Access** - Use `.items` to access underlying array
3. **Method Chaining** - Most methods support chaining
4. **Auto-Computed** - Use `createWithComputed()` for computed properties
5. **Filtered Views** - Use `createFiltered()` for auto-syncing views
6. **Works with Reactive Array Patch** - If loaded, array methods trigger reactivity

This extension makes managing collections of data intuitive and powerful!