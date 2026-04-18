[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# .clear() and .exists() — Removing and Checking Data

## Quick Start (30 seconds)

```javascript
// Save something first
StorageUtils.save('username', 'Alice');

// Check if it exists
StorageUtils.exists('username');  // true
StorageUtils.exists('missing');   // false

// Remove it
StorageUtils.clear('username');

// Now it's gone
StorageUtils.exists('username');  // false
StorageUtils.load('username');    // null
```

---

## What is .clear()?

`.clear()` **removes a specific key** from browser storage. Once cleared, the data is gone — loading that key will return the default value.

Simply put, `.clear()` is **"delete this one piece of data."**

## What is .exists()?

`.exists()` **checks whether a key exists** in storage without loading the data. It's a quick yes-or-no check.

Simply put, `.exists()` is **"is this data stored?"**

---

## Syntax

### .clear()

```javascript
StorageUtils.clear(key)
StorageUtils.clear(key, options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | String | Yes | The storage key to remove |
| `options` | Object | No | `{ storage, namespace }` |

**Returns:** `true` if cleared successfully, `false` if something went wrong.

### .exists()

```javascript
StorageUtils.exists(key)
StorageUtils.exists(key, options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | String | Yes | The storage key to check |
| `options` | Object | No | `{ storage, namespace }` |

**Returns:** `true` if the key exists, `false` if it doesn't.

### Options Object

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | String | `'localStorage'` | `'localStorage'` or `'sessionStorage'` |
| `namespace` | String | (none) | A prefix for the key |

---

## Why Do These Methods Exist?

### The Problem with Raw localStorage

Checking if a key exists and removing keys from `localStorage` works, but there are some rough edges:

```javascript
// ❌ localStorage.getItem returns null for missing keys
// But it also returns null for keys that store the value null
localStorage.setItem('value', JSON.stringify(null));
localStorage.getItem('value');      // "null" — exists, but holds null
localStorage.getItem('missing');    // null — doesn't exist

// How do you tell the difference?
// You'd have to do this:
const raw = localStorage.getItem('key');
const exists = raw !== null;  // Works, but easy to forget
```

```javascript
// ❌ Removing a key is straightforward, but no error handling
localStorage.removeItem('key');
// What if storage isn't available? No feedback.
```

### The StorageUtils Way

```javascript
// ✅ Clear returns success/failure feedback
const removed = StorageUtils.clear('username');
console.log(removed);  // true (or false if something went wrong)

// ✅ Exists gives a clear yes/no answer
StorageUtils.exists('username');  // true or false — no ambiguity
```

---

## How Does It Work?

### .clear() Under the Hood

```
StorageUtils.clear('username')
   ↓
1️⃣ Get storage instance → localStorage (default)
   ↓
2️⃣ Build the full key → 'username' (or 'myApp:username' with namespace)
   ↓
3️⃣ Remove → localStorage.removeItem('username')
   ↓
4️⃣ Return true (success)
```

### .exists() Under the Hood

```
StorageUtils.exists('username')
   ↓
1️⃣ Get storage instance → localStorage (default)
   ↓
2️⃣ Build the full key → 'username'
   ↓
3️⃣ Check → localStorage.getItem('username') !== null
   ↓
4️⃣ Return true (key found) or false (key not found)
```

---

## Basic Usage

### Removing a Single Key

```javascript
StorageUtils.save('token', 'abc123');
console.log(StorageUtils.exists('token'));  // true

StorageUtils.clear('token');
console.log(StorageUtils.exists('token'));  // false
console.log(StorageUtils.load('token'));    // null
```

### Checking Before Loading

```javascript
// Load only if the data exists
if (StorageUtils.exists('userSettings')) {
  const settings = StorageUtils.load('userSettings');
  applySettings(settings);
} else {
  console.log('No saved settings — using defaults');
  applySettings(defaultSettings);
}
```

### Clearing with Feedback

```javascript
const success = StorageUtils.clear('oldData');

if (success) {
  console.log('Old data removed');
} else {
  console.log('Could not remove data');
}
```

---

## Working with sessionStorage

Both `.clear()` and `.exists()` support the `storage` option:

```javascript
// Save to sessionStorage
StorageUtils.save('tempData', 'hello', { storage: 'sessionStorage' });

// Check in sessionStorage
StorageUtils.exists('tempData', { storage: 'sessionStorage' });  // true

// Check in localStorage — it's not there
StorageUtils.exists('tempData');  // false

// Clear from sessionStorage
StorageUtils.clear('tempData', { storage: 'sessionStorage' });
```

**Key Insight:** `localStorage` and `sessionStorage` are **separate storage spaces**. A key saved in one does not exist in the other.

---

## Working with Namespaces

Both methods support namespaces to organize your keys:

```javascript
// Save with a namespace
StorageUtils.save('theme', 'dark', { namespace: 'myApp' });

// Check with the same namespace
StorageUtils.exists('theme', { namespace: 'myApp' });  // true

// Without the namespace — key isn't found
StorageUtils.exists('theme');  // false

// Clear with the namespace
StorageUtils.clear('theme', { namespace: 'myApp' });
```

The actual key stored in the browser is `myApp:theme`. You must use the same namespace for all operations on that key.

---

## Real-World Examples

### Example 1: Logout — Clear User Data

```javascript
function logout() {
  StorageUtils.clear('authToken');
  StorageUtils.clear('userProfile');
  StorageUtils.clear('preferences');

  console.log('User data cleared');
  window.location.href = '/login';
}
```

### Example 2: Conditional Feature Loading

```javascript
// Only show the onboarding tour if the user hasn't completed it
if (!StorageUtils.exists('onboardingComplete')) {
  showOnboardingTour();
}
```

### Example 3: Check Before Overwriting

```javascript
function saveScore(score) {
  if (StorageUtils.exists('highScore')) {
    const current = StorageUtils.load('highScore');
    if (score > current) {
      StorageUtils.save('highScore', score);
      console.log('New high score!');
    }
  } else {
    // First score ever
    StorageUtils.save('highScore', score);
  }
}
```

### Example 4: Clean Up Expired Data

```javascript
function clearExpiredSession() {
  if (StorageUtils.exists('sessionExpiry')) {
    const expiry = StorageUtils.load('sessionExpiry');
    if (Date.now() > expiry) {
      StorageUtils.clear('sessionExpiry');
      StorageUtils.clear('sessionData');
      console.log('Expired session cleared');
    }
  }
}
```

---

## .clear() vs .clearAll()

Don't confuse `.clear()` with `.clearAll()`:

| Method | What It Does |
|--------|-------------|
| `.clear(key)` | Removes **one specific key** from storage |
| `.clearAll()` | Removes **all keys** (or all keys in a namespace) |

```javascript
// Remove just one key
StorageUtils.clear('username');

// Remove everything
StorageUtils.clearAll();
```

---

## Common Patterns

### Save, Check, Clear Cycle

```javascript
// Save
StorageUtils.save('draft', { title: 'My Post', body: '...' });

// Check
if (StorageUtils.exists('draft')) {
  console.log('You have an unsaved draft');
}

// Clear after submitting
StorageUtils.clear('draft');
```

### Guard Clause Pattern

```javascript
function getUser() {
  if (!StorageUtils.exists('user')) {
    return null;  // No user data stored
  }
  return StorageUtils.load('user');
}
```

---

## Edge Cases

### Clearing a Key That Doesn't Exist

Clearing a non-existent key does **not** cause an error — it simply returns `true`:

```javascript
StorageUtils.clear('neverSaved');  // true — no error
```

### Checking Exists After Saving null

If you save `null`, the key exists in storage (with the value `"null"`):

```javascript
StorageUtils.save('value', null);
StorageUtils.exists('value');  // true — the key exists
StorageUtils.load('value');    // null — the stored value
```

---

## Summary

| Aspect | `.clear()` | `.exists()` |
|--------|-----------|------------|
| **What** | Removes a key from storage | Checks if a key exists |
| **Returns** | `true` / `false` (success/failure) | `true` / `false` (found/not found) |
| **Options** | `{ storage, namespace }` | `{ storage, namespace }` |
| **Safe?** | Yes — clearing a missing key is fine | Yes — always returns a boolean |

> **Simple Rule to Remember:** Use `.exists()` to check, `.clear()` to remove. Both are safe operations — they never throw errors, even with missing keys.