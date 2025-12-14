# Conditions.apply() Standalone - Available Methods

This is a **standalone, collection-aware implementation** of `Conditions.apply()` that works **independently without requiring the full DOM Helpers library**. It supports **index-specific updates** and **shared properties** for collections.

---

## 🎯 **Core Functionality**

### **Standalone Conditional Application**

A lightweight, dependency-free version of `Conditions.apply()` that can:
- ✅ Apply conditions to **single elements** or **collections**
- ✅ Support **bulk updates** (shared across all elements)
- ✅ Support **index-specific updates** (individual elements)
- ✅ Work **without** DOM Helpers or reactive libraries

```javascript
// Works standalone - no dependencies needed!
ConditionsApply.apply(
  'active',
  {
    'active': {
      // Shared: all elements
      classList: { add: 'active' },
      style: { opacity: '1' },
      
      // Index-specific
      [0]: { style: { fontWeight: 'bold' } },
      [-1]: { style: { borderBottom: 'none' } }
    },
    'inactive': {
      classList: { remove: 'active' },
      style: { opacity: '0.5' }
    }
  },
  '.items'
);
```

---

## 📦 **ConditionsApply Object Methods**

### 1. **`ConditionsApply.apply(value, conditions, selector)`**

Apply conditions to elements with collection-aware index support.

```javascript
// Single element
ConditionsApply.apply(
  'premium',
  {
    'free': { 
      textContent: 'Free Plan',
      style: { color: 'gray' }
    },
    'premium': { 
      textContent: 'Premium Plan',
      style: { color: 'gold', fontWeight: 'bold' }
    }
  },
  '#planBadge'
);

// Collection with index updates
ConditionsApply.apply(
  'grid',
  {
    'grid': {
      // All items
      style: { 
        display: 'inline-block',
        width: '200px',
        margin: '10px'
      },
      
      // First item (featured)
      [0]: {
        style: { 
          width: '420px',
          fontWeight: 'bold'
        },
        classList: { add: 'featured' }
      },
      
      // Last item
      [-1]: {
        style: { marginRight: '0' }
      }
    },
    'list': {
      // All items
      style: { 
        display: 'block',
        width: '100%'
      }
    }
  },
  '.grid-item'
);
```

**Parameters:**
- `value` (any): Current value to match against conditions
- `conditions` (Object|Function): Condition mappings
  - Object keys: condition patterns (strings)
  - Object values: configuration objects with updates
  - Can include **numeric keys** for index-specific updates
- `selector` (string|Element|NodeList|Array): Target elements
  - String: CSS selector (`.class`, `#id`, `tag`)
  - Element: Single DOM element
  - NodeList/HTMLCollection: Collection of elements
  - Array: Array of elements

**Returns:** `ConditionsApply` (for chaining)

---

### 2. **`ConditionsApply.batch(fn)`**

Batch multiple apply calls (convenience method).

```javascript
ConditionsApply.batch(() => {
  ConditionsApply.apply('active', conditions1, '.items');
  ConditionsApply.apply('premium', conditions2, '.badges');
  ConditionsApply.apply('dark', conditions3, 'body');
});
```

**Parameters:**
- `fn` (Function): Function containing multiple apply calls

**Returns:** `ConditionsApply` (for chaining)

---

### 3. **`ConditionsApply.getElements(selector)`**

Get elements from various selector types (helper for debugging).

```javascript
// Test element retrieval
const elements = ConditionsApply.getElements('.items');
console.log(elements); // Array of elements

// Works with various selector types
ConditionsApply.getElements('#myId');           // [element]
ConditionsApply.getElements('.myClass');        // [el1, el2, ...]
ConditionsApply.getElements('div.container');   // [el1, el2, ...]
ConditionsApply.getElements(document.querySelectorAll('.item')); // [el1, el2, ...]
ConditionsApply.getElements([el1, el2]);        // [el1, el2]
```

**Parameters:**
- `selector` (string|Element|NodeList|Array): Selector to resolve

**Returns:** Array of elements

---

### 4. **`ConditionsApply.testCondition(value, condition)`**

Test if a value matches a condition pattern (helper for debugging).

```javascript
// Test condition matching
console.log(ConditionsApply.testCondition(5, '>3'));        // true
console.log(ConditionsApply.testCondition(5, '10-20'));     // false
console.log(ConditionsApply.testCondition('test', '/^te/')); // true
console.log(ConditionsApply.testCondition('hello', 'includes:ell')); // true
console.log(ConditionsApply.testCondition(true, 'true'));   // true
console.log(ConditionsApply.testCondition('active', 'active')); // true
```

**Parameters:**
- `value` (any): Value to test
- `condition` (string): Condition pattern

**Returns:** `boolean` - `true` if value matches condition

---

## 🌐 **Global Integration**

The module also integrates with `Conditions` global if available:

```javascript
// Standalone access
ConditionsApply.apply(value, conditions, selector);

// Via Conditions global (if exists)
Conditions.apply(value, conditions, selector);
Conditions.batch(fn);
```

---

## 💡 **Usage Examples**

### Example 1: Simple Status Badge
```javascript
ConditionsApply.apply(
  'online',
  {
    'online': {
      textContent: '● Online',
      style: { color: 'green' }
    },
    'offline': {
      textContent: '○ Offline',
      style: { color: 'gray' }
    },
    'away': {
      textContent: '◐ Away',
      style: { color: 'orange' }
    }
  },
  '#statusBadge'
);
```

---

### Example 2: Collection with Index Updates
```javascript
const userRole = 'moderator';

ConditionsApply.apply(
  userRole,
  {
    'admin': {
      // All badges
      classList: { add: 'badge-admin' },
      style: { backgroundColor: 'red', color: 'white' },
      
      // First badge special
      [0]: {
        textContent: '👑 Admin',
        style: { fontSize: '18px', fontWeight: 'bold' }
      }
    },
    'moderator': {
      // All badges
      classList: { add: 'badge-mod' },
      style: { backgroundColor: 'blue', color: 'white' },
      
      // First badge
      [0]: {
        textContent: '🛡️ Moderator',
        style: { fontSize: '16px' }
      }
    },
    'user': {
      // All badges
      classList: { add: 'badge-user' },
      style: { backgroundColor: 'green', color: 'white' },
      
      [0]: { textContent: '👤 User' }
    }
  },
  '.user-badge'
);
```

---

### Example 3: Form Validation States
```javascript
const emailValid = validateEmail(emailInput.value);

ConditionsApply.apply(
  emailValid,
  {
    'true': {
      classList: { add: 'is-valid', remove: 'is-invalid' },
      setAttribute: { 'aria-invalid': 'false' },
      style: { borderColor: 'green' }
    },
    'false': {
      classList: { add: 'is-invalid', remove: 'is-valid' },
      setAttribute: { 'aria-invalid': 'true' },
      style: { borderColor: 'red' }
    }
  },
  '#emailInput'
);
```

---

### Example 4: Table Row Styling
```javascript
const tableTheme = 'striped';

ConditionsApply.apply(
  tableTheme,
  {
    'striped': {
      // All rows
      classList: { add: 'table-row' },
      
      // Header row
      [0]: {
        style: { 
          backgroundColor: '#f0f0f0',
          fontWeight: 'bold'
        }
      },
      
      // Odd rows
      [1]: { style: { backgroundColor: 'white' } },
      [3]: { style: { backgroundColor: 'white' } },
      [5]: { style: { backgroundColor: 'white' } },
      
      // Even rows
      [2]: { style: { backgroundColor: '#f9f9f9' } },
      [4]: { style: { backgroundColor: '#f9f9f9' } },
      [6]: { style: { backgroundColor: '#f9f9f9' } }
    },
    'plain': {
      // All rows
      style: { backgroundColor: 'white' },
      
      // Header row
      [0]: {
        style: { 
          backgroundColor: '#e0e0e0',
          fontWeight: 'bold'
        }
      }
    }
  },
  'tbody tr'
);
```

---

### Example 5: Number Range Display
```javascript
const score = 85;

ConditionsApply.apply(
  score,
  {
    '<50': {
      textContent: 'Fail: ' + score,
      classList: { add: 'score-fail' },
      style: { color: 'red', fontWeight: 'bold' }
    },
    '50-69': {
      textContent: 'Pass: ' + score,
      classList: { add: 'score-pass' },
      style: { color: 'orange' }
    },
    '70-89': {
      textContent: 'Good: ' + score,
      classList: { add: 'score-good' },
      style: { color: 'blue' }
    },
    '>=90': {
      textContent: 'Excellent: ' + score,
      classList: { add: 'score-excellent' },
      style: { color: 'green', fontWeight: 'bold' }
    }
  },
  '#scoreDisplay'
);
```

---

### Example 6: Dynamic Conditions
```javascript
const currentUser = { role: 'guest', premium: false };

ConditionsApply.apply(
  currentUser.role,
  // Dynamic conditions function
  () => ({
    'admin': {
      textContent: 'Administrator',
      style: { 
        backgroundColor: currentUser.premium ? 'gold' : 'orange' 
      }
    },
    'user': {
      textContent: 'User',
      style: { 
        backgroundColor: currentUser.premium ? 'blue' : 'gray' 
      }
    },
    'guest': {
      textContent: 'Guest',
      style: { backgroundColor: '#ccc' }
    }
  }),
  '#roleBadge'
);
```

---

### Example 7: Progressive List Styling
```javascript
const listStyle = 'cards';

ConditionsApply.apply(
  listStyle,
  {
    'cards': {
      // All items
      style: {
        display: 'inline-block',
        width: '250px',
        padding: '20px',
        margin: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px'
      },
      classList: { add: 'card-item' },
      
      // First item (featured)
      [0]: {
        style: {
          width: '520px',
          border: '2px solid gold'
        },
        classList: { add: 'featured-card' }
      },
      
      // Progressive shadows
      [1]: { style: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } },
      [2]: { style: { boxShadow: '0 2px 6px rgba(0,0,0,0.15)' } },
      [3]: { style: { boxShadow: '0 2px 8px rgba(0,0,0,0.2)' } }
    },
    'list': {
      // All items
      style: {
        display: 'block',
        width: '100%',
        padding: '10px',
        margin: '5px 0',
        border: 'none',
        borderBottom: '1px solid #eee'
      },
      classList: { add: 'list-item' },
      
      // Last item no border
      [-1]: {
        style: { borderBottom: 'none' }
      }
    }
  },
  '.content-item'
);
```

---

### Example 8: Batch Updates
```javascript
// Apply multiple conditions at once
ConditionsApply.batch(() => {
  ConditionsApply.apply('dark', themeConditions, 'body');
  ConditionsApply.apply('compact', densityConditions, '.content');
  ConditionsApply.apply('grid', layoutConditions, '.items');
  ConditionsApply.apply('premium', badgeConditions, '.user-badge');
});
```

---

## 🎨 **Supported Condition Patterns**

### Boolean Literals
```javascript
{
  'true': { ... },    // value === true
  'false': { ... },   // value === false
  'truthy': { ... },  // !!value
  'falsy': { ... }    // !value
}
```

### Null/Undefined/Empty
```javascript
{
  'null': { ... },      // value === null
  'undefined': { ... }, // value === undefined
  'empty': { ... }      // Empty string/array/object or falsy
}
```

### String Matching
```javascript
{
  '"exact"': { ... },         // Quoted exact match
  'includes:text': { ... },   // String contains 'text'
  'startsWith:pre': { ... },  // String starts with 'pre'
  'endsWith:fix': { ... }     // String ends with 'fix'
}
```

### Regex Patterns
```javascript
{
  '/^[A-Z]/': { ... },       // Starts with capital letter
  '/\\d+/i': { ... },        // Contains digits (case-insensitive)
  '/pattern/flags': { ... }  // Custom pattern with flags
}
```

### Numeric Comparisons
```javascript
{
  '5': { ... },       // Exact number (value === 5)
  '10-20': { ... },   // Range (10 <= value <= 20)
  '>50': { ... },     // Greater than 50
  '>=100': { ... },   // Greater than or equal to 100
  '<10': { ... },     // Less than 10
  '<=5': { ... }      // Less than or equal to 5
}
```

### String Equality (Default)
```javascript
{
  'active': { ... },   // String equality
  'pending': { ... }
}
```

---

## 🛠️ **Supported Property Updates**

### Style Object
```javascript
{
  style: {
    color: 'red',
    backgroundColor: '#fff',
    fontSize: '16px'
  }
}
```

### classList Operations
```javascript
{
  classList: {
    add: ['class1', 'class2'],
    remove: 'old-class',
    toggle: 'active'
  }
}
```

### Attributes
```javascript
{
  setAttribute: {
    'data-id': '123',
    'aria-label': 'Button',
    disabled: true
  },
  
  attrs: {  // Alias for setAttribute
    'data-role': 'admin'
  },
  
  removeAttribute: ['disabled', 'readonly']
}
```

### Dataset
```javascript
{
  dataset: {
    userId: '123',
    role: 'admin',
    active: 'true'
  }
}
```

### Event Listeners
```javascript
{
  addEventListener: {
    click: (e) => console.log('Clicked'),
    mouseover: {
      handler: (e) => console.log('Hover'),
      options: { once: true }
    }
  }
}
```

### Event Properties
```javascript
{
  onclick: (e) => console.log('Clicked'),
  onchange: (e) => handleChange(e),
  oninput: (e) => handleInput(e)
}
```

### Native DOM Properties
```javascript
{
  textContent: 'Hello',
  innerHTML: '<strong>Bold</strong>',
  value: 'Input value',
  disabled: true,
  checked: false,
  placeholder: 'Enter text...'
}
```

---

## 🔍 **Collection Handling**

### Safe Array Conversion
The module includes a **safe array conversion** function that handles various collection types without Symbol iterator issues:

```javascript
function safeArrayFrom(collection) {
  // Handles:
  // - Arrays
  // - NodeList
  // - HTMLCollection
  // - Custom collections with length property
  // - Proxy objects (avoids Symbol.iterator issues)
}
```

### Index Updates
Numeric keys in configuration are treated as **index-specific**:

```javascript
{
  // Shared (non-numeric keys)
  style: { padding: '10px' },
  
  // Index-specific (numeric keys)
  [0]: { ... },   // First element
  [1]: { ... },   // Second element
  [-1]: { ... },  // Last element
  [-2]: { ... }   // Second to last
}
```

---

## ⚙️ **Technical Details**

### Processing Order
1. **Separate** updates into shared and index-specific
2. **Apply shared** properties to ALL elements
3. **Apply index-specific** properties to individual elements

```javascript
// Input
{
  style: { color: 'blue' },  // Shared
  [0]: { style: { fontWeight: 'bold' } }  // Index
}

// Processing
// Step 1: Apply { style: { color: 'blue' } } to ALL
// Step 2: Apply { style: { fontWeight: 'bold' } } to element[0]
```

### Negative Index Handling
```javascript
const elements = [el0, el1, el2, el3, el4];

// Negative indices converted
[-1] → elements[4]  // Last
[-2] → elements[3]  // Second to last
[-5] → elements[0]  // First (wraps around)
```

---

## 📊 **Module Information**

```javascript
// Check if loaded
console.log(typeof ConditionsApply); // 'object'
console.log(typeof Conditions.apply); // 'function'

// Test helpers
ConditionsApply.testCondition(5, '>3');        // true
ConditionsApply.getElements('.items');         // [el1, el2, ...]

// Standalone usage (no dependencies required!)
ConditionsApply.apply('active', conditions, '.items');
```

---

## ⚠️ **Important Notes**

### 1. **No Dependencies**
```javascript
// Works completely standalone!
// No DOM Helpers, no reactive libraries, no other modules needed
<script src="10d_conditions-apply-standalone.js"></script>

// Ready to use immediately
ConditionsApply.apply(value, conditions, selector);
```

### 2. **Index Format**
Only **pure numeric strings** are treated as indices:
```javascript
{
  '0': { ... },     // ✅ Index 0
  '1': { ... },     // ✅ Index 1
  '-1': { ... },    // ✅ Last element
  'style': { ... }, // ✅ Shared property
  'color': { ... }  // ✅ Shared property
}
```

### 3. **Collection Safety**
Handles Proxy objects and custom collections safely:
```javascript
// Works with all collection types
ConditionsApply.apply(value, conditions, document.querySelectorAll('.item'));
ConditionsApply.apply(value, conditions, document.getElementsByClassName('item'));
ConditionsApply.apply(value, conditions, [el1, el2, el3]);
ConditionsApply.apply(value, conditions, customProxyCollection);
```

---

## 🆚 **Comparison with Full Module**

### Full Conditions Module:
- ✅ Reactive mode support
- ✅ Integration with DOM Helpers
- ✅ Custom matchers/handlers
- ✅ Requires full library

### Standalone Version:
- ✅ **No dependencies**
- ✅ Collection-aware with index support
- ✅ All built-in matchers
- ✅ Lightweight (~10KB)
- ❌ No reactive mode
- ❌ No custom matchers
- ❌ Static updates only

---

## 🎯 **Key Features**

1. ✅ **Zero dependencies** - works standalone
2. ✅ **Collection-aware** - bulk + index updates
3. ✅ **Safe handling** - avoids Symbol iterator issues
4. ✅ **Full condition matchers** - boolean, string, regex, numeric
5. ✅ **Negative indices** - `[-1]` for last element
6. ✅ **Multiple selectors** - string, Element, NodeList, Array
7. ✅ **Chainable** - returns self for chaining
8. ✅ **Debugging helpers** - `getElements()`, `testCondition()`

---

## 📝 **Summary**

| Feature | Value |
|---------|-------|
| **Type** | Standalone module |
| **Dependencies** | None (works independently) |
| **Size** | ~10KB (lightweight) |
| **Mode** | Static only (no reactivity) |
| **Collection Support** | ✅ Bulk + index updates |
| **Condition Matchers** | All built-in matchers included |

---

This standalone version is perfect for projects that need **conditional element updates without the full DOM Helpers ecosystem** or for **simple static sites** that don't need reactive features! 🚀