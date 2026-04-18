[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)



# StorageUtils — Introduction

## Quick Start (30 seconds)

```javascript
// Save data to localStorage
StorageUtils.save('username', 'Alice');

// Load it back
const name = StorageUtils.load('username');
console.log(name);  // "Alice"

// Check if a key exists
StorageUtils.exists('username');  // true

// Remove it
StorageUtils.clear('username');
```

---

## What is StorageUtils?

`StorageUtils` is a **standalone utility** for working with the browser's `localStorage` and `sessionStorage`. It wraps the native storage APIs with a cleaner interface and adds features you'd otherwise have to build yourself:

- **Automatic JSON serialization** — save objects, arrays, numbers, booleans directly (no manual `JSON.stringify`/`JSON.parse`)
- **Namespaces** — organize your storage keys to avoid collisions
- **Cross-tab watching** — react when storage changes in another browser tab
- **Auto-save with debouncing** — save data automatically without flooding storage
- **Safe defaults** — every operation returns a fallback value if something goes wrong

Simply put, `StorageUtils` makes `localStorage` and `sessionStorage` **easier, safer, and more powerful**.

---

## Why Does This Exist?

### The Problem with Raw localStorage

The native `localStorage` API has a few pain points:

```javascript
// ❌ Problem 1: Only stores strings
localStorage.setItem('count', 42);
const count = localStorage.getItem('count');
console.log(typeof count);  // "string" — not a number!
console.log(count + 1);     // "421" — string concatenation, not addition!

// ❌ Problem 2: Must manually serialize objects
const user = { name: 'Alice', age: 30 };
localStorage.setItem('user', user);
localStorage.getItem('user');  // "[object Object]" — data lost!

// ✅ You have to do this:
localStorage.setItem('user', JSON.stringify(user));
const loaded = JSON.parse(localStorage.getItem('user'));

// ❌ Problem 3: No default values
localStorage.getItem('nonexistent');  // null — you have to handle this everywhere

// ❌ Problem 4: No error handling
// What if storage is full? What if JSON.parse fails on corrupted data?
// Every call needs try/catch
```

### The StorageUtils Way

```javascript
// ✅ Stores any data type — serialization is automatic
StorageUtils.save('count', 42);
const count = StorageUtils.load('count');
console.log(typeof count);  // "number" — correct!
console.log(count + 1);     // 43 — math works!

// ✅ Objects work directly
StorageUtils.save('user', { name: 'Alice', age: 30 });
const user = StorageUtils.load('user');
console.log(user.name);  // "Alice"

// ✅ Default values built in
const theme = StorageUtils.load('theme', 'light');  // Returns 'light' if not found

// ✅ Error handling built in — returns false on failure
const success = StorageUtils.save('key', data);  // true or false
```

---

## Mental Model: A Smart Filing Cabinet

Think of `StorageUtils` as a **smart filing cabinet** that sits in front of the browser's raw storage:

```
Your Code
   ↓
StorageUtils (Smart Filing Cabinet)
├── Translates your data to storage format (serialize)
├── Translates storage format back to your data (deserialize)
├── Organizes files into labeled folders (namespaces)
├── Watches for changes from other offices (cross-tab sync)
└── Auto-files documents on a schedule (auto-save)
   ↓
Browser Storage (localStorage / sessionStorage)
```

Without StorageUtils, you're reaching directly into the raw filing cabinet — everything is stored as plain text, and you have to do all the organizing yourself.

---

## How Does It Work?

When you call `StorageUtils.save('user', { name: 'Alice' })`, here's what happens:

```
StorageUtils.save('user', { name: 'Alice' })
   ↓
1️⃣ Get storage instance (localStorage by default)
   ↓
2️⃣ Build the full key: 'user' (or 'myApp:user' if namespace is set)
   ↓
3️⃣ Serialize the data: JSON.stringify({ name: 'Alice' }) → '{"name":"Alice"}'
   ↓
4️⃣ Store it: localStorage.setItem('user', '{"name":"Alice"}')
   ↓
5️⃣ Return true (success)
```

When you call `StorageUtils.load('user')`:

```
StorageUtils.load('user')
   ↓
1️⃣ Get storage instance (localStorage by default)
   ↓
2️⃣ Build the full key: 'user'
   ↓
3️⃣ Retrieve: localStorage.getItem('user') → '{"name":"Alice"}'
   ↓
4️⃣ Deserialize: JSON.parse('{"name":"Alice"}') → { name: 'Alice' }
   ↓
5️⃣ Return the object: { name: 'Alice' }
```

---

## What's Inside StorageUtils?

Here's a complete overview of every method:

### Basic Operations

| Method | What It Does | Returns |
|--------|-------------|---------|
| `save(key, data, options)` | Save any data to storage | `true` / `false` |
| `load(key, defaultValue, options)` | Load data from storage | The data, or `defaultValue` |
| `clear(key, options)` | Remove a specific key | `true` / `false` |
| `exists(key, options)` | Check if a key exists | `true` / `false` |

### Advanced Operations

| Method | What It Does | Returns |
|--------|-------------|---------|
| `watch(key, callback, options)` | React to storage changes from other tabs | Cleanup function |
| `createAutoSave(key, options)` | Create a debounced auto-save manager | Manager object |

### Utilities

| Method | What It Does | Returns |
|--------|-------------|---------|
| `getInfo(options)` | List all keys and storage status | Info object |
| `clearAll(options)` | Remove all keys (or all in a namespace) | Number of keys removed |
| `serialize(value)` | Convert any value to JSON string | String or `null` |
| `deserialize(str, default)` | Convert JSON string back to a value | Parsed value or default |

### Properties

| Property | Value |
|----------|-------|
| `version` | `"1.0.0"` |

---

## localStorage vs sessionStorage

StorageUtils works with both storage types. The `options.storage` parameter controls which one is used:

| Storage Type | Lifetime | Shared Across Tabs? | Default? |
|-------------|----------|-------------------|----------|
| `localStorage` | Persists until manually cleared | ✅ Yes | ✅ Yes (default) |
| `sessionStorage` | Cleared when tab/window closes | ❌ No | |

```javascript
// localStorage (default) — data persists
StorageUtils.save('theme', 'dark');

// sessionStorage — data cleared when tab closes
StorageUtils.save('tempToken', 'abc123', { storage: 'sessionStorage' });
```

---

## Integration with DOM Helpers

When the DOM Helpers core library is loaded before StorageUtils, the module automatically attaches itself to each helper:

```javascript
// Access StorageUtils through any helper
Elements.Storage.save('key', 'value');
Collections.Storage.load('key');
Selector.Storage.exists('key');

// These are all the same as:
StorageUtils.save('key', 'value');
```

This is a convenience — you can always use the `StorageUtils` global directly.

---

## A Real-World Example: User Preferences

```javascript
// Save user preferences
function savePreferences(prefs) {
  StorageUtils.save('preferences', prefs);
}

// Load preferences with defaults
function loadPreferences() {
  return StorageUtils.load('preferences', {
    theme: 'light',
    fontSize: 16,
    notifications: true
  });
}

// Usage
const prefs = loadPreferences();
console.log(prefs.theme);  // 'light' (default on first visit)

// User changes theme
prefs.theme = 'dark';
savePreferences(prefs);

// On next page load, their preference is remembered
const prefs2 = loadPreferences();
console.log(prefs2.theme);  // 'dark'
```

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | A clean wrapper around `localStorage` and `sessionStorage` |
| **Why** | Automatic JSON serialization, defaults, namespaces, cross-tab sync, auto-save |
| **Basic ops** | `save()`, `load()`, `clear()`, `exists()` |
| **Advanced** | `watch()` for cross-tab changes, `createAutoSave()` for debounced saving |
| **Standalone** | Works independently — no dependency on DOM Helpers core |
| **Integration** | Automatically attaches to `Elements.Storage`, `Collections.Storage`, `Selector.Storage` |

> **Simple Rule to Remember:** `StorageUtils` does what `localStorage` does, but handles JSON, defaults, and errors for you. Use `save()` and `load()` instead of `setItem()` and `getItem()`.