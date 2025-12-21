# Understanding `state.$watch()` - A Beginner's Guide

## What is `state.$watch()`?

`state.$watch()` is a **state instance method** that watches a specific property for changes and runs a callback when that property changes. It's perfect for side effects like logging, validation, persistence, or triggering other actions.

Think of it as **setting up a listener** - whenever a property changes, your callback gets notified with the new and old values.

---

## Syntax

```js
const cleanup = state.$watch(keyOrFn, callback)
```

**Parameters:**
- `keyOrFn` (String or Function): Property name to watch, or a function that returns a value to watch
- `callback` (Function): Callback function called when the value changes
  - Receives `(newValue, oldValue)` as parameters
  - `this` is the state object

**Returns:**
- Cleanup function to stop watching

---

## Why Does This Exist?

### The Problem with Manual Tracking

When you need to react to specific property changes, you need effects:

```javascript
// Without $watch - verbose effects
const user = state({
  name: 'John',
  email: 'john@example.com',
  password: ''
});

effect(() => {
  const name = user.name;
  console.log('Name changed to:', name);
});

effect(() => {
  const email = user.email;
  console.log('Email changed to:', email);
});

// Verbose and tracks more than needed
```

**What's the Real Issue?**

**Problems:**
- Verbose effect creation
- Tracks all reads, not just one property
- Hard to get old value
- No clear intent
- More code to manage

---

### The Solution with `$watch()`

When you use `$watch()`, you watch specific properties cleanly:

```javascript
// With $watch() - clean and focused
const user = state({
  name: 'John',
  email: 'john@example.com',
  password: ''
});

user.$watch('name', (newName, oldName) => {
  console.log(`Name changed from ${oldName} to ${newName}`);
});

user.$watch('email', (newEmail, oldEmail) => {
  console.log(`Email changed from ${oldEmail} to ${newEmail}`);
});

user.name = 'Jane';
// Output: "Name changed from John to Jane"
```

**Benefits:**
- Clear, focused watching
- Get both new and old values
- Clean syntax
- Easy to stop watching
- Better performance

---

## How Does It Work?

### Under the Hood

`$watch()` creates an effect that tracks a specific property:

```
state.$watch(key, callback)
        ↓
1. Create effect that reads the property
2. Store previous value
3. When property changes, call callback with new and old values
        ↓
Returns cleanup function to stop watching
```

---

## Basic Usage

### Watch Single Property

```js
const data = state({
  count: 0,
  message: ''
});

const cleanup = data.$watch('count', (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

data.count = 5;
// Output: "Count changed from 0 to 5"

data.count = 10;
// Output: "Count changed from 5 to 10"

// Stop watching
cleanup();
```

### Watch Multiple Properties

```js
const user = state({
  name: 'John',
  age: 25,
  email: 'john@example.com'
});

user.$watch('name', (newVal, oldVal) => {
  console.log('Name:', oldVal, '→', newVal);
});

user.$watch('age', (newVal, oldVal) => {
  console.log('Age:', oldVal, '→', newVal);
});

user.$watch('email', (newVal, oldVal) => {
  console.log('Email:', oldVal, '→', newVal);
});
```

### Watch Computed Values

```js
const cart = state({
  items: []
});

cart.$computed('total', function() {
  return this.items.reduce((sum, item) => sum + item.price, 0);
});

cart.$watch('total', (newTotal, oldTotal) => {
  console.log(`Total changed from $${oldTotal} to $${newTotal}`);
});

cart.items.push({ price: 10 });
// Output: "Total changed from $0 to $10"
```

---

## Common Use Cases

### Use Case 1: Form Validation

```js
const form = state({
  email: '',
  password: '',
  errors: {}
});

form.$watch('email', function(newEmail) {
  if (!newEmail) {
    this.errors.email = 'Email is required';
  } else if (!newEmail.includes('@')) {
    this.errors.email = 'Invalid email';
  } else {
    delete this.errors.email;
  }
});

form.$watch('password', function(newPassword) {
  if (!newPassword) {
    this.errors.password = 'Password is required';
  } else if (newPassword.length < 8) {
    this.errors.password = 'Password must be at least 8 characters';
  } else {
    delete this.errors.password;
  }
});

form.email = 'invalid'; // Sets error
form.email = 'user@example.com'; // Clears error
```

### Use Case 2: localStorage Persistence

```js
const settings = state({
  theme: 'light',
  language: 'en',
  notifications: true
});

settings.$watch('theme', (newTheme) => {
  localStorage.setItem('theme', newTheme);
  document.body.className = newTheme;
});

settings.$watch('language', (newLang) => {
  localStorage.setItem('language', newLang);
  loadLanguagePack(newLang);
});

settings.$watch('notifications', (enabled) => {
  localStorage.setItem('notifications', enabled);
});

settings.theme = 'dark'; // Saved to localStorage
```

### Use Case 3: Analytics Tracking

```js
const app = state({
  currentPage: 'home',
  searchQuery: '',
  filterSettings: {}
});

app.$watch('currentPage', (newPage, oldPage) => {
  analytics.track('page_view', {
    page: newPage,
    previous_page: oldPage,
    timestamp: new Date()
  });
});

app.$watch('searchQuery', (query) => {
  if (query) {
    analytics.track('search', {
      query: query,
      timestamp: new Date()
    });
  }
});

app.$watch('filterSettings', (newFilters) => {
  analytics.track('filter_applied', {
    filters: newFilters,
    timestamp: new Date()
  });
});
```

### Use Case 4: Auto-Save Draft

```js
const editor = state({
  title: '',
  content: '',
  lastSaved: null
});

let saveTimeout;

editor.$watch('title', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveDraft();
  }, 2000);
});

editor.$watch('content', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveDraft();
  }, 2000);
});

async function saveDraft() {
  const response = await fetch('/api/save-draft', {
    method: 'POST',
    body: JSON.stringify({
      title: editor.title,
      content: editor.content
    })
  });

  if (response.ok) {
    editor.lastSaved = new Date();
  }
}
```

### Use Case 5: Dependent Updates

```js
const order = state({
  quantity: 1,
  unitPrice: 10.00,
  subtotal: 10.00,
  taxRate: 0.1,
  tax: 1.00,
  total: 11.00
});

order.$watch('quantity', function(newQty) {
  this.subtotal = newQty * this.unitPrice;
});

order.$watch('unitPrice', function(newPrice) {
  this.subtotal = this.quantity * newPrice;
});

order.$watch('subtotal', function(newSubtotal) {
  this.tax = newSubtotal * this.taxRate;
  this.total = newSubtotal + this.tax;
});

order.quantity = 5;
// Triggers: subtotal → tax → total updates
```

---

## Advanced Patterns

### Pattern 1: Watch Function (Computed Watch)

```js
const data = state({
  firstName: 'John',
  lastName: 'Doe'
});

// Watch a computed value without adding it to state
data.$watch(function() {
  return `${this.firstName} ${this.lastName}`;
}, (newFullName, oldFullName) => {
  console.log(`Full name: ${oldFullName} → ${newFullName}`);
});

data.firstName = 'Jane';
// Output: "Full name: John Doe → Jane Doe"
```

### Pattern 2: Conditional Watching

```js
const app = state({
  debugMode: false,
  data: {}
});

let debugCleanup;

app.$watch('debugMode', function(isDebug) {
  if (isDebug) {
    // Start watching data when debug mode enabled
    debugCleanup = this.$watch('data', (newData) => {
      console.log('[DEBUG] Data changed:', newData);
    });
  } else {
    // Stop watching when debug mode disabled
    if (debugCleanup) {
      debugCleanup();
      debugCleanup = null;
    }
  }
});
```

### Pattern 3: History Tracking

```js
const data = state({
  value: 0,
  history: []
});

data.$watch('value', function(newValue, oldValue) {
  this.history.push({
    from: oldValue,
    to: newValue,
    timestamp: new Date()
  });

  // Keep only last 10 changes
  if (this.history.length > 10) {
    this.history.shift();
  }
});

data.value = 5;
data.value = 10;
console.log(data.history);
// [{ from: 0, to: 5, ... }, { from: 5, to: 10, ... }]
```

### Pattern 4: Validation with Rollback

```js
const state = state({
  age: 0,
  previousAge: 0
});

state.$watch('age', function(newAge, oldAge) {
  if (newAge < 0 || newAge > 120) {
    console.error('Invalid age:', newAge);
    this.age = oldAge; // Rollback
  } else {
    this.previousAge = oldAge;
  }
});

state.age = 25; // Valid
state.age = -5; // Invalid - rolls back to 25
console.log(state.age); // 25
```

---

## Performance Tips

### Tip 1: Watch Specific Properties

```js
// GOOD - watch specific property
state.$watch('count', callback);

// BAD - effect watches everything
effect(() => {
  if (state.count) callback(state.count);
});
```

### Tip 2: Debounce Expensive Operations

```js
let debounceTimeout;

state.$watch('searchQuery', (query) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    performExpensiveSearch(query);
  }, 300);
});
```

### Tip 3: Clean Up Watchers

```js
const cleanup = state.$watch('data', callback);

// When done
cleanup(); // Stop watching
```

---

## Common Pitfalls

### Pitfall 1: Infinite Loops

```js
// WRONG - infinite loop
state.$watch('count', function(newValue) {
  this.count++; // Triggers watch again!
});

// RIGHT - modify different property
state.$watch('count', function(newValue) {
  this.doubled = newValue * 2; // OK
});
```

### Pitfall 2: Not Cleaning Up

```js
// WRONG - memory leak
function createWatcher() {
  state.$watch('data', callback);
  // Can't stop watching later
}

// RIGHT - store cleanup
function createWatcher() {
  const cleanup = state.$watch('data', callback);
  return cleanup;
}

const stop = createWatcher();
// Later: stop();
```

### Pitfall 3: Using Arrow Functions

```js
// WRONG - 'this' is wrong
state.$watch('count', (newVal) => {
  this.doubled = newVal * 2; // 'this' not the state!
});

// RIGHT - regular function
state.$watch('count', function(newVal) {
  this.doubled = newVal * 2; // 'this' is the state
});
```

---

## Summary

**`state.$watch()` watches specific properties for changes.**

Key takeaways:
- ✅ **Watches specific property** on state instance
- ✅ Callback receives **newValue** and **oldValue**
- ✅ Returns **cleanup function**
- ✅ Can watch **computed properties**
- ✅ Can watch **function** that returns value
- ✅ Great for **validation**, **persistence**, **analytics**, **side effects**
- ⚠️ Use **regular functions**, not arrow functions
- ⚠️ Avoid **infinite loops** - don't modify watched property
- ⚠️ Always **clean up** when done

**Remember:** Use `$watch()` for side effects when specific properties change. It's cleaner than effects for single-property watching! 🎉

➡️ Next, explore [`$computed()`]($computed.md) for derived values or [`$batch()`]($batch.md) for batching updates!
