[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Enhanced Index Access and Collection .update()

## Quick Start (30 seconds)

```javascript
const buttons = Collections.ClassName.btn;

// Index access — auto-enhanced with .update()
buttons[0].update({ textContent: 'Save' });
buttons[1].update({ textContent: 'Cancel' });

// Negative index via .at()
buttons.at(-1).update({ textContent: 'Last Button' });

// Mixed bulk + index update
buttons.update({
  style: { padding: '10px' },          // ALL buttons
  0: { style: { color: 'green' } },    // First only
  '-1': { style: { color: 'red' } }    // Last only
});
```

---

## Index Access — Auto-Enhanced Elements

After this module loads, when you access an element by index from any core collection, it's **automatically enhanced** with `.update()`:

```javascript
const items = Collections.ClassName.item;

// Each element accessed by index has .update()
items[0].update({
  textContent: 'First Item',
  style: { color: 'red', fontWeight: 'bold' }
});

items[1].update({
  textContent: 'Second Item',
  style: { color: 'blue' }
});

items[2].update({
  classList: { add: ['highlight'] },
  dataset: { position: '3' }
});
```

### How It Works

A `Proxy` wraps the collection and intercepts numeric property access:

```
items[0]
   ↓
Proxy intercepts: prop = "0" → is numeric? Yes
   ↓
Get raw element from underlying collection
   ↓
ensureElementHasUpdate(element)
   ↓
Return enhanced element with .update()
```

Non-numeric property access passes through normally:

```
items.length    → Proxy: not numeric → return original value
items.forEach   → Proxy: not numeric → return original method
items.update    → Proxy: not numeric → return update method
```

---

## Negative Indices via .at()

The `.at()` method is also intercepted to auto-enhance the returned element:

```javascript
const items = Collections.TagName.li;

// Positive indices
items.at(0).update({ classList: { add: ['first'] } });
items.at(1).update({ textContent: 'Second item' });

// Negative indices — count from the end
items.at(-1).update({ classList: { add: ['last'] } });
items.at(-2).update({ style: { fontStyle: 'italic' } });
```

| `.at()` Call | Returns |
|-------------|---------|
| `.at(0)` | First element (enhanced) |
| `.at(1)` | Second element (enhanced) |
| `.at(-1)` | Last element (enhanced) |
| `.at(-2)` | Second to last (enhanced) |

---

## Collection .update() — Bulk + Index

The collection's `.update()` method separates update keys into two groups:

- **Non-numeric keys** → Bulk updates (applied to ALL elements)
- **Numeric keys** → Index updates (applied to ONE specific element)

### How Keys Are Separated

The module uses a regex test (`/^-?\d+$/`) to check if a key is a numeric string:

```javascript
items.update({
  style: { padding: '8px' },     // "style" → not numeric → BULK
  classList: { add: ['base'] },   // "classList" → not numeric → BULK
  0: { textContent: 'First' },   // "0" → numeric → INDEX
  1: { textContent: 'Second' },  // "1" → numeric → INDEX
  '-1': { textContent: 'Last' }  // "-1" → numeric → INDEX
});
```

### Processing Order

```
1️⃣ Separate keys:
   ├── Bulk: { style, classList }
   └── Index: { 0, 1, -1 }
   ↓
2️⃣ Apply BULK to ALL elements:
   ├── element[0] → style + classList
   ├── element[1] → style + classList
   ├── element[2] → style + classList
   └── element[3] → style + classList
   ↓
3️⃣ Apply INDEX to specific elements:
   ├── element[0] → textContent: 'First'
   ├── element[1] → textContent: 'Second'
   └── element[-1] (last) → textContent: 'Last'
   ↓
4️⃣ Return collection
```

Index updates run **after** bulk, so they can **override** bulk values for that element.

---

## Negative Indices in .update()

Use string keys with a minus sign for negative indices:

```javascript
items.update({
  // Positive indices — use numbers directly
  0: { textContent: 'First' },
  1: { textContent: 'Second' },

  // Negative indices — use string keys
  '-1': { textContent: 'Last' },
  '-2': { textContent: 'Second to last' }
});
```

**Important:** Negative indices in `.update()` must be written as **string keys** (e.g., `'-1'`), because JavaScript object syntax `{ -1: ... }` is not valid. Use either `'-1'` or computed property `[-1]`.

---

## Real-World Examples

### Example 1: Navigation Menu

```javascript
const navLinks = Collections.ClassName['nav-link'];

// Each link has .update() via index access
navLinks[0].update({
  textContent: 'Home',
  classList: { add: ['active'] },
  style: { fontWeight: 'bold' }
});

navLinks[1].update({ textContent: 'Products' });
navLinks[2].update({ textContent: 'About' });
navLinks.at(-1).update({ textContent: 'Contact' });
```

### Example 2: Table with Header and Footer

```javascript
const rows = Collections.TagName.tr;

rows.update({
  // ALL rows get base styles
  style: { height: '40px', padding: '8px' },

  // Header row
  0: {
    style: { backgroundColor: '#333', color: 'white', fontWeight: 'bold' }
  },

  // Footer row (last)
  '-1': {
    style: { backgroundColor: '#f5f5f5', fontStyle: 'italic' }
  }
});
```

### Example 3: Form Fields

```javascript
const inputs = Selector.queryAll('input[type="text"]');

inputs.update({
  // All inputs get shared class and style
  classList: { add: ['form-control'] },
  style: { padding: '10px', borderRadius: '4px' },

  // Individual placeholders
  0: { placeholder: 'Full name', value: '' },
  1: { placeholder: 'Email address', value: '' },
  '-1': { placeholder: 'Phone number', value: '' }
});
```

### Example 4: Individual Index Access

```javascript
const cards = Selector.queryAll('.card');

// Access each card individually — all have .update()
cards[0].update({
  innerHTML: '<h3>Featured</h3><p>Our best product</p>',
  style: { border: '2px solid gold' },
  classList: { add: ['featured'] }
});

cards[1].update({
  innerHTML: '<h3>Popular</h3><p>Most purchased</p>',
  style: { border: '1px solid silver' }
});

cards.at(-1).update({
  innerHTML: '<h3>New</h3><p>Just arrived</p>',
  classList: { add: ['new-arrival'] }
});
```

---

## Empty Collections

Empty collections are handled safely:

```javascript
const items = Selector.queryAll('.nonexistent');

// Safe — .update() logs info and returns collection
items.update({
  0: { textContent: 'First' }
});
// Console: [Index Selection] Collection is empty

// Safe — index access returns undefined
const first = items[0];  // undefined
```

---

## Out-of-Range Indices

Invalid indices in `.update()` produce a warning:

```javascript
const items = Collections.ClassName.item;
// Suppose 3 items exist

items.update({
  0: { textContent: 'OK' },       // ✅ Applied
  10: { textContent: 'Missing' }   // ⚠️ Warning
});
// Console: [Index Selection] Index 10 out of bounds (length: 3)
```

---

## Summary

| Feature | How It Works |
|---------|-------------|
| `collection[0]` | Proxy auto-enhances element with `.update()` |
| `collection.at(-1)` | Returns last element, auto-enhanced |
| `.update({ key: val })` | Non-numeric keys → all elements (bulk) |
| `.update({ 0: {...} })` | Numeric keys → specific element (index) |
| `.update({ '-1': {...} })` | Negative numeric keys → from end |
| Order | Bulk first, then index (index can override) |
| Empty collections | Safe — info message, no errors |
| Out-of-range | Warning logged, index skipped |

> **Simple Rule to Remember:** Every element accessed by index gets `.update()` automatically. The collection's `.update()` separates string keys (bulk for all) from numeric keys (index for one). Use `'-1'` in `.update()` for the last element, or `.at(-1)` for direct access.