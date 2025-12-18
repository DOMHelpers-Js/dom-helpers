# Understanding `reactive()` - A Beginner's Guide

## What is `reactive()`?

`reactive()` is a **flexible, step-by-step way** to build reactive state using a pattern called "method chaining" or "fluent API". Instead of defining everything in one big configuration object (like `component()`), you add features one method call at a time, chaining them together.

Think of it as **building with blocks**:
1. Start with your data
2. Add computed properties (optional)
3. Add watchers (optional)
4. Add effects (optional)
5. Add DOM bindings (optional)
6. Add actions (optional)
7. Finish building when you're ready

It's like assembling furniture step-by-step, where each step returns the furniture so you can continue to the next step!

---

## Why Does This Exist?

### The Old Way (Without `reactive()`)

Imagine you're building a counter, but you want to add features gradually as you develop:

```javascript
// First, create state
const counter = ReactiveUtils.state({ count: 0 });

// Then add computed properties separately
ReactiveUtils.computed(counter, {
  doubled: function() { return this.count * 2; }
});

// Then add watchers separately
ReactiveUtils.watch(counter, {
  count: (newVal) => console.log('Changed:', newVal)
});

// Then add actions separately
counter.increment = function() { this.count++; };

// Then add bindings separately
ReactiveUtils.bindings({
  '#counter': () => counter.count
});

// Multiple separate calls, hard to see the relationship!
```

**Problems:**
- Features are scattered across multiple function calls
- Hard to see which features belong together
- Not clear what order to call things in
- Verbose and repetitive
- Code is harder to read

### The New Way (With `reactive()`)

With `reactive()`, you chain everything together in a clear, readable flow:

```javascript
const counter = ReactiveUtils.reactive({ count: 0 })
  .computed({
    doubled() { return this.count * 2; }
  })
  .watch({
    count: (newVal) => console.log('Changed:', newVal)
  })
  .action('increment', (state) => state.count++)
  .bind({
    '#counter': function() { return this.count; }
  })
  .build();  // Finalize and get the state

// Or use it without building
counter.state.increment();
```

**Benefits:**
- Everything flows together in one chain
- Easy to read from top to bottom
- Clear what features you're adding
- Flexible - add only what you need
- Can build conditionally (add features based on conditions)
- Clean, professional-looking code

---

## How Does It Work?

### The Magic Behind the Scenes

When you use `reactive()`, it creates a "builder" object that:

1. **Holds your reactive state** inside `builder.state`
2. **Each method returns the builder** so you can chain the next method
3. **Collects cleanup functions** for proper disposal
4. **Can be finalized** with `.build()` to get just the state
5. **Can be destroyed** with `.destroy()` to clean everything up

Think of it like a construction sequence:

```
reactive({ count: 0 })          ← Create foundation
    ↓
  .computed({ ... })             ← Add computed layer
    ↓
  .watch({ ... })                ← Add watch layer
    ↓
  .action('increment', ...)      ← Add action layer
    ↓
  .bind({ ... })                 ← Add binding layer
    ↓
  .build()                       ← Finalize building
    ↓
  Final State Object
```

Each step returns the builder, so you can continue chaining!

---

## The Builder Methods

### Starting: `reactive(initialState)`

Creates the builder with initial state.

```javascript
const builder = ReactiveUtils.reactive({
  count: 0,
  name: 'John'
});

// builder.state contains the reactive state
console.log(builder.state.count);  // 0
```

**Returns:** Builder object (for chaining)

---

### `.computed(definitions)` - Add Calculated Values

Add computed properties that automatically recalculate when dependencies change.

```javascript
ReactiveUtils.reactive({ count: 0 })
  .computed({
    doubled() {
      return this.count * 2;
    },
    tripled() {
      return this.count * 3;
    }
  });
```

**Parameter:** Object where keys are property names, values are calculation functions

**Returns:** Builder object (for chaining)

---

### `.watch(definitions)` - Watch for Changes

Add watchers that run when specific properties change.

```javascript
ReactiveUtils.reactive({ count: 0 })
  .watch({
    count(newValue, oldValue) {
      console.log(`Count changed from ${oldValue} to ${newValue}`);
    }
  });
```

**Parameter:** Object where keys are property names, values are callback functions

**Returns:** Builder object (for chaining)

---

### `.effect(fn)` - Add Side Effect

Add an effect that runs automatically when dependencies change.

```javascript
ReactiveUtils.reactive({ count: 0 })
  .effect(function() {
    console.log('Current count:', this.count);
    // Automatically re-runs when count changes!
  });
```

**Parameter:** Function that accesses reactive state

**Returns:** Builder object (for chaining)

---

### `.bind(definitions)` - Connect to DOM

Add DOM bindings that connect state to HTML elements.

```javascript
ReactiveUtils.reactive({ count: 0 })
  .bind({
    '#counter': function() { return this.count; }
  });
```

**Parameter:** Object where keys are selectors, values are bindings

**Returns:** Builder object (for chaining)

---

### `.action(name, fn)` - Add Single Action

Add one custom method to the state.

```javascript
ReactiveUtils.reactive({ count: 0 })
  .action('increment', (state) => {
    state.count++;
  });
```

**Parameters:** 
- `name` - Name of the action method
- `fn` - Function that receives state as first parameter

**Returns:** Builder object (for chaining)

---

### `.actions(definitions)` - Add Multiple Actions

Add multiple custom methods at once.

```javascript
ReactiveUtils.reactive({ count: 0 })
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
  });
```

**Parameter:** Object where keys are action names, values are functions

**Returns:** Builder object (for chaining)

---

### `.build()` - Finalize and Get State

Finishes building and returns the reactive state (without the builder wrapper).

```javascript
const state = ReactiveUtils.reactive({ count: 0 })
  .action('increment', (state) => state.count++)
  .build();

// Now 'state' is just the reactive state, not the builder
state.increment();
console.log(state.count);
```

**Returns:** The reactive state object with `destroy()` method attached

---

### `.destroy()` - Clean Up

Cleans up all effects, watchers, and bindings.

```javascript
const builder = ReactiveUtils.reactive({ count: 0 })
  .watch({ count: () => console.log('changed') });

// Later, clean up
builder.destroy();
```

**Returns:** Nothing

---

## Two Ways to Use `reactive()`

### Way 1: Use the Builder Directly

Access state through `builder.state`:

```javascript
const counter = ReactiveUtils.reactive({ count: 0 })
  .action('increment', (state) => state.count++);

// Access state through .state property
counter.state.count;        // 0
counter.state.increment();  // Call action
counter.state.count;        // 1

// Clean up when done
counter.destroy();
```

**Good for:** When you want to keep the builder reference for later cleanup

---

### Way 2: Build and Get State

Call `.build()` to get just the state:

```javascript
const state = ReactiveUtils.reactive({ count: 0 })
  .action('increment', (state) => state.count++)
  .build();

// Now you have just the state
state.count;        // 0
state.increment();  // Call action
state.count;        // 1

// Clean up when done
state.destroy();
```

**Good for:** When you just want the state and don't need the builder anymore

---

## Simple Examples Explained

### Example 1: Basic Counter with Chaining

**HTML:**
```html
<div id="display">0</div>
<button onclick="counter.increment()">+</button>
<button onclick="counter.decrement()">-</button>
```

**JavaScript:**
```javascript
const counter = ReactiveUtils.reactive({ count: 0 })
  .computed({
    displayText() {
      return `Count: ${this.count}`;
    }
  })
  .actions({
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    }
  })
  .bind({
    '#display': function() {
      return this.displayText;
    }
  })
  .build();  // Get the final state
```

**What happens:**

1. Start with `count: 0`
2. Add `displayText` computed property
3. Add `increment` and `decrement` actions
4. Bind `displayText` to `#display` element
5. Build and get the final state
6. Everything is ready to use!

**Why this is cool:** You can see exactly what features are being added, in order, in one readable chain!

---

### Example 2: Conditional Feature Building

One powerful aspect of `reactive()` is you can conditionally add features:

```javascript
let builder = ReactiveUtils.reactive({ count: 0 });

// Add actions
builder = builder.actions({
  increment(state) { state.count++; },
  decrement(state) { state.count--; }
});

// Only add debug features in development
if (isDevelopmentMode) {
  builder = builder
    .watch({
      count(newVal) {
        console.log('DEBUG: Count changed to', newVal);
      }
    })
    .effect(function() {
      console.log('DEBUG: Count is', this.count);
    });
}

// Only add DOM bindings if element exists
if (document.getElementById('counter')) {
  builder = builder.bind({
    '#counter': 'count'
  });
}

const counter = builder.build();
```

**What happens:**

- Core actions always added
- Debug watchers only added in development mode
- DOM bindings only added if element exists
- Conditional building based on runtime conditions!

**Why this is cool:** You can build different versions of your state based on conditions, which is hard to do with `component()`!

---

### Example 3: Step-by-Step Building

Build your state gradually as you develop:

```javascript
// Start simple
let counter = ReactiveUtils.reactive({ count: 0 });

// Test it works
console.log(counter.state.count);  // 0

// Add an action and test
counter = counter.action('increment', (state) => state.count++);
counter.state.increment();
console.log(counter.state.count);  // 1 - works!

// Add computed property
counter = counter.computed({
  doubled() { return this.count * 2; }
});
console.log(counter.state.doubled);  // 2 - works!

// Add DOM binding when ready
counter = counter.bind({
  '#counter': 'count'
});

// Finalize when all features are added
const finalState = counter.build();
```

**What happens:**

- Build features incrementally
- Test each feature as you add it
- Easy to debug - if something breaks, you know which step caused it
- Great for development and learning!

**Why this is cool:** You can develop and test one feature at a time!

---

### Example 4: Todo List with Method Chaining

**HTML:**
```html
<input id="todo-input" placeholder="New todo...">
<button onclick="todos.addTodo()">Add</button>
<div id="todo-list"></div>
<div id="stats"></div>
```

**JavaScript:**
```javascript
const todos = ReactiveUtils.reactive({
  items: [],
  input: '',
  nextId: 1
})
  .computed({
    activeCount() {
      return this.items.filter(t => !t.done).length;
    },
    totalCount() {
      return this.items.length;
    }
  })
  .actions({
    addTodo(state) {
      if (!state.input.trim()) return;
      state.items.push({
        id: state.nextId++,
        text: state.input,
        done: false
      });
      state.input = '';
    },
    
    toggleTodo(state, id) {
      const todo = state.items.find(t => t.id === id);
      if (todo) todo.done = !todo.done;
    },
    
    removeTodo(state, id) {
      const index = state.items.findIndex(t => t.id === id);
      if (index !== -1) state.items.splice(index, 1);
    }
  })
  .watch({
    items(newItems) {
      // Save to localStorage
      localStorage.setItem('todos', JSON.stringify(newItems));
    }
  })
  .effect(function() {
    // Auto-render when items change
    const listEl = document.getElementById('todo-list');
    listEl.innerHTML = this.items.map(todo => `
      <div>
        <input type="checkbox" 
          ${todo.done ? 'checked' : ''}
          onchange="todos.toggleTodo(${todo.id})">
        <span>${todo.text}</span>
        <button onclick="todos.removeTodo(${todo.id})">×</button>
      </div>
    `).join('');
  })
  .bind({
    '#todo-input': { value: 'input' },
    '#stats': function() {
      return `${this.activeCount} active / ${this.totalCount} total`;
    }
  })
  .build();

// Load saved todos
const saved = localStorage.getItem('todos');
if (saved) {
  todos.items = JSON.parse(saved);
}
```

**What happens:**

1. Create state with items, input, and ID counter
2. Add computed properties for counts
3. Add actions for add/toggle/remove
4. Add watcher to save to localStorage
5. Add effect to auto-render list
6. Add DOM bindings for input and stats
7. Build and get final state
8. Load saved todos

**All in one readable chain!**

---

## Real-World Example: User Authentication

Let's build a complete authentication system with conditional features.

**HTML:**
```html
<div id="user-display">Not logged in</div>
<div id="login-form">
  <input id="username" placeholder="Username">
  <input id="password" type="password" placeholder="Password">
  <button onclick="auth.login()">Login</button>
</div>
<button id="logout-btn" onclick="auth.logout()" style="display:none">
  Logout
</button>
<div id="debug-panel"></div>
```

**JavaScript:**
```javascript
const DEBUG_MODE = true;  // Toggle debug features

let auth = ReactiveUtils.reactive({
  user: null,
  username: '',
  password: '',
  isLoading: false,
  error: null
});

// Add computed properties
auth = auth.computed({
  isLoggedIn() {
    return this.user !== null;
  },
  
  displayName() {
    return this.isLoggedIn ? this.user.name : 'Guest';
  },
  
  statusMessage() {
    if (this.isLoading) return 'Loading...';
    if (this.error) return `Error: ${this.error}`;
    if (this.isLoggedIn) return `Welcome, ${this.displayName}!`;
    return 'Please log in';
  }
});

// Add core actions
auth = auth.actions({
  async login(state) {
    if (!state.username || !state.password) {
      state.error = 'Username and password required';
      return;
    }
    
    state.isLoading = true;
    state.error = null;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      state.user = {
        id: 1,
        name: state.username,
        email: `${state.username}@example.com`
      };
      
      // Clear password
      state.password = '';
      
    } catch (err) {
      state.error = err.message;
    } finally {
      state.isLoading = false;
    }
  },
  
  logout(state) {
    state.user = null;
    state.username = '';
    state.password = '';
    state.error = null;
  }
});

// Add watcher to save login state
auth = auth.watch({
  user(newUser) {
    if (newUser) {
      // User logged in
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('User logged in:', newUser.name);
    } else {
      // User logged out
      localStorage.removeItem('user');
      console.log('User logged out');
    }
  }
});

// Add DOM bindings
auth = auth.bind({
  '#user-display': function() {
    return this.statusMessage;
  },
  
  '#username': { value: 'username' },
  '#password': { value: 'password' },
  
  '#login-form': {
    style: function() {
      return { display: this.isLoggedIn ? 'none' : 'block' };
    }
  },
  
  '#logout-btn': {
    style: function() {
      return { display: this.isLoggedIn ? 'block' : 'none' };
    }
  }
});

// Conditionally add debug features
if (DEBUG_MODE) {
  auth = auth
    .watch({
      isLoading(loading) {
        console.log('DEBUG: Loading state changed:', loading);
      },
      error(err) {
        if (err) console.error('DEBUG: Error occurred:', err);
      }
    })
    .effect(function() {
      const panel = document.getElementById('debug-panel');
      panel.innerHTML = `
        <h4>Debug Info:</h4>
        <pre>${JSON.stringify({
          isLoggedIn: this.isLoggedIn,
          user: this.user,
          isLoading: this.isLoading,
          error: this.error
        }, null, 2)}</pre>
      `;
    });
}

// Finalize
const authState = auth.build();

// Try to restore session
const savedUser = localStorage.getItem('user');
if (savedUser) {
  authState.user = JSON.parse(savedUser);
}

// Export for use in HTML
window.auth = authState;
```

**What happens:**

1. Create base state with user, credentials, and loading flags
2. Add computed properties for derived state
3. Add core authentication actions
4. Add watcher to persist login state
5. Add DOM bindings for UI updates
6. **Conditionally** add debug features (only in dev mode)
7. Build final state
8. Restore session from localStorage

**Key benefit:** Debug features only exist in development! Production code has no debug watchers or effects, keeping it lean.

---

## Common Beginner Questions

### Q: What's the difference between `reactive()`, `component()`, and `createState()`?

**Answer:**

All three create reactive state, but with different approaches:

```javascript
// createState() - Simple, for basic cases
const simple = ReactiveUtils.createState(
  { count: 0 },
  { '#counter': 'count' }
);

// component() - Configuration object, all-in-one
const comp = ReactiveUtils.component({
  state: { count: 0 },
  computed: { /* ... */ },
  actions: { /* ... */ },
  mounted() { /* ... */ }
});

// reactive() - Builder pattern, step-by-step
const react = ReactiveUtils.reactive({ count: 0 })
  .computed({ /* ... */ })
  .actions({ /* ... */ })
  .build();
```

**When to use each:**

- **`createState()`** → Simple state + DOM bindings
- **`component()`** → Need lifecycle hooks (mounted/unmounted) or prefer configuration object
- **`reactive()`** → Want flexible building, conditional features, or like method chaining

---

### Q: Do I have to call `.build()` at the end?

**Answer:** No! You can use the builder directly.

```javascript
// Option 1: Use builder directly
const counter = ReactiveUtils.reactive({ count: 0 })
  .action('increment', (state) => state.count++);

counter.state.increment();  // Access through .state

// Option 2: Build and get state
const state = ReactiveUtils.reactive({ count: 0 })
  .action('increment', (state) => state.count++)
  .build();

state.increment();  // Direct access
```

**Use builder directly when:** You want to keep the builder reference (maybe to add more features later, or for cleanup)

**Use `.build()` when:** You just want the state and don't need the builder

---

### Q: Can I add more features after calling `.build()`?

**Answer:** No! Once you call `.build()`, the building is finished.

```javascript
const state = ReactiveUtils.reactive({ count: 0 })
  .action('increment', (state) => state.count++)
  .build();

// ❌ Can't chain anymore - state is not a builder
// state.computed({ /* ... */ })  // ERROR!

// ✅ If you need to add more, don't build yet
const builder = ReactiveUtils.reactive({ count: 0 })
  .action('increment', (state) => state.count++);

// Can still add more
builder.computed({ doubled() { return this.count * 2; } });

// Build when ready
const finalState = builder.build();
```

---

### Q: Can I store the builder and add features later?

**Answer:** Yes! That's one of the benefits of the builder pattern.

```javascript
// Start with basics
let userAuth = ReactiveUtils.reactive({
  user: null,
  isLoggedIn: false
});

// Add core features
userAuth = userAuth.actions({
  login(state, user) { state.user = user; state.isLoggedIn = true; },
  logout(state) { state.user = null; state.isLoggedIn = false; }
});

// Later, based on some condition...
if (shouldAddFeature) {
  userAuth = userAuth.watch({
    isLoggedIn(val) { console.log('Login status:', val); }
  });
}

// Even later, add more
if (needsBindings) {
  userAuth = userAuth.bind({
    '#user-name': function() { return this.user?.name || 'Guest'; }
  });
}

// Build when completely done
const auth = userAuth.build();
```

---

### Q: What's better for readability - chaining or separate variables?

**Answer:** It depends on your preference!

```javascript
// Chaining style - concise, everything visible at once
const state = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } })
  .actions({ increment(s) { s.count++; } })
  .bind({ '#counter': 'count' })
  .build();

// Step-by-step style - easier to debug, can test between steps
let builder = ReactiveUtils.reactive({ count: 0 });

builder = builder.computed({
  doubled() { return this.count * 2; }
});

builder = builder.actions({
  increment(s) { s.count++; }
});

builder = builder.bind({
  '#counter': 'count'
});

const state = builder.build();
```

**Both are valid!** Use whichever is clearer for your situation.

---

### Q: How do I clean up a reactive state?

**Answer:** Use the `.destroy()` method.

```javascript
// If using builder
const builder = ReactiveUtils.reactive({ count: 0 })
  .watch({ count: () => console.log('changed') });

builder.destroy();  // Clean up

// If using built state
const state = ReactiveUtils.reactive({ count: 0 })
  .watch({ count: () => console.log('changed') })
  .build();

state.destroy();  // Clean up
```

Both have a `destroy()` method for cleanup!

---

### Q: Can I use `reactive()` with `component()` features?

**Answer:** They're different approaches, but you can achieve similar results:

```javascript
// component() style - configuration object
const comp = ReactiveUtils.component({
  state: { count: 0 },
  computed: { doubled() { return this.count * 2; } },
  actions: { increment(s) { s.count++; } },
  mounted() { console.log('Ready!'); }
});

// reactive() style - method chaining
const react = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } })
  .action('increment', (s) => s.count++)
  .effect(function() { console.log('Ready!', this.count); })
  .build();
```

**Note:** `reactive()` doesn't have `mounted`/`unmounted` hooks. Use `effect()` for similar behavior, or just run code after building:

```javascript
const state = ReactiveUtils.reactive({ count: 0 })
  .action('increment', (s) => s.count++)
  .build();

// "Mounted" logic - runs once after building
console.log('Component ready!');
```

---

### Q: Why would I use `reactive()` over `component()`?

**Answer:** `reactive()` is better when:

1. **You want conditional building:**
```javascript
let builder = ReactiveUtils.reactive({ count: 0 });

if (debugMode) {
  builder = builder.watch({ count: (v) => console.log(v) });
}

if (hasDisplay) {
  builder = builder.bind({ '#counter': 'count' });
}
```

2. **You prefer method chaining style**
3. **You're building features incrementally during development**
4. **You don't need lifecycle hooks**
5. **You want to add features programmatically based on runtime conditions**

Use `component()` when you want lifecycle hooks or prefer configuration objects.

---

## Tips for Beginners

### 1. Start Simple, Chain as You Go

Don't try to chain everything at once. Start with state and actions:

```javascript
// Start here
const counter = ReactiveUtils.reactive({ count: 0 })
  .actions({
    increment(s) { s.count++; },
    decrement(s) { s.count--; }
  })
  .build();

// Test it works
counter.increment();
console.log(counter.count);  // 1

// Later, add more features...
```

---

### 2. Use Intermediate Variables for Debugging

Break chains when debugging:

```javascript
// Instead of one long chain:
const state = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } })
  .actions({ increment(s) { s.count++; } })
  .build();

// Do this when debugging:
let builder = ReactiveUtils.reactive({ count: 0 });
console.log('State created:', builder.state);

builder = builder.computed({ doubled() { return this.count * 2; } });
console.log('Computed added:', builder.state.doubled);

builder = builder.actions({ increment(s) { s.count++; } });
builder.state.increment();
console.log('After increment:', builder.state.count);

const state = builder.build();
```

---

### 3. Conditional Features Are Powerful

Use conditions to build different versions:

```javascript
let app = ReactiveUtils.reactive({ data: [] });

// Core features - always added
app = app.actions({
  addItem(s, item) { s.data.push(item); }
});

// Debug features - only in dev
if (isDevelopment) {
  app = app.watch({
    data(d) { console.log('DEBUG:', d); }
  });
}

// Production features - only in prod
if (isProduction) {
  app = app.watch({
    data(d) { 
      analytics.track('data_changed', { count: d.length });
    }
  });
}

const final = app.build();
```

---

### 4. Remember to Clean Up

Always destroy when done:

```javascript
const state = ReactiveUtils.reactive({ count: 0 })
  .watch({ count: () => console.log('changed') })
  .build();

// Use it...
state.count = 5;

// Clean up when done (unmounting, navigating away, etc.)
state.destroy();
```

---

### 5. Choose Your Style Consistently

Pick one style and stick with it in your project:

```javascript
// ✅ Good - consistent chaining style
const counter1 = ReactiveUtils.reactive({ count: 0 })
  .action('increment', (s) => s.count++)
  .build();

const counter2 = ReactiveUtils.reactive({ count: 0 })
  .action('decrement', (s) => s.count--)
  .build();

// ❌ Bad - mixing styles
const counter3 = ReactiveUtils.reactive({ count: 0 })
  .action('increment', (s) => s.count++)
  .build();

const counter4 = ReactiveUtils.component({  // Different style!
  state: { count: 0 },
  actions: { decrement(s) { s.count--; } }
});
```

---

### 6. Use Descriptive Chain Names

If not building immediately, use descriptive variable names:

```javascript
// ✅ Good - clear what stage you're at
const counterBase = ReactiveUtils.reactive({ count: 0 });
const counterWithActions = counterBase.actions({ /* ... */ });
const counterWithBindings = counterWithActions.bind({ /* ... */ });
const finalCounter = counterWithBindings.build();

// ❌ Confusing
const c1 = ReactiveUtils.reactive({ count: 0 });
const c2 = c1.actions({ /* ... */ });
const c3 = c2.bind({ /* ... */ });
const c4 = c3.build();
```

---

### 7. Chain Order Doesn't Usually Matter

You can add features in any order:

```javascript
// These are equivalent:

// Order 1
const state1 = ReactiveUtils.reactive({ count: 0 })
  .computed({ doubled() { return this.count * 2; } })
  .actions({ increment(s) { s.count++; } })
  .build();

// Order 2
const state2 = ReactiveUtils.reactive({ count: 0 })
  .actions({ increment(s) { s.count++; } })
  .computed({ doubled() { return this.count * 2; } })
  .build();
```

**Exception:** If an action depends on a computed property, define the computed first.

---

## Summary

### What `reactive()` Does:

1. ✅ Creates reactive state with a builder pattern
2. ✅ Allows method chaining for fluent API
3. ✅ Supports conditional feature building
4. ✅ Lets you build incrementally during development
5. ✅ Provides both builder and built state options
6. ✅ Includes proper cleanup with `destroy()`

### When to Use It:

- You like method chaining / fluent APIs
- You want to build features conditionally
- You're developing incrementally and want to test each feature
- You don't need lifecycle hooks (mounted/unmounted)
- You want maximum flexibility in how you build state

### The Basic Pattern:

```javascript
const myState = ReactiveUtils.reactive({ /* initial data */ })
  .computed({ /* calculated values */ })
  .watch({ /* watchers */ })
  .effect(/* side effects */)
  .actions({ /* custom methods */ })
  .bind({ /* DOM connections */ })
  .build();  // Optional - finalize and get state

// Use it
myState.someAction();

// Clean up when done
myState.destroy();
```

### Quick Decision Guide:

- **Like configuration objects?** → Use `component()`
- **Like method chaining?** → Use `reactive()`
- **Need lifecycle hooks?** → Use `component()`
- **Need conditional features?** → Use `reactive()`
- **Just simple state + bindings?** → Use `createState()`

---

**Remember:** `reactive()` is like building with LEGO blocks - you add one piece at a time, in whatever order you want, and you can see exactly what you're building as you go. It's the flexible, developer-friendly way to create reactive state! 🎉