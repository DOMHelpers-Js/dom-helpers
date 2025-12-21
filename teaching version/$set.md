# `state.$set()` - Update State with Functions (Not Just Values)

> **You are a senior JavaScript engineer teaching a beginner**

---

## The Problem: You Can't Update Based on Current Values Easily

Imagine you're building a counter app. Every time the user clicks "+1", you need to read the current value, add 1, then write it back.

Here's what happens **WITHOUT** `$set()`:

```javascript
const counter = state({
  count: 0,
  history: [],
  max: 0
});

// Increment count (read-then-write pattern)
counter.count = counter.count + 1;

// Add to history (read current array, create new one)
counter.history = [...counter.history, counter.count];

// Update max if needed (read, compare, conditionally write)
if (counter.count > counter.max) {
  counter.max = counter.count;
}

// Toggle boolean (read, negate, write)
counter.isActive = !counter.isActive;

// Filter array (read, transform, write)
const filteredItems = counter.items.filter(item => item.active);
const mappedItems = filteredItems.map(item => item.value);
counter.processed = mappedItems;
```

**The Real Issues:**
- You read the value, then write it back (verbose!)
- Array transformations require intermediate variables
- Conditional logic requires if statements
- You write the property name twice: `count = count + 1`
- Can't easily compute new values based on old values

---

## The Solution: `$set()` - Use Functions to Compute New Values

`$set()` lets you pass **functions** that receive the current state and return new values. It's like saying "update count to whatever it is now, plus 1" instead of doing the math yourself!

```javascript
const counter = state({
  count: 0,
  history: [],
  max: 0,
  isActive: false,
  items: [1, 2, 3, 4, 5],
  processed: []
});

// ✅ Update everything with functions!
counter.$set({
  // Increment count (function receives current state)
  count: (state) => state.count + 1,

  // Add to history (function has access to NEW count!)
  history: (state) => [...state.history, state.count + 1],

  // Update max (conditional logic in function)
  max: (state) => Math.max(state.max, state.count + 1),

  // Toggle boolean (simple!)
  isActive: (state) => !state.isActive,

  // Transform array (all in one step!)
  processed: (state) => state.items
    .filter(item => item > 2)
    .map(item => item * 2)
});

// No intermediate variables, no if statements, just clean functions!
```

**Think of it like this:**
- Normal update: `count = 10` (I know the exact value)
- Function update: `count = (state) => state.count + 1` (compute from current)

---

## How It Works Under the Hood

When you call `$set(updates)`, the system processes each key-value pair:

```
state.$set({ ... })
        ↓
For each key-value pair:
  ↓
Is the value a function?
  ├─ YES → Call function with current state, use return value
  └─ NO  → Use value directly (like normal assignment)
        ↓
Apply all updates to state
        ↓
Return state (for chaining)
```

**Example:**
```javascript
app.$set({
  count: (state) => state.count + 1,  // Function: call it, use result
  total: 100,                         // Static: use directly
  doubled: (state) => state.count * 2 // Function: call it, use result
});

// Equivalent to:
app.count = app.count + 1;
app.total = 100;
app.doubled = app.count * 2;
```

**The magic:** Functions receive the **current state object**, so you can read any property to compute the new value!

---

## When to Use `$set()`

### ✅ Use Case 1: Counter with History

Track every change to a counter.

```javascript
const counter = state({
  value: 0,
  history: [],
  max: 0,
  min: 0
});

function increment() {
  counter.$set({
    // Increment value
    value: (state) => state.value + 1,

    // Add NEW value to history
    history: (state) => [...state.history, state.value + 1],

    // Update max if new value is higher
    max: (state) => Math.max(state.max, state.value + 1),

    // Update min (in case we go negative later)
    min: (state) => Math.min(state.min, state.value + 1)
  });

  console.log(`Value: ${counter.value}, Max: ${counter.max}`);
}

function decrement() {
  counter.$set({
    value: (state) => state.value - 1,
    history: (state) => [...state.history, state.value - 1],
    max: (state) => Math.max(state.max, state.value - 1),
    min: (state) => Math.min(state.min, state.value - 1)
  });
}

// Usage
increment(); // value: 1, history: [1], max: 1
increment(); // value: 2, history: [1, 2], max: 2
decrement(); // value: 1, history: [1, 2, 1], max: 2, min: 1
```

**Why this works:** Each update depends on the current values. Functions let you compute all related updates together!

---

### ✅ Use Case 2: Todo List Operations

Add, toggle, and filter todos.

```javascript
const todos = state({
  items: [],
  filter: 'all',
  filtered: [],
  activeCount: 0,
  completedCount: 0
});

function addTodo(text) {
  todos.$set({
    // Add new todo to items array
    items: (state) => [
      ...state.items,
      {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date()
      }
    ],

    // Increment active count
    activeCount: (state) => state.activeCount + 1
  });
}

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

function setFilter(newFilter) {
  todos.$set({
    filter: newFilter,

    // Filter based on NEW filter value
    filtered: (state) => {
      if (newFilter === 'active') {
        return state.items.filter(t => !t.completed);
      } else if (newFilter === 'completed') {
        return state.items.filter(t => t.completed);
      }
      return state.items; // 'all'
    }
  });
}

// Usage
addTodo('Buy milk');
addTodo('Call dentist');
toggleTodo(123);  // Toggle specific todo
setFilter('active'); // Show only active
```

**Why this works:** Todo operations need to update multiple related properties. Functions compute everything based on the current state.

---

### ✅ Use Case 3: Shopping Cart with Calculations

Add items and automatically recalculate totals.

```javascript
const cart = state({
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  total: 0
});

function addItem(product, quantity) {
  cart.$set({
    // Add item to cart
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
      // Calculate with the NEW items array
      const newItems = [
        ...state.items,
        { price: product.price, quantity: quantity }
      ];
      return newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Calculate discount (10% off if subtotal > $100)
    discount: (state) => {
      const newSubtotal = state.subtotal + (product.price * quantity);
      return newSubtotal > 100 ? newSubtotal * 0.1 : 0;
    },

    // Calculate tax (on subtotal minus discount)
    tax: (state) => {
      const afterDiscount = state.subtotal - state.discount;
      return afterDiscount * 0.1;
    },

    // Calculate total
    total: (state) => state.subtotal - state.discount + state.tax
  });

  console.log(`Total: $${cart.total.toFixed(2)}`);
}

function updateQuantity(itemId, newQuantity) {
  cart.$set({
    // Update item quantity
    items: (state) => state.items.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity }
        : item
    ),

    // Recalculate all totals
    subtotal: (state) => state.items.reduce((sum, item) => {
      const qty = item.id === itemId ? newQuantity : item.quantity;
      return sum + (item.price * qty);
    }, 0),

    discount: (state) => state.subtotal > 100 ? state.subtotal * 0.1 : 0,
    tax: (state) => (state.subtotal - state.discount) * 0.1,
    total: (state) => state.subtotal - state.discount + state.tax
  });
}

// Usage
addItem({ id: 1, name: 'Laptop', price: 999 }, 1);
addItem({ id: 2, name: 'Mouse', price: 29 }, 2);
updateQuantity(1, 2); // Update laptop quantity to 2
```

**Why this works:** Cart math depends on current values. Functions let you compute cascading calculations (subtotal → discount → tax → total) in one call.

---

### ✅ Use Case 4: Form Validation

Validate form fields with computed error messages.

```javascript
const form = state({
  email: '',
  password: '',
  confirmPassword: '',
  errors: {},
  isValid: false
});

function validateEmail(email) {
  form.$set({
    email: email,

    // Compute errors based on email value
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

    // Form is valid if no errors
    isValid: (state) => Object.keys(state.errors).length === 0
  });
}

function validatePassword(password) {
  form.$set({
    password: password,

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

// Usage
validateEmail('john@example.com'); // Validates and updates errors
validatePassword('mysecret123');   // Validates and updates errors
console.log('Valid?', form.isValid);
```

**Why this works:** Validation logic depends on multiple fields. Functions let you compute errors based on current state values.

---

### ✅ Use Case 5: Game State with Score Multipliers

Update score with level-based multipliers.

```javascript
const game = state({
  player: {
    health: 100,
    score: 0,
    position: { x: 0, y: 0 }
  },
  level: 1,
  enemies: [],
  status: 'playing'
});

function addScore(points) {
  game.$set({
    // Score increases based on current level (multiplier!)
    player: (state) => ({
      ...state.player,
      score: state.player.score + (points * state.level)
    }),

    // Level up every 1000 points
    level: (state) => Math.floor((state.player.score + points) / 1000) + 1,

    // Add enemies when leveling up
    enemies: (state) => {
      const newLevel = Math.floor((state.player.score + points) / 1000) + 1;

      // If we're leveling up, add 3 enemies
      if (newLevel > state.level) {
        return [
          ...state.enemies,
          { id: Date.now(), health: 50, x: 100, y: 100 },
          { id: Date.now() + 1, health: 50, x: 200, y: 200 },
          { id: Date.now() + 2, health: 50, x: 300, y: 300 }
        ];
      }

      return state.enemies;
    }
  });

  console.log(`Score: ${game.player.score}, Level: ${game.level}`);
}

function takeDamage(amount) {
  game.$set({
    // Reduce health (minimum 0)
    player: (state) => ({
      ...state.player,
      health: Math.max(0, state.player.health - amount)
    }),

    // Game over if health reaches 0
    status: (state) => state.player.health <= amount ? 'game-over' : state.status
  });
}

// Usage
addScore(50);  // +50 points at level 1
addScore(950); // +950 points, levels up!
takeDamage(30); // Take 30 damage
```

**Why this works:** Game mechanics involve cascading updates (score → level → enemies). Functions compute everything based on current state.

---

## How `$set()` Interacts With Other Features

### With Effects - Functions Run Once Per Call

```javascript
const app = state({ count: 0, total: 0 });

effect(() => {
  console.log('Effect ran:', app.count, app.total);
});

// Each property update triggers effect
app.$set({
  count: (s) => s.count + 1,  // Effect runs
  total: (s) => s.total + 10  // Effect runs again
});

// Use batch() to run effect only once
batch(() => {
  app.$set({
    count: (s) => s.count + 1,
    total: (s) => s.total + 10
  });
  // Effect runs once after both updates
});
```

**Lesson:** Each property update triggers effects. Use `batch()` to group updates.

---

### With Computed - They Recalculate Automatically

```javascript
const cart = state({ items: [], subtotal: 0 });

cart.$computed('total', function() {
  return this.subtotal * 1.1; // Add 10% tax
});

effect(() => {
  console.log('Total:', cart.total);
});

// Update subtotal with function
cart.$set({
  subtotal: (state) => state.items.reduce((sum, item) => sum + item.price, 0)
});

// cart.total automatically recalculates
// Effect logs the new total
```

**Lesson:** Computed properties react to `$set()` updates just like normal assignments.

---

### With Arrays - Use Array Methods Inside Functions

```javascript
const list = state({ items: [1, 2, 3], doubled: [] });

effect(() => {
  console.log('Items changed:', list.items.length);
});

// Transform arrays with functions
list.$set({
  // Filter even numbers
  items: (state) => state.items.filter(n => n % 2 === 0),

  // Double all numbers
  doubled: (state) => state.items.map(n => n * 2)
});

// Effect runs for items change
console.log(list.items);   // [2]
console.log(list.doubled); // [2, 4, 6]
```

**Lesson:** Array methods work great inside `$set()` functions - filter, map, reduce, etc.

---

## When NOT to Use `$set()`

### ❌ Don't Use for Static Values

```javascript
// ❌ Unnecessary function
app.$set({
  count: (state) => 10  // Just returns 10, why use a function?
});

// ✅ Use static value
app.$set({
  count: 10
});

// ✅ Or just assign directly
app.count = 10;
```

**Why:** Functions are for computing new values based on current state. For static values, just use the value directly!

---

### ❌ Don't Mutate State Inside Functions

```javascript
// ❌ WRONG: Mutating state
app.$set({
  items: (state) => {
    state.items.push(1);  // Mutating!
    return state.items;
  }
});

// ✅ RIGHT: Return new array
app.$set({
  items: (state) => [...state.items, 1]
});
```

**Why:** Functions should return **new values**, not mutate the existing state. Always create new objects/arrays.

---

### ❌ Don't Forget to Return a Value

```javascript
// ❌ WRONG: No return statement
app.$set({
  count: (state) => {
    state.count + 1;  // Forgot 'return'!
  }
});
// count becomes undefined!

// ✅ RIGHT: Return the new value
app.$set({
  count: (state) => {
    return state.count + 1;
  }
});

// ✅ Or use arrow function shorthand
app.$set({
  count: (state) => state.count + 1
});
```

**Why:** If you don't return, the property becomes `undefined`!

---

## Comparison with Related Methods

| Method | Purpose | Uses Functions? | Updates DOM? |
|--------|---------|----------------|--------------|
| `state.prop = value` | Simple assignment | ❌ No | ❌ No |
| `state.$set({...})` | Functional updates | ✅ Yes | ❌ No |
| `state.$update({...})` | State + DOM updates | ❌ No | ✅ Yes |
| `updateAll(state, {...})` | Batch assign | ❌ No | ❌ No |

**When to use which:**
- **Normal assignment** - You know the exact value: `app.count = 10`
- **`$set()`** - Compute from current state: `app.$set({ count: (s) => s.count + 1 })`
- **`$update()`** - Update state AND DOM: `app.$update({ count: 10, '#display': 10 })`
- **`updateAll()`** - Batch assign multiple: `updateAll(app, { count: 10, total: 100 })`

---

## Quick Mental Model

Think of `$set()` like **"update by transformation"**:

```javascript
// Normal assignment: "Set count TO 10"
app.count = 10;

// $set with function: "Set count to WHATEVER IT IS NOW, plus 1"
app.$set({
  count: (state) => state.count + 1
});

// Multiple transformations:
app.$set({
  count: (s) => s.count + 1,        // current + 1
  doubled: (s) => s.count * 2,      // current * 2
  isHigh: (s) => s.count > 10,      // current > 10?
  history: (s) => [...s.history, s.count]  // append current
});
```

**Remember:**
- Functions receive `state` parameter (the current state object)
- Return the NEW value for that property
- You can access ANY property from state to compute the new value

---

## Summary

**`state.$set()` updates state properties using functions that compute new values based on current state.**

**When to use it:**
- ✅ Incrementing/decrementing: `count: (s) => s.count + 1`
- ✅ Toggling booleans: `active: (s) => !s.active`
- ✅ Array transformations: `filtered: (s) => s.items.filter(...)`
- ✅ Cascading calculations: subtotal → discount → tax → total
- ✅ Conditional updates: `status: (s) => s.count > 10 ? 'high' : 'low'`

**When NOT to use it:**
- ❌ Static values (use normal assignment)
- ❌ Don't mutate state inside functions
- ❌ Always return a value from functions

**One-sentence summary:**
Use `$set()` when you need to compute new values based on current state - perfect for increments, toggles, transformations, and calculations! 🎯

---

➡️ **Next:** Learn about [`$bind()`]($bind.md) for automatic DOM bindings, or [`$update()`]($update.md) for state+DOM updates!
