[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What Gets Enhanced — The Six Index-Based Methods

## Quick Start (30 seconds)

```javascript
const cards = Selector.queryAll('.card');

// Set text by index
cards.textContent({ 0: 'First', 1: 'Second', 2: 'Third' });

// Set styles by index
cards.style({ 0: { color: 'red' }, 1: { color: 'blue' } });

// Chain them
cards
  .textContent({ 0: 'Hello', 1: 'World' })
  .style({ 0: { fontWeight: 'bold' } });
```

---

## The Six Methods

After the Index Selection module loads, every collection from `Selector.queryAll()` gains six methods. Each one targets elements **by their numeric index** in the collection.

---

### .textContent({ index: value })

Sets the `textContent` property on specific elements:

```javascript
const items = Selector.queryAll('.item');

items.textContent({
  0: 'Apple',
  1: 'Banana',
  2: 'Cherry'
});
// item[0].textContent = 'Apple'
// item[1].textContent = 'Banana'
// item[2].textContent = 'Cherry'
```

---

### .innerHTML({ index: value })

Sets the `innerHTML` property on specific elements:

```javascript
const containers = Selector.queryAll('.container');

containers.innerHTML({
  0: '<strong>Bold text</strong>',
  1: '<em>Italic text</em>'
});
```

---

### .value({ index: value })

Sets the `value` property on specific form elements:

```javascript
const inputs = Selector.queryAll('input');

inputs.value({
  0: 'John',
  1: 'john@example.com',
  2: '555-0123'
});
// input[0].value = 'John'
// input[1].value = 'john@example.com'
// input[2].value = '555-0123'
```

---

### .style({ index: styleObject })

Sets CSS styles on specific elements. Each value is a **style object** with property-value pairs:

```javascript
const cards = Selector.queryAll('.card');

cards.style({
  0: { backgroundColor: '#fffacd', border: '2px solid gold' },
  1: { backgroundColor: '#e8f5e9', border: '2px solid green' },
  2: { backgroundColor: '#e3f2fd', border: '2px solid blue' }
});
```

---

### .dataset({ index: dataObject })

Sets `data-*` attributes on specific elements. Each value is an **object of key-value pairs**:

```javascript
const products = Selector.queryAll('.product');

products.dataset({
  0: { id: '101', category: 'electronics' },
  1: { id: '102', category: 'clothing' },
  2: { id: '103', category: 'books' }
});
// product[0] → data-id="101" data-category="electronics"
// product[1] → data-id="102" data-category="clothing"
// product[2] → data-id="103" data-category="books"
```

---

### .classes({ index: classConfig })

Manages CSS classes on specific elements. The value can be:

**A string** — replaces the entire `className`:

```javascript
const items = Selector.queryAll('.item');

items.classes({
  0: 'item active featured',
  1: 'item standard'
});
// item[0].className = 'item active featured'
// item[1].className = 'item standard'
```

**An object** — uses classList operations (`add`, `remove`, `toggle`, `replace`):

```javascript
const items = Selector.queryAll('.item');

items.classes({
  0: { add: ['highlight', 'bold'] },
  1: { remove: ['dimmed'] },
  2: { toggle: ['expanded'] },
  3: { replace: ['old-class', 'new-class'] }
});
```

---

## All Methods Are Chainable

Every method returns the collection, so you can chain them:

```javascript
Selector.queryAll('.card')
  .textContent({ 0: 'Featured', 1: 'Standard', 2: 'Basic' })
  .style({
    0: { border: '2px solid gold' },
    1: { border: '1px solid gray' },
    2: { border: '1px solid gray' }
  })
  .classes({
    0: { add: ['featured'] }
  })
  .dataset({
    0: { tier: 'premium' },
    1: { tier: 'standard' },
    2: { tier: 'basic' }
  });
```

---

## How Each Method Works Internally

```
collection.textContent({ 0: 'Hello', 2: 'World' })
   ↓
1️⃣ Read each key-value pair from the object
   ├── key: "0", value: "Hello"
   └── key: "2", value: "World"
   ↓
2️⃣ For each pair:
   a) Parse the key as a number → index
   b) Get the element at that index from the collection
   c) Check: is it a valid DOM element?
   d) Apply: element.update({ textContent: 'Hello' })
      (or element.textContent = 'Hello' as fallback)
   ↓
3️⃣ Return the collection (for chaining)
```

If the element has an `.update()` method (from the core library), it uses that. Otherwise, it sets the property directly.

---

## Invalid Indices

If an index doesn't correspond to an element in the collection, it's silently skipped:

```javascript
const items = Selector.queryAll('.item');
// Suppose there are 3 items (indices 0, 1, 2)

items.textContent({
  0: 'First',    // ✅ Applied
  1: 'Second',   // ✅ Applied
  10: 'Tenth'    // Skipped — no element at index 10
});
```

Non-numeric keys are also skipped:

```javascript
items.textContent({
  0: 'First',       // ✅ Numeric — applied
  'hello': 'World'  // Skipped — not a numeric index
});
```

---

## Summary

| Method | Value Type | What It Sets |
|--------|-----------|-------------|
| `.textContent({...})` | String | `element.textContent` |
| `.innerHTML({...})` | String | `element.innerHTML` |
| `.value({...})` | String | `element.value` |
| `.style({...})` | Object | `element.style` properties |
| `.dataset({...})` | Object | `element.dataset` properties |
| `.classes({...})` | String or Object | `element.className` or classList operations |

| Feature | Detail |
|---------|--------|
| **Keys** | Numeric indices (0, 1, 2, etc.) |
| **Chainable** | Yes — all methods return the collection |
| **Invalid index** | Silently skipped |
| **Uses .update()** | Yes, when available; direct assignment as fallback |

> **Simple Rule to Remember:** Each method takes an object where keys are element positions and values are what to set. `.textContent({0: 'Hi'})` sets the first element's text to "Hi". All six methods work the same way — index-to-value mapping — and all are chainable.