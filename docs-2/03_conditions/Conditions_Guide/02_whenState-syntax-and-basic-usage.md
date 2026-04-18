[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# `whenState()` — Syntax and Basic Usage

## Quick Start (30 seconds)

```javascript
const app = state({ mode: 'idle' });

// One call — one condition for every possible mode
Conditions.whenState(
  () => app.mode,               // 1. What to watch
  {                             // 2. What to do for each value
    'idle':    { '#btn': { textContent: 'Start', disabled: false } },
    'running': { '#btn': { textContent: 'Stop',  disabled: false } },
    'done':    { '#btn': { textContent: 'Reset', disabled: false } }
  }
);

app.mode = 'running';  // → #btn shows "Stop" automatically ✨
app.mode = 'done';     // → #btn shows "Reset" automatically ✨
```

One call. Watches forever. Updates automatically.

---

## What is `whenState()`?

`Conditions.whenState()` is the **primary method** of the Conditions module. It:

1. Takes a **function that returns a value** to watch
2. Takes a **conditions object** that maps each possible value to DOM updates
3. **Automatically re-evaluates** when that value changes (in reactive mode)
4. Applies the matching configuration to the DOM — every time

Think of it as registering a rule: *"Whenever `getValue()` produces a result, look up that result in the conditions table and apply the matching row."*

---

## Syntax

```javascript
Conditions.whenState(getValue, conditions)
Conditions.whenState(getValue, conditions, options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `getValue` | `Function` | ✅ Yes | A function that returns the current value to match |
| `conditions` | `Object` | ✅ Yes | Maps condition keys → DOM update configurations |
| `options` | `Object` | ❌ No | Optional settings (see Options section below) |

### Return Value

In **reactive mode** (Reactive loaded):
```javascript
const stop = Conditions.whenState(getValue, conditions);
// stop() — call to stop watching and clean up
```

In **static mode** (no Reactive):
```javascript
const control = Conditions.whenState(getValue, conditions);
// control.update()  — re-evaluate and re-apply manually
// control.destroy() — stop and clean up
```

---

## Parameter 1: `getValue`

The first parameter is always a **function** that returns the value you want to match against.

### Why a function, not a value directly?

Because Conditions needs to call it **repeatedly** — every time state changes. If you passed the value itself (`app.status`), Conditions would only see the value at the moment of the call and could never see future changes.

```javascript
// ❌ This doesn't work — captures the value once, not reactively
Conditions.whenState(
  app.status,    // 'loading' — captured once, never updates
  { ... }
);

// ✅ This works — function is called every time
Conditions.whenState(
  () => app.status,   // called fresh every time state changes
  { ... }
);
```

**Simple rule:** Always wrap your value in an arrow function: `() => yourValue`.

### Common `getValue` Forms

```javascript
// Simple property access
() => app.status

// Nested property
() => user.profile.role

// Computed value
() => user.age >= 18 ? 'adult' : 'minor'

// Boolean expression
() => sidebar.isOpen

// Combined conditions
() => auth.isLoggedIn && auth.role === 'admin' ? 'admin' : auth.isLoggedIn ? 'user' : 'guest'

// A variable (non-reactive — for use with static mode)
() => currentTheme
```

---

## Parameter 2: The Conditions Object

The conditions object is the heart of `whenState()`. It maps **condition keys** to **DOM configurations**.

### Structure

```javascript
{
  'conditionKey1': {
    'selector1': { prop: value, prop: value },
    'selector2': { prop: value }
  },
  'conditionKey2': {
    'selector1': { prop: value, prop: value },
    'selector2': { prop: value }
  }
}
```

Two levels deep:

```
conditions object
  └─→ condition key  (e.g., 'loading', 'true', '>10')
        └─→ selector  (e.g., '#spinner', '.card', element)
              └─→ update object  (e.g., { hidden: false, className: 'active' })
```

### Level 1: Condition Keys

Each key in the top level is a **condition to match the value against**. The system tries each key in order and uses the **first match**.

```javascript
{
  'loading':   { ... },   // matches when value === 'loading'
  'success':   { ... },   // matches when value === 'success'
  'error':     { ... }    // matches when value === 'error'
}
```

Keys can be many things — strings, patterns, operators. More on this in the Condition Matchers guide.

### Level 2: Selectors

Inside each condition block, keys are **CSS selectors** (or direct Element references) that identify which DOM elements to update.

```javascript
'loading': {
  '#spinner':       { hidden: false },      // #id selector
  '.status-text':   { textContent: 'Loading…' },  // class selector
  'button[type="submit"]': { disabled: true }  // attribute selector
}
```

#### Supported Selector Types

```javascript
// By ID (#)
'#my-element': { ... }

// By class name (.)
'.my-class': { ... }      // updates ALL matching elements

// Any CSS selector
'[data-role="submit"]': { ... }
'form input[required]':  { ... }
'nav > .link':           { ... }

// Direct element reference
myButtonElement: { ... }
document.getElementById('panel'): { ... }
```

**Important:** Selectors like `.class` and `[attr]` that match **multiple elements** apply the update to **all** of them.

### Level 3: The Update Object

The innermost value is an **update object** — the same format accepted by `.update()` in DOM Helpers Core. It describes what to change on each matched element.

```javascript
{
  // Text content
  textContent: 'Hello World',

  // CSS classes
  className: 'card card-active',
  classList: { add: 'active', remove: 'inactive' },
  classList: { toggle: ['visible', isVisible] },

  // Attributes
  setAttribute: { 'aria-expanded': 'true', 'data-state': 'open' },
  removeAttribute: ['disabled'],

  // Style
  style: { color: 'red', display: 'flex' },

  // Direct DOM properties
  hidden: false,
  disabled: true,
  checked: false,
  value: 'text',

  // Dataset
  dataset: { status: 'active', id: '42' }
}
```

Any property supported by `.update()` works here.

---

## How Matching Works

When `getValue()` is called, the system checks each key in the conditions object from **top to bottom**. It uses the **first match** and stops — no fall-through.

```
getValue() → 'loading'

Check 'idle'    → does 'loading' === 'idle'?   No
Check 'loading' → does 'loading' === 'loading'? Yes → APPLY, STOP
Check 'success' → (never reached)
Check 'error'   → (never reached)
```

This means **order matters** when you have overlapping conditions. Put more specific conditions before more general ones.

```javascript
// ✅ Specific before general
{
  'error-critical': { ... },   // checked first
  'error':          { ... },   // only reached if not 'error-critical'
  default:          { ... }    // catch-all, only if nothing else matched
}

// ⚠️ General before specific (default might catch too early)
{
  default:          { ... },   // would match everything — nothing below runs
  'error':          { ... }    // never reached
}
```

---

## Parameter 3: Options (Optional)

The third optional parameter accepts configuration:

```javascript
Conditions.whenState(getValue, conditions, {
  // Currently options depend on extensions loaded
  // The default extension adds 'default' key support
})
```

For most use cases, you won't need the options parameter. It's available for future extensions and plugin authors.

---

## Reactive Mode vs Static Mode

### Reactive Mode (Recommended — Reactive is loaded)

When the Reactive library is present, `whenState()` wraps its logic in an `effect()`:

```javascript
const app = state({ status: 'idle' });

const stop = Conditions.whenState(
  () => app.status,
  {
    'idle':    { '#panel': { textContent: 'Waiting…' } },
    'loading': { '#panel': { textContent: 'Loading…' } },
    'done':    { '#panel': { textContent: 'Complete!'  } }
  }
);

// Reactive — automatically re-runs when app.status changes
app.status = 'loading';  // → #panel shows "Loading…"  ✨
app.status = 'done';     // → #panel shows "Complete!" ✨

// Stop watching when no longer needed
stop();
```

**What happens internally:**

```
Conditions.whenState(getValue, conditions)
              ↓
     effect(() => {
       const value = getValue();   ← reactive read, tracked
       // find matching condition
       // apply DOM updates
     });
              ↓
When app.status changes → effect re-runs → new match → DOM updates
```

### Static Mode (No Reactive — runs once)

Without Reactive, `whenState()` evaluates once and returns a manual control object:

```javascript
let currentStatus = 'idle';

const control = Conditions.whenState(
  () => currentStatus,
  {
    'idle':    { '#panel': { textContent: 'Waiting…' } },
    'loading': { '#panel': { textContent: 'Loading…' } },
    'done':    { '#panel': { textContent: 'Complete!'  } }
  }
);

// Only applied once on setup

// When you need to update:
currentStatus = 'loading';
control.update();  // ← re-evaluate and re-apply manually

// When done:
control.destroy();
```

---

## Step-by-Step: Building from Simple to Real

### Step 1 — Minimal: One element, two states

```javascript
const light = state({ on: false });

Conditions.whenState(
  () => light.on,
  {
    'true':  { '#light': { className: 'light on',  textContent: 'ON'  } },
    'false': { '#light': { className: 'light off', textContent: 'OFF' } }
  }
);

document.getElementById('toggle').addEventListener('click', () => {
  light.on = !light.on;
});
```

**What's happening:**
- `() => light.on` returns `true` or `false`
- The key `'true'` matches when the value is boolean `true`
- The key `'false'` matches when the value is boolean `false`
- Clicking the toggle flips `light.on`, Conditions sees the change, applies the new block

### Step 2 — Multiple elements per state

```javascript
const fetch = state({ status: 'idle' });

Conditions.whenState(
  () => fetch.status,
  {
    'idle': {
      '#fetch-btn': { disabled: false, textContent: 'Fetch Data' },
      '#spinner':   { hidden: true },
      '#result':    { hidden: true }
    },
    'loading': {
      '#fetch-btn': { disabled: true,  textContent: 'Loading…' },
      '#spinner':   { hidden: false },
      '#result':    { hidden: true }
    },
    'success': {
      '#fetch-btn': { disabled: false, textContent: 'Refresh' },
      '#spinner':   { hidden: true },
      '#result':    { hidden: false }
    },
    'error': {
      '#fetch-btn': { disabled: false, textContent: 'Retry' },
      '#spinner':   { hidden: true },
      '#result':    { hidden: true }
    }
  }
);
```

**What's happening:** Each condition block describes the **complete UI snapshot** for that state — all three elements configured at once. When `fetch.status` changes, all three elements update together in one atomic step.

### Step 3 — Multiple `whenState()` calls (splitting concerns)

You're not limited to one `whenState()` call. You can split different sets of elements into separate calls for clarity:

```javascript
const app = state({ status: 'idle' });

// Manage the button separately
Conditions.whenState(
  () => app.status,
  {
    'idle':    { '#submit-btn': { disabled: false, textContent: 'Submit' } },
    'loading': { '#submit-btn': { disabled: true,  textContent: 'Saving…' } },
    'done':    { '#submit-btn': { disabled: true,  textContent: 'Saved!' } }
  }
);

// Manage the indicator separately
Conditions.whenState(
  () => app.status,
  {
    'idle':    { '#indicator': { hidden: true, className: '' } },
    'loading': { '#indicator': { hidden: false, className: 'indicator spinning' } },
    'done':    { '#indicator': { hidden: false, className: 'indicator done' } }
  }
);
```

Each call watches the same value but controls different parts of the UI.

### Step 4 — Class-based selectors (multiple elements)

```javascript
const theme = state({ name: 'light' });

Conditions.whenState(
  () => theme.name,
  {
    'light': {
      'body':    { className: 'theme-light' },
      '.card':   { classList: { add: 'light-mode', remove: 'dark-mode' } },
      '.header': { style: { backgroundColor: '#ffffff', color: '#000000' } }
    },
    'dark': {
      'body':    { className: 'theme-dark' },
      '.card':   { classList: { add: 'dark-mode', remove: 'light-mode' } },
      '.header': { style: { backgroundColor: '#1a1a1a', color: '#ffffff' } }
    }
  }
);

document.getElementById('theme-toggle').addEventListener('click', () => {
  theme.name = theme.name === 'light' ? 'dark' : 'light';
});
```

**What's happening:** `.card` matches **all** elements with class `card`. Each one gets the class update applied. Change the theme — every card updates at once.

### Step 5 — Direct element references

For elements you already have a reference to:

```javascript
const modal = document.getElementById('my-modal');
const overlay = document.getElementById('overlay');
const app = state({ modalOpen: false });

Conditions.whenState(
  () => app.modalOpen,
  {
    'true': {
      [modal]:   { hidden: false, setAttribute: { 'aria-hidden': 'false' } },
      [overlay]: { hidden: false }
    },
    'false': {
      [modal]:   { hidden: true,  setAttribute: { 'aria-hidden': 'true'  } },
      [overlay]: { hidden: true }
    }
  }
);
```

You can use element references as keys in the conditions block directly. Useful when you already have the element in a variable.

---

## When Conditions Change, Incomplete Blocks Are Fine

Each condition block only needs to describe what **that state specifically configures**. If `#spinner` doesn't need any update for a particular state, simply omit it:

```javascript
Conditions.whenState(
  () => app.step,
  {
    'step-1': {
      '#step1-panel': { hidden: false },
      '#step2-panel': { hidden: true }
      // step3-panel not mentioned — unchanged
    },
    'step-2': {
      '#step1-panel': { hidden: true },
      '#step2-panel': { hidden: false }
    },
    'step-3': {
      '#step1-panel': { hidden: true },
      '#step2-panel': { hidden: true }
    }
  }
);
```

Elements not mentioned in a condition block remain untouched when that condition is applied.

---

## Combining `whenState()` with `effect()`

`whenState()` handles **finite visual states**. For **dynamic values** that change continuously (like a counter, a name, a computed string), use `effect()` alongside it.

```javascript
const form = state({ status: 'idle', errorMessage: '' });

// Conditions handles the visual mode
Conditions.whenState(
  () => form.status,
  {
    'idle':    { '#form-error': { hidden: true }, '#submit-btn': { disabled: false } },
    'loading': { '#form-error': { hidden: true }, '#submit-btn': { disabled: true  } },
    'error':   { '#form-error': { hidden: false }, '#submit-btn': { disabled: false } }
  }
);

// effect() handles the dynamic text
effect(() => {
  if (form.status === 'error') {
    document.getElementById('form-error').textContent = form.errorMessage;
  }
});

// On submission
async function handleSubmit() {
  form.status = 'loading';
  try {
    await submitForm();
    form.status = 'idle';
  } catch (err) {
    batch(() => {
      form.errorMessage = err.message;
      form.status = 'error';
    });
  }
}
```

**The division of responsibility:**
- `whenState()` → controls which elements are visible/enabled/styled
- `effect()` → fills in the dynamic content (the actual error message)

Both work together naturally because they both react to the same reactive state.

---

## Stopping a `whenState()` Watcher

In reactive mode, `whenState()` returns a stop function. Call it to detach the watcher when the component or feature is no longer needed:

```javascript
const app = state({ mode: 'idle' });

const stop = Conditions.whenState(
  () => app.mode,
  {
    'idle':  { '#panel': { textContent: 'Idle' } },
    'active': { '#panel': { textContent: 'Active' } }
  }
);

// Later — when tearing down (e.g., single-page app navigation)
stop();  // Conditions no longer re-evaluates when app.mode changes
```

After `stop()`, future changes to `app.mode` will not trigger any DOM updates from this particular `whenState()` call.

---

## Common Mistakes

### 1. Passing the value directly (not a function)

```javascript
// ❌ Wrong — value captured once, never reactive
Conditions.whenState(app.status, { ... });

// ✅ Correct
Conditions.whenState(() => app.status, { ... });
```

### 2. Expecting fall-through behavior

```javascript
// ❌ Don't expect multiple conditions to apply at once
// Only the FIRST match is applied
{
  'loading': { '#spinner': { hidden: false } },
  'true':    { '#panel': { hidden: false } }   // ← also won't apply if 'loading' matched
}

// ✅ Include everything for that state in one block
{
  'loading': {
    '#spinner': { hidden: false },
    '#panel':   { hidden: true }
  }
}
```

### 3. Modifying state inside conditions blocks

```javascript
// ❌ Don't cause side effects inside condition blocks — keep them pure DOM descriptions
{
  'loading': {
    '#spinner': { hidden: false },
    // Don't call functions or modify state here
  }
}

// ✅ Use effect() for side effects that depend on state
effect(() => {
  if (app.status === 'loading') {
    analytics.track('loading-started');
  }
});
```

### 4. Forgetting to clean up in dynamic apps

```javascript
// ❌ Memory leak — watcher runs forever even after component unmount
function setupComponent() {
  Conditions.whenState(() => app.mode, { ... });
}

// ✅ Store the stop function and call it on teardown
function setupComponent() {
  const stop = Conditions.whenState(() => app.mode, { ... });
  return stop;  // return to caller so they can stop it
}

const stopComponent = setupComponent();
// later...
stopComponent();
```

---

## Summary

- `Conditions.whenState(getValue, conditions)` is the **primary method** — it watches a value and applies the matching DOM configuration automatically
- **`getValue`** must always be a **function** — `() => yourValue` — so the system can call it every time state changes
- The **conditions object** is two levels deep: condition key → selector → update object
- **Selectors** support `#id`, `.class`, any CSS selector, or a direct Element reference
- **Update objects** support the same properties as `.update()`: textContent, className, classList, style, setAttribute, hidden, disabled, dataset, and more
- Only the **first matching** condition is applied — order conditions from specific to general
- In **reactive mode**: returns a `stop()` function; updates automatically when state changes
- In **static mode**: returns `{ update(), destroy() }`; must call `update()` manually
- Combine with `effect()` for dynamic content — `whenState()` handles modes, `effect()` handles values

---

Continue to: [03 — Condition Matchers](./03_condition-matchers.md)