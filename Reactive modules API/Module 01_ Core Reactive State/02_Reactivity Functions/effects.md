# Understanding `effects()` - A Beginner's Guide

## What is `effects()`?

`effects()` is a **standalone utility function** in the Reactive library that creates multiple reactive effects at once. Unlike `effect()` which creates a single effect, or the individual effect creation, this is a global function that sets up several effects from one object definition.

Think of it as **a batch effect creator** - you pass it an object of named effect functions, and it creates all of them with a single cleanup function to stop them all.

---

## Syntax

```js
// Using the shortcut
const cleanup = effects(definitions)

// Using the full namespace
const cleanup = ReactiveUtils.effects(definitions)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`effects()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.effects()`) - Explicit and clear

**Parameters:**
- `definitions` (Object): An object where keys are effect names and values are effect functions

**Returns:**
- A cleanup function that stops all the effects when called

---

## Why Does This Exist?

### The Problem with Multiple effect() Calls

When you need to create several effects, you need multiple calls and cleanup management:

```javascript
// Manual approach - repetitive and cleanup management needed
const user = state({
  name: 'John',
  email: 'john@example.com',
  theme: 'light'
});

const cleanup1 = effect(() => {
  document.getElementById('userName').textContent = user.name;
});

const cleanup2 = effect(() => {
  document.getElementById('userEmail').textContent = user.email;
});

const cleanup3 = effect(() => {
  document.body.className = user.theme;
});

// Must track all cleanup functions
const cleanupAll = () => {
  cleanup1();
  cleanup2();
  cleanup3();
};

// Repetitive and hard to manage
```

**What's the Real Issue?**

**Problems:**
- Must call `effect()` separately for each effect
- Must track multiple cleanup functions manually
- No semantic naming for effects
- Hard to see all effects at once
- More verbose than necessary
- Cleanup management is error-prone

**Why This Becomes a Problem:**

For multiple effects:
❌ Too many separate function calls
❌ Manual cleanup tracking
❌ No effect organization
❌ Easy to forget cleanups
❌ More code to maintain

In other words, **creating multiple effects is too verbose and cleanup is messy**.
There should be a way to define all effects at once with unified cleanup.

---

### The Solution with `effects()`

When you use `effects()`, you define all effects in one call with automatic cleanup:

```javascript
// Clean approach - all in one place with single cleanup
const user = state({
  name: 'John',
  email: 'john@example.com',
  theme: 'light'
});

const cleanup = effects({
  updateUserName: () => {
    document.getElementById('userName').textContent = user.name;
  },

  updateUserEmail: () => {
    document.getElementById('userEmail').textContent = user.email;
  },

  updateTheme: () => {
    document.body.className = user.theme;
  }
});

// Single cleanup function
// cleanup();

// Clean, organized, and easy to manage!
```

**What Just Happened?**

With `effects()`:
- All effects defined in one object
- Named effects for better clarity
- Single cleanup function returned
- Easy to see all effects at once
- Less code, more readable

**Benefits:**
- Single function call
- Named and organized
- Unified cleanup
- Better readability
- Easier maintenance

---

## How Does It Work?

### Under the Hood

`effects()` creates an effect for each function and returns unified cleanup:

```
effects(definitions)
        ↓
For each key-value pair in definitions:
  1. Create effect for that function
  2. Store cleanup function
        ↓
Return single cleanup function that stops all effects
```

**What happens:**

1. Takes a definitions object
2. Iterates over the object values
3. For each function, calls `effect()` to create a reactive effect
4. Collects all cleanup functions
5. Returns a single function that calls all cleanups
6. Effects run automatically when their dependencies change

---

## Basic Usage

### Creating Multiple Effects

The simplest way to use `effects()`:

```js
// Using the shortcut style
const app = state({
  count: 0,
  message: 'Hello'
});

const cleanup = effects({
  updateCount: () => {
    document.getElementById('count').textContent = app.count;
  },

  updateMessage: () => {
    document.getElementById('message').textContent = app.message;
  },

  updateTitle: () => {
    document.title = `${app.count} - ${app.message}`;
  }
});

// Or using the namespace style
const cleanup = ReactiveUtils.effects({
  updateCount: () => {
    document.getElementById('count').textContent = app.count;
  }
});

app.count = 5;     // All dependent effects run
app.message = 'Hi'; // All dependent effects run

// Stop all effects
cleanup();
```

### DOM Updates

Update multiple DOM elements:

```js
const user = state({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/images/avatar.jpg',
  online: true
});

effects({
  name: () => {
    document.querySelector('.user-name').textContent = user.name;
  },

  email: () => {
    document.querySelector('.user-email').textContent = user.email;
  },

  avatar: () => {
    document.querySelector('.user-avatar').src = user.avatar;
  },

  onlineStatus: () => {
    const indicator = document.querySelector('.online-indicator');
    indicator.className = user.online ? 'online' : 'offline';
    indicator.textContent = user.online ? 'Online' : 'Offline';
  }
});
```

### Multiple State Objects

Effects can track multiple states:

```js
const user = state({ name: 'John' });
const cart = state({ items: [] });
const theme = state({ mode: 'light' });

effects({
  userDisplay: () => {
    document.getElementById('userName').textContent = user.name;
  },

  cartCount: () => {
    document.getElementById('cartBadge').textContent = cart.items.length;
  },

  themeSwitch: () => {
    document.body.className = theme.mode;
  }
});
```

### Logging and Debugging

Track state changes:

```js
const data = state({
  count: 0,
  items: [],
  loading: false
});

effects({
  logCount: () => {
    console.log('[DEBUG] count:', data.count);
  },

  logItems: () => {
    console.log('[DEBUG] items length:', data.items.length);
  },

  logLoading: () => {
    console.log('[DEBUG] loading:', data.loading);
  }
});
```

---

## Common Use Cases

### Use Case 1: Dashboard Updates

Update dashboard widgets:

```js
const dashboard = state({
  visitors: 0,
  pageViews: 0,
  revenue: 0,
  conversions: 0,
  loading: false
});

effects({
  visitorsWidget: () => {
    const el = document.getElementById('visitors');
    el.textContent = dashboard.visitors.toLocaleString();
    el.className = dashboard.loading ? 'loading' : '';
  },

  pageViewsWidget: () => {
    const el = document.getElementById('pageViews');
    el.textContent = dashboard.pageViews.toLocaleString();
  },

  revenueWidget: () => {
    const el = document.getElementById('revenue');
    el.textContent = `$${dashboard.revenue.toFixed(2)}`;
  },

  conversionsWidget: () => {
    const el = document.getElementById('conversions');
    el.textContent = dashboard.conversions;
  },

  loadingIndicator: () => {
    const spinner = document.getElementById('dashboardSpinner');
    spinner.style.display = dashboard.loading ? 'block' : 'none';
  }
});
```

### Use Case 2: Form Field Synchronization

Sync form displays:

```js
const form = state({
  username: '',
  email: '',
  password: '',
  errors: {},
  isValid: true,
  isSubmitting: false
});

effects({
  usernameDisplay: () => {
    document.getElementById('usernamePreview').textContent = form.username || 'Not set';
  },

  emailDisplay: () => {
    document.getElementById('emailPreview').textContent = form.email || 'Not set';
  },

  passwordStrength: () => {
    const strength = calculatePasswordStrength(form.password);
    const meter = document.getElementById('passwordMeter');
    meter.style.width = `${strength}%`;
    meter.className = strength > 75 ? 'strong' : strength > 50 ? 'medium' : 'weak';
  },

  errorMessages: () => {
    Object.keys(form.errors).forEach(field => {
      const errorEl = document.getElementById(`${field}Error`);
      if (errorEl) {
        errorEl.textContent = form.errors[field] || '';
        errorEl.style.display = form.errors[field] ? 'block' : 'none';
      }
    });
  },

  submitButton: () => {
    const btn = document.getElementById('submitBtn');
    btn.disabled = !form.isValid || form.isSubmitting;
    btn.textContent = form.isSubmitting ? 'Submitting...' : 'Submit';
  }
});

function calculatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  return strength;
}
```

### Use Case 3: Real-Time Notifications

Display notifications reactively:

```js
const notifications = state({
  messages: [],
  unreadCount: 0,
  hasNew: false
});

effects({
  notificationBadge: () => {
    const badge = document.getElementById('notificationBadge');
    badge.textContent = notifications.unreadCount;
    badge.style.display = notifications.unreadCount > 0 ? 'inline' : 'none';
  },

  notificationList: () => {
    const list = document.getElementById('notificationList');
    list.innerHTML = notifications.messages.map(msg => `
      <div class="notification ${msg.read ? 'read' : 'unread'}">
        <h4>${msg.title}</h4>
        <p>${msg.message}</p>
        <span class="time">${formatTime(msg.timestamp)}</span>
      </div>
    `).join('');
  },

  notificationSound: () => {
    if (notifications.hasNew) {
      playNotificationSound();
      notifications.hasNew = false;
    }
  },

  documentTitle: () => {
    const unread = notifications.unreadCount;
    document.title = unread > 0 ? `(${unread}) Messages` : 'Messages';
  }
});

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

function playNotificationSound() {
  const audio = new Audio('/sounds/notification.mp3');
  audio.play();
}
```

### Use Case 4: Shopping Cart UI

Update cart interface:

```js
const cart = state({
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  couponApplied: false,
  isEmpty: true
});

effects({
  cartItemList: () => {
    const list = document.getElementById('cartItems');
    list.innerHTML = cart.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <span class="price">$${item.price.toFixed(2)}</span>
        <span class="qty">Qty: ${item.quantity}</span>
      </div>
    `).join('');
  },

  cartSummary: () => {
    document.getElementById('subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${cart.tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${cart.shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${cart.total.toFixed(2)}`;
  },

  cartBadge: () => {
    const badge = document.getElementById('cartBadge');
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = itemCount;
    badge.style.display = itemCount > 0 ? 'inline' : 'none';
  },

  emptyState: () => {
    const emptyMsg = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');

    emptyMsg.style.display = cart.isEmpty ? 'block' : 'none';
    checkoutBtn.disabled = cart.isEmpty;
  },

  couponIndicator: () => {
    const indicator = document.getElementById('couponIndicator');
    indicator.style.display = cart.couponApplied ? 'block' : 'none';
  }
});
```

### Use Case 5: Game HUD Updates

Update game interface:

```js
const game = state({
  score: 0,
  lives: 3,
  level: 1,
  health: 100,
  ammo: 30,
  time: 0,
  isPaused: false,
  isGameOver: false
});

effects({
  scoreDisplay: () => {
    document.getElementById('score').textContent = game.score.toLocaleString();
  },

  livesDisplay: () => {
    const container = document.getElementById('lives');
    container.innerHTML = '❤️'.repeat(game.lives);
  },

  levelDisplay: () => {
    document.getElementById('level').textContent = `Level ${game.level}`;
  },

  healthBar: () => {
    const bar = document.getElementById('healthBar');
    bar.style.width = `${game.health}%`;
    bar.className = game.health > 50 ? 'healthy' : game.health > 25 ? 'warning' : 'danger';
  },

  ammoCounter: () => {
    const counter = document.getElementById('ammo');
    counter.textContent = game.ammo;
    counter.className = game.ammo === 0 ? 'empty' : game.ammo < 10 ? 'low' : '';
  },

  timer: () => {
    const minutes = Math.floor(game.time / 60);
    const seconds = game.time % 60;
    document.getElementById('timer').textContent =
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  },

  pauseOverlay: () => {
    const overlay = document.getElementById('pauseOverlay');
    overlay.style.display = game.isPaused ? 'flex' : 'none';
  },

  gameOverScreen: () => {
    const screen = document.getElementById('gameOverScreen');
    screen.style.display = game.isGameOver ? 'flex' : 'none';
    if (game.isGameOver) {
      document.getElementById('finalScore').textContent = game.score.toLocaleString();
    }
  }
});
```

---

## Advanced Patterns

### Pattern 1: Conditional Effects

Create effects based on conditions:

```js
function createEffects(options = {}) {
  const effectDefs = {};

  if (options.logging) {
    effectDefs.logging = () => {
      console.log('State:', state.data);
    };
  }

  if (options.analytics) {
    effectDefs.analytics = () => {
      trackEvent('state_change', { value: state.data });
    };
  }

  if (options.persistence) {
    effectDefs.persistence = () => {
      localStorage.setItem('data', JSON.stringify(state.data));
    };
  }

  return effects(effectDefs);
}

const cleanup = createEffects({
  logging: true,
  analytics: false,
  persistence: true
});
```

### Pattern 2: Effect Groups

Organize effects by feature:

```js
const state = { /* ... */ };

const cleanups = {
  ui: null,
  analytics: null,
  persistence: null
};

function enableUIEffects() {
  cleanups.ui = effects({
    updateHeader: () => { /* ... */ },
    updateSidebar: () => { /* ... */ },
    updateFooter: () => { /* ... */ }
  });
}

function enableAnalytics() {
  cleanups.analytics = effects({
    trackPageView: () => { /* ... */ },
    trackUserAction: () => { /* ... */ }
  });
}

function enablePersistence() {
  cleanups.persistence = effects({
    saveToLocalStorage: () => { /* ... */ },
    syncWithServer: () => { /* ... */ }
  });
}

function disableAll() {
  Object.values(cleanups).forEach(cleanup => {
    if (cleanup) cleanup();
  });
}
```

### Pattern 3: Throttled/Debounced Effects

Control effect execution frequency:

```js
function throttle(fn, limit) {
  let waiting = false;
  return function(...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;
      setTimeout(() => { waiting = false; }, limit);
    }
  };
}

const state = state({ scrollY: 0, searchQuery: '' });

effects({
  // Throttle scroll updates
  updateScrollIndicator: throttle(() => {
    const indicator = document.getElementById('scrollIndicator');
    indicator.style.width = `${(state.scrollY / document.body.scrollHeight) * 100}%`;
  }, 100),

  // Debounce search
  performSearch: (() => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        search(state.searchQuery);
      }, 300);
    };
  })()
});
```

### Pattern 4: Effect Dependencies

Track which states affect which effects:

```js
const user = state({ name: 'John' });
const cart = state({ items: [] });
const theme = state({ mode: 'light' });

// Document effect dependencies
const effectDependencies = {
  userDisplay: ['user.name'],
  cartCount: ['cart.items'],
  themeSwitch: ['theme.mode'],
  header: ['user.name', 'cart.items', 'theme.mode']
};

effects({
  userDisplay: () => {
    document.getElementById('userName').textContent = user.name;
  },

  cartCount: () => {
    document.getElementById('cartBadge').textContent = cart.items.length;
  },

  themeSwitch: () => {
    document.body.className = theme.mode;
  },

  header: () => {
    // Updates based on multiple dependencies
    const header = document.getElementById('header');
    header.className = theme.mode;
    header.querySelector('.user').textContent = user.name;
    header.querySelector('.cart-count').textContent = cart.items.length;
  }
});
```

---

## Performance Tips

### Tip 1: Batch DOM Updates

Group DOM changes together:

```js
// Less efficient - separate effects
effects({
  updateName: () => {
    document.getElementById('name').textContent = user.name;
  },
  updateEmail: () => {
    document.getElementById('email').textContent = user.email;
  }
});

// More efficient - batch updates
effects({
  updateUserInfo: () => {
    // Both updates in one effect
    document.getElementById('name').textContent = user.name;
    document.getElementById('email').textContent = user.email;
  }
});
```

### Tip 2: Clean Up When Not Needed

Stop effects when component unmounts:

```js
let cleanup;

function mountComponent() {
  cleanup = effects({
    updateUI: () => { /* ... */ }
  });
}

function unmountComponent() {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
}
```

### Tip 3: Avoid Heavy Operations

Keep effects lightweight:

```js
// BAD - expensive in effect
effects({
  updateList: () => {
    const sorted = [...state.items].sort((a, b) => b.value - a.value);
    renderList(sorted);
  }
});

// GOOD - use computed for expensive work
state.$computed('sortedItems', function() {
  return [...this.items].sort((a, b) => b.value - a.value);
});

effects({
  updateList: () => {
    renderList(state.sortedItems); // Uses cached value
  }
});
```

---

## Common Pitfalls

### Pitfall 1: Infinite Loops

**Problem:** Effect modifies state it depends on:

```js
// WRONG - infinite loop!
effects({
  updateCount: () => {
    state.count++; // Modifies state, triggers effect again!
    document.getElementById('count').textContent = state.count;
  }
});

// RIGHT - only read state
effects({
  updateCount: () => {
    document.getElementById('count').textContent = state.count; // Only read
  }
});
```

### Pitfall 2: Not Cleaning Up

**Problem:** Effects keep running after component removed:

```js
// BAD
function createWidget() {
  effects({
    update: () => { /* ... */ }
  });
}

// GOOD
function createWidget() {
  const cleanup = effects({
    update: () => { /* ... */ }
  });

  return { destroy: cleanup };
}
```

### Pitfall 3: Missing Dependencies

**Problem:** Effect doesn't track all needed state:

```js
const user = state({ name: 'John' });
const settings = state({ showEmail: true });

// BAD - doesn't react to settings.showEmail
effects({
  display: () => {
    const show = settings.showEmail; // Read outside effect - not tracked!
    if (show) {
      document.getElementById('userName').textContent = user.name;
    }
  }
});

// GOOD - all reads inside effect
effects({
  display: () => {
    if (settings.showEmail) { // Read inside - tracked!
      document.getElementById('userName').textContent = user.name;
    }
  }
});
```

### Pitfall 4: Forgetting Return Value

**Problem:** Not storing the cleanup function:

```js
// BAD
effects({
  update: () => { /* ... */ }
});
// Can't clean up!

// GOOD
const cleanup = effects({
  update: () => { /* ... */ }
});
// cleanup() when done
```

---

## Summary

**`effects()` creates multiple reactive effects in one call.**

Key takeaways:
- ✅ **Batch effect creation** - create multiple effects at once
- ✅ Both **shortcut** (`effects()`) and **namespace** (`ReactiveUtils.effects()`) styles are valid
- ✅ Takes a **definitions object** with named effects
- ✅ Returns **single cleanup function** for all effects
- ✅ Effects are **named** for better organization
- ✅ Great for **DOM updates**, **UI sync**, **logging**
- ✅ All effects run **automatically** when dependencies change
- ⚠️ Avoid **infinite loops** (don't modify dependencies)
- ⚠️ Always **clean up** when effects no longer needed
- ⚠️ Keep effects **lightweight** and focused

**Remember:** `effects()` is perfect for organizing multiple reactive side effects in one place. Use it to batch DOM updates, sync multiple UI elements, or create organized effect groups! 🎉

➡️ Next, explore [`effect()`](effect.md) for single effects or [`bindings()`](bindings.md) for declarative DOM binding!
