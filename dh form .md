# DOM Helpers — Form Module (`01_dh-form.js`)

> **Who is this for?**
> This guide is written for developers who know basic HTML and JavaScript — things like how to write a function, what an object is, and how HTML forms work. You do not need to know anything about frameworks or advanced JavaScript.

---

## Table of Contents

1. [What this module does](#1-what-this-module-does)
2. [Setup and load order](#2-setup-and-load-order)
3. [Your first form — a complete example](#3-your-first-form--a-complete-example)
4. [Accessing forms — the `Forms` proxy](#4-accessing-forms--the-forms-proxy)
5. [Reading and writing values — `form.values`](#5-reading-and-writing-values--formvalues)
6. [Updating a form — `form.update()`](#6-updating-a-form--formupdate)
7. [Validation — `form.validate()`](#7-validation--formvalidate)
8. [Resetting a form — `form.reset()`](#8-resetting-a-form--formreset)
9. [Working with individual fields](#9-working-with-individual-fields)
10. [Serializing form data — `form.serialize()`](#10-serializing-form-data--formserialize)
11. [Submitting a form — `form.submitData()`](#11-submitting-a-form--formsubmitdata)
12. [Utility methods on `Forms`](#12-utility-methods-on-forms)
13. [Configuration](#13-configuration)
14. [Complete real-world example](#14-complete-real-world-example)
15. [Common mistakes](#15-common-mistakes)
16. [Quick reference card](#16-quick-reference-card)

---

## 1. What this module does

HTML forms are one of the most common things you build on the web — contact forms, login pages, sign-up flows, checkout screens. The browser gives you raw `<form>` elements, but working with them in plain JavaScript is repetitive and verbose. Getting all field values requires looping through inputs. Setting values requires finding each field individually. Validation means writing the same checks over and over.

This module wraps your forms with helpful methods so you can:

- **Read all field values at once** — no more looping through inputs
- **Set all field values at once** — populate a form from a data object in one line
- **Validate fields** — built-in common rules plus custom rules you write yourself
- **Submit via fetch** — without the same `fetch()` boilerplate every time
- **Serialize data** — export form values in any format you need

It follows the same style as the rest of the DOM Helpers library. Just like `Elements.myButton` gives you an enhanced button, `Forms.myForm` gives you an enhanced form.

---

## 2. Setup and load order

### Required files

You must load `01_dh-core.js` first. The form module depends on it.

```html
<!-- 1. Core library — required -->
<script src="path/to/01_dh-core.js"></script>

<!-- 2. Form module -->
<script src="path/to/Form/01_dh-form.js"></script>

<!-- 3. Enhancement layer — optional, adds loading states, retry, and more -->
<script src="path/to/Form/02_dh-form-enhance.js"></script>
```

### Which path should I use?

| What I need | Scripts to load |
|---|---|
| Form utilities, no reactivity | `01_dh-core.js` → `01_dh-form.js` |
| Form utilities + submission features | `01_dh-core.js` → `01_dh-form.js` → `02_dh-form-enhance.js` |
| Reactive forms only | `01_dh-core.js` + reactive modules (no form module needed) |
| Both reactive + DOM form bridge | Reactive modules → `01_dh-form.js` → `02_dh-form-enhance.js` |

> **Rule of thumb:** If you do not need reactivity, do not load any reactive modules. These two form files work completely on their own.

### Your HTML form needs an `id`

The module finds forms by their `id` attribute. Always give your forms an id:

```html
<!-- ✅ Good -->
<form id="contactForm">...</form>

<!-- ❌ Won't work — no id -->
<form>...</form>
```

---

## 3. Your first form — a complete example

Here is a minimal working example to show you the whole picture before diving into details.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Contact Form</title>
</head>
<body>

  <form id="contactForm">
    <input type="text"  name="name"    placeholder="Your name">
    <input type="email" name="email"   placeholder="Your email">
    <textarea           name="message" placeholder="Your message"></textarea>
    <button type="submit">Send</button>
  </form>

  <script src="01_dh-core.js"></script>
  <script src="Form/01_dh-form.js"></script>
  <script>
    const form = Forms.contactForm;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Validate first
      const result = form.validate({
        name:    { required: true },
        email:   { required: true, email: true },
        message: { required: true, minLength: 10 }
      });

      if (!result.isValid) {
        return; // errors are already shown on the form
      }

      // Submit
      const response = await form.submitData({
        url:       '/api/contact',
        onSuccess: () => alert('Message sent!'),
        onError:   (err) => alert('Failed: ' + err.message)
      });
    });
  </script>

</body>
</html>
```

That is the whole pattern: access → validate → submit. Everything else in this guide is detail on each of those steps.

---

## 4. Accessing forms — the `Forms` proxy

`Forms` is a global object that gives you any form on your page by its `id`.

```js
// HTML: <form id="loginForm">
const form = Forms.loginForm;

// HTML: <form id="sign-up-form">
// Use bracket notation when the id contains hyphens or spaces
const signupForm = Forms['sign-up-form'];
```

### What happens when you access a form?

When you write `Forms.loginForm`, the module:

1. Finds `<form id="loginForm">` in the DOM
2. Adds the `.update()` method from the core DOM Helpers library
3. Adds all form-specific methods described in this guide
4. Stores the result in a cache so the next access is instant
5. Returns the enhanced form element

The form is still a real DOM element. It works exactly as before — you just have extra methods available on it.

### The cache is automatic

You never need to manage the cache yourself. If a form is removed from the DOM, the next time you access `Forms.myForm` the module fetches it fresh. If you add a form dynamically (inside a modal, for example), `Forms.myForm` will find it next time you access it.

```js
// Works even if the form was added after the script ran
setTimeout(() => {
  const form = Forms.dynamicForm; // finds it
}, 2000);
```

### Checking if a form exists

```js
const form = Forms.loginForm;

if (form) {
  console.log('Form found!');
} else {
  console.log('No form with that id');
}
```

---

## 5. Reading and writing values — `form.values`

`form.values` is the most-used feature in this module. It reads all your field values into a plain object or populates all your fields from an object — in one line each way.

### Reading all values

```js
const form = Forms.profileForm;
const data = form.values;

// data is a plain JavaScript object with one key per field name:
// {
//   firstName:  'Alice',
//   lastName:   'Smith',
//   email:      'alice@example.com',
//   age:        '28',
//   newsletter: true    ← checkboxes are true or false
// }

console.log(data.firstName); // 'Alice'
console.log(data.newsletter); // true
```

### How different field types are read

| Field type | Value returned |
|---|---|
| Text, email, number, textarea | The string the user typed |
| Checkbox (checked) | `true` |
| Checkbox (unchecked) | `false` |
| Radio button group | The `value` of the selected option |
| Select (single choice) | The `value` of the selected `<option>` |
| Select (multiple choice) | An array of selected values |
| Multiple fields with the same `name` | An array of values |

```html
<!-- Example: checkboxes sharing the same name -->
<input type="checkbox" name="colors" value="red">
<input type="checkbox" name="colors" value="blue">
<input type="checkbox" name="colors" value="green">
```

```js
// If "red" and "green" are checked:
console.log(Forms.myForm.values);
// { colors: ['red', 'green'] }
```

### Writing all values

Assign an object to `form.values` to populate the entire form at once:

```js
Forms.profileForm.values = {
  firstName:  'Bob',
  lastName:   'Jones',
  email:      'bob@example.com',
  newsletter: true
};
```

This is especially useful when you load user data from an API and want to pre-fill an edit form:

```js
async function openEditProfile(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const user     = await response.json();

  // Populate the form with the loaded data — one line
  Forms.profileForm.values = user;
}
```

### Suppressing change events when writing values

By default, writing to each field fires a `change` event on that field. This is useful when other code listens for changes. But sometimes you want to populate a form quietly without triggering those listeners:

```js
// Normal — fires 'change' on each field as it is set:
Forms.profileForm.values = userData;

// Silent — no 'change' events fired:
Forms.profileForm.update({ values: userData, silent: true });
```

---

## 6. Updating a form — `form.update()`

Every enhanced element in the DOM Helpers library has a `.update()` method. A form's version understands form-specific operations in addition to the standard DOM properties the core library handles.

Pass any combination of keys in one call:

```js
Forms.loginForm.update({
  // Form-specific keys:
  values:   { email: '', password: '' },  // set field values
  validate: { email: { required: true } }, // run validation
  reset:    true,                          // reset the form

  // Standard DOM keys still work too:
  style:     { border: '2px solid red' },
  classList: { add: ['highlighted'] }
});
```

### Form-specific keys understood by `.update()`

| Key | What it does |
|---|---|
| `values: { ... }` | Sets all field values from the object |
| `validate: true` | Runs validation with no custom rules |
| `validate: { rules }` | Runs validation with your custom rules |
| `reset: true` | Resets the form to its initial values |
| `reset: { clearCustom: false }` | Resets without removing error messages |
| `submit: true` | Submits the form (fire-and-forget, no options) |
| `submit: { ...options }` | Submits with options (fire-and-forget) |

### What is fire-and-forget?

`.update()` runs and returns instantly (it is synchronous). But submitting a form requires sending a network request, which takes time. When you use `submit` inside `.update()`, the submission starts in the background and `.update()` returns without waiting for it to finish. You handle the outcome through `onSuccess` and `onError` callbacks.

If you need to wait for the submission result in your code (for example, to redirect the page after success), call `form.submitData()` directly — it is `async` and returns a result you can `await`.

```js
// fire-and-forget through .update() — cannot await:
form.update({
  submit: {
    url:       '/api/save',
    onSuccess: (data) => console.log('Saved:', data)
  }
});

// await the result with submitData():
const result = await form.submitData({ url: '/api/save' });
if (result.success) {
  window.location.href = '/success';
}
```

---

## 7. Validation — `form.validate()`

Validation checks whether the user has filled in the form correctly before you do anything with the data.

The module runs two types of validation in order:

1. **Native HTML5 validation** — checks things like `required`, `type="email"`, `minlength` that are set directly in your HTML attributes
2. **Custom rules** — additional checks you define in JavaScript

```js
const result = form.validate(rules);

// result always looks like this:
// {
//   isValid: true or false,
//   errors:  { fieldName: 'error message here', ... },
//   values:  { fieldName: 'field value', ... }
// }
```

### No custom rules — HTML5 only

```js
const result = Forms.signupForm.validate();

if (result.isValid) {
  console.log('All good!');
} else {
  console.log('Errors:', result.errors);
  // { email: 'Please fill in this field.' }
}
```

### Custom rules — function style

Write a function for a field. Return an error string if invalid, or `null` if valid:

```js
const result = Forms.signupForm.validate({
  username: function(value) {
    if (!value)             return 'Username is required';
    if (value.length < 3)   return 'Must be at least 3 characters';
    if (value.includes(' ')) return 'No spaces allowed';
    return null; // valid!
  }
});
```

You can also use the shorter arrow function syntax:

```js
const result = Forms.signupForm.validate({
  username: (value) => {
    if (!value) return 'Required';
    if (value.length < 3) return 'Too short';
    return null;
  }
});
```

### Custom rules — object style (shorthand)

For the most common validation needs, use keyword rules in an object:

```js
const result = Forms.signupForm.validate({
  email: {
    required:  true,
    email:     true
  },
  password: {
    required:  true,
    minLength: 8,
    maxLength: 50
  },
  username: {
    required: true,
    pattern:  '^[a-zA-Z0-9_]+$'  // must match this regular expression
  },
  age: {
    required: true,
    custom: (value) => {
      return Number(value) >= 18 ? null : 'Must be 18 or older';
    }
  }
});
```

### Available rule keywords

| Keyword | Type | What it checks |
|---|---|---|
| `required: true` | boolean | Field must not be empty |
| `email: true` | boolean | Must be a valid email format |
| `minLength: 5` | number | Value must be at least 5 characters |
| `maxLength: 100` | number | Value must be no more than 100 characters |
| `pattern: '^[A-Z]'` | string | Value must match this regular expression |
| `custom: (value) => null` | function | Your own validation logic |

### Cross-field validation — comparing two fields

Your custom function also receives all form values as a second argument, so you can compare fields:

```js
const result = Forms.signupForm.validate({
  confirmPassword: (value, allValues) => {
    if (value !== allValues.password) {
      return 'Passwords do not match';
    }
    return null;
  }
});
```

### What happens visually when validation fails?

The module automatically:

- Adds a `form-invalid` CSS class to each invalid field
- Adds `aria-invalid="true"` to the field (for screen reader accessibility)
- Inserts a red error message `<div>` directly below each invalid field

You can style these in your CSS:

```css
.form-invalid {
  border-color: #dc3545;
}

.form-error-message {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.25rem;
}
```

### Clearing validation state

```js
form.clearValidation(); // removes all error messages and invalid states
```

---

## 8. Resetting a form — `form.reset()`

Resets all fields back to the values they had when the page loaded (or their `value` attributes in the HTML).

```js
Forms.contactForm.reset();
```

The enhanced `reset()` also:

- Clears all validation error messages and `form-invalid` classes automatically
- Fires a `formreset` custom event you can listen to

```js
// React to the reset
Forms.contactForm.addEventListener('formreset', function() {
  console.log('Form was reset!');
});

Forms.contactForm.reset();
```

### Keep validation messages after reset

If you want to reset the field values but keep the error messages visible:

```js
Forms.contactForm.reset({ clearCustom: false });
```

---

## 9. Working with individual fields

Sometimes you want to get or set just one specific field rather than the whole form.

### Getting a field element

```js
const emailInput = Forms.profileForm.getField('email');
// Returns the actual <input> DOM element

emailInput.focus();
console.log(emailInput.value);
```

### Setting a single field value

```js
Forms.profileForm.setField('email', 'new@email.com');
```

With the silent option:

```js
// Set without firing a 'change' event
Forms.profileForm.setField('email', 'new@email.com', { silent: true });
```

### When to use `setField` vs `form.values = { ... }`

- Use `form.values = { ... }` when you have a complete object and want to update multiple fields
- Use `form.setField()` when you only need to update one specific field and want to leave all others untouched

---

## 10. Serializing form data — `form.serialize()`

Converts form data into a specific format. Useful when you need to pass the data to something other than a standard `fetch` request.

### Object format (default)

```js
const data = Forms.checkoutForm.serialize();
// or:
const data = Forms.checkoutForm.serialize('object');

// Returns: { name: 'Alice', email: 'alice@example.com', total: '49.99' }
```

### JSON string

```js
const json = Forms.checkoutForm.serialize('json');
// Returns: '{"name":"Alice","email":"alice@example.com"}'

// Useful for storing in localStorage or sessionStorage:
localStorage.setItem('formDraft', json);

// Restore later:
const saved    = localStorage.getItem('formDraft');
Forms.myForm.values = JSON.parse(saved);
```

### FormData (for file uploads)

When your form includes a `<input type="file">`, you cannot send the data as JSON. Use `FormData` instead:

```js
const formData = Forms.uploadForm.serialize('formdata');
// Returns a FormData object

await fetch('/api/upload', {
  method: 'POST',
  body:   formData
  // Do NOT set a Content-Type header here — the browser sets it automatically
});
```

### URL-encoded string

```js
const encoded = Forms.searchForm.serialize('urlencoded');
// Returns: 'query=hello+world&category=news'

// Useful for appending to a URL:
window.location.href = `/search?${encoded}`;
```

---

## 11. Submitting a form — `form.submitData()`

Sends the form data to a server as JSON using `fetch`. Returns a result object you can check.

```js
const result = await Forms.contactForm.submitData({
  url: '/api/contact'
});

if (result.success) {
  console.log('Server response:', result.data);
} else {
  console.log('Something went wrong:', result.error);
}
```

### All options

```js
const result = await Forms.signupForm.submitData({

  // Where to send — defaults to the form's action attribute
  url: '/api/signup',

  // HTTP method — default is 'POST'
  method: 'POST',

  // Run validation before sending? — default is true
  // Set to false to skip validation and submit regardless
  validate: true,

  // Custom validation rules to check before submitting
  validationRules: {
    email:    { required: true, email: true },
    password: { required: true, minLength: 8 }
  },

  // Runs before the network request is sent
  // Return false to cancel the submission
  beforeSubmit: async (data, form) => {
    console.log('About to submit:', data);
    if (data.age < 18) {
      alert('You must be 18 or older');
      return false; // cancel!
    }
    // not returning false means "continue"
  },

  // Transform the data before sending it to the server
  // Useful for renaming fields or formatting values
  transform: (data) => {
    return {
      ...data,                          // spread all existing fields
      email:     data.email.toLowerCase(), // normalise email
      timestamp: Date.now()             // add a field
    };
  },

  // Called when the server responds with a success (2xx) status
  onSuccess: (serverResponse, dataSent) => {
    console.log('Server said:', serverResponse);
    window.location.href = '/thank-you';
  },

  // Called when anything goes wrong
  // error = Error object with a .message property
  // validationErrors = { fieldName: 'message' } if validate failed
  onError: (error, validationErrors) => {
    console.error('Failed:', error.message);
  }

});
```

### What the result object looks like

```js
// On success:
{ success: true,  data: { id: 123, message: 'Created' } }

// On validation failure (request never sent):
{ success: false, errors: { email: 'Required', password: 'Too short' } }

// On network or server error:
{ success: false, error: 'HTTP 500' }

// If beforeSubmit returned false:
{ success: false, cancelled: true }
```

### Submitting without validation

```js
// Skip validation — sends whatever is in the form
const result = await form.submitData({
  url:      '/api/draft',
  validate: false
});
```

### Transforming data before sending

Sometimes the shape of your form fields does not match what the server expects. Use `transform` to reshape the data:

```js
const result = await form.submitData({
  url: '/api/users',
  transform: (data) => {
    // Server expects 'firstName'/'lastName' but form has 'first_name'/'last_name'
    return {
      firstName: data.first_name,
      lastName:  data.last_name,
      email:     data.email
    };
  }
});
```

---

## 12. Utility methods on `Forms`

These methods work across all forms at once.

### `Forms.getAllForms()`

Returns an array of every `<form id="...">` on the page, each fully enhanced.

```js
const allForms = Forms.getAllForms();
console.log(allForms.length); // how many forms are on the page

allForms.forEach(function(form) {
  console.log(form.id, form.values);
});
```

### `Forms.validateAll(rules)`

Validates every form. Returns an object keyed by form id:

```js
const results = Forms.validateAll({
  loginForm: {
    email:    { required: true },
    password: { required: true }
  },
  contactForm: {
    name:    { required: true },
    message: { required: true, minLength: 5 }
  }
});

// results:
// {
//   loginForm:   { isValid: false, errors: { password: 'Required' }, values: { ... } },
//   contactForm: { isValid: true,  errors: {},                       values: { ... } }
// }

const allValid = Object.values(results).every(r => r.isValid);
```

### `Forms.resetAll()`

Resets every form on the page at once.

```js
// Useful when a modal closes, or a user clicks "Cancel"
Forms.resetAll();
```

### `Forms.stats()`

Shows internal performance information — useful for debugging.

```js
const stats = Forms.stats();
console.log(stats);
// {
//   hits:      12,    ← served from cache
//   misses:    3,     ← fetched from the DOM
//   cacheSize: 3,     ← currently cached
//   hitRate:   0.8    ← efficiency (0–1)
// }
```

### `Forms.clear()`

Clears the internal cache manually. The cache manages itself automatically, so you rarely need this.

```js
Forms.clear();
```

---

## 13. Configuration

Change module settings at runtime.

```js
Forms.configure({
  enableLogging:   true,   // print cache and warning messages to the console
  autoCleanup:     true,   // automatically remove stale cache entries (default: true)
  cleanupInterval: 60000,  // how often to clean up, in ms (default: 30000 = 30s)
  maxCacheSize:    200     // max cached forms (default: 500)
});
```

---

## 14. Complete real-world example

A sign-up form with validation, data transformation, and API submission.

```html
<form id="signupForm">
  <label>
    Username
    <input type="text" name="username" required>
  </label>

  <label>
    Email
    <input type="email" name="email" required>
  </label>

  <label>
    Password
    <input type="password" name="password" required minlength="8">
  </label>

  <label>
    Confirm Password
    <input type="password" name="confirmPassword" required>
  </label>

  <label>
    <input type="checkbox" name="terms">
    I agree to the Terms of Service
  </label>

  <button type="submit">Create Account</button>
</form>

<script src="01_dh-core.js"></script>
<script src="Form/01_dh-form.js"></script>
<script>

  const form = Forms.signupForm;

  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Step 1 — validate
    const validation = form.validate({
      username: {
        required:  true,
        minLength: 3,
        maxLength: 20,
        pattern:   '^[a-zA-Z0-9_]+$'
      },
      email: {
        required: true,
        email:    true
      },
      password: {
        required:  true,
        minLength: 8
      },
      confirmPassword: {
        required: true,
        custom: function(value, allValues) {
          if (value !== allValues.password) return 'Passwords do not match';
          return null;
        }
      },
      terms: {
        custom: function(value) {
          if (!value) return 'You must accept the Terms of Service';
          return null;
        }
      }
    });

    // Stop if invalid — errors are already shown on the form
    if (!validation.isValid) {
      return;
    }

    // Step 2 — submit
    const result = await form.submitData({
      url:    '/api/users/register',
      method: 'POST',

      // Remove confirmPassword before sending to server
      transform: function(data) {
        const { confirmPassword, ...rest } = data;
        return rest;
      },

      onSuccess: function(response) {
        alert('Welcome, ' + response.username + '! Account created.');
        window.location.href = '/dashboard';
      },

      onError: function(error) {
        alert('Sign-up failed: ' + error.message);
      }
    });

  });

</script>
```

---

## 15. Common mistakes

### Forgetting the `id` on the form

```html
<!-- ❌ Will not work -->
<form>...</form>

<!-- ✅ Works -->
<form id="myForm">...</form>
```

### Loading scripts in the wrong order

```html
<!-- ❌ Wrong — your code runs before the library loads -->
<script>
  const form = Forms.myForm; // ReferenceError
</script>
<script src="01_dh-core.js"></script>
<script src="Form/01_dh-form.js"></script>

<!-- ✅ Correct — library loads first -->
<script src="01_dh-core.js"></script>
<script src="Form/01_dh-form.js"></script>
<script>
  const form = Forms.myForm; // works
</script>
```

### Trying to `await` `.update({ submit })`

`.update()` is synchronous and returns immediately. Use `form.submitData()` when you need to wait for the result.

```js
// ❌ Wrong — update() is not async
const result = await form.update({ submit: { url: '/api' } });

// ✅ Correct
const result = await form.submitData({ url: '/api' });
```

### Forgetting `event.preventDefault()`

Without this, the browser sends the form the old way (full page reload) before your JavaScript runs.

```js
form.addEventListener('submit', async function(event) {
  event.preventDefault(); // always add this
  // ... rest of your code
});
```

### Using dot notation for ids with hyphens

JavaScript property names cannot contain hyphens. Use bracket notation instead.

```js
// ❌ Syntax error
const form = Forms.my-form;

// ✅ Correct
const form = Forms['my-form'];
```

---

## 16. Quick reference card

```js
// ── Access ─────────────────────────────────────────────────────────────────
const form = Forms.formId;
const form = Forms['form-with-hyphens'];

// ── Values ─────────────────────────────────────────────────────────────────
const data  = form.values;               // read all → plain object
form.values = { field: 'value', ... };   // write all from object

// ── Single field ───────────────────────────────────────────────────────────
const el = form.getField('name');        // get DOM element
form.setField('name', 'Alice');          // set one field
form.setField('name', 'Alice', { silent: true }); // no change event

// ── Update ─────────────────────────────────────────────────────────────────
form.update({
  values:   { ... },          // set values
  validate: { rules },        // validate with rules
  validate: true,             // validate, no custom rules
  reset:    true,             // reset form
  submit:   { url, ... },     // submit (fire-and-forget)
  style:    { ... },          // any DOM property works too
});

// ── Validate ───────────────────────────────────────────────────────────────
const { isValid, errors, values } = form.validate({
  field: { required, email, minLength, maxLength, pattern, custom }
  field: (value, allValues) => errorMessage || null  // function style
});
form.clearValidation();

// ── Reset ──────────────────────────────────────────────────────────────────
form.reset();
form.reset({ clearCustom: false });    // keep error messages

// ── Serialize ──────────────────────────────────────────────────────────────
form.serialize()              // → plain object (default)
form.serialize('json')        // → JSON string
form.serialize('formdata')    // → FormData (for file uploads)
form.serialize('urlencoded')  // → 'key=value&key=value'

// ── Submit ─────────────────────────────────────────────────────────────────
const result = await form.submitData({
  url, method,
  validate, validationRules,
  beforeSubmit, transform,
  onSuccess, onError
});
// result: { success, data? } | { success, errors? } | { success, error? }

// ── Global utilities ───────────────────────────────────────────────────────
Forms.getAllForms()          // array of all enhanced forms
Forms.validateAll(rules)    // { formId: result, ... }
Forms.resetAll()            // reset every form
Forms.stats()               // cache info
Forms.clear()               // clear the cache
Forms.configure({ ... })    // update settings
```