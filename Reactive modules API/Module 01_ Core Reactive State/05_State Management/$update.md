# Understanding `state.$update()` - A Beginner's Guide

## What is `state.$update()`?

`state.$update()` is a **state instance method** that performs mixed state property updates AND DOM element updates in a single call. It can update both reactive state properties and DOM elements using CSS selectors.

Think of it as **a unified update method** - you can update your state and the DOM together, with support for nested property paths and any CSS selector.

---

## Syntax

```js
state.$update(updates)
```

**Parameters:**
- `updates` (Object): Object with keys for state properties OR CSS selectors
  - State keys: Update state properties (supports nested paths with dot notation)
  - CSS selectors: Update DOM elements (`#id`, `.class`, `tag`, `[attr]`, etc.)

**Returns:**
- The state object (for chaining)

---

## Why Does This Exist?

### The Problem with Separate Updates

When you need to update both state and DOM, you do it separately:

```javascript
// Without $update - separate operations
const app = state({
  count: 0,
  message: 'Hello',
  status: 'idle'
});

// Update state
app.count = 10;
app.message = 'Updated';
app.status = 'active';

// Update DOM separately
document.getElementById('counter').textContent = app.count;
document.querySelector('.message').textContent = app.message;
document.querySelector('.status').textContent = app.status;

// Nested updates require multiple lines
app.user = app.user || {};
app.user.name = 'John';
app.user.email = 'john@example.com';
```

**What's the Real Issue?**

**Problems:**
- Separate state and DOM updates
- Verbose nested property updates
- Multiple lines for related changes
- No single update call
- Hard to batch related updates

---

### The Solution with `$update()`

When you use `$update()`, you update everything at once:

```javascript
// With $update() - unified updates
const app = state({
  count: 0,
  message: 'Hello',
  status: 'idle',
  user: {}
});

// Update state AND DOM in one call
app.$update({
  // Update state properties
  count: 10,
  message: 'Updated',
  status: 'active',

  // Update nested properties with dot notation
  'user.name': 'John',
  'user.email': 'john@example.com',

  // Update DOM elements (CSS selectors)
  '#counter': 10,              // Update element with ID
  '.message': 'Updated',       // Update elements with class
  '.status': 'active'          // Update status display
});

// Everything updated in one call!
```

**Benefits:**
- Unified state + DOM updates
- Nested property support
- Any CSS selector support
- Single update call
- Clean and concise
- Chainable API

---

## How Does It Work?

### Under the Hood

`$update()` processes each key-value pair:

```
state.$update(updates)
        ↓
1. Iterate through each key-value pair
2. If key is a CSS selector (contains #, ., [, or tag):
   - Find DOM elements
   - Update their content/value
3. If key is a property path:
   - Update state property (supports nested paths)
        ↓
Returns state object for chaining
```

---

## Basic Usage

### Update State Properties

```js
const user = state({
  name: 'John',
  age: 25,
  email: ''
});

// Update multiple properties
user.$update({
  name: 'Jane',
  age: 26,
  email: 'jane@example.com'
});

console.log(user.name); // 'Jane'
console.log(user.age); // 26
console.log(user.email); // 'jane@example.com'
```

### Update DOM Elements

```js
const app = state({ count: 0 });

// Update DOM elements using CSS selectors
app.$update({
  '#counter': 10,           // Update element with id="counter"
  '.status': 'Active',      // Update elements with class="status"
  'h1': 'New Title',        // Update all h1 elements
  '[data-value]': 'Test'    // Update elements with data-value attribute
});
```

### Update Both State and DOM

```js
const form = state({
  username: '',
  email: ''
});

// Update state and reflect in DOM
form.$update({
  // State properties
  username: 'john_doe',
  email: 'john@example.com',

  // DOM elements
  '#username-display': 'john_doe',
  '#email-display': 'john@example.com',
  '.form-status': 'Filled'
});
```

### Nested Property Updates

```js
const app = state({
  user: {
    profile: {
      name: '',
      bio: ''
    }
  },
  settings: {}
});

// Update nested properties with dot notation
app.$update({
  'user.profile.name': 'John Doe',
  'user.profile.bio': 'Software developer',
  'settings.theme': 'dark',
  'settings.notifications': true
});

console.log(app.user.profile.name); // 'John Doe'
console.log(app.settings.theme); // 'dark'
```

---

## Common Use Cases

### Use Case 1: Form Submission with Feedback

```js
const form = state({
  username: '',
  password: '',
  status: 'idle',
  message: ''
});

// Submit form
async function submitForm() {
  // Show loading state
  form.$update({
    status: 'loading',
    message: 'Submitting...',

    // Update UI elements
    '#submit-btn': 'Submitting...',
    '.form-message': 'Please wait...',
    '.spinner': 'visible'
  });

  try {
    // Simulate API call
    await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: form.username,
        password: form.password
      })
    });

    // Show success state
    form.$update({
      status: 'success',
      message: 'Login successful!',

      // Update UI
      '#submit-btn': 'Success',
      '.form-message': 'Login successful!',
      '.spinner': 'hidden'
    });
  } catch (error) {
    // Show error state
    form.$update({
      status: 'error',
      message: 'Login failed',

      // Update UI
      '#submit-btn': 'Try Again',
      '.form-message': 'Login failed. Please try again.',
      '.spinner': 'hidden'
    });
  }
}
```

### Use Case 2: User Profile Update

```js
const profile = state({
  user: {
    name: '',
    email: '',
    bio: '',
    avatar: ''
  },
  stats: {
    posts: 0,
    followers: 0,
    following: 0
  }
});

// Load user profile from API
async function loadProfile(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();

  // Update state and DOM in one call
  profile.$update({
    // Update nested user properties
    'user.name': data.name,
    'user.email': data.email,
    'user.bio': data.bio,
    'user.avatar': data.avatar,

    // Update stats
    'stats.posts': data.postCount,
    'stats.followers': data.followerCount,
    'stats.following': data.followingCount,

    // Update DOM elements
    '#profile-name': data.name,
    '#profile-email': data.email,
    '.bio-text': data.bio,
    '#post-count': data.postCount,
    '#follower-count': data.followerCount,
    '#following-count': data.followingCount
  });
}
```

### Use Case 3: Shopping Cart Calculations

```js
const cart = state({
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  discount: 0
});

// Recalculate cart totals
function updateCartTotals() {
  // Calculate values
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const discount = subtotal > 100 ? subtotal * 0.1 : 0;
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * 0.1;
  const shipping = afterDiscount > 50 ? 0 : 5.99;
  const total = afterDiscount + tax + shipping;

  // Update state and UI in one call
  cart.$update({
    // State properties
    subtotal: subtotal,
    discount: discount,
    tax: tax,
    shipping: shipping,
    total: total,

    // DOM elements with formatted values
    '#cart-subtotal': `$${subtotal.toFixed(2)}`,
    '#cart-discount': discount > 0 ? `-$${discount.toFixed(2)}` : '$0.00',
    '#cart-tax': `$${tax.toFixed(2)}`,
    '#cart-shipping': shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE',
    '#cart-total': `$${total.toFixed(2)}`,
    '.item-count': cart.items.length
  });
}
```

### Use Case 4: Game State Update

```js
const game = state({
  player: {
    health: 100,
    score: 0,
    level: 1,
    position: { x: 0, y: 0 }
  },
  enemies: {
    count: 5,
    defeated: 0
  },
  status: 'playing'
});

// Update game state (e.g., player collected powerup)
function collectPowerup(powerup) {
  // Calculate new values
  const newHealth = Math.min(100, game.player.health + 20);
  const newScore = game.player.score + 100;
  const newLevel = Math.floor(newScore / 1000) + 1;

  // Update everything at once
  game.$update({
    // Update nested player properties
    'player.health': newHealth,
    'player.score': newScore,
    'player.level': newLevel,

    // Update UI elements
    '#health-bar': `${newHealth}%`,
    '#score-display': newScore,
    '#level-display': `Level ${newLevel}`,
    '.powerup-message': `+20 Health! +100 Score!`,
    '[data-health]': newHealth
  });

  // Play sound effect
  playSound('powerup');
}
```

### Use Case 5: Dashboard Metrics Update

```js
const dashboard = state({
  metrics: {
    users: {
      total: 0,
      active: 0,
      new: 0
    },
    revenue: {
      today: 0,
      month: 0,
      year: 0
    },
    performance: {
      cpu: 0,
      memory: 0,
      requests: 0
    }
  },
  lastUpdated: null
});

// Fetch and update all metrics
async function refreshMetrics() {
  const data = await fetch('/api/metrics').then(r => r.json());

  // Update all metrics at once
  dashboard.$update({
    // Update nested metrics
    'metrics.users.total': data.users.total,
    'metrics.users.active': data.users.active,
    'metrics.users.new': data.users.new,

    'metrics.revenue.today': data.revenue.today,
    'metrics.revenue.month': data.revenue.month,
    'metrics.revenue.year': data.revenue.year,

    'metrics.performance.cpu': data.performance.cpu,
    'metrics.performance.memory': data.performance.memory,
    'metrics.performance.requests': data.performance.requests,

    lastUpdated: new Date(),

    // Update DOM elements
    '#total-users': data.users.total.toLocaleString(),
    '#active-users': data.users.active.toLocaleString(),
    '#new-users': `+${data.users.new}`,

    '#revenue-today': `$${data.revenue.today.toFixed(2)}`,
    '#revenue-month': `$${data.revenue.month.toFixed(2)}`,
    '#revenue-year': `$${data.revenue.year.toFixed(2)}`,

    '.cpu-usage': `${data.performance.cpu}%`,
    '.memory-usage': `${data.performance.memory}%`,
    '.request-count': data.performance.requests.toLocaleString(),

    '.last-updated': new Date().toLocaleTimeString()
  });
}

// Refresh every 30 seconds
setInterval(refreshMetrics, 30000);
```

---

## Advanced Patterns

### Pattern 1: Conditional Updates

```js
const app = state({
  user: null,
  isLoggedIn: false
});

// Update based on login status
function updateAuthState(userData) {
  const updates = {
    isLoggedIn: !!userData,
    '.auth-status': userData ? 'Logged in' : 'Guest'
  };

  if (userData) {
    // Add user-specific updates
    updates.user = userData;
    updates['user.lastLogin'] = new Date();
    updates['#username-display'] = userData.name;
    updates['#user-avatar'] = userData.avatar;
  } else {
    updates.user = null;
    updates['#username-display'] = 'Guest';
  }

  app.$update(updates);
}
```

### Pattern 2: Chained Updates

```js
const form = state({
  step: 1,
  data: {}
});

// Chain multiple updates
form.$update({
  step: 2,
  'data.step1': 'completed',
  '.step-indicator': 'Step 2 of 3'
}).$update({
  'data.currentStep': 2,
  '#progress-bar': '66%'
});
```

### Pattern 3: Batch API Response

```js
const app = state({
  data: {},
  ui: {}
});

// Process API response
async function loadData() {
  const [userData, settingsData, statsData] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/settings').then(r => r.json()),
    fetch('/api/stats').then(r => r.json())
  ]);

  // Apply all updates at once
  app.$update({
    // Merge user data
    'data.user': userData,
    'data.settings': settingsData,
    'data.stats': statsData,

    // Update UI state
    'ui.loaded': true,
    'ui.loading': false,

    // Update DOM
    '.loading-spinner': 'hidden',
    '.main-content': 'visible',
    '#user-name': userData.name,
    '.stats-value': statsData.total
  });
}
```

### Pattern 4: Form Auto-Save

```js
const editor = state({
  content: {
    title: '',
    body: '',
    tags: []
  },
  meta: {
    savedAt: null,
    isDirty: false
  }
});

let saveTimeout;

// Auto-save on changes
function scheduleAutoSave() {
  clearTimeout(saveTimeout);

  // Mark as dirty
  editor.$update({
    'meta.isDirty': true,
    '.save-status': 'Unsaved changes...'
  });

  // Save after 2 seconds
  saveTimeout = setTimeout(async () => {
    await saveContent();

    editor.$update({
      'meta.savedAt': new Date(),
      'meta.isDirty': false,
      '.save-status': 'All changes saved',
      '.last-saved': new Date().toLocaleTimeString()
    });
  }, 2000);
}
```

---

## Performance Tips

### Tip 1: Batch Related Updates

```js
// GOOD - single $update call
state.$update({
  count: 10,
  total: 100,
  '#display': '10/100'
});

// BAD - multiple separate calls
state.count = 10;
state.total = 100;
document.querySelector('#display').textContent = '10/100';
```

### Tip 2: Use Nested Paths

```js
// GOOD - dot notation
state.$update({
  'user.profile.name': 'John',
  'user.profile.age': 25
});

// BAD - manual nesting
state.user = state.user || {};
state.user.profile = state.user.profile || {};
state.user.profile.name = 'John';
state.user.profile.age = 25;
```

### Tip 3: Minimize DOM Selectors

```js
// GOOD - specific selectors
state.$update({
  '#counter': 10,
  '.status': 'Active'
});

// BAD - expensive selectors
state.$update({
  'div > ul > li:first-child': 10
});
```

---

## Common Pitfalls

### Pitfall 1: Selector Conflicts

```js
// WRONG - ambiguous key
state.$update({
  'user': 'John' // Is this state property or CSS selector?
});

// RIGHT - clear intent
state.$update({
  'user': 'John', // State property (no selector symbols)
  '.user': 'John' // CSS class selector
});
```

### Pitfall 2: Non-Existent Nested Paths

```js
// WRONG - path doesn't exist
state.$update({
  'deeply.nested.path': 'value'
  // Will create nested objects
});

// RIGHT - ensure path exists or is intended
state.deeply = state.deeply || {};
state.$update({
  'deeply.nested.path': 'value'
});
```

### Pitfall 3: Forgetting Return Value

```js
// WRONG - not using chain
state.$update({ count: 10 });
state.$watch('count', callback);

// RIGHT - chain methods
state.$update({ count: 10 }).$watch('count', callback);
```

---

## Summary

**`state.$update()` updates both state properties and DOM elements.**

Key takeaways:
- ✅ **Unified updates** for state and DOM in one call
- ✅ Supports **any CSS selector** (#id, .class, tag, [attr])
- ✅ **Nested property paths** with dot notation
- ✅ Returns **state** for chaining
- ✅ Great for **forms**, **dashboards**, **games**, **API responses**
- ⚠️ Use clear **selector syntax** to avoid ambiguity
- ⚠️ **Batch updates** for better performance
- ⚠️ Be careful with **non-existent nested paths**

**Remember:** Use `$update()` when you need to update state and DOM together, or when working with nested properties! 🎉

➡️ Next, explore [`$set()`]($set.md) for functional updates or [`$bind()`]($bind.md) for reactive DOM bindings!
