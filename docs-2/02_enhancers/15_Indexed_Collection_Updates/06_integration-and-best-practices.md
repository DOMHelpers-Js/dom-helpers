[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Integration and Best Practices

## Quick Start (30 seconds)

```html
<!-- Load in order -->
<script src="01_dh-core.js"></script>
<script src="03_dh-global-query.js"></script>
<script src="04_dh-indexed-collection-updates.js"></script>

<script>
  // Ready — indexed updates work everywhere
  queryAll('.card').update({
    style: { padding: '16px' },
    [0]: { classList: { add: ['featured'] } }
  });
</script>
```

---

## Load Order

This module depends on both the core library and Global Query. Load them in this order:

```
1. 01_dh-core.js                          ← Core library
2. 03_dh-global-query.js                  ← Global Query (provides queryAll)
3. 04_dh-indexed-collection-updates.js    ← This module
```

If dependencies are missing, you'll see warnings:

```
// Missing core:
[Indexed Updates] EnhancedUpdateUtility not found. Load main DOM helpers first!

// Missing Global Query:
[Indexed Updates] Global query functions not found. Load global-query.js first!
```

---

## Works with Every Collection Source

After loading, indexed updates work with collections from any source:

### queryAll()

```javascript
queryAll('.btn').update({
  style: { cursor: 'pointer' },
  [0]: { textContent: 'Primary' }
});
```

### querySelectorAll()

```javascript
querySelectorAll('.btn').update({
  style: { cursor: 'pointer' },
  [0]: { textContent: 'Primary' }
});
```

### Collections Helper

```javascript
Collections.ClassName.card.update({
  style: { padding: '16px' },
  [0]: { classList: { add: ['first'] } }
});
```

### queryAllWithin()

```javascript
queryAllWithin('#sidebar', '.link').update({
  style: { color: '#333' },
  [0]: { classList: { add: ['active'] } }
});
```

---

## Real-World Patterns

### Pattern 1: Tab Interface

```javascript
queryAll('.tab').update({
  // All tabs: default state
  classList: { remove: ['active'] },
  style: { borderBottom: 'none' },

  // Active tab
  [activeIndex]: {
    classList: { add: ['active'] },
    style: { borderBottom: '2px solid blue' }
  }
});
```

### Pattern 2: Staggered Animation Setup

```javascript
queryAll('.card').update({
  // Base animation state for all
  style: {
    opacity: '0',
    transform: 'translateY(20px)'
  },

  // Progressive delays
  [0]: { style: { transitionDelay: '0s' } },
  [1]: { style: { transitionDelay: '0.1s' } },
  [2]: { style: { transitionDelay: '0.2s' } },
  [3]: { style: { transitionDelay: '0.3s' } }
});
```

### Pattern 3: Form Setup

```javascript
queryAll('#registrationForm input').update({
  // All inputs: shared class and autocomplete off
  classList: { add: ['form-control'] },

  // Each input: unique placeholder
  [0]: { placeholder: 'Full name' },
  [1]: { placeholder: 'Email address' },
  [2]: { placeholder: 'Password' },
  [3]: { placeholder: 'Confirm password' }
});
```

### Pattern 4: Dynamic Index Configuration

When indices aren't known ahead of time, build the update object dynamically:

```javascript
const items = queryAll('.item');
const updateConfig = {
  classList: { add: ['processed'] }
};

// Add index-specific updates based on data
items.forEach((item, index) => {
  updateConfig[index] = {
    dataset: { index: String(index) },
    textContent: `Item ${index + 1}`
  };
});

items.update(updateConfig);
```

---

## Best Practices

### 1. Keep Shared Properties in Bulk

Put anything that applies to all elements as bulk keys, not repeated in every index:

```javascript
// ✅ Good — shared styles in bulk
queryAll('.card').update({
  style: { padding: '16px', borderRadius: '8px' },
  [0]: { textContent: 'Featured' },
  [1]: { textContent: 'Standard' }
});

// ❌ Redundant — same style repeated in each index
queryAll('.card').update({
  [0]: { textContent: 'Featured', style: { padding: '16px', borderRadius: '8px' } },
  [1]: { textContent: 'Standard', style: { padding: '16px', borderRadius: '8px' } }
});
```

### 2. Use Negative Indices for End-Based Targeting

```javascript
// ✅ Clean — works regardless of collection size
queryAll('.item').update({
  [-1]: { classList: { add: ['last'] } }
});

// Works, but fragile if collection size changes
queryAll('.item').update({
  [4]: { classList: { add: ['last'] } }
});
```

### 3. Use the Override Pattern for "Default + Exception"

```javascript
// ✅ Clear intent — everything disabled except the first
queryAll('button').update({
  disabled: true,
  [0]: { disabled: false }
});
```

### 4. Handle Empty Collections

Empty collections are handled gracefully — no errors, just a console info message:

```javascript
queryAll('.nonexistent').update({
  [0]: { textContent: 'First' }
});
// Console: [Indexed Updates] .update() called on empty collection
// No error thrown
```

### 5. Check for Out-of-Range Indices During Development

The module warns about indices that don't match any element:

```javascript
// 3 elements in collection
queryAll('.item').update({
  [0]: { textContent: 'OK' },
  [10]: { textContent: 'Oops' }
});
// Console: [Indexed Updates] No element at index 10 (resolved to 10, collection has 3 elements)
```

Use these warnings during development to catch index mistakes.

---

## Indexed Updates vs Helper Methods vs forEach

Three ways to achieve element-specific customization — each suited for different situations:

### Indexed Updates

```javascript
// Best for: setting up a collection with shared + individual properties
queryAll('.btn').update({
  style: { padding: '10px' },
  [0]: { textContent: 'Save' },
  [1]: { textContent: 'Cancel' }
});
```

### Helper Methods + Individual Access

```javascript
// Best for: simple shared operations, then individual tweaks
queryAll('.btn')
  .setStyle({ padding: '10px' });

queryAll('.btn')[0].update({ textContent: 'Save' });
queryAll('.btn')[1].update({ textContent: 'Cancel' });
```

### forEach with Logic

```javascript
// Best for: dynamic per-element logic based on conditions
queryAll('.btn').forEach((btn, i) => {
  const labels = ['Save', 'Cancel', 'Delete'];
  btn.update({
    style: { padding: '10px' },
    textContent: labels[i] || 'Button'
  });
});
```

| Use | When |
|-----|------|
| Indexed updates | You know which indices need special treatment |
| Helper methods | Simple chainable operations on all elements |
| forEach | Per-element logic depends on conditions, data, or calculations |

---

## Complete API Reference

### IndexedUpdates Object

| Property/Method | What It Does |
|----------------|-------------|
| `.version` | Module version (`"1.1.0"`) |
| `.patch(collection)` | Add indexed update support to a collection |
| `.hasSupport(collection)` | Check if collection supports indexed updates |
| `.updateCollectionWithIndices(col, updates)` | Core update function |
| `.restore()` | Remove patches from queryAll/querySelectorAll |

### Update Object Keys

| Key Type | Example | Applied To |
|----------|---------|-----------|
| Non-numeric (string) | `style`, `classList`, `textContent` | ALL elements (bulk) |
| Positive integer | `[0]`, `[1]`, `[5]` | One element by position from start |
| Negative integer | `[-1]`, `[-2]` | One element by position from end |

### Processing Order

| Step | What Happens |
|------|-------------|
| 1 | Separate keys into bulk (non-numeric) and index (numeric) |
| 2 | Apply bulk updates to ALL elements |
| 3 | Apply index updates to specific elements (can override bulk) |
| 4 | Return the collection |

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **Load order** | Core → Global Query → Indexed Collection Updates |
| **Auto-patching** | Works with `queryAll()`, `Collections`, `Selector` automatically |
| **Bulk keys** | String keys apply to all elements |
| **Index keys** | Numeric keys apply to one element |
| **Negative indices** | `[-1]` = last, `[-2]` = second to last |
| **Override** | Bulk first, index second — index wins for that element |
| **Manual patching** | `IndexedUpdates.patch()` for raw collections |
| **DOMHelpers access** | `DOMHelpers.IndexedUpdates` |

> **Simple Rule to Remember:** Load the module, and every collection's `.update()` gains indexed targeting. Use string keys for shared properties (applied to all), numeric keys for individual properties (applied to one). Bulk runs first, index runs second — so individual settings can override shared ones when needed.