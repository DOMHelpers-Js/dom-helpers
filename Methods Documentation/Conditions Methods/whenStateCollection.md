# Understanding `whenStateCollection()` - A Beginner's Guide

## What is `whenStateCollection()`?

`whenStateCollection()` is a **collection-aware version** of `whenState()` that can apply different configurations to **multiple elements at once**. It supports both **bulk updates** (applying to all elements) and **index-specific updates** (applying to individual elements by position).

Think of it as a **smart multi-element updater** that:
1. Works with collections of elements (NodeLists, arrays, etc.)
2. Applies configurations to all elements at once (bulk)
3. Also targets specific elements by index (including negative indices)
4. Watches state and updates automatically (reactive)

It's like having a **team coordinator** that can give instructions to everyone at once OR to specific team members by their position!

---

## Why Does `whenStateCollection()` Exist?

### The Problem: Updating Multiple Elements Individually

When working with multiple elements, you typically have to loop through them manually:

```javascript
const buttons = document.querySelectorAll('.btn');

// Manual loop for each state change ❌
function updateButtons(size) {
  buttons.forEach((btn, index) => {
    if (size === 'small') {
      btn.style.padding = '5px';
      btn.style.fontSize = '12px';
      
      // Different text for first and last
      if (index === 0) btn.textContent = 'First';
      if (index === buttons.length - 1) btn.textContent = 'Last';
    } else if (size === 'large') {
      btn.style.padding = '20px';
      btn.style.fontSize = '18px';
      
      if (index === 0) btn.textContent = 'First Large';
      if (index === buttons.length - 1) btn.textContent = 'Last Large';
    }
  });
}

// Must call this every time state changes!
updateButtons('small');
updateButtons('large');
```

**Problems:**
- Repetitive forEach loops
- Must handle bulk and individual updates separately
- Manual index tracking
- Easy to make mistakes
- No automatic updates when state changes
- Verbose and hard to maintain

### The Solution: Declarative Collection Updates

`whenStateCollection()` lets you declare how collections should look in different states:

```javascript
const state = Reactive.state({ size: 'small' });

Conditions.whenStateCollection(
  () => state.size,
  {
    'small': {
      // Bulk updates - apply to ALL buttons
      style: { padding: '5px', fontSize: '12px' },
      classList: { add: 'btn-small' },
      
      // Index-specific updates
      0: { textContent: 'First' },      // First button
      -1: { textContent: 'Last' }       // Last button
    },
    'large': {
      // Bulk updates for all
      style: { padding: '20px', fontSize: '18px' },
      classList: { add: 'btn-large', remove: 'btn-small' },
      
      // Index-specific
      0: { textContent: 'First Large' },
      -1: { textContent: 'Last Large' }
    }
  },
  '.btn'  // The collection selector
);

// Just change the state - everything updates automatically! ✨
state.size = 'large';
```

**Benefits:**
- ✅ Declarative, not imperative
- ✅ Bulk and indexed updates in one place
- ✅ Automatic synchronization
- ✅ Supports negative indices
- ✅ Much cleaner and maintainable
- ✅ No manual loops needed

---

## How Does It Work?

### The Concept

`whenStateCollection()` uses a **dual-update strategy**:

```
Get Collection → Separate Updates → Apply Bulk → Apply Indexed → Done
```

**Step by Step:**

1. **Detect**: Identifies which updates are bulk (non-numeric keys) and which are indexed (numeric keys)
2. **Bulk First**: Applies bulk updates to ALL elements in the collection
3. **Index After**: Applies index-specific updates to individual elements
4. **Resolve Negative**: Converts negative indices to positive (e.g., -1 → last element)
5. **Watch**: Continuously monitors state for changes (if reactive)

### Visual Example

**Update Object Structure:**
```javascript
{
  // BULK UPDATES (non-numeric keys) - apply to ALL elements
  style: { color: 'blue' },
  classList: { add: 'active' },
  disabled: false,
  
  // INDEXED UPDATES (numeric keys) - apply to SPECIFIC elements
  0: { textContent: 'First' },      // Positive index
  1: { textContent: 'Second' },     // Positive index
  -1: { textContent: 'Last' },      // Negative index (last element)
  -2: { textContent: 'Second Last' } // Negative index
}
```

**Application Order:**
```
1. Apply bulk updates to ALL elements
   └─> All buttons get blue color, active class, disabled=false

2. Apply indexed updates to SPECIFIC elements
   └─> Button[0] gets "First"
   └─> Button[1] gets "Second"
   └─> Button[-2] gets "Second Last" (resolves to length-2)
   └─> Button[-1] gets "Last" (resolves to length-1)
```

---

## Basic Usage

### Syntax

```javascript
Conditions.whenStateCollection(valueFn, conditions, selector, options)
```

**Parameters:**

1. **`valueFn`** (Function | Any) - What to watch
   - Function: `() => state.property` (reactive mode)
   - Direct value: `'value'` (static mode)

2. **`conditions`** (Object | Function) - Condition mappings with **collection update objects**
   - Each condition value can contain:
     - **Bulk properties** (non-numeric keys): Apply to all elements
     - **Index properties** (numeric keys): Apply to specific elements

3. **`selector`** (String | NodeList | Array) - Target collection
   - CSS selector: `'.items'`, `'button'`, `'[data-item]'`
   - NodeList: `document.querySelectorAll('.items')`
   - Array: `[element1, element2, element3]`

4. **`options`** (Object) - Optional settings
   - `{ reactive: true }` - Force reactive mode
   - `{ reactive: false }` - Force static mode

**Returns:**
- Reactive mode: `{ update, destroy }` cleanup object
- Static mode: `void`

---

## Practical Examples

### Example 1: Button Size Variants

**HTML:**
```html
<div>
  <button class="btn">First</button>
  <button class="btn">Middle</button>
  <button class="btn">Last</button>
</div>
<button id="toggle">Toggle Size</button>
```

**JavaScript:**
```javascript
const state = Reactive.state({
  buttonSize: 'normal'
});

Conditions.whenStateCollection(
  () => state.buttonSize,
  {
    'small': {
      // Bulk - applies to all buttons
      style: {
        padding: '5px 10px',
        fontSize: '12px'
      },
      classList: { add: 'btn-small', remove: ['btn-normal', 'btn-large'] },
      
      // Index-specific
      0: { textContent: '« First' },
      -1: { textContent: 'Last »' }
    },
    'normal': {
      // Bulk
      style: {
        padding: '10px 20px',
        fontSize: '14px'
      },
      classList: { add: 'btn-normal', remove: ['btn-small', 'btn-large'] },
      
      // Index-specific
      0: { textContent: 'First' },
      -1: { textContent: 'Last' }
    },
    'large': {
      // Bulk
      style: {
        padding: '15px 30px',
        fontSize: '18px',
        fontWeight: 'bold'
      },
      classList: { add: 'btn-large', remove: ['btn-small', 'btn-normal'] },
      
      // Index-specific
      0: { textContent: '◄◄ FIRST' },
      -1: { textContent: 'LAST ►►' }
    }
  },
  '.btn'
);

// Toggle size
document.getElementById('toggle').onclick = () => {
  const sizes = ['small', 'normal', 'large'];
  const currentIndex = sizes.indexOf(state.buttonSize);
  state.buttonSize = sizes[(currentIndex + 1) % sizes.length];
};
```

**What happens:**
1. All three buttons get bulk styling (padding, fontSize, classList)
2. First button (index 0) gets custom text
3. Last button (index -1) gets custom text
4. Middle button keeps default behavior (no index-specific update)
5. Everything updates automatically when `state.buttonSize` changes!

---

### Example 2: List Items with Different States

**HTML:**
```html
<ul class="items">
  <li class="item">Item 1</li>
  <li class="item">Item 2</li>
  <li class="item">Item 3</li>
  <li class="item">Item 4</li>
  <li class="item">Item 5</li>
</ul>
```

**JavaScript:**
```javascript
const list = Reactive.state({
  viewMode: 'normal'
});

Conditions.whenStateCollection(
  () => list.viewMode,
  {
    'compact': {
      // All items - compact styling
      style: {
        padding: '5px',
        fontSize: '12px',
        margin: '2px 0'
      },
      
      // First item - header style
      0: {
        style: {
          backgroundColor: '#e3f2fd',
          fontWeight: 'bold',
          borderBottom: '2px solid #2196F3'
        },
        textContent: '📁 Compact View'
      },
      
      // Last item - footer style
      -1: {
        style: {
          backgroundColor: '#f5f5f5',
          fontStyle: 'italic'
        },
        textContent: `Total: ${document.querySelectorAll('.item').length} items`
      }
    },
    'normal': {
      // All items
      style: {
        padding: '10px',
        fontSize: '14px',
        margin: '5px 0'
      },
      
      // First item
      0: {
        style: {
          backgroundColor: '#e8f5e9',
          fontWeight: 'bold',
          borderBottom: '2px solid #4CAF50'
        },
        textContent: '📋 Normal View'
      },
      
      // Last item
      -1: {
        style: {
          backgroundColor: '#fff3e0',
          fontStyle: 'italic'
        },
        textContent: `End of list (${document.querySelectorAll('.item').length} total)`
      }
    },
    'expanded': {
      // All items
      style: {
        padding: '20px',
        fontSize: '16px',
        margin: '10px 0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      },
      
      // First item
      0: {
        style: {
          backgroundColor: '#fce4ec',
          fontWeight: 'bold',
          fontSize: '18px',
          borderBottom: '3px solid #E91E63'
        },
        textContent: '📖 Expanded View'
      },
      
      // Second item - special highlight
      1: {
        style: {
          backgroundColor: '#fff9c4',
          border: '2px dashed #FFC107'
        }
      },
      
      // Second to last
      -2: {
        style: {
          backgroundColor: '#e1bee7',
          fontStyle: 'italic'
        }
      },
      
      // Last item
      -1: {
        style: {
          backgroundColor: '#ffebee',
          fontWeight: 'bold',
          fontSize: '14px'
        },
        textContent: `🔚 End (${document.querySelectorAll('.item').length} items shown)`
      }
    }
  },
  '.item'
);

// Mode switcher
const modes = ['compact', 'normal', 'expanded'];
let currentMode = 0;

setInterval(() => {
  currentMode = (currentMode + 1) % modes.length;
  list.viewMode = modes[currentMode];
}, 3000);
```

**What happens:**
1. Bulk styles apply to all items simultaneously
2. Index 0 (first item) always gets header styling
3. Index -1 (last item) always gets footer styling
4. In expanded mode, indices 1 and -2 get special highlighting
5. All updates happen automatically and smoothly!

---

### Example 3: Dynamic Table Rows

**HTML:**
```html
<table>
  <tbody id="data-rows">
    <tr class="data-row"><td>Row 1</td></tr>
    <tr class="data-row"><td>Row 2</td></tr>
    <tr class="data-row"><td>Row 3</td></tr>
    <tr class="data-row"><td>Row 4</td></tr>
  </tbody>
</table>
```

**JavaScript:**
```javascript
const table = Reactive.state({
  highlightMode: 'none'
});

Conditions.whenStateCollection(
  () => table.highlightMode,
  {
    'none': {
      // All rows - reset
      style: {
        backgroundColor: 'transparent',
        borderLeft: 'none'
      }
    },
    'first-last': {
      // All rows - subtle background
      style: {
        backgroundColor: '#fafafa'
      },
      
      // First row - highlight
      0: {
        style: {
          backgroundColor: '#e3f2fd',
          borderLeft: '4px solid #2196F3',
          fontWeight: 'bold'
        }
      },
      
      // Last row - highlight
      -1: {
        style: {
          backgroundColor: '#fff3e0',
          borderLeft: '4px solid #FF9800',
          fontWeight: 'bold'
        }
      }
    },
    'alternating': {
      // All rows get base styling
      style: {
        borderLeft: 'none'
      },
      
      // Even indices (0, 2, 4, ...)
      0: {
        style: { backgroundColor: '#f5f5f5' }
      },
      2: {
        style: { backgroundColor: '#f5f5f5' }
      },
      
      // Odd indices (1, 3, 5, ...)
      1: {
        style: { backgroundColor: '#ffffff' }
      },
      3: {
        style: { backgroundColor: '#ffffff' }
      }
    },
    'bookends': {
      // Middle rows - muted
      style: {
        backgroundColor: '#fafafa',
        opacity: '0.6'
      },
      
      // First row - emphasized
      0: {
        style: {
          backgroundColor: '#4CAF50',
          color: 'white',
          fontWeight: 'bold',
          opacity: '1'
        }
      },
      
      // Last row - emphasized
      -1: {
        style: {
          backgroundColor: '#4CAF50',
          color: 'white',
          fontWeight: 'bold',
          opacity: '1'
        }
      }
    }
  },
  '.data-row'
);

// Cycle through modes
const modes = ['none', 'first-last', 'alternating', 'bookends'];
let index = 0;

setInterval(() => {
  index = (index + 1) % modes.length;
  table.highlightMode = modes[index];
}, 2000);
```

**What happens:**
1. Different highlighting patterns for different modes
2. First and last rows consistently get special treatment
3. Alternating mode uses multiple indices for even/odd rows
4. Bookends mode emphasizes edges while muting middle rows
5. Smooth transitions between all modes!

---

### Example 4: Progress Indicators

**HTML:**
```html
<div class="steps">
  <div class="step">Step 1</div>
  <div class="step">Step 2</div>
  <div class="step">Step 3</div>
  <div class="step">Step 4</div>
  <div class="step">Step 5</div>
</div>
<button id="prev">Previous</button>
<button id="next">Next</button>
```

**JavaScript:**
```javascript
const wizard = Reactive.state({
  currentStep: 1  // 1-5
});

// Computed: which steps are complete, current, upcoming
wizard.$computed('stepStatus', function() {
  return {
    completed: this.currentStep - 1,
    current: this.currentStep,
    remaining: 5 - this.currentStep
  };
});

Conditions.whenStateCollection(
  () => wizard.currentStep,
  {
    '1': {
      // All steps - reset base state
      style: {
        backgroundColor: '#e0e0e0',
        color: '#757575'
      },
      classList: { remove: ['complete', 'current', 'upcoming'] },
      
      // Current step (first)
      0: {
        style: {
          backgroundColor: '#2196F3',
          color: 'white',
          fontWeight: 'bold'
        },
        classList: { add: 'current' },
        textContent: '➤ Step 1 (Current)'
      }
    },
    '2': {
      style: { backgroundColor: '#e0e0e0', color: '#757575' },
      
      // Completed step
      0: {
        style: { backgroundColor: '#4CAF50', color: 'white' },
        classList: { add: 'complete' },
        textContent: '✓ Step 1 (Complete)'
      },
      
      // Current step
      1: {
        style: { backgroundColor: '#2196F3', color: 'white', fontWeight: 'bold' },
        classList: { add: 'current' },
        textContent: '➤ Step 2 (Current)'
      }
    },
    '3': {
      style: { backgroundColor: '#e0e0e0', color: '#757575' },
      
      // Completed steps
      0: {
        style: { backgroundColor: '#4CAF50', color: 'white' },
        textContent: '✓ Step 1'
      },
      1: {
        style: { backgroundColor: '#4CAF50', color: 'white' },
        textContent: '✓ Step 2'
      },
      
      // Current step
      2: {
        style: { backgroundColor: '#2196F3', color: 'white', fontWeight: 'bold' },
        classList: { add: 'current' },
        textContent: '➤ Step 3 (Current)'
      }
    },
    '4': {
      style: { backgroundColor: '#e0e0e0', color: '#757575' },
      
      0: { style: { backgroundColor: '#4CAF50', color: 'white' }, textContent: '✓ Step 1' },
      1: { style: { backgroundColor: '#4CAF50', color: 'white' }, textContent: '✓ Step 2' },
      2: { style: { backgroundColor: '#4CAF50', color: 'white' }, textContent: '✓ Step 3' },
      
      3: {
        style: { backgroundColor: '#2196F3', color: 'white', fontWeight: 'bold' },
        classList: { add: 'current' },
        textContent: '➤ Step 4 (Current)'
      }
    },
    '5': {
      style: { backgroundColor: '#4CAF50', color: 'white' },
      
      0: { textContent: '✓ Step 1' },
      1: { textContent: '✓ Step 2' },
      2: { textContent: '✓ Step 3' },
      3: { textContent: '✓ Step 4' },
      
      // Last step - current
      -1: {
        style: { backgroundColor: '#2196F3', fontWeight: 'bold' },
        classList: { add: 'current' },
        textContent: '➤ Step 5 (Final)'
      }
    }
  },
  '.step'
);

// Navigation
document.getElementById('prev').onclick = () => {
  if (wizard.currentStep > 1) wizard.currentStep--;
};

document.getElementById('next').onclick = () => {
  if (wizard.currentStep < 5) wizard.currentStep++;
};
```

**What happens:**
1. Each step number has its own condition configuration
2. Previous steps show as completed (green)
3. Current step shows as active (blue, bold)
4. Future steps show as upcoming (gray)
5. Navigation automatically updates the entire progress display!

---

## Understanding Index Notation

### Positive Indices

Start from the beginning (0-based):

```javascript
{
  0: { /* first element */ },
  1: { /* second element */ },
  2: { /* third element */ }
}
```

### Negative Indices

Count from the end:

```javascript
{
  -1: { /* last element */ },
  -2: { /* second to last */ },
  -3: { /* third to last */ }
}
```

### Combined Example

```javascript
const items = ['A', 'B', 'C', 'D', 'E'];
// Index:     0    1    2    3    4
// Negative: -5   -4   -3   -2   -1

{
  0: { /* 'A' - first */ },
  1: { /* 'B' - second */ },
  -2: { /* 'D' - second to last */ },
  -1: { /* 'E' - last */ }
}
```

### Why Negative Indices Are Useful

```javascript
// You don't need to know the collection length!
{
  0: { textContent: 'First' },    // Always works
  -1: { textContent: 'Last' }     // Always works
}

// Works whether you have 3, 5, or 100 items!
```

---

## Bulk vs Index-Specific Updates

### How They Work Together

```javascript
{
  // BULK PROPERTIES (applied to ALL elements)
  style: { color: 'blue' },           // All elements
  classList: { add: 'active' },       // All elements
  disabled: false,                    // All elements
  
  // INDEX PROPERTIES (applied to SPECIFIC elements)
  0: {                                // Only first element
    style: { fontWeight: 'bold' }
  },
  -1: {                               // Only last element
    style: { fontStyle: 'italic' }
  }
}
```

### Application Order

1. **Bulk updates apply FIRST** to all elements
2. **Index updates apply AFTER** to specific elements
3. Index updates **override** bulk updates for those elements

**Example:**
```javascript
{
  // Step 1: All buttons get blue color
  style: { color: 'blue' },
  
  // Step 2: First button overrides to red
  0: {
    style: { color: 'red' }
  }
}

// Result:
// Button[0]: red (overridden)
// Button[1]: blue (from bulk)
// Button[2]: blue (from bulk)
```

---

## Advanced Features

### Using with Class/Tag/Name Shortcuts

If you have Collections.ClassName enabled:

```javascript
// Use global shortcuts directly!
Conditions.whenStateCollection(
  () => state.value,
  conditions,
  '.buttons'  // Uses Collections.ClassName.buttons if available
);
```

### Dynamic Conditions

```javascript
const state = Reactive.state({
  mode: 'normal',
  itemCount: 5
});

Conditions.whenStateCollection(
  () => state.mode,
  () => {
    // Generate conditions dynamically
    const config = {
      style: { padding: '10px' }
    };
    
    // Add index-specific updates based on current item count
    for (let i = 0; i < state.itemCount; i++) {
      config[i] = {
        textContent: `Item ${i + 1} of ${state.itemCount}`
      };
    }
    
    return {
      'normal': config,
      'compact': { style: { padding: '5px' } }
    };
  },
  '.items'
);
```

### Fallback to Manual Application

If Collections helper is not available:

```javascript
// Still works - falls back to querySelectorAll
Conditions.whenStateCollection(
  () => state.value,
  conditions,
  '.items'  // Uses document.querySelectorAll as fallback
);
```

---

## Cleanup and Memory Management

### Always Clean Up in Reactive Mode

```javascript
const cleanup = Conditions.whenStateCollection(
  () => state.value,
  conditions,
  '.items'
);

// Later, when done
cleanup.destroy();
```

### Component Integration

```javascript
class CollectionComponent {
  constructor() {
    this.state = Reactive.state({ mode: 'normal' });
    this.cleanups = [];
    
    this.cleanups.push(
      Conditions.whenStateCollection(
        () => this.state.mode,
        conditions,
        '.items'
      )
    );
  }
  
  destroy() {
    this.cleanups.forEach(c => c.destroy());
    this.cleanups = [];
  }
}
```

---

## Common Patterns

### Pattern 1: Header/Footer Styling

```javascript
{
  'styled': {
    // All items
    style: { padding: '10px' },
    
    // Header
    0: {
      style: {
        backgroundColor: '#2196F3',
        color: 'white',
        fontWeight: 'bold'
      }
    },
    
    // Footer
    -1: {
      style: {
        backgroundColor: '#f5f5f5',
        fontStyle: 'italic'
      }
    }
  }
}
```

### Pattern 2: Alternating Row Colors

```javascript
{
  'zebra': {
    // Base style
    style: { padding: '10px' },
    
    // Even rows
    0: { style: { backgroundColor: '#f9f9f9' } },
    2: { style: { backgroundColor: '#f9f9f9' } },
    4: { style: { backgroundColor: '#f9f9f9' } },
    
    // Odd rows
    1: { style: { backgroundColor: '#ffffff' } },
    3: { style: { backgroundColor: '#ffffff' } },
    5: { style: { backgroundColor: '#ffffff' } }
  }
}
```

### Pattern 3: Breadcrumb Trail

```javascript
{
  'active-trail': {
    // All items - inactive state
    style: {
      opacity: '0.5',
      color: '#757575'
    },
    
    // Active items based on current position
    0: { style: { opacity: '1', color: '#2196F3', fontWeight: 'bold' } },
    1: { style: { opacity: '1', color: '#2196F3' } },
    2: { style: { opacity: '1', color: '#2196F3' } }
    // Items 3+ stay at default (inactive)
  }
}
```

### Pattern 4: Priority Indicators

```javascript
{
  'priority-view': {
    // All items
    style: { padding: '10px' },
    
    // High priority (first)
    0: {
      style: {
        borderLeft: '4px solid red',
        backgroundColor: '#ffebee'
      },
      textContent: '🔴 High Priority'
    },
    
    // Medium priority (second)
    1: {
      style: {
        borderLeft: '4px solid orange',
        backgroundColor: '#fff3e0'
      },
      textContent: '🟡 Medium Priority'
    },
    
    // Low priority (rest handled by bulk or specific indices)
  }
}
```

---

## Common Beginner Questions

### Q: What's the difference between `whenStateCollection()` and `whenState()`?

**Answer:**

- **`whenState()`**: Single element or treats collection as whole
- **`whenStateCollection()`**: Collection-aware with bulk + index updates

```javascript
// whenState() - applies same config to each element individually
Conditions.whenState(
  () => state.value,
  {
    'active': { style: { color: 'blue' } }
  },
  '.items'  // Each item gets the same treatment
);

// whenStateCollection() - can target specific indices
Conditions.whenStateCollection(
  () => state.value,
  {
    'active': {
      style: { color: 'blue' },  // All items
      0: { style: { color: 'red' } },  // First item different
      -1: { style: { color: 'green' } }  // Last item different
    }
  },
  '.items'
);
```

---

### Q: Can I use `whenStateCollection()` on a single element?

**Answer:** Yes, but there's no advantage over `whenState()`.

```javascript
// Works, but unnecessary
Conditions.whenStateCollection(
  () => state.value,
  conditions,
  '#single-element'
);

// Better - use whenState()
Conditions.whenState(
  () => state.value,
  conditions,
  '#single-element'
);
```

---

### Q: What happens if an index is out of bounds?

**Answer:** It's safely ignored - no error thrown.

```javascript
const items = document.querySelectorAll('.item');  // Only 3 items

Conditions.whenStateCollection(
  () => state.value,
  {
    'state': {
      0: { textContent: 'First' },   // ✓ Applied
      5: { textContent: 'Sixth' },   // ✗ Ignored (out of bounds)
      -1: { textContent: 'Last' },   // ✓ Applied
      -10: { textContent: 'Way back' }  // ✗ Ignored (out of bounds)
    }
  },
  '.item'
);
```

---

### Q: Can I update the same property in bulk AND index-specific?

**Answer:** Yes! Index-specific updates **override** bulk updates.

```javascript
{
  // All items get blue
  style: { color: 'blue' },
  
  // First item overrides to red
  0: {
    style: { color: 'red' }
  }
}

// Result:
// items[0]: red (overridden)
// items[1]: blue
// items[2]: blue
```

---

### Q: How do I know which keys are bulk vs indexed?

**Answer:** Simple rule:

- **Numeric keys** (0, 1, 2, -1, -2): Index-specific
- **Non-numeric keys** (style, classList, textContent): Bulk

```javascript
{
  style: { /* ... */ },        // BULK (non-numeric)
  classList: { /* ... */ },    // BULK (non-numeric)
  textContent: 'Text',         // BULK (non-numeric)
  
  0: { /* ... */ },            // INDEXED (numeric)
  1: { /* ... */ },            // INDEXED (numeric)
  -1: { /* ... */ }            // INDEXED (numeric)
}
```

---

## Tips and Best Practices

### Tip 1: Use Negative Indices for Flexibility

```javascript
// ✅ Good - works with any length
{
  0: { textContent: 'First' },
  -1: { textContent: 'Last' }
}

// ❌ Bad - breaks if collection length changes
{
  0: { textContent: 'First' },
  4: { textContent: 'Last' }  // Only works if exactly 5 items!
}
```

### Tip 2: Apply Bulk First, Customize After

```javascript
// ✅ Good pattern
{
  // Base styling for all
  style: {
    padding: '10px',
    backgroundColor: '#f5f5f5'
  },
  
  // Then customize specific items
  0: { style: { backgroundColor: '#e3f2fd' } },
  -1: { style: { backgroundColor: '#fff3e0' } }
}
```

### Tip 3: Don't Overdo Index Updates

```javascript
// ❌ Bad - too many specific indices
{
  0: { /* ... */ },
  1: { /* ... */ },
  2: { /* ... */ },
  3: { /* ... */ },
  4: { /* ... */ }
  // At this point, just loop or use different approach!
}

// ✅ Good - only truly special items
{
  style: { /* base style */ },
  0: { /* first special */ },
  -1: { /* last special */ }
}
```

### Tip 4: Document Your Index Strategy

```javascript
/**
 * Wizard steps collection update
 * - Bulk: Base styling for all steps
 * - Index 0: Current step highlight
 * - Negative indices: Completed steps from the end
 */
Conditions.whenStateCollection(
  () => wizard.currentStep,
  stepConditions,
  '.step'
);
```

---

## Summary

### What `whenStateCollection()` Does:

1. ✅ Applies conditions to collections of elements
2. ✅ Supports bulk updates (all elements)
3. ✅ Supports index-specific updates (individual elements)
4. ✅ Handles positive and negative indices
5. ✅ Watches state and updates automatically (reactive)

### When to Use It:

- Working with collections of elements
- Need to style all elements similarly with exceptions
- Want to highlight first/last elements
- Building lists, tables, steps, progress indicators
- Need automatic synchronization across multiple elements

### The Basic Pattern:

```javascript
// 1. Create reactive state
const state = Reactive.state({ mode: 'normal' });

// 2. Set up collection conditions
const cleanup = Conditions.whenStateCollection(
  () => state.mode,  // What to watch
  {
    'mode1': {
      // Bulk updates (apply to all)
      style: { /* ... */ },
      classList: { /* ... */ },
      
      // Index updates (apply to specific)
      0: { /* first element */ },
      1: { /* second element */ },
      -1: { /* last element */ }
    }
  },
  '.items'  // Collection selector
);

// 3. Change state - all elements update automatically!
state.mode = 'mode2';

// 4. Clean up when done
cleanup.destroy();
```

### Quick Decision Guide:

- **Single element?** → Use `whenState()`
- **Collection, same styling for all?** → Use `whenState()`
- **Collection, different styling for some?** → Use `whenStateCollection()`
- **Need to target first/last?** → Use `whenStateCollection()`

---

**Remember:** `whenStateCollection()` is your power tool for managing collections with both shared and individual styling. Use bulk updates for consistency and index updates for special cases. Negative indices make your code flexible and robust! 🎉