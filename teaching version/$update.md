# `state.$update()` - Update State AND DOM in One Call

> **You are a senior JavaScript engineer teaching a beginner**

---

## The Problem: Updating State and DOM Separately is Tedious

Imagine you're building a form. When users fill it out, you need to:
1. Update your state (the data)
2. Update the DOM (what users see)

Here's what happens **WITHOUT** `$update()`:

```javascript
const form = state({
  username: '',
  email: '',
  status: 'idle'
});

// User submits the form
function onSubmit(userData) {
  // Step 1: Update state properties (verbose!)
  form.username = userData.username;
  form.email = userData.email;
  form.status = 'submitted';

  // Step 2: Update DOM elements (repetitive!)
  document.getElementById('username-display').textContent = form.username;
  document.getElementById('email-display').textContent = form.email;
  document.querySelector('.status').textContent = form.status;

  // Step 3: Update nested properties (ugh...)
  form.user = form.user || {};
  form.user.profile = form.user.profile || {};
  form.user.profile.name = userData.username;
}
```

**The Real Issues:**
- You write the same property names multiple times
- State updates and DOM updates are separate
- Nested property updates require manual object creation
- Hard to keep state and UI in sync
- Lots of repetitive code

---

## The Solution: `$update()` - One Call for State + DOM

`$update()` lets you update **both state properties AND DOM elements** in a single call. It's like having a universal update function!

```javascript
const form = state({
  username: '',
  email: '',
  status: 'idle',
  user: {}
});

// ✅ Update EVERYTHING in one call
function onSubmit(userData) {
  form.$update({
    // Update state properties
    username: userData.username,
    email: userData.email,
    status: 'submitted',

    // Update nested properties (dot notation!)
    'user.profile.name': userData.username,
    'user.profile.email': userData.email,

    // Update DOM elements (CSS selectors!)
    '#username-display': userData.username,    // ID selector
    '#email-display': userData.email,          // ID selector
    '.status': 'Form submitted!',              // Class selector
    '[data-status]': 'submitted'               // Attribute selector
  });
}
```

**Think of it like this:**
- **State updates** = Keys that look like property names (`username`, `email`)
- **DOM updates** = Keys that look like CSS selectors (`#id`, `.class`, `tag`, `[attr]`)
- **Nested updates** = Keys with dots (`user.profile.name`)

All in ONE call! 🎉

---

## How It Works Under the Hood

When you call `$update(updates)`, the system looks at each key-value pair:

```
state.$update({ ... })
        ↓
For each key-value pair:
  ↓
Is the key a CSS selector? (#, ., [, or tag name)
  ├─ YES → Find DOM elements and update them
  └─ NO  → Update state property (supports dot notation for nested)
        ↓
Return state (for chaining)
```

**Example:**
```javascript
app.$update({
  'count': 10,              // State: app.count = 10
  'user.name': 'John',      // State: app.user.name = 'John'
  '#counter': 10,           // DOM: <div id="counter">10</div>
  '.message': 'Hello'       // DOM: <span class="message">Hello</span>
});
```

**The magic:** The system detects CSS selectors automatically. If it sees `#`, `.`, `[`, or looks like an HTML tag, it treats it as a DOM selector!

---

## When to Use `$update()`

### ✅ Use Case 1: Form Submission with UI Feedback

When users submit forms, you want to update both data and UI.

```javascript
const formState = state({
  username: '',
  password: '',
  status: 'idle',
  message: ''
});

async function handleSubmit(event) {
  event.preventDefault();

  // Show loading state (both data and UI!)
  formState.$update({
    // Update state
    status: 'loading',
    message: 'Submitting...',

    // Update DOM to show loading
    '#submit-btn': 'Submitting...',
    '.form-message': 'Please wait...',
    '.spinner': 'visible'         // Could set class or text
  });

  try {
    // Submit to server
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: formState.username,
        password: formState.password
      })
    });

    // Show success state
    formState.$update({
      status: 'success',
      message: 'Login successful!',

      '#submit-btn': 'Success ✓',
      '.form-message': 'Redirecting...',
      '.spinner': 'hidden'
    });

    // Redirect after delay
    setTimeout(() => window.location.href = '/dashboard', 1000);

  } catch (error) {
    // Show error state
    formState.$update({
      status: 'error',
      message: error.message,

      '#submit-btn': 'Try Again',
      '.form-message': `Error: ${error.message}`,
      '.spinner': 'hidden'
    });
  }
}
```

**Why this works:** One `$update()` call keeps your state and UI perfectly in sync. No forgetting to update either one!

---

### ✅ Use Case 2: Loading User Profile from API

When fetching data, update both your state and the page.

```javascript
const profile = state({
  user: {
    name: '',
    email: '',
    bio: ''
  },
  stats: {
    posts: 0,
    followers: 0
  }
});

async function loadProfile(userId) {
  // Fetch from API
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();

  // Update EVERYTHING at once
  profile.$update({
    // Update nested state properties
    'user.name': data.name,
    'user.email': data.email,
    'user.bio': data.bio,
    'stats.posts': data.postCount,
    'stats.followers': data.followerCount,

    // Update DOM elements
    '#profile-name': data.name,
    '#profile-email': data.email,
    '.bio-text': data.bio,
    '#post-count': data.postCount,
    '#follower-count': data.followerCount,
    '.profile-status': 'Loaded!'
  });
}
```

**Why this works:** API responses often have nested data. Dot notation lets you update nested properties easily, and you can reflect changes in the DOM immediately.

---

### ✅ Use Case 3: Shopping Cart Calculations

When cart items change, recalculate and display totals.

```javascript
const cart = state({
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0
});

function recalculateCart() {
  // Calculate all values
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const tax = subtotal * 0.1;  // 10% tax
  const shipping = subtotal > 50 ? 0 : 5.99;  // Free shipping over $50
  const total = subtotal + tax + shipping;

  // Update state AND UI in one shot
  cart.$update({
    // Update state
    subtotal: subtotal,
    tax: tax,
    shipping: shipping,
    total: total,

    // Update DOM with formatted currency
    '#cart-subtotal': `$${subtotal.toFixed(2)}`,
    '#cart-tax': `$${tax.toFixed(2)}`,
    '#cart-shipping': shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE',
    '#cart-total': `$${total.toFixed(2)}`,

    // Update shipping message
    '.shipping-message': shipping === 0
      ? '🎉 You got free shipping!'
      : `Add $${(50 - subtotal).toFixed(2)} more for free shipping`
  });
}

// Call whenever items change
cart.items.push({ name: 'Laptop', price: 999, quantity: 1 });
recalculateCart();
```

**Why this works:** Cart calculations affect multiple properties and UI elements. One `$update()` keeps everything synchronized.

---

### ✅ Use Case 4: Real-Time Dashboard Updates

When fetching metrics, update both data and charts/displays.

```javascript
const dashboard = state({
  metrics: {
    users: { total: 0, active: 0, new: 0 },
    revenue: { today: 0, month: 0 },
    performance: { cpu: 0, memory: 0 }
  },
  lastUpdated: null
});

async function refreshDashboard() {
  const data = await fetch('/api/metrics').then(r => r.json());

  // Update ALL metrics and displays
  dashboard.$update({
    // Update nested state
    'metrics.users.total': data.users.total,
    'metrics.users.active': data.users.active,
    'metrics.users.new': data.users.new,
    'metrics.revenue.today': data.revenue.today,
    'metrics.revenue.month': data.revenue.month,
    'metrics.performance.cpu': data.performance.cpu,
    'metrics.performance.memory': data.performance.memory,

    lastUpdated: new Date(),

    // Update DOM displays
    '#total-users': data.users.total.toLocaleString(),
    '#active-users': data.users.active.toLocaleString(),
    '#new-users': `+${data.users.new}`,
    '#revenue-today': `$${data.revenue.today.toFixed(2)}`,
    '#revenue-month': `$${data.revenue.month.toFixed(2)}`,
    '.cpu-usage': `${data.performance.cpu}%`,
    '.memory-usage': `${data.performance.memory}%`,
    '.last-updated': new Date().toLocaleTimeString()
  });
}

// Auto-refresh every 30 seconds
setInterval(refreshDashboard, 30000);
```

**Why this works:** Dashboards have lots of metrics. `$update()` prevents you from writing dozens of separate update lines.

---

### ✅ Use Case 5: Game State Updates

When game events happen, update stats and UI.

```javascript
const game = state({
  player: {
    health: 100,
    score: 0,
    level: 1,
    position: { x: 0, y: 0 }
  },
  enemies: { count: 5, defeated: 0 }
});

function onEnemyDefeated() {
  const newScore = game.player.score + 100;
  const newDefeated = game.enemies.defeated + 1;
  const newLevel = Math.floor(newScore / 1000) + 1;

  // Update game state and UI
  game.$update({
    // Update nested player stats
    'player.score': newScore,
    'player.level': newLevel,
    'enemies.defeated': newDefeated,

    // Update UI displays
    '#score-display': newScore,
    '#level-display': `Level ${newLevel}`,
    '#enemies-defeated': newDefeated,
    '.game-message': '+100 Points! 🎯',

    // Update progress bar
    '[data-score-percent]': `${(newScore % 1000) / 10}%`
  });

  // Level up message
  if (newLevel > game.player.level) {
    game.$update({
      '.level-up-message': '⬆️ LEVEL UP! ⬆️'
    });
  }
}
```

**Why this works:** Game events affect multiple stats and UI elements. One call keeps game state and display in perfect sync.

---

## How `$update()` Interacts With Other Features

### With Effects - Updates Trigger Re-runs

```javascript
const app = state({ count: 0, message: '' });

effect(() => {
  console.log('Count is:', app.count);
  console.log('Message is:', app.message);
});

// Updates trigger the effect
app.$update({
  count: 10,      // Effect re-runs
  message: 'Hi',  // Effect re-runs again
  '#display': 10  // DOM update (doesn't affect effect)
});
```

**Lesson:** State updates via `$update()` trigger effects just like normal assignments. DOM updates don't affect effects.

---

### With Computed Properties - They Recalculate

```javascript
const cart = state({
  items: [],
  subtotal: 0
});

cart.$computed('total', function() {
  return this.subtotal * 1.1; // Add 10% tax
});

effect(() => {
  console.log('Total:', cart.total);
});

// Update triggers computed recalculation
cart.$update({
  subtotal: 100,
  '#subtotal-display': '$100.00'
});

// cart.total automatically becomes 110
// Effect logs: "Total: 110"
```

**Lesson:** Updating state properties via `$update()` triggers computed properties just like normal assignments.

---

### With Arrays - Patched Methods Work

```javascript
const todos = state({
  items: [],
  count: 0
});

effect(() => {
  console.log(`${todos.items.length} todos`);
});

// Array updates via nested path work!
todos.$update({
  'items.0': { text: 'First todo', done: false },
  count: 1,
  '#todo-count': '1 todo'
});

// But prefer array methods:
todos.items.push({ text: 'Second todo', done: false });
// Effect automatically re-runs!
```

**Lesson:** Nested paths work with arrays, but array methods (`push`, `splice`, etc.) are more natural and automatic.

---

### With `batch()` - Combine Updates

```javascript
const app = state({ count: 0, total: 0, average: 0 });

effect(() => {
  console.log('Effect ran');
});

// Without batch: effect runs 3 times
app.$update({ count: 10 });
app.$update({ total: 100 });
app.$update({ average: 10 });

// With batch: effect runs once
batch(() => {
  app.$update({ count: 10 });
  app.$update({ total: 100 });
  app.$update({ average: 10 });
});
```

**Lesson:** Wrap multiple `$update()` calls in `batch()` to run effects only once.

---

## When NOT to Use `$update()`

### ❌ Don't Use for Simple Single Updates

```javascript
// ❌ Overkill for single property
app.$update({ count: 10 });

// ✅ Just assign directly
app.count = 10;
```

**Why:** `$update()` is for updating multiple things. For single properties, normal assignment is simpler.

---

### ❌ Don't Confuse State Properties with Selectors

```javascript
// ❌ Ambiguous: Is 'div' a state property or a tag selector?
app.$update({
  'div': 'content'  // State property or <div> tag?
});

// ✅ Be explicit
app.$update({
  'divContent': 'content',  // Clearly a state property
  'div': 'content'          // Will update ALL <div> tags!
});
```

**Why:** The system checks if a key looks like a CSS selector. Keys like `div`, `span`, etc. might be treated as tag selectors!

---

### ❌ Don't Expect Nested Objects to Auto-Create in Arrays

```javascript
const app = state({ items: [] });

// ❌ Won't work: items[0] doesn't exist
app.$update({
  'items.0.name': 'John'  // Error or unexpected behavior
});

// ✅ Create the object first
app.items.push({ name: 'John' });

// Or ✅ Update existing item
app.items[0] = { name: 'John' };
app.$update({
  'items.0.name': 'Jane'  // Now it works
});
```

**Why:** Nested paths work with existing objects, but won't auto-create array items.

---

## Comparison with Related Methods

| Method | Purpose | Updates State? | Updates DOM? | Supports Nesting? |
|--------|---------|---------------|--------------|-------------------|
| `state.prop = value` | Simple assignment | ✅ Yes | ❌ No | ❌ No |
| `state.$update({...})` | Multi-property + DOM | ✅ Yes | ✅ Yes | ✅ Yes (dot notation) |
| `state.$set({...})` | Functional updates | ✅ Yes | ❌ No | ❌ No |
| `updateAll(state, values)` | Batch assign | ✅ Yes | ❌ No | ❌ No |

**When to use which:**
- **Normal assignment** - Single property: `app.count = 10`
- **`$update()`** - Multiple properties + DOM + nested: `app.$update({ 'user.name': 'John', '#name': 'John' })`
- **`$set()`** - Functional transformations: `app.$set({ count: (s) => s.count + 1 })`
- **`updateAll()`** - Batch assign multiple properties: `updateAll(app, { count: 10, total: 100 })`

---

## Quick Mental Model

Think of `$update()` as your **"Swiss Army knife" for updates**:

```javascript
state.$update({
  // ✅ Simple properties
  username: 'john',

  // ✅ Nested properties (dot notation)
  'user.profile.name': 'John',

  // ✅ DOM by ID
  '#username-display': 'john',

  // ✅ DOM by class
  '.message': 'Welcome!',

  // ✅ DOM by tag
  'h1': 'My App',

  // ✅ DOM by attribute
  '[data-user]': 'john'
});
```

**Remember:**
- No `#`, `.`, or `[` = State property
- Has `#`, `.`, or `[` = DOM selector
- Has `.` in middle = Nested property (e.g., `user.name`)

---

## Summary

**`state.$update()` updates both state properties AND DOM elements in a single call, with support for nested paths.**

**When to use it:**
- ✅ Updating multiple properties at once
- ✅ Updating state + reflecting in DOM
- ✅ Working with nested properties (`user.profile.name`)
- ✅ Forms, dashboards, carts, games, APIs

**When NOT to use it:**
- ❌ Single property updates (use `state.prop = value`)
- ❌ Functional updates (use `$set()` instead)
- ❌ Don't confuse state properties with tag names

**One-sentence summary:**
Use `$update()` when you need to update multiple state properties and DOM elements together, especially with nested data structures! 🎯

---

➡️ **Next:** Learn about [`$set()`]($set.md) for functional updates, or [`$bind()`]($bind.md) for automatic DOM bindings!
