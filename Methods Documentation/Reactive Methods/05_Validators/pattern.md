# Understanding `validators.pattern()` - A Beginner's Guide

## What is `validators.pattern()`?

`validators.pattern(regex)` is a built-in validator that checks if a value matches a regular expression pattern.

Think of it as **pattern matcher** - does the value match this pattern?

**Alias:** `v.pattern()` - Use either `validators.pattern()` or `v.pattern()`, they're identical.

---

## Why Does This Exist?

### The Problem: Custom Format Validation

You need to validate custom formats like phone numbers, postal codes, etc:

```javascript
// ❌ Without validator - manual regex check
const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
if (!phoneRegex.test(phone)) {
  errors.phone = 'Invalid phone format';
}

// ✅ With pattern() - automatic
const form = ReactiveUtils.form({
  phone: ['', v.pattern(/^\d{3}-\d{3}-\d{4}$/)]
});
```

---

## How Does It Work?

```javascript
validators.pattern(regex, message?)
    ↓
Tests value against regex
    ↓
Returns error message or null
```

---

## Basic Usage

### Phone Number Validation

```javascript
const form = ReactiveUtils.form({
  phone: ['', v.pattern(/^\d{3}-\d{3}-\d{4}$/, 'Format: 123-456-7890')]
});

form.values.phone = '1234567890';
console.log(form.errors.phone); // Error

form.values.phone = '123-456-7890';
console.log(form.errors.phone); // null (valid)
```

### Postal Code

```javascript
const form = ReactiveUtils.form({
  zipCode: ['', v.pattern(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')]
});
```

### Username Format

```javascript
const form = ReactiveUtils.form({
  username: ['', v.pattern(/^[a-zA-Z0-9_]{3,20}$/, 'Letters, numbers, underscores only')]
});
```

---

## Simple Examples

### Example 1: US Phone Number

```javascript
const form = ReactiveUtils.form({
  phone: ['', v.combine([
    v.required(),
    v.pattern(/^\(\d{3}\) \d{3}-\d{4}$/, 'Format: (123) 456-7890')
  ])]
});
```

### Example 2: Credit Card (simplified)

```javascript
const form = ReactiveUtils.form({
  cardNumber: ['', v.pattern(/^\d{4} \d{4} \d{4} \d{4}$/, 'Format: 1234 5678 9012 3456')]
});
```

---

## Common Patterns

### Pattern 1: Phone Numbers

```javascript
v.pattern(/^\d{3}-\d{3}-\d{4}$/) // 123-456-7890
v.pattern(/^\(\d{3}\) \d{3}-\d{4}$/) // (123) 456-7890
```

### Pattern 2: Postal Codes

```javascript
v.pattern(/^\d{5}$/) // US ZIP
v.pattern(/^[A-Z]\d[A-Z] \d[A-Z]\d$/) // Canadian
```

### Pattern 3: Alphanumeric

```javascript
v.pattern(/^[a-zA-Z0-9]+$/)
```

---

## Summary

### What `validators.pattern()` Does:

1. ✅ Tests against regex
2. ✅ Custom format validation
3. ✅ Returns error or null
4. ✅ Custom messages

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({
  field: ['', v.pattern(/regex/, 'Error message')]
});
```

---

**Remember:** Use `v.pattern()` for custom validation patterns! 🎉
