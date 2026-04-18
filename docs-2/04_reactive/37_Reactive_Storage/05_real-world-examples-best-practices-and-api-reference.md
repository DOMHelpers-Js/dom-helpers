[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples, Best Practices, and API Reference

## Example 1: User Preferences

```javascript
const prefs = ReactiveUtils.state({
  theme: 'light',
  fontSize: 16,
  sidebarOpen: true,
  notifications: true
});

ReactiveUtils.autoSave(prefs, 'user-prefs', {
  sync: true  // Sync across tabs
});

// Effect applies preferences to the UI
ReactiveUtils.effect(() => {
  document.body.dataset.theme = prefs.theme;
  document.body.style.fontSize = `${prefs.fontSize}px`;
});

// Toggle theme button
document.getElementById('themeToggle').onclick = () => {
  prefs.theme = prefs.theme === 'light' ? 'dark' : 'light';
  // Saved automatically, synced to other tabs
};
```

**Key patterns:** `sync: true` for multi-tab consistency, effect-driven UI

---

## Example 2: Form Draft Auto-Save

```javascript
const draft = Forms.create({ title: '', body: '', tags: '' });

ReactiveUtils.autoSave(draft, 'blog-draft', {
  debounce: 1000,  // Save 1 second after typing stops
  onSave: (data) => {
    // Only save the values, not errors/touched
    return data.values;
  },
  onLoad: (data) => {
    // Wrap back into the form format
    return { values: data };
  }
});

// Show "Draft saved" indicator
ReactiveUtils.effect(() => {
  const exists = draft.$exists();
  document.getElementById('draftStatus').textContent =
    exists ? 'Draft saved' : '';
});

// Clear draft on publish
async function publish() {
  const result = await draft.submit();
  if (result.success) {
    draft.$clear();  // Remove from storage
    draft.reset();   // Reset form
  }
}
```

**Key patterns:** `debounce` for typing, `onSave`/`onLoad` to transform data, `$clear` on publish

---

## Example 3: Shopping Cart with Expiration

```javascript
const cart = Collections.create([]);

ReactiveUtils.autoSave(cart, 'shopping-cart', {
  expires: 24 * 3600,  // Expire after 24 hours
  onError: (error, op) => {
    if (op === 'quota') {
      alert('Storage is full. Your cart may not be saved.');
    }
  }
});

// Cart persists across sessions (up to 24 hours)
cart.add({ id: 1, name: 'Widget', price: 9.99, qty: 1 });

// After 24 hours, the cart is automatically cleared on next page load
```

**Key patterns:** `expires` for time-limited persistence, `onError` for quota handling

---

## Example 4: Session Data with sessionStorage

```javascript
const session = ReactiveUtils.state({
  lastPage: '/',
  scrollPositions: {},
  searchHistory: []
});

ReactiveUtils.autoSave(session, 'session-data', {
  storage: 'sessionStorage'  // Cleared when tab closes
});

// Track page navigation
function navigateTo(page) {
  session.scrollPositions[session.lastPage] = window.scrollY;
  session.lastPage = page;
}

// Restore scroll position
function restoreScroll() {
  const pos = session.scrollPositions[window.location.pathname] || 0;
  window.scrollTo(0, pos);
}
```

**Key patterns:** `sessionStorage` for tab-scoped data, scroll position tracking

---

## Example 5: Reactive Storage for Feature Flags

```javascript
const flags = ReactiveUtils.reactiveStorage('localStorage', 'features');

// Set feature flags
flags.set('darkMode', true);
flags.set('newUI', false);
flags.set('betaFeatures', true);

// React to flag changes
ReactiveUtils.effect(() => {
  const darkMode = flags.get('darkMode');
  const newUI = flags.get('newUI');

  document.body.classList.toggle('dark', darkMode);
  document.body.classList.toggle('new-ui', newUI);
});

// Admin panel changes a flag → all effects re-run
flags.set('newUI', true);
```

**Key patterns:** `reactiveStorage` for key-value reactive data, effects on individual keys

---

## Example 6: Watch for Authentication Changes

```javascript
// Watch for auth token changes across tabs
const stopWatching = ReactiveUtils.watchStorage('auth-token', (newToken, oldToken) => {
  if (newToken === null && oldToken !== null) {
    // Token was removed — user logged out in another tab
    window.location.href = '/login';
  } else if (newToken !== null && oldToken === null) {
    // Token was added — user logged in in another tab
    window.location.reload();
  }
}, {
  immediate: true  // Check current value on setup
});

// Clean up when component is destroyed
// stopWatching();
```

**Key patterns:** `watchStorage` for auth state, `immediate` for initial check

---

## Example 7: Namespaced Multi-App Storage

```javascript
// App 1: Blog editor
const blogState = ReactiveUtils.state({ posts: [], currentDraft: '' });
ReactiveUtils.autoSave(blogState, 'editor-state', { namespace: 'blog' });
// Stored as: 'blog:editor-state'

// App 2: Analytics dashboard
const analyticsState = ReactiveUtils.state({ filters: {}, dateRange: '7d' });
ReactiveUtils.autoSave(analyticsState, 'editor-state', { namespace: 'analytics' });
// Stored as: 'analytics:editor-state'

// Same key name, different namespaces — no collision
```

**Key patterns:** `namespace` to avoid key collisions between apps

---

## Example 8: Manual Save/Load Control

```javascript
const state = ReactiveUtils.state({ data: [] });

// No auto-save — fully manual
ReactiveUtils.autoSave(state, 'manual-data', {
  autoSave: false,
  autoLoad: false
});

// Load when user clicks
document.getElementById('load').onclick = () => {
  if (state.$exists()) {
    state.$load();
    console.log('Data loaded');
  } else {
    console.log('No saved data');
  }
};

// Save when user clicks
document.getElementById('save').onclick = () => {
  state.$save();
  const info = state.$storageInfo();
  console.log(`Saved (${info.sizeKB}KB)`);
};

// Clear saved data
document.getElementById('clear').onclick = () => {
  state.$clear();
  console.log('Cleared');
};
```

**Key patterns:** `autoSave: false`, `autoLoad: false`, manual `$save`/`$load`/`$clear`

---

## Best Practices

### ✅ Use namespaces to avoid key collisions

```javascript
// ✅ Namespaced — safe
ReactiveUtils.autoSave(state, 'settings', { namespace: 'myApp' });

// ❌ Generic key — might collide with other libraries
ReactiveUtils.autoSave(state, 'settings');
```

### ✅ Use debounce for text inputs

```javascript
// ✅ Saves once after typing stops
ReactiveUtils.autoSave(formState, 'draft', { debounce: 500 });

// ❌ Saves on EVERY keystroke — too many writes
ReactiveUtils.autoSave(formState, 'draft');
```

### ✅ Set expiration for temporary data

```javascript
// ✅ Auto-cleans after 7 days
ReactiveUtils.autoSave(state, 'cache', { expires: 7 * 24 * 3600 });

// ❌ Stays forever — clutters storage over time
ReactiveUtils.autoSave(state, 'cache');
```

### ✅ Call $destroy when done

```javascript
// ✅ Clean up listeners and effects
function createWidget() {
  const state = ReactiveUtils.state({ count: 0 });
  ReactiveUtils.autoSave(state, 'widget');
  return {
    state,
    destroy: () => state.$destroy()
  };
}
```

### ✅ Use onSave to filter sensitive data

```javascript
// ✅ Don't store passwords or tokens
ReactiveUtils.autoSave(userState, 'user', {
  onSave: (data) => {
    const { password, token, ...safe } = data;
    return safe;
  }
});
```

### ❌ Don't store non-serializable data

```javascript
// ❌ Functions, DOM elements, Promises can't be serialized
const state = ReactiveUtils.state({
  handler: () => {},        // Function
  element: document.body,   // DOM node
  promise: fetch('/api')    // Promise
});

// ✅ Only store plain data
const state = ReactiveUtils.state({
  name: 'Alice',
  items: [1, 2, 3],
  settings: { theme: 'dark' }
});
```

---

## Complete API Reference

### autoSave(state, key, options?)

| Parameter | Type | Description |
|-----------|------|-------------|
| `state` | Reactive object | Any reactive state, ref, collection, or form |
| `key` | String | Storage key |
| `options` | Object | Configuration (see below) |
| **Returns** | Reactive object | The same object with added methods |

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | String | `'localStorage'` | `'localStorage'` or `'sessionStorage'` |
| `namespace` | String | `''` | Key prefix |
| `debounce` | Number | `0` | Delay in ms before saving |
| `autoLoad` | Boolean | `true` | Load saved data on setup |
| `autoSave` | Boolean | `true` | Save automatically on changes |
| `sync` | Boolean | `false` | Sync across tabs |
| `expires` | Number/null | `null` | Time-to-live in seconds |
| `onSave` | Function/null | `null` | Transform before saving |
| `onLoad` | Function/null | `null` | Transform after loading |
| `onSync` | Function/null | `null` | Called on cross-tab sync |
| `onError` | Function/null | `null` | Called on errors |

**Added instance methods:**

| Method | Returns | Description |
|--------|---------|-------------|
| `.$save()` | Boolean | Manual save |
| `.$load()` | Boolean | Manual load |
| `.$clear()` | Boolean | Remove from storage |
| `.$exists()` | Boolean | Check if saved data exists |
| `.$stopAutoSave()` | Object | Pause auto-save |
| `.$startAutoSave()` | Object | Resume auto-save |
| `.$destroy()` | — | Clean up everything |
| `.$storageInfo()` | Object | Get storage details |

---

### reactiveStorage(storageType?, namespace?)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `storageType` | String | `'localStorage'` | Storage type |
| `namespace` | String | `''` | Key prefix |
| **Returns** | Proxy | Reactive storage wrapper |

**Methods on the returned proxy:**

| Method | Returns | Triggers effects? |
|--------|---------|-------------------|
| `.set(key, value, opts)` | Boolean | ✅ Yes |
| `.get(key)` | any/null | ❌ (registers dependency) |
| `.remove(key)` | Boolean | ✅ Yes |
| `.has(key)` | Boolean | ❌ (registers dependency) |
| `.keys()` | Array | ❌ (registers dependency) |
| `.clear()` | Boolean | — |

---

### watch(key, callback, options?)

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | String | Storage key to watch |
| `callback` | Function | `(newValue, oldValue) => {}` |
| `options` | Object | Configuration |
| **Returns** | Function | Dispose function |

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | String | `'localStorage'` | Storage type |
| `namespace` | String | `''` | Key prefix |
| `immediate` | Boolean | `false` | Call callback immediately |

---

### Utility Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `ReactiveStorage.isStorageAvailable(type)` | Boolean | Test if storage works |
| `ReactiveStorage.hasLocalStorage` | Boolean | Is localStorage available |
| `ReactiveStorage.hasSessionStorage` | Boolean | Is sessionStorage available |

---

### Available On

```javascript
// Primary
ReactiveStorage.autoSave
ReactiveStorage.reactiveStorage
ReactiveStorage.watch
ReactiveStorage.withStorage        // Alias for autoSave

// ReactiveUtils
ReactiveUtils.autoSave
ReactiveUtils.withStorage          // Alias for autoSave
ReactiveUtils.reactiveStorage
ReactiveUtils.watchStorage         // Note: 'watchStorage', not 'watch'

// Globals (if state() is global)
autoSave
reactiveStorage
watchStorage
```

---

## Load Order

```html
<!-- 1. Reactive Core (required) -->
<script src="04_reactive/01_dh-reactive.js"></script>

<!-- 2. Other reactive modules (optional, load before storage) -->
<script src="04_reactive/02_dh-reactive-array-patch.js"></script>
<script src="04_reactive/03_dh-reactive-collections.js"></script>
<script src="04_reactive/04_dh-reactive-form.js"></script>
<script src="04_reactive/05_dh-reactive-cleanup.js"></script>
<script src="04_reactive/06_dh-reactive-enhancements.js"></script>

<!-- 3. Storage (only requires reactive core) -->
<script src="04_reactive/07_dh-reactive-storage.js"></script>
```

**Only `01_dh-reactive.js` is required.** The storage module is fully standalone.

---

## Congratulations!

You've completed the Reactive Storage learning path. You now understand:

- ✅ What `autoSave` does and how it makes state persistent
- ✅ How auto-load and auto-save work internally
- ✅ All options: debounce, expiration, sync, namespaces, callbacks
- ✅ All instance methods: $save, $load, $clear, $exists, $destroy
- ✅ Production features: throttle, circular refs, size warnings, quota handling
- ✅ `reactiveStorage` for reactive key-value storage access
- ✅ `watch` for monitoring specific storage keys
- ✅ Cross-tab synchronization with loop prevention
- ✅ The complete API reference

**Your reactive state now persists like a pro!**