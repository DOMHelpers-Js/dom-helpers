[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Form Enhancements and Validators

## Quick Start (30 seconds)

```javascript
// Declarative: just add data-enhanced to your form — no JavaScript needed
// <form id="contactForm" data-enhanced data-submit-url="/api/contact"
//       data-success-message="Message sent!" data-reset-on-success>

// Or programmatic enhanced submission with loading states + retry
await FormEnhancements.submit(Forms.contactForm, {
  url:           '/api/contact',
  retryAttempts: 2,
  onSuccess:     () => console.log('Done!'),
});

// Use the built-in validators
const rules = {
  email:    Forms.validators.required('Email is required'),
  password: Forms.validators.combine(
    Forms.validators.required(),
    Forms.validators.minLength(8)
  )
};
```

---

## What Is the Form Enhancement Module?

`02_dh-form-enhance.js` builds on top of `01_dh-form.js` and adds a **production-ready submission pipeline** with features you'd typically have to build yourself:

- **Queue guard** — prevents double-submits when users click fast
- **Button management** — automatically disables submit buttons while submitting
- **Loading states** — adds CSS classes (`form-loading`, `button-loading`) automatically
- **Visual feedback** — success/error messages with auto-dismiss
- **Retry logic** — automatically retry failed requests
- **Fetch timeout** — AbortController-based timeout
- **Declarative setup** — configure everything with `data-*` HTML attributes
- **Reactive bridge** — two-way sync between DOM forms and `ReactiveUtils.form()` state
- **Unified Validators** — reusable validator factory for both DOM and reactive forms

---

## Setup

```html
<script src="01_dh-core.js"></script>
<script src="Form/01_dh-form.js"></script>
<script src="Form/02_dh-form-enhance.js"></script>   <!-- adds the pipeline -->
```

After loading, every form accessed through `Forms` automatically gets enhanced submission. The `FormEnhancements` global object is also available for direct control.

---

## Declarative Mode — Zero JavaScript Required

Add `data-enhanced` to a form and configure everything with HTML attributes:

```html
<form
  id="contactForm"
  data-enhanced
  data-submit-url="/api/contact"
  data-submit-method="POST"
  data-success-message="Your message was sent!"
  data-reset-on-success
  data-message-position="end"
>
  <input name="name"    required />
  <input name="email"   type="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

The module auto-detects `[data-enhanced]` forms on page load and wires them up. Submitting the form triggers the full enhanced pipeline — no JavaScript required.

**Available `data-*` attributes:**

| Attribute | What it does |
|---|---|
| `data-enhanced` | Enables auto-enhancement (required to opt in) |
| `data-submit-url` | The fetch URL (overrides `form.action`) |
| `data-submit-method` | HTTP method (`POST`, `PUT`, etc.) |
| `data-success-message` | Message shown on successful submit |
| `data-reset-on-success` | Present = reset the form after success |
| `data-message-position` | `'start'` or `'end'` (default `'end'`) |
| `data-auto-disable` | Set to `'false'` to keep buttons enabled |
| `data-show-loading` | Set to `'false'` to skip loading CSS class |
| `data-allow-default` | Present = don't call `preventDefault()` |

---

## Programmatic Enhanced Submission

For more control, call `FormEnhancements.submit()` (or `Forms.contactForm.submitData()` — which is automatically upgraded to the enhanced pipeline):

```javascript
await FormEnhancements.submit(Forms.contactForm, {
  url:            '/api/contact',
  method:         'POST',
  successMessage: 'Message sent!',
  resetOnSuccess: true,
  retryAttempts:  2,
  retryDelay:     1000,
  timeout:        15000,

  transform: (values) => ({
    ...values,
    source: 'contact-page'
  }),

  beforeSubmit: async (values, form) => {
    // Return false to cancel
    if (!values.message.trim()) return false;
  },

  onSuccess: (result, values) => {
    console.log('Server says:', result);
  },

  onError: (error) => {
    console.error('Submission failed:', error.message);
  }
});
```

---

## What Happens During Enhanced Submission

```
User clicks submit button
          ↓
Queue guard — is a submission already in progress?
   ├── Yes → ignore (prevents double-submit) ✅
   └── No  → continue
          ↓
Mark as submitting
Add form-loading class + aria-busy="true"
Dispatch 'formsubmitstart' event
          ↓
Disable submit buttons, add button-loading class
          ↓
Call beforeSubmit hook (if provided)
   └── returns false? → cleanup + return cancelled
          ↓
Validate against connected reactive form (if bridge is active)
          ↓
Fetch with timeout (AbortController)
          ↓
Retry on failure (up to retryAttempts times)
          ↓
Cleanup: re-enable buttons, remove loading state
          ↓
Success:  add form-success class, show success message
          dispatch 'formsubmitsuccess' event
          call onSuccess callback
          reset form if resetOnSuccess
                  OR
Failure:  add form-error class, show error message
          dispatch 'formsubmiterror' event
          call onError callback
```

---

## CSS Classes Applied Automatically

The enhanced pipeline applies these classes so you can style each state:

```css
/* Style the loading state */
.form-loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Style the submit button while submitting */
.button-loading {
  cursor: not-allowed;
}

/* Style success state */
.form-success {
  border: 2px solid green;
}

/* Style error state */
.form-error {
  border: 2px solid red;
}
```

---

## Custom Events You Can Listen To

```javascript
const form = document.getElementById('contactForm');

form.addEventListener('formsubmitstart', (e) => {
  console.log('Submission started at:', e.detail.timestamp);
});

form.addEventListener('formsubmitsuccess', (e) => {
  console.log('Submission succeeded!', e.detail.message);
  // e.g., show a toast notification
});

form.addEventListener('formsubmiterror', (e) => {
  console.log('Submission failed:', e.detail.error);
  // e.g., track the error in analytics
});
```

---

## Global Configuration

Configure defaults for all forms at once:

```javascript
FormEnhancements.configure({
  timeout:        20000,   // 20 second timeout
  retryAttempts:  1,       // retry once on failure
  retryDelay:     2000,    // wait 2 seconds before retry
  messageTimeout: 5000,    // auto-dismiss messages after 5 seconds
  loadingText:    '⏳ Sending...',
  showLoadingSpinner: true,
  enableLogging:  false    // set true to see debug logs
});
```

Per-form configuration:

```javascript
Forms.contactForm.configure({
  resetOnSuccess:    true,
  successMessage:   'Your message has been sent!',
  autoDisableButtons: true
});
```

---

## The Unified Validators

`Forms.validators` (also available as `Forms.v`) provides a set of **validator factory functions** that work the same way for both DOM form validation and reactive form validation.

Each factory returns a function with the signature `(value, allValues) => errorMessage | null`.

### Available Validators

```javascript
// Required field
Forms.validators.required()
Forms.validators.required('Custom error message')

// Email format
Forms.validators.email()
Forms.validators.email('Enter a valid email')

// Length constraints
Forms.validators.minLength(8)
Forms.validators.minLength(8, 'Must be at least 8 characters')

Forms.validators.maxLength(100)
Forms.validators.maxLength(100, 'Cannot exceed 100 characters')

// Regular expression
Forms.validators.pattern(/^[a-z]+$/)
Forms.validators.pattern('^[a-z]+$', 'Lowercase letters only')

// Numeric range
Forms.validators.min(0)
Forms.validators.min(0, 'Must be non-negative')

Forms.validators.max(100)
Forms.validators.max(100, 'Cannot exceed 100')

// Cross-field match (e.g., confirm password)
Forms.validators.match('password')
Forms.validators.match('password', 'Passwords must match')

// Wrap any custom function
Forms.validators.custom((value) => {
  return value.startsWith('https') ? null : 'Must start with https';
})

// Combine multiple validators into one
Forms.validators.combine(
  Forms.validators.required(),
  Forms.validators.minLength(8),
  Forms.validators.pattern(/\d/, 'Must contain a number')
)
```

### Using Validators with DOM Form Validation

```javascript
const { isValid, errors } = Forms.signupForm.validate({
  email:    Forms.validators.required('Email is required'),
  password: Forms.validators.combine(
    Forms.validators.required(),
    Forms.validators.minLength(8),
    Forms.validators.custom(v => /[A-Z]/.test(v) ? null : 'Must have an uppercase letter')
  ),
  confirm:  Forms.validators.match('password', 'Passwords must match')
});
```

### Using Validators with Reactive Forms

The same validators work with `ReactiveUtils.form()`:

```javascript
const loginState = ReactiveUtils.form({
  email:    '',
  password: ''
}, {
  validators: {
    email:    Forms.validators.required('Email required'),
    password: Forms.validators.minLength(6)
  }
});
```

---

## The Reactive Bridge

`connectReactiveForm()` creates a **two-way sync** between a DOM `<form>` element and a `ReactiveUtils.form()` state object:

```javascript
// Create reactive form state
const signupState = ReactiveUtils.form({
  username: '',
  email:    '',
  password: ''
});

// Connect the DOM form to the reactive state
const connection = Forms.signupForm.connectReactive(signupState, {
  syncOnInput: true,  // DOM → Reactive on input events
  syncOnBlur:  true   // DOM → Reactive on blur (marks field as "touched")
});

// Now:
// · Typing in the form → updates signupState.values automatically
// · signupState.values.username = 'alice' → updates the DOM field
// · signupState.errors changes → error messages update in the DOM

// Disconnect when done (e.g., when component unmounts)
connection.disconnect();
```

---

## Summary

The Form Enhancement module adds two layers on top of the base Forms module:

**1. Enhanced Submission Pipeline**
- Queue guard + loading states + button management
- Visual feedback (success/error messages + CSS classes)
- Retry logic + fetch timeout
- Declarative `data-*` attribute setup
- Custom events for fine-grained control

**2. Unified Validators**
- Reusable validator factories (`required`, `email`, `minLength`, etc.)
- `combine()` to chain multiple validators
- Works identically for DOM form validation and reactive form validation

Both are accessed through `FormEnhancements`, `Forms.enhance`, or `Forms.validators`.
