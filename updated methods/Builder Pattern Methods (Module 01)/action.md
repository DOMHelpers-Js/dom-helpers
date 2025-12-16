# Understanding `action()` (Builder) - A Beginner's Guide

## What is `action()`?

`action()` is a builder method that adds a single action method to your state. Actions are functions that can modify state.

Think of it as **action builder** - add methods while building your state.

---

## Why Does This Exist?

### The Problem: Adding Methods After Creation

Without builder, you add methods separately:

```javascript
// ❌ Without builder - separate steps
const state = ReactiveUtils.state({ count: 0 });

state.increment = function() {
  this.count++;
};

// ✅ With builder - all in one
const state = ReactiveUtils.builder() 
  .state({ count: 0 })
  .action('increment', function() {
    this.count++;
  })
  .build();
```

**Why this matters:**
- Define actions upfront
- Clean builder pattern
- Encapsulate logic
- Better organization

---

## How Does It Work?

### The Builder Chain

```javascript
ReactiveUtils.builder() 
  .state({ count: 0 })
  .action('increment', function() {
    this.count++;
  })
  .build();
```

---

## Basic Usage

### Single Action

```javascript
const counter = ReactiveUtils.builder() 
  .state({ count: 0 })
  .action('increment', function() {
    this.count++;
  })
  .build();

counter.increment(); // count becomes 1
```

### Multiple Actions

```javascript
const counter = ReactiveUtils.builder() 
  .state({ count: 0 })
  .action('increment', function() {
    this.count++;
  })
  .action('decrement', function() {
    this.count--;
  })
  .action('reset', function() {
    this.count = 0;
  })
  .build();

counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
counter.reset();     // 0
```

### Action with Parameters

```javascript
const counter = ReactiveUtils.builder() 
  .state({ count: 0 })
  .action('add', function(amount) {
    this.count += amount;
  })
  .build();

counter.add(5);  // count becomes 5
counter.add(10); // count becomes 15
```

---

## Simple Examples Explained

### Example 1: Todo List

```javascript
const todos = ReactiveUtils.builder() 
  .state({
    items: [],
    nextId: 1
  })
  .action('addTodo', function(text) {
    this.items.push({
      id: this.nextId++,
      text: text,
      completed: false
    });
  })
  .action('toggleTodo', function(id) {
    const todo = this.items.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
  })
  .action('removeTodo', function(id) {
    const index = this.items.findIndex(t => t.id === id);
    if (index !== -1) this.items.splice(index, 1);
  })
  .computed('activeCount', (s) => s.items.filter(t => !t.completed).length)
  .build();

todos.addTodo('Buy milk');
todos.addTodo('Walk dog');
todos.toggleTodo(1);
console.log(todos.activeCount); // 1
```

---

### Example 2: Shopping Cart

```javascript
const cart = ReactiveUtils.builder() 
  .state({ items: [] })
  .action('addItem', function(product, quantity = 1) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
  })
  .action('removeItem', function(productId) {
    const index = this.items.findIndex(i => i.id === productId);
    if (index !== -1) this.items.splice(index, 1);
  })
  .action('updateQuantity', function(productId, quantity) {
    const item = this.items.find(i => i.id === productId);
    if (item) item.quantity = quantity;
  })
  .action('clear', function() {
    this.items = [];
  })
  .computed('total', (s) =>
    s.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  .build();

cart.addItem({ id: 1, name: 'Apple', price: 1.5 }, 3);
cart.addItem({ id: 2, name: 'Bread', price: 2.5 }, 1);
console.log(cart.total); // 7.0
```

---

### Example 3: User Authentication

```javascript
const auth = ReactiveUtils.builder() 
  .state({
    user: null,
    loading: false,
    error: null
  })
  .action('login', async function(email, password) {
    this.loading = true;
    this.error = null;
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        this.user = await response.json();
      } else {
        this.error = 'Invalid credentials';
      }
    } catch (err) {
      this.error = 'Network error';
    } finally {
      this.loading = false;
    }
  })
  .action('logout', function() {
    this.user = null;
    this.error = null;
  })
  .computed('isAuthenticated', (s) => s.user !== null)
  .build();

// Usage
await auth.login('user@example.com', 'password123');
console.log(auth.isAuthenticated); // true
```

---

## Real-World Example: Form Manager

```javascript
const formManager = ReactiveUtils.builder() 
  .state({
    fields: {
      username: '',
      email: '',
      password: ''
    },
    errors: {},
    touched: {},
    submitting: false
  })
  .action('setField', function(name, value) {
    this.fields[name] = value;
    this.validateField(name);
  })
  .action('setTouched', function(name) {
    this.touched[name] = true;
  })
  .action('validateField', function(name) {
    const value = this.fields[name];

    if (name === 'username' && value.length < 3) {
      this.errors[name] = 'Username must be at least 3 characters';
    } else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.errors[name] = 'Invalid email format';
    } else if (name === 'password' && value.length < 8) {
      this.errors[name] = 'Password must be at least 8 characters';
    } else {
      delete this.errors[name];
    }
  })
  .action('validateAll', function() {
    Object.keys(this.fields).forEach(name => {
      this.validateField(name);
      this.touched[name] = true;
    });
  })
  .action('submit', async function() {
    this.validateAll();

    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    this.submitting = true;
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.fields)
      });
      return response.ok;
    } catch (err) {
      console.error('Submit error:', err);
      return false;
    } finally {
      this.submitting = false;
    }
  })
  .action('reset', function() {
    this.fields = { username: '', email: '', password: '' };
    this.errors = {};
    this.touched = {};
  })
  .computed('isValid', (s) => Object.keys(s.errors).length === 0)
  .computed('isDirty', (s) => Object.keys(s.touched).length > 0)
  .build();

// Usage
formManager.setField('username', 'john');
formManager.setTouched('username');
formManager.setField('email', 'john@example.com');
formManager.setField('password', 'secure123');

const success = await formManager.submit();
if (success) {
  formManager.reset();
}
```

---

## Common Patterns

### Pattern 1: Simple Action

```javascript
.action('increment', function() {
  this.count++;
})
```

### Pattern 2: Action with Parameters

```javascript
.action('add', function(amount) {
  this.count += amount;
})
```

### Pattern 3: Async Action

```javascript
.action('load', async function() {
  this.data = await fetchData();
})
```

### Pattern 4: Multiple Actions

```javascript
.action('increment', function() { this.count++; })
.action('decrement', function() { this.count--; })
.action('reset', function() { this.count = 0; })
```

---

## Common Questions

### Q: Should I use arrow functions?

**Answer:** No! Use regular functions to access `this`:

```javascript
// ✅ Regular function
.action('increment', function() {
  this.count++;
})

// ❌ Arrow function - 'this' won't work
.action('increment', () => {
  this.count++; // 'this' is wrong!
})
```

### Q: Can actions call other actions?

**Answer:** Yes!

```javascript
.action('increment', function() {
  this.count++;
})
.action('incrementTwice', function() {
  this.increment();
  this.increment();
})
```

### Q: Can actions be async?

**Answer:** Yes!

```javascript
.action('load', async function() {
  this.loading = true;
  this.data = await fetchData();
  this.loading = false;
})
```

---

## Tips for Success

### 1. Use Regular Functions

```javascript
// ✅ Regular function for 'this'
.action('method', function() {
  this.value = 10;
})
```

### 2. Name Actions as Verbs

```javascript
// ✅ Clear action names
.action('increment', ...)
.action('addItem', ...)
.action('removeUser', ...)
```

### 3. Keep Actions Focused

```javascript
// ✅ Single responsibility
.action('addTodo', function(text) {
  this.items.push({ text, done: false });
})

// ❌ Too much in one action
.action('addTodo', function(text) {
  this.items.push({ text, done: false });
  this.saveToServer();
  this.updateUI();
  this.sendAnalytics();
})
```

### 4. Use for State Mutations

```javascript
// ✅ Actions modify state
.action('update', function(value) {
  this.data = value;
})
```

---

## Summary

### What `action()` Does:

1. ✅ Adds single action method
2. ✅ Takes name and function
3. ✅ Function can access state via `this`
4. ✅ Returns builder for chaining
5. ✅ Can be sync or async

### When to Use It:

- Adding single method
- State mutations
- Business logic
- Event handlers
- API calls

### The Basic Pattern:

```javascript
const state = ReactiveUtils.builder() 
  .state({ count: 0 })
  .action('increment', function() {
    this.count++;
  })
  .build();

state.increment(); // count becomes 1
```

---

**Remember:** `action()` adds a single method. Use regular functions (not arrow functions) to access `this`! 🎉
