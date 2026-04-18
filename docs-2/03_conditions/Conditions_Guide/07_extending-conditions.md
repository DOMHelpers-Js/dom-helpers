[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Extending Conditions

## Quick Start (30 seconds)

```javascript
// Register a custom condition matcher
Conditions.registerMatcher('divisibleBy', {
  test:  (key) => key.startsWith('divisibleBy:'),
  match: (value, key) => {
    const divisor = Number(key.replace('divisibleBy:', ''));
    return value % divisor === 0;
  }
});

// Use it immediately
Conditions.whenState(
  () => counter.value,
  {
    'divisibleBy:3': { '#label': { textContent: 'Fizz' } },
    'divisibleBy:5': { '#label': { textContent: 'Buzz' } },
    default:         { '#label': { textContent: String(counter.value) } }
  }
);

// Register a custom property handler
Conditions.registerHandler('scrollTo', {
  test:  (key) => key === 'scrollTo',
  apply: (element, key, value) => {
    element.scrollTop = typeof value === 'number' ? value : 0;
  }
});

// Use it immediately
{ '#container': { scrollTo: 0 } }   // scrolls element to top
```

---

## Why Extend?

The built-in condition matchers and property handlers cover the vast majority of everyday cases. But every project is different — you may have domain-specific matching needs or DOM operations that don't map cleanly to built-in handlers.

The extension system lets you **add new matchers and handlers without modifying the library source**. Your extensions slot directly into the same pipeline as built-in ones.

Think of it as plugins: you write the logic once, register it, and from that point on it works identically to any built-in feature throughout your entire application.

---

## `Conditions.registerMatcher()` — Custom Condition Matchers

### What It Does

Adds a new strategy to the **condition matcher registry**. Once registered, any key in a conditions object that your matcher claims will be evaluated using your logic.

### Syntax

```javascript
Conditions.registerMatcher(name, { test, match })
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Unique name for this matcher (for inspection with `getMatchers()`) |
| `test` | `Function(key) → boolean` | Returns `true` if this matcher should handle this key format |
| `match` | `Function(value, key) → boolean` | Returns `true` if the current value satisfies this condition |

### The Two Functions Explained

**`test(key)`** — the gatekeeper:
- Receives the condition key string (e.g., `'divisibleBy:3'`, `'>10'`, `'loading'`)
- Returns `true` if this matcher should handle it, `false` to pass to the next matcher
- Think of it as: "Is this key in MY format?"

**`match(value, key)`** — the evaluator:
- Receives the current value (what `getValue()` returned) and the key
- Returns `true` if the condition is satisfied, `false` if not
- Think of it as: "Does this value satisfy what this key describes?"

### Priority

Custom matchers registered via `registerMatcher()` are inserted **before** the built-in matchers in the registry. This means your custom matchers are checked first — they take priority over built-ins.

If you register multiple custom matchers, they are checked in registration order (first registered = highest priority among custom matchers).

---

## Custom Matcher Examples

### Example 1: Divisible-By Matcher

```javascript
Conditions.registerMatcher('divisibleBy', {
  test(key) {
    return key.startsWith('divisibleBy:');
  },
  match(value, key) {
    const divisor = Number(key.slice('divisibleBy:'.length));
    return Number(value) % divisor === 0;
  }
});

// FizzBuzz with Conditions
const counter = state({ n: 0 });

Conditions.whenState(
  () => counter.n,
  {
    'divisibleBy:15': { '#output': { textContent: 'FizzBuzz' } },
    'divisibleBy:3':  { '#output': { textContent: 'Fizz'     } },
    'divisibleBy:5':  { '#output': { textContent: 'Buzz'     } },
    default:          { '#output': { textContent: String(counter.n) } }
  }
);
```

### Example 2: Between Matcher (Exclusive Range)

The built-in `numericRange` is inclusive. Here's an exclusive version:

```javascript
Conditions.registerMatcher('between', {
  test(key) {
    // Format: 'between:5:10' → 5 < value < 10
    return key.startsWith('between:');
  },
  match(value, key) {
    const parts = key.slice('between:'.length).split(':');
    const [min, max] = parts.map(Number);
    return Number(value) > min && Number(value) < max;
  }
});

Conditions.whenState(
  () => temperature.celsius,
  {
    'between:-50:0':   { '#gauge': { className: 'gauge frozen'  } },
    'between:0:20':    { '#gauge': { className: 'gauge cold'    } },
    'between:20:30':   { '#gauge': { className: 'gauge comfort' } },
    'between:30:50':   { '#gauge': { className: 'gauge hot'     } },
    default:           { '#gauge': { className: 'gauge extreme' } }
  }
);
```

### Example 3: Array Includes Matcher

Check if the value is one of several options:

```javascript
Conditions.registerMatcher('oneOf', {
  test(key) {
    return key.startsWith('oneOf:');
  },
  match(value, key) {
    const options = key.slice('oneOf:'.length).split(',');
    return options.includes(String(value));
  }
});

const lang = state({ code: 'fr' });

Conditions.whenState(
  () => lang.code,
  {
    'oneOf:en,en-US,en-GB': { '#greeting': { textContent: 'Hello'   } },
    'oneOf:fr,fr-FR,fr-CA': { '#greeting': { textContent: 'Bonjour' } },
    'oneOf:es,es-ES,es-MX': { '#greeting': { textContent: 'Hola'    } },
    'oneOf:de,de-DE,de-AT': { '#greeting': { textContent: 'Hallo'   } },
    default:                 { '#greeting': { textContent: 'Hello'   } }
  }
);
```

### Example 4: Custom Domain Object Matcher

For state values that are objects rather than primitives:

```javascript
// Matches when the value object has a specific property set to true
Conditions.registerMatcher('hasFlag', {
  test(key) {
    return key.startsWith('hasFlag:');
  },
  match(value, key) {
    const flag = key.slice('hasFlag:'.length);
    return typeof value === 'object' && value !== null && value[flag] === true;
  }
});

const user = state({ permissions: { canEdit: false, canDelete: false, isAdmin: true } });

Conditions.whenState(
  () => user.permissions,
  {
    'hasFlag:isAdmin':    { '#admin-ui':  { hidden: false } },
    'hasFlag:canDelete':  { '#delete-btn': { hidden: false } },
    'hasFlag:canEdit':    { '#edit-btn':  { hidden: false } },
    default:              { '#admin-ui':  { hidden: true  } }
  }
);
```

### Example 5: Time-Based Matcher

```javascript
// Matches a human-readable time-of-day description
Conditions.registerMatcher('timeOfDay', {
  test(key) {
    return ['morning', 'afternoon', 'evening', 'night'].includes(key);
  },
  match(value, key) {
    // value is expected to be an hour (0-23)
    const hour = Number(value);
    switch (key) {
      case 'morning':   return hour >= 6  && hour < 12;
      case 'afternoon': return hour >= 12 && hour < 17;
      case 'evening':   return hour >= 17 && hour < 21;
      case 'night':     return hour >= 21 || hour < 6;
      default: return false;
    }
  }
});

const clock = state({ hour: new Date().getHours() });

Conditions.whenState(
  () => clock.hour,
  {
    'morning':   { '#greeting': { textContent: 'Good morning!'   } },
    'afternoon': { '#greeting': { textContent: 'Good afternoon!' } },
    'evening':   { '#greeting': { textContent: 'Good evening!'   } },
    'night':     { '#greeting': { textContent: 'Good night!'     } }
  }
);
```

---

## `Conditions.registerHandler()` — Custom Property Handlers

### What It Does

Adds a new strategy to the **property handler registry**. Once registered, any property key in an update object that your handler claims will be processed using your logic.

### Syntax

```javascript
Conditions.registerHandler(name, { test, apply })
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Unique name for this handler (for inspection with `getHandlers()`) |
| `test` | `Function(key) → boolean` | Returns `true` if this handler should process this property key |
| `apply` | `Function(element, key, value) → void` | Performs the DOM update |

### The Two Functions Explained

**`test(key)`** — the gatekeeper:
- Receives the property key string (e.g., `'scrollTo'`, `'animate'`, `'textContent'`)
- Returns `true` if this handler should take over for this key
- Built-in handlers will not be tried if yours returns `true`

**`apply(element, key, value)`** — the updater:
- `element` — the DOM element to update
- `key` — the property key string
- `value` — the value from the update object
- Performs whatever DOM operation you need

### Priority

Custom handlers registered via `registerHandler()` are inserted **before** built-in handlers. They're checked first — you can override built-in behavior by using the same key name (not recommended, but possible).

---

## Custom Handler Examples

### Example 1: `scrollTo` — Scroll an Element

```javascript
Conditions.registerHandler('scrollTo', {
  test(key) { return key === 'scrollTo'; },
  apply(element, key, value) {
    if (typeof value === 'number') {
      element.scrollTop = value;
    } else if (value === 'top') {
      element.scrollTop = 0;
    } else if (value === 'bottom') {
      element.scrollTop = element.scrollHeight;
    }
  }
});

// Usage
Conditions.whenState(
  () => tab.active,
  {
    'tab-1': { '#content': { scrollTo: 'top', hidden: false } },
    'tab-2': { '#content': { scrollTo: 'top', hidden: false } }
  }
);
```

### Example 2: `focus` — Focus an Element

```javascript
Conditions.registerHandler('focus', {
  test(key) { return key === 'focus'; },
  apply(element, key, value) {
    if (value === true) {
      // Defer focus to avoid interrupting the current DOM update
      requestAnimationFrame(() => element.focus());
    }
  }
});

// Usage
Conditions.whenState(
  () => modal.isOpen,
  {
    'true': {
      '#modal':       { hidden: false },
      '#modal-close': { focus: true }   // focus the close button when modal opens
    },
    'false': {
      '#modal': { hidden: true }
    }
  }
);
```

### Example 3: `animate` — Trigger CSS Animations

```javascript
Conditions.registerHandler('animate', {
  test(key) { return key === 'animate'; },
  apply(element, key, value) {
    // value is an animation class name
    element.classList.remove(value);
    // Force reflow to restart animation
    void element.offsetWidth;
    element.classList.add(value);
  }
});

// Usage
Conditions.whenState(
  () => notification.type,
  {
    'error': {
      '#notification': {
        textContent: 'Error occurred',
        className: 'notification error',
        animate: 'shake'   // triggers the 'shake' CSS animation
      }
    },
    'success': {
      '#notification': {
        textContent: 'Saved!',
        className: 'notification success',
        animate: 'pop-in'
      }
    }
  }
);
```

### Example 4: `innerMarkdown` — Render Markdown to innerHTML

```javascript
// Assuming a simple markdown-to-html function is available
Conditions.registerHandler('innerMarkdown', {
  test(key) { return key === 'innerMarkdown'; },
  apply(element, key, value) {
    // Use whatever markdown library you have available
    element.innerHTML = markdownToHTML(value);
  }
});

// Usage
Conditions.whenState(
  () => doc.format,
  {
    'markdown': { '#viewer': { innerMarkdown: doc.content } },
    'html':     { '#viewer': { innerHTML: doc.content } },
    'text':     { '#viewer': { textContent: doc.content } }
  }
);
```

### Example 5: `setProperties` — Apply Multiple Native Properties from an Object

```javascript
Conditions.registerHandler('setProperties', {
  test(key) { return key === 'setProperties'; },
  apply(element, key, value) {
    // value is an object of { propertyName: propertyValue }
    Object.entries(value).forEach(([prop, val]) => {
      element[prop] = val;
    });
  }
});

// Usage — handy for form input management
Conditions.whenState(
  () => field.mode,
  {
    'readonly': {
      '#input': {
        setProperties: { readOnly: true, disabled: false, tabIndex: -1 }
      }
    },
    'editable': {
      '#input': {
        setProperties: { readOnly: false, disabled: false, tabIndex: 0 }
      }
    },
    'disabled': {
      '#input': {
        setProperties: { readOnly: true, disabled: true, tabIndex: -1 }
      }
    }
  }
);
```

---

## Inspecting the Registry

### `Conditions.getMatchers()`

Returns an array of all registered matcher names, in priority order:

```javascript
const matchers = Conditions.getMatchers();
console.log(matchers);
// → ['divisibleBy', 'timeOfDay', 'oneOf', 'booleanTrue', 'booleanFalse', 'truthy', ...]
//     ^ custom (registered first)                 ^ built-in (registered after)
```

Useful for debugging — see exactly what's in the pipeline and in what order.

### `Conditions.getHandlers()`

Returns an array of all registered handler names, in priority order:

```javascript
const handlers = Conditions.getHandlers();
console.log(handlers);
// → ['scrollTo', 'focus', 'animate', 'style', 'classList', 'setAttribute', ...]
//     ^ custom                                  ^ built-in
```

---

## Writing Good Matchers and Handlers

### For Matchers

**`test()` should be cheap:**

```javascript
// ✅ Fast — simple string check
test(key) { return key.startsWith('divisibleBy:'); }

// ✅ Fast — exact match check
test(key) { return key === 'morning' || key === 'afternoon'; }

// ⚠️ Avoid heavy work in test() — it runs for every key in every conditions object
test(key) { return someExpensiveRegex.test(key); }  // not ideal
```

**`match()` should be pure:**

```javascript
// ✅ Pure — only reads value and key, returns boolean
match(value, key) {
  const n = Number(key.slice('divisibleBy:'.length));
  return Number(value) % n === 0;
}

// ❌ Avoid side effects in match()
match(value, key) {
  analytics.track('condition-check');   // side effect — don't do this
  return value === key;
}
```

### For Handlers

**`apply()` should be focused:**

```javascript
// ✅ Focused — one clear responsibility
apply(element, key, value) {
  element.scrollTop = typeof value === 'number' ? value : 0;
}

// ✅ Guard against invalid values gracefully
apply(element, key, value) {
  if (typeof value !== 'string') return;
  element.classList.remove(value);
  void element.offsetWidth;
  element.classList.add(value);
}

// ❌ Avoid mutating state inside handlers — keep them DOM-only
apply(element, key, value) {
  app.status = 'applied';  // side effect — don't mutate reactive state here
  element.textContent = value;
}
```

**Handle edge cases defensively:**

```javascript
apply(element, key, value) {
  if (!element || value === undefined || value === null) return;
  // ... safe to proceed
}
```

---

## Organizing Extensions

For a larger project, organize your custom matchers and handlers in a dedicated file:

```javascript
// conditions-extensions.js

// Load after the main Conditions module
// <script src="01_dh-conditional-rendering.js"></script>
// <script src="02_dh-conditions-default.js"></script>
// <script src="conditions-extensions.js"></script>   ← yours

// ── Custom Matchers ──────────────────────────────────────

Conditions.registerMatcher('oneOf', {
  test(key) { return key.startsWith('oneOf:'); },
  match(value, key) {
    return key.slice('oneOf:'.length).split(',').includes(String(value));
  }
});

Conditions.registerMatcher('between', {
  test(key) { return key.startsWith('between:'); },
  match(value, key) {
    const [min, max] = key.slice('between:'.length).split(':').map(Number);
    return Number(value) > min && Number(value) < max;
  }
});

// ── Custom Handlers ──────────────────────────────────────

Conditions.registerHandler('scrollTo', {
  test(key) { return key === 'scrollTo'; },
  apply(element, key, value) {
    element.scrollTop = value === 'top' ? 0 : value === 'bottom' ? element.scrollHeight : Number(value);
  }
});

Conditions.registerHandler('focus', {
  test(key) { return key === 'focus'; },
  apply(element, key, value) {
    if (value) requestAnimationFrame(() => element.focus());
  }
});
```

This keeps your extensions together and makes them easy to find, modify, and test.

---

## Summary

- **`Conditions.registerMatcher(name, { test, match })`** — adds a custom condition matcher to the registry; tested before built-ins (highest priority)
- **`Conditions.registerHandler(name, { test, apply })`** — adds a custom property handler to the registry; tested before built-ins
- The **`test` function** is the gatekeeper — it examines the key string and returns `true` to claim it
- The **`match` function** (matchers) evaluates whether the value satisfies the condition
- The **`apply` function** (handlers) performs the actual DOM update
- **`Conditions.getMatchers()`** and **`Conditions.getHandlers()`** return the full registry for debugging
- Extensions are ideal for: domain-specific comparison logic, animation triggers, scroll control, focus management, custom DOM operations
- Keep `test()` and `match()` pure and cheap; keep `apply()` focused on DOM-only operations

---

Continue to: [08 — Real-World Patterns](./08_real-world-patterns.md)