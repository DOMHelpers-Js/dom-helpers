# Understanding `validators.combine()` - A Beginner's Guide

## What is `validators.combine()`?

`validators.combine(validators)` is a built-in validator that combines multiple validators into one. It runs all validators and returns the first error found.

Think of it as **validator combiner** - apply multiple rules to one field.

**Alias:** `v.combine()` - Use either `validators.combine()` or `v.combine()`, they're identical.

---

## Why Does This Exist?

### The Problem: Multiple Validation Rules

You need to apply several validation rules to a single field:

```javascript
// ❌ Without combine - can only use one validator
const form = ReactiveUtils.form(
  { password: '' },
  {
    validators: {
      password: v.required() // Can't add minLength too
    }
  }
);

// ✅ With combine() - multiple validators
const form = ReactiveUtils.form(
  { password: '' },
  {
    validators: {
      password: v.combine([
        v.required('Password is required'),
        v.minLength(8, 'Password must be at least 8 characters'),
        v.pattern(/[A-Z]/, 'Must contain uppercase letter')
      ])
    }
  }
);
```

---

## How Does It Work?

### The Combine Process

```javascript
validators.combine([validator1, validator2, validator3])
    ↓
Runs each validator in order
    ↓
Returns first error found, or null if all pass
```

---

## Basic Usage

### Password Validation

```javascript
const form = ReactiveUtils.form(
  { password: '' },
  {
    validators: {
      password: v.combine([
        v.required(),
        v.minLength(8),
        v.maxLength(50)
      ])
    }
  }
);
```

### Email with Required

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: v.combine([
        v.required('Email is required'),
        v.email('Invalid email format')
      ])
    }
  }
);
```

### Complete Field Validation

```javascript
const form = ReactiveUtils.form(
  { username: '' },
  {
    validators: {
      username: v.combine([
        v.required('Username is required'),
        v.minLength(3, 'At least 3 characters'),
        v.maxLength(20, 'Maximum 20 characters'),
        v.pattern(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only')
      ])
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
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  {
    validators: {
      username: v.combine([
        v.required('Username is required'),
        v.minLength(3, 'Username must be at least 3 characters'),
        v.maxLength(20, 'Username must be 20 characters or less'),
        v.pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
      ]),

      email: v.combine([
        v.required('Email is required'),
        v.email('Please enter a valid email address')
      ]),

      password: v.combine([
        v.required('Password is required'),
        v.minLength(8, 'Password must be at least 8 characters'),
        v.pattern(/[A-Z]/, 'Password must contain at least one uppercase letter'),
        v.pattern(/[a-z]/, 'Password must contain at least one lowercase letter'),
        v.pattern(/[0-9]/, 'Password must contain at least one number'),
        v.pattern(/[!@#$%^&*]/, 'Password must contain at least one special character')
      ]),

      confirmPassword: v.combine([
        v.required('Please confirm your password'),
        v.match('password', 'Passwords must match')
      ])
    }
  }
);
```

---

### Example 2: Product Form

```javascript
const productForm = ReactiveUtils.form(
  {
    name: '',
    price: 0,
    sku: '',
    stock: 0
  },
  {
    validators: {
      name: v.combine([
        v.required('Product name is required'),
        v.minLength(3, 'Product name must be at least 3 characters'),
        v.maxLength(100, 'Product name must be 100 characters or less')
      ]),

      price: v.combine([
        v.required('Price is required'),
        v.min(0.01, 'Price must be at least $0.01'),
        v.max(999999.99, 'Price must be less than $1,000,000')
      ]),

      sku: v.combine([
        v.required('SKU is required'),
        v.pattern(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens'),
        v.minLength(6, 'SKU must be at least 6 characters'),
        v.maxLength(20, 'SKU must be 20 characters or less')
      ]),

      stock: v.combine([
        v.required('Stock quantity is required'),
        v.min(0, 'Stock cannot be negative'),
        v.max(10000, 'Stock cannot exceed 10,000')
      ])
    }
  }
);
```

---

## Real-World Example: Complex User Profile Form

```javascript
const profileForm = ReactiveUtils.form(
  {
    // Personal Information
    firstName: '',
    lastName: '',
    // Contact Information
    phone: '',
    email: '',
    // Address
    zipCode: '',
    // Bio
    bio: '',
    // Age
    age: 0,
    // Website
    website: '',
    // Password Change
    newPassword: '',
    confirmNewPassword: ''
  },
  {
    validators: {
      firstName: v.combine([
        v.required('First name is required'),
        v.minLength(2, 'First name must be at least 2 characters'),
        v.maxLength(50, 'First name must be 50 characters or less'),
        v.pattern(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens, and apostrophes allowed')
      ]),

      lastName: v.combine([
        v.required('Last name is required'),
        v.minLength(2, 'Last name must be at least 2 characters'),
        v.maxLength(50, 'Last name must be 50 characters or less'),
        v.pattern(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens, and apostrophes allowed')
      ]),

      phone: v.combine([
        v.required('Phone number is required'),
        v.pattern(/^\(\d{3}\) \d{3}-\d{4}$/, 'Format: (123) 456-7890')
      ]),

      email: v.combine([
        v.required('Email is required'),
        v.email('Please enter a valid email address'),
        v.custom(async (value) => {
          // Check if email is available
          const response = await fetch(`/api/check-email?email=${value}`);
          const { available } = await response.json();
          return available ? null : 'Email is already in use';
        })
      ]),

      zipCode: v.combine([
        v.required('ZIP code is required'),
        v.pattern(/^\d{5}(-\d{4})?$/, 'Format: 12345 or 12345-6789')
      ]),

      bio: v.combine([
        v.minLength(10, 'Bio must be at least 10 characters'),
        v.maxLength(500, 'Bio must be 500 characters or less')
      ]),

      age: v.combine([
        v.required('Age is required'),
        v.min(18, 'You must be at least 18 years old'),
        v.max(120, 'Please enter a valid age')
      ]),

      website: v.combine([
        v.pattern(/^https?:\/\/.+\..+/, 'Please enter a valid URL'),
        v.maxLength(200, 'URL must be 200 characters or less')
      ]),

      newPassword: v.combine([
        v.minLength(8, 'Password must be at least 8 characters'),
        v.pattern(/[A-Z]/, 'Must contain at least one uppercase letter'),
        v.pattern(/[a-z]/, 'Must contain at least one lowercase letter'),
        v.pattern(/[0-9]/, 'Must contain at least one number'),
        v.pattern(/[!@#$%^&*]/, 'Must contain at least one special character (!@#$%^&*)')
      ]),

      confirmNewPassword: v.combine([
        v.match('newPassword', 'Passwords must match')
      ])
    }
  }
);

// Display form with validation
ReactiveUtils.effect(() => {
  const container = document.getElementById('profile-form');

  container.innerHTML = `
    <form onsubmit="saveProfile(event)">
      <section>
        <h3>Personal Information</h3>
        <div class="field">
          <label>First Name *</label>
          <input type="text"
                 value="${profileForm.values.firstName}"
                 oninput="profileForm.setValue('firstName', this.value)"
                 onblur="profileForm.setTouched('firstName')">
          ${profileForm.touched.firstName && profileForm.errors.firstName ? `
            <span class="error">${profileForm.errors.firstName}</span>
          ` : ''}
        </div>

        <div class="field">
          <label>Age *</label>
          <input type="number"
                 value="${profileForm.values.age}"
                 oninput="profileForm.setValue('age', parseInt(this.value) || 0)">
          ${profileForm.errors.age ? `
            <span class="error">${profileForm.errors.age}</span>
          ` : ''}
        </div>
      </section>

      <section>
        <h3>Contact Information</h3>
        <div class="field">
          <label>Email *</label>
          <input type="email"
                 value="${profileForm.values.email}"
                 oninput="profileForm.setValue('email', this.value)"
                 onblur="profileForm.setTouched('email')">
          ${profileForm.touched.email && profileForm.errors.email ? `
            <span class="error">${profileForm.errors.email}</span>
          ` : ''}
        </div>

        <div class="field">
          <label>Phone *</label>
          <input type="tel"
                 placeholder="(123) 456-7890"
                 value="${profileForm.values.phone}"
                 oninput="profileForm.setValue('phone', this.value)">
          ${profileForm.errors.phone ? `
            <span class="error">${profileForm.errors.phone}</span>
          ` : ''}
        </div>
      </section>

      <button type="submit" ${!profileForm.isValid ? 'disabled' : ''}>
        Save Profile
      </button>
    </form>
  `;
});

async function saveProfile(event) {
  event.preventDefault();

  await profileForm.submit(async (values) => {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      alert('Profile updated successfully!');
    }
  });
}
```

---

## Common Patterns

### Pattern 1: Required + Format

```javascript
validators: {
  field: v.combine([
    v.required(),
    v.email()
  ])
}
```

### Pattern 2: Length Range

```javascript
validators: {
  field: v.combine([
    v.minLength(3),
    v.maxLength(20)
  ])
}
```

### Pattern 3: Value Range

```javascript
validators: {
  field: v.combine([
    v.min(0),
    v.max(100)
  ])
}
```

### Pattern 4: Multiple Rules

```javascript
validators: {
  field: v.combine([
    v.required(),
    v.minLength(8),
    v.pattern(/[A-Z]/),
    v.pattern(/[0-9]/)
  ])
}
```

---

## Common Questions

### Q: What order do validators run?

**Answer:** In array order, stops at first error:

```javascript
v.combine([
  v.required(),     // Runs first
  v.minLength(8),   // Runs second (if first passes)
  v.pattern(/.../)  // Runs third (if first two pass)
])
```

### Q: Can I combine custom validators?

**Answer:** Yes! Mix any validators:

```javascript
v.combine([
  v.required(),
  v.custom((value) => ...),
  v.email()
])
```

### Q: Returns all errors or first?

**Answer:** Returns FIRST error only:

```javascript
// If required fails, minLength won't even run
v.combine([
  v.required('Required'),
  v.minLength(8, 'Too short')
])
```

---

## Summary

### What `validators.combine()` Does:

1. ✅ Combines multiple validators
2. ✅ Runs in order
3. ✅ Returns first error
4. ✅ Stops on first failure

### When to Use It:

- Multiple validation rules
- Complex field validation
- Layered checks
- Required + format validation

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form(
  { field: '' },
  {
    validators: {
      field: v.combine([
        v.required(),
        v.minLength(5),
        v.maxLength(20),
        v.pattern(/regex/)
      ])
    }
  }
);
```

---

**Remember:** Use `v.combine()` to apply multiple validation rules! 🎉