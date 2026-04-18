[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Patterns and Best Practices

## Pattern 1: The Complete Login Form

A full login flow with validation, submission, error handling, and redirect:

```html
<form id="loginForm">
  <div>
    <label>Email</label>
    <input name="email" type="email" required />
  </div>
  <div>
    <label>Password</label>
    <input name="password" type="password" required minlength="6" />
  </div>
  <button type="submit">Log In</button>
</form>

<script>
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const result = await Forms.loginForm.submitData({
      url: '/api/auth/login',
      validationRules: {
        email:    { required: true, email: true },
        password: { required: true, minLength: 6 }
      },
      onSuccess: (response) => {
        localStorage.setItem('token', response.token);
        window.location.href = '/dashboard';
      },
      onError: (error, validationErrors) => {
        if (validationErrors) return; // Already shown in DOM
        // Show general server error
        document.getElementById('loginError').style.display = 'block';
      }
    });
  });
</script>
```

---

## Pattern 2: Declarative Contact Form (No JavaScript)

Using `data-enhanced` to set up the entire submission pipeline in HTML:

```html
<form
  id="contactForm"
  data-enhanced
  data-submit-url="/api/contact"
  data-success-message="Thanks! We'll be in touch within 24 hours."
  data-reset-on-success
  data-message-position="start"
>
  <input name="name"  required placeholder="Your name" />
  <input name="email" type="email" required placeholder="Email" />
  <textarea name="message" required minlength="20"
            placeholder="Your message (at least 20 characters)"></textarea>
  <button type="submit">Send Message</button>
</form>

<!-- No JavaScript needed! The module handles everything. -->
```

---

## Pattern 3: Multi-Step Form with Draft Saving

```javascript
const steps = ['stepOne', 'stepTwo', 'stepThree'];
let currentStep = 0;
const formData  = {};

function saveCurrentStep() {
  // Save this step's values into our accumulator
  Object.assign(formData, Forms[steps[currentStep]].values);
  // Also persist to localStorage as a draft
  localStorage.setItem('formDraft', JSON.stringify(formData));
}

function nextStep() {
  const form = Forms[steps[currentStep]];
  const { isValid } = form.validate();
  if (!isValid) return; // Don't advance if current step has errors

  saveCurrentStep();
  currentStep++;
  // Show next step's form, hide current...
}

async function submitAll() {
  saveCurrentStep(); // Save last step

  const result = await fetch('/api/application', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  }).then(r => r.json());

  if (result.success) {
    localStorage.removeItem('formDraft');
    window.location.href = '/confirmation';
  }
}

// Restore draft on page load
const draft = localStorage.getItem('formDraft');
if (draft) {
  const saved = JSON.parse(draft);
  // Pre-fill the first step from the draft
  Forms[steps[0]].values = saved;
}
```

---

## Pattern 4: Inline Form Editing

Let users edit data inline on a profile page:

```javascript
let isEditing = false;
const originalValues = {};

function startEdit() {
  if (isEditing) return;
  isEditing = true;

  // Save the current values so we can cancel
  Object.assign(originalValues, Forms.profileForm.values);

  // Show editable inputs, hide display text
  document.querySelectorAll('.display-value').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'block');
}

function cancelEdit() {
  // Restore original values
  Forms.profileForm.values = originalValues;
  Forms.profileForm.clearValidation();
  isEditing = false;

  document.querySelectorAll('.display-value').forEach(el => el.style.display = 'block');
  document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'none');
}

async function saveEdit() {
  const { isValid } = Forms.profileForm.validate({
    displayName: { required: true, minLength: 2 },
    email:        { required: true, email: true }
  });

  if (!isValid) return;

  const result = await Forms.profileForm.submitData({
    url:    '/api/profile',
    method: 'PUT'
  });

  if (result.success) {
    isEditing = false;
    // Update display values from the saved data
    Object.entries(result.data).forEach(([key, value]) => {
      const display = document.querySelector(`.display-value[data-field="${key}"]`);
      if (display) display.textContent = value;
    });
  }
}
```

---

## Pattern 5: Search Form with Debounced Input

Using the Async module's `debounceInput` on a search form (requires `09_async` to be loaded):

```javascript
// Attach a debounced search handler
Forms.searchForm.debounceInput('[name="q"]', async (e) => {
  const query = e.target.value.trim();
  if (!query) return;

  const results = await AsyncHelpers.fetchJSON(`/api/search?q=${encodeURIComponent(query)}`);
  renderResults(results);
}, 400); // wait 400ms after user stops typing

// Sanitize input before searching (also from 09_async)
Forms.searchForm.debounceInput('[name="q"]', async (e) => {
  const clean = AsyncHelpers.sanitize(e.target.value);
  // ... use clean query
}, 400);
```

---

## Pattern 6: Dynamic Form with Plugin (addEnhancer)

Extend every form with a custom method using `addEnhancer`:

```javascript
// Register a plugin that adds a .isDirty() method to every form
Forms.addEnhancer(function(form) {
  // Store initial values when form is first enhanced
  const initialValues = JSON.stringify(form.values);

  form.isDirty = function() {
    return JSON.stringify(form.values) !== initialValues;
  };

  form.resetDirtyTracking = function() {
    // Update the baseline to current values
    Object.assign(initialValues, form.values);
  };

  return form;
});

// Now every form has .isDirty()
window.addEventListener('beforeunload', (e) => {
  if (Forms.articleForm.isDirty()) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
});
```

---

## Pattern 7: Server-Side Validation Error Display

When the server returns field-level errors, map them back to the form:

```javascript
await Forms.registrationForm.submitData({
  url: '/api/register',
  validate: false,  // we'll handle all validation on the server
  onError: (error) => {
    // If the server returns { fieldErrors: { email: 'Already in use' } }
    const serverErrors = error.fieldErrors;
    if (serverErrors) {
      // Manually trigger validation display using custom rules
      Forms.registrationForm.validate(
        Object.fromEntries(
          Object.entries(serverErrors).map(([field, message]) => [
            field,
            () => message  // return the server message as the error
          ])
        )
      );
    } else {
      // Generic error
      document.getElementById('submitError').textContent = error.message;
    }
  }
});
```

---

## Best Practices

### 1. Always Use `id` Attributes on Your Forms

The `Forms` proxy looks up forms by their `id`. Without an `id`, you can't use `Forms.myForm`:

```html
<!-- ✅ Has an id — accessible via Forms.loginForm -->
<form id="loginForm">...</form>

<!-- ❌ No id — not accessible via Forms proxy -->
<form>...</form>
```

### 2. Access Forms After DOMContentLoaded

```javascript
// ✅ Safe — DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const form = Forms.loginForm;
});

// ✅ Also safe — inside an event handler called after page load
document.getElementById('openBtn').addEventListener('click', () => {
  Forms.modalForm.reset();
});

// ⚠️ Be careful at module top-level — form may not exist yet
const form = Forms.loginForm; // could be null if DOM not ready
```

### 3. Let the Module Handle the Full Pipeline

Resist the urge to manually wire `fetch` — let `.submitData()` or the enhanced pipeline handle it:

```javascript
// ✅ Let the module handle it
await Forms.contactForm.submitData({ url: '/api/contact', ... });

// ❌ Manual wiring — misses validation, error handling, hooks
fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify(Forms.contactForm.values)
});
```

### 4. Use `.clearValidation()` Before Programmatic Submissions

When you're controlling submission outside of a user-click (like a timer auto-save), clear validation first to avoid stale error states:

```javascript
async function autoSave() {
  Forms.draftForm.clearValidation();   // clear any previous errors
  await Forms.draftForm.submitData({
    url:      '/api/drafts',
    validate: false  // auto-save — don't require valid data
  });
}
```

### 5. Prefer `data-enhanced` for Simple Forms

If your form just needs to POST to a URL and show a success message, the declarative approach is cleaner than writing JavaScript:

```html
<!-- ✅ Simple and clean -->
<form data-enhanced data-submit-url="/api/subscribe"
      data-success-message="Subscribed!" data-reset-on-success>
  <input name="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>
```

### 6. Handle the `cancelled` Case

When `beforeSubmit` returns `false`, the result has `cancelled: true` — not `success: false` with an error:

```javascript
const result = await Forms.myForm.submitData({
  beforeSubmit: async () => {
    if (!userConfirmed) return false;
  }
});

if (result.cancelled) {
  console.log('User cancelled — do nothing');
} else if (!result.success) {
  console.log('Real error:', result.error);
}
```

---

## Quick Reference: The Entire Forms API

```
Forms global:
  Forms.formId                → get/enhance a form by ID
  Forms.getAllForms()         → all forms on the page
  Forms.validateAll(rules)   → validate every form
  Forms.resetAll()           → reset every form
  Forms.addEnhancer(fn)      → register a plugin
  Forms.stats()              → cache statistics
  Forms.clear()              → clear the cache
  Forms.configure(opts)      → update module options

Per-form (Forms.formId):
  .values                    → get/set all values
  .getField(name)            → get field element
  .setField(name, val, opts) → set one field
  .validate(rules)           → validate + show errors
  .clearValidation()         → remove error state
  .serialize(format)         → object|json|formdata|urlencoded
  .submitData(options)       → async fetch submission
  .reset(options)            → reset + clear validation
  .update(object)            → form-aware update method
  .configure(opts)           → per-form config (with enhancement module)
  .connectReactive(form,opts)→ two-way reactive bridge (with enhancement module)

FormEnhancements global:
  FormEnhancements.submit(form, opts)   → enhanced submission
  FormEnhancements.configure(opts)      → global config
  FormEnhancements.validators           → validator factories
  Forms.validators / Forms.v            → same validator factories
```
