# Understanding `isValid` - A Beginner's Guide

## What is `isValid`?

`isValid` is a computed property that tells you if the entire form is valid. It returns `true` if there are no errors, `false` if any field has an error.

Think of it as your **form health indicator** - a quick yes/no answer about form validity.

---

## Why Does This Exist?

### The Problem: Checking Form Validity

You need to know if the form is valid before allowing submission:

```javascript
const form = ReactiveUtils.form(
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

// ❌ Manual check - check all errors
const hasEmailError = form.hasError('email');
const hasPasswordError = form.hasError('password');
const isFormValid = !hasEmailError && !hasPasswordError;

if (isFormValid) {
  submitForm();
}

// ✅ With isValid - one property
if (form.isValid) {
  submitForm();
}
```

**Why this matters:**
- Single property to check validity
- No need to check each field
- Automatically updates
- Perfect for submit buttons
- Clean and readable

---

## How Does It Work?

### The Simple Truth

`isValid` is a computed property that checks if `errors` object is empty:

```javascript
// What isValid does internally:
get isValid() {
  return Object.keys(this.errors).length === 0;
}
```

Think of it like this:

```
form.isValid
    ↓
Check form.errors
    ↓
Any errors? → Yes → Return false
           → No → Return true
```

---

## Basic Usage

### Check Form Validity

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Check if form is valid
console.log(form.isValid); // true (no errors yet)

// Add an error
form.setError('email', 'Invalid email');

console.log(form.isValid); // false (has error)
```

### Enable Submit Button

```javascript
const form = ReactiveUtils.form({ username: '', email: '' });

// Enable/disable submit button based on validity
ReactiveUtils.effect(() => {
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = !form.isValid;
});
```

### Conditional Submission

```javascript
const form = ReactiveUtils.form({ name: '', email: '' });

document.querySelector('form').onsubmit = (e) => {
  e.preventDefault();

  if (form.isValid) {
    submitForm();
  } else {
    alert('Please fix the errors');
  }
};
```

---

## Simple Examples Explained

### Example 1: Submit Button State

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

// Enable submit button only when form is valid
ReactiveUtils.effect(() => {
  const submitBtn = document.getElementById('submit-btn');

  if (loginForm.isValid) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log In';
    submitBtn.classList.add('btn-enabled');
  } else {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Please Complete Form';
    submitBtn.classList.remove('btn-enabled');
  }
});
```

**What happens:**

1. Initially, form is valid (no errors)
2. User types invalid email
3. Validation runs, error set
4. `form.isValid` becomes `false`
5. Submit button disables automatically
6. User fixes email
7. `form.isValid` becomes `true`
8. Submit button enables
9. All reactive!

---

### Example 2: Form Status Indicator

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

// Show form status
ReactiveUtils.effect(() => {
  const statusElement = document.getElementById('form-status');

  if (registrationForm.isValid) {
    statusElement.textContent = '✅ Form is valid';
    statusElement.className = 'status-valid';
  } else {
    const errorCount = Object.keys(registrationForm.errors).length;
    statusElement.textContent = `❌ ${errorCount} error(s) in form`;
    statusElement.className = 'status-invalid';
  }
});

// Show progress bar
ReactiveUtils.effect(() => {
  const progressBar = document.getElementById('progress-bar');
  const totalFields = 4;
  const validFields = totalFields - Object.keys(registrationForm.errors).length;
  const progress = (validFields / totalFields) * 100;

  progressBar.style.width = `${progress}%`;

  if (registrationForm.isValid) {
    progressBar.classList.add('progress-complete');
  } else {
    progressBar.classList.remove('progress-complete');
  }
});
```

**What happens:**

1. Status shows error count or success
2. Progress bar shows completion percentage
3. Updates automatically as user types
4. Visual feedback on validity
5. User knows when form is ready

---

### Example 3: Multi-Step Form Navigation

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
    city: ''
  },
  {
    validators: {
      firstName: ReactiveUtils.validators.required(),
      lastName: ReactiveUtils.validators.required(),
      email: ReactiveUtils.validators.email(),
      phone: ReactiveUtils.validators.pattern(/^\d{10}$/),
      address: ReactiveUtils.validators.required(),
      city: ReactiveUtils.validators.required()
    }
  }
);

let currentStep = 1;

// Check if current step is valid
function isCurrentStepValid() {
  const stepFields = {
    1: ['firstName', 'lastName'],
    2: ['email', 'phone'],
    3: ['address', 'city']
  };

  const fields = stepFields[currentStep];
  return fields.every(field => !wizardForm.hasError(field));
}

// Next button
document.getElementById('next-btn').onclick = () => {
  // Touch current step fields
  const stepFields = {
    1: ['firstName', 'lastName'],
    2: ['email', 'phone'],
    3: ['address', 'city']
  };

  stepFields[currentStep].forEach(field => {
    wizardForm.setTouched(field);
  });

  if (isCurrentStepValid()) {
    currentStep++;
    updateStepDisplay();
  } else {
    alert('Please fix errors before continuing');
  }
};

// Show submit button only on last step and only if valid
ReactiveUtils.effect(() => {
  const submitBtn = document.getElementById('submit-btn');

  if (currentStep === 3 && wizardForm.isValid) {
    submitBtn.style.display = 'block';
    submitBtn.disabled = false;
  } else if (currentStep === 3) {
    submitBtn.style.display = 'block';
    submitBtn.disabled = true;
  } else {
    submitBtn.style.display = 'none';
  }
});
```

**What happens:**

1. User fills step 1
2. Validates before moving forward
3. Each step must be valid
4. On final step, check overall validity
5. Submit button shows only if `isValid`
6. User can't submit invalid form

---

## Real-World Example: Complete Registration Form

```javascript
const registrationForm = ReactiveUtils.form(
  {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    receiveNewsletter: false
  },
  {
    validators: {
      username: ReactiveUtils.validators.combine(
        ReactiveUtils.validators.required('Username is required'),
        ReactiveUtils.validators.minLength(3, 'Username must be at least 3 characters')
      ),
      email: ReactiveUtils.validators.combine(
        ReactiveUtils.validators.required('Email is required'),
        ReactiveUtils.validators.email('Please enter a valid email')
      ),
      password: ReactiveUtils.validators.combine(
        ReactiveUtils.validators.required('Password is required'),
        ReactiveUtils.validators.minLength(8, 'Password must be at least 8 characters')
      ),
      confirmPassword: ReactiveUtils.validators.match('password', 'Passwords must match'),
      acceptTerms: ReactiveUtils.validators.custom(
        (value) => value === true,
        'You must accept the terms and conditions'
      )
    }
  }
);

// Bind inputs
registrationForm.bindToInputs('#registration-form');

// Submit button state
ReactiveUtils.effect(() => {
  const submitBtn = document.getElementById('submit-btn');
  const progressRing = document.getElementById('progress-ring');

  if (registrationForm.isValid) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
    submitBtn.classList.add('btn-ready');
    progressRing.classList.add('complete');
  } else {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Please Complete Form';
    submitBtn.classList.remove('btn-ready');
    progressRing.classList.remove('complete');
  }
});

// Form validity badge
ReactiveUtils.effect(() => {
  const badge = document.getElementById('validity-badge');

  if (registrationForm.isValid) {
    badge.innerHTML = '✓ Ready to Submit';
    badge.className = 'badge badge-success';
  } else {
    const errorCount = Object.keys(registrationForm.errors).length;
    badge.innerHTML = `${errorCount} field${errorCount > 1 ? 's' : ''} need${errorCount === 1 ? 's' : ''} attention`;
    badge.className = 'badge badge-warning';
  }
});

// Completion percentage
ReactiveUtils.effect(() => {
  const totalFields = 5; // username, email, password, confirmPassword, acceptTerms
  const errorCount = Object.keys(registrationForm.errors).length;
  const validFields = totalFields - errorCount;
  const percentage = Math.round((validFields / totalFields) * 100);

  document.getElementById('completion-percentage').textContent = `${percentage}%`;
  document.getElementById('completion-bar').style.width = `${percentage}%`;
});

// Show different messages based on validity
ReactiveUtils.effect(() => {
  const messageElement = document.getElementById('help-message');

  if (registrationForm.isValid && registrationForm.isDirty) {
    messageElement.innerHTML = `
      <div class="alert alert-success">
        <strong>Great!</strong> Your form is complete and ready to submit.
      </div>
    `;
  } else if (!registrationForm.isValid && registrationForm.isDirty) {
    const errors = Object.entries(registrationForm.errors);
    const errorList = errors.map(([field, msg]) => `<li>${field}: ${msg}</li>`).join('');

    messageElement.innerHTML = `
      <div class="alert alert-info">
        <strong>Almost there!</strong> Please fix the following:
        <ul>${errorList}</ul>
      </div>
    `;
  } else {
    messageElement.innerHTML = `
      <div class="alert alert-light">
        Fill out all required fields to create your account.
      </div>
    `;
  }
});

// Warn before leaving if form is dirty and valid
window.onbeforeunload = (e) => {
  if (registrationForm.isDirty && registrationForm.isValid) {
    e.preventDefault();
    return 'You have a completed form that hasn\'t been submitted. Leave anyway?';
  }
};

// Form submission
document.getElementById('registration-form').onsubmit = (e) => {
  e.preventDefault();

  registrationForm.touchAll();

  if (!registrationForm.isValid) {
    alert('Please fix all errors before submitting');
    return;
  }

  registrationForm.submit(async () => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationForm.values)
      });

      if (response.ok) {
        alert('Registration successful!');
        window.location.href = '/welcome';
      } else {
        const errors = await response.json();
        registrationForm.setErrors(errors.fieldErrors);
      }
    } catch (err) {
      alert('Registration failed. Please try again.');
    }
  });
};
```

**What happens:**
- Submit button enabled only when `isValid`
- Badge shows validity status
- Progress bar shows completion percentage
- Help messages update based on validity
- Warns before leaving if valid but not submitted
- Submission only allowed if `isValid`
- Professional, user-friendly form

---

## Common Patterns

### Pattern 1: Enable Submit Button

```javascript
ReactiveUtils.effect(() => {
  submitBtn.disabled = !form.isValid;
});
```

### Pattern 2: Conditional Submission

```javascript
if (form.isValid) {
  submitForm();
}
```

### Pattern 3: Show Status

```javascript
ReactiveUtils.effect(() => {
  status.textContent = form.isValid ? '✓ Valid' : '✗ Invalid';
});
```

### Pattern 4: Combine with isDirty

```javascript
ReactiveUtils.effect(() => {
  // Show save button only if valid AND modified
  saveBtn.disabled = !form.isValid || !form.isDirty;
});
```

---

## Common Beginner Questions

### Q: What's the difference between `isValid` and `validate()`?

**Answer:**

- **`isValid`** = Property that checks current state (doesn't run validation)
- **`validate()`** = Method that runs validation and returns result

```javascript
// isValid - just reads current state
console.log(form.isValid); // true/false

// validate() - runs validators and returns result
form.validate(); // Runs validation, returns true/false
```

### Q: Does accessing `isValid` trigger validation?

**Answer:**

No! It just reads the current error state:

```javascript
// This doesn't run validators
console.log(form.isValid);

// This runs validators
form.validate();
```

### Q: Is `isValid` reactive?

**Answer:**

Yes! Updates automatically in effects:

```javascript
ReactiveUtils.effect(() => {
  console.log(form.isValid);
  // Re-runs whenever errors change
});
```

### Q: Can a form be valid with untouched fields?

**Answer:**

Yes! `isValid` only checks errors, not touched state:

```javascript
const form = ReactiveUtils.form({ email: '' });

console.log(form.isValid); // true (no errors)
console.log(form.isTouched('email')); // false (not touched)
```

### Q: What if a field has no validator?

**Answer:**

Fields without validators are always considered valid:

```javascript
const form = ReactiveUtils.form({
  name: '',     // No validator
  email: ''     // Has validator
});

// isValid only considers fields with validators
console.log(form.isValid); // true/false based on email only
```

---

## Tips for Success

### 1. Use for Submit Button State

```javascript
// ✅ Standard pattern
ReactiveUtils.effect(() => {
  submitBtn.disabled = !form.isValid;
});
```

### 2. Check Before Submission

```javascript
// ✅ Always check validity
if (form.isValid) {
  submitForm();
} else {
  alert('Please fix errors');
}
```

### 3. Combine with Other Properties

```javascript
// ✅ Multiple conditions
ReactiveUtils.effect(() => {
  saveBtn.disabled = !form.isValid || !form.isDirty;
});
```

### 4. Show Visual Feedback

```javascript
// ✅ Update UI based on validity
ReactiveUtils.effect(() => {
  container.classList.toggle('form-valid', form.isValid);
  container.classList.toggle('form-invalid', !form.isValid);
});
```

### 5. Use in Effects for Reactivity

```javascript
// ✅ Automatic updates
ReactiveUtils.effect(() => {
  if (form.isValid) {
    showSuccessMessage();
  }
});
```

---

## Summary

### What `isValid` Does:

1. ✅ Computed property (not a method)
2. ✅ Returns `true` if no errors
3. ✅ Returns `false` if any errors exist
4. ✅ Reactive - updates automatically
5. ✅ Doesn't trigger validation
6. ✅ Perfect for submit button state

### When to Use It:

- Enabling/disabling submit buttons (most common)
- Showing form validity status
- Conditional form submission
- Progress indicators
- Visual feedback
- Any validity check

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ field: '' });

// Check validity
if (form.isValid) {
  console.log('Form is valid!');
}

// Use in effects (most common)
ReactiveUtils.effect(() => {
  submitBtn.disabled = !form.isValid;
});

// Check before submit
form.onsubmit = (e) => {
  e.preventDefault();
  if (form.isValid) {
    submitForm();
  }
};
```

---

**Remember:** `isValid` is a property (not a method) that tells you if your form has any errors. Use it to control submit buttons and show validity status. It's reactive, so it updates automatically! 🎉
