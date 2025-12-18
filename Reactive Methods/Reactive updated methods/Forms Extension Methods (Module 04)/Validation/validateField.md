# Understanding `validateField()` - A Beginner's Guide

## What is `validateField()`?

`validateField()` is a method that manually runs validation on a specific form field. It checks the field against its validator and updates the error state.

Think of it as your **manual validation trigger** - it forces validation to run on demand for a single field.

---

## Why Does This Exist?

### Automatic vs Manual Validation

Validators run automatically when values change, but sometimes you need manual control:

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email()
    }
  }
);

// ✅ Automatic - validation runs when value changes
form.setValue('email', 'invalid'); // Validator runs automatically

// ✅ Manual - you control when validation runs
form.values.email = 'test@example.com'; // Direct assignment
form.validateField('email'); // Manually trigger validation
```

**When you need manual validation:**
- After direct value assignment
- On-demand validation checks
- Custom validation timing
- Before form submission
- Testing specific fields

---

## How Does It Work?

### The Simple Process

When you call `validateField()`:

1. **Takes field name** - You specify which field
2. **Runs validator** - Executes the field's validator function
3. **Updates errors** - Sets or clears error based on result
4. **Returns boolean** - `true` if valid, `false` if invalid

Think of it like this:

```
validateField('email')
      ↓
  Run email validator
      ↓
  Valid? → Clear error
  Invalid? → Set error
      ↓
  Return true/false
```

---

## Basic Usage

### Validate Single Field

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email()
    }
  }
);

// Set value directly (bypasses automatic validation)
form.values.email = 'invalid-email';

// Manually validate
const isValid = form.validateField('email');

console.log(isValid); // false
console.log(form.getError('email')); // "Invalid email address"
```

### Check Before Action

```javascript
const form = ReactiveUtils.form({ username: '' });

function checkUsername() {
  const isValid = form.validateField('username');

  if (isValid) {
    console.log('Username is valid');
  } else {
    console.log('Username is invalid:', form.getError('username'));
  }
}
```

### Validate After Direct Assignment

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email()
    }
  }
);

// Direct assignment (no automatic validation)
form.values.email = 'test@example.com';

// Manually validate
form.validateField('email');
```

---

## Simple Examples Explained

### Example 1: Validate on Blur

```javascript
const form = ReactiveUtils.form(
  { email: '' },
  {
    validators: {
      email: ReactiveUtils.validators.email()
    }
  }
);

document.getElementById('email').onblur = () => {
  // Validate when user leaves field
  form.validateField('email');

  // Mark as touched
  form.setTouched('email');
};

// Show error
ReactiveUtils.effect(() => {
  const errorElement = document.getElementById('email-error');
  errorElement.textContent = form.shouldShowError('email')
    ? form.getError('email')
    : '';
});
```

**What happens:**

1. User types in email field
2. User leaves field (blur)
3. `validateField()` runs validation
4. Error set if invalid
5. Error displays to user

---

### Example 2: Validate Specific Field on Demand

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  password: ''
});

// Validate just the username
function checkUsernameOnly() {
  const isValid = form.validateField('username');

  if (isValid) {
    document.getElementById('username-check').textContent = '✅ Valid';
  } else {
    document.getElementById('username-check').textContent = '❌ Invalid';
  }
}

// Button to check username
document.getElementById('check-username').onclick = checkUsernameOnly;
```

**What happens:**

1. User clicks "Check Username" button
2. Only username validated (not other fields)
3. Result displayed
4. Other fields unchanged

---

### Example 3: Conditional Validation

```javascript
const form = ReactiveUtils.form({
  hasPhone: false,
  phoneNumber: ''
});

// Validate phone only if checkbox checked
function validatePhoneIfNeeded() {
  if (form.values.hasPhone) {
    const isValid = form.validateField('phoneNumber');

    if (!isValid) {
      alert('Please enter a valid phone number');
      return false;
    }
  }

  return true;
}
```

**What happens:**

1. Checks if phone required
2. If yes, validates phone field
3. Shows alert if invalid
4. Skips validation if not required

---

## Real-World Example: Step-by-Step Validation

```javascript
const registrationForm = ReactiveUtils.form(
  {
    // Step 1
    username: '',
    email: '',

    // Step 2
    password: '',
    confirmPassword: '',

    // Step 3
    address: '',
    city: ''
  },
  {
    validators: {
      username: ReactiveUtils.validators.combine(
        ReactiveUtils.validators.required(),
        ReactiveUtils.validators.minLength(3)
      ),
      email: ReactiveUtils.validators.email(),
      password: ReactiveUtils.validators.minLength(8),
      confirmPassword: ReactiveUtils.validators.match('password'),
      address: ReactiveUtils.validators.required(),
      city: ReactiveUtils.validators.required()
    }
  }
);

let currentStep = 1;

function validateCurrentStep() {
  let isValid = true;

  if (currentStep === 1) {
    // Validate step 1 fields
    const usernameValid = registrationForm.validateField('username');
    const emailValid = registrationForm.validateField('email');

    isValid = usernameValid && emailValid;

    if (!isValid) {
      alert('Please fix errors in step 1');
    }
  }

  else if (currentStep === 2) {
    // Validate step 2 fields
    const passwordValid = registrationForm.validateField('password');
    const confirmValid = registrationForm.validateField('confirmPassword');

    isValid = passwordValid && confirmValid;

    if (!isValid) {
      alert('Please fix errors in step 2');
    }
  }

  else if (currentStep === 3) {
    // Validate step 3 fields
    const addressValid = registrationForm.validateField('address');
    const cityValid = registrationForm.validateField('city');

    isValid = addressValid && cityValid;

    if (!isValid) {
      alert('Please fix errors in step 3');
    }
  }

  return isValid;
}

function nextStep() {
  // Touch current step fields
  if (currentStep === 1) {
    registrationForm.setTouched('username');
    registrationForm.setTouched('email');
  }

  // Validate before moving forward
  if (validateCurrentStep()) {
    currentStep++;
    updateStepDisplay();
  }
}

function prevStep() {
  currentStep--;
  updateStepDisplay();
}

// Final submission
document.getElementById('submit-btn').onclick = () => {
  registrationForm.touchAll();

  // Validate all fields
  if (registrationForm.validate()) {
    submitRegistration();
  } else {
    alert('Please fix all errors before submitting');
  }
};
```

**What happens:**
- Each step validates only its fields
- Uses `validateField()` for specific fields
- Prevents moving forward if step invalid
- Final submit validates all fields
- Clean multi-step validation

---

## Common Patterns

### Pattern 1: Validate on Blur

```javascript
input.onblur = () => {
  form.validateField('fieldName');
  form.setTouched('fieldName');
};
```

### Pattern 2: Validate and Return Result

```javascript
function isFieldValid(field) {
  return form.validateField(field);
}
```

### Pattern 3: Validate Multiple Specific Fields

```javascript
function validateLoginFields() {
  const emailValid = form.validateField('email');
  const passwordValid = form.validateField('password');
  return emailValid && passwordValid;
}
```

### Pattern 4: Validate Before Submission

```javascript
form.onsubmit = (e) => {
  e.preventDefault();

  // Validate specific critical fields
  const emailValid = form.validateField('email');
  const passwordValid = form.validateField('password');

  if (emailValid && passwordValid) {
    submit();
  }
};
```

---

## Common Beginner Questions

### Q: What's the difference between `validateField()` and `validate()`?

**Answer:**

- **`validateField(field)`** = Validate ONE field
- **`validate()`** = Validate ALL fields

```javascript
// Validate one field
form.validateField('email'); // Only validates email

// Validate all fields
form.validate(); // Validates all fields with validators
```

### Q: Do I need to call `validateField()` if I use `setValue()`?

**Answer:**

No! `setValue()` automatically triggers validation:

```javascript
// ✅ Automatic validation
form.setValue('email', 'test@example.com'); // Validates automatically

// ⚠️ Manual validation needed
form.values.email = 'test@example.com'; // No automatic validation
form.validateField('email'); // Must validate manually
```

### Q: What happens if the field has no validator?

**Answer:**

Returns `true` (always valid):

```javascript
const form = ReactiveUtils.form({ name: '' }); // No validator

const isValid = form.validateField('name');
console.log(isValid); // true (no validator = always valid)
```

### Q: Does `validateField()` mark the field as touched?

**Answer:**

No, you must mark it touched separately:

```javascript
form.validateField('email'); // Validates
form.setTouched('email'); // Marks as touched (separate)
```

### Q: Can I validate a field that doesn't exist?

**Answer:**

Yes, returns `true` (no error):

```javascript
const isValid = form.validateField('nonExistentField');
console.log(isValid); // true
```

---

## Tips for Success

### 1. Use for Specific Field Validation

```javascript
// ✅ Validate just one field
form.validateField('email');

// ❌ Don't validate all when you need one
form.validate(); // Validates everything (overkill)
```

### 2. Combine with Touch State

```javascript
// ✅ Validate and mark as touched
input.onblur = () => {
  form.validateField('fieldName');
  form.setTouched('fieldName');
};
```

### 3. Check Return Value

```javascript
// ✅ Use the return value
if (form.validateField('email')) {
  proceedWithEmail();
} else {
  showEmailError();
}
```

### 4. Use for Step Validation

```javascript
// ✅ Validate only current step fields
function validateStep1() {
  return form.validateField('field1') &&
         form.validateField('field2');
}
```

### 5. Don't Overuse

```javascript
// ❌ Unnecessary if using setValue()
form.setValue('email', value); // Already validates
form.validateField('email'); // Redundant!

// ✅ Only when needed
form.values.email = value; // Direct assignment
form.validateField('email'); // Now needed
```

---

## Summary

### What `validateField()` Does:

1. ✅ Manually validates a specific field
2. ✅ Runs the field's validator function
3. ✅ Updates error state
4. ✅ Returns boolean (valid/invalid)
5. ✅ Does NOT mark as touched

### When to Use It:

- After direct value assignment
- On blur events
- Step-by-step form validation
- Conditional validation
- Custom validation timing
- Testing specific fields
- When `setValue()` not used

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form(
  { fieldName: '' },
  {
    validators: {
      fieldName: ReactiveUtils.validators.required()
    }
  }
);

// Validate field
const isValid = form.validateField('fieldName');

if (isValid) {
  // Field is valid
} else {
  // Field has error
  console.log(form.getError('fieldName'));
}

// Common: Validate on blur
input.onblur = () => {
  form.validateField('fieldName');
  form.setTouched('fieldName');
};
```

---

**Remember:** `validateField()` manually validates a specific field. Use it when you need control over validation timing, especially after direct value assignments or for step-by-step validation. But remember: `setValue()` already validates automatically! 🎉
