[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Usage Examples and Best Practices

## Quick Start (30 seconds)

```html
<!-- Load in order -->
<script src="01_dh-core.js"></script>
<script src="01_dh-bulk-property-updaters.js"></script>
<script src="05_dh-index-selection.js"></script>

<script>
  Selector.queryAll('.card').textContent({
    0: 'Featured',
    1: 'Standard',
    2: 'Basic'
  });
</script>
```

---

## Real-World Examples

### Example 1: Setting Up a Navigation Bar

```javascript
const navLinks = Selector.queryAll('.nav-link');

navLinks
  .textContent({
    0: 'Home',
    1: 'Products',
    2: 'About',
    3: 'Contact'
  })
  .classes({
    0: { add: ['active'] }
  });
```

### Example 2: Form Field Initialization

```javascript
const inputs = Selector.queryAll('#registrationForm input');

inputs.value({
  0: '',
  1: '',
  2: ''
});

// Could also set placeholders via the collection's .update() method
inputs.forEach((input, i) => {
  const placeholders = ['Full name', 'Email', 'Password'];
  input.update({ placeholder: placeholders[i] });
});
```

### Example 3: Dashboard Cards

```javascript
const cards = Selector.queryAll('.dashboard-card');

cards
  .textContent({
    0: 'Total Users: 1,234',
    1: 'Revenue: $5,678',
    2: 'Orders: 89'
  })
  .style({
    0: { borderLeft: '4px solid blue' },
    1: { borderLeft: '4px solid green' },
    2: { borderLeft: '4px solid orange' }
  })
  .dataset({
    0: { metric: 'users' },
    1: { metric: 'revenue' },
    2: { metric: 'orders' }
  });
```

### Example 4: Product Listing

```javascript
const products = Selector.queryAll('.product');

products
  .innerHTML({
    0: '<h3>Widget Pro</h3><p>$29.99</p>',
    1: '<h3>Widget Basic</h3><p>$9.99</p>',
    2: '<h3>Widget Lite</h3><p>Free</p>'
  })
  .classes({
    0: { add: ['premium', 'featured'] },
    1: { add: ['standard'] },
    2: { add: ['free-tier'] }
  });
```

### Example 5: Table Row Styling

```javascript
const rows = Selector.queryAll('#dataTable tbody tr');

rows.style({
  0: { backgroundColor: '#e3f2fd' },
  1: { backgroundColor: '#ffffff' },
  2: { backgroundColor: '#e3f2fd' },
  3: { backgroundColor: '#ffffff' }
});
```

---

## Index Selection vs Other Approaches

### Using Index Selection Methods

```javascript
// Index-based bulk methods — good for setting different values per element
Selector.queryAll('.item').textContent({
  0: 'Apple',
  1: 'Banana',
  2: 'Cherry'
});
```

### Using Collection .update()

```javascript
// Collection .update() — good for shared properties on all elements
Selector.queryAll('.item').update({
  style: { padding: '10px' }
});
```

### Using forEach

```javascript
// forEach — good for logic-driven per-element updates
Selector.queryAll('.item').forEach((item, i) => {
  const fruits = ['Apple', 'Banana', 'Cherry'];
  item.update({ textContent: fruits[i] });
});
```

| Use | When |
|-----|------|
| Index-based methods (`.textContent()`, `.style()`, etc.) | You know the exact indices and values |
| Collection `.update()` | Same properties for all elements |
| `.forEach()` | Per-element logic with conditions or calculations |

---

## Best Practices

### 1. Load Dependencies First

The module silently does nothing if dependencies are missing. Always verify load order:

```html
<!-- ✅ Correct order -->
<script src="01_dh-core.js"></script>
<script src="01_dh-bulk-property-updaters.js"></script>
<script src="05_dh-index-selection.js"></script>
```

### 2. Use Chaining for Related Updates

```javascript
// ✅ Clean — related updates in one chain
Selector.queryAll('.card')
  .textContent({ 0: 'Hello', 1: 'World' })
  .style({ 0: { color: 'blue' }, 1: { color: 'green' } });
```

### 3. Use .classes() Object Syntax for Precise Control

```javascript
// ✅ Precise — add/remove specific classes
items.classes({
  0: { add: ['active'], remove: ['pending'] }
});

// Also valid — replace entire className
items.classes({
  0: 'card active featured'
});
```

### 4. Check for the Enhancement

If you need to verify that the module is active:

```javascript
const collection = Selector.queryAll('.test');

// Check if index-based methods exist
if (typeof collection.textContent === 'function') {
  console.log('Index Selection is active');
}
```

---

## Verifying Dependencies

If things aren't working, check that both dependencies exist:

```javascript
// Check Selector
console.log(typeof Selector);             // Should be 'object'
console.log(typeof Selector.queryAll);     // Should be 'function'

// Check BulkPropertyUpdaters
console.log(typeof BulkPropertyUpdaters);  // Should be 'object'
console.log(typeof BulkPropertyUpdaters.enhanceCollectionInstance);  // Should be 'function'
```

If either is `undefined`, the module didn't patch anything — check your script load order.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **Load order** | Core → Bulk Property Updaters → Index Selection |
| **What it does** | Bridges `Selector.queryAll()` with index-based methods |
| **Methods added** | `.textContent()`, `.innerHTML()`, `.value()`, `.style()`, `.dataset()`, `.classes()` |
| **Method pattern** | Pass `{ index: value }` objects |
| **Chainable** | Yes — all methods return the collection |
| **Silent failure** | Does nothing if dependencies are missing |
| **No API** | No exported object — works through automatic patching |

> **Simple Rule to Remember:** After loading this module, `Selector.queryAll()` collections gain six index-based methods — `.textContent()`, `.innerHTML()`, `.value()`, `.style()`, `.dataset()`, and `.classes()`. Each takes `{ 0: value, 1: value }` objects to target specific elements by position.