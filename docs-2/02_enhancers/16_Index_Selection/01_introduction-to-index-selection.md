[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Index Selection — Introduction

## Quick Start (30 seconds)

```javascript
// After loading this module, Selector.queryAll() collections
// gain index-based bulk property methods

const items = Selector.queryAll('.item');

// Update specific elements by index
items.textContent({
  0: 'First Item',
  1: 'Second Item',
  2: 'Third Item'
});

items.style({
  0: { color: 'red' },
  1: { color: 'blue' }
});
```

---

## What Is Index Selection?

Index Selection is a **tiny bridge module** — just a few lines of code — that connects two existing modules together:

1. **Selector** — provides `Selector.queryAll()` for finding elements by CSS selector
2. **Bulk Property Updaters** — provides index-based property methods for collections

Without this bridge, collections from `Selector.queryAll()` don't have the index-based methods that Bulk Property Updaters provides. This module automatically patches `Selector.queryAll()` so every collection it returns is enhanced with those methods.

Simply put, it makes `Selector.queryAll()` collections work with **index-based bulk property updates**.

---

## Why Does This Module Exist?

The Bulk Property Updaters module automatically enhances collections from `Collections.ClassName`, `Collections.TagName`, and `Collections.Name`. But `Selector.queryAll()` is a separate system — it returns its own collections that don't go through the same enhancement path.

This module bridges that gap:

```
Before Index Selection:
├── Collections.ClassName.btn  → Has index-based methods ✅
├── Collections.TagName.div    → Has index-based methods ✅
└── Selector.queryAll('.btn')  → Does NOT have them ❌

After Index Selection:
├── Collections.ClassName.btn  → Has index-based methods ✅
├── Collections.TagName.div    → Has index-based methods ✅
└── Selector.queryAll('.btn')  → Has index-based methods ✅
```

---

## How It Works

The entire module is an IIFE (Immediately Invoked Function Expression) that runs once when loaded:

```
Module loads
   ↓
1️⃣ Check: Does Selector exist?
   └── No → Do nothing, exit silently
   ↓
2️⃣ Check: Does BulkPropertyUpdaters exist?
   └── No → Do nothing, exit silently
   ↓
3️⃣ Save original Selector.queryAll
   ↓
4️⃣ Replace Selector.queryAll with a new version:
   a) Call the original Selector.queryAll (get the collection)
   b) Pass the result through BulkPropertyUpdaters.enhanceCollectionInstance()
   c) Return the enhanced collection
   ↓
Done — all future Selector.queryAll() calls return enhanced collections
```

---

## What Methods Get Added?

When a collection is enhanced by `BulkPropertyUpdaters.enhanceCollectionInstance()`, it gains **six index-based methods**:

| Method | What It Does |
|--------|-------------|
| `.textContent({...})` | Set text content on elements by index |
| `.innerHTML({...})` | Set inner HTML on elements by index |
| `.value({...})` | Set input values on elements by index |
| `.style({...})` | Set styles on elements by index |
| `.dataset({...})` | Set data attributes on elements by index |
| `.classes({...})` | Set class operations on elements by index |

Each method accepts an object where **keys are numeric indices** and **values are the property values** to apply:

```javascript
const items = Selector.queryAll('.item');

items.textContent({
  0: 'Apple',
  1: 'Banana',
  2: 'Cherry'
});
```

All six methods are **chainable** — they return the collection.

---

## Load Order

This module requires both dependencies to be loaded first:

```html
<!-- 1. Core library (provides Selector) -->
<script src="01_dh-core.js"></script>

<!-- 2. Bulk Property Updaters (provides enhanceCollectionInstance) -->
<script src="01_dh-bulk-property-updaters.js"></script>

<!-- 3. Index Selection (bridges them) -->
<script src="05_dh-index-selection.js"></script>
```

If either dependency is missing, the module silently skips patching — no errors, no warnings.

---

## Key Characteristics

| Feature | Detail |
|---------|--------|
| **Type** | Auto-executing bridge (IIFE) |
| **Size** | ~13 lines of code |
| **Dependencies** | `Selector` + `BulkPropertyUpdaters` |
| **Exports** | None — works through side effects |
| **API** | No direct methods to call |
| **Reversible** | Not built-in — patch is permanent |
| **Failure mode** | Silent — does nothing if dependencies are missing |

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Bridges Selector with Bulk Property Updaters |
| **Why** | So `Selector.queryAll()` collections get index-based methods |
| **How** | Patches `Selector.queryAll()` to run results through `enhanceCollectionInstance()` |
| **Methods added** | `.textContent()`, `.innerHTML()`, `.value()`, `.style()`, `.dataset()`, `.classes()` |
| **Automatic** | Runs once on load — no manual setup needed |

> **Simple Rule to Remember:** This module is a one-line bridge. After loading it, `Selector.queryAll()` collections gain the same index-based bulk property methods that `Collections.ClassName` and `Collections.TagName` collections have.