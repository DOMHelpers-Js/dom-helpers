# Understanding `$watch()` - A Beginner's Guide

## What is `$watch()`?

`$watch()` is an **instance method on reactive state objects** that watches a specific property and runs a callback whenever that property changes. It's a convenient way to react to changes without using the standalone `ReactiveUtils.watch()` function.

Think of it as **setting an alarm on your data**:
1. Call `$watch()` on your reactive state
2. Tell it which property to watch
3. Provide a callback function
4. The callback runs whenever that property changes
5. Get both new and old values!

It's like having a personal detective watching one specific thing and reporting back to you!

---

## Why Does This Exist?

### The Old Way (Without `$watch()`)

You had to use the standalone `watch()` function:

```javascript
const state = ReactiveUtils.state({
  count: 0,
  name: 'John'
});

// Separate function call
ReactiveUtils.watch(state, {
  count(newValue, oldValue) {
    console.log(`Count changed from ${oldValue} to ${newValue}`);
  }
});

state.count = 5;  // Logs: "Count changed from 0 to 5"
```

**Problems:**
- Separate function call
- Less intuitive for watching single properties
- Can't easily watch on the fly
- Less fluent API

### The New Way (With `$watch()`)

With `$watch()`, it's attached directly to the state:

```javascript
const state = ReactiveUtils.state({
  count: 0,
  name: 'John'
});

// Watch directly on state
state.$watch('count', (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

state.count = 5;  // Logs: "Count changed from 0 to 5"

// Watch multiple properties easily
state.$watch('name', (newValue, oldValue) => {
  console.log(`Name changed from ${oldValue} to ${newValue}`);
});

state.name = 'Jane';  // Logs: "Name changed from John to Jane"
```

**Benefits:**
- Method directly on state object
- Watch properties one at a time
- Can add watchers dynamically
- Returns cleanup function
- More intuitive and fluent

---

## How Does It Work?

`$watch()` is a method available on all reactive state objects:

```javascript
const state = ReactiveUtils.state({ count: 0 });

// state.$watch is available
const stopWatching = state.$watch('count', (newVal, oldVal) => {
  console.log('Changed!', newVal, oldVal);
});

// Internally:
// 1. Creates an effect that tracks the property
// 2. Stores current value as "old value"
// 3. When property changes, calls callback with new and old values
// 4. Returns cleanup function to stop watching

// Stop watching
stopWatching();
```

**Key concept:** It's the same as `ReactiveUtils.watch()` but as a method on the state object!

---

## Syntax

### Basic Syntax

```javascript
const cleanup = state.$watch(property, callback)
```

**Parameters:**
- `property` (string) - Name of the property to watch
- `callback` (function) - Function called when property changes
  - Receives `(newValue, oldValue)` as parameters

**Returns:** Cleanup function to stop watching

---

## Simple Examples Explained

### Example 1: Basic Watching

```javascript
const counter = ReactiveUtils.state({ count: 0 });

// Watch the count property
counter.$watch('count', (newValue, oldValue) => {
  console.log(`Count: ${oldValue} → ${newValue}`);
});

counter.count = 5;   // Logs: "Count: 0 → 5"
counter.count = 10;  // Logs: "Count: 5 → 10"
counter.count = 10;  // Logs: "Count: 10 → 10" (runs even if same value)
```

---

### Example 2: Multiple Watchers

```javascript
const user = ReactiveUtils.state({
  name: 'John',
  email: 'john@example.com',
  age: 30
});

// Watch different properties
user.$watch('name', (newName, oldName) => {
  console.log(`Name changed: ${oldName} → ${newName}`);
});

user.$watch('email', (newEmail, oldEmail) => {
  console.log(`Email changed: ${oldEmail} → ${newEmail}`);
});

user.$watch('age', (newAge, oldAge) => {
  console.log(`Age changed: ${oldAge} → ${newAge}`);
  
  if (newAge >= 18 && oldAge < 18) {
    console.log('User is now an adult!');
  }
});

// Trigger watchers
user.name = 'Jane';           // Logs name change
user.email = 'jane@example.com'; // Logs email change
user.age = 31;                // Logs age change
```

---

### Example 3: Saving to localStorage

```javascript
const settings = ReactiveUtils.state({
  theme: 'light',
  fontSize: 16,
  notifications: true
});

// Auto-save each setting when it changes
settings.$watch('theme', (newTheme) => {
  localStorage.setItem('theme', newTheme);
  console.log('✅ Theme saved:', newTheme);
});

settings.$watch('fontSize', (newSize) => {
  localStorage.setItem('fontSize', newSize);
  console.log('✅ Font size saved:', newSize);
});

settings.$watch('notifications', (enabled) => {
  localStorage.setItem('notifications', enabled);
  console.log('✅ Notifications preference saved:', enabled);
});

// Changes auto-save
settings.theme = 'dark';          // Saves to localStorage
settings.fontSize = 18;           // Saves to localStorage
settings.notifications = false;   // Saves to localStorage
```

---

### Example 4: Stopping a Watcher

```javascript
const state = ReactiveUtils.state({ count: 0 });

// Start watching
const stopWatching = state.$watch('count', (newVal) => {
  console.log('Count changed to:', newVal);
});

state.count = 5;   // Logs: "Count changed to: 5"
state.count = 10;  // Logs: "Count changed to: 10"

// Stop watching
stopWatching();

state.count = 15;  // No log (watcher stopped)
state.count = 20;  // No log (watcher stopped)
```

---

### Example 5: Conditional Logic Based on Changes

```javascript
const inventory = ReactiveUtils.state({
  stock: 100,
  lowStockThreshold: 20,
  criticalStockThreshold: 10
});

inventory.$watch('stock', (newStock, oldStock) => {
  console.log(`Stock: ${oldStock} → ${newStock}`);
  
  // Alert when crossing thresholds
  if (newStock <= inventory.criticalStockThreshold && 
      oldStock > inventory.criticalStockThreshold) {
    console.log('🚨 CRITICAL: Stock critically low!');
    sendCriticalAlert();
  } else if (newStock <= inventory.lowStockThreshold && 
             oldStock > inventory.lowStockThreshold) {
    console.log('⚠️ WARNING: Stock running low!');
    sendLowStockAlert();
  } else if (newStock === 0 && oldStock > 0) {
    console.log('❌ OUT OF STOCK!');
    sendOutOfStockAlert();
  } else if (newStock > oldStock) {
    console.log('✅ Stock replenished');
  }
});

function sendLowStockAlert() {
  console.log('→ Sending low stock alert email...');
}

function sendCriticalAlert() {
  console.log('→ Sending critical stock alert SMS...');
}

function sendOutOfStockAlert() {
  console.log('→ Sending out of stock alert to all channels...');
}

// Simulate stock changes
inventory.stock = 19;  // WARNING
inventory.stock = 9;   // CRITICAL
inventory.stock = 0;   // OUT OF STOCK
inventory.stock = 50;  // Replenished
```

---

## Real-World Example: Form Validation System

```javascript
const form = ReactiveUtils.state({
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  agreedToTerms: false,
  errors: {
    email: null,
    password: null,
    confirmPassword: null,
    username: null
  }
});

// Watch email and validate
form.$watch('email', (newEmail) => {
  if (!newEmail) {
    form.errors.email = null;  // Empty is okay (not submitted yet)
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    form.errors.email = 'Invalid email format';
  } else {
    form.errors.email = null;
  }
});

// Watch password and validate
form.$watch('password', (newPassword) => {
  if (!newPassword) {
    form.errors.password = null;
  } else if (newPassword.length < 8) {
    form.errors.password = 'Password must be at least 8 characters';
  } else if (!/[A-Z]/.test(newPassword)) {
    form.errors.password = 'Password must contain an uppercase letter';
  } else if (!/[0-9]/.test(newPassword)) {
    form.errors.password = 'Password must contain a number';
  } else {
    form.errors.password = null;
  }
  
  // Revalidate confirm password when password changes
  if (form.confirmPassword) {
    validateConfirmPassword();
  }
});

// Watch confirmPassword
form.$watch('confirmPassword', validateConfirmPassword);

function validateConfirmPassword() {
  if (!form.confirmPassword) {
    form.errors.confirmPassword = null;
  } else if (form.password !== form.confirmPassword) {
    form.errors.confirmPassword = 'Passwords do not match';
  } else {
    form.errors.confirmPassword = null;
  }
}

// Watch username
form.$watch('username', async (newUsername) => {
  if (!newUsername) {
    form.errors.username = null;
  } else if (newUsername.length < 3) {
    form.errors.username = 'Username must be at least 3 characters';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    form.errors.username = 'Username can only contain letters, numbers, and underscores';
  } else {
    // Check if username is taken (simulated)
    form.errors.username = 'Checking availability...';
    
    setTimeout(() => {
      const taken = ['admin', 'user', 'test'].includes(newUsername.toLowerCase());
      form.errors.username = taken ? 'Username is already taken' : null;
    }, 500);
  }
});

// Display errors in real-time
ReactiveUtils.effect(() => {
  Object.entries(form.errors).forEach(([field, error]) => {
    const errorEl = document.getElementById(`${field}-error`);
    if (errorEl) {
      errorEl.textContent = error || '';
      errorEl.style.display = error ? 'block' : 'none';
    }
  });
});

// Test the validation
console.log('=== Form Validation Test ===\n');

form.email = 'invalid-email';
console.log('Email error:', form.errors.email);

form.email = 'user@example.com';
console.log('Email error:', form.errors.email);

form.password = 'short';
console.log('Password error:', form.errors.password);

form.password = 'NoNumber';
console.log('Password error:', form.errors.password);

form.password = 'ValidPass123';
console.log('Password error:', form.errors.password);

form.confirmPassword = 'WrongPass123';
console.log('Confirm error:', form.errors.confirmPassword);

form.confirmPassword = 'ValidPass123';
console.log('Confirm error:', form.errors.confirmPassword);

form.username = 'ab';
console.log('Username error:', form.errors.username);

form.username = 'admin';
setTimeout(() => {
  console.log('Username error:', form.errors.username);
}, 600);
```

---

## Real-World Example: Analytics Tracker

```javascript
const analytics = ReactiveUtils.state({
  page: 'home',
  user: null,
  searchQuery: '',
  filters: {},
  cart: {
    items: [],
    total: 0
  }
});

// Track page views
analytics.$watch('page', (newPage, oldPage) => {
  console.log(`[Analytics] Page View: ${oldPage} → ${newPage}`);
  
  // Send to analytics service
  sendToAnalytics({
    event: 'page_view',
    page: newPage,
    previousPage: oldPage,
    timestamp: new Date().toISOString()
  });
});

// Track user authentication
analytics.$watch('user', (newUser, oldUser) => {
  if (newUser && !oldUser) {
    console.log('[Analytics] User logged in:', newUser.id);
    sendToAnalytics({
      event: 'login',
      userId: newUser.id,
      timestamp: new Date().toISOString()
    });
  } else if (!newUser && oldUser) {
    console.log('[Analytics] User logged out:', oldUser.id);
    sendToAnalytics({
      event: 'logout',
      userId: oldUser.id,
      timestamp: new Date().toISOString()
    });
  }
});

// Track searches
analytics.$watch('searchQuery', (newQuery, oldQuery) => {
  if (newQuery && newQuery.length >= 3) {
    console.log('[Analytics] Search:', newQuery);
    sendToAnalytics({
      event: 'search',
      query: newQuery,
      timestamp: new Date().toISOString()
    });
  }
});

// Track cart changes
analytics.$watch('cart', (newCart, oldCart) => {
  const itemsAdded = newCart.items.length - oldCart.items.length;
  
  if (itemsAdded > 0) {
    console.log('[Analytics] Items added to cart:', itemsAdded);
    sendToAnalytics({
      event: 'add_to_cart',
      itemCount: itemsAdded,
      cartTotal: newCart.total,
      timestamp: new Date().toISOString()
    });
  } else if (itemsAdded < 0) {
    console.log('[Analytics] Items removed from cart:', Math.abs(itemsAdded));
    sendToAnalytics({
      event: 'remove_from_cart',
      itemCount: Math.abs(itemsAdded),
      cartTotal: newCart.total,
      timestamp: new Date().toISOString()
    });
  }
});

function sendToAnalytics(data) {
  console.log('→ Sending to analytics:', JSON.stringify(data));
  // In real app: fetch('/analytics', { method: 'POST', body: JSON.stringify(data) });
}

// Simulate user activity
console.log('\n=== Simulating User Activity ===\n');

analytics.page = 'products';
analytics.user = { id: '123', name: 'John Doe' };
analytics.searchQuery = 'laptop';
analytics.cart = { items: [{ id: 1 }], total: 999 };
analytics.cart = { items: [{ id: 1 }, { id: 2 }], total: 1499 };
analytics.page = 'checkout';
```

---

## Real-World Example: Auto-Save System

```javascript
class AutoSaveManager {
  constructor(documentState) {
    this.state = documentState;
    this.saveTimeout = null;
    this.saveDelay = 2000; // 2 seconds debounce
    this.watchedProperties = [];
    
    this.setupWatchers();
  }
  
  setupWatchers() {
    // Watch content changes
    const contentCleanup = this.state.$watch('content', (newContent, oldContent) => {
      if (newContent !== oldContent) {
        console.log('Content changed, scheduling save...');
        this.scheduleSave('content');
      }
    });
    
    // Watch title changes
    const titleCleanup = this.state.$watch('title', (newTitle, oldTitle) => {
      if (newTitle !== oldTitle) {
        console.log('Title changed, scheduling save...');
        this.scheduleSave('title');
      }
    });
    
    // Watch tags changes
    const tagsCleanup = this.state.$watch('tags', (newTags, oldTags) => {
      console.log('Tags changed, scheduling save...');
      this.scheduleSave('tags');
    });
    
    // Store cleanup functions
    this.watchedProperties = [contentCleanup, titleCleanup, tagsCleanup];
  }
  
  scheduleSave(changedField) {
    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    // Update UI
    this.state.saveStatus = 'pending';
    this.state.lastModified = new Date();
    
    // Schedule save after delay (debounce)
    this.saveTimeout = setTimeout(() => {
      this.performSave(changedField);
    }, this.saveDelay);
  }
  
  async performSave(changedField) {
    console.log(`\n💾 Saving document (${changedField} changed)...`);
    this.state.saveStatus = 'saving';
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Save to localStorage (in real app: send to server)
      localStorage.setItem('document', JSON.stringify({
        title: this.state.title,
        content: this.state.content,
        tags: this.state.tags,
        lastModified: this.state.lastModified
      }));
      
      this.state.saveStatus = 'saved';
      this.state.lastSaved = new Date();
      console.log('✅ Document saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        if (this.state.saveStatus === 'saved') {
          this.state.saveStatus = 'idle';
        }
      }, 3000);
      
    } catch (error) {
      console.error('❌ Save failed:', error);
      this.state.saveStatus = 'error';
      this.state.saveError = error.message;
    }
  }
  
  destroy() {
    // Clear timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    // Stop all watchers
    this.watchedProperties.forEach(cleanup => cleanup());
    console.log('Auto-save manager destroyed');
  }
}

// Create document state
const document = ReactiveUtils.state({
  title: 'Untitled Document',
  content: '',
  tags: [],
  saveStatus: 'idle',  // 'idle', 'pending', 'saving', 'saved', 'error'
  lastModified: null,
  lastSaved: null,
  saveError: null
});

// Initialize auto-save
const autoSave = new AutoSaveManager(document);

// Display save status
ReactiveUtils.effect(() => {
  const statusMessages = {
    idle: '',
    pending: '⏳ Changes pending...',
    saving: '💾 Saving...',
    saved: '✅ All changes saved',
    error: '❌ Save failed: ' + document.saveError
  };
  
  console.log('Status:', statusMessages[document.saveStatus]);
});

// Simulate user typing
console.log('\n=== Simulating Document Editing ===\n');

document.title = 'My New Document';

setTimeout(() => {
  document.content = 'First paragraph';
}, 500);

setTimeout(() => {
  document.content = 'First paragraph\n\nSecond paragraph';
}, 1000);

setTimeout(() => {
  document.tags = ['javascript', 'tutorial'];
}, 1500);

setTimeout(() => {
  document.content = 'First paragraph\n\nSecond paragraph\n\nThird paragraph';
}, 2000);

// Cleanup after 10 seconds
setTimeout(() => {
  autoSave.destroy();
}, 10000);
```

---

## Common Beginner Questions

### Q: What's the difference between `$watch()` and `ReactiveUtils.watch()`?

**Answer:** They do the same thing, just different syntax:

```javascript
const state = ReactiveUtils.state({ count: 0 });

// Method 1: $watch (on state object)
state.$watch('count', (newVal, oldVal) => {
  console.log('Changed:', newVal);
});

// Method 2: ReactiveUtils.watch (standalone function)
ReactiveUtils.watch(state, {
  count(newVal, oldVal) {
    console.log('Changed:', newVal);
  }
});

// Both work identically!
```

**Use `$watch()`** for single properties
**Use `ReactiveUtils.watch()`** for multiple properties at once

---

### Q: Does the watcher run immediately?

**Answer:** No! Only when the property changes:

```javascript
const state = ReactiveUtils.state({ count: 0 });

state.$watch('count', (newVal) => {
  console.log('Count:', newVal);
});

// Nothing logged yet!

state.count = 5;  // NOW it logs: "Count: 5"
```

---

### Q: Can I watch nested properties?

**Answer:** Yes, use dot notation:

```javascript
const state = ReactiveUtils.state({
  user: {
    profile: {
      name: 'John'
    }
  }
});

state.$watch('user.profile.name', (newName, oldName) => {
  console.log(`Name: ${oldName} → ${newName}`);
});

state.user.profile.name = 'Jane';  // Logs change
```

---

### Q: Can I watch computed properties?

**Answer:** Yes!

```javascript
const state = ReactiveUtils.state({ firstName: 'John', lastName: 'Doe' });

state.$computed('fullName', function() {
  return this.firstName + ' ' + this.lastName;
});

state.$watch('fullName', (newName, oldName) => {
  console.log(`Full name: ${oldName} → ${newName}`);
});

state.firstName = 'Jane';  // Logs: "Full name: John Doe → Jane Doe"
```

---

### Q: How do I stop watching?

**Answer:** Call the cleanup function:

```javascript
const state = ReactiveUtils.state({ count: 0 });

const stopWatching = state.$watch('count', (val) => {
  console.log('Count:', val);
});

state.count = 5;   // Logs
state.count = 10;  // Logs

stopWatching();    // Stop watching

state.count = 15;  // Doesn't log
```

---

## Tips for Beginners

### 1. Use for Side Effects

```javascript
// ✅ Good - side effects
state.$watch('theme', (newTheme) => {
  document.body.className = newTheme;
  localStorage.setItem('theme', newTheme);
});

// ❌ Bad - use computed instead
state.$watch('count', (newCount) => {
  state.doubled = newCount * 2;  // Use computed!
});
```

---

### 2. Store Cleanup Functions

```javascript
const cleanups = [];

cleanups.push(state.$watch('prop1', callback1));
cleanups.push(state.$watch('prop2', callback2));
cleanups.push(state.$watch('prop3', callback3));

// Later, stop all watchers
function cleanup() {
  cleanups.forEach(stop => stop());
}
```

---

### 3. Debounce Expensive Operations

```javascript
let timeout;

state.$watch('searchQuery', (newQuery) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    // Expensive API call
    performSearch(newQuery);
  }, 300);
});
```

---

### 4. Use Old Value for Comparisons

```javascript
state.$watch('stock', (newStock, oldStock) => {
  // Only act on decreases
  if (newStock < oldStock) {
    console.log('Stock decreased by', oldStock - newStock);
  }
  
  // Only act when crossing threshold
  if (newStock <= 10 && oldStock > 10) {
    console.log('Low stock alert!');
  }
});
```

---

### 5. Watch for Authentication Changes

```javascript
state.$watch('user', (newUser, oldUser) => {
  if (newUser && !oldUser) {
    console.log('User logged in');
    loadUserData();
  } else if (!newUser && oldUser) {
    console.log('User logged out');
    clearUserData();
  }
});
```

---

## Summary

### What `$watch()` Does:

1. ✅ Watches a specific property for changes
2. ✅ Method on reactive state objects
3. ✅ Provides new and old values
4. ✅ Returns cleanup function
5. ✅ Runs callback only when property changes
6. ✅ Can watch nested properties with dot notation

### When to Use It:

- React to specific property changes
- Perform side effects (save, log, API calls)
- Track state transitions
- Trigger actions based on changes
- Need both old and new values
- Want targeted, not automatic tracking

### The Basic Pattern:

```javascript
const state = ReactiveUtils.state({ /* data */ });

// Watch a property
const stopWatching = state.$watch('propertyName', (newValue, oldValue) => {
  console.log(`Changed: ${oldValue} → ${newValue}`);
  
  // Perform side effects
  localStorage.setItem('property', newValue);
  sendToServer(newValue);
});

// Stop watching when done
stopWatching();
```

**Remember:** `$watch()` is your targeted property observer - perfect for reacting to specific changes with side effects. Always clean up your watchers when you're done! 🎉