[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What is Reactive Storage?

## Quick Start (30 seconds)

```javascript
const settings = ReactiveUtils.state({ theme: 'dark', lang: 'en' });

// One line — state is saved to localStorage automatically
ReactiveUtils.autoSave(settings, 'user-settings');

// Change state as usual — it persists automatically
settings.theme = 'light';

// Refresh the page → settings.theme is still 'light' ✨
```

That's it — your reactive state now **survives page refreshes** automatically.

---

## What is Reactive Storage?

**Reactive Storage** is a module that connects DOMHelpers reactive state to the browser's `localStorage` or `sessionStorage`. It provides three tools:

1. **`autoSave(state, key)`** — Automatically saves reactive state to storage whenever it changes, and loads it back on page load
2. **`reactiveStorage(type, namespace)`** — A reactive wrapper around storage that triggers effects when data changes
3. **`watch(key, callback)`** — Watch a specific storage key and run a callback when its value changes

Simply put, it makes your reactive state **persistent** — changes survive page refreshes, and can even sync across browser tabs.

---

## Why Does This Exist?

### The Challenge with In-Memory State

Reactive state lives in memory. When the user refreshes the page or closes the tab, everything is gone:

```javascript
const settings = ReactiveUtils.state({ theme: 'dark', fontSize: 16 });

// User customizes their settings
settings.theme = 'light';
settings.fontSize = 20;

// User refreshes the page
// ❌ settings.theme is back to 'dark'
// ❌ settings.fontSize is back to 16
// All customizations are lost
```

**Manually saving to localStorage is tedious:**

```javascript
// Manual approach — lots of boilerplate
const settings = ReactiveUtils.state({ theme: 'dark', fontSize: 16 });

// Load from storage
const saved = localStorage.getItem('settings');
if (saved) {
  const parsed = JSON.parse(saved);
  Object.assign(settings, parsed);
}

// Save on every change — but how do you know WHEN it changes?
ReactiveUtils.effect(() => {
  const data = { theme: settings.theme, fontSize: settings.fontSize };
  localStorage.setItem('settings', JSON.stringify(data));
});

// What about:
// - Debouncing (don't save on every keystroke)?
// - Error handling (storage full)?
// - Circular references in state?
// - Cross-tab sync?
// - Expiring old data?
// - Cleaning up event listeners?
```

**That's a lot of code for "just save my state."**

### The autoSave Approach

```javascript
const settings = ReactiveUtils.state({ theme: 'dark', fontSize: 16 });

ReactiveUtils.autoSave(settings, 'settings', {
  debounce: 300,
  sync: true,
  expires: 7 * 24 * 3600  // 7 days
});

// Done. Everything is handled:
// ✅ Loads saved state on creation
// ✅ Saves automatically when state changes
// ✅ Debounces saves (300ms)
// ✅ Syncs across tabs
// ✅ Expires after 7 days
// ✅ Handles errors, circular references, storage limits
// ✅ Flushes on page unload
```

---

## Mental Model

Think of `autoSave` as a **cloud backup for your state**.

You have a notebook (reactive state) where you write things down. Without backup, if you lose the notebook, everything is gone. `autoSave` is like a service that:

- **Takes a photo** of your notebook every time you write something (auto-save)
- **Restores** your notebook from the last photo when you open a new one (auto-load)
- **Syncs** between notebooks on different desks (cross-tab sync)
- **Throws away** old photos after a set time (expiration)

You just write in your notebook as usual. The backup happens in the background.

---

## The Three Tools

```
Reactive Storage Module
│
├── autoSave(state, key, options)
│   └── Automatically persists a reactive state to storage
│       Works with: state, ref, collection, form
│
├── reactiveStorage(type, namespace)
│   └── Creates a reactive wrapper around localStorage/sessionStorage
│       Effects re-run when storage values change
│
└── watch(key, callback, options)
    └── Watch a specific storage key for changes
        Runs callback with (newValue, oldValue)
```

---

## What autoSave Adds to Your State

When you call `autoSave(state, key)`, it adds these methods to your reactive object:

```
state (after autoSave)
├── .$save()          → Manually trigger a save
├── .$load()          → Manually load from storage
├── .$clear()         → Remove this state from storage
├── .$exists()        → Check if saved data exists
├── .$stopAutoSave()  → Pause automatic saving
├── .$startAutoSave() → Resume automatic saving
├── .$destroy()       → Clean up all listeners and effects
└── .$storageInfo()   → Get storage details (key, size, etc.)
```

---

## What Type of State Can autoSave Handle?

`autoSave` automatically detects and handles different reactive types:

```
autoSave detects your state type:
│
├── ref (has .value)
│   └── Saves/loads the .value property
│
├── collection (has .items)
│   └── Saves/loads the .items array
│
├── form (has .values)
│   └── Saves/loads .values, .errors, .touched
│
├── state (has .$raw)
│   └── Saves/loads the raw state object
│
└── plain object
    └── Saves/loads the object directly
```

---

## Where Does It Come From?

### Available on these globals:

```javascript
// Primary API
ReactiveStorage.autoSave(state, key, options)
ReactiveStorage.reactiveStorage(type, namespace)
ReactiveStorage.watch(key, callback, options)

// Aliases
ReactiveStorage.withStorage    // Same as autoSave
ReactiveStorage.isStorageAvailable('localStorage')  // Check availability
ReactiveStorage.hasLocalStorage   // Boolean
ReactiveStorage.hasSessionStorage // Boolean

// Also on ReactiveUtils:
ReactiveUtils.autoSave(state, key, options)
ReactiveUtils.withStorage(state, key, options)    // Alias
ReactiveUtils.reactiveStorage(type, namespace)
ReactiveUtils.watchStorage(key, callback, options)

// Also as globals (if state() is globally available):
autoSave(state, key, options)
reactiveStorage(type, namespace)
watchStorage(key, callback, options)
```

---

## Big Picture: How Reactive Storage Fits In

```
DOMHelpers Reactive System
│
├── 01_dh-reactive.js             → Core state, effects
├── 02_dh-reactive-array-patch    → Array reactivity
├── 03_dh-reactive-collections    → Collection CRUD
├── 04_dh-reactive-form           → Form state
├── 05_dh-reactive-cleanup        → Lifecycle management
├── 06_dh-reactive-enhancements   → Production hardening
├── 07_dh-reactive-storage        → Persistent storage ← YOU ARE HERE
```

The storage module only depends on the reactive core (`01`). It's fully standalone — no other DOMHelpers modules are required.

---

## The Built-in StorageWrapper

The module includes its own storage wrapper, so it doesn't depend on any external storage library. The wrapper adds:

- **JSON serialization** — automatically `JSON.stringify` and `JSON.parse`
- **Namespace support** — prefix keys to avoid collisions (e.g., `myApp:settings`)
- **Expiration** — set a time-to-live in seconds
- **Timestamp tracking** — every saved value includes when it was stored
- **Error handling** — all operations are wrapped in try/catch
- **Fallback** — if storage isn't available, it uses a no-op stub

---

## Key Takeaways

1. **`autoSave(state, key)`** — one line to make any reactive state persistent
2. **Auto-load** — saved state is restored when the page loads
3. **Auto-save** — state is saved whenever it changes
4. **Works with all reactive types** — state, ref, collection, form
5. **Production features** — debounce, expiration, cross-tab sync, error handling
6. **Standalone** — only requires the reactive core, no external dependencies
7. **Adds methods** like `$save`, `$load`, `$clear`, `$destroy` to your state

---

## What's next?

Let's walk through `autoSave` step by step to understand exactly how saving and loading works.

Let's continue!