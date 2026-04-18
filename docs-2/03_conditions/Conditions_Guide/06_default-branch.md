[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# The `default` Branch

## Quick Start (30 seconds)

```javascript
// Load this file after the main Conditions module:
// <script src="01_dh-conditional-rendering.js"></script>
// <script src="02_dh-conditions-default.js"></script>

const app = state({ status: 'idle' });

Conditions.whenState(
  () => app.status,
  {
    'loading': { '#panel': { textContent: 'Loading…', className: 'panel loading' } },
    'error':   { '#panel': { textContent: 'Failed.',  className: 'panel error'   } },
    default:   { '#panel': { textContent: 'Ready.',   className: 'panel'         } }
    //          ↑ catches anything not explicitly listed above — 'idle', 'success', or any future state
  }
);

app.status = 'idle';    // → matches default → 'Ready.'
app.status = 'loading'; // → matches 'loading' → 'Loading…'
app.status = 'unknown'; // → matches default → 'Ready.'
```

A safety net at the bottom of your conditions table.

---

## What is the `default` Branch?

The `default` branch is a **catch-all condition** — a key that matches any value not already matched by a previous condition in the object. It's the "else" clause of your conditions table.

```javascript
{
  'loading': { ... },   // matches 'loading'
  'error':   { ... },   // matches 'error'
  default:   { ... }    // matches EVERYTHING else
}
```

Think of it like a `switch` statement's `default` case:

```javascript
// Regular switch
switch (status) {
  case 'loading': /* ... */ break;
  case 'error':   /* ... */ break;
  default:        /* ... */
}

// Conditions equivalent
Conditions.whenState(() => status, {
  'loading': { ... },
  'error':   { ... },
  default:   { ... }
});
```

Same concept. One familiar mental model.

---

## Loading the Default Extension

The `default` branch is provided by a **separate file**: `02_dh-conditions-default.js`. It must be loaded after the main Conditions module.

```html
<!-- Required: main module first -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- Optional: adds default branch support -->
<script src="02_dh-conditions-default.js"></script>
```

Once loaded, `default` becomes a valid key in any conditions object you write — no other changes needed.

### Why Is It Separate?

The `default` key is an **extension** to the core system rather than a built-in feature. This design keeps the core module focused and lean. Projects that don't need a catch-all simply don't load the second file. Projects that do load it get the feature without any trade-offs.

---

## How `default` Works Internally

When `02_dh-conditions-default.js` loads, it:

1. **Saves the original** `whenState()`, `apply()`, and `watch()` methods
2. **Wraps them** with new versions that pre-process the conditions object
3. If the conditions object contains a `default` key:
   - Removes the `default` key from the object
   - Re-inserts it at the **end** with the key changed to `'/^[\s\S]*$/'`
   - This regex matches any string — it's a universal catch-all
4. Calls the original method with the transformed conditions object

```
Your input:
{
  'loading': { ... },
  'error':   { ... },
  default:   { ... }   ← you write this
}

After transformation:
{
  'loading':       { ... },
  'error':         { ... },
  '/^[\\s\\S]*$/': { ... }   ← system converts to regex catch-all
}
```

The regex `/^[\s\S]*$/` matches any string of any length (including empty string) — so it always matches whatever value the conditions system receives if no earlier key did.

**Important:** The `default` key is always moved to the **very end** of the conditions object. This ensures it only fires if nothing else matched. You don't have to worry about placement — write `default` wherever feels natural and it will always become the last check.

---

## Placement Flexibility

Because the extension automatically moves `default` to the end, you can write it in any position:

```javascript
// All three are equivalent — default always ends up last
{
  default:   { ... },   // at the start
  'loading': { ... },
  'error':   { ... }
}

{
  'loading': { ... },
  default:   { ... },   // in the middle
  'error':   { ... }
}

{
  'loading': { ... },
  'error':   { ... },
  default:   { ... }    // at the end (most readable — recommended)
}
```

For readability, put `default` last — it reads naturally as "and for everything else…"

---

## Basic Usage Patterns

### Pattern 1: Catch Unknown States

Defensive programming — handle the known cases, catch anything unexpected:

```javascript
const op = state({ status: 'idle' });

Conditions.whenState(
  () => op.status,
  {
    'loading': {
      '#status-icon': { className: 'icon spinning' },
      '#status-text': { textContent: 'Loading…' }
    },
    'success': {
      '#status-icon': { className: 'icon check-green' },
      '#status-text': { textContent: 'Done!' }
    },
    'error': {
      '#status-icon': { className: 'icon x-red' },
      '#status-text': { textContent: 'Failed' }
    },
    default: {
      '#status-icon': { className: 'icon idle' },
      '#status-text': { textContent: 'Ready' }
    }
  }
);
```

Now if `op.status` ever becomes something unexpected (a typo, a new value from an API, a regression), the UI falls back to "Ready" rather than leaving stale state on screen.

### Pattern 2: Reduce Repetition

When many values share the same visual output, use `default` instead of listing each:

```javascript
// Without default — listing all similar states explicitly
{
  'idle':     { '#panel': { className: 'panel neutral' } },
  'ready':    { '#panel': { className: 'panel neutral' } },
  'waiting':  { '#panel': { className: 'panel neutral' } },
  'paused':   { '#panel': { className: 'panel neutral' } },
  'loading':  { '#panel': { className: 'panel active' } },
  'error':    { '#panel': { className: 'panel error'  } }
}

// With default — only handle the special cases
{
  'loading': { '#panel': { className: 'panel active'  } },
  'error':   { '#panel': { className: 'panel error'   } },
  default:   { '#panel': { className: 'panel neutral' } }
}
```

Cleaner, shorter, and any new neutral states are handled automatically.

### Pattern 3: Boolean Shorthand

For simple boolean conditions, `default` handles the case you don't want to name:

```javascript
const modal = state({ isOpen: false });

Conditions.whenState(
  () => modal.isOpen,
  {
    'true': {
      '#modal':   { hidden: false },
      '#overlay': { hidden: false }
    },
    default: {
      '#modal':   { hidden: true },
      '#overlay': { hidden: true }
    }
  }
);

// default covers false, undefined, null, and anything else
```

### Pattern 4: Graceful Degradation with API Data

When working with data from an API that might have unexpected values:

```javascript
const event = state({ priority: 'normal' });

Conditions.whenState(
  () => event.priority,
  {
    'critical': {
      '#priority-badge': { textContent: 'CRITICAL', className: 'badge badge-red pulse' }
    },
    'high': {
      '#priority-badge': { textContent: 'HIGH', className: 'badge badge-orange' }
    },
    'normal': {
      '#priority-badge': { textContent: 'Normal', className: 'badge badge-blue' }
    },
    'low': {
      '#priority-badge': { textContent: 'Low', className: 'badge badge-gray' }
    },
    default: {
      // API returned something unexpected — show a safe fallback
      '#priority-badge': { textContent: 'Unknown', className: 'badge badge-gray' }
    }
  }
);
```

---

## `default` with `apply()`

`default` works the same way with `apply()`:

```javascript
// Apply a value directly — default catches if the value isn't explicitly listed
Conditions.apply('unknown-status', {
  'loading': { '#msg': { textContent: 'Loading…' } },
  'done':    { '#msg': { textContent: 'Done!'    } },
  default:   { '#msg': { textContent: 'Ready.'   } }
});
// 'unknown-status' doesn't match 'loading' or 'done' → matches default
// → #msg shows 'Ready.'
```

---

## What `default` Does NOT Do

### It doesn't prevent earlier conditions from matching

`default` is always checked last. If any earlier condition matches, `default` never runs:

```javascript
{
  'loading': { '#msg': { textContent: 'Loading…' } },   // checked 1st
  default:   { '#msg': { textContent: 'Ready.'   } }    // checked 2nd (only if 'loading' didn't match)
}

// app.status = 'loading' → matches 'loading', default never runs
// app.status = 'idle'    → 'loading' doesn't match → default runs
```

### It doesn't merge with other conditions

Only the **first** matching condition applies. `default` does not combine with a more specific match — it's one or the other:

```javascript
{
  'error': { '#icon': { className: 'icon-error' }, '#msg': { textContent: 'Failed' } },
  default: { '#icon': { className: 'icon-ok'    }, '#msg': { textContent: 'Ready'  } }
}

// When status is 'error':
//   → 'error' matches
//   → icon becomes 'icon-error', msg becomes 'Failed'
//   → default does NOT also run
//   → icon is NOT also set to 'icon-ok'
```

### It doesn't apply when nothing is there

If you don't include `default` in your conditions object, and no key matches, **nothing happens** — the DOM is simply not updated. This is valid behavior, not an error.

---

## Checking If the Extension Is Loaded

If you're writing code that might run with or without the extension:

```javascript
// Safe check — does 'default' work?
const conditions = {
  'loading': { '#msg': { textContent: 'Loading' } },
  default:   { '#msg': { textContent: 'Ready'   } }
};

// If default extension is loaded: 'default' key works as catch-all
// If not loaded: 'default' key falls through to stringEquality matcher
//   → matches only when value === 'default' (the string)
// Either way — no error is thrown
```

Since the extension non-invasively wraps the existing methods, if it's not loaded, the `default` key simply behaves as a string equality match for the literal string `'default'`. This is unlikely to be what you want, so load the extension whenever you use `default`.

---

## Summary

- The **`default` branch** is a catch-all condition that matches any value not already matched by a previous key
- It's provided by a **separate file** (`02_dh-conditions-default.js`) that must be loaded after the main Conditions module
- Write `default` as a key (no quotes needed as an object key, but quotes work too) — the extension automatically moves it to the end and converts it to a universal regex catch-all
- **Placement is flexible** — put `default` wherever makes sense to read; it always fires last
- Works with `whenState()`, `watch()`, and `apply()` — the extension wraps all three methods
- Use `default` for: catching unknown states, reducing repetition when many values share one appearance, boolean shorthand, and graceful API degradation
- `default` fires only if **no earlier key matched** — it never combines with or overrides a specific match

---

Continue to: [07 — Extending Conditions](./07_extending-conditions.md)