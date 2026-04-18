[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# autoSave Options, Methods, and Production Features

## All Options

```javascript
ReactiveUtils.autoSave(state, 'my-key', {
  storage: 'localStorage',     // Storage type
  namespace: '',               // Key prefix
  debounce: 0,                 // Debounce delay (ms)
  autoLoad: true,              // Load saved data on creation
  autoSave: true,              // Save automatically on changes
  sync: false,                 // Sync across browser tabs
  expires: null,               // Time-to-live in seconds
  onSave: null,                // Transform data before saving
  onLoad: null,                // Transform data after loading
  onSync: null,                // Called when data syncs from another tab
  onError: null                // Called on any error
});
```

---

## Options Explained

### storage

Which storage backend to use.

```javascript
// localStorage — persists across sessions (default)
ReactiveUtils.autoSave(state, 'key', { storage: 'localStorage' });

// sessionStorage — cleared when the tab closes
ReactiveUtils.autoSave(state, 'key', { storage: 'sessionStorage' });
```

| Type | Persists across sessions | Shared across tabs | Typical limit |
|------|------------------------|-------------------|--------------|
| `localStorage` | ✅ Yes | ✅ Yes | ~5-10MB |
| `sessionStorage` | ❌ No (tab only) | ❌ No | ~5-10MB |

---

### namespace

Prefix all storage keys to avoid collisions with other apps or modules.

```javascript
ReactiveUtils.autoSave(state, 'settings', { namespace: 'myApp' });
// Stored as: 'myApp:settings'

ReactiveUtils.autoSave(state, 'settings', { namespace: 'otherApp' });
// Stored as: 'otherApp:settings'
// No collision!
```

---

### debounce

Delay saving by a number of milliseconds after the last change. This prevents saving on every keystroke in text inputs.

```javascript
// Save 500ms after the last change
ReactiveUtils.autoSave(state, 'draft', { debounce: 500 });
```

**How debounce works:**

```
state.text = 'H'     → Schedule save in 500ms
state.text = 'He'    → Cancel previous, schedule new in 500ms
state.text = 'Hel'   → Cancel previous, schedule new in 500ms
state.text = 'Hell'  → Cancel previous, schedule new in 500ms
state.text = 'Hello' → Cancel previous, schedule new in 500ms
                        ... 500ms pass ...
                        → Save! ("Hello")
```

Only one save happens for the entire sequence.

---

### autoLoad

Whether to load saved data when `autoSave` is first called.

```javascript
// Default: load saved data immediately
ReactiveUtils.autoSave(state, 'key', { autoLoad: true });

// Skip loading — start fresh every time
ReactiveUtils.autoSave(state, 'key', { autoLoad: false });
```

---

### autoSave (the option)

Whether to save automatically when state changes.

```javascript
// Default: save on every change
ReactiveUtils.autoSave(state, 'key', { autoSave: true });

// Manual-only saving — no automatic saves
ReactiveUtils.autoSave(state, 'key', { autoSave: false });
// Use state.$save() to save manually
```

---

### sync

Enable cross-tab synchronization. When data changes in one tab, other tabs update automatically.

```javascript
ReactiveUtils.autoSave(state, 'settings', { sync: true });
// Tab 1: state.theme = 'dark'  → saved to localStorage
// Tab 2: detects the change → updates state.theme to 'dark'
```

This uses the browser's `storage` event, which fires when another tab modifies localStorage.

---

### expires

Set a time-to-live in **seconds**. After this time, the saved data is automatically discarded on the next load.

```javascript
// Expire after 1 hour
ReactiveUtils.autoSave(state, 'session', { expires: 3600 });

// Expire after 7 days
ReactiveUtils.autoSave(state, 'settings', { expires: 7 * 24 * 3600 });

// Never expire (default)
ReactiveUtils.autoSave(state, 'key', { expires: null });
```

---

### onSave

Transform data before it's saved. Useful for filtering out sensitive fields or reducing data size.

```javascript
ReactiveUtils.autoSave(state, 'user', {
  onSave: (data) => {
    // Don't save the password field
    const { password, ...safe } = data;
    return safe;
  }
});
```

---

### onLoad

Transform data after it's loaded. Useful for migrating old data formats.

```javascript
ReactiveUtils.autoSave(state, 'settings', {
  onLoad: (data) => {
    // Migrate old format: 'darkMode' → 'theme'
    if (data.darkMode !== undefined) {
      data.theme = data.darkMode ? 'dark' : 'light';
      delete data.darkMode;
    }
    return data;
  }
});
```

---

### onSync

Called when data is synced from another tab.

```javascript
ReactiveUtils.autoSave(state, 'settings', {
  sync: true,
  onSync: (newValue) => {
    console.log('Settings updated from another tab:', newValue);
  }
});
```

---

### onError

Called when any storage operation fails.

```javascript
ReactiveUtils.autoSave(state, 'data', {
  onError: (error, operation) => {
    console.error(`Storage ${operation} failed:`, error.message);
    // operation is: 'save', 'load', 'sync', 'getValue', 'setValue', 'quota'
  }
});
```

---

## Instance Methods

After calling `autoSave`, these methods are added to your reactive object:

### .$save()

Manually trigger a save. Useful when `autoSave: false` or when you want to force an immediate save.

```javascript
const state = ReactiveUtils.state({ draft: '' });
ReactiveUtils.autoSave(state, 'draft', { autoSave: false });

// Save manually when the user clicks "Save Draft"
document.getElementById('saveDraft').onclick = () => {
  state.$save();
};
```

**Returns:** `true` if saved successfully, `false` on error

---

### .$load()

Manually load from storage, overwriting current state.

```javascript
// Reload from storage (e.g., after another tab changed it)
state.$load();
```

**Returns:** `true` if data was found and loaded, `false` if nothing was stored

During loading, the auto-save effect is temporarily paused (`isUpdatingFromStorage = true`) to prevent a save-load loop.

---

### .$clear()

Remove this state's data from storage.

```javascript
state.$clear();
// localStorage key 'my-key' is removed
```

**Returns:** `true` if removed successfully, `false` on error

---

### .$exists()

Check if saved data exists in storage.

```javascript
if (state.$exists()) {
  console.log('Saved data found');
} else {
  console.log('No saved data');
}
```

**Returns:** `true` or `false`

---

### .$stopAutoSave()

Pause the automatic saving effect. State changes won't be saved until `$startAutoSave()` is called.

```javascript
state.$stopAutoSave();

state.count = 99;  // NOT saved

state.$startAutoSave();

state.count = 100;  // Saved
```

**Returns:** the reactive object (for chaining)

---

### .$startAutoSave()

Resume automatic saving after it was stopped.

```javascript
state.$startAutoSave();
```

**Returns:** the reactive object (for chaining)

---

### .$destroy()

Clean up everything: the auto-save effect, the storage event listener (for sync), and the beforeunload handler.

```javascript
state.$destroy();
// Effect disposed, event listeners removed, timeouts cleared
```

Always call this when you no longer need the auto-save (e.g., when removing a dynamic component).

---

### .$storageInfo()

Get information about the stored data.

```javascript
const info = state.$storageInfo();
console.log(info);
// {
//   key: 'my-key',
//   namespace: '',
//   storage: 'localStorage',
//   exists: true,
//   size: 1234,
//   sizeKB: 1.2
// }
```

---

## Production Hardening Features

### Circular Reference Protection

The `safeStringify` function handles circular references in your state:

```javascript
const state = ReactiveUtils.state({ name: 'Alice' });
state.self = state;  // Circular reference!

// Without protection → JSON.stringify throws "Converting circular structure"
// With protection → circular refs are replaced with '[Circular]'
```

---

### Size Warnings

autoSave monitors the size of saved data:

```
Size check:
├── Item > 100KB → console.warn about large data
└── Total storage > 5MB → console.warn about storage size
```

---

### Quota Exceeded Handling

If localStorage is full, autoSave catches the `QuotaExceededError` and calls `onError`:

```javascript
ReactiveUtils.autoSave(state, 'data', {
  onError: (error, operation) => {
    if (operation === 'quota') {
      alert('Storage is full. Please clear some data.');
    }
  }
});
```

---

### Save Throttle

A minimum 100ms interval between saves prevents excessive writes:

```
Rapid state changes:
   change 1 → save ✅ (first save)
   change 2 → skip (< 100ms)
   change 3 → skip (< 100ms)
   ... 100ms ...
   change 4 → save ✅
```

This is independent of the `debounce` option and always active.

---

### Sync Loop Prevention

When `sync: true`, receiving a storage event from another tab triggers a state update. This update would normally trigger the auto-save effect, creating a loop. autoSave prevents this with two flags:

```
Tab 2 receives storage event
   ↓
syncLock = true (prevent re-entrant sync)
isUpdatingFromStorage = true (prevent save)
   ↓
Update state with new value
   ↓
Auto-save effect tries to run → sees isUpdatingFromStorage → skips save
   ↓
isUpdatingFromStorage = false
syncLock = false
```

---

## Key Takeaways

1. **Options control everything** — storage type, debounce, sync, expiration, callbacks
2. **Instance methods** ($save, $load, $clear, $exists, $destroy) give you manual control
3. **$destroy is important** — always call it when removing dynamic components
4. **Debounce** prevents saving on every keystroke
5. **Circular references** are handled safely
6. **Size warnings** alert you before storage fills up
7. **Sync loop prevention** uses two flags to avoid infinite save-load cycles
8. **Save throttle** (100ms minimum) prevents excessive writes

---

## What's next?

Let's explore `reactiveStorage`, `watch`, and the cross-tab synchronization system.

Let's continue!