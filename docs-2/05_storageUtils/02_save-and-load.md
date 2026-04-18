[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# .save() and .load() — Storing and Retrieving Data

## Quick Start (30 seconds)

```javascript
// Save any data type
StorageUtils.save('username', 'Alice');
StorageUtils.save('score', 42);
StorageUtils.save('settings', { theme: 'dark', fontSize: 16 });
StorageUtils.save('tags', ['html', 'css', 'js']);

// Load it back — types are preserved
StorageUtils.load('username');   // "Alice" (string)
StorageUtils.load('score');      // 42 (number — not "42"!)
StorageUtils.load('settings');   // { theme: 'dark', fontSize: 16 } (object)
StorageUtils.load('tags');       // ['html', 'css', 'js'] (array)
```

---

## What is .save()?

`.save()` stores **any JavaScript value** in the browser's storage. It automatically converts your data to a string format that storage can handle, so you never have to worry about `JSON.stringify()`.

Simply put, `.save()` is **"put this data away for later."**

## What is .load()?

`.load()` retrieves data from storage and **automatically converts it back** to its original type. No more manual `JSON.parse()` or type checking.

Simply put, `.load()` is **"give me that data back, exactly as I saved it."**

---

## Syntax

### .save()

```javascript
StorageUtils.save(key, data)
StorageUtils.save(key, data, options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | String | Yes | The name to store the data under |
| `data` | Any | Yes | The value to store (string, number, object, array, boolean, null) |
| `options` | Object | No | `{ storage, namespace }` — see Options below |

**Returns:** `true` if saved successfully, `false` if something went wrong.

### .load()

```javascript
StorageUtils.load(key)
StorageUtils.load(key, defaultValue)
StorageUtils.load(key, defaultValue, options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | String | Yes | The name of the data to retrieve |
| `defaultValue` | Any | No | Value to return if the key doesn't exist (default: `null`) |
| `options` | Object | No | `{ storage, namespace }` — see Options below |

**Returns:** The stored data (in its original type), or `defaultValue` if the key doesn't exist.

### Options Object

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | String | `'localStorage'` | Which storage to use: `'localStorage'` or `'sessionStorage'` |
| `namespace` | String | (none) | A prefix added to the key to avoid collisions |

---

## Why Does This Exist?

### The Problem with Raw localStorage

The browser's `localStorage` has a fundamental limitation — **it only stores strings**:

```javascript
// ❌ Problem 1: Numbers become strings
localStorage.setItem('count', 42);
const count = localStorage.getItem('count');
console.log(typeof count);  // "string"
console.log(count + 1);     // "421" — string concatenation, not math!
```

```javascript
// ❌ Problem 2: Objects are lost
const user = { name: 'Alice', age: 30 };
localStorage.setItem('user', user);
localStorage.getItem('user');  // "[object Object]" — your data is gone!
```

```javascript
// ❌ Problem 3: Booleans become strings
localStorage.setItem('loggedIn', true);
const loggedIn = localStorage.getItem('loggedIn');
console.log(loggedIn === true);   // false — it's the string "true"
console.log(loggedIn === 'true'); // true — not what you want
```

```javascript
// ❌ Problem 4: No fallback values
const theme = localStorage.getItem('theme');
console.log(theme);  // null — you have to check for null everywhere
```

To work around these, you end up writing boilerplate every time:

```javascript
// The manual way — tedious and repetitive
const user = { name: 'Alice', age: 30 };
localStorage.setItem('user', JSON.stringify(user));       // Serialize
const loaded = JSON.parse(localStorage.getItem('user'));  // Deserialize
// And you need try/catch in case JSON.parse fails on corrupted data!
```

### The StorageUtils Way

```javascript
// ✅ Numbers stay numbers
StorageUtils.save('count', 42);
const count = StorageUtils.load('count');
console.log(typeof count);  // "number"
console.log(count + 1);     // 43 — correct!

// ✅ Objects stay objects
StorageUtils.save('user', { name: 'Alice', age: 30 });
const user = StorageUtils.load('user');
console.log(user.name);  // "Alice"

// ✅ Booleans stay booleans
StorageUtils.save('loggedIn', true);
const loggedIn = StorageUtils.load('loggedIn');
console.log(loggedIn === true);  // true — correct!

// ✅ Default values built in
const theme = StorageUtils.load('theme', 'light');
console.log(theme);  // "light" — not null!
```

---

## How Does It Work?

### What Happens When You Save

```
StorageUtils.save('user', { name: 'Alice' })
   ↓
1️⃣ Get storage instance → localStorage (default)
   ↓
2️⃣ Build the key → 'user' (or 'myApp:user' if namespace is set)
   ↓
3️⃣ Serialize → JSON.stringify({ name: 'Alice' }) → '{"name":"Alice"}'
   ↓
4️⃣ Store → localStorage.setItem('user', '{"name":"Alice"}')
   ↓
5️⃣ Return true (success)
```

### What Happens When You Load

```
StorageUtils.load('user')
   ↓
1️⃣ Get storage instance → localStorage (default)
   ↓
2️⃣ Build the key → 'user'
   ↓
3️⃣ Retrieve → localStorage.getItem('user') → '{"name":"Alice"}'
   ↓
4️⃣ Deserialize → JSON.parse('{"name":"Alice"}') → { name: 'Alice' }
   ↓
5️⃣ Return the object → { name: 'Alice' }
```

### What Happens When a Key Doesn't Exist

```
StorageUtils.load('missing', 'default')
   ↓
1️⃣ Get storage instance → localStorage
   ↓
2️⃣ Build the key → 'missing'
   ↓
3️⃣ Retrieve → localStorage.getItem('missing') → null
   ↓
4️⃣ null detected → return the default value
   ↓
5️⃣ Return 'default'
```

---

## Basic Usage

### Saving and Loading Strings

```javascript
StorageUtils.save('name', 'Alice');
const name = StorageUtils.load('name');
console.log(name);  // "Alice"
```

### Saving and Loading Numbers

```javascript
StorageUtils.save('score', 99);
const score = StorageUtils.load('score');
console.log(score);       // 99
console.log(score + 1);   // 100 — math works correctly
```

### Saving and Loading Booleans

```javascript
StorageUtils.save('darkMode', true);
const darkMode = StorageUtils.load('darkMode');
console.log(darkMode);         // true
console.log(darkMode === true); // true — real boolean, not a string
```

### Saving and Loading Objects

```javascript
const settings = {
  theme: 'dark',
  fontSize: 16,
  sidebar: true
};

StorageUtils.save('settings', settings);

const loaded = StorageUtils.load('settings');
console.log(loaded.theme);     // "dark"
console.log(loaded.fontSize);  // 16
console.log(loaded.sidebar);   // true
```

### Saving and Loading Arrays

```javascript
const favorites = ['home', 'about', 'contact'];
StorageUtils.save('favorites', favorites);

const loaded = StorageUtils.load('favorites');
console.log(loaded);           // ['home', 'about', 'contact']
console.log(loaded.length);    // 3
console.log(loaded[0]);        // "home"
```

---

## Default Values

The `defaultValue` parameter in `.load()` is one of the most useful features. It lets you define a fallback for when a key doesn't exist yet:

```javascript
// First visit — no data exists yet
const theme = StorageUtils.load('theme', 'light');
console.log(theme);  // "light" — the default

// After the user changes their preference
StorageUtils.save('theme', 'dark');
const theme2 = StorageUtils.load('theme', 'light');
console.log(theme2);  // "dark" — the saved value takes priority
```

### Default Values for Different Types

```javascript
// String default
const lang = StorageUtils.load('language', 'en');

// Number default
const volume = StorageUtils.load('volume', 50);

// Boolean default
const notifications = StorageUtils.load('notifications', true);

// Object default
const prefs = StorageUtils.load('preferences', {
  theme: 'light',
  fontSize: 14,
  autoSave: true
});

// Array default
const history = StorageUtils.load('history', []);
```

### Without a Default Value

If you don't provide a default, `.load()` returns `null` when the key doesn't exist:

```javascript
const missing = StorageUtils.load('nonexistent');
console.log(missing);  // null
```

---

## Using sessionStorage

By default, `.save()` and `.load()` use `localStorage`, which persists data even after the browser is closed. To use `sessionStorage` instead (data cleared when the tab closes), pass the `storage` option:

```javascript
// Save to sessionStorage — cleared when the tab closes
StorageUtils.save('tempToken', 'abc123', { storage: 'sessionStorage' });

// Load from sessionStorage
const token = StorageUtils.load('tempToken', null, { storage: 'sessionStorage' });
console.log(token);  // "abc123"
```

### When to Use Which

| Storage Type | Data Lasts Until | Use For |
|-------------|-----------------|---------|
| `localStorage` (default) | Manually cleared or user clears browser data | User preferences, saved work, persistent settings |
| `sessionStorage` | Tab or window is closed | Temporary tokens, form drafts, one-time data |

---

## Checking Save Success

`.save()` returns `true` or `false`, so you can check whether the save succeeded:

```javascript
const success = StorageUtils.save('data', { items: largeArray });

if (success) {
  console.log('Data saved!');
} else {
  console.log('Save failed — storage might be full');
}
```

### When Can .save() Fail?

`.save()` returns `false` in these situations:

```
Save failure reasons:
├── Storage is full (browsers limit ~5-10 MB per origin)
├── Data can't be serialized (circular references)
├── Storage is not available (server-side rendering)
└── Browser storage is disabled (privacy mode in some browsers)
```

```javascript
// ❌ Circular reference — can't be serialized
const obj = {};
obj.self = obj;
StorageUtils.save('circular', obj);  // false — can't serialize

// ✅ Normal objects work fine
StorageUtils.save('normal', { name: 'Alice' });  // true
```

---

## Real-World Examples

### Example 1: User Preferences

```javascript
// Save user preferences
function savePreferences(prefs) {
  StorageUtils.save('userPrefs', prefs);
}

// Load preferences with sensible defaults
function loadPreferences() {
  return StorageUtils.load('userPrefs', {
    theme: 'light',
    fontSize: 16,
    notifications: true
  });
}

// Usage
const prefs = loadPreferences();
console.log(prefs.theme);  // "light" (default on first visit)

prefs.theme = 'dark';
savePreferences(prefs);
// Next page load: prefs.theme will be "dark"
```

### Example 2: Shopping Cart

```javascript
// Add item to cart
function addToCart(item) {
  const cart = StorageUtils.load('cart', []);
  cart.push(item);
  StorageUtils.save('cart', cart);
}

// Get the cart
function getCart() {
  return StorageUtils.load('cart', []);
}

// Usage
addToCart({ id: 1, name: 'Widget', price: 9.99 });
addToCart({ id: 2, name: 'Gadget', price: 24.99 });

const cart = getCart();
console.log(cart.length);   // 2
console.log(cart[0].name);  // "Widget"
```

### Example 3: Temporary Session Data

```javascript
// Store a temporary auth token in sessionStorage
function setAuthToken(token) {
  StorageUtils.save('authToken', token, { storage: 'sessionStorage' });
}

function getAuthToken() {
  return StorageUtils.load('authToken', null, { storage: 'sessionStorage' });
}

// Usage
setAuthToken('eyJhbGc...');
const token = getAuthToken();
console.log(token);  // "eyJhbGc..."
// Token disappears when the user closes the tab
```

### Example 4: Form Draft Auto-Recovery

```javascript
// Save a form draft as the user types
function saveDraft(formData) {
  StorageUtils.save('contactDraft', formData);
}

// Recover the draft on page load
function recoverDraft() {
  return StorageUtils.load('contactDraft', {
    name: '',
    email: '',
    message: ''
  });
}

// Usage
saveDraft({ name: 'Alice', email: 'alice@example.com', message: 'Hello...' });

// User accidentally refreshes the page
const draft = recoverDraft();
console.log(draft.name);  // "Alice" — draft recovered!
```

---

## What Data Types Can You Save?

StorageUtils handles all JSON-compatible types:

| Type | Example | Works? |
|------|---------|--------|
| String | `'hello'` | ✅ |
| Number | `42`, `3.14` | ✅ |
| Boolean | `true`, `false` | ✅ |
| null | `null` | ✅ |
| Object | `{ a: 1, b: 2 }` | ✅ |
| Array | `[1, 2, 3]` | ✅ |
| Nested objects | `{ user: { name: 'Alice' } }` | ✅ |
| Date (as string) | `new Date().toISOString()` | ✅ |
| `undefined` | `undefined` | ❌ Becomes `null` |
| Function | `() => {}` | ❌ Cannot serialize |
| DOM Element | `document.body` | ❌ Cannot serialize |
| Circular reference | `obj.self = obj` | ❌ Cannot serialize |

### Handling Dates

Dates need special attention because `JSON.stringify` converts them to strings:

```javascript
// Save a date
StorageUtils.save('lastVisit', new Date().toISOString());

// Load it back — it's a string, not a Date object
const dateStr = StorageUtils.load('lastVisit');
console.log(dateStr);  // "2026-02-14T10:30:00.000Z"

// Convert back to Date if needed
const date = new Date(dateStr);
console.log(date.getFullYear());  // 2026
```

---

## Summary

| Aspect | `.save()` | `.load()` |
|--------|----------|----------|
| **What** | Stores data in browser storage | Retrieves data from browser storage |
| **Input** | Key + any JSON-compatible data | Key + optional default value |
| **Returns** | `true` / `false` (success/failure) | The data, or default value |
| **Serialization** | Automatic (`JSON.stringify`) | Automatic (`JSON.parse`) |
| **Storage** | `localStorage` by default | `localStorage` by default |
| **Error handling** | Returns `false` on failure | Returns default value on failure |

> **Simple Rule to Remember:** `save()` puts data in, `load()` gets data out. Types are preserved automatically. Always provide a default value in `load()` so you never have to check for `null`.