# Understanding `validators.minLength()` - A Beginner's Guide

## What is `validators.minLength()`?

`validators.minLength(min)` is a built-in validator that checks if a string has at least a minimum number of characters.

Think of it as **minimum length enforcer** - value must be this long.

**Alias:** `v.minLength()` - Use either `validators.minLength()` or `v.minLength()`, they're identical.

---

## Why Does This Exist?

### The Problem: Enforcing Minimum Length

You need to ensure inputs meet minimum length requirements:

```javascript
// ❌ Without validator - manual check
if (password.length < 8) {
  errors.password = 'Password must be at least 8 characters';
}

// ✅ With minLength() - automatic
const form = ReactiveUtils.form(
  { password: '' },
  {
    validators: {
      password: v.minLength(8)
    }
  }
);
```

---

## How Does It Work?

```javascript
validators.minLength(min, message?)
    ↓
Checks value.length >= min
    ↓
Returns error message or null
```

---

## Basic Usage

### Simple Minimum Length

```javascript
const form = ReactiveUtils.form(
  {
    username: '',
    password: ''
  },
  {
    validators: {
      username: v.minLength(3),
      password: v.minLength(8)
    }
  }
);

form.setValue('username', 'ab');
console.log(form.errors.username); // 'Must be at least 3 characters'

form.setValue('username', 'john');
console.log(form.errors.username); // null (valid)
```

### Custom Error Message

```javascript
const form = ReactiveUtils.form(
  { password: '' },
  {
    validators: {
      password: v.minLength(8, 'Password must be at least 8 characters long')
    }
  }
);
```

---

## Simple Examples

### Example 1: Password Strength

```javascript
const form = ReactiveUtils.form(
  { password: '' },
  {
    validators: {
      password: v.combine([
        v.required('Password is required'),
        v.minLength(8, 'Password must be at least 8 characters'),
        v.maxLength(50, 'Password must be less than 50 characters')
      ])
    }
  }
);

// Display password strength
ReactiveUtils.effect(() => {
  const indicator = document.getElementById('password-strength');
  const password = form.values.password;

  if (password.length === 0) {
    indicator.innerHTML = '';
  } else if (password.length < 8) {
    indicator.innerHTML = '<span class="weak">Weak (too short)</span>';
  } else if (password.length < 12) {
    indicator.innerHTML = '<span class="medium">Medium</span>';
  } else {
    indicator.innerHTML = '<span class="strong">Strong</span>';
  }
});
```

### Example 2: Text Input Validation

```javascript
const form = ReactiveUtils.form(
  {
    title: '',
    description: ''
  },
  {
    validators: {
      title: v.combine([
        v.required(),
        v.minLength(5, 'Title must be at least 5 characters')
      ]),
      description: v.combine([
        v.required(),
        v.minLength(20, 'Description must be at least 20 characters')
      ])
    }
  }
);

// Character counter
ReactiveUtils.effect(() => {
  document.getElementById('title-count').textContent =
    `${form.values.title.length}/5 minimum`;
  document.getElementById('desc-count').textContent =
    `${form.values.description.length}/20 minimum`;
});
```

---

## Real-World Example: Blog Post Form

```javascript
const blogForm = ReactiveUtils.form(
  {
    title: '',
    excerpt: '',
    content: '',
    tags: ''
  },
  {
    validators: {
      title: v.combine([
        v.required('Title is required'),
        v.minLength(10, 'Title must be at least 10 characters'),
        v.maxLength(100, 'Title must be 100 characters or less')
      ]),
      excerpt: v.combine([
        v.required('Excerpt is required'),
        v.minLength(50, 'Excerpt must be at least 50 characters'),
        v.maxLength(300, 'Excerpt must be 300 characters or less')
      ]),
      content: v.combine([
        v.required('Content is required'),
        v.minLength(100, 'Content must be at least 100 characters')
      ]),
      tags: v.minLength(3, 'At least one tag is required (minimum 3 characters)')
    }
  }
);

// Display form with character counters
ReactiveUtils.effect(() => {
  const container = document.getElementById('blog-form');

  container.innerHTML = `
    <form onsubmit="saveBlogPost(event)">
      <div class="field">
        <label>Title *</label>
        <input type="text"
               value="${blogForm.values.title}"
               oninput="blogForm.setValue('title', this.value)"
               onblur="blogForm.setTouched('title')">
        <small>${blogForm.values.title.length}/100 characters (min 10)</small>
        ${blogForm.touched.title && blogForm.errors.title ? `
          <span class="error">${blogForm.errors.title}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Excerpt *</label>
        <textarea rows="3"
                  oninput="blogForm.setValue('excerpt', this.value)"
                  onblur="blogForm.setTouched('excerpt')">${blogForm.values.excerpt}</textarea>
        <small>${blogForm.values.excerpt.length}/300 characters (min 50)</small>
        ${blogForm.touched.excerpt && blogForm.errors.excerpt ? `
          <span class="error">${blogForm.errors.excerpt}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Content *</label>
        <textarea rows="10"
                  oninput="blogForm.setValue('content', this.value)"
                  onblur="blogForm.setTouched('content')">${blogForm.values.content}</textarea>
        <small>${blogForm.values.content.length} characters (min 100)</small>
        ${blogForm.touched.content && blogForm.errors.content ? `
          <span class="error">${blogForm.errors.content}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Tags</label>
        <input type="text"
               placeholder="javascript, web-development, react"
               value="${blogForm.values.tags}"
               oninput="blogForm.setValue('tags', this.value)">
        ${blogForm.errors.tags ? `
          <span class="error">${blogForm.errors.tags}</span>
        ` : ''}
      </div>

      <button type="submit" ${!blogForm.isValid ? 'disabled' : ''}>
        Publish Post
      </button>
    </form>
  `;
});

async function saveBlogPost(event) {
  event.preventDefault();

  await blogForm.submit(async (values) => {
    const response = await fetch('/api/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      alert('Blog post published!');
      blogForm.reset();
    }
  });
}
```

---

## Real-World Example 2: Username Validation

```javascript
const signupForm = ReactiveUtils.form(
  {
    username: '',
    bio: ''
  },
  {
    validators: {
      username: v.combine([
        v.required('Username is required'),
        v.minLength(3, 'Username must be at least 3 characters'),
        v.maxLength(20, 'Username must be 20 characters or less'),
        v.pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
      ]),
      bio: v.combine([
        v.minLength(10, 'Bio must be at least 10 characters'),
        v.maxLength(500, 'Bio must be 500 characters or less')
      ])
    }
  }
);

// Real-time validation feedback
ReactiveUtils.effect(() => {
  const usernameFeedback = document.getElementById('username-feedback');
  const username = signupForm.values.username;

  if (!username) {
    usernameFeedback.innerHTML = '';
  } else if (username.length < 3) {
    usernameFeedback.innerHTML = `<span class="warning">Need ${3 - username.length} more character(s)</span>`;
  } else if (signupForm.errors.username) {
    usernameFeedback.innerHTML = `<span class="error">${signupForm.errors.username}</span>`;
  } else {
    usernameFeedback.innerHTML = '<span class="success">✓ Username length OK</span>';
  }
});
```

---

## Common Patterns

### Pattern 1: Basic Minimum

```javascript
validators: {
  field: v.minLength(3)
}
```

### Pattern 2: With Required

```javascript
validators: {
  field: v.combine([
    v.required(),
    v.minLength(5)
  ])
}
```

### Pattern 3: Min and Max

```javascript
validators: {
  field: v.combine([
    v.minLength(3),
    v.maxLength(20)
  ])
}
```

### Pattern 4: With Pattern

```javascript
validators: {
  field: v.combine([
    v.required(),
    v.minLength(8),
    v.pattern(/[A-Z]/, 'Must contain uppercase')
  ])
}
```

---

## Common Questions

### Q: Does it count spaces?

**Answer:** Yes, all characters including spaces:

```javascript
form.setValue('field', '   '); // Length is 3
```

### Q: What about empty strings?

**Answer:** Empty strings have length 0 and will fail:

```javascript
form.setValue('field', ''); // Fails minLength check
```

### Q: Can I use it for optional fields?

**Answer:** Yes, combine with conditional logic or it will allow empty:

```javascript
// This allows empty OR minimum 8 characters
validators: {
  field: v.minLength(8)
}

// This requires field AND minimum 8 characters
validators: {
  field: v.combine([
    v.required(),
    v.minLength(8)
  ])
}
```

---

## Summary

### What `validators.minLength()` Does:

1. ✅ Checks minimum length
2. ✅ Returns error or null
3. ✅ Custom messages
4. ✅ Works with strings

### When to Use It:

- Password requirements
- Username validation
- Text content minimum
- Bio/description fields
- Any string with length requirement

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form(
  {
    username: '',
    password: ''
  },
  {
    validators: {
      username: v.minLength(3),
      password: v.minLength(8, 'Password too short')
    }
  }
);
```

---

**Remember:** Use `v.minLength()` for shorter code! 🎉