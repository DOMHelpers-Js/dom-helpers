# Module 02: Reactive Arrays - Making Lists Come Alive

Welcome back! In the previous module, you learned about reactive state. Now you'll learn how to make arrays (lists) work seamlessly with the reactive system.

---

## 1. Module Overview

### What is the Reactive Array Patch?

The **Reactive Array Patch** is an enhancement that makes JavaScript's built-in array methods (like `push`, `pop`, `sort`) work automatically with reactive state. Think of it as teaching your arrays new tricks!

**In simple terms:** Without this patch, changing an array doesn't trigger updates. With this patch, array changes work just like regular property changes.

### What You'll Learn

In this module, you'll learn:
- Why arrays need special handling
- Which array methods become reactive
- How to add, remove, and modify items in arrays
- How to avoid common array pitfalls
- Best practices for working with reactive arrays

---

## 2. The Problem It Solves

### Arrays Are Tricky in Reactive Systems

Remember from Module 01 that reactive state automatically updates your UI when properties change. But arrays have a special problem:

#### The Problem

```javascript
// Create reactive state with an array
const state = ReactiveUtils.state({
  todos: [
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Walk dog', done: false }
  ]
});

// Bind to display the todo count
state.$bind({
  '#todoCount': () => `${state.todos.length} tasks`
});

// Now try to add a new todo
state.todos.push({ id: 3, text: 'Read book', done: false });

// ❌ WITHOUT the array patch: The display doesn't update!
// The array changed, but the reactive system didn't notice.

// ✅ WITH the array patch: The display updates automatically!
// The reactive system detects the push() and triggers updates.
```

### Why Does This Happen?

When you write `state.todos.push(...)`, JavaScript is calling a method on the array. The reactive system watches for property assignments (like `state.todos = ...`), but it doesn't know about array methods by default.

**It's like having a security camera (reactive system) that watches the front door (property changes) but doesn't see the side door (array methods).** The array patch adds cameras to all the doors!

### What Needs Special Handling?

These common array operations don't trigger reactivity without the patch:

```javascript
const state = ReactiveUtils.state({ items: [1, 2, 3] });

// ❌ These DON'T trigger updates (without the patch):
state.items.push(4);           // Add to end
state.items.pop();             // Remove from end
state.items.shift();           // Remove from start
state.items.unshift(0);        // Add to start
state.items.splice(1, 1);      // Remove/add at index
state.items.sort();            // Sort the array
state.items.reverse();         // Reverse the array

// ✅ This DOES trigger updates (but it's awkward):
state.items = [...state.items, 4];  // Copying the whole array every time!
```

**The pain points:**
1. ❌ Natural array methods don't work
2. ❌ You have to copy the entire array for every change
3. ❌ Code becomes unnatural and hard to read
4. ❌ Performance suffers with large arrays
5. ❌ You keep forgetting which approach to use

---

## 3. How This Module Helps

### The Solution: Automatic Array Method Tracking

The Reactive Array Patch enhances array methods so they automatically trigger reactive updates.

**Before the patch:**
```javascript
const state = ReactiveUtils.state({ items: [1, 2, 3] });

// Adding an item the awkward way:
state.items = [...state.items, 4];

// Removing an item the awkward way:
const index = state.items.indexOf(2);
state.items = state.items.filter((_, i) => i !== index);

// Sorting the awkward way:
state.items = [...state.items].sort();
```

**After the patch:**
```javascript
const state = ReactiveUtils.state({ items: [1, 2, 3] });

// Adding an item the natural way:
state.items.push(4);  // ✅ Works and triggers updates!

// Removing an item the natural way:
const index = state.items.indexOf(2);
state.items.splice(index, 1);  // ✅ Works and triggers updates!

// Sorting the natural way:
state.items.sort();  // ✅ Works and triggers updates!
```

### What Gets Patched?

The patch enhances these 9 array methods:

| Method | What It Does | Example |
|--------|--------------|---------|
| `push()` | Add items to end | `items.push(4, 5)` |
| `pop()` | Remove last item | `const last = items.pop()` |
| `shift()` | Remove first item | `const first = items.shift()` |
| `unshift()` | Add items to start | `items.unshift(0, 1)` |
| `splice()` | Add/remove at index | `items.splice(2, 1, 'new')` |
| `sort()` | Sort in place | `items.sort((a,b) => a-b)` |
| `reverse()` | Reverse order | `items.reverse()` |
| `fill()` | Fill with value | `items.fill(0)` |
| `copyWithin()` | Copy within array | `items.copyWithin(0, 3)` |

**All of these now trigger reactive updates automatically!**

---

## 4. How It Works

### The Magic Behind the Scenes

When you load the Reactive Array Patch, here's what happens:

```
Without Patch:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Array Method Called
     │
     ▼
Array Changes
     │
     ▼
❌ Reactive System: "I didn't see anything!"


With Patch:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Array Method Called
     │
     ▼
Patch Intercepts Call
     │
     ▼
Original Array Method Runs
     │
     ▼
✅ Patch Notifies Reactive System
     │
     ▼
UI Updates Automatically!
```

### How the Patch Works

1. **Detection:** When you create reactive state, the patch detects any array properties

2. **Wrapping:** The patch wraps each array with special versions of the 9 methods

3. **Notification:** When you call a method (like `push`), the wrapper:
   - Calls the original method
   - Notifies the reactive system that the array changed
   - Triggers all updates automatically

**Think of it as:** Adding a smart notification system to your arrays. Every time you use an array method, the patch taps the reactive system on the shoulder and says, "Hey! This array just changed!"

### Visual Representation

```
┌────────────────────────────────────────┐
│  Reactive State                        │
│  ┌──────────────────────────────────┐ │
│  │ todos: [📝, 📝, 📝]              │ │
│  │         ↑                         │ │
│  │         │                         │ │
│  │   ┌─────┴─────┐                  │ │
│  │   │  Patched  │                  │ │
│  │   │  Array    │                  │ │
│  │   │  Methods  │                  │ │
│  │   └───────────┘                  │ │
│  │                                   │ │
│  │   When you call:                 │ │
│  │   • push()    ────┐              │ │
│  │   • pop()     ────┤              │ │
│  │   • splice()  ────┤              │ │
│  │   • etc.      ────┤              │ │
│  │                   │              │ │
│  │                   ▼              │ │
│  │           ┌────────────────┐    │ │
│  │           │ Notify Reactive│    │ │
│  │           │     System     │    │ │
│  │           └────────────────┘    │ │
│  └──────────────────────────────────┘ │
│                   │                   │
│                   ▼                   │
│         Updates Happen Automatically  │
└────────────────────────────────────────┘
```

---

## 5. Practical Examples

### Example 1: Todo List (Complete Implementation)

Let's build a fully functional todo list:

```javascript
// Step 1: Create reactive state with an array
const todoApp = ReactiveUtils.state({
  todos: []
});

// Step 2: Add computed properties
todoApp.$computed('totalTodos', function() {
  return this.todos.length;
});

todoApp.$computed('completedTodos', function() {
  return this.todos.filter(todo => todo.done).length;
});

todoApp.$computed('remainingTodos', function() {
  return this.todos.filter(todo => !todo.done).length;
});

todoApp.$computed('allDone', function() {
  return this.todos.length > 0 &&
         this.todos.every(todo => todo.done);
});

// Step 3: Bind to HTML
todoApp.$bind({
  '#todoCount': () => `${todoApp.remainingTodos} of ${todoApp.totalTodos} remaining`,
  '#allDoneMessage': {
    hidden: () => !todoApp.allDone,
    textContent: () => 'All tasks completed! Well done!'
  }
});

// Step 4: Functions to manage todos

// Add a new todo (using push - automatically updates UI!)
function addTodo(text) {
  todoApp.todos.push({
    id: Date.now(),
    text: text,
    done: false,
    createdAt: new Date()
  });
  // ✅ Everything updates automatically!
}

// Remove a todo (using splice - automatically updates UI!)
function removeTodo(id) {
  const index = todoApp.todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todoApp.todos.splice(index, 1);
    // ✅ Automatically updates!
  }
}

// Toggle todo completion
function toggleTodo(id) {
  const todo = todoApp.todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    todoApp.$notify('todos');  // Notify because we changed a nested property
  }
}

// Sort todos by text (using sort - automatically updates UI!)
function sortTodos() {
  todoApp.todos.sort((a, b) => a.text.localeCompare(b.text));
  // ✅ Automatically updates!
}

// Clear all completed todos
function clearCompleted() {
  // Get indexes of completed todos (from end to start)
  for (let i = todoApp.todos.length - 1; i >= 0; i--) {
    if (todoApp.todos[i].done) {
      todoApp.todos.splice(i, 1);  // Remove each completed todo
    }
  }
  // ✅ Each splice triggers an update!
}

// Example usage:
addTodo('Buy milk');
addTodo('Walk dog');
addTodo('Read book');
```

**HTML:**
```html
<div id="todoApp">
  <h2>My Todos</h2>
  <p id="todoCount">0 of 0 remaining</p>
  <p id="allDoneMessage" hidden>All tasks completed!</p>

  <input type="text" id="newTodoInput" placeholder="What needs to be done?">
  <button onclick="addTodo(document.getElementById('newTodoInput').value)">
    Add Todo
  </button>

  <ul id="todoList"></ul>

  <button onclick="sortTodos()">Sort A-Z</button>
  <button onclick="clearCompleted()">Clear Completed</button>
</div>
```

### Example 2: Shopping Cart with Items

```javascript
// Create shopping cart
const cart = ReactiveUtils.state({
  items: []
});

// Computed: total price
cart.$computed('totalPrice', function() {
  return this.items.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0
  );
});

// Computed: total items
cart.$computed('itemCount', function() {
  return this.items.reduce((sum, item) =>
    sum + item.quantity, 0
  );
});

// Bind to HTML
cart.$bind({
  '#itemCount': () => `${cart.itemCount} items`,
  '#totalPrice': () => `$${cart.totalPrice.toFixed(2)}`,
  '#emptyCart': {
    hidden: () => cart.items.length > 0
  },
  '#cartItems': {
    hidden: () => cart.items.length === 0
  }
});

// Add item to cart
function addToCart(product) {
  // Check if item already exists
  const existing = cart.items.find(item => item.id === product.id);

  if (existing) {
    // Increase quantity
    existing.quantity++;
    cart.$notify('items');  // Notify about nested change
  } else {
    // Add new item (push triggers update automatically!)
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    // ✅ UI updates automatically!
  }
}

// Remove item from cart
function removeFromCart(productId) {
  const index = cart.items.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart.items.splice(index, 1);  // Remove triggers update automatically!
    // ✅ UI updates automatically!
  }
}

// Update quantity
function updateQuantity(productId, newQuantity) {
  const item = cart.items.find(item => item.id === productId);
  if (item) {
    if (newQuantity <= 0) {
      // Remove item
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      cart.$notify('items');
    }
  }
}

// Clear entire cart
function clearCart() {
  cart.items = [];  // Replacing the array triggers update
  // ✅ UI updates automatically!
}

// Sort items by price
function sortByPrice() {
  cart.items.sort((a, b) => a.price - b.price);
  // ✅ UI updates automatically!
}
```

### Example 3: Message List with Auto-Scroll

```javascript
// Create message list
const chat = ReactiveUtils.state({
  messages: [],
  maxMessages: 50
});

// Computed: unread count
chat.$computed('unreadCount', function() {
  return this.messages.filter(msg => !msg.read).length;
});

// Watch messages array for auto-cleanup
chat.$watch('messages', () => {
  // Keep only the last 50 messages
  if (chat.messages.length > chat.maxMessages) {
    const excess = chat.messages.length - chat.maxMessages;
    chat.messages.splice(0, excess);  // Remove from start
    // ✅ Automatically updates!
  }
});

// Bind to HTML
chat.$bind({
  '#messageCount': () => chat.messages.length,
  '#unreadBadge': {
    textContent: () => chat.unreadCount,
    hidden: () => chat.unreadCount === 0
  }
});

// Add new message
function addMessage(text, sender) {
  chat.messages.push({
    id: Date.now(),
    text: text,
    sender: sender,
    timestamp: new Date(),
    read: false
  });
  // ✅ UI updates automatically!
  // Watcher will remove old messages if needed!
}

// Mark message as read
function markAsRead(messageId) {
  const message = chat.messages.find(msg => msg.id === messageId);
  if (message) {
    message.read = true;
    chat.$notify('messages');
  }
}

// Mark all as read
function markAllRead() {
  chat.messages.forEach(msg => msg.read = true);
  chat.$notify('messages');
}

// Delete message
function deleteMessage(messageId) {
  const index = chat.messages.findIndex(msg => msg.id === messageId);
  if (index !== -1) {
    chat.messages.splice(index, 1);
    // ✅ UI updates automatically!
  }
}
```

### Example 4: Number Array Operations

```javascript
// Create state with numbers
const numbers = ReactiveUtils.state({
  values: [5, 2, 8, 1, 9, 3, 7, 4, 6]
});

// Computed properties
numbers.$computed('sum', function() {
  return this.values.reduce((a, b) => a + b, 0);
});

numbers.$computed('average', function() {
  return this.values.length > 0
    ? this.sum / this.values.length
    : 0;
});

numbers.$computed('max', function() {
  return Math.max(...this.values);
});

numbers.$computed('min', function() {
  return Math.min(...this.values);
});

numbers.$computed('sorted', function() {
  return [...this.values].sort((a, b) => a - b);
});

// Bind to HTML
numbers.$bind({
  '#sum': () => `Sum: ${numbers.sum}`,
  '#average': () => `Average: ${numbers.average.toFixed(2)}`,
  '#max': () => `Max: ${numbers.max}`,
  '#min': () => `Min: ${numbers.min}`,
  '#count': () => `Count: ${numbers.values.length}`
});

// Operations that trigger updates automatically:

function addNumber(num) {
  numbers.values.push(num);
  // ✅ All computed values update!
}

function removeLastNumber() {
  numbers.values.pop();
  // ✅ All computed values update!
}

function sortAscending() {
  numbers.values.sort((a, b) => a - b);
  // ✅ All displays update!
}

function sortDescending() {
  numbers.values.sort((a, b) => b - a);
  // ✅ All displays update!
}

function reverseOrder() {
  numbers.values.reverse();
  // ✅ All displays update!
}

function fillWithZeros() {
  numbers.values.fill(0);
  // ✅ All displays update!
}
```

### Example 5: Tag Manager

```javascript
// Create tag manager
const tags = ReactiveUtils.state({
  items: ['javascript', 'html', 'css']
});

// Bind to HTML
tags.$bind({
  '#tagList': () => tags.items.join(', '),
  '#tagCount': () => `${tags.items.length} tags`
});

// Add tag (prevents duplicates)
function addTag(tag) {
  tag = tag.trim().toLowerCase();

  if (tag && !tags.items.includes(tag)) {
    tags.items.push(tag);
    // ✅ UI updates automatically!
  } else if (tags.items.includes(tag)) {
    alert('Tag already exists!');
  }
}

// Remove tag
function removeTag(tag) {
  const index = tags.items.indexOf(tag);
  if (index !== -1) {
    tags.items.splice(index, 1);
    // ✅ UI updates automatically!
  }
}

// Sort tags alphabetically
function sortTags() {
  tags.items.sort();
  // ✅ UI updates automatically!
}

// Reverse tags
function reverseTags() {
  tags.items.reverse();
  // ✅ UI updates automatically!
}

// Clear all tags
function clearTags() {
  tags.items = [];
  // ✅ UI updates automatically!
}
```

---

## 6. Visual Diagrams

### Before vs After: Array Operations

```
❌ WITHOUT Array Patch:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

state.todos.push(newTodo);
     │
     ├──> Array changes ✅
     └──> UI updates?  ❌ NO!

You must do:
state.todos = [...state.todos, newTodo];
     │
     ├──> Array changes ✅
     └──> UI updates ✅ (but awkward!)


✅ WITH Array Patch:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

state.todos.push(newTodo);
     │
     ├──> Array changes ✅
     ├──> Patch detects it ✅
     ├──> Notifies reactive system ✅
     └──> UI updates ✅ (automatic!)
```

### How Array Methods Get Patched

```
Original Array:
┌────────────────────────────┐
│  todos: [📝, 📝, 📝]      │
│                            │
│  Native methods:           │
│  • push()                  │
│  • pop()                   │
│  • splice()                │
│  • etc.                    │
└────────────────────────────┘

After Patch Applied:
┌─────────────────────────────────────┐
│  todos: [📝, 📝, 📝]               │
│                                     │
│  Enhanced methods:                  │
│  • push() ──┐                       │
│  • pop() ───┤                       │
│  • splice() ┤                       │
│  • etc. ────┤                       │
│             │                       │
│             └──> Notify Reactive    │
│                  System After       │
│                  Each Call          │
└─────────────────────────────────────┘
```

### Data Flow with Arrays

```
1. You Call Array Method:
   state.items.push(4)
         │
         ▼
2. Patch Intercepts:
   ┌────────────────────┐
   │  Patch Wrapper     │
   │  "I saw that!"     │
   └────────────────────┘
         │
         ▼
3. Original Method Runs:
   [1, 2, 3] ──> [1, 2, 3, 4]
         │
         ▼
4. Patch Notifies:
   ┌────────────────────┐
   │ "Hey Reactive      │
   │  System! Array     │
   │  'items' changed!" │
   └────────────────────┘
         │
         ▼
5. Updates Cascade:
   ├──> Computed values recalculate
   ├──> Watchers fire
   ├──> Bindings update HTML
   └──> Effects run
```

---

## 7. Common Use Cases

### When Do You Need Reactive Arrays?

Use reactive arrays whenever you're managing lists of items:

#### 1. **Todo/Task Lists**
Managing a list of tasks.
```javascript
state.todos.push({ text: 'New task', done: false });
```

#### 2. **Shopping Carts**
Managing items in a cart.
```javascript
cart.items.push({ product: 'Widget', quantity: 1, price: 29.99 });
```

#### 3. **Message/Chat Lists**
Managing conversation messages.
```javascript
chat.messages.push({ text: 'Hello!', sender: 'John', timestamp: new Date() });
```

#### 4. **Form Fields**
Managing dynamic form inputs.
```javascript
form.fields.push({ name: 'email', value: '', type: 'email' });
```

#### 5. **Tables and Lists**
Displaying data in tables.
```javascript
table.rows.push({ id: 1, name: 'John', age: 30 });
```

#### 6. **Tags and Labels**
Managing tags or categories.
```javascript
post.tags.push('javascript');
```

#### 7. **Navigation Breadcrumbs**
Managing navigation history.
```javascript
breadcrumbs.items.push({ label: 'Home', url: '/' });
```

---

## 8. Key Takeaways

### What You Learned

1. **Arrays need special handling** in reactive systems because array methods don't trigger property changes.

2. **The Array Patch makes 9 methods reactive:**
   - `push()`, `pop()`, `shift()`, `unshift()`
   - `splice()`, `sort()`, `reverse()`
   - `fill()`, `copyWithin()`

3. **It works automatically** - just load the patch and use arrays normally!

4. **For nested changes** (changing properties of objects inside arrays), use `$notify()` to trigger updates manually.

5. **The patch makes code natural** - no more awkward array copying!

### Essential Array Operations

```javascript
// Add to end
items.push(newItem);

// Remove from end
const last = items.pop();

// Add to start
items.unshift(newItem);

// Remove from start
const first = items.shift();

// Remove at index
items.splice(index, 1);

// Add at index
items.splice(index, 0, newItem);

// Sort
items.sort((a, b) => a - b);

// Reverse
items.reverse();

// For nested changes
item.done = true;
state.$notify('items');
```

### Common Pitfalls and Solutions

#### Pitfall 1: Forgetting to Notify for Nested Changes
```javascript
// ❌ Wrong:
state.todos[0].done = true;  // Doesn't trigger update

// ✅ Correct:
state.todos[0].done = true;
state.$notify('todos');  // Now it updates!
```

#### Pitfall 2: Using Non-Mutating Methods Without Reassigning
```javascript
// ❌ These don't modify the array:
const filtered = items.filter(x => x > 5);  // Creates new array
const mapped = items.map(x => x * 2);      // Creates new array

// ✅ If you want to replace the array:
items = items.filter(x => x > 5);  // Reassign to trigger update
state.items = state.items.filter(x => x > 5);
```

### Performance Tips

1. **Batch multiple array operations:**
```javascript
state.$batch(function() {
  this.items.push(item1);
  this.items.push(item2);
  this.items.push(item3);
  // Updates happen once after all changes
});
```

2. **Use splice for multiple removals:**
```javascript
// Remove 3 items starting at index 2
items.splice(2, 3);
```

3. **Clear array efficiently:**
```javascript
// Fast way to clear
items.length = 0;
state.$notify('items');

// Or just replace
state.items = [];
```

---

## Quick Reference

```javascript
// Array Mutation Methods (All Trigger Updates):

// Add items
items.push(item1, item2);         // Add to end
items.unshift(item1, item2);      // Add to start
items.splice(index, 0, item);     // Add at index

// Remove items
items.pop();                      // Remove from end
items.shift();                    // Remove from start
items.splice(index, 1);           // Remove at index
items.splice(index, count);       // Remove multiple

// Reorder
items.sort();                     // Sort
items.sort((a,b) => a - b);       // Sort with comparator
items.reverse();                  // Reverse

// Replace
items.splice(index, 1, newItem);  // Replace one item
items.fill(value);                // Fill with value

// For nested property changes
items[0].done = true;
state.$notify('items');           // Manually trigger update
```

---

### Next Steps

Great work! Now you understand how to work with arrays in reactive state. You're ready to explore:
- **Module 03**: Working with Collections (enhanced array management)
- **Module 04**: Building Reactive Forms
- **Module 05**: Cleaning up resources

Remember: **With the Array Patch, arrays just work the way you expect them to!** No more copying, no more workarounds - just natural, intuitive array operations that automatically update your UI.

Ready to continue? Let's move on to Module 03 where you'll learn about Collections - an even more powerful way to manage lists!
