[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Form Methods Deep Dive

Every method available on a reactive form, explained with examples.

---

## Value Methods

These methods get and set field values.

---

### .setValue(field, value)

Sets a single field's value, marks it as touched, and auto-validates if a validator exists.

```javascript
const form = Forms.create(
  { name: '', age: '' },
  {
    validators: {
      name: Forms.v.required('Name is required')
    }
  }
);

form.setValue('name', 'Alice');
// 1. form.values.name = 'Alice'
// 2. form.touched.name = true
// 3. Validator runs: required('Alice') → null (no error)

form.setValue('age', '30');
// 1. form.values.age = '30'
// 2. form.touched.age = true
// 3. No validator for 'age' → skips validation
```

**Returns:** the form (for chaining)

```javascript
form
  .setValue('name', 'Alice')
  .setValue('email', 'alice@example.com');
```

**What happens inside:**

```
form.setValue('name', 'Alice')
   ↓
1️⃣ this.values['name'] = 'Alice'
   ↓
2️⃣ this.touched['name'] = true
   ↓
3️⃣ Validator exists for 'name'?
   ├── YES → call this.validateField('name')
   └── NO  → skip
   ↓
4️⃣ Return this
```

---

### .setValues(values)

Sets multiple field values at once. Uses batching so effects run only once.

```javascript
form.setValues({
  name: 'Alice',
  email: 'alice@example.com',
  age: '30'
});
```

**Returns:** the form (for chaining)

**How it differs from calling .setValue() multiple times:**

```javascript
// Without batching — effects run 3 times
form.setValue('name', 'Alice');
form.setValue('email', 'alice@example.com');
form.setValue('age', '30');

// With batching — effects run once
form.setValues({
  name: 'Alice',
  email: 'alice@example.com',
  age: '30'
});
```

`.setValues()` wraps the changes in a `batch()` call, so the UI updates only once after all values are set.

---

### .getValue(field)

Returns the current value of a field.

```javascript
form.setValue('name', 'Alice');

console.log(form.getValue('name'));  // 'Alice'

// Same as:
console.log(form.values.name);      // 'Alice'
```

**Returns:** the field value

---

## Error Methods

These methods manage error messages per field.

---

### .setError(field, error)

Manually sets an error message on a field. Pass a falsy value to clear it.

```javascript
// Set an error
form.setError('email', 'This email is already taken');
console.log(form.errors.email);  // 'This email is already taken'

// Clear an error (pass null, undefined, or empty string)
form.setError('email', null);
console.log(form.errors.email);  // undefined
```

**Returns:** the form (for chaining)

This is useful for **server-side errors** that come back after submission:

```javascript
const result = await form.submit(async (values) => {
  const response = await fetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(values)
  });
  const data = await response.json();

  if (data.error === 'email_taken') {
    form.setError('email', 'This email is already registered');
  }
});
```

---

### .setErrors(errors)

Sets multiple errors at once (batched).

```javascript
form.setErrors({
  name: 'Name is too short',
  email: 'Invalid email format'
});
```

**Returns:** the form (for chaining)

---

### .clearError(field)

Removes the error message from a single field.

```javascript
form.setError('email', 'Invalid email');
console.log(form.hasError('email'));  // true

form.clearError('email');
console.log(form.hasError('email'));  // false
```

**Returns:** the form (for chaining)

---

### .clearErrors()

Removes all error messages from the form.

```javascript
form.setErrors({ name: 'Error 1', email: 'Error 2' });
console.log(form.hasErrors);  // true

form.clearErrors();
console.log(form.hasErrors);  // false
console.log(form.errors);     // {}
```

**Returns:** the form (for chaining)

---

### .hasError(field)

Checks if a specific field has an error.

```javascript
form.setError('email', 'Invalid');

console.log(form.hasError('email'));  // true
console.log(form.hasError('name'));   // false
```

**Returns:** `true` or `false`

---

### .getError(field)

Returns the error message for a field, or `null` if there's no error.

```javascript
form.setError('email', 'Invalid email');

console.log(form.getError('email'));  // 'Invalid email'
console.log(form.getError('name'));   // null
```

**Returns:** the error string or `null`

---

## Touched Methods

These methods track which fields the user has interacted with. Touched status is important for knowing **when** to display errors — you typically don't want to show an error before the user has even seen the field.

---

### .setTouched(field, touched?)

Marks a field as touched (or untouched).

```javascript
form.setTouched('email');
console.log(form.isTouched('email'));  // true

// Unmark a field
form.setTouched('email', false);
console.log(form.isTouched('email'));  // false
```

**Returns:** the form (for chaining)

---

### .setTouchedFields(fields)

Marks multiple fields as touched at once (batched).

```javascript
form.setTouchedFields(['name', 'email', 'password']);

console.log(form.isTouched('name'));     // true
console.log(form.isTouched('email'));    // true
console.log(form.isTouched('password')); // true
```

**Returns:** the form (for chaining)

---

### .touchAll()

Marks every field in the form as touched.

```javascript
const form = Forms.create({ name: '', email: '', password: '' });

form.touchAll();

console.log(form.touched);
// { name: true, email: true, password: true }
```

**Returns:** the form (for chaining)

This is called automatically by `.submit()` so that all errors become visible before the user sees the result.

---

### .isTouched(field)

Checks if a specific field has been touched.

```javascript
console.log(form.isTouched('email'));  // false

form.setValue('email', 'test@test.com');
console.log(form.isTouched('email'));  // true (setValue auto-touches)
```

**Returns:** `true` or `false`

---

## Validation Methods

---

### .validateField(field)

Runs the validator for a single field. Stores or clears the error automatically.

```javascript
const form = Forms.create(
  { email: '' },
  {
    validators: {
      email: Forms.v.email('Invalid email')
    }
  }
);

form.values.email = 'bad-email';  // Set directly (no auto-validate)

const isValid = form.validateField('email');
console.log(isValid);              // false
console.log(form.errors.email);   // 'Invalid email'
```

**Returns:** `true` if valid, `false` if invalid

**What happens inside:**

```
form.validateField('email')
   ↓
1️⃣ Gets the validator for 'email'
   ↓
2️⃣ Calls: validator(this.values.email, this.values)
   │         ↑ field value       ↑ all values (for cross-field validation)
   ↓
3️⃣ Result is an error string?
   ├── YES → this.errors.email = error, return false
   └── NO  → delete this.errors.email, return true
```

**Note:** If no validator exists for the field, `.validateField()` returns `true` (no validation = always valid).

---

### .validate()

Runs all validators at once. Returns whether the entire form is valid.

```javascript
const form = Forms.create(
  { name: '', email: '' },
  {
    validators: {
      name: Forms.v.required('Name required'),
      email: Forms.v.required('Email required')
    }
  }
);

const isValid = form.validate();
console.log(isValid);          // false
console.log(form.errors.name); // 'Name required'
console.log(form.errors.email);// 'Email required'
```

**Returns:** `true` if ALL validators pass, `false` if any fail

The method is batched, so effects run only once after all validators complete.

---

## Submission

---

### .submit(handler?)

The complete form submission flow. Validates, manages loading state, and calls the handler.

```javascript
const form = Forms.create(
  { email: '', password: '' },
  {
    validators: {
      email: Forms.v.required('Email required'),
      password: Forms.v.required('Password required')
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      return response.json();
    }
  }
);

form.setValue('email', 'alice@example.com');
form.setValue('password', 'secret123');

const result = await form.submit();
// result: { success: true, result: { token: '...' } }
```

**Returns:** a Promise that resolves to:
- `{ success: true, result: ... }` — if validation passes and handler succeeds
- `{ success: false, errors: {...} }` — if validation fails
- `{ success: false, error: ... }` — if the handler throws an error

**The full flow:**

```
form.submit()
   ↓
1️⃣ this.touchAll()  → marks every field as touched
   ↓
2️⃣ this.validate()  → runs all validators
   ↓
3️⃣ Valid?
   ├── NO  → return { success: false, errors: this.errors }
   │
   └── YES ↓
4️⃣ this.isSubmitting = true
   ↓
5️⃣ await handler(this.values, this)
   ↓
6️⃣ Success?
   ├── YES → this.submitCount++
   │         this.isSubmitting = false
   │         return { success: true, result: ... }
   │
   └── ERROR → this.isSubmitting = false
               return { success: false, error: ... }
```

**Using a custom handler (overriding onSubmit):**

```javascript
// The onSubmit in options is the default handler
// But you can pass a different one to .submit()
const result = await form.submit(async (values) => {
  // This handler runs instead of the default onSubmit
  return await saveToDatabase(values);
});
```

---

### .shouldShowError(field)

Returns `true` only when a field is **both touched and has an error**. This is the recommended way to control error visibility in the UI.

```javascript
// Field not touched yet — don't show error
console.log(form.shouldShowError('email'));  // false

// User touches the field (types and leaves it empty)
form.setValue('email', '');
// Now touched = true, and validator says 'Email required'
console.log(form.shouldShowError('email'));  // true
```

**Returns:** `true` or `false`

**Why this matters:**

```
Before user interaction:
  touched: false, error: exists → shouldShowError: false ✅ (don't annoy user)

After user interaction:
  touched: true, error: exists  → shouldShowError: true  ✅ (show the problem)

After user fixes it:
  touched: true, error: none    → shouldShowError: false ✅ (problem solved)
```

---

## Reset Methods

---

### .reset(newValues?)

Resets the entire form. Clears errors, touched status, and sets values back to initial (or new values).

```javascript
const form = Forms.create({ name: '', email: '' });

form.setValue('name', 'Alice');
form.setValue('email', 'alice@example.com');
form.setError('email', 'Taken');

// Reset to initial values
form.reset();
console.log(form.values);   // { name: '', email: '' }
console.log(form.errors);   // {}
console.log(form.touched);  // {}

// Reset with new values
form.reset({ name: 'Bob', email: 'bob@example.com' });
console.log(form.values);   // { name: 'Bob', email: 'bob@example.com' }
```

**Returns:** the form (for chaining)

**What gets reset:**

```
form.reset(newValues?)
   ↓
1️⃣ this.values = { ...newValues }      (or initial values)
2️⃣ this.errors = {}                    (all errors cleared)
3️⃣ this.touched = {}                   (all touched cleared)
4️⃣ this.isSubmitting = false            (reset loading state)
```

---

### .resetField(field)

Resets a single field to its initial value, clears its error, and unmarks it as touched.

```javascript
const form = Forms.create({ name: 'Default', email: '' });

form.setValue('name', 'Changed');
form.setError('name', 'Too short');

form.resetField('name');
console.log(form.values.name);     // 'Default' (back to initial)
console.log(form.hasError('name')); // false
console.log(form.isTouched('name'));// false
```

**Returns:** the form (for chaining)

---

## Utility

---

### .toObject()

Returns a plain snapshot of the current form state.

```javascript
const form = Forms.create({ name: 'Alice', email: '' });
form.setError('email', 'Required');

const snapshot = form.toObject();
console.log(snapshot);
// {
//   values: { name: 'Alice', email: '' },
//   errors: { email: 'Required' },
//   touched: {},
//   isValid: false,
//   isDirty: false,
//   isSubmitting: false,
//   submitCount: 0
// }
```

**Returns:** a plain object (not reactive)

This is useful for debugging, logging, or sending form state to an external system.

---

## Computed Properties Reference

These properties update automatically. You don't call them — you just read them.

| Property | Type | Description |
|----------|------|-------------|
| `.isValid` | Boolean | `true` if there are no errors |
| `.isDirty` | Boolean | `true` if any field has been touched |
| `.hasErrors` | Boolean | `true` if any error message exists |
| `.touchedFields` | Array | List of field names that have been touched |
| `.errorFields` | Array | List of field names that have errors |

```javascript
form.setValue('name', 'Alice');
form.setError('email', 'Required');

console.log(form.isValid);        // false
console.log(form.isDirty);        // true
console.log(form.hasErrors);      // true
console.log(form.touchedFields);  // ['name']
console.log(form.errorFields);    // ['email']
```

---

## Quick Reference: What Does Each Method Return?

| Method | Returns | Chainable? |
|--------|---------|------------|
| `.setValue(field, value)` | Form | ✅ Yes |
| `.setValues(values)` | Form | ✅ Yes |
| `.getValue(field)` | Value | ❌ No |
| `.setError(field, error)` | Form | ✅ Yes |
| `.setErrors(errors)` | Form | ✅ Yes |
| `.clearError(field)` | Form | ✅ Yes |
| `.clearErrors()` | Form | ✅ Yes |
| `.hasError(field)` | Boolean | ❌ No |
| `.getError(field)` | String or null | ❌ No |
| `.setTouched(field, flag?)` | Form | ✅ Yes |
| `.setTouchedFields(fields)` | Form | ✅ Yes |
| `.touchAll()` | Form | ✅ Yes |
| `.isTouched(field)` | Boolean | ❌ No |
| `.validateField(field)` | Boolean | ❌ No |
| `.validate()` | Boolean | ❌ No |
| `.submit(handler?)` | Promise | ❌ No |
| `.shouldShowError(field)` | Boolean | ❌ No |
| `.reset(newValues?)` | Form | ✅ Yes |
| `.resetField(field)` | Form | ✅ Yes |
| `.toObject()` | Plain Object | ❌ No |

---

## Key Takeaways

1. **Value methods** (`.setValue`, `.setValues`, `.getValue`) manage field data — `.setValue` auto-touches and auto-validates
2. **Error methods** (`.setError`, `.clearError`, `.getError`) give you full control over error messages
3. **Touched methods** (`.setTouched`, `.touchAll`, `.isTouched`) track user interaction
4. **Validation** (`.validateField`, `.validate`) runs validators and stores results in `.errors`
5. **Submission** (`.submit`) is a complete flow: touch → validate → submit → handle result
6. **`.shouldShowError()`** is the best way to decide when to display an error in the UI
7. **Reset** (`.reset`, `.resetField`) clears everything back to initial state
8. Most methods return the form for **chaining**

---

## What's next?

Let's explore the built-in validators — required, email, minLength, pattern, combine, and more.

Let's continue!