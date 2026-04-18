[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Extensibility and Best Practices

## Quick Start (30 seconds)

```javascript
// Register a custom condition matcher
Conditions.registerMatcher('evenNumber', {
  test: (condition) => condition === 'even',
  match: (value) => typeof value === 'number' && value % 2 === 0
});

// Register a custom property handler
Conditions.registerHandler('tooltip', {
  test: (key) => key === 'tooltip',
  apply: (element, value) => {
    element.setAttribute('data-tooltip', value);
    element.classList.add('has-tooltip');
  }
});

// Use them
Conditions.apply(4, {
  'even': { tooltip: 'This number is even!' }
}, '#numberDisplay');
```

---

## Custom Condition Matchers

### What Are They?

The module comes with built-in matchers for booleans, strings, numbers, regex, etc. But sometimes you need to match values in a way the built-in matchers don't support. **Custom matchers** let you add your own matching rules.

### registerMatcher(name, matcher)

```javascript
Conditions.registerMatcher(name, {
  test: (condition, value) => boolean,   // Does this matcher apply?
  match: (value, condition) => boolean   // Does the value match?
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Unique name for the matcher |
| `matcher.test` | `Function` | Returns `true` if this matcher should handle the condition key |
| `matcher.match` | `Function` | Returns `true` if the value satisfies the condition |

**Returns:** `Conditions` (for chaining).

### How test() and match() Work Together

```
For each condition key in the map:
   ↓
1️⃣ test(conditionKey, value) → Should this matcher handle this key?
   ├── false → Skip, try next matcher
   └── true → Continue to step 2
   ↓
2️⃣ match(value, conditionKey) → Does the value satisfy this condition?
   ├── true → Apply the config ✅
   └── false → Condition not met, try next condition in map
```

- `test()` checks if the **condition key** is one this matcher understands (e.g., is it the word `'even'`?)
- `match()` checks if the **actual value** satisfies that condition (e.g., is the number even?)

---

### Example 1: Even/Odd Numbers

```javascript
Conditions.registerMatcher('evenNumber', {
  test: (condition) => condition === 'even',
  match: (value) => typeof value === 'number' && value % 2 === 0
});

Conditions.registerMatcher('oddNumber', {
  test: (condition) => condition === 'odd',
  match: (value) => typeof value === 'number' && value % 2 !== 0
});

// Use them
const count = state(0);

Conditions.whenState(
  () => count.value,
  {
    'even': { style: { backgroundColor: 'lightblue' } },
    'odd':  { style: { backgroundColor: 'lightcoral' } }
  },
  '#counter'
);
```

### Example 2: Business Hours

```javascript
Conditions.registerMatcher('businessHours', {
  test: (condition) => condition === 'business-hours',
  match: (value) => {
    const hour = new Date(value).getHours();
    return hour >= 9 && hour < 17;
  }
});

Conditions.apply(new Date(), {
  'business-hours': {
    textContent: 'We are OPEN',
    style: { color: 'green' }
  },
  'truthy': {
    textContent: 'We are CLOSED',
    style: { color: 'red' }
  }
}, '#storeStatus');
```

### Example 3: Array Length Matcher

```javascript
Conditions.registerMatcher('arrayEmpty', {
  test: (condition) => condition === 'no-items',
  match: (value) => Array.isArray(value) && value.length === 0
});

Conditions.registerMatcher('arrayHasItems', {
  test: (condition) => condition === 'has-items',
  match: (value) => Array.isArray(value) && value.length > 0
});

Conditions.whenState(
  () => cartItems.value,
  {
    'no-items':  { textContent: 'Cart is empty',  style: { color: 'gray' } },
    'has-items': { textContent: 'Items in cart!',  style: { color: 'green' } }
  },
  '#cartStatus'
);
```

---

## Custom Property Handlers

### What Are They?

Property handlers control how config properties are applied to elements. The built-in ones handle `style`, `classList`, `dataset`, `setAttribute`, etc. Custom handlers let you add support for new property types.

### registerHandler(name, handler)

```javascript
Conditions.registerHandler(name, {
  test: (key, value, element) => boolean,  // Does this handler apply?
  apply: (element, value, key) => void     // How to apply it
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Unique name for the handler |
| `handler.test` | `Function` | Returns `true` if this handler should process the key |
| `handler.apply` | `Function` | Applies the value to the element |

**Returns:** `Conditions` (for chaining).

Custom handlers are inserted **before** the fallback handler, so they take priority over the generic attribute setter.

---

### Example 1: Tooltip Handler

```javascript
Conditions.registerHandler('tooltip', {
  test: (key) => key === 'tooltip',
  apply: (element, value) => {
    element.setAttribute('data-tooltip', value);
    element.classList.add('has-tooltip');
  }
});

Conditions.apply('info', {
  'info': {
    tooltip: 'This is helpful information',
    style: { color: 'blue' }
  },
  'warning': {
    tooltip: 'Please be careful',
    style: { color: 'orange' }
  }
}, '.message');
```

### Example 2: Animation Handler

```javascript
Conditions.registerHandler('animate', {
  test: (key) => key === 'animate',
  apply: (element, value) => {
    element.style.animation = 'none';
    // Force reflow to restart animation
    element.offsetHeight;
    element.style.animation = value;
  }
});

Conditions.apply('success', {
  'success': {
    textContent: 'Saved!',
    animate: 'fadeIn 0.5s ease-in-out'
  },
  'error': {
    textContent: 'Error!',
    animate: 'shake 0.3s ease-in-out'
  }
}, '#notification');
```

### Example 3: Visibility Handler

```javascript
Conditions.registerHandler('visibility', {
  test: (key) => key === 'visible',
  apply: (element, value) => {
    element.style.display = value ? '' : 'none';
    element.setAttribute('aria-hidden', value ? 'false' : 'true');
  }
});

Conditions.apply(isLoggedIn, {
  'true':  { visible: true,  textContent: 'Welcome back!' },
  'false': { visible: false }
}, '#welcomeBanner');
```

---

## Inspecting Registered Matchers and Handlers

### getMatchers()

Returns the names of all registered condition matchers:

```javascript
console.log(Conditions.getMatchers());
// ['booleanTrue', 'booleanFalse', 'truthy', 'falsy', 'null', 'undefined',
//  'empty', 'quotedString', 'includes', 'startsWith', 'endsWith', 'regex',
//  'numericRange', 'numericExact', 'greaterThanOrEqual', 'lessThanOrEqual',
//  'greaterThan', 'lessThan', 'stringEquality',
//  'evenNumber', 'oddNumber', ...]  ← your custom matchers appear here
```

### getHandlers()

Returns the names of all registered property handlers:

```javascript
console.log(Conditions.getHandlers());
// ['style', 'classList', 'setAttribute', 'removeAttribute', 'dataset',
//  'addEventListener', 'removeEventListener', 'eventProperty',
//  'nativeProperty', 'tooltip', 'animate', ..., 'fallback']
//                     ↑ your custom handlers appear before 'fallback'
```

---

## Module Properties

### Conditions.hasReactivity

Check if the reactive library is available:

```javascript
if (Conditions.hasReactivity) {
  // Can use whenState() and watch() with auto-updates
  Conditions.watch(() => theme.value, conditions, 'body');
} else {
  // Static mode only
  Conditions.apply(currentTheme, conditions, 'body');
}
```

### Conditions.mode

Get the current operating mode as a string:

```javascript
console.log(Conditions.mode);  // 'reactive' or 'static'
```

---

## Best Practices

### 1. Order Conditions from Most Specific to Least

```javascript
// ✅ Correct — specific first
{
  '>=90':  { textContent: 'A' },
  '>=80':  { textContent: 'B' },
  '>=70':  { textContent: 'C' },
  'truthy': { textContent: 'F' }
}

// ❌ Wrong — 'truthy' catches everything
{
  'truthy': { textContent: 'F' },    // Always matches first!
  '>=90':  { textContent: 'A' }      // Never reached
}
```

### 2. Use apply() for One-Time Setups

```javascript
// ✅ Use apply() when you don't need reactivity
Conditions.apply(userRole, {
  'admin': { classList: { add: 'admin-tools-visible' } },
  'user':  { classList: { add: 'user-tools-visible' } }
}, '#toolbar');
```

### 3. Clean Up Watchers When Done

```javascript
// ✅ Save cleanup function and call it when navigating away
const cleanup = Conditions.whenState(
  () => pageState.value,
  conditions,
  '#pageContent'
);

// When leaving the page
function onNavigateAway() {
  cleanup();
}
```

### 4. Use batch() for Multiple State Changes

```javascript
// ✅ One DOM update instead of three
Conditions.batch(() => {
  status.value = 'complete';
  count.value = 0;
  message.value = 'Done!';
});
```

### 5. Use 'truthy' or 'falsy' as Catch-All

```javascript
// ✅ 'truthy' as fallback catches any unmatched truthy value
{
  'active':  { ... },
  'pending': { ... },
  'truthy':  { ... }   // Catches any other non-empty/non-false value
}

// ✅ 'empty' as fallback catches null/undefined/empty states
{
  'active':  { ... },
  'pending': { ... },
  'empty':   { ... }   // Catches null, undefined, '', [], {}
}
```

### 6. Keep Configs Focused

```javascript
// ✅ Clean and focused
{
  'online':  { textContent: 'Online',  style: { color: 'green' } },
  'offline': { textContent: 'Offline', style: { color: 'red' } }
}

// ❌ Too many unrelated properties in one condition
{
  'online': {
    textContent: 'Online',
    style: { color: 'green', fontSize: '14px', margin: '8px', padding: '4px',
             border: '1px solid', borderRadius: '4px', boxShadow: '0 2px 4px' },
    classList: { add: ['a', 'b', 'c', 'd'], remove: ['e', 'f'] },
    dataset: { status: 'online', ts: Date.now(), user: 'admin' },
    setAttribute: { 'aria-label': '...', role: '...', tabindex: '0' }
  }
}
// If a config gets this large, consider using CSS classes instead
```

---

## Complete API Reference

| Method / Property | Type | Description |
|-------------------|------|-------------|
| `Conditions.whenState(valueFn, conditions, selector, options)` | Method | Smart mode — auto-detects reactivity |
| `Conditions.apply(value, conditions, selector)` | Method | One-time application |
| `Conditions.watch(valueFn, conditions, selector)` | Method | Explicitly reactive |
| `Conditions.batch(fn)` | Method | Group state changes |
| `Conditions.registerMatcher(name, matcher)` | Method | Add custom condition matcher |
| `Conditions.registerHandler(name, handler)` | Method | Add custom property handler |
| `Conditions.getMatchers()` | Method | List all matcher names |
| `Conditions.getHandlers()` | Method | List all handler names |
| `Conditions.hasReactivity` | Getter | `true` if reactive library available |
| `Conditions.mode` | Getter | `'reactive'` or `'static'` |

**Also available via:**

```javascript
Elements.whenState()   / Elements.whenApply()   / Elements.whenWatch()
Collections.whenState() / Collections.whenApply() / Collections.whenWatch()
Selector.whenState()   / Selector.whenApply()   / Selector.whenWatch()
```

---

## Dependencies

| Dependency | Required? | What It Provides |
|-----------|----------|-----------------|
| **ReactiveUtils** / reactive library | Optional | Enables reactive mode (`effect`, `batch`) |
| **Elements** | Optional | Optimized ID lookups, `.update()` on elements |
| **Collections** | Optional | Optimized class/tag lookups |
| **Selector** | Optional | Optimized CSS query lookups |

The module works **standalone in static mode** with no dependencies at all. The optional dependencies enhance its capabilities.

---

## Summary

| Category | Key Takeaway |
|----------|-------------|
| **Custom matchers** | `registerMatcher()` — add new condition matching rules |
| **Custom handlers** | `registerHandler()` — add new property application rules |
| **Inspection** | `getMatchers()` / `getHandlers()` — list all registered names |
| **Mode check** | `hasReactivity` / `mode` — check what's available |
| **Best practices** | Specific conditions first, clean up watchers, batch state changes, use `'truthy'` as catch-all |

> **Simple Rule to Remember:** The module is built on two registries — **matchers** decide which condition matches, **handlers** decide how to apply the config. Both are extensible with `registerMatcher()` and `registerHandler()`. Put specific conditions before generic ones, and let `'truthy'` or `'empty'` catch anything that falls through.