[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Updating Reactive State

## Quick Start (30 seconds)

```javascript
const app = state({ count: 0, name: 'Alice' });

// Method 1: Direct assignment
app.count = 5;
app.name = 'Bob';

// Method 2: Functional update with set()
set(app, {
  count: prev => prev + 1,
  name: prev => prev.toUpperCase()
});

// Method 3: Batch multiple updates (single update cycle)
batch(() => {
  app.count = 10;
  app.name = 'Charlie';
  app.isActive = true;
});
```

---

## What is Updating State?

Updating reactive state means **changing the data** so that everything depending on it can react.

In the reactive system, there are three main ways to update state:

1. **Direct assignment** — the simplest and most common approach
2. **`set()` function** — for functional updates using the previous value
3. **`batch()` function** — for grouping multiple changes into one update cycle

Each method has its own use cases. Understanding when to use each makes your code cleaner and more efficient.

---

## Syntax

```javascript
// Direct assignment — change a property
myState.property = newValue;

// set() — functional update using previous value
set(myState, {
  property: prev => prev + 1,   // Function receives current value
  other: newValue                 // Or just a direct value
});

// batch() — group multiple changes
batch(() => {
  myState.a = 1;
  myState.b = 2;
  myState.c = 3;
  // All three changes run as a single update
});
```

---

## Why Does This Exist?

### Direct Assignment vs `set()` — When Each Shines

#### Direct Assignment — When You Already Know the New Value

Direct assignment is the most natural approach. Use it when you have the new value ready:

```javascript
const app = state({ theme: 'light', name: '' });

// Perfect for direct assignments
app.theme = 'dark';
app.name = 'Alice';
app.isLoggedIn = true;
```

This approach is great when you need:
✅ Setting a known value
✅ Simple, readable one-liners
✅ Resetting to a fixed default
✅ Toggling with a stored reference

#### `set()` — When You Need the Current Value to Compute the Next

In scenarios where the new value depends on the current one, `set()` provides a more precise approach:

```javascript
const counter = state({ count: 0, score: 0 });

// Using set() for functional updates
set(counter, {
  count: prev => prev + 1,      // Increment based on current
  score: prev => prev * 2       // Double based on current
});
```

`set()` is especially useful when:
✅ Incrementing or decrementing numbers
✅ Toggling booleans reliably
✅ Transforming strings or arrays
✅ Running in async contexts where value might have changed

**The choice is yours:**
- Use direct assignment when you have the final value ready
- Use `set()` when the new value depends on the current value
- Both approaches are valid and can be combined freely

**Benefits of `set()`:**
✅ Always works with the latest value
✅ Reduces bugs from stale references in async code
✅ Makes transformation logic clear and readable
✅ Handles multiple properties elegantly

---

## Mental Model

### A Reliable Update Desk

Think of state updates like leaving a note at an **update desk**.

```
Direct Assignment:
┌─────────────────────────────────────────────┐
│  "Change the count to 5."                   │
│                                             │
│  You know the final value.                  │
│  You give the exact instruction.            │
└─────────────────────────────────────────────┘

Functional Update with set():
┌─────────────────────────────────────────────┐
│  "Whatever the count is right now,          │
│   add 1 to it."                             │
│                                             │
│  You don't need to know the current value.  │
│  The instruction carries the logic.         │
└─────────────────────────────────────────────┘
```

The functional update is safer in concurrent scenarios — it always computes from the actual current value, not a captured snapshot.

---

## How Does It Work?

### What Happens When You Change State

Every state update, regardless of method, follows the same internal flow:

```
app.count = 5     (or set(), or batch())
       ↓
Proxy SET trap fires
       ↓
Check: did the value actually change?
  - If no → skip (nothing happens)
  - If yes → continue
       ↓
Store the new value
       ↓
Find all effects/watchers depending on this property
       ↓
Queue them for re-run
       ↓
If not in a batch: flush immediately
If inside batch: wait until batch ends, then flush
       ↓
Effects re-run → UI updates ✨
```

### The Change Check

The system only triggers updates when the value **actually changes**. Setting the same value again does nothing:

```javascript
const app = state({ count: 5 });

effect(() => {
  console.log('Effect ran! Count:', app.count);
});
// Output: "Effect ran! Count: 5"

app.count = 5;  // Same value — no update triggered
// No output

app.count = 6;  // Different value — update triggered
// Output: "Effect ran! Count: 6"
```

This prevents unnecessary re-renders and keeps performance efficient.

---

## Basic Usage

### Method 1: Direct Assignment

The most straightforward way to update state:

```javascript
const profile = state({
  name: 'Alice',
  age: 25,
  isActive: true,
  score: 100
});

// Simple reassignment
profile.name = 'Bob';
profile.age = 26;
profile.isActive = false;
profile.score = 150;

// Arithmetic
profile.score += 50;
profile.age++;

// Conditionals
profile.isActive = profile.age > 18;

// Computed from other state
profile.score = profile.age * 10;
```

### Method 2: Using `set()` for Functional Updates

`set()` accepts either a direct value or a function that receives the current value:

```javascript
const app = state({ count: 0, name: 'alice', items: [] });

// Direct values — same as assignment
set(app, {
  count: 5,
  name: 'bob'
});

// Functional updates — compute from current value
set(app, {
  count: prev => prev + 1,            // 5 → 6
  name: prev => prev.toUpperCase(),    // "bob" → "BOB"
  items: prev => [...prev, 'new']     // Add to array
});

// Mix of direct and functional
set(app, {
  count: 0,                           // Reset to 0 directly
  name: prev => `Hello, ${prev}`      // Transform current name
});
```

### Method 3: Batching Multiple Updates

Use `batch()` when making several changes that should trigger only one update cycle:

```javascript
const dashboard = state({
  users: 0,
  revenue: 0,
  isLoading: false,
  lastUpdated: null
});

// Without batch — 4 separate update cycles
dashboard.users = 1500;
dashboard.revenue = 45000;
dashboard.isLoading = false;
dashboard.lastUpdated = new Date();

// With batch — 1 update cycle
batch(() => {
  dashboard.users = 1500;
  dashboard.revenue = 45000;
  dashboard.isLoading = false;
  dashboard.lastUpdated = new Date();
});
```

Both achieve the same result. With `batch()`, effects only run once after all four changes are applied, which is more efficient.

---

## Deep Dive: `set()` In Detail

### The Two Forms

`set()` accepts two types of values for each property:

```javascript
const app = state({ count: 5, name: 'Alice', active: true });

set(app, {
  // Form 1: Direct value
  name: 'Bob',              // Replaces with 'Bob'

  // Form 2: Function (receives current value, returns new value)
  count: prev => prev + 1, // Receives 5, returns 6
  active: prev => !prev    // Receives true, returns false
});

// Result: { count: 6, name: 'Bob', active: false }
```

### Why Functional Updates Matter in Async Code

```javascript
const counter = state({ count: 0 });

// Imagine multiple async operations running
async function operation1() {
  await fetch('/api/data');  // Wait for network
  counter.count = counter.count + 1;  // ⚠️ Uses captured snapshot
}

async function operation2() {
  await fetch('/api/other');  // Different wait time
  counter.count = counter.count + 1;  // ⚠️ Also uses captured snapshot
}

// Both might read count = 0 before either finishes
// Both would set count = 1 instead of count = 2
```

With `set()`, each operation works with the real current value:

```javascript
async function operation1() {
  await fetch('/api/data');
  set(counter, { count: prev => prev + 1 });  // ✅ Uses actual current value
}

async function operation2() {
  await fetch('/api/other');
  set(counter, { count: prev => prev + 1 });  // ✅ Uses actual current value
}

// Each operation correctly increments from the current value
// Final count is 2, not 1
```

### Practical `set()` Patterns

#### Toggle a Boolean

```javascript
const ui = state({ isOpen: false, isDark: false });

// Toggle with set()
set(ui, { isOpen: prev => !prev });
set(ui, { isDark: prev => !prev });
```

#### Append to an Array

```javascript
const todos = state({ items: [] });

function addTodo(text) {
  set(todos, {
    items: prev => [...prev, { id: Date.now(), text, done: false }]
  });
}
```

#### Remove From an Array

```javascript
const todos = state({ items: ['a', 'b', 'c'] });

function removeTodo(id) {
  set(todos, {
    items: prev => prev.filter(item => item.id !== id)
  });
}
```

#### Update a Specific Item in an Array

```javascript
const todos = state({ items: [
  { id: 1, text: 'Buy groceries', done: false },
  { id: 2, text: 'Walk the dog', done: false }
]});

function toggleTodo(id) {
  set(todos, {
    items: prev => prev.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    )
  });
}
```

#### Merge Into an Object

```javascript
const user = state({
  name: 'Alice',
  email: '',
  bio: ''
});

// Update multiple nested fields
set(user, {
  email: 'alice@example.com',
  bio: 'Hello, I am Alice.'
});
```

---

## Deep Dive: `batch()` In Detail

### When Batch Matters

Each state change normally triggers all dependent effects. If you change three properties, effects might run three times. Batching collapses this into one run:

```javascript
const stats = state({ clicks: 0, views: 0, conversions: 0 });

effect(() => {
  // This effect reads all three properties
  console.log(`Clicks: ${stats.clicks}, Views: ${stats.views}, Conv: ${stats.conversions}`);
});
// Output: "Clicks: 0, Views: 0, Conv: 0"

// Without batch — effect runs 3 times
stats.clicks++;    // Effect runs: "Clicks: 1, Views: 0, Conv: 0"
stats.views++;     // Effect runs: "Clicks: 1, Views: 1, Conv: 0"
stats.conversions++; // Effect runs: "Clicks: 1, Views: 1, Conv: 1"

// With batch — effect runs once
batch(() => {
  stats.clicks++;
  stats.views++;
  stats.conversions++;
});
// Effect runs once: "Clicks: 1, Views: 1, Conv: 1"
```

### Nested Batch Calls

`batch()` calls can be nested. The outer batch controls when the flush happens:

```javascript
batch(() => {
  app.a = 1;         // Queued

  batch(() => {
    app.b = 2;       // Queued
    app.c = 3;       // Queued
  });                // Inner batch ends — NOT flushed yet (outer is still open)

  app.d = 4;         // Queued
});                  // Outer batch ends — ALL updates flush now
// Effects run once with all four changes
```

### Batch with `set()`

You can use `set()` inside a `batch()`:

```javascript
batch(() => {
  app.name = 'Alice';              // Direct assignment
  set(app, { count: prev => prev + 1 });  // Functional update
  app.isActive = true;             // Direct assignment
});
// All three changes apply in one update cycle
```

### Common Batch Use Cases

```javascript
// Loading data from an API
async function loadDashboard() {
  const [users, revenue, orders] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/revenue').then(r => r.json()),
    fetch('/api/orders').then(r => r.json())
  ]);

  // Apply all data in one batch — one update cycle
  batch(() => {
    dashboard.users = users.total;
    dashboard.revenue = revenue.total;
    dashboard.orders = orders.total;
    dashboard.isLoading = false;
    dashboard.lastUpdated = new Date();
  });
}

// Resetting a form
function resetForm() {
  batch(() => {
    form.name = '';
    form.email = '';
    form.message = '';
    form.isSubmitting = false;
    form.error = null;
  });
}

// Applying user preferences
function applyPreferences(prefs) {
  batch(() => {
    settings.theme = prefs.theme;
    settings.language = prefs.language;
    settings.fontSize = prefs.fontSize;
    settings.notifications = prefs.notifications;
  });
}
```

---

## Updating Nested State

### Direct Property Update on Nested Objects

```javascript
const store = state({
  user: {
    name: 'Alice',
    address: {
      city: 'New York'
    }
  }
});

// Update nested property directly — deep reactivity handles it
store.user.name = 'Bob';
store.user.address.city = 'Los Angeles';
```

### Replacing a Nested Object

```javascript
const store = state({
  user: {
    name: 'Alice',
    age: 25
  }
});

// Replace the entire nested object
store.user = { name: 'Bob', age: 30 };  // ✅ Tracked
```

### Updating Arrays in State

```javascript
const app = state({ items: ['apple', 'banana'] });

// Method 1: Reassign with spread (always works)
app.items = [...app.items, 'cherry'];

// Method 2: Use set() with functional update
set(app, {
  items: prev => [...prev, 'cherry']
});

// Method 3: If array patch module is loaded, push() works reactively
app.items.push('cherry');
```

---

## Common Mistakes

### Mistake 1: Expecting a Return Value From Direct Assignment

```javascript
const app = state({ count: 0 });

// ❌ Direct assignment returns the value, not the state
const result = app.count = 5;
console.log(result);  // 5 (the value, not useful)

// ✅ set() returns the state for chaining
const updated = set(app, { count: 5 });
// updated is the state object
```

### Mistake 2: Not Using `batch()` for Related Changes

```javascript
// ❌ Can cause intermediate states — effects run between each line
app.firstName = 'Bob';    // Effect runs: "Hello, Bob undefined"
app.lastName = 'Smith';   // Effect runs: "Hello, Bob Smith"

// ✅ With batch — effects only run with the final state
batch(() => {
  app.firstName = 'Bob';
  app.lastName = 'Smith';
});
// Effect runs once: "Hello, Bob Smith"
```

### Mistake 3: Mutating Arrays Without Reactivity

```javascript
const app = state({ items: [1, 2, 3] });

// ❌ May not trigger reactivity if array patch is not loaded
app.items.push(4);

// ✅ Always works — reassignment is always tracked
app.items = [...app.items, 4];
```

---

## Summary

**Three ways to update reactive state:**

| Method | When to Use | Example |
|--------|-------------|---------|
| Direct assignment | You know the new value | `app.count = 5` |
| `set()` | New value depends on current | `set(app, { count: prev => prev + 1 })` |
| `batch()` | Multiple related changes | `batch(() => { ... })` |

**Key rules:**
- Direct assignment is the most readable — use it by default
- `set()` is more reliable when the new value depends on the current one
- `batch()` improves performance by collapsing multiple changes into one update
- Changes to the same value twice (without changing) are ignored — the system is smart about this
- Nested object properties are reactive too — you don't need special handling

**The core principle:** Update the data. The reactive system handles the rest.

---

## What's Next?

Now that you know how to create and update state, let's learn about **effects** — the powerful mechanism that runs code automatically when state changes.

Continue to: [04 — Effects](./04_effects.md)