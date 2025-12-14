# Understanding `isDirty` - A Beginner's Guide

## What is `isDirty`?

`isDirty` is a computed property that tells you if the user has **interacted with the form**. It returns `true` if any field has been touched (interacted with), `false` if no fields have been touched yet.

Think of it as your **form interaction detector** - it knows if the user has started filling the form.

---

## Why Does This Exist?

### The Problem: Detecting User Interaction

You need to know if the user has started interacting with the form to warn them before leaving or enable save buttons:

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: ''
});

// ❌ Manual check - check touched object
const hasTouched = Object.keys(form.touched).length > 0;

if (hasTouched) {
  warnBeforeLeaving();
}

// ✅ With isDirty - one property
if (form.isDirty) {
  warnBeforeLeaving();
}
```

**Why this matters:**
- Single property to check user interaction
- No manual touched state checking needed
- Perfect for unsaved changes warnings
- Clean and readable

---

## How Does It Work?

### The Simple Truth

`isDirty` checks if any fields have been touched:

```javascript
// What isDirty does internally:
get isDirty() {
  return Object.keys(this.touched).length > 0;
}
```

**Important:** This checks if the user has **interacted** with any field, not whether values have changed from their initial state.

Think of it like this:

```
form.isDirty
    ↓
Check form.touched
    ↓
Any fields touched? → Yes → Return true
                   → No → Return false
```

---

## Basic Usage

### Check if User Has Interacted

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: ''
});

console.log(form.isDirty); // false (no interaction yet)

// User types in username
form.setValue('username', 'john');

console.log(form.isDirty); // true (field was touched)
```

### Warn Before Leaving

```javascript
const form = ReactiveUtils.form({ message: '' });

window.onbeforeunload = (e) => {
  if (form.isDirty) {
    e.preventDefault();
    return 'You have started filling the form. Leave anyway?';
  }
};
```

### Enable Save Button

```javascript
const form = ReactiveUtils.form({ title: '', content: '' });

ReactiveUtils.effect(() => {
  const saveBtn = document.getElementById('save-btn');
  saveBtn.disabled = !form.isDirty;
});
```

---

## Important: isDirty vs Value Changes

### What isDirty Actually Checks

`isDirty` checks **touched state**, not whether values have changed:

```javascript
const form = ReactiveUtils.form({
  name: 'John'  // Initial value
});

console.log(form.isDirty); // false

// User clicks field but doesn't change value
form.setTouched('name');

console.log(form.isDirty); // true (field was touched!)
console.log(form.values.name); // 'John' (value unchanged)
```

### If You Need to Check Value Changes

To check if values have actually changed from initial state, you need to compare manually:

```javascript
function hasValueChanged(form, field) {
  return form.values[field] !== form.initialValues[field];
}

function hasAnyValueChanged(form) {
  return Object.keys(form.values).some(field => 
    form.values[field] !== form.initialValues[field]
  );
}

// Usage
const form = ReactiveUtils.form({ name: 'John' });
form.setValue('name', 'Jane');

console.log(form.isDirty); // true (touched)
console.log(hasValueChanged(form, 'name')); // true (value changed)

// Reset to original value
form.setValue('name', 'John');

console.log(form.isDirty); // true (still touched!)
console.log(hasValueChanged(form, 'name')); // false (value back to initial)
```

---

## Simple Examples Explained

### Example 1: Unsaved Interaction Warning

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: '',
  message: ''
});

// Show warning indicator when user starts interacting
ReactiveUtils.effect(() => {
  const indicator = document.getElementById('unsaved-indicator');

  if (form.isDirty) {
    indicator.textContent = '⚠️ You have started filling the form';
    indicator.style.display = 'block';
  } else {
    indicator.style.display = 'none';
  }
});

// Warn before leaving
window.onbeforeunload = (e) => {
  if (form.isDirty) {
    e.preventDefault();
    return 'You have started filling the form. Are you sure you want to leave?';
  }
};
```

**What happens:**

1. Form starts pristine
2. `isDirty` is `false`
3. User clicks any field
4. Field marked as touched via `setValue()` or `setTouched()`
5. `isDirty` becomes `true`
6. Warning indicator appears
7. Browser warns before leaving

---

### Example 2: Save Button State

```javascript
const noteForm = ReactiveUtils.form({
  title: '',
  content: '',
  tags: ''
});

// Enable save button only when user has interacted
ReactiveUtils.effect(() => {
  const saveBtn = document.getElementById('save-btn');

  if (form.isDirty && form.isValid) {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Note';
    saveBtn.classList.add('btn-primary');
  } else if (form.isDirty) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Fix Errors';
    saveBtn.classList.remove('btn-primary');
  } else {
    saveBtn.disabled = true;
    saveBtn.textContent = 'No Changes Yet';
    saveBtn.classList.remove('btn-primary');
  }
});
```

**What happens:**

1. Save button initially disabled (`isDirty` is `false`)
2. User starts typing
3. `isDirty` becomes `true`
4. Button enables if valid
5. Shows "Fix Errors" if invalid
6. User knows when they can save

---

### Example 3: Form Progress Tracking

```javascript
const surveyForm = ReactiveUtils.form({
  question1: '',
  question2: '',
  question3: '',
  question4: '',
  question5: ''
});

// Track if user has started the survey
ReactiveUtils.effect(() => {
  const statusElement = document.getElementById('survey-status');

  if (!surveyForm.isDirty) {
    statusElement.textContent = 'Survey not started';
    statusElement.className = 'status-not-started';
  } else {
    const touchedCount = surveyForm.touchedFields.length;
    const totalFields = Object.keys(surveyForm.values).length;
    const percentage = Math.round((touchedCount / totalFields) * 100);

    statusElement.textContent = `Survey in progress: ${percentage}% fields visited`;
    statusElement.className = 'status-in-progress';
  }
});

// Encourage completion
ReactiveUtils.effect(() => {
  const encouragement = document.getElementById('encouragement');

  if (surveyForm.isDirty && surveyForm.touchedFields.length < 5) {
    encouragement.textContent = `Great start! ${5 - surveyForm.touchedFields.length} more questions to go.`;
    encouragement.style.display = 'block';
  } else if (surveyForm.touchedFields.length === 5) {
    encouragement.textContent = '🎉 All questions answered!';
    encouragement.style.display = 'block';
  } else {
    encouragement.style.display = 'none';
  }
});
```

**What happens:**

1. Shows "Survey not started" initially
2. User clicks first field
3. Status changes to "Survey in progress"
4. Tracks percentage of fields visited
5. Shows encouragement messages
6. Helps user complete survey

---

## Real-World Example: Draft Auto-Save

```javascript
const articleForm = ReactiveUtils.form({
  title: '',
  content: '',
  category: 'general',
  tags: '',
  publishDate: ''
});

// Auto-save draft when user has started writing
let autoSaveTimeout;

ReactiveUtils.effect(() => {
  if (articleForm.isDirty) {
    clearTimeout(autoSaveTimeout);

    autoSaveTimeout = setTimeout(() => {
      saveDraft();
    }, 2000); // Save 2 seconds after last change
  }
});

// Show draft status
ReactiveUtils.effect(() => {
  const statusElement = document.getElementById('draft-status');

  if (!articleForm.isDirty) {
    statusElement.textContent = 'No draft saved';
    statusElement.className = 'status-no-draft';
  } else {
    statusElement.textContent = '📝 Draft auto-saving...';
    statusElement.className = 'status-saving';
  }
});

async function saveDraft() {
  try {
    await fetch('/api/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...articleForm.values,
        savedAt: new Date().toISOString()
      })
    });

    const statusElement = document.getElementById('draft-status');
    statusElement.textContent = '✓ Draft saved';
    statusElement.className = 'status-saved';

    setTimeout(() => {
      statusElement.textContent = '📝 Editing...';
      statusElement.className = 'status-editing';
    }, 2000);

  } catch (err) {
    console.error('Failed to save draft:', err);
  }
}

// Publish button
document.getElementById('publish-btn').onclick = async () => {
  articleForm.touchAll();

  if (!articleForm.isValid) {
    alert('Please fix errors before publishing');
    return;
  }

  try {
    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleForm.values)
    });

    alert('Article published!');
    
    // Reset form
    articleForm.reset();
    window.location.href = '/articles';
  } catch (err) {
    alert('Failed to publish article');
  }
};
```

**What happens:**
- No auto-save until user interacts
- `isDirty` triggers auto-save logic
- Saves draft 2 seconds after last change
- Shows appropriate status messages
- Only starts saving once interaction begins
- Professional draft system

---

## Common Patterns

### Pattern 1: Warn Before Leaving

```javascript
window.onbeforeunload = (e) => {
  if (form.isDirty) {
    e.preventDefault();
    return 'Unsaved interaction';
  }
};
```

### Pattern 2: Enable Save Button

```javascript
ReactiveUtils.effect(() => {
  saveBtn.disabled = !form.isDirty;
});
```

### Pattern 3: Show Indicator

```javascript
ReactiveUtils.effect(() => {
  indicator.style.display = form.isDirty ? 'block' : 'none';
});
```

### Pattern 4: Combine with isValid

```javascript
ReactiveUtils.effect(() => {
  saveBtn.disabled = !form.isDirty || !form.isValid;
});
```

---

## Common Beginner Questions

### Q: When does `isDirty` become `true`?

**Answer:**

When any field is touched (via `setValue()`, `setTouched()`, or user interaction):

```javascript
const form = ReactiveUtils.form({ name: '' });

console.log(form.isDirty); // false

form.setValue('name', 'John');
console.log(form.isDirty); // true (setValue marks as touched)

// OR

form.setTouched('name');
console.log(form.isDirty); // true (explicitly marked)
```

### Q: Does `isDirty` check if values changed?

**Answer:**

**No!** It only checks if fields were touched:

```javascript
const form = ReactiveUtils.form({ name: 'John' });

// User clicks field but doesn't change value
form.setTouched('name');

console.log(form.isDirty); // true (touched)
console.log(form.values.name); // 'John' (unchanged!)
```

To check value changes, compare with `initialValues` manually.

### Q: How do I reset `isDirty`?

**Answer:**

Use `reset()` to clear touched state:

```javascript
form.setValue('name', 'John');
console.log(form.isDirty); // true

form.reset();
console.log(form.isDirty); // false (touched state cleared)
```

### Q: What if I want to check actual value changes?

**Answer:**

Create a helper function:

```javascript
function hasFormChanged(form) {
  return Object.keys(form.values).some(field =>
    form.values[field] !== form.initialValues[field]
  );
}

const form = ReactiveUtils.form({ name: 'John' });
form.setValue('name', 'Jane');

console.log(form.isDirty); // true (touched)
console.log(hasFormChanged(form)); // true (value changed)

form.setValue('name', 'John'); // Back to initial

console.log(form.isDirty); // true (still touched)
console.log(hasFormChanged(form)); // false (value matches initial)
```

### Q: Is `isDirty` reactive?

**Answer:**

Yes! Updates automatically:

```javascript
ReactiveUtils.effect(() => {
  console.log('Form dirty:', form.isDirty);
  // Re-runs when touched state changes
});
```

---

## Tips for Success

### 1. Use for Interaction Detection

```javascript
// ✅ Detect if user started filling form
if (form.isDirty) {
  warnBeforeLeaving();
}
```

### 2. Combine with Validation

```javascript
// ✅ Enable save only if interacted AND valid
ReactiveUtils.effect(() => {
  saveBtn.disabled = !form.isDirty || !form.isValid;
});
```

### 3. Use for Auto-Save Trigger

```javascript
// ✅ Only auto-save if user has interacted
ReactiveUtils.effect(() => {
  if (form.isDirty) {
    triggerAutoSave();
  }
});
```

### 4. Show Status Indicators

```javascript
// ✅ Show different messages based on interaction
ReactiveUtils.effect(() => {
  if (!form.isDirty) {
    status.textContent = 'Start filling the form';
  } else {
    status.textContent = 'Form in progress';
  }
});
```

### 5. For Value Changes, Use Custom Check

```javascript
// ✅ Check actual value changes separately
function hasUnsavedChanges(form) {
  return Object.keys(form.values).some(field =>
    form.values[field] !== form.initialValues[field]
  );
}

if (hasUnsavedChanges(form)) {
  saveBtn.classList.add('has-changes');
}
```

---

## Key Differences: isDirty vs Value Changes

| Aspect | `isDirty` | Value Changes |
|--------|-----------|---------------|
| What it checks | Touched state | Value comparison |
| When it's true | Any field touched | Values differ from initial |
| User clicks field (no change) | `true` | `false` |
| User changes then reverts | `true` | `false` |
| Use for | Interaction detection | Actual changes |
| Built-in? | Yes | No (manual check) |

---

## Summary

### What `isDirty` Does:

1. ✅ Checks if any field has been touched
2. ✅ Returns `true` if user has interacted
3. ✅ Returns `false` if form is pristine
4. ✅ Does NOT check if values changed
5. ✅ Reactive - updates automatically
6. ✅ Perfect for interaction detection

### When to Use It:

- Warning before leaving page
- Enabling save buttons
- Showing "form started" indicators
- Auto-save triggers
- Form progress tracking
- Interaction analytics

### When NOT to Use It:

- Checking if values actually changed (use manual comparison with `initialValues`)
- Detecting specific value modifications
- Comparing current vs initial state

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ field: '' });

// Check if user has interacted
if (form.isDirty) {
  console.log('User has touched the form!');
}

// Warn before leaving
window.onbeforeunload = (e) => {
  if (form.isDirty) {
    e.preventDefault();
    return 'Unsaved interaction';
  }
};

// Enable save button
ReactiveUtils.effect(() => {
  saveBtn.disabled = !form.isDirty;
});
```

---

**Remember:** `isDirty` tells you if the user has **interacted** with the form (touched any field), not whether values have changed from their initial state. For value change detection, compare with `initialValues` manually! 🎉