# Understanding `validators.required()` - A Beginner's Guide

## What is `validators.required()`?

`validators.required()` is a built-in validator that checks if a field has a value. It ensures fields aren't empty, null, or undefined.

Think of it as **mandatory field checker** - this field must have a value.

**Alias:** `v.required()` - Use either `validators.required()` or `v.required()`, they're identical.

---

## Why Does This Exist?

### The Problem: Checking for Required Fields

You need to ensure users fill out important fields:

```javascript
// ❌ Without validator - manual checking
const form = ReactiveUtils.form(
  { username: '' }
);

if (!form.values.username || form.values.username.trim() === '') {
  form.setError('username', 'Username is required');
}

// ✅ With required() - automatic
const form = ReactiveUtils.form(
  { username: '' },
  {
    validators: {
      username: v.required()
    }
  }
);
```

**Why this matters:**
- Automatic validation
- Consistent error messages
- Built-in whitespace handling
- Clean syntax

---

## How Does It Work?

### The Required Validation Process

```javascript
validators.required()
    ↓
Checks if value exists
Checks if value isn't empty string
Checks if value isn't just whitespace
    ↓
Returns error message or null
```

---

## Basic Usage

### Simple Required Field

```javascript
const form = ReactiveUtils.form(
  {
    username: '',
    email: ''
  },
  {
    validators: {
      username: v.required(),
      email: v.required()
    }
  }
);

// Check validation
console.log(form.isValid); // false (empty fields)

form.setValue('username', 'john');
console.log(form.errors.username); // null (valid)
```

### Custom Error Message

```javascript
const form = ReactiveUtils.form(
  { username: '' },
  {
    validators: {
      username: v.required('Please enter your username')
    }
  }
);

console.log(form.errors.username); // 'Please enter your username'
```

### Using Alias

```javascript
// Both are identical
const form1 = ReactiveUtils.form(
  { name: '' },
  {
    validators: {
      name: validators.required()
    }
  }
);

const form2 = ReactiveUtils.form(
  { name: '' },
  {
    validators: {
      name: v.required() // Shorter alias
    }
  }
);
```

---

## Simple Examples Explained

### Example 1: Login Form

```javascript
const loginForm = ReactiveUtils.form(
  {
    username: '',
    password: ''
  },
  {
    validators: {
      username: v.required('Username is required'),
      password: v.required('Password is required')
    }
  }
);

// Display form
ReactiveUtils.effect(() => {
  const container = document.getElementById('login-form');

  container.innerHTML = `
    <form onsubmit="handleLogin(event)">
      <div class="field">
        <label>Username</label>
        <input type="text"
               value="${loginForm.values.username}"
               oninput="loginForm.setValue('username', this.value)"
               onblur="loginForm.setTouched('username')">
        ${loginForm.touched.username && loginForm.errors.username ? `
          <span class="error">${loginForm.errors.username}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Password</label>
        <input type="password"
               value="${loginForm.values.password}"
               oninput="loginForm.setValue('password', this.value)"
               onblur="loginForm.setTouched('password')">
        ${loginForm.touched.password && loginForm.errors.password ? `
          <span class="error">${loginForm.errors.password}</span>
        ` : ''}
      </div>

      <button type="submit" ${!loginForm.isValid ? 'disabled' : ''}>
        Login
      </button>
    </form>
  `;
});

function handleLogin(event) {
  event.preventDefault();

  if (loginForm.isValid) {
    console.log('Logging in:', loginForm.values);
  }
}
```

---

### Example 2: Contact Form

```javascript
const contactForm = ReactiveUtils.form(
  {
    name: '',
    email: '',
    subject: '',
    message: ''
  },
  {
    validators: {
      name: v.required(),
      email: v.required(),
      subject: v.required(),
      message: v.required('Please enter your message')
    }
  }
);

// Bind to inputs
contactForm.bindToInputs('#contact-form input, #contact-form textarea');

// Display error summary
ReactiveUtils.effect(() => {
  const summary = document.getElementById('error-summary');

  if (contactForm.hasErrors && contactForm.submitCount > 0) {
    const errors = Object.entries(contactForm.errors)
      .filter(([_, error]) => error !== null)
      .map(([field, error]) => `${field}: ${error}`);

    summary.innerHTML = `
      <div class="error-summary">
        <p>Please fix the following errors:</p>
        <ul>
          ${errors.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>
    `;
  } else {
    summary.innerHTML = '';
  }
});

// Submit handler
async function submitContact(event) {
  event.preventDefault();

  await contactForm.submit(async (values) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    
    if (response.ok) {
      alert('Message sent!');
      contactForm.reset();
    }
  });
}
```

---

### Example 3: Multi-Step Form

```javascript
const registrationForm = ReactiveUtils.form(
  {
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    // Step 2: Contact Info
    email: '',
    phone: '',
    // Step 3: Account
    username: '',
    password: ''
  },
  {
    validators: {
      firstName: v.required('First name is required'),
      lastName: v.required('Last name is required'),
      email: v.required('Email is required'),
      phone: v.required('Phone is required'),
      username: v.required('Username is required'),
      password: v.required('Password is required')
    }
  }
);

const stepState = ReactiveUtils.state({
  currentStep: 1,
  totalSteps: 3
});

// Check if current step is valid
stepState.$computed('currentStepValid', function() {
  switch (this.currentStep) {
    case 1:
      return !registrationForm.errors.firstName && 
             !registrationForm.errors.lastName &&
             registrationForm.values.firstName &&
             registrationForm.values.lastName;
    case 2:
      return !registrationForm.errors.email && 
             !registrationForm.errors.phone &&
             registrationForm.values.email &&
             registrationForm.values.phone;
    case 3:
      return !registrationForm.errors.username && 
             !registrationForm.errors.password &&
             registrationForm.values.username &&
             registrationForm.values.password;
    default:
      return false;
  }
});

function nextStep() {
  // Touch current step fields
  if (stepState.currentStep === 1) {
    registrationForm.setTouched('firstName');
    registrationForm.setTouched('lastName');
  } else if (stepState.currentStep === 2) {
    registrationForm.setTouched('email');
    registrationForm.setTouched('phone');
  }

  if (stepState.currentStepValid) {
    stepState.currentStep++;
  }
}

function prevStep() {
  if (stepState.currentStep > 1) {
    stepState.currentStep--;
  }
}

// Display current step
ReactiveUtils.effect(() => {
  const container = document.getElementById('registration-form');
  const step = stepState.currentStep;

  let stepContent = '';

  if (step === 1) {
    stepContent = `
      <h3>Step 1: Personal Information</h3>
      <input type="text" placeholder="First Name"
             value="${registrationForm.values.firstName}"
             oninput="registrationForm.setValue('firstName', this.value)">
      ${registrationForm.errors.firstName ? `
        <span class="error">${registrationForm.errors.firstName}</span>
      ` : ''}

      <input type="text" placeholder="Last Name"
             value="${registrationForm.values.lastName}"
             oninput="registrationForm.setValue('lastName', this.value)">
      ${registrationForm.errors.lastName ? `
        <span class="error">${registrationForm.errors.lastName}</span>
      ` : ''}
    `;
  } else if (step === 2) {
    stepContent = `
      <h3>Step 2: Contact Information</h3>
      <input type="email" placeholder="Email"
             value="${registrationForm.values.email}"
             oninput="registrationForm.setValue('email', this.value)">
      ${registrationForm.errors.email ? `
        <span class="error">${registrationForm.errors.email}</span>
      ` : ''}

      <input type="tel" placeholder="Phone"
             value="${registrationForm.values.phone}"
             oninput="registrationForm.setValue('phone', this.value)">
      ${registrationForm.errors.phone ? `
        <span class="error">${registrationForm.errors.phone}</span>
      ` : ''}
    `;
  } else if (step === 3) {
    stepContent = `
      <h3>Step 3: Account</h3>
      <input type="text" placeholder="Username"
             value="${registrationForm.values.username}"
             oninput="registrationForm.setValue('username', this.value)">
      ${registrationForm.errors.username ? `
        <span class="error">${registrationForm.errors.username}</span>
      ` : ''}

      <input type="password" placeholder="Password"
             value="${registrationForm.values.password}"
             oninput="registrationForm.setValue('password', this.value)">
      ${registrationForm.errors.password ? `
        <span class="error">${registrationForm.errors.password}</span>
      ` : ''}
    `;
  }

  container.innerHTML = `
    ${stepContent}
    <div class="step-navigation">
      <button onclick="prevStep()" ${step === 1 ? 'disabled' : ''}>Previous</button>
      <span>Step ${step} of ${stepState.totalSteps}</span>
      <button onclick="${step === stepState.totalSteps ? 'submitForm()' : 'nextStep()'}" 
              ${!stepState.currentStepValid ? 'disabled' : ''}>
        ${step === stepState.totalSteps ? 'Submit' : 'Next'}
      </button>
    </div>
  `;
});
```

---

## Real-World Example: Job Application Form

```javascript
const jobApplicationForm = ReactiveUtils.form(
  {
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    // Position
    position: '',
    department: '',
    // Experience
    yearsExperience: '',
    currentCompany: '',
    // Documents
    resume: null,
    coverLetter: null,
    // Additional
    startDate: '',
    references: ''
  },
  {
    validators: {
      fullName: v.required('Full name is required'),
      email: v.required('Email address is required'),
      phone: v.required('Phone number is required'),
      position: v.required('Please select a position'),
      department: v.required('Please select a department'),
      yearsExperience: v.required('Years of experience is required'),
      resume: v.required('Resume is required'),
      startDate: v.required('Available start date is required'),
      references: v.required('At least one reference is required')
    }
  }
);

const appState = ReactiveUtils.state({
  section: 'personal',
  isSubmitting: false
});

// Display form sections
ReactiveUtils.effect(() => {
  const container = document.getElementById('application-form');
  const section = appState.section;

  let content = '';

  switch (section) {
    case 'personal':
      content = `
        <h3>Personal Information</h3>
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text"
                 value="${jobApplicationForm.values.fullName}"
                 oninput="jobApplicationForm.setValue('fullName', this.value)"
                 onblur="jobApplicationForm.setTouched('fullName')">
          ${jobApplicationForm.touched.fullName && jobApplicationForm.errors.fullName ? `
            <span class="error">${jobApplicationForm.errors.fullName}</span>
          ` : ''}
        </div>
        <div class="form-group">
          <label>Email *</label>
          <input type="email"
                 value="${jobApplicationForm.values.email}"
                 oninput="jobApplicationForm.setValue('email', this.value)"
                 onblur="jobApplicationForm.setTouched('email')">
          ${jobApplicationForm.touched.email && jobApplicationForm.errors.email ? `
            <span class="error">${jobApplicationForm.errors.email}</span>
          ` : ''}
        </div>
        <div class="form-group">
          <label>Phone *</label>
          <input type="tel"
                 value="${jobApplicationForm.values.phone}"
                 oninput="jobApplicationForm.setValue('phone', this.value)"
                 onblur="jobApplicationForm.setTouched('phone')">
          ${jobApplicationForm.touched.phone && jobApplicationForm.errors.phone ? `
            <span class="error">${jobApplicationForm.errors.phone}</span>
          ` : ''}
        </div>
      `;
      break;

    case 'position':
      content = `
        <h3>Position Information</h3>
        <div class="form-group">
          <label>Position *</label>
          <select onchange="jobApplicationForm.setValue('position', this.value)">
            <option value="">Select position...</option>
            <option value="developer" ${jobApplicationForm.values.position === 'developer' ? 'selected' : ''}>
              Software Developer
            </option>
            <option value="designer" ${jobApplicationForm.values.position === 'designer' ? 'selected' : ''}>
              UI/UX Designer
            </option>
            <option value="manager" ${jobApplicationForm.values.position === 'manager' ? 'selected' : ''}>
              Project Manager
            </option>
          </select>
          ${jobApplicationForm.errors.position ? `
            <span class="error">${jobApplicationForm.errors.position}</span>
          ` : ''}
        </div>
      `;
      break;
  }

  container.innerHTML = content;
});

// Display progress
ReactiveUtils.effect(() => {
  const progress = document.getElementById('progress');
  const requiredFields = [
    'fullName', 'email', 'phone', 'position', 'department',
    'yearsExperience', 'resume', 'startDate', 'references'
  ];
  
  const filledFields = requiredFields.filter(field =>
    jobApplicationForm.values[field] && jobApplicationForm.values[field] !== ''
  ).length;
  
  const percentage = Math.round((filledFields / requiredFields.length) * 100);

  progress.innerHTML = `
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${percentage}%"></div>
    </div>
    <p>${filledFields} of ${requiredFields.length} required fields completed</p>
  `;
});

// Submit handler
async function submitApplication() {
  jobApplicationForm.touchAll();

  if (!jobApplicationForm.isValid) {
    alert('Please fill all required fields');
    return;
  }

  appState.isSubmitting = true;

  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobApplicationForm.values)
    });

    if (response.ok) {
      alert('Application submitted successfully!');
      jobApplicationForm.reset();
    }
  } catch (error) {
    alert('Submission failed. Please try again.');
  } finally {
    appState.isSubmitting = false;
  }
}
```

---

## Common Patterns

### Pattern 1: Basic Required

```javascript
const form = ReactiveUtils.form(
  { field: '' },
  {
    validators: {
      field: v.required()
    }
  }
);
```

### Pattern 2: Custom Message

```javascript
const form = ReactiveUtils.form(
  { field: '' },
  {
    validators: {
      field: v.required('This field is required')
    }
  }
);
```

### Pattern 3: Multiple Fields

```javascript
const form = ReactiveUtils.form(
  {
    name: '',
    email: '',
    message: ''
  },
  {
    validators: {
      name: v.required(),
      email: v.required(),
      message: v.required()
    }
  }
);
```

### Pattern 4: Conditional Display

```javascript
ReactiveUtils.effect(() => {
  if (form.touched.field && form.errors.field) {
    showError(form.errors.field);
  }
});
```

---

## Common Questions

### Q: Does it trim whitespace?

**Answer:** Yes, empty strings and whitespace-only values fail:

```javascript
form.setValue('name', '   ');
console.log(form.errors.name); // Error: field is required
```

### Q: What about null/undefined?

**Answer:** Both fail validation:

```javascript
form.setValue('field', null); // Invalid
form.setValue('field', undefined); // Invalid
```

### Q: Can I customize the message?

**Answer:** Yes, pass a custom message:

```javascript
v.required('Please enter your name')
```

---

## Summary

### What `validators.required()` Does:

1. ✅ Checks field has value
2. ✅ Rejects empty strings
3. ✅ Rejects whitespace-only
4. ✅ Rejects null/undefined
5. ✅ Custom error messages

### When to Use It:

- Mandatory fields
- Login forms
- Registration forms
- Contact forms
- Any required input

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form(
  {
    username: '',
    email: '',
    message: ''
  },
  {
    validators: {
      username: v.required(),
      email: v.required('Email is required'),
      message: v.required()
    }
  }
);

// Check validation
if (form.isValid) {
  submitForm();
}
```

---

**Remember:** Use `v.required()` (alias) for shorter code! Both `validators.required()` and `v.required()` work identically. 🎉