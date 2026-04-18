[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Built-in Validators

DOMHelpers provides a set of ready-to-use validator factories through `Forms.validators` (or the shorthand `Forms.v`). Each one returns a **validator function** that checks a value and returns either `null` (valid) or an error string (invalid).

---

## How Validators Work

A validator is a function with this signature:

```javascript
function validator(value, allValues) {
  // Return null if valid
  // Return an error string if invalid
}
```

The built-in validators are **factories** — functions that create validator functions:

```javascript
// Forms.v.required() is a factory
// It RETURNS a validator function
const isRequired = Forms.v.required('Name is required');

// Now isRequired is a function you can call
isRequired('');        // 'Name is required'
isRequired('Alice');   // null
```

**The flow:**

```
Forms.v.required('Name is required')
   ↓
Returns a function: (value) => { ... }
   ↓
When called with a value:
   ├── '' or null or undefined → 'Name is required'
   └── 'Alice'                → null
```

---

## All Built-in Validators

---

### Forms.v.required(message?)

Checks that the field has a value — not empty, not null, not just whitespace.

```javascript
const validate = Forms.v.required('This field is required');

validate('');          // 'This field is required'
validate(null);        // 'This field is required'
validate(undefined);   // 'This field is required'
validate('   ');       // 'This field is required' (whitespace only)
validate('Alice');     // null (valid)
validate(0);          // null (valid — 0 is falsy but still a value)
```

**Wait — why does `0` return an error?**

That's a good question. The validator checks `!value`, so `0` is treated as falsy and will return the error message. If you need to accept `0` as a valid number, use a `custom` validator:

```javascript
const acceptZero = Forms.v.custom((value) => {
  if (value === '' || value == null) return 'Required';
  return null;
});
```

**Default message:** `'This field is required'`

---

### Forms.v.email(message?)

Checks that the value looks like a valid email address.

```javascript
const validate = Forms.v.email('Invalid email');

validate('alice@example.com');  // null (valid)
validate('user@domain.co');     // null (valid)
validate('bad-email');          // 'Invalid email'
validate('missing@');           // 'Invalid email'
validate('@nodomain.com');      // 'Invalid email'
validate('');                   // null (empty is OK — use required() for that)
```

**Key detail:** An empty value returns `null` (no error). This lets you make email optional. If you want to require it, combine with `required()`:

```javascript
Forms.v.combine(
  Forms.v.required('Email is required'),
  Forms.v.email('Please enter a valid email')
)
```

**Default message:** `'Invalid email address'`

---

### Forms.v.minLength(min, message?)

Checks that the value has at least `min` characters.

```javascript
const validate = Forms.v.minLength(3, 'Too short');

validate('Hi');       // 'Too short' (2 chars < 3)
validate('Hey');      // null (3 chars = 3, valid)
validate('Hello');    // null (5 chars > 3, valid)
validate('');         // null (empty is OK — use required() for that)
```

**Default message:** `'Must be at least {min} characters'`

---

### Forms.v.maxLength(max, message?)

Checks that the value has no more than `max` characters.

```javascript
const validate = Forms.v.maxLength(10, 'Too long');

validate('Short');          // null (5 chars, valid)
validate('Exactly ten');    // 'Too long' (11 chars > 10)
validate('');               // null (empty is OK)
```

**Default message:** `'Must be no more than {max} characters'`

---

### Forms.v.min(min, message?)

Checks that the **numeric** value is at least `min`.

```javascript
const validate = Forms.v.min(18, 'Must be at least 18');

validate(25);     // null (valid)
validate(18);     // null (valid — equal is OK)
validate(16);     // 'Must be at least 18'
validate('');     // null (empty is OK)
validate(null);   // null (null is OK)
```

**Default message:** `'Must be at least {min}'`

---

### Forms.v.max(max, message?)

Checks that the **numeric** value is no more than `max`.

```javascript
const validate = Forms.v.max(100, 'Must be 100 or less');

validate(50);     // null (valid)
validate(100);    // null (valid — equal is OK)
validate(150);    // 'Must be 100 or less'
validate('');     // null (empty is OK)
```

**Default message:** `'Must be no more than {max}'`

---

### Forms.v.pattern(regex, message?)

Checks that the value matches a regular expression.

```javascript
// Only letters
const lettersOnly = Forms.v.pattern(/^[a-zA-Z]+$/, 'Letters only');

lettersOnly('Alice');    // null (valid)
lettersOnly('Alice123'); // 'Letters only'
lettersOnly('');         // null (empty is OK)

// Phone number format
const phone = Forms.v.pattern(
  /^\d{3}-\d{3}-\d{4}$/,
  'Format: 123-456-7890'
);

phone('123-456-7890');  // null (valid)
phone('1234567890');    // 'Format: 123-456-7890'
```

**Default message:** `'Invalid format'`

---

### Forms.v.match(fieldName, message?)

Checks that the value matches another field's value. This is the only validator that uses the second argument (`allValues`) — it reads the value of the referenced field.

```javascript
const form = Forms.create(
  { password: '', confirmPassword: '' },
  {
    validators: {
      confirmPassword: Forms.v.match('password', 'Passwords do not match')
    }
  }
);

form.setValue('password', 'secret123');
form.setValue('confirmPassword', 'secret123');
console.log(form.hasError('confirmPassword'));  // false

form.setValue('confirmPassword', 'wrong');
console.log(form.hasError('confirmPassword'));  // true
console.log(form.getError('confirmPassword')); // 'Passwords do not match'
```

**How it works inside:**

```javascript
// The validator receives (value, allValues)
// It compares value with allValues[fieldName]
(value, allValues) => value === allValues['password'] ? null : message
```

**Default message:** `'Must match {fieldName}'`

---

### Forms.v.custom(validatorFn)

Wraps any function as a validator. Use this when the built-in validators don't cover your case.

```javascript
// Check if username contains no spaces
const noSpaces = Forms.v.custom((value) => {
  if (value && value.includes(' ')) return 'No spaces allowed';
  return null;
});

// Check if value is a valid JSON
const validJSON = Forms.v.custom((value) => {
  if (!value) return null;
  try {
    JSON.parse(value);
    return null;
  } catch {
    return 'Invalid JSON';
  }
});
```

Your function receives `(value, allValues)` just like any validator:

```javascript
// Cross-field validation
const endAfterStart = Forms.v.custom((value, allValues) => {
  if (!value || !allValues.startDate) return null;
  if (new Date(value) <= new Date(allValues.startDate)) {
    return 'End date must be after start date';
  }
  return null;
});
```

---

### Forms.v.combine(...validators)

Chains multiple validators together. Runs them in order and returns the **first error** found.

```javascript
const validateEmail = Forms.v.combine(
  Forms.v.required('Email is required'),
  Forms.v.email('Please enter a valid email'),
  Forms.v.maxLength(50, 'Email is too long')
);

validateEmail('');                         // 'Email is required' (first check fails)
validateEmail('bad');                      // 'Please enter a valid email' (second check fails)
validateEmail('a'.repeat(50) + '@b.com');  // 'Email is too long' (third check fails)
validateEmail('alice@example.com');        // null (all pass)
```

**How it works:**

```
Forms.v.combine(v1, v2, v3)
   ↓
Returns a function: (value, allValues) => {
   ↓
   Run v1(value, allValues) → error?
   ├── YES → return that error (stop here)
   └── NO  ↓
   Run v2(value, allValues) → error?
   ├── YES → return that error (stop here)
   └── NO  ↓
   Run v3(value, allValues) → error?
   ├── YES → return that error
   └── NO  → return null (all passed)
}
```

**Key insight:** It short-circuits — once one validator fails, the rest don't run. This means the user sees one error at a time, which is cleaner than showing multiple errors.

---

## The Validator Return Value Rule

Every validator follows the same simple rule:

```
┌──────────────────────────────────────┐
│  Return null    → field is VALID     │
│  Return string  → field is INVALID   │
│                   (string = message)  │
└──────────────────────────────────────┘
```

This is important to remember when writing custom validators.

---

## The "Empty is OK" Pattern

Notice that most validators (email, minLength, maxLength, min, max, pattern) return `null` for empty values. This is by design:

```
                    Empty value?
                   ├── YES → return null (skip — not my job)
                   └── NO  → check the value
```

This lets you make fields **optional** — only validate if the user typed something. To make a field **required**, combine with `required()`:

```javascript
// Optional email — only validates format if provided
validators: {
  email: Forms.v.email('Invalid email')
}

// Required email — must be provided AND valid
validators: {
  email: Forms.v.combine(
    Forms.v.required('Email is required'),
    Forms.v.email('Invalid email')
  )
}
```

---

## Common Validator Combinations

### Registration form

```javascript
validators: {
  username: Forms.v.combine(
    Forms.v.required('Username is required'),
    Forms.v.minLength(3, 'At least 3 characters'),
    Forms.v.maxLength(20, 'No more than 20 characters'),
    Forms.v.pattern(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, and underscores only')
  ),
  email: Forms.v.combine(
    Forms.v.required('Email is required'),
    Forms.v.email('Invalid email address')
  ),
  password: Forms.v.combine(
    Forms.v.required('Password is required'),
    Forms.v.minLength(8, 'At least 8 characters')
  ),
  confirmPassword: Forms.v.combine(
    Forms.v.required('Please confirm your password'),
    Forms.v.match('password', 'Passwords do not match')
  )
}
```

### Contact form

```javascript
validators: {
  name: Forms.v.required('Name is required'),
  email: Forms.v.combine(
    Forms.v.required('Email is required'),
    Forms.v.email('Invalid email')
  ),
  message: Forms.v.combine(
    Forms.v.required('Message is required'),
    Forms.v.minLength(10, 'Please write at least 10 characters')
  )
}
```

### Number range

```javascript
validators: {
  age: Forms.v.combine(
    Forms.v.required('Age is required'),
    Forms.v.min(18, 'Must be at least 18'),
    Forms.v.max(120, 'Must be 120 or less')
  ),
  rating: Forms.v.combine(
    Forms.v.required('Rating is required'),
    Forms.v.min(1, 'Minimum rating is 1'),
    Forms.v.max(5, 'Maximum rating is 5')
  )
}
```

---

## Quick Reference

| Validator | Factory | Checks | Empty value |
|-----------|---------|--------|-------------|
| `required(msg?)` | `Forms.v.required()` | Not empty, null, or whitespace | Returns error |
| `email(msg?)` | `Forms.v.email()` | Valid email format | Returns null |
| `minLength(n, msg?)` | `Forms.v.minLength()` | At least n characters | Returns null |
| `maxLength(n, msg?)` | `Forms.v.maxLength()` | At most n characters | Returns null |
| `min(n, msg?)` | `Forms.v.min()` | Number >= n | Returns null |
| `max(n, msg?)` | `Forms.v.max()` | Number <= n | Returns null |
| `pattern(regex, msg?)` | `Forms.v.pattern()` | Matches regex | Returns null |
| `match(field, msg?)` | `Forms.v.match()` | Equals another field | Returns error if different |
| `custom(fn)` | `Forms.v.custom()` | Your custom logic | Depends on your function |
| `combine(...fns)` | `Forms.v.combine()` | All validators pass | First error wins |

---

## Key Takeaways

1. **Validators are factories** — call them to get a validator function, don't pass them directly
2. **Return `null` for valid**, return an error string for invalid
3. **Most validators skip empty values** — combine with `required()` to make a field mandatory
4. **`combine()`** chains multiple validators and returns the first error
5. **`match()`** compares against another field — perfect for password confirmation
6. **`custom()`** lets you write any validation logic while keeping the standard return pattern
7. **`Forms.v`** is a shorthand for `Forms.validators`

---

## What's next?

Let's see reactive forms in action with complete real-world examples and best practices.

Let's continue!