# Understanding `computed()` - A Beginner's Guide

## What is `computed()`?

`computed()` is a **standalone utility function** in the Reactive library that adds computed properties to an existing reactive state object. Unlike the `$computed()` method which is available on state objects, this is a global function that can add computed properties to any reactive state.

Think of it as **a decorator for state** - you pass it a state object and define computed properties, and it enhances that state with cached, reactive computed values.

---

## Syntax

```js
// Using the shortcut
computed(state, definitions)

// Using the full namespace
ReactiveUtils.computed(state, definitions)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`computed()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.computed()`) - Explicit and clear

**Parameters:**
- `state` (Object): A reactive state object to add computed properties to
- `definitions` (Object): An object where keys are property names and values are getter functions

**Returns:**
- The same state object (for chaining)

---

## Why Does This Exist?

### The Problem with Manual Computed Values

When you need to add computed properties to an existing state, you need to call `$computed()` multiple times:

```javascript
// Manual approach - repetitive
const cart = state({
  items: [],
  taxRate: 0.1
});

cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => sum + item.price, 0);
});

cart.$computed('tax', function() {
  return this.subtotal * this.taxRate;
});

cart.$computed('total', function() {
  return this.subtotal + this.tax;
});

cart.$computed('itemCount', function() {
  return this.items.length;
});

// Repetitive and verbose
```

**What's the Real Issue?**

**Problems:**
- Must call `$computed()` separately for each property
- Repetitive code structure
- Hard to see all computed properties at once
- More verbose than necessary
- Scattered definition

**Why This Becomes a Problem:**

For multiple computed properties:
❌ Too many separate method calls
❌ No clear grouping
❌ Hard to understand the full computation picture
❌ More code to maintain

In other words, **defining multiple computed properties is too verbose**.
There should be a way to define them all at once.

---

### The Solution with `computed()`

When you use `computed()`, you define all computed properties in one call:

```javascript
// Clean approach - all in one place
const cart = state({
  items: [],
  taxRate: 0.1
});

computed(cart, {
  subtotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  },
  tax() {
    return this.subtotal * this.taxRate;
  },
  total() {
    return this.subtotal + this.tax;
  },
  itemCount() {
    return this.items.length;
  }
});

// Clean, organized, and easy to understand!
```

**What Just Happened?**

With `computed()`:
- All computed properties defined in one object
- Clear and organized structure
- Easy to see all computations at once
- Less code, more readable
- Can chain with other operations

**Benefits:**
- Single function call
- Organized definition
- Clear mental model
- Better readability
- Supports chaining

---

## How Does It Work?

### Under the Hood

`computed()` iterates over the definitions and adds each as a computed property:

```
computed(state, definitions)
        ↓
For each key-value pair in definitions:
  1. Add computed property to state
  2. Set up dependency tracking
  3. Cache the computed value
        ↓
Returns the enhanced state object
```

**What happens:**

1. Takes a reactive state object
2. Iterates over the definitions object
3. For each property, calls the internal `addComputed` function
4. Each computed property automatically tracks dependencies
5. Values are cached and only recomputed when dependencies change
6. Returns the state object for chaining

---

## Basic Usage

### Adding Computed Properties

The simplest way to use `computed()`:

```js
// Using the shortcut style
const user = state({
  firstName: 'John',
  lastName: 'Doe'
});

computed(user, {
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
});

// Or using the namespace style
ReactiveUtils.computed(user, {
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
});

console.log(user.fullName); // "John Doe"
user.firstName = 'Jane';
console.log(user.fullName); // "Jane Doe"
```

### Multiple Computed Properties

Define several computed properties at once:

```js
const product = state({
  price: 100,
  quantity: 2,
  taxRate: 0.1,
  discount: 0.15
});

computed(product, {
  subtotal() {
    return this.price * this.quantity;
  },
  discountAmount() {
    return this.subtotal * this.discount;
  },
  afterDiscount() {
    return this.subtotal - this.discountAmount;
  },
  tax() {
    return this.afterDiscount * this.taxRate;
  },
  total() {
    return this.afterDiscount + this.tax;
  }
});

console.log(product.total); // Computed automatically
```

### Chaining with State Creation

Chain with state creation for clean initialization:

```js
const app = computed(
  state({
    count: 0,
    step: 1
  }),
  {
    doubled() {
      return this.count * 2;
    },
    isEven() {
      return this.count % 2 === 0;
    }
  }
);

console.log(app.doubled); // 0
console.log(app.isEven);  // true
```

### Dependent Computed Properties

Computed properties can depend on other computed properties:

```js
const numbers = state({
  values: [1, 2, 3, 4, 5]
});

computed(numbers, {
  sum() {
    return this.values.reduce((a, b) => a + b, 0);
  },
  average() {
    return this.sum / this.values.length;
  },
  variance() {
    const avg = this.average;
    return this.values.reduce((sum, val) => {
      return sum + Math.pow(val - avg, 2);
    }, 0) / this.values.length;
  },
  stdDev() {
    return Math.sqrt(this.variance);
  }
});
```

---

## Common Use Cases

### Use Case 1: Shopping Cart Calculations

Calculate cart totals:

```js
const cart = state({
  items: [
    { name: 'Apple', price: 1.5, quantity: 3 },
    { name: 'Banana', price: 0.8, quantity: 5 }
  ],
  taxRate: 0.1,
  shippingCost: 5.99,
  couponDiscount: 0.1
});

computed(cart, {
  subtotal() {
    return this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  },

  discountAmount() {
    return this.subtotal * this.couponDiscount;
  },

  afterDiscount() {
    return this.subtotal - this.discountAmount;
  },

  tax() {
    return this.afterDiscount * this.taxRate;
  },

  total() {
    return this.afterDiscount + this.tax + this.shippingCost;
  },

  itemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
});

// Use in UI
effect(() => {
  document.getElementById('subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
  document.getElementById('discount').textContent = `-$${cart.discountAmount.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${cart.tax.toFixed(2)}`;
  document.getElementById('shipping').textContent = `$${cart.shippingCost.toFixed(2)}`;
  document.getElementById('total').textContent = `$${cart.total.toFixed(2)}`;
  document.getElementById('itemCount').textContent = cart.itemCount;
});
```

### Use Case 2: Form Validation Status

Track validation state:

```js
const form = state({
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  errors: {}
});

computed(form, {
  emailValid() {
    return this.email.includes('@') && this.email.includes('.');
  },

  passwordValid() {
    return this.password.length >= 8 && /[A-Z]/.test(this.password);
  },

  passwordsMatch() {
    return this.password === this.confirmPassword;
  },

  hasErrors() {
    return Object.keys(this.errors).length > 0;
  },

  isValid() {
    return this.emailValid &&
           this.passwordValid &&
           this.passwordsMatch &&
           this.agreeToTerms &&
           !this.hasErrors;
  },

  canSubmit() {
    return this.isValid && this.email && this.password;
  }
});

// Use in UI
effect(() => {
  document.getElementById('submitBtn').disabled = !form.canSubmit;
});

effect(() => {
  const emailInput = document.getElementById('email');
  emailInput.className = form.emailValid ? 'valid' : 'invalid';
});
```

### Use Case 3: User Profile Display

Format user data:

```js
const user = state({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  dateOfBirth: '1990-05-15',
  city: 'New York',
  country: 'USA',
  followers: 1234,
  following: 567
});

computed(user, {
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  initials() {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
  },

  age() {
    const dob = new Date(this.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  },

  location() {
    return `${this.city}, ${this.country}`;
  },

  followerCount() {
    if (this.followers >= 1000000) {
      return `${(this.followers / 1000000).toFixed(1)}M`;
    } else if (this.followers >= 1000) {
      return `${(this.followers / 1000).toFixed(1)}K`;
    }
    return this.followers.toString();
  },

  followRatio() {
    return this.following > 0 ? (this.followers / this.following).toFixed(2) : 0;
  }
});

// Use in UI
effect(() => {
  document.getElementById('userName').textContent = user.fullName;
  document.getElementById('userInitials').textContent = user.initials;
  document.getElementById('userAge').textContent = `${user.age} years old`;
  document.getElementById('userLocation').textContent = user.location;
  document.getElementById('followerCount').textContent = user.followerCount;
});
```

### Use Case 4: Data Analytics

Calculate statistics:

```js
const analytics = state({
  pageViews: [120, 145, 189, 167, 198, 223, 201],
  bounceRates: [0.45, 0.42, 0.38, 0.41, 0.35, 0.33, 0.37],
  conversions: [12, 15, 18, 16, 21, 24, 20]
});

computed(analytics, {
  totalPageViews() {
    return this.pageViews.reduce((a, b) => a + b, 0);
  },

  avgPageViews() {
    return this.totalPageViews / this.pageViews.length;
  },

  avgBounceRate() {
    const sum = this.bounceRates.reduce((a, b) => a + b, 0);
    return (sum / this.bounceRates.length * 100).toFixed(2);
  },

  totalConversions() {
    return this.conversions.reduce((a, b) => a + b, 0);
  },

  conversionRate() {
    return ((this.totalConversions / this.totalPageViews) * 100).toFixed(2);
  },

  trend() {
    const recent = this.pageViews.slice(-3);
    const previous = this.pageViews.slice(-6, -3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

    if (recentAvg > previousAvg * 1.1) return 'up';
    if (recentAvg < previousAvg * 0.9) return 'down';
    return 'stable';
  }
});

// Use in dashboard
effect(() => {
  document.getElementById('totalViews').textContent = analytics.totalPageViews;
  document.getElementById('avgViews').textContent = analytics.avgPageViews.toFixed(0);
  document.getElementById('bounceRate').textContent = `${analytics.avgBounceRate}%`;
  document.getElementById('conversionRate').textContent = `${analytics.conversionRate}%`;

  const trendIcon = document.getElementById('trendIcon');
  trendIcon.className = `trend-${analytics.trend}`;
  trendIcon.textContent = analytics.trend === 'up' ? '↑' : analytics.trend === 'down' ? '↓' : '→';
});
```

### Use Case 5: Game Score System

Track game statistics:

```js
const game = state({
  score: 0,
  level: 1,
  lives: 3,
  timeElapsed: 0,
  enemiesDefeated: 0,
  itemsCollected: 0,
  accuracy: 0.85,
  multiplier: 1
});

computed(game, {
  finalScore() {
    return this.score * this.multiplier;
  },

  pointsPerSecond() {
    return this.timeElapsed > 0 ? (this.score / this.timeElapsed).toFixed(2) : 0;
  },

  effectiveLevel() {
    return Math.floor(this.score / 1000) + 1;
  },

  nextLevelAt() {
    return this.effectiveLevel * 1000;
  },

  progressToNextLevel() {
    const currentLevelStart = (this.effectiveLevel - 1) * 1000;
    const progress = this.score - currentLevelStart;
    return (progress / 1000 * 100).toFixed(1);
  },

  rank() {
    if (this.finalScore >= 10000) return 'S';
    if (this.finalScore >= 7500) return 'A';
    if (this.finalScore >= 5000) return 'B';
    if (this.finalScore >= 2500) return 'C';
    return 'D';
  },

  stars() {
    const score = this.finalScore;
    if (score >= 10000) return 5;
    if (score >= 7500) return 4;
    if (score >= 5000) return 3;
    if (score >= 2500) return 2;
    if (score >= 1000) return 1;
    return 0;
  },

  isAlive() {
    return this.lives > 0;
  }
});

// Use in game UI
effect(() => {
  document.getElementById('score').textContent = game.finalScore;
  document.getElementById('level').textContent = game.effectiveLevel;
  document.getElementById('lives').textContent = game.lives;
  document.getElementById('rank').textContent = game.rank;
  document.getElementById('stars').textContent = '★'.repeat(game.stars);
  document.getElementById('progress').style.width = `${game.progressToNextLevel}%`;
});
```

---

## Advanced Patterns

### Pattern 1: Computed Properties with Complex Logic

Handle complex calculations:

```js
const inventory = state({
  products: [
    { id: 1, name: 'A', stock: 10, minStock: 5, price: 10 },
    { id: 2, name: 'B', stock: 2, minStock: 5, price: 20 },
    { id: 3, name: 'C', stock: 0, minStock: 5, price: 15 }
  ]
});

computed(inventory, {
  lowStockItems() {
    return this.products.filter(p => p.stock <= p.minStock && p.stock > 0);
  },

  outOfStockItems() {
    return this.products.filter(p => p.stock === 0);
  },

  totalValue() {
    return this.products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  },

  alerts() {
    const alerts = [];
    if (this.lowStockItems.length > 0) {
      alerts.push(`${this.lowStockItems.length} items low on stock`);
    }
    if (this.outOfStockItems.length > 0) {
      alerts.push(`${this.outOfStockItems.length} items out of stock`);
    }
    return alerts;
  }
});
```

### Pattern 2: Combining Multiple States

Compute from multiple state objects:

```js
const user = state({
  id: 1,
  isLoggedIn: true,
  isPremium: true
});

const content = state({
  articles: [
    { id: 1, title: 'Free Article', premium: false },
    { id: 2, title: 'Premium Article', premium: true }
  ]
});

computed(content, {
  availableArticles() {
    if (!user.isLoggedIn) {
      return this.articles.filter(a => !a.premium);
    }
    if (user.isPremium) {
      return this.articles;
    }
    return this.articles.filter(a => !a.premium);
  }
});
```

### Pattern 3: Memoized Expensive Calculations

Cache expensive computations:

```js
const data = state({
  largeDataset: Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    value: Math.random() * 100
  }))
});

computed(data, {
  sortedData() {
    // Expensive sort - only recalculated when largeDataset changes
    return [...this.largeDataset].sort((a, b) => b.value - a.value);
  },

  top10() {
    // Uses cached sortedData
    return this.sortedData.slice(0, 10);
  },

  percentiles() {
    // Expensive calculation - cached
    const sorted = this.sortedData;
    return {
      p25: sorted[Math.floor(sorted.length * 0.25)].value,
      p50: sorted[Math.floor(sorted.length * 0.5)].value,
      p75: sorted[Math.floor(sorted.length * 0.75)].value,
      p90: sorted[Math.floor(sorted.length * 0.9)].value
    };
  }
});
```

### Pattern 4: Conditional Computed Properties

Add computeds conditionally:

```js
function setupComputedProperties(state, options = {}) {
  const computedDefs = {
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  };

  if (options.includeAge) {
    computedDefs.age = function() {
      const today = new Date();
      const dob = new Date(this.dateOfBirth);
      return today.getFullYear() - dob.getFullYear();
    };
  }

  if (options.includeLocation) {
    computedDefs.location = function() {
      return `${this.city}, ${this.state}, ${this.country}`;
    };
  }

  computed(state, computedDefs);
}

const user = state({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  city: 'NYC',
  state: 'NY',
  country: 'USA'
});

setupComputedProperties(user, {
  includeAge: true,
  includeLocation: true
});
```

---

## Performance Tips

### Tip 1: Keep Computed Functions Pure

Don't modify state in computed properties:

```js
// BAD - modifying state
computed(state, {
  doubled() {
    this.count++; // DON'T DO THIS
    return this.count * 2;
  }
});

// GOOD - pure function
computed(state, {
  doubled() {
    return this.count * 2; // Only read, don't write
  }
});
```

### Tip 2: Avoid Heavy Computations in Getters

Move expensive work outside or cache results:

```js
// Less efficient - sorts on every access
computed(state, {
  sortedItems() {
    return this.items.sort((a, b) => a.value - b.value);
  }
});

// Better - sorts only when items change (automatic with computed)
```

### Tip 3: Use Computed for Derived Values, Not Side Effects

```js
// BAD - side effects
computed(state, {
  itemCount() {
    console.log('Counting...'); // Side effect
    return this.items.length;
  }
});

// GOOD - pure computation
computed(state, {
  itemCount() {
    return this.items.length;
  }
});
```

---

## Common Pitfalls

### Pitfall 1: Modifying State in Computed

**Problem:** Computed properties should only read, not write:

```js
// WRONG - modifying state
computed(cart, {
  total() {
    this.isCalculating = true; // DON'T modify in computed!
    return this.subtotal + this.tax;
  }
});

// RIGHT - only read values
computed(cart, {
  total() {
    return this.subtotal + this.tax; // Just compute and return
  }
});
```

### Pitfall 2: Using Arrow Functions

**Problem:** Arrow functions don't bind `this` correctly:

```js
// WRONG - arrow function
computed(user, {
  fullName: () => {
    return `${this.firstName} ${this.lastName}`; // 'this' is wrong!
  }
});

// RIGHT - regular function
computed(user, {
  fullName() {
    return `${this.firstName} ${this.lastName}`; // 'this' works correctly
  }
});
```

### Pitfall 3: Circular Dependencies

**Problem:** Computed properties that depend on each other in a circle:

```js
// BAD - circular dependency
computed(state, {
  a() {
    return this.b + 1; // Depends on b
  },
  b() {
    return this.a + 1; // Depends on a - CIRCULAR!
  }
});

// GOOD - no circular dependencies
computed(state, {
  a() {
    return this.value + 1;
  },
  b() {
    return this.a + 1; // OK - depends on a, not circular
  }
});
```

### Pitfall 4: Not Returning a Value

**Problem:** Forgetting to return from computed function:

```js
// WRONG - no return
computed(state, {
  total() {
    this.subtotal + this.tax; // Forgot 'return'!
  }
});

// RIGHT - return the value
computed(state, {
  total() {
    return this.subtotal + this.tax;
  }
});
```

---

## Summary

**`computed()` adds multiple computed properties to state in one call.**

Key takeaways:
- ✅ **Standalone utility** for adding computed properties
- ✅ Both **shortcut** (`computed()`) and **namespace** (`ReactiveUtils.computed()`) styles are valid
- ✅ Takes a **state object** and **definitions object**
- ✅ Defines **multiple computed properties** at once
- ✅ Supports **chaining** - returns the state object
- ✅ Computed properties are **cached** and **reactive**
- ✅ Dependencies are **tracked automatically**
- ⚠️ Use **regular functions**, not arrow functions
- ⚠️ Computed properties should be **pure** (no side effects)
- ⚠️ Always **return a value** from computed functions

**Remember:** `computed()` is perfect for adding multiple computed properties to a state object in a clean, organized way. Use it to define all your derived values in one place! 🎉

➡️ Next, explore [`watch()`](watch.md) for watching state changes or [`effect()`](effect.md) for reactive side effects!
