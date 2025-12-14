# Understanding `validators.minLength()` - A Beginner's Guide

## What is `validators.minLength()`?

`validators.minLength(min)` is a built-in validator that checks if a string has at least a minimum number of characters.

Think of it as **minimum length enforcer** - value must be this long.

**Alias:** `v.minLength()` - Use either `validators.minLength()` or `v.minLength()`, they're identical.

---

## Why Does This Exist?

### The Problem: Enforcing Minimum Length

You need to ensure inputs meet minimum length requirements:

```javascript
// ❌ Without validator - manual check
if (password.length < 8) {
  errors.password = 'Password must be at least 8 characters';
}

// ✅ With minLength() - automatic
const form = ReactiveUtils.form({
  password: ['', v.minLength(8)]
});
```

---

## How Does It Work?

```javascript
validators.minLength(min, message?)
    ↓
Checks value.length >= min
    ↓
Returns error message or null
```

---

## Basic Usage

### Simple Minimum Length

```javascript
const form = ReactiveUtils.form({
  username: ['', v.minLength(3)],
  password: ['', v.minLength(8)]
});

form.values.username = 'ab';
console.log(form.errors.username); // 'Must be at least 3 characters'

form.values.username = 'john';
console.log(form.errors.username); // null (valid)
```

### Custom Error Message

```javascript
const form = ReactiveUtils.form({
  password: ['', v.minLength(8, 'Password must be at least 8 characters long')]
});
```

---

## Simple Examples

### Example 1: Password Strength

```javascript
const form = ReactiveUtils.form({
  password: ['', v.combine([
    v.required('Password is required'),
    v.minLength(8, 'Password must be at least 8 characters'),
    v.maxLength(50, 'Password must be less than 50 characters')
  ])]
});

// Display password strength
ReactiveUtils.effect(() => {
  const indicator = document.getElementById('password-strength');
  const password = form.values.password;

  if (password.length === 0) {
    indicator.innerHTML = '';
  } else if (password.length < 8) {
    indicator.innerHTML = '<span class="weak">Weak (too short)</span>';
  } else if (password.length < 12) {
    indicator.innerHTML = '<span class="medium">Medium</span>';
  } else {
    indicator.innerHTML = '<span class="strong">Strong</span>';
  }
});
```

### Example 2: Text Input Validation

```javascript
const form = ReactiveUtils.form({
  title: ['', v.combine([
    v.required(),
    v.minLength(5, 'Title must be at least 5 characters')
  ])],
  description: ['', v.combine([
    v.required(),
    v.minLength(20, 'Description must be at least 20 characters')
  ])]
});

// Character counter
ReactiveUtils.effect(() => {
  document.getElementById('title-count').textContent =
    `${form.values.title.length}/5 minimum`;
  document.getElementById('desc-count').textContent =
    `${form.values.description.length}/20 minimum`;
});
```

---

## Common Patterns

### Pattern 1: Basic Minimum

```javascript
v.minLength(3)
```

### Pattern 2: With Required

```javascript
v.combine([
  v.required(),
  v.minLength(5)
])
```

### Pattern 3: Min and Max

```javascript
v.combine([
  v.minLength(3),
  v.maxLength(20)
])
```

---

## Summary

### What `validators.minLength()` Does:

1. ✅ Checks minimum length
2. ✅ Returns error or null
3. ✅ Custom messages
4. ✅ Works with strings

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({
  username: ['', v.minLength(3)],
  password: ['', v.minLength(8, 'Password too short')]
});
```

---

**Remember:** Use `v.minLength()` for shorter code! 🎉
