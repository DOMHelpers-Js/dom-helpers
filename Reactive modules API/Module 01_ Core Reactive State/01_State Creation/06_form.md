# Understanding `form()` - A Beginner's Guide

## What is `form()`?

`form()` is a **specialized state function** in the Reactive library designed specifically for managing **form data and validation**. It provides automatic handling of form values, errors, touched fields, submission state, and validation status - everything you need for robust form management.

Think of it as **a complete form manager** - it tracks field values, validation errors, which fields users have interacted with, and whether the form is being submitted, all with reactive updates.

---

## Syntax

```js
// Using the shortcut
form(initialValues)

// Using the full namespace
ReactiveUtils.form(initialValues)
```

**Both styles are valid!** Choose whichever you prefer:
- **Shortcut style** (`form()`) - Clean and concise
- **Namespace style** (`ReactiveUtils.form()`) - Explicit and clear

**Parameters:**
- `initialValues` (Object, optional): Initial field values (defaults to `{}`)

**Returns:**
- A reactive state object with:
  - `values` - Object containing form field values
  - `errors` - Object containing validation errors
  - `touched` - Object tracking which fields have been interacted with
  - `isSubmitting` - Boolean indicating if form is being submitted
  - `isValid` (computed) - `true` if no errors exist
  - `isDirty` (computed) - `true` if any field has been touched
  - `$setValue(field, value)` - Set a field value and mark it as touched
  - `$setError(field, error)` - Set or clear a field error
  - `$reset(newValues)` - Reset form to initial or new values

---

## Why Does This Exist?

### The Problem with Manual Form Management

When building forms, you need to track multiple pieces of state manually:

```javascript
// Manual form management - verbose and error-prone
const formState = state({
  values: {
    username: '',
    email: '',
    password: ''
  },
  errors: {},
  touched: {},
  isSubmitting: false
});

// Track touched fields manually
function handleFieldBlur(field) {
  formState.touched[field] = true;
}

// Set values manually
function handleFieldChange(field, value) {
  formState.values[field] = value;
  formState.touched[field] = true;
}

// Validate manually
function validateField(field, value) {
  if (field === 'email' && !value.includes('@')) {
    formState.errors.email = 'Invalid email';
  } else {
    delete formState.errors.email;
  }
}

// Check validity manually
function isFormValid() {
  return Object.keys(formState.errors).length === 0 &&
         formState.values.username &&
         formState.values.email &&
         formState.values.password;
}

// Check if dirty manually
function isFormDirty() {
  return Object.keys(formState.touched).length > 0;
}

// Reset manually
function resetForm() {
  formState.values = { username: '', email: '', password: '' };
  formState.errors = {};
  formState.touched = {};
  formState.isSubmitting = false;
}

// Too much boilerplate for a common pattern!
```

**What's the Real Issue?**

**Problems:**
- Must manually create `values`, `errors`, `touched`, and `isSubmitting` properties
- Must manually track which fields are touched
- Must manually compute validity and dirty state
- Must manually manage error messages
- Must manually reset all properties
- Lots of repetitive boilerplate code
- Easy to forget steps or make mistakes

**Why This Becomes a Problem:**

For every form:
❌ Same boilerplate repeated everywhere
❌ Easy to forget to track touched state
❌ Manual validity checking is verbose
❌ Reset logic is repetitive
❌ No standard form pattern

In other words, **form management requires too much manual work**.
There should be a standard, automated way to handle forms.

---

### The Solution with `form()`

When you use `form()`, all the boilerplate is handled automatically:

```javascript
// Automatic form management - clean and simple
const loginForm = form({
  username: '',
  email: '',
  password: ''
});

// Set values - automatically marks as touched
loginForm.$setValue('email', 'user@example.com');

// Set errors easily
if (!loginForm.values.email.includes('@')) {
  loginForm.$setError('email', 'Invalid email');
} else {
  loginForm.$setError('email', null); // Clear error
}

// Check state automatically
console.log(loginForm.isValid);  // Computed automatically
console.log(loginForm.isDirty);  // Computed automatically

// Reset easily
loginForm.$reset();

// Clean, standardized, and automatic!
```

**What Just Happened?**

With `form()`:
- `values`, `errors`, `touched`, and `isSubmitting` created automatically
- `$setValue()` method sets value and marks field as touched
- `$setError()` method manages errors easily
- `isValid` computed property checks for errors automatically
- `isDirty` computed property checks if form was modified
- `$reset()` method clears everything

**Benefits:**
- No boilerplate code
- Automatic validity checking
- Built-in dirty state tracking
- Standard form pattern
- Less code, fewer bugs
- Reactive properties for UI updates

---

## How Does It Work?

### Under the Hood

`form()` creates a reactive state with form-specific properties and methods:

```
form(initialValues)
        ↓
Creates reactive state with:
  - values: { ...initialValues }
  - errors: {}
  - touched: {}
  - isSubmitting: false
  - isValid (computed)
  - isDirty (computed)
  - $setValue(field, value) method
  - $setError(field, error) method
  - $reset(newValues) method
        ↓
All changes trigger reactive updates
```

**What happens:**

1. Creates reactive state with `values`, `errors`, `touched`, `isSubmitting`
2. Adds computed property `isValid` that checks if errors exist
3. Adds computed property `isDirty` that checks if any fields touched
4. Provides `$setValue()` to update values and mark as touched
5. Provides `$setError()` to set or clear errors
6. Provides `$reset()` to clear everything
7. All changes are reactive and trigger UI updates

---

## Basic Usage

### Creating a Form

The simplest way to use `form()`:

```js
// Using the shortcut style
const loginForm = form({
  username: '',
  password: ''
});

// Or using the namespace style
const loginForm = ReactiveUtils.form({
  username: '',
  password: ''
});

console.log(loginForm.values);      // { username: '', password: '' }
console.log(loginForm.errors);      // {}
console.log(loginForm.touched);     // {}
console.log(loginForm.isSubmitting); // false
console.log(loginForm.isValid);     // true (no errors)
console.log(loginForm.isDirty);     // false (not touched)
```

### Setting Field Values

Use `$setValue()` to update fields:

```js
const form = form({
  email: '',
  password: ''
});

// Set a field value (automatically marks as touched)
form.$setValue('email', 'user@example.com');

console.log(form.values.email);   // 'user@example.com'
console.log(form.touched.email);  // true
console.log(form.isDirty);        // true
```

### Managing Errors

Use `$setError()` to set or clear errors:

```js
const form = form({
  email: ''
});

// Set an error
form.$setError('email', 'Invalid email address');

console.log(form.errors.email); // 'Invalid email address'
console.log(form.isValid);      // false

// Clear an error
form.$setError('email', null);

console.log(form.errors.email); // undefined
console.log(form.isValid);      // true
```

### Resetting the Form

Use `$reset()` to clear the form:

```js
const form = form({
  username: '',
  password: ''
});

// Make changes
form.$setValue('username', 'john');
form.$setValue('password', 'secret123');
form.$setError('username', 'Username taken');

console.log(form.isDirty); // true
console.log(form.isValid); // false

// Reset to initial values
form.$reset();

console.log(form.values);      // { username: '', password: '' }
console.log(form.errors);      // {}
console.log(form.touched);     // {}
console.log(form.isDirty);     // false
console.log(form.isValid);     // true

// Reset to new values
form.$reset({ username: 'admin', password: 'admin123' });
console.log(form.values); // { username: 'admin', password: 'admin123' }
```

### Reactive UI Updates

Combine with effects for automatic UI updates:

```js
const loginForm = form({
  email: '',
  password: ''
});

// Update submit button based on validity
effect(() => {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = !loginForm.isValid || loginForm.isSubmitting;
  submitBtn.textContent = loginForm.isSubmitting ? 'Submitting...' : 'Submit';
});

// Display error messages
effect(() => {
  const emailError = document.getElementById('emailError');
  emailError.textContent = loginForm.errors.email || '';
  emailError.style.display = loginForm.errors.email ? 'block' : 'none';
});

// Show dirty indicator
effect(() => {
  const indicator = document.getElementById('unsavedChanges');
  indicator.style.display = loginForm.isDirty ? 'block' : 'none';
});
```

---

## Common Use Cases

### Use Case 1: Login Form

Simple login with validation:

```js
const loginForm = form({
  email: '',
  password: ''
});

// Validation
function validateEmail(email) {
  if (!email) {
    loginForm.$setError('email', 'Email is required');
  } else if (!email.includes('@')) {
    loginForm.$setError('email', 'Invalid email address');
  } else {
    loginForm.$setError('email', null);
  }
}

function validatePassword(password) {
  if (!password) {
    loginForm.$setError('password', 'Password is required');
  } else if (password.length < 8) {
    loginForm.$setError('password', 'Password must be at least 8 characters');
  } else {
    loginForm.$setError('password', null);
  }
}

// Bind to inputs
document.getElementById('email').oninput = (e) => {
  loginForm.$setValue('email', e.target.value);
  validateEmail(e.target.value);
};

document.getElementById('password').oninput = (e) => {
  loginForm.$setValue('password', e.target.value);
  validatePassword(e.target.value);
};

// Submit handler
async function handleSubmit(e) {
  e.preventDefault();

  if (!loginForm.isValid) {
    alert('Please fix errors before submitting');
    return;
  }

  loginForm.isSubmitting = true;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(loginForm.values)
    });

    if (response.ok) {
      alert('Login successful!');
      loginForm.$reset();
    } else {
      loginForm.$setError('password', 'Invalid credentials');
    }
  } catch (error) {
    loginForm.$setError('password', 'Login failed');
  } finally {
    loginForm.isSubmitting = false;
  }
}

// UI updates
effect(() => {
  document.getElementById('submitBtn').disabled = !loginForm.isValid;
});

effect(() => {
  const emailError = document.getElementById('emailError');
  emailError.textContent = loginForm.errors.email || '';
});

effect(() => {
  const passwordError = document.getElementById('passwordError');
  passwordError.textContent = loginForm.errors.password || '';
});
```

### Use Case 2: Registration Form

Multi-field registration with complex validation:

```js
const registrationForm = form({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
});

// Add computed for password match
registrationForm.$computed('passwordsMatch', function() {
  return this.values.password === this.values.confirmPassword;
});

// Validation functions
function validateUsername(username) {
  if (!username) {
    registrationForm.$setError('username', 'Username is required');
  } else if (username.length < 3) {
    registrationForm.$setError('username', 'Username must be at least 3 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    registrationForm.$setError('username', 'Username can only contain letters, numbers, and underscores');
  } else {
    registrationForm.$setError('username', null);
  }
}

function validateEmail(email) {
  if (!email) {
    registrationForm.$setError('email', 'Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    registrationForm.$setError('email', 'Invalid email address');
  } else {
    registrationForm.$setError('email', null);
  }
}

function validatePassword(password) {
  if (!password) {
    registrationForm.$setError('password', 'Password is required');
  } else if (password.length < 8) {
    registrationForm.$setError('password', 'Password must be at least 8 characters');
  } else if (!/[A-Z]/.test(password)) {
    registrationForm.$setError('password', 'Password must contain at least one uppercase letter');
  } else if (!/[0-9]/.test(password)) {
    registrationForm.$setError('password', 'Password must contain at least one number');
  } else {
    registrationForm.$setError('password', null);
  }
}

function validateConfirmPassword(confirmPassword) {
  if (!confirmPassword) {
    registrationForm.$setError('confirmPassword', 'Please confirm your password');
  } else if (confirmPassword !== registrationForm.values.password) {
    registrationForm.$setError('confirmPassword', 'Passwords do not match');
  } else {
    registrationForm.$setError('confirmPassword', null);
  }
}

function validateTerms(agreed) {
  if (!agreed) {
    registrationForm.$setError('agreeToTerms', 'You must agree to the terms');
  } else {
    registrationForm.$setError('agreeToTerms', null);
  }
}

// Bind to inputs
document.getElementById('username').oninput = (e) => {
  registrationForm.$setValue('username', e.target.value);
  if (registrationForm.touched.username) {
    validateUsername(e.target.value);
  }
};

document.getElementById('username').onblur = (e) => {
  validateUsername(e.target.value);
};

// Similar for other fields...

// Submit handler
async function handleRegistration(e) {
  e.preventDefault();

  // Validate all fields
  validateUsername(registrationForm.values.username);
  validateEmail(registrationForm.values.email);
  validatePassword(registrationForm.values.password);
  validateConfirmPassword(registrationForm.values.confirmPassword);
  validateTerms(registrationForm.values.agreeToTerms);

  if (!registrationForm.isValid) {
    alert('Please fix all errors before submitting');
    return;
  }

  registrationForm.isSubmitting = true;

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: registrationForm.values.username,
        email: registrationForm.values.email,
        password: registrationForm.values.password
      })
    });

    if (response.ok) {
      alert('Registration successful!');
      registrationForm.$reset();
    } else {
      const error = await response.json();
      registrationForm.$setError('username', error.message);
    }
  } catch (error) {
    alert('Registration failed');
  } finally {
    registrationForm.isSubmitting = false;
  }
}
```

### Use Case 3: Contact Form

Contact form with dynamic fields:

```js
const contactForm = form({
  name: '',
  email: '',
  subject: '',
  message: '',
  attachments: []
});

// Add computed for character count
contactForm.$computed('messageLength', function() {
  return this.values.message.length;
});

contactForm.$computed('messageRemaining', function() {
  return 500 - this.messageLength;
});

// Validation
function validateMessage(message) {
  if (!message) {
    contactForm.$setError('message', 'Message is required');
  } else if (message.length < 10) {
    contactForm.$setError('message', 'Message must be at least 10 characters');
  } else if (message.length > 500) {
    contactForm.$setError('message', 'Message cannot exceed 500 characters');
  } else {
    contactForm.$setError('message', null);
  }
}

// UI updates
effect(() => {
  const counter = document.getElementById('charCounter');
  counter.textContent = `${contactForm.messageRemaining} characters remaining`;
  counter.className = contactForm.messageRemaining < 50 ? 'warning' : '';
});

effect(() => {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = !contactForm.isValid || contactForm.isSubmitting;
});

// Handle file attachments
function handleFileUpload(files) {
  contactForm.$setValue('attachments', Array.from(files));
}

// Submit handler
async function handleSubmit(e) {
  e.preventDefault();

  contactForm.isSubmitting = true;

  const formData = new FormData();
  formData.append('name', contactForm.values.name);
  formData.append('email', contactForm.values.email);
  formData.append('subject', contactForm.values.subject);
  formData.append('message', contactForm.values.message);

  contactForm.values.attachments.forEach((file, index) => {
    formData.append(`attachment${index}`, file);
  });

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('Message sent successfully!');
      contactForm.$reset();
    }
  } catch (error) {
    contactForm.$setError('message', 'Failed to send message');
  } finally {
    contactForm.isSubmitting = false;
  }
}
```

### Use Case 4: Profile Settings Form

Edit profile with unsaved changes warning:

```js
const profileForm = form({
  displayName: '',
  bio: '',
  website: '',
  location: '',
  emailNotifications: true,
  publicProfile: true
});

// Load current profile
async function loadProfile() {
  const response = await fetch('/api/profile');
  const profile = await response.json();
  profileForm.$reset(profile);
}

// Track unsaved changes
effect(() => {
  window.onbeforeunload = profileForm.isDirty
    ? (e) => {
        e.preventDefault();
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    : null;
});

// Show save indicator
effect(() => {
  const saveBtn = document.getElementById('saveBtn');
  saveBtn.disabled = !profileForm.isDirty || !profileForm.isValid;
  saveBtn.textContent = profileForm.isDirty ? 'Save Changes' : 'No Changes';
});

// Auto-save draft
let autoSaveTimeout;
effect(() => {
  if (profileForm.isDirty) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      localStorage.setItem('profileDraft', JSON.stringify(profileForm.values));
      console.log('Draft saved');
    }, 2000);
  }
});

// Save handler
async function saveProfile() {
  profileForm.isSubmitting = true;

  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileForm.values)
    });

    if (response.ok) {
      alert('Profile updated successfully!');
      profileForm.$reset(profileForm.values); // Reset with current values
      localStorage.removeItem('profileDraft');
    }
  } catch (error) {
    alert('Failed to update profile');
  } finally {
    profileForm.isSubmitting = false;
  }
}

// Initialize
loadProfile();
```

### Use Case 5: Multi-Step Form

Wizard-style form with steps:

```js
const wizardForm = form({
  // Step 1: Personal Info
  firstName: '',
  lastName: '',
  email: '',

  // Step 2: Address
  street: '',
  city: '',
  state: '',
  zipCode: '',

  // Step 3: Payment
  cardNumber: '',
  expiryDate: '',
  cvv: ''
});

// Track current step
const wizard = state({
  currentStep: 1,
  totalSteps: 3
});

// Add computed for step validity
wizardForm.$computed('step1Valid', function() {
  return !this.errors.firstName &&
         !this.errors.lastName &&
         !this.errors.email &&
         this.values.firstName &&
         this.values.lastName &&
         this.values.email;
});

wizardForm.$computed('step2Valid', function() {
  return !this.errors.street &&
         !this.errors.city &&
         !this.errors.state &&
         !this.errors.zipCode &&
         this.values.street &&
         this.values.city &&
         this.values.state &&
         this.values.zipCode;
});

wizardForm.$computed('step3Valid', function() {
  return !this.errors.cardNumber &&
         !this.errors.expiryDate &&
         !this.errors.cvv &&
         this.values.cardNumber &&
         this.values.expiryDate &&
         this.values.cvv;
});

// Navigation functions
function nextStep() {
  const currentStepValid = {
    1: wizardForm.step1Valid,
    2: wizardForm.step2Valid,
    3: wizardForm.step3Valid
  }[wizard.currentStep];

  if (!currentStepValid) {
    alert('Please complete all required fields');
    return;
  }

  if (wizard.currentStep < wizard.totalSteps) {
    wizard.currentStep++;
  }
}

function previousStep() {
  if (wizard.currentStep > 1) {
    wizard.currentStep--;
  }
}

// Display current step
effect(() => {
  document.querySelectorAll('.wizard-step').forEach((step, index) => {
    step.style.display = index + 1 === wizard.currentStep ? 'block' : 'none';
  });
});

// Update progress bar
effect(() => {
  const progress = (wizard.currentStep / wizard.totalSteps) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;
});

// Update buttons
effect(() => {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  prevBtn.disabled = wizard.currentStep === 1;
  nextBtn.style.display = wizard.currentStep < wizard.totalSteps ? 'inline-block' : 'none';
  submitBtn.style.display = wizard.currentStep === wizard.totalSteps ? 'inline-block' : 'none';
});

// Submit handler
async function handleSubmit() {
  if (!wizardForm.isValid) {
    alert('Please complete all steps');
    return;
  }

  wizardForm.isSubmitting = true;

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(wizardForm.values)
    });

    if (response.ok) {
      alert('Form submitted successfully!');
      wizardForm.$reset();
      wizard.currentStep = 1;
    }
  } catch (error) {
    alert('Submission failed');
  } finally {
    wizardForm.isSubmitting = false;
  }
}
```

---

## Advanced Patterns

### Pattern 1: Field-Level Validation

Validate fields as they change:

```js
const form = form({
  email: '',
  password: ''
});

// Watch for changes and validate
form.$watch('values', (newValues, oldValues) => {
  // Only validate fields that changed and are touched
  Object.keys(newValues).forEach(field => {
    if (newValues[field] !== oldValues[field] && form.touched[field]) {
      validateField(field, newValues[field]);
    }
  });
});

function validateField(field, value) {
  switch (field) {
    case 'email':
      form.$setError('email', value.includes('@') ? null : 'Invalid email');
      break;
    case 'password':
      form.$setError('password', value.length >= 8 ? null : 'Password too short');
      break;
  }
}
```

### Pattern 2: Async Validation

Validate against server:

```js
const form = form({
  username: ''
});

let validationTimeout;

form.$watch('values', async (newValues) => {
  clearTimeout(validationTimeout);

  if (newValues.username.length < 3) {
    form.$setError('username', 'Username must be at least 3 characters');
    return;
  }

  validationTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`/api/check-username?username=${newValues.username}`);
      const data = await response.json();

      if (data.exists) {
        form.$setError('username', 'Username is already taken');
      } else {
        form.$setError('username', null);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  }, 500);
});
```

### Pattern 3: Form with Schema Validation

Use a validation schema:

```js
const validationSchema = {
  email: [
    { test: (v) => !!v, message: 'Email is required' },
    { test: (v) => v.includes('@'), message: 'Invalid email' }
  ],
  password: [
    { test: (v) => !!v, message: 'Password is required' },
    { test: (v) => v.length >= 8, message: 'Password must be at least 8 characters' },
    { test: (v) => /[A-Z]/.test(v), message: 'Password must contain uppercase letter' }
  ]
};

const form = form({
  email: '',
  password: ''
});

function validateWithSchema(field, value) {
  const rules = validationSchema[field];
  if (!rules) return;

  for (const rule of rules) {
    if (!rule.test(value)) {
      form.$setError(field, rule.message);
      return;
    }
  }

  form.$setError(field, null);
}

// Validate all fields
function validateAll() {
  Object.keys(form.values).forEach(field => {
    validateWithSchema(field, form.values[field]);
  });
}
```

### Pattern 4: Form State Persistence

Save form state to localStorage:

```js
const form = form({
  title: '',
  content: ''
});

// Load saved state
const savedState = localStorage.getItem('formDraft');
if (savedState) {
  const parsed = JSON.parse(savedState);
  form.$reset(parsed.values);
  form.errors = parsed.errors;
  form.touched = parsed.touched;
}

// Auto-save on changes
let saveTimeout;
form.$watch('values', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem('formDraft', JSON.stringify({
      values: form.values,
      errors: form.errors,
      touched: form.touched
    }));
  }, 1000);
});

// Clear on successful submit
async function handleSubmit() {
  // ... submit logic ...
  if (success) {
    localStorage.removeItem('formDraft');
  }
}
```

---

## Performance Tips

### Tip 1: Validate on Blur, Not on Input

Reduce validation calls:

```js
// Good - validate on blur
document.getElementById('email').onblur = (e) => {
  validateEmail(e.target.value);
};

// Less efficient - validates on every keystroke
document.getElementById('email').oninput = (e) => {
  validateEmail(e.target.value);
};
```

### Tip 2: Debounce Async Validation

Avoid excessive API calls:

```js
let debounceTimeout;

function debouncedValidation(field, value) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    validateAsync(field, value);
  }, 500);
}
```

### Tip 3: Use Computed for Complex Checks

Cache expensive calculations:

```js
form.$computed('allFieldsValid', function() {
  return Object.keys(this.values).every(field => {
    return !this.errors[field] && this.values[field];
  });
});

// Use in effects
effect(() => {
  submitBtn.disabled = !form.allFieldsValid;
});
```

---

## Common Pitfalls

### Pitfall 1: Not Marking Fields as Touched

**Problem:** Showing errors before user interacts:

```js
// BAD - shows errors immediately
form.$setError('email', 'Invalid email');

// GOOD - only show after user touches field
if (form.touched.email) {
  form.$setError('email', 'Invalid email');
}
```

### Pitfall 2: Forgetting to Clear Errors

**Problem:** Errors persist even when fixed:

```js
// WRONG - error stays even if now valid
if (!email.includes('@')) {
  form.$setError('email', 'Invalid email');
}

// RIGHT - clear error when valid
if (!email.includes('@')) {
  form.$setError('email', 'Invalid email');
} else {
  form.$setError('email', null); // Clear the error
}
```

### Pitfall 3: Direct Value Assignment

**Problem:** Bypassing $setValue doesn't mark as touched:

```js
// BAD - doesn't mark as touched
form.values.email = 'test@example.com';

// GOOD - marks as touched
form.$setValue('email', 'test@example.com');
```

### Pitfall 4: Not Checking isValid Before Submit

**Problem:** Submitting invalid forms:

```js
// BAD - might submit with errors
async function handleSubmit() {
  const response = await fetch('/api/submit', {
    body: JSON.stringify(form.values)
  });
}

// GOOD - check validity first
async function handleSubmit() {
  if (!form.isValid) {
    alert('Please fix errors');
    return;
  }

  const response = await fetch('/api/submit', {
    body: JSON.stringify(form.values)
  });
}
```

---

## Real-World Example

Here's a complete example using `form()`:

```js
// Create a comprehensive user profile form
const profileForm = form({
  // Personal Info
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',

  // Address
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',

  // Preferences
  newsletter: false,
  notifications: true,
  theme: 'light'
});

// Add computed properties
profileForm.$computed('fullName', function() {
  return `${this.values.firstName} ${this.values.lastName}`.trim();
});

profileForm.$computed('age', function() {
  if (!this.values.dateOfBirth) return null;
  const dob = new Date(this.values.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
});

// Validation functions
function validateEmail(email) {
  if (!email) {
    profileForm.$setError('email', 'Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    profileForm.$setError('email', 'Invalid email format');
  } else {
    profileForm.$setError('email', null);
  }
}

function validatePhone(phone) {
  if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    profileForm.$setError('phone', 'Phone must be 10 digits');
  } else {
    profileForm.$setError('phone', null);
  }
}

function validateZipCode(zipCode) {
  if (zipCode && !/^\d{5}(-\d{4})?$/.test(zipCode)) {
    profileForm.$setError('zipCode', 'Invalid ZIP code');
  } else {
    profileForm.$setError('zipCode', null);
  }
}

function validateAge(dob) {
  if (!dob) {
    profileForm.$setError('dateOfBirth', 'Date of birth is required');
  } else {
    const age = profileForm.age;
    if (age < 18) {
      profileForm.$setError('dateOfBirth', 'Must be at least 18 years old');
    } else if (age > 120) {
      profileForm.$setError('dateOfBirth', 'Invalid date of birth');
    } else {
      profileForm.$setError('dateOfBirth', null);
    }
  }
}

// Bind form fields
document.querySelectorAll('input, select, textarea').forEach(input => {
  input.addEventListener('input', (e) => {
    profileForm.$setValue(e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value);
  });

  input.addEventListener('blur', (e) => {
    const field = e.target.name;
    const value = profileForm.values[field];

    // Validate on blur
    switch (field) {
      case 'email':
        validateEmail(value);
        break;
      case 'phone':
        validatePhone(value);
        break;
      case 'zipCode':
        validateZipCode(value);
        break;
      case 'dateOfBirth':
        validateAge(value);
        break;
    }
  });
});

// UI Updates
effect(() => {
  // Show full name
  document.getElementById('fullNameDisplay').textContent = profileForm.fullName || 'Not set';
});

effect(() => {
  // Show age
  document.getElementById('ageDisplay').textContent = profileForm.age ? `${profileForm.age} years old` : 'Not set';
});

effect(() => {
  // Update submit button
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = !profileForm.isValid || profileForm.isSubmitting;
  submitBtn.textContent = profileForm.isSubmitting ? 'Saving...' : 'Save Profile';
});

effect(() => {
  // Show unsaved changes indicator
  const indicator = document.getElementById('unsavedIndicator');
  indicator.style.display = profileForm.isDirty ? 'block' : 'none';
});

effect(() => {
  // Display error messages
  Object.keys(profileForm.errors).forEach(field => {
    const errorElement = document.getElementById(`${field}Error`);
    if (errorElement) {
      errorElement.textContent = profileForm.errors[field] || '';
      errorElement.style.display = profileForm.errors[field] ? 'block' : 'none';
    }
  });
});

// Load existing profile
async function loadProfile() {
  try {
    const response = await fetch('/api/profile');
    const profile = await response.json();
    profileForm.$reset(profile);
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
}

// Save profile
async function saveProfile(e) {
  e.preventDefault();

  // Validate all fields
  validateEmail(profileForm.values.email);
  validatePhone(profileForm.values.phone);
  validateZipCode(profileForm.values.zipCode);
  validateAge(profileForm.values.dateOfBirth);

  if (!profileForm.isValid) {
    alert('Please fix all errors before saving');
    return;
  }

  profileForm.isSubmitting = true;

  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileForm.values)
    });

    if (response.ok) {
      alert('Profile saved successfully!');
      profileForm.$reset(profileForm.values); // Reset dirty state
    } else {
      alert('Failed to save profile');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    profileForm.isSubmitting = false;
  }
}

// Cancel changes
function cancelChanges() {
  if (profileForm.isDirty) {
    if (confirm('Discard unsaved changes?')) {
      loadProfile();
    }
  }
}

// Initialize
document.getElementById('profileForm').addEventListener('submit', saveProfile);
document.getElementById('cancelBtn').addEventListener('click', cancelChanges);
loadProfile();
```

---

## Summary

**`form()` provides complete form state management with validation.**

Key takeaways:
- ✅ **Specialized for forms** - designed for form data management
- ✅ Both **shortcut** (`form()`) and **namespace** (`ReactiveUtils.form()`) styles are valid
- ✅ Provides `values`, `errors`, `touched`, and `isSubmitting` automatically
- ✅ **Computed properties** `isValid` and `isDirty` for easy checks
- ✅ **$setValue(field, value)** - Set value and mark as touched
- ✅ **$setError(field, error)** - Manage error messages
- ✅ **$reset(newValues)** - Reset form state
- ✅ All standard **state methods** available ($computed, $watch, $batch, etc.)
- ⚠️ Use `$setValue()` instead of direct assignment to track touched state
- ⚠️ Always clear errors when field becomes valid
- ⚠️ Check `isValid` before submitting

**Remember:** `form()` eliminates form management boilerplate and provides a standard pattern for handling values, errors, validation, and submission. Perfect for any form in your application! 🎉

➡️ Next, explore [`asyncState()`](async.md) for async form submissions or [`component()`](component.md) for form components!
