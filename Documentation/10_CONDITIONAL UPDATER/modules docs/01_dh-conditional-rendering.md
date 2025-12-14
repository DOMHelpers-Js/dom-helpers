# Conditional Rendering Module - Available Methods

This module provides **declarative conditional rendering** based on state values, with support for both **reactive** and **static** modes.

---

## 🎯 **Core API Methods**

### 1. **`Conditions.whenState(valueFn, conditions, selector, options)`**

Apply different configurations to elements based on state value. Works in both reactive and static modes.

```javascript
// Reactive mode (auto-updates when state changes)
const status = state('idle'); // Reactive state

Conditions.whenState(
  () => status.value,
  {
    'idle': { textContent: 'Start', disabled: false },
    'loading': { textContent: 'Loading...', disabled: true },
    'success': { textContent: 'Done!', classList: { add: 'success' } },
    'error': { textContent: 'Failed', classList: { add: 'error' } }
  },
  '#submitBtn'
);

// Static mode (execute once)
Conditions.whenState(
  'active',
  {
    'active': { style: { color: 'green' } },
    'inactive': { style: { color: 'gray' } }
  },
  '.status-indicator'
);
```

**Parameters:**
- `valueFn` (Function|any): Function returning state value OR direct value
  - Function: `() => state.value` (reactive mode if state is reactive)
  - Direct value: `'active'` (static mode)
- `conditions` (Object|Function): Condition mappings
  - Object: `{ 'condition': { props } }`
  - Function: `() => ({ 'condition': { props } })` (dynamic conditions)
- `selector` (string|Element|NodeList): Target elements
- `options` (Object, optional):
  - `reactive` (boolean): Force reactive/static mode (default: auto-detect)

**Returns:**
- **Reactive mode**: Cleanup function to stop watching
- **Static mode**: Object with `update()` and `destroy()` methods

---

### 2. **`Conditions.apply(value, conditions, selector)`**

Manual mode - apply conditions **once** without reactivity.

```javascript
// Apply once
Conditions.apply(
  'premium',
  {
    'free': { textContent: 'Free Plan', style: { color: 'gray' } },
    'premium': { textContent: 'Premium Plan', style: { color: 'gold' } }
  },
  '#planBadge'
);

// With function value
Conditions.apply(
  () => getUserRole(),
  {
    'admin': { classList: { add: 'admin-badge' } },
    'user': { classList: { add: 'user-badge' } }
  },
  '.role-indicator'
);
```

**Parameters:**
- `value` (Function|any): Value to match OR function returning value
- `conditions` (Object): Condition mappings
- `selector` (string|Element|NodeList): Target elements

**Returns:** `Conditions` (for chaining)

---

### 3. **`Conditions.watch(valueFn, conditions, selector)`**

Watch mode - re-apply when value changes (requires reactive library).

```javascript
// Watch reactive state
const theme = state('light');

Conditions.watch(
  () => theme.value,
  {
    'light': { 
      style: { backgroundColor: '#fff', color: '#000' } 
    },
    'dark': { 
      style: { backgroundColor: '#000', color: '#fff' } 
    }
  },
  'body'
);

// Theme changes trigger automatic updates
theme.value = 'dark'; // Body updates automatically
```

**Parameters:**
- `valueFn` (Function): Function returning value to watch
- `conditions` (Object): Condition mappings
- `selector` (string|Element|NodeList): Target elements

**Returns:** Cleanup function (if reactive) or static result

**Note:** Falls back to `Conditions.apply()` if reactivity unavailable

---

### 4. **`Conditions.batch(fn)`**

Batch multiple updates for performance (uses reactive library's batch if available).

```javascript
const count = state(0);
const status = state('idle');

Conditions.batch(() => {
  // Multiple state changes batched into single update
  count.value = 10;
  status.value = 'complete';
  
  // DOM updates happen once after batch completes
});
```

**Parameters:**
- `fn` (Function): Function containing multiple updates

**Returns:** Result of `fn()` execution

---

### 5. **`Conditions.registerMatcher(name, matcher)`**

Register custom condition matcher for specialized pattern matching.

```javascript
// Register custom matcher for even/odd numbers
Conditions.registerMatcher('evenNumber', {
  test: (condition) => condition === 'even',
  match: (value) => typeof value === 'number' && value % 2 === 0
});

Conditions.registerMatcher('oddNumber', {
  test: (condition) => condition === 'odd',
  match: (value) => typeof value === 'number' && value % 2 !== 0
});

// Use custom matchers
const count = state(5);

Conditions.whenState(
  () => count.value,
  {
    'even': { style: { backgroundColor: 'lightblue' } },
    'odd': { style: { backgroundColor: 'lightcoral' } }
  },
  '#counter'
);
```

**Matcher Interface:**
```typescript
interface Matcher {
  test: (condition: string, value?: any) => boolean;
  match: (value: any, condition: string) => boolean;
}
```

**Parameters:**
- `name` (string): Matcher name
- `matcher` (Object): Matcher with `test()` and `match()` methods
  - `test(condition, value)`: Returns `true` if this matcher applies
  - `match(value, condition)`: Returns `true` if value matches condition

**Returns:** `Conditions` (for chaining)

---

### 6. **`Conditions.registerHandler(name, handler)`**

Register custom property handler for specialized DOM updates.

```javascript
// Register handler for custom 'tooltip' property
Conditions.registerHandler('tooltip', {
  test: (key) => key === 'tooltip',
  apply: (element, value) => {
    element.setAttribute('data-tooltip', value);
    element.classList.add('has-tooltip');
  }
});

// Use custom handler
Conditions.apply(
  'info',
  {
    'info': { 
      tooltip: 'This is an info message',
      style: { color: 'blue' }
    }
  },
  '.message'
);
```

**Handler Interface:**
```typescript
interface Handler {
  test: (key: string, value: any, element?: Element) => boolean;
  apply: (element: Element, value: any, key: string) => void;
}
```

**Parameters:**
- `name` (string): Handler name
- `handler` (Object): Handler with `test()` and `apply()` methods
  - `test(key, value, element)`: Returns `true` if handler applies
  - `apply(element, value, key)`: Applies property to element

**Returns:** `Conditions` (for chaining)

---

### 7. **`Conditions.getMatchers()`**

Get list of registered condition matchers (debugging/inspection).

```javascript
console.log(Conditions.getMatchers());
// [
//   'booleanTrue', 'booleanFalse', 'truthy', 'falsy',
//   'null', 'undefined', 'empty', 'quotedString',
//   'includes', 'startsWith', 'endsWith', 'regex',
//   'numericRange', 'numericExact', 'greaterThanOrEqual',
//   'lessThanOrEqual', 'greaterThan', 'lessThan',
//   'stringEquality'
// ]
```

**Returns:** Array of matcher names

---

### 8. **`Conditions.getHandlers()`**

Get list of registered property handlers (debugging/inspection).

```javascript
console.log(Conditions.getHandlers());
// [
//   'style', 'classList', 'setAttribute', 'removeAttribute',
//   'dataset', 'addEventListener', 'removeEventListener',
//   'eventProperty', 'nativeProperty', 'fallback'
// ]
```

**Returns:** Array of handler names

---

## 📊 **Properties**

### 9. **`Conditions.hasReactivity`** (getter)

Check if reactive mode is available.

```javascript
if (Conditions.hasReactivity) {
  console.log('Reactive updates available!');
  // Use reactive features
} else {
  console.log('Static mode only');
  // Use manual updates
}
```

**Returns:** `boolean`

---

### 10. **`Conditions.mode`** (getter)

Get current operating mode.

```javascript
console.log(Conditions.mode); // 'reactive' or 'static'
```

**Returns:** `'reactive'` | `'static'`

---

## 🎨 **Built-in Condition Matchers**

### Boolean & Truthiness
```javascript
{
  'true': { ... },        // Exact boolean true
  'false': { ... },       // Exact boolean false
  'truthy': { ... },      // Any truthy value
  'falsy': { ... }        // Any falsy value
}
```

### Null/Undefined/Empty
```javascript
{
  'null': { ... },        // value === null
  'undefined': { ... },   // value === undefined
  'empty': { ... }        // Empty string/array/object or falsy
}
```

### String Matching
```javascript
{
  '"exact"': { ... },           // Quoted exact match
  'includes:search': { ... },   // String contains 'search'
  'startsWith:pre': { ... },    // String starts with 'pre'
  'endsWith:fix': { ... }       // String ends with 'fix'
}
```

### Regex Patterns
```javascript
{
  '/^[A-Z]/': { ... },          // Starts with capital
  '/\\d+/i': { ... },           // Contains digits (case-insensitive)
  '/pattern/flags': { ... }     // Custom pattern with flags
}
```

### Numeric Comparisons
```javascript
{
  '5': { ... },           // Exact number (value === 5)
  '10-20': { ... },       // Range (10 <= value <= 20)
  '>50': { ... },         // Greater than 50
  '>=100': { ... },       // Greater than or equal to 100
  '<10': { ... },         // Less than 10
  '<=5': { ... }          // Less than or equal to 5
}
```

### String Equality (Default)
```javascript
{
  'active': { ... },      // String equality (default fallback)
  'pending': { ... }
}
```

---

## 🛠️ **Built-in Property Handlers**

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
    toggle: 'active',
    replace: ['old', 'new']
  }
}
```

### Attributes
```javascript
{
  // Set multiple attributes
  setAttribute: {
    'data-id': '123',
    'aria-label': 'Button',
    'disabled': true
  },
  
  // Or single attribute (legacy)
  setAttribute: ['name', 'value'],
  
  // Remove attributes
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

## 💡 **Usage Examples**

### Example 1: Button States (Reactive)
```javascript
const status = state('idle');

Conditions.whenState(
  () => status.value,
  {
    'idle': {
      textContent: 'Start Process',
      disabled: false,
      classList: { add: 'btn-primary', remove: ['btn-success', 'btn-danger'] },
      style: { backgroundColor: '#007bff' }
    },
    'loading': {
      textContent: 'Processing...',
      disabled: true,
      classList: { add: 'btn-secondary', remove: ['btn-primary'] },
      innerHTML: '<span class="spinner"></span> Processing...'
    },
    'success': {
      textContent: '✓ Complete',
      disabled: true,
      classList: { add: 'btn-success', remove: ['btn-secondary'] },
      style: { backgroundColor: '#28a745' }
    },
    'error': {
      textContent: '✗ Failed',
      disabled: false,
      classList: { add: 'btn-danger', remove: ['btn-secondary'] },
      style: { backgroundColor: '#dc3545' }
    }
  },
  '#processBtn'
);

// State changes trigger automatic updates
status.value = 'loading';
setTimeout(() => status.value = 'success', 2000);
```

---

### Example 2: Theme Switcher
```javascript
const theme = state('light');

Conditions.whenState(
  () => theme.value,
  {
    'light': {
      style: {
        backgroundColor: '#ffffff',
        color: '#000000'
      },
      dataset: { theme: 'light' },
      classList: { add: 'light-theme', remove: 'dark-theme' }
    },
    'dark': {
      style: {
        backgroundColor: '#1a1a1a',
        color: '#ffffff'
      },
      dataset: { theme: 'dark' },
      classList: { add: 'dark-theme', remove: 'light-theme' }
    }
  },
  'body'
);
```

---

### Example 3: Form Validation
```javascript
const email = state('');

Conditions.whenState(
  () => email.value,
  {
    'empty': {
      classList: { remove: ['is-valid', 'is-invalid'] },
      setAttribute: { 'aria-invalid': 'false' }
    },
    '/^[^@]+@[^@]+\\.[^@]+$/': { // Valid email regex
      classList: { add: 'is-valid', remove: 'is-invalid' },
      setAttribute: { 'aria-invalid': 'false' }
    },
    'truthy': { // Has value but doesn't match regex
      classList: { add: 'is-invalid', remove: 'is-valid' },
      setAttribute: { 'aria-invalid': 'true' }
    }
  },
  '#emailInput'
);
```

---

### Example 4: Number Range Display
```javascript
const score = state(75);

Conditions.whenState(
  () => score.value,
  {
    '<50': {
      textContent: 'Fail',
      style: { color: 'red', fontWeight: 'bold' }
    },
    '50-69': {
      textContent: 'Pass',
      style: { color: 'orange' }
    },
    '70-89': {
      textContent: 'Good',
      style: { color: 'blue' }
    },
    '>=90': {
      textContent: 'Excellent',
      style: { color: 'green', fontWeight: 'bold' }
    }
  },
  '#scoreDisplay'
);
```

---

### Example 5: Dynamic Conditions
```javascript
const user = state({ role: 'guest', verified: false });

Conditions.whenState(
  () => user.value.role,
  () => ({ // Dynamic conditions function
    'admin': {
      textContent: 'Administrator',
      classList: { add: 'badge-admin' },
      style: { backgroundColor: user.value.verified ? 'gold' : 'orange' }
    },
    'user': {
      textContent: 'User',
      classList: { add: 'badge-user' },
      style: { backgroundColor: user.value.verified ? 'blue' : 'gray' }
    },
    'guest': {
      textContent: 'Guest',
      classList: { add: 'badge-guest' }
    }
  }),
  '#userBadge'
);
```

---

### Example 6: Multiple Elements
```javascript
const connectionStatus = state('connecting');

Conditions.whenState(
  () => connectionStatus.value,
  {
    'connecting': {
      textContent: 'Connecting...',
      classList: { add: 'status-warning' },
      style: { color: 'orange' }
    },
    'connected': {
      textContent: 'Connected',
      classList: { add: 'status-success', remove: 'status-warning' },
      style: { color: 'green' }
    },
    'disconnected': {
      textContent: 'Disconnected',
      classList: { add: 'status-error', remove: 'status-success' },
      style: { color: 'red' }
    }
  },
  '.status-indicator' // Applies to ALL elements with this class
);
```

---

### Example 7: Custom Matcher
```javascript
// Register business hours matcher
Conditions.registerMatcher('businessHours', {
  test: (condition) => condition === 'business-hours',
  match: (value) => {
    const hour = new Date(value).getHours();
    return hour >= 9 && hour < 17;
  }
});

const currentTime = state(new Date());

Conditions.whenState(
  () => currentTime.value,
  {
    'business-hours': {
      textContent: 'We are OPEN',
      style: { color: 'green' }
    },
    'truthy': { // Fallback for non-business hours
      textContent: 'We are CLOSED',
      style: { color: 'red' }
    }
  },
  '#storeStatus'
);
```

---

### Example 8: Static Mode (No Reactivity)
```javascript
// Execute once without watching
const result = Conditions.apply(
  getUserStatus(), // Non-reactive value
  {
    'active': { classList: { add: 'user-active' } },
    'inactive': { classList: { add: 'user-inactive' } }
  },
  '#userStatus'
);

// Manual update later
result.update(); // Re-apply conditions
```

---

## 🔍 **Selector Support**

The module supports various selector types:

### String Selectors
```javascript
// ID
Conditions.apply(value, conditions, '#myButton');

// Class
Conditions.apply(value, conditions, '.btn');

// Complex CSS
Conditions.apply(value, conditions, 'input[type="email"]');
```

### Direct Elements
```javascript
const button = document.getElementById('btn');
Conditions.apply(value, conditions, button);
```

### Collections
```javascript
const buttons = document.querySelectorAll('.btn');
Conditions.apply(value, conditions, buttons);

// Or with DOM Helpers
Conditions.apply(value, conditions, ClassName.button);
```

### Arrays
```javascript
const elements = [el1, el2, el3];
Conditions.apply(value, conditions, elements);
```

---

## ⚙️ **DOM Helpers Integration**

When DOM Helpers are loaded, convenience methods are added:

```javascript
// Via Elements
Elements.whenState(valueFn, conditions, selector);
Elements.whenApply(value, conditions, selector);
Elements.whenWatch(valueFn, conditions, selector);

// Via Collections
Collections.whenState(valueFn, conditions, selector);
Collections.whenApply(value, conditions, selector);
Collections.whenWatch(valueFn, conditions, selector);

// Via Selector
Selector.whenState(valueFn, conditions, selector);
Selector.whenApply(value, conditions, selector);
Selector.whenWatch(valueFn, conditions, selector);
```

---

## 🔧 **Advanced Features**

### Event Listener Cleanup
```javascript
// Event listeners are automatically cleaned up on condition changes
Conditions.whenState(
  () => mode.value,
  {
    'edit': {
      addEventListener: {
        click: handleEdit,
        keydown: handleKeydown
      }
    },
    'view': {
      // Previous listeners automatically removed
      addEventListener: {
        click: handleView
      }
    }
  },
  '#content'
);
```

### Batch Updates
```javascript
Conditions.batch(() => {
  status.value = 'loading';
  progress.value = 0;
  message.value = 'Starting...';
  // All conditions update once after batch
});
```

---

## 📊 **Module Information**

```javascript
console.log(Conditions.hasReactivity); // true/false
console.log(Conditions.mode);          // 'reactive' or 'static'
console.log(Conditions.getMatchers()); // Array of matchers
console.log(Conditions.getHandlers()); // Array of handlers
```

---

## ⚠️ **Dependencies**

### Optional (Enhances functionality):
- **ReactiveUtils** or reactive state library - Enables reactive mode
- **Elements** - Optimized ID lookups
- **Collections** - Optimized class/tag lookups
- **Selector** - Optimized CSS queries

### Works standalone without dependencies in static mode!

---

## 🎯 **Key Features**

1. ✅ **Reactive + Static** modes
2. ✅ **Declarative** condition syntax
3. ✅ **Extensible** via custom matchers/handlers
4. ✅ **Type-safe** condition matching
5. ✅ **Auto cleanup** of event listeners
6. ✅ **Batch updates** support
7. ✅ **DOM Helpers integration**
8. ✅ **Multiple selector types**
9. ✅ **Dynamic conditions** via functions
10. ✅ **Proxy-safe** collection handling

---

This module is perfect for building **dynamic UIs** that respond to state changes with clean, declarative condition mappings! 🚀