# Understanding `update()` - A Beginner's Guide

## What is `update()`?

`update()` is a **collection method** that finds a single item using a **predicate function** (or direct reference) and applies updates to it. It's the cleanest way to modify specific items in your collection.

Think of it as **finding an item in a basket and changing its properties** - you describe which item to find, then specify what changes to make.

---

## Why Does `update()` Exist?

### The Problem: Manual Item Updates are Messy

Without `update()`, modifying items requires multiple steps:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false, priority: 'low' },
  { id: 2, text: 'Walk dog', done: false, priority: 'high' },
  { id: 3, text: 'Read book', done: false, priority: 'medium' }
]);

// ❌ Awkward - find the item first, then modify
const todo = todos.items.find(t => t.id === 2);
if (todo) {
  todo.done = true;
  todo.priority = 'medium';
  todo.completedAt = new Date();
}

// ❌ Or use Object.assign
const todo2 = todos.items.find(t => t.id === 1);
if (todo2) {
  Object.assign(todo2, {
    done: true,
    priority: 'high',
    completedAt: new Date()
  });
}
```

**Problems:**
- Multiple steps (find, check, modify)
- Verbose and repetitive
- Easy to forget the null check
- Not clean or expressive

### The Solution: Clean `update()` Method

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false, priority: 'low' },
  { id: 2, text: 'Walk dog', done: false, priority: 'high' },
  { id: 3, text: 'Read book', done: false, priority: 'medium' }
]);

// ✅ Clean and simple - find and update in one call
todos.update(
  t => t.id === 2,                    // Which item to update
  { done: true, priority: 'medium' }  // What changes to make
);

// Much cleaner and more readable!
```

**Benefits:**
- Single method call
- Find and update combined
- Handles "not found" automatically
- Clean and expressive
- Chainable

---

## How It Works

### The Syntax

```javascript
collection.update(predicate, updates);
```

### Parameters

1. **`predicate`** `{Function|Object}` - Either:
   - A **function** that returns `true` for the item to update: `item => item.id === 5`
   - The **actual item** object to update (direct reference)

2. **`updates`** `{Object}` - An object containing the properties to update:
   - Keys are property names
   - Values are the new values
   - Only specified properties are changed
   - Other properties remain unchanged

### Returns

- **`this`** - Returns the collection itself, enabling method chaining

### What It Does

1. Finds the first item that matches the predicate
2. Applies the updates to that item (using `Object.assign`)
3. If no match found, does nothing (no error)
4. Triggers reactive updates
5. Returns the collection for chaining

---

## Basic Usage

### Update by ID (Most Common)

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false },
  { id: 3, text: 'Read book', done: false }
]);

// Mark todo #2 as done
todos.update(
  todo => todo.id === 2,  // Find this item
  { done: true }           // Apply this change
);

console.log(todos.find(t => t.id === 2).done); // true
```

### Update Multiple Properties at Once

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'Alice', role: 'user', active: true },
  { id: 2, name: 'Bob', role: 'user', active: true }
]);

// Update multiple properties
users.update(
  user => user.id === 1,
  { 
    role: 'admin',
    active: false,
    lastModified: new Date()
  }
);

console.log(users.find(u => u.id === 1));
// { id: 1, name: 'Alice', role: 'admin', active: false, lastModified: ... }
```

### Update by Other Properties

```javascript
const products = ReactiveUtils.collection([
  { name: 'Widget', price: 29.99, inStock: true },
  { name: 'Gadget', price: 49.99, inStock: true },
  { name: 'Doohickey', price: 19.99, inStock: false }
]);

// Update by name
products.update(
  product => product.name === 'Widget',
  { price: 24.99, onSale: true }
);

console.log(products.find(p => p.name === 'Widget'));
// { name: 'Widget', price: 24.99, inStock: true, onSale: true }
```

### Update by Direct Reference

```javascript
const items = ReactiveUtils.collection([
  { id: 1, name: 'Item 1', status: 'pending' },
  { id: 2, name: 'Item 2', status: 'pending' }
]);

// Get reference to an item
const itemToUpdate = items.items[0];

// Update it directly
items.update(itemToUpdate, { status: 'completed' });

console.log(items.first.status); // 'completed'
```

---

## Automatic Reactivity

Updates automatically trigger reactive updates:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false }
]);

// Set up effect to watch completed count
ReactiveUtils.effect(() => {
  const completedCount = todos.items.filter(t => t.done).length;
  console.log(`Completed: ${completedCount}`);
});
// Immediately logs: "Completed: 0"

todos.update(t => t.id === 1, { done: true });
// Automatically logs: "Completed: 1"

todos.update(t => t.id === 2, { done: true });
// Automatically logs: "Completed: 2"
```

### Auto-Updating the DOM

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: false },
  { id: 3, text: 'Read book', done: false }
]);

// Auto-render list
ReactiveUtils.effect(() => {
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
    `;
    list.appendChild(li);
  });
});

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  todos.update(t => t.id === id, { done: !todo.done });
  // DOM updates automatically!
}
```

---

## Important Behavior Notes

### Only Updates the First Match

`update()` only updates the **first** item that matches:

```javascript
const items = ReactiveUtils.collection([
  { id: 1, name: 'Item A', active: true },
  { id: 2, name: 'Item B', active: true },
  { id: 3, name: 'Item C', active: true }
]);

// Only updates the FIRST active item
items.update(
  item => item.active === true,
  { featured: true }
);

console.log(items.items[0].featured); // true
console.log(items.items[1].featured); // undefined
console.log(items.items[2].featured); // undefined

// To update ALL matching items, use updateWhere()
items.updateWhere(
  item => item.active === true,
  { featured: true }
);
// Now all items have featured: true
```

### Does Nothing if Not Found

If no item matches, `update()` does nothing (no error):

```javascript
const items = ReactiveUtils.collection([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);

// Try to update non-existent item
items.update(
  item => item.id === 999,
  { name: 'Updated' }
);

// No error, collection unchanged
console.log(items.length); // Still 2
```

### Merges Updates with Existing Properties

`update()` uses `Object.assign`, so it **merges** the updates:

```javascript
const items = ReactiveUtils.collection([
  { id: 1, name: 'Widget', price: 29.99, inStock: true, category: 'tools' }
]);

// Update only price and inStock
items.update(
  item => item.id === 1,
  { price: 24.99, inStock: false }
);

console.log(items.first);
// {
//   id: 1,
//   name: 'Widget',        // Unchanged
//   price: 24.99,          // Updated
//   inStock: false,        // Updated
//   category: 'tools'      // Unchanged
// }
```

### Can Add New Properties

Updates can add properties that don't exist yet:

```javascript
const items = ReactiveUtils.collection([
  { id: 1, name: 'Item 1' }
]);

// Add new properties
items.update(
  item => item.id === 1,
  { 
    description: 'A great item',
    featured: true,
    tags: ['new', 'popular']
  }
);

console.log(items.first);
// {
//   id: 1,
//   name: 'Item 1',
//   description: 'A great item',  // New
//   featured: true,                // New
//   tags: ['new', 'popular']       // New
// }
```

---

## Method Chaining

`update()` returns the collection, so you can chain:

```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Task 1', done: false, priority: 'low' },
  { id: 2, text: 'Task 2', done: false, priority: 'low' },
  { id: 3, text: 'Task 3', done: false, priority: 'low' }
]);

// Chain multiple updates
todos
  .update(t => t.id === 1, { done: true })
  .update(t => t.id === 2, { priority: 'high' })
  .update(t => t.id === 3, { done: true, priority: 'high' });

// Or mix with other methods
todos
  .update(t => t.id === 1, { done: true })
  .add({ id: 4, text: 'Task 4', done: false, priority: 'medium' })
  .sort((a, b) => a.id - b.id);
```

---

## Practical Examples

### Example 1: Todo List with Complete/Uncomplete

```javascript
const todos = ReactiveUtils.collection([]);
let nextId = 1;

function addTodo(text) {
  todos.add({
    id: nextId++,
    text: text,
    done: false,
    createdAt: new Date(),
    completedAt: null
  });
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  
  if (todo.done) {
    // Uncomplete
    todos.update(t => t.id === id, {
      done: false,
      completedAt: null
    });
  } else {
    // Complete
    todos.update(t => t.id === id, {
      done: true,
      completedAt: new Date()
    });
  }
}

function editTodo(id, newText) {
  todos.update(t => t.id === id, {
    text: newText,
    modifiedAt: new Date()
  });
}

function setPriority(id, priority) {
  todos.update(t => t.id === id, { priority: priority });
}

// Usage
addTodo('Buy milk');
addTodo('Walk dog');

toggleTodo(1); // Mark as done
setPriority(2, 'high');
editTodo(1, 'Buy organic milk');
```

### Example 2: User Management System

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'user', active: true },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', active: true }
]);

function updateUserProfile(userId, updates) {
  todos.update(
    user => user.id === userId,
    {
      ...updates,
      lastModified: new Date(),
      modifiedBy: getCurrentUser()
    }
  );
}

function changeUserRole(userId, newRole) {
  users.update(
    user => user.id === userId,
    { 
      role: newRole,
      roleChangedAt: new Date()
    }
  );
}

function deactivateUser(userId, reason) {
  users.update(
    user => user.id === userId,
    {
      active: false,
      deactivatedAt: new Date(),
      deactivationReason: reason
    }
  );
}

function reactivateUser(userId) {
  users.update(
    user => user.id === userId,
    {
      active: true,
      reactivatedAt: new Date(),
      deactivatedAt: null,
      deactivationReason: null
    }
  );
}

// Display users with edit capability
ReactiveUtils.effect(() => {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '';
  
  users.items.forEach(user => {
    const div = document.createElement('div');
    div.className = `user ${user.active ? 'active' : 'inactive'}`;
    div.innerHTML = `
      <strong>${user.name}</strong> (${user.role})
      <span class="email">${user.email}</span>
      <button onclick="editUser(${user.id})">Edit</button>
      <button onclick="changeRole(${user.id})">Change Role</button>
      ${user.active 
        ? `<button onclick="deactivate(${user.id})">Deactivate</button>`
        : `<button onclick="reactivate(${user.id})">Reactivate</button>`
      }
    `;
    userList.appendChild(div);
  });
});

// Usage
updateUserProfile(1, { name: 'Alice Smith', phone: '555-1234' });
changeUserRole(2, 'admin');
deactivateUser(1, 'User requested account closure');
```

### Example 3: Shopping Cart with Quantity Updates

```javascript
const cart = ReactiveUtils.collection([]);

function addToCart(product) {
  const existing = cart.find(item => item.productId === product.id);
  
  if (existing) {
    // Update quantity
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
      addedAt: new Date()
    });
  }
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    cart.remove(item => item.productId === productId);
  } else {
    cart.update(
      item => item.productId === productId,
      { 
        quantity: newQuantity,
        lastUpdated: new Date()
      }
    );
  }
}

function incrementQuantity(productId) {
  const item = cart.find(i => i.productId === productId);
  if (item) {
    updateQuantity(productId, item.quantity + 1);
  }
}

function decrementQuantity(productId) {
  const item = cart.find(i => i.productId === productId);
  if (item) {
    updateQuantity(productId, item.quantity - 1);
  }
}

function applyDiscount(productId, discountPercent) {
  cart.update(
    item => item.productId === productId,
    {
      discount: discountPercent,
      discountedPrice: item.price * (1 - discountPercent / 100)
    }
  );
}

// Display cart
ReactiveUtils.effect(() => {
  const cartList = document.getElementById('cart-items');
  cartList.innerHTML = '';
  
  cart.items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <h4>${item.name}</h4>
      <div class="price">$${item.price.toFixed(2)}</div>
      <div class="quantity-controls">
        <button onclick="decrementQuantity(${item.productId})">-</button>
        <input 
          type="number" 
          value="${item.quantity}"
          min="0"
          onchange="updateQuantity(${item.productId}, parseInt(this.value))"
        >
        <button onclick="incrementQuantity(${item.productId})">+</button>
      </div>
      <div class="subtotal">
        $${(item.price * item.quantity).toFixed(2)}
      </div>
    `;
    cartList.appendChild(div);
  });
});
```

### Example 4: Task Status Management

```javascript
const tasks = ReactiveUtils.collection([]);
let nextId = 1;

const STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'review',
  DONE: 'done'
};

function createTask(title, description) {
  tasks.add({
    id: nextId++,
    title: title,
    description: description,
    status: STATUSES.TODO,
    priority: 'medium',
    assignee: null,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

function moveToInProgress(taskId) {
  tasks.update(
    task => task.id === taskId,
    {
      status: STATUSES.IN_PROGRESS,
      startedAt: new Date(),
      updatedAt: new Date()
    }
  );
}

function moveToReview(taskId) {
  tasks.update(
    task => task.id === taskId,
    {
      status: STATUSES.REVIEW,
      completedAt: new Date(),
      updatedAt: new Date()
    }
  );
}

function completeTask(taskId) {
  tasks.update(
    task => task.id === taskId,
    {
      status: STATUSES.DONE,
      finishedAt: new Date(),
      updatedAt: new Date()
    }
  );
}

function assignTask(taskId, userId) {
  tasks.update(
    task => task.id === taskId,
    {
      assignee: userId,
      assignedAt: new Date(),
      updatedAt: new Date()
    }
  );
}

function setPriority(taskId, priority) {
  tasks.update(
    task => task.id === taskId,
    {
      priority: priority,
      updatedAt: new Date()
    }
  );
}

function addComment(taskId, comment) {
  const task = tasks.find(t => t.id === taskId);
  const comments = task.comments || [];
  
  tasks.update(
    t => t.id === taskId,
    {
      comments: [...comments, {
        id: Date.now(),
        text: comment,
        author: getCurrentUser(),
        createdAt: new Date()
      }],
      updatedAt: new Date()
    }
  );
}

// Kanban board display
const todoTasks = ReactiveUtils.createFilteredCollection(tasks, t => t.status === STATUSES.TODO);
const inProgressTasks = ReactiveUtils.createFilteredCollection(tasks, t => t.status === STATUSES.IN_PROGRESS);
const reviewTasks = ReactiveUtils.createFilteredCollection(tasks, t => t.status === STATUSES.REVIEW);
const doneTasks = ReactiveUtils.createFilteredCollection(tasks, t => t.status === STATUSES.DONE);

ReactiveUtils.effect(() => {
  renderColumn('todo-column', todoTasks.items);
  renderColumn('in-progress-column', inProgressTasks.items);
  renderColumn('review-column', reviewTasks.items);
  renderColumn('done-column', doneTasks.items);
});

function renderColumn(columnId, taskList) {
  const column = document.getElementById(columnId);
  column.innerHTML = '';
  
  taskList.forEach(task => {
    const div = document.createElement('div');
    div.className = `task priority-${task.priority}`;
    div.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.description}</p>
      <div class="task-meta">
        <span class="priority">${task.priority}</span>
        ${task.assignee ? `<span class="assignee">${task.assignee}</span>` : ''}
      </div>
    `;
    column.appendChild(div);
  });
}
```

### Example 5: Inventory Management

```javascript
const inventory = ReactiveUtils.collection([]);

function addProduct(product) {
  inventory.add({
    id: product.id,
    sku: product.sku,
    name: product.name,
    quantity: product.quantity || 0,
    price: product.price,
    lowStockThreshold: 10,
    lastRestocked: new Date(),
    isActive: true
  });
}

function restockProduct(productId, quantity) {
  const product = inventory.find(p => p.id === productId);
  
  inventory.update(
    p => p.id === productId,
    {
      quantity: product.quantity + quantity,
      lastRestocked: new Date()
    }
  );
}

function sellProduct(productId, quantity) {
  const product = inventory.find(p => p.id === productId);
  
  if (product.quantity < quantity) {
    alert('Insufficient stock!');
    return false;
  }
  
  inventory.update(
    p => p.id === productId,
    {
      quantity: product.quantity - quantity,
      lastSold: new Date()
    }
  );
  
  return true;
}

function updatePrice(productId, newPrice) {
  inventory.update(
    p => p.id === productId,
    {
      price: newPrice,
      priceUpdatedAt: new Date()
    }
  );
}

function setLowStockAlert(productId, threshold) {
  inventory.update(
    p => p.id === productId,
    { lowStockThreshold: threshold }
  );
}

function discontinueProduct(productId) {
  inventory.update(
    p => p.id === productId,
    {
      isActive: false,
      discontinuedAt: new Date()
    }
  );
}

// Computed views
inventory.$computed('lowStockProducts', function() {
  return this.items.filter(p => 
    p.isActive && p.quantity <= p.lowStockThreshold
  );
});

inventory.$computed('outOfStockProducts', function() {
  return this.items.filter(p => 
    p.isActive && p.quantity === 0
  );
});

// Display inventory
ReactiveUtils.effect(() => {
  const productList = document.getElementById('inventory-list');
  productList.innerHTML = '';
  
  inventory.items.forEach(product => {
    const isLowStock = product.quantity <= product.lowStockThreshold;
    const isOutOfStock = product.quantity === 0;
    
    const div = document.createElement('div');
    div.className = `product ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : ''}`;
    div.innerHTML = `
      <h4>${product.name}</h4>
      <div class="sku">SKU: ${product.sku}</div>
      <div class="quantity">
        Stock: ${product.quantity}
        ${isLowStock ? '<span class="warning">⚠️ Low Stock</span>' : ''}
        ${isOutOfStock ? '<span class="error">❌ Out of Stock</span>' : ''}
      </div>
      <div class="price">$${product.price.toFixed(2)}</div>
      <div class="actions">
        <button onclick="restockPrompt(${product.id})">Restock</button>
        <button onclick="updatePricePrompt(${product.id})">Update Price</button>
        <button onclick="sellPrompt(${product.id})">Sell</button>
      </div>
    `;
    productList.appendChild(div);
  });
  
  // Show alerts
  document.getElementById('low-stock-count').textContent = 
    inventory.lowStockProducts.length;
  document.getElementById('out-of-stock-count').textContent = 
    inventory.outOfStockProducts.length;
});

function restockPrompt(productId) {
  const quantity = prompt('How many units to add?');
  if (quantity && parseInt(quantity) > 0) {
    restockProduct(productId, parseInt(quantity));
  }
}

function updatePricePrompt(productId) {
  const price = prompt('Enter new price:');
  if (price && parseFloat(price) > 0) {
    updatePrice(productId, parseFloat(price));
  }
}

function sellPrompt(productId) {
  const quantity = prompt('How many units to sell?');
  if (quantity && parseInt(quantity) > 0) {
    sellProduct(productId, parseInt(quantity));
  }
}
```

---

## Common Patterns

### Pattern 1: Toggle Boolean Property

```javascript
function toggleItem(id, field = 'active') {
  const item = collection.find(i => i.id === id);
  collection.update(
    i => i.id === id,
    { [field]: !item[field] }
  );
}
```

### Pattern 2: Increment/Decrement Number

```javascript
function incrementScore(playerId, points) {
  const player = players.find(p => p.id === playerId);
  players.update(
    p => p.id === playerId,
    { score: player.score + points }
  );
}
```

### Pattern 3: Conditional Update

```javascript
function updateIfValid(id, updates) {
  const item = collection.find(i => i.id === id);
  
  if (validateUpdates(updates)) {
    collection.update(i => i.id === id, updates);
  } else {
    console.error('Invalid updates');
  }
}
```

### Pattern 4: Timestamp Updates

```javascript
function updateWithTimestamp(id, updates) {
  collection.update(
    item => item.id === id,
    {
      ...updates,
      updatedAt: new Date(),
      updatedBy: getCurrentUser()
    }
  );
}
```

### Pattern 5: Merge Arrays/Objects

```javascript
function addTags(itemId, newTags) {
  const item = collection.find(i => i.id === itemId);
  const existingTags = item.tags || [];
  
  collection.update(
    i => i.id === itemId,
    {
      tags: [...new Set([...existingTags, ...newTags])] // Unique tags
    }
  );
}
```

---

## `update()` vs `updateWhere()`

### `update()` - Updates FIRST Match Only

```javascript
const items = ReactiveUtils.collection([
  { id: 1, category: 'A', active: true },
  { id: 2, category: 'A', active: true },
  { id: 3, category: 'A', active: true }
]);

items.update(
  item => item.category === 'A',
  { featured: true }
);

console.log(items.items[0].featured); // true
console.log(items.items[1].featured); // undefined
console.log(items.items[2].featured); // undefined
// Only the FIRST item in category A was updated
```

### `updateWhere()` - Updates ALL Matches

```javascript
const items = ReactiveUtils.collection([
  { id: 1, category: 'A', active: true },
  { id: 2, category: 'A', active: true },
  { id: 3, category: 'A', active: true }
]);

items.updateWhere(
  item => item.category === 'A',
  { featured: true }
);

console.log(items.items[0].featured); // true
console.log(items.items[1].featured); // true
console.log(items.items[2].featured); // true
// ALL items in category A were updated
```

**Use `update()` when:**
- You want to update only one specific item
- You're updating by unique identifier (like ID)
- You have a specific item in mind

**Use `updateWhere()` when:**
- You want to update all matching items
- Bulk updates based on criteria
- Applying changes to a category or group

---

## Common Questions

### Q: What happens if the item doesn't exist?

**Answer:** Nothing! No error is thrown:

```javascript
collection.update(
  item => item.id === 999,
  { name: 'Updated' }
);
// Does nothing, no error
```

### Q: Can I remove properties with update()?

**Answer:** Not directly, but you can set them to `null` or `undefined`:

```javascript
collection.update(
  item => item.id === 1,
  {
    temporaryField: null,
    unusedProperty: undefined
  }
);

// To actually delete properties, you'd need to do:
const item = collection.find(i => i.id === 1);
delete item.temporaryField;
collection.$notify('items'); // Trigger reactivity
```

### Q: Does `update()` deep merge nested objects?

**Answer:** No, it does shallow merge with `Object.assign`:

```javascript
const items = ReactiveUtils.collection([
  { 
    id: 1, 
    user: { name: 'Alice', age: 30, email: 'alice@example.com' }
  }
]);

// This REPLACES the entire user object
items.update(
  item => item.id === 1,
  { user: { name: 'Alice Smith' } }
);

console.log(items.first.user);
// { name: 'Alice Smith' }
// age and email are GONE!

// For deep merge, manually merge first:
const item = items.find(i => i.id === 1);
items.update(
  i => i.id === 1,
  {
    user: { ...item.user, name: 'Alice Smith' }
  }
);
// Now user keeps age and email
```

### Q: Can I update based on current value?

**Answer:** Yes! Get the item first, then calculate new value:

```javascript
const item = collection.find(i => i.id === 1);

collection.update(
  i => i.id === 1,
  {
    count: item.count * 2,
    lastValue: item.count,
    updated: true
  }
);
```

### Q: Can I update multiple items with one call?

**Answer:** No, `update()` only updates the first match. Use `updateWhere()`:

```javascript
// ❌ Only updates first active item
collection.update(
  item => item.active,
  { verified: true }
);

// ✅ Updates ALL active items
collection.updateWhere(
  item => item.active,
  { verified: true }
);
```

### Q: Does update trigger effects immediately?

**Answer:** Yes! Effects run synchronously:

```javascript
ReactiveUtils.effect(() => {
  console.log('Item status:', collection.first.status);
});

collection.update(
  item => item.id === 1,
  { status: 'updated' }
);
// Immediately logs new status
```

---

## Tips for Beginners

### 1. Always Update by Unique Identifier

```javascript
// ✅ Safe - uses unique ID
collection.update(
  item => item.id === targetId,
  updates
);

// ❌ Risky - might update wrong item
collection.update(
  item => item.name === 'John',
  updates
);
```

### 2. Use Object Spread for Nested Updates

```javascript
const item = collection.find(i => i.id === 1);

// ✅ Preserves nested properties
collection.update(
  i => i.id === 1,
  {
    settings: {
      ...item.settings,
      theme: 'dark'
    }
  }
);

// ❌ Replaces entire object
collection.update(
  i => i.id === 1,
  {
    settings: { theme: 'dark' }
  }
);
```

### 3. Add Timestamps for Audit Trail

```javascript
// ✅ Track when changes happen
collection.update(
  item => item.id === id,
  {
    ...updates,
    updatedAt: new Date(),
    updatedBy: getCurrentUser()
  }
);
```

### 4. Validate Before Updating

```javascript
// ✅ Check before updating
function updateItem(id, updates) {
  if (!validateUpdates(updates)) {
    console.error('Invalid data');
    return;
  }
  
  collection.update(
    item => item.id === id,
    updates
  );
}
```

### 5. Consider Using `toggle()` for Booleans

```javascript
// ✅ Use built-in toggle
collection.toggle(item => item.id === id, 'done');

// ⚠️ update() works but toggle is cleaner
const item = collection.find(i => i.id === id);
collection.update(
  i => i.id === id,
  { done: !item.done }
);
```

---

## Summary

### What `update()` Does:

1. ✅ Finds the **first** matching item
2. ✅ Applies updates using `Object.assign` (shallow merge)
3. ✅ Does nothing if no match (no error)
4. ✅ Can add new properties
5. ✅ Triggers reactive updates
6. ✅ Returns collection for chaining
7. ✅ Clean and expressive API

### The Basic Pattern:

```javascript
// Update by predicate (most common)
collection.update(
  item => item.id === targetId,  // Which item
  { property: newValue }          // What to change
);

// Update by direct reference
const item = collection.first;
collection.update(item, { property: newValue });

// Update multiple properties
collection.update(
  item => item.id === targetId,
  {
    property1: value1,
    property2: value2,
    property3: value3
  }
);
```

### Key Points:

- **Updates**: Only the **first** matching item
- **Merge**: Shallow merge with `Object.assign`
- **Safe**: Does nothing if not found (no error)
- **Flexible**: Can update any properties
- **Chainable**: Returns collection for chaining
- **Reactive**: Triggers updates automatically

---

**Remember:** `update()` is your go-to method for modifying items in a collection. Find the item with a predicate, specify what changes to make, and let the collection handle the rest. It's clean, safe, and keeps your UI automatically in sync! 🎉