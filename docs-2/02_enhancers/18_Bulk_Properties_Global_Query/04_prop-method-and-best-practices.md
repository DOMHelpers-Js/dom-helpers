[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# The .prop() Method, Utilities, and Best Practices

## Quick Start (30 seconds)

```javascript
// .prop() — set any property by name
queryAll('input').prop('maxLength', {
  0: 50,
  1: 100,
  2: 200
});

// Nested property paths
queryAll('.box').prop('style.backgroundColor', {
  0: 'red',
  1: 'blue',
  2: 'green'
});
```

---

## The .prop() Method

While the 18 named bulk methods cover the most common properties, `.prop()` is a **generic method** that lets you set **any property** — including properties not covered by the named methods.

### Syntax

```javascript
collection.prop(propertyName, { index: value })
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `propertyName` | String | The property to set (can include dots for nested paths) |
| `updates` | Object | `{ index: value }` mapping |

---

### Simple Properties

Set any direct property by name:

```javascript
// maxLength — not covered by named methods
queryAll('input').prop('maxLength', {
  0: 50,
  1: 100,
  2: 200
});

// tabIndex
queryAll('.focusable').prop('tabIndex', {
  0: 1,
  1: 2,
  2: 3
});

// className (as a whole string)
queryAll('.item').prop('className', {
  0: 'item active',
  1: 'item inactive'
});
```

---

### Nested Property Paths

Use **dot notation** to target nested properties:

```javascript
// style.backgroundColor
queryAll('.box').prop('style.backgroundColor', {
  0: 'red',
  1: 'blue',
  2: 'green'
});

// style.fontSize
queryAll('p').prop('style.fontSize', {
  0: '24px',
  1: '18px',
  2: '14px'
});

// dataset.userId
queryAll('.card').prop('dataset.userId', {
  0: '101',
  1: '102',
  2: '103'
});
```

**How nested paths work:**

```
prop('style.color', { 0: 'red' })
   ↓
1️⃣ Split path: ['style', 'color']
   ↓
2️⃣ Navigate to parent: element.style
   ↓
3️⃣ Set final property: element.style.color = 'red'
```

---

### When to Use .prop() vs Named Methods

```javascript
// ✅ Named method — cleaner for common properties
queryAll('input').value({ 0: 'Hello', 1: 'World' });

// ✅ .prop() — for properties without a named method
queryAll('input').prop('maxLength', { 0: 50, 1: 100 });

// ✅ .prop() — for nested one-off access
queryAll('.box').prop('style.borderColor', { 0: 'red' });
```

| Use Named Methods | Use .prop() |
|------------------|------------|
| Common properties (textContent, value, style, etc.) | Properties not covered by named methods |
| Cleaner, more readable code | Nested property paths (style.color, dataset.id) |
| Most of the time | Edge cases and custom properties |

---

## Utility Functions

### enhanceElement(element)

Manually add `.update()` to a raw DOM element:

```javascript
const raw = document.getElementById('myDiv');
const enhanced = EnhancedQuerySelectors.enhanceElement(raw);

enhanced.update({
  textContent: 'Enhanced!',
  style: { color: 'blue' }
});
```

Safe to call multiple times — already-enhanced elements are returned as-is.

### enhanceNodeList(nodeList)

Manually wrap a raw NodeList with `.update()` and all bulk property methods:

```javascript
const rawList = document.querySelectorAll('.item');
const enhanced = EnhancedQuerySelectors.enhanceNodeList(rawList);

enhanced.textContent({ 0: 'First', 1: 'Second' });
enhanced.style({ 0: { color: 'red' } });
```

---

## DOMHelpers Integration

When the core library is loaded, the module registers itself:

```javascript
// Access via DOMHelpers
DOMHelpers.EnhancedQuerySelectors.version;  // "1.0.0"
DOMHelpers.EnhancedQuerySelectors.query('#title');
DOMHelpers.EnhancedQuerySelectors.queryAll('.card');
DOMHelpers.EnhancedQuerySelectors.enhanceElement(rawElement);
DOMHelpers.EnhancedQuerySelectors.enhanceNodeList(rawNodeList);
```

---

## Best Practices

### 1. Use Named Methods for Common Properties

```javascript
// ✅ Clean and readable
queryAll('.btn').textContent({ 0: 'Save', 1: 'Cancel' });
queryAll('input').value({ 0: 'John', 1: 'Doe' });

// Works but less clear
queryAll('.btn').prop('textContent', { 0: 'Save', 1: 'Cancel' });
```

### 2. Chain Related Updates

```javascript
// ✅ Fluent chaining
queryAll('img.gallery')
  .src({ 0: 'a.jpg', 1: 'b.jpg' })
  .alt({ 0: 'Photo A', 1: 'Photo B' })
  .style({ 0: { border: '2px solid gold' } });
```

### 3. Use .update() for Multi-Property Per-Element Updates

When setting many properties on the same element, `.update()` with index keys is more concise:

```javascript
// ✅ Multiple properties per element — use .update()
queryAll('.card').update({
  0: {
    textContent: 'Featured',
    style: { border: '2px solid gold', padding: '20px' },
    classList: { add: ['featured'] }
  },
  1: {
    textContent: 'Standard',
    style: { border: '1px solid gray', padding: '16px' }
  }
});

// Also valid — but more verbose for multi-property updates
queryAll('.card')
  .textContent({ 0: 'Featured', 1: 'Standard' })
  .style({
    0: { border: '2px solid gold', padding: '20px' },
    1: { border: '1px solid gray', padding: '16px' }
  })
  .classes({ 0: { add: ['featured'] } });
```

### 4. Check query() Results for null

```javascript
// ✅ Safe
const el = query('#maybe-exists');
if (el) {
  el.update({ textContent: 'Found!' });
}

// ❌ Risky — will throw if not found
query('#maybe-exists').update({ textContent: 'Found!' });
```

### 5. Use .attrs() to Remove Attributes

Set an attribute to `null` or `false` to remove it:

```javascript
queryAll('input').attrs({
  0: { disabled: null },    // Removes disabled attribute
  1: { required: false }    // Removes required attribute
});
```

---

## Complete API Reference

### Global Functions

| Function | Returns |
|----------|---------|
| `query(selector, context?)` | Enhanced element or `null` |
| `queryAll(selector, context?)` | Enhanced collection |
| `querySelector(selector, context?)` | Same as `query()` |
| `querySelectorAll(selector, context?)` | Same as `queryAll()` |

### EnhancedQuerySelectors Object

| Property/Method | What It Does |
|----------------|-------------|
| `.version` | `"1.0.0"` |
| `.query()` | Find one element |
| `.queryAll()` | Find all elements |
| `.querySelector()` | Same as `.query()` |
| `.querySelectorAll()` | Same as `.queryAll()` |
| `.enhanceElement(el)` | Add `.update()` to a raw element |
| `.enhanceNodeList(list)` | Wrap a NodeList with bulk methods |

### Element .update() Keys

| Key | Value Type | What It Does |
|-----|-----------|-------------|
| `style` | Object | Set CSS properties |
| `dataset` | Object | Set data-* attributes |
| `classList` | Object | Add/remove/toggle/replace classes |
| `attrs` / `attributes` | Object | Set/remove HTML attributes |
| Any other | Any | Direct property assignment |

### Collection Bulk Methods

| Category | Methods |
|----------|---------|
| **Text/Content** | `.textContent()`, `.innerHTML()`, `.innerText()` |
| **Form** | `.value()`, `.placeholder()`, `.disabled()`, `.checked()`, `.readonly()`, `.hidden()`, `.selected()` |
| **Media** | `.src()`, `.href()`, `.alt()` |
| **Display** | `.title()` |
| **Complex** | `.style()`, `.dataset()`, `.attrs()`, `.classes()` |
| **Generic** | `.prop(name, {...})` |

### Collection Array Methods

`.forEach()`, `.map()`, `.filter()`, `.find()`, `.findIndex()`, `.some()`, `.every()`, `.reduce()`, `.slice()`

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **.prop()** | Generic method for any property, supports dot-notation nested paths |
| **Named methods** | 18 methods for common properties — cleaner and more readable |
| **enhanceElement()** | Manually add .update() to a raw DOM element |
| **enhanceNodeList()** | Manually wrap a NodeList with all bulk methods |
| **DOMHelpers** | `DOMHelpers.EnhancedQuerySelectors` when core is loaded |
| **Self-contained** | Works standalone or with the core library |

> **Simple Rule to Remember:** Use named methods (`.textContent()`, `.style()`, etc.) for common properties. Use `.prop()` for uncommon or nested properties. Use `.update()` when setting many properties on the same element. All methods take `{ index: value }` objects and are chainable.