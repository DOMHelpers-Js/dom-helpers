[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# DOM Binding, Event Handling, and API Reference

Reactive forms include built-in methods for connecting to HTML inputs — binding values, handling events, and keeping the UI in sync.

---

## DOM Binding Methods

### .bindToInputs(selector)

Automatically connects the form to HTML input elements. Sets initial values and adds event listeners for `input` and `blur` events.

```html
<form id="myForm">
  <input type="text" name="username" />
  <input type="email" name="email" />
  <input type="password" name="password" />
  <input type="checkbox" name="remember" />
</form>
```

```javascript
const form = Forms.create(
  { username: '', email: '', password: '', remember: false },
  {
    validators: {
      username: Forms.v.required('Username is required'),
      email: Forms.v.email('Invalid email')
    }
  }
);

// Bind to all inputs inside the form
form.bindToInputs('#myForm input');
```

**What happens when you call `.bindToInputs()`:**

```
form.bindToInputs('#myForm input')
   ↓
1️⃣ Finds all matching elements (querySelectorAll)
   ↓
2️⃣ For each input:
   ├── Gets the field name from input.name or input.id
   ├── Sets the initial value:
   │   ├── Checkbox → input.checked = form.values[field]
   │   └── Other    → input.value = form.values[field]
   ├── Adds 'input' event listener → calls handleChange
   └── Adds 'blur' event listener  → calls handleBlur
   ↓
3️⃣ Returns the form (for chaining)
```

**You can also pass DOM elements directly:**

```javascript
const inputs = document.querySelectorAll('.form-field');
form.bindToInputs(inputs);
```

**Key detail:** The field name comes from the input's `name` attribute. If no `name` is set, it falls back to `id`. If neither exists, the input is skipped.

---

## Event Handlers

### .handleChange(event)

Handles input change events. Reads the field name and value from the event target, then calls `.setValue()`.

```javascript
const input = document.getElementById('emailInput');

input.addEventListener('input', (e) => {
  form.handleChange(e);
});
```

**What happens inside:**

```
form.handleChange(event)
   ↓
1️⃣ Gets the target element from event.target
   ↓
2️⃣ Gets the field name: target.name || target.id
   ↓
3️⃣ Gets the value:
   ├── Checkbox → target.checked (boolean)
   └── Other    → target.value (string)
   ↓
4️⃣ Calls this.setValue(field, value)
   → which sets the value, marks touched, and auto-validates
```

**Checkboxes are handled automatically** — the method checks `target.type === 'checkbox'` and reads `target.checked` instead of `target.value`.

---

### .handleBlur(event)

Handles blur events (when a user leaves a field). Marks the field as touched and validates it.

```javascript
const input = document.getElementById('emailInput');

input.addEventListener('blur', (e) => {
  form.handleBlur(e);
});
```

**What happens inside:**

```
form.handleBlur(event)
   ↓
1️⃣ Gets the field name: target.name || target.id
   ↓
2️⃣ Calls this.setTouched(field)
   ↓
3️⃣ Validator exists for field?
   ├── YES → calls this.validateField(field)
   └── NO  → skip
```

**Why blur matters:** Blur is when a user clicks or tabs away from a field. This is the natural moment to validate — the user has finished typing and you can check what they entered.

---

### .getFieldProps(field)

Returns an object with all the properties and event handlers you need to bind to an input. This is useful when you're building UI programmatically.

```javascript
const props = form.getFieldProps('email');
console.log(props);
// {
//   name: 'email',
//   value: '',
//   onChange: (e) => form.handleChange(e),
//   onBlur: (e) => form.handleBlur(e)
// }
```

**Using it to set up an input:**

```javascript
const input = document.createElement('input');
const props = form.getFieldProps('email');

input.name = props.name;
input.value = props.value;
input.addEventListener('input', props.onChange);
input.addEventListener('blur', props.onBlur);
```

---

## Putting It All Together: A Complete Form with DOM Binding

```html
<form id="contactForm">
  <div>
    <label for="name">Name</label>
    <input type="text" name="name" id="name" />
    <span id="nameError" class="error"></span>
  </div>

  <div>
    <label for="email">Email</label>
    <input type="email" name="email" id="email" />
    <span id="emailError" class="error"></span>
  </div>

  <div>
    <label for="message">Message</label>
    <textarea name="message" id="message"></textarea>
    <span id="messageError" class="error"></span>
  </div>

  <button type="submit" id="submitBtn">Send</button>
</form>
```

```javascript
const form = Forms.create(
  { name: '', email: '', message: '' },
  {
    validators: {
      name: Forms.v.required('Name is required'),
      email: Forms.v.combine(
        Forms.v.required('Email is required'),
        Forms.v.email('Invalid email')
      ),
      message: Forms.v.combine(
        Forms.v.required('Message is required'),
        Forms.v.minLength(10, 'At least 10 characters')
      )
    },
    onSubmit: async (values) => {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
    }
  }
);

// Step 1: Bind to all inputs
form.bindToInputs('#contactForm input, #contactForm textarea');

// Step 2: Show errors reactively
['name', 'email', 'message'].forEach(field => {
  ReactiveUtils.effect(() => {
    const errorEl = document.getElementById(`${field}Error`);
    if (form.shouldShowError(field)) {
      errorEl.textContent = form.getError(field);
      errorEl.style.display = 'inline';
    } else {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  });
});

// Step 3: Disable button when invalid or submitting
ReactiveUtils.effect(() => {
  const btn = document.getElementById('submitBtn');
  btn.disabled = !form.isValid || form.isSubmitting;
  btn.textContent = form.isSubmitting ? 'Sending...' : 'Send';
});

// Step 4: Handle form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const result = await form.submit();
  if (result.success) {
    alert('Message sent!');
    form.reset();
  }
});
```

**The flow:**

```
User types in "name" input
   ↓
'input' event fires → form.handleChange(e)
   ↓
form.setValue('name', 'Alice')
   ↓
value stored, field touched, validator runs
   ↓
Effects re-run → error message updates, button state updates

User clicks away from "email" input
   ↓
'blur' event fires → form.handleBlur(e)
   ↓
field marked as touched, validator runs
   ↓
Effects re-run → error becomes visible (shouldShowError = true)

User clicks "Send"
   ↓
form.submit() → touchAll → validate → onSubmit
   ↓
All errors become visible, form submits if valid
```

---

## Complete API Reference

### Factory Functions

| Function | Available on | Description |
|----------|-------------|-------------|
| `create(values, options)` | `Forms` | Create a reactive form |
| `form(values, options)` | `Forms`, `ReactiveUtils` | Alias for `create` |
| `createForm(values, options)` | `ReactiveUtils` | Alias for `create` |

### Also available on

```javascript
ReactiveState.form(values, options)  // If ReactiveState is loaded
```

### Options Object

| Property | Type | Description |
|----------|------|-------------|
| `validators` | Object | `{ fieldName: validatorFn }` |
| `onSubmit` | Function | Default submit handler `(values, form) => {}` |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `.values` | Object | Current field values |
| `.errors` | Object | Current error messages |
| `.touched` | Object | Which fields have been interacted with |
| `.isSubmitting` | Boolean | `true` during submission |
| `.submitCount` | Number | Number of successful submissions |

### Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `.isValid` | Boolean | `true` if no errors exist |
| `.isDirty` | Boolean | `true` if any field has been touched |
| `.hasErrors` | Boolean | `true` if any error message exists |
| `.touchedFields` | Array | List of touched field names |
| `.errorFields` | Array | List of field names with errors |

### Value Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `.setValue(field, value)` | Form | Set value, touch, auto-validate |
| `.setValues({ field: value })` | Form | Set multiple values (batched) |
| `.getValue(field)` | Value | Get a field's current value |

### Error Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `.setError(field, msg)` | Form | Set an error (falsy to clear) |
| `.setErrors({ field: msg })` | Form | Set multiple errors (batched) |
| `.clearError(field)` | Form | Clear one field's error |
| `.clearErrors()` | Form | Clear all errors |
| `.hasError(field)` | Boolean | Check if field has an error |
| `.getError(field)` | String/null | Get a field's error message |

### Touched Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `.setTouched(field, flag?)` | Form | Mark field as touched/untouched |
| `.setTouchedFields([fields])` | Form | Touch multiple fields (batched) |
| `.touchAll()` | Form | Touch all fields |
| `.isTouched(field)` | Boolean | Check if field was touched |

### Validation Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `.validateField(field)` | Boolean | Validate one field |
| `.validate()` | Boolean | Validate all fields (batched) |

### Submission

| Method | Returns | Description |
|--------|---------|-------------|
| `.submit(handler?)` | Promise | Full submit flow |
| `.shouldShowError(field)` | Boolean | touched AND has error |

### Reset Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `.reset(newValues?)` | Form | Reset entire form |
| `.resetField(field)` | Form | Reset a single field |

### DOM Integration

| Method | Returns | Description |
|--------|---------|-------------|
| `.handleChange(event)` | — | Handle input/change events |
| `.handleBlur(event)` | — | Handle blur events |
| `.getFieldProps(field)` | Object | Get name, value, onChange, onBlur |
| `.bindToInputs(selector)` | Form | Auto-bind to HTML inputs |

### Utility

| Method | Returns | Description |
|--------|---------|-------------|
| `.toObject()` | Object | Plain snapshot of form state |

### Built-in Validators

| Validator | Factory | Description |
|-----------|---------|-------------|
| `required(msg?)` | `Forms.v.required()` | Not empty/null/whitespace |
| `email(msg?)` | `Forms.v.email()` | Valid email format |
| `minLength(n, msg?)` | `Forms.v.minLength()` | At least n characters |
| `maxLength(n, msg?)` | `Forms.v.maxLength()` | At most n characters |
| `min(n, msg?)` | `Forms.v.min()` | Number >= n |
| `max(n, msg?)` | `Forms.v.max()` | Number <= n |
| `pattern(regex, msg?)` | `Forms.v.pattern()` | Matches regex |
| `match(field, msg?)` | `Forms.v.match()` | Equals another field's value |
| `custom(fn)` | `Forms.v.custom()` | Custom validation logic |
| `combine(...fns)` | `Forms.v.combine()` | Chain validators (first error wins) |

### Validator Access

```javascript
Forms.validators       // Full name
Forms.v                // Shorthand
ReactiveUtils.validators  // Also available
```

### Inherited Instance Methods

Since forms are built on reactive state, they inherit all reactive instance methods:

| Method | Description |
|--------|-------------|
| `.$computed(key, fn)` | Add a computed property |
| `.$watch(key, callback)` | Watch a property for changes |
| `.$batch(fn)` | Batch multiple changes |
| `.$update(updates)` | Update multiple properties |
| `.$set(key, value)` | Set a property |
| `.$bind(el, bindings)` | Bind to a DOM element |
| `.$notify(key)` | Manually trigger effects for a key |
| `.$raw` | Access the raw (unproxied) data |

---

## Load Order

```html
<!-- 1. DOMHelpers Core (optional) -->
<script src="01_dh-elements.js"></script>

<!-- 2. Reactive State (required) -->
<script src="04_reactive/01_dh-reactive.js"></script>

<!-- 3. Array Patch (recommended) -->
<script src="04_reactive/02_dh-reactive-array-patch.js"></script>

<!-- 4. Forms Extension -->
<script src="04_reactive/04_dh-reactive-form.js"></script>
```

**Order matters:** `01_dh-reactive.js` must load first — it provides `ReactiveUtils.state()` and `batch()` that forms depend on.

---

## Congratulations!

You've completed the Reactive Form learning path. You now understand:

- ✅ What reactive forms are and why they exist
- ✅ How forms manage values, errors, touched status, and submission
- ✅ Every form method in detail
- ✅ All 10 built-in validators and how to combine them
- ✅ Real-world patterns for login, registration, contact, and multi-step forms
- ✅ DOM binding with `.bindToInputs()`, event handlers, and `.getFieldProps()`
- ✅ The complete API reference

**Your reactive forms are ready for production!**