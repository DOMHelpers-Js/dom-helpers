# Understanding `map()` - A Beginner's Guide

## What is `map()`?

`map()` is a method for reactive collections that transforms each item and returns a new array. It works like JavaScript's array `map()` but on reactive collections.

Think of it as **collection transformer** - transform all items at once.

---

## Why Does This Exist?

### The Problem: Transforming Collections

You need to transform each item in a collection:

```javascript
// ❌ Without map - manual loop
const users = ReactiveUtils.collection([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
]);

const names = [];
for (let user of users) {
  names.push(user.name);
}

// ✅ With map() - clean
const names = users.map(u => u.name);
```

**Why this matters:**
- Cleaner syntax
- Familiar array method
- Transform all items
- Returns new array

---

## How Does It Work?

### The Transform Process

```javascript
collection.map(transformer)
    ↓
Transforms each item
    ↓
Returns new array
```

---

## Basic Usage

### Extract Property

```javascript
const users = ReactiveUtils.collection([
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 }
]);

const names = users.map(u => u.name);
console.log(names); // ['John', 'Jane']

const ages = users.map(u => u.age);
console.log(ages); // [30, 25]
```

### Transform Values

```javascript
const numbers = ReactiveUtils.collection([1, 2, 3, 4]);

const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8]

const squared = numbers.map(n => n ** 2);
console.log(squared); // [1, 4, 9, 16]
```

### Create Objects

```javascript
const names = ReactiveUtils.collection(['John', 'Jane', 'Bob']);

const users = names.map((name, index) => ({
  id: index + 1,
  name: name
}));
console.log(users);
// [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 3, name: 'Bob' }]
```

---

## Simple Examples Explained

### Example 1: Format Display Data

```javascript
const products = ReactiveUtils.collection([
  { id: 1, name: 'Apple', price: 1.5 },
  { id: 2, name: 'Bread', price: 2.5 },
  { id: 3, name: 'Milk', price: 3.0 }
]);

// Format for display
const displayItems = products.map(p => ({
  label: `${p.name} - $${p.price.toFixed(2)}`,
  value: p.id
}));

// Render dropdown
const select = document.getElementById('product-select');
select.innerHTML = displayItems
  .map(item => `<option value="${item.value}">${item.label}</option>`)
  .join('');
```

---

### Example 2: Calculate Totals

```javascript
const cartItems = ReactiveUtils.collection([
  { id: 1, name: 'Apple', price: 1.5, quantity: 3 },
  { id: 2, name: 'Bread', price: 2.5, quantity: 1 },
  { id: 3, name: 'Milk', price: 3.0, quantity: 2 }
]);

// Calculate item totals
const itemTotals = cartItems.map(item => ({
  name: item.name,
  total: item.price * item.quantity
}));

console.log(itemTotals);
// [{ name: 'Apple', total: 4.5 }, { name: 'Bread', total: 2.5 }, { name: 'Milk', total: 6.0 }]

// Display in table
const table = document.getElementById('cart-table');
table.innerHTML = `
  <table>
    <thead><tr><th>Item</th><th>Total</th></tr></thead>
    <tbody>
      ${itemTotals.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>$${item.total.toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`;
```

---

### Example 3: User List

```javascript
const users = ReactiveUtils.collection([
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' }
]);

// Create display format
const userDisplay = users.map(u => ({
  id: u.id,
  fullName: `${u.firstName} ${u.lastName}`,
  initials: u.firstName[0] + u.lastName[0],
  email: u.email
}));

// Render user cards
ReactiveUtils.effect(() => {
  const container = document.getElementById('user-list');
  container.innerHTML = userDisplay
    .map(user => `
      <div class="user-card">
        <div class="avatar">${user.initials}</div>
        <div class="info">
          <h3>${user.fullName}</h3>
          <p>${user.email}</p>
        </div>
      </div>
    `)
    .join('');
});
```

---

## Real-World Example: Task Dashboard

```javascript
const tasks = ReactiveUtils.collection([
  { id: 1, title: 'Buy milk', completed: false, dueDate: '2024-01-15', priority: 'low' },
  { id: 2, title: 'Finish report', completed: false, dueDate: '2024-01-10', priority: 'high' },
  { id: 3, title: 'Call client', completed: true, dueDate: '2024-01-08', priority: 'medium' },
  { id: 4, title: 'Review code', completed: false, dueDate: '2024-01-12', priority: 'high' }
]);

// Transform for display
const taskDisplay = ReactiveUtils.computed(() => {
  return tasks.map(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    return {
      id: task.id,
      title: task.title,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.dueDate,
      daysUntilDue: daysUntilDue,
      isOverdue: daysUntilDue < 0,
      urgencyClass: task.priority === 'high' ? 'urgent' :
                    task.priority === 'medium' ? 'moderate' : 'low-priority',
      statusClass: task.completed ? 'completed' : 'pending'
    };
  });
});

// Display tasks
ReactiveUtils.effect(() => {
  const container = document.getElementById('tasks');
  container.innerHTML = taskDisplay
    .map(task => `
      <div class="task ${task.statusClass} ${task.urgencyClass}">
        <input type="checkbox" ${task.completed ? 'checked' : ''}
               onchange="toggleTask(${task.id})">
        <div class="task-info">
          <h4>${task.title}</h4>
          <p class="due-date ${task.isOverdue ? 'overdue' : ''}">
            ${task.isOverdue ? 'Overdue' : `Due in ${task.daysUntilDue} day(s)`}
          </p>
          <span class="priority-badge">${task.priority}</span>
        </div>
      </div>
    `)
    .join('');
});

// Statistics
const stats = ReactiveUtils.computed(() => {
  const taskData = tasks.map(t => ({
    completed: t.completed,
    priority: t.priority
  }));

  return {
    total: taskData.length,
    completed: taskData.filter(t => t.completed).length,
    highPriority: taskData.filter(t => t.priority === 'high').length
  };
});

ReactiveUtils.effect(() => {
  document.getElementById('total-tasks').textContent = stats.total;
  document.getElementById('completed-tasks').textContent = stats.completed;
  document.getElementById('high-priority').textContent = stats.highPriority;
});
```

---

## Common Patterns

### Pattern 1: Extract Property

```javascript
const names = collection.map(x => x.name);
```

### Pattern 2: Transform Values

```javascript
const doubled = numbers.map(n => n * 2);
```

### Pattern 3: Create Objects

```javascript
const formatted = items.map(item => ({
  id: item.id,
  label: item.name
}));
```

### Pattern 4: With Index

```javascript
const numbered = items.map((item, index) => ({
  number: index + 1,
  data: item
}));
```

---

## Common Questions

### Q: Does it modify the original?

**Answer:** No, returns new array:

```javascript
const doubled = numbers.map(n => n * 2);
// numbers unchanged
```

### Q: Can I access index?

**Answer:** Yes, second parameter:

```javascript
const numbered = items.map((item, index) => ({
  index: index,
  item: item
}));
```

### Q: What if collection is empty?

**Answer:** Returns empty array:

```javascript
const empty = ReactiveUtils.collection([]);
const result = empty.map(x => x * 2);
console.log(result); // []
```

---

## Tips for Success

### 1. Use for Transformation

```javascript
// ✅ Transform all items
const prices = products.map(p => p.price);
```

### 2. Create Display Format

```javascript
// ✅ Format for UI
const display = users.map(u => ({
  label: u.name,
  value: u.id
}));
```

### 3. Calculate Derived Values

```javascript
// ✅ Add computed properties
const enhanced = items.map(i => ({
  ...i,
  total: i.price * i.quantity
}));
```

---

## Summary

### What `map()` Does:

1. ✅ Transforms each item
2. ✅ Returns new array
3. ✅ Same length as original
4. ✅ Doesn't modify original
5. ✅ Can access index

### When to Use It:

- Extracting properties
- Transforming values
- Formatting for display
- Creating new objects
- Calculating derived values

### The Basic Pattern:

```javascript
const collection = ReactiveUtils.collection([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
]);

const names = collection.map(x => x.name);
console.log(names); // ['John', 'Jane']
```

---

**Remember:** `map()` transforms ALL items and returns a new array. Perfect for data transformation! 🎉
