# Understanding `updateWhere()` - A Beginner's Guide

## What is `updateWhere()`?

`updateWhere()` is a method for reactive collections that updates all items matching a condition. It's perfect for bulk updates with a predicate.

Think of it as **conditional updater** - update all matching items.

---

## Why Does This Exist?

### The Problem: Updating Multiple Items

You need to update all items that match criteria:

```javascript
// ❌ Without updateWhere - manual loop
const items = ReactiveUtils.collection([
  { id: 1, status: 'pending' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'done' }
]);

items.forEach(item => {
  if (item.status === 'pending') {
    item.status = 'processing';
  }
});

// ✅ With updateWhere() - clean
items.updateWhere(
  item => item.status === 'pending',
  { status: 'processing' }
);
```

**Why this matters:**
- Bulk updates
- Clean syntax
- Single method call
- Triggers reactivity

---

## How Does It Work?

### The UpdateWhere Process

```javascript
collection.updateWhere(predicate, updates)
    ↓
Tests each item with predicate
    ↓
Applies updates to matching items
Returns count of updated items
Triggers reactive updates
```

---

## Basic Usage

### Update by Property

```javascript
const items = ReactiveUtils.collection([
  { id: 1, status: 'pending', priority: 'low' },
  { id: 2, status: 'pending', priority: 'high' },
  { id: 3, status: 'done', priority: 'low' }
]);

const count = items.updateWhere(
  item => item.status === 'pending',
  { status: 'active' }
);
console.log(`Updated ${count} items`); // Updated 2 items
```

### Update Multiple Fields

```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, status: 'todo', assignee: null, priority: 'low' },
  { id: 2, status: 'todo', assignee: null, priority: 'high' }
]);

tasks.updateWhere(
  task => task.status === 'todo',
  { status: 'in-progress', assignee: 'John', startedAt: Date.now() }
);
```

### Update with Function

```javascript
const items = ReactiveUtils.collection([
  { id: 1, count: 5 },
  { id: 2, count: 10 },
  { id: 3, count: 15 }
]);

items.updateWhere(
  item => item.count > 5,
  item => ({ count: item.count * 2 })
);
```

---

## Simple Examples Explained

### Example 1: Bulk Task Assignment

```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, title: 'Task 1', assignee: null, status: 'todo' },
  { id: 2, title: 'Task 2', assignee: null, status: 'todo' },
  { id: 3, title: 'Task 3', assignee: 'Bob', status: 'in-progress' }
]);

function assignTasks(assignee) {
  const count = tasks.updateWhere(
    task => task.status === 'todo' && task.assignee === null,
    { assignee: assignee, assignedAt: Date.now() }
  );
  alert(`Assigned ${count} tasks to ${assignee}`);
}

// Display tasks
ReactiveUtils.effect(() => {
  const container = document.getElementById('tasks');
  const unassigned = tasks.filter(t => !t.assignee).length;

  container.innerHTML = `
    <h3>Tasks (${unassigned} unassigned)</h3>
    ${tasks.map(task => `
      <div class="task">
        <strong>${task.title}</strong>
        <span>${task.assignee || 'Unassigned'}</span>
        <span class="status">${task.status}</span>
      </div>
    `).join('')}
    ${unassigned > 0 ? `
      <button onclick="assignTasks('John')">
        Assign ${unassigned} to John
      </button>
    ` : ''}
  `;
});
```

---

### Example 2: Publish All Drafts

```javascript
const posts = ReactiveUtils.collection([
  { id: 1, title: 'Post 1', status: 'draft', published: false },
  { id: 2, title: 'Post 2', status: 'draft', published: false },
  { id: 3, title: 'Post 3', status: 'published', published: true }
]);

function publishAllDrafts() {
  const count = posts.updateWhere(
    post => post.status === 'draft',
    {
      status: 'published',
      published: true,
      publishedAt: new Date().toISOString()
    }
  );
  alert(`Published ${count} posts`);
}

// Display posts
ReactiveUtils.effect(() => {
  const container = document.getElementById('posts');
  const draftCount = posts.filter(p => p.status === 'draft').length;

  container.innerHTML = `
    <h3>Posts</h3>
    ${posts.map(post => `
      <div class="post ${post.status}">
        <strong>${post.title}</strong>
        <span class="badge">${post.status}</span>
        ${post.publishedAt ? `
          <small>Published: ${new Date(post.publishedAt).toLocaleDateString()}</small>
        ` : ''}
      </div>
    `).join('')}
    ${draftCount > 0 ? `
      <button onclick="publishAllDrafts()">
        Publish ${draftCount} draft(s)
      </button>
    ` : ''}
  `;
});
```

---

### Example 3: Price Update

```javascript
const products = ReactiveUtils.collection([
  { id: 1, name: 'Product 1', price: 100, discount: 0, onSale: false },
  { id: 2, name: 'Product 2', price: 200, discount: 0, onSale: false },
  { id: 3, name: 'Product 3', price: 50, discount: 10, onSale: true }
]);

function applyDiscount(category, discountPercent) {
  const count = products.updateWhere(
    product => !product.onSale,
    {
      discount: discountPercent,
      onSale: true,
      saleStartedAt: Date.now()
    }
  );
  alert(`Applied ${discountPercent}% discount to ${count} products`);
}

// Display products
ReactiveUtils.effect(() => {
  const container = document.getElementById('products');

  container.innerHTML = products
    .map(product => {
      const finalPrice = product.price * (1 - product.discount / 100);
      return `
        <div class="product ${product.onSale ? 'on-sale' : ''}">
          <h4>${product.name}</h4>
          <div class="price">
            ${product.onSale ? `
              <span class="original">$${product.price}</span>
              <span class="sale">$${finalPrice.toFixed(2)}</span>
              <span class="discount">${product.discount}% off</span>
            ` : `
              <span>$${product.price}</span>
            `}
          </div>
        </div>
      `;
    })
    .join('');
});
```

---

## Real-World Example: Order Processing

```javascript
const orders = ReactiveUtils.collection([
  { id: 1, customer: 'John', status: 'pending', priority: 'normal', processedBy: null },
  { id: 2, customer: 'Jane', status: 'pending', priority: 'urgent', processedBy: null },
  { id: 3, customer: 'Bob', status: 'processing', priority: 'normal', processedBy: 'Admin' },
  { id: 4, customer: 'Alice', status: 'pending', priority: 'urgent', processedBy: null }
]);

// Process urgent orders
function processUrgentOrders(processor) {
  const count = orders.updateWhere(
    order => order.status === 'pending' && order.priority === 'urgent',
    {
      status: 'processing',
      processedBy: processor,
      startedAt: new Date().toISOString()
    }
  );
  return count;
}

// Complete all processing orders
function completeProcessingOrders() {
  const count = orders.updateWhere(
    order => order.status === 'processing',
    {
      status: 'completed',
      completedAt: new Date().toISOString()
    }
  );
  return count;
}

// Cancel pending orders older than X days
function cancelOldOrders(days) {
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);

  const count = orders.updateWhere(
    order => order.status === 'pending' && order.createdAt < cutoff,
    {
      status: 'cancelled',
      cancelReason: 'Timeout',
      cancelledAt: Date.now()
    }
  );
  return count;
}

// Display orders
ReactiveUtils.effect(() => {
  const container = document.getElementById('orders');
  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    urgent: orders.filter(o => o.priority === 'urgent' && o.status === 'pending').length
  };

  container.innerHTML = `
    <div class="orders-header">
      <h3>Orders</h3>
      <div class="stats">
        <span>Pending: ${stats.pending}</span>
        <span>Processing: ${stats.processing}</span>
        <span>Urgent: ${stats.urgent}</span>
      </div>
      <div class="actions">
        ${stats.urgent > 0 ? `
          <button onclick="processUrgentOrders('Admin')">
            Process ${stats.urgent} urgent
          </button>
        ` : ''}
        ${stats.processing > 0 ? `
          <button onclick="completeProcessingOrders()">
            Complete ${stats.processing} processing
          </button>
        ` : ''}
      </div>
    </div>
    <div class="order-list">
      ${orders.map(order => `
        <div class="order status-${order.status} priority-${order.priority}">
          <div class="order-header">
            <strong>#${order.id} - ${order.customer}</strong>
            <span class="status-badge">${order.status}</span>
            ${order.priority === 'urgent' ? '<span class="urgent">⚡</span>' : ''}
          </div>
          <div class="order-details">
            ${order.processedBy ? `<p>Processed by: ${order.processedBy}</p>` : ''}
            ${order.completedAt ? `<p>Completed: ${new Date(order.completedAt).toLocaleString()}</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
});
```

---

## Common Patterns

### Pattern 1: Simple Update

```javascript
collection.updateWhere(
  item => item.active,
  { status: 'processed' }
);
```

### Pattern 2: Multiple Fields

```javascript
collection.updateWhere(
  item => item.category === 'electronics',
  { discount: 20, onSale: true }
);
```

### Pattern 3: Dynamic Updates

```javascript
collection.updateWhere(
  item => item.score > 50,
  item => ({ grade: calculateGrade(item.score) })
);
```

### Pattern 4: Count Updates

```javascript
const count = collection.updateWhere(predicate, updates);
console.log(`Updated ${count} items`);
```

---

## Common Questions

### Q: Does it modify the original?

**Answer:** Yes, updates in place:

```javascript
items.updateWhere(i => i.old, { status: 'archived' });
// Original items are modified
```

### Q: What does it return?

**Answer:** Count of updated items:

```javascript
const count = items.updateWhere(predicate, updates);
console.log(count); // Number of items updated
```

### Q: Is it reactive?

**Answer:** Yes:

```javascript
ReactiveUtils.effect(() => {
  console.log(items[0].status);
});
items.updateWhere(i => true, { status: 'new' }); // Effect runs
```

---

## Summary

### What `updateWhere()` Does:

1. ✅ Updates matching items
2. ✅ Tests with predicate
3. ✅ Returns count
4. ✅ Modifies in place
5. ✅ Triggers reactivity

### When to Use It:

- Bulk updates
- Status changes
- Batch assignments
- Price updates
- Mass modifications

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([
  { id: 1, status: 'pending' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'done' }
]);

// Update matching items
const count = collection.updateWhere(
  item => item.status === 'pending',
  { status: 'active', startedAt: Date.now() }
);
console.log(`Updated ${count} items`);
```

---

**Remember:** `updateWhere()` updates all matching items and returns the count! 🎉
