# Understanding `validators.max()` - A Beginner's Guide

## What is `validators.max()`?

`validators.max(maxValue)` is a built-in validator that checks if a number is less than or equal to a maximum value.

Think of it as **maximum value enforcer** - number can't exceed this value.

**Alias:** `v.max()` - Use either `validators.max()` or `v.max()`, they're identical.

---

## Why Does This Exist?

### The Problem: Validating Maximum Values

You need to ensure numbers don't exceed limits:
```javascript
// ❌ Without validator - manual check
if (quantity > 100) {
  errors.quantity = 'Cannot exceed 100';
}

// ✅ With max() - automatic
const form = ReactiveUtils.form(
  { quantity: 1 },
  {
    validators: {
      quantity: v.max(100)
    }
  }
);
```

---

## How Does It Work?
```javascript
validators.max(maxValue, message?)
    ↓
Checks value <= maxValue
    ↓
Returns error message or null
```

---

## Basic Usage

### Quantity Limit
```javascript
const form = ReactiveUtils.form(
  { quantity: 1 },
  {
    validators: {
      quantity: v.max(100, 'Maximum quantity is 100')
    }
  }
);

form.setValue('quantity', 150);
console.log(form.errors.quantity); // 'Maximum quantity is 100'

form.setValue('quantity', 50);
console.log(form.errors.quantity); // undefined (valid)
```

### Age Limit
```javascript
const form = ReactiveUtils.form(
  { age: 0 },
  {
    validators: {
      age: v.max(120, 'Please enter a valid age')
    }
  }
);
```

---

## Simple Examples

### Example 1: Order Form
```javascript
const orderForm = ReactiveUtils.form(
  { quantity: 1 },
  {
    validators: {
      quantity: v.combine(
        v.min(1, 'Minimum 1'),
        v.max(10, 'Maximum 10 per order')
      )
    }
  }
);

// Usage
orderForm.setValue('quantity', 15);
console.log(orderForm.errors.quantity); // 'Maximum 10 per order'
```

### Example 2: Discount Code
```javascript
const form = ReactiveUtils.form(
  { discountPercent: 0 },
  {
    validators: {
      discountPercent: v.combine(
        v.min(0),
        v.max(100, 'Discount cannot exceed 100%')
      )
    }
  }
);

// Usage
form.setValue('discountPercent', 150);
console.log(form.errors.discountPercent); // 'Discount cannot exceed 100%'
```

---

## Complete Example: Product Form
```javascript
const productForm = ReactiveUtils.form(
  {
    price: 0,
    stock: 0,
    rating: 0
  },
  {
    validators: {
      price: v.combine(
        v.required('Price is required'),
        v.min(0.01, 'Price must be positive'),
        v.max(99999, 'Price too high')
      ),
      stock: v.combine(
        v.required(),
        v.min(0),
        v.max(9999, 'Maximum stock is 9999')
      ),
      rating: v.combine(
        v.min(0),
        v.max(5, 'Rating must be 0-5')
      )
    }
  }
);

// Set values
productForm.setValue('price', 150000);
console.log(productForm.errors.price); // 'Price too high'

productForm.setValue('price', 99.99);
console.log(productForm.errors.price); // undefined (valid)
```

---

## Common Patterns

### Pattern 1: Percentage (0-100)
```javascript
const form = ReactiveUtils.form(
  { percentage: 0 },
  {
    validators: {
      percentage: v.combine(v.min(0), v.max(100))
    }
  }
);
```

### Pattern 2: Rating (1-5)
```javascript
const form = ReactiveUtils.form(
  { rating: 0 },
  {
    validators: {
      rating: v.combine(v.min(1), v.max(5))
    }
  }
);
```

### Pattern 3: Age Validation
```javascript
const form = ReactiveUtils.form(
  { age: '' },
  {
    validators: {
      age: v.combine(
        v.required(),
        v.min(18, 'Must be 18 or older'),
        v.max(120, 'Please enter a valid age')
      )
    }
  }
);
```

---

## Working with Form Methods
```javascript
const form = ReactiveUtils.form(
  { quantity: 1 },
  {
    validators: {
      quantity: v.max(100)
    }
  }
);

// Set value and auto-validate
form.setValue('quantity', 150);

// Check validation
console.log(form.isValid);        // false
console.log(form.hasErrors);      // true
console.log(form.errors.quantity); // 'Must be no more than 100'

// Manual validation
form.validateField('quantity');

// Check if should show error (touched + has error)
form.setTouched('quantity');
console.log(form.shouldShowError('quantity')); // true
```

---

## Summary

### What `validators.max()` Does:

1. ✅ Checks maximum value (value <= max)
2. ✅ Works with numbers
3. ✅ Returns error message or null
4. ✅ Custom error messages supported
5. ✅ Can combine with other validators

### The Basic Pattern:
```javascript
// Simple usage
const form = ReactiveUtils.form(
  { field: 0 },
  {
    validators: {
      field: v.max(100)
    }
  }
);

// With custom message
const form = ReactiveUtils.form(
  { field: 0 },
  {
    validators: {
      field: v.max(100, 'Cannot exceed 100')
    }
  }
);

// Combined with other validators
const form = ReactiveUtils.form(
  { field: 0 },
  {
    validators: {
      field: v.combine(
        v.required(),
        v.min(1),
        v.max(100, 'Maximum is 100')
      )
    }
  }
);
```

---

**Remember:** Use `v.max()` to enforce maximum number limits! 🎉