[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Conditions Collection Extension — Introduction

## Quick Start (30 seconds)

```javascript
// Apply conditions to a COLLECTION with bulk + index-specific updates
const viewMode = state('compact');

Conditions.whenStateCollection(
  () => viewMode.value,
  {
    'compact': {
      // Bulk: applies to ALL elements
      style: { padding: '5px', fontSize: '14px' },

      // Index-specific: applies to individual elements
      0:  { style: { fontWeight: 'bold' } },     // First item bold
      -1: { style: { borderBottom: 'none' } }     // Last item no border
    },
    'spacious': {
      style: { padding: '20px', fontSize: '18px' },
      0: { style: { fontSize: '24px' } }
    }
  },
  '.list-item'
);
```

---

## What Is the Conditions Collection Extension?

The core `Conditions.whenState()` applies a config to **each element individually** — every element with the matching selector gets the same updates. That's great for uniform changes, but what if you need to treat specific elements in the collection differently?

The Collection Extension adds `Conditions.whenStateCollection()` — a method that understands **collections** as a whole. Inside each condition's config, you can include:

- **Non-numeric keys** (like `style`, `classList`, `textContent`) — applied to **all** elements (bulk)
- **Numeric keys** (like `0`, `1`, `-1`) — applied to **specific elements by index**

Simply put, it combines conditional rendering with index-based targeting in a single call.

---

## Syntax

```javascript
Conditions.whenStateCollection(valueFn, conditions, selector, options);

// Alias:
Conditions.whenCollection(valueFn, conditions, selector, options);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `valueFn` | `Function` or `any` | Function returning state value, or a direct value |
| `conditions` | `object` or `Function` | Condition map — configs can include numeric keys |
| `selector` | `string`, `Element`, `NodeList`, `Array` | Target collection |
| `options` | `object` (optional) | `{ reactive: true/false }` |

**Returns:**
- **Reactive mode:** Cleanup function
- **Static mode:** Object with `update()` and `destroy()` methods

---

## Why Does This Exist?

### The Situation: Bulk + Individual Updates

Imagine a list of items. When the view mode changes, you want to:
1. Change **all items** to a new padding and font size (bulk)
2. Make the **first item** bold (index-specific)
3. Remove the border from the **last item** (index-specific)

### With Regular whenState()

Regular `whenState()` gives every element the same config. To target specific elements, you'd need separate calls:

```javascript
// Bulk update for all items
Conditions.whenState(
  () => viewMode.value,
  {
    'compact': { style: { padding: '5px', fontSize: '14px' } }
  },
  '.list-item'
);

// Separate call for the first item
Conditions.whenState(
  () => viewMode.value,
  {
    'compact': { style: { fontWeight: 'bold' } }
  },
  '.list-item:first-child'
);

// Separate call for the last item
Conditions.whenState(
  () => viewMode.value,
  {
    'compact': { style: { borderBottom: 'none' } }
  },
  '.list-item:last-child'
);
```

Three separate calls for one logical operation.

### With whenStateCollection()

One call handles everything — bulk and index-specific updates together:

```javascript
Conditions.whenStateCollection(
  () => viewMode.value,
  {
    'compact': {
      style: { padding: '5px', fontSize: '14px' },   // All items
      0:  { style: { fontWeight: 'bold' } },           // First item
      -1: { style: { borderBottom: 'none' } }          // Last item
    }
  },
  '.list-item'
);
```

---

## Mental Model

Think of it like a **classroom seating chart with instructions**.

```
Teacher says: "Today's mode is EXAM"

General rules (bulk — all students):
├── "Clear your desks"
├── "No talking"
└── "Pencils only"

Specific rules (index — individual students):
├── Student 0 (front row): "Distribute the papers"
├── Student -1 (last seat): "Close the door"
└── Student 2: "Watch the clock"
```

The bulk rules apply to everyone. The index rules give specific students their own additional instructions.

---

## How Does It Work?

```
whenStateCollection(valueFn, conditions, selector)
   ↓
1️⃣ Get the collection from selector
   ├── '.className' → ClassName shortcut or querySelectorAll
   ├── '#id' → Falls back to regular whenState (single element)
   ├── 'css selector' → querySelectorAll
   └── NodeList/Array → use directly
   ↓
2️⃣ Get current value from valueFn()
   ↓
3️⃣ Find matching condition (first match wins)
   ↓
4️⃣ Apply the matching config:
   ├── Does collection have .update()? → Use it (handles bulk + index)
   └── No .update()? → Manual application:
       ↓
       Separate keys into:
       ├── Non-numeric → bulkUpdates (style, classList, etc.)
       └── Numeric → indexUpdates (0, 1, -1, etc.)
       ↓
       Apply bulk to ALL elements
       ↓
       Apply index updates to specific elements
       (negative indices converted: -1 → last element)
   ↓
5️⃣ If reactive: wrap in effect() for auto-updates
```

### Key Detail: How Bulk and Index Are Separated

```javascript
// Your config:
{
  style: { padding: '10px' },      // Non-numeric key → bulk
  classList: { add: 'item' },       // Non-numeric key → bulk
  0:  { style: { fontWeight: 'bold' } },   // Numeric key → index 0
  1:  { style: { fontStyle: 'italic' } },  // Numeric key → index 1
  -1: { style: { borderBottom: 'none' } }  // Numeric key → last element
}

// Internally separated:
bulkUpdates = {
  style: { padding: '10px' },
  classList: { add: 'item' }
}

indexUpdates = {
  0:  { style: { fontWeight: 'bold' } },
  1:  { style: { fontStyle: 'italic' } },
  -1: { style: { borderBottom: 'none' } }
}

// Step 1: Apply bulkUpdates to ALL elements
// Step 2: Apply indexUpdates to specific elements
```

Numeric keys are detected with the regex `/^-?\d+$/` — matching positive integers, negative integers, and zero.

---

## Basic Usage

### Static Mode — One-Time Application

```javascript
Conditions.whenStateCollection('compact', {
  'compact': {
    style: { padding: '5px' },
    0: { style: { fontWeight: 'bold' } }
  },
  'spacious': {
    style: { padding: '20px' },
    0: { style: { fontSize: '24px' } }
  }
}, '.list-item');
```

### Reactive Mode — Auto-Updates

```javascript
const layout = state('grid');

Conditions.whenStateCollection(
  () => layout.value,
  {
    'grid': {
      style: { display: 'inline-block', width: '200px', margin: '10px' },
      0: { style: { width: '420px' }, classList: { add: 'featured' } }
    },
    'list': {
      style: { display: 'block', width: '100%', margin: '5px 0' },
      0: { style: { fontWeight: 'bold' } }
    }
  },
  '.item'
);

// Change layout → collection updates automatically
layout.value = 'list';
```

### Using the Alias

```javascript
// whenCollection is an alias for whenStateCollection
Conditions.whenCollection(
  () => theme.value,
  {
    'dark':  { style: { backgroundColor: '#333' }, 0: { textContent: 'Dark Mode' } },
    'light': { style: { backgroundColor: '#fff' }, 0: { textContent: 'Light Mode' } }
  },
  '.panel'
);
```

---

## Negative Indices

Negative indices count from the end of the collection, just like array indexing:

```javascript
Conditions.whenStateCollection(
  () => mode.value,
  {
    'active': {
      classList: { add: 'active' },
      0:  { textContent: 'First item' },    // First element
      -1: { textContent: 'Last item' },     // Last element
      -2: { textContent: 'Second to last' } // Second from end
    }
  },
  '.item'
);
```

```
Collection: [Element0, Element1, Element2, Element3, Element4]

Index  0 → Element0
Index  1 → Element1
Index -1 → Element4  (length + (-1) = 5 + (-1) = 4)
Index -2 → Element3  (length + (-2) = 5 + (-2) = 3)
```

---

## Selector Types

The module supports various selector formats:

```javascript
// Class selector (uses ClassName shortcut if available)
Conditions.whenStateCollection(valueFn, conditions, '.items');

// CSS selector
Conditions.whenStateCollection(valueFn, conditions, 'table tr');

// NodeList
const rows = document.querySelectorAll('tr');
Conditions.whenStateCollection(valueFn, conditions, rows);

// Array of elements
Conditions.whenStateCollection(valueFn, conditions, [el1, el2, el3]);

// ID selector → falls back to regular Conditions.whenState()
Conditions.whenStateCollection(valueFn, conditions, '#singleElement');
```

When an `#id` selector is passed, the module recognizes it's a single element and delegates to the regular `Conditions.whenState()` instead.

---

## Load Order

```html
<!-- 1. Core Conditions module (required) -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- 2. Collection Extension (after Conditions) -->
<script src="03_dh-conditions-collection-extension.js"></script>

<!-- Optional: Indexed updates module for full .update() support -->
<script src="04_dh-indexed-collection-updates.js"></script>
```

---

## whenState vs whenStateCollection

| Feature | `whenState()` | `whenStateCollection()` |
|---------|--------------|------------------------|
| **Target** | Individual elements | Collection as a whole |
| **Bulk updates** | Yes (all get same config) | Yes (non-numeric keys) |
| **Index-specific** | No | Yes (numeric keys: `0`, `1`, `-1`) |
| **Negative indices** | No | Yes (`-1` = last element) |
| **Single elements** | Yes | Falls back to `whenState()` for `#id` |

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Conditional updates for collections with bulk + index support |
| **Non-numeric keys** | Applied to **all** elements in the collection (bulk) |
| **Numeric keys** | Applied to **specific** elements by index |
| **Negative indices** | `-1` = last, `-2` = second to last, etc. |
| **Bulk first** | Bulk updates apply to all, then index updates apply to specific elements |
| **Reactive** | Auto-updates with reactive state; falls back to one-time otherwise |
| **Alias** | `whenCollection()` is an alias for `whenStateCollection()` |

> **Simple Rule to Remember:** In `whenStateCollection()`, non-numeric keys in your config are **bulk** (everyone gets them), and numeric keys are **individual** (only that element gets them). Bulk applies first, then index-specific updates can override or add to individual elements.