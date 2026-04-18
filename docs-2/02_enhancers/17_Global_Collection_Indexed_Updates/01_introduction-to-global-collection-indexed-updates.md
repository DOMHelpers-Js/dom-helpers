[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Global Collection Indexed Updates — Introduction

## Quick Start (30 seconds)

```javascript
// Update ALL buttons AND customize specific ones — using ClassName
ClassName.btn.update({
  // Applied to ALL .btn elements
  style: { padding: '10px', borderRadius: '4px' },

  // Applied to specific elements by index
  [0]: { textContent: 'Submit', style: { backgroundColor: 'green' } },
  [1]: { textContent: 'Cancel', style: { backgroundColor: 'red' } },
  [-1]: { textContent: 'Last', disabled: true }
});
```

---

## What Is This Module?

The Collection Shortcuts module gives you global `ClassName`, `TagName`, and `Name` variables to access collections of elements. When you call `.update()` on those collections, it normally applies the same update to **every element**.

This module adds **indexed update support** — so you can target **individual elements by position** while also applying shared (bulk) properties to all elements, in a single `.update()` call.

Simply put, it brings the same **"bulk + index"** update pattern to the `ClassName`, `TagName`, and `Name` globals.

---

## The Problem This Solves

### Without This Module

To customize individual elements in a collection from `ClassName`, you need separate calls:

```javascript
// Step 1: Shared styles for all buttons
ClassName.btn.forEach((btn, i) => {
  btn.update({ style: { padding: '10px' } });
});

// Step 2: Customize individual buttons
ClassName.btn[0].update({ textContent: 'Submit' });
ClassName.btn[1].update({ textContent: 'Cancel' });
ClassName.btn[2].update({ textContent: 'Reset' });
```

### With This Module

```javascript
ClassName.btn.update({
  // Shared — applied to ALL buttons
  style: { padding: '10px' },

  // Individual — applied to specific buttons
  [0]: { textContent: 'Submit' },
  [1]: { textContent: 'Cancel' },
  [2]: { textContent: 'Reset' }
});
```

One call does everything.

---

## How Does It Work?

```
ClassName.btn.update({
  style: { padding: '10px' },        ← Non-numeric key → BULK
  classList: { add: ['styled'] },     ← Non-numeric key → BULK
  [0]: { textContent: 'First' },     ← Numeric key → INDEX
  [1]: { textContent: 'Second' }     ← Numeric key → INDEX
})
   ↓
1️⃣ Module intercepts the collection access (via Proxy)
   ↓
2️⃣ Wraps it in an enhanced collection with .update()
   ↓
3️⃣ .update() separates keys into bulk and index groups
   ↓
4️⃣ Apply BULK updates to ALL elements first
   ├── Element 0 → style + classList
   ├── Element 1 → style + classList
   └── Element 2 → style + classList
   ↓
5️⃣ Apply INDEX updates to specific elements second
   ├── Element 0 → textContent: 'First'
   └── Element 1 → textContent: 'Second'
   ↓
6️⃣ Return the collection (for chaining)
```

**Key detail:** Index updates run **after** bulk updates, so index-specific values can **override** bulk values for that element.

---

## What Gets Patched?

When this module loads, it automatically patches the three global collection shortcuts:

| Global Shortcut | What Changes |
|----------------|-------------|
| `ClassName` | Collections support indexed `.update()` |
| `TagName` | Collections support indexed `.update()` |
| `Name` | Collections support indexed `.update()` |

It also updates `DOMHelpers.ClassName`, `DOMHelpers.TagName`, and `DOMHelpers.Name` to match.

---

## What Gets Added to Collections?

Each collection returned from these shortcuts is wrapped with:

```
Enhanced Collection:
├── .update()     — Indexed + bulk update method
├── .length       — Number of elements
├── [0], [1], ... — Index access (auto-enhanced with .update())
├── .forEach()    — Iterate over elements
├── .map()        — Transform elements
├── .filter()     — Filter elements
├── for...of      — Iterator support
└── _hasIndexedUpdateSupport flag
```

---

## Load Order

This module requires three things loaded before it:

```html
<!-- 1. Core library (provides Collections, EnhancedUpdateUtility) -->
<script src="01_dh-core.js"></script>

<!-- 2. Collection Shortcuts (provides ClassName, TagName, Name) -->
<script src="02_dh-collection-shortcuts.js"></script>

<!-- 3. This module -->
<script src="06_dh-global-collection-indexed-updates.js"></script>
```

### Dependency Checks

| Dependency | Required? | If Missing |
|-----------|-----------|-----------|
| `Collections` | Yes | Module exits with error |
| `ClassName` / `TagName` / `Name` | Yes | Module exits with error |
| `EnhancedUpdateUtility` | Optional | Warning — basic fallback update used |

---

## Basic Example

```html
<button class="btn">OK</button>
<button class="btn">OK</button>
<button class="btn">OK</button>
```

```javascript
ClassName.btn.update({
  // ALL buttons get these styles
  style: { padding: '8px 16px', cursor: 'pointer' },
  classList: { add: ['btn-styled'] },

  // Individual buttons get unique text
  [0]: { textContent: 'Save' },
  [1]: { textContent: 'Cancel' },
  [2]: { textContent: 'Delete' }
});
```

**Result:** Every button gets the same padding and cursor, but each has its own label.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Adds indexed update support to `ClassName`, `TagName`, `Name` collections |
| **Bulk updates** | Non-numeric keys → applied to ALL elements |
| **Index updates** | Numeric keys `[0]`, `[1]`, `[-1]` → applied to specific elements |
| **Order** | Bulk first, then index (index can override bulk) |
| **Negative indices** | `[-1]` = last element, `[-2]` = second to last |
| **Auto-patching** | All three shortcuts patched on load |
| **Collection extras** | `.forEach()`, `.map()`, `.filter()`, `for...of` |

> **Simple Rule to Remember:** After loading this module, `ClassName.btn.update()`, `TagName.div.update()`, and `Name.email.update()` all support both bulk and index-specific updates in a single call. String keys update everyone, numeric keys update one element by position.