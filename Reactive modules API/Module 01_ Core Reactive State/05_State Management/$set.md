# Understanding `state.$set()` - A Beginner's Guide

## What is `state.$set()`?

`state.$set()` is a **state instance method** that updates state properties using functional callbacks. It allows you to compute new values based on the current state, perfect for transformations and conditional updates.

Think of it as **update with a function** - instead of providing static values, you provide functions that receive the current state and return new values.

---

## Syntax

```js
state.$set(updates)
```

**Parameters:**
- `updates` (Object): Object where values are either:
  - Functions: Receive current state, return new value
  - Static values: Direct property values

**Returns:**
- The state object (for chaining)

---

## Why Does This Exist?

### The Problem with Static Updates

When you need to update based on current values, you read then write:

```javascript
// Without $set - read then write
const counter = state({
  count: 0,
  total: 0,
  history: []
});

// Update based on current value - verbose
counter.count = counter.count + 1;
counter.total = counter.total + counter.count;
counter.history = [...counter.history, counter.count];

// Toggle boolean - wordy
counter.isActive = !counter.isActive;

// Conditional update - requires if statement
if (counter.count > 10) {
  counter.status = 'high';
} else {
  counter.status = 'low';
}

// Array transformation - multiple steps
const filtered = counter.items.filter(item => item.active);
const mapped = filtered.map(item => item.value);
counter.processed = mapped;
```

**What's the Real Issue?**

**Problems:**
- Verbose read-then-write pattern
- No direct transformation support
- Conditional updates require if statements
- Array transformations need intermediate variables
- Can't easily compute from current state

---

### The Solution with `$set()`

When you use `$set()`, you update with functions:

```javascript
// With $set() - functional updates
const counter = state({
  count: 0,
  total: 0,
  history: [],
  isActive: false,
  status: 'low',
  items: [],
  processed: []
});

counter.$set({
  // Increment count (current state as parameter)
  count: (state) => state.count + 1,

  // Update total based on new count
  total: (state) => state.total + state.count,

  // Append to history
  history: (state) => [...state.history, state.count],

  // Toggle boolean
  isActive: (state) => !state.isActive,

  // Conditional update
  status: (state) => state.count > 10 ? 'high' : 'low',

  // Transform array in one step
  processed: (state) => state.items
    .filter(item => item.active)
    .map(item => item.value)
});

// All updates computed and applied together!
```

**Benefits:**
- Clean functional updates
- Direct transformations
- Conditional logic in callbacks
- No intermediate variables
- Compute from current state
- All updates batched automatically

---

## How Does It Work?

### Under the Hood

`$set()` evaluates functions with current state:

```
state.$set(updates)
        ↓
1. Iterate through each key-value pair
2. If value is a function:
   - Call function with current state
   - Use returned value for update
3. If value is static:
   - Use value directly
4. Apply all updates to state
        ↓
Returns state object for chaining
```

---

## Basic Usage

### Functional Updates

```js
const counter = state({ count: 0 });

// Update using function
counter.$set({
  count: (state) => state.count + 1
});

console.log(counter.count); // 1

// Multiple functional updates
counter.$set({
  count: (state) => state.count + 5
});

console.log(counter.count); // 6
```

### Mix Functions and Static Values

```js
const app = state({
  count: 0,
  total: 0,
  label: ''
});

// Mix functions and static values
app.$set({
  // Function - based on current state
  count: (state) => state.count + 1,

  // Function - computed from other properties
  total: (state) => state.count * 10,

  // Static value
  label: 'Updated'
});

console.log(app.count); // 1
console.log(app.total); // 10
console.log(app.label); // 'Updated'
```

### Toggle Boolean Values

```js
const ui = state({
  isOpen: false,
  isActive: true,
  isDarkMode: false
});

// Toggle booleans with functions
ui.$set({
  isOpen: (state) => !state.isOpen,
  isActive: (state) => !state.isActive,
  isDarkMode: (state) => !state.isDarkMode
});

console.log(ui.isOpen); // true
console.log(ui.isActive); // false
console.log(ui.isDarkMode); // true
```

### Array Transformations

```js
const list = state({
  items: [1, 2, 3, 4, 5],
  filtered: [],
  doubled: []
});

// Transform arrays
list.$set({
  // Filter even numbers
  filtered: (state) => state.items.filter(n => n % 2 === 0),

  // Double all numbers
  doubled: (state) => state.items.map(n => n * 2)
});

console.log(list.filtered); // [2, 4]
console.log(list.doubled); // [2, 4, 6, 8, 10]
```

---

## Common Use Cases

### Use Case 1: Counter with History

```js
const counter = state({
  value: 0,
  history: [],
  max: 0,
  min: 0
});

// Increment and track history
function increment() {
  counter.$set({
    // Increment value
    value: (state) => state.value + 1,

    // Add to history
    history: (state) => [...state.history, state.value + 1],

    // Update max if needed
    max: (state) => Math.max(state.max, state.value + 1),

    // Keep min at 0 or lower
    min: (state) => Math.min(state.min, state.value + 1)
  });
}

// Decrement
function decrement() {
  counter.$set({
    value: (state) => state.value - 1,
    history: (state) => [...state.history, state.value - 1],
    max: (state) => Math.max(state.max, state.value - 1),
    min: (state) => Math.min(state.min, state.value - 1)
  });
}

increment(); // value: 1, history: [1], max: 1
increment(); // value: 2, history: [1, 2], max: 2
decrement(); // value: 1, history: [1, 2, 1], max: 2, min: 1
```

### Use Case 2: Todo List Operations

```js
const todos = state({
  items: [],
  filter: 'all',
  filtered: [],
  activeCount: 0,
  completedCount: 0
});

// Add new todo
function addTodo(text) {
  todos.$set({
    // Append new todo to items
    items: (state) => [
      ...state.items,
      {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date()
      }
    ],

    // Recalculate active count
    activeCount: (state) => state.items.filter(t => !t.completed).length + 1
  });
}

// Toggle todo
function toggleTodo(id) {
  todos.$set({
    // Toggle completed status
    items: (state) => state.items.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ),

    // Recalculate counts
    activeCount: (state) => state.items.filter(t => !t.completed).length,
    completedCount: (state) => state.items.filter(t => t.completed).length
  });
}

// Filter todos
function setFilter(filter) {
  todos.$set({
    filter: filter,

    // Update filtered list based on new filter
    filtered: (state) => {
      if (filter === 'active') {
        return state.items.filter(t => !t.completed);
      } else if (filter === 'completed') {
        return state.items.filter(t => t.completed);
      }
      return state.items;
    }
  });
}
```

### Use Case 3: Shopping Cart Calculations

```js
const cart = state({
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  total: 0
});

// Add item to cart
function addItem(product, quantity) {
  cart.$set({
    // Add product to items
    items: (state) => [
      ...state.items,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      }
    ],

    // Recalculate subtotal
    subtotal: (state) => {
      const newItems = [...state.items, { price: product.price, quantity }];
      return newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Calculate discount (10% off if subtotal > 100)
    discount: (state) => {
      const sub = state.items.reduce((s, i) => s + (i.price * i.quantity), 0);
      const newSub = sub + (product.price * quantity);
      return newSub > 100 ? newSub * 0.1 : 0;
    },

    // Calculate tax (after discount)
    tax: (state) => {
      const sub = state.subtotal;
      const disc = state.discount;
      return (sub - disc) * 0.1;
    },

    // Calculate total
    total: (state) => state.subtotal - state.discount + state.tax
  });
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
  cart.$set({
    // Update item quantity
    items: (state) => state.items.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity }
        : item
    ),

    // Recalculate all amounts
    subtotal: (state) => state.items.reduce((sum, item) =>
      sum + (item.price * (item.id === itemId ? newQuantity : item.quantity)), 0
    ),

    discount: (state) => state.subtotal > 100 ? state.subtotal * 0.1 : 0,
    tax: (state) => (state.subtotal - state.discount) * 0.1,
    total: (state) => state.subtotal - state.discount + state.tax
  });
}
```

### Use Case 4: Form Validation

```js
const form = state({
  email: '',
  password: '',
  confirmPassword: '',
  errors: {},
  isValid: false,
  touched: {}
});

// Validate email
function validateEmail(email) {
  form.$set({
    email: email,

    // Mark as touched
    touched: (state) => ({ ...state.touched, email: true }),

    // Update errors
    errors: (state) => {
      const newErrors = { ...state.errors };
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!email.includes('@')) {
        newErrors.email = 'Invalid email format';
      } else {
        delete newErrors.email;
      }
      return newErrors;
    },

    // Recompute validity
    isValid: (state) => Object.keys(state.errors).length === 0
  });
}

// Validate password
function validatePassword(password) {
  form.$set({
    password: password,
    touched: (state) => ({ ...state.touched, password: true }),

    errors: (state) => {
      const newErrors = { ...state.errors };

      // Check password
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else {
        delete newErrors.password;
      }

      // Check if passwords match
      if (state.confirmPassword && password !== state.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else if (state.confirmPassword) {
        delete newErrors.confirmPassword;
      }

      return newErrors;
    },

    isValid: (state) => Object.keys(state.errors).length === 0
  });
}
```

### Use Case 5: Game State Management

```js
const game = state({
  player: {
    health: 100,
    score: 0,
    position: { x: 0, y: 0 }
  },
  enemies: [],
  powerups: [],
  level: 1,
  status: 'playing'
});

// Player takes damage
function takeDamage(amount) {
  game.$set({
    // Reduce health (minimum 0)
    player: (state) => ({
      ...state.player,
      health: Math.max(0, state.player.health - amount)
    }),

    // Update status if health is 0
    status: (state) => state.player.health <= amount ? 'game-over' : state.status
  });
}

// Player scores points
function addScore(points) {
  game.$set({
    // Add points to score
    player: (state) => ({
      ...state.player,
      score: state.player.score + points
    }),

    // Level up every 1000 points
    level: (state) => Math.floor((state.player.score + points) / 1000) + 1,

    // Spawn more enemies as level increases
    enemies: (state) => {
      const newLevel = Math.floor((state.player.score + points) / 1000) + 1;
      if (newLevel > state.level) {
        // Add 3 new enemies on level up
        return [
          ...state.enemies,
          ...Array(3).fill(null).map(() => ({
            id: Date.now() + Math.random(),
            health: 50,
            position: { x: Math.random() * 800, y: Math.random() * 600 }
          }))
        ];
      }
      return state.enemies;
    }
  });
}

// Collect powerup
function collectPowerup(powerupId) {
  game.$set({
    // Remove powerup from list
    powerups: (state) => state.powerups.filter(p => p.id !== powerupId),

    // Heal player
    player: (state) => ({
      ...state.player,
      health: Math.min(100, state.player.health + 20),
      score: state.player.score + 50
    })
  });
}
```

---

## Advanced Patterns

### Pattern 1: Dependent Updates

```js
const data = state({
  quantity: 1,
  unitPrice: 10,
  subtotal: 10,
  total: 11
});

// Update with dependent calculations
data.$set({
  quantity: 5,

  // Subtotal depends on new quantity
  subtotal: (state) => 5 * state.unitPrice,

  // Total depends on new subtotal
  total: (state) => (5 * state.unitPrice) * 1.1
});
```

### Pattern 2: Conditional State Machines

```js
const workflow = state({
  status: 'idle',
  step: 0,
  canProceed: true
});

// Advance workflow
function advance() {
  workflow.$set({
    // Increment step
    step: (state) => state.step + 1,

    // Update status based on step
    status: (state) => {
      const nextStep = state.step + 1;
      if (nextStep === 1) return 'processing';
      if (nextStep === 2) return 'validating';
      if (nextStep === 3) return 'complete';
      return state.status;
    },

    // Determine if can proceed
    canProceed: (state) => state.step + 1 < 3
  });
}
```

### Pattern 3: Array Bulk Operations

```js
const list = state({
  items: [1, 2, 3, 4, 5],
  processed: []
});

// Chain multiple array operations
list.$set({
  processed: (state) => state.items
    .filter(n => n > 2)        // Filter
    .map(n => n * 2)           // Map
    .sort((a, b) => b - a)     // Sort descending
    .slice(0, 3)               // Take top 3
});

console.log(list.processed); // [10, 8, 6]
```

### Pattern 4: Undo/Redo with Snapshots

```js
const editor = state({
  content: '',
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false
});

// Save content to history
function saveToHistory(newContent) {
  editor.$set({
    content: newContent,

    // Remove any redo history
    history: (state) => state.history.slice(0, state.historyIndex + 1),

    // Append to history
    history: (state) => [...state.history, newContent],

    // Update index
    historyIndex: (state) => state.history.length,

    // Update undo/redo availability
    canUndo: true,
    canRedo: false
  });
}

// Undo
function undo() {
  editor.$set({
    historyIndex: (state) => Math.max(0, state.historyIndex - 1),
    content: (state) => state.history[Math.max(0, state.historyIndex - 1)],
    canUndo: (state) => state.historyIndex > 1,
    canRedo: true
  });
}

// Redo
function redo() {
  editor.$set({
    historyIndex: (state) => Math.min(state.history.length - 1, state.historyIndex + 1),
    content: (state) => state.history[Math.min(state.history.length - 1, state.historyIndex + 1)],
    canRedo: (state) => state.historyIndex < state.history.length - 2,
    canUndo: true
  });
}
```

---

## Performance Tips

### Tip 1: Use Functions for Computed Values

```js
// GOOD - computed from current state
state.$set({
  total: (state) => state.price * state.quantity
});

// BAD - manual calculation
const total = state.price * state.quantity;
state.total = total;
```

### Tip 2: Batch Related Updates

```js
// GOOD - single $set call
state.$set({
  count: (s) => s.count + 1,
  total: (s) => s.total + s.count,
  average: (s) => s.total / s.count
});

// BAD - multiple separate updates
state.count++;
state.total += state.count;
state.average = state.total / state.count;
```

### Tip 3: Avoid Heavy Computation in Functions

```js
// GOOD - precompute if possible
const newValue = expensiveCalculation();
state.$set({
  result: newValue
});

// BAD - heavy computation in function
state.$set({
  result: (state) => expensiveCalculation(state.data)
});
```

---

## Common Pitfalls

### Pitfall 1: Mutating State in Functions

```js
// WRONG - mutating state
state.$set({
  items: (state) => {
    state.items.push(1); // Don't mutate!
    return state.items;
  }
});

// RIGHT - return new array
state.$set({
  items: (state) => [...state.items, 1]
});
```

### Pitfall 2: Not Returning Values

```js
// WRONG - no return
state.$set({
  count: (state) => {
    state.count + 1; // Forgot return!
  }
});

// RIGHT - return new value
state.$set({
  count: (state) => state.count + 1
});
```

### Pitfall 3: Using Arrow Functions for `this`

```js
// WRONG - `this` doesn't work with arrow function
state.$set({
  total: (state) => this.count * 10 // `this` is undefined
});

// RIGHT - use state parameter
state.$set({
  total: (state) => state.count * 10
});
```

---

## Summary

**`state.$set()` updates state using functional callbacks.**

Key takeaways:
- ✅ **Functional updates** based on current state
- ✅ Functions receive **current state** as parameter
- ✅ Mix **functions and static values**
- ✅ Perfect for **transformations**, **toggles**, **computed values**
- ✅ Returns **state** for chaining
- ✅ Great for **counters**, **todos**, **carts**, **forms**, **games**
- ⚠️ Always **return new value** from functions
- ⚠️ Don't **mutate state** in functions
- ⚠️ Use **state parameter**, not `this`

**Remember:** Use `$set()` when you need to compute new values based on current state - perfect for increments, toggles, and transformations! 🎉

➡️ Next, explore [`$bind()`]($bind.md) for reactive DOM bindings or [`$update()`]($update.md) for mixed updates!
