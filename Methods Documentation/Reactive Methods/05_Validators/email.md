# Understanding `validators.email()` - A Beginner's Guide

## What is `validators.email()`?

`validators.email()` is a built-in validator that checks if a field contains a valid email address format.

Think of it as **email format checker** - is this a valid email?

**Alias:** `v.email()` - Use either `validators.email()` or `v.email()`, they're identical.

---

## Why Does This Exist?

### The Problem: Validating Email Format

You need to ensure users enter valid email addresses:

```javascript
// ❌ Without validator - complex regex
const form = ReactiveUtils.form(
  { email: '' }
);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(form.values.email)) {
  form.setError('email', 'Invalid email');
}

// ✅ With email() - automatic
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: v.email()
    }
  }
);
```

**Why this matters:**
- Built-in email regex
- Automatic validation
- Consistent checking
- Custom error messages

---

## How Does It Work?

### The Email Validation Process

```javascript
validators.email()
    ↓
Checks email format
Uses regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    ↓
Returns error message or null
```

---

## Basic Usage

### Simple Email Validation

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: v.email()
    }
  }
);

form.setValue('email', 'invalid');
console.log(form.errors.email); // 'Invalid email address'

form.setValue('email', 'user@example.com');
console.log(form.errors.email); // null (valid)
```

### Custom Error Message

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: v.email('Please enter a valid email address')
    }
  }
);
```

### Combined with Required

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

---

## Simple Examples Explained

### Example 1: Newsletter Signup

```javascript
const signupForm = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: v.combine([
        v.required('Email is required'),
        v.email('Please enter a valid email')
      ])
    }
  }
);

// Display form
ReactiveUtils.effect(() => {
  const container = document.getElementById('signup');

  container.innerHTML = `
    <form onsubmit="handleSignup(event)">
      <input type="email"
             placeholder="Enter your email"
             value="${signupForm.values.email}"
             oninput="signupForm.setValue('email', this.value)"
             onblur="signupForm.setTouched('email')">
      ${signupForm.touched.email && signupForm.errors.email ? `
        <span class="error">${signupForm.errors.email}</span>
      ` : ''}
      <button type="submit" ${!signupForm.isValid ? 'disabled' : ''}>
        Subscribe
      </button>
    </form>
  `;
});

async function handleSignup(event) {
  event.preventDefault();

  if (signupForm.isValid) {
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: signupForm.values.email })
    });
    alert('Subscribed!');
  }
}
```

---

### Example 2: Registration Form

```javascript
const registrationForm = ReactiveUtils.form(
  {
    name: '',
    email: '',
    confirmEmail: ''
  },
  {
    validators: {
      name: v.required(),
      email: v.combine([
        v.required(),
        v.email()
      ]),
      confirmEmail: v.combine([
        v.required(),
        v.email(),
        v.match('email', 'Emails must match')
      ])
    }
  }
);

// Bind to form
registrationForm.bindToInputs('#registration-form input');

// Display validation status
ReactiveUtils.effect(() => {
  const status = document.getElementById('email-status');

  if (registrationForm.values.email) {
    if (registrationForm.errors.email) {
      status.innerHTML = '<span class="invalid">✗ Invalid email</span>';
    } else {
      status.innerHTML = '<span class="valid">✓ Valid email</span>';
    }
  } else {
    status.innerHTML = '';
  }
});
```

---

## Real-World Example: Contact Form with Multiple Emails

```javascript
const contactForm = ReactiveUtils.form(
  {
    name: '',
    primaryEmail: '',
    ccEmail: '',
    subject: '',
    message: ''
  },
  {
    validators: {
      name: v.required('Name is required'),
      primaryEmail: v.combine([
        v.required('Primary email is required'),
        v.email('Invalid primary email')
      ]),
      ccEmail: v.email('Invalid CC email'), // Optional but must be valid if provided
      subject: v.required('Subject is required'),
      message: v.required('Message is required')
    }
  }
);

// Display form
ReactiveUtils.effect(() => {
  const container = document.getElementById('contact-form');

  container.innerHTML = `
    <form onsubmit="handleContact(event)">
      <div class="field">
        <label>Name *</label>
        <input type="text"
               value="${contactForm.values.name}"
               oninput="contactForm.setValue('name', this.value)">
        ${contactForm.errors.name ? `<span class="error">${contactForm.errors.name}</span>` : ''}
      </div>

      <div class="field">
        <label>Email *</label>
        <input type="email"
               value="${contactForm.values.primaryEmail}"
               oninput="contactForm.setValue('primaryEmail', this.value)"
               onblur="contactForm.setTouched('primaryEmail')">
        ${contactForm.touched.primaryEmail && contactForm.errors.primaryEmail ? `
          <span class="error">${contactForm.errors.primaryEmail}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>CC Email (optional)</label>
        <input type="email"
               value="${contactForm.values.ccEmail}"
               oninput="contactForm.setValue('ccEmail', this.value)"
               onblur="contactForm.setTouched('ccEmail')">
        ${contactForm.touched.ccEmail && contactForm.errors.ccEmail ? `
          <span class="error">${contactForm.errors.ccEmail}</span>
        ` : ''}
        <small>Send a copy to another email</small>
      </div>

      <div class="field">
        <label>Subject *</label>
        <input type="text"
               value="${contactForm.values.subject}"
               oninput="contactForm.setValue('subject', this.value)">
        ${contactForm.errors.subject ? `<span class="error">${contactForm.errors.subject}</span>` : ''}
      </div>

      <div class="field">
        <label>Message *</label>
        <textarea rows="5"
                  oninput="contactForm.setValue('message', this.value)">${contactForm.values.message}</textarea>
        ${contactForm.errors.message ? `<span class="error">${contactForm.errors.message}</span>` : ''}
      </div>

      <button type="submit" ${!contactForm.isValid ? 'disabled' : ''}>
        Send Message
      </button>
    </form>
  `;
});

async function handleContact(event) {
  event.preventDefault();

  await contactForm.submit(async (values) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      alert('Message sent successfully!');
      contactForm.reset();
    }
  });
}
```

---

## Common Patterns

### Pattern 1: Basic Email

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: v.email()
    }
  }
);
```

### Pattern 2: Required Email

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: v.combine([
        v.required(),
        v.email()
      ])
    }
  }
);
```

### Pattern 3: Optional but Valid

```javascript
const form = ReactiveUtils.form(
  { optionalEmail: '' },
  {
    validators: {
      optionalEmail: v.email() // Empty is OK, but if filled must be valid
    }
  }
);
```

### Pattern 4: Email Confirmation

```javascript
const form = ReactiveUtils.form(
  {
    email: '',
    confirmEmail: ''
  },
  {
    validators: {
      email: v.combine([v.required(), v.email()]),
      confirmEmail: v.combine([v.required(), v.email(), v.match('email')])
    }
  }
);
```

---

## Common Questions

### Q: What email formats are valid?

**Answer:** Standard email format:

```javascript
// Valid
'user@example.com'
'name.lastname@company.co.uk'
'test+tag@domain.org'

// Invalid
'invalid'
'@example.com'
'user@'
'user @example.com' (space)
```

### Q: Does it check if email exists?

**Answer:** No, only format validation:

```javascript
// Format is valid, but email might not exist
form.setValue('email', 'fake@nonexistent.com');
console.log(form.errors.email); // null (format is valid)
```

### Q: Can I use custom regex?

**Answer:** Yes, use `pattern()` validator:

```javascript
v.pattern(/your-regex/, 'Custom email error')
```

---

## Summary

### What `validators.email()` Does:

1. ✅ Validates email format
2. ✅ Uses standard regex
3. ✅ Returns error or null
4. ✅ Custom messages
5. ✅ Format only (not existence)

### When to Use It:

- Email inputs
- Contact forms
- Registration
- Newsletter signup
- Any email field

### The Basic Pattern:

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

// Check validation
if (!form.errors.email) {
  console.log('Valid email');
}
```

---

**Remember:** Use `v.email()` (alias) for shorter code! 🎉