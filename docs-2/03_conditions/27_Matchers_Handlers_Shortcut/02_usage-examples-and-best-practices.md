[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Usage Examples and Best Practices

## Quick Start (30 seconds)

```javascript
// Create a simple matcher in one line
createSimpleMatcher('adult', 'adult', val => val >= 18);

// Use it
Conditions.whenState(() => age.value, {
  'adult':   { textContent: 'Welcome!', style: { color: 'green' } },
  'default': { textContent: 'Too young', style: { color: 'red' } }
}, '#ageGate');
```

---

## Real-World Examples

### Example 1: Weekday / Weekend Matcher

```javascript
registerMatcher('weekday', {
  test: (condition) => condition === 'weekday',
  match: (value) => {
    const day = new Date(value).getDay();
    return day >= 1 && day <= 5;
  }
});

registerMatcher('weekend', {
  test: (condition) => condition === 'weekend',
  match: (value) => {
    const day = new Date(value).getDay();
    return day === 0 || day === 6;
  }
});

// Use them
Conditions.whenState(() => currentDate.value, {
  'weekday': { textContent: 'Workday', style: { color: 'blue' } },
  'weekend': { textContent: 'Weekend!', style: { color: 'green' } }
}, '#dayBadge');
```

### Example 2: Custom Property Handler — Tooltip

```javascript
registerHandler('tooltip', {
  test: (key) => key === 'tooltip',
  apply: (element, val) => {
    element.setAttribute('title', val);
    element.setAttribute('data-tooltip', val);
    element.classList.add('has-tooltip');
  }
});

// Now 'tooltip' works in any condition config
Conditions.whenState(() => status.value, {
  'error':   { tooltip: 'Click to retry', style: { color: 'red' } },
  'success': { tooltip: 'All good!', style: { color: 'green' } }
}, '#statusIcon');
```

### Example 3: Batch Registration

Register a whole set of matchers in one call:

```javascript
registerMatchers({
  even: {
    test: (condition) => condition === 'even',
    match: (value) => typeof value === 'number' && value % 2 === 0
  },
  odd: {
    test: (condition) => condition === 'odd',
    match: (value) => typeof value === 'number' && value % 2 !== 0
  },
  positive: {
    test: (condition) => condition === 'positive',
    match: (value) => typeof value === 'number' && value > 0
  },
  negative: {
    test: (condition) => condition === 'negative',
    match: (value) => typeof value === 'number' && value < 0
  }
});

// Use any of them
Conditions.whenState(() => count.value, {
  'even':     { textContent: 'Even' },
  'odd':      { textContent: 'Odd' },
  'negative': { textContent: 'Negative!' }
}, '#numberInfo');
```

### Example 4: Quick Matchers with createSimpleMatcher()

For simple keyword-based matchers, skip the full object syntax:

```javascript
createSimpleMatcher('premium', 'premium', val => val.plan === 'premium');
createSimpleMatcher('expired', 'expired', val => new Date(val.expiry) < new Date());
createSimpleMatcher('verified', 'verified', val => val.emailVerified === true);

Conditions.whenState(() => user.value, {
  'premium':  { textContent: 'PRO Member', style: { color: 'gold' } },
  'expired':  { textContent: 'Plan Expired', style: { color: 'red' } },
  'verified': { textContent: 'Verified', style: { color: 'green' } },
  'default':  { textContent: 'Free User', style: { color: 'gray' } }
}, '#userBadge');
```

### Example 5: Quick Handlers with createSimpleHandler()

```javascript
createSimpleHandler('visibility', 'visibility', (el, visible) => {
  el.style.display = visible ? '' : 'none';
});

createSimpleHandler('highlight', 'highlight', (el, color) => {
  el.style.backgroundColor = color;
  el.style.transition = 'background-color 0.3s';
});

// Use them in configs
Conditions.whenState(() => mode.value, {
  'edit': { visibility: true, highlight: '#ffffcc' },
  'view': { visibility: true, highlight: 'transparent' },
  'hidden': { visibility: false }
}, '#editor');
```

### Example 6: Chaining Registrations

All registration methods return the API, so you can chain them:

```javascript
ConditionsExtensions
  .registerMatcher('even', {
    test: (c) => c === 'even',
    match: (v) => v % 2 === 0
  })
  .registerMatcher('odd', {
    test: (c) => c === 'odd',
    match: (v) => v % 2 !== 0
  })
  .registerHandler('tooltip', {
    test: (key) => key === 'tooltip',
    apply: (el, val) => el.setAttribute('title', val)
  });
```

### Example 7: Checking Before Registering

Avoid duplicate registrations by checking first:

```javascript
if (!hasMatcher('weekday')) {
  registerMatcher('weekday', {
    test: (condition) => condition === 'weekday',
    match: (value) => {
      const day = new Date(value).getDay();
      return day >= 1 && day <= 5;
    }
  });
}

if (!hasHandler('tooltip')) {
  registerHandler('tooltip', {
    test: (key) => key === 'tooltip',
    apply: (el, val) => el.setAttribute('title', val)
  });
}
```

### Example 8: Debugging with listExtensions()

See everything that's registered:

```javascript
listExtensions();
// [Conditions.Extensions] Registered Extensions
//   Matchers (22): ['booleanTrue', 'booleanFalse', 'truthy', 'falsy',
//                   'null', 'undefined', 'empty', ..., 'weekday', 'even', 'odd']
//   Handlers (13): ['style', 'classList', 'setAttribute', 'removeAttribute',
//                   'dataset', 'addEventListener', ..., 'tooltip', 'visibility']
```

---

## Alternative: Conditions Directly in the Config

Before reaching for a custom matcher, consider whether you can solve the problem with **built-in features**. The Conditions module already supports several powerful patterns.

### Computed Value Function

Instead of a custom matcher, compute the answer in the value function:

```javascript
// Instead of a custom 'weekday' matcher:
Conditions.whenState(
  () => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5;  // Returns true/false
  },
  {
    'true':  { textContent: 'Workday' },
    'false': { textContent: 'Weekend' }
  },
  '#dayBadge'
);
```

### Computed Category

Return a category string from the value function:

```javascript
// Instead of a custom 'season' matcher:
Conditions.whenState(
  () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  },
  {
    'spring': { textContent: 'Spring', style: { color: 'pink' } },
    'summer': { textContent: 'Summer', style: { color: 'orange' } },
    'fall':   { textContent: 'Fall',   style: { color: 'brown' } },
    'winter': { textContent: 'Winter', style: { color: 'blue' } }
  },
  '#seasonBadge'
);
```

### Built-in Matchers

The Conditions module already handles many patterns:

```javascript
// Numeric ranges — no custom matcher needed
{ '>=90': {...}, '>=80': {...}, '>=70': {...} }

// String patterns — no custom matcher needed
{ 'includes:error': {...}, 'startsWith:http': {...}, 'endsWith:.pdf': {...} }

// Regex — no custom matcher needed
{ '/^[A-Z]/': {...}, '/\\d{3}/': {...} }

// Boolean — no custom matcher needed
{ 'true': {...}, 'false': {...}, 'truthy': {...}, 'falsy': {...} }
```

---

## When to Use Custom Matchers vs Direct Approach

| Scenario | Custom Matcher | Direct (computed value) |
|----------|---------------|------------------------|
| Logic used in **1-2 places** | Unnecessary | Use computed value function |
| Logic used in **5+ places** | Keeps code DRY | Repeated logic in each call |
| **Built-in matcher** covers it | Don't reinvent | Use what's there |
| **Complex domain logic** | Encapsulates cleanly | Can get messy inline |
| **Team standardization** | Everyone uses same keyword | Less consistency |
| **Prototyping** / early dev | Premature abstraction | Keep it inline |

---

## Best Practices

### 1. Start Without Custom Matchers

Begin with computed values or built-in matchers. Extract to a custom matcher only when you find yourself repeating the same logic:

```javascript
// ✅ Start here (inline)
Conditions.whenState(
  () => user.age >= 18,
  { 'true': { textContent: 'Adult' }, 'false': { textContent: 'Minor' } },
  '#ageBadge'
);

// ✅ Extract later (if used in 3+ places)
createSimpleMatcher('adult', 'adult', val => val >= 18);
```

### 2. Use createSimpleMatcher for Keyword Matchers

If your matcher just checks a single keyword, use the helper:

```javascript
// ✅ Clean and concise
createSimpleMatcher('positive', 'positive', val => val > 0);

// ❌ Unnecessarily verbose for a simple case
registerMatcher('positive', {
  test: (condition) => condition === 'positive',
  match: (value) => value > 0
});
```

### 3. Use registerMatchers for Related Sets

Group related matchers together:

```javascript
// ✅ Grouped — clear and organized
registerMatchers({
  even:     { test: (c) => c === 'even',     match: (v) => v % 2 === 0 },
  odd:      { test: (c) => c === 'odd',      match: (v) => v % 2 !== 0 },
  positive: { test: (c) => c === 'positive', match: (v) => v > 0 },
  negative: { test: (c) => c === 'negative', match: (v) => v < 0 }
});
```

### 4. Check Before Registering

Prevent duplicate registration with `hasMatcher()`:

```javascript
// ✅ Safe — won't register twice
if (!hasMatcher('weekday')) {
  registerMatcher('weekday', { test: ..., match: ... });
}
```

### 5. Use listExtensions() for Debugging

When a condition isn't matching as expected, check what's registered:

```javascript
// ✅ Quick diagnostic
listExtensions();
// Shows all matchers and handlers — verify yours is listed
```

### 6. Keep Matcher Logic Pure

Matchers should be **pure functions** — no side effects, no DOM access, no state mutation:

```javascript
// ✅ Pure — only checks the value
registerMatcher('adult', {
  test: (c) => c === 'adult',
  match: (v) => v >= 18
});

// ❌ Side effect in matcher — don't do this
registerMatcher('adult', {
  test: (c) => c === 'adult',
  match: (v) => {
    console.log('Checking age...');  // Side effect
    document.title = 'Checking...';   // Side effect
    return v >= 18;
  }
});
```

### 7. Keep Handler Logic Focused

Handlers should only modify the target element — not other elements or global state:

```javascript
// ✅ Focused — only modifies the target element
createSimpleHandler('tooltip', 'tooltip', (el, text) => {
  el.setAttribute('title', text);
});

// ❌ Modifying other elements — unexpected
createSimpleHandler('tooltip', 'tooltip', (el, text) => {
  el.setAttribute('title', text);
  document.body.classList.add('has-tooltips');  // Side effect
});
```

---

## Summary

| Function | Purpose | Returns |
|----------|---------|---------|
| `registerMatcher(name, {test, match})` | Register one matcher | Chainable API |
| `registerHandler(name, {test, apply})` | Register one handler | Chainable API |
| `registerMatchers({...})` | Register multiple matchers | Chainable API |
| `registerHandlers({...})` | Register multiple handlers | Chainable API |
| `createSimpleMatcher(name, keyword, fn)` | Quick keyword matcher | Chainable API |
| `createSimpleHandler(name, key, fn)` | Quick property handler | Chainable API |
| `getMatchers()` | List matcher names | `string[]` |
| `getHandlers()` | List handler names | `string[]` |
| `hasMatcher(name)` | Check if matcher exists | `boolean` |
| `hasHandler(name)` | Check if handler exists | `boolean` |
| `listExtensions()` | Print all to console | Chainable API |

| Access Path | Example |
|-------------|---------|
| **Global** | `registerMatcher(...)` |
| **ConditionsExtensions** | `ConditionsExtensions.registerMatcher(...)` |
| **Conditions.extensions** | `Conditions.extensions.registerMatcher(...)` |
| **Elements** | `Elements.registerMatcher(...)` (if loaded) |
| **Collections** | `Collections.registerMatcher(...)` (if loaded) |

> **Simple Rule to Remember:** Use `createSimpleMatcher()` for quick keyword matchers, `registerMatchers()` for batch registration, and `hasMatcher()` before registering to avoid duplicates. Start with built-in matchers and computed values — only create custom matchers when you're repeating the same logic across multiple places in your code.