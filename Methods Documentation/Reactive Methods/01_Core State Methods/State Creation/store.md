# Understanding `store()` - A Beginner's Guide

## What is `store()`?

`store()` is a function that creates a **centralized reactive state** with organized **getters** (computed values) and **actions** (methods that modify state). It's inspired by state management patterns like Vuex and Redux.

Think of it as a **command center** for your application's data - everything in one place, organized and easy to manage.

---

## Why Does `store()` Exist?

### The Problem with Scattered State

As your app grows, managing state becomes messy:

```javascript
// ❌ State scattered everywhere
let count = 0;
let username = '';
let items = [];

function increment() {
  count++;
  updateCountDisplay();
}

function addItem(item) {
  items.push(item);
  updateItemList();
}

function getTotal() {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Hard to maintain!
// Where's my data?
// What can I do with it?
// What computed values exist?
```

**Problems:**
- Data is scattered across your codebase
- Functions that modify data are everywhere
- Hard to find what you can do with the data
- No clear structure or organization
- Difficult to debug

### The Solution: `store()`

With `store()`, everything is organized in one place:

```javascript
// ✅ Everything organized in a store
const appStore = ReactiveUtils.store(
  // STATE - Your data
  {
    count: 0,
    username: '',
    items: []
  },
  
  // OPTIONS
  {
    // GETTERS - Computed values
    getters: {
      total() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
      }
    },
    
    // ACTIONS - Methods to modify state
    actions: {
      increment(store) {
        store.count++;
      },
      addItem(store, item) {
        store.items.push(item);
      }
    }
  }
);

// Clean and organized!
// All data in one place
// Clear what you can do with it
// Easy to find and debug
```

---

## The Three Parts of a Store

### Part 1: State (Your Data)

This is the actual data your app needs to track:

```javascript
const store = ReactiveUtils.store(
  {
    // Your data goes here
    count: 0,
    name: 'John',
    items: []
  }
);
```

### Part 2: Getters (Computed Values)

These are **calculated values** derived from your state. They automatically update when state changes:

```javascript
const store = ReactiveUtils.store(
  { items: [] },
  {
    getters: {
      // Automatically calculated
      itemCount() {
        return this.items.length;
      }
    }
  }
);
```

### Part 3: Actions (Methods to Change State)

These are **functions** that modify your state. They organize all your state-changing logic in one place:

```javascript
const store = ReactiveUtils.store(
  { count: 0 },
  {
    actions: {
      // Methods that change state
      increment(store) {
        store.count++;
      }
    }
  }
);
```

---

## How `store()` Works

### Creating a Store

```javascript
const myStore = ReactiveUtils.store(
  // 1. Initial state
  {
    count: 0,
    name: 'App'
  },
  
  // 2. Options (optional)
  {
    getters: {
      // Computed properties
    },
    actions: {
      // Methods
    }
  }
);
```

### The Result

You get a **reactive object** that contains:
- Your state (directly accessible)
- Your getters (computed properties)
- Your actions (methods you can call)

```javascript
// Access state
console.log(myStore.count); // 0

// Access getters
console.log(myStore.someGetter); // computed value

// Call actions
myStore.someAction();
```

---

## Basic Example: Counter Store

Let's build a simple counter with all three parts:

```javascript
const counterStore = ReactiveUtils.store(
  // STATE
  {
    count: 0,
    step: 1
  },
  
  // OPTIONS
  {
    // GETTERS
    getters: {
      double() {
        return this.count * 2;
      },
      isPositive() {
        return this.count > 0;
      },
      isEven() {
        return this.count % 2 === 0;
      }
    },
    
    // ACTIONS
    actions: {
      increment(store) {
        store.count += store.step;
      },
      decrement(store) {
        store.count -= store.step;
      },
      reset(store) {
        store.count = 0;
      },
      setStep(store, newStep) {
        store.step = newStep;
      }
    }
  }
);

// USE THE STORE

// Access state
console.log(counterStore.count); // 0

// Access computed getters
console.log(counterStore.double); // 0
console.log(counterStore.isEven); // true

// Call actions
counterStore.increment();
console.log(counterStore.count); // 1
console.log(counterStore.double); // 2 (automatically updated!)

counterStore.setStep(5);
counterStore.increment();
console.log(counterStore.count); // 6

// Automatic reactivity with effects
ReactiveUtils.effect(() => {
  document.getElementById('counter').textContent = counterStore.count;
  document.getElementById('double').textContent = counterStore.double;
});
```

---

## Understanding Getters

### What Are Getters?

Getters are **computed properties** - values that are automatically calculated from your state.

### Why Use Getters?

Instead of calculating values manually every time:

```javascript
// ❌ Without getters - manual calculation
const store = ReactiveUtils.store({
  items: [
    { name: 'Apple', price: 1.50 },
    { name: 'Banana', price: 0.75 }
  ]
});

// Have to calculate manually every time
function getTotal() {
  return store.items.reduce((sum, item) => sum + item.price, 0);
}

console.log(getTotal()); // 2.25
console.log(getTotal()); // Calculate again
console.log(getTotal()); // Calculate again (wasteful!)
```

Use getters for automatic calculation and caching:

```javascript
// ✅ With getters - automatic and cached
const store = ReactiveUtils.store(
  {
    items: [
      { name: 'Apple', price: 1.50 },
      { name: 'Banana', price: 0.75 }
    ]
  },
  {
    getters: {
      total() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
      }
    }
  }
);

console.log(store.total); // 2.25 (calculates)
console.log(store.total); // 2.25 (uses cached value - fast!)
console.log(store.total); // 2.25 (uses cached value - fast!)

// Only recalculates when items change
store.items.push({ name: 'Orange', price: 1.00 });
console.log(store.total); // 3.25 (recalculates automatically!)
```

### How Getters Work

```javascript
const store = ReactiveUtils.store(
  { firstName: 'John', lastName: 'Doe' },
  {
    getters: {
      // 'this' refers to the store
      fullName() {
        return this.firstName + ' ' + this.lastName;
      }
    }
  }
);

console.log(store.fullName); // "John Doe"

store.firstName = 'Jane';
console.log(store.fullName); // "Jane Doe" (automatically updated!)
```

### Multiple Getters Can Use Each Other

```javascript
const cartStore = ReactiveUtils.store(
  {
    items: [
      { name: 'Widget', price: 29.99, quantity: 2 }
    ],
    taxRate: 0.08,
    shippingCost: 10
  },
  {
    getters: {
      subtotal() {
        return this.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
      },
      tax() {
        // Uses another getter!
        return this.subtotal * this.taxRate;
      },
      total() {
        // Uses multiple getters!
        return this.subtotal + this.tax + this.shippingCost;
      }
    }
  }
);

console.log(cartStore.subtotal); // 59.98
console.log(cartStore.tax);      // 4.80
console.log(cartStore.total);    // 74.78
```

---

## Understanding Actions

### What Are Actions?

Actions are **methods** that modify your store's state. They encapsulate all the logic for changing data.

### Why Use Actions?

Instead of modifying state directly from anywhere:

```javascript
// ❌ Without actions - changes scattered everywhere
const store = ReactiveUtils.store({ count: 0 });

// In file1.js
store.count++;

// In file2.js
store.count += 5;

// In file3.js
store.count = 0;

// Hard to track where changes happen!
// No validation or business logic!
```

Use actions to centralize and organize changes:

```javascript
// ✅ With actions - all changes in one place
const store = ReactiveUtils.store(
  { count: 0 },
  {
    actions: {
      increment(store) {
        store.count++;
      },
      add(store, amount) {
        if (amount > 0) { // Can add validation!
          store.count += amount;
        }
      },
      reset(store) {
        store.count = 0;
      }
    }
  }
);

// Everywhere in your app, use actions
store.increment();
store.add(5);
store.reset();

// Easy to track changes!
// All logic is centralized!
```

### How Actions Work

Actions receive the store as the first parameter, then any additional arguments:

```javascript
const store = ReactiveUtils.store(
  { items: [] },
  {
    actions: {
      // action(store, ...arguments)
      addItem(store, item) {
        store.items.push(item);
      },
      removeItem(store, itemId) {
        const index = store.items.findIndex(i => i.id === itemId);
        if (index !== -1) {
          store.items.splice(index, 1);
        }
      },
      updateItem(store, itemId, updates) {
        const item = store.items.find(i => i.id === itemId);
        if (item) {
          Object.assign(item, updates);
        }
      }
    }
  }
);

// Call actions with arguments
store.addItem({ id: 1, name: 'Item 1' });
store.updateItem(1, { name: 'Updated Item' });
store.removeItem(1);
```

### Actions Can Be Async

```javascript
const userStore = ReactiveUtils.store(
  {
    user: null,
    loading: false,
    error: null
  },
  {
    actions: {
      async login(store, credentials) {
        store.loading = true;
        store.error = null;
        
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
          });
          
          const data = await response.json();
          store.user = data.user;
        } catch (error) {
          store.error = error.message;
        } finally {
          store.loading = false;
        }
      },
      
      logout(store) {
        store.user = null;
        store.error = null;
      }
    }
  }
);

// Use async actions
await userStore.login({ email: 'user@example.com', password: 'secret' });
```

---

## Complete Real-World Examples

### Example 1: Todo List Store

```javascript
const todoStore = ReactiveUtils.store(
  // STATE
  {
    todos: [],
    filter: 'all', // 'all', 'active', 'completed'
    nextId: 1
  },
  
  // OPTIONS
  {
    // GETTERS
    getters: {
      // Filtered todos based on current filter
      filteredTodos() {
        if (this.filter === 'active') {
          return this.todos.filter(t => !t.done);
        }
        if (this.filter === 'completed') {
          return this.todos.filter(t => t.done);
        }
        return this.todos;
      },
      
      // Count of active todos
      activeCount() {
        return this.todos.filter(t => !t.done).length;
      },
      
      // Count of completed todos
      completedCount() {
        return this.todos.filter(t => t.done).length;
      },
      
      // Total count
      totalCount() {
        return this.todos.length;
      },
      
      // Check if there are completed todos
      hasCompleted() {
        return this.completedCount > 0;
      },
      
      // Progress percentage
      progress() {
        if (this.totalCount === 0) return 0;
        return Math.round((this.completedCount / this.totalCount) * 100);
      }
    },
    
    // ACTIONS
    actions: {
      // Add a new todo
      addTodo(store, text) {
        if (!text.trim()) return;
        
        store.todos.push({
          id: store.nextId++,
          text: text.trim(),
          done: false,
          createdAt: new Date()
        });
      },
      
      // Remove a todo
      removeTodo(store, id) {
        const index = store.todos.findIndex(t => t.id === id);
        if (index !== -1) {
          store.todos.splice(index, 1);
        }
      },
      
      // Toggle todo completion
      toggleTodo(store, id) {
        const todo = store.todos.find(t => t.id === id);
        if (todo) {
          todo.done = !todo.done;
        }
      },
      
      // Edit todo text
      editTodo(store, id, newText) {
        const todo = store.todos.find(t => t.id === id);
        if (todo && newText.trim()) {
          todo.text = newText.trim();
        }
      },
      
      // Toggle all todos
      toggleAll(store) {
        const allDone = store.todos.every(t => t.done);
        store.todos.forEach(t => {
          t.done = !allDone;
        });
      },
      
      // Clear completed todos
      clearCompleted(store) {
        store.todos = store.todos.filter(t => !t.done);
      },
      
      // Set filter
      setFilter(store, filter) {
        store.filter = filter;
      }
    }
  }
);

// USAGE

// Add some todos
todoStore.addTodo('Learn Reactive library');
todoStore.addTodo('Build an app');
todoStore.addTodo('Deploy to production');

// Check state
console.log(todoStore.totalCount);    // 3
console.log(todoStore.activeCount);   // 3
console.log(todoStore.progress);      // 0

// Complete a todo
todoStore.toggleTodo(todoStore.todos[0].id);

console.log(todoStore.activeCount);   // 2
console.log(todoStore.completedCount); // 1
console.log(todoStore.progress);      // 33

// Filter todos
todoStore.setFilter('active');
console.log(todoStore.filteredTodos.length); // 2

// Auto-update UI
ReactiveUtils.effect(() => {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  
  todoStore.filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.text;
    li.className = todo.done ? 'done' : '';
    list.appendChild(li);
  });
});

ReactiveUtils.effect(() => {
  document.getElementById('count').textContent = 
    `${todoStore.activeCount} items left`;
});
```

### Example 2: Shopping Cart Store

```javascript
const cartStore = ReactiveUtils.store(
  // STATE
  {
    items: [],
    taxRate: 0.08,
    shippingCost: 10,
    freeShippingThreshold: 50
  },
  
  // OPTIONS
  {
    // GETTERS
    getters: {
      // Item count
      itemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      // Subtotal
      subtotal() {
        return this.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
      },
      
      // Tax amount
      tax() {
        return this.subtotal * this.taxRate;
      },
      
      // Shipping cost (free if over threshold)
      shipping() {
        return this.subtotal >= this.freeShippingThreshold 
          ? 0 
          : this.shippingCost;
      },
      
      // Total
      total() {
        return this.subtotal + this.tax + this.shipping;
      },
      
      // Is cart empty
      isEmpty() {
        return this.items.length === 0;
      },
      
      // Savings for free shipping
      savingsNeeded() {
        const needed = this.freeShippingThreshold - this.subtotal;
        return needed > 0 ? needed : 0;
      },
      
      // Qualifies for free shipping
      hasFreeShipping() {
        return this.subtotal >= this.freeShippingThreshold;
      }
    },
    
    // ACTIONS
    actions: {
      // Add item to cart
      addItem(store, product) {
        const existing = store.items.find(item => item.id === product.id);
        
        if (existing) {
          existing.quantity += 1;
        } else {
          store.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
          });
        }
      },
      
      // Remove item from cart
      removeItem(store, productId) {
        const index = store.items.findIndex(item => item.id === productId);
        if (index !== -1) {
          store.items.splice(index, 1);
        }
      },
      
      // Update item quantity
      updateQuantity(store, productId, quantity) {
        if (quantity <= 0) {
          store.removeItem(productId);
          return;
        }
        
        const item = store.items.find(item => item.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      },
      
      // Increment quantity
      incrementQuantity(store, productId) {
        const item = store.items.find(item => item.id === productId);
        if (item) {
          item.quantity++;
        }
      },
      
      // Decrement quantity
      decrementQuantity(store, productId) {
        const item = store.items.find(item => item.id === productId);
        if (item) {
          if (item.quantity > 1) {
            item.quantity--;
          } else {
            store.removeItem(productId);
          }
        }
      },
      
      // Clear cart
      clear(store) {
        store.items = [];
      },
      
      // Apply coupon (example)
      applyCoupon(store, code) {
        // In a real app, validate code with API
        if (code === 'SAVE10') {
          store.taxRate = 0.05; // Reduced tax
        }
      }
    }
  }
);

// USAGE

// Add items
cartStore.addItem({ id: 1, name: 'Widget', price: 29.99 });
cartStore.addItem({ id: 2, name: 'Gadget', price: 49.99 });
cartStore.addItem({ id: 1, name: 'Widget', price: 29.99 }); // Increases quantity

console.log(cartStore.itemCount);  // 3
console.log(cartStore.subtotal);   // 109.97
console.log(cartStore.tax);        // 8.80
console.log(cartStore.shipping);   // 0 (free shipping!)
console.log(cartStore.total);      // 118.77

// Auto-update UI
ReactiveUtils.effect(() => {
  document.getElementById('cart-count').textContent = cartStore.itemCount;
  document.getElementById('subtotal').textContent = '$' + cartStore.subtotal.toFixed(2);
  document.getElementById('tax').textContent = '$' + cartStore.tax.toFixed(2);
  document.getElementById('shipping').textContent = cartStore.hasFreeShipping 
    ? 'FREE' 
    : '$' + cartStore.shipping.toFixed(2);
  document.getElementById('total').textContent = '$' + cartStore.total.toFixed(2);
});

// Show free shipping message
ReactiveUtils.effect(() => {
  const message = document.getElementById('shipping-message');
  
  if (cartStore.hasFreeShipping) {
    message.textContent = 'You got free shipping! 🎉';
    message.className = 'success';
  } else {
    message.textContent = `Add $${cartStore.savingsNeeded.toFixed(2)} more for free shipping`;
    message.className = 'info';
  }
});
```

### Example 3: User Authentication Store

```javascript
const authStore = ReactiveUtils.store(
  // STATE
  {
    user: null,
    token: null,
    loading: false,
    error: null
  },
  
  // OPTIONS
  {
    // GETTERS
    getters: {
      isAuthenticated() {
        return this.user !== null && this.token !== null;
      },
      
      userName() {
        return this.user?.name || 'Guest';
      },
      
      userEmail() {
        return this.user?.email || '';
      },
      
      userRole() {
        return this.user?.role || 'guest';
      },
      
      isAdmin() {
        return this.userRole === 'admin';
      },
      
      isModerator() {
        return this.userRole === 'moderator' || this.isAdmin;
      },
      
      hasError() {
        return this.error !== null;
      }
    },
    
    // ACTIONS
    actions: {
      // Login
      async login(store, credentials) {
        store.loading = true;
        store.error = null;
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          });
          
          if (!response.ok) {
            throw new Error('Login failed');
          }
          
          const data = await response.json();
          store.user = data.user;
          store.token = data.token;
          
          // Save to localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
        } catch (error) {
          store.error = error.message;
          throw error;
        } finally {
          store.loading = false;
        }
      },
      
      // Logout
      logout(store) {
        store.user = null;
        store.token = null;
        store.error = null;
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },
      
      // Register
      async register(store, userData) {
        store.loading = true;
        store.error = null;
        
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
          
          if (!response.ok) {
            throw new Error('Registration failed');
          }
          
          const data = await response.json();
          store.user = data.user;
          store.token = data.token;
          
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
        } catch (error) {
          store.error = error.message;
          throw error;
        } finally {
          store.loading = false;
        }
      },
      
      // Restore session from localStorage
      restoreSession(store) {
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');
        
        if (token && userJson) {
          store.token = token;
          store.user = JSON.parse(userJson);
        }
      },
      
      // Update user profile
      updateProfile(store, updates) {
        if (store.user) {
          Object.assign(store.user, updates);
          localStorage.setItem('user', JSON.stringify(store.user));
        }
      },
      
      // Clear error
      clearError(store) {
        store.error = null;
      }
    }
  }
);

// USAGE

// Restore session on page load
authStore.restoreSession();

// Login
try {
  await authStore.login({
    email: 'user@example.com',
    password: 'secret123'
  });
  
  console.log('Welcome,', authStore.userName);
} catch (error) {
  console.error('Login failed:', error);
}

// Auto-update UI based on auth state
ReactiveUtils.effect(() => {
  const authButtons = document.getElementById('auth-buttons');
  
  if (authStore.isAuthenticated) {
    authButtons.innerHTML = `
      <span>Welcome, ${authStore.userName}!</span>
      <button onclick="authStore.logout()">Logout</button>
    `;
  } else {
    authButtons.innerHTML = `
      <button onclick="showLogin()">Login</button>
      <button onclick="showRegister()">Register</button>
    `;
  }
});

// Show/hide admin panel
ReactiveUtils.effect(() => {
  const adminPanel = document.getElementById('admin-panel');
  adminPanel.style.display = authStore.isAdmin ? 'block' : 'none';
});
```

---

## Common Beginner Questions

### Q: What's the difference between `store()` and `state()`?

**Answer:**

- **`state()`** = Just reactive data
- **`store()`** = Reactive data + organized getters + organized actions

```javascript
// state() - Basic reactive data
const data = ReactiveUtils.state({ count: 0 });
data.count++; // Direct modification

// store() - Organized structure
const store = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      double() { return this.count * 2; }
    },
    actions: {
      increment(store) { store.count++; }
    }
  }
);
store.increment(); // Use actions
console.log(store.double); // Use getters
```

**Use `state()` when:**
- Simple, local component state
- No need for organized structure
- Just need reactive data

**Use `store()` when:**
- Global application state
- Need computed values (getters)
- Want organized state mutations (actions)
- Multiple parts of app need access

### Q: Can I access state directly or must I use actions?

**Answer:** You CAN access state directly, but using actions is **recommended**:

```javascript
const store = ReactiveUtils.store(
  { count: 0 },
  {
    actions: {
      increment(store) { store.count++; }
    }
  }
);

// ✅ Recommended - use actions
store.increment();

// ⚠️ Works but not recommended - direct modification
store.count++;

// Why actions are better:
// - Centralized logic
// - Can add validation
// - Easier to debug
// - Can add logging/analytics
// - Better for maintenance
```

### Q: Do getters automatically update?

**Answer:** Yes! Getters are computed properties that automatically recalculate when dependencies change:

```javascript
const store = ReactiveUtils.store(
  { items: [{ price: 10 }, { price: 20 }] },
  {
    getters: {
      total() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
      }
    }
  }
);

console.log(store.total); // 30

store.items.push({ price: 15 });
console.log(store.total); // 45 (automatically updated!)
```

### Q: Can actions call other actions?

**Answer:** Yes! Actions can call each other:

```javascript
const store = ReactiveUtils.store(
  { count: 0, history: [] },
  {
    actions: {
      increment(store) {
        store.count++;
        store.logAction('increment'); // Call another action
      },
      
      decrement(store) {
        store.count--;
        store.logAction('decrement'); // Call another action
      },
      
      logAction(store, actionName) {
        store.history.push({
          action: actionName,
          timestamp: new Date()
        });
      }
    }
  }
);
```

### Q: Can I have multiple stores?

**Answer:** Absolutely! Create as many stores as needed:

```javascript
// Separate stores for different concerns
const userStore = ReactiveUtils.store({ user: null }, { /*...*/ });
const cartStore = ReactiveUtils.store({ items: [] }, { /*...*/ });
const uiStore = ReactiveUtils.store({ theme: 'light' }, { /*...*/ });

// Stores can interact with each other
const orderStore = ReactiveUtils.store(
  { orders: [] },
  {
    actions: {
      createOrder(store) {
        const order = {
          user: userStore.user,
          items: cartStore.items,
          // ...
        };
        store.orders.push(order);
      }
    }
  }
);
```

### Q: How do I use a store across multiple files?

**Answer:** Create the store in one file and export it:

```javascript
// store.js
export const appStore = ReactiveUtils.store(
  { count: 0 },
  {
    getters: { /*...*/ },
    actions: { /*...*/ }
  }
);

// component1.js
import { appStore } from './store.js';
appStore.increment();

// component2.js
import { appStore } from './store.js';
console.log(appStore.count);
```

---

## Tips for Beginners

### 1. Start with Simple Stores

Don't create huge stores initially:

```javascript
// ✅ Start simple
const counter = ReactiveUtils.store(
  { count: 0 },
  {
    actions: {
      increment(store) { store.count++; }
    }
  }
);

// ❌ Don't do this at first
const complexStore = ReactiveUtils.store(
  { /* 50 properties */ },
  {
    getters: { /* 30 getters */ },
    actions: { /* 40 actions */ }
  }
);
```

### 2. Use Descriptive Names for Actions

```javascript
// ❌ Unclear
actions: {
  do(store, x) { /*...*/ },
  thing(store) { /*...*/ }

// ✅ Clear
actions: {
  addToCart(store, product) { /*...*/ },
  removeFromCart(store, productId) { /*...*/ }
}
```

### 3. Group Related State in One Store

```javascript
// ✅ Good - related data together
const cartStore = ReactiveUtils.store({
  items: [],
  total: 0,
  tax: 0
});

// ❌ Bad - scattered
const itemsStore = ReactiveUtils.store({ items: [] });
const totalStore = ReactiveUtils.store({ total: 0 });
const taxStore = ReactiveUtils.store({ tax: 0 });
```

### 4. Use Getters for Derived Values

```javascript
// ❌ Don't calculate manually everywhere
function getTotal() {
  return store.items.reduce(/*...*/);
}

// ✅ Use a getter
getters: {
  total() {
    return this.items.reduce(/*...*/);
  }
}
```

### 5. Keep Actions Simple

```javascript
// ✅ Simple, focused actions
actions: {
  addItem(store, item) {
    store.items.push(item);
  },
  removeItem(store, id) {
    const index = store.items.findIndex(i => i.id === id);
    if (index !== -1) {
      store.items.splice(index, 1);
    }
  }
}

// ❌ Don't make overly complex actions
actions: {
  doEverything(store, data) {
    // 100 lines of code doing many things
  }
}
```

---

## Summary

### What `store()` Does:

1. ✅ Creates centralized reactive state
2. ✅ Organizes computed values (getters)
3. ✅ Organizes state mutations (actions)
4. ✅ Provides clear structure for your data
5. ✅ Makes debugging easier
6. ✅ Perfect for application-wide state

### The Basic Pattern:

```javascript
const myStore = ReactiveUtils.store(
  // STATE - Your data
  {
    property1: value1,
    property2: value2
  },
  
  // OPTIONS
  {
    // GETTERS - Computed values
    getters: {
      computedValue() {
        return /* calculation based on state */;
      }
    },
    
    // ACTIONS - Methods to change state
    actions: {
      actionName(store, ...args) {
        // Modify store here
      }
    }
  }
);

// Access state
myStore.property1

// Access getters
myStore.computedValue

// Call actions
myStore.actionName(args)
```

### When to Use `store()`:

- ✅ Global application state (user, cart, settings)
- ✅ State shared across multiple components
- ✅ Complex state with many computed values
- ✅ State that needs organized mutations
- ✅ When you want clear separation of concerns

---

**Remember:** `store()` is like having a **well-organized filing cabinet** for your application's data. Everything has its place (state), you can easily calculate derived information (getters), and you have clear procedures for making changes (actions). It keeps your code organized and maintainable! 🎉