[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# The Override Pattern — Bulk First, Then Index

## Quick Start (30 seconds)

```javascript
queryAll('.card').update({
  // Step 1: ALL cards → gray border
  style: { border: '1px solid #ccc' },

  // Step 2: First card → gold border (overrides gray)
  [0]: { style: { border: '2px solid gold' } }
});
```

---

## Understanding the Processing Order

The module processes updates in a **fixed, predictable order**:

```
1️⃣  Bulk updates → Applied to ALL elements
         ↓
2️⃣  Index updates → Applied to SPECIFIC elements
```

This order matters because index-specific updates applied **second** can **override** the bulk values that were just set.

---

## How Override Works

```javascript
queryAll('.btn').update({
  style: { color: 'gray' },        // Bulk: ALL buttons → gray
  [0]: { style: { color: 'red' } } // Index: button[0] → red
});
```

**Step-by-step for each element:**

```
Button 0:
  Step 1 (Bulk):  color → 'gray'
  Step 2 (Index): color → 'red'   ← Overrides gray
  Final result:   color = 'red'

Button 1:
  Step 1 (Bulk):  color → 'gray'
  Step 2 (Index): (no index update)
  Final result:   color = 'gray'

Button 2:
  Step 1 (Bulk):  color → 'gray'
  Step 2 (Index): (no index update)
  Final result:   color = 'gray'
```

**Result:** Button 0 is red, all others are gray.

---

## The "Default + Exception" Pattern

This is the most common use case — set defaults for everyone, then specify exceptions:

### Example 1: Default Disabled, One Enabled

```javascript
queryAll('#form input').update({
  // Default: all inputs disabled
  disabled: true,

  // Exception: first input stays enabled
  [0]: { disabled: false }
});
```

### Example 2: Default Style, Featured Item

```javascript
queryAll('.product').update({
  // Default: standard appearance
  style: { opacity: '0.8', border: '1px solid #ddd' },

  // Exception: first product is featured
  [0]: {
    style: { opacity: '1', border: '2px solid gold' },
    classList: { add: ['featured'] }
  }
});
```

### Example 3: Default Hidden, Some Visible

```javascript
queryAll('.section').update({
  // Default: all sections hidden
  hidden: true,

  // Exceptions: first and last are visible
  [0]: { hidden: false },
  [-1]: { hidden: false }
});
```

---

## What Gets Overridden?

Only the **specific properties** set in the index update override the bulk. Other bulk properties remain:

```javascript
queryAll('.card').update({
  // Bulk: padding AND color
  style: { padding: '16px', color: 'gray' },

  // Index: only color is overridden — padding stays!
  [0]: { style: { color: 'red' } }
});
```

**Result for card[0]:**

```
padding → '16px'  (from bulk — not overridden)
color   → 'red'   (from index — overrides bulk 'gray')
```

The index update only affects the properties it explicitly sets. Everything else from bulk remains.

---

## Practical Examples

### Navigation Menu with Active State

```javascript
queryAll('.nav-link').update({
  // All links: default styling
  style: { color: '#555', fontWeight: 'normal' },
  classList: { remove: ['active'] },

  // Active link: override with bold blue
  [2]: {
    style: { color: '#007bff', fontWeight: 'bold' },
    classList: { add: ['active'] }
  }
});
```

### Pricing Table with Recommended Plan

```javascript
queryAll('.pricing-card').update({
  // All plans: standard border
  style: {
    border: '1px solid #e0e0e0',
    transform: 'scale(1)'
  },

  // Recommended plan: highlighted
  [1]: {
    style: {
      border: '2px solid #007bff',
      transform: 'scale(1.05)'
    },
    classList: { add: ['recommended'] }
  }
});
```

### Table Rows with Header Styling

```javascript
queryAll('#dataTable tr').update({
  // All rows: default background
  style: { backgroundColor: '#fff' },

  // Header row (first): dark background
  [0]: {
    style: { backgroundColor: '#333', color: '#fff', fontWeight: 'bold' }
  },

  // Last row: subtle footer
  [-1]: {
    style: { backgroundColor: '#f5f5f5', fontStyle: 'italic' }
  }
});
```

---

## Multiple Index Overrides

You can override multiple indices in the same call — each one only affects its own element:

```javascript
queryAll('.step').update({
  // Bulk: default step appearance
  style: { color: '#999' },
  classList: { add: ['step-pending'] },

  // Step 0: completed
  [0]: {
    style: { color: 'green' },
    classList: { add: ['step-done'], remove: ['step-pending'] }
  },

  // Step 1: in progress
  [1]: {
    style: { color: 'blue' },
    classList: { add: ['step-active'], remove: ['step-pending'] }
  }

  // Steps 2+ keep the bulk defaults (gray, pending)
});
```

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **Order** | Bulk updates run first, then index updates |
| **Override** | Index values replace bulk values for that specific element |
| **Partial override** | Only explicitly set properties are overridden; others from bulk remain |
| **Pattern** | "Default + Exception" — bulk sets the default, indices set exceptions |
| **Multiple overrides** | Each index independently overrides its own element |

> **Simple Rule to Remember:** Think of it like painting a room — bulk is the base coat applied everywhere, then index updates are touch-ups on specific spots. The touch-ups go over the base coat, but only where you paint them.