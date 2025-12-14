# Understanding `validators.maxLength()` - A Beginner's Guide

## What is `validators.maxLength()`?

`validators.maxLength(max)` is a built-in validator that checks if a string doesn't exceed a maximum number of characters.

Think of it as **maximum length enforcer** - value can't be longer than this.

**Alias:** `v.maxLength()` - Use either `validators.maxLength()` or `v.maxLength()`, they're identical.

---

## Why Does This Exist?

### The Problem: Limiting Input Length

You need to ensure inputs don't exceed maximum length:

```javascript
// ❌ Without validator - manual check
if (username.length > 20) {
  errors.username = 'Username must be 20 characters or less';
}

// ✅ With maxLength() - automatic
const form = ReactiveUtils.form({
  username: ['', v.maxLength(20)]
});
```

---

## How Does It Work?

```javascript
validators.maxLength(max, message?)
    ↓
Checks value.length <= max
    ↓
Returns error message or null
```

---

## Basic Usage

### Simple Maximum Length

```javascript
const form = ReactiveUtils.form({
  username: ['', v.maxLength(20)],
  bio: ['', v.maxLength(500)]
});

form.values.username = 'thisusernameiswaytoolong';
console.log(form.errors.username); // 'Must be 20 characters or less'
```

### Custom Error Message

```javascript
const form = ReactiveUtils.form({
  comment: ['', v.maxLength(200, 'Comment must be 200 characters or less')]
});
```

---

## Simple Examples

### Example 1: Character Counter

```javascript
const form = ReactiveUtils.form({
  bio: ['', v.maxLength(500)]
});

ReactiveUtils.effect(() => {
  const counter = document.getElementById('char-counter');
  const remaining = 500 - form.values.bio.length;

  counter.textContent = `${remaining} characters remaining`;
  counter.className = remaining < 50 ? 'warning' : '';
});
```

### Example 2: Tweet-like Input

```javascript
const tweetForm = ReactiveUtils.form({
  message: ['', v.combine([
    v.required(),
    v.maxLength(280, 'Message must be 280 characters or less')
  ])]
});

ReactiveUtils.effect(() => {
  const counter = document.getElementById('tweet-counter');
  const length = tweetForm.values.message.length;

  counter.textContent = `${length}/280`;
  counter.className = length > 280 ? 'over-limit' : '';
});
```

---

## Common Patterns

### Pattern 1: Basic Maximum

```javascript
v.maxLength(100)
```

### Pattern 2: Min and Max Range

```javascript
v.combine([
  v.minLength(5),
  v.maxLength(20)
])
```

---

## Summary

### What `validators.maxLength()` Does:

1. ✅ Checks maximum length
2. ✅ Returns error or null
3. ✅ Custom messages
4. ✅ Works with strings

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({
  username: ['', v.maxLength(20)],
  message: ['', v.maxLength(500, 'Too long!')]
});
```

---

**Remember:** Use `v.maxLength()` for shorter code! 🎉
