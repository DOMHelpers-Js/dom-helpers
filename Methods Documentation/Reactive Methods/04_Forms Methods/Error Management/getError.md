# Understanding `getError()` - A Beginner's Guide

## What is `getError()`?

`getError()` is a method that retrieves the error message for a specific form field. It returns the error message string if an error exists, or `undefined` if there's no error.

Think of it as your **error message reader** - it gives you the actual error text for a field.

---

## Why Does This Exist?

### The Direct Way vs The Method Way

You can access errors directly, but `getError()` provides a consistent API:

```javascript
const form = ReactiveUtils.form({ email: '' });

form.setError('email', 'Invalid email address');

// ❌ Direct access - works but not part of API
const error = form.errors.email;

// ✅ Using getError() - consistent with form API
const error = form.getError('email');
```

**Benefits:**
- Consistent with `hasError()` and `setError()`
- Part of the form API pattern
- Handles missing fields gracefully
- More readable

---

## How Does It Work?

### The Simple Process

When you call `getError()`:

1. **Takes field name** - You specify which field
2. **Looks up error** - Checks `form.errors[fieldName]`
3. **Returns message** - Returns error string or `undefined`

Think of it like this:

```
getError('email')
      ↓
  form.errors.email
      ↓
  Return error message or undefined
```

---

## Basic Usage

### Getting Error Messages

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Set errors
form.setError('email', 'Email is required');
form.setError('password', 'Password must be at least 8 characters');

// Get error messages
console.log(form.getError('email')); // "Email is required"
console.log(form.getError('password')); // "Password must be at least 8 characters"
console.log(form.getError('username')); // undefined (no error)
```

### Displaying Errors

```javascript
const form = ReactiveUtils.form({ email: '' });

form.setError('email', 'Invalid email format');

// Display the error
const errorElement = document.getElementById('email-error');
errorElement.textContent = form.getError('email');
```

### With Default Values

```javascript
const form = ReactiveUtils.form({ username: '' });

// Get error with fallback
const error = form.getError('username') || 'No error';
console.log(error); // "No error"

form.setError('username', 'Username taken');
const error2 = form.getError('username') || 'No error';
console.log(error2); // "Username taken"
```

---

## Simple Examples Explained

### Example 1: Show Error Messages

```javascript
const loginForm = ReactiveUtils.form({
  email: '',
  password: ''
});

// Show errors automatically
ReactiveUtils.effect(() => {
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  emailError.textContent = loginForm.getError('email') || '';
  passwordError.textContent = loginForm.getError('password') || '';
});

// Set errors from server
loginForm.setErrors({
  email: 'Account not found',
  password: 'Incorrect password'
});

// Errors displayed automatically!
```

**What happens:**

1. Effect watches form errors
2. Gets error messages using `getError()`
3. Displays them in error elements
4. Shows empty string if no error

---

### Example 2: Conditional Error Display

```javascript
const form = ReactiveUtils.form({ email: '' });

ReactiveUtils.effect(() => {
  const errorElement = document.getElementById('email-error');
  const error = form.getError('email');

  if (error) {
    errorElement.textContent = error;
    errorElement.style.display = 'block';
    errorElement.classList.add('error-message');
  } else {
    errorElement.style.display = 'none';
  }
});
```

**What happens:**

1. Gets error message
2. If exists, shows error with styling
3. If doesn't exist, hides error element
4. Updates automatically when error changes

---

### Example 3: Error List

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  password: ''
});

function getErrorList() {
  const fields = ['username', 'email', 'password'];
  const errors = [];

  fields.forEach(field => {
    const error = form.getError(field);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  return errors;
}

// Display error list
const errorList = getErrorList();
console.log(errorList);
// [
//   { field: 'username', message: 'Username required' },
//   { field: 'email', message: 'Invalid email' }
// ]
```

**What happens:**

1. Loops through all fields
2. Gets error for each using `getError()`
3. Builds list of errors
4. Returns structured error data

---

## Real-World Example: Form Error Summary

```javascript
const checkoutForm = ReactiveUtils.form({
  email: '',
  cardNumber: '',
  cardExpiry: '',
  cardCVV: '',
  billingAddress: ''
});

// Display error summary at top of form
ReactiveUtils.effect(() => {
  const errorSummary = document.getElementById('error-summary');
  const fields = ['email', 'cardNumber', 'cardExpiry', 'cardCVV', 'billingAddress'];

  const errors = [];

  fields.forEach(field => {
    const error = checkoutForm.getError(field);
    if (error) {
      const fieldLabel = getFieldLabel(field);
      errors.push(`${fieldLabel}: ${error}`);
    }
  });

  if (errors.length > 0) {
    errorSummary.innerHTML = `
      <div class="error-summary">
        <h4>Please fix the following errors:</h4>
        <ul>
          ${errors.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>
    `;
    errorSummary.style.display = 'block';
  } else {
    errorSummary.style.display = 'none';
  }
});

function getFieldLabel(field) {
  const labels = {
    email: 'Email Address',
    cardNumber: 'Card Number',
    cardExpiry: 'Expiry Date',
    cardCVV: 'CVV',
    billingAddress: 'Billing Address'
  };
  return labels[field] || field;
}

// Set errors from payment processing
checkoutForm.setErrors({
  cardNumber: 'Invalid card number',
  cardExpiry: 'Card has expired'
});
```

**What happens:**
- Collects all errors using `getError()`
- Creates formatted error summary
- Shows at top of form
- Updates automatically when errors change
- User sees all issues at once

---

## Common Patterns

### Pattern 1: Display with Default

```javascript
const errorMsg = form.getError('email') || 'No error';
errorElement.textContent = errorMsg;
```

### Pattern 2: Conditional Display

```javascript
const error = form.getError('field');
if (error) {
  showError(error);
} else {
  hideError();
}
```

### Pattern 3: Format Error Message

```javascript
const error = form.getError('email');
const formattedError = error ? `Error: ${error}` : '';
```

### Pattern 4: Collect All Errors

```javascript
const allErrors = fields
  .map(field => form.getError(field))
  .filter(Boolean);
```

---

## Common Beginner Questions

### Q: What's the difference between `getError()` and `hasError()`?

**Answer:**

- **`hasError()`** - Returns boolean (true/false)
- **`getError()`** - Returns error message (string)

```javascript
form.setError('email', 'Invalid email');

console.log(form.hasError('email')); // true
console.log(form.getError('email')); // "Invalid email"
```

### Q: What does it return if no error exists?

**Answer:**

Returns `undefined`:

```javascript
console.log(form.getError('field')); // undefined

// Use default value
console.log(form.getError('field') || ''); // ""
```

### Q: Can I use it directly in template strings?

**Answer:**

Yes, but handle undefined:

```javascript
// ❌ Shows "undefined"
const msg = `Error: ${form.getError('email')}`;

// ✅ Better
const error = form.getError('email');
const msg = error ? `Error: ${error}` : '';
```

### Q: Is it the same as accessing `form.errors.field`?

**Answer:**

Yes, they're equivalent:

```javascript
// Both work the same
const error1 = form.getError('email');
const error2 = form.errors.email;

console.log(error1 === error2); // true
```

### Q: Does it work with nested fields?

**Answer:**

Yes, using dot notation:

```javascript
form.setError('user.email', 'Invalid email');
console.log(form.getError('user.email')); // "Invalid email"
```

---

## Tips for Success

### 1. Provide Default Values

```javascript
// ✅ Avoid displaying "undefined"
const error = form.getError('field') || '';
errorElement.textContent = error;
```

### 2. Use in Effects for Reactive Display

```javascript
// ✅ Automatically updates when error changes
ReactiveUtils.effect(() => {
  element.textContent = form.getError('field') || '';
});
```

### 3. Check Before Using

```javascript
// ✅ Check if exists first
const error = form.getError('field');
if (error) {
  displayError(error);
}
```

### 4. Use with shouldShowError()

```javascript
// ✅ Only show if should be visible
if (form.shouldShowError('field')) {
  const error = form.getError('field');
  showError(error);
}
```

### 5. Format Consistently

```javascript
// ✅ Consistent error formatting
const error = form.getError('field');
const formatted = error ? `⚠️ ${error}` : '';
```

---

## Comparison Table

| Method | Returns | Use Case |
|--------|---------|----------|
| `hasError('field')` | Boolean | Check if error exists |
| `getError('field')` | String or undefined | Get error message |
| `shouldShowError('field')` | Boolean | Check if should display to user |
| `form.errors.field` | String or undefined | Direct access (same as getError) |

---

## Summary

### What `getError()` Does:

1. ✅ Returns error message for specific field
2. ✅ Returns `undefined` if no error
3. ✅ Works with nested fields (dot notation)
4. ✅ Part of consistent form API
5. ✅ Reactive when used in effects

### When to Use It:

- Displaying error messages to users
- Getting error text for logging
- Building error summaries
- Formatting error displays
- Any time you need the actual error message

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ fieldName: '' });

// Get error message
const error = form.getError('fieldName');

// Display with default
const errorText = form.getError('fieldName') || '';
errorElement.textContent = errorText;

// Conditional display
if (form.getError('fieldName')) {
  showError(form.getError('fieldName'));
}

// In effects
ReactiveUtils.effect(() => {
  element.textContent = form.getError('fieldName') || '';
});
```

---

**Remember:** `getError()` gives you the actual error message for a field. Use it to display errors to users. It returns the error text if one exists, or `undefined` if the field is valid. Always provide a default value when displaying! 🎉
