[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Real-World Examples and Best Practices

Let's see reactive forms solving real problems you'll encounter in web development.

---

## Example 1: Login Form

### The scenario

A simple login with email and password validation.

```javascript
const loginForm = Forms.create(
  { email: '', password: '' },
  {
    validators: {
      email: Forms.v.combine(
        Forms.v.required('Email is required'),
        Forms.v.email('Please enter a valid email')
      ),
      password: Forms.v.required('Password is required')
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      return response.json();
    }
  }
);

// Reactive UI
ReactiveUtils.effect(() => {
  document.getElementById('loginBtn').disabled =
    !loginForm.isValid || loginForm.isSubmitting;

  document.getElementById('loginBtn').textContent =
    loginForm.isSubmitting ? 'Logging in...' : 'Log In';
});

// Handle submission
async function handleLogin() {
  const result = await loginForm.submit();
  if (result.success) {
    window.location.href = '/dashboard';
  } else if (result.errors) {
    console.log('Validation failed');
  }
}
```

**Key patterns:** Async submit, button disabled state, loading text

---

## Example 2: Registration Form with Password Confirmation

### The scenario

A registration form where the password confirmation must match.

```javascript
const registerForm = Forms.create(
  { username: '', email: '', password: '', confirmPassword: '' },
  {
    validators: {
      username: Forms.v.combine(
        Forms.v.required('Username is required'),
        Forms.v.minLength(3, 'At least 3 characters'),
        Forms.v.pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores')
      ),
      email: Forms.v.combine(
        Forms.v.required('Email is required'),
        Forms.v.email('Invalid email address')
      ),
      password: Forms.v.combine(
        Forms.v.required('Password is required'),
        Forms.v.minLength(8, 'At least 8 characters')
      ),
      confirmPassword: Forms.v.combine(
        Forms.v.required('Please confirm your password'),
        Forms.v.match('password', 'Passwords do not match')
      )
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password
        })
      });
      return response.json();
    }
  }
);
```

**Key patterns:** `match()` for password confirmation, excluding `confirmPassword` from submission

---

## Example 3: Contact Form with Reset

### The scenario

A contact form that resets after successful submission.

```javascript
const contactForm = Forms.create(
  { name: '', email: '', subject: '', message: '' },
  {
    validators: {
      name: Forms.v.required('Please enter your name'),
      email: Forms.v.combine(
        Forms.v.required('Email is required'),
        Forms.v.email('Invalid email')
      ),
      message: Forms.v.combine(
        Forms.v.required('Please write a message'),
        Forms.v.minLength(20, 'Please write at least 20 characters')
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

async function sendMessage() {
  const result = await contactForm.submit();
  if (result.success) {
    alert('Message sent!');
    contactForm.reset();  // Clear the form after success
  }
}
```

**Key patterns:** `.reset()` after successful submission, optional subject (no validator)

---

## Example 4: Edit Profile with Pre-filled Data

### The scenario

An edit form that loads existing data and only submits if something changed.

```javascript
// Pre-fill from existing user data
const profileForm = Forms.create(
  { name: 'Alice', email: 'alice@example.com', bio: 'Hello world' },
  {
    validators: {
      name: Forms.v.required('Name is required'),
      email: Forms.v.combine(
        Forms.v.required('Email is required'),
        Forms.v.email('Invalid email')
      ),
      bio: Forms.v.maxLength(200, 'Bio must be 200 characters or less')
    },
    onSubmit: async (values) => {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
    }
  }
);

// Show save button only if the form has been modified
ReactiveUtils.effect(() => {
  const saveBtn = document.getElementById('saveBtn');
  saveBtn.style.display = profileForm.isDirty ? 'block' : 'none';
});
```

**Key patterns:** Pre-filled initial values, `.isDirty` to show/hide save button

---

## Example 5: Multi-Step Form (Wizard)

### The scenario

A form split into steps, where each step validates independently.

```javascript
const wizardForm = Forms.create(
  {
    // Step 1
    firstName: '', lastName: '',
    // Step 2
    email: '', phone: '',
    // Step 3
    agree: false
  },
  {
    validators: {
      firstName: Forms.v.required('First name is required'),
      lastName: Forms.v.required('Last name is required'),
      email: Forms.v.combine(
        Forms.v.required('Email is required'),
        Forms.v.email('Invalid email')
      ),
      agree: Forms.v.custom((value) => {
        if (!value) return 'You must agree to the terms';
        return null;
      })
    }
  }
);

const step = ReactiveUtils.state({ current: 1 });

// Step-specific field groups
const stepFields = {
  1: ['firstName', 'lastName'],
  2: ['email', 'phone'],
  3: ['agree']
};

function validateStep() {
  const fields = stepFields[step.current];
  let valid = true;

  fields.forEach(field => {
    wizardForm.setTouched(field);
    if (!wizardForm.validateField(field)) {
      valid = false;
    }
  });

  return valid;
}

function nextStep() {
  if (validateStep()) {
    step.current++;
  }
}

function prevStep() {
  step.current--;
}

async function finish() {
  if (validateStep()) {
    const result = await wizardForm.submit(async (values) => {
      return await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
    });
  }
}
```

**Key patterns:** `.validateField()` for step-specific validation, `.setTouched()` per field, custom submit handler

---

## Example 6: Server-Side Error Handling

### The scenario

Showing errors that come back from the server.

```javascript
const form = Forms.create(
  { email: '', username: '' },
  {
    validators: {
      email: Forms.v.combine(
        Forms.v.required('Email is required'),
        Forms.v.email('Invalid email')
      ),
      username: Forms.v.required('Username is required')
    },
    onSubmit: async (values, form) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (!response.ok) {
        // Set server-side errors on specific fields
        if (data.errors) {
          form.setErrors(data.errors);
        }
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    }
  }
);

// The effect shows errors regardless of where they came from
ReactiveUtils.effect(() => {
  ['email', 'username'].forEach(field => {
    const errorEl = document.getElementById(`${field}Error`);
    if (form.shouldShowError(field)) {
      errorEl.textContent = form.getError(field);
      errorEl.style.display = 'block';
    } else {
      errorEl.style.display = 'none';
    }
  });
});
```

**Key patterns:** `.setErrors()` for server-side errors, same error display logic for client and server errors

---

## Example 7: Dynamic Character Counter

### The scenario

A textarea with a live character count and max length validation.

```javascript
const form = Forms.create(
  { bio: '' },
  {
    validators: {
      bio: Forms.v.maxLength(280, 'Bio must be 280 characters or less')
    }
  }
);

ReactiveUtils.effect(() => {
  const length = (form.values.bio || '').length;
  const counter = document.getElementById('charCount');
  counter.textContent = `${length} / 280`;
  counter.style.color = length > 280 ? 'red' : 'gray';
});
```

**Key patterns:** Reading `.values.bio.length` inside an effect for live updates

---

## Example 8: Form State Debugging

### The scenario

Displaying the current form state for development.

```javascript
const form = Forms.create(
  { name: '', email: '' },
  {
    validators: {
      name: Forms.v.required('Required'),
      email: Forms.v.email('Invalid')
    }
  }
);

ReactiveUtils.effect(() => {
  const debug = document.getElementById('debugPanel');
  const state = form.toObject();
  debug.textContent = JSON.stringify(state, null, 2);
});
```

**Key patterns:** `.toObject()` for a plain snapshot, useful for development

---

## Best Practices

### ✅ Use .shouldShowError() for error display

```javascript
// ✅ Only shows error after user interaction
if (form.shouldShowError('email')) {
  showError(form.getError('email'));
}

// ❌ Shows error immediately, even on a blank form
if (form.hasError('email')) {
  showError(form.getError('email'));
}
```

### ✅ Use .setValues() for bulk updates

```javascript
// ✅ Batched — effects run once
form.setValues({ name: 'Alice', email: 'alice@example.com' });

// Less efficient — effects run twice
form.setValue('name', 'Alice');
form.setValue('email', 'alice@example.com');
```

### ✅ Use combine() for multi-rule validation

```javascript
// ✅ Clean and composable
validators: {
  password: Forms.v.combine(
    Forms.v.required('Required'),
    Forms.v.minLength(8, 'Too short'),
    Forms.v.pattern(/[A-Z]/, 'Needs an uppercase letter')
  )
}
```

### ✅ Use .reset() after successful submission

```javascript
const result = await form.submit();
if (result.success) {
  form.reset();  // ✅ Clean slate for next submission
}
```

### ✅ Use computed properties for UI state

```javascript
// ✅ Reactive — updates automatically
ReactiveUtils.effect(() => {
  submitBtn.disabled = !form.isValid || form.isSubmitting;
  submitBtn.textContent = form.isSubmitting ? 'Saving...' : 'Save';
});
```

### ❌ Don't write validators that return true/false

```javascript
// ❌ Wrong — returns boolean
validators: {
  name: (value) => value.length > 0
}

// ✅ Correct — returns null or error string
validators: {
  name: (value) => {
    if (!value) return 'Name is required';
    return null;
  }
}
```

### ❌ Don't forget to await .submit()

```javascript
// ❌ result is a Promise, not the actual result
const result = form.submit();

// ✅ Await the Promise
const result = await form.submit();
```

### ❌ Don't modify .values directly when you need validation

```javascript
// ❌ Bypasses auto-validation and touched tracking
form.values.email = 'test@test.com';

// ✅ Use setValue — it validates and marks as touched
form.setValue('email', 'test@test.com');
```

---

## Key Takeaways

1. **Use `.shouldShowError()`** to show errors only after user interaction
2. **Use `.setValues()`** for bulk updates (batched for performance)
3. **Use `combine()`** to chain multiple validation rules
4. **Use `.reset()`** after successful submissions
5. **Always await `.submit()`** — it returns a Promise
6. **Use `.setValue()`** instead of modifying `.values` directly for auto-validation
7. **Computed properties** (`.isValid`, `.isDirty`, `.isSubmitting`) are your best friends for UI state

---

## What's next?

Let's explore DOM binding, event handling, and the complete API reference.

Let's continue!