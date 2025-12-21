# Understanding `collection.$remove()` - A Beginner's Guide

## Quick Start (30 seconds)

```js
// Create a reactive todo list
const todos = collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Call mom', done: true }
]);

// Remove first completed todo - UI updates automatically!
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

`collection.$remove()` is a **collection instance method** that removes the **first matching item** from a reactive collection created with `ReactiveUtils.collection()` or `ReactiveUtils.list()`. It accepts either a predicate function or a direct value to match and remove.

Think of it as **a smart "delete button"** for your arrays - instead of manually finding and removing items and remembering to update the UI, `$remove()` does both automatically with clean, semantic syntax.

---

## Syntax

```js
// Using collection instance
collection.$remove(predicate)

// Remove by predicate function (removes first match)
const todos = collection([...]);
todos.$remove(todo => todo.completed);

// Remove by direct value (removes first occurrence)
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

**How the parameter works:**

Instead of having two separate methods (one for values, one for conditions), `$remove()` intelligently handles both cases:

**1. Direct value mode** - Pass the exact value you want to removed:
```js
numbers.$remove(3); 
// This means: “Find items equal to 3 and remove them.”
// Internally, it’s like doing: item === 3
// Simple case for primitive values
```

**2. Predicate function mode** - Pass a function that decides what to remove:
```js
todos.$remove(item => item.id === 3); // Function called for each item
// This means: “Remove any item where this condition is true.”
// Returns true → remove it
// Returns false → keep it
// Advanced/flexible case for complex logic
```

**Why this design?**
- ✔ Simple for common cases (direct value)
- ✔ Powerful for complex logic (predicate function)
- ✔ One API instead of multiple methods
- ✔ Matches familiar patterns from JavaScript (`Array.filter`, `find`, etc.)

**Returns:**
- The collection object (for chaining)

**Important:** `$remove()` only removes the **first item** that matches the predicate or value.

**One-sentence summary:** 
- The method lets you remove items either by ***passing the exact value*** to remove, or by ***passing a function that decides*** which items should be removed.

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
  const index = todos.findIndex(t => t.id === todoId);
  if (index === -1) {
    console.warn('Todo not found');
    return;
  }

  todos.splice(index, 1);
  document.querySelector('#todo-count').textContent = todos.length;
  renderTodos();
  // If you forget any of these, UI is out of sync!
}

function renderTodos() {
  const list = document.querySelector('#todo-list');
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.text;
    list.appendChild(li);
  });
}

deleteTodo(2);
```

**Code explanation:**
- `deleteTodo()` must manually find the index, remove with `splice()`, update count, and re-render
- If you forget to call `renderTodos()` or update any counter, the UI becomes out of sync

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

`$remove()` is a **chainable method that removes items in different ways and automatically triggers reactive updates.**

**What this means:**

1. **Semantic** - The method name clearly describes its intent. When you read `$remove()`, you immediately understand: "This removes something from the collection." No hidden behavior, no ambiguity.

2. **Flexible** - Supports multiple ways of removing items (by value OR by condition). The same method works for simple and advanced cases.

3. **Chainable** - Returns the collection instance, so you can keep calling other methods after it. No need to store intermediate variables.

4. **Automatic reactivity** - You don't manually trigger updates. When `$remove()` changes data, watchers run, computed values update, and bindings re-render—all handled by the reactive system.

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
  const count = todos.items.length;
  const completed = todos.items.filter(t => t.completed).length;
  document.querySelector('#todo-count').textContent = count;
  document.querySelector('#completed-count').textContent = completed;
});

// Remove by ID - clean and semantic
todos.$remove(todo => todo.id === 2);
// Effect runs automatically! DOM updates without manual calls! ✨

// Remove first completed todo
todos.$remove(todo => todo.completed);
// Effect runs again! Counters update automatically!

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
2. ✅ **Semantic** - Clearly expresses "remove item matching condition"
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
System automatically finds and removes first match
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
         │  Step 1: Find First Match        │
         │  Test items until predicate      │
         │  returns true                    │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 2: Remove Match            │
         │  splice() first matching item    │
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
         │  UI reflects removed item        │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 6: Return Collection       │
         │  Enables method chaining         │
         └──────────────────────────────────┘
```

**What's happening behind the scenes:**

1. **Find first match** - Tests each item with the predicate function (or value match) until finding the first match
2. **Remove match** - Uses `splice()` to remove the first item where predicate returns `true`
3. **Trigger reactivity** - The reactive system detects the array changes
4. **Notify watchers** - All effects watching this collection are notified
5. **Effects re-run** - Each `effect()` re-executes with the updated array
6. **DOM updates** - Your UI updates automatically to reflect removed item
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

// Remove by predicate function (removes first match)
todos.$remove(todo => todo.id === 2);

// Remove first completed todo
todos.$remove(todo => todo.completed);

// Remove by direct value (for primitive arrays - removes first occurrence)
const numbers = collection([1, 2, 3, 4, 5]);
numbers.$remove(3);  // Removes first 3
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

// Clear completed todos (remove all matching)
function clearCompleted() {
  const completedCount = todos.items.filter(t => t.completed).length;

  if (completedCount === 0) {
    console.log('No completed todos to clear');
    return;
  }

  // Remove all completed todos
  batch(() => {
    while (todos.items.some(t => t.completed)) {
      todos.$remove(todo => todo.completed);
    }
  });
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
- `clearCompleted()` removes ALL completed todos using a while loop with `batch()` for efficiency
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

// Remove all items under a price
function removeUnderPrice(minPrice) {
  const before = cart.items.length;
  
  batch(() => {
    while (cart.items.some(item => item.price < minPrice)) {
      cart.$remove(item => item.price < minPrice);
    }
  });
  
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

  notifications.$remove(n => n.id === notificationId);
  console.log('Notification dismissed');
}

// Clear all read notifications
function clearReadNotifications() {
  const readCount = notifications.items.filter(n => n.read).length;

  if (readCount === 0) {
    console.log('No read notifications to clear');
    return;
  }

  batch(() => {
    while (notifications.items.some(n => n.read)) {
      notifications.$remove(n => n.read);
    }
  });
  console.log(`${readCount} read notifications cleared`);
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
  if (!confirmed) return;

  users.$remove(u => u.id === userId);
  console.log(`User ${user.name} deleted`);
}

// Remove all inactive users
function removeInactiveUsers(daysInactive = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

  const inactiveCount = users.items.filter(u => {
    return u.role !== 'admin' && !u.active && u.lastSeen < cutoffDate;
  }).length;

  batch(() => {
    while (users.items.some(u => 
      u.role !== 'admin' && !u.active && u.lastSeen < cutoffDate
    )) {
      users.$remove(user => {
        return user.role !== 'admin' && !user.active && user.lastSeen < cutoffDate;
      });
    }
  });

  console.log(`${inactiveCount} inactive users removed`);
}

deleteUser(2);
removeInactiveUsers(30);
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

// Remove all defeated enemies
function removeDefeatedEnemies() {
  const defeatedCount = enemies.items.filter(e => e.defeated).length;
  
  batch(() => {
    while (enemies.items.some(e => e.defeated)) {
      enemies.$remove(enemy => enemy.defeated);
    }
  });
  
  console.log(`${defeatedCount} defeated enemies removed`);
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
  const toRemove = tasks.items.find(predicate);

  if (!toRemove) {
    console.log('No item matches criteria');
    return;
  }

  // Save to history before removing
  history.removed.push({
    item: toRemove,
    timestamp: Date.now()
  });

  // Keep history size manageable
  if (history.removed.length > history.maxHistory) {
    history.removed.shift();
  }

  tasks.$remove(predicate);
  console.log('Item removed (undo available)');
}

// Undo last removal
function undoLastRemove() {
  if (history.removed.length === 0) {
    console.log('Nothing to undo');
    return;
  }

  const lastRemoved = history.removed.pop();
  tasks.$add(lastRemoved.item);

  console.log('Restored item');
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

  batch(() => {
    while (items.items.some(predicate)) {
      items.$remove(predicate);
    }
  });
  
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
    
    // Remove all posts by this user
    while (posts.items.some(p => p.userId === userId)) {
      posts.$remove(p => p.userId === userId);
    }
    
    // Remove all comments by this user
    while (comments.items.some(c => c.userId === userId)) {
      comments.$remove(c => c.userId === userId);
    }
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
while (todos.items.length > 0) {
  todos.$remove(() => true);
}
```

**More efficient:**
```js
// ✅ FAST - removes all at once
todos.$clear();
```

**Rule of thumb:**
- **Remove SOME items?** Use `$remove(predicate)` (with loop for multiple)
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

**Tip 4: Use batch() for Multiple Removals**

When removing multiple items, wrap in `batch()` for better performance:

```js
// ⚠️ SLOWER - effect runs each time
while (todos.items.some(t => t.completed)) {
  todos.$remove(t => t.completed);
}

// ✅ FASTER - effect runs once
batch(() => {
  while (todos.items.some(t => t.completed)) {
    todos.$remove(t => t.completed);
  }
});
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
// Use while loop with batch
batch(() => {
  while (items.items.some(item => item.invalid)) {
    items.$remove(item => item.invalid);
  }
});
```

---

### Pitfall 3: Using `$remove()` to Clear All Items

**Problem:**
```js
// Inefficient way to remove everything
while (items.items.length > 0) {
  items.$remove(() => true);
}
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

### Pitfall 5: Expecting All Matches to Be Removed

**Problem:**
```js
const numbers = collection([1, 2, 3, 2, 4]);
numbers.$remove(2);
console.log(numbers.items);  // [1, 3, 2, 4] - only first 2 removed!
// Expected all 2's to be removed, but only first one was removed
```

**Solution:**
```js
// Use loop to remove all matches
batch(() => {
  while (numbers.items.includes(2)) {
    numbers.$remove(2);
  }
});
console.log(numbers.items);  // [1, 3, 4] - all 2's removed!
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

// Remove all spam by domain
function removeSpam() {
  const spamDomains = ['spam@bad.com', 'scam@fake.com'];
  
  batch(() => {
    while (emails.items.some(email => 
      spamDomains.some(spam => email.from.includes(spam))
    )) {
      emails.$remove(email => 
        spamDomains.some(spam => email.from.includes(spam))
      );
    }
  });
  // UI updates automatically! ✨
}

// Usage
removeSpam();  // Removes spam emails, UI updates automatically
```

**What this demonstrates:**
- Removing multiple items with a loop
- Using `batch()` for performance
- Automatic UI updates via effects
- Clean, readable code

---

## Common Questions

### Q: Can I remove multiple items at once?

**A:** `$remove()` only removes the **first match**. To remove multiple items, use a loop:

```js
// Removes only FIRST completed todo
todos.$remove(todo => todo.completed);

// Remove ALL completed todos
batch(() => {
  while (todos.items.some(todo => todo.completed)) {
    todos.$remove(todo => todo.completed);
  }
});
```

### Q: What happens if no items match?

**A:** Nothing! `$remove()` safely does nothing if no items match:

```js
todos.$remove(todo => todo.id === 999);  // No error, just no removal
```

### Q: Can I remove by value instead of predicate?

**A:** Yes! For primitive values, pass the value directly (removes first occurrence):

```js
const numbers = collection([1, 2, 3, 2, 4]);
numbers.$remove(2);  // Removes first 2
console.log(numbers.items);  // [1, 3, 2, 4]
```

### Q: How do I remove just ONE item when multiple match?

**A:** `$remove()` already removes only the first match! Use a specific predicate:

```js
// Removes only FIRST user named "John"
users.$remove(user => user.name === 'John');

// Removes only ONE specific user (by unique ID)
users.$remove(user => user.id === 123);
```

### Q: Can I undo a removal?

**A:** Not automatically. Save the items first if you need undo:

```js
let backup = null;

function removeWithUndo(predicate) {
  backup = todos.items.find(predicate);
  todos.$remove(predicate);
}

function undo() {
  if (backup) {
    todos.$add(backup);
  }
}
```

---

## Summary

**`collection.$remove()` provides a semantic, flexible way to remove the first matching item from reactive collections.**

**Key benefits:**
- ✅ **Flexible** - Accepts predicate function OR direct value for removal
- ✅ **Semantic** - Clearly expresses "remove first item matching condition"
- ✅ **Chainable** - Returns collection for method chaining
- ✅ **Automatic** - DOM updates by itself without manual calls
- ✅ **Consistent** - Matches other collection methods (`$add`, `$update`, `$clear`)
- ✅ **Efficient** - Works with `batch()` for multiple removals
- ✅ Perfect for **single item deletion**, **deletion by ID**, **first-match removal**

**Important warnings:**
- ⚠️ **Only removes first match** - use loops with `batch()` for multiple removals
- ⚠️ **Always return boolean** from predicate functions (use implicit return with arrow functions)
- ⚠️ **Don't modify** collection during iteration (use while loop with batch instead)
- ⚠️ **Use `$clear()`** instead when removing all items
- ⚠️ **Validate before removal** (check item exists, confirm destructive actions)

**Remember:** `$remove()` removes only the **first matching item**. To remove multiple items, use a `while` loop with `batch()`. If you need to remove ALL items, use `$clear()` instead!

➡️ Next, explore [`collection.$update()`](collection_$update.md) to update items or [`collection.$clear()`]($clear.md) to clear collections!