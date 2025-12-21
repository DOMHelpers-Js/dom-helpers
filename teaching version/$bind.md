# `state.$bind()` - Automatically Sync State to DOM

> **You are a senior JavaScript engineer teaching a beginner**

---

## The Problem: Keeping State and DOM in Sync is Tedious

Imagine you're building a counter app. Every time the count changes, you need to manually update the DOM. And if you display the count in multiple places? You update them ALL manually!

Here's what happens **WITHOUT** `$bind()`:

```javascript
const app = state({
  count: 0,
  message: 'Hello',
  isActive: false
});

// Update state
app.count = 10;

// Now manually update DOM (every single time!)
document.getElementById('counter').textContent = app.count;
document.querySelector('.count-display').textContent = app.count;
document.querySelector('[data-count]').textContent = app.count;

// Change message? Update DOM again!
app.message = 'Hi there';
document.querySelector('.message').textContent = app.message;

// Using effects? Lots of boilerplate!
effect(() => {
  document.getElementById('counter').textContent = app.count;
});

effect(() => {
  document.querySelector('.message').textContent = app.message;
});

effect(() => {
  const status = app.isActive ? 'Active' : 'Inactive';
  document.querySelector('.status').textContent = status;
});
```

**The Real Issues:**
- You manually update DOM after every state change
- Displaying data in multiple places means multiple updates
- Effects are verbose and repetitive
- Easy to forget updating one element
- Hard to manage cleanup

---

## The Solution: `$bind()` - Define Once, Updates Automatic

`$bind()` creates **reactive connections** between state properties and DOM elements. You define the bindings once, and the DOM updates automatically whenever state changes!

```javascript
const app = state({
  count: 0,
  message: 'Hello',
  isActive: false
});

// ✅ Define bindings ONCE
const cleanup = app.$bind({
  // Bind to ID selector
  '#counter': 'count',

  // Bind to class selector (updates ALL matching elements!)
  '.count-display': 'count',

  // Bind to attribute selector
  '[data-count]': 'count',

  // Bind to class
  '.message': 'message',

  // Bind with transformation function
  '.status': (state) => state.isActive ? 'Active ✓' : 'Inactive ✗'
});

// Now just change state - DOM updates automatically!
app.count = 10;           // All count displays update
app.message = 'Hi there'; // Message updates
app.isActive = true;      // Status updates to "Active ✓"

// Clean up when done (removes all bindings)
cleanup();
```

**Think of it like this:**
- **Without $bind**: State changes → You manually update DOM
- **With $bind**: State changes → DOM updates automatically ✨

---

## How It Works Under the Hood

When you call `$bind(bindingDefs)`, the system creates effects for each binding:

```
state.$bind({ '#counter': 'count', '.message': 'message' })
        ↓
For each selector-binding pair:
  1. Find all DOM elements matching selector
  2. Create an effect that watches the property
  3. When property changes, update element.textContent
  4. Store cleanup function
        ↓
Return cleanup() function that removes all bindings
```

**Example:**
```javascript
app.$bind({
  '#counter': 'count'
});

// Internally creates:
effect(() => {
  const element = document.getElementById('counter');
  if (element) {
    element.textContent = app.count;
  }
});
```

**The magic:** Under the hood, `$bind()` uses `effect()` to track dependencies. When you change `app.count`, the effect re-runs and updates the DOM!

---

## When to Use `$bind()`

### ✅ Use Case 1: Counter with Multiple Displays

Display the same data in multiple places.

```javascript
const counter = state({
  count: 0,
  step: 1
});

// Bind to multiple elements
counter.$bind({
  // Display raw count in different places
  '#counter-value': 'count',
  '.count-badge': 'count',
  '[data-count]': 'count',

  // Display formatted count
  '#formatted-count': (state) => `Count: ${state.count}`,

  // Display computed values
  '#doubled': (state) => state.count * 2,
  '#tripled': (state) => state.count * 3,

  // Display step
  '#step-display': 'step',

  // Dynamic status message
  '.status': (state) => {
    if (state.count === 0) return 'Start counting!';
    if (state.count > 0) return `Positive: ${state.count}`;
    return `Negative: ${state.count}`;
  }
});

// Just update state - everything updates!
function increment() {
  counter.count += counter.step;
}

function decrement() {
  counter.count -= counter.step;
}

function setStep(newStep) {
  counter.step = newStep;
}
```

**Why this works:** One state property can update dozens of DOM elements automatically. No manual updates needed!

---

### ✅ Use Case 2: User Profile Display

Show user data throughout the page.

```javascript
const profile = state({
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Developer'
  },
  stats: {
    posts: 42,
    followers: 1234
  },
  isOnline: false
});

// Bind nested properties
profile.$bind({
  // User info (access nested with functions)
  '#profile-name': (state) => state.user.name,
  '#profile-email': (state) => state.user.email,
  '.bio-text': (state) => state.user.bio,

  // Stats with formatting
  '#post-count': (state) => state.stats.posts.toLocaleString(),
  '#follower-count': (state) => {
    const count = state.stats.followers;
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  },

  // Online status with icon
  '.online-status': (state) => state.isOnline ? '🟢 Online' : '⚫ Offline',

  // Summary line
  '.user-summary': (state) =>
    `${state.user.name} - ${state.stats.posts} posts, ${state.stats.followers} followers`
});

// Update user data - all displays update automatically
profile.user.name = 'Jane Doe';
profile.isOnline = true;
profile.stats.followers = 2000;
```

**Why this works:** Profile data appears in many places. Bindings ensure everything stays in sync.

---

### ✅ Use Case 3: Shopping Cart Display

Show cart totals with automatic recalculation.

```javascript
const cart = state({
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0
});

// Use computed properties for calculations
cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

cart.$computed('tax', function() {
  return this.subtotal * 0.1;
});

cart.$computed('total', function() {
  return this.subtotal + this.tax;
});

// Bind cart data to UI
cart.$bind({
  // Item count
  '#item-count': (state) => state.items.length,
  '.cart-badge': (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),

  // Financial displays
  '#cart-subtotal': (state) => `$${state.subtotal.toFixed(2)}`,
  '#cart-tax': (state) => `$${state.tax.toFixed(2)}`,
  '#cart-total': (state) => `$${state.total.toFixed(2)}`,

  // Free shipping message
  '.shipping-message': (state) => {
    if (state.subtotal >= 50) return '🎉 Free shipping!';
    const needed = (50 - state.subtotal).toFixed(2);
    return `Add $${needed} more for free shipping`;
  }
});

// Add items - all displays update automatically
cart.items.push({ id: 1, name: 'Laptop', price: 999, quantity: 1 });
cart.items.push({ id: 2, name: 'Mouse', price: 29, quantity: 2 });
```

**Why this works:** Cart calculations trigger updates to multiple computed properties, which trigger bound DOM updates. All automatic!

---

### ✅ Use Case 4: Form Validation Feedback

Show validation errors in real-time.

```javascript
const form = state({
  fields: {
    email: '',
    password: ''
  },
  errors: {},
  touched: {}
});

// Bind validation messages
form.$bind({
  // Error messages (empty string if no error)
  '#email-error': (state) => state.errors.email || '',
  '#password-error': (state) => state.errors.password || '',

  // Field validity classes
  '.email-field': (state) => {
    if (!state.touched.email) return '';
    return state.errors.email ? 'invalid' : 'valid';
  },

  // Submit button text
  '#submit-btn': (state) => {
    const hasErrors = Object.keys(state.errors).length > 0;
    if (hasErrors) return 'Fix errors first';
    return 'Submit';
  },

  // Form status
  '.form-status': (state) => {
    const errorCount = Object.keys(state.errors).length;
    if (errorCount > 0) return `${errorCount} error(s)`;
    return 'Ready to submit ✓';
  }
});

// Validate as user types
function validateEmail(email) {
  form.fields.email = email;
  form.touched.email = true;

  if (!email) {
    form.errors.email = 'Email is required';
  } else if (!email.includes('@')) {
    form.errors.email = 'Invalid email';
  } else {
    delete form.errors.email;
  }
  // All error displays update automatically!
}
```

**Why this works:** Validation state changes frequently. Bindings ensure error messages appear/disappear automatically.

---

### ✅ Use Case 5: Real-Time Dashboard

Display live metrics with auto-refresh.

```javascript
const dashboard = state({
  metrics: {
    activeUsers: 0,
    revenue: 0,
    cpu: 0
  },
  status: {
    server: 'online',
    database: 'online'
  },
  lastUpdate: null
});

dashboard.$bind({
  // Metrics
  '#active-users': (state) => state.metrics.activeUsers.toLocaleString(),
  '#revenue': (state) => `$${state.metrics.revenue.toLocaleString()}`,
  '.cpu-usage': (state) => `${state.metrics.cpu}%`,

  // Status indicators
  '.server-status': (state) => state.status.server === 'online' ? '🟢' : '🔴',
  '.db-status': (state) => state.status.database === 'online' ? '🟢' : '🔴',

  // Last update
  '.last-updated': (state) =>
    state.lastUpdate ? state.lastUpdate.toLocaleTimeString() : 'Never',

  // Health score
  '#health-score': (state) => {
    const all = Object.values(state.status);
    const online = all.filter(s => s === 'online').length;
    return `${Math.round(online / all.length * 100)}%`;
  }
});

// Fetch new data - all displays update
async function refresh() {
  const data = await fetch('/api/metrics').then(r => r.json());
  dashboard.metrics = data.metrics;
  dashboard.status = data.status;
  dashboard.lastUpdate = new Date();
}

setInterval(refresh, 30000); // Auto-refresh every 30s
```

**Why this works:** Dashboards have many displays. Bindings keep everything in sync as data arrives.

---

## How `$bind()` Interacts With Other Features

### With Effects - Creates Effects Internally

```javascript
const app = state({ count: 0 });

// $bind creates effects under the hood
app.$bind({
  '#counter': 'count'
});

// Equivalent to:
effect(() => {
  document.getElementById('counter').textContent = app.count;
});

// So when you change state:
app.count = 10; // The internal effect runs, updating DOM
```

**Lesson:** `$bind()` uses effects internally. You don't write them manually!

---

### With Computed - Binds to Computed Values

```javascript
const cart = state({ items: [] });

cart.$computed('total', function() {
  return this.items.reduce((sum, i) => sum + i.price, 0);
});

// Bind to computed property
cart.$bind({
  '#cart-total': 'total'  // Binds to computed!
});

cart.items.push({ price: 100 });
// total recalculates → binding updates DOM
```

**Lesson:** You can bind to computed properties just like regular properties!

---

### With Arrays - Updates on Array Changes

```javascript
const todos = state({ items: [] });

todos.$bind({
  '#todo-count': (state) => `${state.items.length} todos`,
  '#todo-list': (state) => {
    return state.items.map(t => `
      <li>${t.text}</li>
    `).join('');
  }
});

// Array methods trigger updates
todos.items.push({ text: 'Buy milk' });
// Both #todo-count and #todo-list update!
```

**Lesson:** Patched array methods trigger effects, so bindings update automatically!

---

## When NOT to Use `$bind()`

### ❌ Don't Bind Before DOM is Ready

```javascript
// ❌ WRONG: Elements don't exist yet
const cleanup = state.$bind({
  '#my-element': 'value'
});

// ✅ RIGHT: Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  const cleanup = state.$bind({
    '#my-element': 'value'
  });
});
```

**Why:** If elements don't exist, bindings have nothing to update!

---

### ❌ Don't Forget to Clean Up

```javascript
// ❌ WRONG: Memory leak
function createComponent() {
  state.$bind({ '#display': 'value' });
  // Can't remove bindings later!
}

// ✅ RIGHT: Store cleanup function
function createComponent() {
  const cleanup = state.$bind({ '#display': 'value' });
  return cleanup; // Return so caller can clean up
}

const cleanup = createComponent();
// Later:
cleanup(); // Removes all bindings
```

**Why:** Effects keep running forever unless you clean them up!

---

### ❌ Don't Use Complex Selectors (Performance)

```javascript
// ❌ BAD: Expensive selector
state.$bind({
  'div > ul > li:nth-child(2n+1) .item': 'value'
});

// ✅ GOOD: Simple, specific selector
state.$bind({
  '#item-value': 'value'
});
```

**Why:** Complex selectors are slow. Use IDs or simple classes for best performance.

---

## Comparison with Related Methods

| Approach | Manual Updates? | Automatic? | Cleanup Needed? |
|----------|----------------|------------|-----------------|
| Manual DOM | ✅ Every time | ❌ No | ❌ No |
| `effect()` | ❌ No | ✅ Yes | ✅ Yes |
| `$bind()` | ❌ No | ✅ Yes | ✅ Yes (one call) |
| `$update()` | ✅ Per call | ❌ No | ❌ No |

**When to use which:**
- **Manual DOM** - Simple one-time updates
- **`effect()`** - Custom logic beyond just updating textContent
- **`$bind()`** - Automatic DOM sync for state properties
- **`$update()`** - One-off state + DOM updates together

---

## Quick Mental Model

Think of `$bind()` as **"auto-wiring" state to DOM**:

```javascript
const app = state({ count: 0 });

// Without $bind: Manual wiring ⚡
app.count = 10;
document.getElementById('counter').textContent = app.count;

// With $bind: Auto-wiring 🔌
app.$bind({ '#counter': 'count' });
app.count = 10; // DOM updates automatically!
```

**Remember:**
- Bindings use **CSS selectors** (`#id`, `.class`, `tag`, `[attr]`)
- Values can be **property names** (`'count'`) or **functions** (`(state) => ...`)
- Always **wait for DOM** to be ready
- Always **clean up** when done

---

## Summary

**`state.$bind()` creates automatic reactive connections between state and DOM elements.**

**When to use it:**
- ✅ Display state in multiple DOM locations
- ✅ Auto-sync counters, profiles, carts, forms, dashboards
- ✅ Works with any CSS selector
- ✅ Use functions for transformations/formatting

**When NOT to use it:**
- ❌ Wait for DOM ready before binding
- ❌ Clean up bindings when done
- ❌ Avoid complex/slow selectors

**One-sentence summary:**
Use `$bind()` to automatically sync state to DOM - define once, updates happen forever! 🎯

---

➡️ **Next:** Learn about [`$computed()`]($computed.md) for cached derived values, or [`$watch()`]($watch.md) for reacting to specific changes!
