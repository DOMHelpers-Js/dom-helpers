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
const form = ReactiveUtils.form(
  { phone: '' },
  {
    validators: {
      phone: v.pattern(/^\d{3}-\d{3}-\d{4}$/)
    }
  }
);
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
const form = ReactiveUtils.form(
  { phone: '' },
  {
    validators: {
      phone: v.pattern(/^\d{3}-\d{3}-\d{4}$/, 'Format: 123-456-7890')
    }
  }
);

form.setValue('phone', '1234567890');
console.log(form.errors.phone); // 'Format: 123-456-7890'

form.setValue('phone', '123-456-7890');
console.log(form.errors.phone); // undefined (valid)
```

### Postal Code
```javascript
const form = ReactiveUtils.form(
  { zipCode: '' },
  {
    validators: {
      zipCode: v.pattern(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
    }
  }
);
```

### Username Format
```javascript
const form = ReactiveUtils.form(
  { username: '' },
  {
    validators: {
      username: v.pattern(/^[a-zA-Z0-9_]{3,20}$/, 'Letters, numbers, underscores only (3-20 chars)')
    }
  }
);
```

---

## Simple Examples

### Example 1: US Phone Number
```javascript
const form = ReactiveUtils.form(
  { phone: '' },
  {
    validators: {
      phone: v.combine(
        v.required(),
        v.pattern(/^\(\d{3}\) \d{3}-\d{4}$/, 'Format: (123) 456-7890')
      )
    }
  }
);

// Usage
form.setValue('phone', '1234567890');
console.log(form.errors.phone); // 'Format: (123) 456-7890'

form.setValue('phone', '(123) 456-7890');
console.log(form.errors.phone); // undefined (valid)
```

### Example 2: Credit Card (simplified)
```javascript
const form = ReactiveUtils.form(
  { cardNumber: '' },
  {
    validators: {
      cardNumber: v.pattern(/^\d{4} \d{4} \d{4} \d{4}$/, 'Format: 1234 5678 9012 3456')
    }
  }
);

// Usage
form.setValue('cardNumber', '1234567890123456');
console.log(form.errors.cardNumber); // 'Format: 1234 5678 9012 3456'

form.setValue('cardNumber', '1234 5678 9012 3456');
console.log(form.errors.cardNumber); // undefined (valid)
```

---

## Complete Example: Registration Form
```javascript
const registrationForm = ReactiveUtils.form(
  {
    username: '',
    email: '',
    phone: '',
    zipCode: ''
  },
  {
    validators: {
      username: v.combine(
        v.required('Username is required'),
        v.minLength(3),
        v.pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
      ),
      email: v.combine(
        v.required(),
        v.email()
      ),
      phone: v.pattern(/^\d{3}-\d{3}-\d{4}$/, 'Format: 123-456-7890'),
      zipCode: v.pattern(/^\d{5}$/, 'Must be 5 digits')
    }
  }
);

// Set values and validate
registrationForm.setValue('username', 'user@name');
console.log(registrationForm.errors.username); // 'Only letters, numbers, and underscores allowed'

registrationForm.setValue('username', 'user_name');
console.log(registrationForm.errors.username); // undefined (valid)

registrationForm.setValue('phone', '1234567890');
console.log(registrationForm.errors.phone); // 'Format: 123-456-7890'

registrationForm.setValue('phone', '123-456-7890');
console.log(registrationForm.errors.phone); // undefined (valid)
```

---

## Common Patterns

### Pattern 1: Phone Numbers
```javascript
// US Format: 123-456-7890
v.pattern(/^\d{3}-\d{3}-\d{4}$/)

// US Format with parentheses: (123) 456-7890
v.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)

// International: +1-123-456-7890
v.pattern(/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/)
```

### Pattern 2: Postal Codes
```javascript
// US ZIP: 12345
v.pattern(/^\d{5}$/)

// US ZIP+4: 12345-6789
v.pattern(/^\d{5}(-\d{4})?$/)

// Canadian: A1A 1A1
v.pattern(/^[A-Z]\d[A-Z] \d[A-Z]\d$/)
```

### Pattern 3: Username/Alphanumeric
```javascript
// Alphanumeric only
v.pattern(/^[a-zA-Z0-9]+$/)

// Alphanumeric with underscore, 3-20 chars
v.pattern(/^[a-zA-Z0-9_]{3,20}$/)

// Must start with letter
v.pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)
```

### Pattern 4: Dates
```javascript
// YYYY-MM-DD
v.pattern(/^\d{4}-\d{2}-\d{2}$/)

// MM/DD/YYYY
v.pattern(/^\d{2}\/\d{2}\/\d{4}$/)
```

### Pattern 5: URL/Slug
```javascript
// URL slug: lowercase-with-dashes
v.pattern(/^[a-z0-9-]+$/)

// Hashtag: #example
v.pattern(/^#[a-zA-Z0-9_]+$/)
```

---

## Working with Form Methods
```javascript
const form = ReactiveUtils.form(
  { phone: '' },
  {
    validators: {
      phone: v.pattern(/^\d{3}-\d{3}-\d{4}$/, 'Format: 123-456-7890')
    }
  }
);

// Set value and auto-validate
form.setValue('phone', 'invalid');

// Check validation
console.log(form.isValid);        // false
console.log(form.hasErrors);      // true
console.log(form.errors.phone);   // 'Format: 123-456-7890'

// Manual validation
form.validateField('phone');

// Check if should show error (touched + has error)
form.setTouched('phone');
console.log(form.shouldShowError('phone')); // true

// Get field props for input binding
const phoneProps = form.getFieldProps('phone');
// Returns: { name, value, onChange, onBlur }
```

---

## Binding to DOM Inputs
```html

  
  

```
```javascript
const form = ReactiveUtils.form(
  { phone: '' },
  {
    validators: {
      phone: v.pattern(/^\d{3}-\d{3}-\d{4}$/, 'Format: 123-456-7890')
    }
  }
);

// Bind to inputs
form.bindToInputs('#myForm input');

// Watch for errors and update UI
form.$watch('errors', () => {
  const errorSpan = document.getElementById('phoneError');
  errorSpan.textContent = form.errors.phone || '';
});
```

---

## Summary

### What `validators.pattern()` Does:

1. ✅ Tests value against regular expression
2. ✅ Custom format validation (phone, zip, username, etc.)
3. ✅ Returns error message or null
4. ✅ Custom error messages supported
5. ✅ Can combine with other validators

### The Basic Pattern:
```javascript
// Simple usage
const form = ReactiveUtils.form(
  { field: '' },
  {
    validators: {
      field: v.pattern(/regex/)
    }
  }
);

// With custom message
const form = ReactiveUtils.form(
  { field: '' },
  {
    validators: {
      field: v.pattern(/regex/, 'Custom error message')
    }
  }
);

// Combined with other validators
const form = ReactiveUtils.form(
  { field: '' },
  {
    validators: {
      field: v.combine(
        v.required(),
        v.minLength(5),
        v.pattern(/regex/, 'Must match pattern')
      )
    }
  }
);
```

---

**Remember:** Use `v.pattern()` for custom validation patterns! 🎉