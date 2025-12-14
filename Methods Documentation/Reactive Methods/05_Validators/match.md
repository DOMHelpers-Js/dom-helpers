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
const form = ReactiveUtils.form(
  {
    password: '',
    confirmPassword: ''
  },
  {
    validators: {
      password: v.required(),
      confirmPassword: v.match('password')
    }
  }
);
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
const form = ReactiveUtils.form(
  {
    password: '',
    confirmPassword: ''
  },
  {
    validators: {
      password: v.required(),
      confirmPassword: v.match('password', 'Passwords must match')
    }
  }
);

form.setValue('password', 'secret123');
form.setValue('confirmPassword', 'secret456');
console.log(form.errors.confirmPassword); // 'Passwords must match'

form.setValue('confirmPassword', 'secret123');
console.log(form.errors.confirmPassword); // null (valid)
```

### Email Confirmation

```javascript
const form = ReactiveUtils.form(
  {
    email: '',
    confirmEmail: ''
  },
  {
    validators: {
      email: v.email(),
      confirmEmail: v.match('email', 'Emails must match')
    }
  }
);
```

---

## Simple Examples

### Example 1: Registration Form

```javascript
const registrationForm = ReactiveUtils.form(
  {
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  },
  {
    validators: {
      email: v.combine([
        v.required(),
        v.email()
      ]),
      confirmEmail: v.combine([
        v.required(),
        v.email(),
        v.match('email', 'Emails must match')
      ]),
      password: v.combine([
        v.required(),
        v.minLength(8)
      ]),
      confirmPassword: v.combine([
        v.required(),
        v.match('password', 'Passwords must match')
      ])
    }
  }
);

// Display form
ReactiveUtils.effect(() => {
  const container = document.getElementById('registration');

  container.innerHTML = `
    <form onsubmit="handleRegister(event)">
      <div class="field">
        <label>Email *</label>
        <input type="email" placeholder="Email"
               value="${registrationForm.values.email}"
               oninput="registrationForm.setValue('email', this.value)">
        ${registrationForm.errors.email ? `
          <span class="error">${registrationForm.errors.email}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Confirm Email *</label>
        <input type="email" placeholder="Confirm Email"
               value="${registrationForm.values.confirmEmail}"
               oninput="registrationForm.setValue('confirmEmail', this.value)"
               onblur="registrationForm.setTouched('confirmEmail')">
        ${registrationForm.touched.confirmEmail && registrationForm.errors.confirmEmail ? `
          <span class="error">${registrationForm.errors.confirmEmail}</span>
        ` : registrationForm.values.confirmEmail && !registrationForm.errors.confirmEmail ? `
          <span class="success">✓ Emails match</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Password *</label>
        <input type="password" placeholder="Password"
               value="${registrationForm.values.password}"
               oninput="registrationForm.setValue('password', this.value)">
        ${registrationForm.errors.password ? `
          <span class="error">${registrationForm.errors.password}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Confirm Password *</label>
        <input type="password" placeholder="Confirm Password"
               value="${registrationForm.values.confirmPassword}"
               oninput="registrationForm.setValue('confirmPassword', this.value)"
               onblur="registrationForm.setTouched('confirmPassword')">
        ${registrationForm.touched.confirmPassword && registrationForm.errors.confirmPassword ? `
          <span class="error">${registrationForm.errors.confirmPassword}</span>
        ` : registrationForm.values.confirmPassword && !registrationForm.errors.confirmPassword ? `
          <span class="success">✓ Passwords match</span>
        ` : ''}
      </div>

      <button type="submit" ${!registrationForm.isValid ? 'disabled' : ''}>
        Register
      </button>
    </form>
  `;
});

async function handleRegister(event) {
  event.preventDefault();

  await registrationForm.submit(async (values) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      alert('Registration successful!');
    }
  });
}
```

---

## Real-World Example: Change Password Form

```javascript
const changePasswordForm = ReactiveUtils.form(
  {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  },
  {
    validators: {
      currentPassword: v.required('Current password is required'),
      newPassword: v.combine([
        v.required('New password is required'),
        v.minLength(8, 'Password must be at least 8 characters'),
        v.pattern(/[A-Z]/, 'Must contain uppercase letter'),
        v.pattern(/[a-z]/, 'Must contain lowercase letter'),
        v.pattern(/[0-9]/, 'Must contain number')
      ]),
      confirmNewPassword: v.combine([
        v.required('Please confirm your new password'),
        v.match('newPassword', 'Passwords must match')
      ])
    }
  }
);

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

// Display form
ReactiveUtils.effect(() => {
  const container = document.getElementById('change-password-form');

  container.innerHTML = `
    <form onsubmit="handleChangePassword(event)">
      <div class="field">
        <label>Current Password *</label>
        <input type="password"
               value="${changePasswordForm.values.currentPassword}"
               oninput="changePasswordForm.setValue('currentPassword', this.value)">
        ${changePasswordForm.errors.currentPassword ? `
          <span class="error">${changePasswordForm.errors.currentPassword}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>New Password *</label>
        <input type="password"
               value="${changePasswordForm.values.newPassword}"
               oninput="changePasswordForm.setValue('newPassword', this.value)">
        ${changePasswordForm.errors.newPassword ? `
          <span class="error">${changePasswordForm.errors.newPassword}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Confirm New Password *</label>
        <input type="password"
               value="${changePasswordForm.values.confirmNewPassword}"
               oninput="changePasswordForm.setValue('confirmNewPassword', this.value)"
               onblur="changePasswordForm.setTouched('confirmNewPassword')">
        <div id="match-indicator"></div>
        ${changePasswordForm.touched.confirmNewPassword && changePasswordForm.errors.confirmNewPassword ? `
          <span class="error">${changePasswordForm.errors.confirmNewPassword}</span>
        ` : ''}
      </div>

      <button type="submit" ${!changePasswordForm.isValid ? 'disabled' : ''}>
        Change Password
      </button>
    </form>
  `;
});
```

---

## Real-World Example 2: Account Security Settings

```javascript
const securityForm = ReactiveUtils.form(
  {
    // Current authentication
    currentPassword: '',
    // New email
    newEmail: '',
    confirmNewEmail: '',
    // New password
    newPassword: '',
    confirmNewPassword: ''
  },
  {
    validators: {
      currentPassword: v.required('Please enter your current password'),
      newEmail: v.combine([
        v.required('Email is required'),
        v.email('Invalid email format')
      ]),
      confirmNewEmail: v.combine([
        v.required('Please confirm your email'),
        v.email('Invalid email format'),
        v.match('newEmail', 'Email addresses must match')
      ]),
      newPassword: v.combine([
        v.required('Password is required'),
        v.minLength(8, 'Password must be at least 8 characters'),
        v.pattern(/[A-Z]/, 'Must contain at least one uppercase letter'),
        v.pattern(/[0-9]/, 'Must contain at least one number')
      ]),
      confirmNewPassword: v.combine([
        v.required('Please confirm your password'),
        v.match('newPassword', 'Passwords must match')
      ])
    }
  }
);

// Display security settings
ReactiveUtils.effect(() => {
  const container = document.getElementById('security-settings');

  container.innerHTML = `
    <form onsubmit="updateSecurity(event)">
      <section>
        <h3>Change Email</h3>
        <div class="field">
          <label>New Email *</label>
          <input type="email"
                 value="${securityForm.values.newEmail}"
                 oninput="securityForm.setValue('newEmail', this.value)">
          ${securityForm.errors.newEmail ? `
            <span class="error">${securityForm.errors.newEmail}</span>
          ` : ''}
        </div>

        <div class="field">
          <label>Confirm New Email *</label>
          <input type="email"
                 value="${securityForm.values.confirmNewEmail}"
                 oninput="securityForm.setValue('confirmNewEmail', this.value)"
                 onblur="securityForm.setTouched('confirmNewEmail')">
          ${securityForm.touched.confirmNewEmail && securityForm.errors.confirmNewEmail ? `
            <span class="error">${securityForm.errors.confirmNewEmail}</span>
          ` : securityForm.values.confirmNewEmail && !securityForm.errors.confirmNewEmail ? `
            <span class="success">✓ Email addresses match</span>
          ` : ''}
        </div>
      </section>

      <section>
        <h3>Change Password</h3>
        <div class="field">
          <label>New Password *</label>
          <input type="password"
                 value="${securityForm.values.newPassword}"
                 oninput="securityForm.setValue('newPassword', this.value)">
          ${securityForm.errors.newPassword ? `
            <span class="error">${securityForm.errors.newPassword}</span>
          ` : ''}
        </div>

        <div class="field">
          <label>Confirm New Password *</label>
          <input type="password"
                 value="${securityForm.values.confirmNewPassword}"
                 oninput="securityForm.setValue('confirmNewPassword', this.value)"
                 onblur="securityForm.setTouched('confirmNewPassword')">
          ${securityForm.touched.confirmNewPassword && securityForm.errors.confirmNewPassword ? `
            <span class="error">${securityForm.errors.confirmNewPassword}</span>
          ` : securityForm.values.confirmNewPassword && !securityForm.errors.confirmNewPassword ? `
            <span class="success">✓ Passwords match</span>
          ` : ''}
        </div>
      </section>

      <section>
        <h3>Confirm Changes</h3>
        <div class="field">
          <label>Current Password (required) *</label>
          <input type="password"
                 value="${securityForm.values.currentPassword}"
                 oninput="securityForm.setValue('currentPassword', this.value)">
          ${securityForm.errors.currentPassword ? `
            <span class="error">${securityForm.errors.currentPassword}</span>
          ` : ''}
          <small>Enter your current password to confirm changes</small>
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

  await securityForm.submit(async (values) => {
    const response = await fetch('/api/security/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      alert('Security settings updated!');
      securityForm.reset();
    }
  });
}
```

---

## Real-World Example 3: Bank Account Transfer Confirmation

```javascript
const transferForm = ReactiveUtils.form(
  {
    accountNumber: '',
    confirmAccountNumber: '',
    amount: 0,
    confirmAmount: 0
  },
  {
    validators: {
      accountNumber: v.combine([
        v.required('Account number is required'),
        v.pattern(/^\d{10,12}$/, 'Account number must be 10-12 digits')
      ]),
      confirmAccountNumber: v.combine([
        v.required('Please confirm account number'),
        v.match('accountNumber', 'Account numbers must match')
      ]),
      amount: v.combine([
        v.required('Amount is required'),
        v.min(0.01, 'Amount must be at least $0.01')
      ]),
      confirmAmount: v.combine([
        v.required('Please confirm amount'),
        v.match('amount', 'Amounts must match')
      ])
    }
  }
);

// Real-time match validation with visual feedback
ReactiveUtils.effect(() => {
  const accountMatch = document.getElementById('account-match');
  const amountMatch = document.getElementById('amount-match');

  // Account number match indicator
  if (transferForm.values.confirmAccountNumber) {
    if (transferForm.values.accountNumber === transferForm.values.confirmAccountNumber) {
      accountMatch.innerHTML = '<span class="success">✓ Account numbers match</span>';
    } else {
      accountMatch.innerHTML = '<span class="error">✗ Account numbers do not match</span>';
    }
  } else {
    accountMatch.innerHTML = '';
  }

  // Amount match indicator
  if (transferForm.values.confirmAmount > 0) {
    if (transferForm.values.amount === transferForm.values.confirmAmount) {
      amountMatch.innerHTML = '<span class="success">✓ Amounts match</span>';
    } else {
      amountMatch.innerHTML = '<span class="error">✗ Amounts do not match</span>';
    }
  } else {
    amountMatch.innerHTML = '';
  }
});
```

---

## Common Patterns

### Pattern 1: Password Confirmation

```javascript
validators: {
  password: v.required(),
  confirmPassword: v.match('password')
}
```

### Pattern 2: Email Confirmation

```javascript
validators: {
  email: v.email(),
  confirmEmail: v.match('email', 'Emails must match')
}
```

### Pattern 3: Combined Validation

```javascript
validators: {
  field: v.required(),
  confirmField: v.combine([
    v.required(),
    v.match('field', 'Fields must match')
  ])
}
```

### Pattern 4: Multiple Matches

```javascript
validators: {
  email: v.email(),
  confirmEmail: v.match('email'),
  password: v.minLength(8),
  confirmPassword: v.match('password')
}
```

---

## Common Questions

### Q: When is it checked?

**Answer:** Every time either field changes:

```javascript
form.setValue('password', 'abc');
form.setValue('confirmPassword', 'xyz');
// confirmPassword error appears

form.setValue('password', 'xyz');
// confirmPassword error clears automatically
```

### Q: Case sensitive?

**Answer:** Yes, exact match:

```javascript
form.setValue('email', 'Test@email.com');
form.setValue('confirmEmail', 'test@email.com');
// Error: doesn't match
```

### Q: Can it match multiple fields?

**Answer:** No, matches one field only. For multiple, use custom validator:

```javascript
v.custom((value, allValues) => {
  if (value !== allValues.field1 && value !== allValues.field2) {
    return 'Must match one of the fields';
  }
  return null;
})
```

### Q: Does it trigger when the original field changes?

**Answer:** Yes! The match validator re-runs when either field updates:

```javascript
// User types password
form.setValue('password', 'newpass123');
// Confirm field automatically re-validates
```

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
- Any duplicate entry validation

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form(
  {
    password: '',
    confirmPassword: ''
  },
  {
    validators: {
      password: v.required(),
      confirmPassword: v.match('password', 'Must match')
    }
  }
);
```

---

**Remember:** Use `v.match()` for field confirmation! 🎉