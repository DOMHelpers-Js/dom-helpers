# Understanding `batch()` - A Beginner's Guide

## What is `batch()`?

`batch()` is a **performance optimization function** in the Reactive library that batches multiple state updates into a single reactive update cycle. Instead of triggering effects after each state change, it collects all changes and triggers effects only once at the end.

Think of it as **grouping updates together** - when you make multiple state changes inside `batch()`, all effects wait until you're done, then run once with the final values.

---

## Syntax

```js
// Using the shortcut
batch(fn)

// Using the full namespace
ReactiveUtils.batch(fn)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`batch()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.batch()`) - Explicit and clear

**Parameters:**
- `fn` (Function): The function containing state updates to batch

**Returns:**
- The return value of the function

---

## Why Does This Exist?

### The Problem with Multiple Updates

When you update state multiple times, effects run after each change:

```javascript
// Without batching - effects run 3 times!
const user = state({
  firstName: 'John',
  lastName: 'Doe',
  age: 25
});

effect(() => {
  console.log('Effect running:', user.firstName, user.lastName, user.age);
  document.getElementById('userInfo').textContent =
    `${user.firstName} ${user.lastName}, ${user.age}`;
});

// Each update triggers the effect
user.firstName = 'Jane';  // Effect runs (1)
user.lastName = 'Smith';   // Effect runs (2)
user.age = 30;            // Effect runs (3)

// Effect ran 3 times for a single logical update!
```

**What's the Real Issue?**

**Problems:**
- Effects run multiple times for related updates
- Intermediate states are visible (e.g., "Jane Doe" before lastName changes)
- Wasted computations
- Potential performance issues
- DOM updated multiple times unnecessarily

**Why This Becomes a Problem:**

For multiple related updates:
❌ Effects run too many times
❌ Performance overhead
❌ Inconsistent intermediate states
❌ Multiple DOM reflows
❌ Wasted CPU cycles

In other words, **multiple state updates trigger too many effect runs**.
There should be a way to group updates together.

---

### The Solution with `batch()`

When you use `batch()`, all updates are grouped and effects run once:

```javascript
// With batching - effect runs ONCE!
const user = state({
  firstName: 'John',
  lastName: 'Doe',
  age: 25
});

effect(() => {
  console.log('Effect running:', user.firstName, user.lastName, user.age);
  document.getElementById('userInfo').textContent =
    `${user.firstName} ${user.lastName}, ${user.age}`;
});

batch(() => {
  user.firstName = 'Jane';
  user.lastName = 'Smith';
  user.age = 30;
});
// Effect runs ONCE with final values: "Jane Smith, 30"

// Clean, efficient, and correct!
```

**What Just Happened?**

With `batch()`:
- All three updates collected
- Effects wait until batch completes
- Effects run once with final values
- No intermediate states
- Better performance

**Benefits:**
- Fewer effect executions
- Better performance
- Consistent state
- One DOM update
- Cleaner semantics

---

## How Does It Work?

### Under the Hood

`batch()` pauses reactive updates, executes the function, then flushes:

```
batch(fn)
        ↓
1. Increment batch depth (pause reactivity)
2. Execute fn (collect updates)
3. Decrement batch depth
4. If depth === 0, flush all pending effects
        ↓
Effects run once with final state
```

**What happens:**

1. Increases the batch depth counter
2. While batch depth > 0, effects are queued but not run
3. Executes your function (all state updates are tracked)
4. Decreases the batch depth counter
5. When batch depth reaches 0, flushes all pending effects
6. Effects run once with the final state values

---

## Basic Usage

### Batching Multiple Updates

The simplest way to use `batch()`:

```js
// Using the shortcut style
const app = state({
  count: 0,
  step: 1,
  total: 0
});

effect(() => {
  console.log('Effect:', app.count, app.step, app.total);
});

batch(() => {
  app.count = 10;
  app.step = 5;
  app.total = 50;
});
// Effect runs ONCE

// Or using the namespace style
ReactiveUtils.batch(() => {
  app.count = 10;
  app.step = 5;
  app.total = 50;
});
```

### Returning Values

`batch()` returns the function's return value:

```js
const result = batch(() => {
  user.firstName = 'Jane';
  user.lastName = 'Smith';
  return `Updated to ${user.firstName} ${user.lastName}`;
});

console.log(result); // "Updated to Jane Smith"
```

### Nested Batches

Batches can be nested:

```js
batch(() => {
  app.count = 10;

  batch(() => {
    app.step = 5;
    app.total = 50;
  });

  app.message = 'Done';
});
// Effects run once after all batches complete
```

### Form Updates

Batch form field updates:

```js
const form = state({
  username: '',
  email: '',
  password: ''
});

effect(() => {
  console.log('Form changed:', form.username, form.email);
});

function loadUserData(userData) {
  batch(() => {
    form.username = userData.username;
    form.email = userData.email;
    form.password = ''; // Clear password
  });
  // Effect runs once
}
```

---

## Common Use Cases

### Use Case 1: Bulk State Updates

Update multiple properties at once:

```js
const dashboard = state({
  visitors: 0,
  pageViews: 0,
  revenue: 0,
  conversions: 0,
  lastUpdated: null
});

effect(() => {
  // Expensive DOM update
  updateDashboardUI(dashboard);
});

async function fetchDashboardData() {
  const data = await fetch('/api/dashboard').then(r => r.json());

  batch(() => {
    dashboard.visitors = data.visitors;
    dashboard.pageViews = data.pageViews;
    dashboard.revenue = data.revenue;
    dashboard.conversions = data.conversions;
    dashboard.lastUpdated = new Date();
  });
  // UI updates once with all new data
}
```

### Use Case 2: Array Operations

Batch array modifications:

```js
const todos = state({
  items: []
});

effect(() => {
  renderTodoList(todos.items);
});

function loadTodos(todoData) {
  batch(() => {
    todos.items = [];
    todoData.forEach(todo => {
      todos.items.push(todo);
    });
  });
  // Renders once with all todos
}

function completeAll() {
  batch(() => {
    todos.items.forEach(todo => {
      todo.completed = true;
    });
  });
  // Renders once after all marked complete
}
```

### Use Case 3: Calculated Values

Update related calculated values:

```js
const cart = state({
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0
});

effect(() => {
  updateCartDisplay(cart);
});

function recalculateCart() {
  batch(() => {
    cart.subtotal = cart.items.reduce((sum, item) =>
      sum + (item.price * item.quantity), 0
    );

    cart.tax = cart.subtotal * 0.1;
    cart.shipping = cart.subtotal > 50 ? 0 : 5.99;
    cart.total = cart.subtotal + cart.tax + cart.shipping;
  });
  // Display updates once with all calculated values
}
```

### Use Case 4: Animation State

Update animation properties together:

```js
const animation = state({
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  opacity: 1
});

effect(() => {
  applyTransform(element, animation);
});

function animateElement(props) {
  batch(() => {
    animation.x = props.x;
    animation.y = props.y;
    animation.rotation = props.rotation;
    animation.scale = props.scale;
    animation.opacity = props.opacity;
  });
  // Single animation frame update
}
```

### Use Case 5: Game State Updates

Update game state each frame:

```js
const game = state({
  score: 0,
  level: 1,
  health: 100,
  ammo: 30,
  enemies: [],
  powerups: []
});

effect(() => {
  renderGameState(game);
});

function gameLoop(deltaTime) {
  batch(() => {
    // Update all game state
    updatePlayerPosition(deltaTime);
    updateEnemies(deltaTime);
    updatePowerups(deltaTime);
    updateScore();
    checkCollisions();

    // All state changes batched
    if (game.health <= 0) {
      game.gameOver = true;
    }
  });
  // Renders once per frame
}
```

---

## Advanced Patterns

### Pattern 1: Conditional Batching

Only batch when needed:

```js
function updateState(updates, shouldBatch = true) {
  const doUpdate = () => {
    Object.entries(updates).forEach(([key, value]) => {
      state[key] = value;
    });
  };

  if (shouldBatch) {
    batch(doUpdate);
  } else {
    doUpdate();
  }
}

// Batch multiple updates
updateState({ name: 'John', age: 25 }, true);

// Don't batch single update
updateState({ name: 'Jane' }, false);
```

### Pattern 2: Async Operations with Batching

Batch updates after async operations:

```js
async function loadUserProfile(userId) {
  const [profile, posts, friends] = await Promise.all([
    fetch(`/api/users/${userId}`).then(r => r.json()),
    fetch(`/api/users/${userId}/posts`).then(r => r.json()),
    fetch(`/api/users/${userId}/friends`).then(r => r.json())
  ]);

  batch(() => {
    user.profile = profile;
    user.posts = posts;
    user.friends = friends;
    user.loading = false;
  });
}
```

### Pattern 3: Transaction-like Updates

Rollback on error:

```js
function updateWithRollback(updates) {
  const backup = Object.keys(updates).reduce((acc, key) => {
    acc[key] = state[key];
    return acc;
  }, {});

  try {
    batch(() => {
      Object.entries(updates).forEach(([key, value]) => {
        if (typeof value === 'function') {
          const newValue = value(state[key]);
          if (newValue === undefined) {
            throw new Error(`Invalid update for ${key}`);
          }
          state[key] = newValue;
        } else {
          state[key] = value;
        }
      });
    });
  } catch (error) {
    // Rollback on error
    batch(() => {
      Object.entries(backup).forEach(([key, value]) => {
        state[key] = value;
      });
    });
    throw error;
  }
}
```

### Pattern 4: Batch Performance Monitoring

Track batch performance:

```js
function monitoredBatch(fn, label = 'batch') {
  const start = performance.now();

  const result = batch(() => {
    console.log(`[${label}] Starting batch`);
    return fn();
  });

  const duration = performance.now() - start;
  console.log(`[${label}] Completed in ${duration.toFixed(2)}ms`);

  return result;
}

monitoredBatch(() => {
  state.count = 100;
  state.items = Array.from({ length: 1000 }, (_, i) => i);
}, 'Large Update');
```

---

## Performance Tips

### Tip 1: Always Batch Related Updates

Group logical updates:

```js
// BAD - three separate updates
user.firstName = 'Jane';
user.lastName = 'Smith';
user.email = 'jane@example.com';

// GOOD - batched
batch(() => {
  user.firstName = 'Jane';
  user.lastName = 'Smith';
  user.email = 'jane@example.com';
});
```

### Tip 2: Batch Array Operations

Especially important for arrays:

```js
// BAD - triggers effect for each push
items.forEach(item => {
  state.list.push(item);
});

// GOOD - batched
batch(() => {
  items.forEach(item => {
    state.list.push(item);
  });
});
```

### Tip 3: Use Built-in State Batching

State methods like `$batch()` use batching internally:

```js
// These already batch internally
state.$batch(() => {
  state.count++;
  state.total += 10;
});

state.$update({ count: 10, total: 100 });
```

---

## Common Pitfalls

### Pitfall 1: Batching Single Updates

**Problem:** Unnecessary batch for one update:

```js
// WRONG - no benefit
batch(() => {
  state.count = 10;
});

// RIGHT - batch only for multiple updates
state.count = 10;

// GOOD - batch multiple
batch(() => {
  state.count = 10;
  state.total = 100;
});
```

### Pitfall 2: Async Code Inside Batch

**Problem:** Async operations break batching:

```js
// WRONG - doesn't batch the async part
batch(async () => {
  state.loading = true;
  const data = await fetchData(); // Batch ends here!
  state.data = data; // Not batched!
  state.loading = false; // Not batched!
});

// RIGHT - batch the sync updates
state.loading = true;
const data = await fetchData();
batch(() => {
  state.data = data;
  state.loading = false;
});
```

### Pitfall 3: Ignoring Return Value

**Problem:** Not capturing the return value when needed:

```js
// BAD - ignores return value
batch(() => {
  state.count++;
  return state.count;
});

// GOOD - capture return value
const newCount = batch(() => {
  state.count++;
  return state.count;
});
console.log('New count:', newCount);
```

### Pitfall 4: Over-batching

**Problem:** Batching unrelated updates:

```js
// BAD - unrelated updates batched together
batch(() => {
  userState.name = 'John';
  cartState.items = [];
  settingsState.theme = 'dark';
});

// GOOD - separate batches for separate concerns
batch(() => {
  userState.name = 'John';
});

batch(() => {
  cartState.items = [];
});
```

---

## Related Functions

### `pause()` and `resume()`

Manual control over batching:

```js
// Pause reactivity
pause();

state.count = 10;
state.total = 100;
// Effects not triggered yet

// Resume and optionally flush
resume(true); // Flushes effects
```

### `state.$batch()`

State-specific batching:

```js
state.$batch(() => {
  state.count++;
  state.total += 10;
});
```

---

## Summary

**`batch()` groups multiple state updates for efficient reactive updates.**

Key takeaways:
- ✅ **Performance optimization** - reduces effect executions
- ✅ Both **shortcut** (`batch()`) and **namespace** (`ReactiveUtils.batch()`) styles are valid
- ✅ Takes a **function** containing state updates
- ✅ Effects run **once** after all updates
- ✅ Returns the **function's return value**
- ✅ Prevents **intermediate states**
- ✅ Reduces **DOM updates**
- ✅ Great for **bulk updates**, **array operations**, **calculations**
- ⚠️ Don't use for **single updates**
- ⚠️ **Async operations** break batching
- ⚠️ Nest batches carefully

**Remember:** `batch()` is essential for performance when making multiple related state updates. Always batch bulk operations, array modifications, and calculated value updates! 🎉

➡️ Next, explore [`pause()`/`resume()`](pause-resume.md) for manual control or [`untrack()`](untrack.md) for dependency-free reads!
