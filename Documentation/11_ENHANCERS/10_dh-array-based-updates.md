# Array-Based Updates Module - Available Methods

This module provides **array distribution support** for DOM collections, allowing you to update multiple elements with different values in a single operation. It's the **core engine** that powers array-based updates throughout the DOM Helpers ecosystem.

---

## 🎯 **What This Module Does**

```javascript
// ❌ Without Array Updates:
document.querySelectorAll('.item').forEach((el, i) => {
  el.textContent = items[i];
  el.style.color = colors[i];
  el.dataset.index = i;
});

// ✅ With Array Updates:
querySelectorAll('.item').update({
  textContent: items,
  style: { color: colors },
  dataset: { index: [0, 1, 2, 3, 4] }
});
```

**Key Feature:** Automatically distributes array values across collections, making bulk updates with unique values per element incredibly simple.

---

## 📋 **Core API Methods**

### 1. **`collection.update(config)`** (Enhanced Method)

The primary way to use array-based updates. This method is **automatically added** to all collections returned by query functions.

```javascript
// Get a collection (automatically enhanced)
const items = querySelectorAll('.item');

// Update with arrays - each element gets its own value
items.update({
  textContent: ['Item 1', 'Item 2', 'Item 3'],
  style: {
    color: ['red', 'blue', 'green'],
    fontSize: ['14px', '16px', '18px']
  },
  classList: {
    add: ['class-a', 'class-b', 'class-c']
  }
});

// Also works with DOM Helper shortcuts
ClassName.item.update({
  textContent: ['A', 'B', 'C']
});

TagName.div.update({
  style: {
    backgroundColor: ['#f00', '#0f0', '#00f']
  }
});
```

**Parameters:**
- `config` (Object): Configuration object with properties to update
  - Can contain arrays (distributed) or single values (bulk)
  - Supports nested objects (style, dataset, classList)

**Returns:** `collection` (chainable)

**Auto-Enhancement:** Works with:
- `querySelectorAll()` / `queryAll()`
- `Selector.queryAll()`
- `Collections.ClassName` / `Collections.TagName` / `Collections.Name`
- Global shortcuts: `ClassName.*` / `TagName.*` / `Name.*`

---

### 2. **`ArrayBasedUpdates.enhance(collection)`**

Manually enhance a collection with array update support.

```javascript
// Get a raw collection
const items = document.querySelectorAll('.item');

// Manually enhance it
const enhanced = ArrayBasedUpdates.enhance(items);

// Now it has array update support
enhanced.update({
  textContent: ['A', 'B', 'C']
});

// Or use the shorthand
ArrayBasedUpdates.enhance(document.querySelectorAll('.item')).update({
  style: { color: ['red', 'blue', 'green'] }
});
```

**Parameters:**
- `collection` (NodeList|HTMLCollection|Array): Collection to enhance

**Returns:** Enhanced collection with `.update()` method

**Use Case:** When you need to manually enhance collections that weren't auto-patched

---

### 3. **`ArrayBasedUpdates.applyArrayBasedUpdates(collection, updates)`**

Low-level function to apply array-based updates directly.

```javascript
const items = document.querySelectorAll('.item');

// Apply updates directly without using .update()
ArrayBasedUpdates.applyArrayBasedUpdates(items, {
  textContent: ['First', 'Second', 'Third'],
  style: {
    color: ['red', 'blue', 'green']
  }
});

// Same as items.update() but can be used programmatically
```

**Parameters:**
- `collection` (NodeList|HTMLCollection|Array): Target elements
- `updates` (Object): Update configuration

**Returns:** `collection`

**Use Case:** Direct programmatic access, testing, or when you need explicit control

---

### 4. **`ArrayBasedUpdates.hasSupport(collection)`**

Check if a collection has array update support enabled.

```javascript
const items1 = querySelectorAll('.item');      // Auto-enhanced
const items2 = document.querySelectorAll('.item'); // Not enhanced (if loaded after)

console.log(ArrayBasedUpdates.hasSupport(items1)); // true
console.log(ArrayBasedUpdates.hasSupport(items2)); // false

// Enhance if needed
if (!ArrayBasedUpdates.hasSupport(items2)) {
  ArrayBasedUpdates.enhance(items2);
}
```

**Parameters:**
- `collection` (any): Collection to check

**Returns:** `boolean`

**Use Case:** Conditional enhancement, debugging, testing

---

### 5. **`ArrayBasedUpdates.containsArrayValues(config)`**

Check if a configuration object contains any array values.

```javascript
const config1 = {
  textContent: 'Same for all',
  style: { color: 'red' }
};

const config2 = {
  textContent: ['Different', 'For', 'Each'],
  style: { color: 'red' }
};

console.log(ArrayBasedUpdates.containsArrayValues(config1)); // false
console.log(ArrayBasedUpdates.containsArrayValues(config2)); // true

// Detects nested arrays
const config3 = {
  style: {
    color: ['red', 'blue', 'green'] // Nested array
  }
};

console.log(ArrayBasedUpdates.containsArrayValues(config3)); // true
```

**Parameters:**
- `config` (Object): Configuration to check

**Returns:** `boolean`

**Use Case:** Optimize update logic, conditional processing, debugging

---

### 6. **`ArrayBasedUpdates.getValueForIndex(value, elementIndex, totalElements)`**

Get the appropriate value for a specific element index.

```javascript
const colors = ['red', 'blue', 'green'];

// Element 0 (of 5 total)
console.log(ArrayBasedUpdates.getValueForIndex(colors, 0, 5)); // 'red'

// Element 1 (of 5 total)
console.log(ArrayBasedUpdates.getValueForIndex(colors, 1, 5)); // 'blue'

// Element 2 (of 5 total)
console.log(ArrayBasedUpdates.getValueForIndex(colors, 2, 5)); // 'green'

// Element 3 (of 5 total) - repeats last value
console.log(ArrayBasedUpdates.getValueForIndex(colors, 3, 5)); // 'green'

// Element 4 (of 5 total) - repeats last value
console.log(ArrayBasedUpdates.getValueForIndex(colors, 4, 5)); // 'green'

// Non-array values pass through
console.log(ArrayBasedUpdates.getValueForIndex('static', 0, 5)); // 'static'
console.log(ArrayBasedUpdates.getValueForIndex('static', 2, 5)); // 'static'
```

**Parameters:**
- `value` (any): Value (array or static)
- `elementIndex` (number): Current element's index
- `totalElements` (number): Total number of elements

**Returns:** Appropriate value for this index

**Use Case:** Building custom array distribution logic, understanding distribution behavior

---

### 7. **`ArrayBasedUpdates.processUpdatesForElement(updates, elementIndex, totalElements)`**

Process an entire updates object for a specific element index.

```javascript
const updates = {
  textContent: ['A', 'B', 'C'],
  style: {
    color: ['red', 'blue', 'green'],
    fontSize: '16px' // Static value
  },
  classList: {
    add: ['class-a', 'class-b', 'class-c']
  }
};

// Get updates for element 0 (of 3 total)
const updates0 = ArrayBasedUpdates.processUpdatesForElement(updates, 0, 3);
console.log(updates0);
// {
//   textContent: 'A',
//   style: { color: 'red', fontSize: '16px' },
//   classList: { add: 'class-a' }
// }

// Get updates for element 1 (of 3 total)
const updates1 = ArrayBasedUpdates.processUpdatesForElement(updates, 1, 3);
console.log(updates1);
// {
//   textContent: 'B',
//   style: { color: 'blue', fontSize: '16px' },
//   classList: { add: 'class-b' }
// }
```

**Parameters:**
- `updates` (Object): Configuration with array values
- `elementIndex` (number): Current element's index
- `totalElements` (number): Total number of elements

**Returns:** Processed configuration for this element

**Use Case:** Understanding how arrays are distributed, custom processing logic

---

### 8. **`ArrayBasedUpdates.initialize()` / `reinitialize()`**

Force re-initialization of array update patching.

```javascript
// Manually re-initialize (useful if modules loaded in unusual order)
ArrayBasedUpdates.reinitialize();

// Or use initialize (same function)
ArrayBasedUpdates.initialize();

// Output:
// [Array Updates] Initializing with retry logic...
// [Array Updates] ✓ Patched Selector.queryAll
// [Array Updates] ✓ Patched querySelectorAll
// [Array Updates] ✓ Patched queryAll
// [Array Updates] ✓✓✓ Initialization complete - 8 systems patched
```

**Returns:** `boolean` - true if patches applied successfully

**Use Case:** Debugging load order issues, forcing re-patch after dynamic module loading

---

## 🎨 **Array Distribution Modes**

### Mode 1: Pure Array Distribution
When **all values are arrays**, each element gets its corresponding value:

```javascript
querySelectorAll('.item').update({
  textContent: ['Item 1', 'Item 2', 'Item 3'],
  style: {
    color: ['red', 'blue', 'green'],
    fontSize: ['14px', '16px', '18px']
  }
});

// Element 0: textContent='Item 1', color='red', fontSize='14px'
// Element 1: textContent='Item 2', color='blue', fontSize='16px'
// Element 2: textContent='Item 3', color='green', fontSize='18px'
```

---

### Mode 2: Mixed Array + Bulk
Mix arrays (distributed) with static values (applied to all):

```javascript
querySelectorAll('.item').update({
  textContent: ['A', 'B', 'C'],           // Array: distributed
  classList: { add: 'active' },           // Static: all elements
  style: {
    color: ['red', 'blue', 'green'],      // Array: distributed
    fontWeight: 'bold',                   // Static: all elements
    padding: '10px'                       // Static: all elements
  }
});

// All elements get: classList.add('active'), fontWeight='bold', padding='10px'
// Each element gets unique: textContent and color
```

---

### Mode 3: Pure Bulk Update
When **no arrays present**, bulk update all elements with same values:

```javascript
querySelectorAll('.item').update({
  classList: { add: 'highlight' },
  style: {
    backgroundColor: 'yellow',
    fontWeight: 'bold'
  }
});

// All elements get identical updates (optimized bulk operation)
```

---

### Mode 4: Index-Based Updates
Use numeric keys for index-specific updates:

```javascript
querySelectorAll('.item').update({
  // Array distribution for all
  textContent: ['A', 'B', 'C', 'D'],
  
  // Index-specific overrides
  0: {
    style: { fontWeight: 'bold' }
  },
  2: {
    classList: { add: 'special' }
  },
  '-1': { // Last element (negative indexing)
    style: { color: 'red' }
  }
});

// Element 0: textContent='A', fontWeight='bold'
// Element 1: textContent='B'
// Element 2: textContent='C', classList.add('special')
// Element 3: textContent='D', color='red'
```

---

## 💡 **Usage Examples**

### Example 1: Simple List Items
```javascript
// HTML: <div class="item"></div> × 5

querySelectorAll('.item').update({
  textContent: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
  style: {
    color: ['#e74c3c', '#f39c12', '#e91e63', '#9b59b6', '#3498db'],
    padding: '10px',
    margin: '5px',
    borderRadius: '5px'
  }
});

// Result: 5 colorful fruit labels
```

---

### Example 2: Progress Bars
```javascript
const percentages = [30, 50, 80, 45, 90];

querySelectorAll('.progress-bar').update({
  style: {
    width: percentages.map(p => `${p}%`),
    backgroundColor: percentages.map(p => 
      p < 40 ? '#e74c3c' :
      p < 70 ? '#f39c12' : '#2ecc71'
    ),
    transition: 'width 0.5s ease'
  },
  textContent: percentages.map(p => `${p}%`),
  setAttribute: {
    'aria-valuenow': percentages
  }
});
```

---

### Example 3: Table Row Styling
```javascript
const rowCount = 10;

querySelectorAll('.table-row').update({
  style: {
    backgroundColor: Array.from({ length: rowCount }, (_, i) => 
      i % 2 === 0 ? '#f8f9fa' : '#ffffff'
    )
  },
  dataset: {
    rowIndex: Array.from({ length: rowCount }, (_, i) => i)
  }
});
```

---

### Example 4: Dynamic Card Grid
```javascript
const cards = [
  { icon: '🍎', title: 'Apple', color: '#ff6b6b' },
  { icon: '🍌', title: 'Banana', color: '#ffe66d' },
  { icon: '🍒', title: 'Cherry', color: '#e74c3c' },
  { icon: '🍇', title: 'Grape', color: '#9b59b6' }
];

querySelectorAll('.card').update({
  innerHTML: cards.map(c => `
    <div class="icon">${c.icon}</div>
    <h3>${c.title}</h3>
  `),
  style: {
    borderColor: cards.map(c => c.color),
    backgroundColor: cards.map(c => c.color + '20')
  }
});
```

---

### Example 5: Form Validation States
```javascript
const fields = ['email', 'password', 'confirm'];
const isValid = [true, false, false];

querySelectorAll('.form-field').update({
  classList: {
    add: isValid.map(v => v ? 'is-valid' : 'is-invalid')
  },
  style: {
    borderColor: isValid.map(v => v ? '#2ecc71' : '#e74c3c')
  },
  setAttribute: {
    'aria-invalid': isValid.map(v => !v)
  }
});
```

---

### Example 6: Animated Sequence
```javascript
querySelectorAll('.animation-item').update({
  style: {
    animation: [
      'fadeIn 1s ease-in-out',
      'fadeIn 1s ease-in-out 0.2s',
      'fadeIn 1s ease-in-out 0.4s',
      'fadeIn 1s ease-in-out 0.6s',
      'fadeIn 1s ease-in-out 0.8s'
    ],
    opacity: 0 // Start hidden
  }
});
```

---

### Example 7: Priority Badges
```javascript
const priorities = ['high', 'medium', 'low', 'high', 'medium'];
const colors = {
  high: '#e74c3c',
  medium: '#f39c12',
  low: '#95a5a6'
};

querySelectorAll('.priority-badge').update({
  textContent: priorities.map(p => p.toUpperCase()),
  style: {
    backgroundColor: priorities.map(p => colors[p]),
    color: 'white',
    padding: '5px 10px',
    borderRadius: '3px'
  },
  dataset: {
    priority: priorities
  }
});
```

---

### Example 8: Chart Data Points
```javascript
const dataPoints = [10, 25, 18, 40, 32, 45, 38];

querySelectorAll('.data-point').update({
  style: {
    height: dataPoints.map(v => `${v}px`),
    backgroundColor: dataPoints.map(v => 
      `hsl(${v * 5}, 70%, 50%)`
    ),
    transform: dataPoints.map((v, i) => 
      `translateX(${i * 50}px)`
    )
  },
  textContent: dataPoints,
  dataset: {
    value: dataPoints
  }
});
```

---

### Example 9: Countdown Timer
```javascript
const seconds = 125;
const digits = String(seconds).padStart(3, '0').split('');

querySelectorAll('.timer-digit').update({
  textContent: digits,
  style: {
    fontSize: '48px',
    color: seconds < 10 ? '#e74c3c' : '#333',
    animation: seconds < 10 ? 'pulse 1s infinite' : 'none'
  }
});
```

---

### Example 10: Status Indicators
```javascript
const statuses = ['online', 'away', 'busy', 'offline'];
const statusConfig = {
  online: { color: '#2ecc71', icon: '●' },
  away: { color: '#f39c12', icon: '◐' },
  busy: { color: '#e74c3c', icon: '⚠' },
  offline: { color: '#95a5a6', icon: '○' }
};

querySelectorAll('.status-indicator').update({
  textContent: statuses.map(s => statusConfig[s].icon),
  style: {
    color: statuses.map(s => statusConfig[s].color),
    fontSize: '20px'
  },
  setAttribute: {
    'aria-label': statuses,
    'title': statuses.map(s => s.toUpperCase())
  },
  dataset: {
    status: statuses
  }
});
```

---

## 🔧 **Advanced Features**

### Feature 1: Nested Array Distribution
```javascript
querySelectorAll('.item').update({
  style: {
    // Level 1: style object
    color: ['red', 'blue', 'green'],
    backgroundColor: ['#fdd', '#ddf', '#dfd'],
    border: '1px solid',
    borderColor: ['#f00', '#00f', '#0f0']
  },
  dataset: {
    // Level 1: dataset object
    id: ['item-1', 'item-2', 'item-3'],
    type: ['type-a', 'type-b', 'type-c']
  }
});

// Arrays at any nesting level are distributed correctly
```

---

### Feature 2: classList Array Operations
```javascript
querySelectorAll('.item').update({
  classList: {
    add: [
      ['class-a1', 'class-a2'],      // Element 0 gets both classes
      ['class-b1'],                   // Element 1 gets one class
      ['class-c1', 'class-c2', 'class-c3'] // Element 2 gets three classes
    ],
    remove: ['old-class'],            // Remove from all (static)
    toggle: ['toggle-1', 'toggle-2', 'toggle-3'] // Toggle per element
  }
});
```

---

### Feature 3: Dynamic Array Generation
```javascript
const count = 10;

querySelectorAll('.item').update({
  textContent: Array.from({ length: count }, (_, i) => `Item ${i + 1}`),
  style: {
    backgroundColor: Array.from({ length: count }, (_, i) => 
      `hsl(${i * (360 / count)}, 70%, 80%)`
    )
  },
  dataset: {
    index: Array.from({ length: count }, (_, i) => i),
    position: Array.from({ length: count }, (_, i) => 
      i === 0 ? 'first' : 
      i === count - 1 ? 'last' : 'middle'
    )
  }
});
```

---

### Feature 4: Computed Arrays
```javascript
const baseValue = 100;
const multipliers = [1, 1.5, 2, 2.5, 3];

querySelectorAll('.item').update({
  textContent: multipliers.map(m => `$${baseValue * m}`),
  style: {
    fontSize: multipliers.map(m => `${12 + m * 2}px`),
    opacity: multipliers.map(m => Math.min(m / 3, 1))
  },
  dataset: {
    value: multipliers.map(m => baseValue * m)
  }
});
```

---

### Feature 5: Conditional Arrays
```javascript
const values = [10, 25, 30, 45, 60];
const threshold = 40;

querySelectorAll('.item').update({
  classList: {
    add: values.map(v => v >= threshold ? 'high' : 'low')
  },
  style: {
    color: values.map(v => v >= threshold ? 'green' : 'red'),
    fontWeight: values.map(v => v >= threshold ? 'bold' : 'normal')
  },
  textContent: values.map(v => 
    v >= threshold ? `✓ ${v}` : `✗ ${v}`
  )
});
```

---

### Feature 6: Array Chaining
```javascript
querySelectorAll('.item')
  .update({
    textContent: ['A', 'B', 'C']
  })
  .update({
    style: { color: ['red', 'blue', 'green'] }
  })
  .update({
    classList: { add: ['class-1', 'class-2', 'class-3'] }
  });

// Multiple updates chain together
// Each preserves previous updates
```

---

### Feature 7: Index Override with Arrays
```javascript
querySelectorAll('.item').update({
  // Base array distribution
  textContent: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
  style: {
    color: ['red', 'blue', 'green', 'orange']
  },
  
  // Override specific indices
  0: {
    style: {
      fontWeight: 'bold',
      fontSize: '20px'
    }
  },
  '-1': {
    classList: { add: 'last' }
  }
});

// Arrays apply to all, then index overrides apply
```

---

## 🎯 **Supported Properties**

### Direct Properties
```javascript
{
  textContent: ['Text 1', 'Text 2', 'Text 3'],
  innerHTML: ['<b>HTML 1</b>', '<b>HTML 2</b>', '<b>HTML 3</b>'],
  value: ['Value 1', 'Value 2', 'Value 3'],
  id: ['id-1', 'id-2', 'id-3'],
  title: ['Title 1', 'Title 2', 'Title 3'],
  placeholder: ['Hint 1', 'Hint 2', 'Hint 3'],
  disabled: [false, false, true],
  checked: [true, false, false]
}
```

---

### Style Object
```javascript
{
  style: {
    color: ['red', 'blue', 'green'],
    fontSize: ['14px', '16px', '18px'],
    backgroundColor: ['#f00', '#0f0', '#00f'],
    padding: ['5px', '10px', '15px'],
    margin: '10px', // Static (all elements)
    display: ['block', 'inline-block', 'flex'],
    transform: [
      'rotate(0deg)',
      'rotate(45deg)',
      'rotate(90deg)'
    ]
  }
}
```

---

### classList Operations
```javascript
{
  classList: {
    add: ['class1', 'class2', 'class3'],
    remove: ['old1', 'old2', 'old3'],
    toggle: ['toggle1', 'toggle2', 'toggle3'],
    
    // Or nested arrays for multiple classes per element
    add: [
      ['class-a1', 'class-a2'],
      ['class-b1'],
      ['class-c1', 'class-c2']
    ]
  }
}
```

---

### Dataset
```javascript
{
  dataset: {
    id: ['id-1', 'id-2', 'id-3'],
    type: ['type-a', 'type-b', 'type-c'],
    value: [100, 200, 300],
    active: [true, false, true]
  }
}
```

---

### Attributes
```javascript
{
  setAttribute: {
    'aria-label': ['Label 1', 'Label 2', 'Label 3'],
    'data-index': [0, 1, 2],
    'disabled': [false, false, true]
  }
}
```

---

## 🔍 **How It Works**

### 1. Auto-Enhancement
When you load this module, it automatically patches query functions:

```javascript
// These functions are automatically patched:
- window.querySelectorAll()
- window.queryAll() (if exists)
- Selector.queryAll() (if exists)
- Collections.ClassName / TagName / Name (if exist)
- Global shortcuts: ClassName.* / TagName.* / Name.* (if exist)

// After patching, all returned collections have .update() with array support
```

---

### 2. Detection Logic
```javascript
function update(config) {
  // Step 1: Check for numeric indices (index-based updates)
  if (hasNumericIndices(config)) {
    return applyIndexBased(config);
  }
  
  // Step 2: Check for array values
  if (containsArrayValues(config)) {
    return applyArrayDistribution(config);
  }
  
  // Step 3: Bulk update (no arrays)
  return applyBulkUpdate(config);
}
```

---

### 3. Array Distribution Algorithm
```javascript
// For each element in collection:
elements.forEach((element, index) => {
  // Process config for this specific index
  const elementConfig = processUpdatesForElement(config, index, total);
  
  // Apply to element
  applyToElement(element, elementConfig);
});

// Where processUpdatesForElement:
// - Extracts value at [index] from arrays
// - Repeats last value if index >= array.length
// - Passes through non-array values unchanged
// - Recursively processes nested objects
```

---

### 4. Value Distribution Rules
```javascript
function getValueForIndex(value, index, total) {
  // Non-array: return as-is (static)
  if (!Array.isArray(value)) {
    return value;
  }
  
  // Within bounds: use array value
  if (index < value.length) {
    return value[index];
  }
  
  // Beyond bounds: repeat last value
  return value[value.length - 1];
}

// Examples:
// Array: [A, B, C], Index: 0 → A
// Array: [A, B, C], Index: 1 → B
// Array: [A, B, C], Index: 2 → C
// Array: [A, B, C], Index: 3 → C (repeat)
// Array: [A, B, C], Index: 4 → C (repeat)
// Static: "X", Index: any → "X"
```

---

## ⚙️ **Integration with Other Systems**

### With DOM Helpers
```javascript
// All DOM Helper methods return enhanced collections
ClassName.item.update({
  textContent: ['A', 'B', 'C']
});

TagName.div.update({
  style: { color: ['red', 'blue', 'green'] }
});

Selector.queryAll('.item').update({
  dataset: { index: [0, 1, 2] }
});
```

---

### With Conditions Module
```javascript
// Conditions automatically uses array distribution
Conditions.apply('active', {
  'active': {
    textContent: ['Item 1', 'Item 2', 'Item 3'],
    style: {
      color: ['red', 'blue', 'green']
    }
  }
}, '.items');
```

---

### With Reactive State
```javascript
const items = state(['Apple', 'Banana', 'Cherry']);
const colors = state(['red', 'yellow', 'pink']);

// Reactive updates with arrays
effect(() => {
  querySelectorAll('.item').update({
    textContent: items.value,
    style: {
      color: colors.value
    }
  });
});

// Change triggers re-distribution
items.value = ['Dog', 'Cat', 'Bird', 'Fish'];
colors.value = ['brown', 'gray', 'blue', 'orange'];
```

---

## 🐛 **Debugging & Testing**

### Check if Collection is Enhanced
```javascript
const items = querySelectorAll('.item');

// Method 1: Check for support
console.log(ArrayBasedUpdates.hasSupport(items)); // true/false

// Method 2: Check for flag
console.log(items._hasArrayUpdateSupport); // true/false

// Method 3: Check for method
console.log(typeof items.update === 'function'); // true/false
```

---

### Test Array Distribution
```javascript
const testConfig = {
  textContent: ['A', 'B', 'C'],
  style: {
    color: ['red', 'blue', 'green'],
    padding: '10px'
  }
};

// Check if contains arrays
console.log(ArrayBasedUpdates.containsArrayValues(testConfig)); // true

// Process for specific index
const config0 = ArrayBasedUpdates.processUpdatesForElement(testConfig, 0, 3);
console.log(config0);
// { textContent: 'A', style: { color: 'red', padding: '10px' } }

const config1 = ArrayBasedUpdates.processUpdatesForElement(testConfig, 1, 3);
console.log(config1);
// { textContent: 'B', style: { color: 'blue', padding: '10px' } }
```

---

### Manual Enhancement Test
```javascript
// Get raw collection
const raw = document.querySelectorAll('.item');
console.log(ArrayBasedUpdates.hasSupport(raw)); // false

// Enhance manually
const enhanced = ArrayBasedUpdates.enhance(raw);
console.log(ArrayBasedUpdates.hasSupport(enhanced)); // true

// Test array update
enhanced.update({
  textContent: ['Test 1', 'Test 2', 'Test 3']
});
```

---

### Re-initialization Test
```javascript
// Force re-patch (useful if modules loaded in wrong order)
const patchCount = ArrayBasedUpdates.reinitialize();
console.log(`Applied ${patchCount} patches`);

// Check what's patched
console.log('[Array Updates] Systems patched:');
console.log('- Selector.queryAll:', typeof Selector?.queryAll === 'function');
console.log('- window.querySelectorAll:', typeof querySelectorAll === 'function');
console.log('- window.queryAll:', typeof queryAll === 'function');
console.log('- Collections.ClassName:', !!Collections?.ClassName);
```

---

## ⚠️ **Important Notes**

### 1. Load Order Matters
```javascript
// ✅ Correct order:
// 1. Load Array-Based Updates
// 2. Load DOM Helpers / Collections
// 3. Use enhanced collections

// ⚠️ If loaded after DOM Helpers:
// - Auto-patching happens with retry logic (100ms delay)
// - Or manually reinitialize: ArrayBasedUpdates.reinitialize()
// - Or manually enhance: ArrayBasedUpdates.enhance(collection)
```

---

### 2. Array Length Mismatches
```javascript
// More elements than array values
querySelectorAll('.item').update({
  textContent: ['A', 'B']
}); // 5 elements

// Result: 'A', 'B', 'B', 'B', 'B' (last value repeats)

// More array values than elements
querySelectorAll('.item').update({
  textContent: ['A', 'B', 'C', 'D', 'E']
}); // 2 elements

// Result: 'A', 'B' (extra values ignored)
```

---

### 3. Performance Considerations
```javascript
// ⚡ Optimized: No arrays = bulk operation
querySelectorAll('.item').update({
  classList: { add: 'active' }
}); // Fast: bulk update

// ⚡ Standard: With arrays = individual processing
querySelectorAll('.item').update({
  textContent: ['A', 'B', 'C']
}); // Standard: processes each element

// ⚠️ For very large collections (1000+ elements):
// Consider chunking or virtualizing
```

---

### 4. Numeric Index Priority
```javascript
// Numeric indices override array distribution
querySelectorAll('.item').update({
  textContent: ['A', 'B', 'C'], // Array distribution
  
  0: {
    textContent: 'FIRST' // Override element 0
  }
});

// Result: 'FIRST', 'B', 'C'
// Index-based updates have priority over arrays
```

---

### 5. Type Preservation
```javascript
// Arrays are distributed, not converted to strings
{
  dataset: {
    values: ['a', 'b', 'c'] // ✅ Distributed: 'a', 'b', 'c'
  }
}

// vs

{
  dataset: {
    values: 'a,b,c' // ✅ Bulk: all get 'a,b,c' string
  }
}

// Arrays stay arrays during processing
```

---

## 📊 **Module Information**

```javascript
// Access module object
console.log(ArrayBasedUpdates);

// Check version
console.log(ArrayBasedUpdates.version); // '1.1.0-fixed'

// Available methods
console.log(Object.keys(ArrayBasedUpdates));
// [
//   'applyArrayBasedUpdates',
//   'processUpdatesForElement',
//   'getValueForIndex',
//   'isDistributableArray',
//   'containsArrayValues',
//   'enhanceCollectionWithArrayUpdates',
//   'createEnhancedUpdateMethod',
//   'initialize',
//   'reinitialize',
//   'hasSupport',
//   'enhance'
// ]

// Check global export
console.log(window.ArrayBasedUpdates === ArrayBasedUpdates); // true

// Check DOM Helpers integration
console.log(window.DOMHelpers?.ArrayBasedUpdates === ArrayBasedUpdates); // true (if DOM Helpers loaded)
```

---

## 🚀 **Getting Started**

```javascript
// 1. Load the module
// <script src="10_dh-array-based-updates.js"></script>

// 2. Auto-enhancement is active immediately
const items = querySelectorAll('.item');

// 3. Use arrays in .update()
items.update({
  textContent: ['Item 1', 'Item 2', 'Item 3'],
  style: {
    color: ['red', 'blue', 'green']
  }
});

// 4. That's it! ✨
```

---

## 🎯 **Key Features**

1. ✅ **Automatic patching** - Query functions enhanced on load
2. ✅ **Array distribution** - Each element gets its value
3. ✅ **Last value repeats** - Handles length mismatches
4. ✅ **Mixed arrays + static** - Combine distribution with bulk
5. ✅ **Nested support** - Arrays work in style, dataset, etc.
6. ✅ **classList arrays** - Distribute class operations
7. ✅ **Manual enhancement** - `enhance()` for raw collections
8. ✅ **Index overrides** - Combine with index-specific updates
9. ✅ **Performance optimized** - Bulk mode when no arrays
10. ✅ **Retry logic** - Auto re-patch after DOM ready

---

This module is the **foundation** for all array-based updates in the DOM Helpers ecosystem! 🎨✨