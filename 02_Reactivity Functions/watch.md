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

## Common Use Cases

### Use Case 1: Form Field Validation

Validate form fields as users type:

```js
const registrationForm = state({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  errors: {},
  touched: {}
});

watch(registrationForm, {
  username(value) {
    if (!this.touched.username) return;

    if (!value) {
      this.errors.username = 'Username is required';
    } else if (value.length < 3) {
      this.errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      this.errors.username = 'Username can only contain letters, numbers, and underscores';
    } else {
      delete this.errors.username;
    }
  },

  email(value) {
    if (!this.touched.email) return;

    if (!value) {
      this.errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.errors.email = 'Invalid email address';
    } else {
      delete this.errors.email;
    }
  },

  password(value) {
    if (!this.touched.password) return;

    if (!value) {
      this.errors.password = 'Password is required';
    } else if (value.length < 8) {
      this.errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(value)) {
      this.errors.password = 'Must contain uppercase letter';
    } else if (!/[0-9]/.test(value)) {
      this.errors.password = 'Must contain a number';
    } else {
      delete this.errors.password;
    }

    // Re-validate confirmPassword if it has a value
    if (this.confirmPassword && this.touched.confirmPassword) {
      this.$notify('confirmPassword');
    }
  },

  confirmPassword(value) {
    if (!this.touched.confirmPassword) return;

    if (!value) {
      this.errors.confirmPassword = 'Please confirm your password';
    } else if (value !== this.password) {
      this.errors.confirmPassword = 'Passwords do not match';
    } else {
      delete this.errors.confirmPassword;
    }
  }
});
```

### Use Case 2: Analytics Tracking

Track user interactions:

```js
const app = state({
  currentPage: 'home',
  searchQuery: '',
  filterSettings: {},
  cartItemCount: 0
});

watch(app, {
  currentPage(newPage, oldPage) {
    // Track page view
    analytics.track('page_view', {
      page: newPage,
      previous_page: oldPage,
      timestamp: new Date()
    });
  },

  searchQuery(query) {
    if (query) {
      // Track search
      analytics.track('search', {
        query: query,
        timestamp: new Date()
      });
    }
  },

  filterSettings(newFilters) {
    // Track filter usage
    analytics.track('filter_applied', {
      filters: newFilters,
      timestamp: new Date()
    });
  },

  cartItemCount(newCount, oldCount) {
    if (newCount > oldCount) {
      analytics.track('item_added_to_cart', {
        count: newCount
      });
    } else if (newCount < oldCount) {
      analytics.track('item_removed_from_cart', {
        count: newCount
      });
    }
  }
});
```

### Use Case 3: Auto-Save Draft

Save drafts automatically when content changes:

```js
const editor = state({
  title: '',
  content: '',
  lastSaved: null
});

let saveTimeout;

watch(editor, {
  title() {
    // Debounce auto-save
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveDraft();
    }, 2000);
  },

  content() {
    // Debounce auto-save
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveDraft();
    }, 2000);
  }
});

async function saveDraft() {
  try {
    const response = await fetch('/api/save-draft', {
      method: 'POST',
      body: JSON.stringify({
        title: editor.title,
        content: editor.content
      })
    });

    if (response.ok) {
      editor.lastSaved = new Date();
      console.log('Draft saved at', editor.lastSaved);
    }
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
}
```

### Use Case 4: Dependent Field Updates

Update related fields automatically:

```js
const order = state({
  quantity: 1,
  unitPrice: 10.00,
  subtotal: 10.00,
  taxRate: 0.1,
  tax: 1.00,
  shipping: 5.00,
  total: 16.00,
  discountCode: '',
  discount: 0
});

watch(order, {
  quantity(newQty) {
    this.subtotal = newQty * this.unitPrice;
  },

  unitPrice(newPrice) {
    this.subtotal = this.quantity * newPrice;
  },

  subtotal(newSubtotal) {
    const afterDiscount = newSubtotal * (1 - this.discount);
    this.tax = afterDiscount * this.taxRate;
    this.total = afterDiscount + this.tax + this.shipping;
  },

  discountCode(code) {
    const discounts = {
      'SAVE10': 0.10,
      'SAVE20': 0.20,
      'SAVE50': 0.50
    };

    this.discount = discounts[code] || 0;
    // Re-calculate subtotal to trigger cascade
    this.$notify('subtotal');
  },

  shipping(newShipping) {
    this.total = this.subtotal * (1 - this.discount) + this.tax + newShipping;
  }
});
```

### Use Case 5: State Synchronization

Sync state across tabs using localStorage:

```js
const app = state({
  user: null,
  theme: 'light',
  sidebarOpen: true
});

// Watch and sync to localStorage
watch(app, {
  user(newUser) {
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      // Broadcast to other tabs
      broadcastChange('user', newUser);
    } else {
      localStorage.removeItem('user');
      broadcastChange('user', null);
    }
  },

  theme(newTheme) {
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
    broadcastChange('theme', newTheme);
  },

  sidebarOpen(isOpen) {
    localStorage.setItem('sidebarOpen', isOpen);
    broadcastChange('sidebarOpen', isOpen);
  }
});

// Listen for changes from other tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'user') {
    app.user = e.newValue ? JSON.parse(e.newValue) : null;
  } else if (e.key === 'theme') {
    app.theme = e.newValue;
  } else if (e.key === 'sidebarOpen') {
    app.sidebarOpen = e.newValue === 'true';
  }
});

function broadcastChange(key, value) {
  // Trigger storage event in other tabs
  window.dispatchEvent(new StorageEvent('storage', {
    key: key,
    newValue: typeof value === 'object' ? JSON.stringify(value) : String(value)
  }));
}
```

---

## Advanced Patterns

### Pattern 1: Async Validation

Validate against server:

```js
const form = state({
  username: '',
  email: '',
  errors: {}
});

let usernameTimeout;
let emailTimeout;

watch(form, {
  async username(value) {
    clearTimeout(usernameTimeout);

    if (value.length < 3) {
      this.errors.username = 'Username must be at least 3 characters';
      return;
    }

    usernameTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/check-username?username=${value}`);
        const data = await response.json();

        if (data.exists) {
          this.errors.username = 'Username already taken';
        } else {
          delete this.errors.username;
        }
      } catch (error) {
        console.error('Validation failed:', error);
      }
    }, 500);
  },

  async email(value) {
    clearTimeout(emailTimeout);

    if (!value.includes('@')) {
      this.errors.email = 'Invalid email';
      return;
    }

    emailTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/check-email?email=${value}`);
        const data = await response.json();

        if (data.exists) {
          this.errors.email = 'Email already registered';
        } else {
          delete this.errors.email;
        }
      } catch (error) {
        console.error('Validation failed:', error);
      }
    }, 500);
  }
});
```

### Pattern 2: Conditional Watchers

Set up watchers based on conditions:

```js
function setupWatchers(state, options = {}) {
  const watcherDefs = {};

  if (options.logging) {
    watcherDefs.count = function(newVal, oldVal) {
      console.log(`Count: ${oldVal} → ${newVal}`);
    };
  }

  if (options.persistence) {
    watcherDefs.data = function(newData) {
      localStorage.setItem('data', JSON.stringify(newData));
    };
  }

  if (options.analytics) {
    watcherDefs.currentPage = function(newPage) {
      analytics.track('page_view', { page: newPage });
    };
  }

  return watch(state, watcherDefs);
}

const app = state({ count: 0, data: {}, currentPage: 'home' });

const cleanup = setupWatchers(app, {
  logging: true,
  persistence: true,
  analytics: false
});
```

### Pattern 3: Watcher Cleanup Management

Manage multiple watcher sets:

```js
const watchers = {
  form: null,
  analytics: null,
  persistence: null
};

function enableFormWatchers() {
  if (watchers.form) return;

  watchers.form = watch(form, {
    email: validateEmail,
    password: validatePassword
  });
}

function disableFormWatchers() {
  if (watchers.form) {
    watchers.form();
    watchers.form = null;
  }
}

function enableAnalytics() {
  if (watchers.analytics) return;

  watchers.analytics = watch(app, {
    currentPage: trackPageView,
    searchQuery: trackSearch
  });
}

function disableAnalytics() {
  if (watchers.analytics) {
    watchers.analytics();
    watchers.analytics = null;
  }
}

// Clean up all
function cleanupAll() {
  Object.values(watchers).forEach(cleanup => {
    if (cleanup) cleanup();
  });
}
```

### Pattern 4: Throttled/Debounced Watchers

Control how often watchers run:

```js
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let waiting = false;
  return function(...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;
      setTimeout(() => { waiting = false; }, limit);
    }
  };
}

const search = state({
  query: '',
  filters: {},
  scrollPosition: 0
});

watch(search, {
  // Debounce search - wait for user to stop typing
  query: debounce(function(newQuery) {
    performSearch(newQuery);
  }, 300),

  // Debounce filter changes
  filters: debounce(function(newFilters) {
    applyFilters(newFilters);
  }, 500),

  // Throttle scroll - don't fire too often
  scrollPosition: throttle(function(newPos) {
    saveScrollPosition(newPos);
  }, 100)
});
```

---

## Performance Tips

### Tip 1: Avoid Heavy Operations in Watchers

Keep watchers lightweight:

```js
// BAD - expensive operation
watch(state, {
  items(newItems) {
    // Expensive sort on every change
    const sorted = [...newItems].sort((a, b) => b.value - a.value);
    updateUI(sorted);
  }
});

// GOOD - use computed for expensive operations
state.$computed('sortedItems', function() {
  return [...this.items].sort((a, b) => b.value - a.value);
});

watch(state, {
  sortedItems(sorted) {
    updateUI(sorted); // Uses cached computed value
  }
});
```

### Tip 2: Debounce Rapid Changes

Prevent excessive calls:

```js
let timeout;

watch(editor, {
  content(newContent) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      saveDraft(newContent);
    }, 1000);
  }
});
```

### Tip 3: Clean Up When No Longer Needed

Stop watchers when component unmounts:

```js
let cleanup;

function mountComponent() {
  cleanup = watch(state, {
    data: handleDataChange
  });
}

function unmountComponent() {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
}
```

---

## Common Pitfalls

### Pitfall 1: Infinite Loops

**Problem:** Watcher modifies the property it's watching:

```js
// WRONG - infinite loop!
watch(state, {
  count(newVal) {
    this.count++; // Modifies count, triggers watcher again!
  }
});

// RIGHT - modify different property or use condition
watch(state, {
  count(newVal) {
    this.doubled = newVal * 2; // OK - different property
  }
});
```

### Pitfall 2: Not Cleaning Up

**Problem:** Watchers keep running after component removed:

```js
// BAD - no cleanup
function createComponent() {
  watch(state, {
    data: handleChange
  });
}

// GOOD - cleanup
function createComponent() {
  const cleanup = watch(state, {
    data: handleChange
  });

  return {
    destroy: cleanup
  };
}
```

### Pitfall 3: Using Arrow Functions

**Problem:** Arrow functions don't bind `this` correctly:

```js
// WRONG - arrow function
watch(state, {
  count: (newVal) => {
    this.doubled = newVal * 2; // 'this' is wrong!
  }
});

// RIGHT - regular function
watch(state, {
  count(newVal) {
    this.doubled = newVal * 2; // 'this' works correctly
  }
});
```

### Pitfall 4: Forgetting the Cleanup Return Value

**Problem:** Not storing the cleanup function:

```js
// BAD - cleanup not stored
watch(state, {
  data: handleChange
});
// Can't clean up later!

// GOOD - store cleanup
const cleanup = watch(state, {
  data: handleChange
});
// Call cleanup() when done
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

➡️ Next, explore [`computed()`](computed.md) for derived values or [`effects()`](effects.md) for multiple effects!
