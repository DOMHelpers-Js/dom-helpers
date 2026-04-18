[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Bulk Updates vs Index-Specific Updates

## Quick Start (30 seconds)

```javascript
queryAll('.card').update({
  // BULK — applied to every .card
  style: { padding: '16px' },
  classList: { add: ['card-base'] },

  // INDEX — applied to individual .cards
  [0]: { textContent: 'Featured Card' },
  [1]: { textContent: 'Regular Card' }
});
```

---

## Two Types of Updates in One Call

The Indexed Collection Updates module separates every key in your update object into **two categories** based on whether the key is numeric or not:

| Key Type | Category | Applied To |
|----------|----------|-----------|
| Non-numeric (`style`, `classList`, `textContent`, etc.) | **Bulk update** | ALL elements |
| Numeric (`[0]`, `[1]`, `[-1]`, etc.) | **Index update** | ONE specific element |

```javascript
queryAll('.item').update({
  disabled: false,                // ← "disabled" is non-numeric → BULK
  style: { color: 'gray' },      // ← "style" is non-numeric → BULK
  [0]: { style: { color: 'red' } }, // ← "0" is numeric → INDEX
  [2]: { disabled: true }         // ← "2" is numeric → INDEX
});
```

---

## How the Separation Works

```
Your update object:
{
  style: { padding: '10px' },
  classList: { add: ['shared'] },
  [0]: { textContent: 'First' },
  [1]: { textContent: 'Second' }
}
   ↓
Module reads each key:
   ↓
"style"     → is it a number? No  → BULK group
"classList"  → is it a number? No  → BULK group
"0"         → is it a number? Yes → INDEX group
"1"         → is it a number? Yes → INDEX group
   ↓
Result:
├── Bulk:  { style: { padding: '10px' }, classList: { add: ['shared'] } }
└── Index: { 0: { textContent: 'First' }, 1: { textContent: 'Second' } }
```

---

## Bulk Updates — Applied to ALL Elements

Bulk updates work exactly like the standard collection `.update()`. Every non-numeric key is treated as a property to apply to **all elements** in the collection.

```javascript
// All 5 buttons get the same styles
queryAll('.btn').update({
  style: { padding: '8px 16px', borderRadius: '4px' },
  classList: { add: ['btn-styled'] }
});
```

This is the same behavior you'd get without the Indexed Updates module — shared properties applied uniformly.

### What Counts as a Bulk Key?

Any key that is **not a pure integer** is treated as bulk:

```javascript
queryAll('.item').update({
  textContent: 'Hello',          // ✅ Bulk — string key
  style: { color: 'blue' },     // ✅ Bulk — string key
  disabled: true,                // ✅ Bulk — string key
  classList: { add: ['active'] } // ✅ Bulk — string key
});
```

---

## Index Updates — Applied to ONE Element

Index updates let you target a **specific element by its position** in the collection. Use numeric keys to specify which element gets the update.

```javascript
const cards = queryAll('.card');
// Suppose there are 4 cards: [card0, card1, card2, card3]

cards.update({
  [0]: { textContent: 'First Card' },   // card0 only
  [1]: { textContent: 'Second Card' },  // card1 only
  [3]: { textContent: 'Fourth Card' }   // card3 only
});
```

### What Counts as an Index Key?

A key is treated as an index when it's a **valid integer number**:

```javascript
queryAll('.item').update({
  [0]: { ... },    // ✅ Index — integer 0
  [1]: { ... },    // ✅ Index — integer 1
  [5]: { ... },    // ✅ Index — integer 5
  [-1]: { ... },   // ✅ Index — negative integer
  [-2]: { ... }    // ✅ Index — negative integer
});
```

---

## Combining Both in a Single Call

The real power is using **both types together**. Define shared properties for everyone, then override or add extras for specific elements:

### Example 1: Navigation Menu

```javascript
queryAll('.nav-link').update({
  // BULK — all links get base styling
  style: { color: '#333', textDecoration: 'none' },

  // INDEX — the active link gets special styling
  [0]: {
    style: { color: 'blue', fontWeight: 'bold' },
    classList: { add: ['active'] }
  }
});
```

### Example 2: Form Fields

```javascript
queryAll('#myForm input').update({
  // BULK — all inputs get the same class and autocomplete
  classList: { add: ['form-control'] },

  // INDEX — each input gets its own placeholder
  [0]: { placeholder: 'Your name' },
  [1]: { placeholder: 'Your email' },
  [2]: { placeholder: 'Your phone' }
});
```

### Example 3: Product List

```javascript
queryAll('.product').update({
  // BULK — all products get base styles
  style: { border: '1px solid #ddd', padding: '12px' },

  // INDEX — the first product is "featured"
  [0]: {
    style: { border: '2px solid gold', padding: '16px' },
    classList: { add: ['featured'] }
  }
});
```

---

## The Processing Order

This is important to understand:

```
Step 1: BULK updates → Applied to ALL elements
   ↓
Step 2: INDEX updates → Applied to specific elements
```

Bulk updates run **first**. Index updates run **second**. This means if both set the same property, the index update **wins** for that element.

```javascript
queryAll('.item').update({
  // Step 1: ALL items get color: 'gray'
  style: { color: 'gray' },

  // Step 2: Item 0 gets color: 'red' (overrides 'gray')
  [0]: { style: { color: 'red' } }
});

// Result:
// item[0] → color: 'red'   (index override)
// item[1] → color: 'gray'  (bulk only)
// item[2] → color: 'gray'  (bulk only)
```

---

## Bulk-Only and Index-Only Calls

You don't have to use both. Either type works on its own:

### Bulk Only (No Indices)

```javascript
// Just shared updates — same as standard .update()
queryAll('.card').update({
  style: { padding: '16px' },
  classList: { add: ['shadow'] }
});
```

### Index Only (No Bulk)

```javascript
// Just individual updates — no shared properties
queryAll('.btn').update({
  [0]: { textContent: 'Save' },
  [1]: { textContent: 'Cancel' },
  [2]: { textContent: 'Delete' }
});
```

---

## What Happens at Each Index?

The value at each index is a **full update object** — the same kind you'd pass to a single element's `.update()`:

```javascript
queryAll('.card').update({
  [0]: {
    // Any update property works here
    textContent: 'Hello',
    style: { color: 'blue', fontSize: '18px' },
    classList: { add: ['highlight'], remove: ['dimmed'] },
    disabled: false,
    hidden: false
  }
});
```

Each index value supports everything that `.update()` supports — `style`, `classList`, `textContent`, `setAttribute`, `addEventListener`, and all other update types.

---

## Out-of-Range Indices

If you use an index that doesn't exist in the collection, the module warns you:

```javascript
const items = queryAll('.item');
// Suppose there are 3 items (indices 0, 1, 2)

items.update({
  [0]: { textContent: 'First' },   // ✅ Exists — updated
  [5]: { textContent: 'Sixth' }    // ⚠️ No element at index 5
});
// Console: [Indexed Updates] No element at index 5 (resolved to 5, collection has 3 elements)
```

The valid indices are updated normally. Invalid ones are skipped with a warning — no errors thrown.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **Bulk updates** | Non-numeric keys → applied to ALL elements |
| **Index updates** | Numeric keys → applied to ONE element by position |
| **Combined** | Both types work together in a single `.update()` call |
| **Order** | Bulk first, then index (index can override bulk) |
| **Index values** | Full update objects — same as single-element `.update()` |
| **Out-of-range** | Skipped with a console warning, no errors |

> **Simple Rule to Remember:** String keys = everyone gets it. Number keys = only that element gets it. Bulk runs first, then indices — so individual settings can override shared ones.