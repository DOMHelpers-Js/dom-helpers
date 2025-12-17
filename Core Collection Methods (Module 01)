# Reactive Collection Methods - Complete Guide

### A Beginner-Friendly, Crystal-Clear Documentation

---

## 📚 Table of Contents

1. [Introduction - What Are Reactive Collections?](#introduction)
2. [Core Concept - The Mental Model](#core-concept)
3. [Method 1: `collection.$add(item)`](#method-add)
4. [Method 2: `collection.$remove(predicate)`](#method-remove)
5. [Method 3: `collection.$update(predicate, updates)`](#method-update)
6. [Method 4: `collection.$clear()`](#method-clear)
7. [Property: `collection.items`](#property-items)
8. [Complete Example - Todo App](#complete-example)
9. [Quick Reference](#quick-reference)

---

<a name="introduction"></a>
## 1. Introduction - What Are Reactive Collections?

### 🎯 The Big Picture

A **reactive collection** is a smart list that automatically updates your UI when data changes.

```javascript
// Create a reactive collection
const todos = ReactiveUtils.collection([]);

// Setup auto-update (write once)
effect(() => {
  document.getElementById('list').innerHTML = 
    todos.items.map(t => `<li>${t.text}</li>`).join('');
});

// Add item - screen updates automatically! ✨
todos.$add({ text: 'Learn reactive patterns' });
```

### Key Difference

| Regular Array | Reactive Collection |
|---------------|---------------------|
| Just stores data | Stores + notifies changes |
| You update UI manually | UI updates automatically |
| `array.push(item)` | `collection.$add(item)` |

---

<a name="core-concept"></a>
## 2. Core Concept - The Mental Model

### 🧠 Think of It Like This

```
Regular Array = Silent storage box
Reactive Collection = Storage box with a loudspeaker

When data changes:
  📢 "HEY EVERYONE! SOMETHING CHANGED!"
    ↓
  All watchers update automatically
```

### The Pattern You'll Use

```javascript
// Step 1: Create collection
const items = collection([]);

// Step 2: Connect UI (once)
effect(() => {
  updateScreen(items.items);
});

// Step 3: Modify data (UI updates automatically)
items.$add(data);
items.$remove(predicate);
items.$update(predicate, updates);
items.$clear();
```

**You change data → System updates UI**

---

<a name="method-add"></a>
## 3. 📝 Method: `collection.$add(item)`

### 🧠 Think of it like this first

Imagine you're managing a **to-do list on paper**.

**The old way:**
1. Write the new task on paper ✍️
2. Walk to the bulletin board 🚶
3. Update the display 📋
4. Tell everyone about it 📢
5. Hope you didn't forget any step 🤞

**The reactive way:**
1. Tell the smart assistant: "Add this task" 🗣️
2. Everything else happens automatically ✨

👉 **`collection.$add(item)` is like that smart assistant.**

---

### ✅ What `collection.$add(item)` is

`$add()` is a method that:
* **Adds** a new item to your collection
* **Notifies** the reactive system about the change
* **Triggers** all UI updates automatically
* **Returns** the collection so you can chain more operations

**In simple words:**
> "Add this item and take care of updating everything for me."

---

### 📖 The syntax

```javascript
collection.$add(item)
```

**Parameters:**
- `item` - The thing you want to add (can be an object, string, number, anything)

**Returns:** 
- The collection itself (so you can chain: `.add().add()`)

---

### 🔧 What happens internally (step by step)

When you call `$add()`, here's what happens behind the scenes:

```
Step 1: Add item to the internal array
  └─ Like doing: this.items.push(item)

Step 2: Notify the reactive system
  └─ System says: "Hey! This collection changed!"

Step 3: Find all watchers
  └─ Every effect() that uses this collection

Step 4: Re-run all watchers
  └─ Each effect runs again with new data

Step 5: UI updates automatically
  └─ Screen shows the new item
```

**You wrote 1 line. The system did 5 steps.** That's the power of reactivity.

---

### 💡 Basic usage examples

**Example 1: Adding simple items**

```javascript
const fruits = collection([]);

fruits.$add('Apple');
fruits.$add('Banana');
fruits.$add('Orange');

console.log(fruits.items);
// ['Apple', 'Banana', 'Orange']
```

---

**Example 2: Adding objects**

```javascript
const todos = collection([]);

todos.$add({ 
  id: 1, 
  text: 'Learn JavaScript', 
  done: false 
});

todos.$add({ 
  id: 2, 
  text: 'Build a project', 
  done: false 
});

console.log(todos.length); // 2
console.log(todos.items[0].text); // 'Learn JavaScript'
```

---

**Example 3: With automatic UI updates**

```javascript
const messages = collection([]);

// Connect to UI (write once, works forever)
effect(() => {
  document.getElementById('chat').innerHTML = messages.items
    .map(msg => `<div>${msg.text}</div>`)
    .join('');
});

// Add messages
messages.$add({ text: 'Hello!' });
messages.$add({ text: 'How are you?' });
// UI updates automatically both times! ✨
```

---

### 🎯 Real-world example: Shopping Cart

Let's build a shopping cart that updates automatically.

**HTML:**
```html
<div id="cart-items"></div>
<div id="cart-count">0 items</div>
<div id="cart-total">$0.00</div>

<button onclick="addLaptop()">Add Laptop ($999)</button>
<button onclick="addMouse()">Add Mouse ($29)</button>
```

**JavaScript:**
```javascript
// Create cart
const cart = collection([]);

// Add computed property for total
cart.$computed('total', function() {
  return this.items.reduce((sum, item) => sum + item.price, 0);
});

// Auto-update cart items list
effect(() => {
  document.getElementById('cart-items').innerHTML = cart.items
    .map(item => `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>$${item.price}</span>
      </div>
    `)
    .join('');
});

// Auto-update item count
effect(() => {
  document.getElementById('cart-count').textContent = 
    `${cart.length} items`;
});

// Auto-update total price
effect(() => {
  document.getElementById('cart-total').textContent = 
    `$${cart.total.toFixed(2)}`;
});

// Add products
function addLaptop() {
  cart.$add({
    id: Date.now(),
    name: 'Laptop',
    price: 999
  });
}

function addMouse() {
  cart.$add({
    id: Date.now(),
    name: 'Mouse',
    price: 29
  });
}
```

**What happens when user clicks "Add Laptop":**

```
1. addLaptop() called
     ↓
2. cart.$add({ name: 'Laptop', price: 999 })
     ↓
3. Item added to cart.items
     ↓
4. Reactive system notified
     ↓
5. All 3 effects re-run:
     ├─ Cart items HTML updated
     ├─ Item count updated (0 → 1)
     └─ Total price updated ($0 → $999)
     ↓
6. User sees all changes instantly ✨
```

**You wrote ONE line (`cart.$add(...)`), THREE parts of UI updated automatically!**

---

### 🔗 Chaining operations

Because `$add()` returns the collection, you can chain multiple calls:

```javascript
todos
  .$add({ text: 'First task', done: false })
  .$add({ text: 'Second task', done: false })
  .$add({ text: 'Third task', done: false });
```

This is the same as:
```javascript
todos.$add({ text: 'First task', done: false });
todos.$add({ text: 'Second task', done: false });
todos.$add({ text: 'Third task', done: false });
```

**Why chaining is nice:**
- More concise and readable
- Looks like a series of actions
- Modern JavaScript style

---

### ❌ Common mistakes and how to avoid them

**Mistake #1: Using `push()` directly**

```javascript
// ❌ WRONG - Doesn't trigger reactivity
todos.items.push({ text: 'New task' });

// ✓ RIGHT - Triggers reactivity
todos.$add({ text: 'New task' });
```

**Why it matters:**  
When you use `push()` directly, the reactive system doesn't know anything changed, so your UI won't update.

---

**Mistake #2: Forgetting to use `.items` when reading**

```javascript
// ❌ WRONG - todos is not an array
const first = todos[0];  // undefined
todos.map(...)           // Error!

// ✓ RIGHT - todos.items is the array
const first = todos.items[0];  // Works!
todos.items.map(...)           // Works!
```

---

**Mistake #3: Not wrapping UI updates in `effect()`**

```javascript
// ❌ WRONG - Runs once, never updates
document.getElementById('list').innerHTML = 
  todos.items.map(t => `<li>${t.text}</li>`).join('');

todos.$add({ text: 'New' }); // List doesn't update!

// ✓ RIGHT - Updates automatically
effect(() => {
  document.getElementById('list').innerHTML = 
    todos.items.map(t => `<li>${t.text}</li>`).join('');
});

todos.$add({ text: 'New' }); // List updates! ✨
```

---

### 🎓 When to use `$add()`

**✅ Use `$add()` when:**
- Building dynamic lists (todos, comments, notifications)
- Managing shopping carts
- Handling real-time data (chat messages, live scores)
- Working with user-generated content
- Adding items that need to appear on screen

**❌ Don't need `$add()` when:**
- Working with static data that never changes
- No UI needs to update
- Simple data processing with no display

---

### 📝 Key takeaways

1. **`$add()` adds items AND triggers reactivity** - both happen together
2. **Always use `$add()` instead of `push()`** - for proper reactivity
3. **UI updates automatically** - write effects once, they work forever
4. **Returns the collection** - allows chaining multiple operations
5. **One line of code, multiple UI updates** - that's the magic ✨

---

<a name="method-remove"></a>
## 4. 🗑️ Method: `collection.$remove(predicate)`

### 🧠 Think of it like this first

Imagine you have a **list of names on sticky notes** on a wall.

**The old way to remove one:**
1. Walk to the wall 🚶
2. Find the note you want 🔍
3. Peel it off 📝
4. Update the "count" sign 🔢
5. Tell everyone it's gone 📢

**The reactive way:**
1. Say: "Remove the note that says 'Bob'" 🗣️
2. Everything else happens automatically ✨

👉 **`collection.$remove(predicate)` is that command.**

---

### ✅ What `collection.$remove(predicate)` is

`$remove()` is a method that:
* **Finds** the first item matching your condition
* **Removes** it from the collection
* **Notifies** the reactive system
* **Updates** all connected UI automatically
* **Returns** the collection for chaining

**In simple words:**
> "Find and remove this item, then update everything for me."

---

### 📖 The syntax

```javascript
collection.$remove(predicate)
```

**Parameters:**
- `predicate` - How to find the item to remove. Can be:
  - A **function**: `(item) => boolean` - returns true for item to remove
  - An **exact value**: The actual item to remove

**Returns:** 
- The collection itself (for chaining)

---

### 🔧 What happens internally (step by step)

```
Step 1: Search for matching item
  └─ If predicate is a function: find first item where predicate(item) === true
  └─ If predicate is a value: find first item that equals the value

Step 2: Remove the item
  └─ Like doing: this.items.splice(index, 1)

Step 3: Notify reactive system
  └─ "Hey! Collection changed!"

Step 4: Re-run all watchers
  └─ Every effect() updates

Step 5: UI reflects the change
  └─ Item disappears from screen
```

**Important:** Only removes the **FIRST** match. If multiple items match, only the first is removed.

---

### 💡 Usage Method 1: Remove by function

Use a function when you need to **search for an item**.

**Example: Remove by ID**

```javascript
const users = collection([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
]);

// Remove user with id 2
users.$remove(user => user.id === 2);

console.log(users.items);
// [{ id: 1, name: 'Alice' }, { id: 3, name: 'Charlie' }]
```

**How it works:**
1. Function checks each user: `user.id === 2`
2. First match found (Bob)
3. Bob removed
4. UI updates

---

**Example: Remove by property**

```javascript
const tasks = collection([
  { text: 'Buy milk', done: false },
  { text: 'Walk dog', done: true },
  { text: 'Code', done: false }
]);

// Remove first completed task
tasks.$remove(task => task.done === true);

console.log(tasks.items);
// [{ text: 'Buy milk', done: false }, { text: 'Code', done: false }]
```

---

### 💡 Usage Method 2: Remove by exact value

Use an exact value when working with **simple items** (strings, numbers).

```javascript
const tags = collection(['javascript', 'react', 'vue', 'angular']);

// Remove 'react'
tags.$remove('react');

console.log(tags.items);
// ['javascript', 'vue', 'angular']
```

**With objects (needs to be the exact same reference):**

```javascript
const items = collection([]);
const apple = { name: 'Apple', price: 1 };

items.$add(apple);
items.$add({ name: 'Banana', price: 2 });

// Remove the exact apple object
items.$remove(apple);  // Works! (same reference)

// This won't work:
items.$remove({ name: 'Apple', price: 1 });  // Different object!
```

---

### 🎯 Real-world example: Todo list with delete

**HTML:**
```html
<ul id="todo-list"></ul>
<div id="count"></div>
```

**JavaScript:**
```javascript
const todos = collection([
  { id: 1, text: 'Learn JavaScript', done: false },
  { id: 2, text: 'Build a project', done: true },
  { id: 3, text: 'Deploy app', done: false }
]);

// Auto-update todo list with delete buttons
effect(() => {
  document.getElementById('todo-list').innerHTML = todos.items
    .map(todo => `
      <li>
        <span class="${todo.done ? 'done' : ''}">${todo.text}</span>
        <button onclick="deleteTodo(${todo.id})">Delete</button>
      </li>
    `)
    .join('');
});

// Auto-update count
effect(() => {
  document.getElementById('count').textContent = 
    `${todos.length} tasks`;
});

// Delete function
function deleteTodo(id) {
  todos.$remove(todo => todo.id === id);
  // List and count update automatically! ✨
}
```

**What happens when user clicks "Delete" on task #2:**

```
1. deleteTodo(2) called
     ↓
2. todos.$remove(todo => todo.id === 2)
     ↓
3. System finds task with id 2
     ↓
4. Task removed from array
     ↓
5. Reactive system notified
     ↓
6. Both effects re-run:
     ├─ Todo list HTML updated (task disappears)
     └─ Count updated (3 → 2)
     ↓
7. User sees changes instantly ✨
```

---

### ⚠️ Important behaviors to understand

**Behavior #1: Only removes FIRST match**

```javascript
const numbers = collection([1, 2, 3, 2, 4]);

numbers.$remove(n => n === 2);

console.log(numbers.items);
// [1, 3, 2, 4]  ← Only first 2 removed
```

If you need to remove ALL matches, use a loop:
```javascript
// Remove ALL 2's
while (numbers.items.some(n => n === 2)) {
  numbers.$remove(n => n === 2);
}
```

---

**Behavior #2: If not found, nothing happens (no error)**

```javascript
todos.$remove(t => t.id === 999);
// No match found, no error, collection unchanged
```

This is actually helpful - you don't need to check if it exists first.

---

**Behavior #3: Empty predicate removes nothing**

```javascript
// This never finds a match
todos.$remove(t => false);
// Nothing removed
```

---

### 🔗 Chaining with other operations

```javascript
todos
  .$add({ id: 1, text: 'Task 1' })
  .$add({ id: 2, text: 'Task 2' })
  .$remove(t => t.id === 1);
// Only task 2 remains
```

---

### 📋 Common patterns

**Pattern #1: Remove by ID (most common)**

```javascript
items.$remove(item => item.id === targetId);
```

**Pattern #2: Remove by email**

```javascript
users.$remove(user => user.email === 'test@example.com');
```

**Pattern #3: Remove first completed item**

```javascript
todos.$remove(todo => todo.done === true);
```

**Pattern #4: Remove by name**

```javascript
products.$remove(product => product.name === 'Laptop');
```

**Pattern #5: Remove simple values**

```javascript
tags.$remove('deprecated');
colors.$remove('red');
```

---

### ❌ Common mistakes

**Mistake #1: Expecting ALL matches to be removed**

```javascript
// ❌ Thinking this removes all done todos
todos.$remove(t => t.done);  // Only removes FIRST done todo

// ✓ To remove all, use a loop
while (todos.items.some(t => t.done)) {
  todos.$remove(t => t.done);
}
```

---

**Mistake #2: Using direct array methods**

```javascript
// ❌ WRONG - Doesn't trigger reactivity
const index = todos.items.findIndex(t => t.id === 2);
todos.items.splice(index, 1);

// ✓ RIGHT - Triggers reactivity
todos.$remove(t => t.id === 2);
```

---

**Mistake #3: Comparing objects incorrectly**

```javascript
// ❌ This won't work (different object references)
todos.$remove({ id: 1, text: 'Task 1' });

// ✓ Use a function instead
todos.$remove(t => t.id === 1);
```

---

### 🎓 When to use `$remove()`

**✅ Use `$remove()` when:**
- User deletes an item (delete buttons)
- Removing items from shopping cart
- Clearing notifications
- Removing completed tasks
- User leaves a chat/room
- Deleting user accounts

---

### 📝 Key takeaways

1. **`$remove()` finds and removes the FIRST match** - not all matches
2. **Use a function for complex searches** - like finding by ID
3. **Use exact value for simple types** - strings, numbers
4. **No error if not found** - safe to call even if unsure
5. **UI updates automatically** - effects re-run after removal

---

<a name="method-update"></a>
## 5. ✏️ Method: `collection.$update(predicate, updates)`

### 🧠 Think of it like this first

Imagine you have a **file cabinet** with customer records.

**The old way to update a record:**
1. Open the drawer 🗄️
2. Find the right folder 🔍
3. Pull out the paper 📄
4. Cross out old info ✏️
5. Write new info ✍️
6. Put it back 📂
7. Update the summary board 📊
8. Notify relevant people 📢

**The reactive way:**
1. Say: "Update the record for customer #42 with this new info" 🗣️
2. Everything else happens automatically ✨

👉 **`collection.$update(predicate, updates)` is that command.**

---

### ✅ What `collection.$update(predicate, updates)` is

`$update()` is a method that:
* **Finds** the first item matching your condition
* **Merges** new values into that item (doesn't replace it)
* **Keeps** all other properties unchanged
* **Notifies** the reactive system
* **Updates** all connected UI automatically
* **Returns** the collection for chaining

**In simple words:**
> "Find this item, change these specific properties, leave everything else alone, and update the UI."

---

### 📖 The syntax

```javascript
collection.$update(predicate, updates)
```

**Parameters:**
- `predicate` - How to find the item. Can be:
  - A **function**: `(item) => boolean` - returns true for item to update
  - An **exact value**: The actual item to update
- `updates` - Object with properties to change: `{ key: newValue }`

**Returns:** 
- The collection itself (for chaining)

---

### 🔧 What happens internally (step by step)

```
Step 1: Find the item
  └─ Search for first match using predicate

Step 2: Merge updates
  └─ Like doing: Object.assign(item, updates)
  └─ Only changes properties you specify
  └─ Keeps all other properties

Step 3: Notify reactive system
  └─ "Hey! An item changed!"

Step 4: Re-run all watchers
  └─ Every effect() updates

Step 5: UI shows the changes
  └─ Screen reflects new values
```

**Key point:** It **merges**, doesn't **replace**. Original properties stay unless you override them.

---

### 💡 Basic usage

**Example 1: Update a single property**

```javascript
const users = collection([
  { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 25, email: 'bob@example.com' }
]);

// Update Bob's age
users.$update(
  user => user.id === 2,
  { age: 26 }
);

console.log(users.items);
// [
//   { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
//   { id: 2, name: 'Bob', age: 26, email: 'bob@example.com' }
//   ↑ Only age changed, everything else stayed ↑
// ]
```

---

**Example 2: Update multiple properties**

```javascript
users.$update(
  user => user.id === 1,
  { 
    name: 'Alice Smith',
    age: 31,
    email: 'alice.smith@example.com'
  }
);

console.log(users.items[0]);
// { id: 1, name: 'Alice Smith', age: 31, email: 'alice.smith@example.com' }
```

---

**Example 3: Update by exact value**

```javascript
const items = collection([
  { name: 'Apple', price: 1 }
]);

const apple = items.items[0];

items.$update(apple, { price: 1.50 });
// Apple's price changed to 1.50
```

---

### 🎯 Real-world example: Todo list with toggle

Let's build a todo app where users can mark tasks as done/undone.

**HTML:**
```html
<ul id="todo-list"></ul>
<div id="stats"></div>
```

**JavaScript:**
```javascript
const todos = collection([
  { id: 1, text: 'Learn JavaScript', done: false },
  { id: 2, text: 'Build a project', done: false },
  { id: 3, text: 'Deploy app', done: false }
]);

// Computed: count completed
todos.$computed('completed', function() {
  return this.items.filter(t => t.done).length;
});

// Auto-update todo list
effect(() => {
  document.getElementById('todo-list').innerHTML = todos.items
    .map(todo => `
      <li>
        <input 
          type="checkbox" 
          ${todo.done ? 'checked' : ''}
          onchange="toggleTodo(${todo.id})"
        >
        <span class="${todo.done ? 'line-through' : ''}">${todo.text}</span>
      </li>
    `)
    .join('');
});

// Auto-update stats
effect(() => {
  document.getElementById('stats').textContent = 
    `${todos.completed} of ${todos.length} completed`;
});

// Toggle function
function toggleTodo(id) {
  // Find current state
  const todo = todos.items.find(t => t.id === id);
  
  // Toggle done status
  todos.$update(
    t => t.id === id,
    { done: !todo.done }
  );
  // Checkbox, styling, and stats update automatically! ✨
}
```

**What happens when user checks a checkbox:**

```
1. toggleTodo(2) called
     ↓
2. Find current state: { id: 2, done: false }
     ↓
3. todos.$update(t => t.id === 2, { done: true })
     ↓
4. System finds todo #2
     ↓
5. Merge: { done: true } into todo
     ↓
6. Result: { id: 2, text: 'Build a project', done: true }
     ↓
7. Reactive system notified
     ↓
8. Both effects re-run:
     ├─ Checkbox appears checked
     ├─ Text gets line-through style
     └─ Stats show "1 of 3 completed"
     ↓
9. User sees all changes instantly ✨
```

---

### 🎯 Real-world example: Shopping cart quantity

**HTML:**
```html
<div id="cart"></div>
<div id="total"></div>
```

**JavaScript:**
```javascript
const cart = collection([
  { id: 1, name: 'Laptop', price: 999, quantity: 1 },
  { id: 2, name: 'Mouse', price: 29, quantity: 2 }
]);

// Computed: total price
cart.$computed('total', function() {
  return this.items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
});

// Auto-update cart display
effect(() => {
  document.getElementById('cart').innerHTML = cart.items
    .map(item => `
      <div>
        <span>${item.name} - $${item.price}</span>
        <button onclick="decreaseQty(${item.id})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQty(${item.id})">+</button>
      </div>
    `)
    .join('');
});

// Auto-update total
effect(() => {
  document.getElementById('total').textContent = 
    `Total: $${cart.total}`;
});

// Increase quantity
function increaseQty(id) {
  const item = cart.items.find(i => i.id === id);
  cart.$update(
    i => i.id === id,
    { quantity: item.quantity + 1 }
  );
}

// Decrease quantity
function decreaseQty(id) {
  const item = cart.items.find(i => i.id === id);
  const newQty = item.quantity - 1;
  
  if (newQty === 0) {
    cart.$remove(i => i.id === id);  // Remove if quantity reaches 0
  } else {
    cart.$update(i => i.id === id, { quantity: newQty });
  }
}
```

---

### ⚠️ Important behaviors

**Behavior #1: Only updates FIRST match**

```javascript
const items = collection([
  { id: 1, status: 'pending' },
  { id: 2, status: 'pending' }
]);

items.$update(
  item => item.status === 'pending',
  { status: 'active' }
);

console.log(items.items);
// [
//   { id: 1, status: 'active' },   ← Updated
//   { id: 2, status: 'pending' }   ← Not updated
// ]
```

---

**Behavior #2: Merges, doesn't replace**

```javascript
const user = collection([
  { id: 1, name: 'Alice', age: 30, email: 'alice@example.com', role: 'admin' }
]);

user.$update(
  u => u.id === 1,
  { age: 31 }
);

console.log(user.items[0]);
// {
//   id: 1,
//   name: 'Alice',      ← Still here
//   age: 31,            ← Changed
//   email: 'alice@...',  ← Still here
//   role: 'admin'       ← Still here
// }
```

**This is usually what you want!** You only change what needs changing.

---

**Behavior #3: Can add new properties**

```javascript
users.$update(
  u => u.id === 1,
  { lastLogin: Date.now() }  // New property!
);

// User now has a lastLogin property
```

---

### 🔗 Chaining operations

```javascript
todos
  .$add({ id: 1, text: 'Task 1', done: false })
  .$update(t => t.id === 1, { done: true })
  .$update(t => t.id === 1, { text: 'Task 1 (Updated)' });
```

---

### 📋 Common patterns

**Pattern #1: Toggle boolean**

```javascript
const item = todos.items.find(t => t.id === id);
todos.$update(
  t => t.id === id,
  { done: !item.done }
);
```

**Pattern #2: Increment number**

```javascript
const item = cart.items.find(i => i.id === id);
cart.$update(
  i => i.id === id,
  { quantity: item.quantity + 1 }
);
```

**Pattern #3: Update timestamp**

```javascript
posts.$update(
  p => p.id === id,
  { updatedAt: Date.now() }
);
```

**Pattern #4: Update nested property**

```javascript
users.$update(
  u => u.id === id,
  { 
    'address.city': 'New York',  // Won't work directly
    address: { ...user.address, city: 'New York' }  // Do this instead
  }
);
```

**Pattern #5: Conditional update**

```javascript
const item = items.items.find(i => i.id === id);
if (item.quantity > 0) {
  items.$update(
    i => i.id === id,
    { quantity: item.quantity - 1 }
  );
}
```

---

### ❌ Common mistakes

**Mistake #1: Expecting all matches to update**

```javascript
// ❌ Only updates FIRST pending item
items.$update(
  i => i.status === 'pending',
  { status: 'active' }
);

// ✓ Update all with a loop
items.items.forEach(item => {
  if (item.status === 'pending') {
    items.$update(i => i.id === item.id, { status: 'active' });
  }
});
```

---

**Mistake #2: Thinking it replaces the object**

```javascript
// ❌ Thinking this removes other properties
users.$update(
  u => u.id === 1,
  { age: 31 }
);
// Other properties (name, email) are NOT removed

// ✓ If you really want to replace:
users.$remove(u => u.id === 1);
users.$add({ id: 1, age: 31 });  // Only has id and age
```

---

**Mistake #3: Modifying without `$update`**

```javascript
// ❌ WRONG - Doesn't trigger reactivity
const user = users.items.find(u => u.id === 1);
user.age = 31;

// ✓ RIGHT - Triggers reactivity
users.$update(u => u.id === 1, { age: 31 });
```

---

### 🎓 When to use `$update()`

**✅ Use `$update()` when:**
- User toggles checkboxes (done/undone)
- Incrementing/decrementing quantities
- Updating form fields
- Changing status (pending → active → completed)
- Updating timestamps (lastModified, lastLogin)
- Editing user profiles

---

### 📝 Key takeaways

1. **`$update()` merges changes** - doesn't replace the whole object
2. **Only updates FIRST match** - use loops for updating multiple items
3. **Keeps all other properties** - very convenient and safe
4. **UI updates automatically** - effects re-run after update
5. **Perfect for editing data** - toggles, increments, status changes

---

<a name="method-clear"></a>
## 6. 🧹 Method: `collection.$clear()`

### 🧠 Think of it like this first

Imagine your collection is a **whiteboard** with sticky notes.

**The old way to clear it:**
1. Walk to the whiteboard 🚶
2. Remove each sticky note one by one 📝📝📝
3. Update the counter "0 notes" 🔢
4. Clean up the trash 🗑️
5. Tell everyone "It's empty now" 📢

**The reactive way:**
1. Press the "Clear All" button 🔴
2. Everything disappears and updates automatically ✨

👉 **`collection.$clear()` is that button.**

---

### ✅ What `collection.$clear()` is

`$clear()` is a method that:
* **Removes** ALL items from the collection at once
* **Empties** the array completely
* **Notifies** the reactive system
* **Updates** all connected UI to show empty state
* **Returns** the collection for chaining

**In simple words:**
> "Delete everything and update the UI to show it's empty."

---

### 📖 The syntax

```javascript
collection.$clear()
```

**Parameters:** None (it clears everything)

**Returns:** The collection itself (for chaining)

---

### 🔧 What happens internally (step by step)

```
Step 1: Empty the array
  └─ Like doing: this.items.length = 0

Step 2: Notify reactive system
  └─ "Hey! Collection is now empty!"

Step 3: Re-run all watchers
  └─ Every effect() updates

Step 4: UI shows empty state
  └─ Lists disappear, counters show 0, etc.
```

**Fast and efficient** - removes everything in one operation.

---

### 💡 Basic usage

```javascript
const todos = collection([
  { text: 'Task 1' },
  { text: 'Task 2' },
  { text: 'Task 3' }
]);

console.log(todos.length); // 3

todos.$clear();

console.log(todos.length);  // 0
console.log(todos.items);   // []
```

---

### 🎯 Real-world example: Clear shopping cart

**HTML:**
```html
<div id="cart-items"></div>
<div id="cart-count">0 items</div>
<button id="clear-cart" onclick="clearCart()">Clear Cart</button>
```

**JavaScript:**
```javascript
const cart = collection([
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 }
]);

// Auto-update cart display
effect(() => {
  const isEmpty = cart.length === 0;
  
  document.getElementById('cart-items').innerHTML = isEmpty
    ? '<p class="empty">Your cart is empty</p>'
    : cart.items
        .map(item => `<div>${item.name} - ${item.price}</div>`)
        .join('');
});

// Auto-update count
effect(() => {
  document.getElementById('cart-count').textContent = 
    `${cart.length} items`;
});

// Auto-show/hide clear button
effect(() => {
  document.getElementById('clear-cart').style.display = 
    cart.length > 0 ? 'block' : 'none';
});

// Clear function
function clearCart() {
  if (confirm('Clear all items from cart?')) {
    cart.$clear();
    // Cart display, count, and button all update automatically! ✨
  }
}
```

**What happens when user clicks "Clear Cart":**

```
1. clearCart() called
     ↓
2. User confirms
     ↓
3. cart.$clear()
     ↓
4. All items removed
     ↓
5. Reactive system notified
     ↓
6. All 3 effects re-run:
     ├─ Cart shows "empty" message
     ├─ Count shows "0 items"
     └─ Clear button hides
     ↓
7. User sees empty cart ✨
```

---

### 🎯 Real-world example: Reset form errors

```javascript
const formErrors = collection([]);

// Show errors
effect(() => {
  document.getElementById('errors').innerHTML = formErrors.items
    .map(err => `<div class="error">${err.message}</div>`)
    .join('');
});

// Validate form
function validateForm(data) {
  formErrors.$clear();  // Clear previous errors
  
  if (!data.email) {
    formErrors.$add({ field: 'email', message: 'Email is required' });
  }
  if (!data.email.includes('@')) {
    formErrors.$add({ field: 'email', message: 'Invalid email' });
  }
  if (!data.password) {
    formErrors.$add({ field: 'password', message: 'Password is required' });
  }
  if (data.password.length < 8) {
    formErrors.$add({ field: 'password', message: 'Password too short' });
  }
  
  return formErrors.length === 0;
}

// Form submit
document.getElementById('form').onsubmit = (e) => {
  e.preventDefault();
  const data = {
    email: e.target.email.value,
    password: e.target.password.value
  };
  
  if (validateForm(data)) {
    console.log('Form valid!');
    formErrors.$clear();  // Clear on success
  }
};
```

---

### 🎯 Real-world example: Clear search results

```javascript
const searchResults = collection([]);

// Display results
effect(() => {
  const list = document.getElementById('results');
  
  if (searchResults.length === 0) {
    list.innerHTML = '<p>No results</p>';
  } else {
    list.innerHTML = searchResults.items
      .map(item => `<div>${item.title}</div>`)
      .join('');
  }
});

// Search function
async function search(query) {
  searchResults.$clear();  // Clear old results
  
  if (!query.trim()) return;
  
  const results = await fetchSearchResults(query);
  results.forEach(item => searchResults.$add(item));
}

// Clear search
function clearSearch() {
  document.getElementById('search-input').value = '';
  searchResults.$clear();
}
```

---

### 📋 Common patterns

**Pattern #1: Clear and reload**

```javascript
function refreshData() {
  items.$clear();
  
  // Fetch fresh data
  fetchItems().then(data => {
    data.forEach(item => items.$add(item));
  });
}
```

**Pattern #2: Clear before adding new data**

```javascript
function loadUserPosts(userId) {
  posts.$clear();  // Remove old posts first
  
  fetch(`/api/users/${userId}/posts`)
    .then(res => res.json())
    .then(data => {
      data.forEach(post => posts.$add(post));
    });
}
```

**Pattern #3: Reset to initial state**

```javascript
const initialItems = [
  { id: 1, name: 'Default Item' }
];

function resetToDefaults() {
  items.$clear();
  initialItems.forEach(item => items.$add(item));
}
```

**Pattern #4: Clear filtered items**

```javascript
function clearCompleted() {
  // Get all completed items
  const completed = todos.items.filter(t => t.done);
  
  // Remove each one
  completed.forEach(todo => todos.$remove(todo));
  
  // Or: clear all and re-add incomplete ones
  // const incomplete = todos.items.filter(t => !t.done);
  // todos.$clear();
  // incomplete.forEach(t => todos.$add(t));
}
```

**Pattern #5: Clear on logout**

```javascript
function logout() {
  userData.$clear();
  notifications.$clear();
  cart.$clear();
  
  // Navigate to login
  window.location.href = '/login';
}
```

---

### 🔗 Chaining operations

```javascript
// Clear and rebuild
items
  .$clear()
  .$add({ name: 'Item 1' })
  .$add({ name: 'Item 2' })
  .$add({ name: 'Item 3' });
```

---

### ❌ Common mistakes

**Mistake #1: Thinking items are still accessible**

```javascript
const firstItem = todos.items[0];

todos.$clear();

console.log(firstItem);  // Still exists (reference kept)
console.log(todos.items[0]);  // undefined (collection is empty)
```

**Tip:** `$clear()` empties the collection, but if you saved references to items before clearing, those references still point to the original objects.

---

**Mistake #2: Not confirming before clearing**

```javascript
// ❌ User might click by accident
function clearAll() {
  items.$clear();  // Data gone forever!
}

// ✓ Ask for confirmation
function clearAll() {
  if (confirm('Are you sure? This cannot be undone.')) {
    items.$clear();
  }
}
```

---

**Mistake #3: Clearing when you meant to remove specific items**

```javascript
// ❌ Clears everything
todos.$clear();

// ✓ Remove only completed
const completed = todos.items.filter(t => t.done);
completed.forEach(t => todos.$remove(t));
```

---

### 🎓 When to use `$clear()`

**✅ Use `$clear()` when:**
- User clicks "Clear All" / "Empty Cart"
- Resetting forms or clearing errors
- Logging out (clearing user data)
- Starting a new search (clearing old results)
- Switching views (loading different data)
- Clearing notifications
- Resetting the app to initial state

**❌ Don't use when:**
- You only want to remove some items (use `$remove()` instead)
- You want to filter (use `$remove()` in a loop)
- Data needs to be saved first (clear after confirming)

---

### 📝 Key takeaways

1. **`$clear()` removes ALL items** - empties the entire collection
2. **Fast and efficient** - one operation, not looping
3. **UI updates automatically** - shows empty state
4. **Use with confirmation** - for user-triggered clears
5. **Perfect for reset operations** - forms, searches, logouts

---

<a name="property-items"></a>
## 7. 📦 Property: `collection.items`

### 🧠 Think of it like this first

Imagine your collection is a **smart box** 📦.

* The box manages changes for you
* It knows when items are added, removed, or updated
* It automatically tells the UI to update

Inside that smart box, there is one **normal JavaScript array**.

👉 That array is `collection.items`.

---

### ✅ What `collection.items` is

`collection.items` is:
* The **real array** that holds your data
* A plain JavaScript array (`[]`)
* **Safe to read from**
* **NOT safe to change directly**

**In simple words:**
> "This is where your data lives, but you should only look at it, not touch it."

---

### ❌ What you should NOT do

You should **not** modify the array directly, like:

```javascript
todos.items.push({ text: 'Task 3' });   // ❌ Don't do this
todos.items.splice(0, 1);               // ❌ Don't do this
todos.items[0] = newItem;               // ❌ Don't do this
todos.items.pop();                      // ❌ Don't do this
todos.items.shift();                    // ❌ Don't do this
```

**Why?**

Because the collection will **not know** something changed, and your UI or effects may not update correctly.

**The reactive system is bypassed** - it's like sneaking past a security guard.

---

### ✅ What you SHOULD do with `items`

Use `items` for **reading only**. Here are safe operations:

**1️⃣ Read the entire array**

```javascript
console.log(todos.items);
// [{ text: 'Task 1' }, { text: 'Task 2' }]
```

**2️⃣ Check length**

```javascript
console.log(todos.items.length);
// 2

// Or use the shortcut:
console.log(todos.length);
// 2
```

**3️⃣ Access a single item**

```javascript
const first = todos.items[0];
console.log(first);
// { text: 'Task 1' }
```

**4️⃣ Check if empty**

```javascript
if (todos.items.length === 0) {
  console.log('No todos!');
}

// Or:
if (todos.length === 0) {
  console.log('No todos!');
}
```

---

### 🔍 Using array methods (read-only)

You can safely use **read-only** array methods. These don't modify the original array:

**`map` - Transform data**

```javascript
const texts = todos.items.map(t => t.text);
// ['Task 1', 'Task 2']

const uppercase = todos.items.map(t => t.text.toUpperCase());
// ['TASK 1', 'TASK 2']
```

**`find` - Get one item**

```javascript
const first = todos.items.find(t => t.text === 'Task 1');
// { text: 'Task 1' }

const withId = todos.items.find(t => t.id === 42);
// { id: 42, text: 'Some task' } or undefined
```

**`filter` - Create a new list**

```javascript
const completed = todos.items.filter(t => t.done);
// Only done tasks

const pending = todos.items.filter(t => !t.done);
// Only undone tasks
```

**`some` - Check if any match**

```javascript
const hasCompleted = todos.items.some(t => t.done);
// true or false
```

**`every` - Check if all match**

```javascript
const allCompleted = todos.items.every(t => t.done);
// true or false
```

**`reduce` - Calculate something**

```javascript
const totalPrice = cart.items.reduce((sum, item) => {
  return sum + item.price;
}, 0);
// Total of all prices
```

**`forEach` - Loop through items**

```javascript
todos.items.forEach((todo, index) => {
  console.log(`${index + 1}. ${todo.text}`);
});
```

**`slice` - Get a portion**

```javascript
const firstThree = todos.items.slice(0, 3);
// First 3 items (doesn't modify original)
```

---

### 👉 These methods are **safe** because they:
- Don't change the original array
- Return new data or values
- Only **read**, never **write**

---

### ⚡ Why `items` is perfect for rendering UI

Because `items` always reflects the latest state, it's ideal for displaying data:

```javascript
effect(() => {
  document.getElementById('list').innerHTML = todos.items
    .map(todo => `<li>${todo.text}</li>`)
    .join('');
});
```

**What's happening here:**

1. `effect` watches `todos`
2. It reads `todos.items` to build HTML
3. When `todos` changes (via `$add`, `$remove`, etc.)
4. The effect re-runs automatically
5. UI stays in sync ✨

---

### 📋 Real-world patterns

**Pattern #1: Display list**

```javascript
effect(() => {
  const html = users.items
    .map(user => `<div>${user.name}</div>`)
    .join('');
  document.getElementById('users').innerHTML = html;
});
```

**Pattern #2: Show count**

```javascript
effect(() => {
  document.getElementById('count').textContent = 
    `${todos.items.length} tasks`;
});
```

**Pattern #3: Calculate total**

```javascript
effect(() => {
  const total = cart.items.reduce((sum, item) => 
    sum + item.price, 0
  );
  document.getElementById('total').textContent = `${total}`;
});
```

**Pattern #4: Conditional rendering**

```javascript
effect(() => {
  const isEmpty = todos.items.length === 0;
  
  document.getElementById('list').innerHTML = isEmpty
    ? '<p>No todos yet!</p>'
    : todos.items.map(t => `<li>${t.text}</li>`).join('');
});
```

**Pattern #5: Filter and display**

```javascript
effect(() => {
  const completed = todos.items.filter(t => t.done);
  document.getElementById('completed').innerHTML = 
    completed.map(t => `<li>${t.text}</li>`).join('');
});
```

---

### 🧩 Simple rule to remember

```
Use collection.items to READ data
Use collection methods to CHANGE data
```

| Action | Use This | Not This |
|--------|----------|----------|
| Add item | `collection.$add(item)` | `collection.items.push(item)` |
| Remove item | `collection.$remove(pred)` | `collection.items.splice(...)` |
| Update item | `collection.$update(pred, data)` | `collection.items[0] = ...` |
| Clear all | `collection.$clear()` | `collection.items.length = 0` |
| **Read data** | `collection.items.map(...)` ✓ | - |
| **Check length** | `collection.items.length` ✓ | - |
| **Find item** | `collection.items.find(...)` ✓ | - |

---

### 🎯 Why this separation exists

**Design principle:**

```
collection        = Smart wrapper (methods, reactivity)
collection.items  = Plain data (array)
```

**Benefits:**

1. **Clear separation** - reading vs writing
2. **Use familiar array methods** - `map`, `filter`, etc.
3. **Reactivity stays intact** - can't accidentally break it
4. **Predictable behavior** - always know what's safe

---

### ❌ Common mistakes

**Mistake #1: Modifying directly**

```javascript
// ❌ WRONG - Bypasses reactivity
todos.items.push({ text: 'New task' });

// ✓ RIGHT - Triggers reactivity
todos.$add({ text: 'New task' });
```

---

**Mistake #2: Expecting direct modification to work**

```javascript
// ❌ This won't update the UI
todos.items[0].done = true;

// ✓ This will
todos.$update(t => t.id === todos.items[0].id, { done: true });
```

---

**Mistake #3: Confusing collection with items**

```javascript
// ❌ Wrong - todos is not an array
todos.map(t => t.text)

// ✓ Right - todos.items is the array
todos.items.map(t => t.text)
```

---

### 💡 Pro tip: Use computed properties

Instead of repeating complex calculations, use computed properties:

```javascript
const todos = collection([...]);

// Define computed
todos.$computed('completed', function() {
  return this.items.filter(t => t.done).length;
});

todos.$computed('remaining', function() {
  return this.items.filter(t => !t.done).length;
});

// Use in effects
effect(() => {
  document.getElementById('stats').textContent = 
    `${todos.remaining} remaining, ${todos.completed} completed`;
});
```

---

### 📝 Key takeaways

1. **`collection.items` is the actual array** - where data lives
2. **Read from it freely** - `map`, `filter`, `find`, etc.
3. **Never modify it directly** - use `$add`, `$remove`, `$update`, `$clear`
4. **Perfect for UI rendering** - always reflects current state
5. **Follow the rule:** Read with `items`, write with methods

---

If you follow this rule:
* ✅ Your code stays predictable
* ✅ Reactivity works correctly
* ✅ Bugs are avoided
* ✅ Your library feels magical instead of confusing 😄

---

<a name="complete-example"></a>
## 8. 🎓 Complete Example - Full Todo App

Let's put everything together into one complete, working application.

### HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>Reactive Todo App</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; }
    .done { text-decoration: line-through; opacity: 0.6; }
    button { margin: 5px; padding: 8px 16px; cursor: pointer; }
    input[type="text"] { padding: 8px; width: 70%; }
    .error { color: red; font-size: 14px; margin-top: 5px; }
    .empty { color: #999; font-style: italic; }
    #stats { margin: 20px 0; padding: 10px; background: #f0f0f0; }
  </style>
</head>
<body>
  <h1>My Todo List</h1>
  
  <form id="add-form">
    <input type="text" id="todo-input" placeholder="What needs to be done?" />
    <button type="submit">Add</button>
  </form>
  <div id="error" class="error"></div>
  
  <div id="stats"></div>
  
  <ul id="todo-list"></ul>
  
  <div id="actions">
    <button id="clear-completed" onclick="clearCompleted()">
      Clear Completed
    </button>
    <button id="clear-all" onclick="clearAll()">
      Clear All
    </button>
  </div>
</body>
</html>
```

---

### JavaScript - Complete Working App

```javascript
// ============================================================
// CREATE COLLECTION
// ============================================================

const todos = ReactiveUtils.collection([
  { id: 1, text: 'Learn reactive patterns', done: false },
  { id: 2, text: 'Build a todo app', done: true },
  { id: 3, text: 'Deploy to production', done: false }
]);

// ============================================================
// COMPUTED PROPERTIES
// ============================================================

todos.$computed('completed', function() {
  return this.items.filter(t => t.done).length;
});

todos.$computed('remaining', function() {
  return this.items.filter(t => !t.done).length;
});

todos.$computed('total', function() {
  return this.items.length;
});

// ============================================================
// AUTO-UPDATE TODO LIST
// ============================================================

effect(() => {
  const list = document.getElementById('todo-list');
  
  if (todos.items.length === 0) {
    list.innerHTML = '<li class="empty">No todos yet. Add one above!</li>';
    return;
  }
  
  list.innerHTML = todos.items
    .map(todo => `
      <li>
        <input 
          type="checkbox" 
          ${todo.done ? 'checked' : ''}
          onchange="toggleTodo(${todo.id})"
        />
        <span class="${todo.done ? 'done' : ''}">${todo.text}</span>
        <button onclick="deleteTodo(${todo.id})">Delete</button>
      </li>
    `)
    .join('');
});

// ============================================================
// AUTO-UPDATE STATS
// ============================================================

effect(() => {
  document.getElementById('stats').innerHTML = `
    <strong>${todos.total}</strong> total tasks<br>
    <strong>${todos.remaining}</strong> remaining<br>
    <strong>${todos.completed}</strong> completed
  `;
});

// ============================================================
// AUTO-SHOW/HIDE BUTTONS
// ============================================================

effect(() => {
  document.getElementById('clear-completed').style.display = 
    todos.completed > 0 ? 'inline-block' : 'none';
});

effect(() => {
  document.getElementById('clear-all').style.display = 
    todos.total > 0 ? 'inline-block' : 'none';
});

// ============================================================
// ADD TODO
// ============================================================

document.getElementById('add-form').onsubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById('todo-input');
  const errorDiv = document.getElementById('error');
  
  // Validate
  if (!input.value.trim()) {
    errorDiv.textContent = 'Please enter a task';
    return;
  }
  
  // Clear error
  errorDiv.textContent = '';
  
  // Add todo
  todos.$add({
    id: Date.now(),
    text: input.value.trim(),
    done: false
  });
  
  // Clear input
  input.value = '';
};

// ============================================================
// TOGGLE TODO
// ============================================================

function toggleTodo(id) {
  const todo = todos.items.find(t => t.id === id);
  todos.$update(
    t => t.id === id,
    { done: !todo.done }
  );
}

// ============================================================
// DELETE TODO
// ============================================================

function deleteTodo(id) {
  todos.$remove(t => t.id === id);
}

// ============================================================
// CLEAR COMPLETED
// ============================================================

function clearCompleted() {
  const completed = todos.items.filter(t => t.done);
  completed.forEach(todo => todos.$remove(todo));
}

// ============================================================
// CLEAR ALL
// ============================================================

function clearAll() {
  if (confirm('Clear all todos? This cannot be undone.')) {
    todos.$clear();
  }
}
```

---

### What This Example Demonstrates

✅ **`$add()`** - Adding new todos from form  
✅ **`$remove()`** - Deleting individual todos  
✅ **`$update()`** - Toggling done/undone status  
✅ **`$clear()`** - Clearing all todos at once  
✅ **`items`** - Reading data for display  
✅ **Computed properties** - Calculating counts automatically  
✅ **Multiple effects** - Different UI parts updating independently  
✅ **Form validation** - Showing errors  
✅ **Conditional rendering** - Show/hide buttons, empty state  
✅ **Real reactivity** - Everything updates automatically

---

### Try It Yourself

**Operations to test:**

1. **Add todos** - Type and press Enter
2. **Toggle checkboxes** - Watch stats update
3. **Delete individual todos** - Click Delete buttons
4. **Clear completed** - Only removes done tasks
5. **Clear all** - Empties entire list

**Watch how:**
- Stats update automatically
- Buttons appear/disappear based on state
- Empty message shows when no todos
- No manual DOM manipulation needed

---

<a name="quick-reference"></a>
## 9. 📚 Quick Reference

### Creating Collections

```javascript
// Empty collection
const items = ReactiveUtils.collection([]);

// With initial data
const todos = ReactiveUtils.collection([
  { text: 'Task 1', done: false }
]);

// Alias
const users = ReactiveUtils.list([]);
```

---

### Method Summary Table

| Method | What It Does | Example |
|--------|--------------|---------|
| `$add(item)` | Add one item | `todos.$add({ text: 'New' })` |
| `$remove(predicate)` | Remove first match | `todos.$remove(t => t.id === 1)` |
| `$update(predicate, updates)` | Update first match | `todos.$update(t => t.id === 1, { done: true })` |
| `$clear()` | Remove all items | `todos.$clear()` |
| `items` | Get the array | `todos.items.map(...)` |
| `length` | Get count | `todos.length` |

---

### CRUD Pattern

```javascript
// CREATE
items.$add({ name: 'New Item', active: true });

// READ
const item = items.items.find(i => i.id === targetId);
const all = items.items;
const count = items.length;

// UPDATE
items.$update(i => i.id === targetId, { name: 'Updated' });

// DELETE
items.$remove(i => i.id === targetId);
```

---

### Chaining Operations

```javascript
todos
  .$add({ text: 'Task 1', done: false })
  .$add({ text: 'Task 2', done: false })
  .$update(t => t.text === 'Task 1', { done: true })
  .$remove(t => t.text === 'Task 2');
```

---

### Common Patterns Cheat Sheet

**Find by ID:**
```javascript
const item = items.items.find(i => i.id === targetId);
```

**Filter items:**
```javascript
const active = items.items.filter(i => i.active);
const inactive = items.items.filter(i => !i.active);
```

**Check if empty:**
```javascript
if (items.length === 0) { /* empty */ }
```

**Count matches:**
```javascript
const count = items.items.filter(i => i.done).length;
```

**Map to values:**
```javascript
const names = users.items.map(u => u.name);
```

**Toggle boolean:**
```javascript
const item = items.items.find(i => i.id === id);
items.$update(i => i.id === id, { active: !item.active });
```

**Increment number:**
```javascript
const item = cart.items.find(i => i.id === id);
cart.$update(i => i.id === id, { quantity: item.quantity + 1 });
```

---

### The Golden Rules

**1. Use methods to modify (write):**
```javascript
✓ collection.$add(item)
✓ collection.$remove(predicate)
✓ collection.$update(predicate, updates)
✓ collection.$clear()
```

**2. Use `items` to read:**
```javascript
✓ collection.items.map(...)
✓ collection.items.filter(...)
✓ collection.items.find(...)
✓ collection.items[0]
✓ collection.items.length
```

**3. Never modify `items` directly:**
```javascript
✗ collection.items.push(item)
✗ collection.items.splice(...)
✗ collection.items[0] = newItem
✗ collection.items.pop()
```

**4. Put UI updates in `effect()`:**
```javascript
✓ effect(() => {
    updateDOM(collection.items);
  });
```

---

### Quick Comparison: Wrong vs Right

| Task | ❌ Wrong | ✓ Right |
|------|---------|---------|
| Add item | `items.items.push(x)` | `items.$add(x)` |
| Remove item | `items.items.splice(i, 1)` | `items.$remove(pred)` |
| Update item | `items.items[0].x = y` | `items.$update(pred, {x: y})` |
| Clear all | `items.items = []` | `items.$clear()` |
| Read data | N/A | `items.items.map(...)` ✓ |

---

### Pro Tips

**Tip #1: Use computed properties for derived data**
```javascript
items.$computed('total', function() {
  return this.items.reduce((sum, i) => sum + i.price, 0);
});
```

**Tip #2: Always confirm before clearing**
```javascript
if (confirm('Clear all?')) {
  items.$clear();
}
```

**Tip #3: Check existence before updating**
```javascript
const item = items.items.find(i => i.id === id);
if (item) {
  items.$update(i => i.id === id, updates);
}
```

**Tip #4: Use effects for automatic updates**
```javascript
effect(() => {
  // This runs automatically when items changes
  render(items.items);
});
```

**Tip #5: Batch related operations**
```javascript
// Good: Chain operations
items.$add(item1).$add(item2).$add(item3);

// Also good: Use loops
data.forEach(item => items.$add(item));
```

---

## 🎉 Conclusion

You now understand all core collection methods:

✅ **`$add(item)`** - Add items with automatic UI updates  
✅ **`$remove(predicate)`** - Remove items safely  
✅ **`$update(predicate, updates)`** - Update items partially  
✅ **`$clear()`** - Empty the collection  
✅ **`items`** - Read data without breaking reactivity  

**The Magic Formula:**

```
Change data with methods ($add, $remove, $update, $clear)
     ↓
Reactive system notifies watchers
     ↓
UI updates automatically
     ↓
You write less code, get fewer bugs
```

---

### Remember the Core Principle

**Data-driven, not command-driven:**

```javascript
// Old way: Tell the computer HOW to update everything
items.push(item);
updateList();
updateCount();
updateTotal();

// Reactive way: Tell the computer WHAT changed
items.$add(item);
// Everything else happens automatically ✨
```

---

### What Makes This Powerful

1. **Write effects once** - they work forever
2. **Change data anywhere** - UI stays in sync
3. **No manual DOM manipulation** - system handles it
4. **Fewer bugs** - can't forget to update
5. **Easier to maintain** - one source of truth
6. **Better team consistency** - same patterns everywhere

---

### Next Steps

Now that you know collections, explore:

- **Computed properties** - Derive values automatically
- **Effects** - How the reactive system works
- **Forms** - Reactive form handling
- **Advanced patterns** - Nested collections, filtering, sorting

---

**Happy coding with reactive collections!** 🚀✨
