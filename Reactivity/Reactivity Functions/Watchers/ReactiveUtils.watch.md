# Understanding `watch()` - A Beginner's Guide

## What is `watch()`?

`watch()` is a **standalone utility function** in the Reactive library that adds watchers to specific properties of a reactive state object. Unlike the `$watch()` method which is available on state objects, this is a global function that can add multiple watchers at once to any reactive state.

Think of it as **a multi-property observer** - you pass it a state object and define which properties to watch, and it sets up callbacks that run whenever those properties change.

---

## Syntax

```js
// Using the shortcut
const cleanup = watch(state, definitions)

// Using the full namespace
const cleanup = ReactiveUtils.watch(state, definitions)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`watch()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.watch()`) - Explicit and clear

**Parameters:**
- `state` (Object): A reactive state object to watch properties on
- `definitions` (Object): An object where keys are property names and values are callback functions

**Returns:**
- A cleanup function that stops all the watchers when called

---

## Why Does This Exist?

### The Problem with Manual Watchers

When you need to watch multiple properties, you need to call `$watch()` multiple times and manage cleanups:

```javascript
// Manual approach - repetitive and cleanup management needed
const form = state({
  username: '',
  email: '',
  password: ''
});

const cleanup1 = form.$watch('username', (newValue, oldValue) => {
  console.log(`Username changed from ${oldValue} to ${newValue}`);
});

const cleanup2 = form.$watch('email', (newValue, oldValue) => {
  console.log(`Email changed from ${oldValue} to ${newValue}`);
});

const cleanup3 = form.$watch('password', (newValue, oldValue) => {
  console.log(`Password changed from ${oldValue} to ${newValue}`);
});

// Must track all cleanup functions
const cleanupAll = () => {
  cleanup1();
  cleanup2();
  cleanup3();
};

// Repetitive and hard to manage
```

**What's the Real Issue?**

**Problems:**
- Must call `$watch()` separately for each property
- Must track multiple cleanup functions manually
- Repetitive code structure
- Hard to see all watchers at once
- More verbose than necessary
- Cleanup management is error-prone

**Why This Becomes a Problem:**

For multiple watchers:
❌ Too many separate method calls
❌ Manual cleanup tracking
❌ No clear grouping
❌ Easy to forget cleanups
❌ More code to maintain

In other words, **watching multiple properties is too verbose and cleanup is messy**.
There should be a way to define all watchers at once with unified cleanup.

---

### The Solution with `watch()`

When you use `watch()`, you define all watchers in one call with automatic cleanup:

```javascript
// Clean approach - all in one place with single cleanup
const form = state({
  username: '',
  email: '',
  password: ''
});

const cleanup = watch(form, {
  username(newValue, oldValue) {
    console.log(`Username changed from ${oldValue} to ${newValue}`);
  },
  email(newValue, oldValue) {
    console.log(`Email changed from ${oldValue} to ${newValue}`);
  },
  password(newValue, oldValue) {
    console.log(`Password changed from ${oldValue} to ${newValue}`);
  }
});

// Single cleanup function
// cleanup();

// Clean, organized, and easy to manage!
```

**What Just Happened?**

With `watch()`:
- All watchers defined in one object
- Clear and organized structure
- Single cleanup function returned
- Easy to see all watches at once
- Less code, more readable

**Benefits:**
- Single function call
- Organized definition
- Unified cleanup
- Better readability
- Easier maintenance

---

## How Does It Work?

### Under the Hood

`watch()` sets up watchers for each property and returns a cleanup function:

```
watch(state, definitions)
        ↓
For each key-value pair in definitions:
  1. Set up watcher for that property
  2. Store cleanup function
        ↓
Return single cleanup function that stops all watchers
```

**What happens:**

1. Takes a reactive state object
2. Iterates over the definitions object
3. For each property, calls the internal `addWatch` function
4. Collects all cleanup functions
5. Returns a single function that calls all cleanups
6. Watchers run whenever their properties change

---

## Basic Usage

### Watching Properties

The simplest way to use `watch()`:

```js
// Using the shortcut style
const user = state({
  name: 'John',
  age: 25
});

const cleanup = watch(user, {
  name(newValue, oldValue) {
    console.log(`Name changed from "${oldValue}" to "${newValue}"`);
  },
  age(newValue, oldValue) {
    console.log(`Age changed from ${oldValue} to ${newValue}`);
  }
});

// Or using the namespace style
const cleanup = ReactiveUtils.watch(user, {
  name(newValue, oldValue) {
    console.log(`Name changed from "${oldValue}" to "${newValue}"`);
  }
});

user.name = 'Jane'; // Logs: Name changed from "John" to "Jane"
user.age = 26;      // Logs: Age changed from 25 to 26

// Stop watching
cleanup();
```

### Validation on Change

Validate fields as they change:

```js
const form = state({
  email: '',
  password: '',
  errors: {}
});

watch(form, {
  email(newEmail) {
    if (!newEmail.includes('@')) {
      form.errors.email = 'Invalid email';
    } else {
      delete form.errors.email;
    }
  },

  password(newPassword) {
    if (newPassword.length < 8) {
      form.errors.password = 'Password must be at least 8 characters';
    } else {
      delete form.errors.password;
    }
  }
});
```

### Sync with LocalStorage

Save to localStorage when properties change:

```js
const settings = state({
  theme: 'light',
  language: 'en',
  notifications: true
});

watch(settings, {
  theme(newTheme) {
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  },

  language(newLang) {
    localStorage.setItem('language', newLang);
    // Load language pack
  },

  notifications(enabled) {
    localStorage.setItem('notifications', enabled);
  }
});
```

### Logging Changes

Track changes for debugging:

```js
const data = state({
  count: 0,
  items: [],
  status: 'idle'
});

watch(data, {
  count(newVal, oldVal) {
    console.log('[DEBUG] count:', oldVal, '→', newVal);
  },

  items(newItems, oldItems) {
    console.log('[DEBUG] items changed, length:', oldItems.length, '→', newItems.length);
  },

  status(newStatus, oldStatus) {
    console.log('[DEBUG] status:', oldStatus, '→', newStatus);
  }
});
```

---


## Summary

**`watch()` adds multiple property watchers to state in one call.**

Key takeaways:
- ✅ **Standalone utility** for watching multiple properties
- ✅ Both **shortcut** (`watch()`) and **namespace** (`ReactiveUtils.watch()`) styles are valid
- ✅ Takes a **state object** and **definitions object**
- ✅ Defines **multiple watchers** at once
- ✅ Returns **single cleanup function** for all watchers
- ✅ Callbacks receive **newValue** and **oldValue**
- ✅ Great for **validation**, **persistence**, **analytics**
- ⚠️ Use **regular functions**, not arrow functions
- ⚠️ Avoid **infinite loops** (don't modify watched property)
- ⚠️ Always **clean up** watchers when done

**Remember:** `watch()` is perfect for responding to state changes with side effects like validation, logging, or persistence. Define all your watchers in one place for easy management! 🎉

