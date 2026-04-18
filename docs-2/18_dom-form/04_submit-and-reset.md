[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Submitting and Resetting Forms

## Quick Start (30 seconds)

```javascript
// Submit a form to your server
await Forms.contactForm.submitData({
  url:       '/api/contact',
  method:    'POST',
  onSuccess: (result) => console.log('Sent!', result),
  onError:   (error)  => console.error('Failed:', error)
});

// Reset a form (clears values + removes validation errors)
Forms.contactForm.reset();
```

---

## What Is `.submitData()`?

`.submitData(options)` is an **async method** that submits your form data to a server via `fetch`. It:

1. Optionally validates the form before sending
2. Reads and optionally transforms the values
3. Calls an optional `beforeSubmit` hook
4. Sends the data as JSON via `fetch`
5. Calls `onSuccess` or `onError` based on the response
6. Returns a result object with `{ success, data }` or `{ success: false, errors }`

```javascript
const result = await Forms.loginForm.submitData({
  url: '/api/login'
});

if (result.success) {
  console.log('Server response:', result.data);
} else {
  console.log('Error:', result.error);
}
```

---

## Why Does This Exist?

### Submitting a Form with Plain JavaScript

```javascript
const form = document.getElementById('loginForm');

// Step 1: collect values
const email    = form.querySelector('[name="email"]').value;
const password = form.querySelector('[name="password"]').value;

// Step 2: validate
if (!email || !password) {
  // ... show errors manually ...
  return;
}

// Step 3: submit
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
.then(res => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
})
.then(data => { console.log('Logged in:', data); })
.catch(err => { console.error('Failed:', err); });
```

**Problems:**
❌ Repetitive: you write this pattern for every form
❌ Validation is a separate concern that you must chain manually
❌ Error handling is easy to forget or get wrong
❌ No `beforeSubmit` hook for data transformation

### Submitting with `.submitData()`

```javascript
await Forms.loginForm.submitData({
  url: '/api/login',
  onSuccess: (data) => { console.log('Logged in:', data); },
  onError:   (err)  => { console.error('Failed:', err); }
});
```

✅ One call — handles reading, validating, sending, and responding
✅ Consistent pattern across every form
✅ Validation runs automatically (opt-out if needed)
✅ Full lifecycle hooks for custom logic

---

## `.submitData()` Options Reference

```javascript
await Forms.myForm.submitData({
  // Where to send the data
  url:             '/api/endpoint',   // overrides form.action
  method:          'POST',            // overrides form.method (default POST)

  // Validation
  validate:        true,              // run validation before submit (default: true)
  validationRules: {                  // custom rules to apply
    email: { required: true, email: true }
  },

  // Data transformation
  transform: (data) => ({             // modify the data before sending
    ...data,
    timestamp: Date.now()
  }),

  // Lifecycle hooks
  beforeSubmit: async (data, form) => {
    // Return false to cancel the submission
    if (!confirm('Are you sure?')) return false;
    // Otherwise proceed
  },
  onSuccess: (result, data) => {
    console.log('Server response:', result);
  },
  onError: (error, validationErrors) => {
    console.error('Error:', error);
  }
});
```

---

## How the Submission Pipeline Works

```
form.submitData(options)
        ↓
1. Validate (if options.validate !== false)
   ├── validation fails? → call onError, return { success: false, errors }
   └── validation passes → continue
        ↓
2. Read values: getFormValues(form)
        ↓
3. Transform data (if options.transform provided)
        ↓
4. Call beforeSubmit hook
   ├── returns false? → return { success: false, cancelled: true }
   └── anything else → continue
        ↓
5. Send via fetch
   └── POST (or configured method) with Content-Type: application/json
        ↓
6. Parse response as JSON
        ↓
7a. response.ok? → call onSuccess, return { success: true, data }
7b. not ok?      → throw Error → call onError, return { success: false, error }
```

---

## Basic Submission Examples

### Simplest Case

```javascript
// Just specify a URL — everything else uses defaults
await Forms.contactForm.submitData({ url: '/api/contact' });
```

### With Success and Error Callbacks

```javascript
await Forms.contactForm.submitData({
  url: '/api/contact',
  onSuccess: (response) => {
    document.getElementById('successMsg').textContent = 'Message sent!';
  },
  onError: (error) => {
    document.getElementById('errorMsg').textContent = 'Something went wrong.';
  }
});
```

### Using the Returned Promise

```javascript
const result = await Forms.loginForm.submitData({
  url:    '/api/login',
  method: 'POST'
});

if (result.success) {
  window.location.href = '/dashboard';
} else if (result.errors) {
  console.log('Validation errors:', result.errors);
} else if (result.cancelled) {
  console.log('Submission was cancelled by beforeSubmit hook');
} else {
  console.log('Network error:', result.error);
}
```

### With Data Transformation

```javascript
await Forms.orderForm.submitData({
  url: '/api/orders',
  transform: (data) => ({
    ...data,
    qty:       parseInt(data.qty, 10),    // convert string to number
    orderDate: new Date().toISOString(),  // add a timestamp
    source:    'web'                      // add extra field
  }),
  onSuccess: (response) => {
    console.log('Order placed:', response.orderId);
  }
});
```

### With `beforeSubmit` Guard

```javascript
await Forms.deleteAccountForm.submitData({
  url: '/api/account/delete',
  method: 'DELETE',
  beforeSubmit: async (data) => {
    // Ask user to confirm before sending
    const confirmed = confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    );
    if (!confirmed) return false; // ← false cancels the submission
    // Log the intent (optional)
    console.log('User confirmed account deletion');
    // Return anything other than false to proceed
  },
  onSuccess: () => { window.location.href = '/goodbye'; }
});
```

### Skip Validation for a Specific Submit

```javascript
// Auto-save draft — don't validate (incomplete form is OK)
await Forms.articleForm.submitData({
  url:      '/api/drafts',
  validate: false,           // ← skip validation
  onSuccess: () => { console.log('Draft saved'); }
});
```

### Fire-and-Forget from `.update()`

When you use the `submit` key inside `.update()`, the submission runs as a **fire-and-forget** operation (the return value is not awaitable):

```javascript
// Fire-and-forget — no await, no return value
Forms.contactForm.update({
  submit: {
    url:       '/api/contact',
    onSuccess: () => console.log('Done!')
  }
});

// If you need to await the result, call .submitData() directly
const result = await Forms.contactForm.submitData({ url: '/api/contact' });
```

---

## What Is `.reset()`?

`.reset()` is an enhanced version of the native `form.reset()`. It:

1. Clears all field values back to their initial HTML values
2. Removes all validation error classes and messages
3. Dispatches a `formreset` custom event you can listen to

```javascript
Forms.loginForm.reset();
```

### Listening to the Reset Event

```javascript
document.getElementById('loginForm').addEventListener('formreset', (e) => {
  console.log('Form was reset:', e.detail.form);
  // e.g., hide a success message if it was showing
});
```

### Preserve Validation State on Reset (Unusual)

By default, `reset()` clears validation errors. To skip the error-clearing step:

```javascript
Forms.myForm.reset({ clearCustom: false });
// Values are reset, but any displayed error messages stay
```

### Reset from `.update()`

```javascript
Forms.myForm.update({ reset: true });
```

---

## Real-World Example: A Complete Login Flow

```javascript
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const result = await Forms.loginForm.submitData({
    url: '/api/auth/login',
    validationRules: {
      email:    { required: true, email: true },
      password: { required: true, minLength: 6 }
    },
    onSuccess: (response) => {
      // Store token and redirect
      localStorage.setItem('token', response.token);
      window.location.href = '/dashboard';
    },
    onError: (error, validationErrors) => {
      if (validationErrors) {
        // Validation errors already shown in DOM — nothing extra needed
        return;
      }
      // Server error — show a general message
      document.getElementById('loginError').textContent =
        'Invalid email or password. Please try again.';
    }
  });
});
```

---

## Using `.update()` for Form Operations

The form-aware `.update()` method understands four special form keys:

```javascript
Forms.myForm.update({
  values:   { email: 'pre@fill.com' },   // set field values
  validate: { email: { required: true } }, // run validation
  reset:    true,                         // reset the form
  submit:   { url: '/api/submit' }        // fire-and-forget submit
});
```

You can combine form keys with regular DOM update keys:

```javascript
Forms.checkoutForm.update({
  values:  { promo: 'SAVE10' },           // fill a field
  classes: { add: 'promo-applied' },      // add a CSS class
  text:    'Promo code applied ✓'        // update text content
});
```

---

## Summary

| What you want | How to do it |
|---|---|
| Submit with default settings | `await Forms.myForm.submitData({ url: '/api/...' })` |
| Skip validation on submit | `submitData({ validate: false, ... })` |
| Transform data before sending | `submitData({ transform: data => ({ ...data, extra: 'value' }), ... })` |
| Cancel submission conditionally | Return `false` from `beforeSubmit` hook |
| Reset form + clear errors | `Forms.myForm.reset()` |
| Reset without clearing errors | `Forms.myForm.reset({ clearCustom: false })` |
| Submit from `.update()` | `Forms.myForm.update({ submit: { url: '...' } })` |
