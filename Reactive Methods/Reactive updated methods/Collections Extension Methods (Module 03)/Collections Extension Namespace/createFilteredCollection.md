# Understanding `createFilteredCollection()` - A Beginner's Guide

## What is `createFilteredCollection()`?

`createFilteredCollection()` creates a **live, automatically-updating filtered view** of an existing collection. When items in the source collection change, the filtered view automatically updates to reflect those changes.

Think of it as a **magic mirror** - it shows a filtered reflection of your original collection, and whenever the original changes, the mirror instantly updates too.

---

## Why Does This Exist?

### The Problem: Manual Filtering

Normally, if you want a filtered view, you filter manually every time:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true },
  { id: 3, text: 'Read book', done: false }
]);

// ❌ Manual filtering - have to do this every time
const completed = todos.filter(t => t.done);
console.log(completed); // [{ id: 2, ... }]

// Add a new completed todo
todos.add({ id: 4, text: 'Write code', done: true });

// Have to filter AGAIN to see the new item
const completedAgain = todos.filter(t => t.done);
console.log(completedAgain); // Now includes item 4

// Tedious! Have to keep filtering manually
```

**Problems:**
- Must manually filter every time you need the filtered list
- No automatic updates when source changes
- Repetitive code
- Easy to forget to refresh the filter
- Not reactive

### The Solution: Automatic Filtered View

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true },
  { id: 3, text: 'Read book', done: false }
]);

// ✅ Create filtered view - automatically stays in sync!
const completedTodos = ReactiveUtils.createFilteredCollection(
  todos,
  t => t.done  // Filter predicate
);

console.log(completedTodos.items); // [{ id: 2, ... }]

// Add a new completed todo
todos.add({ id: 4, text: 'Write code', done: true });

// The filtered collection automatically updates!
console.log(completedTodos.items); // Now includes item 4 automatically!

// No manual refreshing needed!
```

**Benefits:**
- ✅ Automatically updates when source changes
- ✅ No manual filtering needed
- ✅ Always in sync
- ✅ Fully reactive
- ✅ Clean and maintainable

---

## How It Works

### The Syntax

```javascript
const filteredCollection = ReactiveUtils.createFilteredCollection(
  sourceCollection,  // The original collection to filter
  predicateFunction  // Function that returns true/false for each item
);
```

### The Parameters

1. **`sourceCollection`** - The original reactive collection to filter
2. **`predicateFunction`** - A function that receives each item and returns:
   - `true` - Include this item in the filtered view
   - `false` - Exclude this item from the filtered view

### What You Get

A **new reactive collection** that:
- Contains only items that match the filter
- Automatically updates when the source changes
- Has all the standard collection methods
- Is completely independent (you can add computed properties, etc.)

### The Magic: Auto-Sync

Behind the scenes, `createFilteredCollection()` uses a reactive effect:

```javascript
// Internally, it does something like this:
ReactiveUtils.effect(() => {
  const filtered = sourceCollection.items.filter(predicate);
  filteredCollection.reset(filtered);
});

// So whenever sourceCollection changes, the effect runs
// and the filtered collection automatically updates!
```

---

## Basic Examples

### Example 1: Completed vs Active Todos

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true },
  { id: 3, text: 'Read book', done: false }
]);

// Create filtered views
const completedTodos = ReactiveUtils.createFilteredCollection(
  todos,
  t => t.done
);

const activeTodos = ReactiveUtils.createFilteredCollection(
  todos,
  t => !t.done
);

console.log(completedTodos.length); // 1
console.log(activeTodos.length);    // 2

// Change a todo's status
todos.toggle(t => t.id === 1, 'done');

// Both filtered views update automatically!
console.log(completedTodos.length); // 2
console.log(activeTodos.length);    // 1

// Add a new todo
todos.add({ id: 4, text: 'Exercise', done: false });

// activeTodos automatically includes it!
console.log(activeTodos.length);    // 2
```

### Example 2: Users by Role

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'moderator' },
  { id: 4, name: 'Diana', role: 'user' }
]);

// Create filtered views by role
const admins = ReactiveUtils.createFilteredCollection(
  users,
  u => u.role === 'admin'
);

const moderators = ReactiveUtils.createFilteredCollection(
  users,
  u => u.role === 'moderator'
);

const regularUsers = ReactiveUtils.createFilteredCollection(
  users,
  u => u.role === 'user'
);

console.log(admins.length);       // 1
console.log(moderators.length);   // 1
console.log(regularUsers.length); // 2

// Promote Bob to admin
users.update(u => u.id === 2, { role: 'admin' });

// Filtered collections update automatically!
console.log(admins.length);       // 2
console.log(regularUsers.length); // 1
```

### Example 3: Products by Price Range

```javascript
const products = ReactiveUtils.collection([
  { id: 1, name: 'Widget', price: 9.99 },
  { id: 2, name: 'Gadget', price: 24.99 },
  { id: 3, name: 'Doohickey', price: 49.99 },
  { id: 4, name: 'Thingamajig', price: 99.99 }
]);

// Create price range filters
const budget = ReactiveUtils.createFilteredCollection(
  products,
  p => p.price < 25
);

const midRange = ReactiveUtils.createFilteredCollection(
  products,
  p => p.price >= 25 && p.price < 75
);

const premium = ReactiveUtils.createFilteredCollection(
  products,
  p => p.price >= 75
);

console.log(budget.length);    // 2
console.log(midRange.length);  // 1
console.log(premium.length);   // 1

// Add a new budget product
products.add({ id: 5, name: 'Gizmo', price: 14.99 });

// budget automatically includes it!
console.log(budget.length);    // 3

// Change a price
products.update(p => p.id === 2, { price: 79.99 });

// Automatically moves from budget to premium!
console.log(budget.length);    // 2
console.log(premium.length);   // 2
```

---

## Real-World Complete Example: Task Management

```javascript
// Main tasks collection
const tasks = ReactiveUtils.collection([
  { id: 1, text: 'Design homepage', status: 'pending', priority: 'high' },
  { id: 2, text: 'Write documentation', status: 'in-progress', priority: 'medium' },
  { id: 3, text: 'Fix bug #123', status: 'completed', priority: 'high' },
  { id: 4, text: 'Update dependencies', status: 'pending', priority: 'low' },
  { id: 5, text: 'Code review', status: 'in-progress', priority: 'high' }
]);

// Create filtered views by status
const pendingTasks = ReactiveUtils.createFilteredCollection(
  tasks,
  t => t.status === 'pending'
);

const inProgressTasks = ReactiveUtils.createFilteredCollection(
  tasks,
  t => t.status === 'in-progress'
);

const completedTasks = ReactiveUtils.createFilteredCollection(
  tasks,
  t => t.status === 'completed'
);

// Create filtered view by priority
const highPriorityTasks = ReactiveUtils.createFilteredCollection(
  tasks,
  t => t.priority === 'high'
);

const urgentTasks = ReactiveUtils.createFilteredCollection(
  tasks,
  t => t.priority === 'high' && t.status !== 'completed'
);

// Add computed properties to filtered collections
pendingTasks.$computed('count', function() {
  return this.items.length;
});

highPriorityTasks.$computed('count', function() {
  return this.items.length;
});

urgentTasks.$computed('count', function() {
  return this.items.length;
});

// Display functions that auto-update
ReactiveUtils.effect(() => {
  console.log('\n=== Task Board ===');
  console.log(`Pending: ${pendingTasks.length}`);
  console.log(`In Progress: ${inProgressTasks.length}`);
  console.log(`Completed: ${completedTasks.length}`);
  console.log(`High Priority: ${highPriorityTasks.length}`);
  console.log(`Urgent (High Priority, Not Done): ${urgentTasks.length}`);
});

// Auto-update UI for each board column
ReactiveUtils.effect(() => {
  renderTaskColumn('pending-column', pendingTasks.items);
});

ReactiveUtils.effect(() => {
  renderTaskColumn('in-progress-column', inProgressTasks.items);
});

ReactiveUtils.effect(() => {
  renderTaskColumn('completed-column', completedTasks.items);
});

ReactiveUtils.effect(() => {
  renderTaskColumn('urgent-column', urgentTasks.items);
});

function renderTaskColumn(columnId, taskList) {
  const column = document.getElementById(columnId);
  column.innerHTML = '';
  
  if (taskList.length === 0) {
    column.innerHTML = '<p class="empty">No tasks</p>';
    return;
  }
  
  taskList.forEach(task => {
    const div = document.createElement('div');
    div.className = `task priority-${task.priority}`;
    div.innerHTML = `
      <h4>${task.text}</h4>
      <span class="priority-badge">${task.priority}</span>
      <div class="task-actions">
        <button onclick="startTask(${task.id})">Start</button>
        <button onclick="completeTask(${task.id})">Complete</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    column.appendChild(div);
  });
}

// Task management functions
let nextId = 6;

function addTask(text, priority = 'medium') {
  tasks.add({
    id: nextId++,
    text,
    status: 'pending',
    priority
  });
  // All filtered views automatically update!
}

function startTask(id) {
  tasks.update(t => t.id === id, { status: 'in-progress' });
  // Automatically moves between filtered views!
}

function completeTask(id) {
  tasks.update(t => t.id === id, { status: 'completed' });
  // Automatically moves to completed!
}

function deleteTask(id) {
  tasks.remove(t => t.id === id);
  // Automatically removed from all filtered views!
}

// Test it out
addTask('New urgent task', 'high');
// Automatically appears in:
// - pendingTasks
// - highPriorityTasks  
// - urgentTasks

startTask(1);
// Task 1 automatically moves from pendingTasks to inProgressTasks
// And stays in highPriorityTasks and urgentTasks

completeTask(1);
// Task 1 automatically moves to completedTasks
// And is removed from urgentTasks (no longer urgent when done!)
```

---

## Chaining Filtered Collections

You can create filtered collections from other filtered collections:

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'Alice', role: 'admin', active: true },
  { id: 2, name: 'Bob', role: 'admin', active: false },
  { id: 3, name: 'Charlie', role: 'user', active: true },
  { id: 4, name: 'Diana', role: 'user', active: false }
]);

// First filter: Get admins
const admins = ReactiveUtils.createFilteredCollection(
  users,
  u => u.role === 'admin'
);

// Second filter: Get active admins (filter of a filter!)
const activeAdmins = ReactiveUtils.createFilteredCollection(
  admins,
  u => u.active
);

console.log(activeAdmins.length); // 1 (Alice)

// Add a new active admin
users.add({ id: 5, name: 'Eve', role: 'admin', active: true });

// Automatically appears in activeAdmins!
console.log(activeAdmins.length); // 2

// Deactivate Alice
users.update(u => u.id === 1, { active: false });

// Automatically removed from activeAdmins!
console.log(activeAdmins.length); // 1 (Eve)
```

---

## Complex Filters

You can use any logic in your filter predicate:

### Example 1: Multiple Conditions

```javascript
const products = ReactiveUtils.collection([...]);

// Products that are in stock AND on sale
const dealsInStock = ReactiveUtils.createFilteredCollection(
  products,
  p => p.inStock && p.onSale
);

// Premium products (expensive AND high rating)
const premiumProducts = ReactiveUtils.createFilteredCollection(
  products,
  p => p.price > 100 && p.rating >= 4.5
);
```

### Example 2: Date-Based Filters

```javascript
const events = ReactiveUtils.collection([...]);

// Upcoming events (in the future)
const upcomingEvents = ReactiveUtils.createFilteredCollection(
  events,
  e => new Date(e.date) > new Date()
);

// This week's events
const thisWeek = new Date();
const nextWeek = new Date(thisWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

const thisWeeksEvents = ReactiveUtils.createFilteredCollection(
  events,
  e => {
    const eventDate = new Date(e.date);
    return eventDate >= thisWeek && eventDate <= nextWeek;
  }
);
```

### Example 3: Text Search Filter

```javascript
const products = ReactiveUtils.collection([...]);
const searchQuery = ReactiveUtils.ref('');

// This won't work as expected - the filter is set once!
const searchResults = ReactiveUtils.createFilteredCollection(
  products,
  p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
);

// The filter predicate is evaluated ONCE when creating the collection
// It won't re-filter when searchQuery changes!

// For search, use a different approach (see workaround below)
```

---

## Important Limitations

### Limitation 1: Filter is Fixed at Creation

The filter predicate is set when you create the filtered collection and **doesn't change**:

```javascript
const minPrice = ReactiveUtils.ref(50);

// ❌ This doesn't work as you might expect
const expensiveProducts = ReactiveUtils.createFilteredCollection(
  products,
  p => p.price > minPrice.value
);

// The filter uses the VALUE of minPrice at creation time (50)
// If you change minPrice.value later, the filter doesn't update!

minPrice.value = 100;
// expensiveProducts still filters by > 50, not > 100
```

### Limitation 2: Can't Dynamically Change Filter

You can't change the filter function after creation:

```javascript
const filtered = ReactiveUtils.createFilteredCollection(
  items,
  i => i.active
);

// ❌ Can't change the filter later
// There's no way to make it filter by something else
```

### Workaround: Use Computed Property

For dynamic filters, use a computed property instead:

```javascript
const products = ReactiveUtils.collection([...]);
const minPrice = ReactiveUtils.ref(50);
const searchQuery = ReactiveUtils.ref('');

const state = ReactiveUtils.state({});

// Use computed property for dynamic filtering
state.$computed('filtered', function() {
  return products.items.filter(p => {
    const matchesPrice = p.price >= minPrice.value;
    const matchesSearch = p.name.toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return matchesPrice && matchesSearch;
  });
});

// Now when minPrice or searchQuery changes, filtered updates!
minPrice.value = 100;
searchQuery.value = 'widget';

console.log(state.filtered); // Updates automatically!
```

---

## Filtered Collections Are Independent

The filtered collection is a **separate collection** with its own methods:

```javascript
const todos = ReactiveUtils.collection([...]);

const completed = ReactiveUtils.createFilteredCollection(
  todos,
  t => t.done
);

// You can use all collection methods on the filtered collection
console.log(completed.length);
console.log(completed.first);
console.log(completed.last);
completed.forEach(t => console.log(t.text));

// You can even add computed properties to the filtered collection
completed.$computed('totalTasks', function() {
  return this.items.length;
});

// But remember: it auto-syncs with the source
// You can't manually add/remove items from the filtered collection
// (well, you can, but they'll be overwritten on the next sync)
```

---

## Use Cases

### Use Case 1: Dashboard with Multiple Views

```javascript
const orders = ReactiveUtils.collection([...]);

const pendingOrders = ReactiveUtils.createFilteredCollection(
  orders,
  o => o.status === 'pending'
);

const shippedOrders = ReactiveUtils.createFilteredCollection(
  orders,
  o => o.status === 'shipped'
);

const deliveredOrders = ReactiveUtils.createFilteredCollection(
  orders,
  o => o.status === 'delivered'
);

// Each view auto-updates when orders change
// Perfect for a dashboard!
```

### Use Case 2: Inbox with Folders

```javascript
const emails = ReactiveUtils.collection([...]);

const inbox = ReactiveUtils.createFilteredCollection(
  emails,
  e => e.folder === 'inbox' && !e.deleted
);

const sent = ReactiveUtils.createFilteredCollection(
  emails,
  e => e.folder === 'sent' && !e.deleted
);

const starred = ReactiveUtils.createFilteredCollection(
  emails,
  e => e.starred && !e.deleted
);

const trash = ReactiveUtils.createFilteredCollection(
  emails,
  e => e.deleted
);

// When you star/delete/move an email,
// all folders automatically update!
```

### Use Case 3: Kanban Board

```javascript
const tasks = ReactiveUtils.collection([...]);

const todoColumn = ReactiveUtils.createFilteredCollection(
  tasks,
  t => t.status === 'todo'
);

const doingColumn = ReactiveUtils.createFilteredCollection(
  tasks,
  t => t.status === 'doing'
);

const doneColumn = ReactiveUtils.createFilteredCollection(
  tasks,
  t => t.status === 'done'
);

// When you drag a task to a different column,
// just update its status and all columns auto-update!
```

---

## Common Questions

### Q: Does the filtered collection update immediately?

**Answer:** Yes! It uses a reactive effect, so it updates as soon as the source changes:

```javascript
const todos = ReactiveUtils.collection([...]);
const completed = ReactiveUtils.createFilteredCollection(todos, t => t.done);

console.log(completed.length); // 0

todos.add({ id: 1, text: 'Task', done: true });

console.log(completed.length); // 1 (immediately!)
```

### Q: Can I modify the filtered collection directly?

**Answer:** You can, but it will be overwritten on the next sync:

```javascript
const todos = ReactiveUtils.collection([...]);
const completed = ReactiveUtils.createFilteredCollection(todos, t => t.done);

// ❌ Don't do this - will be overwritten
completed.add({ id: 99, text: 'Direct add', done: true });

// When todos changes, completed resyncs and loses the direct add
todos.add({ id: 1, text: 'Real task', done: true });
// completed is now reset from todos - item 99 is gone!

// ✅ Always modify the source collection
todos.add({ id: 2, text: 'Task', done: true });
// Automatically appears in completed!
```

### Q: Does filtering hurt performance?

**Answer:** The collection re-filters every time the source changes. For small collections (< 1000 items), this is fine. For large collections, consider:

1. Using computed properties with caching
2. Debouncing updates
3. Virtualizing the display

```javascript
// For large collections, use computed instead
const state = ReactiveUtils.state({});

state.$computed('filtered', function() {
  return largeCollection.items.filter(predicate);
});

// Computed properties cache results
// Only recompute when dependencies change
```

### Q: Can I create multiple filtered views from one collection?

**Answer:** Yes! Create as many as you need:

```javascript
const users = ReactiveUtils.collection([...]);

const admins = ReactiveUtils.createFilteredCollection(users, u => u.role === 'admin');
const activeUsers = ReactiveUtils.createFilteredCollection(users, u => u.active);
const premiumUsers = ReactiveUtils.createFilteredCollection(users, u => u.premium);
const vipUsers = ReactiveUtils.createFilteredCollection(users, u => u.vip);

// All stay in sync with the source automatically!
```

### Q: What happens if I filter an already filtered collection?

**Answer:** It works! You can chain filters:

```javascript
const users = ReactiveUtils.collection([...]);

// First filter
const premiumUsers = ReactiveUtils.createFilteredCollection(
  users,
  u => u.premium
);

// Second filter (of the first filter)
const activePremiumUsers = ReactiveUtils.createFilteredCollection(
  premiumUsers,
  u => u.active
);

// When users changes:
// 1. premiumUsers auto-updates
// 2. activePremiumUsers auto-updates (because premiumUsers changed)
// Everything stays in sync!
```

---

## Tips for Beginners

### 1. Use for Static Filters

```javascript
// ✅ Good - filter doesn't change
const completed = ReactiveUtils.createFilteredCollection(
  todos,
  t => t.done
);

// ❌ Bad - trying to make filter dynamic won't work
const filtered = ReactiveUtils.createFilteredCollection(
  todos,
  t => t.priority === currentPriority.value // Won't update!
);
```

### 2. Modify the Source, Not the Filter

```javascript
// ✅ Modify the source collection
todos.toggle(t => t.id === 1, 'done');

// ❌ Don't modify the filtered collection
completedTodos.remove(t => t.id === 1);
```

### 3. Create Multiple Views

```javascript
// ✅ Create specific views
const activeUsers = ReactiveUtils.createFilteredCollection(users, u => u.active);
const inactiveUsers = ReactiveUtils.createFilteredCollection(users, u => !u.active);
const adminUsers = ReactiveUtils.createFilteredCollection(users, u => u.role === 'admin');
```

### 4. Use Descriptive Names

```javascript
// ❌ Unclear
const f1 = ReactiveUtils.createFilteredCollection(todos, t => t.done);

// ✅ Clear
const completedTodos = ReactiveUtils.createFilteredCollection(todos, t => t.done);
```

### 5. Remember: Auto-Sync Means Read-Only

```javascript
// The filtered collection is essentially read-only
// It automatically reflects the filtered source
// Treat it as a live view, not a separate editable list
```

---

## Summary

### What `createFilteredCollection()` Does:

1. ✅ Creates a live filtered view of a collection
2. ✅ Automatically updates when source changes
3. ✅ Always in sync with the source
4. ✅ Fully reactive
5. ✅ Perfect for dashboard views, boards, folders
6. ✅ Can be chained (filter of a filter)

### The Basic Pattern:

```javascript
// Create source collection
const items = ReactiveUtils.collection([...]);

// Create filtered view
const filtered = ReactiveUtils.createFilteredCollection(
  items,
  item => /* true/false condition */
);

// Filtered view auto-updates when items changes!
```

### When to Use It:

- ✅ Multiple views of the same data (dashboard, boards)
- ✅ Status-based filtering (pending, completed, etc.)
- ✅ Category-based views (inbox, sent, starred)
- ✅ Fixed filter criteria
- ✅ Auto-syncing required

### When NOT to Use It:

- ❌ Dynamic filters that change (use computed properties)
- ❌ Search functionality (use computed properties)
- ❌ Need to modify filtered collection directly
- ❌ Very large collections with complex filters

---

**Remember:** `createFilteredCollection()` creates a **magic mirror** that shows a filtered view of your collection. The mirror automatically updates to reflect changes in the original, keeping everything perfectly in sync. Perfect for dashboards, kanban boards, email folders, or any situation where you need multiple views of the same data! 🎉