[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# .watch() — Cross-Tab Storage Synchronization

## Quick Start (30 seconds)

```javascript
// Watch for changes made in OTHER browser tabs
const stopWatching = StorageUtils.watch('theme', (newValue, oldValue) => {
  console.log(`Theme changed from "${oldValue}" to "${newValue}"`);
  document.body.className = newValue;
});

// In another tab, when someone runs:
//   StorageUtils.save('theme', 'dark');
// Your callback fires automatically:
//   "Theme changed from "light" to "dark""

// Stop watching when you're done
stopWatching();
```

---

## What is .watch()?

`.watch()` lets you **react when a storage key changes in another browser tab**. Whenever a different tab saves, clears, or modifies a key in `localStorage`, your callback is called with the new and old values.

Simply put, `.watch()` is **"tell me when this data changes in another tab."**

---

## Syntax

```javascript
const stopWatching = StorageUtils.watch(key, callback, options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | String | Yes | The storage key to watch |
| `callback` | Function | Yes | Called when the key changes: `(newValue, oldValue) => {}` |
| `options` | Object | No | `{ storage, namespace, immediate }` |

**Returns:** A **cleanup function** — call it to stop watching.

### Options Object

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | String | `'localStorage'` | Which storage to watch |
| `namespace` | String | (none) | Namespace prefix for the key |
| `immediate` | Boolean | `false` | If `true`, calls the callback immediately with the current value |

---

## Why Does This Exist?

### The Problem: Tabs Don't Talk to Each Other

When a user has your app open in multiple tabs, each tab runs independently. If they change a setting in one tab, the other tabs don't know about it:

```
Tab 1: User changes theme to "dark"
   ↓
localStorage is updated
   ↓
Tab 2: Still showing "light" theme — out of sync!
Tab 3: Still showing "light" theme — out of sync!
```

### The Solution: Storage Events

Browsers fire a `storage` event when `localStorage` changes from another tab. StorageUtils wraps this into a clean API:

```
Tab 1: StorageUtils.save('theme', 'dark')
   ↓
localStorage updated → browser fires 'storage' event
   ↓
Tab 2: watch() callback fires → newValue = 'dark' → UI updates
Tab 3: watch() callback fires → newValue = 'dark' → UI updates
```

---

## How Does It Work?

```
StorageUtils.watch('theme', callback)
   ↓
1️⃣ Build the full key → 'theme' (or 'myApp:theme' with namespace)
   ↓
2️⃣ Read the current value → stores it as oldValue
   ↓
3️⃣ Register a 'storage' event listener on window
   ↓
4️⃣ When the event fires:
   ├── Is it for our key? → Yes → deserialize new value
   │   └── Call callback(newValue, oldValue)
   └── Is it for a different key? → Ignore
   ↓
5️⃣ Return a cleanup function that removes the listener
```

### Key Detail: Same-Tab Changes Are NOT Detected

The browser's `storage` event only fires for changes made in **other tabs or windows**. Changes made in the **same tab** do not trigger the event:

```
Same tab:
  StorageUtils.save('theme', 'dark') → ❌ watch() does NOT fire

Other tab:
  StorageUtils.save('theme', 'dark') → ✅ watch() fires in all OTHER tabs
```

This is a browser behavior, not a StorageUtils limitation.

---

## Basic Usage

### Watch a Key

```javascript
const stop = StorageUtils.watch('username', (newValue, oldValue) => {
  console.log('Username changed!');
  console.log('Old:', oldValue);
  console.log('New:', newValue);
});

// When another tab runs: StorageUtils.save('username', 'Bob')
// Console output:
//   Username changed!
//   Old: Alice
//   New: Bob
```

### Stop Watching

`.watch()` returns a function. Call it to stop watching:

```javascript
const stop = StorageUtils.watch('theme', (newVal) => {
  console.log('Theme is now:', newVal);
});

// Later, when you no longer need updates
stop();
// The callback will never fire again
```

### Watch with Immediate Option

Set `immediate: true` to get the current value right away, before any changes happen:

```javascript
const stop = StorageUtils.watch('theme', (value, oldValue) => {
  console.log('Theme value:', value);
}, { immediate: true });

// Immediately logs: "Theme value: dark" (the current stored value)
// Then continues watching for future changes from other tabs
```

When `immediate` is `true`, the first call has `oldValue` as `undefined` (since there was no "previous" value):

```javascript
StorageUtils.watch('score', (newVal, oldVal) => {
  if (oldVal === undefined) {
    console.log('Initial value:', newVal);
  } else {
    console.log(`Changed from ${oldVal} to ${newVal}`);
  }
}, { immediate: true });
```

---

## What the Callback Receives

The callback gets two arguments:

| Argument | Description |
|----------|-------------|
| `newValue` | The new value (already deserialized — it's the real object/string/number, not JSON) |
| `oldValue` | The previous value (also deserialized) |

```javascript
StorageUtils.watch('settings', (newVal, oldVal) => {
  // Both values are already parsed — no JSON.parse needed
  console.log(typeof newVal);  // "object" (not "string")
  console.log(newVal.theme);   // "dark"
});
```

### When a Key is Deleted

If another tab clears a key, the new value is `null`:

```javascript
StorageUtils.watch('token', (newVal, oldVal) => {
  if (newVal === null) {
    console.log('Token was removed — user logged out in another tab');
    redirectToLogin();
  }
});
```

---

## Real-World Examples

### Example 1: Sync Theme Across Tabs

```javascript
// Apply theme when it changes in another tab
const stopThemeSync = StorageUtils.watch('theme', (newTheme) => {
  document.body.className = newTheme;
  console.log('Theme synced:', newTheme);
});
```

### Example 2: Detect Logout from Another Tab

```javascript
const stopAuthWatch = StorageUtils.watch('authToken', (token) => {
  if (token === null) {
    // Token was cleared in another tab — user logged out
    alert('You were logged out in another tab');
    window.location.href = '/login';
  }
});
```

### Example 3: Live Notification Count

```javascript
// Sync unread count across tabs
StorageUtils.watch('unreadCount', (count) => {
  document.getElementById('badge').textContent = count || 0;
});

// In another tab:
// StorageUtils.save('unreadCount', 5);
// → Badge updates in all other tabs
```

### Example 4: Watch with Namespace

```javascript
const stop = StorageUtils.watch('score', (newScore) => {
  console.log('Game score updated:', newScore);
}, { namespace: 'game' });

// Only triggers when 'game:score' changes in another tab
```

---

## Cleanup Pattern

Always clean up watchers when they're no longer needed. This prevents memory leaks from stale event listeners:

```javascript
// Store the cleanup function
const stopWatching = StorageUtils.watch('data', callback);

// Clean up when appropriate:

// Option 1: On a button click
document.getElementById('stop').addEventListener('click', () => {
  stopWatching();
});

// Option 2: On page section change
function leaveSection() {
  stopWatching();
}
```

### Multiple Watchers

You can watch multiple keys — each returns its own cleanup function:

```javascript
const stopTheme = StorageUtils.watch('theme', onThemeChange);
const stopLang = StorageUtils.watch('language', onLangChange);
const stopAuth = StorageUtils.watch('authToken', onAuthChange);

// Clean up all at once
function cleanupAll() {
  stopTheme();
  stopLang();
  stopAuth();
}
```

---

## Important Notes

### Only Cross-Tab Changes

The `storage` event only fires for changes from **other** tabs. This is a browser limitation, not a StorageUtils issue:

```javascript
// Tab A
StorageUtils.watch('key', (val) => console.log('Changed:', val));

// Also in Tab A:
StorageUtils.save('key', 'hello');
// ❌ The watch callback does NOT fire (same tab)

// In Tab B:
StorageUtils.save('key', 'hello');
// ✅ The watch callback in Tab A DOES fire
```

### Only Works with localStorage

The browser's `storage` event only fires for `localStorage`, not `sessionStorage`. This is because `sessionStorage` is tab-specific and isn't shared between tabs:

```javascript
// ✅ Works — localStorage is shared across tabs
StorageUtils.watch('theme', callback);

// ⚠️ Won't detect changes from other tabs
StorageUtils.watch('theme', callback, { storage: 'sessionStorage' });
```

### Errors in Callbacks

If your callback throws an error, StorageUtils catches it and logs it to the console. The watcher keeps running:

```javascript
StorageUtils.watch('key', (val) => {
  throw new Error('Oops');
  // Error is caught and logged — watcher continues
});
```

---

## Mental Model: A Mailbox Notification

Think of `.watch()` like a mailbox notification system:

```
Your mailbox (localStorage):
  ┌───────────────┐
  │ theme: "dark"  │ ← stored data
  └───────────────┘

Tab 1 says: "Notify me if someone changes the 'theme' mail"
  └── StorageUtils.watch('theme', callback)

Tab 2 puts new mail in the box:
  └── StorageUtils.save('theme', 'light')

Mailbox notifies Tab 1: "Hey, theme changed from dark to light!"
  └── callback('light', 'dark') fires in Tab 1
```

You set up a notification, someone else changes the mail, and you get notified. If **you** change the mail yourself, you don't get notified (you already know!).

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | Watches a storage key for changes from other tabs |
| **Triggers on** | Changes made in **other** tabs/windows (not the same tab) |
| **Returns** | A cleanup function to stop watching |
| **Callback receives** | `(newValue, oldValue)` — both already deserialized |
| **immediate option** | If `true`, calls the callback immediately with the current value |
| **Cleanup** | Always call the returned function when you're done watching |
| **Storage type** | Works best with `localStorage` (cross-tab). `sessionStorage` events don't cross tabs |

> **Simple Rule to Remember:** `.watch()` tells you when data changes in another tab. Always save the cleanup function and call it when you're done. Remember — it only detects changes from **other** tabs, not the current one.