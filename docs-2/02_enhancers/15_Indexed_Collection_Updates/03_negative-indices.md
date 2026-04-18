[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Negative Indices — Counting from the End

## Quick Start (30 seconds)

```javascript
queryAll('.item').update({
  [-1]: { classList: { add: ['last'] } },       // Last element
  [-2]: { classList: { add: ['second-last'] } }  // Second to last
});
```

---

## What Are Negative Indices?

Negative indices let you target elements **from the end** of a collection instead of from the beginning. Instead of counting forward (0, 1, 2...), you count backward (-1, -2, -3...).

| Index | Means |
|-------|-------|
| `[0]` | First element |
| `[1]` | Second element |
| `[-1]` | **Last** element |
| `[-2]` | **Second to last** element |
| `[-3]` | **Third to last** element |

---

## Why Use Negative Indices?

### The Challenge: Targeting the Last Element

When you don't know exactly how many elements are in a collection, targeting the last one requires extra work:

```javascript
const items = queryAll('.item');
const lastIndex = items.length - 1;

items.update({
  [lastIndex]: { classList: { add: ['last'] } }
});
```

You'd have to calculate the index manually.

### With Negative Indices

```javascript
queryAll('.item').update({
  [-1]: { classList: { add: ['last'] } }
});
```

No calculation needed — `-1` always means "the last one," regardless of how many elements exist.

---

## How Negative Indices Are Resolved

The module converts negative indices by adding the collection length:

```
Collection has 5 elements: [el0, el1, el2, el3, el4]

Index [-1] → 5 + (-1) = 4  → el4 (last)
Index [-2] → 5 + (-2) = 3  → el3 (second to last)
Index [-3] → 5 + (-3) = 2  → el2 (third to last)
Index [-4] → 5 + (-4) = 1  → el1 (fourth to last)
Index [-5] → 5 + (-5) = 0  → el0 (first — same as [0])
```

### Visual Map

```
Positive:  [0]   [1]   [2]   [3]   [4]
            ↓     ↓     ↓     ↓     ↓
Elements:  el0   el1   el2   el3   el4
            ↑     ↑     ↑     ↑     ↑
Negative: [-5]  [-4]  [-3]  [-2]  [-1]
```

---

## Basic Examples

### Mark the First and Last

```javascript
queryAll('.list-item').update({
  [0]:  { classList: { add: ['first'] } },
  [-1]: { classList: { add: ['last'] } }
});
```

### Style the Last Card

```javascript
queryAll('.card').update({
  // All cards get a bottom border
  style: { borderBottom: '1px solid #eee' },

  // Last card doesn't need a bottom border
  [-1]: { style: { borderBottom: 'none' } }
});
```

### Highlight the Last Two Items

```javascript
queryAll('.product').update({
  [-1]: {
    classList: { add: ['sale'] },
    style: { backgroundColor: '#fff3cd' }
  },
  [-2]: {
    classList: { add: ['sale'] },
    style: { backgroundColor: '#fff3cd' }
  }
});
```

---

## Combining Positive and Negative Indices

You can mix positive and negative indices freely:

```javascript
queryAll('.step').update({
  // Shared styles
  style: { padding: '12px' },

  // First step
  [0]: {
    classList: { add: ['first-step'] },
    textContent: 'Start here'
  },

  // Last step
  [-1]: {
    classList: { add: ['last-step'] },
    textContent: 'Finish!'
  }
});
```

---

## Real-World Examples

### Example 1: Breadcrumb Navigation

```javascript
// Style the last breadcrumb as the current page
queryAll('.breadcrumb-item').update({
  style: { color: '#666' },
  [-1]: {
    style: { color: '#000', fontWeight: 'bold' }
  }
});
```

### Example 2: Table Row Borders

```javascript
// Remove bottom border from the last row
queryAll('#dataTable tr').update({
  style: { borderBottom: '1px solid #ddd' },
  [-1]: { style: { borderBottom: 'none' } }
});
```

### Example 3: List Separators

```javascript
// All items have a separator after them — except the last one
queryAll('.menu-item').update({
  classList: { add: ['has-separator'] },
  [-1]: { classList: { remove: ['has-separator'] } }
});
```

---

## Out-of-Range Negative Indices

If a negative index goes beyond the collection's length, it's skipped with a warning:

```javascript
const items = queryAll('.item');
// Suppose there are 3 items

items.update({
  [-1]:  { textContent: 'Last' },     // ✅ Resolves to index 2
  [-3]:  { textContent: 'First' },    // ✅ Resolves to index 0
  [-10]: { textContent: 'Too far' }   // ⚠️ Resolves to -7 → out of range
});
// Console: [Indexed Updates] No element at index -10 (resolved to -7, collection has 3 elements)
```

---

## Summary

| Negative Index | Means | Resolves To (in collection of 5) |
|---------------|-------|----------------------------------|
| `[-1]` | Last element | Index 4 |
| `[-2]` | Second to last | Index 3 |
| `[-3]` | Third to last | Index 2 |
| `[-4]` | Fourth to last | Index 1 |
| `[-5]` | Fifth to last (first) | Index 0 |

> **Simple Rule to Remember:** `[-1]` is always the last element, `[-2]` is always the second to last. The formula is `collection.length + negativeIndex`. Use negative indices when you want to target elements from the end without knowing the collection size.