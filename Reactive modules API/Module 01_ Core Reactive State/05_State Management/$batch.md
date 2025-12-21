# Understanding `state.$batch()` - A Beginner's Guide

## What is `state.$batch()`?

`state.$batch()` is a **state instance method** that batches multiple state updates into a single reactive update cycle. Instead of triggering effects after each property change, it collects all changes and triggers effects only once at the end.

Think of it as **grouping updates together** - when you make multiple changes to the same state object inside `$batch()`, all effects wait until you're done, then run once with the final values.

---

## Syntax

```js
state.$batch(fn)
```

**Parameters:**
- `fn` (Function): Function containing state updates to batch

**Returns:**
- The return value of the function

---

## Why Does This Exist?

### The Problem with Multiple Updates

When you update the same state multiple times, effects run after each change:

```javascript
// Without batching - effects run 3 times!
const user = state({
  firstName: 'John',
  lastName: 'Doe',
  age: 25
});

effect(() => {
  // This effect runs after EACH property change
  console.log('Effect running:', user.firstName, user.lastName, user.age);
  document.getElementById('userInfo').textContent =
    `${user.firstName} ${user.lastName}, ${user.age}`;
});

// Each update triggers the effect separately
user.firstName = 'Jane';  // Effect runs (1) - "Jane Doe, 25"
user.lastName = 'Smith';   // Effect runs (2) - "Jane Smith, 25"
user.age = 30;            // Effect runs (3) - "Jane Smith, 30"

// Effect ran 3 times for what should be a single logical update!
```

**What's the Real Issue?**

**Problems:**
- Effects run multiple times for related updates
- Intermediate states visible (e.g., "Jane Doe" before lastName changes)
- Wasted computations
- Multiple DOM updates
- Performance overhead

---

### The Solution with `$batch()`

When you use `$batch()`, all updates are grouped and effects run once:

```javascript
// With $batch() - effect runs ONCE!
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

// Batch all updates together
user.$batch(() => {
  user.firstName = 'Jane';   // Queued
  user.lastName = 'Smith';   // Queued
  user.age = 30;            // Queued
});
// Effect runs ONCE with final values: "Jane Smith, 30"

// Clean, efficient, and correct!
```

**Benefits:**
- Single effect execution
- No intermediate states
- Better performance
- One DOM update
- Cleaner semantics

---

## How Does It Work?

### Under the Hood

`$batch()` pauses reactive updates, executes the function, then flushes:

```
state.$batch(fn)
        ↓
1. Increment batch depth (pause reactivity)
2. Execute fn (collect all state updates)
3. Decrement batch depth
4. If depth === 0, flush all pending effects
        ↓
Effects run once with final state
```

---

## Basic Usage

### Batch Multiple Property Updates

```js
const app = state({
  count: 0,
  step: 1,
  total: 0
});

effect(() => {
  console.log('Effect:', app.count, app.step, app.total);
});

// Batch multiple updates
app.$batch(() => {
  app.count = 10;   // Update count
  app.step = 5;     // Update step
  app.total = 50;   // Update total
});
// Effect runs ONCE: "Effect: 10 5 50"
```

### Return Values from Batch

```js
const user = state({
  firstName: '',
  lastName: ''
});

// $batch() returns the function's return value
const result = user.$batch(() => {
  user.firstName = 'Jane';
  user.lastName = 'Smith';
  return `Updated to ${user.firstName} ${user.lastName}`;
});

console.log(result); // "Updated to Jane Smith"
```

### Nested Batches

```js
const app = state({
  count: 0,
  step: 1,
  total: 0
});

effect(() => {
  console.log('Updated:', app.count, app.step, app.total);
});

// Outer batch
app.$batch(() => {
  app.count = 10;

  // Inner batch (nested)
  app.$batch(() => {
    app.step = 5;
    app.total = 50;
  });

  app.count = 20; // Override previous value
});
// Effect runs once after all batches: "Updated: 20 5 50"
```

---

## Common Use Cases

### Use Case 1: Form Population

```js
const form = state({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

effect(() => {
  // Validate form whenever it changes
  validateForm(form);
});

// Load user data and populate form
function loadUserData(userData) {
  form.$batch(() => {
    // Update all form fields at once
    form.username = userData.username;
    form.email = userData.email;
    form.password = '';           // Clear password
    form.confirmPassword = '';    // Clear confirm password
  });
  // Validation runs once with all new data
}

loadUserData({
  username: 'john_doe',
  email: 'john@example.com'
});
```

### Use Case 2: Bulk List Updates

```js
const todos = state({
  items: []
});

effect(() => {
  // Re-render list whenever items change
  renderTodoList(todos.items);
});

// Load multiple todos at once
function loadTodos(todoData) {
  todos.$batch(() => {
    // Clear existing items
    todos.items = [];

    // Add all new items
    todoData.forEach(todo => {
      todos.items.push(todo);
    });
  });
  // List renders once with all todos
}

loadTodos([
  { id: 1, text: 'Task 1', completed: false },
  { id: 2, text: 'Task 2', completed: true },
  { id: 3, text: 'Task 3', completed: false }
]);
```

### Use Case 3: Shopping Cart Calculations

```js
const cart = state({
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0
});

effect(() => {
  // Update cart display
  updateCartDisplay(cart);
});

// Recalculate all cart totals
function recalculateCart() {
  cart.$batch(() => {
    // Calculate subtotal from items
    cart.subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Calculate tax (10%)
    cart.tax = cart.subtotal * 0.1;

    // Free shipping over $50, otherwise $5.99
    cart.shipping = cart.subtotal > 50 ? 0 : 5.99;

    // Calculate final total
    cart.total = cart.subtotal + cart.tax + cart.shipping;
  });
  // Display updates once with all calculated values
}

// Add item and recalculate
cart.items.push({ price: 25.99, quantity: 2 });
recalculateCart();
```

### Use Case 4: Animation State Updates

```js
const animation = state({
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  opacity: 1
});

effect(() => {
  // Apply all transform properties to element
  applyTransform(element, animation);
});

// Update animation frame
function updateAnimationFrame(props) {
  animation.$batch(() => {
    // Update all animation properties at once
    animation.x = props.x;
    animation.y = props.y;
    animation.rotation = props.rotation;
    animation.scale = props.scale;
    animation.opacity = props.opacity;
  });
  // Single animation frame update
}

updateAnimationFrame({
  x: 100,
  y: 50,
  rotation: 45,
  scale: 1.5,
  opacity: 0.8
});
```

### Use Case 5: Game State Update Per Frame

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
  // Render entire game state
  renderGameState(game);
});

// Game loop - update all state each frame
function gameLoop(deltaTime) {
  game.$batch(() => {
    // Update player position based on input
    updatePlayerPosition(deltaTime);

    // Update all enemies
    updateEnemies(game.enemies, deltaTime);

    // Update all powerups
    updatePowerups(game.powerups, deltaTime);

    // Update score based on actions
    updateScore(game);

    // Check all collisions
    checkCollisions(game);

    // Update health/ammo based on events
    if (game.health <= 0) {
      game.gameOver = true;
    }
  });
  // Renders once per frame with all updates
}

// Called every frame (~60 times per second)
requestAnimationFrame(gameLoop);
```

---

## Advanced Patterns

### Pattern 1: Conditional Batching

```js
const state = state({ count: 0, total: 0 });

// Function that optionally batches
function updateState(updates, shouldBatch = true) {
  const doUpdate = () => {
    Object.entries(updates).forEach(([key, value]) => {
      state[key] = value;
    });
  };

  if (shouldBatch) {
    // Batch the updates
    state.$batch(doUpdate);
  } else {
    // Update immediately without batching
    doUpdate();
  }
}

// Batch multiple updates
updateState({ count: 10, total: 100 }, true);

// Don't batch single update
updateState({ count: 20 }, false);
```

### Pattern 2: Batch with Error Handling

```js
const data = state({
  items: [],
  valid: true
});

// Batch with validation and rollback on error
function safeUpdate(updateFn) {
  // Save current state
  const backup = { ...toRaw(data) };

  try {
    data.$batch(() => {
      updateFn(data);

      // Validate after updates
      if (data.items.length > 100) {
        throw new Error('Too many items');
      }
    });
  } catch (error) {
    // Rollback on error
    console.error('Update failed:', error);
    Object.assign(data, backup);
  }
}

safeUpdate((state) => {
  state.items = Array(50).fill({ value: 1 }); // OK
});

safeUpdate((state) => {
  state.items = Array(150).fill({ value: 1 }); // Fails, rolls back
});
```

### Pattern 3: Async Operations with Batching

```js
const app = state({
  profile: null,
  posts: [],
  friends: [],
  loading: false
});

// Load multiple async resources
async function loadUserProfile(userId) {
  app.loading = true;

  // Fetch all data in parallel
  const [profile, posts, friends] = await Promise.all([
    fetch(`/api/users/${userId}`).then(r => r.json()),
    fetch(`/api/users/${userId}/posts`).then(r => r.json()),
    fetch(`/api/users/${userId}/friends`).then(r => r.json())
  ]);

  // Batch all updates together
  app.$batch(() => {
    app.profile = profile;
    app.posts = posts;
    app.friends = friends;
    app.loading = false;
  });
  // UI updates once with all data
}

loadUserProfile(123);
```

### Pattern 4: Performance Monitoring

```js
const state = state({ items: [] });

// Monitor batch performance
function monitoredBatch(fn, label = 'batch') {
  const start = performance.now();

  const result = state.$batch(() => {
    console.log(`[${label}] Starting batch`);
    return fn();
  });

  const duration = performance.now() - start;
  console.log(`[${label}] Completed in ${duration.toFixed(2)}ms`);

  return result;
}

// Use monitored batch
monitoredBatch(() => {
  state.items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    value: Math.random()
  }));
}, 'Large Update');
// Logs: [Large Update] Starting batch
// Logs: [Large Update] Completed in 2.34ms
```

---

## Performance Tips

### Tip 1: Always Batch Related Updates

```js
// BAD - three separate updates, three effect runs
user.firstName = 'Jane';
user.lastName = 'Smith';
user.email = 'jane@example.com';

// GOOD - batched, one effect run
user.$batch(() => {
  user.firstName = 'Jane';
  user.lastName = 'Smith';
  user.email = 'jane@example.com';
});
```

### Tip 2: Batch Array Operations

```js
const list = state({ items: [] });

// BAD - triggers effect for each push
newItems.forEach(item => {
  list.items.push(item);
});

// GOOD - batched
list.$batch(() => {
  newItems.forEach(item => {
    list.items.push(item);
  });
});
```

### Tip 3: Don't Over-Batch

```js
// BAD - batching single update (unnecessary)
state.$batch(() => {
  state.count = 10;
});

// GOOD - batch only when multiple updates
state.count = 10; // Single update, no batch needed

// GOOD - batch multiple updates
state.$batch(() => {
  state.count = 10;
  state.total = 100;
  state.step = 5;
});
```

---

## Common Pitfalls

### Pitfall 1: Async Code in Batch

```js
// WRONG - async breaks batching
state.$batch(async () => {
  state.loading = true;
  const data = await fetchData(); // Batch ends here!
  state.data = data;              // Not batched!
  state.loading = false;          // Not batched!
});

// RIGHT - batch the sync updates
state.loading = true;
const data = await fetchData();
state.$batch(() => {
  state.data = data;
  state.loading = false;
});
```

### Pitfall 2: Ignoring Return Value

```js
// BAD - ignores return value when needed
state.$batch(() => {
  state.count++;
  return state.count;
});
// Return value lost

// GOOD - capture return value
const newCount = state.$batch(() => {
  state.count++;
  return state.count;
});
console.log('New count:', newCount);
```

### Pitfall 3: Batching Unrelated States

```js
// BAD - batching different state objects
userState.$batch(() => {
  userState.name = 'John';
  cartState.items = []; // Different state!
});

// GOOD - each state batches its own updates
userState.$batch(() => {
  userState.name = 'John';
});

cartState.$batch(() => {
  cartState.items = [];
});
```

---

## Summary

**`state.$batch()` groups multiple state updates for efficient reactive updates.**

Key takeaways:
- ✅ **Batches updates** on state instance
- ✅ Effects run **once** after all updates
- ✅ Returns **function's return value**
- ✅ Can be **nested**
- ✅ Great for **form population**, **bulk updates**, **calculations**, **animations**
- ⚠️ Don't use for **single updates**
- ⚠️ **Async operations** break batching
- ⚠️ Only batches updates to **same state object**

**Remember:** Use `$batch()` when making multiple updates to the same state object. It improves performance and prevents intermediate states! 🎉

➡️ Next, explore [`$watch()`]($watch.md) for watching changes or [`$computed()`]($computed.md) for derived values!
