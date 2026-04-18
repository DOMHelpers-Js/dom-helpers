[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Usage Examples and Best Practices

## Quick Start (30 seconds)

```javascript
// Navigation tabs — all tabs reset, active tab highlighted
const activeTab = state(0);

Conditions.whenStateCollection(
  () => activeTab.value,
  {
    '0': {
      classList: { remove: 'active' },
      0: { classList: { add: 'active' }, style: { fontWeight: 'bold' } }
    },
    '1': {
      classList: { remove: 'active' },
      1: { classList: { add: 'active' }, style: { fontWeight: 'bold' } }
    },
    '2': {
      classList: { remove: 'active' },
      2: { classList: { add: 'active' }, style: { fontWeight: 'bold' } }
    }
  },
  '.tab'
);
```

---

## Real-World Examples

### Example 1: List View Modes

Switch between compact, comfortable, and spacious layouts. The first item gets special treatment in each mode:

```javascript
const viewMode = state('compact');

Conditions.whenStateCollection(
  () => viewMode.value,
  {
    'compact': {
      style: { padding: '5px', fontSize: '14px' },
      classList: { add: 'compact-mode', remove: ['comfortable-mode', 'spacious-mode'] },
      0: { style: { fontWeight: 'bold' } },
      -1: { style: { borderBottom: 'none' } }
    },
    'comfortable': {
      style: { padding: '15px', fontSize: '16px' },
      classList: { add: 'comfortable-mode', remove: ['compact-mode', 'spacious-mode'] },
      0: { style: { fontSize: '18px' } }
    },
    'spacious': {
      style: { padding: '25px', fontSize: '18px' },
      classList: { add: 'spacious-mode', remove: ['compact-mode', 'comfortable-mode'] }
    }
  },
  '.list-item'
);
```

### Example 2: Priority Levels

All tasks get a priority indicator, but the first task in each priority level gets additional emphasis:

```javascript
const priority = state('normal');

Conditions.whenStateCollection(
  () => priority.value,
  {
    'urgent': {
      style: { borderLeft: '4px solid red', backgroundColor: '#fee' },
      classList: { add: 'priority-urgent' },
      0: { style: { fontWeight: 'bold', fontSize: '16px' } }
    },
    'high': {
      style: { borderLeft: '4px solid orange', backgroundColor: '#ffe' },
      classList: { add: 'priority-high' }
    },
    'normal': {
      style: { borderLeft: '4px solid blue', backgroundColor: 'white' },
      classList: { add: 'priority-normal' }
    },
    'low': {
      style: { borderLeft: '4px solid gray', backgroundColor: '#f9f9f9', opacity: '0.7' },
      classList: { add: 'priority-low' }
    }
  },
  '.task'
);
```

### Example 3: Table Header Sorting Indicators

When sorting by a column, reset all headers and highlight the active one:

```javascript
const sortBy = state('name');

Conditions.whenStateCollection(
  () => sortBy.value,
  {
    'name': {
      classList: { remove: 'sorted' },
      style: { fontWeight: 'normal' },
      0: {
        classList: { add: 'sorted' },
        style: { fontWeight: 'bold' }
      }
    },
    'date': {
      classList: { remove: 'sorted' },
      style: { fontWeight: 'normal' },
      1: {
        classList: { add: 'sorted' },
        style: { fontWeight: 'bold' }
      }
    },
    'size': {
      classList: { remove: 'sorted' },
      style: { fontWeight: 'normal' },
      2: {
        classList: { add: 'sorted' },
        style: { fontWeight: 'bold' }
      }
    }
  },
  'thead th'
);
```

### Example 4: Card Deck Layouts

Different arrangements for a set of cards — stacked, spread out, or in a grid:

```javascript
const deckLayout = state('stacked');

Conditions.whenStateCollection(
  () => deckLayout.value,
  {
    'stacked': {
      style: { position: 'absolute', top: '0', left: '0' },
      0: { style: { zIndex: '3', transform: 'translateY(0)' } },
      1: { style: { zIndex: '2', transform: 'translateY(10px)' } },
      2: { style: { zIndex: '1', transform: 'translateY(20px)' } }
    },
    'spread': {
      style: { position: 'relative', display: 'inline-block', margin: '0 10px' },
      1: { style: { transform: 'scale(1.1)', zIndex: '2' } }
    },
    'grid': {
      style: { display: 'inline-block', width: 'calc(33.33% - 20px)', margin: '10px' },
      0: { style: { width: 'calc(100% - 20px)' } }
    }
  },
  '.card'
);
```

### Example 5: Loading States with Staggered Animation

Show skeleton loaders while loading, then stagger the reveal:

```javascript
const loadingState = state('loading');

Conditions.whenStateCollection(
  () => loadingState.value,
  {
    'loading': {
      classList: { add: 'skeleton-loader' },
      style: { backgroundColor: '#f0f0f0' },
      0: { style: { animationDelay: '0s' } },
      1: { style: { animationDelay: '0.1s' } },
      2: { style: { animationDelay: '0.2s' } },
      3: { style: { animationDelay: '0.3s' } }
    },
    'loaded': {
      classList: { remove: 'skeleton-loader' },
      style: { backgroundColor: 'white', opacity: '0', transition: 'opacity 0.3s' },
      0: { style: { opacity: '1', transitionDelay: '0s' } },
      1: { style: { opacity: '1', transitionDelay: '0.1s' } },
      2: { style: { opacity: '1', transitionDelay: '0.2s' } },
      3: { style: { opacity: '1', transitionDelay: '0.3s' } }
    },
    'error': {
      style: { display: 'none' },
      0: {
        style: { display: 'block' },
        textContent: 'Failed to load items',
        classList: { add: 'error-message' }
      }
    }
  },
  '.content-item'
);
```

### Example 6: Filter Visibility

Show all items, only recent items, or highlight favorites:

```javascript
const filterState = state('all');

Conditions.whenStateCollection(
  () => filterState.value,
  {
    'all': {
      style: { display: 'block', opacity: '1' }
    },
    'recent': {
      style: { opacity: '0.3' },
      0: { style: { opacity: '1' } },
      1: { style: { opacity: '1' } },
      2: { style: { opacity: '1' } }
    }
  },
  '.list-item'
);
```

---

## Static Mode Usage

For one-time application without reactivity, pass a direct value:

```javascript
// Apply once — no reactive updates
Conditions.whenStateCollection('grid', {
  'grid': {
    style: { display: 'inline-block', width: '200px' },
    0: { classList: { add: 'featured' } }
  },
  'list': {
    style: { display: 'block', width: '100%' }
  }
}, '.item');
```

The return value has an `update()` method for manual re-evaluation:

```javascript
const result = Conditions.whenStateCollection('compact', conditions, '.item');

// Later: re-evaluate
result.update();
```

---

## Using Different Selector Types

```javascript
const mode = state('default');
const conditions = {
  'default': { style: { padding: '10px' }, 0: { style: { fontWeight: 'bold' } } },
  'compact': { style: { padding: '4px' } }
};

// Class selector (uses ClassName shortcut if available)
Conditions.whenStateCollection(() => mode.value, conditions, '.items');

// CSS selector
Conditions.whenStateCollection(() => mode.value, conditions, 'table tr');

// NodeList
const rows = document.querySelectorAll('tr');
Conditions.whenStateCollection(() => mode.value, conditions, rows);

// Array of elements
const elements = [el1, el2, el3];
Conditions.whenStateCollection(() => mode.value, conditions, elements);
```

---

## How the Fallback Works

The module tries to use the collection's `.update()` method first (which handles bulk + index separation natively). If that's not available, it does it manually:

```
Apply matching config to collection
   ↓
Collection has .update()?
   ├── Yes → collection.update(config)
   │         (The indexed updates module handles bulk/index separation)
   └── No → Manual fallback:
       ├── Separate non-numeric keys → bulkUpdates
       ├── Separate numeric keys → indexUpdates
       ├── For each element: element.update(bulkUpdates)
       └── For each index: elements[index].update(indexUpdates[index])
```

---

## Best Practices

### 1. Use Bulk for Shared Styles, Index for Exceptions

```javascript
// ✅ Clean separation of concerns
{
  'active': {
    // Shared by all elements
    classList: { add: 'active' },
    style: { opacity: '1' },

    // Exceptions for specific positions
    0:  { style: { fontWeight: 'bold' } },
    -1: { style: { borderBottom: 'none' } }
  }
}
```

### 2. Use Negative Indices for Last/Second-to-Last

```javascript
// ✅ Negative indices adapt to any collection size
{
  'active': {
    -1: { style: { borderBottom: 'none' } },   // Always the last
    -2: { style: { opacity: '0.8' } }           // Always second to last
  }
}
```

### 3. ID Selectors Fall Back to whenState

```javascript
// This is a single element — module uses whenState automatically
Conditions.whenStateCollection(valueFn, conditions, '#singleElement');

// For collections, use class selectors or CSS selectors
Conditions.whenStateCollection(valueFn, conditions, '.items');
```

### 4. Keep Index Configs Focused

```javascript
// ✅ Index configs only add what's different from bulk
{
  'active': {
    style: { padding: '10px', color: 'green' },   // All elements
    0: { style: { fontWeight: 'bold' } }           // Only override font
  }
}

// ❌ Don't repeat bulk properties in index configs
{
  'active': {
    style: { padding: '10px', color: 'green' },
    0: { style: { padding: '10px', color: 'green', fontWeight: 'bold' } }
    //          ^^^^^^^^^ ^^^^^^^^^^^^^ Already applied by bulk
  }
}
```

### 5. Use Dynamic Conditions for Complex Logic

```javascript
Conditions.whenStateCollection(
  () => mode.value,
  () => ({
    'edit': {
      setAttribute: { contenteditable: 'true' },
      0: { style: { outline: '2px solid blue' } }
    },
    'view': {
      setAttribute: { contenteditable: 'false' },
      0: { style: { outline: 'none' } }
    }
  }),
  '.editable-cell'
);
```

---

## Summary

| Pattern | When to Use |
|---------|------------|
| **Bulk only** (no numeric keys) | All elements need the same updates |
| **Bulk + first item** (`0: {}`) | First element needs emphasis or special treatment |
| **Bulk + last item** (`-1: {}`) | Last element needs different styling (e.g., no border) |
| **Bulk + multiple indices** | Several specific elements need custom overrides |
| **Indices only** (no bulk keys) | Only specific elements need changes |

| Method | Alias | Description |
|--------|-------|-------------|
| `Conditions.whenStateCollection()` | `Conditions.whenCollection()` | Collection-aware conditions with bulk + index |

> **Simple Rule to Remember:** Non-numeric keys in the config go to **everyone**. Numeric keys go to **that specific element**. Bulk applies first, then individual overrides layer on top. Use `0` for first, `-1` for last, and any positive number for specific positions.