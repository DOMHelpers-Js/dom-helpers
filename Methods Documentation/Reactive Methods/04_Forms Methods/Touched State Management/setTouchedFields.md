# Understanding `setTouchedFields()` - A Beginner's Guide

## What is `setTouchedFields()`?

`setTouchedFields()` is a method that marks **multiple specific fields** as touched at once. It's like `touchAll()` but for selected fields instead of the entire form.

Think of it as your **selective touch marker** - mark just the fields you want as touched.

---

## Why Does This Exist?

### The Problem: Touching Multiple Specific Fields

You need to mark several (but not all) fields as touched:

```javascript
const form = ReactiveUtils.form({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: ''
});

// ❌ Manual - mark each individually
form.setTouched('firstName');
form.setTouched('lastName');
form.setTouched('email');
// Repetitive!

// ❌ touchAll() marks ALL fields (too much)
form.touchAll(); // Marks address and phone too

// ✅ With setTouchedFields() - mark specific fields
form.setTouchedFields(['firstName', 'lastName', 'email']);
// Only these three marked!
```

**Why this matters:**
- Mark multiple fields in one call
- More selective than `touchAll()`
- Perfect for multi-step forms
- Great for partial validation
- Clean and efficient

---

## How Does It Work?

### The Simple Process

When you call `setTouchedFields(fieldArray)`:

1. **Takes array** - Gets array of field names
2. **Marks each** - Sets `touched[field] = true` for each
3. **Triggers UI update** - Errors become visible for those fields

Think of it like this:

```
setTouchedFields(['email', 'password'])
    ↓
For each field in array:
  form.touched[field] = true
    ↓
Only those fields marked as touched
```

---

## Basic Usage

### Mark Multiple Fields

```javascript
const form = ReactiveUtils.form({
  name: '',
  email: '',
  phone: '',
  message: ''
});

// Mark specific fields as touched
form.setTouchedFields(['name', 'email']);

console.log(form.isTouched('name'));    // true
console.log(form.isTouched('email'));   // true
console.log(form.isTouched('phone'));   // false
console.log(form.isTouched('message')); // false
```

### Touch Current Step Fields

```javascript
const form = ReactiveUtils.form({
  // Step 1
  firstName: '',
  lastName: '',

  // Step 2
  email: '',
  phone: ''
});

// Touch only step 1 fields
const step1Fields = ['firstName', 'lastName'];
form.setTouchedFields(step1Fields);
```

### Touch Required Fields

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  bio: '',
  website: ''
});

// Touch only required fields
const requiredFields = ['username', 'email'];
form.setTouchedFields(requiredFields);
```

---

## Simple Examples Explained

### Example 1: Multi-Step Form Validation

```javascript
const registrationForm = ReactiveUtils.form(
  {
    // Step 1: Account
    username: '',
    email: '',
    password: '',

    // Step 2: Profile
    firstName: '',
    lastName: '',
    bio: '',

    // Step 3: Preferences
    newsletter: false,
    notifications: true
  },
  {
    validators: {
      username: ReactiveUtils.validators.minLength(3),
      email: ReactiveUtils.validators.email(),
      password: ReactiveUtils.validators.minLength(8),
      firstName: ReactiveUtils.validators.required(),
      lastName: ReactiveUtils.validators.required()
    }
  }
);

let currentStep = 1;

// Define fields per step
const stepFields = {
  1: ['username', 'email', 'password'],
  2: ['firstName', 'lastName', 'bio'],
  3: ['newsletter', 'notifications']
};

// Next button
document.getElementById('next-btn').onclick = () => {
  // Touch all fields in current step
  form.setTouchedFields(stepFields[currentStep]);

  // Validate current step
  const currentFields = stepFields[currentStep];
  const stepValid = currentFields.every(field => !registrationForm.hasError(field));

  if (stepValid) {
    currentStep++;
    updateStepDisplay();
  } else {
    alert('Please fix errors in current step');
  }
};

// Show errors only for touched fields
ReactiveUtils.effect(() => {
  Object.keys(registrationForm.values).forEach(field => {
    const errorElement = document.getElementById(`${field}-error`);

    if (errorElement && registrationForm.shouldShowError(field)) {
      errorElement.textContent = registrationForm.getError(field);
      errorElement.style.display = 'block';
    } else if (errorElement) {
      errorElement.style.display = 'none';
    }
  });
});
```

**What happens:**

1. User fills step 1 fields
2. Clicks "Next"
3. Only step 1 fields marked as touched
4. Errors show only for step 1
5. Step 2 fields remain untouched
6. Progressive validation per step
7. Clean multi-step UX

---

### Example 2: Conditional Field Validation

```javascript
const orderForm = ReactiveUtils.form(
  {
    // Required fields
    customerName: '',
    email: '',

    // Shipping fields (only if shipping)
    shippingAddress: '',
    shippingCity: '',
    shippingZip: '',

    // Billing fields (only if different from shipping)
    billingAddress: '',
    billingCity: '',
    billingZip: '',

    // Options
    requiresShipping: true,
    billingSameAsShipping: true
  },
  {
    validators: {
      customerName: ReactiveUtils.validators.required(),
      email: ReactiveUtils.validators.email(),
      shippingAddress: ReactiveUtils.validators.required(),
      shippingCity: ReactiveUtils.validators.required(),
      shippingZip: ReactiveUtils.validators.pattern(/^\d{5}$/),
      billingAddress: ReactiveUtils.validators.required(),
      billingCity: ReactiveUtils.validators.required(),
      billingZip: ReactiveUtils.validators.pattern(/^\d{5}$/)
    }
  }
);

// Bind inputs
orderForm.bindToInputs('#order-form');

// Handle submission
document.getElementById('order-form').onsubmit = (e) => {
  e.preventDefault();

  // Always touch required fields
  const fieldsToTouch = ['customerName', 'email'];

  // Add shipping fields if shipping is required
  if (orderForm.values.requiresShipping) {
    fieldsToTouch.push('shippingAddress', 'shippingCity', 'shippingZip');
  }

  // Add billing fields if different from shipping
  if (!orderForm.values.billingSameAsShipping) {
    fieldsToTouch.push('billingAddress', 'billingCity', 'billingZip');
  }

  // Touch only relevant fields
  orderForm.setTouchedFields(fieldsToTouch);

  // Validate only touched fields
  const relevantErrors = orderForm.errorFields.filter(field =>
    fieldsToTouch.includes(field)
  );

  if (relevantErrors.length > 0) {
    alert(`Please fix ${relevantErrors.length} error(s)`);
    return;
  }

  submitOrder();
};
```

**What happens:**

1. Determines which fields are relevant
2. Touches only those fields
3. Shows errors only for relevant fields
4. Ignores hidden/irrelevant fields
5. Smart conditional validation

---

### Example 3: Partial Form Save

```javascript
const profileForm = ReactiveUtils.form({
  // Basic Info
  name: '',
  email: '',
  phone: '',

  // Social Links
  twitter: '',
  linkedIn: '',
  github: '',

  // Bio
  bio: '',
  interests: ''
});

// Bind inputs
profileForm.bindToInputs('#profile-form');

// Save only Basic Info section
document.getElementById('save-basic-info').onclick = async () => {
  const basicInfoFields = ['name', 'email', 'phone'];

  // Touch only basic info fields
  profileForm.setTouchedFields(basicInfoFields);

  // Check if basic info is valid
  const basicInfoErrors = basicInfoFields.filter(field =>
    profileForm.hasError(field)
  );

  if (basicInfoErrors.length > 0) {
    alert('Please fix basic info errors');
    return;
  }

  // Save only basic info
  try {
    await fetch('/api/profile/basic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: profileForm.values.name,
        email: profileForm.values.email,
        phone: profileForm.values.phone
      })
    });

    alert('Basic info saved!');
  } catch (err) {
    alert('Failed to save');
  }
};

// Save only Social Links section
document.getElementById('save-social').onclick = async () => {
  const socialFields = ['twitter', 'linkedIn', 'github'];

  profileForm.setTouchedFields(socialFields);

  const socialErrors = socialFields.filter(field =>
    profileForm.hasError(field)
  );

  if (socialErrors.length > 0) {
    alert('Please fix social links errors');
    return;
  }

  try {
    await fetch('/api/profile/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        twitter: profileForm.values.twitter,
        linkedIn: profileForm.values.linkedIn,
        github: profileForm.values.github
      })
    });

    alert('Social links saved!');
  } catch (err) {
    alert('Failed to save');
  }
};

// Save entire profile
document.getElementById('save-all').onclick = () => {
  // Touch all fields
  profileForm.touchAll();

  if (!profileForm.isValid) {
    alert('Please fix all errors');
    return;
  }

  saveCompleteProfile();
};
```

**What happens:**

1. Different save buttons for sections
2. Each touches only its section's fields
3. Validates only that section
4. Partial saves possible
5. Or save all with touchAll()
6. Flexible form saving UX

---

## Real-World Example: Complex Application Form

```javascript
const applicationForm = ReactiveUtils.form(
  {
    // Personal (required)
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Education (required)
    degree: '',
    university: '',
    graduationYear: '',

    // Experience (optional but validate if filled)
    currentCompany: '',
    currentPosition: '',
    yearsExperience: '',

    // References (optional)
    reference1Name: '',
    reference1Email: '',
    reference2Name: '',
    reference2Email: '',

    // Additional
    coverLetter: '',
    portfolio: ''
  },
  {
    validators: {
      firstName: ReactiveUtils.validators.required(),
      lastName: ReactiveUtils.validators.required(),
      email: ReactiveUtils.validators.email(),
      phone: ReactiveUtils.validators.pattern(/^\d{10}$/),
      degree: ReactiveUtils.validators.required(),
      university: ReactiveUtils.validators.required(),
      graduationYear: ReactiveUtils.validators.pattern(/^\d{4}$/),
      currentCompany: ReactiveUtils.validators.minLength(2),
      currentPosition: ReactiveUtils.validators.minLength(2),
      yearsExperience: ReactiveUtils.validators.custom(v => v >= 0 && v <= 50),
      reference1Email: ReactiveUtils.validators.email(),
      reference2Email: ReactiveUtils.validators.email(),
      coverLetter: ReactiveUtils.validators.minLength(100),
      portfolio: ReactiveUtils.validators.pattern(/^https?:\/\//)
    }
  }
);

// Bind inputs
applicationForm.bindToInputs('#application-form');

// Field groups
const fieldGroups = {
  personal: ['firstName', 'lastName', 'email', 'phone'],
  education: ['degree', 'university', 'graduationYear'],
  experience: ['currentCompany', 'currentPosition', 'yearsExperience'],
  references: ['reference1Name', 'reference1Email', 'reference2Name', 'reference2Email'],
  additional: ['coverLetter', 'portfolio']
};

// Validate section button
Object.keys(fieldGroups).forEach(sectionName => {
  const validateBtn = document.getElementById(`validate-${sectionName}`);
  if (validateBtn) {
    validateBtn.onclick = () => {
      const fields = fieldGroups[sectionName];

      // Touch section fields
      applicationForm.setTouchedFields(fields);

      // Get errors in this section
      const sectionErrors = fields.filter(field =>
        applicationForm.hasError(field)
      );

      if (sectionErrors.length > 0) {
        alert(`${sectionName} has ${sectionErrors.length} error(s)`);
      } else {
        alert(`${sectionName} section is valid!`);
      }
    };
  }
});

// Smart submission
document.getElementById('submit-application').onclick = () => {
  // Determine which fields to touch based on what user filled
  const fieldsToTouch = [...fieldGroups.personal, ...fieldGroups.education];

  // Add experience fields if any experience field has value
  if (applicationForm.values.currentCompany ||
      applicationForm.values.currentPosition ||
      applicationForm.values.yearsExperience) {
    fieldsToTouch.push(...fieldGroups.experience);
  }

  // Add reference fields if any reference field has value
  if (applicationForm.values.reference1Name ||
      applicationForm.values.reference1Email ||
      applicationForm.values.reference2Name ||
      applicationForm.values.reference2Email) {
    fieldsToTouch.push(...fieldGroups.references);
  }

  // Add additional fields if filled
  if (applicationForm.values.coverLetter || applicationForm.values.portfolio) {
    fieldsToTouch.push(...fieldGroups.additional);
  }

  // Touch relevant fields
  applicationForm.setTouchedFields(fieldsToTouch);

  // Get errors in touched fields
  const relevantErrors = applicationForm.errorFields.filter(field =>
    fieldsToTouch.includes(field)
  );

  if (relevantErrors.length > 0) {
    alert(`Please fix ${relevantErrors.length} error(s) before submitting`);

    // Focus first error
    document.getElementById(relevantErrors[0]).focus();
    return;
  }

  submitApplication();
};

// Section completion indicators
ReactiveUtils.effect(() => {
  Object.entries(fieldGroups).forEach(([sectionName, fields]) => {
    const indicator = document.getElementById(`${sectionName}-status`);
    if (!indicator) return;

    const touchedFields = applicationForm.touchedFields;
    const touchedInSection = fields.filter(f => touchedFields.includes(f)).length;
    const errorsInSection = fields.filter(f =>
      applicationForm.errorFields.includes(f) && touchedFields.includes(f)
    ).length;

    if (touchedInSection === 0) {
      indicator.innerHTML = '○ Not started';
      indicator.className = 'status-pending';
    } else if (errorsInSection > 0) {
      indicator.innerHTML = `❌ ${errorsInSection} error(s)`;
      indicator.className = 'status-error';
    } else if (touchedInSection === fields.length) {
      indicator.innerHTML = '✅ Complete';
      indicator.className = 'status-complete';
    } else {
      indicator.innerHTML = `⏳ In progress (${touchedInSection}/${fields.length})`;
      indicator.className = 'status-progress';
    }
  });
});

async function submitApplication() {
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationForm.values)
    });

    if (response.ok) {
      alert('Application submitted successfully!');
      window.location.href = '/application-confirmation';
    } else {
      alert('Failed to submit application');
    }
  } catch (err) {
    alert('Network error. Please try again.');
  }
}
```

**What happens:**
- Each section has validate button
- Only touches fields in that section
- Smart submission touches only relevant fields
- Optional sections only validated if filled
- Section status indicators
- Flexible validation strategy
- Professional application form

---

## Common Patterns

### Pattern 1: Touch Multiple Fields

```javascript
form.setTouchedFields(['field1', 'field2', 'field3']);
```

### Pattern 2: Touch Step Fields

```javascript
const stepFields = { 1: ['a', 'b'], 2: ['c', 'd'] };
form.setTouchedFields(stepFields[currentStep]);
```

### Pattern 3: Touch Required Only

```javascript
const requiredFields = ['name', 'email'];
form.setTouchedFields(requiredFields);
```

### Pattern 4: Touch Filled Fields

```javascript
const filledFields = Object.keys(form.values).filter(f => form.values[f]);
form.setTouchedFields(filledFields);
```

---

## Common Beginner Questions

### Q: What's the difference between `setTouchedFields()` and `touchAll()`?

**Answer:**

- **`setTouchedFields(fields)`** = Touch specific fields
- **`touchAll()`** = Touch ALL fields

```javascript
// Touch specific fields
form.setTouchedFields(['email', 'password']); // Only these two

// Touch all fields
form.touchAll(); // Every field
```

### Q: Can I use it with an empty array?

**Answer:**

Yes, but it does nothing:

```javascript
form.setTouchedFields([]); // No effect
```

### Q: What if I pass a non-existent field?

**Answer:**

It's ignored - no error:

```javascript
form.setTouchedFields(['email', 'nonexistent']);
// email touched, nonexistent ignored
```

### Q: Does it validate the fields?

**Answer:**

No! It only marks as touched. Validation happens when values change:

```javascript
form.setTouchedFields(['email']); // Only marks touched
// Errors show if they already exist
```

### Q: Can I call it multiple times?

**Answer:**

Yes! It adds to existing touched state:

```javascript
form.setTouchedFields(['field1']);
form.setTouchedFields(['field2']);
// Both field1 and field2 are now touched
```

---

## Tips for Success

### 1. Use for Multi-Step Forms

```javascript
// ✅ Touch only current step
const stepFields = { 1: ['a', 'b'], 2: ['c', 'd'] };
form.setTouchedFields(stepFields[currentStep]);
```

### 2. Touch Section at a Time

```javascript
// ✅ Validate by section
const sections = { personal: ['name', 'email'], contact: ['phone'] };
form.setTouchedFields(sections.personal);
```

### 3. Touch Required Fields First

```javascript
// ✅ Show required field errors
const required = ['name', 'email'];
form.setTouchedFields(required);
```

### 4. Touch Filled Fields Only

```javascript
// ✅ Validate only what user filled
const filled = Object.keys(form.values).filter(f => form.values[f]);
form.setTouchedFields(filled);
```

### 5. Combine with Error Check

```javascript
// ✅ Touch and check
form.setTouchedFields(['email', 'password']);
const errors = ['email', 'password'].filter(f => form.hasError(f));
```

---

## Summary

### What `setTouchedFields()` Does:

1. ✅ Marks multiple specific fields as touched
2. ✅ Takes array of field names
3. ✅ More selective than `touchAll()`
4. ✅ Perfect for multi-step forms
5. ✅ Great for section validation
6. ✅ Triggers reactive UI updates

### When to Use It:

- Multi-step form validation (most common)
- Section-by-section validation
- Touching only required fields
- Partial form validation
- Conditional field validation
- Any selective field touching

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ field1: '', field2: '', field3: '' });

// Touch multiple specific fields
form.setTouchedFields(['field1', 'field2']);

console.log(form.isTouched('field1')); // true
console.log(form.isTouched('field2')); // true
console.log(form.isTouched('field3')); // false

// Common: Multi-step forms
const stepFields = {
  1: ['field1', 'field2'],
  2: ['field3']
};

form.setTouchedFields(stepFields[currentStep]);
```

---

**Remember:** `setTouchedFields()` marks multiple specific fields as touched in one call. Use it for multi-step forms and section-by-section validation. More selective than `touchAll()`, more efficient than multiple `setTouched()` calls! 🎉
