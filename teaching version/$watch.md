# `state.$watch()` - React to Specific Property Changes

> **You are a senior JavaScript engineer teaching a beginner**

---

## The Problem: You Want to React to ONE Specific Property

Imagine you're building a form. When the email field changes, you want to validate it. With `effect()`, you have to be careful - it might track OTHER properties you don't care about!

Here's what happens **WITHOUT** `$watch()`:

```javascript
const form = state({
  email: '',
  password: '',
  confirmPassword: ''
});

// Using effect - might track unintended properties
effect(() => {
  const email = form.email;  // Tracks email

  // Oops, if we accidentally access other properties...
  if (form.password.length > 0) {  // Also tracks password!
    validateEmail(email);
  }
});

// Now the effect runs when EITHER email OR password changes!
form.password = 'secret';  // Effect runs (unwanted!)
```

**The Real Issues:**
- `effect()` tracks **all** properties you access
- Hard to watch just ONE specific property
- Easy to accidentally track extra properties
- No easy way to get old vs new values

---

## The Solution: `$watch()` - Watch ONE Property, Get Old and New Values

`$watch()` lets you watch a **specific property** and react when it changes. You get both the new value AND the old value!

```javascript
const form = state({
  email: '',
  password: '',
  confirmPassword: ''
});

// ✅ Watch ONLY email (nothing else!)
form.$watch('email', function(newEmail, oldEmail) {
  console.log(`Email changed: "${oldEmail}" → "${newEmail}"`);

  // Validate email
  if (!newEmail) {
    this.errors.email = 'Email is required';
  } else if (!newEmail.includes('@')) {
    this.errors.email = 'Invalid email';
  } else {
    delete this.errors.email;
  }
});

// Only triggers when email changes
form.email = 'john@example.com';
// Logs: Email changed: "" → "john@example.com"

form.password = 'secret';
// Doesn't trigger! We're only watching email
```

**Think of it like this:**
- **`effect()`**: "Run this code whenever ANY dependency changes"
- **`$watch()`**: "Run this code when THIS SPECIFIC PROPERTY changes"

---

## How It Works Under the Hood

When you call `$watch(key, callback)`:

```
state.$watch('email', callback)
        ↓
1. Create a watcher for specific property
2. Track current value
3. When property changes:
   - Get old value (before change)
   - Get new value (after change)
   - Call callback(newValue, oldValue)
        ↓
Returns cleanup function to stop watching
```

**Example:**
```javascript
form.$watch('email', function(newVal, oldVal) {
  console.log(oldVal, '→', newVal);
});

form.email = 'john@example.com';
// Logs: "" → "john@example.com"

form.email = 'jane@example.com';
// Logs: "john@example.com" → "jane@example.com"
```

**The magic:** `$watch()` tracks ONLY the property you specify. You can access other properties in the callback without tracking them!

---

## When to Use `$watch()`

### ✅ Use Case 1: Form Field Validation

Validate individual fields as they change.

```javascript
const form = state({
  email: '',
  password: '',
  confirmPassword: '',
  errors: {}
});

// Watch email for validation
form.$watch('email', function(newEmail) {
  if (!newEmail) {
    this.errors.email = 'Email is required';
  } else if (!newEmail.includes('@')) {
    this.errors.email = 'Invalid email format';
  } else {
    delete this.errors.email;
  }
});

// Watch password for validation
form.$watch('password', function(newPassword) {
  if (!newPassword) {
    this.errors.password = 'Password is required';
  } else if (newPassword.length < 8) {
    this.errors.password = 'Password must be at least 8 characters';
  } else {
    delete this.errors.password;
  }

  // Check if passwords match
  if (this.confirmPassword && newPassword !== this.confirmPassword) {
    this.errors.confirmPassword = 'Passwords do not match';
  } else if (this.confirmPassword) {
    delete this.errors.confirmPassword;
  }
});

// Watch confirm password
form.$watch('confirmPassword', function(newConfirm) {
  if (newConfirm !== this.password) {
    this.errors.confirmPassword = 'Passwords do not match';
  } else {
    delete this.errors.confirmPassword;
  }
});

// Type in fields - validation happens automatically
form.email = 'john';  // Error: "Invalid email format"
form.email = 'john@example.com';  // Error cleared!
form.password = 'short';  // Error: "Password must be at least 8 characters"
form.password = 'secret123';  // Error cleared!
```

**Why this works:** Each watcher validates its specific field. Clean separation of concerns!

---

### ✅ Use Case 2: Save to localStorage on Change

Auto-save settings when they change.

```javascript
const settings = state({
  theme: 'dark',
  fontSize: 16,
  notifications: true
});

// Watch theme changes
settings.$watch('theme', function(newTheme, oldTheme) {
  console.log(`Theme changed: ${oldTheme} → ${newTheme}`);
  localStorage.setItem('theme', newTheme);

  // Apply theme
  document.body.className = newTheme;
});

// Watch fontSize changes
settings.$watch('fontSize', function(newSize) {
  localStorage.setItem('fontSize', newSize.toString());
  document.documentElement.style.fontSize = `${newSize}px`;
});

// Watch notifications
settings.$watch('notifications', function(enabled) {
  localStorage.setItem('notifications', enabled.toString());

  if (enabled) {
    console.log('Notifications enabled');
    // Request permission
  } else {
    console.log('Notifications disabled');
  }
});

// Change settings - auto-saves!
settings.theme = 'light';  // Saves to localStorage, applies theme
settings.fontSize = 18;     // Saves to localStorage, updates CSS
```

**Why this works:** Each setting has its own watcher. Changes are persisted automatically!

---

### ✅ Use Case 3: Analytics Tracking

Track specific user actions.

```javascript
const app = state({
  currentPage: 'home',
  searchQuery: '',
  cartItemCount: 0,
  isLoggedIn: false
});

// Track page views
app.$watch('currentPage', function(newPage, oldPage) {
  console.log(`Navigation: ${oldPage} → ${newPage}`);

  // Send to analytics
  analytics.track('Page View', {
    page: newPage,
    previousPage: oldPage,
    timestamp: new Date()
  });
});

// Track searches
app.$watch('searchQuery', function(newQuery, oldQuery) {
  if (newQuery && newQuery !== oldQuery) {
    analytics.track('Search', {
      query: newQuery,
      timestamp: new Date()
    });
  }
});

// Track cart changes
app.$watch('cartItemCount', function(newCount, oldCount) {
  const change = newCount - oldCount;

  if (change > 0) {
    analytics.track('Item Added to Cart', { count: newCount });
  } else if (change < 0) {
    analytics.track('Item Removed from Cart', { count: newCount });
  }
});

// Track login/logout
app.$watch('isLoggedIn', function(loggedIn) {
  if (loggedIn) {
    analytics.track('User Logged In');
  } else {
    analytics.track('User Logged Out');
  }
});

// User actions trigger tracking
app.currentPage = 'products';  // Tracks page view
app.searchQuery = 'laptop';    // Tracks search
app.cartItemCount = 1;         // Tracks add to cart
```

**Why this works:** Watchers let you track specific metrics without complex logic!

---

### ✅ Use Case 4: Auto-Save Draft Content

Save draft as user types (with debouncing).

```javascript
const editor = state({
  title: '',
  content: '',
  lastSaved: null,
  isDirty: false
});

let saveTimeout;

// Watch content changes
editor.$watch('content', function(newContent) {
  // Mark as dirty
  this.isDirty = true;

  // Clear previous timeout
  clearTimeout(saveTimeout);

  // Save after 2 seconds of no typing
  saveTimeout = setTimeout(async () => {
    console.log('Auto-saving draft...');

    await fetch('/api/drafts', {
      method: 'POST',
      body: JSON.stringify({
        title: this.title,
        content: newContent
      })
    });

    this.lastSaved = new Date();
    this.isDirty = false;
    console.log('Draft saved!');
  }, 2000);
});

// Watch title changes (same logic)
editor.$watch('title', function() {
  this.isDirty = true;

  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    await saveDraft();
    this.lastSaved = new Date();
    this.isDirty = false;
  }, 2000);
});

// User types - auto-saves after 2s pause
editor.content = 'Hello';
// (2s later) "Auto-saving draft..." → "Draft saved!"
```

**Why this works:** Watchers trigger on every change. Combined with debouncing, perfect for auto-save!

---

### ✅ Use Case 5: Dependent Field Updates

Update related fields automatically.

```javascript
const invoice = state({
  quantity: 1,
  unitPrice: 100,
  subtotal: 100,
  taxRate: 0.1,
  tax: 10,
  total: 110
});

// Watch quantity changes
invoice.$watch('quantity', function(newQty) {
  this.subtotal = newQty * this.unitPrice;
});

// Watch unit price changes
invoice.$watch('unitPrice', function(newPrice) {
  this.subtotal = this.quantity * newPrice;
});

// Watch subtotal changes
invoice.$watch('subtotal', function(newSubtotal) {
  this.tax = newSubtotal * this.taxRate;
  this.total = newSubtotal + this.tax;
});

// Watch tax rate changes
invoice.$watch('taxRate', function(newRate) {
  this.tax = this.subtotal * newRate;
  this.total = this.subtotal + this.tax;
});

// Change quantity - everything updates!
invoice.quantity = 5;
// subtotal becomes 500 (5 * 100)
// tax becomes 50 (500 * 0.1)
// total becomes 550 (500 + 50)

// Change unit price
invoice.unitPrice = 150;
// subtotal becomes 750 (5 * 150)
// tax becomes 75 (750 * 0.1)
// total becomes 825 (750 + 75)
```

**Why this works:** Watchers create a dependency chain. Changing one field cascades updates!

---

## How `$watch()` Interacts With Other Features

### With Effects - More Specific Than effect()

```javascript
const app = state({ count: 0, message: '' });

// effect tracks ALL accessed properties
effect(() => {
  console.log(app.count, app.message);  // Tracks both
});

// $watch tracks ONE property
app.$watch('count', function(newCount) {
  console.log('Count:', newCount);  // Only tracks count

  // Can access message without tracking it!
  console.log('Message:', this.message);
});

app.count = 10;    // Both effect and watch run
app.message = 'Hi'; // Only effect runs
```

**Lesson:** Use `$watch()` when you need to react to ONE specific property!

---

### With Computed - Watch Computed Properties

```javascript
const cart = state({ items: [] });

cart.$computed('total', function() {
  return this.items.reduce((sum, i) => sum + i.price, 0);
});

// Watch computed property!
cart.$watch('total', function(newTotal, oldTotal) {
  console.log(`Total changed: $${oldTotal} → $${newTotal}`);

  if (newTotal > 100) {
    console.log('Free shipping!');
  }
});

cart.items.push({ price: 50 });  // Total: $0 → $50
cart.items.push({ price: 60 });  // Total: $50 → $110, "Free shipping!"
```

**Lesson:** You can watch computed properties just like regular properties!

---

### With Arrays - Triggers on Array Changes

```javascript
const todos = state({ items: [] });

todos.$watch('items', function(newItems, oldItems) {
  console.log(`Items changed: ${oldItems.length} → ${newItems.length}`);
});

todos.items.push({ text: 'Buy milk' });
// Logs: "Items changed: 0 → 1"

todos.items.push({ text: 'Call dentist' });
// Logs: "Items changed: 1 → 2"
```

**Lesson:** Watchers trigger when array methods are called (push, pop, splice, etc.)!

---

## When NOT to Use `$watch()`

### ❌ Don't Use for Multiple Dependencies

```javascript
// ❌ BAD: Watching multiple properties separately
state.$watch('firstName', updateFullName);
state.$watch('lastName', updateFullName);

function updateFullName() {
  state.fullName = `${state.firstName} ${state.lastName}`;
}

// ✅ GOOD: Use computed property
state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});
```

**Why:** Computed properties are better for deriving values from multiple sources!

---

### ❌ Don't Use for Every Property Change

```javascript
// ❌ BAD: Watching everything
state.$watch('a', doSomething);
state.$watch('b', doSomething);
state.$watch('c', doSomething);

// ✅ GOOD: Use effect if you need multiple dependencies
effect(() => {
  if (state.a && state.b && state.c) {
    doSomething();
  }
});
```

**Why:** If you need to react to multiple properties, use `effect()`!

---

## Comparison with Related Methods

| Method | Watches | Gets Old/New Values? | Specific Property? |
|--------|---------|---------------------|-------------------|
| `effect()` | All accessed | ❌ No | ❌ No |
| `$watch()` | One specific | ✅ Yes | ✅ Yes |
| `$computed()` | Dependencies | ❌ No | ❌ No (returns value) |

**When to use which:**
- **`effect()`** - React to multiple properties, side effects
- **`$watch()`** - React to ONE property, need old/new values
- **`$computed()`** - Derive value from multiple properties

---

## Quick Mental Model

Think of watchers as **"property change listeners"**:

```javascript
// effect: "Watch everything I touch"
effect(() => {
  console.log(state.a, state.b, state.c);  // Watches a, b, c
});

// $watch: "Watch THIS ONE property"
state.$watch('a', (newVal, oldVal) => {
  console.log(oldVal, '→', newVal);  // Only watches 'a'

  // Can access b and c without watching them!
  console.log(state.b, state.c);
});
```

**Remember:**
- `$watch()` watches ONE property
- Callback receives `(newValue, oldValue)`
- Use `this` to access state
- Returns cleanup function

---

## Summary

**`state.$watch()` watches a specific property and calls a callback when it changes, providing both old and new values.**

**When to use it:**
- ✅ Validate form fields individually
- ✅ Save to localStorage on change
- ✅ Track analytics events
- ✅ Auto-save drafts
- ✅ Update dependent fields

**When NOT to use it:**
- ❌ Deriving values (use `$computed()`)
- ❌ Multiple dependencies (use `effect()`)
- ❌ One-off reactions (just check the value)

**One-sentence summary:**
Use `$watch()` when you need to react to changes in ONE specific property and want both old and new values! 🎯

---

➡️ **Next:** Learn about [`$batch()`]($batch.md) for grouping updates, or [`$notify()`]($notify.md) for manual reactivity triggers!
