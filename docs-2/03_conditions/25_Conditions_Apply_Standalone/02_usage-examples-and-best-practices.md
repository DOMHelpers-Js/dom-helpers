[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Usage Examples and Best Practices

## Quick Start (30 seconds)

```javascript
// Score grading — one call, done
ConditionsApply.apply(85, {
  '>=90':    { textContent: 'A', style: { color: 'green' } },
  '>=80':    { textContent: 'B', style: { color: 'blue' } },
  '>=70':    { textContent: 'C', style: { color: 'orange' } },
  'default': { textContent: 'F', style: { color: 'red' } }
}, '#grade');
```

---

## Real-World Examples

### Example 1: Status Badge

```javascript
ConditionsApply.apply('online', {
  'online':  { textContent: 'Online',  style: { color: 'green' } },
  'offline': { textContent: 'Offline', style: { color: 'red' } },
  'away':    { textContent: 'Away',    style: { color: 'orange' } },
  'default': { textContent: 'Unknown', style: { color: 'gray' } }
}, '#statusBadge');
```

### Example 2: Permission Badge

```javascript
const level = getUserPermissionLevel();

ConditionsApply.apply(level, {
  '3':       { textContent: 'Full Access', classList: { add: 'perm-full' } },
  '2':       { textContent: 'Edit Access', classList: { add: 'perm-edit' } },
  '1':       { textContent: 'View Only',   classList: { add: 'perm-view' } },
  'default': { textContent: 'No Access',   classList: { add: 'perm-none' } }
}, '#permBadge');

// 0, -1, or unexpected values → "No Access"
```

### Example 3: Form Validation

```javascript
const isValid = validateEmail(emailInput.value);

ConditionsApply.apply(isValid, {
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
}, '#emailInput');
```

### Example 4: Collection with Index Updates

All items get shared styles, first and last items get individual treatment:

```javascript
ConditionsApply.apply('cards', {
  'cards': {
    // Shared: all items
    style: {
      display: 'inline-block',
      width: '250px',
      padding: '20px',
      margin: '10px',
      borderRadius: '8px'
    },

    // First item: featured card
    0: {
      style: { width: '520px', border: '2px solid gold' },
      classList: { add: 'featured' }
    },

    // Last item: no right margin
    -1: { style: { marginRight: '0' } }
  },
  'list': {
    style: { display: 'block', width: '100%', padding: '10px' },
    -1: { style: { borderBottom: 'none' } }
  }
}, '.content-item');
```

### Example 5: Numeric Ranges

```javascript
const temperature = getSensorReading();

ConditionsApply.apply(temperature, {
  '<0':      { textContent: 'Freezing', style: { color: 'blue' } },
  '0-10':    { textContent: 'Cold',     style: { color: 'lightblue' } },
  '11-25':   { textContent: 'Warm',     style: { color: 'green' } },
  '>25':     { textContent: 'Hot',      style: { color: 'red' } },
  'default': { textContent: 'No Data',  style: { color: 'gray' } }
}, '#tempDisplay');

// NaN, null, non-number → "No Data"
```

### Example 6: String Pattern Matching

```javascript
const filename = getUploadedFileName();

ConditionsApply.apply(filename, {
  'endsWith:.jpg':  { textContent: 'Image File',   classList: { add: 'file-image' } },
  'endsWith:.pdf':  { textContent: 'PDF Document', classList: { add: 'file-pdf' } },
  'endsWith:.mp4':  { textContent: 'Video File',   classList: { add: 'file-video' } },
  'default':        { textContent: 'Unknown File',  classList: { add: 'file-unknown' } }
}, '#fileType');
```

### Example 7: Table Header Sorting

```javascript
const sortColumn = 'date';

ConditionsApply.apply(sortColumn, {
  'name': {
    style: { fontWeight: 'normal' },
    0: { style: { fontWeight: 'bold' }, classList: { add: 'sorted' } }
  },
  'date': {
    style: { fontWeight: 'normal' },
    1: { style: { fontWeight: 'bold' }, classList: { add: 'sorted' } }
  },
  'size': {
    style: { fontWeight: 'normal' },
    2: { style: { fontWeight: 'bold' }, classList: { add: 'sorted' } }
  }
}, 'thead th');
```

### Example 8: Dynamic Conditions

Conditions can be a function that returns the condition map:

```javascript
const user = { role: 'guest', premium: false };

ConditionsApply.apply(
  user.role,
  () => ({
    'admin': {
      textContent: 'Administrator',
      style: { backgroundColor: user.premium ? 'gold' : 'orange' }
    },
    'user': {
      textContent: 'User',
      style: { backgroundColor: user.premium ? 'blue' : 'gray' }
    },
    'default': {
      textContent: 'Guest',
      style: { backgroundColor: '#ccc' }
    }
  }),
  '#roleBadge'
);
```

---

## Chaining Multiple Applies

```javascript
ConditionsApply
  .apply('dark', {
    'dark':  { style: { backgroundColor: '#1a1a1a', color: '#fff' } },
    'light': { style: { backgroundColor: '#fff', color: '#000' } }
  }, 'body')
  .apply('premium', {
    'premium': { textContent: 'PRO', style: { color: 'gold' } },
    'free':    { textContent: 'FREE', style: { color: 'gray' } }
  }, '#planBadge');
```

---

## Batch Updates

Group related applies together for clarity:

```javascript
ConditionsApply.batch(() => {
  ConditionsApply.apply('dark', themeConditions, 'body');
  ConditionsApply.apply('compact', densityConditions, '.content');
  ConditionsApply.apply('grid', layoutConditions, '.items');
  ConditionsApply.apply('admin', roleConditions, '#badge');
});
```

---

## Using the Debugging Helpers

### Testing Condition Matches

Before applying, verify that your conditions match as expected:

```javascript
// Boolean
ConditionsApply.testCondition(true, 'true');       // true
ConditionsApply.testCondition(true, 'truthy');      // true

// Numeric
ConditionsApply.testCondition(15, '10-20');          // true
ConditionsApply.testCondition(5, '>3');              // true
ConditionsApply.testCondition(100, '>=100');          // true

// String
ConditionsApply.testCondition('hello', 'includes:ell');   // true
ConditionsApply.testCondition('test.jpg', 'endsWith:.jpg'); // true

// Regex
ConditionsApply.testCondition('ABC', '/^[A-Z]+$/');  // true

// Empty/null
ConditionsApply.testCondition('', 'empty');           // true
ConditionsApply.testCondition(null, 'null');           // true
```

### Testing Element Selection

Verify which elements a selector resolves to:

```javascript
const items = ConditionsApply.getElements('.list-item');
console.log(items.length);  // 5
console.log(items[0]);      // <div class="list-item">...</div>

const header = ConditionsApply.getElements('#header');
console.log(header.length); // 1
```

---

## Best Practices

### 1. Use Default for Unexpected Values

```javascript
// ✅ Default catches anything that doesn't match
{
  'success': { style: { color: 'green' } },
  'error':   { style: { color: 'red' } },
  'default': { style: { color: 'gray' } }
}

// 'pending', 'cancelled', 'timeout' → all caught by default
```

### 2. Use Bulk for Shared, Index for Exceptions

```javascript
// ✅ Clean separation
{
  'active': {
    // All elements get this
    classList: { add: 'active' },
    style: { opacity: '1' },

    // Only specific elements get these
    0:  { style: { fontWeight: 'bold' } },
    -1: { style: { borderBottom: 'none' } }
  }
}
```

### 3. Keep Index Configs Focused

```javascript
// ✅ Index configs only add what's different
{
  'active': {
    style: { padding: '10px', color: 'green' },
    0: { style: { fontWeight: 'bold' } }
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

### 4. Use testCondition() to Debug Matching Issues

```javascript
// If your conditions aren't matching as expected:
const value = getStatus();
console.log('Value:', value, typeof value);

console.log('Matches "active"?', ConditionsApply.testCondition(value, 'active'));
console.log('Matches "truthy"?', ConditionsApply.testCondition(value, 'truthy'));
```

### 5. Use Negative Indices for Last Elements

```javascript
// ✅ Negative indices adapt to any collection size
{
  'active': {
    -1: { style: { borderBottom: 'none' } },  // Always last
    -2: { style: { opacity: '0.8' } }          // Always second to last
  }
}
```

### 6. Use Dynamic Conditions When Values Depend on External State

```javascript
// ✅ Dynamic conditions — recalculated each time
ConditionsApply.apply(value, () => ({
  'premium': { style: { color: isPremiumTheme ? 'gold' : 'blue' } },
  'free':    { style: { color: 'gray' } }
}), '#badge');
```

---

## When to Use Standalone vs Full Module

| Scenario | Use |
|----------|-----|
| Small project, no DOMHelpers | Standalone `ConditionsApply` |
| One-time conditional styling | Standalone `ConditionsApply` |
| Need reactive auto-updates | Full `Conditions.whenState()` |
| Need custom matchers | Full `Conditions.registerMatcher()` |
| Already using DOMHelpers | Full Conditions module |
| Widget or embeddable component | Standalone `ConditionsApply` |
| Quick prototype | Standalone `ConditionsApply` |

---

## Summary

| Pattern | When to Use |
|---------|------------|
| **Single element** | Simple status badges, toggles, form validation |
| **Bulk only** (no numeric keys) | All elements need the same updates |
| **Bulk + index** | Shared styles with individual exceptions |
| **Negative indices** (`-1`, `-2`) | Targeting last elements in collections |
| **Default branch** | Catching unexpected or unknown values |
| **Chaining** | Multiple independent apply calls in sequence |
| **Batch** | Grouping related applies for readability |
| **Dynamic conditions** | When condition configs depend on external state |

| Method | Description |
|--------|-------------|
| `ConditionsApply.apply()` | Apply conditions to elements (chainable) |
| `ConditionsApply.batch()` | Group multiple apply calls |
| `ConditionsApply.getElements()` | Debug helper — resolve selector to elements |
| `ConditionsApply.testCondition()` | Debug helper — test if value matches condition |

> **Simple Rule to Remember:** `ConditionsApply.apply()` is **apply once and done** — no reactivity, no subscriptions, no cleanup needed. Give it a value, conditions, and a selector, and it handles everything in one shot. Use the debugging helpers (`testCondition`, `getElements`) when things don't work as expected.