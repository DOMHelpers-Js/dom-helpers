[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Batch, Ref, and Utilities

## Quick Start (30 seconds)

```javascript
// batch() — group multiple changes into one update
batch(() => {
  app.name = 'Alice';
  app.age = 30;
  app.isActive = true;
});
// Effects run ONCE with all three changes applied

// ref() — a reactive wrapper for a single value
const count = ref(0);
console.log(count.value);  // 0
count.value = 5;           // Reactive! Effects re-run

// notify() — manually trigger an update
notify(state, 'items');  // Force re-run of effects watching 'items'
```

---

## What Are These Utility Functions?

The reactive system provides several utility functions beyond the core state/effect/computed/watch pattern. These utilities give you **precise control** over the reactive system:

- **`batch()`** — groups multiple state changes into a single update cycle
- **`ref()`** — wraps a single primitive value in a reactive container
- **`notify()`** — manually triggers reactivity for a specific key
- **`untrack()`** — reads reactive state without tracking dependencies
- **`pause()` / `resume()`** — temporarily stops all reactivity
- **`isReactive()`** — checks if a value is reactive
- **`toRaw()` / `getRaw()`** — gets the underlying non-reactive object

Understanding these tools gives you fine-grained control when the core reactive primitives need a little help.

---

## `batch()` — The Performance Tool

### What is `batch()`?

`batch()` groups multiple state changes so that all effects run **once** after all changes are applied, instead of running after each individual change.

```javascript
const app = state({ a: 0, b: 0, c: 0 });

effect(() => {
  console.log(app.a, app.b, app.c);
});
// Logs: "0 0 0"

// Without batch — effect runs 3 times
app.a = 1;  // Logs: "1 0 0"
app.b = 2;  // Logs: "1 2 0"
app.c = 3;  // Logs: "1 2 3"

// With batch — effect runs once
batch(() => {
  app.a = 1;
  app.b = 2;
  app.c = 3;
});
// Logs once: "1 2 3"
```

### Syntax

```javascript
batch(() => {
  // Make all your changes here
  myState.property1 = value1;
  myState.property2 = value2;
  myState.property3 = value3;
});
// Effects run here — once, with all changes applied
```

### Why `batch()` Exists

Without batching, each property change triggers all dependent effects immediately. This causes **intermediate states** that can be visually jarring or logically incorrect:

```javascript
const user = state({ firstName: 'Alice', lastName: 'Smith' });

effect(() => {
  // Should always show "Alice Smith" or "Bob Jones" — never mixed
  document.getElementById('name').textContent = `${user.firstName} ${user.lastName}`;
});
// Shows: "Alice Smith"

// Without batch — shows "Bob Smith" briefly (wrong!)
user.firstName = 'Bob';    // Shows: "Bob Smith" ← Mixed state! Wrong briefly
user.lastName = 'Jones';   // Shows: "Bob Jones" ← Correct now

// With batch — goes directly from "Alice Smith" to "Bob Jones"
batch(() => {
  user.firstName = 'Bob';
  user.lastName = 'Jones';
});
// Shows: "Bob Jones" ← Never shows the mixed state
```

### Mental Model: The Delivery Batch

Think of `batch()` like batching deliveries.

```
Without batch:
┌─────────────────────────────────────────────┐
│  Delivery #1: Name = "Bob"   → Driver goes  │
│  Delivery #2: Age = 30       → Driver goes  │
│  Delivery #3: City = "NYC"   → Driver goes  │
│                                             │
│  3 separate trips — inefficient             │
└─────────────────────────────────────────────┘

With batch():
┌─────────────────────────────────────────────┐
│  Package #1: Name = "Bob"    → Wait...      │
│  Package #2: Age = 30        → Wait...      │
│  Package #3: City = "NYC"    → Wait...      │
│                                             │
│  One trip with all packages — efficient!    │
└─────────────────────────────────────────────┘
```

### Common `batch()` Use Cases

```javascript
// Loading API data
async function loadUser(id) {
  const user = await fetchUser(id);
  batch(() => {
    userState.name = user.name;
    userState.email = user.email;
    userState.avatar = user.avatar;
    userState.isLoading = false;
  });
}

// Resetting a form
function resetLoginForm() {
  batch(() => {
    form.username = '';
    form.password = '';
    form.error = null;
    form.isSubmitting = false;
  });
}

// Applying preferences
function applyTheme(theme) {
  batch(() => {
    settings.theme = theme.name;
    settings.primaryColor = theme.primary;
    settings.fontSize = theme.fontSize;
    settings.isDark = theme.isDark;
  });
}

// Swapping two values atomically
function swapValues() {
  batch(() => {
    const temp = app.a;
    app.a = app.b;
    app.b = temp;
    // Effect only sees the final swapped state
  });
}
```

### Nested Batches

Batches can be nested. The outermost batch controls when the flush happens:

```javascript
batch(() => {
  app.x = 1;      // Queued

  batch(() => {
    app.y = 2;    // Queued
    app.z = 3;    // Queued
  });             // Inner ends — NOT flushed yet

  app.w = 4;      // Queued
});               // Outer ends — ALL four changes flush at once
```

---

## `ref()` — The Single-Value Wrapper

### What is `ref()`?

`ref()` wraps a single value in a reactive container. You access and update the value through the `.value` property.

```javascript
const count = ref(0);
console.log(count.value);  // 0

count.value = 5;           // Triggers reactivity
console.log(count.value);  // 5

effect(() => {
  console.log('Count is:', count.value);
});
// Logs: "Count is: 5"

count.value = 10;
// Logs: "Count is: 10"
```

### Syntax

```javascript
// Create a ref
const myRef = ref(initialValue);

// Read the value
console.log(myRef.value);

// Update the value
myRef.value = newValue;

// Use in effect
effect(() => {
  // Access myRef.value — now tracked
  doSomethingWith(myRef.value);
});
```

### Multiple Refs with `refs()`

```javascript
// Create multiple refs at once
const { count, name, isActive } = refs({
  count: 0,
  name: 'Alice',
  isActive: true
});

// Each is independent
count.value = 5;
name.value = 'Bob';
isActive.value = false;
```

### Why `ref()` vs `state()`?

Both create reactive data. The difference is usage context:

```javascript
// state() is for objects with multiple properties
const user = state({
  name: 'Alice',
  age: 25,
  email: ''
});

// ref() is for a single value — especially useful when passing around
const isOpen = ref(false);
const theme = ref('light');
const userId = ref(null);
```

**Use `ref()` when:**
✅ You have a single primitive value to track
✅ You want to pass a reactive value around as a reference
✅ You're extracting a value from a larger state into its own container

**Use `state()` when:**
✅ You have multiple related properties
✅ You're modeling a domain object (user, product, cart)
✅ The properties belong together conceptually

```javascript
// Practical example: a toggle button
const isMenuOpen = ref(false);

document.getElementById('menu-btn').addEventListener('click', () => {
  isMenuOpen.value = !isMenuOpen.value;
});

effect(() => {
  document.getElementById('menu').hidden = !isMenuOpen.value;
  document.getElementById('menu-btn').textContent = isMenuOpen.value ? 'Close' : 'Open';
});
```

---

## `notify()` — Manual Trigger

### What is `notify()`?

`notify()` manually triggers all effects that depend on a specific property — even if the property's value didn't change through the Proxy.

```javascript
const app = state({ items: [] });

effect(() => {
  console.log('Items count:', app.items.length);
});
// Logs: "Items count: 0"

// If you mutated the array internally (not through assignment):
app.items.push('apple');  // ⚠️ Might not trigger reactivity

// You can manually notify:
notify(app, 'items');
// Logs: "Items count: 1" — effect re-ran
```

### Syntax

```javascript
// Notify a specific property
notify(myState, 'propertyName');

// Notify all properties (re-run all effects for this state)
notify(myState);
```

### When Do You Need `notify()`?

Normally, the Proxy handles all notifications automatically. `notify()` is needed in specific cases:

**When working with non-proxied mutations:**

```javascript
const data = state({ numbers: [1, 2, 3] });

// If the array patch module isn't loaded:
data.numbers.push(4);     // Internal mutation — may not be tracked
notify(data, 'numbers');   // Manually notify
```

**When data comes from outside the Proxy:**

```javascript
const chart = state({ data: null });

// External library modifies the data object directly
externalLibrary.updateData(chart.data);

// Notify reactive system about the external change
notify(chart, 'data');
```

**For performance optimization — defer updates:**

```javascript
const heavy = state({ matrix: [] });

// Make many silent changes
pause();
for (let i = 0; i < 1000; i++) {
  heavy.matrix.push(i);
}
resume();

// Now manually notify once
notify(heavy, 'matrix');
```

---

## `untrack()` — Read Without Tracking

### What is `untrack()`?

`untrack()` runs a function that reads reactive state without recording it as a dependency. Any state read inside `untrack()` won't trigger the containing effect to re-run when that state changes.

```javascript
const app = state({ count: 0, debug: false });

effect(() => {
  // count is tracked — effect re-runs when count changes
  console.log('Count:', app.count);

  // debug is NOT tracked — changing debug doesn't re-run this effect
  untrack(() => {
    console.log('Debug mode:', app.debug);
  });
});

app.count = 5;   // ✅ Effect re-runs
app.debug = true; // ❌ Effect does NOT re-run
```

### Syntax

```javascript
untrack(() => {
  // Read reactive state without creating dependencies
  const value = myState.property;
  return value;
});
```

### When Do You Need `untrack()`?

**Reading state that should NOT trigger re-runs:**

```javascript
const app = state({ count: 0, userId: 'user-123' });

effect(() => {
  // count is the important thing to track
  console.log('Processing count:', app.count);

  // userId is needed for logging but shouldn't trigger re-runs
  const uid = untrack(() => app.userId);
  logToServer(uid, app.count);
});

// Only count changes trigger the effect
// userId changes do not
```

**Breaking unwanted dependency cycles:**

```javascript
const state1 = state({ a: 0 });
const state2 = state({ b: 0 });

effect(() => {
  // We want to react to state1.a changes
  const aValue = state1.a;

  // But reading state2.b shouldn't add a dependency
  const bSnapshot = untrack(() => state2.b);

  console.log(aValue + bSnapshot);
});

state1.a = 5;   // ✅ Effect re-runs
state2.b = 10;  // ❌ Effect does NOT re-run (untracked)
```

---

## `pause()` and `resume()` — Temporary Pause

### What are `pause()` and `resume()`?

`pause()` temporarily stops the reactive system from processing updates. `resume()` turns it back on.

```javascript
const app = state({ value: 0 });

effect(() => {
  console.log('Value:', app.value);
});
// Logs: "Value: 0"

pause();          // Stop reactivity

app.value = 1;   // Change — but effects don't run yet
app.value = 2;   // Change — but effects don't run yet
app.value = 3;   // Change — but effects don't run yet

resume(true);     // Resume AND flush pending updates
// Logs: "Value: 3" — only the final state
```

### Syntax

```javascript
pause();          // Pause reactivity (increments internal depth)
resume(false);    // Resume without flushing
resume(true);     // Resume AND flush pending updates
```

### When to Use

```javascript
// Performance optimization during initialization
pause();
bulkLoadData();    // Load lots of data without triggering effects
resume(true);      // Flush once with all final data

// Complex state initialization
pause();
state.users = [];
state.isLoading = false;
state.currentPage = 1;
state.totalCount = 0;
resume(true);
```

> **Note:** `pause()` and `resume()` are global. They affect all reactive state in the system. Use `batch()` for most cases — `pause()`/`resume()` is for advanced scenarios where batching isn't sufficient.

---

## `isReactive()` and `toRaw()` / `getRaw()` — Inspection Utilities

### `isReactive()` — Check If Something Is Reactive

```javascript
const plain = { count: 0 };
const reactive = state({ count: 0 });

console.log(isReactive(plain));    // false
console.log(isReactive(reactive)); // true
console.log(isReactive(42));       // false
console.log(isReactive(null));     // false
```

**When to use:**
- When you receive an unknown value and need to know if it's reactive
- When debugging to verify state was created correctly

```javascript
function processState(data) {
  if (!isReactive(data)) {
    console.warn('Expected reactive state but got plain object');
    return;
  }
  // Safe to use reactive features
}
```

### `toRaw()` / `getRaw()` — Get the Underlying Object

These functions return the original plain object without the reactive Proxy wrapper.

```javascript
const user = state({ name: 'Alice', email: 'alice@example.com' });

// getRaw() is the namespace method style (recommended)
const rawUser = getRaw(user);
console.log(rawUser);  // { name: 'Alice', email: 'alice@example.com' }

// toRaw() is the shortcut (does the same thing)
const raw = toRaw(user);
```

**When to use `getRaw()`:**

```javascript
// Sending to API — don't send the Proxy
fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify(getRaw(user))  // Plain object, not Proxy
});

// Storing snapshot for comparison
const snapshot = { ...getRaw(user) };  // Deep copy of current values

// Working with third-party libraries that don't expect Proxies
thirdPartyLib.process(getRaw(data));

// JSON serialization
localStorage.setItem('user', JSON.stringify(getRaw(user)));
```

> **Note:** Changes to the raw object do NOT trigger reactivity. It's a true escape hatch — you get the data without any reactive behavior.

---

## Real-World Example: Complete Reactive Application

Here's how these utilities work together in a realistic scenario:

```javascript
// Shopping cart with all utilities working together
const cart = state({
  items: [],
  isLoading: false,
  error: null
});

const itemCount = ref(0);  // Standalone reactive value

computed(cart, {
  subtotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  tax() {
    return this.subtotal * 0.08;
  },
  total() {
    return this.subtotal + this.tax;
  }
});

// Watch for cart changes
watch(cart, {
  total(newTotal, oldTotal) {
    if (newTotal > 50 && oldTotal <= 50) {
      showFreeShippingNotification();
    }
  }
});

// Main display effect
effect(() => {
  document.getElementById('cart-count').textContent = cart.items.length;
  document.getElementById('subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = `$${cart.total.toFixed(2)}`;
  document.getElementById('loading').hidden = !cart.isLoading;
});

// Add item to cart — use batch for atomicity
async function addItem(productId) {
  cart.isLoading = true;

  try {
    const product = await fetch(`/api/products/${productId}`).then(r => r.json());

    // Batch: update items and loading together
    batch(() => {
      cart.items = [...cart.items, { ...product, quantity: 1 }];
      cart.isLoading = false;
      cart.error = null;
    });

    // Update standalone ref
    itemCount.value = cart.items.length;

  } catch (err) {
    batch(() => {
      cart.error = 'Failed to add item';
      cart.isLoading = false;
    });
  }
}

// Save cart to API without triggering reactivity
async function saveCartToServer() {
  // Use getRaw to get plain data for the API call
  const cartData = getRaw(cart);
  await fetch('/api/cart', {
    method: 'POST',
    body: JSON.stringify(cartData)
  });
}
```

---

## Summary

| Utility | Purpose | When to Use |
|---------|---------|-------------|
| `batch(fn)` | Group changes → one update cycle | Multiple related state changes |
| `ref(value)` | Reactive wrapper for single value | Single primitive reactive values |
| `refs(defs)` | Multiple refs at once | Several standalone reactive values |
| `notify(state, key)` | Manually trigger effects | After external/silent mutations |
| `untrack(fn)` | Read without tracking | Reads that shouldn't add dependencies |
| `pause()` | Stop all reactivity temporarily | Bulk initialization |
| `resume(flush)` | Resume reactivity | After `pause()` |
| `isReactive(value)` | Check if something is reactive | Validation, debugging |
| `getRaw(state)` | Get non-reactive object | API calls, JSON, third-party libs |
| `toRaw(state)` | Same as `getRaw()` | Same as above |

**The key insight:** These utilities give you escape hatches and fine-grained control. For most everyday reactive code, you won't need them. But when you do, they make the impossible possible.

---

## What's Next?

Now that you understand the core reactive utilities, let's explore the **specialized state factories** — powerful tools for specific use cases like forms, collections, and async data.

Continue to: [07 — Specialized State Factories](./07_specialized_state.md)