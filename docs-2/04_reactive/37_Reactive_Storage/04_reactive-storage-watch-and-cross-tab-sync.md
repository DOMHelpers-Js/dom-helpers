[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# reactiveStorage, watch, and Cross-Tab Sync

Beyond `autoSave`, the module provides two more tools: a reactive wrapper around storage, and a storage key watcher.

---

## Part 1: reactiveStorage

### What is it?

`reactiveStorage` creates a **reactive wrapper** around `localStorage` or `sessionStorage`. When you read from it inside an effect, the effect re-runs whenever that storage data changes — including changes from other browser tabs.

---

### Syntax

```javascript
const store = ReactiveUtils.reactiveStorage(storageType, namespace);
// or
const store = ReactiveStorage.reactiveStorage(storageType, namespace);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `storageType` | String | `'localStorage'` | `'localStorage'` or `'sessionStorage'` |
| `namespace` | String | `''` | Key prefix (e.g., `'myApp'`) |

---

### Basic Example

```javascript
const store = ReactiveUtils.reactiveStorage('localStorage', 'myApp');

// Set values (triggers reactivity)
store.set('theme', 'dark');
store.set('lang', 'en');

// Read values inside effects
ReactiveUtils.effect(() => {
  const theme = store.get('theme');
  document.body.className = theme;
});

// Change value — effect re-runs automatically
store.set('theme', 'light');
// body class changes to 'light'
```

---

### How It Works

`reactiveStorage` uses a clever trick to make storage reactive:

```
reactiveStorage('localStorage', 'myApp')
   ↓
1️⃣ Creates a StorageWrapper
   ↓
2️⃣ Creates a reactive state with:
   { _version: 0, _keys: Set }
   ↓
3️⃣ Creates a Proxy around the StorageWrapper:
   ├── get/has/keys → reads _version and _keys (registers dependency)
   ├── set()        → calls original set, then _version++ (triggers effects)
   └── remove()     → calls original remove, then _version++ (triggers effects)
   ↓
4️⃣ Listens for 'storage' events (cross-tab changes):
   └── On event → _version++ (triggers effects)
```

**The key insight:** By reading `_version` inside the proxy's get trap, any effect that calls `store.get()` becomes dependent on `_version`. When `store.set()` increments `_version`, all those effects re-run.

---

### Available Methods

The reactive storage proxy exposes the same methods as the StorageWrapper:

| Method | Description | Triggers effects? |
|--------|-------------|-------------------|
| `store.set(key, value, opts)` | Store a value | ✅ Yes |
| `store.get(key)` | Read a value | ❌ (but registers dependency) |
| `store.remove(key)` | Remove a value | ✅ Yes |
| `store.has(key)` | Check if key exists | ❌ (but registers dependency) |
| `store.keys()` | Get all keys | ❌ (but registers dependency) |
| `store.clear()` | Clear all keys in namespace | — |

---

### With Expiration

```javascript
const store = ReactiveUtils.reactiveStorage();

// Set with expiration (30 minutes)
store.set('session-token', 'abc123', { expires: 1800 });

// After 30 minutes, store.get('session-token') returns null
```

---

### Cross-Tab Reactivity

If another tab changes localStorage, the reactive storage detects it and triggers effects:

```
Tab 1:                              Tab 2:
store.set('theme', 'dark')
   ↓                                   ↓
localStorage updated                'storage' event fires
   ↓                                   ↓
Tab 1 effects re-run               _version++ → effects re-run
                                       ↓
                                    store.get('theme') → 'dark'
```

This only works with `localStorage` (not `sessionStorage`), because `sessionStorage` is per-tab.

---

## Part 2: watch (watchStorage)

### What is it?

`watch` monitors a specific storage key and runs a callback whenever its value changes.

---

### Syntax

```javascript
const stop = ReactiveUtils.watchStorage(key, callback, options);
// or
const stop = ReactiveStorage.watch(key, callback, options);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | String | The storage key to watch |
| `callback` | Function | `(newValue, oldValue) => {}` |
| `options` | Object | Configuration |

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | String | `'localStorage'` | Storage type |
| `namespace` | String | `''` | Key prefix |
| `immediate` | Boolean | `false` | Call callback with current value immediately |

**Returns:** a `dispose` function to stop watching

---

### Basic Example

```javascript
const stop = ReactiveUtils.watchStorage('theme', (newValue, oldValue) => {
  console.log(`Theme changed: ${oldValue} → ${newValue}`);
});

// When 'theme' changes in localStorage:
// Logs: "Theme changed: dark → light"

// Stop watching:
stop();
```

---

### With immediate

```javascript
const stop = ReactiveUtils.watchStorage('user-name', (newValue, oldValue) => {
  document.getElementById('greeting').textContent = `Hello, ${newValue}!`;
}, {
  immediate: true  // Call callback right away with current value
});
// If 'user-name' is 'Alice' in storage:
// Immediately logs: callback('Alice', null)
```

---

### How It Works

```
watch('theme', callback)
   ↓
1️⃣ Creates a StorageWrapper
   ↓
2️⃣ Reads the current value: oldValue = store.get('theme')
   ↓
3️⃣ If immediate → call callback(oldValue, null)
   ↓
4️⃣ Creates a reactiveStorage internally
   ↓
5️⃣ Creates an effect:
   └── effect(() => {
         const newValue = reactiveStore.get('theme');
         if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
           callback(newValue, oldValue);
           oldValue = newValue;
         }
       })
   ↓
6️⃣ Returns the effect's dispose function
```

**The change detection** uses `JSON.stringify` comparison, so it works with objects and arrays — not just primitive values.

---

### With Namespace

```javascript
const stop = ReactiveUtils.watchStorage('settings', (newValue) => {
  applySettings(newValue);
}, {
  namespace: 'myApp',
  storage: 'localStorage'
});
// Watches the key 'myApp:settings'
```

---

## Part 3: Cross-Tab Sync with autoSave

### How It Works

When you set `sync: true` on `autoSave`, it uses the browser's `storage` event to keep multiple tabs in sync:

```javascript
// In every tab:
const settings = ReactiveUtils.state({ theme: 'dark', fontSize: 16 });
ReactiveUtils.autoSave(settings, 'settings', { sync: true });
```

**Tab 1 changes the theme:**

```
Tab 1: settings.theme = 'light'
   ↓
Auto-save effect runs → localStorage.setItem('settings', ...)
   ↓
Browser fires 'storage' event to all OTHER tabs
   ↓
Tab 2: handleStorageEvent fires
   ↓
1️⃣ Check: is syncLock? → No
2️⃣ Check: event.key matches 'settings'? → Yes
3️⃣ Parse the new value
4️⃣ Set syncLock = true, isUpdatingFromStorage = true
5️⃣ batch(() => setValue(settings, newValue))
6️⃣ settings.theme is now 'light' in Tab 2
7️⃣ isUpdatingFromStorage = false (auto-save skips)
8️⃣ syncLock = false
9️⃣ Call onSync(newValue) if provided
```

**Key detail:** The `storage` event only fires in **other** tabs, not the tab that made the change. This is a browser-level behavior that naturally prevents loops.

---

### Sync with Namespace

```javascript
ReactiveUtils.autoSave(settings, 'settings', {
  sync: true,
  namespace: 'myApp'
});
```

The sync handler checks for the full key including namespace:

```
event.key === 'myApp:settings'
```

---

### onSync Callback

```javascript
ReactiveUtils.autoSave(state, 'data', {
  sync: true,
  onSync: (newValue) => {
    console.log('Data synced from another tab:', newValue);
    showNotification('Settings updated from another tab');
  }
});
```

---

## The StorageWrapper Internals

For reference, here's what the built-in StorageWrapper stores:

### Data Format

```javascript
store.set('theme', 'dark');
// localStorage contains:
// key: 'theme'
// value: '{"value":"dark","timestamp":1708041600000}'

store.set('token', 'abc', { expires: 3600 });
// key: 'token'
// value: '{"value":"abc","timestamp":1708041600000,"expires":1708045200000}'
```

### StorageWrapper Methods

| Method | Description |
|--------|-------------|
| `set(key, value, opts)` | Save with JSON wrapping and optional expiration |
| `get(key)` | Read and parse, auto-remove if expired |
| `remove(key)` | Delete a key |
| `has(key)` | Check if a key exists |
| `keys()` | List all keys (respects namespace) |
| `clear()` | Remove all keys (respects namespace) |

### Namespace Behavior

```javascript
const store = new StorageWrapper('localStorage', 'myApp');

store.set('theme', 'dark');
// Actual localStorage key: 'myApp:theme'

store.get('theme');
// Looks up: 'myApp:theme'

store.keys();
// Returns keys WITHOUT the prefix: ['theme', 'lang', ...]

store.clear();
// Only removes keys starting with 'myApp:'
```

---

## Checking Storage Availability

```javascript
// Check before using
console.log(ReactiveStorage.hasLocalStorage);    // true/false
console.log(ReactiveStorage.hasSessionStorage);  // true/false

// Or check programmatically
console.log(ReactiveStorage.isStorageAvailable('localStorage'));
```

If storage isn't available (e.g., in private browsing mode on some browsers), autoSave returns the reactive object without setting up persistence. Your code still works — it just doesn't save.

---

## Key Takeaways

1. **reactiveStorage** — a reactive proxy around localStorage/sessionStorage that triggers effects on read/write
2. **watch (watchStorage)** — monitors a single key and calls back on changes
3. **Cross-tab sync** — `autoSave` with `sync: true` keeps state in sync across tabs using the `storage` event
4. **Sync loop prevention** — `syncLock` and `isUpdatingFromStorage` flags prevent infinite loops
5. **StorageWrapper** — built-in storage abstraction with JSON handling, namespaces, and expiration
6. **Change detection** in `watch` uses `JSON.stringify` comparison for deep equality

---

## What's next?

Let's see complete real-world examples, best practices, and the full API reference.

Let's continue!