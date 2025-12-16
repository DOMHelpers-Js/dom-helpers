# Understanding `effect()` (Builder) - A Beginner's Guide

## What is `effect()` (Builder)?

`effect()` is a builder method that adds reactive effects to your state before building it. Effects run automatically when dependencies change.

Think of it as **effect builder** - define effects while building your state.

---

## Why Does This Exist?

### The Problem: Adding Effects After Creation

Without builder, you add effects separately:

```javascript
// ❌ Without builder - separate steps
const state = ReactiveUtils.state({ count: 0 });

ReactiveUtils.effect(() => {
  console.log('Count is:', state.count);
});

// ✅ With builder - all in one
const state = ReactiveUtils.builder() 
  .state({ count: 0 })
  .effect(() => {
    console.log('Count is:', state.count);
  })
  .build();
```

**Why this matters:**
- Define effects upfront
- Clean builder pattern
- All setup in one place
- Better organization

---

## How Does It Work?

### The Builder Chain

```javascript
ReactiveUtils.builder() 
  .state({ message: 'Hello' })
  .effect(() => {
    console.log(state.message);
  })
  .build();
```

---

## Basic Usage

### Single Effect

```javascript
const state = ReactiveUtils.builder() 
  .state({ count: 0 })
  .effect(() => {
    document.getElementById('count').textContent = state.count;
  })
  .build();

state.count = 5; // DOM updates automatically
```

### Multiple Effects

```javascript
const state = ReactiveUtils.builder() 
  .state({ name: 'John', age: 30 })
  .effect(() => {
    console.log('Name:', state.name);
  })
  .effect(() => {
    console.log('Age:', state.age);
  })
  .build();

state.name = 'Jane'; // First effect runs
state.age = 31;      // Second effect runs
```

### Effect with Dependencies

```javascript
const state = ReactiveUtils.builder() 
  .state({ x: 0, y: 0 })
  .computed('sum', (s) => s.x + s.y)
  .effect(() => {
    console.log('Sum changed:', state.sum);
  })
  .build();

state.x = 10; // Effect runs
```

---

## Simple Examples Explained

### Example 1: DOM Updates

```javascript
const counter = ReactiveUtils.builder() 
  .state({ count: 0 })
  .effect(() => {
    const display = document.getElementById('display');
    display.textContent = counter.count;
    display.className = counter.count > 10 ? 'high' : 'normal';
  })
  .build();

document.getElementById('increment').onclick = () => {
  counter.count++;
  // Effect runs automatically, updates DOM
};
```

---

### Example 2: Debug Logger

```javascript
const app = ReactiveUtils.builder() 
  .state({
    user: null,
    loading: false,
    error: null
  })
  .effect(() => {
    console.group('App State Changed');
    console.log('User:', app.user);
    console.log('Loading:', app.loading);
    console.log('Error:', app.error);
    console.groupEnd();
  })
  .build();

app.loading = true;
app.user = { name: 'John' };
app.loading = false;
// Effect runs on each change
```

---

### Example 3: Sync to LocalStorage

```javascript
const settings = ReactiveUtils.builder() 
  .state({
    theme: 'light',
    fontSize: 16,
    notifications: true
  })
  .effect(() => {
    localStorage.setItem('settings', JSON.stringify({
      theme: settings.theme,
      fontSize: settings.fontSize,
      notifications: settings.notifications
    }));
    console.log('Settings saved to localStorage');
  })
  .build();

settings.theme = 'dark'; // Auto-saves to localStorage
```

---

## Real-World Example: Todo List

```javascript
const todoApp = ReactiveUtils.builder() 
  .state({
    todos: [],
    filter: 'all', // 'all', 'active', 'completed'
    newTodoText: ''
  })
  .computed('filteredTodos', (s) => {
    if (s.filter === 'active') {
      return s.todos.filter(t => !t.completed);
    }
    if (s.filter === 'completed') {
      return s.todos.filter(t => t.completed);
    }
    return s.todos;
  })
  .computed('activeCount', (s) => s.todos.filter(t => !t.completed).length)
  .computed('completedCount', (s) => s.todos.filter(t => t.completed).length)
  .effect(() => {
    // Update todo list UI
    const list = document.getElementById('todo-list');
    list.innerHTML = todoApp.filteredTodos
      .map(todo => `
        <li class="${todo.completed ? 'completed' : ''}">
          <input type="checkbox" ${todo.completed ? 'checked' : ''}
                 onchange="toggleTodo(${todo.id})">
          <span>${todo.text}</span>
          <button onclick="removeTodo(${todo.id})">×</button>
        </li>
      `)
      .join('');
  })
  .effect(() => {
    // Update counters
    document.getElementById('active-count').textContent = todoApp.activeCount;
    document.getElementById('completed-count').textContent = todoApp.completedCount;
  })
  .effect(() => {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === todoApp.filter);
    });
  })
  .effect(() => {
    // Save to localStorage
    localStorage.setItem('todos', JSON.stringify(todoApp.todos));
  })
  .build();

// Load saved todos
const saved = localStorage.getItem('todos');
if (saved) {
  todoApp.todos = JSON.parse(saved);
}

let nextId = 1;

window.addTodo = function() {
  if (todoApp.newTodoText.trim()) {
    todoApp.todos.push({
      id: nextId++,
      text: todoApp.newTodoText,
      completed: false
    });
    todoApp.newTodoText = '';
  }
};

window.toggleTodo = function(id) {
  const todo = todoApp.todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
};

window.removeTodo = function(id) {
  const index = todoApp.todos.findIndex(t => t.id === id);
  if (index !== -1) todoApp.todos.splice(index, 1);
};
```

---

## Common Patterns

### Pattern 1: DOM Update

```javascript
const state = ReactiveUtils.builder() 
  .state({ value: 0 })
  .effect(() => {
    document.getElementById('output').textContent = state.value;
  })
  .build();
```

### Pattern 2: Multiple Effects

```javascript
const state = ReactiveUtils.builder() 
  .state({ data: {} })
  .effect(() => console.log('Effect 1:', state.data))
  .effect(() => console.log('Effect 2:', state.data))
  .build();
```

### Pattern 3: Effect with Computed

```javascript
const state = ReactiveUtils.builder() 
  .state({ a: 1, b: 2 })
  .computed('sum', (s) => s.a + s.b)
  .effect(() => console.log('Sum:', state.sum))
  .build();
```

---

## Common Questions

### Q: When does effect run?

**Answer:** Initially and when dependencies change:

```javascript
.effect(() => {
  console.log(state.count); // Runs now and on count changes
})
```

### Q: Can I have multiple effects?

**Answer:** Yes, all will run:

```javascript
.effect(() => console.log('Effect 1'))
.effect(() => console.log('Effect 2'))
```

### Q: How do I stop an effect?

**Answer:** Use the returned cleanup function:

```javascript
const cleanup = ReactiveUtils.effect(() => {
  console.log(state.value);
});

// Later
cleanup(); // Stop effect
```

---

## Tips for Success

### 1. Keep Effects Pure

```javascript
// ✅ Just use reactive values
.effect(() => {
  console.log(state.count);
})

// ❌ Don't modify state in effect
.effect(() => {
  state.count++; // Can cause infinite loop!
})
```

### 2. Use for UI Updates

```javascript
// ✅ Perfect for DOM updates
.effect(() => {
  element.textContent = state.value;
})
```

### 3. One Effect Per Concern

```javascript
// ✅ Separate effects
.effect(() => updateUI())
.effect(() => saveToStorage())
.effect(() => sendAnalytics())
```

---

## Summary

### What `effect()` Does:

1. ✅ Adds effect to builder
2. ✅ Takes callback function
3. ✅ Runs immediately and on changes
4. ✅ Returns builder for chaining
5. ✅ Auto-tracks dependencies

### When to Use It:

- DOM updates
- Side effects
- Logging/debugging
- Persistence
- Analytics

### The Basic Pattern:

```javascript
const state = ReactiveUtils.builder() 
  .state({ value: 0 })
  .effect(() => {
    console.log('Value:', state.value);
  })
  .build();

state.value = 10; // Effect runs
```

---

**Remember:** `effect()` runs automatically when dependencies change. Use it in the builder for reactive side effects! 🎉
