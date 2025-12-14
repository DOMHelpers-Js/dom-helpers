# Understanding `computed()` (Builder) - A Beginner's Guide

## What is `computed()` (Builder)?

`computed()` is a builder method that adds computed properties to your state before building it. It's part of the builder pattern for creating reactive states.

Think of it as **computed property builder** - define computed values while building your state.

---

## Why Does This Exist?

### The Problem: Adding Computed After Creation

Without builder, you add computed separately:

```javascript
// ❌ Without builder - separate steps
const state = ReactiveUtils.state({ firstName: 'John', lastName: 'Doe' });

ReactiveUtils.computed(() => {
  state.fullName = `${state.firstName} ${state.lastName}`;
});

// ✅ With builder - all in one
const state = ReactiveUtils.builder()
  .state({ firstName: 'John', lastName: 'Doe' })
  .computed('fullName', (s) => `${s.firstName} ${s.lastName}`)
  .build();
```

**Why this matters:**
- Define everything upfront
- Clean builder pattern
- All setup in one place
- Better organization

---

## How Does It Work?

### The Builder Chain

```javascript
ReactiveUtils.builder()
  .state({ count: 0 })
  .computed('double', (s) => s.count * 2)  // Add computed
  .build();  // Create final state
```

---

## Basic Usage

### Single Computed Property

```javascript
const state = ReactiveUtils.builder()
  .state({ radius: 5 })
  .computed('area', (s) => Math.PI * s.radius ** 2)
  .build();

console.log(state.area); // Computed automatically
```

### Multiple Computed Properties

```javascript
const state = ReactiveUtils.builder()
  .state({ width: 10, height: 20 })
  .computed('area', (s) => s.width * s.height)
  .computed('perimeter', (s) => 2 * (s.width + s.height))
  .build();

console.log(state.area);      // 200
console.log(state.perimeter); // 60
```

### Computed Depending on Other Computed

```javascript
const state = ReactiveUtils.builder()
  .state({ price: 100, quantity: 3 })
  .computed('subtotal', (s) => s.price * s.quantity)
  .computed('tax', (s) => s.subtotal * 0.1)
  .computed('total', (s) => s.subtotal + s.tax)
  .build();

console.log(state.total); // 330
```

---

## Simple Examples Explained

### Example 1: User Profile

```javascript
const user = ReactiveUtils.builder()
  .state({
    firstName: 'John',
    lastName: 'Doe',
    age: 30
  })
  .computed('fullName', (s) => `${s.firstName} ${s.lastName}`)
  .computed('isAdult', (s) => s.age >= 18)
  .computed('initials', (s) => s.firstName[0] + s.lastName[0])
  .build();

console.log(user.fullName);  // 'John Doe'
console.log(user.isAdult);   // true
console.log(user.initials);  // 'JD'

user.firstName = 'Jane';
console.log(user.fullName);  // 'Jane Doe' (auto-updates!)
```

---

### Example 2: Shopping Cart

```javascript
const cart = ReactiveUtils.builder()
  .state({
    items: [
      { name: 'Apple', price: 1.5, qty: 3 },
      { name: 'Bread', price: 2.5, qty: 2 }
    ],
    taxRate: 0.08,
    discount: 0
  })
  .computed('subtotal', (s) =>
    s.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  )
  .computed('tax', (s) => s.subtotal * s.taxRate)
  .computed('total', (s) => s.subtotal + s.tax - s.discount)
  .computed('itemCount', (s) => s.items.length)
  .build();

console.log(cart.subtotal);  // 9.5
console.log(cart.tax);       // 0.76
console.log(cart.total);     // 10.26
console.log(cart.itemCount); // 2
```

---

### Example 3: Form Validation

```javascript
const form = ReactiveUtils.builder()
  .state({
    email: '',
    password: '',
    confirmPassword: ''
  })
  .computed('isEmailValid', (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email))
  .computed('isPasswordValid', (s) => s.password.length >= 8)
  .computed('passwordsMatch', (s) => s.password === s.confirmPassword)
  .computed('isFormValid', (s) =>
    s.isEmailValid && s.isPasswordValid && s.passwordsMatch
  )
  .build();

form.email = 'test@example.com';
form.password = 'secure123';
form.confirmPassword = 'secure123';

console.log(form.isFormValid); // true
```

---

## Real-World Example: Dashboard Stats

```javascript
const dashboard = ReactiveUtils.builder()
  .state({
    users: [
      { name: 'John', role: 'admin', active: true },
      { name: 'Jane', role: 'user', active: true },
      { name: 'Bob', role: 'user', active: false }
    ],
    posts: [
      { title: 'Post 1', published: true, views: 100 },
      { title: 'Post 2', published: true, views: 200 },
      { title: 'Post 3', published: false, views: 0 }
    ]
  })
  .computed('totalUsers', (s) => s.users.length)
  .computed('activeUsers', (s) => s.users.filter(u => u.active).length)
  .computed('adminCount', (s) => s.users.filter(u => u.role === 'admin').length)
  .computed('totalPosts', (s) => s.posts.length)
  .computed('publishedPosts', (s) => s.posts.filter(p => p.published).length)
  .computed('totalViews', (s) => s.posts.reduce((sum, p) => sum + p.views, 0))
  .computed('avgViews', (s) => s.totalViews / s.publishedPosts || 0)
  .build();

// Display in UI
ReactiveUtils.effect(() => {
  document.getElementById('total-users').textContent = dashboard.totalUsers;
  document.getElementById('active-users').textContent = dashboard.activeUsers;
  document.getElementById('total-posts').textContent = dashboard.totalPosts;
  document.getElementById('avg-views').textContent = dashboard.avgViews.toFixed(1);
});
```

---

## Common Patterns

### Pattern 1: Simple Computed

```javascript
const state = ReactiveUtils.builder()
  .state({ value: 10 })
  .computed('double', (s) => s.value * 2)
  .build();
```

### Pattern 2: Multiple Computed

```javascript
const state = ReactiveUtils.builder()
  .state({ a: 1, b: 2 })
  .computed('sum', (s) => s.a + s.b)
  .computed('product', (s) => s.a * s.b)
  .build();
```

### Pattern 3: Chained Computed

```javascript
const state = ReactiveUtils.builder()
  .state({ n: 5 })
  .computed('squared', (s) => s.n ** 2)
  .computed('cubed', (s) => s.squared * s.n)
  .build();
```

---

## Common Questions

### Q: Can computed depend on other computed?

**Answer:** Yes!

```javascript
const state = ReactiveUtils.builder()
  .state({ price: 100 })
  .computed('subtotal', (s) => s.price * 2)
  .computed('total', (s) => s.subtotal * 1.1)
  .build();
```

### Q: Does it update automatically?

**Answer:** Yes! It's reactive:

```javascript
state.price = 200;
console.log(state.total); // Updates automatically
```

### Q: Can I use arrow functions?

**Answer:** Yes, recommended:

```javascript
.computed('double', (s) => s.value * 2)
```

---

## Tips for Success

### 1. Use Descriptive Names

```javascript
// ✅ Clear names
.computed('totalPrice', (s) => ...)
.computed('isValid', (s) => ...)
```

### 2. Keep Computed Simple

```javascript
// ✅ Simple calculations
.computed('sum', (s) => s.a + s.b)

// ❌ Avoid side effects
.computed('value', (s) => {
  console.log('Side effect!'); // Don't do this
  return s.a;
})
```

### 3. Chain Multiple Computed

```javascript
// ✅ Break down complex logic
.computed('subtotal', (s) => ...)
.computed('tax', (s) => ...)
.computed('total', (s) => ...)
```

---

## Summary

### What `computed()` Does:

1. ✅ Adds computed property to builder
2. ✅ Takes name and function
3. ✅ Function receives state as parameter
4. ✅ Returns builder for chaining
5. ✅ Computed updates automatically

### When to Use It:

- Building state with computed values
- Derived data needs
- Automatic calculations
- Form validation
- Dashboard statistics

### The Basic Pattern:

```javascript
const state = ReactiveUtils.builder()
  .state({ value: 10 })
  .computed('double', (s) => s.value * 2)
  .build();

console.log(state.double); // 20
state.value = 20;
console.log(state.double); // 40 (auto-updates!)
```

---

**Remember:** `computed()` is part of the builder pattern. Use it to add computed properties when building your state! 🎉
