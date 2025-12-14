# Understanding `getFieldProps()` - A Beginner's Guide

## What is `getFieldProps()`?

`getFieldProps()` is a method that returns all the properties needed to connect an input to your form in one call. It gives you the value, change handler, and blur handler all together.

Think of it as your **all-in-one input connector** - everything you need to bind an input, in one object.

---

## Why Does This Exist?

### The Problem: Repetitive Input Setup

You need to set multiple properties on every input:

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// ❌ Manual setup - repetitive
const emailInput = document.getElementById('email');
emailInput.value = form.values.email;
emailInput.oninput = form.handleChange('email');
emailInput.onblur = form.handleBlur('email');

const passwordInput = document.getElementById('password');
passwordInput.value = form.values.password;
passwordInput.oninput = form.handleChange('password');
passwordInput.onblur = form.handleBlur('password');
// So much repetition!

// ✅ With getFieldProps() - clean and simple
const emailProps = form.getFieldProps('email');
Object.assign(emailInput, emailProps);

const passwordProps = form.getFieldProps('password');
Object.assign(passwordInput, passwordProps);
```

**Why this matters:**
- Get all properties in one call
- Consistent input setup
- Less boilerplate code
- Easier to maintain
- Cleaner code

---

## How Does It Work?

### The Simple Process

When you call `getFieldProps(fieldName)`:

1. **Returns object** - Gets an object with properties
2. **Contains value** - Current field value
3. **Contains oninput** - Change handler
4. **Contains onblur** - Blur handler
5. **Ready to apply** - Use with Object.assign()

Think of it like this:

```
getFieldProps('email')
    ↓
Returns: {
  value: form.values.email,
  oninput: form.handleChange('email'),
  onblur: form.handleBlur('email')
}
    ↓
Apply to input → Fully connected!
```

---

## Basic Usage

### Connect Single Input

```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

// Get all props for email
const emailProps = form.getFieldProps('email');

// Apply to input
const emailInput = document.getElementById('email');
Object.assign(emailInput, emailProps);

// Now input is fully connected!
// - Shows current value
// - Updates on input
// - Marks touched on blur
```

### Connect Multiple Inputs

```javascript
const form = ReactiveUtils.form({
  username: '',
  email: '',
  phone: ''
});

// Connect all fields
['username', 'email', 'phone'].forEach(field => {
  const input = document.getElementById(field);
  const props = form.getFieldProps(field);
  Object.assign(input, props);
});
```

### Creating New Input

```javascript
const form = ReactiveUtils.form({ message: '' });

// Create new input element
const input = document.createElement('input');
input.type = 'text';
input.name = 'message';

// Connect it to form
Object.assign(input, form.getFieldProps('message'));

// Add to DOM
document.body.appendChild(input);
```

---

## Simple Examples Explained

### Example 1: Dynamic Form Builder

```javascript
const form = ReactiveUtils.form({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});

const fields = [
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel' }
];

const formContainer = document.getElementById('form-container');

// Build form dynamically
fields.forEach(field => {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-field';

  const label = document.createElement('label');
  label.textContent = field.label;
  label.htmlFor = field.name;

  const input = document.createElement('input');
  input.type = field.type;
  input.id = field.name;
  input.name = field.name;

  // Connect input to form with getFieldProps
  Object.assign(input, form.getFieldProps(field.name));

  const error = document.createElement('span');
  error.className = 'error-message';
  error.id = `${field.name}-error`;

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(error);
  formContainer.appendChild(wrapper);
});

// Show errors
ReactiveUtils.effect(() => {
  fields.forEach(field => {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (form.shouldShowError(field.name)) {
      errorElement.textContent = form.getError(field.name);
    } else {
      errorElement.textContent = '';
    }
  });
});
```

**What happens:**

1. Form structure defined in array
2. Inputs created dynamically
3. `getFieldProps()` connects each input
4. All inputs fully functional
5. Errors display automatically
6. Clean, maintainable code

---

### Example 2: Reusable Form Component

```javascript
function createFormField(form, fieldName, options = {}) {
  const {
    type = 'text',
    label = fieldName,
    placeholder = '',
    className = 'form-control'
  } = options;

  const wrapper = document.createElement('div');
  wrapper.className = 'field-wrapper';

  // Label
  const labelElement = document.createElement('label');
  labelElement.textContent = label;
  labelElement.htmlFor = fieldName;

  // Input
  const input = document.createElement('input');
  input.type = type;
  input.id = fieldName;
  input.name = fieldName;
  input.placeholder = placeholder;
  input.className = className;

  // Connect with getFieldProps - one line!
  Object.assign(input, form.getFieldProps(fieldName));

  // Error display
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.id = `${fieldName}-error`;

  // Auto-update error display
  ReactiveUtils.effect(() => {
    if (form.shouldShowError(fieldName)) {
      errorElement.textContent = form.getError(fieldName);
      errorElement.style.display = 'block';
      input.classList.add('input-error');
    } else {
      errorElement.style.display = 'none';
      input.classList.remove('input-error');
    }
  });

  wrapper.appendChild(labelElement);
  wrapper.appendChild(input);
  wrapper.appendChild(errorElement);

  return wrapper;
}

// Usage
const contactForm = ReactiveUtils.form(
  {
    name: '',
    email: '',
    subject: '',
    message: ''
  },
  {
    validators: {
      name: ReactiveUtils.validators.required(),
      email: ReactiveUtils.validators.email(),
      subject: ReactiveUtils.validators.required(),
      message: ReactiveUtils.validators.minLength(10)
    }
  }
);

const formContainer = document.getElementById('contact-form');

formContainer.appendChild(
  createFormField(contactForm, 'name', {
    label: 'Your Name',
    placeholder: 'Enter your name'
  })
);

formContainer.appendChild(
  createFormField(contactForm, 'email', {
    type: 'email',
    label: 'Email Address',
    placeholder: 'you@example.com'
  })
);

formContainer.appendChild(
  createFormField(contactForm, 'subject', {
    label: 'Subject',
    placeholder: 'What is this about?'
  })
);
```

**What happens:**

1. Reusable `createFormField()` function
2. Uses `getFieldProps()` internally
3. Automatic error display
4. Consistent field structure
5. Easy to add new fields
6. Maintainable and clean

---

### Example 3: Form Field Factory

```javascript
const registrationForm = ReactiveUtils.form(
  {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  },
  {
    validators: {
      username: ReactiveUtils.validators.minLength(3),
      email: ReactiveUtils.validators.email(),
      password: ReactiveUtils.validators.minLength(8),
      confirmPassword: ReactiveUtils.validators.match('password'),
      agreeToTerms: ReactiveUtils.validators.custom(
        (value) => value === true,
        'You must agree to the terms'
      )
    }
  }
);

// Field factory
class FormField {
  constructor(form, fieldName, type = 'text') {
    this.form = form;
    this.fieldName = fieldName;
    this.type = type;
    this.render();
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'form-group';

    if (this.type === 'checkbox') {
      this.renderCheckbox();
    } else {
      this.renderInput();
    }

    this.setupReactivity();
  }

  renderInput() {
    this.input = document.createElement('input');
    this.input.type = this.type;
    this.input.id = this.fieldName;

    // Use getFieldProps for easy connection
    Object.assign(this.input, this.form.getFieldProps(this.fieldName));

    this.error = document.createElement('div');
    this.error.className = 'error-text';

    this.wrapper.appendChild(this.input);
    this.wrapper.appendChild(this.error);
  }

  renderCheckbox() {
    const label = document.createElement('label');

    this.input = document.createElement('input');
    this.input.type = 'checkbox';
    this.input.id = this.fieldName;

    // Get props (for checkbox, we use 'checked' instead of 'value')
    const props = this.form.getFieldProps(this.fieldName);
    this.input.checked = props.value;
    this.input.onchange = props.oninput;

    label.appendChild(this.input);
    label.appendChild(document.createTextNode(' ' + this.fieldName));

    this.error = document.createElement('div');
    this.error.className = 'error-text';

    this.wrapper.appendChild(label);
    this.wrapper.appendChild(this.error);
  }

  setupReactivity() {
    ReactiveUtils.effect(() => {
      if (this.form.shouldShowError(this.fieldName)) {
        this.error.textContent = this.form.getError(this.fieldName);
        this.error.style.display = 'block';
      } else {
        this.error.style.display = 'none';
      }
    });
  }

  getElement() {
    return this.wrapper;
  }
}

// Build form
const container = document.getElementById('registration-form');

const fields = [
  new FormField(registrationForm, 'username', 'text'),
  new FormField(registrationForm, 'email', 'email'),
  new FormField(registrationForm, 'password', 'password'),
  new FormField(registrationForm, 'confirmPassword', 'password'),
  new FormField(registrationForm, 'agreeToTerms', 'checkbox')
];

fields.forEach(field => {
  container.appendChild(field.getElement());
});
```

**What happens:**

1. Object-oriented form builder
2. `getFieldProps()` simplifies connection
3. Supports different input types
4. Automatic reactivity
5. Reusable and extensible
6. Clean architecture

---

## Real-World Example: Complete Survey Form

```javascript
const surveyForm = ReactiveUtils.form(
  {
    fullName: '',
    email: '',
    age: '',
    occupation: '',
    experience: '1',
    recommendation: '5',
    feedback: '',
    subscribe: false
  },
  {
    validators: {
      fullName: ReactiveUtils.validators.required('Name is required'),
      email: ReactiveUtils.validators.email('Please enter a valid email'),
      age: ReactiveUtils.validators.custom(
        (value) => value >= 18 && value <= 120,
        'Age must be between 18 and 120'
      ),
      occupation: ReactiveUtils.validators.required('Occupation is required'),
      feedback: ReactiveUtils.validators.minLength(20, 'Feedback must be at least 20 characters')
    }
  }
);

// Form configuration
const formConfig = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name'
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com'
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    placeholder: 'Your age'
  },
  {
    name: 'occupation',
    label: 'Occupation',
    type: 'text',
    placeholder: 'Your job title'
  },
  {
    name: 'experience',
    label: 'Years of Experience',
    type: 'select',
    options: [
      { value: '1', label: 'Less than 1 year' },
      { value: '2', label: '1-3 years' },
      { value: '3', label: '3-5 years' },
      { value: '4', label: '5+ years' }
    ]
  },
  {
    name: 'recommendation',
    label: 'How likely are you to recommend us? (1-10)',
    type: 'range',
    min: 1,
    max: 10
  },
  {
    name: 'feedback',
    label: 'Additional Feedback',
    type: 'textarea',
    placeholder: 'Tell us more...'
  },
  {
    name: 'subscribe',
    label: 'Subscribe to newsletter',
    type: 'checkbox'
  }
];

// Build form from config
const formContainer = document.getElementById('survey-form');

formConfig.forEach(config => {
  const fieldGroup = document.createElement('div');
  fieldGroup.className = 'field-group';

  const label = document.createElement('label');
  label.textContent = config.label;
  label.htmlFor = config.name;

  let input;

  if (config.type === 'select') {
    input = document.createElement('select');
    input.id = config.name;
    input.name = config.name;

    config.options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      input.appendChild(option);
    });

    // Apply field props
    const props = surveyForm.getFieldProps(config.name);
    input.value = props.value;
    input.onchange = props.oninput;

  } else if (config.type === 'textarea') {
    input = document.createElement('textarea');
    input.id = config.name;
    input.name = config.name;
    input.placeholder = config.placeholder || '';
    input.rows = 5;

    // Apply field props
    Object.assign(input, surveyForm.getFieldProps(config.name));

  } else if (config.type === 'checkbox') {
    input = document.createElement('input');
    input.type = 'checkbox';
    input.id = config.name;
    input.name = config.name;

    const props = surveyForm.getFieldProps(config.name);
    input.checked = props.value;
    input.onchange = props.oninput;

    // For checkbox, adjust label structure
    label.textContent = '';
    label.appendChild(input);
    label.appendChild(document.createTextNode(' ' + config.label));

  } else {
    input = document.createElement('input');
    input.type = config.type;
    input.id = config.name;
    input.name = config.name;
    input.placeholder = config.placeholder || '';

    if (config.min) input.min = config.min;
    if (config.max) input.max = config.max;

    // Apply field props with getFieldProps
    Object.assign(input, surveyForm.getFieldProps(config.name));
  }

  // Error message
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.id = `${config.name}-error`;

  // Reactive error display
  ReactiveUtils.effect(() => {
    if (surveyForm.shouldShowError(config.name)) {
      errorElement.textContent = surveyForm.getError(config.name);
      errorElement.style.display = 'block';
    } else {
      errorElement.style.display = 'none';
    }
  });

  if (config.type !== 'checkbox') {
    fieldGroup.appendChild(label);
  }
  fieldGroup.appendChild(input);
  if (config.type === 'checkbox') {
    fieldGroup.appendChild(label);
  }
  fieldGroup.appendChild(errorElement);

  formContainer.appendChild(fieldGroup);
});

// Show recommendation value in real-time
ReactiveUtils.effect(() => {
  const value = surveyForm.values.recommendation;
  document.getElementById('recommendation-value').textContent = value;
});

// Form submission
document.getElementById('submit-survey').onclick = () => {
  surveyForm.submit(async () => {
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyForm.values)
      });

      alert('Survey submitted successfully!');
      surveyForm.reset();
    } catch (err) {
      alert('Failed to submit survey');
    }
  });
};
```

**What happens:**
- Form built from configuration array
- `getFieldProps()` connects all inputs easily
- Supports text, number, select, textarea, checkbox, range
- Automatic error display
- Real-time updates
- Clean, maintainable architecture
- Easy to add/remove fields

---

## Common Patterns

### Pattern 1: Simple Connection

```javascript
const props = form.getFieldProps('fieldName');
Object.assign(input, props);
```

### Pattern 2: Dynamic Form Building

```javascript
fields.forEach(fieldName => {
  const input = document.createElement('input');
  Object.assign(input, form.getFieldProps(fieldName));
  container.appendChild(input);
});
```

### Pattern 3: Checkbox Handling

```javascript
const props = form.getFieldProps('checkbox');
checkbox.checked = props.value;
checkbox.onchange = props.oninput;
```

### Pattern 4: Destructuring Props

```javascript
const { value, oninput, onblur } = form.getFieldProps('fieldName');
input.value = value;
input.oninput = oninput;
input.onblur = onblur;
```

---

## Common Beginner Questions

### Q: What properties does `getFieldProps()` return?

**Answer:**

It returns an object with:
- `value`: Current field value
- `oninput`: Change handler
- `onblur`: Blur handler

```javascript
const props = form.getFieldProps('email');
// { value: '', oninput: Function, onblur: Function }
```

### Q: Does it work with checkboxes?

**Answer:**

Yes, but use `checked` instead of `value`:

```javascript
const props = form.getFieldProps('acceptTerms');
checkbox.checked = props.value; // Boolean value
checkbox.onchange = props.oninput;
```

### Q: Can I apply props to existing inputs?

**Answer:**

Yes! Use `Object.assign()`:

```javascript
const input = document.getElementById('email');
Object.assign(input, form.getFieldProps('email'));
```

### Q: What's the difference between this and individual methods?

**Answer:**

`getFieldProps()` combines them all:

```javascript
// getFieldProps - all in one
Object.assign(input, form.getFieldProps('email'));

// Individual - more code
input.value = form.values.email;
input.oninput = form.handleChange('email');
input.onblur = form.handleBlur('email');
```

### Q: Does it work with select and textarea?

**Answer:**

Yes! Works with all form elements:

```javascript
// Select
Object.assign(select, form.getFieldProps('category'));

// Textarea
Object.assign(textarea, form.getFieldProps('message'));
```

---

## Tips for Success

### 1. Use for Dynamic Forms

```javascript
// ✅ Perfect for building forms programmatically
fields.forEach(field => {
  const input = createElement('input');
  Object.assign(input, form.getFieldProps(field));
});
```

### 2. Apply with Object.assign

```javascript
// ✅ Easy way to apply all props
const input = document.getElementById('email');
Object.assign(input, form.getFieldProps('email'));
```

### 3. Great for Components

```javascript
// ✅ Simplifies reusable components
function FormInput({ form, fieldName }) {
  const input = document.createElement('input');
  Object.assign(input, form.getFieldProps(fieldName));
  return input;
}
```

### 4. Handle Checkboxes Specially

```javascript
// ✅ Remember: checked instead of value
const props = form.getFieldProps('checkbox');
checkbox.checked = props.value;
checkbox.onchange = props.oninput;
```

### 5. Use for Form Generators

```javascript
// ✅ Excellent for config-driven forms
config.forEach(field => {
  const input = createInput(field.type);
  Object.assign(input, form.getFieldProps(field.name));
});
```

---

## Summary

### What `getFieldProps()` Does:

1. ✅ Returns object with value, oninput, onblur
2. ✅ Combines all needed properties
3. ✅ Ready to apply with Object.assign()
4. ✅ Works with all input types
5. ✅ Simplifies form building
6. ✅ Reduces boilerplate code

### When to Use It:

- Dynamic form building (most common)
- Reusable form components
- Form generators
- Config-driven forms
- Any programmatic form creation
- Reducing boilerplate

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form({ fieldName: '' });

// Get all props in one call
const props = form.getFieldProps('fieldName');

// Apply to input
const input = document.getElementById('fieldName');
Object.assign(input, props);

// Or create new input
const newInput = document.createElement('input');
Object.assign(newInput, form.getFieldProps('fieldName'));

// Now input is fully connected!
```

---

**Remember:** `getFieldProps()` gives you everything you need to connect an input in one call. Perfect for dynamic forms and components. Use it to reduce boilerplate and keep your code clean! 🎉
