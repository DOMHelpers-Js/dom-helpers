[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Validation and Serialization

## Quick Start (30 seconds)

```javascript
// Validate with custom rules
const { isValid, errors, values } = Forms.signupForm.validate({
  email:    { required: true, email: true },
  password: { required: true, minLength: 8 },
  age:      value => Number(value) >= 18 ? null : 'Must be 18 or older'
});

if (isValid) {
  console.log('All good!', values);
} else {
  console.log('Errors:', errors);
  // → { password: 'Minimum length is 8 characters' }
}

// Serialize for different uses
const obj  = Forms.signupForm.serialize();             // plain object
const json = Forms.signupForm.serialize('json');       // JSON string
const fd   = Forms.signupForm.serialize('formdata');   // FormData
const qs   = Forms.signupForm.serialize('urlencoded'); // "email=alice%40..."
```

---

## What Is `.validate()`?

`.validate(rules)` runs a two-step validation process on your form:

1. **Native HTML5 validation** — checks `required`, `type="email"`, `min`, `max`, `pattern`, etc.
2. **Your custom rules** — any additional checks you define

It returns an object with three properties:

```javascript
const result = Forms.myForm.validate(rules);

result.isValid  // → true or false
result.errors   // → { fieldName: 'error message', ... }
result.values   // → { fieldName: value, ... } (the current values)
```

---

## Validation Rules Format

You can define rules for each field in two ways:

### Format 1: Object with built-in rule names

```javascript
Forms.myForm.validate({
  username: {
    required:  true,
    minLength: 3,
    maxLength: 20,
    pattern:   '^[a-zA-Z0-9_]+$'   // regex as a string
  },
  email: {
    required: true,
    email:    true
  },
  age: {
    required: true,
    custom: (value) => Number(value) >= 18 ? null : 'Must be 18 or older'
  }
});
```

**Available built-in rule names:**

| Rule | Type | What it checks |
|---|---|---|
| `required` | `true` | Field must not be empty |
| `email` | `true` | Must be a valid email format |
| `minLength` | `number` | Minimum character count |
| `maxLength` | `number` | Maximum character count |
| `pattern` | `string` | Must match this regex pattern |
| `custom` | `function` | Your own validation function |

### Format 2: Function rule

Pass a function directly. The function receives `(value, allValues, fieldElement)` and should return:
- `null` or `undefined` or `true` — the field is valid
- A string — the error message to display

```javascript
Forms.myForm.validate({
  // Function format — maximum flexibility
  confirmPassword: (value, allValues) => {
    if (!value) return 'Please confirm your password';
    if (value !== allValues.password) return 'Passwords do not match';
    return null; // ← null means valid
  },

  // Another function rule
  username: (value) => {
    if (!value || !value.trim()) return 'Username is required';
    if (value.length < 3) return 'Too short — minimum 3 characters';
    if (/[^a-zA-Z0-9_]/.test(value)) return 'Only letters, numbers, and _ allowed';
    return null; // valid
  }
});
```

---

## How Validation Works Internally

```
form.validate(rules)
       ↓
Step 1: clearFormValidation()   ← removes previous error state
       ↓
Step 2: form.checkValidity()    ← native HTML5 check
       ↓
   :invalid fields? → mark with .form-invalid + show error message
       ↓
Step 3: for each field in rules
       ↓
   already has native error? → skip (native wins)
       ↓
   run custom rule function or object rules
       ↓
   rule fails? → mark field + show error message
       ↓
Return { isValid, errors, values }
```

When a field fails validation, the Forms module:
1. Adds the `form-invalid` CSS class to the field element
2. Sets `aria-invalid="true"` for accessibility
3. Inserts a `<div class="form-error-message">` immediately after the field

---

## Real-World Validation Examples

### Basic Login Form

```javascript
document.getElementById('loginBtn').addEventListener('click', () => {
  const { isValid, errors } = Forms.loginForm.validate({
    email:    { required: true, email: true },
    password: { required: true, minLength: 6 }
  });

  if (!isValid) {
    console.log('Fix these errors:', errors);
    // → { password: 'Minimum length is 6 characters' }
  }
});
```

### Registration Form with Cross-Field Validation

```javascript
const { isValid, errors, values } = Forms.registerForm.validate({
  username: {
    required:  true,
    minLength: 3,
    maxLength: 20
  },
  email: { required: true, email: true },
  password: {
    required:  true,
    minLength: 8,
    custom: (value) => {
      // Must contain at least one number
      if (!/\d/.test(value)) return 'Password must contain at least one number';
      return null;
    }
  },
  confirmPassword: (value, allValues) => {
    if (value !== allValues.password) return 'Passwords do not match';
    return null;
  },
  age: {
    required: true,
    custom: (value) => Number(value) < 13 ? 'Must be at least 13 years old' : null
  }
});
```

### Validate Only Native HTML5 Rules (No Custom Rules)

```javascript
// Pass no arguments — only runs HTML5 required/type/min/max/pattern checks
const { isValid } = Forms.contactForm.validate();

if (isValid) {
  // All HTML5 constraints pass
}
```

### Validate and Act on Errors

```javascript
const { isValid, errors, values } = Forms.paymentForm.validate({
  cardNumber: {
    required: true,
    pattern:  '^[0-9]{16}$'
  },
  expiry: { required: true },
  cvv:    { required: true, minLength: 3, maxLength: 4 }
});

if (!isValid) {
  // Errors are already shown in the DOM — just log for debugging
  console.log('Validation failed:', errors);
  return; // stop here
}

// All valid — proceed with payment
await Forms.paymentForm.submitData({ url: '/api/pay' });
```

---

## Clearing Validation State

After validation runs, error styles and messages appear in the DOM. To remove them:

```javascript
// Clear all validation state — removes error classes and messages
Forms.loginForm.clearValidation();
```

This is also called automatically at the start of each `.validate()` call, so previous errors are always cleared before new ones are shown.

---

## What Is `.serialize()`?

`.serialize(format)` converts your form's current values into a different format, ready for use in different contexts.

```javascript
// Default: plain object (same as .values)
const obj = Forms.myForm.serialize();
// → { name: 'Alice', email: 'alice@example.com' }

// JSON string
const json = Forms.myForm.serialize('json');
// → '{"name":"Alice","email":"alice@example.com"}'

// FormData (for file uploads or multipart forms)
const fd = Forms.myForm.serialize('formdata');
// → FormData object ready for fetch()

// URL-encoded string (for old-style form submissions or query strings)
const qs = Forms.myForm.serialize('urlencoded');
// → 'name=Alice&email=alice%40example.com'
```

---

## When to Use Each Format

### `'object'` (default) — Use when handling data in JavaScript

```javascript
const data = Forms.profileForm.serialize(); // same as .values
// Use the data in your own logic
if (data.plan === 'premium') { /* ... */ }
```

### `'json'` — Use when sending to a JSON API

```javascript
const json = Forms.orderForm.serialize('json');

fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: json  // ← ready to use directly
});
```

Note: `submitData()` already handles JSON serialization for you — use `serialize('json')` when you need to manage the fetch yourself.

### `'formdata'` — Use when uploading files

```javascript
const fd = Forms.uploadForm.serialize('formdata');

// FormData works with file inputs (unlike JSON)
fetch('/api/upload', {
  method: 'POST',
  body: fd  // ← no Content-Type header needed; browser sets it
});
```

### `'urlencoded'` — Use for query strings or legacy APIs

```javascript
const qs = Forms.searchForm.serialize('urlencoded');
// → 'q=javascript&sort=newest&page=1'

// Append to a URL
window.location.href = `/search?${qs}`;

// Or use in a request
fetch(`/api/search?${qs}`);
```

---

## Combining Validation and Serialization

A clean pattern for form submission:

```javascript
async function handleSubmit() {
  // 1. Validate
  const { isValid, errors } = Forms.orderForm.validate({
    email:   { required: true, email: true },
    product: { required: true },
    qty:     { required: true, custom: v => Number(v) > 0 ? null : 'Must be at least 1' }
  });

  if (!isValid) {
    console.log('Please fix:', errors);
    return;
  }

  // 2. Serialize to the format your API expects
  const payload = Forms.orderForm.serialize('json');

  // 3. Submit manually (or use .submitData() which handles this for you)
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload
  });
}
```

---

## Summary

### `.validate(rules)` — What you need to know

- Runs native HTML5 validation first, then your custom rules
- Returns `{ isValid, errors, values }`
- Automatically shows and clears error messages in the DOM
- Rules can be objects (with `required`, `email`, `minLength`, etc.) or functions
- Custom functions receive `(value, allValues, fieldElement)` and return `null` (valid) or a string (error)

### `.serialize(format)` — Choose your format

| Format | Returns | Use when |
|---|---|---|
| `'object'` | Plain object | Working with data in JavaScript |
| `'json'` | JSON string | Sending to a JSON API manually |
| `'formdata'` | FormData | File uploads or multipart forms |
| `'urlencoded'` | Query string | URL parameters or legacy APIs |
