# Understanding `hasError()` - A Beginner's Guide

## What is `hasError()`?

`hasError()` is a method that checks if a specific form field has an error. It returns `true` if the field has an error, `false` if it doesn't.

Think of it as your **error checker** - a simple yes/no answer about whether a field has an error.

---

## Why Does This Exist?

### The Problem: Checking for Errors

You need to check if fields have errors for conditional logic:

```javascript
const form = ReactiveUtils.form({ email: '' });

form.setError('email', 'Invalid email');

// ❌ Manual check - verbose
if (form.errors.email !== undefined && form.errors.email !== null && form.errors.email !== '') {
  console.log('Email has error');
}

// ✅ With hasError() - clean
if (form.hasError('email')) {
  console.log('Email has error');
}
```

**Benefits:**
- Clean, readable code
- Simple boolean result
- Handles all edge cases
- Consistent API

---

## How Does It Work?

### The Simple Truth

When you call `hasError()`:

1. **Takes field name** - You specify which field
2. **Checks for error** - Looks in `form.errors`
3. **Returns boolean** - `true` if error exists, `false` if not

Think of it like this:

```
hasError('email')
      ↓
  Does form.errors.email exist?
      ↓
  Return true or false
```

---

## Basic Usage

### Checking if Field Has Error

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Set an error
form.setError('email', 'Invalid email');

// Check if error exists
console.log(form.hasError('email')); // true
console.log(form.hasError('password')); // false
```

### Using in Conditions

```javascript
const form = ReactiveUtils.form({ username: '' });

form.setError('username', 'Username taken');

if (form.hasError('username')) {
  console.log('Cannot submit - username has error');
} else {
  console.log('Username is valid');
}
```

### In UI Logic

```javascript
const form = ReactiveUtils.form({ email: '' });

ReactiveUtils.effect(() => {
  const errorElement = document.getElementById('email-error');

  if (form.hasError('email')) {
    errorElement.style.display = 'block';
    errorElement.textContent = form.getError('email');
  } else {
    errorElement.style.display = 'none';
  }
});
```

---

## Simple Examples Explained

### Example 1: Conditional Submit Button

```javascript
const loginForm = ReactiveUtils.form({
  email: '',
  password: ''
});

// Update submit button state
ReactiveUtils.effect(() => {
  const submitBtn = document.getElementById('submit-btn');

  const hasAnyErrors =
    loginForm.hasError('email') ||
    loginForm.hasError('password');

  submitBtn.disabled = hasAnyErrors;
});
```

**What happens:**

1. Watches for errors
2. Checks if either field has error
3. Disables button if any errors exist
4. Enables button when all errors cleared

---

### Example 2: Show Error Icons

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: '',
  phone: ''
});

// Show/hide error icons
ReactiveUtils.effect(() => {
  const fields = ['name', 'email', 'phone'];

  fields.forEach(field => {
    const icon = document.getElementById(`${field}-error-icon`);

    if (form.hasError(field)) {
      icon.style.display = 'inline'; // Show ❌
    } else {
      icon.style.display = 'none'; // Hide
    }
  });
});
```

**What happens:**

1. Checks each field for errors
2. Shows red X icon if error exists
3. Hides icon if no error
4. Updates automatically when errors change

---

### Example 3: Conditional Field Styling

```javascript
const form = ReactiveUtils.form({ email: '' });

const emailInput = document.getElementById('email');

form.$watch('errors.email', () => {
  if (form.hasError('email')) {
    emailInput.classList.add('input-error');
    emailInput.classList.remove('input-success');
  } else {
    emailInput.classList.remove('input-error');
    emailInput.classList.add('input-success');
  }
});
```

**What happens:**

1. Watches email errors
2. Adds red border if has error
3. Adds green border if no error
4. Visual feedback to user

---

## Real-World Example: Multi-Field Validation

```javascript
const registrationForm = ReactiveUtils.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false
});

// Check if form can be submitted
function canSubmit() {
  const requiredFields = ['username', 'email', 'password', 'confirmPassword'];

  // Check if any required field has error
  const hasFieldErrors = requiredFields.some(field =>
    registrationForm.hasError(field)
  );

  // Check if terms accepted
  const termsAccepted = registrationForm.values.termsAccepted;

  return !hasFieldErrors && termsAccepted;
}

// Update submit button
ReactiveUtils.effect(() => {
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = !canSubmit();

  if (canSubmit()) {
    submitBtn.textContent = 'Create Account';
    submitBtn.classList.add('btn-primary');
  } else {
    submitBtn.textContent = 'Please Fix Errors';
    submitBtn.classList.remove('btn-primary');
  }
});

// Show validation status for each field
ReactiveUtils.effect(() => {
  ['username', 'email', 'password', 'confirmPassword'].forEach(field => {
    const statusIcon = document.getElementById(`${field}-status`);

    if (registrationForm.hasError(field)) {
      statusIcon.textContent = '❌';
      statusIcon.className = 'status-error';
    } else if (registrationForm.isTouched(field)) {
      statusIcon.textContent = '✅';
      statusIcon.className = 'status-success';
    } else {
      statusIcon.textContent = '⚪';
      statusIcon.className = 'status-pending';
    }
  });
});
```

**What happens:**
- Checks each field for errors
- Shows appropriate icon for each state
- Updates submit button based on errors
- Clear visual feedback
- Good user experience

---

## Common Patterns

### Pattern 1: Check Before Submit

```javascript
function handleSubmit() {
  if (form.hasError('email') || form.hasError('password')) {
    alert('Please fix errors before submitting');
    return;
  }

  submitForm();
}
```

### Pattern 2: Conditional Rendering

```javascript
ReactiveUtils.effect(() => {
  const helpText = document.getElementById('help-text');

  if (form.hasError('password')) {
    helpText.textContent = 'Password must meet requirements';
    helpText.style.display = 'block';
  } else {
    helpText.style.display = 'none';
  }
});
```

### Pattern 3: Count Errors

```javascript
function getErrorCount() {
  const fields = ['name', 'email', 'phone', 'address'];
  return fields.filter(field => form.hasError(field)).length;
}

console.log(`${getErrorCount()} errors remaining`);
```

### Pattern 4: First Error Field

```javascript
function focusFirstError() {
  const fields = ['name', 'email', 'phone'];

  for (const field of fields) {
    if (form.hasError(field)) {
      document.getElementById(field).focus();
      break;
    }
  }
}
```

---

## Common Beginner Questions

### Q: What's the difference between `hasError()` and checking `form.errors.field`?

**Answer:**

They're similar, but `hasError()` is cleaner:

```javascript
// Using hasError()
if (form.hasError('email')) {
  // Email has error
}

// Direct check
if (form.errors.email) {
  // Email has error
}

// Both work, but hasError() is more explicit
```

### Q: Does `hasError()` check if field is touched?

**Answer:**

No, it only checks if an error exists:

```javascript
form.setError('email', 'Invalid');

console.log(form.hasError('email')); // true
console.log(form.isTouched('email')); // might be false

// For "show error to user" logic, use:
console.log(form.shouldShowError('email')); // checks both
```

### Q: What does it return for non-existent fields?

**Answer:**

Returns `false`:

```javascript
console.log(form.hasError('nonExistentField')); // false
```

### Q: Can I check multiple fields at once?

**Answer:**

Not directly, but you can combine:

```javascript
// Check if any field has error
const hasAnyError =
  form.hasError('email') ||
  form.hasError('password');

// Or use array method
const fields = ['email', 'password', 'username'];
const hasAnyError = fields.some(field => form.hasError(field));
```

### Q: Is `hasError()` reactive?

**Answer:**

Yes, when used in effects:

```javascript
ReactiveUtils.effect(() => {
  if (form.hasError('email')) {
    // This re-runs when email error changes
    console.log('Email has error');
  }
});
```

---

## Tips for Success

### 1. Use in Conditional Logic

```javascript
// ✅ Clear condition
if (form.hasError('email')) {
  showErrorMessage();
}
```

### 2. Combine with Other Checks

```javascript
// ✅ Check error AND touched state
if (form.hasError('email') && form.isTouched('email')) {
  displayError();
}
```

### 3. Use in Array Methods

```javascript
// ✅ Find all fields with errors
const fieldsWithErrors = ['name', 'email', 'phone']
  .filter(field => form.hasError(field));
```

### 4. Use for Button States

```javascript
// ✅ Disable button if any errors
const hasErrors = ['email', 'password']
  .some(field => form.hasError(field));

submitBtn.disabled = hasErrors;
```

### 5. Use in Effects for Reactive UI

```javascript
// ✅ Automatic UI updates
ReactiveUtils.effect(() => {
  if (form.hasError('field')) {
    element.classList.add('error');
  } else {
    element.classList.remove('error');
  }
});
```

---

## Comparison with Related Methods

### `hasError()` vs `getError()` vs `shouldShowError()`

```javascript
const form = ReactiveUtils.form({ email: '' });
form.setError('email', 'Invalid email');

// hasError() - returns boolean
console.log(form.hasError('email')); // true

// getError() - returns error message
console.log(form.getError('email')); // "Invalid email"

// shouldShowError() - checks error AND touched
console.log(form.shouldShowError('email')); // depends on touched state
```

**When to use each:**
- **`hasError()`** - Check if error exists
- **`getError()`** - Get the error message
- **`shouldShowError()`** - Decide if should show error to user

---

## Summary

### What `hasError()` Does:

1. ✅ Checks if specific field has error
2. ✅ Returns boolean (`true`/`false`)
3. ✅ Works in reactive effects
4. ✅ Handles non-existent fields gracefully
5. ✅ Simple and readable

### When to Use It:

- Conditional logic based on errors
- Enabling/disabling buttons
- Showing/hiding UI elements
- Applying conditional styles
- Checking before submission
- Any boolean check for errors

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ fieldName: '' });

// Check if has error
if (form.hasError('fieldName')) {
  // Handle error case
} else {
  // Handle valid case
}

// In effects
ReactiveUtils.effect(() => {
  if (form.hasError('fieldName')) {
    // Update UI when error exists
  }
});
```

---

**Remember:** `hasError()` is your simple error checker. Use it for clean boolean checks when you need to know if a field has an error. It returns `true` if error exists, `false` if not - simple as that! 🎉
