[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Query Functions and Element .update()

## Quick Start (30 seconds)

```javascript
// Find one element
const title = query('#pageTitle');
title.update({
  textContent: 'Welcome!',
  style: { color: 'blue', fontSize: '24px' },
  classList: { add: ['heading'] }
});

// Find all elements
const cards = queryAll('.card');
cards.update({
  style: { padding: '16px' }
});
```

---

## query() — Find One Element

Returns the **first element** matching a CSS selector, enhanced with `.update()`:

```javascript
// By ID
query('#header').update({ textContent: 'My App' });

// By class (first match)
query('.btn').update({ disabled: false });

// By attribute
query('input[type="email"]').update({ placeholder: 'Your email' });

// Complex selector
query('#nav .link:first-child').update({ classList: { add: ['active'] } });
```

### With Context

Search within a specific container instead of the whole document:

```javascript
const form = document.getElementById('myForm');
const submitBtn = query('button[type="submit"]', form);
submitBtn.update({ textContent: 'Send', disabled: false });
```

### When Nothing Matches

Returns `null` — always check before using:

```javascript
const element = query('#maybe-exists');
if (element) {
  element.update({ textContent: 'Found!' });
}
```

---

## queryAll() — Find All Elements

Returns an **enhanced collection** of all matching elements:

```javascript
const buttons = queryAll('.btn');
console.log(buttons.length);  // Number of buttons found

// Update all at once
buttons.update({
  style: { borderRadius: '4px' }
});
```

### With Context

```javascript
const form = document.getElementById('myForm');
const inputs = queryAll('input', form);

inputs.update({
  classList: { add: ['form-control'] }
});
```

### When Nothing Matches

Returns an empty collection — all methods are safe to call:

```javascript
const results = queryAll('.nonexistent');
console.log(results.length);  // 0

// Safe — methods do nothing on empty collections
results.update({ textContent: 'Hello' });
results.textContent({ 0: 'First' });
```

---

## The .update() Method on Single Elements

Every element from `query()` gets an `.update()` method that handles multiple property types:

### Direct Properties

```javascript
query('#title').update({
  textContent: 'Hello World',
  hidden: false,
  disabled: true
});
```

Any property that exists on the DOM element can be set directly.

### Style

Pass an object with CSS properties:

```javascript
query('#box').update({
  style: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '20px',
    borderRadius: '8px'
  }
});
```

### Dataset

Set `data-*` attributes:

```javascript
query('#product').update({
  dataset: {
    id: '123',
    category: 'electronics',
    inStock: 'true'
  }
});
// Result: data-id="123" data-category="electronics" data-in-stock="true"
```

### ClassList

Add, remove, toggle, or replace classes:

```javascript
query('#card').update({
  classList: {
    add: ['active', 'highlighted'],
    remove: ['pending'],
    toggle: ['expanded'],
    replace: ['old-class', 'new-class']
  }
});
```

### Attrs / Attributes

Set or remove HTML attributes:

```javascript
query('#input').update({
  attrs: {
    'aria-label': 'Email address',
    'data-validate': 'true',
    required: true,
    disabled: null   // null or false → removes the attribute
  }
});
```

### Combined Example

All update types work together in a single call:

```javascript
query('#submitBtn').update({
  textContent: 'Submit Form',
  disabled: false,
  title: 'Click to submit',
  style: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px'
  },
  classList: {
    add: ['btn', 'btn-primary'],
    remove: ['btn-default']
  },
  dataset: {
    action: 'submit',
    formId: 'registration'
  },
  attrs: {
    'aria-label': 'Submit registration form'
  }
});
```

---

## The .update() Method on Collections

Collections also have an `.update()` method with two modes:

### Mode 1: Property-Wide Updates (Same for All)

Non-numeric keys apply the same update to **every** element:

```javascript
queryAll('.btn').update({
  style: { padding: '10px' },
  disabled: false
});
// ALL buttons get padding: 10px and disabled: false
```

### Mode 2: Index-Based Updates (Different per Element)

Numeric keys target **specific** elements by position:

```javascript
queryAll('.card').update({
  0: { textContent: 'First Card', style: { color: 'red' } },
  1: { textContent: 'Second Card', style: { color: 'blue' } },
  2: { textContent: 'Third Card', style: { color: 'green' } }
});
```

### Combining Both Modes

```javascript
queryAll('.btn').update({
  // Property-wide — all buttons
  style: { padding: '10px', borderRadius: '4px' },

  // Index-specific — individual buttons
  0: { textContent: 'Save', style: { backgroundColor: 'green' } },
  1: { textContent: 'Cancel', style: { backgroundColor: 'red' } }
});
```

---

## Array Methods on Collections

Enhanced collections include standard array methods:

```javascript
const items = queryAll('.item');

// forEach
items.forEach((el, i) => console.log(i, el.textContent));

// map
const texts = items.map(el => el.textContent);

// filter
const active = items.filter(el => !el.disabled);

// find
const target = items.find(el => el.dataset.id === '42');

// some / every
const hasDisabled = items.some(el => el.disabled);
const allVisible = items.every(el => !el.hidden);

// reduce
const total = items.reduce((sum, el) => sum + parseFloat(el.dataset.price), 0);

// slice
const firstThree = items.slice(0, 3);

// findIndex
const index = items.findIndex(el => el.classList.contains('active'));
```

---

## Error Handling

### Invalid Selector

```javascript
query('###invalid');
// Console: [DOM Helpers] querySelector error: ...
// Returns null

queryAll('###invalid');
// Console: [DOM Helpers] querySelectorAll error: ...
// Returns empty collection
```

### Non-String Selector

```javascript
query(123);
// Console: [DOM Helpers] querySelector requires a string selector
// Returns null
```

### Unknown Property in .update()

```javascript
query('#box').update({ nonExistentProp: 'value' });
// Console: [DOM Helpers] Property 'nonExistentProp' not found on element
```

---

## Summary

| Function | Returns | When None Found |
|----------|---------|----------------|
| `query(selector)` | Enhanced element | `null` |
| `queryAll(selector)` | Enhanced collection | Empty collection |

| .update() Key | What It Does |
|--------------|-------------|
| `style` | Set CSS properties from an object |
| `dataset` | Set data-* attributes from an object |
| `classList` | Add/remove/toggle/replace classes |
| `attrs` / `attributes` | Set or remove HTML attributes |
| Any other key | Direct property assignment |

> **Simple Rule to Remember:** `query()` finds one element, `queryAll()` finds many. Both add `.update()` for batch property updates. The `.update()` method handles `style`, `dataset`, `classList`, `attrs`, and any direct DOM property — all in a single call.