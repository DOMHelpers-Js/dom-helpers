# Understanding `errorFields` - A Beginner's Guide

## What is `errorFields`?

`errorFields` is a computed property that returns an array of field names that have validation errors. It gives you a list of all fields with problems.

Think of it as your **error tracker** - it tells you exactly which fields have errors.

---

## Why Does This Exist?

### The Problem: Finding Error Fields

You need to know which fields have errors for error summaries or focusing the first error:

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

// ❌ Manual - iterate and collect
const errorFields = [];
Object.keys(form.errors).forEach(field => {
  if (form.errors[field]) {
    errorFields.push(field);
  }
});
console.log(errorFields);

// ✅ With errorFields - one property
console.log(form.errorFields);
// ['email', 'password'] - clean array!
```

**Why this matters:**
- Get error fields as array instantly
- No manual filtering needed
- Perfect for error summaries
- Focus first error easily
- Clean and readable

---

## How Does It Work?

### The Simple Truth

`errorFields` returns the keys from the errors object:

```javascript
// What errorFields does internally:
get errorFields() {
  return Object.keys(this.errors);
}
```

Think of it like this:

```
form.errorFields
    ↓
Get form.errors object keys
    ↓
Return array of field names with errors
```

---

## Basic Usage

### Get Error Fields

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  password: ''
});

console.log(form.errorFields); // []

form.setError('username', 'Too short');
form.setError('email', 'Invalid email');

console.log(form.errorFields); // ['username', 'email']
```

### Focus First Error

```javascript
const form = ReactiveUtils.form({ name: '', email: '' });

if (form.errorFields.length > 0) {
  const firstError = form.errorFields[0];
  document.getElementById(firstError).focus();
}
```

### Show Error Count

```javascript
const form = ReactiveUtils.form({ field1: '', field2: '' });

ReactiveUtils.effect(() => {
  const count = form.errorFields.length;
  console.log(`${count} error(s) found`);
});
```

---

## Simple Examples Explained

### Example 1: Focus First Error on Submit

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

// Bind inputs
loginForm.bindToInputs('#login-form');

// Form submission
document.getElementById('login-form').onsubmit = (e) => {
  e.preventDefault();

  loginForm.touchAll();

  if (loginForm.hasErrors) {
    // Get first error field
    const firstErrorField = loginForm.errorFields[0];

    // Focus it
    const firstErrorElement = document.getElementById(firstErrorField);
    firstErrorElement.focus();
    firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Show alert
    alert(`Please fix ${loginForm.errorFields.length} error(s), starting with: ${firstErrorField}`);
    return;
  }

  submitForm();
};
```

**What happens:**

1. User clicks submit without filling form
2. All fields touched
3. Validation runs, errors set
4. Gets first error field name
5. Focuses that field
6. Scrolls into view
7. Shows helpful alert
8. User knows exactly where to start

---

### Example 2: Error Summary List

```javascript
const registrationForm = ReactiveUtils.form(
  {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  },
  {
    validators: {
      username: ReactiveUtils.validators.minLength(3, 'Username must be at least 3 characters'),
      email: ReactiveUtils.validators.email('Please enter a valid email'),
      password: ReactiveUtils.validators.minLength(8, 'Password must be at least 8 characters'),
      confirmPassword: ReactiveUtils.validators.match('password', 'Passwords must match'),
      terms: ReactiveUtils.validators.custom(v => v === true, 'You must accept the terms')
    }
  }
);

// Bind inputs
registrationForm.bindToInputs('#registration-form');

// Show error summary
ReactiveUtils.effect(() => {
  const errorSummary = document.getElementById('error-summary');

  if (registrationForm.errorFields.length > 0) {
    const errorList = registrationForm.errorFields
      .map(field => {
        const message = registrationForm.getError(field);
        return `
          <li class="error-item">
            <button onclick="document.getElementById('${field}').focus()" class="error-link">
              ${field}
            </button>
            <span class="error-message">${message}</span>
          </li>
        `;
      })
      .join('');

    errorSummary.innerHTML = `
      <div class="alert alert-danger">
        <h4>Please fix ${registrationForm.errorFields.length} error(s):</h4>
        <ul class="error-list">${errorList}</ul>
      </div>
    `;
    errorSummary.style.display = 'block';
  } else {
    errorSummary.style.display = 'none';
  }
});
```

**What happens:**

1. User fills form with invalid data
2. Validation runs, errors set
3. `errorFields` updates with field names
4. Error summary shows list of all error fields
5. Each field name is clickable to focus
6. Shows error message for each
7. User can click to jump to field
8. Clean error navigation UX

---

### Example 3: Prioritized Error Handling

```javascript
const checkoutForm = ReactiveUtils.form(
  {
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    billingName: '',
    billingZip: ''
  },
  {
    validators: {
      cardNumber: ReactiveUtils.validators.pattern(/^\d{16}$/, 'Card number must be 16 digits'),
      cardExpiry: ReactiveUtils.validators.pattern(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
      cardCVV: ReactiveUtils.validators.pattern(/^\d{3}$/, 'CVV must be 3 digits'),
      billingName: ReactiveUtils.validators.required('Name is required'),
      billingZip: ReactiveUtils.validators.pattern(/^\d{5}$/, 'ZIP must be 5 digits')
    }
  }
);

// Field priority order
const fieldPriority = ['cardNumber', 'cardExpiry', 'cardCVV', 'billingName', 'billingZip'];

// Get errors in priority order
function getErrorsInPriority() {
  const errorFields = checkoutForm.errorFields;
  return fieldPriority.filter(field => errorFields.includes(field));
}

// Show error indicators
ReactiveUtils.effect(() => {
  const errorFields = checkoutForm.errorFields;

  fieldPriority.forEach((field, index) => {
    const indicator = document.getElementById(`${field}-indicator`);

    if (errorFields.includes(field)) {
      indicator.textContent = '❌';
      indicator.className = 'indicator error';
    } else if (checkoutForm.isTouched(field)) {
      indicator.textContent = '✅';
      indicator.className = 'indicator success';
    } else {
      indicator.textContent = index + 1;
      indicator.className = 'indicator pending';
    }
  });
});

// Smart navigation
document.getElementById('fix-errors-btn').onclick = () => {
  const prioritizedErrors = getErrorsInPriority();

  if (prioritizedErrors.length > 0) {
    const firstError = prioritizedErrors[0];
    document.getElementById(firstError).focus();
    alert(`Please fix the ${firstError} field first`);
  } else {
    alert('No errors to fix!');
  }
};

// Show critical errors badge
ReactiveUtils.effect(() => {
  const badge = document.getElementById('error-badge');
  const errorCount = checkoutForm.errorFields.length;

  if (errorCount > 0) {
    badge.textContent = errorCount;
    badge.className = 'badge badge-error';
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
});
```

**What happens:**

1. Errors tracked by priority
2. Each field shows numbered indicator
3. Errors show ❌, valid shows ✅
4. "Fix Errors" button focuses first error in priority
5. Badge shows error count
6. Guides user through errors systematically

---

## Real-World Example: Complete Application Form

```javascript
const applicationForm = ReactiveUtils.form(
  {
    // Personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Professional
    company: '',
    position: '',
    yearsExperience: '',

    // Additional
    linkedIn: '',
    portfolio: '',
    coverLetter: ''
  },
  {
    validators: {
      firstName: ReactiveUtils.validators.required('First name is required'),
      lastName: ReactiveUtils.validators.required('Last name is required'),
      email: ReactiveUtils.validators.email('Please enter a valid email'),
      phone: ReactiveUtils.validators.pattern(/^\d{10}$/, 'Phone must be 10 digits'),
      company: ReactiveUtils.validators.required('Company is required'),
      position: ReactiveUtils.validators.required('Position is required'),
      yearsExperience: ReactiveUtils.validators.custom(
        v => v >= 0 && v <= 50,
        'Years must be between 0 and 50'
      ),
      linkedIn: ReactiveUtils.validators.pattern(/^https:\/\/.*linkedin\.com\/.*/, 'Must be LinkedIn URL'),
      coverLetter: ReactiveUtils.validators.minLength(50, 'Cover letter must be at least 50 characters')
    }
  }
);

// Bind inputs
applicationForm.bindToInputs('#application-form');

// Error count badge
ReactiveUtils.effect(() => {
  const badge = document.getElementById('error-count-badge');
  const errorCount = applicationForm.errorFields.length;

  if (errorCount > 0) {
    badge.innerHTML = `<span class="badge-error">${errorCount}</span>`;
    badge.style.display = 'inline-block';
  } else {
    badge.innerHTML = '<span class="badge-success">✓</span>';
    badge.style.display = 'inline-block';
  }
});

// Error breakdown by section
const sections = {
  Personal: ['firstName', 'lastName', 'email', 'phone'],
  Professional: ['company', 'position', 'yearsExperience'],
  Additional: ['linkedIn', 'portfolio', 'coverLetter']
};

ReactiveUtils.effect(() => {
  const errorFields = applicationForm.errorFields;

  Object.entries(sections).forEach(([sectionName, fields]) => {
    const sectionErrorsElement = document.getElementById(`${sectionName}-errors`);
    const errorsInSection = fields.filter(f => errorFields.includes(f));

    if (errorsInSection.length > 0) {
      const errorList = errorsInSection
        .map(field => `<li>${field}: ${applicationForm.getError(field)}</li>`)
        .join('');

      sectionErrorsElement.innerHTML = `
        <div class="section-errors">
          <strong>${errorsInSection.length} error(s) in ${sectionName}:</strong>
          <ul>${errorList}</ul>
        </div>
      `;
      sectionErrorsElement.style.display = 'block';
    } else {
      sectionErrorsElement.style.display = 'none';
    }
  });
});

// Global error summary
ReactiveUtils.effect(() => {
  const summaryElement = document.getElementById('global-error-summary');
  const errorFields = applicationForm.errorFields;

  if (errorFields.length > 0 && applicationForm.submitCount > 0) {
    const errorsBySection = Object.entries(sections).map(([sectionName, fields]) => {
      const errors = fields.filter(f => errorFields.includes(f));
      return { section: sectionName, count: errors.length, fields: errors };
    }).filter(s => s.count > 0);

    const summaryHTML = errorsBySection
      .map(({ section, count, fields }) => `
        <div class="section-summary">
          <h4>${section} (${count} error${count > 1 ? 's' : ''})</h4>
          <ul>
            ${fields.map(f => `
              <li>
                <button onclick="document.getElementById('${f}').focus()">
                  ${f}
                </button>
              </li>
            `).join('')}
          </ul>
        </div>
      `)
      .join('');

    summaryElement.innerHTML = `
      <div class="alert alert-warning">
        <h3>⚠️ Form has ${errorFields.length} error(s)</h3>
        ${summaryHTML}
        <button onclick="focusFirstError()" class="btn btn-primary">Fix First Error</button>
      </div>
    `;
    summaryElement.style.display = 'block';
  } else {
    summaryElement.style.display = 'none';
  }
});

// Focus first error function
window.focusFirstError = function() {
  if (applicationForm.errorFields.length > 0) {
    const firstError = applicationForm.errorFields[0];
    const element = document.getElementById(firstError);
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// Field status indicators
ReactiveUtils.effect(() => {
  const allFields = Object.keys(applicationForm.values);
  const errorFields = applicationForm.errorFields;

  allFields.forEach(field => {
    const input = document.getElementById(field);
    if (input) {
      input.classList.remove('field-valid', 'field-error', 'field-pristine');

      if (!applicationForm.isTouched(field)) {
        input.classList.add('field-pristine');
      } else if (errorFields.includes(field)) {
        input.classList.add('field-error');
      } else {
        input.classList.add('field-valid');
      }
    }
  });
});

// Form submission
document.getElementById('application-form').onsubmit = (e) => {
  e.preventDefault();

  applicationForm.touchAll();

  if (applicationForm.errorFields.length > 0) {
    alert(`Please fix ${applicationForm.errorFields.length} error(s) before submitting.`);
    focusFirstError();
    return;
  }

  applicationForm.submit(async () => {
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationForm.values)
      });

      alert('Application submitted successfully!');
      window.location.href = '/confirmation';
    } catch (err) {
      alert('Failed to submit application. Please try again.');
    }
  });
};

// Analytics - track error fields
let lastErrorFields = [];

ReactiveUtils.effect(() => {
  const currentErrors = applicationForm.errorFields;

  if (currentErrors.length !== lastErrorFields.length ||
      !currentErrors.every(f => lastErrorFields.includes(f))) {

    trackEvent('form_errors_changed', {
      errorFields: currentErrors,
      errorCount: currentErrors.length,
      timestamp: new Date().toISOString()
    });

    lastErrorFields = [...currentErrors];
  }
});
```

**What happens:**
- Error count badge always visible
- Errors grouped by section
- Global error summary on submit
- One-click focus first error
- Field styling based on error state
- Analytics tracking error changes
- Professional application form UX

---

## Common Patterns

### Pattern 1: Get Error Count

```javascript
const errorCount = form.errorFields.length;
```

### Pattern 2: Focus First Error

```javascript
if (form.errorFields.length > 0) {
  document.getElementById(form.errorFields[0]).focus();
}
```

### Pattern 3: Check Specific Field

```javascript
const hasEmailError = form.errorFields.includes('email');
```

### Pattern 4: Loop Through Errors

```javascript
form.errorFields.forEach(field => {
  console.log(`${field}: ${form.getError(field)}`);
});
```

---

## Common Beginner Questions

### Q: What's the difference between `errorFields` and `errors`?

**Answer:**

- **`errorFields`** = Array of field names with errors
- **`errors`** = Object with field names and error messages

```javascript
form.setError('email', 'Invalid email');
form.setError('password', 'Too short');

console.log(form.errorFields); // ['email', 'password'] - array of names
console.log(form.errors); // { email: 'Invalid email', password: 'Too short' } - object with messages
```

### Q: Is the array sorted?

**Answer:**

No specific order, just the object keys:

```javascript
form.setError('z', 'Error Z');
form.setError('a', 'Error A');

console.log(form.errorFields); // Order may vary
```

### Q: Is it reactive?

**Answer:**

Yes! Updates automatically:

```javascript
ReactiveUtils.effect(() => {
  console.log('Error fields:', form.errorFields);
  // Re-runs when errors change
});
```

### Q: Does it include hidden errors?

**Answer:**

Yes! All errors, regardless of touched state:

```javascript
form.setError('email', 'Invalid');
console.log(form.errorFields); // ['email']
console.log(form.isTouched('email')); // false (not touched, but still in errorFields)
```

### Q: Can I modify the array?

**Answer:**

It's a new array each time, so modifying won't affect the form:

```javascript
const errors = form.errorFields;
errors.push('newField'); // Doesn't affect form

console.log(form.errorFields); // Original, unchanged
```

---

## Tips for Success

### 1. Focus First Error on Submit

```javascript
// ✅ Help user know where to start
if (form.errorFields.length > 0) {
  document.getElementById(form.errorFields[0]).focus();
}
```

### 2. Show Error Count

```javascript
// ✅ Clear feedback
alert(`Please fix ${form.errorFields.length} error(s)`);
```

### 3. Build Error Summary

```javascript
// ✅ Show all errors
form.errorFields.forEach(field => {
  console.log(`${field}: ${form.getError(field)}`);
});
```

### 4. Use for Error Badges

```javascript
// ✅ Visual indicator
badge.textContent = form.errorFields.length;
badge.style.display = form.errorFields.length > 0 ? 'block' : 'none';
```

### 5. Track in Analytics

```javascript
// ✅ Monitor form issues
trackEvent('form_errors', {
  errorFields: form.errorFields,
  count: form.errorFields.length
});
```

---

## Summary

### What `errorFields` Does:

1. ✅ Computed property (not a method)
2. ✅ Returns array of field names with errors
3. ✅ Same as `Object.keys(form.errors)`
4. ✅ Reactive - updates automatically
5. ✅ Perfect for error summaries
6. ✅ Great for focusing first error

### When to Use It:

- Focusing first error field (most common)
- Error count badges
- Error summaries
- Looping through errors
- Analytics tracking
- Any error field iteration

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ field1: '', field2: '' });

// Get error fields
console.log(form.errorFields); // []

form.setError('field1', 'Error 1');
form.setError('field2', 'Error 2');

console.log(form.errorFields); // ['field1', 'field2']

// Focus first error
if (form.errorFields.length > 0) {
  document.getElementById(form.errorFields[0]).focus();
}

// Show error count
ReactiveUtils.effect(() => {
  const count = form.errorFields.length;
  badge.textContent = count > 0 ? count : '';
});
```

---

**Remember:** `errorFields` gives you an array of field names that have errors. Perfect for focusing the first error, showing error counts, and building error summaries! 🎉
