[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# The Default Branch Extension (`02_dh-conditions-default.js`)

## Quick Start (30 seconds)

```html
<!-- Load the main module first -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- Load the default branch extension -->
<script src="02_dh-conditions-default.js"></script>
```

```javascript
const app = state({ status: 'idle' });

// The 'default' key now works as a catch-all
Conditions.whenState(
  () => app.status,
  {
    'loading': { '#panel': { textContent: 'Loading…', className: 'panel loading' } },
    'error':   { '#panel': { textContent: 'Failed!',  className: 'panel error'  } },
    default:   { '#panel': { textContent: 'Ready.',   className: 'panel'        } }
  }
);

app.status = 'idle';      // → default → 'Ready.'
app.status = 'loading';   // → 'loading' → 'Loading…'
app.status = 'something-unexpected';  // → default → 'Ready.'
```

One extra file. Unlock `default` everywhere.

---

## What Is This File?

`02_dh-conditions-default.js` is a **standalone extension** for the Conditions module. It adds one specific capability: the `default` key in any conditions object.

Without it, the `default` key in a conditions object is treated like any other string — matching only when the value is literally the string `'default'`. With it loaded, `default` becomes a true catch-all that matches any value not already matched above it.

**This extension is entirely optional.** The core Conditions module works perfectly without it. You load it only when you want the catch-all behavior.

---

## What Does It Change?

The extension **wraps** three methods on the global `Conditions` object:

```
Before loading this file:
  Conditions.whenState → original core method
  Conditions.apply     → original core method
  Conditions.watch     → original core method

After loading this file:
  Conditions.whenState → wrapped version (pre-processes conditions, then calls original)
  Conditions.apply     → wrapped version (pre-processes conditions, then calls original)
  Conditions.watch     → wrapped version (pre-processes conditions, then calls original)
```

The original methods are stored privately and called internally — they are never removed or lost. The wrappers add behavior before delegating to them.

All other Conditions methods — `batch()`, `registerMatcher()`, `registerHandler()`, `getMatchers()`, `getHandlers()` — are completely untouched.

---

## How the `default` Transformation Works

### Step 1: Check for the `default` key

When you call `whenState()`, `apply()`, or `watch()`, the wrapper intercepts the conditions object and checks:

```javascript
if (!('default' in conditionsObj)) {
  // No default key — pass through unchanged, no overhead
  return conditions;
}
```

If there's no `default` key, the conditions object passes through unmodified. Zero cost.

### Step 2: Extract and transform

If a `default` key is found:

```javascript
const { default: defaultConfig, ...regularConditions } = conditionsObj;

return {
  ...regularConditions,         // all your named conditions, in order
  '/^[\\s\\S]*$/': defaultConfig // default → universal regex catch-all, at the end
};
```

The `default` key is removed and re-inserted at the **very end** of the object as the regex key `'/^[\s\S]*$/'`.

### Step 3: The regex catch-all

`/^[\s\S]*$/` is the key insight. This regex:

```
^       — start of string
[\s\S]* — any character (including whitespace and newlines), zero or more times
$       — end of string
```

It matches **everything** — any string of any length, including the empty string. Since the condition matcher system tests each key in order and uses the first match, placing this regex at the end means it only fires when nothing above it matched. That's exactly the `default` behavior.

### Visualizing the transformation

```
What you write:
────────────────────────────────────
{
  'loading': { '#msg': { textContent: 'Loading' } },
  'error':   { '#msg': { textContent: 'Error!'  } },
  default:   { '#msg': { textContent: 'Ready'   } }
}

What the system sees after transformation:
────────────────────────────────────
{
  'loading':       { '#msg': { textContent: 'Loading' } },
  'error':         { '#msg': { textContent: 'Error!'  } },
  '/^[\\s\\S]*$/': { '#msg': { textContent: 'Ready'   } }
}

Matching for value 'idle':
  'loading'       → 'idle' === 'loading'?   No
  'error'         → 'idle' === 'error'?     No
  '/^[\\s\\S]*$/' → /^[\s\S]*$/.test('idle')? YES → applies 'Ready'
```

---

## Syntax Reference

The extension adds no new methods. It enhances the existing three:

```javascript
// Same syntax as before — default key just works now
Conditions.whenState(getValue, conditions)
Conditions.whenState(getValue, conditions, selector, options)

Conditions.apply(value, conditions)
Conditions.apply(value, conditions, selector)

Conditions.watch(getValue, conditions)
Conditions.watch(getValue, conditions, selector)
```

The `default` key can be used in the `conditions` parameter of any of these three calls.

---

## Integration with `Elements`, `Collections`, and `Selector`

When this extension loads, it also updates the enhanced methods on three other global objects if they are present:

```javascript
// Automatically updated by the extension:
Elements.whenState   → enhanced Conditions.whenState
Elements.whenApply   → enhanced Conditions.apply
Elements.whenWatch   → enhanced Conditions.watch

Collections.whenState → enhanced Conditions.whenState
Collections.whenApply → enhanced Conditions.apply
Collections.whenWatch → enhanced Conditions.watch

Selector.whenState   → enhanced Conditions.whenState
Selector.whenApply   → enhanced Conditions.apply
Selector.whenWatch   → enhanced Conditions.watch
```

This means `default` works when you call `Conditions.whenState(...)` or `Elements.whenState(...)` — both are the same enhanced method.

If `Elements`, `Collections`, or `Selector` are not present when the extension loads, those assignments are silently skipped (no error).

---

## `Conditions.restoreOriginal()` — Revert to Core

The extension adds one new method: `Conditions.restoreOriginal()`.

```javascript
// Remove the extension's wrappers and restore the original methods
Conditions.restoreOriginal();

// After this call:
// Conditions.whenState → original core method (no default key support)
// Conditions.apply     → original core method
// Conditions.watch     → original core method
```

**When to use this:**

Primarily a **debugging tool**. If you're trying to diagnose whether the extension is causing unexpected behavior, you can call `restoreOriginal()` to eliminate it as a variable without reloading the page.

```javascript
// Debugging: is the default extension causing this?
Conditions.restoreOriginal();
// Now test your conditions without the extension...

// If the issue goes away, the extension was involved.
// Reload the page to get the extension back.
```

**Important:** `restoreOriginal()` does not restore the `Elements`, `Collections`, or `Selector` method references that were updated during load. To fully undo, reload the page.

---

## Version Tracking

The extension registers itself in a version map on the `Conditions` object:

```javascript
Conditions.extensions.defaultBranch  // '1.0.0'
```

You can check whether the extension is loaded:

```javascript
if (Conditions.extensions && Conditions.extensions.defaultBranch) {
  console.log('Default branch extension loaded:', Conditions.extensions.defaultBranch);
  // → 'Default branch extension loaded: 1.0.0'
} else {
  console.log('Default branch extension NOT loaded');
}
```

This is useful for library code that conditionally uses `default` based on whether the extension is available.

---

## Load Order

The extension validates its dependency at load time:

```javascript
// Inside the file:
if (!global.Conditions) {
  console.error('[Conditions.Default] Requires Conditions.js to be loaded first');
  return;
}
```

If you accidentally load the extension before the core module, it logs an error and exits cleanly — the extension does nothing rather than throwing.

**Correct order:**

```html
<!-- 1. Core module -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- 2. Extension -->
<script src="02_dh-conditions-default.js"></script>

<!-- 3. Your code -->
<script src="app.js"></script>
```

**Also correct if using other DOM Helpers modules:**

```html
<script src="01_dh-core.js"></script>
<script src="01_dh-reactive.js"></script>
<script src="09_dh-reactiveUtils-shortcut.js"></script>
<script src="01_dh-conditional-rendering.js"></script>
<script src="02_dh-conditions-default.js"></script>  <!-- after Conditions, before app code -->
<script src="app.js"></script>
```

---

## Console Output on Load

When the extension loads successfully, it prints three confirmation lines to the console:

```
[Conditions.Default] v1.0.0 loaded
[Conditions.Default] ✓ Non-invasive wrapper active
[Conditions.Default] ✓ Original functionality preserved
[Conditions.Default] ✓ Use Conditions.restoreOriginal() to revert if needed
```

These are informational — they confirm the extension is active and remind you about `restoreOriginal()`. In production builds you may want to suppress them; they are `console.log` calls, not warnings or errors.

---

## Usage Patterns

### Pattern 1: Catch Unknown States (Safety Net)

```javascript
const api = state({ phase: 'idle' });

Conditions.whenState(
  () => api.phase,
  {
    'idle':    { '#status': { textContent: 'Idle',       className: 'status idle'    } },
    'pending': { '#status': { textContent: 'Working…',  className: 'status working' } },
    'done':    { '#status': { textContent: 'Complete!', className: 'status done'    } },
    'failed':  { '#status': { textContent: 'Error',     className: 'status error'   } },
    default:   { '#status': { textContent: 'Unknown',   className: 'status'         } }
    //          ↑ catches any value the API might send that isn't explicitly listed
  }
);
```

If `api.phase` ever receives `'cancelled'`, `'timeout'`, `'retrying'`, or anything else not in the list, the UI falls back to `'Unknown'` rather than leaving stale state.

### Pattern 2: Boolean Shorthand (Avoid Naming the False Case)

```javascript
const sidebar = state({ open: false });

Conditions.whenState(
  () => sidebar.open,
  {
    'true': {
      '#sidebar':    { className: 'sidebar open' },
      '#overlay':    { hidden: false },
      '#toggle-btn': { setAttribute: { 'aria-expanded': 'true' } }
    },
    default: {
      '#sidebar':    { className: 'sidebar closed' },
      '#overlay':    { hidden: true },
      '#toggle-btn': { setAttribute: { 'aria-expanded': 'false' } }
    }
  }
);
// default covers: false, undefined, null, or any non-true value
```

### Pattern 3: Reduce Redundant Branches

When many values share the same visual output, `default` handles the majority case without listing each one:

```javascript
const priority = state({ level: 'normal' });

Conditions.whenState(
  () => priority.level,
  {
    'critical': { '#badge': { textContent: 'CRITICAL', className: 'badge red'    } },
    'high':     { '#badge': { textContent: 'HIGH',     className: 'badge orange' } },
    default:    { '#badge': { textContent: 'Normal',   className: 'badge gray'   } }
    //           ↑ handles: 'normal', 'low', 'minimal', or anything else
  }
);
```

### Pattern 4: One-Shot with `apply()`

The extension works with `apply()` too — useful for event-driven or setup scenarios:

```javascript
function renderStatus(statusFromServer) {
  Conditions.apply(statusFromServer, {
    'active':   { '#row': { className: 'row row-active'   } },
    'inactive': { '#row': { className: 'row row-inactive' } },
    'pending':  { '#row': { className: 'row row-pending'  } },
    default:    { '#row': { className: 'row'              } }
  });
}

// Works for any status value, including unexpected ones
renderStatus('active');     // → 'row row-active'
renderStatus('suspended');  // → 'row' (default)
```

---

## What Happens Without This Extension

If you write a `default` key but don't load the extension, `default` is treated as a plain string by the `stringEquality` matcher — it matches only when the value is literally the string `'default'`:

```javascript
// WITHOUT the extension loaded:
Conditions.whenState(
  () => app.status,
  {
    'loading': { ... },
    default:   { ... }  // ← matches ONLY when app.status === 'default'
    //                      NOT a catch-all
  }
);

app.status = 'idle';     // → no match (nothing happens)
app.status = 'default';  // → matches this block
```

This is almost certainly not what you want. **Always load the extension when using the `default` key.**

---

## Design Notes

### Why a Separate File?

Keeping the `default` behavior in a separate file respects the **open/closed principle** — the core module is closed for modification but open for extension. Projects that never need a catch-all condition carry zero overhead from this feature. Projects that do simply include one more `<script>` tag.

### Why a Regex, Not a Special Matcher?

The `default` key is converted to the regex `/^[\s\S]*$/` rather than registering a dedicated `default` matcher. This reuses the existing **regex matcher** that's already part of the core condition matching pipeline — no new code path, no new system component. The extension achieves its goal entirely through the existing infrastructure.

### Why Non-Invasive Wrapping?

The extension saves the original methods and wraps them rather than replacing them from scratch. This means:
- The core module's behavior is never changed — it remains exactly as tested and documented
- `restoreOriginal()` can fully undo the extension
- If the extension has a bug, it's isolated — the original methods are untouched and recoverable

---

## Summary

- **`02_dh-conditions-default.js`** is an optional extension that adds `default` key support to the Conditions module
- Load it after `01_dh-conditional-rendering.js` — it validates the dependency and exits gracefully if Conditions isn't present
- It wraps `whenState()`, `apply()`, and `watch()` non-invasively — the originals are stored and called internally
- When a `default` key is found, it's transformed to the catch-all regex `'/^[\s\S]*$/'` and moved to the end of the conditions object
- The extension also updates `Elements.whenState`, `Collections.whenState`, and `Selector.whenState` to the enhanced versions
- **`Conditions.restoreOriginal()`** reverts all three wrapped methods to their original form (useful for debugging)
- **`Conditions.extensions.defaultBranch`** holds the version string — use it to check whether the extension is loaded
- Without this extension, `default` is treated as a plain string — matching only when the value is literally `'default'`

**One-line summary:**
> `02_dh-conditions-default.js` transforms the `default` key in any conditions object into a universal catch-all — non-invasively, with full reversibility, at no cost when `default` isn't used.

---

Back to: [06 — The `default` Branch](./06_default-branch.md) | [07 — Extending Conditions](./07_extending-conditions.md)