[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Usage Examples and Best Practices

## Quick Start (30 seconds)

```javascript
// Three items, three colors — one call
Conditions.apply('visible', {
  'visible': {
    textContent: ['Apple', 'Banana', 'Cherry'],
    style: {
      backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d']
    }
  }
}, '.fruit-card');
```

---

## Real-World Examples

### Example 1: Status Badge Row

Each badge shows a different status:

```javascript
const statuses = ['Online', 'Away', 'Offline'];
const colors = ['green', 'orange', 'red'];

Conditions.apply('show', {
  'show': {
    textContent: statuses,
    style: { color: colors }
  }
}, '.status-badge');

// Badge 0 → "Online" in green
// Badge 1 → "Away" in orange
// Badge 2 → "Offline" in red
```

### Example 2: Navigation Tabs with Unique Labels

```javascript
const tabLabels = ['Home', 'Products', 'About', 'Contact'];
const tabIcons = ['house', 'box', 'info', 'envelope'];

Conditions.apply('active', {
  'active': {
    textContent: tabLabels,
    dataset: { icon: tabIcons },
    classList: { add: 'tab' },
    style: { padding: '10px 20px' }
  }
}, '.tab-button');

// All tabs get: class "tab", padding 10px 20px
// Each tab gets unique: textContent and data-icon
```

### Example 3: Chart Bars with Dynamic Heights

```javascript
const data = [30, 55, 80, 45, 90, 65];

Conditions.apply('show', {
  'show': {
    style: {
      height: data.map(v => `${v}%`),
      backgroundColor: data.map(v =>
        v < 40 ? '#e74c3c' :
        v < 70 ? '#f39c12' : '#2ecc71'
      ),
      transition: 'height 0.3s ease'
    },
    textContent: data.map(v => `${v}%`),
    setAttribute: {
      'aria-valuenow': data
    }
  }
}, '.chart-bar');

// Each bar gets its own height, color, and label
```

### Example 4: Table Row Alternating Styles

```javascript
const rowCount = 8;
const bgColors = Array.from({ length: rowCount }, (_, i) =>
  i % 2 === 0 ? '#f8f9fa' : '#ffffff'
);

Conditions.apply('visible', {
  'visible': {
    style: { backgroundColor: bgColors },
    dataset: {
      row: Array.from({ length: rowCount }, (_, i) => i + 1)
    },
    classList: {
      add: Array.from({ length: rowCount }, (_, i) =>
        i % 2 === 0 ? 'even-row' : 'odd-row'
      )
    }
  }
}, '.table-row');
```

### Example 5: Progress Steps

```javascript
const steps = ['Start', 'Process', 'Review', 'Complete'];
const currentStep = 2;

Conditions.apply('show', {
  'show': {
    textContent: steps,
    style: {
      color: steps.map((_, i) =>
        i < currentStep ? 'green' :
        i === currentStep ? 'blue' : 'gray'
      ),
      fontWeight: steps.map((_, i) =>
        i === currentStep ? 'bold' : 'normal'
      )
    },
    classList: {
      add: steps.map((_, i) =>
        i < currentStep ? 'completed' :
        i === currentStep ? 'active' : 'pending'
      )
    }
  }
}, '.step-indicator');
```

### Example 6: Priority Badges from Data

```javascript
const tasks = [
  { name: 'Fix bug', priority: 'high' },
  { name: 'Update docs', priority: 'medium' },
  { name: 'Add tests', priority: 'low' },
  { name: 'Deploy', priority: 'high' }
];

const priorityColors = { high: '#e74c3c', medium: '#f39c12', low: '#95a5a6' };

Conditions.apply('show', {
  'show': {
    textContent: tasks.map(t => t.priority.toUpperCase()),
    style: {
      backgroundColor: tasks.map(t => priorityColors[t.priority]),
      color: 'white',
      padding: '4px 8px',
      borderRadius: '3px'
    },
    dataset: {
      priority: tasks.map(t => t.priority),
      task: tasks.map(t => t.name)
    }
  }
}, '.priority-badge');
```

### Example 7: With Reactive State

Array distribution works with reactive conditions too:

```javascript
const colors = state(['red', 'blue', 'green']);

Conditions.whenState(
  () => colors.value.length > 0 ? 'show' : 'hide',
  {
    'show': {
      style: {
        backgroundColor: colors.value
      }
    },
    'hide': {
      style: { display: 'none' }
    }
  },
  '.color-box'
);

// Update triggers redistribution
colors.value = ['purple', 'orange', 'pink', 'yellow'];
```

### Example 8: Conditional Array Distribution

Different arrays for different conditions:

```javascript
const mode = state('list');
const items = ['Alpha', 'Beta', 'Gamma'];

Conditions.whenState(
  () => mode.value,
  {
    'list': {
      textContent: items,
      style: {
        display: 'block',
        color: ['red', 'blue', 'green']
      }
    },
    'grid': {
      textContent: items,
      style: {
        display: 'inline-block',
        width: ['100px', '150px', '200px']
      }
    },
    'hidden': {
      style: { display: 'none' }   // No arrays — bulk update
    }
  },
  '.item'
);
```

---

## Using applyWithArrays() Directly

When you already have elements and don't need condition matching:

```javascript
const items = document.querySelectorAll('.item');

Conditions.applyWithArrays(items, {
  textContent: ['First', 'Second', 'Third'],
  style: {
    color: ['red', 'blue', 'green'],
    fontWeight: 'bold'   // Non-array → all elements
  }
});
```

---

## Array Distribution Rules

### Rule 1: One-to-One Mapping

```javascript
// 3 elements, 3 values → perfect match
{ textContent: ['A', 'B', 'C'] }
// Element 0 → 'A', Element 1 → 'B', Element 2 → 'C'
```

### Rule 2: Last Value Repeats

```javascript
// 5 elements, 2 values → last value fills the rest
{ textContent: ['A', 'B'] }
// Element 0 → 'A'
// Element 1 → 'B'
// Element 2 → 'B' (repeats)
// Element 3 → 'B' (repeats)
// Element 4 → 'B' (repeats)
```

### Rule 3: Extra Values Ignored

```javascript
// 2 elements, 5 values → extras are skipped
{ textContent: ['A', 'B', 'C', 'D', 'E'] }
// Element 0 → 'A'
// Element 1 → 'B'
// (C, D, E ignored — no elements for them)
```

### Rule 4: Mixed Arrays and Static

```javascript
{
  textContent: ['A', 'B', 'C'],    // Distributed
  classList: { add: 'item' },       // All elements
  style: {
    color: ['red', 'blue', 'green'], // Distributed
    padding: '10px'                  // All elements
  }
}
```

---

## Combining Arrays with Index Overrides

Array distribution handles the **bulk** properties. Index-specific overrides (numeric keys) are applied **after** distribution:

```javascript
Conditions.apply('active', {
  'active': {
    // Step 1: Arrays distributed to all elements
    textContent: ['Item 1', 'Item 2', 'Item 3'],
    style: { color: ['red', 'blue', 'green'] },

    // Step 2: Index overrides applied on top
    0:  { style: { fontWeight: 'bold' } },
    -1: { classList: { add: 'last' } }
  }
}, '.item');

// Element 0: text="Item 1", color="red", fontWeight="bold"
// Element 1: text="Item 2", color="blue"
// Element 2: text="Item 3", color="green", class="last"
```

---

## Best Practices

### 1. Use Arrays When Each Element Needs Unique Values

```javascript
// ✅ Natural use — each item has different content
{
  textContent: ['Apple', 'Banana', 'Cherry'],
  style: { color: ['red', 'yellow', 'pink'] }
}

// ❌ Unnecessary — all elements get the same value
{
  textContent: ['Hello', 'Hello', 'Hello'],  // Just use a string
  style: { color: ['blue', 'blue', 'blue'] } // Just use a string
}
```

### 2. Mix Arrays and Static Values Freely

```javascript
// ✅ Only use arrays where values differ
{
  textContent: ['A', 'B', 'C'],  // Different per element
  classList: { add: 'item' },     // Same for all
  style: {
    color: ['red', 'blue', 'green'],  // Different
    padding: '10px',                   // Same
    borderRadius: '5px'                // Same
  }
}
```

### 3. Use .map() for Computed Arrays

```javascript
// ✅ Clean and readable
const items = ['Apple', 'Banana', 'Cherry'];

Conditions.apply('show', {
  'show': {
    textContent: items,
    dataset: { fruit: items.map(f => f.toLowerCase()) },
    dataset: { index: items.map((_, i) => i) }
  }
}, '.item');
```

### 4. Use hasArrayValues() to Debug

```javascript
// Check if your config will trigger distribution
const config = {
  textContent: ['A', 'B'],
  style: { color: 'red' }
};

console.log(Conditions.hasArrayValues(config)); // true
// → Array distribution will be used
```

### 5. Handle Length Mismatches Intentionally

```javascript
// ✅ Use a single-value array to apply to just the first element
//    and let it repeat for the rest
{
  style: { color: ['red'] }
  // Element 0 → red, Element 1 → red, Element 2 → red
  // Same as color: 'red' but through array path
}

// ✅ Provide exactly the right number of values when possible
const items = document.querySelectorAll('.item');
const colors = Array.from({ length: items.length }, (_, i) =>
  `hsl(${i * 30}, 70%, 60%)`
);
```

### 6. Keep Event Listeners Separate

Event listeners don't support array distribution. Use `dataset` to pass per-element data, then use a single handler:

```javascript
// ✅ Correct approach
{
  dataset: { index: [0, 1, 2] },  // Distributed
  addEventListener: {
    click: (e) => handleClick(e.target.dataset.index)  // Single handler
  }
}

// ❌ Won't work
{
  addEventListener: {
    click: [handler1, handler2, handler3]  // Not supported
  }
}
```

---

## Summary

| Pattern | When to Use |
|---------|------------|
| **textContent array** | Each element shows different text |
| **style property arrays** | Each element has unique styling |
| **classList arrays** | Each element gets different classes |
| **dataset arrays** | Each element stores unique data attributes |
| **Mixed arrays + static** | Some properties differ, some are shared |
| **Arrays + index overrides** | Distributed values plus individual exceptions |
| **applyWithArrays()** | Direct application without condition matching |

| Distribution Rule | Behavior |
|-------------------|----------|
| Same count | One-to-one: `array[i]` → `element[i]` |
| Fewer values | Last value repeats for remaining elements |
| More values | Extra values ignored |
| No arrays in config | Standard bulk update (original behavior) |

| Method | Purpose |
|--------|---------|
| `Conditions.apply()` | Enhanced — auto-detects arrays |
| `Conditions.hasArrayValues(config)` | Check if config contains arrays |
| `Conditions.applyWithArrays(els, config)` | Apply directly without conditions |
| `Conditions.restoreArraySupport()` | Revert to original behavior |

> **Simple Rule to Remember:** Put an **array** where you'd normally put a single value, and each element in the collection gets **its own value** from that array. Non-array values still apply to **everyone**. The last array value **repeats** if the array is shorter than the collection. Arrays and non-arrays can be **mixed** freely in the same config.