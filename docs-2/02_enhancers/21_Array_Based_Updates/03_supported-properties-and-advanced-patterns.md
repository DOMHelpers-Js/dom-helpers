[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Supported Properties and Advanced Patterns

## Quick Start (30 seconds)

```javascript
// Arrays work with ALL property types
querySelectorAll('.item').update({
  textContent: ['A', 'B', 'C'],                        // Direct property
  style: { color: ['red', 'blue', 'green'] },           // Style property
  dataset: { id: ['1', '2', '3'] },                     // Dataset property
  classList: { add: ['primary', 'secondary', 'info'] }   // ClassList operation
});
```

---

## Supported Property Types

### Direct Properties

Any property that exists directly on an HTML element can be distributed as an array:

```javascript
querySelectorAll('.item').update({
  textContent: ['Item 1', 'Item 2', 'Item 3'],
  innerHTML: ['<b>Bold</b>', '<i>Italic</i>', '<u>Underline</u>'],
  title: ['Tooltip 1', 'Tooltip 2', 'Tooltip 3']
});
```

For input elements:

```javascript
querySelectorAll('input').update({
  value: ['John', 'jane@email.com', '555-1234'],
  placeholder: ['Name', 'Email', 'Phone'],
  disabled: [false, false, true]
});
```

For checkboxes:

```javascript
querySelectorAll('input[type="checkbox"]').update({
  checked: [true, false, true, false]
});
```

---

### Style Properties

Each CSS property inside `style` is distributed individually:

```javascript
querySelectorAll('.box').update({
  style: {
    color: ['red', 'blue', 'green'],
    fontSize: ['14px', '16px', '18px'],
    backgroundColor: ['#fee', '#eef', '#efe'],
    padding: '10px',          // Static → all elements
    borderRadius: '4px'       // Static → all elements
  }
});
```

**What each element receives:**

```
Element 0: color='red',   fontSize='14px', bg='#fee', padding='10px', radius='4px'
Element 1: color='blue',  fontSize='16px', bg='#eef', padding='10px', radius='4px'
Element 2: color='green', fontSize='18px', bg='#efe', padding='10px', radius='4px'
```

---

### Dataset Properties

Each `data-*` attribute is distributed individually:

```javascript
querySelectorAll('.card').update({
  dataset: {
    id: ['card-1', 'card-2', 'card-3'],
    type: ['primary', 'secondary', 'info'],
    active: 'true'    // Static → all elements get data-active="true"
  }
});
```

**Resulting HTML:**

```html
<div class="card" data-id="card-1" data-type="primary" data-active="true">
<div class="card" data-id="card-2" data-type="secondary" data-active="true">
<div class="card" data-id="card-3" data-type="info" data-active="true">
```

---

### ClassList Operations

The `classList` methods (`add`, `remove`, `toggle`) each support array distribution:

**Single class per element:**

```javascript
querySelectorAll('.item').update({
  classList: {
    add: ['highlight', 'featured', 'new'],
    remove: 'old-class'    // Static → removed from all
  }
});
// Element 0: add 'highlight', remove 'old-class'
// Element 1: add 'featured', remove 'old-class'
// Element 2: add 'new', remove 'old-class'
```

**Multiple classes per element (nested arrays):**

```javascript
querySelectorAll('.item').update({
  classList: {
    add: [
      ['primary', 'bold'],         // Element 0 gets 2 classes
      ['secondary'],                // Element 1 gets 1 class
      ['info', 'italic', 'small']   // Element 2 gets 3 classes
    ]
  }
});
```

**Toggle per element:**

```javascript
querySelectorAll('.tab').update({
  classList: {
    toggle: ['active', 'inactive', 'active']
  }
});
// Element 0: toggle 'active'
// Element 1: toggle 'inactive'
// Element 2: toggle 'active'
```

---

### Attributes (Fallback)

Properties not found on the element are set as HTML attributes:

```javascript
querySelectorAll('.item').update({
  'aria-label': ['Label 1', 'Label 2', 'Label 3'],
  'data-custom': ['a', 'b', 'c'],
  role: ['button', 'link', 'tab']
});
```

---

## Advanced Patterns

### Pattern 1: Dynamic Array Generation

Use `Array.from()` or `.map()` to generate arrays dynamically:

```javascript
const count = 8;

querySelectorAll('.item').update({
  textContent: Array.from({ length: count }, (_, i) => `Item ${i + 1}`),
  style: {
    backgroundColor: Array.from({ length: count }, (_, i) =>
      `hsl(${i * (360 / count)}, 70%, 80%)`
    )
  }
});
```

### Pattern 2: Computed Values from Data

Transform data arrays into display values:

```javascript
const scores = [85, 42, 97, 63, 78];

querySelectorAll('.score').update({
  textContent: scores.map(s => `${s}%`),
  style: {
    color: scores.map(s => s >= 70 ? 'green' : 'red'),
    fontWeight: scores.map(s => s >= 90 ? 'bold' : 'normal')
  },
  classList: {
    add: scores.map(s =>
      s >= 90 ? 'excellent' :
      s >= 70 ? 'good' : 'needs-work'
    )
  }
});
```

### Pattern 3: Conditional Arrays

Use `.map()` with conditions to build per-element values:

```javascript
const statuses = ['active', 'inactive', 'pending', 'active'];

querySelectorAll('.user-badge').update({
  textContent: statuses.map(s => s.toUpperCase()),
  style: {
    backgroundColor: statuses.map(s => {
      if (s === 'active') return '#2ecc71';
      if (s === 'pending') return '#f39c12';
      return '#95a5a6';
    }),
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px'
  }
});
```

### Pattern 4: Chained Updates

`.update()` returns the collection, so you can chain multiple calls:

```javascript
querySelectorAll('.item')
  .update({
    textContent: ['Apple', 'Banana', 'Cherry']
  })
  .update({
    style: { color: ['red', 'yellow', 'pink'] }
  })
  .update({
    classList: { add: ['fruit-1', 'fruit-2', 'fruit-3'] }
  });
```

Each `.update()` runs independently — previous updates are preserved.

### Pattern 5: First Element Special, Rest Uniform

Use the "last value repeats" rule to style the first element differently:

```javascript
querySelectorAll('.list-item').update({
  style: {
    fontWeight: ['bold', 'normal'],
    // First element: bold, all others: normal

    fontSize: ['18px', '14px'],
    // First element: 18px, all others: 14px

    color: ['#333', '#666']
    // First element: dark, all others: lighter
  }
});
```

### Pattern 6: Data-Driven Cards

```javascript
const cards = [
  { title: 'Sales',    value: '$12,450', trend: 'up' },
  { title: 'Users',    value: '1,230',   trend: 'up' },
  { title: 'Orders',   value: '89',      trend: 'down' },
  { title: 'Revenue',  value: '$5,670',  trend: 'up' }
];

querySelectorAll('.stat-card').update({
  textContent: cards.map(c => `${c.title}: ${c.value}`),
  style: {
    borderLeft: cards.map(c =>
      `4px solid ${c.trend === 'up' ? '#2ecc71' : '#e74c3c'}`
    ),
    padding: '16px'
  },
  dataset: {
    trend: cards.map(c => c.trend)
  }
});
```

---

## How the Module Applies Updates Internally

When the module applies processed updates to a single element, it uses `applyUpdatesToElement()`. Here's how each property type is handled:

```
applyUpdatesToElement(element, updates)
   ↓
For each key-value pair:
   ├── key === 'style'?
   │   → Loop through each CSS property
   │   → element.style[prop] = value
   │
   ├── key === 'classList'?
   │   → Loop through methods (add/remove/toggle)
   │   → element.classList.add(...classes)
   │   → element.classList.remove(...classes)
   │   → element.classList.toggle(class)
   │
   ├── key === 'dataset'?
   │   → Loop through each data key
   │   → element.dataset[key] = value
   │
   ├── key exists on element? (key in element)
   │   → element[key] = value  (property)
   │
   └── else
       → element.setAttribute(key, value)  (attribute)
```

---

## Common Pitfalls

### Pitfall 1: Array vs String That Looks Like a List

```javascript
// ✅ Array — distributed to elements
{ textContent: ['A', 'B', 'C'] }
// Element 0 → 'A', Element 1 → 'B', Element 2 → 'C'

// ❌ String — same string for ALL elements
{ textContent: 'A, B, C' }
// Element 0 → 'A, B, C', Element 1 → 'A, B, C', Element 2 → 'A, B, C'
```

### Pitfall 2: Style as an Array (Instead of Object with Array Properties)

```javascript
// ❌ Don't pass style as an array
{ style: [{ color: 'red' }, { color: 'blue' }] }
// This won't distribute as expected

// ✅ Put arrays INSIDE the style object
{ style: { color: ['red', 'blue'] } }
// Element 0 → color: red, Element 1 → color: blue
```

### Pitfall 3: Empty Arrays

```javascript
// An empty array [] is not distributable
{ textContent: [] }
// No distribution happens — treated as static value
```

### Pitfall 4: Forgetting the Length Mismatch Behavior

```javascript
// Array shorter than collection → last value repeats
querySelectorAll('.item').update({  // 5 elements
  textContent: ['Special', 'Normal']
});
// Element 0: 'Special'
// Element 1-4: 'Normal' (all get last value)

// This is a FEATURE — useful for "first item different" patterns
// But it can be surprising if you expected elements 2-4 to get nothing
```

---

## Summary

| Property Type | Array Distribution | Example |
|--------------|-------------------|---------|
| **Direct** (`textContent`, `value`, etc.) | Top-level distribution | `textContent: ['A', 'B']` |
| **Style** | Per-CSS-property distribution | `style: { color: ['red', 'blue'] }` |
| **Dataset** | Per-data-attribute distribution | `dataset: { id: ['1', '2'] }` |
| **ClassList** | Per-method distribution | `classList: { add: ['cls-a', 'cls-b'] }` |
| **Attributes** | Top-level distribution (fallback) | `'aria-label': ['L1', 'L2']` |

| Pattern | How It Works |
|---------|-------------|
| Dynamic generation | `Array.from({ length: n }, (_, i) => ...)` |
| Computed values | `data.map(item => transform(item))` |
| Conditional values | `data.map(item => condition ? 'a' : 'b')` |
| Chained updates | `collection.update({...}).update({...})` |
| First-element special | `['special', 'normal']` — last value repeats |

> **Simple Rule to Remember:** Arrays work at **every level** of the update object — direct properties, inside `style`, inside `dataset`, inside `classList` methods. Wherever you put an array, the module distributes it. Wherever you put a static value, every element gets the same thing.