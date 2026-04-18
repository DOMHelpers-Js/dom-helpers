[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Usage Examples and Best Practices

## Quick Start (30 seconds)

```javascript
// Form validation — default handles the "pristine" state
Conditions.whenState(
  () => validationStatus.value,
  {
    'valid':   { style: { borderColor: 'green' }, classList: { add: 'is-valid' } },
    'invalid': { style: { borderColor: 'red' },   classList: { add: 'is-invalid' } },
    'default': { style: { borderColor: '#ccc' },  classList: { remove: ['is-valid', 'is-invalid'] } }
  },
  '#emailInput'
);
```

---

## Real-World Examples

### Example 1: API Response Handler

APIs can return many status codes. Handle the known ones, and let `default` catch the rest:

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
    'default': {
      textContent: '',
      classList: { remove: ['alert-success', 'alert-error', 'alert-info'] },
      style: { display: 'none' }
    }
  },
  '#apiMessage'
);

// 'idle', 'cancelled', 'timeout', 'rate_limited' — all handled by default
```

### Example 2: Payment Status

```javascript
const paymentStatus = state('pending');

Conditions.whenState(
  () => paymentStatus.value,
  {
    'completed': {
      textContent: 'Payment Successful',
      style: { backgroundColor: '#d4edda', color: '#155724' }
    },
    'failed': {
      textContent: 'Payment Failed',
      style: { backgroundColor: '#f8d7da', color: '#721c24' }
    },
    'processing': {
      textContent: 'Processing Payment...',
      style: { backgroundColor: '#d1ecf1', color: '#0c5460' }
    },
    'default': {
      textContent: 'Awaiting Payment',
      style: { backgroundColor: '#e2e3e5', color: '#383d41' }
    }
  },
  '#paymentStatus'
);

// 'pending', 'cancelled', 'refunded', 'disputed' → all show "Awaiting Payment"
```

### Example 3: Permission Levels with Numbers

```javascript
const permissionLevel = state(0);

Conditions.whenState(
  () => permissionLevel.value,
  {
    '3': {
      textContent: 'Full Access',
      classList: { add: 'permission-full' }
    },
    '2': {
      textContent: 'Edit Access',
      classList: { add: 'permission-edit' }
    },
    '1': {
      textContent: 'View Only',
      classList: { add: 'permission-view' }
    },
    'default': {
      textContent: 'No Access',
      classList: { add: 'permission-none' }
    }
  },
  '#permissionBadge'
);

// 0, -1, or any unexpected number → "No Access"
```

### Example 4: Temperature with Numeric Ranges and Default

```javascript
const temperature = state(15);

Conditions.whenState(
  () => temperature.value,
  {
    '<0':     { textContent: 'Freezing', style: { color: 'blue' } },
    '0-10':   { textContent: 'Cold',     style: { color: 'lightblue' } },
    '11-20':  { textContent: 'Cool',     style: { color: 'green' } },
    '21-30':  { textContent: 'Warm',     style: { color: 'orange' } },
    '>30':    { textContent: 'Hot',      style: { color: 'red' } },
    'default': { textContent: 'No data', style: { color: 'gray' } }
  },
  '#temperatureDisplay'
);

// If temperature becomes NaN, null, or a non-number → "No data" in gray
```

### Example 5: Theme Selector

```javascript
const theme = state('light');

Conditions.whenState(
  () => theme.value,
  {
    'light': {
      style: { backgroundColor: '#ffffff', color: '#000000' }
    },
    'dark': {
      style: { backgroundColor: '#1a1a1a', color: '#ffffff' }
    },
    'sepia': {
      style: { backgroundColor: '#f4ecd8', color: '#5b4636' }
    },
    'default': {
      style: { backgroundColor: '#f0f0f0', color: '#333333' }
    }
  },
  'body'
);

// Any custom theme name like 'ocean', 'forest' → neutral gray fallback
theme.value = 'ocean';  // default applies
```

### Example 6: Task Status Board

```javascript
const taskStatus = state('queued');

Conditions.whenState(
  () => taskStatus.value,
  {
    'completed': {
      textContent: 'Completed',
      classList: { add: 'task-done' },
      style: { color: 'green' }
    },
    'in_progress': {
      textContent: 'In Progress',
      classList: { add: 'task-active' },
      style: { color: 'blue' }
    },
    'failed': {
      textContent: 'Failed',
      classList: { add: 'task-failed' },
      style: { color: 'red' }
    },
    'default': {
      textContent: 'Pending',
      classList: { add: 'task-pending' },
      style: { color: 'gray' }
    }
  },
  '#taskStatus'
);

// 'queued', 'scheduled', 'paused', 'cancelled' → all show "Pending"
```

---

## Default with Conditions.apply()

`apply()` runs once. The `default` key works the same way:

```javascript
// One-time application — no reactivity
Conditions.apply(getUserPlan(), {
  'enterprise': { textContent: 'Enterprise', classList: { add: 'plan-enterprise' } },
  'pro':        { textContent: 'Pro',        classList: { add: 'plan-pro' } },
  'free':       { textContent: 'Free',       classList: { add: 'plan-free' } },
  'default':    { textContent: 'Unknown Plan', classList: { add: 'plan-unknown' } }
}, '#planBadge');
```

---

## Default with Conditions.watch()

`watch()` is explicitly reactive. The `default` key works here too:

```javascript
const networkStatus = state('checking');

Conditions.watch(
  () => networkStatus.value,
  {
    'online':  { textContent: 'Online',  style: { color: 'green' } },
    'offline': { textContent: 'Offline', style: { color: 'red' } },
    'default': { textContent: 'Checking...', style: { color: 'gray' } }
  },
  '#networkBadge'
);
```

---

## Default vs 'truthy' — What's the Difference?

Both can act as catch-all conditions, but they work differently:

```javascript
// 'truthy' catches any truthy value (non-empty, non-zero, non-null, non-false)
{
  'active': { ... },
  'truthy': { ... }    // Catches 'pending', 'unknown', 123, true, etc.
                       // Does NOT catch 0, '', null, undefined, false
}

// 'default' catches EVERYTHING that didn't match above
{
  'active': { ... },
  'default': { ... }   // Catches 'pending', 'unknown', 123, true,
                       // AND also 0, '', null, undefined, false
}
```

| Value | `'truthy'` catches? | `'default'` catches? |
|-------|---------------------|---------------------|
| `'pending'` | Yes | Yes |
| `123` | Yes | Yes |
| `true` | Yes (unless `'true'` is above) | Yes |
| `0` | No | Yes |
| `''` | No | Yes |
| `null` | No | Yes |
| `false` | No (unless `'false'` is above) | Yes |

**When to use which:**

- Use `'truthy'` when you want to catch **non-empty values** that weren't explicitly handled
- Use `'default'` when you want to catch **absolutely everything** that wasn't handled

---

## Best Practices

### 1. Always Put default Last

The `default` key should be the last entry in your condition map:

```javascript
// ✅ Correct — default at the end
{
  'active':  { ... },
  'pending': { ... },
  'error':   { ... },
  'default': { ... }
}
```

The module places it last internally regardless of where you write it, but putting it last in your code makes the intent clear.

### 2. Use default for Truly Unknown Values

```javascript
// ✅ Good — default handles unexpected API responses
{
  'success': { ... },
  'error':   { ... },
  'default': { textContent: 'Unexpected response' }
}

// ❌ Unnecessary — if you know all possible values, list them
{
  'true':    { ... },
  'false':   { ... },
  'default': { ... }   // When will a boolean ever be something else?
}
```

### 3. Give default a Visible State

Make it obvious when the default is active — it often means something unexpected happened:

```javascript
// ✅ Clear default state
'default': {
  textContent: 'Unknown Status',
  style: { color: 'gray', fontStyle: 'italic' }
}

// ❌ Invisible default — hard to debug
'default': {
  style: { display: 'none' }
}
```

### 4. Combine with Specific Matchers

`default` pairs well with specific matchers to create comprehensive coverage:

```javascript
Conditions.whenState(
  () => score.value,
  {
    '>=90':   { textContent: 'A' },
    '>=80':   { textContent: 'B' },
    '>=70':   { textContent: 'C' },
    '>=60':   { textContent: 'D' },
    '>=0':    { textContent: 'F' },
    'default': { textContent: 'N/A' }   // Negative, NaN, null, etc.
  },
  '#grade'
);
```

### 5. Use default in Forms for Initial State

```javascript
const fieldStatus = state('pristine');

Conditions.whenState(
  () => fieldStatus.value,
  {
    'valid':   { style: { borderColor: 'green' } },
    'invalid': { style: { borderColor: 'red' } },
    'default': { style: { borderColor: '#ccc' } }  // pristine, focused, etc.
  },
  '#inputField'
);
```

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | `'default'` key acts as a catch-all fallback in condition maps |
| **When it triggers** | Only when **no** other condition matches |
| **Catches everything** | Unlike `'truthy'`, `default` catches falsy values too |
| **Works with** | `whenState()`, `apply()`, `watch()` — all three methods |
| **Compatible** | Works alongside all matchers (numeric, regex, string, custom) |
| **Non-invasive** | Original Conditions methods are preserved under the hood |
| **Revertible** | `Conditions.restoreOriginal()` removes default support |

> **Simple Rule to Remember:** `'default'` is your safety net. Put it last in your condition map, and it catches anything that falls through — whether it's an unexpected string, a null value, or something you never anticipated. It's the `else` at the end of your `if/else` chain.