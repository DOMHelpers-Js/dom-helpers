[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What is Reactive Form?

## Quick Start (30 seconds)

```javascript
const form = Forms.create(
  { email: '', password: '' },
  {
    validators: {
      email: Forms.v.required('Email is required'),
      password: Forms.v.minLength(6, 'Password must be at least 6 characters')
    },
    onSubmit: (values) => console.log('Submitted:', values)
  }
);

form.setValue('email', 'alice@example.com');
form.setValue('password', '123456');

form.submit();
// Submitted: { email: 'alice@example.com', password: '123456' }
```

That's it — a reactive form with **values**, **validation**, **touched tracking**, and **submission handling** in a few lines.

---

## What is Reactive Form?

**Reactive Form** is a purpose-built tool in DOMHelpers for managing form state. It wraps all the things a form needs — field values, error messages, touched status, validation, and submission — into a single reactive object.

Simply put, instead of juggling separate variables for each piece of form state, `Forms.create()` gives you one object that holds everything and keeps it all in sync automatically.

---

## Why Does This Exist?

### The Challenge with Plain JavaScript Forms

```javascript
// Managing a simple login form in plain JavaScript
let email = '';
let password = '';
let emailError = '';
let passwordError = '';
let emailTouched = false;
let passwordTouched = false;
let isSubmitting = false;
let submitCount = 0;

function validateEmail() {
  if (!email) {
    emailError = 'Email is required';
    return false;
  }
  emailError = '';
  return true;
}

function validatePassword() {
  if (password.length < 6) {
    passwordError = 'Password must be at least 6 characters';
    return false;
  }
  passwordError = '';
  return true;
}

function handleSubmit() {
  emailTouched = true;
  passwordTouched = true;

  const emailValid = validateEmail();
  const passwordValid = validatePassword();

  if (!emailValid || !passwordValid) return;

  isSubmitting = true;
  // ...submit logic...
  isSubmitting = false;
  submitCount++;
}
```

This is just a **two-field** form, and you already have 8 variables, 2 validation functions, and manual state coordination. Now imagine a form with 10 fields.

**What's the real issue?**

```
Plain JavaScript form state:

email          ─── emailError          ─── emailTouched
password       ─── passwordError       ─── passwordTouched
isSubmitting   ─── submitCount

   ↓ Everything is scattered ↓

 • Each field needs 3 variables (value, error, touched)
 • Validation logic is separate from state
 • Submit logic manually coordinates everything
 • Adding a field = adding 3+ variables + validation function
 • Nothing updates the UI automatically
```

### The Reactive Form Approach

```javascript
const form = Forms.create(
  { email: '', password: '' },
  {
    validators: {
      email: Forms.v.required('Email is required'),
      password: Forms.v.minLength(6, 'Must be at least 6 characters')
    },
    onSubmit: (values) => {
      console.log('Submitted:', values);
    }
  }
);

form.submit();
```

**What just happened?**

```
Reactive Form state:

Forms.create()
   ↓
┌─────────────────────────────────────┐
│  form (single reactive object)      │
│                                     │
│  .values    → { email, password }   │
│  .errors    → { }                   │
│  .touched   → { }                   │
│  .isValid   → true/false (computed) │
│  .isDirty   → true/false (computed) │
│  .hasErrors → true/false (computed) │
│                                     │
│  .setValue()    .validate()          │
│  .setError()   .submit()            │
│  .reset()      .handleChange()      │
│  ... 20+ methods built in           │
└─────────────────────────────────────┘
   ↓
Everything in one place, fully reactive
```

**Benefits:**
✅ All form state lives in one object
✅ Validators are declared alongside the form
✅ Computed properties (`isValid`, `isDirty`, `hasErrors`) update automatically
✅ Built-in touched tracking — errors only show after user interaction
✅ Async submission with loading state
✅ Adding a new field = one line in `values` + one line in `validators`

---

## Mental Model

Think of `Forms.create()` as a **smart clipboard** at a reception desk.

When a visitor fills out a form on paper:
- The **clipboard** holds the form (values)
- A **red pen** marks which fields the visitor has actually touched (touched)
- A **checklist** validates each field and notes problems (errors/validators)
- The **receptionist** only submits the form when everything passes (submit)

`Forms.create()` is that entire desk rolled into one object. You declare the form fields, the rules, and the submit action — and it handles the rest.

---

## Syntax

```javascript
// Full syntax
const form = Forms.create(initialValues, options);

// Using the Forms global
const form = Forms.create({ name: '', email: '' }, {
  validators: { /* ... */ },
  onSubmit: (values) => { /* ... */ }
});

// Using ReactiveUtils
const form = ReactiveUtils.form({ name: '' }, { /* options */ });

// Using ReactiveUtils (alias)
const form = ReactiveUtils.createForm({ name: '' }, { /* options */ });
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialValues` | Object | `{}` | The starting values for each field |
| `options` | Object | `{}` | Configuration (validators, onSubmit) |

### Options

| Property | Type | Description |
|----------|------|-------------|
| `validators` | Object | Key-value pairs: field name → validator function |
| `onSubmit` | Function | Called when form passes validation and is submitted |

---

## What's Inside a Reactive Form?

When you call `Forms.create()`, you get back a reactive object with these properties and methods:

```
form
├── State Properties
│   ├── .values        → Object with all field values
│   ├── .errors        → Object with error messages (field → message)
│   ├── .touched       → Object tracking which fields were interacted with
│   ├── .isSubmitting  → Boolean (true during submission)
│   └── .submitCount   → Number of successful submissions
│
├── Computed Properties (auto-updating)
│   ├── .isValid       → true if no errors
│   ├── .isDirty       → true if any field was touched
│   ├── .hasErrors     → true if any error exists
│   ├── .touchedFields → Array of touched field names
│   └── .errorFields   → Array of field names with errors
│
├── Value Methods
│   ├── .setValue(field, value)
│   ├── .setValues({ field: value })
│   └── .getValue(field)
│
├── Error Methods
│   ├── .setError(field, message)
│   ├── .setErrors({ field: message })
│   ├── .clearError(field)
│   ├── .clearErrors()
│   ├── .hasError(field)
│   └── .getError(field)
│
├── Touched Methods
│   ├── .setTouched(field)
│   ├── .setTouchedFields([fields])
│   ├── .touchAll()
│   └── .isTouched(field)
│
├── Validation Methods
│   ├── .validateField(field)
│   └── .validate()
│
├── Submission
│   ├── .submit(handler?)
│   └── .shouldShowError(field)
│
├── Reset
│   ├── .reset(newValues?)
│   └── .resetField(field)
│
├── DOM Integration
│   ├── .handleChange(event)
│   ├── .handleBlur(event)
│   ├── .getFieldProps(field)
│   └── .bindToInputs(selector)
│
└── Utility
    └── .toObject()
```

---

## Where Does It Come From?

### Available on these globals:

```javascript
Forms.create(values, options)       // Primary API
Forms.form(values, options)         // Alias
ReactiveUtils.form(values, options) // Convenience
ReactiveUtils.createForm(values, options)  // Alias
ReactiveState.form(values, options) // If ReactiveState is loaded
```

### Built-in validators:

```javascript
Forms.validators    // Full name
Forms.v             // Shorthand
ReactiveUtils.validators  // Also available here
```

---

## Big Picture: How Reactive Form Fits In

```
DOMHelpers Reactive System
│
├── ReactiveUtils.state()     → General reactive state
├── ReactiveUtils.collection()→ Reactive lists (arrays)
├── ReactiveUtils.form()      → Reactive forms ← YOU ARE HERE
├── ReactiveUtils.ref()       → Single reactive value
├── ReactiveUtils.store()     → State + actions
└── ReactiveUtils.component() → State + lifecycle
```

Each factory is a purpose-built tool. `Forms.create()` is designed specifically for the form use case — where you need values, errors, touched tracking, validation, and submission all working together.

---

## Key Takeaways

1. **`Forms.create()`** creates a single reactive object that holds all form state
2. **Values, errors, and touched** are tracked automatically per field
3. **Computed properties** (`isValid`, `isDirty`, `hasErrors`) update on their own
4. **Validators** are declared upfront and run automatically when values change
5. **Submission** handles validation, loading state, and error handling
6. **Everything is reactive** — effects re-run when form state changes

---

## What's next?

Let's walk through a complete form example step by step, breaking down every line of code.

Let's continue!