# Understanding `setTouched()` - A Beginner's Guide

## What is `setTouched()`?

`setTouched()` is a method that marks a form field as "touched" - meaning the user has interacted with it. This is useful for deciding when to show validation errors.

Think of it as a **field interaction marker** - it records that the user has visited a field.

---

## Why Does This Exist?

### The Problem: When to Show Errors?

You don't want to show errors immediately - only after the user has tried to fill the field:

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.required()
    }
  }
);

// ❌ Error shows immediately when page loads
// User hasn't even tried yet!

// ✅ Better: Only show error after user touches the field
form.$watch('values.email', () => {
  form.setTouched('email'); // Mark as touched when user types
});

// Now error only shows after interaction
```

**Why this matters:**
- Better user experience
- Don't overwhelm users with errors
- Show errors at the right time
- Feels more responsive

---

## How Does It Work?

### The Simple Process

When you call `setTouched()`:

1. **Takes field name** - You specify which field
2. **Marks as touched** - Sets `form.touched[fieldName] = true`
3. **Triggers UI update** - React ivity updates error displays

Think of it like this:

```
setTouched('email')
      ↓
  form.touched.email = true
      ↓
  shouldShowError('email') now returns true
      ↓
  Error displays (if exists)
```

---

## Basic Usage

### Marking a Field as Touched

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Mark fields as touched
form.setTouched('email');
form.setTouched('password');

console.log(form.touched);
// { email: true, password: true }

console.log(form.isTouched('email')); // true
```

### On Input Blur

```javascript
const form = ReactiveUtils.form({ username: '' });

document.getElementById('username').onblur = () => {
  form.setTouched('username');
};
```

### With setValue()

```javascript
const form = ReactiveUtils.form({ email: '' });

// setValue() automatically marks as touched
form.setValue('email', 'test@example.com');

console.log(form.isTouched('email')); // true (automatic!)
```

---

## Simple Examples Explained

### Example 1: Show Errors After Blur

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email()
    }
  }
);

// Show error only after field touched
ReactiveUtils.effect(() => {
  const errorElement = document.getElementById('email-error');

  if (form.shouldShowError('email')) {
    errorElement.textContent = form.getError('email');
    errorElement.style.display = 'block';
  } else {
    errorElement.style.display = 'none';
  }
});

// Mark as touched when user leaves field
document.getElementById('email').onblur = () => {
  form.setTouched('email');
};
```

**What happens:**

1. User types invalid email
2. Validation runs (error exists)
3. Error NOT shown yet (field not touched)
4. User leaves field (blur event)
5. Field marked as touched
6. Error NOW shown

---

### Example 2: Touch on First Keystroke

```javascript
const form = ReactiveUtils.form({ username: '' });

let hasTyped = false;

document.getElementById('username').oninput = (e) => {
  form.setValue('username', e.target.value);

  // Mark as touched on first keystroke
  if (!hasTyped) {
    form.setTouched('username');
    hasTyped = true;
  }
};
```

**What happens:**

1. User starts typing
2. First keystroke marks field as touched
3. Validation errors can now show
4. Subsequent keystrokes don't re-mark

---

### Example 3: Touch Multiple Fields

```javascript
const form = ReactiveUtils.form({
  firstName: '',
  lastName: '',
  email: ''
});

// Touch all required fields when attempting submit
function handleSubmit(e) {
  e.preventDefault();

  // Mark all fields as touched
  form.setTouched('firstName');
  form.setTouched('lastName');
  form.setTouched('email');

  // Now all errors visible
  if (form.isValid) {
    submitForm();
  } else {
    alert('Please fix errors');
  }
}
```

**What happens:**

1. User clicks submit without filling fields
2. All fields marked as touched
3. All validation errors become visible
4. User sees what needs fixing

---

## Real-World Example: Registration Form

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

// Mark field as touched on blur
['username', 'email', 'password', 'confirmPassword'].forEach(field => {
  const input = document.getElementById(field);

  input.onblur = () => {
    registrationForm.setTouched(field);
  };
});

// Show errors only for touched fields
ReactiveUtils.effect(() => {
  ['username', 'email', 'password', 'confirmPassword'].forEach(field => {
    const errorElement = document.getElementById(`${field}-error`);

    if (registrationForm.shouldShowError(field)) {
      errorElement.textContent = registrationForm.getError(field);
      errorElement.style.display = 'block';
    } else {
      errorElement.style.display = 'none';
    }
  });
});

// On submit, touch all fields to show all errors
document.getElementById('registration-form').onsubmit = (e) => {
  e.preventDefault();

  // Touch all fields
  registrationForm.touchAll();

  if (registrationForm.isValid) {
    submitRegistration();
  }
};
```

**What happens:**
- Errors don't show initially
- When user leaves a field, it's marked touched
- Errors appear for touched fields only
- On submit, all fields touched
- User sees all problems at once

---

## Common Patterns

### Pattern 1: Touch on Blur

```javascript
input.onblur = () => {
  form.setTouched('fieldName');
};
```

### Pattern 2: Touch on First Input

```javascript
let touched = false;
input.oninput = () => {
  if (!touched) {
    form.setTouched('fieldName');
    touched = true;
  }
};
```

### Pattern 3: Touch on Submit Attempt

```javascript
form.onsubmit = (e) => {
  e.preventDefault();

  // Touch all fields
  Object.keys(form.values).forEach(field => {
    form.setTouched(field);
  });

  if (form.isValid) submit();
};
```

### Pattern 4: Touch After Delay

```javascript
let blurTimeout;
input.onblur = () => {
  blurTimeout = setTimeout(() => {
    form.setTouched('fieldName');
  }, 300);
};
```

---

## Common Beginner Questions

### Q: What's the difference between `touched` and `dirty`?

**Answer:**

- **Touched** = User interacted with field (focused/typed)
- **Dirty** = Field value changed from initial value

```javascript
form.setTouched('email'); // User visited field
console.log(form.isTouched('email')); // true

// Dirty is about value changes (separate concept)
```

### Q: Does `setValue()` mark fields as touched?

**Answer:**

Yes! `setValue()` automatically marks the field as touched:

```javascript
form.setValue('email', 'test@example.com');
console.log(form.isTouched('email')); // true (automatic)
```

### Q: When should I mark fields as touched?

**Answer:**

Common approaches:
1. **On blur** - User leaves the field
2. **On first input** - User starts typing
3. **On submit** - User tries to submit form
4. **Manually** - Your custom logic

```javascript
// Option 1: Blur (most common)
input.onblur = () => form.setTouched('field');

// Option 2: First input
input.oninput = () => form.setTouched('field');

// Option 3: Submit
submitBtn.onclick = () => form.touchAll();
```

### Q: Can I unmark a field as touched?

**Answer:**

Yes, by setting it to `false`:

```javascript
form.setTouched('email'); // Mark as touched
form.touched.email = false; // Unmark

// Or reset the form
form.reset(); // Clears touched state
```

### Q: What's `shouldShowError()` and how does it relate?

**Answer:**

`shouldShowError()` checks if error should be shown - it returns `true` if field has error AND is touched:

```javascript
// shouldShowError() = hasError() && isTouched()
console.log(form.shouldShowError('email'));
// Only true if email has error AND is touched
```

---

## Tips for Success

### 1. Use with shouldShowError()

```javascript
// ✅ Only show errors for touched fields
if (form.shouldShowError('email')) {
  displayError(form.getError('email'));
}
```

### 2. Touch on Blur for Best UX

```javascript
// ✅ Best practice - touch when user leaves field
input.onblur = () => {
  form.setTouched('fieldName');
};
```

### 3. Touch All on Submit

```javascript
// ✅ Show all errors on submit attempt
form.onsubmit = (e) => {
  e.preventDefault();
  form.touchAll(); // Touch all fields
  if (form.isValid) submit();
};
```

### 4. Don't Touch Too Early

```javascript
// ❌ Bad - touches immediately
form.setTouched('email'); // User hasn't even seen field!

// ✅ Good - touches after interaction
input.onblur = () => form.setTouched('email');
```

### 5. Use in Effects for Reactive Display

```javascript
// ✅ Automatically updates when touched state changes
ReactiveUtils.effect(() => {
  if (form.shouldShowError('field')) {
    showError();
  }
});
```

---

## Summary

### What `setTouched()` Does:

1. ✅ Marks field as interacted with
2. ✅ Sets `form.touched[field] = true`
3. ✅ Enables error display via `shouldShowError()`
4. ✅ Improves user experience
5. ✅ Controls when errors appear

### When to Use It:

- On input blur (most common)
- On first keystroke
- On submit attempt
- When programmatically interacting with field
- Custom validation flows

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ fieldName: '' });

// Mark as touched
form.setTouched('fieldName');

// Common: On blur
input.onblur = () => {
  form.setTouched('fieldName');
};

// Show errors only if touched
ReactiveUtils.effect(() => {
  if (form.shouldShowError('fieldName')) {
    displayError(form.getError('fieldName'));
  }
});
```

---

**Remember:** `setTouched()` marks fields as interacted with. Use it to control when validation errors appear - typically on blur or submit. This creates a better user experience by not showing errors too early! 🎉
