# Understanding `validators.min()` - A Beginner's Guide

## What is `validators.min()`?

`validators.min(minValue)` is a built-in validator that checks if a number is greater than or equal to a minimum value.

Think of it as **minimum value enforcer** - number must be at least this value.

**Alias:** `v.min()` - Use either `validators.min()` or `v.min()`, they're identical.

---

## Why Does This Exist?

### The Problem: Validating Minimum Values

You need to ensure numbers meet minimum requirements:

```javascript
// ❌ Without validator - manual check
if (age < 18) {
  errors.age = 'Must be at least 18';
}

// ✅ With min() - automatic
const form = ReactiveUtils.form({
  age: [0, v.min(18)]
});
```

---

## How Does It Work?

```javascript
validators.min(minValue, message?)
    ↓
Checks value >= minValue
    ↓
Returns error message or null
```

---

## Basic Usage

### Age Validation

```javascript
const form = ReactiveUtils.form({
  age: [0, v.min(18, 'Must be 18 or older')]
});

form.values.age = 16;
console.log(form.errors.age); // 'Must be 18 or older'

form.values.age = 21;
console.log(form.errors.age); // null (valid)
```

### Price Validation

```javascript
const form = ReactiveUtils.form({
  price: [0, v.min(0, 'Price cannot be negative')],
  quantity: [1, v.min(1, 'Quantity must be at least 1')]
});
```

---

## Simple Examples

### Example 1: Product Form

```javascript
const productForm = ReactiveUtils.form({
  price: [0, v.combine([
    v.required(),
    v.min(0.01, 'Price must be at least $0.01')
  ])],
  stock: [0, v.min(0, 'Stock cannot be negative')]
});
```

### Example 2: Age Verification

```javascript
const registrationForm = ReactiveUtils.form({
  age: [0, v.combine([
    v.required(),
    v.min(18, 'You must be 18 or older'),
    v.max(120, 'Please enter a valid age')
  ])]
});
```

---

## Common Patterns

### Pattern 1: Non-Negative

```javascript
v.min(0, 'Cannot be negative')
```

### Pattern 2: Positive

```javascript
v.min(1, 'Must be positive')
```

### Pattern 3: Range

```javascript
v.combine([
  v.min(0),
  v.max(100)
])
```

---

## Summary

### What `validators.min()` Does:

1. ✅ Checks minimum value
2. ✅ Works with numbers
3. ✅ Returns error or null
4. ✅ Custom messages

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({
  age: [0, v.min(18)],
  price: [0, v.min(0, 'Cannot be negative')]
});
```

---

**Remember:** Use `v.min()` for number validation! 🎉
