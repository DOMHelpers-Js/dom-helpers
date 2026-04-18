[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Namespaces — Organizing Your Storage Keys

## Quick Start (30 seconds)

```javascript
// Without namespaces — keys can collide
StorageUtils.save('theme', 'dark');

// With namespaces — keys are organized
StorageUtils.save('theme', 'dark', { namespace: 'myApp' });
StorageUtils.save('theme', 'blue', { namespace: 'adminPanel' });

// Each namespace has its own "theme" — no collision
StorageUtils.load('theme', null, { namespace: 'myApp' });        // "dark"
StorageUtils.load('theme', null, { namespace: 'adminPanel' });   // "blue"
```

---

## What Are Namespaces?

A namespace is a **prefix** added to your storage keys to organize them and prevent collisions. When you pass `{ namespace: 'myApp' }`, the key `'theme'` becomes `'myApp:theme'` in actual storage.

Simply put, namespaces are like **folders for your storage keys** — they keep different parts of your app from accidentally overwriting each other's data.

---

## Why Do Namespaces Exist?

### The Problem: Key Collisions

Imagine you have two different features on the same page, and both use a key called `'settings'`:

```javascript
// ❌ Feature A saves its settings
localStorage.setItem('settings', JSON.stringify({ volume: 80 }));

// ❌ Feature B saves its settings — overwrites Feature A!
localStorage.setItem('settings', JSON.stringify({ color: 'red' }));

// Feature A tries to load — gets Feature B's data!
JSON.parse(localStorage.getItem('settings'));
// { color: 'red' } — Feature A's data is gone!
```

This gets worse when:
- Multiple developers work on different features
- You use third-party widgets or scripts
- Your app has multiple independent sections

### The Solution: Namespaces

```javascript
// ✅ Feature A uses its own namespace
StorageUtils.save('settings', { volume: 80 }, { namespace: 'audioPlayer' });

// ✅ Feature B uses its own namespace
StorageUtils.save('settings', { color: 'red' }, { namespace: 'colorPicker' });

// Each feature's data is safe
StorageUtils.load('settings', null, { namespace: 'audioPlayer' });
// { volume: 80 } — intact!

StorageUtils.load('settings', null, { namespace: 'colorPicker' });
// { color: 'red' } — also intact!
```

---

## How Do Namespaces Work?

The namespace is simply a prefix joined to the key with a colon (`:`):

```
StorageUtils.save('theme', 'dark', { namespace: 'myApp' })
   ↓
Build key: 'myApp' + ':' + 'theme' → 'myApp:theme'
   ↓
localStorage.setItem('myApp:theme', '"dark"')
```

### Visual Example

```
Without namespace:
┌─────────────────────────────────────┐
│  localStorage                        │
│  ├── theme     → "dark"              │
│  ├── settings  → {...}               │
│  └── user      → {...}               │
└─────────────────────────────────────┘

With namespaces:
┌─────────────────────────────────────┐
│  localStorage                        │
│  ├── myApp:theme     → "dark"        │
│  ├── myApp:settings  → {...}         │
│  ├── myApp:user      → {...}         │
│  ├── admin:theme     → "light"       │
│  └── admin:settings  → {...}         │
└─────────────────────────────────────┘
```

---

## Using Namespaces with Every Method

Namespaces work with **all StorageUtils methods**. Just pass `{ namespace: 'yourNamespace' }` in the options:

### save() with namespace

```javascript
StorageUtils.save('theme', 'dark', { namespace: 'myApp' });
// Stores key: 'myApp:theme'
```

### load() with namespace

```javascript
const theme = StorageUtils.load('theme', 'light', { namespace: 'myApp' });
// Reads key: 'myApp:theme'
```

### exists() with namespace

```javascript
StorageUtils.exists('theme', { namespace: 'myApp' });
// Checks key: 'myApp:theme'
```

### clear() with namespace

```javascript
StorageUtils.clear('theme', { namespace: 'myApp' });
// Removes key: 'myApp:theme'
```

### getInfo() with namespace

```javascript
StorageUtils.getInfo({ namespace: 'myApp' });
// Lists only keys that start with 'myApp:'
```

### clearAll() with namespace

```javascript
StorageUtils.clearAll({ namespace: 'myApp' });
// Removes all keys that start with 'myApp:'
// Leaves other namespaces and un-namespaced keys untouched
```

---

## Real-World Examples

### Example 1: Multi-Feature App

```javascript
// Audio player stores its settings
StorageUtils.save('volume', 80, { namespace: 'audio' });
StorageUtils.save('muted', false, { namespace: 'audio' });

// Chat widget stores its settings
StorageUtils.save('open', true, { namespace: 'chat' });
StorageUtils.save('unread', 3, { namespace: 'chat' });

// Each feature loads its own data safely
const volume = StorageUtils.load('volume', 50, { namespace: 'audio' });
const chatOpen = StorageUtils.load('open', false, { namespace: 'chat' });
```

### Example 2: User-Specific Storage

```javascript
// Store preferences per user
function saveUserPref(userId, key, value) {
  StorageUtils.save(key, value, { namespace: `user_${userId}` });
}

function loadUserPref(userId, key, fallback) {
  return StorageUtils.load(key, fallback, { namespace: `user_${userId}` });
}

// Alice's preferences
saveUserPref(101, 'theme', 'dark');

// Bob's preferences
saveUserPref(202, 'theme', 'light');

// Each user has their own data
loadUserPref(101, 'theme', 'light');  // "dark"
loadUserPref(202, 'theme', 'light');  // "light"
```

### Example 3: Clean Up One Feature Without Affecting Others

```javascript
// App has data in multiple namespaces
StorageUtils.save('data', 'A', { namespace: 'feature1' });
StorageUtils.save('data', 'B', { namespace: 'feature2' });
StorageUtils.save('data', 'C', { namespace: 'feature3' });

// Remove only feature1's data
StorageUtils.clearAll({ namespace: 'feature1' });

// feature2 and feature3 data are untouched
StorageUtils.load('data', null, { namespace: 'feature2' });  // "B"
StorageUtils.load('data', null, { namespace: 'feature3' });  // "C"
```

### Example 4: Inspecting a Namespace

```javascript
// See what's stored in a namespace
StorageUtils.save('name', 'Alice', { namespace: 'profile' });
StorageUtils.save('age', 30, { namespace: 'profile' });
StorageUtils.save('city', 'NYC', { namespace: 'profile' });

const info = StorageUtils.getInfo({ namespace: 'profile' });
console.log(info.keys);   // ['name', 'age', 'city']
console.log(info.size);   // 3
```

Notice that `getInfo()` returns the keys **without the namespace prefix** — you see `'name'`, not `'profile:name'`.

---

## Combining Namespace with sessionStorage

Namespaces and storage type are independent options — you can combine them:

```javascript
// Namespace + sessionStorage
StorageUtils.save('token', 'abc', {
  namespace: 'auth',
  storage: 'sessionStorage'
});

// Load with same options
const token = StorageUtils.load('token', null, {
  namespace: 'auth',
  storage: 'sessionStorage'
});
```

---

## Important: Namespace Consistency

You **must use the same namespace** for all operations on the same key. If you save with a namespace but load without it, the data won't be found:

```javascript
// ❌ Save with namespace, load without — data not found!
StorageUtils.save('theme', 'dark', { namespace: 'myApp' });
StorageUtils.load('theme');  // null — looking for 'theme', not 'myApp:theme'

// ✅ Use the same namespace for both
StorageUtils.save('theme', 'dark', { namespace: 'myApp' });
StorageUtils.load('theme', null, { namespace: 'myApp' });  // "dark"
```

---

## What Happens in the Browser DevTools?

If you open the browser's Application tab and look at localStorage, you'll see the full keys with prefixes:

```
Browser DevTools → Application → Local Storage:

Key                  │ Value
─────────────────────┼──────────
myApp:theme          │ "dark"
myApp:fontSize       │ 16
admin:theme          │ "light"
username             │ "Alice"     ← no namespace
```

This makes it easy to identify which keys belong to which feature.

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | A prefix added to storage keys to organize and isolate data |
| **Format** | `namespace:key` (e.g., `'myApp:theme'`) |
| **How to use** | Pass `{ namespace: 'name' }` in the options object |
| **Works with** | Every method: `save`, `load`, `clear`, `exists`, `getInfo`, `clearAll`, `watch`, `createAutoSave` |
| **clearAll()** | With a namespace, only removes keys in that namespace |
| **getInfo()** | With a namespace, only lists keys in that namespace (without the prefix) |

> **Simple Rule to Remember:** A namespace is just a prefix that keeps your keys organized. Always use the **same namespace** for save, load, clear, and exists operations on the same data. Use `clearAll({ namespace })` to clean up an entire namespace at once.