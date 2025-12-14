# Conditions Collection Extension - Available Methods

This module adds **collection-level conditional updates** to the `Conditions` module, with support for **bulk and index-specific updates** within condition mappings.

---

## 🎯 **Core Functionality**

### **Collection-Level Conditional Rendering**

Apply different configurations to **entire collections** based on state values, with support for both **bulk updates** (all elements) and **index-specific updates** (individual elements).

```javascript
// Regular Conditions.whenState() - applies to each element individually
Conditions.whenState(
  () => status.value,
  {
    'active': { style: { color: 'green' } }
  },
  '.items' // Each item gets the same config
);

// NEW: Conditions.whenStateCollection() - collection-aware updates
Conditions.whenStateCollection(
  () => status.value,
  {
    'active': {
      // Bulk: all items
      classList: { add: 'active' },
      
      // Index-specific: individual items
      [0]: { style: { fontWeight: 'bold' } },
      [1]: { style: { fontStyle: 'italic' } }
    }
  },
  '.items'
);
```

---

## 📦 **New Methods**

### 1. **`Conditions.whenStateCollection(valueFn, conditions, selector, options)`**

Apply conditions to collections with bulk and index-specific updates.

```javascript
const listMode = state('compact');

Conditions.whenStateCollection(
  () => listMode.value,
  {
    'compact': {
      // Bulk: all items
      style: { padding: '5px', fontSize: '14px' },
      classList: { add: 'compact-mode' },
      
      // Index-specific
      [0]: { style: { fontWeight: 'bold' } }, // First item bold
      [-1]: { style: { borderBottom: 'none' } } // Last item no border
    },
    'comfortable': {
      // Bulk: all items
      style: { padding: '15px', fontSize: '16px' },
      classList: { add: 'comfortable-mode' },
      
      // Index-specific
      [0]: { style: { fontSize: '18px' } } // First item larger
    },
    'spacious': {
      // Bulk: all items
      style: { padding: '25px', fontSize: '18px' },
      classList: { add: 'spacious-mode' }
    }
  },
  '.list-item'
);
```

**Parameters:**
- `valueFn` (Function|any): State value or function returning value
- `conditions` (Object|Function): Condition mappings with update objects
  - Can include **numeric keys** for index-specific updates
  - Non-numeric keys apply to **all elements** (bulk)
- `selector` (string|Element|NodeList|Array): Target collection
- `options` (Object, optional):
  - `reactive` (boolean): Enable/disable reactive mode (default: auto-detect)

**Returns:**
- **Reactive mode**: Cleanup function
- **Static mode**: Object with `update()` and `destroy()` methods

---

### 2. **`Conditions.whenCollection(valueFn, conditions, selector, options)`**

Convenience alias for `whenStateCollection()`.

```javascript
// Identical to whenStateCollection()
Conditions.whenCollection(
  () => theme.value,
  {
    'dark': {
      style: { backgroundColor: '#1a1a1a' },
      [0]: { textContent: 'Dark Theme Active' }
    },
    'light': {
      style: { backgroundColor: '#ffffff' },
      [0]: { textContent: 'Light Theme Active' }
    }
  },
  '.theme-items'
);
```

**Parameters:** Same as `whenStateCollection()`
**Returns:** Same as `whenStateCollection()`

---

## 💡 **Usage Examples**

### Example 1: List View Modes
```javascript
const viewMode = state('grid');

Conditions.whenStateCollection(
  () => viewMode.value,
  {
    'grid': {
      // All items
      style: {
        display: 'inline-block',
        width: '200px',
        margin: '10px'
      },
      classList: { add: 'grid-item', remove: 'list-item' },
      
      // First item featured
      [0]: {
        style: {
          width: '420px',
          gridColumn: 'span 2'
        },
        classList: { add: 'featured' }
      }
    },
    'list': {
      // All items
      style: {
        display: 'block',
        width: '100%',
        margin: '5px 0'
      },
      classList: { add: 'list-item', remove: 'grid-item' },
      
      // First item with icon
      [0]: {
        innerHTML: '📌 ' + document.querySelector('.item').textContent
      }
    }
  },
  '.item'
);
```

---

### Example 2: Priority Levels
```javascript
const priority = state('normal');

Conditions.whenStateCollection(
  () => priority.value,
  {
    'urgent': {
      // All tasks
      classList: { add: 'priority-urgent' },
      style: {
        borderLeft: '4px solid red',
        backgroundColor: '#fee'
      },
      
      // First task gets icon
      [0]: {
        innerHTML: '🚨 ' + document.querySelector('.task').textContent,
        style: { fontWeight: 'bold' }
      }
    },
    'high': {
      // All tasks
      classList: { add: 'priority-high' },
      style: {
        borderLeft: '4px solid orange',
        backgroundColor: '#ffe'
      },
      
      [0]: { innerHTML: '⚠️ ' + document.querySelector('.task').textContent }
    },
    'normal': {
      // All tasks
      classList: { add: 'priority-normal' },
      style: {
        borderLeft: '4px solid blue',
        backgroundColor: 'white'
      }
    },
    'low': {
      // All tasks
      classList: { add: 'priority-low' },
      style: {
        borderLeft: '4px solid gray',
        backgroundColor: '#f9f9f9',
        opacity: '0.7'
      }
    }
  },
  '.task'
);
```

---

### Example 3: Table Row States
```javascript
const tableMode = state('default');

Conditions.whenStateCollection(
  () => tableMode.value,
  {
    'default': {
      // All rows
      style: { backgroundColor: 'white' },
      
      // Header row
      [0]: {
        style: {
          backgroundColor: '#f0f0f0',
          fontWeight: 'bold'
        }
      },
      
      // Alternating rows
      [2]: { style: { backgroundColor: '#f9f9f9' } },
      [4]: { style: { backgroundColor: '#f9f9f9' } },
      [6]: { style: { backgroundColor: '#f9f9f9' } }
    },
    'highlight': {
      // All rows
      classList: { add: 'row-highlight' },
      
      // Header
      [0]: {
        style: {
          backgroundColor: '#007bff',
          color: 'white'
        }
      },
      
      // Data rows with gradient
      [1]: { style: { backgroundColor: '#e7f3ff' } },
      [2]: { style: { backgroundColor: '#cfe7ff' } },
      [3]: { style: { backgroundColor: '#b8dcff' } }
    },
    'compact': {
      // All rows
      style: {
        padding: '4px 8px',
        fontSize: '13px'
      },
      
      // Keep header prominent
      [0]: {
        style: {
          padding: '8px',
          fontSize: '14px',
          fontWeight: 'bold'
        }
      }
    }
  },
  'table tr'
);
```

---

### Example 4: Card Deck Layouts
```javascript
const deckLayout = state('stacked');

Conditions.whenStateCollection(
  () => deckLayout.value,
  {
    'stacked': {
      // All cards
      style: {
        position: 'absolute',
        top: '0',
        left: '0'
      },
      
      // Progressive z-index and offset
      [0]: { style: { zIndex: '3', transform: 'translateY(0)' } },
      [1]: { style: { zIndex: '2', transform: 'translateY(10px)' } },
      [2]: { style: { zIndex: '1', transform: 'translateY(20px)' } }
    },
    'spread': {
      // All cards
      style: {
        position: 'relative',
        display: 'inline-block',
        margin: '0 10px'
      },
      
      // Center card larger
      [1]: {
        style: {
          transform: 'scale(1.1)',
          zIndex: '2'
        }
      }
    },
    'grid': {
      // All cards
      style: {
        display: 'inline-block',
        width: 'calc(33.33% - 20px)',
        margin: '10px'
      },
      
      // First card full width
      [0]: {
        style: {
          width: 'calc(100% - 20px)'
        }
      }
    }
  },
  '.card'
);
```

---

### Example 5: Navigation Tabs
```javascript
const activeTab = state(0);

Conditions.whenStateCollection(
  () => activeTab.value,
  {
    '0': {
      // All tabs
      classList: { remove: 'active' },
      setAttribute: { 'aria-selected': 'false' },
      
      // Active tab
      [0]: {
        classList: { add: 'active' },
        setAttribute: { 'aria-selected': 'true' },
        style: {
          borderBottom: '3px solid blue',
          fontWeight: 'bold'
        }
      }
    },
    '1': {
      // All tabs
      classList: { remove: 'active' },
      setAttribute: { 'aria-selected': 'false' },
      
      // Active tab
      [1]: {
        classList: { add: 'active' },
        setAttribute: { 'aria-selected': 'true' },
        style: {
          borderBottom: '3px solid blue',
          fontWeight: 'bold'
        }
      }
    },
    '2': {
      // All tabs
      classList: { remove: 'active' },
      setAttribute: { 'aria-selected': 'false' },
      
      // Active tab
      [2]: {
        classList: { add: 'active' },
        setAttribute: { 'aria-selected': 'true' },
        style: {
          borderBottom: '3px solid blue',
          fontWeight: 'bold'
        }
      }
    }
  },
  '.tab'
);
```

---

### Example 6: Filter States
```javascript
const filterState = state('all');

Conditions.whenStateCollection(
  () => filterState.value,
  {
    'all': {
      // All items visible
      style: { display: 'block', opacity: '1' }
    },
    'favorites': {
      // All items
      style: { display: 'none' },
      
      // Show favorited items (assuming data-favorite attribute)
      // This would need element detection, simplified here
      [0]: { style: { display: 'block' } }, // Example: first is favorite
      [3]: { style: { display: 'block' } }  // Example: fourth is favorite
    },
    'recent': {
      // All items faded
      style: { opacity: '0.3' },
      
      // Recent items (first 3)
      [0]: { style: { opacity: '1' } },
      [1]: { style: { opacity: '1' } },
      [2]: { style: { opacity: '1' } }
    }
  },
  '.list-item'
);
```

---

### Example 7: Sorting Indicators
```javascript
const sortBy = state('name');

Conditions.whenStateCollection(
  () => sortBy.value,
  {
    'name': {
      // All headers
      classList: { remove: 'sorted' },
      innerHTML: (el) => el.textContent, // Remove arrows
      
      // Name column
      [0]: {
        classList: { add: 'sorted' },
        innerHTML: 'Name ↓',
        style: { fontWeight: 'bold' }
      }
    },
    'date': {
      // All headers
      classList: { remove: 'sorted' },
      
      // Date column
      [1]: {
        classList: { add: 'sorted' },
        innerHTML: 'Date ↓',
        style: { fontWeight: 'bold' }
      }
    },
    'size': {
      // All headers
      classList: { remove: 'sorted' },
      
      // Size column
      [2]: {
        classList: { add: 'sorted' },
        innerHTML: 'Size ↓',
        style: { fontWeight: 'bold' }
      }
    }
  },
  'thead th'
);
```

---

### Example 8: Progressive Enhancement
```javascript
const loadingState = state('idle');

Conditions.whenStateCollection(
  () => loadingState.value,
  {
    'loading': {
      // All items
      classList: { add: 'skeleton-loader' },
      style: { backgroundColor: '#f0f0f0' },
      
      // Progressive animation delays
      [0]: { style: { animationDelay: '0s' } },
      [1]: { style: { animationDelay: '0.1s' } },
      [2]: { style: { animationDelay: '0.2s' } },
      [3]: { style: { animationDelay: '0.3s' } }
    },
    'loaded': {
      // All items
      classList: { remove: 'skeleton-loader' },
      style: {
        backgroundColor: 'white',
        opacity: '0',
        transition: 'opacity 0.3s'
      },
      
      // Staggered fade-in
      [0]: { style: { opacity: '1', transitionDelay: '0s' } },
      [1]: { style: { opacity: '1', transitionDelay: '0.1s' } },
      [2]: { style: { opacity: '1', transitionDelay: '0.2s' } },
      [3]: { style: { opacity: '1', transitionDelay: '0.3s' } }
    },
    'error': {
      // All items
      style: { display: 'none' },
      
      // Show first item as error message
      [0]: {
        style: { display: 'block' },
        textContent: 'Failed to load items',
        classList: { add: 'error-message' }
      }
    }
  },
  '.content-item'
);
```

---

## 🔍 **How It Works Internally**

### **Update Separation:**

```javascript
// Condition config
{
  // Bulk updates (non-numeric keys)
  style: { padding: '10px' },
  classList: { add: 'item' },
  
  // Index updates (numeric keys)
  [0]: { style: { fontWeight: 'bold' } },
  [1]: { style: { fontStyle: 'italic' } },
  [-1]: { style: { borderBottom: 'none' } }
}

// Internally separates into:
bulkUpdates = {
  style: { padding: '10px' },
  classList: { add: 'item' }
}

indexUpdates = {
  0: { style: { fontWeight: 'bold' } },
  1: { style: { fontStyle: 'italic' } },
  -1: { style: { borderBottom: 'none' } }
}

// Applies bulk to ALL elements, then index-specific
```

---

## 🔧 **Collection Detection**

The module supports various collection types:

### String Selectors
```javascript
// Class name (uses ClassName shortcut if available)
Conditions.whenStateCollection(valueFn, conditions, '.items');

// CSS selector (uses querySelectorAll)
Conditions.whenStateCollection(valueFn, conditions, 'div.item');

// ID (falls back to regular whenState for single elements)
Conditions.whenStateCollection(valueFn, conditions, '#item');
```

### Direct Collections
```javascript
// NodeList
const items = document.querySelectorAll('.item');
Conditions.whenStateCollection(valueFn, conditions, items);

// HTMLCollection
const items = document.getElementsByClassName('item');
Conditions.whenStateCollection(valueFn, conditions, items);

// Array
const items = [el1, el2, el3];
Conditions.whenStateCollection(valueFn, conditions, items);

// DOM Helpers collections
const items = ClassName.item;
Conditions.whenStateCollection(valueFn, conditions, items);
```

---

## ⚙️ **Fallback Behavior**

### With `.update()` Method
```javascript
// If collection has .update() method (from indexed updates module)
collection.update({
  style: { padding: '10px' },
  [0]: { style: { fontWeight: 'bold' } }
});
// Uses collection's built-in update
```

### Without `.update()` Method
```javascript
// Falls back to manual application
// 1. Separates bulk and index updates
// 2. Applies bulk to all elements via element.update()
// 3. Applies index-specific to individual elements
```

---

## 📊 **Module Information**

```javascript
// Check if loaded
console.log(typeof Conditions.whenStateCollection); // 'function'
console.log(typeof Conditions.whenCollection);      // 'function'

// Use with reactive state
const mode = state('compact');
Conditions.whenStateCollection(() => mode.value, conditions, '.items');

// Use statically
Conditions.whenStateCollection('compact', conditions, '.items');
```

---

## ⚠️ **Important Notes**

### 1. **Load Order**
```html
<!-- Correct order -->
<script src="10a_dh-conditional-rendering.js"></script>
<script src="10c_dh-conditions-collection-extension.js"></script> <!-- AFTER -->

<!-- Optional but recommended for full functionality -->
<script src="05_dh-indexed-collection-updates.js"></script>
```

### 2. **Index Updates**
Numeric keys (positive and negative integers) are treated as **index-specific**:
```javascript
{
  '0': { ... },    // Index 0
  '1': { ... },    // Index 1
  '-1': { ... },   // Last element
  'style': { ... } // Bulk (non-numeric)
}
```

### 3. **Reactive vs Static**
```javascript
// Reactive (auto-updates when state changes)
Conditions.whenStateCollection(
  () => state.value,
  conditions,
  '.items'
);

// Static (execute once)
Conditions.whenStateCollection(
  'value',
  conditions,
  '.items'
);
```

### 4. **Single Elements**
For ID selectors, falls back to regular `whenState()`:
```javascript
// This uses regular whenState (single element)
Conditions.whenStateCollection(valueFn, conditions, '#singleItem');
```

---

## 🆚 **Comparison**

### Regular `whenState()`:
```javascript
// Each element gets the SAME config
Conditions.whenState(
  () => status.value,
  {
    'active': { style: { color: 'green' } }
  },
  '.items' // All items get green color
);
```

### New `whenStateCollection()`:
```javascript
// Collection-aware with bulk + index control
Conditions.whenStateCollection(
  () => status.value,
  {
    'active': {
      // Bulk
      style: { color: 'green' },
      
      // Index-specific
      [0]: { style: { fontWeight: 'bold' } }, // First item different
      [-1]: { style: { fontStyle: 'italic' } } // Last item different
    }
  },
  '.items'
);
```

---

## 🎯 **Key Features**

1. ✅ **Bulk + Index** updates in one call
2. ✅ **Reactive** mode support
3. ✅ **Multiple selectors** (string, NodeList, Array, etc.)
4. ✅ **Negative indices** (`[-1]` = last element)
5. ✅ **Fallback handling** (works with or without `.update()`)
6. ✅ **Collection shortcuts** (uses `ClassName`, etc.)
7. ✅ **Dynamic conditions** (function support)

---

## 📝 **Summary**

| Feature | Value |
|---------|-------|
| **Type** | Extension module |
| **Dependencies** | `Conditions.js` v4.0.0+ |
| **Optional** | Indexed updates module (for full `.update()` support) |
| **New Methods** | `whenStateCollection()`, `whenCollection()` |
| **Supports** | Bulk + index updates, reactive mode, multiple selector types |

---

This extension makes `Conditions` perfect for managing **collections with mixed updates** - applying common styles to all elements while customizing specific items by index! 🚀