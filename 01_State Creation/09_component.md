# Understanding `component()` - A Beginner's Guide

## What is `component()`?

`component()` is a **component creation function** in the Reactive library that provides a **declarative, configuration-based approach** to building reactive components. It allows you to define all aspects of a component - state, computed properties, watchers, effects, bindings, actions, and lifecycle hooks - in one clean configuration object.

Think of it as **a complete component factory** - you provide a configuration blueprint, and it builds a fully-functional reactive component with lifecycle management.

---

## Syntax

```js
// Using the shortcut
component({
  state: { ... },
  computed: { ... },
  watch: { ... },
  effects: { ... },
  bindings: { ... },
  actions: { ... },
  mounted() { ... },
  unmounted() { ... }
})

// Using the full namespace
ReactiveUtils.component({
  state: { ... },
  computed: { ... },
  watch: { ... },
  effects: { ... },
  bindings: { ... },
  actions: { ... },
  mounted() { ... },
  unmounted() { ... }
})
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`component()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.component()`) - Explicit and clear

**Configuration Object:**
- `state` (Object, optional): Initial state properties
- `computed` (Object, optional): Computed property definitions
- `watch` (Object, optional): Watcher definitions
- `effects` (Object, optional): Effect functions
- `bindings` (Object, optional): DOM binding definitions
- `actions` (Object, optional): Action method definitions
- `mounted` (Function, optional): Called after component is created
- `unmounted` (Function, optional): Called when component is destroyed

**Returns:**
- A reactive state object with all configured features and a `$destroy()` method

---

## Why Does This Exist?

### The Problem with Manual Component Setup

When creating a component manually, you need to set up many things separately:

```javascript
// Step 1: Create state
const counter = state({
  count: 0,
  step: 1
});

// Step 2: Add computed
counter.$computed('doubled', function() {
  return this.count * 2;
});

// Step 3: Add watchers
counter.$watch('count', (val) => {
  console.log('Count:', val);
});

// Step 4: Add effects
effect(() => {
  document.getElementById('count').textContent = counter.count;
});

// Step 5: Add methods
counter.increment = function() {
  this.count += this.step;
};

counter.decrement = function() {
  this.count -= this.step;
};

// Step 6: Initialize
console.log('Counter initialized');

// Step 7: Remember to clean up
counter.$destroy = function() {
  // Manual cleanup needed
};

// Scattered, verbose, and error-prone
```

**What's the Real Issue?**

**Problems:**
- Component setup is scattered across multiple statements
- No standard structure or pattern
- Easy to forget lifecycle management
- No clear initialization or cleanup points
- Hard to see the complete component at a glance
- Manual cleanup management is error-prone

**Why This Becomes a Problem:**

For reusable components:
❌ No consistent component structure
❌ Lifecycle management is manual
❌ Easy to forget cleanup
❌ Hard to understand component boundaries
❌ Difficult to reuse patterns

In other words, **building components requires too much boilerplate and manual work**.
There should be a standard, declarative way to define components.

---

### The Solution with `component()`

When you use `component()`, you define everything in one configuration object:

```javascript
// One clear configuration: Everything together
const counter = component({
  // State
  state: {
    count: 0,
    step: 1
  },

  // Computed properties
  computed: {
    doubled() {
      return this.count * 2;
    }
  },

  // Watchers
  watch: {
    count(val) {
      console.log('Count:', val);
    }
  },

  // DOM bindings
  bindings: {
    '#count': 'count'
  },

  // Actions
  actions: {
    increment(state) {
      state.count += state.step;
    },
    decrement(state) {
      state.count -= state.step;
    }
  },

  // Lifecycle
  mounted() {
    console.log('Counter initialized');
  },

  unmounted() {
    console.log('Counter cleaned up');
  }
});

// Use it
counter.increment();

// Cleanup is built-in
counter.$destroy(); // Calls unmounted() and cleans up everything
```

**What Just Happened?**

With `component()`:
- Everything in one configuration object
- Clear structure and organization
- Built-in lifecycle hooks
- Automatic cleanup management
- Easy to understand and reuse

**Benefits:**
- Declarative component definition
- Standard component structure
- Built-in lifecycle management
- Automatic cleanup on destroy
- More maintainable and reusable
- Clear component boundaries

---

## How Does It Work?

### Under the Hood

`component()` processes the configuration object and sets up everything:

```
component(config)
        ↓
1. Create reactive state from config.state
2. Add computed properties from config.computed
3. Set up watchers from config.watch
4. Set up effects from config.effects
5. Set up DOM bindings from config.bindings
6. Add action methods from config.actions
7. Call config.mounted() if provided
        ↓
Returns state with $destroy() method
        ↓
state.$destroy() → Cleans up everything + calls config.unmounted()
```

**What happens:**

1. Creates reactive state from the `state` property
2. Adds all configured features (computed, watch, effects, bindings, actions)
3. Tracks all cleanup functions internally
4. Calls the `mounted()` hook if provided
5. Returns the state object with a `$destroy()` method
6. When `$destroy()` is called, cleans up all effects/watchers/bindings and calls `unmounted()`

---

## Basic Usage

### Simple Component

The simplest component with just state and actions:

```js
// Using the shortcut style
const counter = component({
  state: {
    count: 0
  },

  actions: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    }
  }
});

// Or using the namespace style
const counter = ReactiveUtils.component({
  state: {
    count: 0
  },

  actions: {
    increment(state) {
      state.count++;
    }
  }
});

// Use it
counter.increment();
console.log(counter.count); // 1
```

### Component with Computed

Add computed properties:

```js
const user = component({
  state: {
    firstName: 'John',
    lastName: 'Doe'
  },

  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  }
});

console.log(user.fullName); // "John Doe"
user.firstName = 'Jane';
console.log(user.fullName); // "Jane Doe"
```

### Component with Watchers

React to state changes:

```js
const app = component({
  state: {
    message: 'Hello'
  },

  watch: {
    message(newValue, oldValue) {
      console.log(`Message changed from "${oldValue}" to "${newValue}"`);
    }
  }
});

app.message = 'Hi'; // Logs: Message changed from "Hello" to "Hi"
```

### Component with DOM Bindings

Automatically bind to DOM:

```js
const app = component({
  state: {
    title: 'My App',
    count: 0
  },

  bindings: {
    '#title': 'title',
    '#count': 'count'
  }
});

app.title = 'New Title'; // #title updates
app.count = 5;           // #count updates
```

### Component with Lifecycle Hooks

Use mounted and unmounted:

```js
const timer = component({
  state: {
    seconds: 0
  },

  mounted() {
    console.log('Timer started');
    this.intervalId = setInterval(() => {
      this.seconds++;
    }, 1000);
  },

  unmounted() {
    console.log('Timer stopped');
    clearInterval(this.intervalId);
  }
});

// Later...
timer.$destroy(); // Stops timer and logs "Timer stopped"
```

---

## Common Use Cases

### Use Case 1: Counter Component

Complete counter with all features:

```js
const counter = component({
  state: {
    count: 0,
    step: 1
  },

  computed: {
    doubled() {
      return this.count * 2;
    },
    isEven() {
      return this.count % 2 === 0;
    }
  },

  watch: {
    count(val) {
      if (val < 0) {
        console.warn('Count is negative!');
      }
    }
  },

  bindings: {
    '#count': 'count',
    '#doubled': 'doubled',
    '#status': function() {
      return this.isEven ? 'Even' : 'Odd';
    }
  },

  actions: {
    increment(state) {
      state.count += state.step;
    },
    decrement(state) {
      state.count -= state.step;
    },
    reset(state) {
      state.count = 0;
    },
    setStep(state, newStep) {
      state.step = newStep;
    }
  },

  mounted() {
    console.log('Counter component mounted');
  },

  unmounted() {
    console.log('Counter component unmounted');
  }
});

// Use it
counter.increment();
counter.setStep(5);
counter.increment();
```

### Use Case 2: Todo List Component

Manage todos with persistence:

```js
const todoList = component({
  state: {
    todos: [],
    newTodoText: '',
    filter: 'all'
  },

  computed: {
    activeCount() {
      return this.todos.filter(t => !t.completed).length;
    },
    filteredTodos() {
      if (this.filter === 'active') {
        return this.todos.filter(t => !t.completed);
      }
      if (this.filter === 'completed') {
        return this.todos.filter(t => t.completed);
      }
      return this.todos;
    }
  },

  watch: {
    todos() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  },

  bindings: {
    '#todoCount': function() {
      return `${this.activeCount} item${this.activeCount !== 1 ? 's' : ''} left`;
    }
  },

  actions: {
    addTodo(state) {
      if (state.newTodoText.trim()) {
        state.todos.push({
          id: Date.now(),
          text: state.newTodoText.trim(),
          completed: false
        });
        state.newTodoText = '';
      }
    },
    toggleTodo(state, id) {
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo(state, id) {
      state.todos = state.todos.filter(t => t.id !== id);
    },
    setFilter(state, filter) {
      state.filter = filter;
    }
  },

  mounted() {
    const saved = localStorage.getItem('todos');
    if (saved) {
      this.todos = JSON.parse(saved);
    }
  }
});
```

### Use Case 3: Form Component

Form with validation:

```js
const loginForm = component({
  state: {
    username: '',
    password: '',
    errors: {},
    isSubmitting: false
  },

  computed: {
    isValid() {
      return Object.keys(this.errors).length === 0 &&
             this.username &&
             this.password;
    },
    canSubmit() {
      return this.isValid && !this.isSubmitting;
    }
  },

  watch: {
    username(value) {
      if (value.length < 3) {
        this.errors.username = 'Username must be at least 3 characters';
      } else {
        delete this.errors.username;
      }
    },
    password(value) {
      if (value.length < 8) {
        this.errors.password = 'Password must be at least 8 characters';
      } else {
        delete this.errors.password;
      }
    }
  },

  bindings: {
    '#submitButton': {
      disabled: function() {
        return !this.canSubmit;
      }
    },
    '#errorMessage': function() {
      return Object.values(this.errors)[0] || '';
    }
  },

  actions: {
    async submit(state) {
      if (!state.canSubmit) return;

      state.isSubmitting = true;
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({
            username: state.username,
            password: state.password
          })
        });
        const data = await response.json();
        console.log('Login successful:', data);
      } catch (error) {
        state.errors.submit = 'Login failed';
      } finally {
        state.isSubmitting = false;
      }
    },
    reset(state) {
      state.username = '';
      state.password = '';
      state.errors = {};
    }
  }
});
```

### Use Case 4: Timer Component

Timer with interval management:

```js
const timer = component({
  state: {
    seconds: 0,
    isRunning: false
  },

  computed: {
    formattedTime() {
      const mins = Math.floor(this.seconds / 60);
      const secs = this.seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  },

  bindings: {
    '#time': 'formattedTime',
    '#status': function() {
      return this.isRunning ? 'Running' : 'Stopped';
    }
  },

  actions: {
    start(state) {
      if (!state.isRunning) {
        state.isRunning = true;
        state.intervalId = setInterval(() => {
          state.seconds++;
        }, 1000);
      }
    },
    stop(state) {
      if (state.isRunning) {
        state.isRunning = false;
        clearInterval(state.intervalId);
      }
    },
    reset(state) {
      this.stop(state);
      state.seconds = 0;
    }
  },

  unmounted() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
});

// Use it
timer.start();
// Later...
timer.$destroy(); // Cleans up interval
```

### Use Case 5: API Data Component

Fetch and manage API data:

```js
const userList = component({
  state: {
    users: [],
    loading: false,
    error: null,
    searchQuery: ''
  },

  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users;
      return this.users.filter(u =>
        u.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    isSuccess() {
      return !this.loading && !this.error && this.users.length > 0;
    }
  },

  watch: {
    searchQuery(query) {
      console.log('Searching for:', query);
    }
  },

  bindings: {
    '#userCount': function() {
      return `${this.filteredUsers.length} users`;
    },
    '#loading': function() {
      return this.loading ? 'block' : 'none';
    },
    '#error': function() {
      return this.error ? this.error.message : '';
    }
  },

  actions: {
    async fetchUsers(state) {
      state.loading = true;
      state.error = null;
      try {
        const response = await fetch('/api/users');
        state.users = await response.json();
      } catch (e) {
        state.error = e;
      } finally {
        state.loading = false;
      }
    },
    setSearch(state, query) {
      state.searchQuery = query;
    }
  },

  mounted() {
    this.fetchUsers();
  }
});
```

---

## Advanced Patterns

### Pattern 1: Component Factory

Create reusable component factories:

```js
function createCounter(initialCount = 0) {
  return component({
    state: {
      count: initialCount
    },

    actions: {
      increment(state) {
        state.count++;
      },
      decrement(state) {
        state.count--;
      }
    },

    mounted() {
      console.log('Counter created with:', this.count);
    }
  });
}

const counter1 = createCounter(0);
const counter2 = createCounter(10);
```

### Pattern 2: Component Composition

Compose multiple components:

```js
const app = component({
  state: {
    currentView: 'home'
  },

  mounted() {
    // Create child components
    this.header = component({
      state: { title: 'My App' },
      bindings: { '#header': 'title' }
    });

    this.footer = component({
      state: { year: new Date().getFullYear() },
      bindings: { '#footer': function() {
        return `© ${this.year}`;
      }}
    });
  },

  unmounted() {
    // Clean up child components
    this.header.$destroy();
    this.footer.$destroy();
  }
});
```

### Pattern 3: Effect-Based Components

Use effects instead of bindings:

```js
const app = component({
  state: {
    count: 0
  },

  effects: {
    updateDOM() {
      document.getElementById('count').textContent = app.count;
    },
    updateTitle() {
      document.title = `Count: ${app.count}`;
    }
  },

  actions: {
    increment(state) {
      state.count++;
    }
  }
});
```

### Pattern 4: Conditional Configuration

Build configuration dynamically:

```js
function createComponent(withLogging = false) {
  const config = {
    state: { count: 0 },
    actions: {
      increment(state) {
        state.count++;
      }
    }
  };

  if (withLogging) {
    config.watch = {
      count(val) {
        console.log('Count:', val);
      }
    };
  }

  return component(config);
}

const comp1 = createComponent(false); // No logging
const comp2 = createComponent(true);  // With logging
```

---

## Performance Tips

### Tip 1: Use Bindings for Simple UI Updates

Bindings are optimized for DOM updates:

```js
component({
  state: { message: 'Hello' },
  bindings: { '#message': 'message' }  // Efficient
});
```

### Tip 2: Group Related Watchers

Organize watchers logically:

```js
component({
  state: { name: '', email: '' },
  watch: {
    // Group validation watchers
    name(val) { /* validate */ },
    email(val) { /* validate */ }
  }
});
```

### Tip 3: Clean Up in unmounted()

Always clean up resources:

```js
component({
  mounted() {
    this.timerId = setInterval(/* ... */, 1000);
  },
  unmounted() {
    clearInterval(this.timerId); // Clean up!
  }
});
```

---

## Common Pitfalls

### Pitfall 1: Wrong Action Signature

**Problem:** Actions receive state as first parameter:

```js
// WRONG
component({
  actions: {
    increment() {
      this.count++; // 'this' is not the state in actions!
    }
  }
})

// RIGHT
component({
  actions: {
    increment(state) {
      state.count++; // Use state parameter
    }
  }
})
```

### Pitfall 2: Forgetting to Clean Up

**Problem:** Not calling `$destroy()` when component is no longer needed:

```js
// BAD - memory leak
function showTempComponent() {
  const comp = component({
    state: { data: [] },
    effects: { /* ... */ }
  });
  // Component effects keep running!
}

// GOOD - cleanup
function showTempComponent() {
  const comp = component({
    state: { data: [] },
    effects: { /* ... */ }
  });

  // Later, when removing component
  comp.$destroy();
}
```

### Pitfall 3: Mutating State in Computed

**Problem:** Computed properties should only read, not write:

```js
// WRONG
component({
  computed: {
    doubled() {
      this.count++; // DON'T modify in computed!
      return this.count * 2;
    }
  }
})

// RIGHT
component({
  computed: {
    doubled() {
      return this.count * 2; // Just read and return
    }
  }
})
```

### Pitfall 4: Using Arrow Functions for Hooks

**Problem:** Arrow functions don't bind `this`:

```js
// WRONG
component({
  mounted: () => {
    console.log(this.count); // 'this' is not the component!
  }
})

// RIGHT
component({
  mounted() {
    console.log(this.count); // 'this' is the component state
  }
})
```

---

## Real-World Example

Here's a complete example using `component()`:

```js
// Create a complete shopping cart component
const shoppingCart = component({
  // State
  state: {
    items: [],
    couponCode: '',
    discount: 0,
    taxRate: 0.1
  },

  // Computed properties
  computed: {
    subtotal() {
      return this.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
    },
    discountAmount() {
      return this.subtotal * this.discount;
    },
    tax() {
      const afterDiscount = this.subtotal - this.discountAmount;
      return afterDiscount * this.taxRate;
    },
    total() {
      return this.subtotal - this.discountAmount + this.tax;
    },
    itemCount() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    isEmpty() {
      return this.items.length === 0;
    }
  },

  // Watchers
  watch: {
    items() {
      // Save to localStorage on change
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    total(newTotal) {
      console.log('Cart total:', newTotal.toFixed(2));
    }
  },

  // DOM bindings
  bindings: {
    '#subtotal': function() {
      return `$${this.subtotal.toFixed(2)}`;
    },
    '#discount': function() {
      return this.discount > 0 ? `-$${this.discountAmount.toFixed(2)}` : '';
    },
    '#tax': function() {
      return `$${this.tax.toFixed(2)}`;
    },
    '#total': function() {
      return `$${this.total.toFixed(2)}`;
    },
    '#itemCount': 'itemCount',
    '#emptyMessage': {
      style: function() {
        return { display: this.isEmpty ? 'block' : 'none' };
      }
    }
  },

  // Actions
  actions: {
    addItem(state, product) {
      const existing = state.items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        });
      }
    },

    removeItem(state, productId) {
      state.items = state.items.filter(i => i.id !== productId);
    },

    updateQuantity(state, productId, quantity) {
      const item = state.items.find(i => i.id === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = quantity;
        }
      }
    },

    applyCoupon(state, code) {
      const coupons = {
        'SAVE10': 0.1,
        'SAVE20': 0.2,
        'SAVE50': 0.5
      };

      if (coupons[code]) {
        state.discount = coupons[code];
        state.couponCode = code;
        return true;
      }
      return false;
    },

    clearCart(state) {
      if (confirm('Clear cart?')) {
        state.items = [];
        state.couponCode = '';
        state.discount = 0;
      }
    },

    async checkout(state) {
      if (state.isEmpty) {
        alert('Cart is empty!');
        return;
      }

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          body: JSON.stringify({
            items: state.items,
            total: this.total
          })
        });

        if (response.ok) {
          alert('Order placed successfully!');
          state.items = [];
          state.couponCode = '';
          state.discount = 0;
        }
      } catch (error) {
        alert('Checkout failed: ' + error.message);
      }
    }
  },

  // Lifecycle hooks
  mounted() {
    console.log('Shopping cart initialized');

    // Load saved cart
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        this.items = JSON.parse(saved);
        console.log('Loaded', this.items.length, 'items from storage');
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  },

  unmounted() {
    console.log('Shopping cart destroyed');
  }
});

// Use the cart
shoppingCart.addItem({ id: 1, name: 'Apple', price: 1.5 });
shoppingCart.addItem({ id: 2, name: 'Banana', price: 0.8 });
shoppingCart.updateQuantity(1, 3);
shoppingCart.applyCoupon('SAVE10');

console.log('Total:', shoppingCart.total);

// Later, when removing the cart
// shoppingCart.$destroy();
```

---

## Summary

**`component()` provides a declarative way to create reactive components.**

Key takeaways:
- ✅ **Declarative configuration** - define components with a config object
- ✅ Both **shortcut** (`component()`) and **namespace** (`ReactiveUtils.component()`) styles are valid
- ✅ Supports **state**, **computed**, **watch**, **effects**, **bindings**, and **actions**
- ✅ Built-in **lifecycle hooks**: `mounted()` and `unmounted()`
- ✅ Automatic **cleanup** with `$destroy()` method
- ✅ Clear **component boundaries** and structure
- ✅ Perfect for **reusable components**
- ✅ Actions receive state as first parameter
- ⚠️ Use regular functions for hooks (not arrow functions)
- ⚠️ Always call `$destroy()` when removing components

**Remember:** `component()` is perfect for building structured, reusable reactive components with a clear lifecycle. It provides a standard pattern for component creation that's easy to understand and maintain! 🎉

➡️ Next, explore [`reactive()`](reactive.md) for builder pattern or [`store()`](store.md) for organized state management!
