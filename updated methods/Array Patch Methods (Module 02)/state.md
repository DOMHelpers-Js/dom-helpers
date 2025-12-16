# Understanding `state()` with Arrays - A Beginner's Guide

## What is `state()` with Array Support?

`state()` is enhanced to automatically make arrays ReactiveUtils. When you include arrays in state, all array methods (push, pop, etc.) trigger reactivity automatically.

Think of it as **array-aware state** - arrays work reactively out of the box.

---

## Why Does This Exist?

### The Problem: Arrays in State

Regular arrays in state need manual tracking for changes:

```javascript
// ❌ Without array support - mutations don't trigger updates
const state = ReactiveUtils.state({
  items: [1, 2, 3]
});

state.items.push(4); // Doesn't trigger reactivity!

// ✅ With array support - automatic reactivity
const state = ReactiveUtils.state({
  items: [1, 2, 3]
});

state.items.push(4); // Triggers reactivity!
```

**Why this matters:**
- Automatic reactivity
- All array methods work
- No manual patching
- Clean syntax

---

## How Does It Work?

### The Array Support Process

```javascript
ReactiveUtils.state({ items: [] })
    ↓
Detects array properties
    ↓
Patches array methods (push, pop, splice, etc.)
    ↓
All mutations trigger reactivity
```

---

## Basic Usage

### Simple Array in State

```javascript
const state = ReactiveUtils.state({
  todos: []
});

// All array methods trigger reactivity
state.todos.push({ id: 1, title: 'Buy milk' });
state.todos.pop();
state.todos.splice(0, 1);
```

### Multiple Arrays

```javascript
const state = ReactiveUtils.state({
  active: [],
  completed: [],
  archived: []
});

// Each array is independently reactive
state.active.push(item);
state.completed.push(item);
```

### Nested Arrays

```javascript
const state = ReactiveUtils.state({
  categories: [
    { name: 'Work', items: [] },
    { name: 'Personal', items: [] }
  ]
});

// Nested arrays are also reactive
state.categories[0].items.push('Task 1');
```

---

## Simple Examples Explained

### Example 1: Todo List

```javascript
const todoState = ReactiveUtils.state({
  todos: [],
  filter: 'all' // 'all', 'active', 'completed'
});

function addTodo(title) {
  todoState.todos.push({
    id: Date.now(),
    title: title,
    completed: false
  });
}

function toggleTodo(id) {
  const todo = todoState.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
}

function removeTodo(id) {
  const index = todoState.todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todoState.todos.splice(index, 1);
  }
}

// Display todos
ReactiveUtils.effect(() => {
  const container = document.getElementById('todos');

  const filtered = todoState.todos.filter(todo => {
    if (todoState.filter === 'active') return !todo.completed;
    if (todoState.filter === 'completed') return todo.completed;
    return true;
  });

  container.innerHTML = filtered
    .map(todo => `
      <div class="todo ${todo.completed ? 'completed' : ''}">
        <input type="checkbox"
               ${todo.completed ? 'checked' : ''}
               onchange="toggleTodo(${todo.id})">
        <span>${todo.title}</span>
        <button onclick="removeTodo(${todo.id})">Remove</button>
      </div>
    `)
    .join('');
});
```

---

### Example 2: Shopping Cart

```javascript
const cartState = ReactiveUtils.state({
  items: [],
  discount: 0
});

function addToCart(product) {
  const existing = cartState.items.find(i => i.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cartState.items.push({
      ...product,
      quantity: 1
    });
  }
}

function removeFromCart(productId) {
  const index = cartState.items.findIndex(i => i.id === productId);
  if (index !== -1) {
    cartState.items.splice(index, 1);
  }
}

function updateQuantity(productId, quantity) {
  const item = cartState.items.find(i => i.id === productId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
    }
  }
}

// Display cart
ReactiveUtils.effect(() => {
  const container = document.getElementById('cart');
  const subtotal = cartState.items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );
  const total = subtotal * (1 - cartState.discount / 100);

  container.innerHTML = `
    <h3>Shopping Cart (${cartState.items.length} items)</h3>
    ${cartState.items.map(item => `
      <div class="cart-item">
        <span>${item.name}</span>
        <input type="number"
               value="${item.quantity}"
               min="0"
               onchange="updateQuantity(${item.id}, parseInt(this.value))">
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `).join('')}
    <div class="cart-total">
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      ${cartState.discount > 0 ? `
        <p>Discount: ${cartState.discount}%</p>
      ` : ''}
      <h4>Total: $${total.toFixed(2)}</h4>
    </div>
  `;
});
```

---

### Example 3: Dynamic Form Fields

```javascript
const formState = ReactiveUtils.state({
  fields: [
    { id: 1, name: 'Name', value: '', type: 'text' }
  ]
});

function addField(type = 'text') {
  formState.fields.push({
    id: Date.now(),
    name: `Field ${formState.fields.length + 1}`,
    value: '',
    type: type
  });
}

function removeField(id) {
  const index = formState.fields.findIndex(f => f.id === id);
  if (index !== -1) {
    formState.fields.splice(index, 1);
  }
}

function moveFieldUp(id) {
  const index = formState.fields.findIndex(f => f.id === id);
  if (index > 0) {
    const field = formState.fields[index];
    formState.fields.splice(index, 1);
    formState.fields.splice(index - 1, 0, field);
  }
}

// Display form builder
ReactiveUtils.effect(() => {
  const container = document.getElementById('form-builder');

  container.innerHTML = `
    <div class="form-builder">
      ${formState.fields.map((field, index) => `
        <div class="field-row">
          <input type="text"
                 placeholder="Field Name"
                 value="${field.name}"
                 oninput="formState.fields[${index}].name = this.value">
          <select onchange="formState.fields[${index}].type = this.value">
            <option value="text" ${field.type === 'text' ? 'selected' : ''}>Text</option>
            <option value="email" ${field.type === 'email' ? 'selected' : ''}>Email</option>
            <option value="number" ${field.type === 'number' ? 'selected' : ''}>Number</option>
          </select>
          <button onclick="moveFieldUp(${field.id})" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button onclick="removeField(${field.id})">Remove</button>
        </div>
      `).join('')}
      <button onclick="addField()">Add Field</button>
    </div>
  `;
});
```

---

## Real-World Example: Kanban Board

```javascript
const boardState = ReactiveUtils.state({
  columns: [
    { id: 1, title: 'To Do', tasks: [] },
    { id: 2, title: 'In Progress', tasks: [] },
    { id: 3, title: 'Done', tasks: [] }
  ]
});

function addTask(columnId, title) {
  const column = boardState.columns.find(c => c.id === columnId);
  if (column) {
    column.tasks.push({
      id: Date.now(),
      title: title,
      createdAt: new Date()
    });
  }
}

function moveTask(taskId, fromColumnId, toColumnId) {
  const fromColumn = boardState.columns.find(c => c.id === fromColumnId);
  const toColumn = boardState.columns.find(c => c.id === toColumnId);

  if (fromColumn && toColumn) {
    const taskIndex = fromColumn.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const task = fromColumn.tasks[taskIndex];
      fromColumn.tasks.splice(taskIndex, 1);
      toColumn.tasks.push(task);
    }
  }
}

function deleteTask(columnId, taskId) {
  const column = boardState.columns.find(c => c.id === columnId);
  if (column) {
    const index = column.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      column.tasks.splice(index, 1);
    }
  }
}

// Display board
ReactiveUtils.effect(() => {
  const container = document.getElementById('kanban-board');

  container.innerHTML = boardState.columns
    .map(column => `
      <div class="kanban-column">
        <h3>${column.title} (${column.tasks.length})</h3>
        <div class="tasks">
          ${column.tasks.map(task => `
            <div class="task" draggable="true">
              <p>${task.title}</p>
              <button onclick="deleteTask(${column.id}, ${task.id})">Delete</button>
            </div>
          `).join('')}
        </div>
        <button onclick="addTaskPrompt(${column.id})">Add Task</button>
      </div>
    `)
    .join('');
});

function addTaskPrompt(columnId) {
  const title = prompt('Task title:');
  if (title) {
    addTask(columnId, title);
  }
}
```

---

## Common Patterns

### Pattern 1: Simple Array

```javascript
const state = ReactiveUtils.state({
  items: []
});

state.items.push(item);
```

### Pattern 2: Multiple Arrays

```javascript
const state = ReactiveUtils.state({
  list1: [],
  list2: [],
  list3: []
});
```

### Pattern 3: Nested Structure

```javascript
const state = ReactiveUtils.state({
  categories: [
    { name: 'Cat1', items: [] }
  ]
});
```

---

## Common Questions

### Q: Are nested arrays reactive?

**Answer:** Yes, all levels:

```javascript
const state = ReactiveUtils.state({
  data: [[1, 2], [3, 4]]
});

state.data[0].push(3); // Reactive!
```

### Q: What methods trigger reactivity?

**Answer:** All mutating methods:

```javascript
// These all trigger reactivity:
state.arr.push()
state.arr.pop()
state.arr.shift()
state.arr.unshift()
state.arr.splice()
state.arr.sort()
state.arr.reverse()
state.arr.fill()
state.arr.copyWithin()
```

### Q: Do I need to call patchArray()?

**Answer:** No, automatic for arrays in state:

```javascript
// Automatic - no patching needed
const state = ReactiveUtils.state({
  items: []
});
```

---

## Summary

### What Array Support Does:

1. ✅ Automatic reactivity
2. ✅ All array methods work
3. ✅ Nested arrays supported
4. ✅ No manual patching
5. ✅ Clean syntax

### When to Use It:

- Lists in state
- Dynamic collections
- Shopping carts
- Todo lists
- Any mutable arrays

### The Basic Pattern:

```javascript
const state = ReactiveUtils.state({
  items: []
});

// All array operations are reactive
state.items.push(item);
state.items.splice(0, 1);
state.items.sort();

// Works in effects
ReactiveUtils.effect(() => {
  console.log(state.items.length);
});
```

---

**Remember:** Arrays in `ReactiveUtils.state()` are automatically reactive - just use them normally! 🎉
