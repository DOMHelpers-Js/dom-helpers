[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Computed Properties and Watch

## Quick Start (30 seconds)

```javascript
const cart = state({ price: 100, quantity: 3, taxRate: 0.08 });

// Add computed properties — they update automatically
computed(cart, {
  subtotal() { return this.price * this.quantity; },
  tax() { return this.subtotal * this.taxRate; },
  total() { return this.subtotal + this.tax; }
});

console.log(cart.total);  // 324

cart.quantity = 5;
console.log(cart.total);  // 540 — updated automatically ✨

// Watch for specific changes
watch(cart, {
  total(newVal, oldVal) {
    console.log(`Cart total changed: $${oldVal} → $${newVal}`);
  }
});
```

---

## What are Computed Properties?

Computed properties are **values that are automatically calculated from other state**.

Instead of manually recalculating a derived value every time, you define how it should be calculated once, and the reactive system keeps it fresh automatically.

Think of it like a **formula in a spreadsheet cell** — you write `=A1 * B1` once, and whenever A1 or B1 changes, the cell updates itself.

```javascript
const order = state({ price: 50, quantity: 4 });

// Computed: always price × quantity
computed(order, {
  total() { return this.price * this.quantity; }
});

console.log(order.total);  // 200

order.price = 75;
console.log(order.total);  // 300 — recalculated automatically
```

You never called any function to recalculate. It just happened.

---

## What is `watch()`?

`watch()` lets you **respond to specific property changes** with a callback that receives the old and new values.

While `effect()` re-runs its entire function on any dependency change, `watch()` is more targeted — it only fires when a specific property (or computed value) changes, and gives you both the before and after values.

```javascript
const user = state({ score: 0 });

watch(user, {
  score(newScore, oldScore) {
    console.log(`Score changed from ${oldScore} to ${newScore}`);
    if (newScore > 100) console.log('High score!');
  }
});

user.score = 50;   // "Score changed from 0 to 50"
user.score = 150;  // "Score changed from 50 to 150" + "High score!"
```

---

## Syntax

### `computed()`

```javascript
// Add computed properties to existing state
computed(myState, {
  propertyName() {
    return this.someProperty + this.otherProperty;
    //     ^^^^
    //     `this` refers to the state object
  },

  anotherProperty() {
    return this.items.filter(item => item.active).length;
  }
});

// Access like a normal property
console.log(myState.propertyName);
```

### `watch()`

```javascript
// Watch specific properties
const stopWatching = watch(myState, {
  propertyName(newValue, oldValue) {
    // Called whenever propertyName changes
    // Receives new value and previous value
  },

  anotherProperty(newValue, oldValue) {
    // Each key gets its own callback
  }
});

// Stop watching (optional cleanup)
stopWatching();
```

---

## Why Does These Exist?

### `computed()` vs `effect()` — Two Approaches to Derived Values

#### Using `effect()` to Manage Derived Values

When you need a derived value, one approach is to maintain it through effects:

```javascript
const cart = state({ items: [], subtotal: 0, tax: 0, total: 0 });

effect(() => {
  cart.subtotal = cart.items.reduce((sum, item) => sum + item.price, 0);
});

effect(() => {
  cart.tax = cart.subtotal * 0.08;
});

effect(() => {
  cart.total = cart.subtotal + cart.tax;
});
```

This approach works well and gives you full control over when each value updates.

#### When Computed Properties Are Your Priority

In scenarios where you need values that are **directly readable as properties** and calculated lazily (only when accessed), `computed()` provides a more integrated approach:

```javascript
const cart = state({ items: [] });

computed(cart, {
  subtotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  },
  tax() {
    return this.subtotal * 0.08;  // Can reference other computed!
  },
  total() {
    return this.subtotal + this.tax;
  }
});

// Now access them like normal properties
console.log(cart.total);  // Always fresh, calculated on demand
```

**Computed properties are especially useful when:**
✅ The derived value needs to be readable as a property (`cart.total`)
✅ You want lazy evaluation — only calculated when accessed
✅ Computed properties chain off each other (`tax` uses `subtotal`)
✅ You want a clean, readable state object with derived values alongside raw ones

**The Choice is Yours:**
- Use `effect()` when you need to execute side effects or update DOM in response to derived calculations
- Use `computed()` when you need derived values readable as properties, lazily evaluated
- Both approaches are valid and can be combined freely

**Benefits of `computed()`:**
✅ Lazy evaluation — only recalculates when accessed after a dependency changes
✅ Cached — returns the same value without recalculating if dependencies haven't changed
✅ Chainable — computed properties can depend on other computed properties
✅ Self-documenting — derived values live right alongside the state they come from

---

### `watch()` vs `effect()` — Two Ways to React to Changes

#### Using `effect()` for Reactions

`effect()` re-runs whenever any dependency changes, and it doesn't distinguish between old and new values:

```javascript
const user = state({ score: 0 });

effect(() => {
  // Runs every time score changes
  // But you don't easily know the previous value
  console.log('Score is now:', user.score);
});
```

This approach is great when you just need to run code in response to any change.

#### When `watch()` Is Your Priority

In scenarios where you need **both the old and new values** and want to react to a **specific property**, `watch()` provides a more focused approach:

```javascript
const user = state({ score: 0 });

watch(user, {
  score(newScore, oldScore) {
    // Both values available, change-only callback
    const diff = newScore - oldScore;
    console.log(`Score went from ${oldScore} to ${newScore} (${diff > 0 ? '+' : ''}${diff})`);
  }
});
```

**`watch()` is especially useful when:**
✅ You need the previous value to compute a diff or comparison
✅ You want change-specific logic (only fires when value actually changes)
✅ You need to react to one property but not to unrelated state
✅ You're logging, auditing, or animating transitions

**The Choice is Yours:**
- Use `effect()` for general reactive code that runs when any dependency changes
- Use `watch()` when you specifically need old and new values for a property
- Both are clean, idiomatic approaches — choose what reads best for your use case

**Benefits of `watch()`:**
✅ Receives both old and new values in the callback
✅ Only fires when the watched value actually changes
✅ Focused and explicit — clear intent in the code
✅ Returns a cleanup function for easy stopping

---

## Mental Model

### Computed — The Spreadsheet Formula

Computed properties are like formulas in a spreadsheet.

```
Spreadsheet:
┌────────────────────────────────────────┐
│  Price:    $100                        │
│  Quantity: 3                           │
│  Total:    =Price × Quantity → $300    │
│                                        │
│  Change Quantity to 5:                 │
│  Total automatically becomes $500      │
│  (Formula recalculates itself)         │
└────────────────────────────────────────┘

computed():
┌────────────────────────────────────────┐
│  state.price = 100                     │
│  state.quantity = 3                    │
│  computed: total() = this.price        │
│                    × this.quantity     │
│                                        │
│  state.quantity = 5:                   │
│  state.total automatically = 500       │
│  (Computed recalculates itself)        │
└────────────────────────────────────────┘
```

### Watch — The Alarm System

`watch()` is like setting an alarm that only rings when something specific changes.

```
Security System:
┌────────────────────────────────────────┐
│  Watch: Front Door                     │
│                                        │
│  If door opens: play alarm             │
│  If door closes: stop alarm            │
│                                        │
│  Window opened? → No reaction          │
│  (Only watches the front door)         │
└────────────────────────────────────────┘

watch():
┌────────────────────────────────────────┐
│  watch(state, {                        │
│    status(newVal, oldVal) {            │
│      if (newVal === 'danger') alert(); │
│    }                                   │
│  })                                    │
│                                        │
│  Other properties change? → No reaction│
│  Only "status" is watched              │
└────────────────────────────────────────┘
```

---

## How Does It Work?

### How `computed()` Works

When you call `computed(state, { total() { ... } })`, the system:

1. Defines `total` as a special property on the state
2. When `state.total` is read, if dependencies have changed, it runs the function
3. The function runs with `this` pointing to the state, so `this.price` reads from state
4. While running, the system tracks which properties were read — those are dependencies
5. When any dependency changes, the computed is marked "dirty" (needs recalculation)
6. Next time `state.total` is read, it recalculates

```
First access: state.total
      ↓
Computed is dirty → run the function
      ↓
Function reads this.price and this.quantity
      ↓
System records: total depends on [price, quantity]
      ↓
Returns calculated value, caches it

Next access (before any change): state.total
      ↓
Not dirty → return cached value instantly

state.price changes:
      ↓
System marks total as dirty
      ↓
Next access of state.total → recalculates
```

**Key insight:** Computed values are **lazy** — they recalculate only when accessed after a dependency changes. If nobody reads `state.total`, it never recalculates even if dependencies change.

### How `watch()` Works

`watch()` internally creates an effect that:
1. Reads the watched property
2. Compares with the last known value
3. If changed, calls your callback with `(newValue, oldValue)`

```
watch(state, {
  count(newVal, oldVal) { ... }
})

Internally creates:
  let oldCount = state.count;
  effect(() => {
    const newCount = state.count;
    if (newCount !== oldCount) {
      callback(newCount, oldCount);
      oldCount = newCount;
    }
  });
```

This means `watch()` only calls your callback when the value **actually changes** — setting `state.count = state.count` (same value) won't trigger it.

---

## Basic Usage

### Step 1 — Simple Computed Property

```javascript
const order = state({ price: 50, quantity: 4 });

computed(order, {
  total() {
    return this.price * this.quantity;
  }
});

console.log(order.total);   // 200
order.price = 100;
console.log(order.total);   // 400 — recalculated automatically
order.quantity = 2;
console.log(order.total);   // 200 — recalculated again
```

### Step 2 — Multiple Computed Properties

```javascript
const cart = state({
  items: [
    { name: 'Apple', price: 1.5 },
    { name: 'Bread', price: 2.5 },
    { name: 'Milk', price: 3.0 }
  ]
});

computed(cart, {
  itemCount() {
    return this.items.length;
  },
  subtotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  },
  tax() {
    return this.subtotal * 0.08;
  },
  total() {
    return this.subtotal + this.tax;
  },
  isEmpty() {
    return this.items.length === 0;
  }
});

console.log(cart.itemCount);  // 3
console.log(cart.subtotal);   // 7
console.log(cart.tax);        // 0.56
console.log(cart.total);      // 7.56
console.log(cart.isEmpty);    // false
```

### Step 3 — Computed Properties in Effects

Computed properties work naturally inside effects — effects track them like any other property:

```javascript
const store = state({ price: 100, quantity: 5 });

computed(store, {
  total() { return this.price * this.quantity; }
});

effect(() => {
  document.getElementById('total-display').textContent = `$${store.total}`;
});
// Shows: "$500"

store.price = 120;
// Effect re-runs because store.total changed
// Shows: "$600"
```

### Step 4 — Simple Watch

```javascript
const app = state({ count: 0 });

watch(app, {
  count(newVal, oldVal) {
    console.log(`Count changed: ${oldVal} → ${newVal}`);
  }
});

app.count = 1;   // "Count changed: 0 → 1"
app.count = 5;   // "Count changed: 1 → 5"
app.count = 5;   // No output — value didn't change
```

### Step 5 — Watch Multiple Properties

```javascript
const user = state({ name: 'Alice', email: 'alice@example.com', role: 'user' });

const stopWatching = watch(user, {
  name(newName, oldName) {
    console.log(`Name changed: "${oldName}" → "${newName}"`);
    logActivity(`User renamed to ${newName}`);
  },
  role(newRole, oldRole) {
    console.log(`Role changed: "${oldRole}" → "${newRole}"`);
    if (newRole === 'admin') {
      sendAdminWelcomeEmail(user.email);
    }
  }
});

user.name = 'Bob';     // "Name changed: "Alice" → "Bob""
user.role = 'admin';   // "Role changed: "user" → "admin""
user.email = 'bob@example.com';  // No output — email not watched

// Stop watching when no longer needed
stopWatching();
```

### Step 6 — Watch a Computed Property

You can watch computed properties too:

```javascript
const cart = state({ items: [], price: 10 });

computed(cart, {
  total() {
    return this.items.length * this.price;
  }
});

watch(cart, {
  total(newTotal, oldTotal) {
    console.log(`Cart total: $${oldTotal} → $${newTotal}`);
    updateCartBadge(newTotal);
  }
});

cart.items = ['item1', 'item2'];  // "Cart total: $0 → $20"
cart.price = 15;                  // "Cart total: $20 → $30"
```

---

## Deep Dive: Computed Properties

### Computed Properties Can Chain

One computed property can depend on another. The system handles this correctly:

```javascript
const finances = state({
  grossIncome: 80000,
  taxRate: 0.22,
  expenses: 15000
});

computed(finances, {
  tax() {
    return this.grossIncome * this.taxRate;
  },
  netIncome() {
    return this.grossIncome - this.tax;  // Uses another computed!
  },
  disposable() {
    return this.netIncome - this.expenses;  // Uses another computed!
  }
});

console.log(finances.tax);         // 17600
console.log(finances.netIncome);   // 62400
console.log(finances.disposable);  // 47400

// Change tax rate — everything recalculates
finances.taxRate = 0.30;
console.log(finances.tax);         // 24000
console.log(finances.netIncome);   // 56000
console.log(finances.disposable);  // 41000
```

### Computed Properties Are Lazy (Cached)

Computed values are calculated only when accessed:

```javascript
const app = state({ expensiveData: [/* lots of items */] });

computed(app, {
  processedData() {
    // This calculation only runs when you read processedData
    // AND only if dependencies changed since last read
    console.log('Calculating...');
    return this.expensiveData.filter(item => item.active).map(item => item.value);
  }
});

app.expensiveData = [/* new data */];
// Nothing runs yet — processedData not accessed

console.log(app.processedData);  // "Calculating..." runs now, result cached
console.log(app.processedData);  // Returns cached result instantly (no "Calculating...")

app.expensiveData = [/* another update */];
// Marked dirty — but doesn't run yet

console.log(app.processedData);  // "Calculating..." runs now with fresh data
```

### Computed Properties With Complex Logic

```javascript
const list = state({
  items: [
    { id: 1, name: 'Apple', category: 'fruit', inStock: true, price: 1.5 },
    { id: 2, name: 'Banana', category: 'fruit', inStock: false, price: 0.5 },
    { id: 3, name: 'Carrot', category: 'vegetable', inStock: true, price: 0.8 },
  ],
  filter: 'all',
  sortBy: 'name'
});

computed(list, {
  filteredItems() {
    let items = this.items;
    if (this.filter !== 'all') {
      items = items.filter(item => item.category === this.filter);
    }
    return items;
  },
  sortedItems() {
    return [...this.filteredItems].sort((a, b) =>
      a[this.sortBy] < b[this.sortBy] ? -1 : 1
    );
  },
  inStockCount() {
    return this.items.filter(item => item.inStock).length;
  },
  averagePrice() {
    const inStock = this.items.filter(item => item.inStock);
    if (inStock.length === 0) return 0;
    return inStock.reduce((sum, item) => sum + item.price, 0) / inStock.length;
  }
});

// Access computed properties
console.log(list.sortedItems);    // Sorted, filtered list
console.log(list.inStockCount);   // 2
console.log(list.averagePrice);   // 1.15

// Change filter — everything updates
list.filter = 'fruit';
console.log(list.sortedItems);    // Only fruits, sorted
```

---

## Deep Dive: Watch Patterns

### Watching for a Specific Value

```javascript
const auth = state({ status: 'idle' });

watch(auth, {
  status(newStatus, oldStatus) {
    if (newStatus === 'authenticated') {
      showDashboard();
      hideLoginForm();
    } else if (newStatus === 'error') {
      showErrorMessage();
    } else if (newStatus === 'idle') {
      showLoginForm();
    }
  }
});
```

### Watching for Threshold Crossings

```javascript
const app = state({ temperature: 20 });

watch(app, {
  temperature(newTemp, oldTemp) {
    const wasCold = oldTemp < 0;
    const isCold = newTemp < 0;
    const wasHot = oldTemp > 35;
    const isHot = newTemp > 35;

    if (!wasCold && isCold) console.log('Gone below freezing!');
    if (wasCold && !isCold) console.log('Above freezing again!');
    if (!wasHot && isHot) console.log('Gone dangerously hot!');
    if (wasHot && !isHot) console.log('Cooled down!');
  }
});
```

### Watching for Data Validation

```javascript
const form = state({ email: '', age: '' });

watch(form, {
  email(newEmail) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    document.getElementById('email-error').hidden = isValid || !newEmail;
    document.getElementById('email-error').textContent =
      !isValid && newEmail ? 'Please enter a valid email' : '';
  },
  age(newAge) {
    const num = parseInt(newAge);
    const isValid = !isNaN(num) && num >= 18 && num <= 120;
    document.getElementById('age-error').hidden = isValid || !newAge;
    document.getElementById('age-error').textContent =
      !isValid && newAge ? 'Must be between 18 and 120' : '';
  }
});
```

### Watching and Stopping When Done

```javascript
const timer = state({ secondsLeft: 10 });

const stopWatching = watch(timer, {
  secondsLeft(newVal) {
    document.getElementById('countdown').textContent = newVal;

    if (newVal <= 0) {
      console.log('Timer finished!');
      stopWatching();  // Stop watching — no more needed
    }
  }
});

// Countdown
const interval = setInterval(() => {
  set(timer, { secondsLeft: prev => prev - 1 });
}, 1000);
```

---

## Combining Computed and Watch

Computed and watch work naturally together — watch a computed property:

```javascript
const shop = state({
  cartItems: [],
  pricePerItem: 25
});

computed(shop, {
  cartTotal() {
    return this.cartItems.length * this.pricePerItem;
  }
});

// Watch the computed property
watch(shop, {
  cartTotal(newTotal, oldTotal) {
    console.log(`Total changed: $${oldTotal} → $${newTotal}`);
    updateCartUI(newTotal);

    if (newTotal > 100) {
      showFreeShippingBanner();
    }
  }
});

shop.cartItems = ['item1', 'item2', 'item3'];
// "Total changed: $0 → $75"

shop.pricePerItem = 40;
// "Total changed: $75 → $120" + shows free shipping banner
```

---

## Common Mistakes

### Mistake 1: Modifying State Inside a Computed Property

```javascript
// ❌ Don't modify state inside computed — creates loops
computed(app, {
  total() {
    app.lastCalculated = Date.now();  // ❌ Modifying state!
    return this.price * this.quantity;
  }
});

// ✅ Computed should only read and return — no side effects
computed(app, {
  total() {
    return this.price * this.quantity;
  }
});

// ✅ If you need side effects, use watch
watch(app, {
  total(newTotal) {
    app.lastCalculated = Date.now();  // ✅ In a watcher — fine
  }
});
```

### Mistake 2: Forgetting That `this` Refers to State

```javascript
const app = state({ price: 100 });

computed(app, {
  // ❌ Arrow function — `this` is not the state
  total: () => {
    return this.price * 2;  // `this` is wrong here!
  },

  // ✅ Regular function — `this` is the state
  total() {
    return this.price * 2;  // `this` is the state object
  }
});
```

**Important:** Always use regular functions (not arrow functions) for computed properties. Arrow functions don't bind `this` correctly.

### Mistake 3: Watch Doesn't Run Immediately

```javascript
const app = state({ count: 0 });

watch(app, {
  count(newVal, oldVal) {
    console.log('Count is now:', newVal);
  }
});

// This does NOT log anything immediately!
// Watch only fires when the value CHANGES

// Only after this line:
app.count = 1;  // "Count is now: 1"
```

Unlike `effect()`, `watch()` does not run the callback immediately. It waits for the first change.

### Mistake 4: Circular Computed Dependencies

```javascript
// ❌ Circular dependency — infinite loop
computed(app, {
  a() { return this.b + 1; },  // a depends on b
  b() { return this.a + 1; }   // b depends on a
});
// Error: maximum call stack exceeded

// ✅ Computed properties should have a clear dependency direction
computed(app, {
  b() { return this.rawValue * 2; },   // b depends on rawValue
  a() { return this.b + 1; }          // a depends on b (b depends on rawValue)
});
```

---

## Summary

**`computed()`:**
- Defines properties that are automatically calculated from other state
- Uses `this` to access state inside the function (must be a regular function, not arrow)
- Results are **cached** — recalculates only when dependencies change AND the property is accessed
- Supports **chaining** — computed properties can depend on other computed properties
- Add after state creation: `computed(myState, { propertyName() { return ...; } })`

**`watch()`:**
- Calls a callback when a specific property changes
- Callback receives `(newValue, oldValue)` — both values available
- Only fires when the value **actually changes** (not on same-value assignments)
- Returns a stop function — call it to stop watching
- Can watch computed properties too
- Does **not** run immediately — waits for the first change

**Key differences from `effect()`:**
- `computed()` is for derived values readable as properties, lazily evaluated
- `watch()` is for targeted change callbacks with old/new values
- `effect()` is for general reactive code that runs when any dependency changes

**The pattern:**
```
state() → raw data
computed() → derived values (always fresh, lazily calculated)
watch() → respond to specific changes (with old and new values)
effect() → general reactive code (DOM updates, logging, etc.)
```

---

## What's Next?

Now that you understand computed properties and watchers, let's explore the utility functions that round out the reactive system — `batch()`, `notify()`, `untrack()`, and the `ref()` wrapper.

Continue to: [06 — Batch, Ref, and Utilities](./06_batch_ref_and_utilities.md)