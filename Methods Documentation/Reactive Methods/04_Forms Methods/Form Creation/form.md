# Understanding `form()` - A Beginner's Guide

## What is `form()`?

`form()` creates a **reactive form** with built-in validation, error tracking, and submission handling. It's a complete form management system in one simple function.

Think of it as your **smart form assistant** - it handles values, errors, validation, and submission automatically so you don't have to.

---

## Why Does This Exist?

### The Old Way (Without `form()`)

Building forms manually is tedious and error-prone:

```javascript
// Step 1: Create variables for everything
let email = '';
let password = '';
let emailError = '';
let passwordError = '';
let isSubmitting = false;

// Step 2: Validate email manually
function validateEmail() {
  if (!email) {
    emailError = 'Email is required';
  } else if (!email.includes('@')) {
    emailError = 'Invalid email';
  } else {
    emailError = '';
  }
  updateUI(); // Don't forget to update!
}

// Step 3: Validate password manually
function validatePassword() {
  if (!password) {
    passwordError = 'Password is required';
  } else if (password.length < 8) {
    passwordError = 'Password must be at least 8 characters';
  } else {
    passwordError = '';
  }
  updateUI(); // Update again!
}

// Step 4: Handle input changes
document.getElementById('email').oninput = (e) => {
  email = e.target.value;
  validateEmail();
};

document.getElementById('password').oninput = (e) => {
  password = e.target.value;
  validatePassword();
};

// Step 5: Handle submission
async function handleSubmit() {
  validateEmail();
  validatePassword();

  if (emailError || passwordError) {
    alert('Please fix errors');
    return;
  }

  isSubmitting = true;
  updateUI();

  try {
    await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    alert('Success!');
  } catch (error) {
    alert('Failed!');
  } finally {
    isSubmitting = false;
    updateUI();
  }
}

// So much code just for a simple form!
```

**Problems:**
- Tons of repetitive code
- Manual validation everywhere
- Easy to forget to update UI
- Hard to maintain
- Lots of places where bugs can hide

### The New Way (With `form()`)

With `form()`, all of this becomes simple:

```javascript
// Create form with validation (one time setup)
const loginForm = ReactiveUtils.form(
  {
    email: '',
    password: ''
  },
  {
    validators: {
      email: ReactiveUtils.validators.email(),
      password: ReactiveUtils.validators.minLength(8)
    },
    onSubmit: async (values) => {
      await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values)
      });
    }
  }
);

// Bind to inputs
loginForm.bindToInputs('form input');

// Submit
document.querySelector('form').onsubmit = async (e) => {
  e.preventDefault();
  await loginForm.submit();
};

// Done! Everything else is automatic! ✨
```

**Benefits:**
- Minimal code
- Automatic validation
- Automatic error tracking
- Automatic UI updates
- Built-in submission handling
- Much easier to maintain

---

## How Does It Work?

### The Magic Behind the Scenes

When you create a form with `form()`, you get a reactive object that automatically:

1. **Tracks all field values** - Stores your form data
2. **Validates on change** - Checks fields as user types
3. **Tracks errors** - Stores error messages for each field
4. **Tracks touched fields** - Knows which fields user has interacted with
5. **Handles submission** - Manages submit state and calls your handler

Think of it like this:

```
User Types  →  [form() Validates]  →  Errors Updated  →  UI Updates
                       ↓
                 Values Stored
```

---

## The Two Parts of `form()`

### Part 1: Your Form Values

This is the data your form collects:

```javascript
const myForm = ReactiveUtils.form(
  {
    email: '',           // Starting as empty
    password: '',
    rememberMe: false    // Starting as false
  }
  // ...validators come here
);
```

**Think of this as your form's data container** - it holds all the information users enter.

### Part 2: Your Validators (Optional)

This tells `form()` **how to validate** each field:

```javascript
const myForm = ReactiveUtils.form(
  { email: '', password: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email(),           // Must be valid email
      password: ReactiveUtils.validators.minLength(8)    // Must be 8+ characters
    }
  }
);
```

**Think of validators as rules** that say: "Hey, check if email is valid whenever it changes!"

---

## Simple Examples Explained

### Example 1: A Simple Contact Form

**HTML:**
```html
<form id="contact-form">
  <input name="name" placeholder="Your name">
  <input name="email" placeholder="Your email">
  <button type="submit">Send</button>
</form>
```

**JavaScript:**
```javascript
const contactForm = ReactiveUtils.form({
  name: '',
  email: ''
});

// Bind to inputs
contactForm.bindToInputs('#contact-form input');

// Handle submit
document.getElementById('contact-form').onsubmit = (e) => {
  e.preventDefault();
  console.log('Form values:', contactForm.values);
};
```

**What happens:**

1. `form()` creates reactive form data
2. `bindToInputs()` connects it to your HTML inputs
3. As user types, `contactForm.values` updates automatically
4. When submitted, you get all the values in one object

**Why this is cool:** No manual event handlers for each input!

---

### Example 2: Form with Validation

**HTML:**
```html
<form>
  <input name="email" type="email">
  <span id="email-error"></span>
  <button type="submit">Submit</button>
</form>
```

**JavaScript:**
```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email()
    }
  }
);

form.bindToInputs('input');

// Show errors automatically
ReactiveUtils.effect(() => {
  const error = form.shouldShowError('email') ? form.getError('email') : '';
  document.getElementById('email-error').textContent = error;
});
```

**What happens:**

1. User types in email field
2. `form()` validates automatically
3. If invalid, error appears automatically
4. If valid, error disappears automatically

**Change the email:**
```javascript
form.setValue('email', 'invalid');  // Error shows: "Invalid email address"
form.setValue('email', 'test@example.com');  // Error disappears!
```

---

### Example 3: Form with Submit Handler

**HTML:**
```html
<form id="login">
  <input name="email" type="email">
  <input name="password" type="password">
  <button type="submit">Login</button>
</form>
```

**JavaScript:**
```javascript
const loginForm = ReactiveUtils.form(
  { email: '', password: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email(),
      password: ReactiveUtils.validators.minLength(8)
    },
    onSubmit: async (values) => {
      // This runs when form.submit() is called
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values)
      });

      if (!response.ok) throw new Error('Login failed');

      return await response.json();
    }
  }
);

loginForm.bindToInputs('#login input');

document.getElementById('login').onsubmit = async (e) => {
  e.preventDefault();

  const result = await loginForm.submit();

  if (result.success) {
    alert('Logged in!');
  } else {
    alert('Error: ' + result.error.message);
  }
};
```

**What happens:**

1. User fills form and clicks submit
2. `form()` validates all fields
3. If valid, calls your `onSubmit` function
4. Shows loading state automatically
5. Returns success or error result

---

## Built-in Validators

The `form()` function comes with 10 ready-to-use validators:

### 1. Required Field
```javascript
validators: {
  name: ReactiveUtils.validators.required('Name is required')
}
```

### 2. Email Format
```javascript
validators: {
  email: ReactiveUtils.validators.email('Please enter a valid email')
}
```

### 3. Minimum Length
```javascript
validators: {
  password: ReactiveUtils.validators.minLength(8, 'At least 8 characters')
}
```

### 4. Maximum Length
```javascript
validators: {
  bio: ReactiveUtils.validators.maxLength(200, 'Max 200 characters')
}
```

### 5. Number Range (min/max)
```javascript
validators: {
  age: ReactiveUtils.validators.min(18, 'Must be 18 or older'),
  quantity: ReactiveUtils.validators.max(100, 'Max 100 items')
}
```

### 6. Pattern Match
```javascript
validators: {
  phone: ReactiveUtils.validators.pattern(/^\d{10}$/, 'Must be 10 digits')
}
```

### 7. Match Another Field
```javascript
validators: {
  confirmPassword: ReactiveUtils.validators.match('password', 'Passwords must match')
}
```

### 8. Custom Validation
```javascript
validators: {
  username: ReactiveUtils.validators.custom((value) => {
    if (value.length < 3) return 'Too short';
    if (!/^[a-z0-9]+$/.test(value)) return 'Alphanumeric only';
    return null; // Valid
  })
}
```

### 9. Combine Multiple Validators
```javascript
validators: {
  password: ReactiveUtils.validators.combine(
    ReactiveUtils.validators.required(),
    ReactiveUtils.validators.minLength(8),
    ReactiveUtils.validators.pattern(/[A-Z]/, 'Need uppercase'),
    ReactiveUtils.validators.pattern(/[0-9]/, 'Need number')
  )
}
```

---

## Real-World Example: Complete Login Form

**HTML:**
```html
<form id="login-form">
  <div>
    <input name="email" type="email" placeholder="Email">
    <span id="email-error" class="error"></span>
  </div>

  <div>
    <input name="password" type="password" placeholder="Password">
    <span id="password-error" class="error"></span>
  </div>

  <button type="submit" id="submit-btn">Login</button>
</form>
```

**JavaScript:**
```javascript
const loginForm = ReactiveUtils.form(
  {
    email: '',
    password: ''
  },
  {
    validators: {
      email: ReactiveUtils.validators.combine(
        ReactiveUtils.validators.required('Email is required'),
        ReactiveUtils.validators.email('Please enter a valid email')
      ),
      password: ReactiveUtils.validators.combine(
        ReactiveUtils.validators.required('Password is required'),
        ReactiveUtils.validators.minLength(8, 'Password must be at least 8 characters')
      )
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) throw new Error('Invalid credentials');

      return await response.json();
    }
  }
);

// Bind form to inputs
loginForm.bindToInputs('#login-form input');

// Show errors automatically
ReactiveUtils.effect(() => {
  document.getElementById('email-error').textContent =
    loginForm.shouldShowError('email') ? loginForm.getError('email') : '';

  document.getElementById('password-error').textContent =
    loginForm.shouldShowError('password') ? loginForm.getError('password') : '';
});

// Update submit button automatically
ReactiveUtils.effect(() => {
  const btn = document.getElementById('submit-btn');
  btn.disabled = !loginForm.isValid || loginForm.isSubmitting;
  btn.textContent = loginForm.isSubmitting ? 'Logging in...' : 'Login';
});

// Handle form submission
document.getElementById('login-form').onsubmit = async (e) => {
  e.preventDefault();

  const result = await loginForm.submit();

  if (result.success) {
    window.location.href = '/dashboard';
  } else {
    alert('Login failed: ' + result.error.message);
  }
};
```

**What happens automatically:**
- User types → Fields validate automatically
- Errors show only after field is touched
- Submit button disables when form is invalid
- Submit button shows "Logging in..." during submission
- Form handles success/error cases

**All from just setting up the form once!**

---

## Common Beginner Questions

### Q: What's the difference between `form()` and `state()`?

**Answer:**

- **`state()`** = Just creates reactive data (no form features)
- **`form()`** = Creates reactive data + validation + error tracking + submission handling

```javascript
// state() - Manual form handling
const formState = ReactiveUtils.state({ email: '', password: '' });
// You handle validation, errors, submission yourself

// form() - Automatic form handling
const form = ReactiveUtils.form({ email: '', password: '' }, {
  validators: { /* automatic validation */ },
  onSubmit: async (values) => { /* automatic submission */ }
});
```

### Q: Do I have to use validators?

**Answer:** No! Validators are optional. You can create a form without them:

```javascript
// Form without validators
const form = ReactiveUtils.form({
  name: '',
  email: ''
});

// Manually set errors if needed
form.setError('email', 'Custom error message');
```

### Q: Can I have multiple forms on one page?

**Answer:** Yes! Each form is independent:

```javascript
const loginForm = ReactiveUtils.form({ email: '', password: '' });
const signupForm = ReactiveUtils.form({ username: '', email: '', password: '' });
const searchForm = ReactiveUtils.form({ query: '' });

// They all work independently!
```

### Q: How do I access form values?

**Answer:** Use the `.values` property:

```javascript
const form = ReactiveUtils.form({ email: '', password: '' });

// Get all values
console.log(form.values);  // { email: '...', password: '...' }

// Get specific value
console.log(form.values.email);

// Or use getValue()
console.log(form.getValue('email'));
```

---

## Useful Properties and Methods

Every form created with `form()` has these:

### Properties
- `values` - All form field values
- `errors` - All error messages
- `touched` - Which fields user has touched
- `isSubmitting` - True during submission
- `submitCount` - Number of times submitted

### Computed Properties
- `isValid` - True if no errors
- `isDirty` - True if any field touched
- `hasErrors` - True if any errors exist

### Essential Methods
- `setValue(field, value)` - Set a field's value
- `setError(field, message)` - Set an error
- `validateField(field)` - Validate one field
- `validate()` - Validate all fields
- `submit()` - Submit the form
- `reset()` - Reset to initial values
- `bindToInputs(selector)` - Auto-bind to HTML inputs

---

## Tips for Beginners

### 1. Start Simple

Begin with basic form, add validators later:

```javascript
// ✅ Start simple
const form = ReactiveUtils.form({
  name: '',
  email: ''
});

// Add validators when needed
```

### 2. Use `shouldShowError()` for Displaying Errors

Only show errors after user has touched the field:

```javascript
// ✅ Good - only show after touched
const errorMsg = form.shouldShowError('email')
  ? form.getError('email')
  : '';

// ❌ Bad - shows immediately
const errorMsg = form.getError('email');
```

### 3. Use `bindToInputs()` for Quick Setup

```javascript
// ✅ Easy - auto-bind all inputs
form.bindToInputs('form input');

// ❌ Tedious - manual binding
document.getElementById('email').oninput = (e) => {
  form.setValue('email', e.target.value);
};
// ... repeat for every input
```

### 4. Combine Validators for Complex Rules

```javascript
validators: {
  password: ReactiveUtils.validators.combine(
    ReactiveUtils.validators.required(),
    ReactiveUtils.validators.minLength(8),
    ReactiveUtils.validators.pattern(/[A-Z]/, 'Need uppercase'),
    ReactiveUtils.validators.pattern(/[0-9]/, 'Need number')
  )
}
```

### 5. Handle Submission Errors

```javascript
const result = await form.submit();

if (result.success) {
  // Handle success
  console.log('Submitted!', result.result);
} else {
  // Handle error
  console.error('Failed:', result.error);
}
```

---

## Summary

### What `form()` Does:

1. ✅ Creates reactive form with automatic validation
2. ✅ Tracks values, errors, and touched fields
3. ✅ Provides 10 built-in validators
4. ✅ Handles submission with loading state
5. ✅ Auto-updates UI when form changes
6. ✅ Gives you 40+ methods to manage forms

### When to Use It:

- You're building any kind of form
- You need validation
- You want automatic error tracking
- You want clean, maintainable form code
- You're tired of repetitive form code

### The Basic Pattern:

```javascript
const myForm = ReactiveUtils.form(
  { /* initial values */ },
  {
    validators: { /* field validators */ },
    onSubmit: async (values) => { /* submit handler */ }
  }
);

// Bind to inputs
myForm.bindToInputs('form input');

// Handle submit
form.onsubmit = async (e) => {
  e.preventDefault();
  await myForm.submit();
};
```

---

**Remember:** `form()` is your complete form solution. Set it up once with your fields and validators, and it handles validation, errors, and submission automatically. No more repetitive form code! 🎉
