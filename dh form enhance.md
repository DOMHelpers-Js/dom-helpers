# DOM Helpers — Form Enhancement Module (`02_dh-form-enhance.js`)

> **Who is this for?**
> This guide assumes you have already read the `01_dh-form.js` documentation and understand the basics of accessing forms, reading values, and validating. This module builds on top of those foundations.

---

## Table of Contents

1. [What this module does](#1-what-this-module-does)
2. [Setup and load order](#2-setup-and-load-order)
3. [Enhanced submission — the full pipeline](#3-enhanced-submission--the-full-pipeline)
4. [Button management](#4-button-management)
5. [Loading states and ARIA](#5-loading-states-and-aria)
6. [Success and error feedback](#6-success-and-error-feedback)
7. [Submission queue guard](#7-submission-queue-guard)
8. [Retry on failure](#8-retry-on-failure)
9. [Fetch timeout](#9-fetch-timeout)
10. [Declarative forms — HTML-only usage](#10-declarative-forms--html-only-usage)
11. [Per-form configuration](#11-per-form-configuration)
12. [Global configuration](#12-global-configuration)
13. [Validators — a unified set](#13-validators--a-unified-set)
14. [The reactive bridge — `form.connectReactive()`](#14-the-reactive-bridge--formconnectreactive)
15. [The `FormEnhancements` API](#15-the-formenhancements-api)
16. [Custom events reference](#16-custom-events-reference)
17. [CSS classes reference](#17-css-classes-reference)
18. [Complete real-world example](#18-complete-real-world-example)
19. [Quick reference card](#19-quick-reference-card)

---

## 1. What this module does

`01_dh-form.js` gives you a basic `fetch`-based submission. It works, but real production forms need more:

- **Prevent double-submits** — what if the user clicks the button twice?
- **Disable buttons while loading** — so users know something is happening
- **Show a spinner** — visual feedback that the request is in progress
- **Display a success or error message** — after the request finishes
- **Retry automatically** — if a network hiccup causes a temporary failure
- **Cancel a request** that takes too long

This module adds all of that on top of `01_dh-form.js`. It also provides:

- **Declarative forms** — configure everything with HTML `data-` attributes, no JavaScript needed
- **A unified set of validators** — works with both regular forms and reactive forms
- **A reactive bridge** — two-way sync between a DOM form and a reactive form state object

Everything in this module is **opt-in**. If you do not load this file, `01_dh-form.js` works perfectly on its own.

---

## 2. Setup and load order

This module **must** load after `01_dh-form.js`.

```html
<!-- 1. Core library -->
<script src="01_dh-core.js"></script>

<!-- 2. Form module — required before this one -->
<script src="Form/01_dh-form.js"></script>

<!-- 3. This module -->
<script src="Form/02_dh-form-enhance.js"></script>
```

### With the reactive bridge

If you want to use the `connectReactive()` feature, also load the reactive modules:

```html
<script src="01_dh-core.js"></script>
<script src="04_reactive/01_dh-reactive.js"></script>
<script src="04_reactive/04_dh-reactive-form.js"></script>
<script src="Form/01_dh-form.js"></script>
<script src="Form/02_dh-form-enhance.js"></script>
```

### What if you only need validators?

The validators in this module are standalone — they work even if you do not use any of the submission features. Just loading the file makes them available via `FormEnhancements.validators`.

---

## 3. Enhanced submission — the full pipeline

When this module is loaded, `form.submitData()` is automatically upgraded from the basic version in `01_dh-form.js` to the full managed pipeline. You do not need to change how you call it — it just does more.

```js
const result = await Forms.contactForm.submitData({
  url:            '/api/contact',
  successMessage: 'Message sent successfully!',
  resetOnSuccess: true,
  onSuccess:      (response) => console.log('Done:', response),
  onError:        (error)    => console.log('Failed:', error)
});
```

### What happens when you call `submitData()`

Here is the full sequence of events, in order:

1. **Queue check** — if the form is already submitting, the call is ignored
2. **Loading starts** — `form-loading` class added, `aria-busy="true"` set, `formsubmitstart` event fired
3. **Buttons disabled** — submit buttons are disabled and show a spinner
4. **Previous messages cleared** — any success/error messages from last time are removed
5. **`beforeSubmit` hook** — if you provided one, it runs now; return `false` to cancel
6. **Reactive validation** — if a reactive form is connected, its `.validate()` runs
7. **Fetch request sent** — with optional timeout and retry
8. **Cleanup** — loading state removed, buttons re-enabled
9. **Feedback shown** — success or error message displayed on the form
10. **Events fired** — `formsubmitsuccess` or `formsubmiterror`
11. **Callbacks called** — your `onSuccess` or `onError` function runs
12. **Auto-reset** — if `resetOnSuccess: true`, the form resets after 500ms

### All `submitData()` options (with this module loaded)

```js
await form.submitData({
  // Destination
  url:    '/api/endpoint',   // defaults to form's action attribute
  method: 'POST',            // GET, POST, PUT, PATCH, DELETE (default: POST)

  // Validation
  validate:        true,     // run validation before sending (default: true)
  validationRules: { ... },  // custom rules to check

  // Hooks
  beforeSubmit: async (data, form) => {
    // return false to cancel, anything else to continue
  },
  transform: (data) => {
    // reshape the data object before sending
    return { ...data, extra: 'field' };
  },

  // Callbacks
  onSuccess: (response, dataSent) => { ... },
  onError:   (error)              => { ... },

  // Behaviour
  successMessage: 'Saved!',     // message shown on success
  resetOnSuccess: false,         // reset the form after success?

  // Pipeline control (override global config for this call only)
  autoDisableButtons: true,
  showLoadingStates:  true,
  retryAttempts:      2,
  retryDelay:         1000,      // ms between retries
  timeout:            15000      // ms before the request is aborted
});
```

---

## 4. Button management

When a form is submitted, all `<button type="submit">` and `<input type="submit">` elements inside it are automatically:

- **Disabled** — prevents double-clicks
- **Content replaced** with a spinner and loading text
- **Restored** exactly to their original state when the request finishes

```html
<button type="submit">Send Message</button>
```

While loading, this becomes:
```
⌛ Loading...
```

After completion, it goes back to:
```
Send Message
```

The original HTML content is saved and fully restored — including any icons, custom markup, or CSS classes.

### Customising the loading indicator

```js
Forms.contactForm.configure({
  loadingText:        'Please wait...',
  loadingSpinner:     '🔄',
  showLoadingSpinner: true   // set to false to hide the spinner
});
```

Or globally for all forms:

```js
FormEnhancements.configure({
  loadingText:        'Sending...',
  loadingSpinner:     '⏳'
});
```

### Turning off button management

```js
Forms.contactForm.configure({
  autoDisableButtons: false
});
```

### Controlling buttons manually

```js
FormEnhancements.disableButtons(Forms.contactForm);
FormEnhancements.enableButtons(Forms.contactForm);
```

---

## 5. Loading states and ARIA

When submission starts, the `form-loading` class is added to the `<form>` element and `aria-busy="true"` is set. When it finishes, both are removed.

```css
/* Show a subtle overlay while the form is loading */
.form-loading {
  opacity: 0.7;
  pointer-events: none; /* prevent any interaction */
}

/* Add a spinner using a pseudo-element */
.form-loading::after {
  content: '';
  display: block;
  /* ... spinner styles ... */
}
```

The `aria-busy` attribute is for screen readers — they will announce "busy" to users who rely on assistive technology.

### Turning off loading states

```js
Forms.contactForm.configure({
  showLoadingStates: false
});
```

---

## 6. Success and error feedback

After submission, a styled message is automatically shown inside the form.

### Success message

- The `form-success` CSS class is added to the `<form>`
- A green message `<div>` is inserted
- The `formsubmitsuccess` custom event fires
- After `messageTimeout` milliseconds, everything is removed automatically

### Error message

- The `form-error` CSS class is added to the `<form>`
- A red message `<div>` is inserted
- The `formsubmiterror` custom event fires
- After `messageTimeout` milliseconds, everything is removed

### Customising messages

```js
// Set a custom success message for this specific submission:
await form.submitData({
  url:            '/api/contact',
  successMessage: 'Your message has been received! We will reply within 24 hours.'
});

// Change how long the message stays visible (in milliseconds):
Forms.contactForm.configure({
  messageTimeout: 5000 // 5 seconds (default is 3000)
});

// Keep messages permanently (never auto-dismiss):
Forms.contactForm.configure({
  messageTimeout: 0
});
```

### Controlling message position

By default, messages are appended at the end of the form. To put them at the beginning instead, add a data attribute to your HTML:

```html
<form id="contactForm" data-message-position="start">
```

### Styling the messages

```css
.form-success {
  border-color: #28a745;
}

.form-error {
  border-color: #dc3545;
}

.form-message {
  border-radius: 4px;
  padding: 12px 16px;
  margin: 16px 0;
  font-size: 14px;
}

.form-message-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-message-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
```

### Showing messages manually

You can trigger the success or error feedback without going through submission:

```js
FormEnhancements.showSuccess(Forms.contactForm, 'Saved as draft!');
FormEnhancements.showError(Forms.contactForm, 'Connection lost — please try again.');
FormEnhancements.removeMessage(Forms.contactForm); // remove any message
```

### Turning off automatic messages

```js
Forms.contactForm.configure({
  showSuccessMessage: false,  // no success message
  showErrorMessage:   false   // no error message
});
```

---

## 7. Submission queue guard

The queue guard prevents a form from being submitted twice at the same time. If the user clicks the submit button while a request is already in progress, the second click is silently ignored.

This protects against:
- Impatient users who double-click
- Slow connections where the button appears unresponsive
- Animated spinners that still look clickable

The guard is active by default. To disable it:

```js
Forms.contactForm.configure({
  queueSubmissions: false
});
```

---

## 8. Retry on failure

If a submission fails due to a temporary network problem, the module can automatically retry.

```js
// Retry up to 3 times, with a 2-second pause between each attempt
Forms.contactForm.configure({
  retryAttempts: 3,
  retryDelay:    2000  // milliseconds
});

// Or set it per submission:
await form.submitData({
  url:           '/api/contact',
  retryAttempts: 2,
  retryDelay:    1500
});
```

The retry only happens on network errors or unexpected failures. If the server responds with an error status (like a 400 or 500), that is treated as a definitive failure and is not retried.

---

## 9. Fetch timeout

By default, a fetch request will wait up to 30 seconds before giving up. You can change this:

```js
// Wait only 10 seconds
Forms.contactForm.configure({
  timeout: 10000 // milliseconds
});

// No timeout at all — wait forever
Forms.contactForm.configure({
  timeout: 0
});
```

If the request times out, it is treated as an error and `onError` is called with an `AbortError`.

---

## 10. Declarative forms — HTML-only usage

If you prefer to configure forms in HTML rather than JavaScript, add the `data-enhanced` attribute to your form. The module will wire it up automatically when the page loads.

```html
<form
  id="contactForm"
  data-enhanced
  data-submit-url="/api/contact"
  data-submit-method="POST"
  data-success-message="Message sent!"
  data-reset-on-success
  data-message-position="start"
>
  <input type="text"  name="name"  placeholder="Name" required>
  <input type="email" name="email" placeholder="Email" required>
  <button type="submit">Send</button>
</form>
```

No JavaScript required. When the user submits, the enhanced pipeline runs automatically.

### All `data-*` attributes

| Attribute | What it does |
|---|---|
| `data-enhanced` | Activates the enhanced pipeline (required) |
| `data-submit-url="..."` | Where to submit (default: `action` attribute) |
| `data-submit-method="..."` | HTTP method (default: `method` attribute) |
| `data-success-message="..."` | Message shown on success |
| `data-reset-on-success` | Presence resets the form after success |
| `data-message-position="start"` | Shows messages at the top instead of bottom |
| `data-auto-disable="false"` | Keeps buttons enabled during submission |
| `data-show-loading="false"` | Disables loading class and aria-busy |
| `data-allow-default` | Presence allows the browser's default submit |

### Using both HTML and JavaScript

You can use `data-enhanced` for basic wiring and still add a JavaScript callback for custom behaviour after submission:

```html
<form id="contactForm" data-enhanced data-submit-url="/api/contact">
  ...
</form>
```

```js
// Add a custom callback on top of the declarative setup
const form = Forms.contactForm;

form.addEventListener('formsubmitsuccess', function(event) {
  console.log('Form submitted at:', event.detail.timestamp);
  document.getElementById('thankYouMessage').style.display = 'block';
});
```

---

## 11. Per-form configuration

Configure a specific form's behaviour without affecting other forms.

```js
Forms.contactForm.configure({
  // Submission behaviour
  autoDisableButtons : true,
  showLoadingStates  : true,
  queueSubmissions   : true,

  // Buttons
  loadingText        : 'Sending...',
  loadingSpinner     : '⌛',
  showLoadingSpinner : true,

  // Messages
  messageTimeout     : 4000,
  showSuccessMessage : true,
  showErrorMessage   : true,

  // Network
  retryAttempts      : 1,
  retryDelay         : 2000,
  timeout            : 20000
});
```

Per-form configuration takes effect immediately and only applies to that form.

---

## 12. Global configuration

Change defaults for all forms at once. Per-form configuration always overrides global configuration.

```js
FormEnhancements.configure({
  loadingText:    'Please wait...',
  messageTimeout: 5000,
  retryAttempts:  2,
  timeout:        15000,
  enableLogging:  true   // log pipeline steps to the console (useful for debugging)
});

// Read back the current config:
const config = FormEnhancements.getConfig();
console.log(config);
```

---

## 13. Validators — a unified set

This module provides a set of ready-made validator functions that work with both:

- The `form.validate(rules)` method from `01_dh-form.js`
- Reactive form validators from `04_dh-reactive-form.js`

You do not need to write the same validation logic twice.

### Accessing validators

```js
// Via FormEnhancements:
const v = FormEnhancements.validators;

// Via Forms namespace (shorthand):
const v = Forms.validators;
// or:
const v = Forms.v;
```

### Available validators

Every validator is a **function that returns another function**. You call it to create the rule, then pass the rule to `validate()`.

---

#### `required(message?)`

The field must not be empty.

```js
form.validate({
  name: v.required()
  // or with a custom message:
  name: v.required('Please enter your name')
});
```

---

#### `email(message?)`

The value must look like a valid email address.

```js
form.validate({
  email: v.email()
  email: v.email('That does not look like a valid email')
});
```

---

#### `minLength(min, message?)`

The value must be at least `min` characters long.

```js
form.validate({
  password: v.minLength(8)
  password: v.minLength(8, 'Password must be at least 8 characters')
});
```

---

#### `maxLength(max, message?)`

The value must be no more than `max` characters long.

```js
form.validate({
  bio: v.maxLength(500)
  bio: v.maxLength(500, 'Bio cannot exceed 500 characters')
});
```

---

#### `pattern(regex, message?)`

The value must match a regular expression.

```js
form.validate({
  username: v.pattern('^[a-zA-Z0-9_]+$', 'Only letters, numbers, and underscores')
  postcode: v.pattern('^[A-Z]{1,2}[0-9]', 'Invalid postcode format')
});
```

---

#### `min(min, message?)`

The numeric value must be at least `min`.

```js
form.validate({
  age:      v.min(18, 'Must be 18 or older'),
  quantity: v.min(1)
});
```

---

#### `max(max, message?)`

The numeric value must be no more than `max`.

```js
form.validate({
  age:      v.max(120),
  discount: v.max(100, 'Discount cannot exceed 100%')
});
```

---

#### `match(fieldName, message?)`

The value must exactly match another field's value. Used for "confirm password" fields.

```js
form.validate({
  confirmPassword: v.match('password', 'Passwords do not match'),
  confirmEmail:    v.match('email')
});
```

---

#### `custom(fn)`

Wrap your own function as a validator so it can be used anywhere a validator is expected.

```js
const isEven = v.custom((value) => {
  return Number(value) % 2 === 0 ? null : 'Must be an even number';
});

form.validate({
  count: isEven
});
```

---

#### `combine(...validators)`

Chain multiple validators together for a single field. The first one that fails stops the chain.

```js
const { required, minLength, maxLength, pattern } = Forms.validators;

form.validate({
  username: v.combine(
    required('Username is required'),
    minLength(3, 'Too short'),
    maxLength(20, 'Too long'),
    pattern('^[a-z0-9]+$', 'Lowercase letters and numbers only')
  )
});
```

### Using validators in reactive forms

The same validators work in reactive forms without any changes:

```js
const v = Forms.validators;

const state = ReactiveUtils.form(
  { email: '', password: '' },
  {
    validators: {
      email:    v.email(),
      password: v.combine(v.required(), v.minLength(8))
    }
  }
);
```

---

## 14. The reactive bridge — `form.connectReactive()`

When you are using both this module and the reactive form module, you can link a DOM `<form>` element to a reactive form state object. They will stay in sync automatically.

> **Note:** This feature requires the reactive modules to be loaded. If they are not loaded, `connectReactive()` will log a warning and do nothing.

### What the bridge does

**DOM → Reactive:**
- When the user types in any field, the reactive state is updated
- When a field loses focus (blur), it is marked as "touched" in the reactive state

**Reactive → DOM:**
- When the reactive state changes (e.g. from code), the DOM inputs update to match
- When the reactive form has validation errors, they are shown in the DOM form

### Basic usage

```js
// Create a reactive form state
const state = ReactiveUtils.form({
  email:    '',
  password: ''
}, {
  validators: {
    email:    Forms.validators.email(),
    password: Forms.validators.minLength(8)
  }
});

// Get the DOM form
const domForm = Forms.loginForm;

// Connect them
const connection = domForm.connectReactive(state);
```

After this, typing `alice@example.com` in the email field automatically updates `state.email`. And if you set `state.email = 'new@value.com'` from code, the input updates too.

### Disconnecting

```js
const connection = domForm.connectReactive(state);

// Later, to break the connection:
connection.disconnect();
```

### Full bridge example

```html
<form id="loginForm">
  <input type="email"    name="email"    placeholder="Email">
  <input type="password" name="password" placeholder="Password">
  <button type="submit">Log In</button>
</form>
```

```js
const v     = Forms.validators;
const state = ReactiveUtils.form(
  { email: '', password: '' },
  {
    validators: {
      email:    v.combine(v.required(), v.email()),
      password: v.required()
    }
  }
);

const form = Forms.loginForm;
form.connectReactive(state);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate through the reactive state
  const isValid = state.validate();
  if (!isValid) return; // errors shown automatically in the DOM

  // Submit
  await form.submitData({
    url:       '/api/login',
    onSuccess: (data) => { window.location.href = '/dashboard'; },
    onError:   (err)  => alert('Login failed: ' + err.message)
  });
});
```

---

## 15. The `FormEnhancements` API

Everything in this module is accessible via the `FormEnhancements` global.

```js
// Configuration
FormEnhancements.configure({ ... });    // update global defaults
FormEnhancements.getConfig();           // read current global config

// Submit a form manually
FormEnhancements.submit(form, options); // same as form.submitData()

// Reactive bridge
FormEnhancements.connect(domForm, reactiveForm, options);

// Manually enhance a form that doesn't have data-enhanced
FormEnhancements.enhance(form, options);

// Validators (see section 13 for full list)
FormEnhancements.validators.required()
FormEnhancements.v.email()             // shorthand

// Per-form state inspection (useful for debugging)
const state = FormEnhancements.getState(form);
console.log(state.isSubmitting);  // true/false
console.log(state.submitCount);   // how many times submitted
console.log(state.lastSubmit);    // timestamp of last submission

// Queue
FormEnhancements.clearQueue();     // clear all in-progress submissions

// Direct UI methods
FormEnhancements.showSuccess(form, 'Saved!');
FormEnhancements.showError(form, 'Something went wrong');
FormEnhancements.removeMessage(form);
FormEnhancements.disableButtons(form);
FormEnhancements.enableButtons(form);
```

The same methods are also available via the `Forms` namespace:

```js
Forms.enhance           // same as FormEnhancements
Forms.enhancements      // same as FormEnhancements
Forms.validators        // same as FormEnhancements.validators
Forms.v                 // shorthand
```

---

## 16. Custom events reference

This module fires custom DOM events on the `<form>` element during submission. You can listen to them with `addEventListener`.

### `formsubmitstart`

Fires when the submission pipeline begins (after the queue check passes).

```js
Forms.contactForm.addEventListener('formsubmitstart', function(event) {
  console.log('Submission started at:', event.detail.timestamp);
  // event.detail: { form, timestamp }
});
```

### `formsubmitsuccess`

Fires when the server responds with a success status.

```js
Forms.contactForm.addEventListener('formsubmitsuccess', function(event) {
  console.log('Success!', event.detail.message);
  // event.detail: { form, message, timestamp }
});
```

### `formsubmiterror`

Fires when the submission fails (network error, server error, or timeout).

```js
Forms.contactForm.addEventListener('formsubmiterror', function(event) {
  console.log('Error:', event.detail.error.message);
  // event.detail: { form, error, timestamp }
});
```

### `formreset`

Fires when the form is reset (comes from `01_dh-form.js`, not this module):

```js
Forms.contactForm.addEventListener('formreset', function() {
  console.log('Form was reset');
});
```

---

## 17. CSS classes reference

These classes are added and removed by the module automatically. Target them in your CSS for full visual control.

| Class | Added to | When |
|---|---|---|
| `form-loading` | `<form>` | Submission is in progress |
| `form-success` | `<form>` | Submission succeeded |
| `form-error` | `<form>` | Submission failed |
| `button-loading` | Submit button | Submission is in progress |
| `form-invalid` | Individual `<input>` | Field failed validation |
| `form-message` | Message `<div>` | Any message is shown |
| `form-message-success` | Message `<div>` | Success message |
| `form-message-error` | Message `<div>` | Error message |
| `form-error-message` | Error `<div>` | Field-level validation error |

### Example CSS using these classes

```css
/* Dim the form while loading */
.form-loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Green border on success */
.form-success {
  border: 2px solid #28a745;
  border-radius: 4px;
  padding: 16px;
}

/* Red border on error */
.form-error {
  border: 2px solid #dc3545;
  border-radius: 4px;
  padding: 16px;
}

/* Invalid field highlight */
.form-invalid {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

/* Field-level error message */
.form-error-message {
  color: #dc3545;
  font-size: 0.85em;
  margin-top: 4px;
}

/* Loading button state */
.button-loading {
  cursor: not-allowed;
}
```

---

## 18. Complete real-world example

A registration form that uses the full pipeline — validation, enhanced submission, loading states, success/error feedback, and automatic reset.

```html
<form
  id="registerForm"
  data-message-position="start"
>
  <h2>Create Account</h2>

  <label>
    Username
    <input type="text" name="username" placeholder="e.g. alice_99">
  </label>

  <label>
    Email
    <input type="email" name="email" placeholder="you@example.com">
  </label>

  <label>
    Password
    <input type="password" name="password" placeholder="At least 8 characters">
  </label>

  <label>
    Confirm Password
    <input type="password" name="confirmPassword" placeholder="Repeat your password">
  </label>

  <label class="checkbox-label">
    <input type="checkbox" name="terms">
    I agree to the <a href="/terms">Terms of Service</a>
  </label>

  <button type="submit">Create Account</button>
</form>

<script src="01_dh-core.js"></script>
<script src="Form/01_dh-form.js"></script>
<script src="Form/02_dh-form-enhance.js"></script>
<script>

  // Import the validator shorthand
  const v = Forms.validators;

  // Configure this form's submission behaviour
  Forms.registerForm.configure({
    loadingText:    'Creating your account...',
    loadingSpinner: '✨',
    messageTimeout: 0,         // messages stay until dismissed
    retryAttempts:  1,         // retry once on failure
    timeout:        20000      // 20 second timeout
  });

  // Handle the submit event
  Forms.registerForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = Forms.registerForm;

    // Validate with the unified validators
    const result = form.validate({
      username:        v.combine(
                         v.required('Username is required'),
                         v.minLength(3, 'At least 3 characters'),
                         v.maxLength(20, 'No more than 20 characters'),
                         v.pattern('^[a-zA-Z0-9_]+$', 'Letters, numbers, and _ only')
                       ),
      email:           v.combine(v.required(), v.email()),
      password:        v.combine(v.required(), v.minLength(8)),
      confirmPassword: v.match('password', 'Passwords do not match'),
      terms:           v.custom((value) => {
                         return value ? null : 'You must accept the Terms of Service';
                       })
    });

    if (!result.isValid) {
      return; // errors shown automatically
    }

    // Submit with the enhanced pipeline
    await form.submitData({
      url:    '/api/users/register',
      method: 'POST',

      // Remove confirmPassword and terms before sending
      transform: (data) => ({
        username: data.username,
        email:    data.email,
        password: data.password
      }),

      successMessage: 'Account created! Redirecting you to the dashboard...',
      resetOnSuccess: false,

      onSuccess: (response) => {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      },

      onError: (error) => {
        console.error('Registration failed:', error);
      }
    });

  });

</script>
```

---

## 19. Quick reference card

```js
// ── Access after loading this module ──────────────────────────────────────
// All Forms access is the same as 01_dh-form.js — just with more features.
const form = Forms.myFormId;

// ── Enhanced submitData() ─────────────────────────────────────────────────
await form.submitData({
  url, method,
  validate, validationRules,
  beforeSubmit, transform,
  onSuccess, onError,
  successMessage, resetOnSuccess,
  autoDisableButtons, showLoadingStates,
  retryAttempts, retryDelay, timeout
});

// ── Per-form configuration ────────────────────────────────────────────────
form.configure({
  autoDisableButtons, showLoadingStates, queueSubmissions,
  loadingClass, buttonLoadingClass, successClass, errorClass,
  loadingText, loadingSpinner, showLoadingSpinner,
  messageTimeout, showSuccessMessage, showErrorMessage,
  retryAttempts, retryDelay, timeout
});

// ── Declarative HTML ──────────────────────────────────────────────────────
// <form data-enhanced
//       data-submit-url="/api"
//       data-submit-method="POST"
//       data-success-message="Done!"
//       data-reset-on-success
//       data-message-position="start"
//       data-auto-disable="false"
//       data-show-loading="false"
//       data-allow-default>

// ── Validators ────────────────────────────────────────────────────────────
const v = Forms.validators; // or FormEnhancements.validators / Forms.v

form.validate({
  field: v.required(msg)
  field: v.email(msg)
  field: v.minLength(n, msg)
  field: v.maxLength(n, msg)
  field: v.pattern(regex, msg)
  field: v.min(n, msg)
  field: v.max(n, msg)
  field: v.match('otherField', msg)
  field: v.custom((value, allValues) => null | 'error')
  field: v.combine(v.required(), v.minLength(8), ...)
});

// ── Reactive bridge ───────────────────────────────────────────────────────
const connection = form.connectReactive(reactiveState, options);
connection.disconnect(); // break the connection

// ── FormEnhancements global API ───────────────────────────────────────────
FormEnhancements.configure({ ... })      // global defaults
FormEnhancements.getConfig()             // read config
FormEnhancements.submit(form, opts)      // same as form.submitData()
FormEnhancements.connect(form, state)    // same as form.connectReactive()
FormEnhancements.enhance(form, opts)     // manually enhance a form
FormEnhancements.getState(form)          // { isSubmitting, submitCount, ... }
FormEnhancements.clearQueue()            // clear in-progress submissions
FormEnhancements.showSuccess(form, msg)
FormEnhancements.showError(form, err)
FormEnhancements.removeMessage(form)
FormEnhancements.disableButtons(form)
FormEnhancements.enableButtons(form)

// ── Custom events ─────────────────────────────────────────────────────────
form.addEventListener('formsubmitstart',   (e) => { /* e.detail: { form, timestamp } */ });
form.addEventListener('formsubmitsuccess', (e) => { /* e.detail: { form, message, timestamp } */ });
form.addEventListener('formsubmiterror',   (e) => { /* e.detail: { form, error, timestamp } */ });
form.addEventListener('formreset',         ()  => { /* no detail */ });

// ── CSS classes (target in your stylesheet) ───────────────────────────────
// .form-loading         on <form> while submitting
// .form-success         on <form> after success
// .form-error           on <form> after failure
// .button-loading       on submit buttons while submitting
// .form-invalid         on individual fields that failed validation
// .form-error-message   on field-level error message divs
// .form-message         on the submission result message div
// .form-message-success on a success message div
// .form-message-error   on an error message div
```