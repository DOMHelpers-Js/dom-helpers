# Understanding `collection.$remove()` - A Beginner's Guide

## Quick Start (30 seconds)

```js
// Create a reactive todo list
const todos = collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Call mom', done: true }
]);

// Remove completed todos - UI updates automatically!
todos.$remove(todo => todo.done);

// Setup auto-update (write once, works forever)
effect(() => {
  document.querySelector('#count').textContent = todos.items.length;
});
```

**That's it!** When you `$remove()`, everything updates automatically. ✨

**Want to understand how this works?** Keep reading below!

---

## What is `collection.$remove()`?

`collection.$remove()` is a **collection instance method** that removes items from a reactive collection created with `ReactiveUtils.collection()` or `ReactiveUtils.list()`. It accepts either a predicate function or a direct value to match and remove.

Think of it as **a smart "delete button"** for your arrays - instead of manually finding and removing items and remembering to update the UI, `$remove()` does both automatically with clean, semantic syntax.

---

## Syntax

```js
// Using collection instance
collection.$remove(predicate)

// Remove by predicate function
const todos = collection([...]);
todos.$remove(todo => todo.completed);

// Remove by direct value
const numbers = collection([1, 2, 3]);
numbers.$remove(2);
```

**Both shortcut and namespace styles work** when creating collections:
- **Shortcut style**: `collection()` - Clean and concise
- **Namespace style**: `ReactiveUtils.collection()` - Explicit and clear

**Parameters:**
- `predicate` (Function|any):
  - **Function**: A function that receives each item and returns `true` to remove it
  - **Value**: A direct value to match and remove

**Returns:**
- The collection object (for chaining)

---

## Why Does This Exist?

### The Problem: Removing Items and Updating UI in Plain JavaScript

Imagine you're building a todo app. A user completes a task and wants to delete it. How do you remove specific items from a list AND update the UI?

**The Problem Visualized:**

**Without `$remove()` - Manual Updates:**
```
User deletes completed task
       ↓
   Find in array ─────┐
       ↓              │
   Remove with splice │  ← You must remember
       ↓              │     to do ALL of these!
   Update counter     │
       ↓              │
   Re-render list ────┘
```

**With `$remove()` - Automatic Updates:**
```
User deletes completed task
       ↓
   $remove(predicate) ─┐
                       ↓
               ┌───────────────┐
               │  Reactivity   │
               │    System     │
               └───────┬───────┘
                       ↓
          ┌────────────┼────────────┐
          ↓            ↓            ↓
     Counter       List         Stats
     updates      updates      updates

Everything happens automatically! ✨
```

### ❌ Plain JavaScript Approach - Manual Everything

```js
// Plain JavaScript - no reactivity
let todos = [
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Call dentist', completed: true },
  { id: 3, text: 'Finish project', completed: false }
];

// You must manually update the DOM every time you remove
function deleteTodo(todoId) {
  // Step 1: Find and remove from array
  const index = todos.findIndex(t => t.id === todoId);
  if (index === -1) {
    console.warn('Todo not found');
    return;
  }

  todos.splice(index, 1);

  // Step 2: Manually update the counter
  document.querySelector('#todo-count').textContent = todos.length;

  // Step 3: Manually update the completed counter
  const completed = todos.filter(t => t.completed).length;
  document.querySelector('#completed-count').textContent = completed;

  // Step 4: Manually re-render the entire list
  renderTodos();
  // If you forget any of these, UI is out of sync!
}

// Remove all completed todos
function clearCompleted() {
  // Step 1: Filter out completed todos
  todos = todos.filter(t => !t.completed);

  // Step 2: Manually update ALL UI elements
  document.querySelector('#todo-count').textContent = todos.length;
  document.querySelector('#completed-count').textContent = '0';
  renderTodos();
  // Must remember to call all update functions!
}

function renderTodos() {
  const list = document.querySelector('#todo-list');
  list.innerHTML = ''; // Clear everything

  // Rebuild the entire list from scratch
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.text;
    list.appendChild(li);
  });
}

// Initial render
renderTodos();
document.querySelector('#todo-count').textContent = todos.length;

deleteTodo(2);
clearCompleted();
```

**Code explanation:**
- `deleteTodo()` must manually:
  1. Find the index with `findIndex()`
  2. Remove with `splice()`
  3. Update todo count in DOM
  4. Update completed count in DOM
  5. Re-render the entire list
- `clearCompleted()` filters the array but then must manually update every UI element
- If you forget to call `renderTodos()` or update any counter, the UI becomes out of sync
- Every delete operation requires remembering 4-5 manual DOM update calls

**What's the Real Issue?**

**Problems:**
- When you remove an item, nothing else in your code knows about it automatically
- JavaScript doesn't notify the UI that something was removed
- You must manually call update functions after every removal
- Easy to forget updating parts of the UI
- The array changes, but nothing reacts to it

**Why This Becomes a Problem:**

As your app grows, this leads to several issues:
❌ Changes are invisible to the rest of your application
❌ The UI doesn't update unless you manually tell it to
❌ You end up writing extra code just to sync the UI
❌ Data and UI easily get out of sync
❌ Same update logic repeated everywhere

In other words, **manual array manipulation requires constant vigilance**.
You remove data — **but you must remember to update everything that depends on it**.

---

## The Solution with `collection.$remove()`

`$remove()` provides a **semantic, flexible, and chainable** way to remove items with automatic reactivity.

### ✅ Using `collection.$remove()` - Clean and Automatic

```js
// Create a reactive collection
const todos = collection([
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Call dentist', completed: true },
  { id: 3, text: 'Finish project', completed: false }
]);

// Set up automatic DOM updates (write once, works forever!)
effect(() => {
  // This runs automatically whenever todos change
  const count = todos.items.length;
  const completed = todos.items.filter(t => t.completed).length;
  document.querySelector('#todo-count').textContent = count;
  document.querySelector('#completed-count').textContent = completed;
});

// Remove by ID - clean and semantic
todos.$remove(todo => todo.id === 2);
// Effect runs automatically! DOM updates without manual calls! ✨

// Remove all completed todos
todos.$remove(todo => todo.completed);
// Effect runs again! Both counters update automatically!

// Chain operations
todos
  .$remove(todo => todo.completed)
  .$add({ id: 4, text: 'New task', completed: false });
// Effect runs, UI updates automatically! ✨
```

**What just happened?**
1. You removed items using `$remove()` with a clean predicate
2. The `effect()` detected the change automatically
3. The DOM updated without you calling anything
4. You can chain multiple operations together

**Benefits:**

1. ✅ **Automatic** - DOM updates happen by themselves
2. ✅ **Semantic** - Clearly expresses "remove items matching condition"
3. ✅ **Flexible** - Accept predicate function OR direct value
4. ✅ **Chainable** - Returns collection for method chaining
5. ✅ **Consistent** - Matches other collection methods (`$add`, `$update`, `$clear`)
6. ✅ **Less code** - Write the update logic once, it works forever

---

## Mental Model: The Smart Filter

Think of `collection.$remove()` like a **smart spam filter**:

**Regular filter (plain array):**
```
You mark items to delete
       ↓
You delete them manually
       ↓
You must tell everyone manually: "Hey, I removed some items!"
```

**Smart filter (reactive collection):**
```
You call $remove(predicate)
       ↓
System automatically finds and removes matches
       ↓
┌──────────────┬──────────────┬──────────────┐
↓              ↓              ↓
Counter        List         Stats
updates        updates      updates
automatically! automatically! automatically!
```

**Key insight:** `$remove()` isn't just filtering an array - it's **intelligently removing** and **broadcasting** the changes to everyone watching.

**Real-world analogy:** It's like using email filters:
- You don't manually delete each spam email
- You don't update your inbox count yourself
- You don't refresh each folder manually
- The system does it all automatically

With `$remove()`:
- You don't manually find and remove each item
- You don't update each UI element yourself
- You don't call render functions
- The reactive system does it automatically

---

## How Does It Work?

When you call `$remove()`, here's the magic that happens automatically:

```
┌─────────────────────────────────────────────────────────────┐
│  YOU CALL:  todos.$remove(t => t.completed)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 1: Test Each Item          │
         │  Evaluate predicate for all      │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 2: Remove Matches          │
         │  splice() items where true       │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 3: Trigger Reactivity      │
         │  Notify all watchers             │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 4: Effects Auto-Run        │
         │  effect(() => { ... })           │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 5: DOM Updates             │
         │  UI reflects removed items       │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 6: Return Collection       │
         │  Enables method chaining         │
         └──────────────────────────────────┘
```

**What's happening behind the scenes:**

1. **Test each item** - Evaluates the predicate function (or value match) for each item
2. **Remove matches** - Uses `splice()` to remove items where predicate returns `true`
3. **Trigger reactivity** - The reactive system detects the array changes
4. **Notify watchers** - All effects watching this collection are notified
5. **Effects re-run** - Each `effect()` re-executes with the updated array
6. **DOM updates** - Your UI updates automatically to reflect removed items
7. **Return collection** - Returns the collection object for chaining

Think of it as: **You remove → System reacts → UI updates** - all automatic!

---

## Basic Usage

Here's how to use `$remove()` in the most common scenarios:

```js
// Create a collection
const todos = collection([
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Call dentist', completed: true },
  { id: 3, text: 'Finish project', completed: false }
]);

// Remove by predicate function
todos.$remove(todo => todo.id === 2);

// Remove all completed todos
todos.$remove(todo => todo.completed);

// Remove by direct value (for primitive arrays)
const numbers = collection([1, 2, 3, 4, 5]);
numbers.$remove(3);  // Removes 3
console.log(numbers.items);  // [1, 2, 4, 5]

// Chain operations
todos.$remove(todo => todo.completed)
     .$add({ id: 4, text: 'New task', completed: false });
```

---

## Common Use Cases

### Use Case 1: Delete Todo by ID

```js
const todos = collection([
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Call dentist', completed: true },
  { id: 3, text: 'Finish project', completed: false }
]);

// Delete todo by ID
function deleteTodo(todoId) {
  const todo = todos.items.find(t => t.id === todoId);
  if (!todo) {
    console.warn('Todo not found');
    return;
  }

  todos.$remove(t => t.id === todoId);
  console.log(`Deleted: "${todo.text}"`);
}

// Clear completed todos
function clearCompleted() {
  const completedCount = todos.items.filter(t => t.completed).length;

  if (completedCount === 0) {
    console.log('No completed todos to clear');
    return;
  }

  todos.$remove(todo => todo.completed);
  console.log(`${completedCount} completed todos removed`);
}

// Track changes with effect
effect(() => {
  const total = todos.items.length;
  const completed = todos.items.filter(t => t.completed).length;
  console.log(`${total} todos (${completed} completed)`);
});

deleteTodo(2);
clearCompleted();
```

**Code explanation:**
- `deleteTodo()` removes a specific todo by ID using a predicate function
- `find()` first checks if the todo exists before removal (validation)
- `$remove()` takes a predicate: `t => t.id === todoId` (returns true for matching todo)
- `clearCompleted()` removes ALL completed todos with predicate: `todo => todo.completed`
- `effect()` automatically tracks stats whenever todos change
- When `$remove()` runs, the effect re-runs automatically - no manual DOM updates!

### 2. **Shopping Cart** - Remove Products

```js
const cart = collection([
  { id: 1, name: 'Laptop', price: 999, quantity: 1 },
  { id: 2, name: 'Mouse', price: 29, quantity: 2 },
  { id: 3, name: 'Keyboard', price: 79, quantity: 1 }
]);

// Remove item from cart
function removeFromCart(productId) {
  const item = cart.items.find(i => i.id === productId);
  if (!item) {
    console.warn('Item not in cart');
    return;
  }

  cart.$remove(i => i.id === productId);
  console.log(`Removed ${item.name} from cart`);
}

// Remove items under a price
function removeUnderPrice(minPrice) {
  const before = cart.items.length;
  cart.$remove(item => item.price < minPrice);
  const removed = before - cart.items.length;
  console.log(`${removed} items under $${minPrice} removed`);
}

// Calculate cart total
effect(() => {
  const total = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  document.querySelector('#cart-total').textContent = `$${total.toFixed(2)}`;
});

removeFromCart(2);
removeUnderPrice(50);
```

### 3. **Notifications** - Dismiss Alerts

```js
const notifications = collection([
  { id: 1, message: 'Welcome!', type: 'success', read: false },
  { id: 2, message: 'Error occurred', type: 'error', read: false },
  { id: 3, message: 'Update available', type: 'info', read: true }
]);

// Dismiss notification
function dismissNotification(notificationId) {
  const notification = notifications.items.find(n => n.id === notificationId);
  if (!notification) return;

  // Fade out animation
  notification.visible = false;

  setTimeout(() => {
    notifications.$remove(n => n.id === notificationId);
    console.log('Notification dismissed');
  }, 300);
}

// Clear all read notifications
function clearReadNotifications() {
  const readCount = notifications.items.filter(n => n.read).length;

  if (readCount === 0) {
    console.log('No read notifications to clear');
    return;
  }

  notifications.$remove(n => n.read);
  console.log(`${readCount} read notifications cleared`);
}

// Clear old notifications (24 hours)
function clearOldNotifications(hoursOld = 24) {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - hoursOld);

  const oldCount = notifications.items.filter(n => n.timestamp < cutoff).length;
  notifications.$remove(n => n.timestamp < cutoff);
  console.log(`${oldCount} old notifications cleared`);
}

// Display notifications
effect(() => {
  const unread = notifications.items.filter(n => !n.read).length;
  document.querySelector('#notification-badge').textContent = unread;
});

dismissNotification(1);
clearReadNotifications();
```

### 4. **User Management** - Remove Users

```js
const users = collection([
  { id: 1, name: 'John', role: 'admin', active: true },
  { id: 2, name: 'Jane', role: 'user', active: false },
  { id: 3, name: 'Bob', role: 'user', active: true }
]);

// Delete user (with validation)
function deleteUser(userId) {
  const user = users.items.find(u => u.id === userId);

  if (!user) {
    console.error('User not found');
    return;
  }

  if (user.role === 'admin') {
    console.error('Cannot delete admin users');
    return;
  }

  const confirmed = confirm(`Delete user "${user.name}"?`);
  if (!confirmed) {
    console.log('Deletion cancelled');
    return;
  }

  users.$remove(u => u.id === userId);
  console.log(`User ${user.name} deleted`);
}

// Remove inactive users
function removeInactiveUsers(daysInactive = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

  const inactiveCount = users.items.filter(u => {
    return u.role !== 'admin' && !u.active && u.lastSeen < cutoffDate;
  }).length;

  users.$remove(user => {
    return user.role !== 'admin' && !user.active && user.lastSeen < cutoffDate;
  });

  console.log(`${inactiveCount} inactive users removed`);
}

// Bulk delete
function bulkDeleteUsers(userIds) {
  const before = users.items.length;
  users.$remove(user => userIds.includes(user.id) && user.role !== 'admin');
  const removed = before - users.items.length;
  console.log(`${removed} users deleted`);
}

deleteUser(2);
removeInactiveUsers(30);
bulkDeleteUsers([4, 5, 6]);
```

### 5. **Game Entities** - Remove Defeated Enemies

```js
const enemies = collection([]);

// Spawn enemies
function spawnEnemies(count) {
  for (let i = 0; i < count; i++) {
    enemies.$add({
      id: Date.now() + i,
      health: 100,
      x: Math.random() * 800,
      y: Math.random() * 600,
      defeated: false
    });
  }
}

// Take damage
function damageEnemy(enemyId, damage) {
  const enemy = enemies.items.find(e => e.id === enemyId);
  if (!enemy) return;

  enemy.health -= damage;

  if (enemy.health <= 0) {
    enemy.defeated = true;
    console.log('Enemy defeated!');
  }
}

// Remove defeated enemies
function removeDefeatedEnemies() {
  const defeatedCount = enemies.items.filter(e => e.defeated).length;
  enemies.$remove(enemy => enemy.defeated);
  console.log(`${defeatedCount} defeated enemies removed`);
}

// Remove enemies outside bounds
function removeOutOfBounds() {
  enemies.$remove(enemy => {
    return enemy.x < 0 || enemy.x > 800 || enemy.y < 0 || enemy.y > 600;
  });
}

// Track enemy count
effect(() => {
  console.log(`Enemies alive: ${enemies.items.length}`);

  if (enemies.items.length === 0) {
    console.log('All enemies defeated! Level complete!');
  }
});

spawnEnemies(10);
damageEnemy(enemies.items[0].id, 100);
removeDefeatedEnemies();
```

---

## Advanced Patterns

### Pattern 1: Remove with Undo Support

```js
const tasks = collection([
  { id: 1, text: 'Task 1' },
  { id: 2, text: 'Task 2' },
  { id: 3, text: 'Task 3' }
]);

const history = {
  removed: [],
  maxHistory: 10
};

// Remove with undo capability
function removeWithUndo(predicate) {
  const toRemove = tasks.items.filter(predicate);

  if (toRemove.length === 0) {
    console.log('No items match criteria');
    return;
  }

  // Save to history before removing
  history.removed.push({
    items: toRemove,
    timestamp: Date.now()
  });

  // Keep history size manageable
  if (history.removed.length > history.maxHistory) {
    history.removed.shift();
  }

  tasks.$remove(predicate);
  console.log(`${toRemove.length} items removed (undo available)`);
}

// Undo last removal
function undoLastRemove() {
  if (history.removed.length === 0) {
    console.log('Nothing to undo');
    return;
  }

  const lastRemoved = history.removed.pop();
  lastRemoved.items.forEach(item => tasks.$add(item));

  console.log(`Restored ${lastRemoved.items.length} items`);
}

// Usage
removeWithUndo(task => task.id === 2);
undoLastRemove();  // Restore removed item
```

---

### Pattern 2: Conditional Bulk Removal with Confirmation

```js
const items = collection([...]);

// Safe bulk removal with user confirmation
function safeBulkRemove(predicate, description) {
  const toRemove = items.items.filter(predicate);

  if (toRemove.length === 0) {
    console.log('No items to remove');
    return false;
  }

  const confirmed = confirm(
    `Remove ${toRemove.length} ${description}? This cannot be undone.`
  );

  if (!confirmed) {
    console.log('Removal cancelled');
    return false;
  }

  items.$remove(predicate);
  console.log(`${toRemove.length} items removed`);
  return true;
}

// Usage
safeBulkRemove(
  item => item.completed && item.age > 30,
  'completed items older than 30 days'
);
```

---

### Pattern 3: Remove with Animation State

```js
const notifications = collection([
  { id: 1, message: 'Message 1', removing: false },
  { id: 2, message: 'Message 2', removing: false }
]);

// Remove with fade-out animation
async function removeWithAnimation(id) {
  const notification = notifications.items.find(n => n.id === id);
  if (!notification) return;

  // Step 1: Mark as removing (triggers CSS animation)
  notification.removing = true;

  // Step 2: Wait for animation
  await new Promise(resolve => setTimeout(resolve, 300));

  // Step 3: Actually remove
  notifications.$remove(n => n.id === id);
}

// Auto-apply animation class
effect(() => {
  notifications.items.forEach(n => {
    const el = document.querySelector(`#notification-${n.id}`);
    if (el) {
      el.classList.toggle('fade-out', n.removing);
    }
  });
});

// Usage
removeWithAnimation(1);  // Smooth fade-out then removal
```

---

### Pattern 4: Cascading Removal Across Collections

```js
const users = collection([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
]);

const posts = collection([
  { id: 1, userId: 1, text: 'Post 1' },
  { id: 2, userId: 1, text: 'Post 2' },
  { id: 3, userId: 2, text: 'Post 3' }
]);

const comments = collection([
  { id: 1, userId: 1, text: 'Comment 1' },
  { id: 2, userId: 2, text: 'Comment 2' }
]);

// Remove user and all their content
function removeUserAndContent(userId) {
  const user = users.items.find(u => u.id === userId);
  if (!user) {
    console.error('User not found');
    return;
  }

  const confirmed = confirm(
    `Delete user "${user.name}" and all their posts and comments?`
  );

  if (!confirmed) return;

  // Use batch for performance
  batch(() => {
    users.$remove(u => u.id === userId);
    posts.$remove(p => p.userId === userId);
    comments.$remove(c => c.userId === userId);
  });

  console.log('User and all content removed');
}

// Usage
removeUserAndContent(1);  // Removes user, posts, and comments
```

---

## When to Use Something Else

`$remove()` is perfect for selective removal, but here are some alternatives for specific situations:

### For Removing ALL Items

If you want to remove everything, use `$clear()` instead:

**Less efficient:**
```js
// ❌ SLOW - removes items one by one
todos.$remove(() => true);  // Works, but slower
```

**More efficient:**
```js
// ✅ FAST - removes all at once
todos.$clear();
```

**Rule of thumb:**
- **Remove SOME items?** Use `$remove(predicate)`
- **Remove ALL items?** Use `$clear()`

---

### For Removing from Multiple Collections

When removing from multiple collections, use `batch()` to avoid UI flicker:

**Less efficient (but works):**
```js
todos.$remove(t => t.completed);  // Effect runs
users.$remove(u => !u.active);    // Effect runs again
// Total: 2 updates (might flicker!)
```

**More efficient:**
```js
batch(() => {
  todos.$remove(t => t.completed);
  users.$remove(u => !u.active);
});
// Total: 1 update (smooth!)
```

**Why?** `batch()` groups the removals together, so effects only run once. The UI updates smoothly instead of flickering!

---

### Performance Tips

**Tip 1: Use Direct Value for Primitive Arrays**

For arrays of numbers or strings, use direct values instead of predicates:

```js
const tags = collection(['javascript', 'react', 'vue']);

// ⚠️ SLOWER - predicate function
tags.$remove(tag => tag === 'react');

// ✅ FASTER - direct value
tags.$remove('react');
```

**Tip 2: Check Before Removing**

Avoid unnecessary work by checking if items exist first:

```js
function removeCompleted() {
  // Check first
  const hasCompleted = todos.items.some(t => t.completed);

  if (!hasCompleted) {
    console.log('No completed todos');
    return;
  }

  todos.$remove(t => t.completed);
}
```

**Tip 3: Use Efficient Predicates**

Write predicates that return quickly:

```js
// ✅ GOOD - simple comparison
todos.$remove(todo => todo.id === targetId);

// ⚠️ SLOWER - complex logic in predicate
todos.$remove(todo => {
  const score = calculateComplexScore(todo);
  return score > threshold;
});

// ✅ BETTER - calculate once outside
const threshold = calculateThreshold();
todos.$remove(todo => todo.score > threshold);
```

---

## Common Pitfalls

### Pitfall 1: Forgetting to Return Boolean from Predicate

**Problem:**
```js
// Predicate doesn't return anything!
items.$remove(item => {
  item.id === targetId;  // Missing return!
});
// Nothing gets removed!
```

**Solution:**
```js
// Use explicit return
items.$remove(item => {
  return item.id === targetId;
});

// Or use implicit return (arrow function)
items.$remove(item => item.id === targetId);
```

---

### Pitfall 2: Modifying Collection During Iteration

**Problem:**
```js
// Modifying while iterating - dangerous!
items.items.forEach(item => {
  if (item.invalid) {
    items.$remove(i => i === item);  // Can skip items!
  }
});
```

**Solution:**
```js
// Use predicate directly
items.$remove(item => item.invalid);
```

---

### Pitfall 3: Using `$remove()` to Clear All Items

**Problem:**
```js
// Inefficient way to remove everything
items.$remove(() => true);
```

**Solution:**
```js
// Use $clear() for removing all items
items.$clear();
```

---

### Pitfall 4: Not Validating Before Removal

**Problem:**
```js
// No validation, removes without checking
function deleteUser(id) {
  users.$remove(u => u.id === id);
}
```

**Solution:**
```js
function deleteUser(id) {
  const user = users.items.find(u => u.id === id);

  if (!user) {
    console.error('User not found');
    return;
  }

  if (user.role === 'admin') {
    console.error('Cannot delete admin users');
    return;
  }

  const confirmed = confirm(`Delete user "${user.name}"?`);
  if (!confirmed) return;

  users.$remove(u => u.id === id);
}
```

---

## Real-World Example

Here's a spam filter using `$remove()`:

```js
const emails = collection([
  { id: 1, from: 'spam@bad.com', subject: 'Win $$$!' },
  { id: 2, from: 'boss@work.com', subject: 'Meeting' },
  { id: 3, from: 'scam@fake.com', subject: 'Click here!' }
]);

// Auto-update inbox count
effect(() => {
  document.querySelector('#inbox-count').textContent = emails.items.length;
});

// Remove spam by domain
function removeSpam() {
  const spamDomains = ['spam@bad.com', 'scam@fake.com'];
  emails.$remove(email => spamDomains.some(spam => email.from.includes(spam)));
  // UI updates automatically! ✨
}

// Remove old emails
function removeOldEmails(days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  emails.$remove(email => new Date(email.date) < cutoff);
}

// Usage
removeSpam();         // Removes 2 emails, UI updates automatically
removeOldEmails(30);  // Removes emails older than 30 days
```

**What this demonstrates:**
- Removing by predicate function
- Multiple items removed at once
- Automatic UI updates via effects
- Clean, readable code

---

## Common Questions

### Q: Can I remove multiple items at once?

**A:** Yes! The predicate function will match all items that return `true`:

```js
// Removes ALL completed todos, not just the first one
todos.$remove(todo => todo.completed);
```

### Q: What happens if no items match?

**A:** Nothing! `$remove()` safely does nothing if no items match:

```js
todos.$remove(todo => todo.id === 999);  // No error, just no removal
```

### Q: Can I remove by value instead of predicate?

**A:** Yes! For primitive values, pass the value directly:

```js
const numbers = collection([1, 2, 3, 2, 4]);
numbers.$remove(2);  // Removes ALL 2's (not just first one)
```

### Q: How do I remove just ONE item when multiple match?

**A:** Use a more specific predicate that only matches one item:

```js
// Removes ALL users named "John"
users.$remove(user => user.name === 'John');

// Removes only ONE specific user
users.$remove(user => user.id === 123);
```

### Q: Can I undo a removal?

**A:** Not automatically. Save the items first if you need undo:

```js
let backup = null;

function removeWithUndo(predicate) {
  backup = todos.items.filter(predicate);
  todos.$remove(predicate);
}

function undo() {
  if (backup) {
    backup.forEach(item => todos.$add(item));
  }
}
```

---

## Summary

**`collection.$remove()` provides a semantic, flexible way to remove items from reactive collections.**

**Key benefits:**
- ✅ **Flexible** - Accepts predicate function OR direct value for removal
- ✅ **Semantic** - Clearly expresses "remove items matching condition"
- ✅ **Chainable** - Returns collection for method chaining
- ✅ **Automatic** - DOM updates by itself without manual calls
- ✅ **Consistent** - Matches other collection methods (`$add`, `$update`, `$clear`)
- ✅ **Efficient** - Works with `batch()` for multiple removals
- ✅ Perfect for **filtering**, **deletion by ID**, **cleanup**, **bulk removal**, **conditional removal**

**Important warnings:**
- ⚠️ **Always return boolean** from predicate functions (use implicit return with arrow functions)
- ⚠️ **Don't modify** collection during iteration (use predicate directly)
- ⚠️ **Use `$clear()`** instead when removing all items
- ⚠️ **Validate before removal** (check item exists, confirm destructive actions)

**Remember:** `$remove()` is for selective removal. If you need to remove ALL items, use `$clear()` instead!

➡️ Next, explore [`collection.$update()`](collection_$update.md) to update items or [`collection.$clear()`]($clear.md) to clear collections!
