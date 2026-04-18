[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Array Distribution — How It Works

## Quick Start (30 seconds)

```javascript
// 4 elements — array of 4 values → perfect match
querySelectorAll('.item').update({
  textContent: ['A', 'B', 'C', 'D']
});
// Element 0 → 'A', Element 1 → 'B', Element 2 → 'C', Element 3 → 'D'

// 4 elements — array of 2 values → last value repeats
querySelectorAll('.item').update({
  textContent: ['First', 'Rest']
});
// Element 0 → 'First', Element 1 → 'Rest', Element 2 → 'Rest', Element 3 → 'Rest'

// 4 elements — static value → same for all
querySelectorAll('.item').update({
  textContent: 'Same'
});
// Element 0 → 'Same', Element 1 → 'Same', Element 2 → 'Same', Element 3 → 'Same'
```

---

## The Distribution Rules

The module uses three simple rules to decide what each element gets:

### Rule 1: Arrays Are Distributed by Index

Each element gets the array value at its position:

```javascript
// Array: ['red', 'blue', 'green']
// Element 0 → 'red'     (array[0])
// Element 1 → 'blue'    (array[1])
// Element 2 → 'green'   (array[2])
```

### Rule 2: Short Arrays Repeat the Last Value

If the array has fewer values than elements, the **last value** fills the rest:

```javascript
// Array: ['red', 'blue'], Elements: 5
// Element 0 → 'red'     (array[0])
// Element 1 → 'blue'    (array[1])
// Element 2 → 'blue'    (last value repeats)
// Element 3 → 'blue'    (last value repeats)
// Element 4 → 'blue'    (last value repeats)
```

This is useful when you want the first element to be special and the rest to share a value:

```javascript
querySelectorAll('.item').update({
  style: {
    fontWeight: ['bold', 'normal']
    // First element: bold, all others: normal
  }
});
```

### Rule 3: Static Values Go to All Elements

Non-array values are applied to every element:

```javascript
// Static: '10px'
// Element 0 → '10px'
// Element 1 → '10px'
// Element 2 → '10px'
```

### Rule 4: Extra Array Values Are Ignored

If the array has more values than elements, the extras are simply unused:

```javascript
// Array: ['A', 'B', 'C', 'D', 'E'], Elements: 3
// Element 0 → 'A'
// Element 1 → 'B'
// Element 2 → 'C'
// 'D' and 'E' → not used
```

---

## The Three Update Modes

When `.update()` is called, the module detects which mode to use:

```
.update(config)
   ↓
Mode 1: Index-Based?
   → Has numeric keys like 0, 1, '-1'?
   → Yes: delegate to original index-based update
   ↓
Mode 2: Array Distribution?
   → Has any array values (even nested)?
   → Yes: distribute arrays across elements
   ↓
Mode 3: Bulk Update
   → No arrays, no indices
   → Apply same values to all elements
```

### Mode 1: Index-Based Updates (Numeric Keys)

When the module sees numeric keys (`0`, `1`, `'-1'`), it delegates to the existing index-based update system:

```javascript
collection.update({
  0: { textContent: 'First' },
  1: { textContent: 'Second' },
  '-1': { textContent: 'Last' }
});
// Handled by the index-based update system, not array distribution
```

### Mode 2: Array Distribution

When the module detects **any** array values — even nested inside `style` or `dataset` — it enters distribution mode:

```javascript
collection.update({
  textContent: ['A', 'B', 'C'],          // Array detected!
  style: { padding: '10px' }             // Static value
});
// Distribution mode: each element gets its own textContent
```

### Mode 3: Bulk Update (No Arrays)

When there are no arrays and no numeric keys, every element gets the same values:

```javascript
collection.update({
  classList: { add: 'active' },
  style: { padding: '10px' }
});
// Bulk mode: all elements get the same updates
```

---

## How Nested Properties Work

Arrays can appear at any level inside the update object. The module handles each property type differently:

### Style — Nested Object Processing

For `style`, the module processes each CSS property individually:

```javascript
querySelectorAll('.item').update({
  style: {
    color: ['red', 'blue', 'green'],     // Array → distributed
    fontSize: ['14px', '16px', '18px'],   // Array → distributed
    padding: '10px',                       // Static → all elements
    border: '1px solid gray'              // Static → all elements
  }
});
```

```
Processing for Element 0:
style: {
  color: 'red',           ← array[0]
  fontSize: '14px',        ← array[0]
  padding: '10px',         ← static (unchanged)
  border: '1px solid gray' ← static (unchanged)
}

Processing for Element 1:
style: {
  color: 'blue',          ← array[1]
  fontSize: '16px',        ← array[1]
  padding: '10px',         ← static (unchanged)
  border: '1px solid gray' ← static (unchanged)
}
```

### Dataset — Nested Object Processing

`dataset` works the same way as `style`:

```javascript
querySelectorAll('.item').update({
  dataset: {
    id: ['item-1', 'item-2', 'item-3'],    // Array → distributed
    type: ['primary', 'secondary', 'info'], // Array → distributed
    active: 'true'                          // Static → all elements
  }
});
```

### ClassList — Method-Level Distribution

For `classList`, arrays are distributed at the **method level** (add, remove, toggle):

```javascript
querySelectorAll('.item').update({
  classList: {
    add: ['class-a', 'class-b', 'class-c'],     // Array → distributed
    remove: 'old-class'                           // Static → all elements
  }
});
// Element 0: add 'class-a', remove 'old-class'
// Element 1: add 'class-b', remove 'old-class'
// Element 2: add 'class-c', remove 'old-class'
```

You can also distribute **arrays of arrays** for multiple classes per element:

```javascript
querySelectorAll('.item').update({
  classList: {
    add: [
      ['primary', 'bold'],    // Element 0 gets both classes
      ['secondary'],           // Element 1 gets one class
      ['info', 'italic']       // Element 2 gets both classes
    ]
  }
});
```

---

## Step-by-Step Processing

Let's trace exactly what happens with a real example:

```javascript
querySelectorAll('.card').update({
  textContent: ['Featured', 'Popular', 'New'],
  style: {
    color: ['gold', 'silver', 'blue'],
    padding: '12px'
  },
  classList: { add: 'card-active' }
});
```

**Assume 3 elements with class `card`.**

```
Step 1: Check for numeric keys
   → No numeric keys found
   → Continue to Step 2

Step 2: Check for array values (containsArrayValues)
   → textContent: ['Featured', 'Popular', 'New'] ← Array found!
   → Result: true → Enter array distribution mode

Step 3: Process each element

   Element 0 (index=0):
   ├── textContent: array → pick [0] → 'Featured'
   ├── style.color: array → pick [0] → 'gold'
   ├── style.padding: static → '12px'
   └── classList.add: static → 'card-active'
   → Apply: { textContent: 'Featured', style: { color: 'gold', padding: '12px' }, classList: { add: 'card-active' } }

   Element 1 (index=1):
   ├── textContent: array → pick [1] → 'Popular'
   ├── style.color: array → pick [1] → 'silver'
   ├── style.padding: static → '12px'
   └── classList.add: static → 'card-active'
   → Apply: { textContent: 'Popular', style: { color: 'silver', padding: '12px' }, classList: { add: 'card-active' } }

   Element 2 (index=2):
   ├── textContent: array → pick [2] → 'New'
   ├── style.color: array → pick [2] → 'blue'
   ├── style.padding: static → '12px'
   └── classList.add: static → 'card-active'
   → Apply: { textContent: 'New', style: { color: 'blue', padding: '12px' }, classList: { add: 'card-active' } }

Step 4: Return collection
```

---

## Real-World Examples

### Example 1: Product List

```javascript
const products = ['Laptop', 'Phone', 'Tablet'];
const prices = ['$999', '$699', '$499'];

querySelectorAll('.product').update({
  textContent: products,
  dataset: { price: prices },
  style: {
    borderLeft: ['4px solid gold', '4px solid silver', '4px solid bronze'],
    padding: '16px'
  }
});
```

### Example 2: Progress Bars

```javascript
const percentages = [30, 65, 90];

querySelectorAll('.progress-bar').update({
  style: {
    width: percentages.map(p => `${p}%`),
    backgroundColor: percentages.map(p =>
      p < 40 ? 'red' : p < 70 ? 'orange' : 'green'
    )
  },
  textContent: percentages.map(p => `${p}%`)
});
```

### Example 3: Alternating Row Colors

```javascript
const rowCount = 6;

querySelectorAll('.table-row').update({
  style: {
    backgroundColor: Array.from({ length: rowCount }, (_, i) =>
      i % 2 === 0 ? '#f8f9fa' : '#ffffff'
    )
  }
});
```

### Example 4: Staggered Animations

```javascript
querySelectorAll('.card').update({
  style: {
    animation: [
      'fadeIn 0.5s ease 0s',
      'fadeIn 0.5s ease 0.1s',
      'fadeIn 0.5s ease 0.2s',
      'fadeIn 0.5s ease 0.3s'
    ],
    opacity: '0'
  }
});
```

### Example 5: Form Field Setup

```javascript
querySelectorAll('input[type="text"]').update({
  placeholder: ['Full Name', 'Email Address', 'Phone Number'],
  value: ['', '', ''],
  style: {
    padding: '10px',
    borderRadius: '4px'
  },
  classList: { add: 'form-control' }
});
```

---

## The Detection Function: `containsArrayValues`

The module uses `containsArrayValues()` to scan the entire update object (including nested objects) for any array value:

```
containsArrayValues({ textContent: 'Hello' })
   → Scan values: 'Hello' → not an array
   → Result: false → bulk mode

containsArrayValues({ textContent: ['A', 'B'] })
   → Scan values: ['A', 'B'] → is an array!
   → Result: true → distribution mode

containsArrayValues({ style: { color: ['red', 'blue'] } })
   → Scan values: style is an object → recurse
   → Inside style: ['red', 'blue'] → is an array!
   → Result: true → distribution mode
```

This recursive scan ensures arrays are detected even when deeply nested inside `style`, `dataset`, or `classList`.

---

## Summary

| Rule | What Happens |
|------|-------------|
| Array value at index | Element gets `array[index]` |
| Index beyond array length | Element gets `array[last]` (repeat) |
| More array values than elements | Extra values ignored |
| Static (non-array) value | All elements get the same value |
| No arrays at all | Bulk update mode (optimized) |
| Numeric keys (`0`, `'-1'`) | Index-based mode (delegated) |

| Nested Property | How Arrays Work |
|----------------|----------------|
| `style: { color: [...] }` | Each CSS property distributed individually |
| `dataset: { id: [...] }` | Each data attribute distributed individually |
| `classList: { add: [...] }` | Each method's classes distributed individually |
| Top-level: `textContent: [...]` | Distributed directly |

> **Simple Rule to Remember:** Arrays in `.update()` are **mail routes** — each element on the route gets its own delivery. Static values are **broadcasts** — everyone gets the same message. The module figures out which is which automatically.