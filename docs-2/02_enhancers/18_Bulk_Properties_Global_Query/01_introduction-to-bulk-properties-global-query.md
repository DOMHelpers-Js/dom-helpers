[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Bulk Properties Updater Global Query — Introduction

## Quick Start (30 seconds)

```javascript
// Find one element — enhanced with .update()
query('#title').update({
  textContent: 'Hello World',
  style: { color: 'blue', fontSize: '24px' }
});

// Find all elements — enhanced with .update() AND bulk property methods
queryAll('.btn')
  .textContent({ 0: 'Save', 1: 'Cancel', 2: 'Reset' })
  .style({
    0: { backgroundColor: 'green' },
    1: { backgroundColor: 'red' },
    2: { backgroundColor: 'gray' }
  });
```

---

## What Is This Module?

This module is a **self-contained combination** of two capabilities in a single file:

1. **Global Query functions** — `query()` and `queryAll()` for finding elements by CSS selector
2. **Bulk Property Updater methods** — 19 index-based methods like `.textContent()`, `.style()`, `.value()` on collections

It provides its own `.update()` method and its own set of bulk property methods — all without requiring the separate Global Query or Bulk Property Updaters modules.

Simply put, this is an **all-in-one enhancer** that gives you CSS selector querying with full bulk property update capabilities in one load.

---

## What Does It Provide?

### For Single Elements (from `query()`)

Every element gets an `.update()` method that handles:

| Update Key | What It Does |
|-----------|-------------|
| `style` | Set CSS styles from an object |
| `dataset` | Set data-* attributes from an object |
| `classList` | Add, remove, toggle, or replace classes |
| `attrs` / `attributes` | Set or remove HTML attributes |
| Any other key | Direct property assignment (textContent, value, disabled, etc.) |

### For Collections (from `queryAll()`)

Every collection gets:

| Feature | What It Does |
|---------|-------------|
| `.update()` | Bulk + index-based updates |
| 14 simple property methods | `.textContent()`, `.innerHTML()`, `.value()`, `.placeholder()`, `.title()`, `.disabled()`, `.checked()`, `.readonly()`, `.hidden()`, `.selected()`, `.src()`, `.href()`, `.alt()`, `.innerText()` |
| 4 complex property methods | `.style()`, `.dataset()`, `.attrs()`, `.classes()` |
| 1 generic method | `.prop()` — for any property, including nested paths |
| Array methods | `.forEach()`, `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, `.reduce()`, `.slice()`, `.findIndex()` |

---

## How Does It Work?

```
query('#title')
   ↓
1️⃣ document.querySelector('#title')
   ↓
2️⃣ enhanceElement() — adds .update() method
   ↓
3️⃣ Return enhanced element

queryAll('.btn')
   ↓
1️⃣ document.querySelectorAll('.btn')
   ↓
2️⃣ enhanceNodeList() — wraps in enhanced collection:
   ├── Each element enhanced with .update()
   ├── Collection .update() method (bulk + index)
   ├── 19 bulk property methods
   └── Array methods (forEach, map, filter, etc.)
   ↓
3️⃣ Return enhanced collection
```

---

## This Module Is Self-Contained

Unlike modules that patch or extend other modules, this one works **independently**. It doesn't require the core DOM Helpers library, Global Query, or Bulk Property Updaters to be loaded first.

```html
<!-- Option A: Standalone — works on its own -->
<script src="07_dh-bulk-properties-updater-global-query.js"></script>

<!-- Option B: With core library — integrates with DOMHelpers -->
<script src="01_dh-core.js"></script>
<script src="07_dh-bulk-properties-updater-global-query.js"></script>
```

When loaded alongside the core library, it registers itself as `DOMHelpers.EnhancedQuerySelectors`.

---

## Global Functions

The module registers four global functions:

| Function | Alias For | Returns |
|----------|----------|---------|
| `querySelector(selector)` | — | Enhanced element or `null` |
| `querySelectorAll(selector)` | — | Enhanced collection |
| `query(selector)` | `querySelector` | Enhanced element or `null` |
| `queryAll(selector)` | `querySelectorAll` | Enhanced collection |

```javascript
// These pairs are identical:
querySelector('#title')  ===  query('#title')
querySelectorAll('.btn') ===  queryAll('.btn')
```

---

## Basic Example

```javascript
// Single element
query('#header').update({
  textContent: 'My App',
  style: { backgroundColor: '#333', color: 'white', padding: '16px' }
});

// Collection with bulk property methods
queryAll('.card')
  .textContent({ 0: 'Featured', 1: 'Standard', 2: 'Basic' })
  .style({
    0: { border: '2px solid gold' },
    1: { border: '1px solid gray' },
    2: { border: '1px solid gray' }
  })
  .classes({
    0: { add: ['featured'] }
  });
```

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Combined query + bulk property updater in one module |
| **Self-contained** | Works without other DOM Helpers modules |
| **query()** | Find one element with `.update()` |
| **queryAll()** | Find all elements with `.update()` + 19 bulk property methods |
| **Bulk methods** | `.textContent()`, `.style()`, `.value()`, `.classes()`, `.prop()`, and more |
| **Array methods** | `.forEach()`, `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, `.reduce()` |
| **Chaining** | All methods return the collection |

> **Simple Rule to Remember:** This module gives you `query()` and `queryAll()` with everything built in — single elements get `.update()`, collections get `.update()` plus 19 index-based bulk property methods. It works standalone or alongside the core library.