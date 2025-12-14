# Understanding `validators.match()` - A Beginner's Guide

## What is `validators.match()`?

`validators.match(fieldName)` is a built-in validator that checks if a field's value matches another field's value.

Think of it as **field matcher** - do these two fields have the same value?

**Alias:** `v.match()` - Use either `validators.match()` or `v.match()`, they're identical.

---

## Why Does This Exist?

### The Problem: Matching Fields

You need to ensure two fields have the same value (like password confirmation):

```javascript
// ❌ Without validator - manual check
if (password !== confirmPassword) {
  errors.confirmPassword = 'Passwords must match';
}

// ✅ With match() - automatic
const form = ReactiveUtils.form({
  password: ['', v.required()],
  confirmPassword: ['', v.match('password')]
});
```

---

## How Does It Work?

```javascript
validators.match(fieldName, message?)
    ↓
Compares this field with fieldName
    ↓
Returns error message or null
```

---

## Basic Usage

### Password Confirmation

```javascript
const form = ReactiveUtils.form({
  password: ['', v.required()],
  confirmPassword: ['', v.match('password', 'Passwords must match')]
});

form.values.password = 'secret123';
form.values.confirmPassword = 'secret456';
console.log(form.errors.confirmPassword); // 'Passwords must match'

form.values.confirmPassword = 'secret123';
console.log(form.errors.confirmPassword); // null (valid)
```

### Email Confirmation

```javascript
const form = ReactiveUtils.form({
  email: ['', v.email()],
  confirmEmail: ['', v.match('email', 'Emails must match')]
});
```

---

## Simple Examples

### Example 1: Registration Form

```javascript
const registrationForm = ReactiveUtils.form({
  email: ['', v.combine([
    v.required(),
    v.email()
  ])],
  confirmEmail: ['', v.combine([
    v.required(),
    v.email(),
    v.match('email', 'Emails must match')
  ])],
  password: ['', v.combine([
    v.required(),
    v.minLength(8)
  ])],
  confirmPassword: ['', v.combine([
    v.required(),
    v.match('password', 'Passwords must match')
  ])]
});

// Display form
ReactiveUtils.effect(() => {
  const container = document.getElementById('registration');

  container.innerHTML = `
    <form onsubmit="handleRegister(event)">
      <input type="email" placeholder="Email"
             value="${registrationForm.values.email}"
             oninput="registrationForm.values.email = this.value">

      <input type="email" placeholder="Confirm Email"
             value="${registrationForm.values.confirmEmail}"
             oninput="registrationForm.values.confirmEmail = this.value"
             onblur="registrationForm.touch('confirmEmail')">
      ${registrationForm.touched.confirmEmail && registrationForm.errors.confirmEmail ? `
        <span class="error">${registrationForm.errors.confirmEmail}</span>
      ` : ''}

      <input type="password" placeholder="Password"
             value="${registrationForm.values.password}"
             oninput="registrationForm.values.password = this.value">

      <input type="password" placeholder="Confirm Password"
             value="${registrationForm.values.confirmPassword}"
             oninput="registrationForm.values.confirmPassword = this.value"
             onblur="registrationForm.touch('confirmPassword')">
      ${registrationForm.touched.confirmPassword && registrationForm.errors.confirmPassword ? `
        <span class="error">${registrationForm.errors.confirmPassword}</span>
      ` : ''}

      <button type="submit" ${!registrationForm.isValid ? 'disabled' : ''}>
        Register
      </button>
    </form>
  `;
});
```

### Example 2: Change Password Form

```javascript
const changePasswordForm = ReactiveUtils.form({
  currentPassword: ['', v.required('Current password is required')],
  newPassword: ['', v.combine([
    v.required('New password is required'),
    v.minLength(8, 'Password must be at least 8 characters')
  ])],
  confirmNewPassword: ['', v.combine([
    v.required('Please confirm your new password'),
    v.match('newPassword', 'Passwords must match')
  ])]
});

// Visual match indicator
ReactiveUtils.effect(() => {
  const indicator = document.getElementById('match-indicator');
  const newPwd = changePasswordForm.values.newPassword;
  const confirmPwd = changePasswordForm.values.confirmNewPassword;

  if (!confirmPwd) {
    indicator.innerHTML = '';
  } else if (newPwd === confirmPwd) {
    indicator.innerHTML = '<span class="success">✓ Passwords match</span>';
  } else {
    indicator.innerHTML = '<span class="error">✗ Passwords do not match</span>';
  }
});
```

---

## Real-World Example: Account Security

```javascript
const securityForm = ReactiveUtils.form({
  // Current authentication
  currentPassword: ['', v.required('Please enter your current password')],

  // New email
  newEmail: ['', v.combine([
    v.required('Email is required'),
    v.email('Invalid email format')
  ])],
  confirmNewEmail: ['', v.combine([
    v.required('Please confirm your email'),
    v.email('Invalid email format'),
    v.match('newEmail', 'Email addresses must match')
  ])],

  // New password
  newPassword: ['', v.combine([
    v.required('Password is required'),
    v.minLength(8, 'Password must be at least 8 characters'),
    v.pattern(/[A-Z]/, 'Must contain at least one uppercase letter'),
    v.pattern(/[0-9]/, 'Must contain at least one number')
  ])],
  confirmNewPassword: ['', v.combine([
    v.required('Please confirm your password'),
    v.match('newPassword', 'Passwords must match')
  ])]
});

// Display security settings
ReactiveUtils.effect(() => {
  const container = document.getElementById('security-settings');

  container.innerHTML = `
    <form onsubmit="updateSecurity(event)">
      <section>
        <h3>Change Email</h3>
        <div class="field">
          <label>New Email</label>
          <input type="email"
                 value="${securityForm.values.newEmail}"
                 oninput="securityForm.values.newEmail = this.value">
          ${securityForm.errors.newEmail ? `<span class="error">${securityForm.errors.newEmail}</span>` : ''}
        </div>

        <div class="field">
          <label>Confirm New Email</label>
          <input type="email"
                 value="${securityForm.values.confirmNewEmail}"
                 oninput="securityForm.values.confirmNewEmail = this.value"
                 onblur="securityForm.touch('confirmNewEmail')">
          ${securityForm.touched.confirmNewEmail && securityForm.errors.confirmNewEmail ? `
            <span class="error">${securityForm.errors.confirmNewEmail}</span>
          ` : ''}
        </div>
      </section>

      <section>
        <h3>Change Password</h3>
        <div class="field">
          <label>New Password</label>
          <input type="password"
                 value="${securityForm.values.newPassword}"
                 oninput="securityForm.values.newPassword = this.value">
          ${securityForm.errors.newPassword ? `<span class="error">${securityForm.errors.newPassword}</span>` : ''}
        </div>

        <div class="field">
          <label>Confirm New Password</label>
          <input type="password"
                 value="${securityForm.values.confirmNewPassword}"
                 oninput="securityForm.values.confirmNewPassword = this.value"
                 onblur="securityForm.touch('confirmNewPassword')">
          ${securityForm.touched.confirmNewPassword && securityForm.errors.confirmNewPassword ? `
            <span class="error">${securityForm.errors.confirmNewPassword}</span>
          ` : ''}
        </div>
      </section>

      <section>
        <h3>Confirm Changes</h3>
        <div class="field">
          <label>Current Password (required)</label>
          <input type="password"
                 value="${securityForm.values.currentPassword}"
                 oninput="securityForm.values.currentPassword = this.value">
          ${securityForm.errors.currentPassword ? `
            <span class="error">${securityForm.errors.currentPassword}</span>
          ` : ''}
        </div>
      </section>

      <button type="submit" ${!securityForm.isValid ? 'disabled' : ''}>
        Update Security Settings
      </button>
    </form>
  `;
});

async function updateSecurity(event) {
  event.preventDefault();

  securityForm.submit(async () => {
    const response = await fetch('/api/security/update', {
      method: 'POST',
      body: JSON.stringify(securityForm.values)
    });

    if (response.ok) {
      alert('Security settings updated!');
      securityForm.reset();
    }
  });
}
```

---

## Common Patterns

### Pattern 1: Password Confirmation

```javascript
const form = ReactiveUtils.form({
  password: ['', v.required()],
  confirmPassword: ['', v.match('password')]
});
```

### Pattern 2: Email Confirmation

```javascript
const form = ReactiveUtils.form({
  email: ['', v.email()],
  confirmEmail: ['', v.match('email', 'Emails must match')]
});
```

### Pattern 3: Combined Validation

```javascript
const form = ReactiveUtils.form({
  field: ['', v.required()],
  confirmField: ['', v.combine([
    v.required(),
    v.match('field', 'Fields must match')
  ])]
});
```

---

## Common Questions

### Q: When is it checked?

**Answer:** Every time either field changes:

```javascript
form.values.password = 'abc';
form.values.confirmPassword = 'xyz';
// confirmPassword error appears

form.values.password = 'xyz';
// confirmPassword error clears automatically
```

### Q: Case sensitive?

**Answer:** Yes, exact match:

```javascript
form.values.email = 'Test@email.com';
form.values.confirmEmail = 'test@email.com';
// Error: doesn't match
```

### Q: Can it match multiple fields?

**Answer:** No, matches one field only. For multiple, use custom validator.

---

## Summary

### What `validators.match()` Does:

1. ✅ Compares two fields
2. ✅ Exact match required
3. ✅ Updates automatically
4. ✅ Custom messages

### When to Use It:

- Password confirmation
- Email confirmation
- Repeated inputs
- Account changes

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({
  password: ['', v.required()],
  confirmPassword: ['', v.match('password', 'Must match')]
});
```

---

**Remember:** Use `v.match()` for field confirmation! 🎉
