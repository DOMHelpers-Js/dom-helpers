# Understanding `isTouched()` - A Beginner's Guide

## What is `isTouched()`?

`isTouched()` is a method that checks if a form field has been touched (interacted with) by the user. It returns `true` if the field was touched, `false` if not.

Think of it as your **interaction checker** - a simple yes/no answer about whether the user has visited a field.

---

## Why Does This Exist?

### The Problem: Knowing When User Interacted

You need to know if a user has interacted with a field to decide when to show errors:

```javascript
const form = ReactiveUtils.form({ email: '' });

// Mark as touched when user leaves field
document.getElementById('email').onblur = () => {
  form.setTouched('email');
};

// ❌ Manual check - verbose
if (form.touched.email === true) {
  console.log('Email field was touched');
}

// ✅ With isTouched() - clean
if (form.isTouched('email')) {
  console.log('Email field was touched');
}
```

**Benefits:**
- Clean, readable code
- Simple boolean result
- Consistent with form API
- Easy to use in conditions

---

## How Does It Work?

### The Simple Truth

When you call `isTouched()`:

1. **Takes field name** - You specify which field
2. **Checks touched state** - Looks at `form.touched[field]`
3. **Returns boolean** - `true` if touched, `false` if not

Think of it like this:

```
isTouched('email')
      ↓
  form.touched.email === true?
      ↓
  Return true or false
```

---

## Basic Usage

### Checking if Field is Touched

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Mark email as touched
form.setTouched('email');

// Check which fields are touched
console.log(form.isTouched('email'));    // true
console.log(form.isTouched('password')); // false
```

### Using in Conditions

```javascript
const form = ReactiveUtils.form({ username: '' });

form.setTouched('username');

if (form.isTouched('username')) {
  console.log('User has interacted with username field');
} else {
  console.log('Username field not touched yet');
}
```

### Checking Before Showing Errors

```javascript
const form = ReactiveUtils.form({ email: '' });

if (form.isTouched('email') && form.hasError('email')) {
  console.log('Show error to user');
} else {
  console.log('Hide error');
}
```

---

## Simple Examples Explained

### Example 1: Conditional Error Display

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email()
    }
  }
);

// Show error only if field touched AND has error
ReactiveUtils.effect(() => {
  const errorElement = document.getElementById('email-error');

  if (form.isTouched('email') && form.hasError('email')) {
    errorElement.textContent = form.getError('email');
    errorElement.style.display = 'block';
  } else {
    errorElement.style.display = 'none';
  }
});
```

**What happens:**

1. User hasn't touched field yet
2. Error hidden (even if validation fails)
3. User touches field (blur/input)
4. Error appears if validation fails
5. Good UX - no premature errors

---

### Example 2: Field Status Icons

```javascript
const form = ReactiveUtils.form({ email: '', password: '' });

// Show status icons
ReactiveUtils.effect(() => {
  ['email', 'password'].forEach(field => {
    const icon = document.getElementById(`${field}-icon`);

    if (!form.isTouched(field)) {
      icon.textContent = '⚪'; // Not touched
    } else if (form.hasError(field)) {
      icon.textContent = '❌'; // Touched with error
    } else {
      icon.textContent = '✅'; // Touched and valid
    }
  });
});
```

**What happens:**

1. Fields start with gray circle (not touched)
2. User interacts with field
3. Shows red X if error, green check if valid
4. Clear visual feedback

---

### Example 3: Form Dirty State

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: '',
  phone: ''
});

function isFormDirty() {
  const fields = ['name', 'email', 'phone'];
  return fields.some(field => form.isTouched(field));
}

// Warn before leaving if form is dirty
window.onbeforeunload = (e) => {
  if (isFormDirty()) {
    e.preventDefault();
    return 'You have unsaved changes. Are you sure you want to leave?';
  }
};
```

**What happens:**

1. Checks if any field was touched
2. If yes, warns before leaving page
3. Prevents accidental data loss
4. Good user protection

---

## Real-World Example: Progressive Error Display

```javascript
const registrationForm = ReactiveUtils.form(
  {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  {
    validators: {
      username: ReactiveUtils.validators.minLength(3),
      email: ReactiveUtils.validators.email(),
      password: ReactiveUtils.validators.minLength(8),
      confirmPassword: ReactiveUtils.validators.match('password')
    }
  }
);

// Mark fields as touched on blur
['username', 'email', 'password', 'confirmPassword'].forEach(field => {
  document.getElementById(field).onblur = () => {
    registrationForm.setTouched(field);
  };
});

// Display errors progressively as fields are touched
ReactiveUtils.effect(() => {
  const fields = ['username', 'email', 'password', 'confirmPassword'];

  fields.forEach(field => {
    const errorElement = document.getElementById(`${field}-error`);
    const inputElement = document.getElementById(field);

    // Only show error if field touched
    if (registrationForm.isTouched(field) && registrationForm.hasError(field)) {
      errorElement.textContent = registrationForm.getError(field);
      errorElement.style.display = 'block';
      inputElement.classList.add('input-error');
    } else {
      errorElement.style.display = 'none';
      inputElement.classList.remove('input-error');
    }

    // Show success indicator for touched valid fields
    if (registrationForm.isTouched(field) && !registrationForm.hasError(field)) {
      inputElement.classList.add('input-success');
    } else {
      inputElement.classList.remove('input-success');
    }
  });
});

// Form progress indicator
ReactiveUtils.effect(() => {
  const fields = ['username', 'email', 'password', 'confirmPassword'];
  const touchedCount = fields.filter(f => registrationForm.isTouched(f)).length;
  const progress = (touchedCount / fields.length) * 100;

  document.getElementById('progress-bar').style.width = `${progress}%`;
  document.getElementById('progress-text').textContent =
    `${touchedCount} of ${fields.length} fields completed`;
});
```

**What happens:**
- Errors show only after field touched
- Success indicators for valid touched fields
- Progress bar updates as fields touched
- Clean, progressive validation UX

---

## Common Patterns

### Pattern 1: Show Error if Touched

```javascript
if (form.isTouched('field') && form.hasError('field')) {
  displayError(form.getError('field'));
}
```

### Pattern 2: Field Status Check

```javascript
if (!form.isTouched('field')) {
  status = 'untouched';
} else if (form.hasError('field')) {
  status = 'error';
} else {
  status = 'valid';
}
```

### Pattern 3: Count Touched Fields

```javascript
const touchedCount = ['name', 'email', 'phone']
  .filter(field => form.isTouched(field))
  .length;
```

### Pattern 4: Any Field Touched

```javascript
const anyTouched = ['name', 'email']
  .some(field => form.isTouched(field));
```

---

## Common Beginner Questions

### Q: What's the difference between `isTouched()` and `hasError()`?

**Answer:**

- **`isTouched()`** = Checks if user interacted
- **`hasError()`** = Checks if field has validation error

```javascript
// Field can be touched without error
form.setTouched('email');
console.log(form.isTouched('email')); // true
console.log(form.hasError('email'));  // false (if valid)

// Field can have error without being touched
form.setError('email', 'Invalid');
console.log(form.hasError('email'));  // true
console.log(form.isTouched('email')); // false (if not touched yet)
```

### Q: Does `setValue()` mark field as touched?

**Answer:**

Yes! `setValue()` automatically marks the field as touched:

```javascript
form.setValue('email', 'test@example.com');
console.log(form.isTouched('email')); // true (automatic)
```

### Q: What's the difference between `isTouched()` and `shouldShowError()`?

**Answer:**

- **`isTouched()`** = Just checks if touched
- **`shouldShowError()`** = Checks if touched AND has error

```javascript
// isTouched - just interaction check
console.log(form.isTouched('email')); // true/false

// shouldShowError - combined check
console.log(form.shouldShowError('email')); // isTouched AND hasError
```

### Q: Can a field become "untouched"?

**Answer:**

Yes, by resetting or manually setting:

```javascript
form.setTouched('email'); // Mark as touched
console.log(form.isTouched('email')); // true

form.reset(); // Reset form
console.log(form.isTouched('email')); // false

// Or manually
form.touched.email = false;
console.log(form.isTouched('email')); // false
```

### Q: Is `isTouched()` reactive?

**Answer:**

Yes, when used in effects:

```javascript
ReactiveUtils.effect(() => {
  if (form.isTouched('email')) {
    // This re-runs when touched state changes
    console.log('Email was touched');
  }
});
```

---

## Tips for Success

### 1. Use with shouldShowError()

```javascript
// ✅ Often used together
if (form.isTouched('field')) {
  // Check for errors
  if (form.hasError('field')) {
    showError();
  }
}

// ✅ Or use shorthand
if (form.shouldShowError('field')) {
  showError();
}
```

### 2. Check Before Displaying Errors

```javascript
// ✅ Don't show errors too early
ReactiveUtils.effect(() => {
  if (form.isTouched('email')) {
    displayValidation();
  }
});
```

### 3. Use for Progress Indicators

```javascript
// ✅ Track form completion
const completed = fields.filter(f => form.isTouched(f)).length;
const progress = (completed / fields.length) * 100;
```

### 4. Combine with Other Checks

```javascript
// ✅ Multi-condition checks
if (form.isTouched('field') &&
    form.hasError('field') &&
    !form.isSubmitting) {
  showError();
}
```

### 5. Use in Field Status Logic

```javascript
// ✅ Determine field state
function getFieldState(field) {
  if (!form.isTouched(field)) return 'pristine';
  if (form.hasError(field)) return 'invalid';
  return 'valid';
}
```

---

## Comparison with Related Methods

| Method | Returns | Checks |
|--------|---------|--------|
| `isTouched('field')` | Boolean | If field was interacted with |
| `hasError('field')` | Boolean | If field has validation error |
| `shouldShowError('field')` | Boolean | If touched AND has error |
| `form.touched.field` | Boolean/undefined | Direct access (same as isTouched) |

---

## Summary

### What `isTouched()` Does:

1. ✅ Checks if field has been interacted with
2. ✅ Returns boolean (`true`/`false`)
3. ✅ Works in reactive effects
4. ✅ Part of consistent form API
5. ✅ Used to control error display timing

### When to Use It:

- Deciding when to show errors
- Creating field status indicators
- Tracking form progress
- Warning about unsaved changes
- Conditional validation display
- Form analytics

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ fieldName: '' });

// Check if touched
if (form.isTouched('fieldName')) {
  // Field was interacted with
}

// Common: Show errors only if touched
if (form.isTouched('fieldName') && form.hasError('fieldName')) {
  displayError();
}

// Or use shorthand
if (form.shouldShowError('fieldName')) {
  displayError();
}
```

---

**Remember:** `isTouched()` tells you if a field has been interacted with. Use it to control when validation errors appear - show errors only after the user has touched a field for better UX! 🎉
