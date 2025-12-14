# Understanding `validators.min()` - A Beginner's Guide

## What is `validators.min()`?

`validators.min(minValue)` is a built-in validator that checks if a number is greater than or equal to a minimum value.

Think of it as **minimum value enforcer** - number must be at least this value.

**Alias:** `v.min()` - Use either `validators.min()` or `v.min()`, they're identical.

---

## Why Does This Exist?

### The Problem: Validating Minimum Values

You need to ensure numbers meet minimum requirements:

```javascript
// ❌ Without validator - manual check
if (age < 18) {
  errors.age = 'Must be at least 18';
}

// ✅ With min() - automatic
const form = ReactiveUtils.form(
  { age: 0 },
  {
    validators: {
      age: v.min(18)
    }
  }
);
```

---

## How Does It Work?

```javascript
validators.min(minValue, message?)
    ↓
Checks value >= minValue
    ↓
Returns error message or null
```

---

## Basic Usage

### Age Validation

```javascript
const form = ReactiveUtils.form(
  { age: 0 },
  {
    validators: {
      age: v.min(18, 'Must be 18 or older')
    }
  }
);

form.setValue('age', 16);
console.log(form.errors.age); // 'Must be 18 or older'

form.setValue('age', 21);
console.log(form.errors.age); // null (valid)
```

### Price Validation

```javascript
const form = ReactiveUtils.form(
  {
    price: 0,
    quantity: 1
  },
  {
    validators: {
      price: v.min(0, 'Price cannot be negative'),
      quantity: v.min(1, 'Quantity must be at least 1')
    }
  }
);
```

---

## Simple Examples

### Example 1: Product Form

```javascript
const productForm = ReactiveUtils.form(
  {
    price: 0,
    stock: 0,
    discount: 0
  },
  {
    validators: {
      price: v.combine([
        v.required(),
        v.min(0.01, 'Price must be at least $0.01')
      ]),
      stock: v.min(0, 'Stock cannot be negative'),
      discount: v.min(0, 'Discount cannot be negative')
    }
  }
);
```

### Example 2: Age Verification

```javascript
const registrationForm = ReactiveUtils.form(
  { age: 0 },
  {
    validators: {
      age: v.combine([
        v.required(),
        v.min(18, 'You must be 18 or older')
      ])
    }
  }
);

// Display age requirement
ReactiveUtils.effect(() => {
  const message = document.getElementById('age-message');
  const age = registrationForm.values.age;

  if (!age) {
    message.innerHTML = '';
  } else if (age < 18) {
    message.innerHTML = '<span class="error">You must be 18 or older to register</span>';
  } else {
    message.innerHTML = '<span class="success">✓ Age requirement met</span>';
  }
});
```

---

## Real-World Example: E-commerce Order Form

```javascript
const orderForm = ReactiveUtils.form(
  {
    quantity: 1,
    discountCode: '',
    shippingInsurance: 0
  },
  {
    validators: {
      quantity: v.combine([
        v.required('Quantity is required'),
        v.min(1, 'Quantity must be at least 1'),
        v.max(99, 'Maximum quantity is 99')
      ]),
      shippingInsurance: v.min(0, 'Insurance value cannot be negative')
    }
  }
);

// Calculate total with validation
const totals = ReactiveUtils.state({
  subtotal: 0,
  shipping: 0,
  insurance: 0,
  total: 0
});

totals.$computed('subtotal', function() {
  return orderForm.values.quantity * 29.99;
});

totals.$computed('total', function() {
  return this.subtotal + this.shipping + orderForm.values.shippingInsurance;
});

// Display order form
ReactiveUtils.effect(() => {
  const container = document.getElementById('order-form');

  container.innerHTML = `
    <form onsubmit="placeOrder(event)">
      <div class="field">
        <label>Quantity *</label>
        <input type="number"
               value="${orderForm.values.quantity}"
               oninput="orderForm.setValue('quantity', parseInt(this.value) || 0)"
               min="1"
               max="99">
        ${orderForm.errors.quantity ? `
          <span class="error">${orderForm.errors.quantity}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Shipping Insurance (optional)</label>
        <input type="number"
               step="0.01"
               value="${orderForm.values.shippingInsurance}"
               oninput="orderForm.setValue('shippingInsurance', parseFloat(this.value) || 0)"
               min="0">
        ${orderForm.errors.shippingInsurance ? `
          <span class="error">${orderForm.errors.shippingInsurance}</span>
        ` : ''}
        <small>Add insurance for $${orderForm.values.shippingInsurance.toFixed(2)}</small>
      </div>

      <div class="order-summary">
        <div>Subtotal: $${totals.subtotal.toFixed(2)}</div>
        <div>Shipping: $${totals.shipping.toFixed(2)}</div>
        <div>Insurance: $${orderForm.values.shippingInsurance.toFixed(2)}</div>
        <div class="total">Total: $${totals.total.toFixed(2)}</div>
      </div>

      <button type="submit" ${!orderForm.isValid ? 'disabled' : ''}>
        Place Order
      </button>
    </form>
  `;
});
```

---

## Real-World Example 2: Rating System

```javascript
const ratingForm = ReactiveUtils.form(
  {
    rating: 0,
    wouldRecommend: false
  },
  {
    validators: {
      rating: v.combine([
        v.required('Please select a rating'),
        v.min(1, 'Minimum rating is 1'),
        v.max(5, 'Maximum rating is 5')
      ])
    }
  }
);

// Display star rating
ReactiveUtils.effect(() => {
  const container = document.getElementById('rating-form');

  container.innerHTML = `
    <div class="rating-stars">
      ${[1, 2, 3, 4, 5].map(star => `
        <span class="star ${star <= ratingForm.values.rating ? 'filled' : ''}"
              onclick="ratingForm.setValue('rating', ${star})">
          ★
        </span>
      `).join('')}
    </div>
    ${ratingForm.errors.rating ? `
      <span class="error">${ratingForm.errors.rating}</span>
    ` : ''}
    <p>${ratingForm.values.rating > 0 ? `You rated ${ratingForm.values.rating} out of 5 stars` : 'Click to rate'}</p>
  `;
});
```

---

## Real-World Example 3: Investment Calculator

```javascript
const investmentForm = ReactiveUtils.form(
  {
    initialAmount: 0,
    monthlyContribution: 0,
    years: 1,
    expectedReturn: 7
  },
  {
    validators: {
      initialAmount: v.combine([
        v.required('Initial amount is required'),
        v.min(100, 'Minimum initial investment is $100')
      ]),
      monthlyContribution: v.min(0, 'Monthly contribution cannot be negative'),
      years: v.combine([
        v.required('Investment period is required'),
        v.min(1, 'Minimum investment period is 1 year'),
        v.max(50, 'Maximum investment period is 50 years')
      ]),
      expectedReturn: v.combine([
        v.required('Expected return is required'),
        v.min(0.1, 'Expected return must be at least 0.1%'),
        v.max(30, 'Expected return cannot exceed 30%')
      ])
    }
  }
);

// Calculate future value
const calculations = ReactiveUtils.state({
  futureValue: 0,
  totalContributions: 0,
  totalGains: 0
});

calculations.$computed('totalContributions', function() {
  return investmentForm.values.initialAmount + 
         (investmentForm.values.monthlyContribution * investmentForm.values.years * 12);
});

calculations.$computed('futureValue', function() {
  const P = investmentForm.values.initialAmount;
  const PMT = investmentForm.values.monthlyContribution;
  const r = investmentForm.values.expectedReturn / 100 / 12;
  const n = investmentForm.values.years * 12;

  const fv = P * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r);
  return fv;
});

calculations.$computed('totalGains', function() {
  return this.futureValue - this.totalContributions;
});

// Display calculator
ReactiveUtils.effect(() => {
  const container = document.getElementById('investment-calculator');

  container.innerHTML = `
    <form>
      <div class="field">
        <label>Initial Investment *</label>
        <input type="number"
               step="100"
               value="${investmentForm.values.initialAmount}"
               oninput="investmentForm.setValue('initialAmount', parseFloat(this.value) || 0)">
        ${investmentForm.errors.initialAmount ? `
          <span class="error">${investmentForm.errors.initialAmount}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Monthly Contribution</label>
        <input type="number"
               step="50"
               value="${investmentForm.values.monthlyContribution}"
               oninput="investmentForm.setValue('monthlyContribution', parseFloat(this.value) || 0)">
        ${investmentForm.errors.monthlyContribution ? `
          <span class="error">${investmentForm.errors.monthlyContribution}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Investment Period (years) *</label>
        <input type="number"
               value="${investmentForm.values.years}"
               oninput="investmentForm.setValue('years', parseInt(this.value) || 1)"
               min="1"
               max="50">
        ${investmentForm.errors.years ? `
          <span class="error">${investmentForm.errors.years}</span>
        ` : ''}
      </div>

      <div class="field">
        <label>Expected Annual Return (%) *</label>
        <input type="number"
               step="0.1"
               value="${investmentForm.values.expectedReturn}"
               oninput="investmentForm.setValue('expectedReturn', parseFloat(this.value) || 0)">
        ${investmentForm.errors.expectedReturn ? `
          <span class="error">${investmentForm.errors.expectedReturn}</span>
        ` : ''}
      </div>

      ${investmentForm.isValid ? `
        <div class="results">
          <h3>Projected Results</h3>
          <div class="result-item">
            <span>Future Value:</span>
            <strong>$${calculations.futureValue.toFixed(2)}</strong>
          </div>
          <div class="result-item">
            <span>Total Contributions:</span>
            <strong>$${calculations.totalContributions.toFixed(2)}</strong>
          </div>
          <div class="result-item">
            <span>Total Gains:</span>
            <strong class="${calculations.totalGains >= 0 ? 'positive' : 'negative'}">
              $${calculations.totalGains.toFixed(2)}
            </strong>
          </div>
        </div>
      ` : ''}
    </form>
  `;
});
```

---

## Common Patterns

### Pattern 1: Non-Negative

```javascript
validators: {
  field: v.min(0, 'Cannot be negative')
}
```

### Pattern 2: Positive

```javascript
validators: {
  field: v.min(1, 'Must be positive')
}
```

### Pattern 3: Range

```javascript
validators: {
  field: v.combine([
    v.min(0),
    v.max(100)
  ])
}
```

### Pattern 4: With Required

```javascript
validators: {
  field: v.combine([
    v.required(),
    v.min(1)
  ])
}
```

---

## Common Questions

### Q: Does it work with decimals?

**Answer:** Yes, works with any number:

```javascript
form.setValue('price', 0.99);
console.log(form.errors.price); // null if min is 0.01
```

### Q: What about empty fields?

**Answer:** Empty/null values pass validation:

```javascript
form.setValue('field', null); // Valid (no value to check)
form.setValue('field', ''); // Valid (empty string)
```

### Q: Can I use with negative numbers?

**Answer:** Yes, any numeric value:

```javascript
validators: {
  temperature: v.min(-273.15, 'Cannot be below absolute zero')
}
```

---

## Summary

### What `validators.min()` Does:

1. ✅ Checks minimum value
2. ✅ Works with numbers
3. ✅ Returns error or null
4. ✅ Custom messages

### When to Use It:

- Age verification
- Price validation
- Quantity limits
- Rating systems
- Any numeric minimum

### The Basic Pattern:

```javascript
const form = ReactiveUtils.form(
  {
    age: 0,
    price: 0
  },
  {
    validators: {
      age: v.min(18),
      price: v.min(0, 'Cannot be negative')
    }
  }
);
```

---

**Remember:** Use `v.min()` for number validation! 🎉