[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Understanding the Basic Example

Let's break down a complete registration form step by step.

---

## The Full Example

```javascript
const form = Forms.create(
  { username: '', email: '', password: '' },
  {
    validators: {
      username: Forms.v.required('Username is required'),
      email: Forms.v.combine(
        Forms.v.required('Email is required'),
        Forms.v.email('Please enter a valid email')
      ),
      password: Forms.v.minLength(6, 'Password must be at least 6 characters')
    },
    onSubmit: (values) => {
      console.log('Registering:', values);
    }
  }
);

// User fills in the form
form.setValue('username', 'alice');
form.setValue('email', 'alice@example.com');
form.setValue('password', '123456');

// Submit
form.submit();
// Registering: { username: 'alice', email: 'alice@example.com', password: '123456' }
```

Now let's understand each part.

---

## Step-by-Step Breakdown

### 1️⃣ The Initial Values

```javascript
{ username: '', email: '', password: '' }
```

This is the first argument to `Forms.create()`. It defines:
- **Which fields exist** in the form
- **What their starting values are** (empty strings here)

Think of it as the blank form before the user types anything.

**What happens behind the scenes:**

```
Forms.create({ username: '', email: '', password: '' })
   ↓
Creates a reactive state with:
   {
     values:       { username: '', email: '', password: '' },
     errors:       {},
     touched:      {},
     isSubmitting:  false,
     submitCount:   0
   }
```

The form wraps your initial values inside a `.values` object and adds `.errors`, `.touched`, `.isSubmitting`, and `.submitCount` alongside it.

---

### 2️⃣ The Validators

```javascript
validators: {
  username: Forms.v.required('Username is required'),
  email: Forms.v.combine(
    Forms.v.required('Email is required'),
    Forms.v.email('Please enter a valid email')
  ),
  password: Forms.v.minLength(6, 'Password must be at least 6 characters')
}
```

Each key matches a field name in the initial values. Each value is a **validator function** that returns either:
- `null` → the field is valid (no error)
- A string → the error message to display

**Breaking it down:**

```
validators
├── username → required('Username is required')
│              Returns 'Username is required' if empty, null if filled
│
├── email    → combine(required(), email())
│              First checks if empty, then checks email format
│              Returns the FIRST error it finds, or null if all pass
│
└── password → minLength(6, '...')
               Returns error if fewer than 6 characters, null otherwise
```

`Forms.v` is a shorthand for `Forms.validators` — a set of built-in validator factory functions.

---

### 3️⃣ The Submit Handler

```javascript
onSubmit: (values) => {
  console.log('Registering:', values);
}
```

This function runs **only when validation passes**. It receives the form values as its first argument.

The submit handler can be synchronous or asynchronous (return a Promise). The form automatically tracks the loading state via `.isSubmitting`.

---

### 4️⃣ Setting Values

```javascript
form.setValue('username', 'alice');
```

**What happens when you call `.setValue()`:**

```
form.setValue('username', 'alice')
   ↓
1️⃣ Sets this.values.username = 'alice'
   ↓
2️⃣ Marks this.touched.username = true
   ↓
3️⃣ Checks: does a validator exist for 'username'?
   ↓ Yes
4️⃣ Runs the validator: required('alice') → null (no error)
   ↓
5️⃣ No error → removes any existing error for 'username'
   ↓
6️⃣ Effects re-run (UI updates automatically)
```

**Three things happen in one call:**
- The value is stored
- The field is marked as touched
- The field is validated (if a validator exists)

---

### 5️⃣ Submitting the Form

```javascript
form.submit();
```

**What happens when you call `.submit()`:**

```
form.submit()
   ↓
1️⃣ Calls this.touchAll()
   → Marks ALL fields as touched
   → So error messages appear for every field
   ↓
2️⃣ Calls this.validate()
   → Runs every validator
   → Stores errors in this.errors
   ↓
3️⃣ Are there errors?
   ├── YES → Returns { success: false, errors: {...} }
   │         Does NOT call the submit handler
   │
   └── NO → Continues:
            ↓
4️⃣ Sets this.isSubmitting = true
   ↓
5️⃣ Calls the submit handler: onSubmit(values, form)
   ↓
6️⃣ When handler completes:
   → this.submitCount++ (increments)
   → this.isSubmitting = false
   ↓
7️⃣ Returns { success: true, result: ... }
```

---

## Watching the Form State Change

Let's trace how the form state evolves:

```javascript
// After creation:
form.values       // { username: '', email: '', password: '' }
form.errors       // {}
form.touched      // {}
form.isValid      // true (no errors exist yet)
form.isDirty      // false (nothing touched)

// After form.setValue('username', 'alice'):
form.values       // { username: 'alice', email: '', password: '' }
form.touched      // { username: true }
form.isDirty      // true (a field was touched)
form.isValid      // true (validator passed for 'alice')

// After form.setValue('email', 'bad-email'):
form.values       // { username: 'alice', email: 'bad-email', password: '' }
form.errors       // { email: 'Please enter a valid email' }
form.touched      // { username: true, email: true }
form.isValid      // false (there's an error)
form.hasErrors    // true

// After form.setValue('email', 'alice@example.com'):
form.values       // { username: 'alice', email: 'alice@example.com', password: '' }
form.errors       // {}
form.isValid      // true (error cleared)
form.hasErrors    // false
```

---

## Using Effects with Forms

Because forms are reactive, effects re-run automatically when form state changes:

```javascript
const form = Forms.create(
  { email: '' },
  {
    validators: {
      email: Forms.v.email('Invalid email')
    }
  }
);

// This effect re-runs whenever isValid changes
ReactiveUtils.effect(() => {
  const btn = document.getElementById('submitBtn');
  btn.disabled = !form.isValid;
});

// This effect shows/hides error messages
ReactiveUtils.effect(() => {
  const errorEl = document.getElementById('emailError');
  if (form.shouldShowError('email')) {
    errorEl.textContent = form.getError('email');
    errorEl.style.display = 'block';
  } else {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
});
```

**Key insight:** `.shouldShowError(field)` returns `true` only when a field is **both** touched **and** has an error. This prevents showing errors before the user has interacted with the field.

---

## Common Mistakes

### ❌ Accessing values directly instead of using .values

```javascript
// ❌ This won't work — fields live inside .values
console.log(form.email);

// ✅ Access through .values
console.log(form.values.email);

// ✅ Or use .getValue()
console.log(form.getValue('email'));
```

### ❌ Forgetting that validators must return null for "valid"

```javascript
// ❌ Returning true/false — the form expects null or a string
const bad = (value) => value.length > 0;  // Returns true/false

// ✅ Return null for valid, a string for invalid
const good = (value) => {
  if (!value) return 'Field is required';
  return null;
};
```

### ❌ Checking errors before the user has interacted

```javascript
// ❌ Shows error immediately, even on a blank form
if (form.hasError('email')) {
  showError(form.getError('email'));
}

// ✅ Only show after the user has touched the field
if (form.shouldShowError('email')) {
  showError(form.getError('email'));
}
```

### ❌ Forgetting that .submit() is async

```javascript
// ❌ The result isn't available yet
const result = form.submit();
console.log(result);  // Promise, not the result

// ✅ Use await
const result = await form.submit();
console.log(result);  // { success: true, result: ... }
```

---

## Key Takeaways

1. **`Forms.create(initialValues, options)`** creates a complete form state object
2. **`.setValue()`** sets the value, marks the field as touched, and auto-validates — all in one call
3. **`.submit()`** touches all fields, validates, then calls the handler if everything passes
4. **Computed properties** like `.isValid`, `.isDirty`, and `.hasErrors` update automatically
5. **`.shouldShowError(field)`** is the recommended way to decide when to display errors
6. **Validators return `null`** for valid fields and **a string** for error messages

---

## What's next?

Let's explore every form method in detail — setting values, managing errors, validating, and submitting.

Let's continue!