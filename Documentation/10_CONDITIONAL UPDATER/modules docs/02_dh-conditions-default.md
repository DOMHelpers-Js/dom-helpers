# Conditions Default Branch Extension - Available Methods

This module adds **explicit default branch support** to the `Conditions` module, allowing you to specify fallback configurations when no condition matches.

---

## 🎯 **Core Functionality**

### **Default Branch Support**

Extends `Conditions.whenState()`, `Conditions.apply()`, and `Conditions.watch()` to support a `default` key in condition mappings.

```javascript
// Before (without default support)
Conditions.whenState(
  () => status.value,
  {
    'active': { style: { color: 'green' } },
    'inactive': { style: { color: 'gray' } }
    // If status is 'unknown', nothing happens!
  },
  '#statusBadge'
);

// After (with default support)
Conditions.whenState(
  () => status.value,
  {
    'active': { style: { color: 'green' } },
    'inactive': { style: { color: 'gray' } },
    'default': { style: { color: 'orange' } } // Fallback for any other value
  },
  '#statusBadge'
);
```

---

## 📦 **Enhanced Methods**

All these methods are **non-invasively wrapped** to support the `default` key:

### 1. **`Conditions.whenState(valueFn, conditions, selector, options)`**

Enhanced version that supports `default` branch.

```javascript
const userRole = state('guest');

Conditions.whenState(
  () => userRole.value,
  {
    'admin': { 
      textContent: 'Admin Access',
      classList: { add: 'badge-admin' },
      style: { backgroundColor: 'red' }
    },
    'moderator': { 
      textContent: 'Moderator Access',
      classList: { add: 'badge-mod' },
      style: { backgroundColor: 'blue' }
    },
    'user': { 
      textContent: 'User Access',
      classList: { add: 'badge-user' },
      style: { backgroundColor: 'green' }
    },
    'default': { // Catches 'guest' or any unknown role
      textContent: 'Limited Access',
      classList: { add: 'badge-guest' },
      style: { backgroundColor: 'gray' }
    }
  },
  '#roleBadge'
);
```

**Parameters:** Same as original `Conditions.whenState()`
**Returns:** Same as original (cleanup function or update object)

---

### 2. **`Conditions.apply(value, conditions, selector)`**

Enhanced version that supports `default` branch.

```javascript
const apiResponse = { status: 'rate_limited' };

Conditions.apply(
  apiResponse.status,
  {
    'success': { 
      textContent: '✓ Success',
      classList: { add: 'alert-success' }
    },
    'error': { 
      textContent: '✗ Error',
      classList: { add: 'alert-error' }
    },
    'loading': { 
      textContent: '⏳ Loading',
      classList: { add: 'alert-info' }
    },
    'default': { // Catches unexpected statuses like 'rate_limited'
      textContent: '⚠ Unexpected Status',
      classList: { add: 'alert-warning' }
    }
  },
  '#apiStatus'
);
```

**Parameters:** Same as original `Conditions.apply()`
**Returns:** Same as original (Conditions object for chaining)

---

### 3. **`Conditions.watch(valueFn, conditions, selector)`**

Enhanced version that supports `default` branch.

```javascript
const connectionState = state('connecting');

Conditions.watch(
  () => connectionState.value,
  {
    'connected': { 
      textContent: 'Connected',
      style: { color: 'green' }
    },
    'disconnected': { 
      textContent: 'Disconnected',
      style: { color: 'red' }
    },
    'reconnecting': { 
      textContent: 'Reconnecting...',
      style: { color: 'orange' }
    },
    'default': { // Catches 'connecting', 'timeout', etc.
      textContent: 'Status Unknown',
      style: { color: 'gray' }
    }
  },
  '#connectionStatus'
);
```

**Parameters:** Same as original `Conditions.watch()`
**Returns:** Same as original (cleanup function or static result)

---

### 4. **`Conditions.restoreOriginal()`**

Restore original methods (removes default branch support).

```javascript
// Remove default branch support (for debugging)
Conditions.restoreOriginal();

// Now default key won't work anymore
Conditions.whenState(
  () => value.value,
  {
    'active': { ... },
    'default': { ... } // This won't work as fallback
  },
  '#element'
);
```

**Parameters:** None
**Returns:** `undefined`

**Use case:** Debugging or testing to ensure backward compatibility

---

## 💡 **Usage Examples**

### Example 1: Form Validation Status
```javascript
const validationStatus = state('pristine');

Conditions.whenState(
  () => validationStatus.value,
  {
    'valid': {
      classList: { add: 'is-valid', remove: 'is-invalid' },
      setAttribute: { 'aria-invalid': 'false' },
      style: { borderColor: 'green' }
    },
    'invalid': {
      classList: { add: 'is-invalid', remove: 'is-valid' },
      setAttribute: { 'aria-invalid': 'true' },
      style: { borderColor: 'red' }
    },
    'default': { // pristine, validating, etc.
      classList: { remove: ['is-valid', 'is-invalid'] },
      setAttribute: { 'aria-invalid': 'false' },
      style: { borderColor: '#ccc' }
    }
  },
  '#emailInput'
);
```

---

### Example 2: API Response Handler
```javascript
const apiStatus = state('idle');

Conditions.whenState(
  () => apiStatus.value,
  {
    'success': {
      textContent: 'Data loaded successfully',
      classList: { add: 'alert-success' },
      style: { display: 'block' }
    },
    'error': {
      textContent: 'Failed to load data',
      classList: { add: 'alert-error' },
      style: { display: 'block' }
    },
    'loading': {
      textContent: 'Loading...',
      classList: { add: 'alert-info' },
      style: { display: 'block' }
    },
    'default': { // idle, cancelled, timeout, etc.
      textContent: '',
      classList: { remove: ['alert-success', 'alert-error', 'alert-info'] },
      style: { display: 'none' }
    }
  },
  '#apiMessage'
);
```

---

### Example 3: Payment Status
```javascript
const paymentStatus = state('pending');

Conditions.whenState(
  () => paymentStatus.value,
  {
    'completed': {
      textContent: '✓ Payment Successful',
      classList: { add: 'status-success' },
      style: { backgroundColor: '#d4edda', color: '#155724' }
    },
    'failed': {
      textContent: '✗ Payment Failed',
      classList: { add: 'status-error' },
      style: { backgroundColor: '#f8d7da', color: '#721c24' }
    },
    'processing': {
      textContent: '⏳ Processing Payment...',
      classList: { add: 'status-processing' },
      style: { backgroundColor: '#d1ecf1', color: '#0c5460' }
    },
    'default': { // pending, cancelled, refunded, disputed, etc.
      textContent: 'ℹ Payment Status: ' + paymentStatus.value,
      classList: { add: 'status-neutral' },
      style: { backgroundColor: '#e2e3e5', color: '#383d41' }
    }
  },
  '#paymentStatus'
);
```

---

### Example 4: User Permission Levels
```javascript
const userPermission = state(0);

Conditions.whenState(
  () => userPermission.value,
  {
    '3': { // Admin
      textContent: 'Full Access',
      classList: { add: 'permission-full' },
      dataset: { level: 'admin' }
    },
    '2': { // Editor
      textContent: 'Edit Access',
      classList: { add: 'permission-edit' },
      dataset: { level: 'editor' }
    },
    '1': { // Viewer
      textContent: 'View Only',
      classList: { add: 'permission-view' },
      dataset: { level: 'viewer' }
    },
    'default': { // 0 or any other number
      textContent: 'No Access',
      classList: { add: 'permission-none' },
      dataset: { level: 'none' }
    }
  },
  '#permissionBadge'
);
```

---

### Example 5: Theme Selector with Custom Themes
```javascript
const theme = state('light');

Conditions.whenState(
  () => theme.value,
  {
    'light': {
      style: {
        backgroundColor: '#ffffff',
        color: '#000000'
      }
    },
    'dark': {
      style: {
        backgroundColor: '#1a1a1a',
        color: '#ffffff'
      }
    },
    'sepia': {
      style: {
        backgroundColor: '#f4ecd8',
        color: '#5b4636'
      }
    },
    'default': { // Any custom theme name
      style: {
        backgroundColor: '#f0f0f0',
        color: '#333333'
      },
      textContent: 'Theme: ' + theme.value
    }
  },
  'body'
);

// If theme.value becomes 'custom-blue', default branch applies
theme.value = 'custom-blue';
```

---

### Example 6: Dynamic Status with Unknown Values
```javascript
const taskStatus = state('queued');

Conditions.whenState(
  () => taskStatus.value,
  {
    'completed': {
      innerHTML: '<strong>✓</strong> Completed',
      classList: { add: 'task-done' }
    },
    'in_progress': {
      innerHTML: '<strong>⏳</strong> In Progress',
      classList: { add: 'task-active' }
    },
    'failed': {
      innerHTML: '<strong>✗</strong> Failed',
      classList: { add: 'task-failed' }
    },
    'default': { // queued, scheduled, paused, cancelled, etc.
      innerHTML: '<strong>•</strong> ' + taskStatus.value.replace('_', ' '),
      classList: { add: 'task-pending' }
    }
  },
  '#taskStatus'
);
```

---

### Example 7: Combining with Numeric Ranges
```javascript
const temperature = state(15);

Conditions.whenState(
  () => temperature.value,
  {
    '<0': {
      textContent: '❄️ Freezing',
      style: { color: 'blue' }
    },
    '0-10': {
      textContent: '🧊 Cold',
      style: { color: 'lightblue' }
    },
    '11-20': {
      textContent: '😊 Cool',
      style: { color: 'green' }
    },
    '21-30': {
      textContent: '☀️ Warm',
      style: { color: 'orange' }
    },
    '>30': {
      textContent: '🔥 Hot',
      style: { color: 'red' }
    },
    'default': { // NaN, null, undefined, etc.
      textContent: '? Unknown',
      style: { color: 'gray' }
    }
  },
  '#temperature'
);
```

---

### Example 8: With Dynamic Conditions Function
```javascript
const mode = state('view');
const hasPermission = state(false);

Conditions.whenState(
  () => mode.value,
  () => ({
    'edit': hasPermission.value ? {
      textContent: 'Edit Mode',
      classList: { add: 'mode-edit' },
      disabled: false
    } : {
      textContent: 'Edit (No Permission)',
      classList: { add: 'mode-locked' },
      disabled: true
    },
    'view': {
      textContent: 'View Mode',
      classList: { add: 'mode-view' }
    },
    'default': {
      textContent: 'Unknown Mode: ' + mode.value,
      classList: { add: 'mode-unknown' }
    }
  }),
  '#modeIndicator'
);
```

---

## 🔍 **How It Works Internally**

### **Processing Flow:**

```javascript
// Input conditions with default
{
  'active': { style: { color: 'green' } },
  'inactive': { style: { color: 'gray' } },
  'default': { style: { color: 'orange' } }
}

// Internally transformed to:
{
  'active': { style: { color: 'green' } },
  'inactive': { style: { color: 'gray' } },
  '/^[\\s\\S]*$/': { style: { color: 'orange' } } // Catch-all regex
}
```

The `default` key is replaced with a **catch-all regex pattern** (`/^[\s\S]*$/`) that matches any string, ensuring it only triggers if no other condition matches first.

---

## ⚙️ **Technical Details**

### **Non-Invasive Wrapping**

```javascript
// Original methods are preserved
const _originalWhenState = Conditions.whenState;
const _originalApply = Conditions.apply;
const _originalWatch = Conditions.watch;

// Enhanced methods wrap originals
Conditions.whenState = function(valueFn, conditions, selector, options) {
  const wrappedConditions = wrapConditionsWithDefault(conditions);
  return _originalWhenState.call(this, valueFn, wrappedConditions, selector, options);
};
```

### **Default Extraction**

```javascript
function wrapConditionsWithDefault(conditions) {
  const conditionsObj = typeof conditions === 'function' ? conditions() : conditions;
  
  if (!('default' in conditionsObj)) {
    return conditions; // No default - return unchanged
  }

  const { default: defaultConfig, ...regularConditions } = conditionsObj;
  
  return function() {
    return {
      ...regularConditions,
      '/^[\\s\\S]*$/': defaultConfig // Add catch-all
    };
  };
}
```

---

## 📊 **Module Information**

```javascript
// Check if extension is loaded
console.log(Conditions.extensions.defaultBranch); // "1.0.0"

// Restore original behavior
Conditions.restoreOriginal();

// Re-apply extension (reload script)
```

---

## ⚠️ **Important Notes**

### 1. **Load Order**
```html
<!-- Correct order -->
<script src="10a_dh-conditional-rendering.js"></script>
<script src="10b_dh-conditions-default.js"></script> <!-- AFTER -->
```

### 2. **Default Always Last**
The `default` branch is always evaluated **last**, after all other conditions:

```javascript
{
  'active': { ... },    // Checked first
  'inactive': { ... },  // Checked second
  'pending': { ... },   // Checked third
  'default': { ... }    // Checked last (if nothing matched)
}
```

### 3. **Works with All Matchers**
Compatible with all built-in and custom matchers:

```javascript
{
  'true': { ... },
  '/^test/': { ... },
  '>50': { ... },
  'includes:admin': { ... },
  'default': { ... }  // Catches everything else
}
```

### 4. **Dynamic Conditions**
Works with function-based conditions:

```javascript
Conditions.whenState(
  () => value.value,
  () => ({
    'condition1': { ... },
    'default': { ... } // Dynamic default
  }),
  selector
);
```

---

## 🎯 **Key Benefits**

1. ✅ **Fallback handling** - Never miss unexpected values
2. ✅ **Non-invasive** - Original methods preserved
3. ✅ **Backward compatible** - Works with existing code
4. ✅ **Restorable** - Can revert to original behavior
5. ✅ **Dynamic** - Works with function conditions
6. ✅ **Universal** - Works with all matcher types
7. ✅ **Clean syntax** - Just add `'default': { ... }`

---

## 🆚 **Before vs After**

### Without Extension:
```javascript
// If status is 'unknown', nothing happens - element keeps old state
Conditions.whenState(
  () => status.value,
  {
    'active': { style: { color: 'green' } },
    'inactive': { style: { color: 'red' } }
  },
  '#status'
);
```

### With Extension:
```javascript
// If status is 'unknown', default branch applies
Conditions.whenState(
  () => status.value,
  {
    'active': { style: { color: 'green' } },
    'inactive': { style: { color: 'red' } },
    'default': { style: { color: 'orange' } } // Handles 'unknown'
  },
  '#status'
);
```

---

## 📝 **Summary**

| Feature | Value |
|---------|-------|
| **Type** | Extension module |
| **Dependencies** | `Conditions.js` v4.0.0+ |
| **Load Order** | AFTER Conditions module |
| **API Impact** | Non-invasive wrapper |
| **Backward Compatible** | ✅ Yes |
| **Restorable** | ✅ Yes via `restoreOriginal()` |

---

This extension makes `Conditions` even more robust by ensuring you **always handle unexpected values** with a clean, explicit `default` branch! 🚀