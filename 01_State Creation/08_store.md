# Understanding `store()` - A Beginner's Guide

## What is `store()`?

`store()` is a **structured state management function** in the Reactive library that creates a reactive state with **organized getters (computed properties)** and **actions (methods)**. It's designed for managing application-level state with a clear separation between state, computed values, and actions.

Think of it as **creating a mini-store** for your application - a centralized place to manage state with defined ways to read derived values and modify state.

---

## Syntax

```js
// Using the shortcut
store(initialState, options)

// Using the full namespace
ReactiveUtils.store(initialState, options)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`store()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.store()`) - Explicit and clear

**Parameters:**
- `initialState` (Object): The initial state properties
- `options` (Object): Configuration object with optional properties:
  - `getters` (Object): Computed properties (functions that return derived values)
  - `actions` (Object): Methods to modify state (functions that receive state as first parameter)

**Returns:**
- A reactive state object with:
  - All initial state properties (reactive)
  - All getters added as computed properties
  - All actions added as methods

---

## Why Does This Exist?

### The Problem with Unstructured State

When managing complex application state, you often end up with scattered logic:

```javascript
// Scattered state management - hard to maintain
const appState = state({
  count: 0,
  items: [],
  filter: 'all'
});

// Computed values defined separately
appState.$computed('filteredItems', function() {
  return this.filter === 'all'
    ? this.items
    : this.items.filter(i => i.type === this.filter);
});

// Actions defined separately
function incrementCount() {
  appState.count++;
}

function addItem(item) {
  appState.items.push(item);
}

function setFilter(filter) {
  appState.filter = filter;
}
```

**What's the Real Issue?**

**Problems:**
- State, computed values, and actions are scattered across your code
- No clear structure or organization
- Hard to see what belongs together
- Difficult to maintain and reason about
- No standard pattern for state management

**Why This Becomes a Problem:**

As your application grows:
❌ State logic is spread across multiple files
❌ Hard to understand what actions are available
❌ Difficult to track which computed properties exist
❌ No clear ownership or responsibility
❌ Inconsistent patterns across different parts of the app

In other words, **you have reactive state, but no structure**.
Everything works, but it's disorganized.

---

### The Solution with `store()`

When you use `store()`, you get **organized, structured state management**:

```javascript
// Organized state management - clear and maintainable
const appStore = store(
  // Initial state
  {
    count: 0,
    items: [],
    filter: 'all'
  },
  // Options
  {
    // Getters (computed properties)
    getters: {
      filteredItems() {
        return this.filter === 'all'
          ? this.items
          : this.items.filter(i => i.type === this.filter);
      },
      itemCount() {
        return this.items.length;
      }
    },

    // Actions (methods)
    actions: {
      increment(state) {
        state.count++;
      },
      addItem(state, item) {
        state.items.push(item);
      },
      setFilter(state, filter) {
        state.filter = filter;
      }
    }
  }
);

// Use the store
console.log(appStore.filteredItems); // Access computed property
appStore.increment();                 // Call action
appStore.addItem({ type: 'todo' });  // Call action with parameter
```

**What Just Happened?**

With `store()`:
- All state, getters, and actions are defined in one place
- Clear structure and organization
- Easy to see what's available
- Consistent pattern for state management

**Benefits:**
- Organized and maintainable
- Clear separation of concerns
- Easy to understand and modify
- Consistent API across your app
- All reactive features of `state()`

---

## How Does It Work?

### Under the Hood

`store()` creates a reactive state and adds getters (as computed properties) and actions (as methods):

```
store(state, { getters, actions })
        ↓
1. Creates reactive state
2. Adds getters as $computed properties
3. Adds actions as methods on state
        ↓
Returns enhanced reactive state
```

**What happens:**

1. `store()` creates a reactive state from `initialState`
2. Each getter in `options.getters` becomes a computed property
3. Each action in `options.actions` becomes a method on the state
4. Actions receive the state as their first parameter
5. Returns the enhanced reactive state

---

## Basic Usage

### Creating a Store

The simplest way to use `store()` is to define state, getters, and actions:

```js
// Using the shortcut style
const counter = store(
  { count: 0 },
  {
    getters: {
      double() {
        return this.count * 2;
      }
    },
    actions: {
      increment(state) {
        state.count++;
      }
    }
  }
);

// Or using the namespace style
const counter = ReactiveUtils.store(
  { count: 0 },
  {
    getters: {
      double() {
        return this.count * 2;
      }
    },
    actions: {
      increment(state) {
        state.count++;
      }
    }
  }
);
```

### Accessing State

Access state properties directly:

```js
const userStore = store(
  {
    name: 'John',
    age: 25,
    email: 'john@example.com'
  }
);

console.log(userStore.name);  // "John"
console.log(userStore.age);   // 25
console.log(userStore.email); // "john@example.com"
```

### Using Getters

Access getters like normal properties (they're computed):

```js
const cart = store(
  {
    items: [
      { price: 10, quantity: 2 },
      { price: 20, quantity: 1 }
    ]
  },
  {
    getters: {
      total() {
        return this.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
      }
    }
  }
);

console.log(cart.total); // 40 (automatically calculated)

// When state changes, getters update automatically
cart.items[0].quantity = 5;
console.log(cart.total); // 120 (automatically recalculated)
```

### Calling Actions

Call actions like methods:

```js
const todoStore = store(
  { todos: [] },
  {
    actions: {
      addTodo(state, text) {
        state.todos.push({
          id: Date.now(),
          text: text,
          completed: false
        });
      },
      toggleTodo(state, id) {
        const todo = state.todos.find(t => t.id === id);
        if (todo) {
          todo.completed = !todo.completed;
        }
      }
    }
  }
);

// Call actions
todoStore.addTodo('Learn reactive stores');
todoStore.toggleTodo(todoStore.todos[0].id);
```

---

## Common Use Cases

### Use Case 1: Counter Store

Simple counter with increment/decrement actions:

```js
const counterStore = store(
  { count: 0 },
  {
    getters: {
      double() {
        return this.count * 2;
      },
      isPositive() {
        return this.count > 0;
      }
    },
    actions: {
      increment(state) {
        state.count++;
      },
      decrement(state) {
        state.count--;
      },
      reset(state) {
        state.count = 0;
      },
      setCount(state, value) {
        state.count = value;
      }
    }
  }
);

// Use the store
effect(() => {
  document.getElementById('count').textContent = counterStore.count;
  document.getElementById('double').textContent = counterStore.double;
});

counterStore.increment();
counterStore.increment();
console.log(counterStore.count);  // 2
console.log(counterStore.double); // 4
```

### Use Case 2: Todo Store

Manage todos with filtering and statistics:

```js
const todoStore = store(
  {
    todos: [],
    filter: 'all' // 'all', 'active', 'completed'
  },
  {
    getters: {
      filteredTodos() {
        if (this.filter === 'active') {
          return this.todos.filter(t => !t.completed);
        }
        if (this.filter === 'completed') {
          return this.todos.filter(t => t.completed);
        }
        return this.todos;
      },
      activeCount() {
        return this.todos.filter(t => !t.completed).length;
      },
      completedCount() {
        return this.todos.filter(t => t.completed).length;
      },
      allCompleted() {
        return this.todos.length > 0 && this.activeCount === 0;
      }
    },
    actions: {
      addTodo(state, text) {
        state.todos.push({
          id: Date.now(),
          text: text,
          completed: false
        });
      },
      removeTodo(state, id) {
        const index = state.todos.findIndex(t => t.id === id);
        if (index !== -1) {
          state.todos.splice(index, 1);
        }
      },
      toggleTodo(state, id) {
        const todo = state.todos.find(t => t.id === id);
        if (todo) {
          todo.completed = !todo.completed;
        }
      },
      setFilter(state, filter) {
        state.filter = filter;
      },
      clearCompleted(state) {
        state.todos = state.todos.filter(t => !t.completed);
      }
    }
  }
);
```

### Use Case 3: Shopping Cart Store

Manage shopping cart with totals and discounts:

```js
const cartStore = store(
  {
    items: [],
    discountCode: null,
    discountPercent: 0
  },
  {
    getters: {
      subtotal() {
        return this.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
      },
      discount() {
        return this.subtotal * (this.discountPercent / 100);
      },
      total() {
        return this.subtotal - this.discount;
      },
      itemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    },
    actions: {
      addItem(state, product) {
        const existing = state.items.find(i => i.id === product.id);
        if (existing) {
          existing.quantity++;
        } else {
          state.items.push({ ...product, quantity: 1 });
        }
      },
      removeItem(state, productId) {
        const index = state.items.findIndex(i => i.id === productId);
        if (index !== -1) {
          state.items.splice(index, 1);
        }
      },
      updateQuantity(state, productId, quantity) {
        const item = state.items.find(i => i.id === productId);
        if (item) {
          item.quantity = quantity;
          if (item.quantity <= 0) {
            this.removeItem(state, productId);
          }
        }
      },
      applyDiscount(state, code) {
        // Simulate discount code validation
        const discounts = {
          'SAVE10': 10,
          'SAVE20': 20,
          'SAVE30': 30
        };
        if (discounts[code]) {
          state.discountCode = code;
          state.discountPercent = discounts[code];
        }
      },
      clearCart(state) {
        state.items = [];
        state.discountCode = null;
        state.discountPercent = 0;
      }
    }
  }
);
```

### Use Case 4: User Authentication Store

Manage user authentication state:

```js
const authStore = store(
  {
    user: null,
    token: null,
    isLoading: false,
    error: null
  },
  {
    getters: {
      isAuthenticated() {
        return !!this.user && !!this.token;
      },
      userName() {
        return this.user ? this.user.name : 'Guest';
      },
      userRole() {
        return this.user ? this.user.role : 'guest';
      }
    },
    actions: {
      async login(state, credentials) {
        state.isLoading = true;
        state.error = null;
        try {
          // Simulate API call
          const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
          });
          const data = await response.json();

          state.user = data.user;
          state.token = data.token;
        } catch (error) {
          state.error = error.message;
        } finally {
          state.isLoading = false;
        }
      },
      logout(state) {
        state.user = null;
        state.token = null;
        state.error = null;
      },
      updateUser(state, updates) {
        if (state.user) {
          Object.assign(state.user, updates);
        }
      }
    }
  }
);
```

### Use Case 5: Theme Store

Manage application theme and settings:

```js
const themeStore = store(
  {
    theme: 'light',
    fontSize: 14,
    sidebarOpen: true,
    language: 'en'
  },
  {
    getters: {
      isDark() {
        return this.theme === 'dark';
      },
      fontSizeClass() {
        if (this.fontSize <= 12) return 'text-sm';
        if (this.fontSize <= 16) return 'text-md';
        return 'text-lg';
      }
    },
    actions: {
      toggleTheme(state) {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
      },
      setTheme(state, theme) {
        state.theme = theme;
      },
      increaseFontSize(state) {
        state.fontSize = Math.min(state.fontSize + 2, 24);
      },
      decreaseFontSize(state) {
        state.fontSize = Math.max(state.fontSize - 2, 10);
      },
      toggleSidebar(state) {
        state.sidebarOpen = !state.sidebarOpen;
      },
      setLanguage(state, lang) {
        state.language = lang;
      },
      resetSettings(state) {
        state.theme = 'light';
        state.fontSize = 14;
        state.sidebarOpen = true;
        state.language = 'en';
      }
    }
  }
);

// Apply theme changes
effect(() => {
  document.body.setAttribute('data-theme', themeStore.theme);
  document.body.style.fontSize = themeStore.fontSize + 'px';
});
```

---

## Advanced Patterns

### Pattern 1: Nested Stores

Create multiple stores for different concerns:

```js
// User store
const userStore = store(
  { currentUser: null, preferences: {} },
  {
    getters: {
      isLoggedIn() {
        return !!this.currentUser;
      }
    },
    actions: {
      setUser(state, user) {
        state.currentUser = user;
      }
    }
  }
);

// Products store
const productsStore = store(
  { products: [], loading: false },
  {
    getters: {
      availableProducts() {
        return this.products.filter(p => p.inStock);
      }
    },
    actions: {
      async fetchProducts(state) {
        state.loading = true;
        const data = await fetch('/api/products').then(r => r.json());
        state.products = data;
        state.loading = false;
      }
    }
  }
);

// Use stores together
effect(() => {
  if (userStore.isLoggedIn && !productsStore.loading) {
    console.log('Ready to shop!');
  }
});
```

### Pattern 2: Store with Persistence

Automatically save and load from localStorage:

```js
const persistentStore = store(
  {
    settings: {
      theme: 'light',
      notifications: true
    }
  },
  {
    actions: {
      updateSettings(state, updates) {
        Object.assign(state.settings, updates);
        this.save(state);
      },
      save(state) {
        localStorage.setItem('settings', JSON.stringify(state.settings));
      },
      load(state) {
        const saved = localStorage.getItem('settings');
        if (saved) {
          state.settings = JSON.parse(saved);
        }
      }
    }
  }
);

// Load on init
persistentStore.load();

// Auto-save on changes
effect(() => {
  localStorage.setItem('settings', JSON.stringify(persistentStore.settings));
});
```

### Pattern 3: Store with Validation

Add validation to actions:

```js
const validatedStore = store(
  {
    email: '',
    age: 0,
    errors: {}
  },
  {
    getters: {
      isValid() {
        return Object.keys(this.errors).length === 0;
      }
    },
    actions: {
      setEmail(state, email) {
        state.email = email;
        if (!email.includes('@')) {
          state.errors.email = 'Invalid email';
        } else {
          delete state.errors.email;
        }
      },
      setAge(state, age) {
        state.age = age;
        if (age < 18) {
          state.errors.age = 'Must be 18 or older';
        } else {
          delete state.errors.age;
        }
      }
    }
  }
);
```

---

## Performance Tips

### Tip 1: Use Getters for Computed Values

Always use getters for derived values instead of calculating in effects:

**Less efficient:**
```js
const store = store({ items: [] });

effect(() => {
  // Recalculated every time effect runs
  const total = store.items.reduce((sum, i) => sum + i.price, 0);
  document.getElementById('total').textContent = total;
});
```

**More efficient:**
```js
const store = store(
  { items: [] },
  {
    getters: {
      total() {
        return this.items.reduce((sum, i) => sum + i.price, 0);
      }
    }
  }
);

effect(() => {
  // Uses cached computed value
  document.getElementById('total').textContent = store.total;
});
```

### Tip 2: Keep Actions Focused

Each action should do one thing:

**Less maintainable:**
```js
actions: {
  updateEverything(state, data) {
    state.user = data.user;
    state.settings = data.settings;
    state.preferences = data.preferences;
    // Too much in one action
  }
}
```

**More maintainable:**
```js
actions: {
  setUser(state, user) {
    state.user = user;
  },
  setSettings(state, settings) {
    state.settings = settings;
  },
  setPreferences(state, preferences) {
    state.preferences = preferences;
  }
}
```

### Tip 3: Batch Related Updates

Use `$batch()` when actions need to update multiple properties:

```js
actions: {
  loadUserData(state, data) {
    state.$batch(() => {
      state.user = data.user;
      state.preferences = data.preferences;
      state.settings = data.settings;
    });
  }
}
```

---

## Common Pitfalls

### Pitfall 1: Modifying State Outside Actions

**Problem:** Changing state directly instead of using actions:

```js
const store = store(
  { count: 0 },
  {
    actions: {
      increment(state) {
        state.count++;
      }
    }
  }
);

// BAD - modifying state directly
store.count = 10; // Works, but bypasses action pattern

// GOOD - using actions
store.increment();
```

**Best Practice:** Always use actions to modify state for consistency.

### Pitfall 2: Actions Not Receiving State

**Problem:** Forgetting that actions receive state as first parameter:

```js
// WRONG
actions: {
  increment() {
    this.count++; // 'this' is not the state!
  }
}

// RIGHT
actions: {
  increment(state) {
    state.count++; // state parameter is the reactive state
  }
}
```

### Pitfall 3: Async Actions Without Error Handling

**Problem:** Async actions without proper error handling:

```js
// RISKY
actions: {
  async fetchData(state) {
    const data = await fetch('/api/data').then(r => r.json());
    state.data = data;
  }
}

// BETTER
actions: {
  async fetchData(state) {
    state.loading = true;
    state.error = null;
    try {
      const data = await fetch('/api/data').then(r => r.json());
      state.data = data;
    } catch (error) {
      state.error = error.message;
    } finally {
      state.loading = false;
    }
  }
}
```

### Pitfall 4: Modifying State in Getters

**Problem:** Getters should only read, never modify:

```js
// BAD
getters: {
  incrementedCount() {
    this.count++; // DON'T modify state in getters!
    return this.count;
  }
}

// GOOD
getters: {
  incrementedCount() {
    return this.count + 1; // Just return computed value
  }
}
```

---

## Real-World Example

Here's a complete example of a store in a real application:

```js
// Application store
const appStore = store(
  // State
  {
    user: null,
    todos: [],
    filter: 'all',
    isLoading: false,
    error: null
  },

  // Options
  {
    // Computed properties
    getters: {
      isAuthenticated() {
        return !!this.user;
      },
      filteredTodos() {
        if (this.filter === 'active') {
          return this.todos.filter(t => !t.completed);
        }
        if (this.filter === 'completed') {
          return this.todos.filter(t => t.completed);
        }
        return this.todos;
      },
      activeCount() {
        return this.todos.filter(t => !t.completed).length;
      },
      completedCount() {
        return this.todos.filter(t => t.completed).length;
      }
    },

    // Methods
    actions: {
      // Auth actions
      async login(state, credentials) {
        state.isLoading = true;
        state.error = null;
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
          });
          const data = await response.json();
          state.user = data.user;
          await this.fetchTodos(state);
        } catch (error) {
          state.error = error.message;
        } finally {
          state.isLoading = false;
        }
      },

      logout(state) {
        state.user = null;
        state.todos = [];
      },

      // Todo actions
      async fetchTodos(state) {
        state.isLoading = true;
        try {
          const response = await fetch('/api/todos');
          state.todos = await response.json();
        } catch (error) {
          state.error = error.message;
        } finally {
          state.isLoading = false;
        }
      },

      addTodo(state, text) {
        state.todos.push({
          id: Date.now(),
          text: text,
          completed: false,
          createdAt: new Date()
        });
      },

      toggleTodo(state, id) {
        const todo = state.todos.find(t => t.id === id);
        if (todo) {
          todo.completed = !todo.completed;
        }
      },

      removeTodo(state, id) {
        const index = state.todos.findIndex(t => t.id === id);
        if (index !== -1) {
          state.todos.splice(index, 1);
        }
      },

      setFilter(state, filter) {
        state.filter = filter;
      },

      clearCompleted(state) {
        state.todos = state.todos.filter(t => !t.completed);
      }
    }
  }
);

// Use the store with effects
effect(() => {
  const authPanel = document.getElementById('auth-panel');
  authPanel.style.display = appStore.isAuthenticated ? 'none' : 'block';
});

effect(() => {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  appStore.filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''}
             onchange="appStore.toggleTodo(${todo.id})">
      <span>${todo.text}</span>
      <button onclick="appStore.removeTodo(${todo.id})">Delete</button>
    `;
    todoList.appendChild(li);
  });
});

effect(() => {
  document.getElementById('active-count').textContent =
    `${appStore.activeCount} items left`;
});
```

---

## Summary

**`store()` provides structured state management with clear organization.**

Key takeaways:
- ✅ Creates **reactive state** with **getters** and **actions**
- ✅ Both **shortcut** (`store()`) and **namespace** (`ReactiveUtils.store()`) styles are valid
- ✅ **Getters** become computed properties (cached, reactive)
- ✅ **Actions** receive state as first parameter
- ✅ Perfect for **application-level state** management
- ✅ Clear **separation of concerns** (state, getters, actions)
- ✅ Organized and **maintainable** code structure
- ⚠️ Use actions to modify state (not direct modification)
- ⚠️ Getters should only read, never write
- ⚠️ Actions receive state as first parameter

**Remember:** `store()` is ideal when you need organized state management. It combines the reactivity of `state()` with a clear structure for computed values (getters) and state modifications (actions). Perfect for application stores! 🎉

➡️ Next, explore [`component()`](component.md) for component-based state or [`reactive()`](reactive.md) for builder-pattern state management!
