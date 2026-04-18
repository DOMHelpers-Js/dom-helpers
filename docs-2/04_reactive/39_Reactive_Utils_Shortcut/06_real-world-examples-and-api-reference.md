[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples and API Reference

## How to read these examples

Each example below is a complete, runnable scenario. Every global function used comes from the Standalone API. None of them require typing `ReactiveUtils.` — just plain function calls.

---

## Example 1: Live search with debounced fetch

A search box that fetches results as the user types, cancelling previous requests automatically.

```html
<input id="searchInput" type="text" placeholder="Search...">
<div id="results">Start typing to search</div>
<div id="loader" style="display: none;">Searching...</div>
```

```javascript
const search = state({ query: '' });

// Track user input
document.getElementById('searchInput').addEventListener('input', (e) => {
  search.query = e.target.value;
});

// Async effect cancels the previous fetch when query changes
asyncEffect(async (signal) => {
  const q = search.query.trim();

  if (!q) {
    document.getElementById('results').textContent = 'Start typing to search';
    return;
  }

  document.getElementById('loader').style.display = 'block';

  const response = await fetch('/api/search?q=' + encodeURIComponent(q), { signal });
  const data = await response.json();

  document.getElementById('loader').style.display = 'none';
  document.getElementById('results').innerHTML =
    data.map(r => `<div class="result">${r.title}</div>`).join('') ||
    'No results found';
}, {
  onError: (error) => {
    if (error.name !== 'AbortError') {
      document.getElementById('results').textContent = 'Search failed. Try again.';
      document.getElementById('loader').style.display = 'none';
    }
  }
});
```

**What's happening:**
1. `state()` tracks the search query
2. `asyncEffect()` watches `search.query` and fetches results
3. When the user types fast, each new `asyncEffect` run cancels the previous fetch
4. Only the last result ever renders — no stale data

---

## Example 2: Theme switcher with persistence

A light/dark theme toggle that remembers the user's choice across page loads.

```html
<button id="themeToggle">Toggle Theme</button>
<p id="themeStatus">Current theme: light</p>
```

```javascript
const settings = state({ theme: 'light' });

// Persist to localStorage — survives page refresh
autoSave(settings, 'app-settings', { debounce: 100 });

// Apply theme to DOM
effect(() => {
  document.body.className = 'theme-' + settings.theme;
  document.getElementById('themeStatus').textContent =
    'Current theme: ' + settings.theme;
});

// Toggle on click
document.getElementById('themeToggle').addEventListener('click', () => {
  settings.theme = settings.theme === 'light' ? 'dark' : 'light';
});

// React to changes in OTHER tabs
watchStorage('app-settings', () => {
  settings.$load();  // reload from localStorage
});
```

**What's happening:**
1. `state()` holds the theme preference
2. `autoSave()` adds localStorage persistence — one line!
3. `effect()` applies the class whenever theme changes
4. `watchStorage()` listens for changes from other tabs and reloads

---

## Example 3: User profile form

A reactive form with validation that shows errors as the user types.

```html
<form id="profileForm">
  <input id="nameInput" placeholder="Full name">
  <span id="nameError" class="error"></span>

  <input id="emailInput" placeholder="Email">
  <span id="emailError" class="error"></span>

  <button id="submitBtn" disabled>Save Profile</button>
</form>
```

```javascript
const profileForm = form(
  { name: '', email: '' },
  {
    validators: {
      name: validators.required('Name is required'),
      email: validators.combine(
        validators.required('Email is required'),
        validators.email('Please enter a valid email address')
      )
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(values)
      });
      return response.json();
    }
  }
);

// Bind inputs
document.getElementById('nameInput').addEventListener('input', (e) => {
  profileForm.handleChange('name', e.target.value);
});

document.getElementById('emailInput').addEventListener('input', (e) => {
  profileForm.handleChange('email', e.target.value);
});

// Show errors and control submit button reactively
effect(() => {
  document.getElementById('nameError').textContent =
    profileForm.errors.name || '';

  document.getElementById('emailError').textContent =
    profileForm.errors.email || '';

  document.getElementById('submitBtn').disabled = !profileForm.isValid;
});

// Submit
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const result = await profileForm.submit();
  if (result.success) {
    alert('Profile saved!');
  }
});
```

---

## Example 4: Shopping cart with computed totals

A cart that tracks items, computes totals, and persists across page loads.

```html
<div id="cartItems"></div>
<div id="cartSummary">
  <span id="itemCount">0 items</span>
  <span id="subtotal">$0.00</span>
  <span id="tax">Tax: $0.00</span>
  <span id="total">Total: $0.00</span>
</div>
<button id="clearCart">Clear Cart</button>
```

```javascript
const cart = state({
  items: [],
  taxRate: 0.08
});

computed(cart, {
  subtotal: function() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  },
  tax: function() {
    return this.subtotal * this.taxRate;
  },
  total: function() {
    return this.subtotal + this.tax;
  },
  itemCount: function() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }
});

autoSave(cart, 'shopping-cart', { debounce: 200 });

// Render cart
effect(() => {
  document.getElementById('cartItems').innerHTML =
    cart.items.map(item => `
      <div>
        <strong>${item.name}</strong>
        $${item.price.toFixed(2)} × ${item.qty}
      </div>
    `).join('');

  document.getElementById('itemCount').textContent = cart.itemCount + ' items';
  document.getElementById('subtotal').textContent = '$' + cart.subtotal.toFixed(2);
  document.getElementById('tax').textContent = 'Tax: $' + cart.tax.toFixed(2);
  document.getElementById('total').textContent = 'Total: $' + cart.total.toFixed(2);
});

// Actions
function addToCart(item) {
  batch(() => {
    const existing = cart.items.find(i => i.id === item.id);
    if (existing) {
      existing.qty++;
    } else {
      cart.items = [...cart.items, { ...item, qty: 1 }];
    }
  });
}

document.getElementById('clearCart').addEventListener('click', () => {
  cart.items = [];
  cart.$clear();  // also remove from localStorage
});
```

---

## Example 5: Dashboard with protected effects

A dashboard that loads multiple data sources and uses error boundaries to stay resilient.

```javascript
const dashboard = state({
  user: null,
  stats: null,
  notifications: []
});

const boundary = new ErrorBoundary({
  onError: (error) => {
    console.error('Dashboard error:', error.message);
  },
  fallback: () => {
    document.getElementById('dashboard').innerHTML =
      '<p class="error">Dashboard unavailable. Please refresh.</p>';
  }
});

boundary.run(() => {
  effect(() => {
    if (dashboard.user) {
      document.getElementById('welcomeMsg').textContent =
        'Welcome back, ' + dashboard.user.name;
    }
  });

  effect(() => {
    if (dashboard.stats) {
      document.getElementById('totalUsers').textContent = dashboard.stats.users;
      document.getElementById('totalRevenue').textContent =
        '$' + dashboard.stats.revenue.toFixed(2);
    }
  });

  effect(() => {
    const count = dashboard.notifications.length;
    document.getElementById('notifBadge').textContent = count;
    document.getElementById('notifBadge').style.display = count > 0 ? 'block' : 'none';
  });
});

// Load data (using standalone global functions throughout)
const userState = asyncState(null);
const statsState = asyncState(null);

userState.$execute(async (signal) => {
  const r = await fetch('/api/me', { signal });
  dashboard.user = await r.json();
});

statsState.$execute(async (signal) => {
  const r = await fetch('/api/stats', { signal });
  dashboard.stats = await r.json();
});
```

---

## Example 6: Component with full cleanup

A UI component that registers effects and cleans them up when removed from the page.

```javascript
function createUserCard(userId) {
  const userData = state({ name: '', status: 'loading', avatar: null });

  // scope() collects all effects and returns one cleanup function
  const cleanup = scope((collect) => {
    collect(effect(() => {
      document.getElementById('userName-' + userId).textContent = userData.name;
    }));

    collect(effect(() => {
      const el = document.getElementById('userStatus-' + userId);
      el.textContent = userData.status;
      el.className = 'status ' + userData.status;
    }));

    collect(watch(userData, {
      status: (newStatus) => {
        console.log('User', userId, 'status changed to', newStatus);
      }
    }));
  });

  // Load user data
  fetch('/api/users/' + userId)
    .then(r => r.json())
    .then(data => {
      batch(() => {
        userData.name = data.name;
        userData.status = data.isOnline ? 'online' : 'offline';
        userData.avatar = data.avatar;
      });
    });

  // Return cleanup function for the caller
  return {
    data: userData,
    destroy: cleanup
  };
}

// Usage:
const card = createUserCard(42);

// Later, when the card is removed from the page:
card.destroy();  // all effects and watchers stop
```

---

## Example 7: Multi-tab notification sync

Using `watchStorage()` to keep a notification badge in sync across browser tabs.

```javascript
const notifications = state({ count: 0, items: [] });

// Load initial count from storage
notifications.count = parseInt(localStorage.getItem('notif-count') || '0');

// Show badge
effect(() => {
  const badge = document.getElementById('notifBadge');
  badge.textContent = notifications.count;
  badge.style.display = notifications.count > 0 ? 'inline' : 'none';
});

// Watch for changes from other tabs
watchStorage('notif-count', (newCount) => {
  notifications.count = parseInt(newCount || '0');
}, { immediate: false });

// When this tab marks notifications as read:
function markAllRead() {
  batch(() => {
    notifications.count = 0;
    notifications.items = [];
  });
  localStorage.setItem('notif-count', '0');
  // Other tabs will pick this up via watchStorage
}
```

---

## Complete API Reference

### Core State

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `state()` | `state(initialValues)` | Reactive state object | Core |
| `createState()` | `createState(values, bindings)` | Reactive state with DOM binding | Core |
| `effect()` | `effect(fn)` | dispose function | Core |
| `batch()` | `batch(fn)` | void | Core |
| `computed()` | `computed(state, computedDefs)` | void | Core |
| `watch()` | `watch(state, handlers)` | dispose function | Core |
| `effects()` | `effects(namedFns)` | void | Core |

### Refs

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `ref()` | `ref(initialValue)` | `{ value }` reactive ref | Core |
| `refs()` | `refs(valuesObj)` | object of refs | Core |

### Collections

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `collection()` | `collection(initialArray)` | Reactive collection | Core |
| `list()` | `list(initialArray)` | Reactive collection (alias) | Core |
| `createCollection()` | `createCollection(array)` | Reactive collection | Collections |
| `computedCollection()` | `computedCollection(array, computed)` | Collection with computed | Collections |
| `filteredCollection()` | `filteredCollection(source, filterFn)` | Filtered live view | Collections |
| `patchArray()` | `patchArray(state, propName)` | void | Core |

### Forms

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `form()` | `form(values, options)` | Form state object | Form |
| `createForm()` | `createForm(values, options)` | Form state object (alias) | Form |
| `validators` | Object of validator factories | — | Form |

### Store & Component

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `store()` | `store(state, options)` | Store with getters/actions | Core |
| `component()` | `component(options)` | Reactive component | Core |
| `reactive()` | `reactive(state)` | Builder chain | Core |

### Bindings

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `bindings()` | `bindings(bindMap)` | void | Core |
| `updateAll()` | `updateAll(state, updates)` | void | Core |

### Enhanced Effects (Module 06)

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `safeEffect()` | `safeEffect(fn, { errorBoundary })` | dispose | Enhancements |
| `safeWatch()` | `safeWatch(state, key, fn, opts)` | dispose | Enhancements |
| `asyncEffect()` | `asyncEffect(asyncFn, opts)` | dispose | Enhancements |
| `asyncState()` | `asyncState(initial, opts)` | Async state object | Enhancements |
| `ErrorBoundary` | `new ErrorBoundary(opts)` | ErrorBoundary instance | Enhancements |
| `DevTools` | `DevTools.enable() / .trackState()` | — | Enhancements |

### Async State (Module 06)

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `async()` | `async(initialValue)` | Basic async state | Enhancements |
| `asyncState()` | `asyncState(initial, opts)` | Enhanced async state | Enhancements |

### Cleanup (Module 05)

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `collector()` | `collector()` | `{ add, cleanup }` | Cleanup |
| `scope()` | `scope(setupFn)` | cleanup function | Cleanup |

### Utilities

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `isReactive()` | `isReactive(value)` | boolean | Core |
| `toRaw()` | `toRaw(state)` | plain object | Core |
| `notify()` | `notify(state, key)` | void | Core |
| `pause()` | `pause()` | void | Core |
| `resume()` | `resume(flush?)` | void | Core |
| `untrack()` | `untrack(fn)` | fn return value | Core |

### Storage (Module 07)

| Function | Signature | Returns | Module |
|----------|-----------|---------|--------|
| `autoSave()` | `autoSave(state, key, opts)` | void | Storage |
| `withStorage()` | `withStorage(state, key, opts)` | void (alias) | Storage |
| `reactiveStorage()` | `reactiveStorage(type, namespace)` | Reactive storage proxy | Storage |
| `watchStorage()` | `watchStorage(key, fn, opts)` | void | Storage |
| `isStorageAvailable()` | `isStorageAvailable(type)` | boolean | Storage |
| `hasLocalStorage` | boolean | — | Storage |
| `hasSessionStorage` | boolean | — | Storage |

### Namespace-level (Module 08)

These are also exposed as globals (with conflict-avoidance checks):

| Function | What it does |
|----------|--------------|
| `set(state, updates)` | Functional state update |
| `cleanup(state)` | Clean up all effects/watchers |
| `getRaw(state)` | Get raw object |
| `execute(asyncState, fn)` | Execute async operation |
| `abort(asyncState)` | Abort current operation |
| `reset(asyncState)` | Reset to initial value |
| `refetch(asyncState)` | Re-run last async function |
| `destroy(component)` | Destroy component |
| `save(state)` | Force save to storage |
| `load(state)` | Force load from storage |
| `clear(state)` | Clear from storage |
| `exists(state)` | Check if in storage |
| `stopAutoSave(state)` | Pause auto-saving |
| `startAutoSave(state)` | Resume auto-saving |
| `storageInfo(state)` | Get storage info |

---

## Common mistakes

### ❌ Loading the shortcut file too early

```html
<!-- WRONG: shortcut before other modules -->
<script src="09_dh-reactiveUtils-shortcut.js"></script>
<script src="06_dh-reactive-enhancements.js"></script>

<!-- ✅ CORRECT: shortcut last -->
<script src="06_dh-reactive-enhancements.js"></script>
<script src="09_dh-reactiveUtils-shortcut.js"></script>
```

### ❌ Using advanced functions without loading their module

```javascript
// If Module 05 wasn't loaded, collector is undefined
const cleanup = collector();  // ❌ ReferenceError

// ✅ Fix: add the module to your HTML
// <script src="05_dh-reactive-cleanup.js"></script>
```

### ❌ Naming conflicts with your own globals

```javascript
// If you already have a global `state` variable:
var state = 'myString';  // ❌ Overwritten by the shortcut!

// ✅ Fix: use namespace style instead
const myState = ReactiveUtils.state({ count: 0 });
```

### ❌ Expecting `patchArray` to be automatic

```javascript
const s = state({ items: [] });

s.items.push('a');         // ❌ May not trigger effects

patchArray(s, 'items');    // ✅ Patch first
s.items.push('a');         // ✅ Now triggers effects
```

---

## Key takeaways

1. **One script tag** — load `09_dh-reactiveUtils-shortcut.js` last and gain access to all reactive functions as globals
2. **Seven real-world patterns** — search, persistence, forms, carts, dashboards, cleanup, and multi-tab sync
3. **Full API reference** — every function, its signature, return value, and source module
4. **Always-available vs conditional** — core functions always work; advanced/storage/collection functions require their modules
5. **Load order is the only requirement** — get that right and everything else just works

---

## Congratulations!

You've completed the Standalone API learning path. You now understand:

- ✅ What the Standalone API is and why it exists
- ✅ How global functions work and the "alias" concept
- ✅ All core functions in depth (`state`, `effect`, `batch`, `computed`, `watch`, etc.)
- ✅ Advanced functions (`safeEffect`, `asyncEffect`, `asyncState`, `ErrorBoundary`, `DevTools`)
- ✅ Storage and collection functions (`autoSave`, `reactiveStorage`, `watchStorage`)
- ✅ Real-world examples across 7 practical scenarios
- ✅ The complete API reference

**Next steps:**
- Explore the [Reactive Cleanup module](../35_Reactive_Cleanup/) for detailed cleanup patterns
- Explore the [Reactive Enhancements module](../36_Reactive_Enhancements/) for async state in depth
- Explore the [Reactive Storage module](../37_Reactive_Storage/) for advanced persistence patterns
- Explore the [Reactive Form module](../34_Reactive_Form/) for complete form management

Happy coding! 🚀