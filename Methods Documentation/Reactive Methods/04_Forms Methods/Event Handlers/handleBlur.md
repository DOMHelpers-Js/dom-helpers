# Understanding `handleBlur()` - A Beginner's Guide

## What is `handleBlur()`?

`handleBlur()` is a method that creates an event handler for when an input loses focus (blur event). It marks the field as touched, which is perfect for showing validation errors after the user leaves a field.

Think of it as your **"field visited" marker** - it records when users have finished interacting with a field.

---

## Why Does This Exist?

### The Problem: When to Show Errors?

You want to show errors only after the user has finished with a field, not while they're typing:

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email()
    }
  }
);

// ❌ Manual blur handling - repetitive
document.getElementById('email').onblur = () => {
  form.setTouched('email');
};

document.getElementById('password').onblur = () => {
  form.setTouched('password');
};
// Lots of repetitive code!

// ✅ With handleBlur() - clean and simple
document.getElementById('email').onblur = form.handleBlur('email');
document.getElementById('password').onblur = form.handleBlur('password');
```

**Why this matters:**
- Better user experience (no errors while typing)
- Less boilerplate code
- Automatic touched marking
- Consistent behavior
- Cleaner code

---

## How Does It Work?

### The Simple Process

When you call `handleBlur(fieldName)`:

1. **Returns handler function** - Gets an event handler
2. **On blur event** - When user leaves field
3. **Marks as touched** - Calls `setTouched(fieldName)`
4. **Triggers validation** - Errors become visible

Think of it like this:

```
handleBlur('email')
    ↓
Returns: (event) => {
  form.setTouched('email'); // Automatic!
}
    ↓
User leaves field → Event fires → Field marked touched → Errors show
```

---

## Basic Usage

### Mark Field as Touched on Blur

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Connect blur events
document.getElementById('email').onblur = form.handleBlur('email');
document.getElementById('password').onblur = form.handleBlur('password');

// Errors will show after user leaves field
```

### All Inputs at Once

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  phone: ''
});

// Connect all fields
['username', 'email', 'phone'].forEach(field => {
  document.getElementById(field).onblur = form.handleBlur(field);
});
```

### Combined with handleChange

```javascript
const form = ReactiveUtils.form({ email: '' });

const input = document.getElementById('email');

// Update value on input
input.oninput = form.handleChange('email');

// Mark touched on blur
input.onblur = form.handleBlur('email');
```

---

## Simple Examples Explained

### Example 1: Progressive Error Display

```javascript
const loginForm = ReactiveUtils.form(
  {
    email: '',
    password: ''
  },
  {
    validators: {
      email: ReactiveUtils.validators.email('Please enter a valid email'),
      password: ReactiveUtils.validators.minLength(8, 'Password must be at least 8 characters')
    }
  }
);

// Connect change and blur handlers
['email', 'password'].forEach(field => {
  const input = document.getElementById(field);

  // Update value on every keystroke
  input.oninput = loginForm.handleChange(field);

  // Mark as touched when leaving field
  input.onblur = loginForm.handleBlur(field);
});

// Show errors only for touched fields
ReactiveUtils.effect(() => {
  ['email', 'password'].forEach(field => {
    const errorElement = document.getElementById(`${field}-error`);

    if (loginForm.shouldShowError(field)) {
      errorElement.textContent = loginForm.getError(field);
      errorElement.style.display = 'block';
    } else {
      errorElement.style.display = 'none';
    }
  });
});
```

**What happens:**

1. User types in email field
2. Value updates in real-time (handleChange)
3. No errors shown yet
4. User leaves field (blur)
5. Field marked as touched (handleBlur)
6. Error now visible if invalid
7. Clean UX - no premature errors!

---

### Example 2: Registration Form with Field Status

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

// Connect all inputs
['username', 'email', 'password', 'confirmPassword'].forEach(field => {
  const input = document.getElementById(field);

  input.oninput = registrationForm.handleChange(field);
  input.onblur = registrationForm.handleBlur(field);
});

// Show field status icons
ReactiveUtils.effect(() => {
  ['username', 'email', 'password', 'confirmPassword'].forEach(field => {
    const input = document.getElementById(field);
    const icon = document.getElementById(`${field}-icon`);

    // Remove all status classes
    input.classList.remove('input-pristine', 'input-valid', 'input-invalid');

    if (!registrationForm.isTouched(field)) {
      // Field not touched yet
      input.classList.add('input-pristine');
      icon.textContent = '';
    } else if (registrationForm.hasError(field)) {
      // Touched with error
      input.classList.add('input-invalid');
      icon.textContent = '❌';
    } else {
      // Touched and valid
      input.classList.add('input-valid');
      icon.textContent = '✅';
    }
  });
});
```

**What happens:**

1. Fields start with no styling (pristine)
2. User types (value updates)
3. User leaves field (blur)
4. Field marked as touched
5. Shows ❌ if invalid, ✅ if valid
6. Visual feedback after interaction
7. Professional form UX

---

### Example 3: Multi-Step Form with Validation

```javascript
const wizardForm = ReactiveUtils.form(
  {
    // Step 1
    firstName: '',
    lastName: '',

    // Step 2
    email: '',
    phone: '',

    // Step 3
    address: '',
    city: '',
    zipCode: ''
  },
  {
    validators: {
      firstName: ReactiveUtils.validators.required(),
      lastName: ReactiveUtils.validators.required(),
      email: ReactiveUtils.validators.email(),
      phone: ReactiveUtils.validators.pattern(/^\d{10}$/),
      address: ReactiveUtils.validators.required(),
      city: ReactiveUtils.validators.required(),
      zipCode: ReactiveUtils.validators.pattern(/^\d{5}$/)
    }
  }
);

let currentStep = 1;

// Get fields for current step
function getCurrentStepFields() {
  const stepFields = {
    1: ['firstName', 'lastName'],
    2: ['email', 'phone'],
    3: ['address', 'city', 'zipCode']
  };
  return stepFields[currentStep];
}

// Connect all fields
Object.keys(wizardForm.values).forEach(field => {
  const input = document.getElementById(field);
  if (input) {
    input.oninput = wizardForm.handleChange(field);
    input.onblur = wizardForm.handleBlur(field);
  }
});

// Validate current step before moving forward
function canGoToNextStep() {
  const currentFields = getCurrentStepFields();

  // Touch all current step fields
  currentFields.forEach(field => {
    wizardForm.setTouched(field);
  });

  // Check if all current fields are valid
  return currentFields.every(field => !wizardForm.hasError(field));
}

// Next button
document.getElementById('next-btn').onclick = () => {
  if (canGoToNextStep()) {
    currentStep++;
    updateStepDisplay();
  } else {
    alert('Please fix errors in current step');

    // Focus first error field
    const currentFields = getCurrentStepFields();
    const firstError = currentFields.find(field => wizardForm.hasError(field));
    if (firstError) {
      document.getElementById(firstError).focus();
    }
  }
};

// Previous button
document.getElementById('prev-btn').onclick = () => {
  if (currentStep > 1) {
    currentStep--;
    updateStepDisplay();
  }
};
```

**What happens:**

1. User fills step 1 fields
2. Blur events mark fields as touched
3. Errors show as they leave each field
4. Click "Next" button
5. All current step fields touched
6. If valid, moves to next step
7. If invalid, shows errors and focuses first error
8. Professional multi-step validation

---

## Real-World Example: Complete Profile Form

```javascript
const profileForm = ReactiveUtils.form(
  {
    username: '',
    email: '',
    bio: '',
    website: '',
    github: '',
    twitter: '',
    receiveNewsletter: false,
    publicProfile: true
  },
  {
    validators: {
      username: ReactiveUtils.validators.combine(
        ReactiveUtils.validators.required('Username is required'),
        ReactiveUtils.validators.minLength(3, 'Username must be at least 3 characters'),
        ReactiveUtils.validators.pattern(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      ),
      email: ReactiveUtils.validators.combine(
        ReactiveUtils.validators.required('Email is required'),
        ReactiveUtils.validators.email('Please enter a valid email')
      ),
      bio: ReactiveUtils.validators.maxLength(500, 'Bio must be 500 characters or less'),
      website: ReactiveUtils.validators.pattern(
        /^https?:\/\/.+/,
        'Website must start with http:// or https://'
      ),
      github: ReactiveUtils.validators.pattern(
        /^https?:\/\/github\.com\/.+/,
        'GitHub URL must be a valid GitHub profile'
      ),
      twitter: ReactiveUtils.validators.pattern(
        /^@?[a-zA-Z0-9_]+$/,
        'Twitter handle must be valid'
      )
    }
  }
);

// Connect text inputs
['username', 'email', 'bio', 'website', 'github', 'twitter'].forEach(field => {
  const input = document.getElementById(field);
  if (input) {
    input.oninput = profileForm.handleChange(field);
    input.onblur = profileForm.handleBlur(field);
  }
});

// Connect checkboxes (no blur needed for checkboxes)
['receiveNewsletter', 'publicProfile'].forEach(field => {
  const checkbox = document.getElementById(field);
  if (checkbox) {
    checkbox.onchange = profileForm.handleChange(field);
  }
});

// Show inline errors after blur
ReactiveUtils.effect(() => {
  ['username', 'email', 'bio', 'website', 'github', 'twitter'].forEach(field => {
    const errorElement = document.getElementById(`${field}-error`);
    const inputElement = document.getElementById(field);

    if (profileForm.shouldShowError(field)) {
      errorElement.textContent = profileForm.getError(field);
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

// Show touched field count
ReactiveUtils.effect(() => {
  const fields = ['username', 'email', 'bio', 'website', 'github', 'twitter'];
  const touchedCount = fields.filter(field => profileForm.isTouched(field)).length;
  const totalCount = fields.length;

  document.getElementById('progress-text').textContent =
    `${touchedCount}/${totalCount} fields completed`;

  const progress = (touchedCount / totalCount) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
});

// Show success indicators for valid touched fields
ReactiveUtils.effect(() => {
  ['username', 'email', 'bio', 'website', 'github', 'twitter'].forEach(field => {
    const input = document.getElementById(field);
    const successIcon = document.getElementById(`${field}-success`);

    if (profileForm.isTouched(field) && !profileForm.hasError(field) && profileForm.values[field]) {
      successIcon.textContent = '✓';
      successIcon.style.display = 'inline';
      input.classList.add('input-valid');
    } else {
      successIcon.style.display = 'none';
      input.classList.remove('input-valid');
    }
  });
});

// Warn about unsaved changes
let hasUnsavedChanges = false;

ReactiveUtils.effect(() => {
  hasUnsavedChanges = profileForm.isDirty;
});

window.onbeforeunload = (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    return 'You have unsaved changes. Are you sure you want to leave?';
  }
};

// Form submission
document.getElementById('profile-form').onsubmit = async (e) => {
  e.preventDefault();

  profileForm.submit(async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm.values)
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        hasUnsavedChanges = false;
      } else {
        const errors = await response.json();
        Object.entries(errors.fieldErrors).forEach(([field, message]) => {
          profileForm.setError(field, message);
        });
      }
    } catch (err) {
      alert('Failed to update profile. Please try again.');
    }
  });
};
```

**What happens:**
- All text fields connected with handleChange and handleBlur
- Errors show only after user leaves field
- Success indicators for valid touched fields
- Progress bar shows completion
- Accessibility attributes added
- Warns before leaving with unsaved changes
- Professional profile form UX

---

## Common Patterns

### Pattern 1: Connect Blur Handler

```javascript
input.onblur = form.handleBlur('fieldName');
```

### Pattern 2: Combine Change and Blur

```javascript
input.oninput = form.handleChange('fieldName');
input.onblur = form.handleBlur('fieldName');
```

### Pattern 3: Connect Multiple Fields

```javascript
['field1', 'field2', 'field3'].forEach(field => {
  const input = document.getElementById(field);
  input.oninput = form.handleChange(field);
  input.onblur = form.handleBlur(field);
});
```

### Pattern 4: Blur with Custom Logic

```javascript
input.onblur = (e) => {
  form.handleBlur('fieldName')(e);
  // Custom logic after blur
  console.log('Field was blurred');
};
```

---

## Common Beginner Questions

### Q: What's the difference between `handleChange()` and `handleBlur()`?

**Answer:**

- **`handleChange()`** = Updates value on every keystroke
- **`handleBlur()`** = Marks touched when leaving field

```javascript
// handleChange - fires while typing
input.oninput = form.handleChange('email');

// handleBlur - fires when leaving field
input.onblur = form.handleBlur('email');

// Use both together!
input.oninput = form.handleChange('email');
input.onblur = form.handleBlur('email');
```

### Q: Should I use both `handleChange()` and `handleBlur()`?

**Answer:**

Yes! Use both for best UX:

```javascript
// ✅ Recommended pattern
input.oninput = form.handleChange('email'); // Update value
input.onblur = form.handleBlur('email');    // Mark touched
```

### Q: Does `handleBlur()` update the field value?

**Answer:**

No, it only marks the field as touched:

```javascript
// handleBlur - only marks touched
input.onblur = form.handleBlur('email');

// handleChange - updates value
input.oninput = form.handleChange('email');
```

### Q: Why do errors show after blur instead of immediately?

**Answer:**

Better UX! Users shouldn't see errors before they finish typing:

```javascript
// User types "a" in email field
// With blur: No error (field not touched yet)
// Without blur: "Invalid email" (annoying!)

// User leaves field
// Now error shows (they're done typing)
```

### Q: Can I manually trigger blur?

**Answer:**

Yes, by focusing then blurring the element:

```javascript
const input = document.getElementById('email');
input.focus();
input.blur(); // Triggers blur handler
```

---

## Tips for Success

### 1. Always Use with handleChange

```javascript
// ✅ Best practice - use both
input.oninput = form.handleChange('field');
input.onblur = form.handleBlur('field');
```

### 2. Use for Progressive Error Display

```javascript
// ✅ Show errors only after blur
input.onblur = form.handleBlur('email');

ReactiveUtils.effect(() => {
  if (form.shouldShowError('email')) {
    displayError();
  }
});
```

### 3. Connect All Text Fields

```javascript
// ✅ Standard pattern for all text inputs
['name', 'email', 'phone'].forEach(field => {
  const input = document.getElementById(field);
  input.oninput = form.handleChange(field);
  input.onblur = form.handleBlur(field);
});
```

### 4. Don't Use for Checkboxes

```javascript
// ❌ Checkboxes don't need blur
checkbox.onblur = form.handleBlur('acceptTerms');

// ✅ Use change only
checkbox.onchange = form.handleChange('acceptTerms');
```

### 5. Use for Better Form UX

```javascript
// ✅ Professional error display timing
input.onblur = form.handleBlur('field');
// Errors show at the right time
```

---

## Summary

### What `handleBlur()` Does:

1. ✅ Returns event handler function
2. ✅ Fires when field loses focus
3. ✅ Marks field as touched
4. ✅ Enables error display via `shouldShowError()`
5. ✅ Improves form UX
6. ✅ Triggers reactive updates

### When to Use It:

- All text inputs (most common)
- Textareas
- Select dropdowns
- Any field where you want errors after interaction
- Progressive validation
- Professional forms

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ fieldName: '' });

// Connect change and blur
const input = document.getElementById('fieldName');
input.oninput = form.handleChange('fieldName'); // Update value
input.onblur = form.handleBlur('fieldName');    // Mark touched

// Show errors after blur
ReactiveUtils.effect(() => {
  if (form.shouldShowError('fieldName')) {
    displayError(form.getError('fieldName'));
  }
});
```

---

**Remember:** `handleBlur()` marks fields as touched when users leave them. Combine it with `handleChange()` for the best form UX - update values while typing, show errors after blur! 🎉
