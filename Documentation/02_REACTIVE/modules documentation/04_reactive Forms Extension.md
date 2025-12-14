# DOM Helpers - Forms Extension v1.0.0

## 📚 Overview

The **Forms Extension** provides comprehensive reactive form management with validation, error handling, and state tracking. It simplifies form handling with automatic validation, two-way binding, and submission management.

---

## 🎯 Core Creation Methods

### 1. **Forms.create(initialValues, options) / ReactiveUtils.form()**
Creates a reactive form with validation support.

```javascript
// Basic form
const loginForm = Forms.create({
  email: '',
  password: ''
});

// Form with validators
const signupForm = Forms.create(
  {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  {
    validators: {
      username: Forms.validators.required('Username is required'),
      email: Forms.validators.combine(
        Forms.validators.required(),
        Forms.validators.email()
      ),
      password: Forms.validators.minLength(8),
      confirmPassword: Forms.validators.match('password', 'Passwords must match')
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      return response.json();
    }
  }
);

// Using ReactiveUtils
const form = ReactiveUtils.form({ name: '', email: '' });
```

---

## 🔧 Form State Properties

### Reactive State Properties

```javascript
const form = Forms.create({ email: '', password: '' });

// Values object
console.log(form.values);        // { email: '', password: '' }

// Errors object
console.log(form.errors);        // {}

// Touched fields object
console.log(form.touched);       // {}

// Submission state
console.log(form.isSubmitting);  // false
console.log(form.submitCount);   // 0
```

### Computed Properties

```javascript
// Auto-computed properties
console.log(form.isValid);       // true/false - no validation errors
console.log(form.isDirty);       // true/false - any field touched
console.log(form.hasErrors);     // true/false - has any errors
console.log(form.touchedFields); // ['email', 'password'] - list of touched fields
console.log(form.errorFields);   // ['email'] - list of fields with errors
```

---

## 📝 Value Management Methods

### 2. **form.setValue(field, value)**
Sets a single field value and marks it as touched.

```javascript
const form = Forms.create({ email: '', password: '' });

form.setValue('email', 'user@example.com');
form.setValue('password', 'secret123');

console.log(form.values.email);    // 'user@example.com'
console.log(form.touched.email);   // true
```

### 3. **form.setValues(values)**
Sets multiple field values at once (batched).

```javascript
form.setValues({
  email: 'user@example.com',
  password: 'secret123',
  remember: true
});

// All fields updated and marked as touched
console.log(form.values);
console.log(form.touched);
```

### 4. **form.getValue(field)**
Gets a field's value.

```javascript
const email = form.getValue('email');
console.log(email);  // 'user@example.com'
```

---

## ⚠️ Error Management Methods

### 5. **form.setError(field, error)**
Sets an error for a field.

```javascript
form.setError('email', 'Email is already taken');
form.setError('password', 'Password is too weak');

console.log(form.errors.email);  // 'Email is already taken'
console.log(form.hasErrors);     // true
console.log(form.isValid);       // false
```

### 6. **form.setErrors(errors)**
Sets multiple errors at once (batched).

```javascript
form.setErrors({
  email: 'Invalid email format',
  password: 'Password must be at least 8 characters',
  username: 'Username is taken'
});
```

### 7. **form.clearError(field)**
Clears error for a specific field.

```javascript
form.clearError('email');
console.log(form.errors.email);  // undefined
```

### 8. **form.clearErrors()**
Clears all errors.

```javascript
form.clearErrors();
console.log(form.errors);      // {}
console.log(form.hasErrors);   // false
console.log(form.isValid);     // true
```

### 9. **form.hasError(field)**
Checks if a field has an error.

```javascript
if (form.hasError('email')) {
  console.log('Email has an error');
}
```

### 10. **form.getError(field)**
Gets error message for a field.

```javascript
const emailError = form.getError('email');
console.log(emailError);  // 'Invalid email format' or null
```

---

## 👆 Touch State Methods

### 11. **form.setTouched(field, touched)**
Marks a field as touched or untouched.

```javascript
form.setTouched('email', true);   // Mark as touched
form.setTouched('email', false);  // Mark as untouched

console.log(form.touched.email);  // true/false
```

### 12. **form.setTouchedFields(fields)**
Marks multiple fields as touched.

```javascript
form.setTouchedFields(['email', 'password', 'username']);

console.log(form.touchedFields);  // ['email', 'password', 'username']
```

### 13. **form.touchAll()**
Marks all fields as touched (useful before submit).

```javascript
form.touchAll();

// All fields in form.values are now marked as touched
console.log(form.touched);  // { email: true, password: true, ... }
```

### 14. **form.isTouched(field)**
Checks if a field is touched.

```javascript
if (form.isTouched('email')) {
  console.log('Email field has been interacted with');
}
```

### 15. **form.shouldShowError(field)**
Checks if error should be displayed (touched + has error).

```javascript
// Only show error if user has interacted with field
if (form.shouldShowError('email')) {
  // Display error message
  Elements.emailError.update({
    textContent: form.getError('email'),
    hidden: false
  });
}
```

---

## ✅ Validation Methods

### 16. **form.validateField(field)**
Validates a single field.

```javascript
const isValid = form.validateField('email');

if (!isValid) {
  console.log('Email validation failed:', form.getError('email'));
}
```

### 17. **form.validate()**
Validates all fields.

```javascript
const isFormValid = form.validate();

if (isFormValid) {
  console.log('Form is valid, ready to submit!');
} else {
  console.log('Form has errors:', form.errors);
}
```

---

## 🚀 Submission Methods

### 18. **form.submit(handler)**
Submits the form with validation.

```javascript
// Submit with handler
const result = await form.submit(async (values) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  });
  return response.json();
});

if (result.success) {
  console.log('Form submitted successfully:', result.result);
} else {
  console.log('Form submission failed:', result.error || result.errors);
}

// Submit with configured handler (from options)
const form = Forms.create(
  { email: '', password: '' },
  {
    onSubmit: async (values) => {
      // Submit logic
    }
  }
);

await form.submit();  // Uses configured handler
```

**Return value:**
```javascript
// On success:
{ success: true, result: /* handler return value */ }

// On validation failure:
{ success: false, errors: { email: '...', password: '...' } }

// On exception:
{ success: false, error: /* error object */ }
```

---

## 🔄 Reset Methods

### 19. **form.reset(newValues)**
Resets form to initial or new values.

```javascript
// Reset to initial values
form.reset();

// Reset to new values
form.reset({
  email: 'newuser@example.com',
  password: ''
});

console.log(form.values);        // Reset values
console.log(form.errors);        // {}
console.log(form.touched);       // {}
console.log(form.isSubmitting);  // false
```

### 20. **form.resetField(field)**
Resets a single field to its initial value.

```javascript
form.resetField('email');

console.log(form.values.email);   // Initial value
console.log(form.errors.email);   // undefined
console.log(form.touched.email);  // undefined
```

---

## 🎯 Event Handler Methods

### 21. **form.handleChange(event)**
Handles input change events.

```javascript
// HTML
<input 
  type="text" 
  name="email" 
  onchange={(e) => form.handleChange(e)}
/>

// Or with addEventListener
Elements.emailInput.addEventListener('input', (e) => {
  form.handleChange(e);
});

// Works with checkboxes
<input 
  type="checkbox" 
  name="remember" 
  onchange={(e) => form.handleChange(e)}
/>
```

### 22. **form.handleBlur(event)**
Handles input blur events (triggers validation).

```javascript
<input 
  type="text" 
  name="email" 
  onblur={(e) => form.handleBlur(e)}
/>

// Or
Elements.emailInput.addEventListener('blur', (e) => {
  form.handleBlur(e);
});
```

### 23. **form.getFieldProps(field)**
Gets all props needed for a field.

```javascript
const emailProps = form.getFieldProps('email');

// Returns:
// {
//   name: 'email',
//   value: 'user@example.com',
//   onChange: (e) => form.handleChange(e),
//   onBlur: (e) => form.handleBlur(e)
// }

// Use with spread operator
<input type="text" {...emailProps} />
```

---

## 🔗 Binding Methods

### 24. **form.bindToInputs(selector)**
Automatically binds form to DOM inputs.

```javascript
const form = Forms.create({
  username: '',
  email: '',
  password: ''
});

// Bind to all inputs in a form element
form.bindToInputs('form input');

// Or specific inputs
form.bindToInputs('#signupForm input, #signupForm select');

// Now inputs automatically update form state
```

### 25. **form.toObject()**
Converts form to plain object.

```javascript
const formData = form.toObject();

console.log(formData);
// {
//   values: { email: '...', password: '...' },
//   errors: { email: '...' },
//   touched: { email: true },
//   isValid: false,
//   isDirty: true,
//   isSubmitting: false,
//   submitCount: 2
// }
```

---

## ✨ Built-in Validators

### 26. **Forms.validators.required(message)**
Validates that field is not empty.

```javascript
const form = Forms.create(
  { name: '' },
  {
    validators: {
      name: Forms.validators.required('Name is required')
    }
  }
);
```

### 27. **Forms.validators.email(message)**
Validates email format.

```javascript
{
  validators: {
    email: Forms.validators.email('Please enter a valid email')
  }
}
```

### 28. **Forms.validators.minLength(min, message)**
Validates minimum length.

```javascript
{
  validators: {
    password: Forms.validators.minLength(8, 'Password must be at least 8 characters')
  }
}
```

### 29. **Forms.validators.maxLength(max, message)**
Validates maximum length.

```javascript
{
  validators: {
    username: Forms.validators.maxLength(20, 'Username must be no more than 20 characters')
  }
}
```

### 30. **Forms.validators.pattern(regex, message)**
Validates against regex pattern.

```javascript
{
  validators: {
    username: Forms.validators.pattern(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    )
  }
}
```

### 31. **Forms.validators.min(min, message)**
Validates minimum numeric value.

```javascript
{
  validators: {
    age: Forms.validators.min(18, 'Must be at least 18 years old')
  }
}
```

### 32. **Forms.validators.max(max, message)**
Validates maximum numeric value.

```javascript
{
  validators: {
    quantity: Forms.validators.max(100, 'Cannot exceed 100 items')
  }
}
```

### 33. **Forms.validators.match(fieldName, message)**
Validates that field matches another field.

```javascript
{
  validators: {
    password: Forms.validators.required(),
    confirmPassword: Forms.validators.match('password', 'Passwords must match')
  }
}
```

### 34. **Forms.validators.custom(fn)**
Custom validation function.

```javascript
{
  validators: {
    email: Forms.validators.custom((value, allValues) => {
      if (!value.includes('@company.com')) {
        return 'Must be a company email';
      }
      return null;  // No error
    })
  }
}
```

### 35. **Forms.validators.combine(...validators)**
Combines multiple validators.

```javascript
{
  validators: {
    email: Forms.validators.combine(
      Forms.validators.required('Email is required'),
      Forms.validators.email('Invalid email format'),
      Forms.validators.custom((value) => {
        return value.endsWith('@company.com') 
          ? null 
          : 'Must be a company email';
      })
    ),
    password: Forms.validators.combine(
      Forms.validators.required(),
      Forms.validators.minLength(8),
      Forms.validators.pattern(
        /[A-Z]/,
        'Must contain at least one uppercase letter'
      )
    )
  }
}
```

---

## 📝 Practical Examples

### Example 1: Login Form
```javascript
const loginForm = Forms.create(
  {
    email: '',
    password: '',
    remember: false
  },
  {
    validators: {
      email: Forms.validators.combine(
        Forms.validators.required('Email is required'),
        Forms.validators.email()
      ),
      password: Forms.validators.required('Password is required')
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json();
    }
  }
);

// Bind to DOM
loginForm.$bind({
  '#emailInput': {
    value: () => loginForm.values.email,
    className: () => loginForm.shouldShowError('email') ? 'error' : ''
  },
  '#passwordInput': {
    value: () => loginForm.values.password,
    className: () => loginForm.shouldShowError('password') ? 'error' : ''
  },
  '#emailError': {
    textContent: () => loginForm.getError('email') || '',
    hidden: () => !loginForm.shouldShowError('email')
  },
  '#passwordError': {
    textContent: () => loginForm.getError('password') || '',
    hidden: () => !loginForm.shouldShowError('password')
  },
  '#submitBtn': {
    disabled: () => loginForm.isSubmitting || !loginForm.isValid
  },
  '#submitBtnText': {
    textContent: () => loginForm.isSubmitting ? 'Logging in...' : 'Login'
  }
});

// Event handlers
Elements.loginBtn.addEventListener('click', async () => {
  const result = await loginForm.submit();
  
  if (result.success) {
    window.location.href = '/dashboard';
  } else {
    alert('Login failed');
  }
});
```

### Example 2: Signup Form with Complex Validation
```javascript
const signupForm = Forms.create(
  {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    terms: false
  },
  {
    validators: {
      username: Forms.validators.combine(
        Forms.validators.required(),
        Forms.validators.minLength(3),
        Forms.validators.maxLength(20),
        Forms.validators.pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')
      ),
      email: Forms.validators.combine(
        Forms.validators.required(),
        Forms.validators.email()
      ),
      password: Forms.validators.combine(
        Forms.validators.required(),
        Forms.validators.minLength(8),
        Forms.validators.custom((value) => {
          if (!/[A-Z]/.test(value)) {
            return 'Must contain at least one uppercase letter';
          }
          if (!/[0-9]/.test(value)) {
            return 'Must contain at least one number';
          }
          return null;
        })
      ),
      confirmPassword: Forms.validators.match('password', 'Passwords must match'),
      age: Forms.validators.combine(
        Forms.validators.required('Age is required'),
        Forms.validators.min(18, 'Must be at least 18 years old')
      ),
      terms: Forms.validators.custom((value) => {
        return value ? null : 'You must accept the terms';
      })
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      return response.json();
    }
  }
);

// Auto-bind to inputs
signupForm.bindToInputs('#signupForm input');

// Submit handler
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const result = await signupForm.submit();
  
  if (result.success) {
    alert('Signup successful!');
    window.location.href = '/welcome';
  }
});
```

### Example 3: Dynamic Form with Conditional Validation
```javascript
const orderForm = Forms.create(
  {
    productType: 'digital',
    email: '',
    shippingAddress: '',
    billingAddress: '',
    sameAsShipping: false
  },
  {
    validators: {
      email: Forms.validators.combine(
        Forms.validators.required(),
        Forms.validators.email()
      ),
      shippingAddress: Forms.validators.custom((value, allValues) => {
        // Only required for physical products
        if (allValues.productType === 'physical' && !value) {
          return 'Shipping address is required for physical products';
        }
        return null;
      }),
      billingAddress: Forms.validators.custom((value, allValues) => {
        // Only required if not same as shipping
        if (!allValues.sameAsShipping && !value) {
          return 'Billing address is required';
        }
        return null;
      })
    }
  }
);

// Watch for changes to toggle visibility
orderForm.$watch('productType', (type) => {
  Elements.shippingSection.update({
    hidden: type === 'digital'
  });
});

orderForm.$watch('sameAsShipping', (same) => {
  Elements.billingSection.update({
    hidden: same
  });
  
  if (same) {
    orderForm.setValue('billingAddress', orderForm.values.shippingAddress);
  }
});
```

### Example 4: Multi-Step Form
```javascript
const multiStepForm = Forms.create(
  {
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    
    // Step 2
    address: '',
    city: '',
    zip: '',
    
    // Step 3
    cardNumber: '',
    expiry: '',
    cvv: ''
  },
  {
    validators: {
      firstName: Forms.validators.required(),
      lastName: Forms.validators.required(),
      email: Forms.validators.combine(
        Forms.validators.required(),
        Forms.validators.email()
      ),
      address: Forms.validators.required(),
      city: Forms.validators.required(),
      zip: Forms.validators.pattern(/^\d{5}$/, 'Must be 5 digits'),
      cardNumber: Forms.validators.pattern(/^\d{16}$/, 'Must be 16 digits'),
      expiry: Forms.validators.required(),
      cvv: Forms.validators.pattern(/^\d{3}$/, 'Must be 3 digits')
    }
  }
);

let currentStep = 1;

function validateStep(step) {
  const stepFields = {
    1: ['firstName', 'lastName', 'email'],
    2: ['address', 'city', 'zip'],
    3: ['cardNumber', 'expiry', 'cvv']
  };
  
  const fields = stepFields[step];
  let isValid = true;
  
  fields.forEach(field => {
    multiStepForm.setTouched(field);
    if (!multiStepForm.validateField(field)) {
      isValid = false;
    }
  });
  
  return isValid;
}

function nextStep() {
  if (validateStep(currentStep)) {
    currentStep++;
    updateStepDisplay();
  }
}

function prevStep() {
  currentStep--;
  updateStepDisplay();
}

async function submitForm() {
  if (validateStep(3)) {
    await multiStepForm.submit();
  }
}
```

### Example 5: Form with Real-time Async Validation
```javascript
const form = Forms.create(
  { username: '', email: '' },
  {
    validators: {
      username: Forms.validators.custom(async (value) => {
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Must be at least 3 characters';
        
        // Check availability
        const response = await fetch(`/api/check-username?username=${value}`);
        const data = await response.json();
        
        return data.available ? null : 'Username is already taken';
      }),
      email: Forms.validators.email()
    }
  }
);

// Debounced validation on username change
let usernameTimeout;
form.$watch('values.username', (username) => {
  clearTimeout(usernameTimeout);
  usernameTimeout = setTimeout(() => {
    form.validateField('username');
  }, 500);
});
```

### Example 6: Form with File Upload
```javascript
const uploadForm = Forms.create(
  {
    title: '',
    description: '',
    file: null
  },
  {
    validators: {
      title: Forms.validators.required(),
      description: Forms.validators.maxLength(500),
      file: Forms.validators.custom((file) => {
        if (!file) return 'Please select a file';
        if (file.size > 5 * 1024 * 1024) {
          return 'File must be less than 5MB';
        }
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          return 'Only JPEG and PNG files are allowed';
        }
        return null;
      })
    }
  }
);

Elements.fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  uploadForm.setValue('file', file);
});
```

---

## 🚨 Important Notes

1. **Automatic Validation** - Fields validate automatically when they have a validator and setValue is called
2. **Touch State** - Errors typically shown only when field is touched
3. **Batched Updates** - Methods like setValues and validate use batching for performance
4. **Async Support** - Submit handlers and validators can be async
5. **Chaining** - Most methods return `this` for chaining
6. **Reactive** - All state changes trigger reactive updates
7. **Type-Safe** - Works with checkboxes, selects, text inputs, etc.

This extension makes form handling in vanilla JavaScript as elegant as in modern frameworks!