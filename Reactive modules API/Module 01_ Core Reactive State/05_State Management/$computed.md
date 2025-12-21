# Understanding `state.$computed()` - A Beginner's Guide

## What is `state.$computed()`?

`state.$computed()` is a **state instance method** that adds a computed property to a reactive state object. Computed properties are cached values that automatically recalculate when their dependencies change.

Think of it as **a smart getter** - it calculates a value based on other properties and only recalculates when those properties change, caching the result for efficiency.

---

## Syntax

```js
state.$computed(key, fn)
```

**Parameters:**
- `key` (String): Name of the computed property
- `fn` (Function): Getter function that returns the computed value (use `this` to access state)

**Returns:**
- The state object (for chaining)

---

## Why Does This Exist?

### The Problem with Manual Calculations

When you need derived values, you often recalculate them repeatedly:

```javascript
// Without computed - manual recalculation
const cart = state({
  items: [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ],
  taxRate: 0.1
});

// Calculate manually every time
function getTotal() {
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  const tax = subtotal * cart.taxRate;
  return subtotal + tax;
}

console.log(getTotal()); // Recalculates
console.log(getTotal()); // Recalculates again
console.log(getTotal()); // And again - wasteful!
```

**What's the Real Issue?**

**Problems:**
- Manual recalculation every time
- No caching - waste of CPU
- Not reactive - doesn't auto-update
- Verbose and repetitive
- Hard to track dependencies

---

### The Solution with `$computed()`

When you use `$computed()`, values are cached and auto-update:

```javascript
// With $computed() - automatic and cached
const cart = state({
  items: [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ],
  taxRate: 0.1
});

cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

cart.$computed('tax', function() {
  return this.subtotal * this.taxRate;
});

cart.$computed('total', function() {
  return this.subtotal + this.tax;
});

console.log(cart.total); // Calculates once, caches
console.log(cart.total); // Uses cached value
console.log(cart.total); // Uses cached value

cart.items[0].quantity = 3; // Change dependency
console.log(cart.total); // Recalculates automatically
```

**Benefits:**
- Automatic caching
- Auto-updates when dependencies change
- Reactive like regular properties
- Clean syntax
- Efficient performance

---

## How Does It Work?

### Under the Hood

`$computed()` creates a getter that tracks dependencies:

```
state.$computed(key, fn)
        ↓
1. Create getter for the property
2. Track reactive dependencies when accessed
3. Cache the computed value
4. Invalidate cache when dependencies change
5. Recalculate on next access
        ↓
Efficient, reactive computed property
```

---

## Basic Usage

### Simple Computed Property

```js
const user = state({
  firstName: 'John',
  lastName: 'Doe'
});

user.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

console.log(user.fullName); // "John Doe"
user.firstName = 'Jane';
console.log(user.fullName); // "Jane Doe" (auto-updated)
```

### Multiple Computed Properties

```js
const product = state({
  price: 100,
  quantity: 2,
  taxRate: 0.1,
  discount: 0.15
});

product.$computed('subtotal', function() {
  return this.price * this.quantity;
});

product.$computed('discountAmount', function() {
  return this.subtotal * this.discount;
});

product.$computed('afterDiscount', function() {
  return this.subtotal - this.discountAmount;
});

product.$computed('tax', function() {
  return this.afterDiscount * this.taxRate;
});

product.$computed('total', function() {
  return this.afterDiscount + this.tax;
});

console.log(product.total); // Automatically calculated
```

### Chaining

```js
const app = state({ count: 0, step: 1 });

app.$computed('doubled', function() {
  return this.count * 2;
}).$computed('tripled', function() {
  return this.count * 3;
}).$computed('squared', function() {
  return this.count * this.count;
});

console.log(app.doubled, app.tripled, app.squared);
```

---

## Common Use Cases

### Use Case 1: Shopping Cart Totals

```js
const cart = state({
  items: [],
  shippingCost: 5.99,
  taxRate: 0.1,
  couponDiscount: 0
});

cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

cart.$computed('discountAmount', function() {
  return this.subtotal * this.couponDiscount;
});

cart.$computed('afterDiscount', function() {
  return this.subtotal - this.discountAmount;
});

cart.$computed('tax', function() {
  return this.afterDiscount * this.taxRate;
});

cart.$computed('total', function() {
  return this.afterDiscount + this.tax + this.shippingCost;
});

cart.$computed('itemCount', function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Use in effects
effect(() => {
  document.getElementById('cartTotal').textContent = `$${cart.total.toFixed(2)}`;
  document.getElementById('itemCount').textContent = cart.itemCount;
});
```

### Use Case 2: User Profile Display

```js
const user = state({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  dateOfBirth: '1990-05-15',
  followers: 1234,
  following: 567
});

user.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

user.$computed('initials', function() {
  return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
});

user.$computed('age', function() {
  const dob = new Date(this.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
});

user.$computed('followerCount', function() {
  if (this.followers >= 1000000) {
    return `${(this.followers / 1000000).toFixed(1)}M`;
  } else if (this.followers >= 1000) {
    return `${(this.followers / 1000).toFixed(1)}K`;
  }
  return this.followers.toString();
});

user.$computed('followRatio', function() {
  return this.following > 0 ? (this.followers / this.following).toFixed(2) : 0;
});
```

### Use Case 3: Form Validation

```js
const form = state({
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  errors: {}
});

form.$computed('emailValid', function() {
  return this.email.includes('@') && this.email.includes('.');
});

form.$computed('passwordValid', function() {
  return this.password.length >= 8 && /[A-Z]/.test(this.password);
});

form.$computed('passwordsMatch', function() {
  return this.password === this.confirmPassword;
});

form.$computed('hasErrors', function() {
  return Object.keys(this.errors).length > 0;
});

form.$computed('isValid', function() {
  return this.emailValid &&
         this.passwordValid &&
         this.passwordsMatch &&
         this.agreeToTerms &&
         !this.hasErrors;
});

form.$computed('canSubmit', function() {
  return this.isValid && this.email && this.password;
});

// Use in UI
effect(() => {
  document.getElementById('submitBtn').disabled = !form.canSubmit;
});
```

### Use Case 4: Data Analytics

```js
const analytics = state({
  pageViews: [120, 145, 189, 167, 198, 223, 201],
  bounceRates: [0.45, 0.42, 0.38, 0.41, 0.35, 0.33, 0.37],
  conversions: [12, 15, 18, 16, 21, 24, 20]
});

analytics.$computed('totalPageViews', function() {
  return this.pageViews.reduce((a, b) => a + b, 0);
});

analytics.$computed('avgPageViews', function() {
  return this.totalPageViews / this.pageViews.length;
});

analytics.$computed('avgBounceRate', function() {
  const sum = this.bounceRates.reduce((a, b) => a + b, 0);
  return (sum / this.bounceRates.length * 100).toFixed(2);
});

analytics.$computed('totalConversions', function() {
  return this.conversions.reduce((a, b) => a + b, 0);
});

analytics.$computed('conversionRate', function() {
  return ((this.totalConversions / this.totalPageViews) * 100).toFixed(2);
});

analytics.$computed('trend', function() {
  const recent = this.pageViews.slice(-3);
  const previous = this.pageViews.slice(-6, -3);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

  if (recentAvg > previousAvg * 1.1) return 'up';
  if (recentAvg < previousAvg * 0.9) return 'down';
  return 'stable';
});
```

### Use Case 5: Game Statistics

```js
const game = state({
  score: 0,
  level: 1,
  lives: 3,
  timeElapsed: 0,
  enemiesDefeated: 0,
  itemsCollected: 0,
  accuracy: 0.85
});

game.$computed('pointsPerSecond', function() {
  return this.timeElapsed > 0 ? (this.score / this.timeElapsed).toFixed(2) : 0;
});

game.$computed('effectiveLevel', function() {
  return Math.floor(this.score / 1000) + 1;
});

game.$computed('nextLevelAt', function() {
  return this.effectiveLevel * 1000;
});

game.$computed('progressToNextLevel', function() {
  const currentLevelStart = (this.effectiveLevel - 1) * 1000;
  const progress = this.score - currentLevelStart;
  return (progress / 1000 * 100).toFixed(1);
});

game.$computed('rank', function() {
  if (this.score >= 10000) return 'S';
  if (this.score >= 7500) return 'A';
  if (this.score >= 5000) return 'B';
  if (this.score >= 2500) return 'C';
  return 'D';
});

game.$computed('stars', function() {
  const score = this.score;
  if (score >= 10000) return 5;
  if (score >= 7500) return 4;
  if (score >= 5000) return 3;
  if (score >= 2500) return 2;
  if (score >= 1000) return 1;
  return 0;
});

game.$computed('isAlive', function() {
  return this.lives > 0;
});
```

---

## Advanced Patterns

### Pattern 1: Dependent Computed Properties

```js
const data = state({ values: [1, 2, 3, 4, 5] });

data.$computed('sum', function() {
  return this.values.reduce((a, b) => a + b, 0);
});

data.$computed('average', function() {
  return this.sum / this.values.length; // Depends on 'sum'
});

data.$computed('variance', function() {
  const avg = this.average; // Depends on 'average'
  return this.values.reduce((sum, val) => {
    return sum + Math.pow(val - avg, 2);
  }, 0) / this.values.length;
});

data.$computed('stdDev', function() {
  return Math.sqrt(this.variance); // Depends on 'variance'
});
```

### Pattern 2: Conditional Computed

```js
const ui = state({
  isLoggedIn: false,
  user: null,
  guestName: 'Guest'
});

ui.$computed('displayName', function() {
  return this.isLoggedIn ? this.user.name : this.guestName;
});

ui.$computed('canEdit', function() {
  return this.isLoggedIn && this.user.role === 'admin';
});
```

### Pattern 3: Array Transformations

```js
const todos = state({
  items: [],
  filter: 'all'
});

todos.$computed('activeItems', function() {
  return this.items.filter(t => !t.completed);
});

todos.$computed('completedItems', function() {
  return this.items.filter(t => t.completed);
});

todos.$computed('filteredItems', function() {
  if (this.filter === 'active') return this.activeItems;
  if (this.filter === 'completed') return this.completedItems;
  return this.items;
});

todos.$computed('activeCount', function() {
  return this.activeItems.length;
});
```

---

## Performance Tips

### Tip 1: Keep Computed Functions Pure

```js
// GOOD - pure function
state.$computed('total', function() {
  return this.price * this.quantity;
});

// BAD - side effects
state.$computed('total', function() {
  console.log('Calculating...'); // Side effect
  return this.price * this.quantity;
});
```

### Tip 2: Use for Expensive Calculations

```js
// GOOD - expensive calculation cached
state.$computed('sortedItems', function() {
  return [...this.items].sort((a, b) => b.value - a.value);
});

// Access multiple times - only calculates once
console.log(state.sortedItems);
console.log(state.sortedItems); // Cached
```

### Tip 3: Avoid Deep Nesting

```js
// GOOD - flat dependencies
state.$computed('total', function() {
  return this.subtotal + this.tax;
});

// BAD - deep nesting
state.$computed('total', function() {
  return this.cart.items.reduce((sum, item) => {
    return sum + item.details.pricing.total;
  }, 0);
});
```

---

## Common Pitfalls

### Pitfall 1: Modifying State in Computed

```js
// WRONG - modifying state
state.$computed('total', function() {
  this.count++; // DON'T modify in computed!
  return this.price * this.quantity;
});

// RIGHT - only read
state.$computed('total', function() {
  return this.price * this.quantity;
});
```

### Pitfall 2: Using Arrow Functions

```js
// WRONG - arrow function
state.$computed('fullName', () => {
  return `${this.firstName} ${this.lastName}`; // 'this' is wrong!
});

// RIGHT - regular function
state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});
```

### Pitfall 3: Circular Dependencies

```js
// WRONG - circular dependency
state.$computed('a', function() {
  return this.b + 1; // Depends on b
});

state.$computed('b', function() {
  return this.a + 1; // Depends on a - CIRCULAR!
});

// RIGHT - no circular dependencies
state.$computed('a', function() {
  return this.value + 1;
});

state.$computed('b', function() {
  return this.a + 1; // OK - depends on a, not circular
});
```

---

## Summary

**`state.$computed()` adds cached, reactive computed properties.**

Key takeaways:
- ✅ **Adds computed property** to state instance
- ✅ **Automatic caching** - efficient performance
- ✅ **Auto-updates** when dependencies change
- ✅ **Reactive** like regular properties
- ✅ Returns **state** for chaining
- ✅ Great for **derived values**, **calculations**, **transformations**
- ⚠️ Use **regular functions**, not arrow functions
- ⚠️ Keep functions **pure** (no side effects)
- ⚠️ Avoid **circular dependencies**

**Remember:** Use `$computed()` for values derived from other state properties. It's efficient, cached, and automatically reactive! 🎉

➡️ Next, explore [`$watch()`]($watch.md) for reacting to changes or [`$batch()`]($batch.md) for batching updates!
