# Understanding `reactive()` - A Beginner's Guide

## What is `reactive()`?

`reactive()` is a **builder pattern function** in the Reactive library that provides a **chainable API** for creating complex reactive systems. It allows you to define state, computed properties, watchers, effects, bindings, and actions all in one fluent, easy-to-read chain.

Think of it as **a construction toolkit** - instead of calling multiple functions separately, you chain them together to build your complete reactive system step by step.

---

## Syntax

```js
// Using the shortcut
reactive(initialState)
  .computed({ ... })
  .watch({ ... })
  .effect(() => { ... })
  .bind({ ... })
  .actions({ ... })
  .build()

// Using the full namespace
ReactiveUtils.reactive(initialState)
  .computed({ ... })
  .watch({ ... })
  .effect(() => { ... })
  .bind({ ... })
  .actions({ ... })
  .build()
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`reactive()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.reactive()`) - Explicit and clear

**Parameters:**
- `initialState` (Object): The initial state properties

**Builder Methods:**
- `.computed(definitions)` - Add computed properties
- `.watch(definitions)` - Add watchers
- `.effect(fn)` - Add an effect
- `.bind(definitions)` - Add DOM bindings
- `.action(name, fn)` - Add a single action
- `.actions(definitions)` - Add multiple actions
- `.build()` - Finalize and return the state object
- `.destroy()` - Clean up all effects, watchers, and bindings

**Returns:**
- The builder object (for chaining), or the state object when `.build()` is called

---

## Why Does This Exist?

### The Problem with Multiple Function Calls

When building a complex reactive system, you typically need many separate function calls:

```javascript
// Step 1: Create state
const counter = state({
  count: 0,
  step: 1
});

// Step 2: Add computed properties
counter.$computed('doubled', function() {
  return this.count * 2;
});

// Step 3: Add watchers
counter.$watch('count', (newValue) => {
  console.log('Count changed to:', newValue);
});

// Step 4: Add effects
effect(() => {
  document.getElementById('count').textContent = counter.count;
});

// Step 5: Add actions
counter.increment = function() {
  this.count += this.step;
};

counter.decrement = function() {
  this.count -= this.step;
};

// This works, but it's scattered and verbose
```

**What's the Real Issue?**

**Problems:**
- Configuration is scattered across multiple statements
- Hard to see the complete picture at a glance
- No clear structure or organization
- Difficult to understand what belongs together
- More verbose than necessary
- No easy way to clean up everything at once

**Why This Becomes a Problem:**

For complex reactive systems:
❌ Related configuration is spread out
❌ No clear structure or grouping
❌ Hard to understand dependencies
❌ Cleanup requires tracking multiple cleanup functions
❌ Less readable and maintainable

In other words, **you have to piece together the complete system from scattered parts**.
The configuration should be unified and clear.

---

### The Solution with `reactive()`

When you use `reactive()`, you define everything in one clear, structured chain:

```javascript
// One clear chain: Everything together
const counter = reactive({
  count: 0,
  step: 1
})
  .computed({
    doubled() {
      return this.count * 2;
    }
  })
  .watch({
    count(newValue) {
      console.log('Count changed to:', newValue);
    }
  })
  .effect(() => {
    document.getElementById('count').textContent = counter.state.count;
  })
  .actions({
    increment(state) {
      state.count += state.step;
    },
    decrement(state) {
      state.count -= state.step;
    }
  })
  .build();

// Clean, structured, and easy to understand
// Cleanup is simple: counter.destroy()
```

**What Just Happened?**

With `reactive()`:
- All configuration in one place
- Clear structure and organization
- Easy to see the complete system
- Fluent, readable syntax
- Built-in cleanup with `.destroy()`

**Benefits:**
- Unified configuration
- Chainable, fluent API
- Better code organization
- Clear mental model
- Easy cleanup
- More maintainable

---

## How Does It Work?

### Under the Hood

`reactive()` creates a builder object with chainable methods:

```
reactive(initialState)
        ↓
1. Creates reactive state
2. Returns builder object
        ↓
.computed() → Adds computed properties → Returns builder
.watch()    → Adds watchers → Returns builder
.effect()   → Adds effects → Returns builder
.bind()     → Adds DOM bindings → Returns builder
.actions()  → Adds action methods → Returns builder
        ↓
.build() → Returns final state with destroy() method
```

**What happens:**

1. `reactive()` creates the initial reactive state
2. Each builder method adds functionality and returns the builder for chaining
3. All cleanup functions are tracked internally
4. `.build()` returns the state object with a `destroy()` method
5. Calling `destroy()` cleans up all effects, watchers, and bindings at once

---

## Basic Usage

### Simple Builder Chain

The most basic usage involves chaining a few methods:

```js
// Using the shortcut style
const app = reactive({
  count: 0
})
  .computed({
    doubled() {
      return this.count * 2;
    }
  })
  .build();

// Or using the namespace style
const app = ReactiveUtils.reactive({
  count: 0
})
  .computed({
    doubled() {
      return this.count * 2;
    }
  })
  .build();

// Use the state
console.log(app.count);    // 0
console.log(app.doubled);  // 0
app.count = 5;
console.log(app.doubled);  // 10
```

### Adding Actions

Actions are methods that modify state:

```js
const counter = reactive({
  count: 0
})
  .actions({
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
    reset(state) {
      state.count = 0;
    }
  })
  .build();

// Use actions
counter.increment();  // count = 1
counter.increment();  // count = 2
counter.decrement();  // count = 1
counter.reset();      // count = 0
```

### Adding Watchers

Watch for specific property changes:

```js
const user = reactive({
  name: 'John',
  age: 25
})
  .watch({
    name(newValue, oldValue) {
      console.log(`Name changed from ${oldValue} to ${newValue}`);
    },
    age(newValue) {
      console.log(`Age is now ${newValue}`);
    }
  })
  .build();

user.name = 'Jane'; // Logs: "Name changed from John to Jane"
user.age = 26;      // Logs: "Age is now 26"
```

### Adding Effects

Add effects that run when dependencies change:

```js
const app = reactive({
  message: 'Hello'
})
  .effect(() => {
    document.getElementById('message').textContent = app.message;
  })
  .build();

app.message = 'Hello, World!'; // DOM updates automatically
```

### Adding DOM Bindings

Automatically bind state to DOM elements:

```js
const app = reactive({
  title: 'My App',
  count: 0
})
  .bind({
    '#title': 'title',
    '#count': 'count'
  })
  .build();

app.title = 'New Title'; // #title updates
app.count = 5;           // #count updates
```

### Cleanup with destroy()

The builder tracks all cleanup functions:

```js
const app = reactive({
  count: 0
})
  .watch({
    count(val) {
      console.log('Count:', val);
    }
  })
  .effect(() => {
    console.log('Effect running');
  })
  .build();

// Later, clean up everything
app.destroy(); // Stops all watchers and effects
```

---

## Common Use Cases

### Use Case 1: Complete Counter App

Full-featured counter with all reactive features:

```js
const counter = reactive({
  count: 0,
  step: 1
})
  .computed({
    doubled() {
      return this.count * 2;
    },
    isPositive() {
      return this.count > 0;
    }
  })
  .watch({
    count(newValue) {
      console.log('Count changed to:', newValue);
    }
  })
  .bind({
    '#count': 'count',
    '#doubled': 'doubled',
    '#status': function() {
      return this.isPositive ? 'Positive' : 'Zero or Negative';
    }
  })
  .actions({
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
  })
  .build();

// Use the counter
counter.increment();  // count = 1
counter.increment();  // count = 2
counter.setStep(5);
counter.increment();  // count = 7
```

### Use Case 2: User Profile Manager

Manage user profile with validation:

```js
const profile = reactive({
  firstName: '',
  lastName: '',
  email: '',
  age: 0,
  errors: {}
})
  .computed({
    fullName() {
      return `${this.firstName} ${this.lastName}`.trim();
    },
    isValid() {
      return Object.keys(this.errors).length === 0;
    }
  })
  .watch({
    email(newEmail) {
      if (!newEmail.includes('@')) {
        this.errors.email = 'Invalid email';
      } else {
        delete this.errors.email;
      }
    },
    age(newAge) {
      if (newAge < 18) {
        this.errors.age = 'Must be 18 or older';
      } else {
        delete this.errors.age;
      }
    }
  })
  .bind({
    '#fullName': 'fullName',
    '#errorCount': function() {
      return Object.keys(this.errors).length;
    }
  })
  .actions({
    updateProfile(state, data) {
      Object.assign(state, data);
    },
    clearErrors(state) {
      state.errors = {};
    }
  })
  .build();
```

### Use Case 3: Todo List Application

Complete todo list with filtering:

```js
const todos = reactive({
  items: [],
  filter: 'all',
  newTodoText: ''
})
  .computed({
    activeCount() {
      return this.items.filter(t => !t.completed).length;
    },
    completedCount() {
      return this.items.filter(t => t.completed).length;
    },
    filteredItems() {
      if (this.filter === 'active') {
        return this.items.filter(t => !t.completed);
      }
      if (this.filter === 'completed') {
        return this.items.filter(t => t.completed);
      }
      return this.items;
    }
  })
  .watch({
    items() {
      localStorage.setItem('todos', JSON.stringify(this.items));
    }
  })
  .bind({
    '#activeCount': 'activeCount',
    '#completedCount': 'completedCount'
  })
  .actions({
    addTodo(state) {
      if (state.newTodoText.trim()) {
        state.items.push({
          id: Date.now(),
          text: state.newTodoText.trim(),
          completed: false
        });
        state.newTodoText = '';
      }
    },
    toggleTodo(state, id) {
      const todo = state.items.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo(state, id) {
      const index = state.items.findIndex(t => t.id === id);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    setFilter(state, filter) {
      state.filter = filter;
    },
    clearCompleted(state) {
      state.items = state.items.filter(t => !t.completed);
    }
  })
  .build();
```

### Use Case 4: Form with Validation

Reactive form with field validation:

```js
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  errors: {},
  touched: {}
})
  .computed({
    isValid() {
      return Object.keys(this.errors).length === 0;
    },
    canSubmit() {
      return this.isValid &&
             this.username &&
             this.email &&
             this.password;
    }
  })
  .watch({
    username(value) {
      if (this.touched.username) {
        if (value.length < 3) {
          this.errors.username = 'Username must be at least 3 characters';
        } else {
          delete this.errors.username;
        }
      }
    },
    email(value) {
      if (this.touched.email) {
        if (!value.includes('@')) {
          this.errors.email = 'Invalid email address';
        } else {
          delete this.errors.email;
        }
      }
    },
    password(value) {
      if (this.touched.password) {
        if (value.length < 8) {
          this.errors.password = 'Password must be at least 8 characters';
        } else {
          delete this.errors.password;
        }
      }
    },
    confirmPassword(value) {
      if (this.touched.confirmPassword) {
        if (value !== this.password) {
          this.errors.confirmPassword = 'Passwords do not match';
        } else {
          delete this.errors.confirmPassword;
        }
      }
    }
  })
  .actions({
    setTouched(state, field) {
      state.touched[field] = true;
    },
    submit(state) {
      if (state.canSubmit) {
        console.log('Submitting form:', {
          username: state.username,
          email: state.email
        });
      }
    },
    reset(state) {
      state.username = '';
      state.email = '';
      state.password = '';
      state.confirmPassword = '';
      state.errors = {};
      state.touched = {};
    }
  })
  .build();
```

### Use Case 5: API Data Manager

Manage API data with loading states:

```js
const users = reactive({
  data: [],
  loading: false,
  error: null,
  searchQuery: ''
})
  .computed({
    filteredUsers() {
      if (!this.searchQuery) return this.data;
      return this.data.filter(u =>
        u.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    isSuccess() {
      return !this.loading && !this.error && this.data.length > 0;
    }
  })
  .watch({
    searchQuery(newQuery) {
      console.log('Searching for:', newQuery);
    }
  })
  .bind({
    '#userCount': function() {
      return `${this.filteredUsers.length} users`;
    },
    '#loading': function() {
      return this.loading ? 'Loading...' : '';
    },
    '#error': function() {
      return this.error ? this.error.message : '';
    }
  })
  .actions({
    async fetchUsers(state) {
      state.loading = true;
      state.error = null;
      try {
        const response = await fetch('/api/users');
        state.data = await response.json();
      } catch (e) {
        state.error = e;
      } finally {
        state.loading = false;
      }
    },
    setSearch(state, query) {
      state.searchQuery = query;
    },
    clearSearch(state) {
      state.searchQuery = '';
    }
  })
  .build();
```

---

## Advanced Patterns

### Pattern 1: Chaining Single Action

Add actions one at a time:

```js
const app = reactive({ count: 0 })
  .action('increment', (state) => {
    state.count++;
  })
  .action('decrement', (state) => {
    state.count--;
  })
  .action('add', (state, amount) => {
    state.count += amount;
  })
  .build();

app.increment();
app.add(5);
```

### Pattern 2: Multiple Effects

Add multiple effects in sequence:

```js
const app = reactive({
  count: 0,
  message: 'Hello'
})
  .effect(() => {
    console.log('Count:', app.count);
  })
  .effect(() => {
    console.log('Message:', app.message);
  })
  .effect(() => {
    document.title = `${app.count} - ${app.message}`;
  })
  .build();
```

### Pattern 3: Conditional Builder

Build different configurations conditionally:

```js
function createApp(withLogging = false) {
  let builder = reactive({
    count: 0
  })
    .computed({
      doubled() {
        return this.count * 2;
      }
    });

  if (withLogging) {
    builder = builder.watch({
      count(val) {
        console.log('Count changed:', val);
      }
    });
  }

  return builder.build();
}

const app1 = createApp(false); // No logging
const app2 = createApp(true);  // With logging
```

### Pattern 4: Builder Without build()

Use the builder's `.destroy()` directly:

```js
const builder = reactive({ count: 0 })
  .watch({
    count(val) {
      console.log('Count:', val);
    }
  });

// Access state through builder.state
builder.state.count = 5; // Logs: "Count: 5"

// Clean up when done
builder.destroy();
```

---

## Performance Tips

### Tip 1: Group Related Configuration

Keep related configuration together:

```js
// Good - grouped by concern
reactive(state)
  .computed({ /* all computed */ })
  .watch({ /* all watchers */ })
  .actions({ /* all actions */ })
  .build();
```

### Tip 2: Use .actions() for Multiple Actions

More efficient than multiple `.action()` calls:

```js
// More efficient
.actions({
  increment(state) { state.count++; },
  decrement(state) { state.count--; }
})

// Less efficient
.action('increment', (state) => { state.count++; })
.action('decrement', (state) => { state.count--; })
```

### Tip 3: Call .build() Once

Always call `.build()` once at the end:

```js
// Good - clean chain
const app = reactive(state)
  .computed({...})
  .actions({...})
  .build();

// Don't store builder unless needed
```

---

## Common Pitfalls

### Pitfall 1: Forgetting .build()

**Problem:** The builder is not the state object:

```js
// WRONG - forgot .build()
const app = reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } });

console.log(app.count); // undefined! app is the builder

// RIGHT - call .build()
const app = reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } })
  .build();

console.log(app.count); // 0
```

### Pitfall 2: Wrong Action Signature

**Problem:** Actions receive state as first parameter:

```js
// WRONG
.actions({
  increment() {
    this.count++; // 'this' is not the state!
  }
})

// RIGHT
.actions({
  increment(state) {
    state.count++; // Use the state parameter
  }
})
```

### Pitfall 3: Accessing State Before .build()

**Problem:** State is not finalized until `.build()`:

```js
// WRONG
const builder = reactive({ count: 0 });
builder.count = 5; // Does nothing

// RIGHT
const app = reactive({ count: 0 }).build();
app.count = 5; // Works correctly
```

### Pitfall 4: Not Cleaning Up

**Problem:** Forgetting to call `.destroy()` when done:

```js
// BAD - memory leak
function createTempComponent() {
  const comp = reactive({ data: [] })
    .effect(() => { /* ... */ })
    .build();
  return comp;
  // Effect continues running!
}

// GOOD - cleanup
function createTempComponent() {
  const comp = reactive({ data: [] })
    .effect(() => { /* ... */ })
    .build();

  return {
    component: comp,
    cleanup: () => comp.destroy()
  };
}
```

---

## Real-World Example

Here's a complete example using `reactive()`:

```js
// Create a complete shopping cart with reactive builder
const cart = reactive({
  items: [],
  couponCode: '',
  discount: 0,
  taxRate: 0.1
})
  .computed({
    subtotal() {
      return this.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
    },
    discountAmount() {
      return this.subtotal * this.discount;
    },
    afterDiscount() {
      return this.subtotal - this.discountAmount;
    },
    tax() {
      return this.afterDiscount * this.taxRate;
    },
    total() {
      return this.afterDiscount + this.tax;
    },
    itemCount() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
  })
  .watch({
    items() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    couponCode(code) {
      console.log('Coupon applied:', code);
    }
  })
  .bind({
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
    '#itemCount': 'itemCount'
  })
  .actions({
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
      const index = state.items.findIndex(i => i.id === productId);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
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
      state.discount = coupons[code] || 0;
      state.couponCode = code;
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = '';
      state.discount = 0;
    }
  })
  .build();

// Load saved cart
const saved = localStorage.getItem('cart');
if (saved) {
  cart.items = JSON.parse(saved);
}

// Use the cart
cart.addItem({ id: 1, name: 'Apple', price: 1.5 });
cart.addItem({ id: 2, name: 'Banana', price: 0.8 });
cart.updateQuantity(1, 3);
cart.applyCoupon('SAVE10');

console.log('Total:', cart.total); // Automatically calculated

// Cleanup when done (e.g., page unload)
window.addEventListener('beforeunload', () => {
  cart.destroy();
});
```

---

## Summary

**`reactive()` provides a chainable builder pattern for creating reactive systems.**

Key takeaways:
- ✅ **Chainable API** for building complex reactive systems
- ✅ Both **shortcut** (`reactive()`) and **namespace** (`ReactiveUtils.reactive()`) styles are valid
- ✅ **Unified configuration** - everything in one place
- ✅ Supports `.computed()`, `.watch()`, `.effect()`, `.bind()`, and `.actions()`
- ✅ Call `.build()` to get the final state object
- ✅ Built-in **cleanup** with `.destroy()`
- ✅ More **readable and maintainable** than scattered configuration
- ✅ Actions receive state as first parameter
- ⚠️ Don't forget to call `.build()` at the end
- ⚠️ Remember to call `.destroy()` when cleaning up

**Remember:** `reactive()` is perfect for building complex reactive systems with a clean, structured API. It brings together all reactive features in one fluent chain, making your code more organized and easier to understand! 🎉

➡️ Next, explore [`component()`](component.md) for component-based architecture or [`store()`](store.md) for organized state management!
