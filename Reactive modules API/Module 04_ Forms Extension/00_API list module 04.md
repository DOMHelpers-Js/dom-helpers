[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

## Module 04: Forms Extension (`04_dh-reactive-form.js`)

### Forms Extension Namespace

- **`Forms.create(initialValues, options)`** - Create reactive form
- **`Forms.form(initialValues, options)`** - Alias for create
- **`Forms.validators`** - Object containing all validators
- **`Forms.v`** - Shorthand alias for validators

### ReactiveUtils Integration

- **`ReactiveUtils.form(initialValues, options)`** - Create form via ReactiveUtils
- **`ReactiveUtils.createForm(initialValues, options)`** - Alias
- **`ReactiveUtils.validators`** - Access validators via ReactiveUtils

### Value Management

When using `Forms.create()` or `Forms.form()`:

- **`setValue(field, value)`** - Set single field value (returns this)
- **`setValues(values)`** - Set multiple field values in batch (returns this)
- **`getValue(field)`** - Get field value

### Error Management

- **`setError(field, error)`** - Set field error (returns this)
- **`setErrors(errors)`** - Set multiple errors in batch (returns this)
- **`clearError(field)`** - Clear field error (returns this)
- **`clearErrors()`** - Clear all errors (returns this)
- **`hasError(field)`** - Check if field has error
- **`getError(field)`** - Get field error message

### Touched State Management

- **`setTouched(field, touched)`** - Mark field as touched (returns this)
- **`setTouchedFields(fields)`** - Mark multiple fields as touched (returns this)
- **`touchAll()`** - Mark all fields as touched (returns this)
- **`isTouched(field)`** - Check if field is touched
- **`shouldShowError(field)`** - Check if should show error (touched + has error)

### Validation

- **`validateField(field)`** - Validate single field (returns boolean)
- **`validate()`** - Validate all fields (returns boolean)

### Reset

- **`reset(newValues)`** - Reset form to initial or new values (returns this)
- **`resetField(field)`** - Reset single field (returns this)

### Submission

- **`submit(customHandler)`** - Handle form submission (async, returns result object)

### Event Handlers

- **`handleChange(event)`** - Handle input change event
- **`handleBlur(event)`** - Handle input blur event
- **`getFieldProps(field)`** - Get field props for binding (returns object with name, value, onChange, onBlur)

### DOM Binding

- **`bindToInputs(selector)`** - Bind form to DOM inputs (returns this)

### Serialization

- **`toObject()`** - Convert to plain object

### Computed Properties (Forms Extension)

- **`isValid`** - Check if form is valid (computed property)
- **`isDirty`** - Check if form is dirty (computed property)
- **`hasErrors`** - Check if has errors (computed property)
- **`touchedFields`** - Get touched fields array (computed property)
- **`errorFields`** - Get error fields array (computed property)

### Built-in Validators

- **`Validators.required(message)`** - Required field validator
- **`Validators.email(message)`** - Email format validator
- **`Validators.minLength(min, message)`** - Minimum length validator
- **`Validators.maxLength(max, message)`** - Maximum length validator
- **`Validators.pattern(regex, message)`** - Pattern/regex validator
- **`Validators.min(min, message)`** - Minimum value validator
- **`Validators.max(max, message)`** - Maximum value validator
- **`Validators.match(fieldName, message)`** - Match field validator
- **`Validators.custom(validatorFn)`** - Custom validator function
- **`Validators.combine(...validators)`** - Combine multiple validators

---
