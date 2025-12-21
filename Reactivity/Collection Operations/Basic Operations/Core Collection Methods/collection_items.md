# Understanding `collection.items` - A Beginner's Guide

## Quick Start (30 seconds)

```js
// Create a reactive collection
const todos = collection([
  { id: 1, text: 'Buy milk' },
  { id: 2, text: 'Call mom' }
]);

// Access items directly
console.log(todos.items);  // [{ id: 1, ... }, { id: 2, ... }]
console.log(todos.items.length);  // 2
console.log(todos.items[0].text);  // "Buy milk"

// Any change triggers reactivity
effect(() => {
  console.log(`You have ${todos.items.length} todos`);
});

todos.items.push({ id: 3, text: 'Walk dog' });  // Effect runs! ✨
```

**That's it!** `items` is a reactive array - read it, modify it, reactivity works automatically. ✨

**Want to understand how this works?** Keep reading below!

---

## What is `collection.items`?

`collection.items` is a **property on reactive collections** that contains the actual reactive array. It's the underlying data structure that holds your collection items and tracks all changes automatically.

Think of it as **the storage box with sensors** - it's where your data lives, and it automatically notifies everyone when anything inside changes.

---

## Syntax

```js
// Access the items array
collection.items

// Example
const todos = collection([{ text: 'Task 1' }]);
const allItems = todos.items;  // Get the reactive array
const firstItem = todos.items[0];  // Access by index
const count = todos.items.length;  // Get length
```

**Property type:**
- **Type**: Reactive Proxy Array
- **Access**: Read and write
- **Reactivity**: Fully reactive - all operations trigger effects

---

## Why Does This Exist?

### The Problem: Working with Collection Data

When you have a reactive collection, you need to access the actual data to:
1. Read items
2. Check the length
3. Iterate over items
4. Use array methods like `filter`, `map`, `find`
5. Modify items directly

**The Problem Visualized:**

**Without `.items` - No direct access:**
```
You: "Give me the first todo"
       ↓
Collection: "How? I'm just a wrapper!"
       ↓
   ❌ No way to access data
```

**With `.items` - Direct access:**
```
You: "Give me todos.items[0]"
       ↓
Collection: "Here's the reactive array!"
       ↓
   ✅ Access data + reactivity works
```

### ❌ If `.items` Didn't Exist

```js
const todos = collection([...]);

// How would you access the data?
console.log(todos[0]);  // ❌ Doesn't work - todos is not an array
console.log(todos.length);  // ❌ Undefined
todos.forEach(...);  // ❌ Not a function

// You'd be stuck! No way to work with the data!
```

### ✅ With `.items` Property

```js
const todos = collection([...]);

// Access data naturally
console.log(todos.items[0]);  // ✅ Works!
console.log(todos.items.length);  // ✅ Works!
todos.items.forEach(...);  // ✅ Works!

// Reactivity still works!
effect(() => {
  console.log(todos.items.length);  // Tracks changes! ✨
});
```

---

## Mental Model: The Smart Storage Box

Think of `collection.items` like a **smart storage box with sensors**:

**Regular box (plain array):**
```
You open the box
       ↓
You take items out
       ↓
Nobody knows what you did
```

**Smart box (reactive array via .items):**
```
You access box.items
       ↓
Sensors detect you're watching
       ↓
Any change to items triggers notifications
       ↓
┌──────────────┬──────────────┬──────────────┐
↓              ↓              ↓
Effect 1       Effect 2       Effect 3
runs!          runs!          runs!
```

**Real-world analogy:** It's like a warehouse with motion sensors. The `.items` property is the warehouse inventory - you can see it, count it, modify it, and sensors automatically detect every change!

**With `.items`:**
- The collection wrapper is like the warehouse building
- `.items` is the actual inventory inside
- Sensors detect any change to the inventory
- Effects are like automated alerts that trigger on changes

---

## How Does It Work?

When you access `.items`, here's what happens automatically:

```
┌──────────────────────────────────────────┐
│  YOU ACCESS:  todos.items                │
└──────────────┬───────────────────────────┘
               ↓
       ┌───────────────┐
       │  Collection   │
       │   returns     │
       │ reactive array│
       └───────┬───────┘
               ↓
    ┌──────────────────────┐
    │   Proxy Array        │
    │  (wraps your data)   │
    └──────────┬───────────┘
               ↓
    Every operation is intercepted:
    - Read: tracks dependency
    - Write: notifies effects
               ↓
    ┌──────────────────────┐
    │  Reactivity System   │
    │  - Tracks reads      │
    │  - Notifies on write │
    └──────────┬───────────┘
               ↓
       Effects run! ✨
```

**Key points:**
1. `.items` returns a Proxy that wraps the actual array
2. The Proxy intercepts all array operations
3. Reads are tracked as dependencies
4. Writes trigger effect updates
5. Everything happens automatically!

---

## Basic Usage

### Reading Items

```js
const todos = collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Call mom', done: true }
]);

// Access by index
const first = todos.items[0];
console.log(first.text);  // "Buy milk"

// Get length
console.log(todos.items.length);  // 2

// Check if empty
if (todos.items.length === 0) {
  console.log('No todos!');
}

// Iterate
todos.items.forEach(todo => {
  console.log(todo.text);
});

// Use array methods
const incomplete = todos.items.filter(t => !t.done);
const texts = todos.items.map(t => t.text);
const found = todos.items.find(t => t.id === 1);
```

### Modifying Items

```js
// Add items
todos.items.push({ id: 3, text: 'Walk dog', done: false });

// Remove items
todos.items.pop();
todos.items.splice(0, 1);  // Remove first item

// Modify items
todos.items[0].done = true;
todos.items[0] = { id: 1, text: 'Updated', done: true };

// Replace all
todos.items.length = 0;  // Clear all
todos.items.push(...newItems);  // Add new ones

// All changes trigger reactivity automatically! ✨
```

### Using in Effects

```js
// Track length changes
effect(() => {
  document.querySelector('#count').textContent = todos.items.length;
});

// Track specific items
effect(() => {
  const completed = todos.items.filter(t => t.done).length;
  document.querySelector('#completed').textContent = completed;
});

// Render list
effect(() => {
  const html = todos.items
    .map(t => `<div>${t.text}</div>`)
    .join('');
  document.querySelector('#list').innerHTML = html;
});
```

---

## Common Use Cases

### Use Case 1: Display Item Count

```js
const cart = collection([]);

effect(() => {
  const count = cart.items.length;
  document.querySelector('#cart-count').textContent = count;

  if (count === 0) {
    document.querySelector('#empty-message').style.display = 'block';
  } else {
    document.querySelector('#empty-message').style.display = 'none';
  }
});

// Add items - UI updates automatically
cart.items.push({ id: 1, name: 'Laptop', price: 999 });
```

**Code explanation:**
- `effect()` tracks `cart.items.length`
- When length changes, effect re-runs automatically
- DOM updates to show count and empty state
- Simply pushing to the array triggers all updates!

---

### Use Case 2: Filter and Display Subset

```js
const todos = collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Call mom', done: true },
  { id: 3, text: 'Walk dog', done: false }
]);

const filter = state({ show: 'all' });

effect(() => {
  let filtered = todos.items;

  if (filter.show === 'active') {
    filtered = todos.items.filter(t => !t.done);
  } else if (filter.show === 'completed') {
    filtered = todos.items.filter(t => t.done);
  }

  renderTodos(filtered);
});

function renderTodos(items) {
  const html = items.map(t => `
    <div class="${t.done ? 'done' : 'pending'}">
      ${t.text}
    </div>
  `).join('');

  document.querySelector('#todo-list').innerHTML = html;
}

// Change filter - UI updates automatically
filter.show = 'active';  // Shows only incomplete todos
```

**Code explanation:**
- `filter.show` determines which items to display
- Effect filters `todos.items` based on current filter
- Changing either `filter.show` or `todos.items` triggers re-render
- Clean separation of data and presentation logic

---

### Use Case 3: Calculate Derived Values

```js
const products = collection([
  { name: 'Laptop', price: 999, quantity: 2 },
  { name: 'Mouse', price: 29, quantity: 5 }
]);

effect(() => {
  const total = products.items.reduce((sum, p) => {
    return sum + (p.price * p.quantity);
  }, 0);

  const count = products.items.reduce((sum, p) => sum + p.quantity, 0);

  document.querySelector('#total').textContent = `$${total.toFixed(2)}`;
  document.querySelector('#item-count').textContent = `${count} items`;
});

// Update quantity - total recalculates automatically
products.items[0].quantity = 3;  // Changes 2→3, effect runs!
```

**Code explanation:**
- `reduce()` calculates both total price and item count
- Effect watches `products.items` and all nested properties
- Modifying any item property triggers recalculation
- DOM updates automatically with new values

---

### Use Case 4: Search and Find Items

```js
const users = collection([
  { id: 1, name: 'Alice', email: 'alice@example.com', active: true },
  { id: 2, name: 'Bob', email: 'bob@example.com', active: false },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', active: true }
]);

function findUser(id) {
  return users.items.find(u => u.id === id);
}

function searchUsers(query) {
  return users.items.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );
}

// Use in effect for reactive search
const searchQuery = state({ text: '' });

effect(() => {
  const query = searchQuery.text.toLowerCase();

  if (!query) {
    // Show all users
    renderUsers(users.items);
    return;
  }

  const results = users.items.filter(u =>
    u.name.toLowerCase().includes(query) ||
    u.email.toLowerCase().includes(query)
  );

  renderUsers(results);
});

function renderUsers(userList) {
  const html = userList.map(u => `
    <div class="user ${u.active ? 'active' : 'inactive'}">
      <span class="name">${u.name}</span>
      <span class="email">${u.email}</span>
    </div>
  `).join('');

  document.querySelector('#user-list').innerHTML = html;
}

// Usage
searchQuery.text = 'alice';  // Filters to Alice only
searchQuery.text = '';        // Shows all users
```

**Code explanation:**
- `searchQuery.text` is reactive state
- Effect filters `users.items` based on search query
- Both changing the search query and modifying users triggers updates
- Provides instant search with automatic UI updates

---

### Use Case 5: Sort and Reorder

```js
const tasks = collection([
  { id: 1, title: 'Fix bug', priority: 3, dueDate: new Date('2025-01-15') },
  { id: 2, title: 'Write docs', priority: 1, dueDate: new Date('2025-01-10') },
  { id: 3, title: 'Code review', priority: 2, dueDate: new Date('2025-01-12') }
]);

const sortBy = state({ field: 'priority', order: 'asc' });

effect(() => {
  // Create sorted copy (don't mutate original)
  const sorted = [...tasks.items].sort((a, b) => {
    const fieldA = a[sortBy.field];
    const fieldB = b[sortBy.field];

    // Handle different field types
    if (fieldA instanceof Date) {
      return sortBy.order === 'asc'
        ? fieldA - fieldB
        : fieldB - fieldA;
    }

    // Numbers and strings
    if (sortBy.order === 'asc') {
      return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
    } else {
      return fieldB < fieldB ? -1 : fieldB > fieldA ? 1 : 0;
    }
  });

  renderTasks(sorted);
});

function renderTasks(taskList) {
  const html = taskList.map(t => `
    <div class="task priority-${t.priority}">
      <span class="title">${t.title}</span>
      <span class="due">${t.dueDate.toLocaleDateString()}</span>
    </div>
  `).join('');

  document.querySelector('#task-list').innerHTML = html;
}

// Change sort - UI updates automatically
sortBy.field = 'dueDate';  // Sort by date
sortBy.order = 'desc';      // Descending order
```

**Code explanation:**
- Spreading `[...tasks.items]` creates a non-reactive copy for sorting
- Sorting the copy doesn't trigger effects (avoids infinite loops)
- Effect watches both `tasks.items` and `sortBy` state
- Changing either the tasks or sort criteria triggers re-render

---

### Use Case 6: Pagination

```js
const allItems = collection([]);
const pagination = state({
  page: 1,
  itemsPerPage: 10
});

// Load 100 items
for (let i = 1; i <= 100; i++) {
  allItems.items.push({
    id: i,
    name: `Item ${i}`,
    description: `Description for item ${i}`
  });
}

effect(() => {
  const start = (pagination.page - 1) * pagination.itemsPerPage;
  const end = start + pagination.itemsPerPage;

  const pageItems = allItems.items.slice(start, end);
  const totalPages = Math.ceil(allItems.items.length / pagination.itemsPerPage);

  renderPage(pageItems);
  renderPagination(pagination.page, totalPages);
});

function renderPage(items) {
  const html = items.map(item => `
    <div class="item">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    </div>
  `).join('');

  document.querySelector('#items').innerHTML = html;
}

function renderPagination(currentPage, totalPages) {
  document.querySelector('#page-info').textContent =
    `Page ${currentPage} of ${totalPages}`;
}

// Navigate pages
pagination.page = 2;  // Shows items 11-20
pagination.page = 5;  // Shows items 41-50
```

**Code explanation:**
- `slice()` extracts current page items from `allItems.items`
- Effect recalculates when page number or items change
- Adding/removing items automatically updates pagination
- Clean pagination without manual page management

---

## Advanced Patterns

### Pattern 1: Computed Array Transformations

```js
const todos = collection([
  { id: 1, text: 'Buy milk', done: false, priority: 'high' },
  { id: 2, text: 'Call mom', done: true, priority: 'low' },
  { id: 3, text: 'Walk dog', done: false, priority: 'high' }
]);

// Computed: pending high-priority tasks
const urgentTasks = computed(() => {
  return todos.items.filter(t => !t.done && t.priority === 'high');
});

// Computed: completion percentage
const completionRate = computed(() => {
  if (todos.items.length === 0) return 0;
  const completed = todos.items.filter(t => t.done).length;
  return Math.round((completed / todos.items.length) * 100);
});

// Use computed values in effects
effect(() => {
  console.log(`Urgent tasks: ${urgentTasks.value.length}`);
  console.log(`Completion: ${completionRate.value}%`);
});

// Update a todo - computed values update automatically
todos.items[0].done = true;
// Logs: "Urgent tasks: 1"
// Logs: "Completion: 67%"
```

**Code explanation:**
- `computed()` caches calculations and only recalculates when dependencies change
- More efficient than calculating in effects (avoids redundant work)
- `urgentTasks` and `completionRate` automatically update when todos change
- Access computed values with `.value` property

---

### Pattern 2: Reactive Array Grouping

```js
const transactions = collection([
  { id: 1, type: 'income', amount: 1000, date: '2025-01-15' },
  { id: 2, type: 'expense', amount: 50, date: '2025-01-15' },
  { id: 3, type: 'income', amount: 500, date: '2025-01-16' },
  { id: 4, type: 'expense', amount: 200, date: '2025-01-16' }
]);

// Computed: group by type
const byType = computed(() => {
  const groups = { income: [], expense: [] };

  transactions.items.forEach(t => {
    groups[t.type].push(t);
  });

  return groups;
});

// Computed: totals by type
const totals = computed(() => {
  return {
    income: byType.value.income.reduce((sum, t) => sum + t.amount, 0),
    expense: byType.value.expense.reduce((sum, t) => sum + t.amount, 0)
  };
});

effect(() => {
  const balance = totals.value.income - totals.value.expense;
  console.log(`Balance: $${balance}`);
  console.log(`Income: $${totals.value.income}`);
  console.log(`Expenses: $${totals.value.expense}`);
});

// Add transaction - everything recalculates
transactions.items.push({
  id: 5,
  type: 'income',
  amount: 300,
  date: '2025-01-17'
});
// Logs: "Balance: $1550"
// Logs: "Income: $1800"
// Logs: "Expenses: $250"
```

**Code explanation:**
- `byType` groups transactions into income/expense categories
- `totals` calculates sums for each group
- Computed values chain: `transactions.items` → `byType` → `totals`
- Adding a transaction triggers the entire chain automatically

---

### Pattern 3: Reactive Array Indexing

```js
const users = collection([
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'admin' }
]);

// Computed: create lookup index by ID
const usersById = computed(() => {
  const index = {};
  users.items.forEach(u => {
    index[u.id] = u;
  });
  return index;
});

// Computed: create lookup index by role
const usersByRole = computed(() => {
  const index = {};
  users.items.forEach(u => {
    if (!index[u.role]) index[u.role] = [];
    index[u.role].push(u);
  });
  return index;
});

// Fast lookups
function getUserById(id) {
  return usersById.value[id];  // O(1) lookup!
}

function getUsersByRole(role) {
  return usersByRole.value[role] || [];  // O(1) lookup!
}

// Usage
console.log(getUserById(2));  // { id: 2, name: 'Bob', role: 'user' }
console.log(getUsersByRole('admin'));  // [Alice, Charlie]

// Add user - indexes update automatically
users.items.push({ id: 4, name: 'Diana', role: 'user' });
console.log(getUsersByRole('user'));  // [Bob, Diana]
```

**Code explanation:**
- Creates indexed lookups for O(1) access instead of O(n) array searches
- Indexes automatically rebuild when `users.items` changes
- Computed values cache the indexes (efficient)
- Great for large datasets with frequent lookups

---

### Pattern 4: Multi-Collection Coordination

```js
const users = collection([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]);

const posts = collection([
  { id: 1, userId: 1, title: 'Post 1' },
  { id: 2, userId: 1, title: 'Post 2' },
  { id: 3, userId: 2, title: 'Post 3' }
]);

// Computed: posts with user data joined
const postsWithUsers = computed(() => {
  return posts.items.map(post => {
    const user = users.items.find(u => u.id === post.userId);
    return {
      ...post,
      userName: user ? user.name : 'Unknown'
    };
  });
});

// Display posts with author names
effect(() => {
  const html = postsWithUsers.value.map(p => `
    <div class="post">
      <h3>${p.title}</h3>
      <p>by ${p.userName}</p>
    </div>
  `).join('');

  document.querySelector('#posts').innerHTML = html;
});

// Update user name - all their posts update automatically
users.items[0].name = 'Alice Smith';
// All Alice's posts now show "by Alice Smith"
```

**Code explanation:**
- `postsWithUsers` joins two collections (like SQL JOIN)
- Changing either `users.items` or `posts.items` triggers recalculation
- Effect automatically re-renders when join result changes
- Clean reactive data relationships

---

## When to Use Something Else

### For Very Large Arrays (10,000+ items)

For extremely large datasets, consider using computed values to avoid recalculating everything on every change:

**Less efficient (recalculates every time):**
```js
effect(() => {
  const total = hugeArray.items.reduce((sum, item) => sum + item.value, 0);
  console.log(total);
});
```

**More efficient (caches calculation):**
```js
const total = computed(() => {
  return hugeArray.items.reduce((sum, item) => sum + item.value, 0);
});

effect(() => {
  console.log(total.value);  // Only recalculates when items change
});
```

---

### For Complex Nested Data

When working with deeply nested arrays, consider flattening or using computed helpers:

**Complex (hard to track):**
```js
const data = collection([
  {
    users: [
      { posts: [ { comments: [...] } ] }
    ]
  }
]);
```

**Better (flattened structure):**
```js
const users = collection([...]);
const posts = collection([...]);
const comments = collection([...]);
```

---

## Performance Tips

**Tip 1: Use Spreading for Immutable Operations**

When sorting, filtering, or transforming, create copies:

```js
effect(() => {
  // ✅ GOOD - creates copy, doesn't mutate original
  const sorted = [...items.items].sort((a, b) => a.value - b.value);
  render(sorted);
});

// ❌ BAD - mutates original, can cause issues
effect(() => {
  items.items.sort((a, b) => a.value - b.value);  // Mutates!
  render(items.items);
});
```

**Tip 2: Use Computed for Expensive Calculations**

Cache expensive operations with `computed()`:

```js
// ❌ SLOW - recalculates every time
effect(() => {
  const result = expensiveCalculation(items.items);
  display(result);
});

// ✅ FAST - caches result, only recalculates when items change
const result = computed(() => expensiveCalculation(items.items));

effect(() => {
  display(result.value);
});
```

**Tip 3: Avoid Reading `.items` Length in Loops**

Cache the length outside loops:

```js
// ✅ GOOD - cache length
const len = items.items.length;
for (let i = 0; i < len; i++) {
  process(items.items[i]);
}

// ⚠️ LESS EFFICIENT - reads length every iteration
for (let i = 0; i < items.items.length; i++) {
  process(items.items[i]);
}
```

---

## Common Pitfalls

### Pitfall 1: Replacing `.items` Directly

**Problem:**
```js
const todos = collection([1, 2, 3]);

// ❌ BAD - breaks reactivity!
todos.items = [4, 5, 6];
```

**Solution:**
```js
// ✅ GOOD - maintains reactivity
todos.items.length = 0;  // Clear
todos.items.push(...[4, 5, 6]);  // Refill

// ✅ ALSO GOOD - use collection methods
todos.$clear();
[4, 5, 6].forEach(item => todos.$add(item));
```

---

### Pitfall 2: Forgetting `.items` When Accessing Array

**Problem:**
```js
const todos = collection([...]);

// ❌ WRONG - collection is not an array
todos.forEach(t => console.log(t));
console.log(todos.length);
```

**Solution:**
```js
// ✅ RIGHT - access .items first
todos.items.forEach(t => console.log(t));
console.log(todos.items.length);
```

---

### Pitfall 3: Mutating Inside Effects Without Guards

**Problem:**
```js
// ❌ INFINITE LOOP!
effect(() => {
  todos.items.push({ text: 'New' });  // Triggers effect again!
});
```

**Solution:**
```js
// ✅ GOOD - conditional mutation
effect(() => {
  if (someCondition && !alreadyAdded) {
    todos.items.push({ text: 'New' });
  }
});
```

---

### Pitfall 4: Not Understanding Spread Creates Copy

**Problem:**
```js
const items = collection([1, 2, 3]);
const copy = [...items.items];

copy.push(4);  // Expects items to update - it doesn't!
console.log(items.items);  // Still [1, 2, 3]
```

**Understanding:**
```js
// Spread creates NON-reactive copy
const copy = [...items.items];  // New array, not reactive

// Original stays reactive
items.items.push(4);  // This triggers effects ✨
```

---

## Real-World Example

Here's a practical inventory system using `collection.items`:

```js
const inventory = collection([]);

// Load initial inventory
inventory.items.push(
  { id: 1, name: 'Laptop', quantity: 5, price: 999 },
  { id: 2, name: 'Mouse', quantity: 20, price: 29 },
  { id: 3, name: 'Keyboard', quantity: 15, price: 79 }
);

// Computed: total inventory value
const totalValue = computed(() => {
  return inventory.items.reduce((sum, item) => {
    return sum + (item.quantity * item.price);
  }, 0);
});

// Computed: low stock items
const lowStock = computed(() => {
  return inventory.items.filter(item => item.quantity < 10);
});

// Auto-update UI
effect(() => {
  document.querySelector('#total-value').textContent =
    `$${totalValue.value.toLocaleString()}`;

  document.querySelector('#total-items').textContent =
    inventory.items.length;
});

// Show low stock alerts
effect(() => {
  const alerts = document.querySelector('#alerts');

  if (lowStock.value.length === 0) {
    alerts.innerHTML = '<p class="success">All items in stock!</p>';
  } else {
    alerts.innerHTML = lowStock.value.map(item => `
      <div class="alert warning">
        Low stock: ${item.name} (${item.quantity} remaining)
      </div>
    `).join('');
  }
});

// Update quantity - everything recalculates automatically
inventory.items[0].quantity = 3;  // UI updates! ✨
```

**What this demonstrates:**
- Direct access to `inventory.items` for all operations
- Computed values for derived data (total value, low stock)
- Automatic UI updates when items change
- Clean, maintainable code structure

---

## Common Questions

### Q: Is `.items` the same as the collection?

**A:** No! The collection is a wrapper object. `.items` is the actual reactive array:

```js
const todos = collection([1, 2, 3]);

console.log(todos);  // Collection { items: [...], $add: fn, ... }
console.log(todos.items);  // [1, 2, 3] (reactive array)

// Use .items to access the data
console.log(todos.items[0]);  // 1
console.log(todos.items.length);  // 3
```

### Q: Can I replace the entire `.items` array?

**A:** No, don't replace `.items` itself. Instead, clear and refill it:

```js
// ❌ BAD - breaks reactivity
todos.items = [1, 2, 3];

// ✅ GOOD - maintains reactivity
todos.items.length = 0;  // Clear
todos.items.push(...[1, 2, 3]);  // Refill

// ✅ ALSO GOOD - use $clear and $add
todos.$clear();
[1, 2, 3].forEach(item => todos.$add(item));
```

### Q: Is `.items` a copy or reference?

**A:** It's a reference to the reactive array. Changes to `.items` affect the collection:

```js
const todos = collection([1, 2, 3]);

const items = todos.items;
items.push(4);  // Modifies the collection

console.log(todos.items.length);  // 4
```

### Q: Can I use all array methods on `.items`?

**A:** Yes! All standard array methods work:

```js
todos.items.push(item);       // ✅ Add
todos.items.pop();            // ✅ Remove last
todos.items.shift();          // ✅ Remove first
todos.items.unshift(item);    // ✅ Add at start
todos.items.splice(1, 2);     // ✅ Remove range
todos.items.map(fn);          // ✅ Transform
todos.items.filter(fn);       // ✅ Filter
todos.items.find(fn);         // ✅ Find
todos.items.forEach(fn);      // ✅ Iterate
// And all other array methods!
```

### Q: Does spreading `.items` break reactivity?

**A:** The spread creates a non-reactive copy, but the original `.items` stays reactive:

```js
const todos = collection([1, 2, 3]);

// Spread creates a copy (not reactive)
const copy = [...todos.items];
copy.push(4);  // Doesn't trigger effects

// Original still reactive
todos.items.push(4);  // Triggers effects ✨

// Use spread for sorting without mutating
const sorted = [...todos.items].sort();
```

---

## Summary

**`collection.items` is the reactive array property that holds your collection data.**

**Key takeaways:**
- ✅ **Direct access** - Access the underlying reactive array
- ✅ **Fully reactive** - All reads and writes are tracked
- ✅ **Standard array** - Use all array methods normally
- ✅ **Reference** - It's the actual data, not a copy
- ✅ **Always use it** - To access or modify collection data

**Important warnings:**
- ⚠️ **Don't replace `.items`** - Clear and refill instead
- ⚠️ **Remember `.items`** - Collection is not an array, access via `.items`
- ⚠️ **Spread creates copies** - Use for immutable operations
- ⚠️ **All array methods work** - And trigger reactivity automatically

**Remember:** `collection.items` is your gateway to the reactive array. All standard array operations work, and all changes trigger effects automatically!

**Quick Reference:**
```js
const todos = collection([...]);

// Read
todos.items[0]           // First item
todos.items.length       // Count
todos.items.find(...)    // Find item

// Modify
todos.items.push(...)    // Add
todos.items[0] = ...     // Update
todos.items.splice(...)  // Remove

// In effects
effect(() => {
  console.log(todos.items.length);  // Auto-updates! ✨
});
```

➡️ Next, explore [`collection.$add()`]($add.md) to add items, [`collection.$remove()`]($remove.md) to remove items, or [`collection.$update()`]($update.md) to update items!
