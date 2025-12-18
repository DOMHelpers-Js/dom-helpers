# Understanding `validators.maxLength()` - A Beginner's Guide

## What is `validators.maxLength()`?

`validators.maxLength(max)` is a built-in validator that checks if a string doesn't exceed a maximum number of characters.

Think of it as **maximum length enforcer** - value can't be longer than this.

**Alias:** `v.maxLength()` - Use either `validators.maxLength()` or `v.maxLength()`, they're identical.

---

## Why Does This Exist?

### The Problem: Limiting Input Length

You need to ensure inputs don't exceed maximum length:

```javascript
// ❌ Without validator - manual check
if (username.length > 20) {
  errors.username = 'Username must be 20 characters or less';
}

// ✅ With maxLength() - automatic
const form = ReactiveUtils.form(
  { username: '' },
  {
    validators: {
      username: v.maxLength(20)
    }
  }
);
```

---

## How Does It Work?

```javascript
validators.maxLength(max, message?)
    ↓
Checks value.length <= max
    ↓
Returns error message or null
```

---

## Basic Usage

### Simple Maximum Length

```javascript
const form = ReactiveUtils.form(
  {
    username: '',
    bio: ''
  },
  {
    validators: {
      username: v.maxLength(20),
      bio: v.maxLength(500)
    }
  }
);

form.setValue('username', 'thisusernameiswaytoolong');
console.log(form.errors.username); // 'Must be 20 characters or less'
```

### Custom Error Message

```javascript
const form = ReactiveUtils.form(
  { comment: '' },
  {
    validators: {
      comment: v.maxLength(200, 'Comment must be 200 characters or less')
    }
  }
);
```

---

## Simple Examples

### Example 1: Character Counter

```javascript
const form = ReactiveUtils.form(
  { bio: '' },
  {
    validators: {
      bio: v.maxLength(500)
    }
  }
);

ReactiveUtils.effect(() => {
  const counter = document.getElementById('char-counter');
  const remaining = 500 - form.values.bio.length;

  counter.textContent = `${remaining} characters remaining`;
  counter.className = remaining < 50 ? 'warning' : '';
});
```

### Example 2: Tweet-like Input

```javascript
const tweetForm = ReactiveUtils.form(
  { message: '' },
  {
    validators: {
      message: v.combine([
        v.required(),
        v.maxLength(280, 'Message must be 280 characters or less')
      ])
    }
  }
);

ReactiveUtils.effect(() => {
  const counter = document.getElementById('tweet-counter');
  const length = tweetForm.values.message.length;

  counter.textContent = `${length}/280`;
  counter.className = length > 280 ? 'over-limit' : '';
});
```

---

## Real-World Example: Social Media Post

```javascript
const postForm = ReactiveUtils.form(
  {
    title: '',
    content: '',
    hashtags: ''
  },
  {
    validators: {
      title: v.combine([
        v.required('Title is required'),
        v.maxLength(100, 'Title must be 100 characters or less')
      ]),
      content: v.combine([
        v.required('Content is required'),
        v.maxLength(280, 'Content must be 280 characters or less')
      ]),
      hashtags: v.maxLength(100, 'Hashtags must be 100 characters or less')
    }
  }
);

// Display form with character counters
ReactiveUtils.effect(() => {
  const container = document.getElementById('post-form');

  container.innerHTML = `
    <form onsubmit="createPost(event)">
      <div class="field">
        <label>Title *</label>
        <input type="text"
               value="${postForm.values.title}"
               oninput="postForm.setValue('title', this.value)"
               onblur="postForm.setTouched('title')">
        <div class="char-counter ${postForm.values.title.length > 100 ? 'over' : ''}">
          ${postForm.values.title.length}/100
        </div>
        ${postForm.touched.title && postForm.errors.title ? `
          <span class="error">${postForm.errors.title}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>What's on your mind? *</label>
        <textarea rows="4"
                  oninput="postForm.setValue('content', this.value)"
                  onblur="postForm.setTouched('content')">${postForm.values.content}</textarea>
        <div class="char-counter ${postForm.values.content.length > 280 ? 'over' : ''}">
          ${postForm.values.content.length}/280
        </div>
        ${postForm.touched.content && postForm.errors.content ? `
          <span class="error">${postForm.errors.content}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Hashtags (optional)</label>
        <input type="text"
               placeholder="#javascript #webdev"
               value="${postForm.values.hashtags}"
               oninput="postForm.setValue('hashtags', this.value)">
        <small>${postForm.values.hashtags.length}/100</small>
        ${postForm.errors.hashtags ? `
          <span class="error">${postForm.errors.hashtags}</span>
        ` : ''}
      </div>

      <button type="submit" ${!postForm.isValid ? 'disabled' : ''}>
        Post
      </button>
    </form>
  `;
});

async function createPost(event) {
  event.preventDefault();

  await postForm.submit(async (values) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      alert('Post created!');
      postForm.reset();
    }
  });
}
```

---

## Real-World Example 2: Product Review Form

```javascript
const reviewForm = ReactiveUtils.form(
  {
    title: '',
    review: '',
    pros: '',
    cons: ''
  },
  {
    validators: {
      title: v.combine([
        v.required('Title is required'),
        v.minLength(5, 'Title must be at least 5 characters'),
        v.maxLength(60, 'Title must be 60 characters or less')
      ]),
      review: v.combine([
        v.required('Review is required'),
        v.minLength(50, 'Review must be at least 50 characters'),
        v.maxLength(1000, 'Review must be 1000 characters or less')
      ]),
      pros: v.maxLength(500, 'Pros must be 500 characters or less'),
      cons: v.maxLength(500, 'Cons must be 500 characters or less')
    }
  }
);

// Visual progress indicator
ReactiveUtils.effect(() => {
  const progress = document.getElementById('review-progress');
  const reviewLength = reviewForm.values.review.length;
  const percentage = Math.min(100, (reviewLength / 1000) * 100);

  progress.innerHTML = `
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${percentage}%"></div>
    </div>
    <span>${reviewLength}/1000 characters</span>
  `;
});
```

---

## Real-World Example 3: Comment System

```javascript
const commentForm = ReactiveUtils.form(
  { comment: '' },
  {
    validators: {
      comment: v.combine([
        v.required('Comment cannot be empty'),
        v.minLength(3, 'Comment must be at least 3 characters'),
        v.maxLength(500, 'Comment must be 500 characters or less')
      ])
    }
  }
);

// Real-time character counter with warnings
ReactiveUtils.effect(() => {
  const counter = document.getElementById('comment-counter');
  const length = commentForm.values.comment.length;
  const remaining = 500 - length;

  let className = '';
  let message = '';

  if (length === 0) {
    message = '500 characters available';
  } else if (remaining > 100) {
    message = `${remaining} characters remaining`;
  } else if (remaining > 0) {
    className = 'warning';
    message = `${remaining} characters remaining`;
  } else {
    className = 'error';
    message = `${Math.abs(remaining)} characters over limit`;
  }

  counter.className = className;
  counter.textContent = message;
});
```

---

## Common Patterns

### Pattern 1: Basic Maximum

```javascript
validators: {
  field: v.maxLength(100)
}
```

### Pattern 2: Min and Max Range

```javascript
validators: {
  field: v.combine([
    v.minLength(5),
    v.maxLength(20)
  ])
}
```

### Pattern 3: With Required

```javascript
validators: {
  field: v.combine([
    v.required(),
    v.maxLength(200)
  ])
}
```

### Pattern 4: Optional but Limited

```javascript
validators: {
  field: v.maxLength(100) // Empty OK, but max 100 if provided
}
```

---

## Common Questions

### Q: Does it count spaces?

**Answer:** Yes, all characters including spaces:

```javascript
form.setValue('field', 'hello world'); // Length is 11
```

### Q: What about empty strings?

**Answer:** Empty strings are valid (length 0):

```javascript
form.setValue('field', ''); // Valid (0 <= max)
```

### Q: Can I prevent typing beyond max?

**Answer:** Yes, use `maxlength` HTML attribute:

```javascript
<input type="text" 
       maxlength="100"
       value="${form.values.field}"
       oninput="form.setValue('field', this.value)">
```

### Q: Unicode characters?

**Answer:** Each Unicode character counts as 1:

```javascript
form.setValue('field', '🎉🎊🎈'); // Length is 3
```

---

## Summary

### What `validators.maxLength()` Does:

1. ✅ Checks maximum length
2. ✅ Returns error or null
3. ✅ Custom messages
4. ✅ Works with strings

### When to Use It:

- Username limits
- Tweet-like posts
- Comment systems
- Bio/description fields
- Any string with length limit

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form(
  {
    username: '',
    message: ''
  },
  {
    validators: {
      username: v.maxLength(20),
      message: v.maxLength(500, 'Too long!')
    }
  }
);
```

---

**Remember:** Use `v.maxLength()` for shorter code! 🎉