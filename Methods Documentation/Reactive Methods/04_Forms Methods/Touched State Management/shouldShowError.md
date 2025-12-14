# Understanding `shouldShowError()` - A Beginner's Guide

## What is `shouldShowError()`?

`shouldShowError()` is a method that checks if an error should be displayed to the user for a specific field. It returns `true` if the field **has an error AND has been touched**.

Think of it as your **error display decision maker** - it tells you when it's the right time to show an error to the user.

---

## Why Does This Exist?

### The Problem: When to Show Errors?

You don't want to show errors immediately, but you also don't want to check two conditions every time:

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email()
    }
  }
);

// ❌ Manual check - verbose and repetitive
if (form.isTouched('email') && form.hasError('email')) {
  displayError(form.getError('email'));
}

// ✅ With shouldShowError() - clean and simple
if (form.shouldShowError('email')) {
  displayError(form.getError('email'));
}
```

**Why this matters:**
- Single method instead of two checks
- Consistent error display logic
- Better user experience
- Less code to write

---

## How Does It Work?

### The Logic Behind It

`shouldShowError()` combines two checks into one:

```javascript
// What shouldShowError() does internally:
shouldShowError(field) {
  return this.isTouched(field) && this.hasError(field);
}
```

Think of it like this:

```
shouldShowError('email')
        ↓
  Is email touched? → Yes
        ↓
  Does email have error? → Yes
        ↓
  Return true (show error!)
```

---

## Basic Usage

### Simple Error Display

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email()
    }
  }
);

// Show error only when appropriate
if (form.shouldShowError('email')) {
  console.log('Show error to user');
  console.log('Error:', form.getError('email'));
} else {
  console.log('Hide error');
}
```

### In Reactive Effects

```javascript
const form = ReactiveUtils.form({ username: '' });

ReactiveUtils.effect(() => {
  const errorElement = document.getElementById('username-error');

  if (form.shouldShowError('username')) {
    errorElement.textContent = form.getError('username');
    errorElement.style.display = 'block';
  } else {
    errorElement.style.display = 'none';
  }
});
```

### Multiple Fields

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

['email', 'password'].forEach(field => {
  if (form.shouldShowError(field)) {
    console.log(`${field}: ${form.getError(field)}`);
  }
});
```

---

## Simple Examples Explained

### Example 1: Clean Error Display

```javascript
const loginForm = ReactiveUtils.form(
  {
    email: '',
    password: ''
  },
  {
    validators: {
      email: ReactiveUtils.validators.email(),
      password: ReactiveUtils.validators.minLength(8)
    }
  }
);

// Show errors automatically
ReactiveUtils.effect(() => {
  // Email error
  const emailError = document.getElementById('email-error');
  emailError.textContent = loginForm.shouldShowError('email')
    ? loginForm.getError('email')
    : '';

  // Password error
  const passwordError = document.getElementById('password-error');
  passwordError.textContent = loginForm.shouldShowError('password')
    ? loginForm.getError('password')
    : '';
});
```

**What happens:**

1. Initially, no errors shown (fields not touched)
2. User types invalid email
3. User leaves email field (now touched)
4. `shouldShowError('email')` returns `true`
5. Error displays
6. Clean, intuitive UX

---

### Example 2: Conditional Styling

```javascript
const form = ReactiveUtils.form({ email: '' });

ReactiveUtils.effect(() => {
  const input = document.getElementById('email');

  if (form.shouldShowError('email')) {
    input.classList.add('input-error');
    input.classList.remove('input-success');
  } else if (form.isTouched('email')) {
    input.classList.add('input-success');
    input.classList.remove('input-error');
  } else {
    input.classList.remove('input-error', 'input-success');
  }
});
```

**What happens:**

1. Untouched: No styling
2. Touched + Valid: Green border
3. Touched + Invalid: Red border
4. Visual feedback based on state

---

### Example 3: Error Summary

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  password: ''
});

function getVisibleErrors() {
  const fields = ['username', 'email', 'password'];
  const errors = [];

  fields.forEach(field => {
    if (form.shouldShowError(field)) {
      errors.push({
        field: field,
        message: form.getError(field)
      });
    }
  });

  return errors;
}

// Display error count
const visibleErrors = getVisibleErrors();
console.log(`${visibleErrors.length} error(s) visible to user`);
```

**What happens:**

1. Collects only errors that should be shown
2. Excludes errors on untouched fields
3. Shows accurate error count
4. User sees relevant errors only

---

## Real-World Example: Complete Registration Form

```javascript
const registrationForm = ReactiveUtils.form(
  {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  },
  {
    validators: {
      username: ReactiveUtils.validators.minLength(3, 'Username must be at least 3 characters'),
      email: ReactiveUtils.validators.email('Please enter a valid email'),
      password: ReactiveUtils.validators.minLength(8, 'Password must be at least 8 characters'),
      confirmPassword: ReactiveUtils.validators.match('password', 'Passwords must match'),
      phone: ReactiveUtils.validators.pattern(/^\d{10}$/, 'Phone must be 10 digits')
    }
  }
);

// Mark fields as touched on blur
['username', 'email', 'password', 'confirmPassword', 'phone'].forEach(field => {
  document.getElementById(field).onblur = () => {
    registrationForm.setTouched(field);
  };
});

// Display errors intelligently
ReactiveUtils.effect(() => {
  const fields = ['username', 'email', 'password', 'confirmPassword', 'phone'];

  fields.forEach(field => {
    const errorElement = document.getElementById(`${field}-error`);
    const inputElement = document.getElementById(field);

    // Show error only if should be visible
    if (registrationForm.shouldShowError(field)) {
      errorElement.textContent = registrationForm.getError(field);
      errorElement.style.display = 'block';
      inputElement.setAttribute('aria-invalid', 'true');
      inputElement.setAttribute('aria-describedby', `${field}-error`);
    } else {
      errorElement.style.display = 'none';
      inputElement.removeAttribute('aria-invalid');
      inputElement.removeAttribute('aria-describedby');
    }
  });
});

// Show error summary for visible errors
ReactiveUtils.effect(() => {
  const errorSummary = document.getElementById('error-summary');
  const fields = ['username', 'email', 'password', 'confirmPassword', 'phone'];

  const visibleErrors = fields.filter(field =>
    registrationForm.shouldShowError(field)
  );

  if (visibleErrors.length > 0) {
    const errorMessages = visibleErrors.map(field =>
      `<li>${field}: ${registrationForm.getError(field)}</li>`
    ).join('');

    errorSummary.innerHTML = `
      <div class="alert alert-warning">
        <strong>${visibleErrors.length} error(s) to fix:</strong>
        <ul>${errorMessages}</ul>
      </div>
    `;
    errorSummary.style.display = 'block';
  } else {
    errorSummary.style.display = 'none';
  }
});

// Form submission
document.getElementById('registration-form').onsubmit = (e) => {
  e.preventDefault();

  // Touch all fields to reveal all errors
  registrationForm.touchAll();

  if (registrationForm.isValid) {
    submitRegistration(registrationForm.values);
  } else {
    // Focus first field with visible error
    const firstErrorField = ['username', 'email', 'password', 'confirmPassword', 'phone']
      .find(field => registrationForm.shouldShowError(field));

    if (firstErrorField) {
      document.getElementById(firstErrorField).focus();
    }
  }
};
```

**What happens:**
- Errors shown progressively as fields touched
- Error summary shows only visible errors
- Accessibility attributes added
- On submit, all errors revealed
- Focus moves to first error
- Professional, user-friendly validation

---

## Common Patterns

### Pattern 1: Simple Error Display

```javascript
if (form.shouldShowError('field')) {
  showError(form.getError('field'));
} else {
  hideError();
}
```

### Pattern 2: Conditional Styling

```javascript
element.classList.toggle('error', form.shouldShowError('field'));
```

### Pattern 3: Ternary Operator

```javascript
const errorText = form.shouldShowError('field')
  ? form.getError('field')
  : '';
```

### Pattern 4: Filter Visible Errors

```javascript
const visibleErrors = fields.filter(field =>
  form.shouldShowError(field)
);
```

---

## Common Beginner Questions

### Q: What's the difference between `shouldShowError()`, `hasError()`, and `isTouched()`?

**Answer:**

- **`hasError(field)`** = Field has validation error (regardless of touched)
- **`isTouched(field)`** = User interacted with field (regardless of error)
- **`shouldShowError(field)`** = Has error AND touched (both conditions)

```javascript
form.setError('email', 'Invalid');
// hasError: true, isTouched: false, shouldShowError: false

form.setTouched('email');
// hasError: true, isTouched: true, shouldShowError: true
```

### Q: Does `shouldShowError()` work if I haven't called `setTouched()`?

**Answer:**

It returns `false` until the field is touched:

```javascript
form.setError('email', 'Invalid email');
console.log(form.shouldShowError('email')); // false (not touched)

form.setTouched('email');
console.log(form.shouldShowError('email')); // true (now touched + has error)
```

### Q: When should I use `shouldShowError()` vs manual checks?

**Answer:**

**Use `shouldShowError()`:**
```javascript
// ✅ Clean and simple
if (form.shouldShowError('email')) {
  showError();
}
```

**Use manual checks when you need custom logic:**
```javascript
// ✅ Custom logic needed
if (form.hasError('email') && (form.isTouched('email') || formSubmitted)) {
  showError();
}
```

### Q: Can I customize when errors should show?

**Answer:**

Yes! You can create your own logic:

```javascript
function customShouldShow(field) {
  // Show error if: has error + (touched OR submitted)
  return form.hasError(field) &&
         (form.isTouched(field) || form.submitCount > 0);
}
```

### Q: Is `shouldShowError()` reactive?

**Answer:**

Yes, when used in effects:

```javascript
ReactiveUtils.effect(() => {
  if (form.shouldShowError('email')) {
    // Re-runs when touched state or error state changes
    displayError();
  }
});
```

---

## Tips for Success

### 1. Use for All Error Display Logic

```javascript
// ✅ Consistent error display
ReactiveUtils.effect(() => {
  errorElement.textContent = form.shouldShowError('field')
    ? form.getError('field')
    : '';
});
```

### 2. Combine with Ternary

```javascript
// ✅ Clean one-liner
const error = form.shouldShowError('field') ? form.getError('field') : '';
```

### 3. Use in Templates

```javascript
// ✅ Direct in display logic
element.innerHTML = form.shouldShowError('email')
  ? `<span class="error">${form.getError('email')}</span>`
  : '';
```

### 4. Filter Lists

```javascript
// ✅ Get only visible errors
const visibleErrors = fields.filter(f => form.shouldShowError(f));
```

### 5. Default Pattern

```javascript
// ✅ This is the recommended pattern
ReactiveUtils.effect(() => {
  if (form.shouldShowError('field')) {
    displayError(form.getError('field'));
  } else {
    hideError();
  }
});
```

---

## Summary

### What `shouldShowError()` Does:

1. ✅ Checks if error should be shown to user
2. ✅ Returns `true` if has error AND touched
3. ✅ Single method instead of two checks
4. ✅ Perfect for error display logic
5. ✅ Reactive when used in effects

### When to Use It:

- Displaying validation errors
- Conditional error styling
- Error summary displays
- Accessibility attributes
- Any error display decision
- **Default choice for showing errors**

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ fieldName: '' });

// Show error only when appropriate
if (form.shouldShowError('fieldName')) {
  displayError(form.getError('fieldName'));
}

// In effects (most common)
ReactiveUtils.effect(() => {
  const errorText = form.shouldShowError('fieldName')
    ? form.getError('fieldName')
    : '';

  errorElement.textContent = errorText;
});
```

---

**Remember:** `shouldShowError()` is your go-to method for deciding when to display errors. It checks both touched state AND error existence, giving you the right UX: show errors only after the user has interacted with a field! 🎉
