# Conditions Array Support Module - Available Methods

This module extends the **Conditions system** with **array distribution support**, allowing you to distribute array values across multiple elements in a collection. When you have 5 elements and provide an array of 5 values, each element gets its corresponding value from the array.

---

## 🎯 **What This Module Does**

```javascript
// ❌ Without Array Support:
// All elements get the same value
Conditions.apply('active', {
  'active': { textContent: 'Item' }
}, '.items'); // All show "Item"

// ✅ With Array Support:
// Each element gets its own value from the array
Conditions.apply('active', {
  'active': { textContent: ['Item A', 'Item B', 'Item C'] }
}, '.items'); // Shows "Item A", "Item B", "Item C"
```

**Key Feature:** Automatically detects when configuration contains arrays and distributes values across the collection intelligently.

---

## 📋 **Core API Methods**

### 1. **Enhanced `Conditions.apply()`** (Automatic)

The module **automatically enhances** `Conditions.apply()` to support array distribution. No API changes needed!

```javascript
// Standard usage with arrays
Conditions.apply(
  'visible',
  {
    'visible': {
      textContent: ['First', 'Second', 'Third'],
      style: {
        color: ['red', 'blue', 'green'],
        fontSize: ['14px', '16px', '18px']
      }
    }
  },
  '.list-items'
);

// Each element gets its corresponding value:
// Element 0: textContent="First", color="red", fontSize="14px"
// Element 1: textContent="Second", color="blue", fontSize="16px"
// Element 2: textContent="Third", color="green", fontSize="18px"
```

**How It Works:**
- Detects arrays in configuration automatically
- Distributes values by index: `element[i]` gets `array[i]`
- Last value repeats if array is shorter than collection
- Non-array properties apply to all elements

---

### 2. **`Conditions.applyWithArrays(elements, config)`**

Manual control over array distribution without condition matching.

```javascript
// Get elements manually
const items = document.querySelectorAll('.item');

// Apply array-based config directly
Conditions.applyWithArrays(items, {
  textContent: ['Apple', 'Banana', 'Cherry'],
  style: {
    backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d']
  },
  dataset: {
    fruit: ['apple', 'banana', 'cherry']
  }
});
```

**Parameters:**
- `elements` (NodeList|HTMLCollection|Array): Target elements
- `config` (Object): Configuration with array values

**Returns:** `undefined`

**Use Case:** When you need array distribution without condition matching

---

### 3. **`Conditions.hasArrayValues(config)`**

Check if a configuration object contains any array values.

```javascript
const config1 = {
  textContent: 'Hello',
  style: { color: 'red' }
};

const config2 = {
  textContent: ['A', 'B', 'C'],
  style: { color: 'red' }
};

console.log(Conditions.hasArrayValues(config1)); // false
console.log(Conditions.hasArrayValues(config2)); // true (textContent is array)

// Detects nested arrays
const config3 = {
  style: {
    color: ['red', 'blue', 'green'] // Nested array
  }
};

console.log(Conditions.hasArrayValues(config3)); // true
```

**Parameters:**
- `config` (Object): Configuration to check

**Returns:** `boolean`

---

### 4. **`Conditions.restoreArraySupport()`**

Restore original `Conditions.apply()` behavior (for debugging/testing).

```javascript
// Temporarily disable array support
Conditions.restoreArraySupport();

// Array distribution disabled, back to original behavior
Conditions.apply('active', {
  'active': { textContent: ['A', 'B', 'C'] }
}, '.items'); // All elements might show ["A", "B", "C"] as string

// Re-enable by reloading the module
```

**Returns:** `undefined`

**Use Case:** Debugging or testing original behavior

---

## 🎨 **Array Distribution Rules**

### Rule 1: Index Mapping
```javascript
// 3 elements, 3 values
Conditions.apply('show', {
  'show': { textContent: ['First', 'Second', 'Third'] }
}, '.items');

// Element 0 → 'First'
// Element 1 → 'Second'
// Element 2 → 'Third'
```

---

### Rule 2: Last Value Repeats
```javascript
// 5 elements, 3 values
Conditions.apply('show', {
  'show': { textContent: ['A', 'B', 'C'] }
}, '.items');

// Element 0 → 'A'
// Element 1 → 'B'
// Element 2 → 'C'
// Element 3 → 'C' (repeats last)
// Element 4 → 'C' (repeats last)
```

---

### Rule 3: Mixed Arrays and Static Values
```javascript
Conditions.apply('active', {
  'active': {
    textContent: ['Item 1', 'Item 2', 'Item 3'], // Array (distributed)
    classList: { add: 'active' },                // Static (all elements)
    style: {
      color: ['red', 'blue', 'green'],          // Array (distributed)
      fontWeight: 'bold'                         // Static (all elements)
    }
  }
}, '.items');

// All elements get: classList.add('active'), fontWeight='bold'
// Each element gets unique: textContent and color
```

---

### Rule 4: Nested Object Arrays
```javascript
Conditions.apply('visible', {
  'visible': {
    style: {
      color: ['red', 'blue', 'green'],
      fontSize: ['12px', '14px', '16px'],
      fontWeight: 'bold' // Static nested property
    }
  }
}, '.items');

// Each element gets unique color and fontSize
// All elements get fontWeight: 'bold'
```

---

### Rule 5: classList Arrays
```javascript
Conditions.apply('styled', {
  'styled': {
    classList: {
      add: [
        ['class-a1', 'class-a2'],    // Element 0 gets both
        ['class-b1'],                 // Element 1 gets one
        ['class-c1', 'class-c2', 'class-c3'] // Element 2 gets three
      ]
    }
  }
}, '.items');

// Each element gets its own set of classes
```

---

### Rule 6: Dataset Arrays
```javascript
Conditions.apply('data', {
  'data': {
    dataset: {
      id: ['item-1', 'item-2', 'item-3'],
      type: ['type-a', 'type-b', 'type-c']
    }
  }
}, '.items');

// Element 0: data-id="item-1", data-type="type-a"
// Element 1: data-id="item-2", data-type="type-b"
// Element 2: data-id="item-3", data-type="type-c"
```

---

## 💡 **Usage Examples**

### Example 1: Dynamic List Items
```javascript
const items = state(['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']);
const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'];

Conditions.whenState(
  () => items.value.length > 0 ? 'visible' : 'hidden',
  {
    'visible': {
      textContent: items.value,
      style: {
        backgroundColor: colors,
        padding: '10px',
        margin: '5px',
        borderRadius: '5px'
      },
      dataset: {
        index: items.value.map((_, i) => i),
        fruit: items.value.map(f => f.toLowerCase())
      }
    },
    'hidden': {
      style: { display: 'none' }
    }
  },
  '.fruit-items'
);

// Result: 5 fruit items, each with unique text, color, and data attributes
```

---

### Example 2: Progress Steps
```javascript
const currentStep = state(2);
const steps = ['Start', 'Process', 'Review', 'Complete'];

Conditions.whenState(
  () => currentStep.value,
  {
    // For each step number, show appropriate styles
    '>=0': {
      textContent: steps,
      classList: {
        add: steps.map((_, i) => 
          i < currentStep.value ? 'completed' :
          i === currentStep.value ? 'active' : 'pending'
        )
      },
      style: {
        color: steps.map((_, i) =>
          i < currentStep.value ? 'green' :
          i === currentStep.value ? 'blue' : 'gray'
        ),
        fontWeight: steps.map((_, i) =>
          i === currentStep.value ? 'bold' : 'normal'
        )
      },
      setAttribute: {
        'aria-current': steps.map((_, i) => 
          i === currentStep.value ? 'step' : null
        )
      }
    }
  },
  '.step-indicator'
);

// Each step shows its position relative to current step
```

---

### Example 3: Chart Bars with Dynamic Heights
```javascript
const data = state([30, 50, 80, 45, 90, 60]);

Conditions.whenState(
  () => data.value.length > 0 ? 'show' : 'hide',
  {
    'show': {
      style: {
        height: data.value.map(v => `${v}%`),
        backgroundColor: data.value.map(v => 
          v < 40 ? '#e74c3c' :
          v < 70 ? '#f39c12' : '#2ecc71'
        ),
        transition: 'height 0.3s ease'
      },
      textContent: data.value.map(v => `${v}%`),
      setAttribute: {
        'aria-valuenow': data.value,
        'aria-valuemin': data.value.map(() => 0),
        'aria-valuemax': data.value.map(() => 100)
      }
    },
    'hide': {
      style: { display: 'none' }
    }
  },
  '.chart-bar'
);
```

---

### Example 4: Table Row Alternating Styles
```javascript
const rowCount = 10;
const rowColors = Array.from({ length: rowCount }, (_, i) => 
  i % 2 === 0 ? '#f8f9fa' : '#ffffff'
);
const rowNumbers = Array.from({ length: rowCount }, (_, i) => i + 1);

Conditions.apply('visible', {
  'visible': {
    style: {
      backgroundColor: rowColors
    },
    dataset: {
      rowNumber: rowNumbers
    },
    classList: {
      add: rowNumbers.map(n => n % 2 === 0 ? 'even-row' : 'odd-row')
    }
  }
}, '.table-row');
```

---

### Example 5: Card Grid with Unique Icons
```javascript
const icons = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓'];
const titles = ['Apple', 'Banana', 'Cherry', 'Grape', 'Orange', 'Strawberry'];
const colors = ['#ff6b6b', '#ffe66d', '#e74c3c', '#9b59b6', '#f39c12', '#e84393'];

Conditions.apply('loaded', {
  'loaded': {
    innerHTML: icons.map((icon, i) => `
      <div class="icon">${icon}</div>
      <h3>${titles[i]}</h3>
    `),
    style: {
      borderColor: colors,
      backgroundColor: colors.map(c => c + '20') // Add transparency
    },
    dataset: {
      fruit: titles.map(t => t.toLowerCase()),
      icon: icons
    }
  }
}, '.fruit-card');
```

---

### Example 6: Form Field Validation States
```javascript
const fields = ['email', 'password', 'confirm'];
const validStates = state([true, false, false]);

Conditions.whenState(
  () => validStates.value.some(v => v === false) ? 'invalid' : 'valid',
  {
    'invalid': {
      classList: {
        add: validStates.value.map(valid => valid ? 'is-valid' : 'is-invalid')
      },
      style: {
        borderColor: validStates.value.map(valid => valid ? 'green' : 'red')
      },
      setAttribute: {
        'aria-invalid': validStates.value.map(valid => !valid)
      }
    },
    'valid': {
      classList: { add: 'is-valid' },
      style: { borderColor: 'green' }
    }
  },
  '.form-field'
);
```

---

### Example 7: Priority Badges
```javascript
const tasks = state([
  { name: 'Fix bug', priority: 'high' },
  { name: 'Update docs', priority: 'medium' },
  { name: 'Refactor code', priority: 'low' },
  { name: 'Add tests', priority: 'high' }
]);

const priorityColors = {
  high: '#e74c3c',
  medium: '#f39c12',
  low: '#95a5a6'
};

Conditions.whenState(
  () => tasks.value.length > 0 ? 'show' : 'hide',
  {
    'show': {
      textContent: tasks.value.map(t => t.priority.toUpperCase()),
      style: {
        backgroundColor: tasks.value.map(t => priorityColors[t.priority]),
        color: 'white',
        padding: '5px 10px',
        borderRadius: '3px',
        fontWeight: 'bold'
      },
      dataset: {
        priority: tasks.value.map(t => t.priority),
        task: tasks.value.map(t => t.name)
      }
    }
  },
  '.priority-badge'
);
```

---

### Example 8: Countdown Timer Digits
```javascript
const timeLeft = state(125); // 125 seconds

function getDigits(num) {
  return String(num).padStart(3, '0').split('');
}

Conditions.whenState(
  () => timeLeft.value,
  {
    '>0': {
      textContent: getDigits(timeLeft.value),
      style: {
        fontSize: ['48px', '48px', '48px'],
        color: timeLeft.value < 10 ? 
          ['red', 'red', 'red'] : 
          ['#333', '#333', '#333'],
        animation: timeLeft.value < 10 ? 
          ['pulse 1s infinite', 'pulse 1s infinite', 'pulse 1s infinite'] :
          ['none', 'none', 'none']
      },
      classList: {
        add: timeLeft.value < 10 ? 
          ['urgent', 'urgent', 'urgent'] : 
          ['normal', 'normal', 'normal']
      }
    },
    '0': {
      textContent: ['0', '0', '0'],
      style: { color: 'red' }
    }
  },
  '.timer-digit'
);
```

---

## 🔧 **Advanced Features**

### Combining with Index-Specific Updates
```javascript
// Array distribution + index-specific overrides
Conditions.apply('active', {
  'active': {
    // Arrays distributed across all elements
    textContent: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    style: {
      color: ['red', 'blue', 'green', 'orange']
    },
    
    // Index-specific override for first element
    0: {
      style: {
        fontWeight: 'bold',
        fontSize: '20px'
      }
    },
    
    // Index-specific override for last element (negative index)
    '-1': {
      classList: { add: 'last-item' }
    }
  }
}, '.items');

// Result:
// Element 0: textContent="Item 1", color="red", fontWeight="bold", fontSize="20px"
// Element 1: textContent="Item 2", color="blue"
// Element 2: textContent="Item 3", color="green"
// Element 3: textContent="Item 4", color="orange", class="last-item"
```

---

### Dynamic Array Generation
```javascript
const count = state(5);

Conditions.whenState(
  () => count.value,
  {
    '>0': {
      textContent: Array.from({ length: count.value }, (_, i) => `Item ${i + 1}`),
      style: {
        backgroundColor: Array.from({ length: count.value }, (_, i) => 
          `hsl(${i * (360 / count.value)}, 70%, 80%)`
        )
      },
      dataset: {
        index: Array.from({ length: count.value }, (_, i) => i)
      }
    }
  },
  '.dynamic-item'
);

// Automatically adjusts when count changes
count.value = 8; // Now generates 8 items with unique colors
```

---

### Conditional Array Distribution
```javascript
const mode = state('list');
const items = ['A', 'B', 'C'];

Conditions.whenState(
  () => mode.value,
  {
    'list': {
      // Array distribution in list mode
      textContent: items,
      style: {
        display: 'block',
        color: ['red', 'blue', 'green']
      }
    },
    'grid': {
      // Different array distribution in grid mode
      textContent: items,
      style: {
        display: 'inline-block',
        width: ['100px', '150px', '200px']
      }
    },
    'hidden': {
      // No arrays, bulk update
      style: { display: 'none' }
    }
  },
  '.item'
);
```

---

## 🎯 **Supported Properties with Arrays**

### Direct Properties
```javascript
{
  textContent: ['Text 1', 'Text 2', 'Text 3'],
  innerHTML: ['<b>HTML 1</b>', '<b>HTML 2</b>', '<b>HTML 3</b>'],
  value: ['Value 1', 'Value 2', 'Value 3'],
  title: ['Title 1', 'Title 2', 'Title 3'],
  placeholder: ['Enter A', 'Enter B', 'Enter C']
}
```

### Style Object
```javascript
{
  style: {
    color: ['red', 'blue', 'green'],
    fontSize: ['14px', '16px', '18px'],
    backgroundColor: ['#f00', '#0f0', '#00f'],
    padding: ['5px', '10px', '15px']
  }
}
```

### classList Operations
```javascript
{
  classList: {
    add: [
      ['class1', 'class2'],    // Element 0
      ['class3'],               // Element 1
      ['class4', 'class5']      // Element 2
    ],
    remove: ['old1', 'old2', 'old3'],
    toggle: ['toggle1', 'toggle2', 'toggle3']
  }
}
```

### Dataset
```javascript
{
  dataset: {
    id: ['id-1', 'id-2', 'id-3'],
    type: ['type-a', 'type-b', 'type-c'],
    index: [0, 1, 2]
  }
}
```

### Attributes
```javascript
{
  setAttribute: {
    'aria-label': ['Label 1', 'Label 2', 'Label 3'],
    'data-value': [10, 20, 30],
    'disabled': [true, false, false]
  }
}
```

---

## 🔍 **How It Works Internally**

### Detection Algorithm
```javascript
// 1. Check if config contains arrays
const hasArrays = Conditions.hasArrayValues(config);

// 2. If arrays found, process each element
if (hasArrays) {
  elements.forEach((element, index) => {
    const elementConfig = processForIndex(config, index, elements.length);
    applyToElement(element, elementConfig);
  });
}

// 3. Otherwise, bulk apply
else {
  elements.forEach(element => {
    applyToElement(element, config);
  });
}
```

### Value Distribution
```javascript
// For each property with array value:
function getValueForIndex(array, index, totalElements) {
  if (index < array.length) {
    return array[index]; // Use array value
  } else {
    return array[array.length - 1]; // Repeat last value
  }
}
```

### Nested Object Handling
```javascript
// Recursively process nested objects
function processForIndex(config, index, total) {
  const result = {};
  
  for (const [key, value] of Object.entries(config)) {
    if (Array.isArray(value)) {
      result[key] = getValueForIndex(value, index, total);
    } else if (typeof value === 'object') {
      result[key] = processForIndex(value, index, total); // Recurse
    } else {
      result[key] = value; // Static value
    }
  }
  
  return result;
}
```

---

## ⚙️ **Integration with Other Modules**

### With Conditional Rendering
```javascript
// Combine conditions with array distribution
const status = state('loading');
const messages = ['Loading...', 'Almost there...', 'Just a moment...'];

Conditions.whenState(
  () => status.value,
  {
    'loading': {
      textContent: messages,
      classList: { add: 'spinner' },
      style: {
        color: ['#999', '#777', '#555'],
        animation: [
          'pulse 1s ease-in-out infinite',
          'pulse 1s ease-in-out infinite 0.2s',
          'pulse 1s ease-in-out infinite 0.4s'
        ]
      }
    },
    'loaded': {
      textContent: 'Complete!',
      classList: { remove: 'spinner' }
    }
  },
  '.loading-indicator'
);
```

### With DOM Helpers
```javascript
// Array updates work seamlessly with DOM Helpers collections
queryAll('.items').update({
  textContent: ['A', 'B', 'C']
});

ClassName.item.update({
  style: {
    color: ['red', 'blue', 'green']
  }
});
```

### With Reactive State
```javascript
// Reactive arrays automatically trigger distribution
const colors = state(['red', 'blue', 'green']);

Conditions.whenState(
  () => colors.value.length > 0 ? 'show' : 'hide',
  {
    'show': {
      style: {
        backgroundColor: colors.value
      }
    }
  },
  '.color-box'
);

// Update triggers redistribution
colors.value = ['purple', 'orange', 'pink', 'yellow'];
```

---

## ⚠️ **Important Notes**

### 1. Array Length Mismatch
```javascript
// ✅ More elements than array values: last value repeats
Conditions.apply('show', {
  'show': { textContent: ['A', 'B'] }
}, '.items'); // 5 elements

// Results: "A", "B", "B", "B", "B"

// ✅ More array values than elements: extra values ignored
Conditions.apply('show', {
  'show': { textContent: ['A', 'B', 'C', 'D', 'E'] }
}, '.items'); // 2 elements

// Results: "A", "B" (C, D, E ignored)
```

### 2. Performance Considerations
```javascript
// ⚠️ Large collections with arrays
// Array distribution processes each element individually

// Good: 10 elements
Conditions.apply('update', {
  'update': { textContent: Array(10).fill().map((_, i) => i) }
}, '.items');

// Consider bulk updates for very large collections (1000+)
// Or paginate/virtualize the list
```

### 3. Type Coercion
```javascript
// Arrays are preserved, not converted to strings
{
  dataset: {
    values: ['a', 'b', 'c'] // ✅ Distributed
  }
}

// vs

{
  dataset: {
    values: 'a,b,c' // ✅ All elements get same string
  }
}
```

### 4. Event Listeners
```javascript
// ⚠️ Event listeners cannot use arrays (not supported)
{
  addEventListener: {
    click: [handler1, handler2, handler3] // ❌ Won't work
  }
}

// ✅ Use single handler or index-specific approach
{
  addEventListener: {
    click: (e) => handleClick(e, e.target.dataset.index) // ✅ Works
  },
  dataset: {
    index: [0, 1, 2] // ✅ Distributed
  }
}
```

---

## 📊 **Module Information**

```javascript
// Check if array support is loaded
console.log(Conditions.hasArrayValues); // Function exists

// Check if a config has arrays
console.log(Conditions.hasArrayValues({
  textContent: ['A', 'B', 'C']
})); // true

// Access array support utilities
console.log(Conditions.arraySupport); // Module object
console.log(Conditions.arraySupport.version); // '1.0.0'
```

---

## 📦 **Dependencies**

### Required:
- **01_dh-conditional-rendering.js** - Core Conditions system (v4.0.0+)
- **10_dh-array-based-updates.js** - Array distribution engine

### Optional (Enhances functionality):
- **DOM Helpers** - Optimized collection handling
- **Reactive State** - Automatic updates when arrays change

### Load Order:
```html
<!-- 1. Reactive state (optional) -->
<script src="reactive-utils.js"></script>

<!-- 2. Array-based updates -->
<script src="10_dh-array-based-updates.js"></script>

<!-- 3. Conditional rendering -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- 4. Array support (THIS MODULE) -->
<script src="07_dh-conditions-array-support.js"></script>
```

---

## 🎯 **Key Features**

1. ✅ **Automatic array detection** - No API changes needed
2. ✅ **Index-based distribution** - Each element gets its value
3. ✅ **Last value repeats** - Handles array length mismatches
4. ✅ **Nested object support** - Arrays work in style, dataset, etc.
5. ✅ **Mixed static/array** - Combine arrays with bulk updates
6. ✅ **classList arrays** - Distribute class operations
7. ✅ **Type preservation** - Arrays stay arrays, not stringified
8. ✅ **Performance optimized** - Bulk operations when no arrays
9. ✅ **Reactive compatible** - Works with reactive state changes
10. ✅ **Backward compatible** - Non-array configs work as before

---

## 🚀 **Getting Started**

```javascript
// 1. Load the module (after dependencies)
// <script src="07_dh-conditions-array-support.js"></script>

// 2. Use arrays in your conditions
const status = state('active');

Conditions.whenState(
  () => status.value,
  {
    'active': {
      textContent: ['Item 1', 'Item 2', 'Item 3'],
      style: {
        color: ['red', 'blue', 'green']
      }
    }
  },
  '.items'
);

// 3. That's it! Array distribution works automatically ✨
```

---

This module makes it incredibly easy to create dynamic, data-driven UIs where each element in a collection gets its own unique styling and content! 🎨✨