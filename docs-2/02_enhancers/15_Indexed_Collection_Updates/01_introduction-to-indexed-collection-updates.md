[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Indexed Collection Updates — Introduction

## Quick Start (30 seconds)

```javascript
// Update ALL buttons AND customize individual ones — in a single call
queryAll('.btn').update({
  // Applied to ALL buttons
  style: { padding: '10px', borderRadius: '4px' },

  // Applied to specific buttons by index
  [0]: { textContent: 'Submit', style: { backgroundColor: 'green' } },
  [1]: { textContent: 'Cancel', style: { backgroundColor: 'red' } }
});
```

---

## What Are Indexed Collection Updates?

When you use `queryAll()` to get a collection and call `.update()`, the update normally applies to **every element** the same way. But what if you want to style **all** elements with shared properties, and also give **individual** elements unique content or styles?

That's what Indexed Collection Updates adds — the ability to **target specific elements by their position** (index) inside the same `.update()` call that also applies shared (bulk) updates to all elements.

Simply put, this module lets you say: **"Apply these shared properties to everyone, but give this one special treatment."**

---

## The Problem This Solves

### Without Indexed Updates

To customize individual elements in a collection, you'd need multiple separate calls:

```javascript
const buttons = queryAll('.btn');

// Step 1: Shared styles for all buttons
buttons.update({
  style: { padding: '10px', borderRadius: '4px' }
});

// Step 2: Customize individual buttons one by one
buttons[0].update({ textContent: 'Submit' });
buttons[1].update({ textContent: 'Cancel' });
buttons[2].update({ textContent: 'Reset' });
```

This works, but it requires **multiple calls** — one for the shared update, then one for each individual element.

### With Indexed Updates

```javascript
queryAll('.btn').update({
  // Shared — applied to ALL buttons
  style: { padding: '10px', borderRadius: '4px' },

  // Individual — applied to specific buttons
  [0]: { textContent: 'Submit' },
  [1]: { textContent: 'Cancel' },
  [2]: { textContent: 'Reset' }
});
```

**One call does everything.** Shared properties and individual customizations are all defined in a single update object.

---

## Mental Model: A Team Uniform

Think of a sports team getting new uniforms:

```
Coach says:
   ↓
"Everyone gets the same jersey and shorts"     → Bulk update (shared)
   ↓
"Player #1 gets the captain armband"           → Index [0] update
"Player #7 gets the goalkeeper gloves"         → Index [6] update
"The last player carries the flag"             → Index [-1] update
```

The team shares a **base uniform** (bulk update), but specific players get **individual additions** (indexed updates). That's exactly how this module works.

---

## How Does It Work?

```
queryAll('.btn').update({
  style: { padding: '10px' },       ← Non-numeric key → BULK
  classList: { add: ['shared'] },    ← Non-numeric key → BULK
  [0]: { textContent: 'First' },    ← Numeric key → INDEX
  [1]: { textContent: 'Second' }    ← Numeric key → INDEX
})
   ↓
1️⃣ Separate the update keys into two groups:
   ├── Bulk updates:  { style, classList }
   └── Index updates: { 0, 1 }
   ↓
2️⃣ Apply BULK updates to ALL elements first
   ├── Element 0 → style + classList
   ├── Element 1 → style + classList
   └── Element 2 → style + classList
   ↓
3️⃣ Apply INDEX updates to specific elements
   ├── Element 0 → textContent: 'First'
   └── Element 1 → textContent: 'Second'
   ↓
4️⃣ Return the collection (for chaining)
```

**Key detail:** Bulk updates are applied **first**, then index-specific updates are applied **second**. This means index-specific values can **override** bulk values for that element.

---

## What Gets Patched?

When you load this module, it automatically enhances several existing functions:

| Function | What Changes |
|----------|-------------|
| `querySelectorAll()` | Collections now support indexed `.update()` |
| `queryAll()` | Collections now support indexed `.update()` |
| `Collections.update()` | Supports indexed updates |
| `Selector.update()` | Supports indexed updates |
| `EnhancedUpdateUtility.enhanceCollectionWithUpdate()` | Auto-patches future collections |

You don't need to do anything extra — just load the module and indexed updates work everywhere.

---

## Basic Example

```html
<ul>
  <li class="item">Apple</li>
  <li class="item">Banana</li>
  <li class="item">Cherry</li>
</ul>
```

```javascript
queryAll('.item').update({
  // ALL items get these styles
  style: { padding: '8px', cursor: 'pointer' },

  // Individual items get unique text
  [0]: { textContent: 'First Fruit: Apple' },
  [1]: { textContent: 'Second Fruit: Banana' },
  [2]: { textContent: 'Third Fruit: Cherry' }
});
```

**Result:** Every item gets the same padding and cursor, but each has its own text.

---

## This Module Is an Enhancer

Load it **after** the core library and Global Query:

```html
<!-- 1. Core library -->
<script src="01_dh-core.js"></script>

<!-- 2. Global Query (provides queryAll) -->
<script src="03_dh-global-query.js"></script>

<!-- 3. Indexed Collection Updates -->
<script src="04_dh-indexed-collection-updates.js"></script>

<!-- 4. Your code -->
<script>
  queryAll('.card').update({
    style: { border: '1px solid #ccc' },
    [0]: { style: { border: '2px solid gold' } }
  });
</script>
```

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Adds index-based targeting to collection `.update()` |
| **Bulk updates** | Non-numeric keys → applied to ALL elements |
| **Index updates** | Numeric keys `[0]`, `[1]`, `[-1]` → applied to specific elements |
| **Order** | Bulk first, then index (index can override bulk) |
| **Auto-patching** | `queryAll()`, `querySelectorAll()`, `Collections`, `Selector` — all patched automatically |
| **Chaining** | `.update()` returns the collection |

> **Simple Rule to Remember:** Non-numeric keys update **all** elements. Numeric keys update **one specific** element by position. Bulk runs first, then index-specific — so individual settings can override shared ones.