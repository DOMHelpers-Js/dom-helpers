# Understanding `collection.$update()` - A Beginner's Guide

## Quick Start (30 seconds)

```js
// Create a reactive todo list
const todos = collection([
  { id: 1, text: 'Buy milk', done: false }
]);

// Mark as complete - UI updates automatically!
todos.$update(
  todo => todo.id === 1,
  { done: true }
);

// Setup auto-update (write once, works forever)
effect(() => {
  const completed = todos.items.filter(t => t.done).length;
  document.querySelector('#completed').textContent = completed;
});
```

**That's it!** When you `$update()`, everything updates automatically. ✨

**Want to understand how this works?** Keep reading below!

---

## What is `collection.$update()`?

`collection.$update()` is a **collection instance method** that updates items in a reactive collection created with `ReactiveUtils.collection()` or `ReactiveUtils.list()`. It finds items using a predicate function or direct value, then applies updates through object merging or transformation functions.

Think of it as **a smart "edit button"** for your arrays - instead of manually finding and updating items and remembering to update the UI, `$update()` does both automatically with clean, semantic syntax.

---

## Syntax

```js
// Using collection instance
collection.$update(predicate, updates)

// Update with object merge
const todos = collection([...]);
todos.$update(
  todo => todo.id === 1,
  { completed: true }
);

// Update with transformation function
todos.$update(
  todo => todo.priority === 'high',
  todo => ({ ...todo, urgent: true })
);

// Update by direct value (for primitives)
const numbers = collection([1, 2, 3]);
numbers.$update(2, { value: 20 });
```

**Both shortcut and namespace styles work** when creating collections:
- **Shortcut style**: `collection()` - Clean and concise
- **Namespace style**: `ReactiveUtils.collection()` - Explicit and clear

**Parameters:**
- `predicate` (Function|any): How to find items to update
  - **Function**: Receives item, returns `true` to update
  - **Value**: Direct value to match
- `updates` (Object|Function): How to update matched items
  - **Object**: Properties to merge into matched items
  - **Function**: Receives item, returns updated item

**Returns:**
- The collection object (for chaining)

---

## Why Does This Exist?

### The Problem: Updating Items and Updating UI in Plain JavaScript

Imagine you're building a todo app. A user clicks a checkbox to mark a todo as completed. How do you update specific items in a list AND update the UI?

### ❌ Plain JavaScript Approach - Manual Everything

```js
// Plain JavaScript - no reactivity
let todos = [
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Call dentist', completed: false },
  { id: 3, text: 'Finish project', completed: false }
];

// You must manually update the DOM every time you update
function toggleTodo(todoId) {
  // Step 1: Find the todo
  const todo = todos.find(t => t.id === todoId);
  if (!todo) {
    console.warn('Todo not found');
    return;
  }

  // Step 2: Update the todo
  todo.completed = !todo.completed;
  todo.completedAt = todo.completed ? new Date() : null;

  // Step 3: Manually update the todo item in the DOM
  const element = document.querySelector(`#todo-${todoId}`);
  if (element) {
    element.classList.toggle('completed', todo.completed);
  }

  // Step 4: Manually update the completed counter
  const completedCount = todos.filter(t => t.completed).length;
  document.querySelector('#completed-count').textContent = completedCount;

  // Step 5: Manually update the progress bar
  const percentage = (completedCount / todos.length) * 100;
  document.querySelector('#progress-bar').style.width = `${percentage}%`;

  // If you forget any of these, UI is out of sync!
}

// Mark all as completed
function completeAll() {
  // Step 1: Update all todos
  todos.forEach(todo => {
    todo.completed = true;
    todo.completedAt = new Date();
  });

  // Step 2: Manually update ALL todo items in the DOM
  todos.forEach(todo => {
    const element = document.querySelector(`#todo-${todo.id}`);
    if (element) {
      element.classList.add('completed');
    }
  });

  // Step 3: Manually update all counters and indicators
  document.querySelector('#completed-count').textContent = todos.length;
  document.querySelector('#progress-bar').style.width = '100%';
  // Must remember to update every UI element!
}

toggleTodo(1);
completeAll();
```

**Code explanation:**
- `toggleTodo()` must manually:
  1. Find the todo in the array
  2. Update its properties
  3. Update the specific DOM element
  4. Update the completed counter
  5. Update the progress bar
- `completeAll()` updates all todos but then must manually update every UI element
- If you forget to update any DOM element, the UI becomes out of sync
- Every update operation requires remembering 5+ manual DOM update calls

**What's the Real Issue?**

**Without `$update()` - Manual Updates:**
```
User checks todo
       ↓
   Find item ──────────┐
       ↓               │
   Update properties   │
       ↓               │  ← You must remember
   Update checkbox     │     to do ALL of these!
       ↓               │
   Update counter      │
       ↓               │
   Update progress ────┘
```

**With `$update()` - Automatic Updates:**
```
User checks todo
       ↓
   $update(predicate, { completed: true })
                      ↓
              ┌───────────────┐
              │  Reactivity   │
              │    System     │
              └───────┬───────┘
                      ↓
         ┌────────────┼────────────┐
         ↓            ↓            ↓
    Checkbox      Counter      Progress
    updates       updates       updates

Everything happens automatically! ✨
```

**Problems:**
- When you update an item, nothing else in your code knows about it automatically
- JavaScript doesn't notify the UI that something was updated
- You must manually call update functions after every change
- Easy to forget updating parts of the UI
- The data changes, but nothing reacts to it

**Why This Becomes a Problem:**

As your app grows, this leads to several issues:
❌ Changes are invisible to the rest of your application
❌ The UI doesn't update unless you manually tell it to
❌ You end up writing extra code just to sync the UI
❌ Data and UI easily get out of sync
❌ Same update logic repeated everywhere

In other words, **manual updates require constant vigilance**.
You update data — **but you must remember to update everything that depends on it**.

---

## The Solution with `collection.$update()`

`$update()` provides a **semantic, flexible, and chainable** way to update items with automatic reactivity.

### ✅ Using `collection.$update()` - Clean and Automatic

```js
// Create a reactive collection
const todos = collection([
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Call dentist', completed: false },
  { id: 3, text: 'Finish project', completed: false }
]);

// Set up automatic DOM updates (write once, works forever!)
effect(() => {
  // This runs automatically whenever todos change
  const completed = todos.items.filter(t => t.completed).length;
  const percentage = (completed / todos.items.length) * 100;
  document.querySelector('#completed-count').textContent = completed;
  document.querySelector('#progress-bar').style.width = `${percentage}%`;
});

// Update with object merge - clean and semantic
todos.$update(
  todo => todo.id === 1,
  { completed: true, completedAt: new Date() }
);
// Effect runs automatically! DOM updates without manual calls! ✨

// Update with function - more control for complex logic
todos.$update(
  todo => todo.id === 2,
  (todo) => ({
    ...todo,
    completed: !todo.completed,  // Toggle completion
    completedAt: !todo.completed ? new Date() : null
  })
);
// Effect runs again! Both counter and progress bar update automatically!

// Update multiple items at once
todos.$update(
  todo => !todo.completed,  // All incomplete todos
  { completed: true, completedAt: new Date() }
);
// Effect runs, all UI elements update automatically! ✨

// Chain operations
todos
  .$update(todo => todo.completed, { priority: 'done' })
  .$add({ id: 4, text: 'New task', completed: false });
// Effect runs, UI updates automatically! ✨
```

**What just happened?**
1. You updated items using `$update()` with clean predicates and updates
2. The `effect()` detected the changes automatically
3. The DOM updated without you calling anything
4. You can update multiple items at once OR chain operations together

**Benefits:**

1. ✅ **Automatic** - DOM updates happen by themselves
2. ✅ **Semantic** - Clearly expresses "update items matching condition"
3. ✅ **Flexible** - Use object merge OR transformation function
4. ✅ **Chainable** - Returns collection for method chaining
5. ✅ **Consistent** - Matches other collection methods (`$add`, `$remove`, `$clear`)
6. ✅ **Powerful** - Can update multiple items at once
7. ✅ **Less code** - Write the update logic once, it works forever

---

## Mental Model: The Smart Editor

Think of `collection.$update()` like a **document with auto-save and sync**:

**Regular document (plain array):**
```
You edit the document
       ↓
Nothing happens
       ↓
You must manually save
       ↓
You must manually tell everyone: "Hey, I made changes!"
```

**Smart document (reactive collection):**
```
You edit with $update()
       ↓
The document automatically saves
       ↓
Everyone watching gets notified automatically
       ↓
┌──────────────┬──────────────┬──────────────┐
↓              ↓              ↓
Preview       Collaborators  Version
updates       see changes    history
automatically! automatically! updates!
```

**Real-world analogy:** It's like Google Docs - when you edit, everyone sees the changes instantly. You don't click "Save" or "Notify collaborators" - it just happens!

**With `$update()`:**
- You describe **what to change** (the predicate)
- You describe **how to change it** (object merge or function)
- The system handles **finding, updating, and notifying** automatically

---

## How Does It Work?

### How It Works (Simple Version)

Here's the simple 3-step flow:

```
1. You call $update(predicate, updates)
              ↓
2. System finds matching items and updates them
              ↓
3. All effects watching the collection run automatically
              ↓
          UI updates! ✨
```

**Example:**
```js
const todos = collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Call mom', done: false }
]);

// Step 1: You call $update
todos.$update(todo => todo.id === 1, { done: true });

// Step 2: System finds todo with id=1 and updates it
//         todos[0] becomes { id: 1, text: 'Buy milk', done: true }

// Step 3: Any effects watching 'todos' run automatically
//         UI updates without you doing anything! ✨
```

That's it! You update items, and everything that depends on them updates automatically.

---

### How It Works (Technical Details)

When you call `$update()`, here's the magic that happens automatically:

```
┌─────────────────────────────────────────────────────────────┐
│  YOU CALL:  todos.$update(t => t.id === 1, { done: true }) │
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
         │  Step 2: Find Matches            │
         │  Identify items where true       │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 3: Apply Updates           │
         │  Merge object or transform       │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 4: Trigger Reactivity      │
         │  Notify all watchers             │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 5: Effects Auto-Run        │
         │  effect(() => { ... })           │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 6: DOM Updates             │
         │  UI reflects updated items       │
         └──────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────┐
         │  Step 7: Return Collection       │
         │  Enables method chaining         │
         └──────────────────────────────────┘
```

**What's happening behind the scenes:**

1. **Test each item** - Evaluates the predicate function (or value match) for each item
2. **Find matches** - Identifies all items where the predicate returns `true`
3. **Apply updates** - Merges object properties OR calls transformation function
4. **Trigger reactivity** - The reactive system detects the property changes
5. **Notify watchers** - All effects watching this collection are notified
6. **Effects re-run** - Each `effect()` re-executes with the updated array
7. **DOM updates** - Your UI updates automatically to reflect changed items
8. **Return collection** - Returns the collection object for chaining

Think of it as: **You update → System reacts → UI updates** - all automatic!

---

## Basic Usage

Here's how to use `$update()` in the most common scenarios:

```js
// Create a collection
const todos = collection([
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Call dentist', completed: false },
  { id: 3, text: 'Finish project', completed: false }
]);

// Update with object merge
todos.$update(
  todo => todo.id === 1,
  { completed: true }
);

// Update with transformation function
todos.$update(
  todo => todo.id === 2,
  todo => ({ ...todo, completed: !todo.completed })
);

// Update multiple items at once
todos.$update(
  todo => !todo.completed,
  { priority: 'high' }
);

// Chain operations
todos.$update(todo => todo.completed, { archived: true })
     .$add({ id: 4, text: 'New task', completed: false });
```

---

## Common Use Cases

### Use Case 1: Toggle Todo Completion

```js
const todos = collection([
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Call dentist', completed: false }
]);

// Toggle todo completion
function toggleTodo(todoId) {
  todos.$update(
    todo => todo.id === todoId,
    (todo) => ({
      ...todo,
      completed: !todo.completed,
      completedAt: !todo.completed ? new Date() : null
    })
  );

  const todo = todos.items.find(t => t.id === todoId);
  console.log(`"${todo.text}" is now ${todo.completed ? 'completed' : 'pending'}`);
}

// Edit todo text
function editTodo(todoId, newText) {
  if (!newText || newText.trim() === '') {
    console.warn('Todo text cannot be empty');
    return;
  }

  todos.$update(
    todo => todo.id === todoId,
    { text: newText.trim(), editedAt: new Date() }
  );

  console.log('Todo updated');
}

// Mark all as completed
function completeAll() {
  todos.$update(
    todo => !todo.completed,
    { completed: true, completedAt: new Date() }
  );

  console.log('All todos completed');
}

// Track completion
effect(() => {
  const total = todos.items.length;
  const completed = todos.items.filter(t => t.completed).length;
  console.log(`${completed}/${total} completed`);
});

toggleTodo(1);
editTodo(2, 'Call dentist at 3pm');
completeAll();
```

**Code explanation:**
- `toggleTodo()` uses transformation function to toggle `completed` state
- First parameter: `todo => todo.id === todoId` finds the todo to update
- Second parameter: function that returns new object with toggled `completed` property
- `editTodo()` uses object merge to update text: `{ text: newText.trim(), editedAt: new Date() }`
- `completeAll()` updates ALL incomplete todos with predicate: `todo => !todo.completed`
- `effect()` automatically tracks completion stats whenever todos change
- When `$update()` runs, the effect re-runs automatically - no manual DOM updates!

### 2. **Shopping Cart** - Update Quantities

```js
const cart = collection([
  { id: 1, name: 'Laptop', price: 999, quantity: 1 },
  { id: 2, name: 'Mouse', price: 29, quantity: 2 }
]);

// Update quantity
function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
    console.warn('Quantity must be at least 1');
    return;
  }

  cart.$update(
    item => item.id === productId,
    { quantity: newQuantity }
  );

  const item = cart.items.find(i => i.id === productId);
  console.log(`${item.name}: quantity ${item.quantity}`);
}

// Increment quantity
function incrementQuantity(productId) {
  cart.$update(
    item => item.id === productId,
    (item) => ({ ...item, quantity: item.quantity + 1 })
  );
}

// Apply discount
function applyDiscount(productId, discountPercent) {
  cart.$update(
    item => item.id === productId,
    (item) => ({
      ...item,
      originalPrice: item.originalPrice || item.price,
      price: (item.originalPrice || item.price) * (1 - discountPercent / 100),
      discount: discountPercent
    })
  );

  console.log(`${discountPercent}% discount applied`);
}

// Calculate cart total
effect(() => {
  const total = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  document.querySelector('#cart-total').textContent = `$${total.toFixed(2)}`;
});

updateQuantity(1, 2);
incrementQuantity(2);
applyDiscount(1, 10);
```

### 3. **User Status** - Update Online Status

```js
const users = collection([
  { id: 1, name: 'John', status: 'offline', lastSeen: new Date() },
  { id: 2, name: 'Jane', status: 'offline', lastSeen: new Date() }
]);

// Update user status
function setUserStatus(userId, status) {
  const validStatuses = ['online', 'offline', 'away', 'busy'];

  if (!validStatuses.includes(status)) {
    console.error('Invalid status');
    return;
  }

  users.$update(
    user => user.id === userId,
    {
      status: status,
      lastSeen: status === 'offline' ? new Date() : null,
      statusChangedAt: new Date()
    }
  );

  const user = users.items.find(u => u.id === userId);
  console.log(`${user.name} is now ${status}`);
}

// Update profile
function updateProfile(userId, updates) {
  const allowedFields = ['name', 'email', 'bio', 'avatar'];
  const validUpdates = {};

  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key)) {
      validUpdates[key] = updates[key];
    }
  });

  users.$update(
    user => user.id === userId,
    { ...validUpdates, updatedAt: new Date() }
  );

  console.log('Profile updated');
}

// Increment message count
function trackMessage(userId) {
  users.$update(
    user => user.id === userId,
    (user) => ({
      ...user,
      messageCount: (user.messageCount || 0) + 1,
      lastMessageAt: new Date()
    })
  );
}

// Display online users
effect(() => {
  const online = users.items.filter(u => u.status === 'online').length;
  document.querySelector('#online-count').textContent = online;
});

setUserStatus(1, 'online');
updateProfile(2, { bio: 'Software developer' });
trackMessage(1);
```

### 4. **Game Entities** - Update Health & Position

```js
const entities = collection([
  { id: 1, type: 'player', health: 100, x: 0, y: 0 },
  { id: 2, type: 'enemy', health: 50, x: 100, y: 100 }
]);

// Take damage
function takeDamage(entityId, damage) {
  entities.$update(
    entity => entity.id === entityId,
    (entity) => {
      const newHealth = Math.max(0, entity.health - damage);
      return {
        ...entity,
        health: newHealth,
        isDead: newHealth === 0,
        lastDamageAt: new Date()
      };
    }
  );

  const entity = entities.items.find(e => e.id === entityId);
  console.log(`Entity ${entityId} health: ${entity.health}`);

  if (entity.isDead) {
    console.log(`Entity ${entityId} defeated!`);
  }
}

// Move entity
function moveEntity(entityId, deltaX, deltaY) {
  entities.$update(
    entity => entity.id === entityId,
    (entity) => ({
      ...entity,
      x: entity.x + deltaX,
      y: entity.y + deltaY,
      movedAt: new Date()
    })
  );
}

// Heal all players
function healPlayers(amount) {
  entities.$update(
    entity => entity.type === 'player' && !entity.isDead,
    (entity) => ({
      ...entity,
      health: Math.min(100, entity.health + amount)
    })
  );

  console.log(`All players healed by ${amount}`);
}

// Power up
function powerUp(entityId) {
  entities.$update(
    entity => entity.id === entityId,
    (entity) => ({
      ...entity,
      attack: (entity.attack || 10) * 1.5,
      defense: (entity.defense || 10) * 1.5,
      poweredUp: true,
      powerUpExpires: new Date(Date.now() + 10000)
    })
  );
}

takeDamage(2, 20);
moveEntity(1, 10, 5);
healPlayers(30);
powerUp(1);
```

### 5. **Form Validation** - Update Field Errors

```js
const formFields = collection([
  { name: 'email', value: '', error: null, touched: false },
  { name: 'password', value: '', error: null, touched: false }
]);

// Update field value
function updateField(fieldName, value) {
  formFields.$update(
    field => field.name === fieldName,
    { value: value, touched: true }
  );

  validateField(fieldName);
}

// Validate field
function validateField(fieldName) {
  const field = formFields.items.find(f => f.name === fieldName);
  if (!field) return;

  let error = null;

  if (fieldName === 'email') {
    if (!field.value) {
      error = 'Email is required';
    } else if (!field.value.includes('@')) {
      error = 'Invalid email format';
    }
  } else if (fieldName === 'password') {
    if (!field.value) {
      error = 'Password is required';
    } else if (field.value.length < 8) {
      error = 'Password must be at least 8 characters';
    }
  }

  formFields.$update(
    f => f.name === fieldName,
    { error: error }
  );
}

// Clear all errors
function clearErrors() {
  formFields.$update(
    () => true,
    { error: null }
  );

  console.log('All errors cleared');
}

// Mark all as touched
function touchAll() {
  formFields.$update(
    () => true,
    { touched: true }
  );
}

// Display errors
effect(() => {
  const errorFields = formFields.items.filter(f => f.error && f.touched);
  const errorContainer = document.querySelector('#errors');

  errorContainer.innerHTML = errorFields.map(f => {
    return `<div class="error">${f.name}: ${f.error}</div>`;
  }).join('');
});

updateField('email', 'john@example.com');
updateField('password', 'secret123');
clearErrors();
```

---

## How `$update()` Behaves With Other Features

### With Arrays (Patched Array Methods)

Arrays are patched. `$update()` modifies items in place, triggering reactivity.

```js
const numbers = collection([
  { id: 1, value: 10 },
  { id: 2, value: 20 }
]);

effect(() => {
  console.log('Values:', numbers.items.map(n => n.value));
});

// Update doubles the values
numbers.$update(
  () => true,
  (item) => ({ ...item, value: item.value * 2 })
);
// Logs: "Values: [20, 40]"
```

### With Effects

Effects track when you read collection items. Updating items triggers those effects.

```js
const tasks = collection([
  { id: 1, status: 'pending', priority: 'low' },
  { id: 2, status: 'pending', priority: 'high' }
]);

// Effect 1: Count by status
effect(() => {
  const pending = tasks.items.filter(t => t.status === 'pending').length;
  console.log(`Pending: ${pending}`);
});

// Effect 2: Count high priority
effect(() => {
  const high = tasks.items.filter(t => t.priority === 'high').length;
  console.log(`High priority: ${high}`);
});

tasks.$update(
  task => task.id === 1,
  { status: 'done', priority: 'high' }
);
// Logs: "Pending: 1"
// Logs: "High priority: 2"
```

### With Computed Properties

Computed properties derive from collections. Updating items invalidates and recalculates them.

```js
const cart = collection([
  { id: 1, name: 'Laptop', price: 999, quantity: 1 },
  { id: 2, name: 'Mouse', price: 29, quantity: 2 }
]);

// Computed: cart total
const cartTotal = computed(() => {
  return cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

effect(() => {
  console.log(`Total: $${cartTotal.value.toFixed(2)}`);
});

console.log(cartTotal.value); // 1057

cart.$update(
  item => item.id === 1,
  { quantity: 2 }
);
// Logs: "Total: $2056.00"
console.log(cartTotal.value); // 2056
```

### With DOM Bindings

DOM bindings automatically update when collection items are updated.

```js
const users = collection([
  { id: 1, name: 'John', active: false },
  { id: 2, name: 'Jane', active: true }
]);

// Bind active count to DOM
effect(() => {
  const activeCount = users.items.filter(u => u.active).length;
  document.querySelector('#active-count').textContent = activeCount;
});

// Bind list to DOM
effect(() => {
  const listHTML = users.items.map(user => {
    const badge = user.active ? '🟢' : '⚫';
    return `<li>${badge} ${user.name}</li>`;
  }).join('');

  document.querySelector('#user-list').innerHTML = listHTML;
});

users.$update(
  user => user.id === 1,
  { active: true }
);
// DOM updates automatically! ✨
// #active-count shows "2"
// #user-list shows both users with green badges
```

### With `batch()`

Use `batch()` to update multiple items but only trigger effects once.

```js
const items = collection([
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 30 }
]);

effect(() => {
  const total = items.items.reduce((sum, i) => sum + i.value, 0);
  console.log(`Total: ${total}`);
});

// WITHOUT batch - effect runs 3 times
items.$update(i => i.id === 1, { value: 100 }); // "Total: 110"
items.$update(i => i.id === 2, { value: 200 }); // "Total: 310"
items.$update(i => i.id === 3, { value: 300 }); // "Total: 600"

// WITH batch - effect runs once
batch(() => {
  items.$update(i => i.id === 1, { value: 1000 });
  items.$update(i => i.id === 2, { value: 2000 });
  items.$update(i => i.id === 3, { value: 3000 });
});
// "Total: 6000" (runs once)
```

---

## When to Use Something Else

`$update()` is powerful and flexible, but here are some alternatives for special situations:

### For Simple Single-Property Updates

If you already have a reference to the item and just need to change one property, direct mutation works great:

**$update() approach (works, but more verbose):**
```js
const user = users.items.find(u => u.id === currentUserId);
users.$update(u => u.id === currentUserId, { name: 'Alice' });
```

**Direct mutation (simpler for this case):**
```js
const user = users.items.find(u => u.id === currentUserId);
user.name = 'Alice';  // Reactivity still works! ✨
```

**Why?** When you already have the item reference, direct property assignment is cleaner. The reactivity system still detects the change!

**Rule of thumb:**
- **Already have the item?** Direct mutation is fine and simpler
- **Need to find the item?** Use `$update()` - it finds and updates in one call
- **Updating multiple properties?** Use `$update()` with object merge

### For Updating Many Items at Once (20+ items)

**Good (but may be slow for many items):**
```js
// Updates each item one at a time
todos.items.forEach(todo => {
  todos.$update(t => t.id === todo.id, { completed: true });
}); // Triggers 100+ effects if you have 100 todos
```

**Better (triggers effects once):**
```js
// Batch all updates together
batch(() => {
  todos.items.forEach(todo => {
    todos.$update(t => t.id === todo.id, { completed: true });
  });
}); // Triggers effects only once! ✨
```

**Best (for bulk updates):**
```js
// Update properties directly in a batch
batch(() => {
  todos.items.forEach(todo => {
    todo.completed = true;
  });
});
```

**Why?** `batch()` groups all changes together, so effects only run once instead of 100 times. Your UI updates once at the end instead of flickering!

**Rule of thumb:**
- **1-10 items?** Use `$update()` freely - it's perfect!
- **10-50 items?** Use `batch()` around multiple `$update()` calls
- **50+ items?** Consider direct mutation inside `batch()` for best performance

### For Complex Transformations

If your update logic is very complex, sometimes it's clearer to do it manually:

**$update() approach (works but gets messy):**
```js
todos.$update(
  t => t.priority === 'high',
  todo => ({
    ...todo,
    priority: todo.daysOverdue > 7 ? 'critical' : 'high',
    notifications: [
      ...todo.notifications,
      { type: 'escalation', date: new Date() }
    ],
    assignee: todo.assignee || getDefaultAssignee(todo),
    metadata: {
      ...todo.metadata,
      lastUpdated: Date.now(),
      updatedBy: currentUser.id
    }
  })
);
```

**Alternative (clearer for complex logic):**
```js
batch(() => {
  todos.items
    .filter(t => t.priority === 'high')
    .forEach(todo => {
      // Complex logic is easier to read step by step
      if (todo.daysOverdue > 7) {
        todo.priority = 'critical';
      }

      todo.notifications.push({
        type: 'escalation',
        date: new Date()
      });

      if (!todo.assignee) {
        todo.assignee = getDefaultAssignee(todo);
      }

      todo.metadata.lastUpdated = Date.now();
      todo.metadata.updatedBy = currentUser.id;
    });
});
```

**Why?** For complex updates with multiple conditions and nested properties, step-by-step mutation can be more readable. Use `batch()` to keep it performant!

**No wrong choices** - use what makes your code clearest and most maintainable!

---

## When NOT to Use `$update()`

### ❌ Don't use when direct mutation is simpler

```js
// BAD - overcomplicated for direct property access
const user = users.items.find(u => u.id === 1);
users.$update(u => u.id === 1, { name: 'New Name' });

// GOOD - direct mutation is fine for single property
const user = users.items.find(u => u.id === 1);
user.name = 'New Name';
```

### ❌ Don't mutate in transformation function

```js
// BAD - mutating the original item
collection.$update(predicate, (item) => {
  item.value = 10;
  return item;
});

// GOOD - return new object
collection.$update(predicate, (item) => ({
  ...item,
  value: 10
}));
```

### ❌ Don't forget to return from transformation function

```js
// BAD - no return statement
collection.$update(predicate, (item) => {
  { ...item, value: 10 };
});

// GOOD - return new object
collection.$update(predicate, (item) => ({
  ...item,
  value: 10
}));
```

---

## Real-World Example

Here's a user profile editor using `$update()`:

```js
const users = collection([
  { id: 1, name: 'Alice', email: 'alice@example.com', verified: false },
  { id: 2, name: 'Bob', email: 'bob@example.com', verified: false }
]);

// Auto-update UI
effect(() => {
  const verified = users.items.filter(u => u.verified).length;
  document.querySelector('#verified-count').textContent = verified;
});

// Verify user email
function verifyUser(userId) {
  users.$update(
    user => user.id === userId,
    { verified: true, verifiedAt: new Date() }
  );
  // UI updates automatically! ✨
}

// Update user profile
function updateProfile(userId, changes) {
  users.$update(user => user.id === userId, changes);
}

// Bulk update - add lastActive to all users
function updateLastActive() {
  users.$update(
    () => true,  // Match all users
    user => ({ ...user, lastActive: new Date() })
  );
}

// Usage
verifyUser(1);                           // Verify Alice
updateProfile(2, { name: 'Robert' });    // Update Bob's name
updateLastActive();                       // Update all users
```

**What this demonstrates:**
- Updating by ID with object merge
- Bulk updates with transformation function
- Automatic UI updates via effects
- Clean, maintainable code

---

## Common Questions

### Q: Can I update multiple items at once?

**A:** Yes! The predicate function will match all items that return `true`:

```js
// Updates ALL incomplete todos
todos.$update(
  todo => !todo.done,
  { priority: 'high' }
);
```

### Q: What's the difference between object merge and transformation function?

**A:** Object merge is simpler for adding/changing properties. Transformation function gives you full control:

```js
// Object merge - simple property updates
todos.$update(t => t.id === 1, { done: true });

// Transformation function - complex logic
todos.$update(
  t => t.id === 1,
  todo => ({
    ...todo,
    done: !todo.done,  // Toggle
    updatedAt: new Date()
  })
);
```

### Q: What happens if no items match?

**A:** Nothing! `$update()` safely does nothing if no items match:

```js
todos.$update(t => t.id === 999, { done: true });  // No error
```

### Q: Can I update nested properties?

**A:** Yes! Use a transformation function for nested updates:

```js
users.$update(
  user => user.id === 1,
  user => ({
    ...user,
    settings: {
      ...user.settings,
      darkMode: true
    }
  })
);
```

### Q: Should I use `$update()` or direct mutation?

**A:** Both work! Use `$update()` when:
- You need to find the item first
- You're updating multiple items
- You want semantic, readable code

Use direct mutation when:
- You already have the item reference
- You're changing one simple property

```js
// Direct mutation - simpler when you have the item
const user = users.items.find(u => u.id === 1);
user.name = 'Alice';

// $update() - better when you need to find it
users.$update(u => u.id === 1, { name: 'Alice' });
```

---

## Summary

**`collection.$update()` provides a semantic, powerful way to update items in reactive collections.**

Key takeaways:
- ✅ **Flexible** - Find items with predicate or value
- ✅ **Powerful** - Update with object merge OR transformation function
- ✅ **Semantic** - Clearly expresses "update items matching condition"
- ✅ **Chainable** - Returns collection for method chaining
- ✅ **Reactive** - Automatically triggers effects and updates
- ✅ Perfect for **toggling**, **editing**, **status changes**, **calculations**
- ⚠️ Always **return new object** from transformation functions
- ⚠️ Don't **mutate** items in-place
- ⚠️ Use **object merge** when possible for simplicity

**Remember:** Use `$update()` when you want a clean way to modify items in collections! 🎉

➡️ Next, explore [`collection.$remove()`]($remove.md) to remove items or [`collection.$clear()`]($clear.md) to clear collections!
