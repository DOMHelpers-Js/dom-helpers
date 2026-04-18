[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reading and Writing Form Values

## Quick Start (30 seconds)

```javascript
// Read all values at once
const data = Forms.signupForm.values;
// → { username: 'alice', email: 'alice@example.com', newsletter: true }

// Write all values at once
Forms.signupForm.values = {
  username: 'bob',
  email:    'bob@example.com'
};

// Read a single field element
const emailField = Forms.signupForm.getField('email');

// Write a single field value
Forms.signupForm.setField('email', 'new@example.com');
```

---

## What Is `.values`?

`.values` is a **getter/setter property** on every enhanced form. It reads or writes all field values as a plain JavaScript object — one key per field name.

Think of it as a **snapshot** of the entire form. Reading `.values` gives you all the data. Writing to `.values` fills in all the fields.

```javascript
// Reading: takes a snapshot
const snapshot = Forms.checkoutForm.values;
// → { name: 'Alice', address: '123 Main St', qty: '2', gift: false }

// Writing: restores from a snapshot
Forms.checkoutForm.values = {
  name:    'Bob',
  address: '456 Oak Ave',
  qty:     '1',
  gift:    true
};
```

---

## Why Does This Exist?

### Reading Values with Plain JavaScript

Without `.values`, you need to query each field individually:

```javascript
const form = document.getElementById('checkoutForm');

// You must know every field name in advance
const name    = form.querySelector('[name="name"]').value;
const address = form.querySelector('[name="address"]').value;
const qty     = form.querySelector('[name="qty"]').value;
const gift    = form.querySelector('[name="gift"]').checked;

const data = { name, address, qty, gift };
```

**Problems:**
❌ One querySelector per field — tedious and repetitive
❌ Checkboxes need `.checked`, text inputs need `.value` — inconsistent
❌ Multi-select fields need special handling
❌ Radio groups need looping to find the selected value
❌ If you add a new field, you must remember to add it here too

### Reading Values with `.values`

```javascript
const data = Forms.checkoutForm.values;
// → { name: 'Alice', address: '...', qty: '2', gift: true }
```

✅ One line for any number of fields
✅ Handles checkboxes, radios, selects, textareas automatically
✅ New fields are picked up automatically — no code changes needed

---

## How `.values` Works Internally

Reading `.values` uses the browser's `FormData` API under the hood, which already knows how to read every field type correctly:

```
form.values (get)
     ↓
new FormData(form)  ← browser knows all field types
     ↓
Iterates all entries
     ↓
Groups duplicate names into arrays (for multi-selects)
     ↓
Adds unchecked checkboxes as false (FormData omits them)
     ↓
Returns plain object: { fieldName: value, ... }
```

**Special cases handled automatically:**

| Field type | What `.values` returns |
|---|---|
| Text, email, number, textarea | String value |
| Checkbox (checked) | `"on"` or the checkbox's value |
| Checkbox (unchecked) | `false` |
| Radio group | The selected value (or absent if none selected) |
| Select (single) | The selected option's value |
| Select (multiple) | Array of selected values |
| Multiple fields with same name | Array of values |

---

## Basic Usage: Reading Values

### Simple Text Form

```html
<form id="profileForm">
  <input name="firstName" value="Alice" />
  <input name="lastName"  value="Smith" />
  <input name="age"       value="30" type="number" />
</form>
```

```javascript
const data = Forms.profileForm.values;
console.log(data);
// → { firstName: 'Alice', lastName: 'Smith', age: '30' }

// Note: all values come back as strings (that's how HTML forms work)
// Convert numbers yourself if needed
const age = parseInt(data.age, 10); // → 30
```

### Checkboxes and Radios

```html
<form id="prefsForm">
  <input name="newsletter" type="checkbox" checked />
  <input name="darkMode"   type="checkbox" />

  <input name="theme" type="radio" value="light" checked />
  <input name="theme" type="radio" value="dark" />
</form>
```

```javascript
const data = Forms.prefsForm.values;
console.log(data);
// → { newsletter: 'on', darkMode: false, theme: 'light' }
//    ↑ checked        ↑ unchecked = false  ↑ selected radio
```

### Multi-Select

```html
<form id="filterForm">
  <select name="categories" multiple>
    <option value="news"   selected>News</option>
    <option value="sports" selected>Sports</option>
    <option value="tech">Tech</option>
  </select>
</form>
```

```javascript
const data = Forms.filterForm.values;
console.log(data.categories); // → ['news', 'sports']
```

---

## Basic Usage: Writing Values

### Setting Multiple Fields

```javascript
Forms.profileForm.values = {
  firstName: 'Bob',
  lastName:  'Jones',
  age:       '25'
};
// All three fields are updated in the form
```

### Setting Checkboxes

```javascript
Forms.prefsForm.values = {
  newsletter: true,   // checkbox becomes checked
  darkMode:   false   // checkbox becomes unchecked
};
```

### Setting a Radio Group

```javascript
Forms.prefsForm.values = {
  theme: 'dark'   // the "dark" radio button gets selected
};
```

### Setting a Multi-Select

```javascript
Forms.filterForm.values = {
  categories: ['news', 'tech']   // these two options get selected
};
```

### Partial Updates (Only Some Fields)

Writing to `.values` only updates fields whose names are in the object. Fields not mentioned are left untouched:

```javascript
// Only update the email — other fields stay as they are
Forms.profileForm.values = { email: 'new@example.com' };
```

### Silent Mode (No Change Events)

By default, setting values fires a `change` event on each field — so any event listeners you've attached will fire. If you want to bulk-set values silently:

```javascript
// Use setField with silent option for no change events
Forms.profileForm.setField('email', 'new@example.com', { silent: true });
```

---

## `.getField()` — Find a Single Field Element

`getField(name)` returns the actual DOM element for a named field. This is useful when you want to work with the field itself — focus it, read its attributes, or add a class.

```javascript
const emailField = Forms.loginForm.getField('email');

// Now you have the raw DOM element
emailField.focus();
emailField.classList.add('highlight');
console.log(emailField.placeholder); // → 'Enter your email'
```

**How it looks up the field:**
1. First tries `form.querySelector('[name="fieldName"]')`
2. Falls back to `form.querySelector('#fieldName')` (by ID)
3. Returns `null` if not found

```javascript
// By name attribute
const field = Forms.myForm.getField('username');

// Falls back to ID if no name match
// <input id="username" />  ← no name attribute
const fieldById = Forms.myForm.getField('username'); // finds by id
```

---

## `.setField()` — Set a Single Field's Value

`setField(name, value, options)` updates one specific field and fires a `change` event (unless silent mode is used):

```javascript
// Set a text field
Forms.profileForm.setField('username', 'alice');

// Set a checkbox
Forms.profileForm.setField('newsletter', true);

// Set a radio (selects the option matching the value)
Forms.profileForm.setField('plan', 'premium');

// Set without firing change events
Forms.profileForm.setField('email', 'alice@example.com', { silent: true });

// All setField calls return the form for chaining
Forms.profileForm
  .setField('firstName', 'Alice')
  .setField('lastName', 'Smith')
  .setField('email', 'alice@example.com');
```

---

## Using `.update()` to Set Values

The form-aware `.update()` method accepts a `values` key to set field values as part of a broader update:

```javascript
// Set values AND update other DOM properties in one call
Forms.profileForm.update({
  values: { name: 'Alice', email: 'alice@example.com' },
  text:   'Profile updated'  // also updates the form's text content
});
```

---

## Real-World Example: Pre-Fill an Edit Form

A common pattern is loading saved data from a server and pre-filling an edit form:

```javascript
async function openEditModal(userId) {
  // Fetch the user's current data
  const user = await fetch(`/api/users/${userId}`).then(r => r.json());

  // Pre-fill the form instantly
  Forms.editUserForm.values = {
    username:  user.username,
    email:     user.email,
    role:      user.role,
    active:    user.active,
    newsletter: user.preferences.newsletter
  };

  // Open the modal
  document.getElementById('editModal').style.display = 'block';
}
```

---

## Real-World Example: Save and Restore Form State

You can use `.values` as a simple draft-saving mechanism:

```javascript
// Save draft to localStorage
function saveDraft() {
  const data = Forms.articleForm.values;
  localStorage.setItem('articleDraft', JSON.stringify(data));
}

// Restore draft
function restoreDraft() {
  const saved = localStorage.getItem('articleDraft');
  if (saved) {
    Forms.articleForm.values = JSON.parse(saved);
  }
}

// Auto-save every 30 seconds
setInterval(saveDraft, 30000);
```

---

## Common Pitfall: Values Are Always Strings

HTML form fields always return string values. Even a number input returns a string:

```html
<input name="age" type="number" value="25" />
```

```javascript
const data = Forms.myForm.values;
console.log(typeof data.age); // → 'string'
console.log(data.age);        // → '25'  (not 25)

// Convert yourself when needed
const age = parseInt(data.age, 10); // → 25 (number)
```

---

## Summary

| What you want | How to do it |
|---|---|
| Read all fields | `Forms.myForm.values` |
| Write all fields | `Forms.myForm.values = { ... }` |
| Find a field element | `Forms.myForm.getField('fieldName')` |
| Set one field | `Forms.myForm.setField('fieldName', value)` |
| Set silently | `Forms.myForm.setField('name', val, { silent: true })` |
| Set + update DOM | `Forms.myForm.update({ values: { ... } })` |
