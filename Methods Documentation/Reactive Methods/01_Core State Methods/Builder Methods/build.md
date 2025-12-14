# Understanding `build()` (Builder) - A Beginner's Guide

## What is `build()`?

`build()` is the final method in the builder chain that creates and returns your completed reactive state. It's the last step after configuring everything.

Think of it as **finalize builder** - converts your builder configuration into a working state.

---

## Why Does This Exist?

### The Problem: Builder Pattern Completion

The builder pattern needs a final step to create the object:

```javascript
// ❌ Incomplete - no build()
const builder = ReactiveUtils.builder()
  .state({ count: 0 })
  .action('increment', function() { this.count++; });
// builder is not usable yet!

// ✅ Complete - with build()
const state = ReactiveUtils.builder()
  .state({ count: 0 })
  .action('increment', function() { this.count++; })
  .build(); // Now it's a reactive state!

state.increment(); // Works!
```

**Why this matters:**
- Completes builder pattern
- Returns usable state
- Clear point of creation
- Standard builder pattern

---

## How Does It Work?

### The Builder Chain

```javascript
ReactiveUtils.builder()          // Start builder
  .state({ count: 0 })      // Configure
  .action('increment', ...) // Configure more
  .build();                 // Finalize and return state
```

---

## Basic Usage

### Simple Build

```javascript
const counter = ReactiveUtils.builder()
  .state({ count: 0 })
  .build();

console.log(counter.count); // 0
counter.count = 5;
console.log(counter.count); // 5
```

### Build with Features

```javascript
const state = ReactiveUtils.builder()
  .state({ value: 0 })
  .computed('double', (s) => s.value * 2)
  .action('increment', function() { this.value++; })
  .build();

state.increment();
console.log(state.double); // 2
```

### Complete Builder

```javascript
const app = ReactiveUtils.builder()
  .state({ count: 0 })
  .computed('double', (s) => s.count * 2)
  .actions({
    increment() { this.count++; },
    decrement() { this.count--; }
  })
  .watch('count', (newVal) => {
    console.log('Count:', newVal);
  })
  .effect(() => {
    document.getElementById('display').textContent = app.count;
  })
  .build(); // Creates final reactive state

app.increment(); // Everything works!
```

---

## Simple Examples Explained

### Example 1: Counter with All Features

```javascript
const counter = ReactiveUtils.builder()
  .state({
    count: 0,
    step: 1
  })
  .computed('display', (s) => `Count: ${s.count}`)
  .actions({
    increment() {
      this.count += this.step;
    },
    decrement() {
      this.count -= this.step;
    },
    setStep(newStep) {
      this.step = newStep;
    },
    reset() {
      this.count = 0;
      this.step = 1;
    }
  })
  .watch('count', (newVal, oldVal) => {
    console.log(`Count changed: ${oldVal} → ${newVal}`);
  })
  .effect(() => {
    const el = document.getElementById('counter-display');
    if (el) el.textContent = counter.display;
  })
  .build(); // Create final state

counter.increment(); // 1
counter.setStep(5);
counter.increment(); // 6
```

---

### Example 2: Form with Validation

```javascript
const loginForm = ReactiveUtils.builder()
  .state({
    email: '',
    password: '',
    errors: {}
  })
  .computed('isValid', (s) => Object.keys(s.errors).length === 0)
  .actions({
    setEmail(value) {
      this.email = value;
      this.validateEmail();
    },

    setPassword(value) {
      this.password = value;
      this.validatePassword();
    },

    validateEmail() {
      if (!this.email) {
        this.errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.errors.email = 'Invalid email';
      } else {
        delete this.errors.email;
      }
    },

    validatePassword() {
      if (!this.password) {
        this.errors.password = 'Password is required';
      } else if (this.password.length < 8) {
        this.errors.password = 'Password must be 8+ characters';
      } else {
        delete this.errors.password;
      }
    },

    async submit() {
      this.validateEmail();
      this.validatePassword();

      if (this.isValid) {
        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        return response.ok;
      }
      return false;
    }
  })
  .build(); // Ready to use!

// Bind to form
document.getElementById('email').oninput = (e) => {
  loginForm.setEmail(e.target.value);
};

document.getElementById('password').oninput = (e) => {
  loginForm.setPassword(e.target.value);
};

document.getElementById('login-form').onsubmit = async (e) => {
  e.preventDefault();
  const success = await loginForm.submit();
  if (success) {
    window.location.href = '/dashboard';
  }
};
```

---

### Example 3: Data Fetcher

```javascript
const userLoader = ReactiveUtils.builder()
  .state({
    user: null,
    loading: false,
    error: null
  })
  .computed('hasUser', (s) => s.user !== null)
  .computed('hasError', (s) => s.error !== null)
  .actions({
    async load(userId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          this.user = await response.json();
        } else {
          this.error = 'User not found';
        }
      } catch (err) {
        this.error = 'Network error';
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.user = null;
      this.error = null;
    }
  })
  .effect(() => {
    const display = document.getElementById('user-display');
    if (!display) return;

    if (userLoader.loading) {
      display.innerHTML = '<p>Loading...</p>';
    } else if (userLoader.hasError) {
      display.innerHTML = `<p class="error">${userLoader.error}</p>`;
    } else if (userLoader.hasUser) {
      display.innerHTML = `
        <h2>${userLoader.user.name}</h2>
        <p>${userLoader.user.email}</p>
      `;
    }
  })
  .build(); // State is ready!

// Load user
await userLoader.load(123);
```

---

## Real-World Example: Todo Application

```javascript
const todoApp = ReactiveUtils.builder()
  .state({
    todos: [],
    filter: 'all',
    nextId: 1,
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
  .computed('stats', (s) => ({
    total: s.todos.length,
    active: s.todos.filter(t => !t.completed).length,
    completed: s.todos.filter(t => t.completed).length
  }))
  .actions({
    addTodo() {
      if (this.newTodoText.trim()) {
        this.todos.push({
          id: this.nextId++,
          text: this.newTodoText.trim(),
          completed: false
        });
        this.newTodoText = '';
      }
    },

    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id);
      if (todo) todo.completed = !todo.completed;
    },

    removeTodo(id) {
      this.todos = this.todos.filter(t => t.id !== id);
    },

    setFilter(filter) {
      this.filter = filter;
    },

    clearCompleted() {
      this.todos = this.todos.filter(t => !t.completed);
    }
  })
  .watch('todos', () => {
    localStorage.setItem('todos', JSON.stringify(todoApp.todos));
  })
  .effect(() => {
    const list = document.getElementById('todo-list');
    list.innerHTML = todoApp.filteredTodos
      .map(todo => `
        <li class="${todo.completed ? 'completed' : ''}">
          <input type="checkbox" ${todo.completed ? 'checked' : ''}
                 onchange="todoApp.toggleTodo(${todo.id})">
          <span>${todo.text}</span>
          <button onclick="todoApp.removeTodo(${todo.id})">×</button>
        </li>
      `)
      .join('');
  })
  .effect(() => {
    document.getElementById('stats').textContent =
      `${todoApp.stats.active} active, ${todoApp.stats.completed} completed`;
  })
  .build(); // Complete and ready!

// Load saved todos
const saved = localStorage.getItem('todos');
if (saved) {
  todoApp.todos = JSON.parse(saved);
}

// Make globally accessible
window.todoApp = todoApp;
```

---

## Common Patterns

### Pattern 1: Simple Build

```javascript
const state = ReactiveUtils.builder()
  .state({ value: 0 })
  .build();
```

### Pattern 2: Full Featured

```javascript
const state = ReactiveUtils.builder()
  .state({ data: {} })
  .computed('derived', (s) => s.data.value)
  .actions({ method() {} })
  .watch('data', () => {})
  .effect(() => {})
  .build();
```

### Pattern 3: Save Reference

```javascript
const myApp = ReactiveUtils.builder()
  .state({ count: 0 })
  .actions({ increment() { this.count++; }})
  .build();

// Use it
myApp.increment();
```

---

## Common Questions

### Q: Is `build()` required?

**Answer:** Yes! Without it, you have a builder, not a state:

```javascript
// ❌ Without build - can't use
const builder = ReactiveUtils.builder().state({ count: 0 });
builder.count; // undefined

// ✅ With build - works
const state = ReactiveUtils.builder().state({ count: 0 }).build();
state.count; // 0
```

### Q: Can I call `build()` multiple times?

**Answer:** Each call creates a new independent state:

```javascript
const builder = ReactiveUtils.builder().state({ count: 0 });

const state1 = builder.build();
const state2 = builder.build();

state1.count = 5;
console.log(state2.count); // 0 (separate state)
```

### Q: What does `build()` return?

**Answer:** A reactive state object:

```javascript
const state = ReactiveUtils.builder()
  .state({ value: 0 })
  .build();

// state is now a reactive object
```

---

## Tips for Success

### 1. Always Call Last

```javascript
// ✅ build() at the end
ReactiveUtils.builder()
  .state({})
  .actions({})
  .build(); // Last!
```

### 2. Save to Variable

```javascript
// ✅ Save the result
const myState = ReactiveUtils.builder()
  .state({})
  .build();
```

### 3. Complete Setup Before Build

```javascript
// ✅ Configure everything first
ReactiveUtils.builder()
  .state({})
  .computed()
  .actions()
  .effects()
  .build(); // Then build
```

---

## Summary

### What `build()` Does:

1. ✅ Finalizes builder configuration
2. ✅ Creates reactive state object
3. ✅ Returns usable state
4. ✅ Must be called last
5. ✅ Required to complete builder

### When to Use It:

- Always! (required)
- Last step in builder chain
- After all configuration
- To get final state

### The Basic Pattern:

```javascript
const state = ReactiveUtils.builder()
  .state({ value: 0 })
  .computed('double', (s) => s.value * 2)
  .actions({ increment() { this.value++; }})
  .build(); // Required final step!

// Now use it
state.increment();
console.log(state.double);
```

---

**Remember:** `build()` is required to complete the builder and get your reactive state. Always call it last! 🎉
