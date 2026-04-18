[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Storage and Collection Functions

## What are these functions?

This file covers two groups of functions exposed by the Standalone API:

1. **Storage functions** — connect reactive state to `localStorage` or `sessionStorage`
2. **Collection helpers** — create collections with computed properties or filtering

Both groups are **conditional**: they're only available as globals if the right modules were loaded.

---

## Storage functions

These come from Module 07 (`07_dh-reactive-storage.js`) and from Module 08's storage utilities.

| Global function | What it does |
|----------------|--------------|
| `autoSave()` | Add auto-save to an existing state object |
| `withStorage()` | Alias for `autoSave()` (backward compat) |
| `reactiveStorage()` | Create a reactive proxy over a storage namespace |
| `watchStorage()` | Watch a storage key for changes |
| `isStorageAvailable()` | Check if a storage type is accessible |
| `hasLocalStorage` | Boolean: is localStorage available? |
| `hasSessionStorage` | Boolean: is sessionStorage available? |

---

## `autoSave()` — Add persistence to state

### What it does

Takes an existing reactive state object and adds automatic saving to `localStorage` or `sessionStorage`. The state is saved whenever it changes, and loaded automatically when the page loads.

### Syntax

```javascript
autoSave(state, 'storageKey', options);
```

### Options

```javascript
autoSave(state, 'key', {
  storage: 'localStorage',  // or 'sessionStorage' (default: 'localStorage')
  debounce: 300,            // wait Xms after last change before saving (default: 300)
  expiration: 86400000,     // auto-delete after X milliseconds (optional)
  crossTab: true            // sync changes across browser tabs (optional)
});
```

### Example — settings that persist across page loads

```javascript
// State is created normally
const settings = state({
  theme: 'light',
  fontSize: 14,
  language: 'en'
});

// Add persistence — one line!
autoSave(settings, 'user-settings', {
  storage: 'localStorage',
  debounce: 500  // save 500ms after last change
});

// From this point on:
// - Settings are loaded from localStorage on page load
// - Settings are saved to localStorage whenever they change
// - The debounce prevents saving on every single keypress
```

### After `autoSave()`, the state gets extra methods

```javascript
settings.$save();          // force save right now
settings.$load();          // force load from storage
settings.$clear();         // delete from storage
settings.$exists();        // true if data exists in storage
settings.$stopAutoSave();  // pause auto-saving
settings.$startAutoSave(); // resume auto-saving
settings.$storageInfo();   // get size, key, expiration info
settings.$destroy();       // remove from storage and clean up
```

### Example — save with expiration

```javascript
const sessionData = state({ token: null, userId: null });

autoSave(sessionData, 'session', {
  storage: 'sessionStorage',
  expiration: 3600000  // auto-expire after 1 hour (3600000ms)
});

sessionData.token = 'abc123';
sessionData.userId = 42;
// Saved to sessionStorage, expires in 1 hour
```

---

## `withStorage()` — Alias for autoSave

`withStorage()` is an older name for the same function. Use `autoSave()` for new code; `withStorage()` exists for backward compatibility.

```javascript
// These two are identical:
autoSave(state, 'key', options);
withStorage(state, 'key', options);
```

---

## `reactiveStorage()` — A reactive storage proxy

### What it does

Creates a reactive object that maps directly to a namespace in `localStorage` or `sessionStorage`. Reading or writing the object's properties reads/writes storage automatically.

### Syntax

```javascript
const storage = reactiveStorage(storageType, namespace);
```

### Example

```javascript
const prefs = reactiveStorage('localStorage', 'myApp');

// Write to storage:
prefs.theme = 'dark';         // saves to localStorage as "myApp.theme"
prefs.language = 'fr';        // saves to localStorage as "myApp.language"

// Read from storage:
console.log(prefs.theme);     // 'dark'
console.log(prefs.language);  // 'fr'

// Works with effects:
effect(() => {
  document.body.className = 'theme-' + prefs.theme;
});

prefs.theme = 'light';
// Effect re-runs → body class updates → new value saved to localStorage
```

### How it differs from `autoSave()`

```
autoSave(state, key):
  ├── You start with a state object
  ├── autoSave adds persistence to it
  └── State is the "primary" — storage is secondary

reactiveStorage(type, namespace):
  ├── Storage IS the primary source
  ├── The object is a reactive view over storage
  └── Every read/write goes through localStorage/sessionStorage
```

Use `autoSave()` when you have existing state to persist.
Use `reactiveStorage()` when storage is your source of truth.

---

## `watchStorage()` — React to storage changes

### What it does

Watches a key in `localStorage` or `sessionStorage` and calls a callback whenever that key's value changes. Works across browser tabs when the storage event fires.

### Syntax

```javascript
watchStorage(key, callback, options);
```

### Options

```javascript
watchStorage('theme', (newValue, oldValue) => {}, {
  storage: 'localStorage',  // default
  immediate: true           // run callback immediately with current value
});
```

### Example — sync theme across tabs

```javascript
watchStorage('theme', (newTheme, oldTheme) => {
  console.log('Theme changed from', oldTheme, 'to', newTheme);
  document.body.className = 'theme-' + newTheme;
}, {
  immediate: true  // apply current theme right away
});
```

**When another browser tab changes `localStorage.theme`:**
- The `storage` event fires in all other tabs
- Your callback runs with the new value
- Your UI updates automatically

### Example — detect storage changes from other sources

```javascript
// Watch for a flag set by another tab or external script
watchStorage('logoutRequested', (flag) => {
  if (flag === 'true') {
    // Another tab requested logout
    window.location.href = '/login';
  }
});
```

---

## Storage utilities

### `isStorageAvailable()` — Check before using

Some environments block localStorage (private browsing, certain browser settings). Always check availability before relying on storage:

```javascript
if (isStorageAvailable('localStorage')) {
  autoSave(state, 'myData');
} else {
  console.warn('localStorage not available — data will not persist');
}
```

### `hasLocalStorage` and `hasSessionStorage` — Quick boolean flags

```javascript
// Simple existence check:
if (hasLocalStorage) {
  autoSave(settings, 'user-settings');
}

if (hasSessionStorage) {
  autoSave(tempData, 'temp', { storage: 'sessionStorage' });
}
```

These are boolean flags set at load time based on availability detection.

---

## Collection helpers

These come from the `Collections` module (if it's loaded separately as a global).

| Global function | What it does |
|----------------|--------------|
| `createCollection()` | Create a reactive collection |
| `computedCollection()` | Create a collection with computed properties |
| `filteredCollection()` | Create a collection with a live filter |

---

## `createCollection()` — Create a reactive collection

### What it does

Creates a reactive collection from an initial array. Alias for `Collections.create()`.

### Example

```javascript
const todos = createCollection([
  { id: 1, text: 'Buy groceries', done: false },
  { id: 2, text: 'Walk the dog', done: true }
]);

todos.add({ id: 3, text: 'Read a book', done: false });
todos.remove(1);  // remove by id

effect(() => {
  console.log('Todo count:', todos.items.length);
});
```

---

## `computedCollection()` — Collection with computed properties

### What it does

Creates a reactive collection that also has computed properties derived from its items.

### Example

```javascript
const cart = computedCollection([], {
  totalPrice: function() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  },
  itemCount: function() {
    return this.items.length;
  },
  isEmpty: function() {
    return this.items.length === 0;
  }
});

cart.add({ id: 1, name: 'Widget', price: 9.99 });
cart.add({ id: 2, name: 'Gadget', price: 24.99 });

console.log(cart.totalPrice);  // 34.98
console.log(cart.itemCount);   // 2
console.log(cart.isEmpty);     // false

effect(() => {
  document.getElementById('cartTotal').textContent =
    '$' + cart.totalPrice.toFixed(2);
});
```

---

## `filteredCollection()` — Collection with a live filter

### What it does

Creates a view of another collection that is automatically filtered. When the source collection changes, the filtered view updates automatically.

### Example

```javascript
const allTodos = createCollection([
  { id: 1, text: 'Buy groceries', done: false },
  { id: 2, text: 'Walk the dog', done: true },
  { id: 3, text: 'Read a book', done: false }
]);

// A live-filtered view — only shows incomplete todos
const activeTodos = filteredCollection(allTodos, todo => !todo.done);

effect(() => {
  console.log('Active todos:', activeTodos.items.length);  // 2
});

// Complete a todo
allTodos.update(1, { done: true });

// Effect re-runs automatically:
// "Active todos: 1"
```

---

## Putting storage and collections together

Here's a practical example combining both groups:

```javascript
// A shopping cart with persistence and computed totals
const cart = computedCollection([], {
  subtotal: function() {
    return this.items.reduce((s, i) => s + i.price * i.qty, 0);
  },
  tax: function() {
    return this.subtotal * 0.1;
  },
  total: function() {
    return this.subtotal + this.tax;
  }
});

// Save cart to localStorage automatically
autoSave(cart, 'shopping-cart', { debounce: 200 });

// Show summary
effect(() => {
  document.getElementById('cartSummary').textContent =
    cart.items.length + ' items — $' + cart.total.toFixed(2);
});

// User adds an item
cart.add({ id: 1, name: 'T-Shirt', price: 19.99, qty: 2 });
// cart.total = 43.98 (19.99 × 2 × 1.1)
// Saved to localStorage automatically after 200ms
```

---

## Availability summary

| Function | Requires |
|----------|----------|
| `autoSave()` | Module 07 loaded |
| `withStorage()` | Module 07 loaded |
| `reactiveStorage()` | Module 07 loaded |
| `watchStorage()` | Module 07 loaded |
| `isStorageAvailable()` | Module 07 + `ReactiveStorage` global |
| `hasLocalStorage` | Module 07 + `ReactiveStorage` global |
| `hasSessionStorage` | Module 07 + `ReactiveStorage` global |
| `createCollection()` | `Collections` global |
| `computedCollection()` | `Collections` global with `createWithComputed` |
| `filteredCollection()` | `Collections` global with `createFiltered` |

---

## Key takeaways

1. **`autoSave()`** — adds persistence to any state object; loads on init, saves on change, debounced
2. **`reactiveStorage()`** — makes storage itself reactive; perfect when storage is the source of truth
3. **`watchStorage()`** — react to storage key changes, including cross-tab updates
4. **`isStorageAvailable()`** — always check before using storage in production
5. **`computedCollection()`** — reactive collection with auto-updating derived values
6. **`filteredCollection()`** — a live-updating filtered view of another collection
7. **All conditional** — check that the relevant module is loaded if a function is undefined

---

## What's next?

Now let's bring everything together with real-world examples and a complete API reference covering all global functions exposed by the Standalone API.

Let's continue! 🚀