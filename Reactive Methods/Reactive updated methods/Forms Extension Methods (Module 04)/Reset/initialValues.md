# Understanding `initialValues` - A Beginner's Guide

## What is `initialValues`?

`initialValues` is a property that stores the original values your form was created with. It's automatically created when you make a form and is used by `reset()` and `resetField()` to restore fields to their starting state.

Think of it as your **form's memory** - it remembers what values the form started with.

---

## Why Does This Exist?

### The Problem: Remembering Initial State

When you reset a form, you need to know what the original values were:

```javascript
const form = ReactiveUtils.form({
  username: 'john_doe',
  email: 'john@example.com',
  theme: 'dark'
});

// User changes everything
form.setValues({
  username: 'jane_doe',
  email: 'jane@example.com',
  theme: 'light'
});

// How do we get back to the original values?
// ❌ Without initialValues - you'd have to remember manually

// ✅ With initialValues - form remembers for you
form.reset(); // Uses form.initialValues to restore

console.log(form.values.username); // 'john_doe' (original!)
```

**Why this matters:**
- Form automatically remembers original values
- `reset()` knows what to restore to
- `resetField()` knows field's starting value
- Can detect if values actually changed
- No manual tracking needed

---

## How Does It Work?

### Created Automatically

When you create a form, `initialValues` is automatically set:

```javascript
const form = ReactiveUtils.form({
  name: 'John',
  email: 'john@example.com',
  age: 25
});

console.log(form.initialValues);
// {
//   name: 'John',
//   email: 'john@example.com',
//   age: 25
// }
```

### Used by reset() and resetField()

These methods use `initialValues` to restore state:

```javascript
const form = ReactiveUtils.form({
  name: 'John',
  email: 'john@example.com'
});

// User makes changes
form.setValue('name', 'Jane');
form.setValue('email', 'jane@example.com');

// Reset uses initialValues
form.reset();

console.log(form.values.name); // 'John' (from initialValues)
console.log(form.values.email); // 'john@example.com' (from initialValues)
```

---

## Basic Usage

### Accessing Initial Values

```javascript
const form = ReactiveUtils.form({
  username: 'john_doe',
  email: 'john@example.com'
});

// Access initial values
console.log(form.initialValues.username); // 'john_doe'
console.log(form.initialValues.email); // 'john@example.com'
```

### Comparing Current vs Initial

```javascript
const form = ReactiveUtils.form({
  name: 'John',
  bio: 'Developer'
});

// User changes name
form.setValue('name', 'Jane');

// Compare
console.log('Current:', form.values.name); // 'Jane'
console.log('Initial:', form.initialValues.name); // 'John'
console.log('Changed?', form.values.name !== form.initialValues.name); // true
```

### Detecting Actual Changes

```javascript
const form = ReactiveUtils.form({
  email: 'john@example.com',
  phone: '5551234567'
});

// Helper to check if value actually changed
function hasValueChanged(field) {
  return form.values[field] !== form.initialValues[field];
}

form.setValue('email', 'jane@example.com');

console.log(hasValueChanged('email')); // true (changed)
console.log(hasValueChanged('phone')); // false (unchanged)
```

---

## Simple Examples Explained

### Example 1: Show Reset Button When Changed

```javascript
const profileForm = ReactiveUtils.form({
  displayName: 'John Doe',
  bio: 'Software Developer',
  location: 'New York'
});

// Show reset button only when values differ from initial
ReactiveUtils.effect(() => {
  const fields = ['displayName', 'bio', 'location'];
  const hasChanges = fields.some(field =>
    profileForm.values[field] !== profileForm.initialValues[field]
  );

  const resetBtn = document.getElementById('reset-btn');
  resetBtn.style.display = hasChanges ? 'inline-block' : 'none';
});

// Reset button handler
document.getElementById('reset-btn').onclick = () => {
  if (confirm('Discard all changes?')) {
    profileForm.reset(); // Uses initialValues
  }
};
```

**What happens:**

1. Form created with initial values
2. Reset button hidden (no changes)
3. User changes displayName
4. Reset button appears (value differs from initial)
5. User clicks reset
6. Form restored to initialValues

---

### Example 2: Highlight Modified Fields

```javascript
const settingsForm = ReactiveUtils.form({
  theme: 'light',
  fontSize: 16,
  notifications: true,
  autoSave: false
});

// Highlight fields that changed from initial
ReactiveUtils.effect(() => {
  const fields = ['theme', 'fontSize', 'notifications', 'autoSave'];

  fields.forEach(field => {
    const input = document.getElementById(field);
    const hasChanged = settingsForm.values[field] !== settingsForm.initialValues[field];

    if (hasChanged) {
      input.classList.add('field-modified');
      input.style.borderColor = '#ff9800';
    } else {
      input.classList.remove('field-modified');
      input.style.borderColor = '';
    }
  });
});

// Show change summary
ReactiveUtils.effect(() => {
  const fields = ['theme', 'fontSize', 'notifications', 'autoSave'];
  const changedFields = fields.filter(field =>
    settingsForm.values[field] !== settingsForm.initialValues[field]
  );

  const summary = document.getElementById('change-summary');

  if (changedFields.length > 0) {
    const changes = changedFields.map(field => {
      const oldVal = settingsForm.initialValues[field];
      const newVal = settingsForm.values[field];
      return `${field}: ${oldVal} → ${newVal}`;
    }).join('<br>');

    summary.innerHTML = `
      <div class="alert alert-info">
        <strong>${changedFields.length} setting(s) modified:</strong><br>
        ${changes}
      </div>
    `;
    summary.style.display = 'block';
  } else {
    summary.style.display = 'none';
  }
});
```

**What happens:**

1. Modified fields get orange border
2. Shows "before → after" for each change
3. Compares current values with initialValues
4. Visual feedback on what changed
5. User knows exactly what they modified

---

### Example 3: Updating Initial Values After Save

```javascript
const documentForm = ReactiveUtils.form({
  title: 'Untitled Document',
  content: '',
  lastSaved: null
});

// Save document
async function saveDocument() {
  try {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(documentForm.values)
    });

    if (response.ok) {
      // Update initialValues to current values
      // Now the "saved" state becomes the new baseline
      documentForm.initialValues = { ...documentForm.values };

      alert('Document saved!');

      // After updating initialValues, hasChanges becomes false
      console.log(hasUnsavedChanges()); // false
    }
  } catch (err) {
    alert('Failed to save document');
  }
}

// Check for unsaved changes
function hasUnsavedChanges() {
  return Object.keys(documentForm.values).some(field =>
    documentForm.values[field] !== documentForm.initialValues[field]
  );
}

// Warn before leaving if unsaved changes
window.onbeforeunload = (e) => {
  if (hasUnsavedChanges()) {
    e.preventDefault();
    return 'You have unsaved changes. Leave anyway?';
  }
};

// Save button state
ReactiveUtils.effect(() => {
  const saveBtn = document.getElementById('save-btn');
  const hasChanges = hasUnsavedChanges();

  saveBtn.disabled = !hasChanges;
  saveBtn.textContent = hasChanges ? 'Save Changes' : 'No Changes';
});
```

**What happens:**

1. User edits document
2. hasUnsavedChanges() detects differences from initialValues
3. Save button enables
4. User saves
5. initialValues updated to current values
6. hasUnsavedChanges() now returns false
7. Save button disables
8. New baseline established

---

## Real-World Example: Complete Profile Editor

```javascript
const profileEditor = ReactiveUtils.form({
  // Personal Info
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-1234',

  // Preferences
  theme: 'light',
  language: 'en',
  notifications: true,

  // Bio
  bio: 'Software developer',
  website: 'https://johndoe.com'
});

// Track which specific fields changed
function getChangedFields() {
  const allFields = Object.keys(profileEditor.values);
  return allFields.filter(field =>
    profileEditor.values[field] !== profileEditor.initialValues[field]
  );
}

// Show modified indicator per field
ReactiveUtils.effect(() => {
  const changedFields = getChangedFields();

  Object.keys(profileEditor.values).forEach(field => {
    const indicator = document.getElementById(`${field}-indicator`);
    if (indicator) {
      if (changedFields.includes(field)) {
        indicator.textContent = '●';
        indicator.className = 'indicator modified';
        indicator.title = `Changed from: ${profileEditor.initialValues[field]}`;
      } else {
        indicator.textContent = '';
        indicator.className = 'indicator';
        indicator.title = '';
      }
    }
  });
});

// Show global change status
ReactiveUtils.effect(() => {
  const statusElement = document.getElementById('change-status');
  const changedFields = getChangedFields();

  if (changedFields.length > 0) {
    statusElement.innerHTML = `
      <div class="alert alert-warning">
        ⚠️ ${changedFields.length} field(s) modified: ${changedFields.join(', ')}
      </div>
    `;
    statusElement.style.display = 'block';
  } else {
    statusElement.style.display = 'none';
  }
});

// Revert single field button
Object.keys(profileEditor.values).forEach(field => {
  const revertBtn = document.getElementById(`revert-${field}`);
  if (revertBtn) {
    revertBtn.onclick = () => {
      // Use initialValues to revert
      profileEditor.setValue(field, profileEditor.initialValues[field]);
    };

    // Show revert button only if field changed
    ReactiveUtils.effect(() => {
      const hasChanged = profileEditor.values[field] !== profileEditor.initialValues[field];
      revertBtn.style.display = hasChanged ? 'inline-block' : 'none';
    });
  }
});

// Discard all changes
document.getElementById('discard-btn').onclick = () => {
  const changedFields = getChangedFields();

  if (changedFields.length === 0) {
    alert('No changes to discard');
    return;
  }

  if (confirm(`Discard ${changedFields.length} change(s)?`)) {
    profileEditor.reset(); // Uses initialValues
    alert('All changes discarded');
  }
};

// Save changes
document.getElementById('save-btn').onclick = async () => {
  const changedFields = getChangedFields();

  if (changedFields.length === 0) {
    alert('No changes to save');
    return;
  }

  profileEditor.touchAll();

  if (!profileEditor.isValid) {
    alert('Please fix validation errors');
    return;
  }

  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values: profileEditor.values,
        changedFields: changedFields // Send only what changed
      })
    });

    if (response.ok) {
      alert('Profile updated successfully!');

      // IMPORTANT: Update initialValues after successful save
      // This makes the saved state the new baseline
      profileEditor.initialValues = { ...profileEditor.values };

      // Now getChangedFields() returns [] until user makes new changes
    } else {
      alert('Failed to update profile');
    }
  } catch (err) {
    alert('Network error');
  }
});

// Enable save button only if there are actual changes
ReactiveUtils.effect(() => {
  const saveBtn = document.getElementById('save-btn');
  const discardBtn = document.getElementById('discard-btn');
  const hasChanges = getChangedFields().length > 0;

  saveBtn.disabled = !hasChanges || !profileEditor.isValid;
  discardBtn.disabled = !hasChanges;

  if (hasChanges) {
    saveBtn.textContent = `Save ${getChangedFields().length} Change(s)`;
  } else {
    saveBtn.textContent = 'No Changes';
  }
});

// Warn before navigation
window.onbeforeunload = (e) => {
  if (getChangedFields().length > 0) {
    e.preventDefault();
    return 'You have unsaved changes. Leave anyway?';
  }
};
```

**What happens:**
- Each modified field shows indicator
- Global status shows what changed
- Revert buttons restore from initialValues
- Discard button resets entire form
- Save button shows change count
- After save, initialValues updated to new baseline
- Warns before leaving with unsaved changes
- Complete change tracking system

---

## Common Patterns

### Pattern 1: Check if Field Changed

```javascript
const hasChanged = form.values.email !== form.initialValues.email;
```

### Pattern 2: Get All Changed Fields

```javascript
const changedFields = Object.keys(form.values).filter(field =>
  form.values[field] !== form.initialValues[field]
);
```

### Pattern 3: Revert Single Field

```javascript
form.setValue('email', form.initialValues.email);
```

### Pattern 4: Update Baseline After Save

```javascript
// After successful save
form.initialValues = { ...form.values };
```

---

## Common Beginner Questions

### Q: Is `initialValues` reactive?

**Answer:**

No, it's a plain object. Changes to it don't trigger effects:

```javascript
const form = ReactiveUtils.form({ name: 'John' });

ReactiveUtils.effect(() => {
  console.log(form.initialValues.name);
  // This effect won't re-run when initialValues changes
});

form.initialValues = { name: 'Jane' }; // Effect doesn't run
```

### Q: Can I modify `initialValues`?

**Answer:**

Yes! This is useful after saving to establish a new baseline:

```javascript
// After successful save
form.initialValues = { ...form.values };

// Now the saved state is the new "initial" state
```

### Q: Does `reset()` always use `initialValues`?

**Answer:**

Yes, unless you pass new values:

```javascript
const form = ReactiveUtils.form({ name: 'John' });

form.reset(); // Uses initialValues ('John')

form.reset({ name: 'Jane' }); // Uses provided values
console.log(form.initialValues.name); // Still 'John'
```

### Q: What happens if I change `initialValues` directly?

**Answer:**

`reset()` will use the new values:

```javascript
const form = ReactiveUtils.form({ name: 'John' });

form.initialValues.name = 'Jane';

form.reset();
console.log(form.values.name); // 'Jane' (new initialValues)
```

### Q: How do I check if the entire form has unsaved changes?

**Answer:**

Compare all fields:

```javascript
function hasUnsavedChanges(form) {
  return Object.keys(form.values).some(field =>
    form.values[field] !== form.initialValues[field]
  );
}

console.log(hasUnsavedChanges(form)); // true/false
```

---

## Tips for Success

### 1. Use for Change Detection

```javascript
// ✅ Detect actual value changes
const hasChanged = form.values.email !== form.initialValues.email;
```

### 2. Update After Successful Save

```javascript
// ✅ Establish new baseline after save
await saveData();
form.initialValues = { ...form.values };
```

### 3. Show Changed Field Indicators

```javascript
// ✅ Visual feedback on modifications
ReactiveUtils.effect(() => {
  const changed = form.values.name !== form.initialValues.name;
  indicator.style.display = changed ? 'block' : 'none';
});
```

### 4. Create Helper Functions

```javascript
// ✅ Reusable change detection
function getChangedFields(form) {
  return Object.keys(form.values).filter(field =>
    form.values[field] !== form.initialValues[field]
  );
}
```

### 5. Use for Undo Functionality

```javascript
// ✅ Revert to initial state
function revertField(field) {
  form.setValue(field, form.initialValues[field]);
}
```

---

## Comparison: initialValues vs Current Values

| Aspect | `initialValues` | `values` |
|--------|----------------|----------|
| When set | Form creation | User interaction |
| Can change | Manually only | Automatically |
| Used by | `reset()`, `resetField()` | All form operations |
| Reactive | No | Yes |
| Purpose | Remember original state | Track current state |

---

## Summary

### What `initialValues` Does:

1. ✅ Stores original form values
2. ✅ Automatically created on form creation
3. ✅ Used by `reset()` and `resetField()`
4. ✅ Can be manually updated
5. ✅ Perfect for change detection
6. ✅ Not reactive (plain object)

### When to Use It:

- Detecting actual value changes
- Showing "revert" or "undo" buttons
- Comparing current vs original state
- Updating baseline after save
- Change tracking and indicators
- Unsaved changes warnings

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({
  name: 'John',
  email: 'john@example.com'
});

// Access initial values
console.log(form.initialValues.name); // 'John'

// Detect changes
const hasChanged = form.values.name !== form.initialValues.name;

// Reset to initial
form.reset(); // Uses initialValues

// Update baseline after save
form.initialValues = { ...form.values };
```

---

**Remember:** `initialValues` is your form's memory of its original state. Use it to detect actual changes, implement undo functionality, and establish new baselines after saving. It's what makes `reset()` work! 🎉