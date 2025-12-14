# Understanding `setError()` - A Beginner's Guide

## What is `setError()`?

`setError()` is a method that manually sets an error message for a specific form field. It's useful when you need custom validation or async error handling.

Think of it as your **manual error setter** - you control exactly when and what errors appear.

---

## Why Does This Exist?

### Automatic Validation vs Manual Control

Validators handle most errors automatically, but sometimes you need manual control:

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email() // Automatic validation
    }
  }
);

// ✅ Automatic - validator catches invalid email
form.setValue('email', 'invalid');
console.log(form.errors.email); // "Invalid email address"

// ✅ Manual - you set custom error
form.setError('email', 'This email is already registered');
console.log(form.errors.email); // "This email is already registered"
```

**When you need manual control:**
- Server-side validation errors
- Async validation (check username availability)
- Custom business logic
- Cross-field validation
- Dynamic error messages

---

## How Does It Work?

### The Simple Process

When you call `setError()`:

1. **Takes field name and message** - You specify what and where
2. **Sets error in form.errors** - Stores the error message
3. **Triggers UI update** - Reactivity updates displays

Think of it like this:

```
setError('email', 'Already taken')
        ↓
  form.errors.email = 'Already taken'
        ↓
  UI updates to show error
```

---

## Basic Usage

### Setting a Simple Error

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: ''
});

// Set error manually
form.setError('username', 'Username is too short');

console.log(form.errors.username); // "Username is too short"
console.log(form.hasError('username')); // true
```

### Setting Multiple Field Errors

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Set different errors for different fields
form.setError('email', 'Invalid email format');
form.setError('password', 'Password is too weak');

console.log(form.errors);
// {
//   email: 'Invalid email format',
//   password: 'Password is too weak'
// }
```

### Replacing Existing Errors

```javascript
const form = ReactiveUtils.form({ email: '' });

// Set initial error
form.setError('email', 'Email is required');

// Replace with new error
form.setError('email', 'Email format is invalid');

console.log(form.errors.email); // "Email format is invalid"
```

---

## Simple Examples Explained

### Example 1: Server-Side Validation

```javascript
const loginForm = ReactiveUtils.form({
  email: '',
  password: ''
});

async function handleLogin() {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(loginForm.values)
    });

    if (!response.ok) {
      const error = await response.json();

      // Server says email not found
      if (error.code === 'USER_NOT_FOUND') {
        loginForm.setError('email', 'No account found with this email');
      }

      // Server says wrong password
      if (error.code === 'INVALID_PASSWORD') {
        loginForm.setError('password', 'Incorrect password');
      }
    }
  } catch (err) {
    console.error('Login failed:', err);
  }
}
```

**What happens:**

1. Form submitted to server
2. Server returns validation errors
3. Use `setError()` to display server errors
4. User sees specific error messages

---

### Example 2: Async Username Check

```javascript
const signupForm = ReactiveUtils.form({ username: '' });

let checkTimeout;

// Check username availability as user types
signupForm.$watch('values.username', async (username) => {
  clearTimeout(checkTimeout);

  if (!username) return;

  checkTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`/api/check-username?username=${username}`);
      const data = await response.json();

      if (!data.available) {
        signupForm.setError('username', 'Username already taken');
      } else {
        signupForm.clearError('username');
      }
    } catch (err) {
      console.error('Check failed:', err);
    }
  }, 500); // Debounce 500ms
});
```

**What happens:**

1. User types username
2. Wait 500ms (debounce)
3. Check with API if username available
4. If taken, set error using `setError()`
5. If available, clear error

---

### Example 3: Custom Password Strength

```javascript
const form = ReactiveUtils.form({ password: '' });

function checkPasswordStrength(password) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain uppercase letter';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must contain number';
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return 'Password must contain special character';
  }

  return null; // Valid
}

form.$watch('values.password', (password) => {
  const error = checkPasswordStrength(password);

  if (error) {
    form.setError('password', error);
  } else {
    form.clearError('password');
  }
});
```

**What happens:**

1. User types password
2. Custom strength check runs
3. If weak, `setError()` shows specific requirement
4. If strong, error cleared
5. User gets clear guidance

---

## Real-World Example: Registration Form

```javascript
const registrationForm = ReactiveUtils.form(
  {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  {
    validators: {
      email: ReactiveUtils.validators.email(),
      password: ReactiveUtils.validators.minLength(8)
    }
  }
);

// Check if passwords match
registrationForm.$watch('values.confirmPassword', (confirm) => {
  const password = registrationForm.getValue('password');

  if (confirm && password !== confirm) {
    registrationForm.setError('confirmPassword', 'Passwords do not match');
  } else {
    registrationForm.clearError('confirmPassword');
  }
});

// Also check when password changes
registrationForm.$watch('values.password', (password) => {
  const confirm = registrationForm.getValue('confirmPassword');

  if (confirm && password !== confirm) {
    registrationForm.setError('confirmPassword', 'Passwords do not match');
  } else {
    registrationForm.clearError('confirmPassword');
  }
});

// Handle submission
async function handleRegister() {
  const result = await registrationForm.submit();

  if (!result.success) {
    // Server returned errors
    const serverErrors = result.error.fieldErrors;

    // Set each server error
    if (serverErrors) {
      Object.keys(serverErrors).forEach(field => {
        registrationForm.setError(field, serverErrors[field]);
      });
    }
  }
}
```

**What happens:**
- Client-side validators run automatically
- Custom password match check uses `setError()`
- Server errors also displayed using `setError()`
- All errors shown consistently

---

## Common Patterns

### Pattern 1: API Error Handling

```javascript
async function submitForm() {
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(form.values)
    });

    if (!response.ok) {
      const errors = await response.json();

      // Set errors from API
      errors.fields.forEach(({ field, message }) => {
        form.setError(field, message);
      });
    }
  } catch (err) {
    form.setError('_general', 'Network error occurred');
  }
}
```

### Pattern 2: Cross-Field Validation

```javascript
const form = ReactiveUtils.form({
  startDate: '',
  endDate: ''
});

form.$watch('values.endDate', (endDate) => {
  const startDate = form.getValue('startDate');

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    form.setError('endDate', 'End date must be after start date');
  } else {
    form.clearError('endDate');
  }
});
```

### Pattern 3: Conditional Validation

```javascript
const form = ReactiveUtils.form({
  hasMailingAddress: false,
  mailingAddress: ''
});

form.$watch('values.mailingAddress', (address) => {
  const hasMailingAddress = form.getValue('hasMailingAddress');

  if (hasMailingAddress && !address) {
    form.setError('mailingAddress', 'Mailing address is required');
  } else {
    form.clearError('mailingAddress');
  }
});
```

### Pattern 4: Business Logic Validation

```javascript
const orderForm = ReactiveUtils.form({
  quantity: 0,
  totalPrice: 0
});

orderForm.$watch('values.quantity', (quantity) => {
  const maxQuantity = 100;

  if (quantity > maxQuantity) {
    orderForm.setError('quantity', `Maximum order quantity is ${maxQuantity}`);
  } else if (quantity < 1) {
    orderForm.setError('quantity', 'Quantity must be at least 1');
  } else {
    orderForm.clearError('quantity');
  }
});
```

---

## Common Beginner Questions

### Q: When should I use `setError()` vs validators?

**Answer:**

- **Validators** = Automatic, synchronous validation
- **`setError()`** = Manual, custom validation

```javascript
// ✅ Use validator for standard validation
validators: {
  email: ReactiveUtils.validators.email()
}

// ✅ Use setError() for custom/async validation
async function checkEmail() {
  const taken = await isEmailTaken(email);
  if (taken) {
    form.setError('email', 'Email already registered');
  }
}
```

### Q: Does `setError()` prevent form submission?

**Answer:**

Yes! Forms with errors won't submit:

```javascript
form.setError('email', 'Invalid email');

await form.submit(); // Won't submit - form has errors
console.log(form.isValid); // false
```

### Q: Can I set errors on fields that don't exist?

**Answer:**

Yes! Useful for general form errors:

```javascript
// Set general form error
form.setError('_general', 'Something went wrong');

// Display it
if (form.errors._general) {
  alert(form.errors._general);
}
```

### Q: How do I clear an error?

**Answer:**

Use `clearError()`:

```javascript
// Set error
form.setError('email', 'Invalid email');

// Clear error
form.clearError('email');

console.log(form.errors.email); // undefined
```

### Q: Does `setError()` mark the field as touched?

**Answer:**

No, it only sets the error. To mark as touched:

```javascript
form.setError('email', 'Invalid email');
form.setTouched('email'); // Mark as touched separately
```

---

## Tips for Success

### 1. Use for Server Errors

```javascript
// ✅ Perfect use case
async function submit() {
  const response = await api.save(form.values);
  if (response.errors) {
    response.errors.forEach(({ field, message }) => {
      form.setError(field, message);
    });
  }
}
```

### 2. Clear Errors When Values Change

```javascript
// ✅ Clear error when user fixes the issue
form.$watch('values.email', () => {
  form.clearError('email');
});
```

### 3. Provide Helpful Messages

```javascript
// ❌ Vague
form.setError('email', 'Invalid');

// ✅ Specific
form.setError('email', 'Email must contain @ symbol');
```

### 4. Use for Async Validation

```javascript
// ✅ Check availability
async function checkAvailability(value) {
  const available = await api.checkUsername(value);
  if (!available) {
    form.setError('username', 'Username already taken');
  }
}
```

### 5. Combine with clearError()

```javascript
// ✅ Set or clear based on condition
if (isValid) {
  form.clearError('field');
} else {
  form.setError('field', 'Error message');
}
```

---

## Summary

### What `setError()` Does:

1. ✅ Manually sets error message for a field
2. ✅ Updates `form.errors` object
3. ✅ Triggers reactive UI updates
4. ✅ Prevents form submission
5. ✅ Works with any field name

### When to Use It:

- Server-side validation errors
- Async validation (username availability)
- Custom business logic validation
- Cross-field validation
- Dynamic error messages
- When validators aren't enough

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ fieldName: '' });

// Set error
form.setError('fieldName', 'Error message');

// Clear error
form.clearError('fieldName');

// Check if has error
if (form.hasError('fieldName')) {
  console.log(form.getError('fieldName'));
}
```

---

**Remember:** `setError()` gives you manual control over form errors. Use it for server errors, async validation, and custom validation logic that validators can't handle. Always provide clear, helpful error messages! 🎉
