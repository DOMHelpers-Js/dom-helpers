# Understanding `hasErrors` - A Beginner's Guide

## What is `hasErrors`?

`hasErrors` is a computed property that tells you if the form has any validation errors. It returns `true` if any errors exist, `false` if there are no errors.

Think of it as your **error detector** - a quick yes/no answer about whether errors are present.

---

## Why Does This Exist?

### The Problem: Checking for Errors

You need to know if errors exist to show error summaries or prevent actions:

```javascript
const form = ReactiveUtils.form(
  { email: '', password: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email(),
      password: ReactiveUtils.validators.minLength(8)
    }
  }
);

// ❌ Manual check - check errors object
const errorKeys = Object.keys(form.errors);
const hasAnyErrors = errorKeys.length > 0;

if (hasAnyErrors) {
  showErrorSummary();
}

// ✅ With hasErrors - one property
if (form.hasErrors) {
  showErrorSummary();
}
```

**Why this matters:**
- Single property to check for errors
- No need to check errors object manually
- Opposite of `isValid` for readability
- Perfect for error summaries
- Clean and readable

---

## How Does It Work?

### The Simple Truth

`hasErrors` checks if the errors object has any properties:

```javascript
// What hasErrors does internally:
get hasErrors() {
  return Object.keys(this.errors).length > 0;
}

// It's the opposite of isValid
get hasErrors() {
  return !this.isValid;
}
```

Think of it like this:

```
form.hasErrors
    ↓
Check form.errors
    ↓
Has any errors? → Yes → Return true
                → No → Return false
```

---

## Basic Usage

### Check for Errors

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

console.log(form.hasErrors); // false (no errors yet)

// Add an error
form.setError('email', 'Invalid email');

console.log(form.hasErrors); // true (has error!)
```

### Show Error Summary

```javascript
const form = ReactiveUtils.form({ username: '', email: '' });

ReactiveUtils.effect(() => {
  const errorSummary = document.getElementById('error-summary');

  if (form.hasErrors) {
    errorSummary.style.display = 'block';
  } else {
    errorSummary.style.display = 'none';
  }
});
```

### Prevent Submission

```javascript
const form = ReactiveUtils.form({ name: '', email: '' });

document.querySelector('form').onsubmit = (e) => {
  e.preventDefault();

  if (form.hasErrors) {
    alert('Please fix the errors');
    return;
  }

  submitForm();
};
```

---

## Simple Examples Explained

### Example 1: Error Summary Panel

```javascript
const contactForm = ReactiveUtils.form(
  {
    name: '',
    email: '',
    phone: '',
    message: ''
  },
  {
    validators: {
      name: ReactiveUtils.validators.required('Name is required'),
      email: ReactiveUtils.validators.email('Please enter a valid email'),
      phone: ReactiveUtils.validators.pattern(/^\d{10}$/, 'Phone must be 10 digits'),
      message: ReactiveUtils.validators.minLength(20, 'Message must be at least 20 characters')
    }
  }
);

// Bind inputs
contactForm.bindToInputs('#contact-form');

// Show error summary panel
ReactiveUtils.effect(() => {
  const errorPanel = document.getElementById('error-panel');

  if (contactForm.hasErrors) {
    const errors = Object.entries(contactForm.errors);
    const errorList = errors
      .map(([field, message]) => `<li><strong>${field}:</strong> ${message}</li>`)
      .join('');

    errorPanel.innerHTML = `
      <div class="alert alert-danger">
        <h4>Please fix the following errors:</h4>
        <ul>${errorList}</ul>
      </div>
    `;
    errorPanel.style.display = 'block';
  } else {
    errorPanel.style.display = 'none';
  }
});
```

**What happens:**

1. User fills form with invalid data
2. Validation runs, errors set
3. `hasErrors` becomes `true`
4. Error summary panel appears
5. Shows all errors in a list
6. User fixes errors
7. `hasErrors` becomes `false`
8. Panel hides automatically

---

### Example 2: Form Status Badge

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

// Bind inputs
registrationForm.bindToInputs('#registration-form');

// Show status badge
ReactiveUtils.effect(() => {
  const badge = document.getElementById('form-badge');

  if (registrationForm.hasErrors) {
    const errorCount = Object.keys(registrationForm.errors).length;
    badge.innerHTML = `❌ ${errorCount} error${errorCount > 1 ? 's' : ''}`;
    badge.className = 'badge badge-error';
  } else if (registrationForm.isDirty) {
    badge.innerHTML = '✅ Ready to submit';
    badge.className = 'badge badge-success';
  } else {
    badge.innerHTML = '○ Fill out the form';
    badge.className = 'badge badge-neutral';
  }
});

// Show/hide submit button based on errors
ReactiveUtils.effect(() => {
  const submitBtn = document.getElementById('submit-btn');

  if (registrationForm.hasErrors) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Fix Errors First';
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
  }
});
```

**What happens:**

1. Form starts with no errors
2. Badge shows "Fill out the form"
3. User types invalid data
4. `hasErrors` becomes `true`
5. Badge shows error count
6. Submit button disabled
7. User fixes issues
8. `hasErrors` becomes `false`
9. Badge shows "Ready to submit"
10. Submit button enables

---

### Example 3: Multi-Field Validation Alert

```javascript
const checkoutForm = ReactiveUtils.form(
  {
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    billingZip: ''
  },
  {
    validators: {
      cardNumber: ReactiveUtils.validators.pattern(/^\d{16}$/, 'Card number must be 16 digits'),
      cardExpiry: ReactiveUtils.validators.pattern(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
      cardCVV: ReactiveUtils.validators.pattern(/^\d{3}$/, 'CVV must be 3 digits'),
      billingZip: ReactiveUtils.validators.pattern(/^\d{5}$/, 'ZIP must be 5 digits')
    }
  }
);

// Bind inputs
checkoutForm.bindToInputs('#checkout-form');

// Show errors count in header
ReactiveUtils.effect(() => {
  const errorCount = document.getElementById('error-count');

  if (checkoutForm.hasErrors) {
    const count = Object.keys(checkoutForm.errors).length;
    errorCount.textContent = count;
    errorCount.style.display = 'inline-block';
  } else {
    errorCount.style.display = 'none';
  }
});

// Show validation status icon for each field
ReactiveUtils.effect(() => {
  const fields = ['cardNumber', 'cardExpiry', 'cardCVV', 'billingZip'];

  fields.forEach(field => {
    const icon = document.getElementById(`${field}-icon`);
    const input = document.getElementById(field);

    if (checkoutForm.isTouched(field)) {
      if (checkoutForm.hasError(field)) {
        icon.textContent = '❌';
        input.classList.add('input-error');
      } else {
        icon.textContent = '✅';
        input.classList.remove('input-error');
        input.classList.add('input-success');
      }
    } else {
      icon.textContent = '';
      input.classList.remove('input-error', 'input-success');
    }
  });
});

// Checkout button
document.getElementById('checkout-btn').onclick = () => {
  checkoutForm.touchAll();

  if (checkoutForm.hasErrors) {
    // Focus first error field
    const firstErrorField = Object.keys(checkoutForm.errors)[0];
    document.getElementById(firstErrorField).focus();

    alert(`Please fix ${Object.keys(checkoutForm.errors).length} error(s) before proceeding.`);
    return;
  }

  proceedToCheckout();
};
```

**What happens:**

1. Error count badge shows when errors exist
2. Each field shows validation icon
3. User clicks checkout
4. All fields touched
5. If `hasErrors`, focuses first error
6. Shows error count in alert
7. User fixes errors
8. `hasErrors` becomes `false`
9. Checkout proceeds

---

## Real-World Example: Complete Survey Form

```javascript
const surveyForm = ReactiveUtils.form(
  {
    name: '',
    email: '',
    age: '',
    occupation: '',
    experience: '',
    satisfaction: '3',
    feedback: '',
    recommendToFriend: ''
  },
  {
    validators: {
      name: ReactiveUtils.validators.required('Name is required'),
      email: ReactiveUtils.validators.email('Please enter a valid email'),
      age: ReactiveUtils.validators.custom(
        (value) => value >= 18 && value <= 120,
        'Age must be between 18 and 120'
      ),
      occupation: ReactiveUtils.validators.required('Occupation is required'),
      experience: ReactiveUtils.validators.required('Please select your experience level'),
      satisfaction: ReactiveUtils.validators.required('Please rate your satisfaction'),
      feedback: ReactiveUtils.validators.minLength(20, 'Feedback must be at least 20 characters'),
      recommendToFriend: ReactiveUtils.validators.required('Please answer this question')
    }
  }
);

// Bind inputs
surveyForm.bindToInputs('#survey-form');

// Error summary at top
ReactiveUtils.effect(() => {
  const errorSummary = document.getElementById('error-summary');

  if (surveyForm.hasErrors && surveyForm.isDirty) {
    const errorCount = Object.keys(surveyForm.errors).length;
    const totalFields = Object.keys(surveyForm.values).length;
    const validFields = totalFields - errorCount;

    errorSummary.innerHTML = `
      <div class="alert alert-warning">
        <h4>⚠️ Form Incomplete</h4>
        <p><strong>${validFields}/${totalFields}</strong> fields are valid</p>
        <p>${errorCount} field${errorCount > 1 ? 's need' : ' needs'} attention</p>
      </div>
    `;
    errorSummary.style.display = 'block';
  } else if (!surveyForm.hasErrors && surveyForm.isDirty) {
    errorSummary.innerHTML = `
      <div class="alert alert-success">
        <h4>✅ Form Complete</h4>
        <p>All fields are valid. You can submit the survey now.</p>
      </div>
    `;
    errorSummary.style.display = 'block';
  } else {
    errorSummary.style.display = 'none';
  }
});

// Progress bar
ReactiveUtils.effect(() => {
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  const totalFields = Object.keys(surveyForm.values).length;
  const errorCount = surveyForm.hasErrors ? Object.keys(surveyForm.errors).length : 0;
  const validFields = totalFields - errorCount;
  const progress = (validFields / totalFields) * 100;

  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${Math.round(progress)}% Complete`;

  if (surveyForm.hasErrors) {
    progressBar.className = 'progress-bar progress-warning';
  } else {
    progressBar.className = 'progress-bar progress-success';
  }
});

// Error list
ReactiveUtils.effect(() => {
  const errorList = document.getElementById('error-list');

  if (surveyForm.hasErrors) {
    const errors = Object.entries(surveyForm.errors);
    const listItems = errors
      .map(([field, message]) => `
        <li class="error-item">
          <button onclick="document.getElementById('${field}').focus()">
            ${field}
          </button>
          <span>${message}</span>
        </li>
      `)
      .join('');

    errorList.innerHTML = `<ul>${listItems}</ul>`;
    errorList.style.display = 'block';
  } else {
    errorList.style.display = 'none';
  }
});

// Submit button state
ReactiveUtils.effect(() => {
  const submitBtn = document.getElementById('submit-btn');

  if (surveyForm.hasErrors) {
    submitBtn.disabled = true;
    submitBtn.className = 'btn btn-disabled';
    submitBtn.textContent = `Fix ${Object.keys(surveyForm.errors).length} Error(s)`;
  } else if (surveyForm.isDirty) {
    submitBtn.disabled = false;
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Submit Survey';
  } else {
    submitBtn.disabled = true;
    submitBtn.className = 'btn btn-disabled';
    submitBtn.textContent = 'Complete Form First';
  }
});

// Form submission
document.getElementById('survey-form').onsubmit = (e) => {
  e.preventDefault();

  surveyForm.touchAll();

  if (surveyForm.hasErrors) {
    alert('Please fix all errors before submitting');

    // Scroll to first error
    const firstErrorField = Object.keys(surveyForm.errors)[0];
    const firstErrorElement = document.getElementById(firstErrorField);
    firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstErrorElement.focus();

    return;
  }

  surveyForm.submit(async () => {
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyForm.values)
      });

      alert('Thank you for completing the survey!');
      window.location.href = '/thank-you';
    } catch (err) {
      alert('Failed to submit survey. Please try again.');
    }
  });
};
```

**What happens:**
- Error summary shows completion status
- Progress bar changes color based on `hasErrors`
- Error list with clickable field names
- Submit button shows error count
- On submit, scrolls to first error if `hasErrors`
- Complete professional survey form

---

## Common Patterns

### Pattern 1: Show Error Summary

```javascript
if (form.hasErrors) {
  showErrorSummary(form.errors);
}
```

### Pattern 2: Disable Submit Button

```javascript
ReactiveUtils.effect(() => {
  submitBtn.disabled = form.hasErrors;
});
```

### Pattern 3: Show Error Badge

```javascript
ReactiveUtils.effect(() => {
  badge.style.display = form.hasErrors ? 'block' : 'none';
});
```

### Pattern 4: Prevent Submission

```javascript
if (form.hasErrors) {
  alert('Fix errors first');
  return;
}
submitForm();
```

---

## Common Beginner Questions

### Q: What's the difference between `hasErrors` and `!isValid`?

**Answer:**

They're the same! `hasErrors` is just more readable:

```javascript
// These are equivalent:
if (form.hasErrors) { }
if (!form.isValid) { }

// Use hasErrors when checking for errors
// Use isValid when checking validity
```

### Q: Does `hasErrors` include hidden errors?

**Answer:**

Yes! All errors in `form.errors`:

```javascript
form.setError('field1', 'Error 1');
form.setError('field2', 'Error 2');

console.log(form.hasErrors); // true (both errors)
```

### Q: Is `hasErrors` reactive?

**Answer:**

Yes! Updates automatically:

```javascript
ReactiveUtils.effect(() => {
  console.log('Has errors:', form.hasErrors);
  // Re-runs when errors change
});
```

### Q: Can I check specific field errors?

**Answer:**

Use `hasError(field)` for specific fields:

```javascript
// Check specific field
if (form.hasError('email')) {
  console.log('Email has error');
}

// Check any error
if (form.hasErrors) {
  console.log('Some field has error');
}
```

### Q: Does it count untouched field errors?

**Answer:**

Yes! It checks all errors regardless of touched state:

```javascript
// Field has error but not touched
form.setError('email', 'Invalid');
console.log(form.hasErrors); // true
console.log(form.isTouched('email')); // false

// These are independent!
```

---

## Tips for Success

### 1. Use for Error Summaries

```javascript
// ✅ Show error summary panel
if (form.hasErrors) {
  showErrorPanel(form.errors);
}
```

### 2. More Readable Than !isValid

```javascript
// ✅ Clear intent
if (form.hasErrors) {
  showErrors();
}

// Less clear
if (!form.isValid) {
  showErrors();
}
```

### 3. Combine with Error Count

```javascript
// ✅ Show count when errors exist
if (form.hasErrors) {
  const count = Object.keys(form.errors).length;
  alert(`${count} error(s) found`);
}
```

### 4. Use for Submit Prevention

```javascript
// ✅ Prevent invalid submission
if (form.hasErrors) {
  alert('Fix errors first');
  return;
}
submitForm();
```

### 5. Use in Effects for Reactivity

```javascript
// ✅ Automatic updates
ReactiveUtils.effect(() => {
  errorPanel.style.display = form.hasErrors ? 'block' : 'none';
});
```

---

## Summary

### What `hasErrors` Does:

1. ✅ Computed property (not a method)
2. ✅ Returns `true` if any errors exist
3. ✅ Returns `false` if no errors
4. ✅ Opposite of `isValid`
5. ✅ Reactive - updates automatically
6. ✅ Perfect for error summaries

### When to Use It:

- Showing error summary panels (most common)
- Error badges and indicators
- Preventing form submission
- Disabling submit buttons
- Conditional error displays
- Any error existence check

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ field: '' });

// Check for errors
if (form.hasErrors) {
  console.log('Form has errors!');
}

// Show error summary
ReactiveUtils.effect(() => {
  if (form.hasErrors) {
    showErrorPanel(form.errors);
  } else {
    hideErrorPanel();
  }
});

// Prevent submission
if (form.hasErrors) {
  alert('Fix errors first');
  return;
}
```

---

**Remember:** `hasErrors` tells you if your form has any validation errors. It's the opposite of `isValid` and is perfect for showing error summaries and preventing invalid submissions! 🎉
