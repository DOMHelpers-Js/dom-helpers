# Understanding `validators.custom()` - A Beginner's Guide

## What is `validators.custom()`?

`validators.custom(fn)` is a built-in validator that runs your own custom validation function.

Think of it as **custom rule creator** - validate with your own logic.

**Alias:** `v.custom()` - Use either `validators.custom()` or `v.custom()`, they're identical.

---

## Why Does This Exist?

### The Problem: Complex Validation Logic

You need validation rules that aren't covered by built-in validators:

```javascript
// ❌ Without custom - hard to integrate
// Need to manually check and set errors

// ✅ With custom() - clean integration
const form = ReactiveUtils.form(
  { username: '' },
  {
    validators: {
      username: v.custom((value) => {
        if (value.includes(' ')) {
          return 'Username cannot contain spaces';
        }
        return null; // Valid
      })
    }
  }
);
```

---

## How Does It Work?

```javascript
validators.custom(validatorFn)
    ↓
Calls validatorFn(value, allValues)
    ↓
Returns error message (string) or null (valid)
```

---

## Basic Usage

### Simple Custom Validator

```javascript
const form = ReactiveUtils.form(
  { username: '' },
  {
    validators: {
      username: v.custom((value) => {
        if (value.startsWith('_')) {
          return 'Username cannot start with underscore';
        }
        return null;
      })
    }
  }
);
```

### Async Validation

```javascript
const form = ReactiveUtils.form(
  { username: '' },
  {
    validators: {
      username: v.custom(async (value) => {
        const response = await fetch(`/api/check-username?username=${value}`);
        const { available } = await response.json();
        return available ? null : 'Username already taken';
      })
    }
  }
);
```

---

## Simple Examples

### Example 1: Password Strength

```javascript
const form = ReactiveUtils.form(
  { password: '' },
  {
    validators: {
      password: v.custom((value) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*]/.test(value);

        if (!hasUpperCase) return 'Must contain uppercase letter';
        if (!hasLowerCase) return 'Must contain lowercase letter';
        if (!hasNumber) return 'Must contain number';
        if (!hasSpecial) return 'Must contain special character';

        return null;
      })
    }
  }
);
```

### Example 2: Date Validation

```javascript
const form = ReactiveUtils.form(
  { birthDate: '' },
  {
    validators: {
      birthDate: v.custom((value) => {
        const date = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();

        if (age < 18) {
          return 'Must be 18 or older';
        }
        if (age > 120) {
          return 'Please enter a valid date';
        }

        return null;
      })
    }
  }
);
```

### Example 3: File Upload Validation

```javascript
const form = ReactiveUtils.form(
  { avatar: null },
  {
    validators: {
      avatar: v.custom((file) => {
        if (!file) return null;

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          return 'File must be less than 5MB';
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          return 'Only JPG, PNG, and GIF files allowed';
        }

        return null;
      })
    }
  }
);
```

---

## Real-World Example: Username Availability Check

```javascript
const registrationForm = ReactiveUtils.form(
  {
    username: '',
    email: ''
  },
  {
    validators: {
      username: v.combine([
        v.required('Username is required'),
        v.minLength(3, 'Username must be at least 3 characters'),
        v.pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
        v.custom(async (value) => {
          if (value.length < 3) return null; // Skip if too short

          // Debounce API call
          await new Promise(resolve => setTimeout(resolve, 300));

          const response = await fetch(`/api/check-username?username=${value}`);
          const { available, suggestions } = await response.json();

          if (!available) {
            return suggestions
              ? `Username taken. Try: ${suggestions.join(', ')}`
              : 'Username is already taken';
          }

          return null;
        })
      ]),

      email: v.combine([
        v.required(),
        v.email(),
        v.custom(async (value) => {
          // Check if email is already registered
          const response = await fetch(`/api/check-email?email=${value}`);
          const { registered } = await response.json();

          return registered ? 'Email already registered' : null;
        })
      ])
    }
  }
);

// Display username status
ReactiveUtils.effect(() => {
  const status = document.getElementById('username-status');
  const username = registrationForm.values.username;
  const error = registrationForm.errors.username;

  if (!username) {
    status.innerHTML = '';
  } else if (error) {
    status.innerHTML = `<span class="error">✗ ${error}</span>`;
  } else {
    status.innerHTML = '<span class="success">✓ Username available</span>';
  }
});
```

---

## Common Patterns

### Pattern 1: Simple Check

```javascript
v.custom((value) => {
  return condition ? 'Error message' : null;
})
```

### Pattern 2: Multiple Checks

```javascript
v.custom((value) => {
  if (check1) return 'Error 1';
  if (check2) return 'Error 2';
  return null;
})
```

### Pattern 3: Async Validation

```javascript
v.custom(async (value) => {
  const result = await checkAPI(value);
  return result.valid ? null : result.error;
})
```

### Pattern 4: With Context

```javascript
v.custom((value, allValues) => {
  // Access other form values
  if (value !== allValues.otherField) {
    return 'Must match other field';
  }
  return null;
})
```

---

## Common Questions

### Q: Can validators be async?

**Answer:** Yes! Return a Promise:

```javascript
v.custom(async (value) => {
  await checkSomething(value);
  return error || null;
})
```

### Q: How to access other fields?

**Answer:** Second parameter:

```javascript
v.custom((value, allValues) => {
  if (value < allValues.minValue) {
    return 'Must be greater than minimum';
  }
  return null;
})
```

### Q: When does it run?

**Answer:** Every time the field value changes.

---

## Summary

### What `validators.custom()` Does:

1. ✅ Runs custom logic
2. ✅ Supports async
3. ✅ Access all form values
4. ✅ Return error or null

### When to Use It:

- Complex validation
- API checks
- File validation
- Business rules
- Custom formats

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form(
  { field: '' },
  {
    validators: {
      field: v.custom((value) => {
        // Your validation logic
        if (invalid) {
          return 'Error message';
        }
        return null;
      })
    }
  }
);
```

---

**Remember:** Use `v.custom()` for any validation logic! 🎉