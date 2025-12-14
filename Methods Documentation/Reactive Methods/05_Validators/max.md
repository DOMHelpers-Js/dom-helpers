# Understanding `validators.max()` - A Beginner's Guide

## What is `validators.max()`?

`validators.max(maxValue)` is a built-in validator that checks if a number is less than or equal to a maximum value.

Think of it as **maximum value enforcer** - number can't exceed this value.

**Alias:** `v.max()` - Use either `validators.max()` or `v.max()`, they're identical.

---

## Why Does This Exist?

### The Problem: Validating Maximum Values

You need to ensure numbers don't exceed limits:

```javascript
// ❌ Without validator - manual check
if (quantity > 100) {
  errors.quantity = 'Cannot exceed 100';
}

// ✅ With max() - automatic
const form = ReactiveUtils.form({
  quantity: [1, v.max(100)]
});
```

---

## How Does It Work?

```javascript
validators.max(maxValue, message?)
    ↓
Checks value <= maxValue
    ↓
Returns error message or null
```

---

## Basic Usage

### Quantity Limit

```javascript
const form = ReactiveUtils.form({
  quantity: [1, v.max(100, 'Maximum quantity is 100')]
});

form.values.quantity = 150;
console.log(form.errors.quantity); // 'Maximum quantity is 100'

form.values.quantity = 50;
console.log(form.errors.quantity); // null (valid)
```

### Age Limit

```javascript
const form = ReactiveUtils.form({
  age: [0, v.max(120, 'Please enter a valid age')]
});
```

---

## Simple Examples

### Example 1: Order Form

```javascript
const orderForm = ReactiveUtils.form({
  quantity: [1, v.combine([
    v.min(1, 'Minimum 1'),
    v.max(10, 'Maximum 10 per order')
  ])]
});
```

### Example 2: Discount Code

```javascript
const form = ReactiveUtils.form({
  discountPercent: [0, v.combine([
    v.min(0),
    v.max(100, 'Discount cannot exceed 100%')
  ])]
});
```

---

## Common Patterns

### Pattern 1: Percentage

```javascript
v.combine([v.min(0), v.max(100)])
```

### Pattern 2: Rating

```javascript
v.combine([v.min(1), v.max(5)])
```

---

## Summary

### What `validators.max()` Does:

1. ✅ Checks maximum value
2. ✅ Works with numbers
3. ✅ Returns error or null
4. ✅ Custom messages

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({
  quantity: [1, v.max(100)],
  percent: [0, v.max(100, 'Cannot exceed 100%')]
});
```

---

**Remember:** Use `v.max()` for number limits! 🎉
