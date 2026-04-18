[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# .getInfo() and .clearAll() — Inspecting and Wiping Storage

## Quick Start (30 seconds)

```javascript
// See what's in storage
const info = StorageUtils.getInfo();
console.log(info.keys);    // ['username', 'theme', 'settings']
console.log(info.size);    // 3
console.log(info.available); // true

// Remove everything
const removed = StorageUtils.clearAll();
console.log(removed);  // 3 (number of keys removed)
```

---

## What is .getInfo()?

`.getInfo()` gives you an **overview of what's stored** — how many keys exist, what their names are, which storage type is being used, and whether storage is available.

Simply put, it's like **opening a drawer and looking at the labels on all the files inside**.

## What is .clearAll()?

`.clearAll()` **removes all keys** from storage (or all keys within a specific namespace). It's the nuclear option — a complete wipe.

Simply put, it's like **emptying the entire drawer**.

---

## .getInfo() — Syntax

```javascript
StorageUtils.getInfo()
StorageUtils.getInfo(options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | Object | No | `{ storage, namespace }` |

**Returns:** An info object:

| Property | Type | Description |
|----------|------|-------------|
| `available` | Boolean | Whether storage is accessible |
| `keys` | Array | List of key names |
| `size` | Number | How many keys exist |
| `storageType` | String | `'localStorage'` or `'sessionStorage'` |

---

## .clearAll() — Syntax

```javascript
StorageUtils.clearAll()
StorageUtils.clearAll(options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | Object | No | `{ storage, namespace }` |

**Returns:** The number of keys that were removed.

---

## How Does .getInfo() Work?

```
StorageUtils.getInfo({ namespace: 'myApp' })
   ↓
1️⃣ Get storage instance → localStorage (default)
   ↓
2️⃣ Build the prefix → 'myApp:'
   ↓
3️⃣ Loop through all storage keys:
   ├── 'myApp:theme'    → starts with 'myApp:' → ✅ include → name: 'theme'
   ├── 'myApp:fontSize' → starts with 'myApp:' → ✅ include → name: 'fontSize'
   ├── 'other:data'     → doesn't match         → ❌ skip
   └── 'username'       → doesn't match         → ❌ skip
   ↓
4️⃣ Return:
   {
     available: true,
     keys: ['theme', 'fontSize'],
     size: 2,
     storageType: 'localStorage'
   }
```

**Key Detail:** When using a namespace, the returned key names have the prefix **stripped off**. You see `'theme'`, not `'myApp:theme'`.

---

## How Does .clearAll() Work?

```
StorageUtils.clearAll({ namespace: 'myApp' })
   ↓
1️⃣ Get storage instance → localStorage
   ↓
2️⃣ Build the prefix → 'myApp:'
   ↓
3️⃣ Scan all keys and collect matches:
   ├── 'myApp:theme'    → match → add to removal list
   ├── 'myApp:fontSize' → match → add to removal list
   ├── 'other:data'     → no match → skip
   └── 'username'       → no match → skip
   ↓
4️⃣ Remove all collected keys:
   ├── localStorage.removeItem('myApp:theme')
   └── localStorage.removeItem('myApp:fontSize')
   ↓
5️⃣ Return 2 (number of keys removed)
```

---

## Basic Usage

### Inspect All Storage

```javascript
// Add some data first
StorageUtils.save('name', 'Alice');
StorageUtils.save('theme', 'dark');
StorageUtils.save('score', 100);

// See what's stored
const info = StorageUtils.getInfo();
console.log(info.available);    // true
console.log(info.keys);         // ['name', 'theme', 'score']
console.log(info.size);         // 3
console.log(info.storageType);  // 'localStorage'
```

### Inspect a Specific Namespace

```javascript
StorageUtils.save('a', 1, { namespace: 'app' });
StorageUtils.save('b', 2, { namespace: 'app' });
StorageUtils.save('c', 3, { namespace: 'other' });

const appInfo = StorageUtils.getInfo({ namespace: 'app' });
console.log(appInfo.keys);  // ['a', 'b']
console.log(appInfo.size);  // 2
```

### Inspect sessionStorage

```javascript
StorageUtils.save('temp', 'data', { storage: 'sessionStorage' });

const info = StorageUtils.getInfo({ storage: 'sessionStorage' });
console.log(info.storageType);  // 'sessionStorage'
console.log(info.keys);         // ['temp']
```

---

### Clear Everything

```javascript
StorageUtils.save('a', 1);
StorageUtils.save('b', 2);
StorageUtils.save('c', 3);

const removed = StorageUtils.clearAll();
console.log(removed);  // 3

const info = StorageUtils.getInfo();
console.log(info.size);  // 0
```

### Clear Only a Namespace

```javascript
StorageUtils.save('x', 1, { namespace: 'temp' });
StorageUtils.save('y', 2, { namespace: 'temp' });
StorageUtils.save('z', 3, { namespace: 'keep' });
StorageUtils.save('w', 4);  // no namespace

// Remove only 'temp' namespace
const removed = StorageUtils.clearAll({ namespace: 'temp' });
console.log(removed);  // 2

// Other data is untouched
StorageUtils.exists('z', { namespace: 'keep' });  // true
StorageUtils.exists('w');  // true
```

### Clear sessionStorage

```javascript
const removed = StorageUtils.clearAll({ storage: 'sessionStorage' });
console.log(removed);  // number of sessionStorage keys removed
```

---

## When Storage Is Unavailable

If storage isn't available (server-side rendering, disabled by browser), `.getInfo()` returns a safe fallback:

```javascript
// If storage is unavailable:
const info = StorageUtils.getInfo();
console.log(info.available);  // false
console.log(info.keys);       // []
console.log(info.size);       // 0
```

And `.clearAll()` returns `0`:

```javascript
const removed = StorageUtils.clearAll();
console.log(removed);  // 0
```

---

## Real-World Examples

### Example 1: Storage Dashboard

```javascript
function showStorageStatus() {
  const local = StorageUtils.getInfo();
  const session = StorageUtils.getInfo({ storage: 'sessionStorage' });

  console.log(`localStorage: ${local.size} keys`);
  console.log(`sessionStorage: ${session.size} keys`);
  console.log('localStorage keys:', local.keys.join(', '));
}

showStorageStatus();
// localStorage: 5 keys
// sessionStorage: 2 keys
// localStorage keys: theme, user, settings, cart, history
```

### Example 2: App Reset

```javascript
function resetApp() {
  // Clear all app data
  const removed = StorageUtils.clearAll({ namespace: 'myApp' });
  console.log(`Cleared ${removed} items`);

  // Reload with defaults
  window.location.reload();
}
```

### Example 3: Debug Helper

```javascript
function debugStorage() {
  const info = StorageUtils.getInfo();

  console.log('=== Storage Debug ===');
  console.log(`Available: ${info.available}`);
  console.log(`Type: ${info.storageType}`);
  console.log(`Total keys: ${info.size}`);
  console.log('Keys:');
  info.keys.forEach(key => {
    const value = StorageUtils.load(key);
    console.log(`  ${key}: ${JSON.stringify(value)}`);
  });
}
```

### Example 4: Clean Up Old Namespace

```javascript
// During an app update, remove data from the old version
function migrateStorage() {
  const oldData = StorageUtils.getInfo({ namespace: 'v1' });

  if (oldData.size > 0) {
    console.log(`Migrating ${oldData.size} items from v1...`);

    // Copy important data to new namespace
    oldData.keys.forEach(key => {
      const value = StorageUtils.load(key, null, { namespace: 'v1' });
      StorageUtils.save(key, value, { namespace: 'v2' });
    });

    // Remove old namespace
    StorageUtils.clearAll({ namespace: 'v1' });
    console.log('Migration complete');
  }
}
```

---

## .clearAll() vs .clear()

| Method | What It Removes |
|--------|---------------|
| `.clear(key)` | One specific key |
| `.clearAll()` | All keys (or all keys in a namespace) |

```javascript
// Remove one key
StorageUtils.clear('theme');

// Remove all keys in a namespace
StorageUtils.clearAll({ namespace: 'myApp' });

// Remove absolutely everything in localStorage
StorageUtils.clearAll();
```

**Warning:** Calling `.clearAll()` without a namespace removes **all keys** from the storage type — including keys set by other scripts or libraries. Use with care, or always use a namespace.

---

## Summary

| Aspect | `.getInfo()` | `.clearAll()` |
|--------|-------------|--------------|
| **What** | Returns storage overview | Removes keys from storage |
| **Returns** | `{ available, keys, size, storageType }` | Number of keys removed |
| **With namespace** | Lists only keys in that namespace | Removes only keys in that namespace |
| **Without namespace** | Lists all keys | Removes all keys |
| **Safe when unavailable** | Returns `{ available: false, keys: [], size: 0 }` | Returns `0` |

> **Simple Rule to Remember:** `.getInfo()` tells you what's stored, `.clearAll()` wipes it clean. Always use a namespace with `.clearAll()` unless you truly want to remove everything. Check `.getInfo()` first if you want to know what you're about to delete.