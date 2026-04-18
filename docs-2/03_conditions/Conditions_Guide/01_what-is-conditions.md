[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What is Conditions?

## Quick Start (30 seconds)

```javascript
const status = state({ value: 'loading' });

// "When status.value is 'loading', apply this to #panel.
//  When it's 'success', apply that. When it's 'error', apply something else."
Conditions.whenState(
  () => status.value,
  {
    'loading': { '#panel': { textContent: 'Loading…', className: 'panel loading' } },
    'success':  { '#panel': { textContent: 'Done!',    className: 'panel success' } },
    'error':    { '#panel': { textContent: 'Failed.',  className: 'panel error'   } }
  }
);

status.value = 'success';
// → #panel shows "Done!" with class "panel success" — automatically ✨
```

One call. Every state handled. DOM always matches.

---

## What is Conditions?

**Conditions** is a declarative conditional-rendering module for DOM Helpers. It lets you describe **what the DOM should look like for each possible state value**, and it automatically applies the right visual configuration whenever that value changes.

Instead of writing:

```javascript
// Imperative — buried logic, easy to miss a case
if (status === 'loading') {
  document.getElementById('panel').textContent = 'Loading…';
  document.getElementById('panel').className = 'panel loading';
} else if (status === 'success') {
  document.getElementById('panel').textContent = 'Done!';
  document.getElementById('panel').className = 'panel success';
} else if (status === 'error') {
  document.getElementById('panel').textContent = 'Failed.';
  document.getElementById('panel').className = 'panel error';
}
```

You write:

```javascript
// Declarative — each state is a clear, self-contained block
Conditions.whenState(
  () => status.value,
  {
    'loading': { '#panel': { textContent: 'Loading…', className: 'panel loading' } },
    'success':  { '#panel': { textContent: 'Done!',    className: 'panel success' } },
    'error':    { '#panel': { textContent: 'Failed.',  className: 'panel error'   } }
  }
);
```

Both work. The Conditions approach makes each state **visible at a glance** and eliminates the risk of forgetting a branch as your state grows.

---

## Syntax

```javascript
Conditions.whenState(
  getValue,    // Function that returns the value to watch
  conditions,  // Object: { 'condition': { 'selector': updates } }
  // No third argument needed when selectors are inside the conditions object
);
```

The **conditions object** maps each possible value to a **DOM update configuration**:

```javascript
{
  'valueA': {
    '#element-one': { textContent: 'Text for A', className: 'state-a' },
    '#element-two': { hidden: false }
  },
  'valueB': {
    '#element-one': { textContent: 'Text for B', className: 'state-b' },
    '#element-two': { hidden: true }
  },
  default: {
    '#element-one': { textContent: 'Other', className: 'state-default' }
  }
}
```

Selectors inside each condition block can be:
- `#id` — element by ID
- `.className` — elements by class name
- Any CSS selector — matched with `querySelectorAll`
- A direct `Element` reference

---

## Why Does This Exist?

### The Problem with Growing If/Else Chains

When a piece of UI can be in multiple states, conditional logic starts simple and grows uncontrollably:

```javascript
function renderStatus(status, error) {
  const icon = document.getElementById('icon');
  const label = document.getElementById('label');
  const detail = document.getElementById('detail');
  const btn = document.getElementById('action-btn');

  if (status === 'idle') {
    icon.className = 'icon icon-gray';
    label.textContent = 'Waiting';
    detail.textContent = '';
    detail.hidden = true;
    btn.textContent = 'Start';
    btn.disabled = false;
    btn.className = 'btn btn-primary';
  } else if (status === 'loading') {
    icon.className = 'icon icon-blue spinning';
    label.textContent = 'Processing…';
    detail.textContent = '';
    detail.hidden = true;
    btn.textContent = 'Cancel';
    btn.disabled = false;
    btn.className = 'btn btn-secondary';
  } else if (status === 'success') {
    icon.className = 'icon icon-green';
    label.textContent = 'Complete';
    detail.textContent = 'All tasks finished successfully.';
    detail.hidden = false;
    btn.textContent = 'Start Again';
    btn.disabled = false;
    btn.className = 'btn btn-primary';
  } else if (status === 'error') {
    icon.className = 'icon icon-red';
    label.textContent = 'Failed';
    detail.textContent = error || 'An unexpected error occurred.';
    detail.hidden = false;
    btn.textContent = 'Retry';
    btn.disabled = false;
    btn.className = 'btn btn-danger';
  }
}
```

**What's the real problem?**

```
You want to know: "What does the UI look like when status = 'error'?"
→ Must mentally trace through icon, label, detail, btn across 4 branches
→ Can't see "the error state" as one unit

You add a new element (e.g., a progress bar):
→ Must touch every if/else branch to handle it
→ Easy to forget one case

You add a new status (e.g., 'paused'):
→ Must add another else if block touching every element
→ Function gets longer every time
```

**Problems:**
❌ "What does state X look like?" requires reading scattered lines
❌ Adding a new element = editing every branch
❌ Adding a new state = another dense block
❌ No guarantee all cases are complete
❌ Must call `renderStatus()` at every update point manually

### The Conditions Solution

```javascript
const op = state({ status: 'idle', error: null });

Conditions.whenState(
  () => op.status,
  {
    'idle': {
      '#icon':       { className: 'icon icon-gray' },
      '#label':      { textContent: 'Waiting' },
      '#detail':     { hidden: true, textContent: '' },
      '#action-btn': { textContent: 'Start', disabled: false, className: 'btn btn-primary' }
    },
    'loading': {
      '#icon':       { className: 'icon icon-blue spinning' },
      '#label':      { textContent: 'Processing…' },
      '#detail':     { hidden: true, textContent: '' },
      '#action-btn': { textContent: 'Cancel', disabled: false, className: 'btn btn-secondary' }
    },
    'success': {
      '#icon':       { className: 'icon icon-green' },
      '#label':      { textContent: 'Complete' },
      '#detail':     { hidden: false, textContent: 'All tasks finished successfully.' },
      '#action-btn': { textContent: 'Start Again', disabled: false, className: 'btn btn-primary' }
    },
    'error': {
      '#icon':       { className: 'icon icon-red' },
      '#label':      { textContent: 'Failed' },
      '#detail':     { hidden: false },
      '#action-btn': { textContent: 'Retry', disabled: false, className: 'btn btn-danger' }
    }
  }
);

// Update error text separately (it's dynamic)
effect(() => {
  if (op.status === 'error') {
    document.getElementById('detail').textContent = op.error || 'An unexpected error occurred.';
  }
});

// Now just change state — everything updates automatically
op.status = 'loading';  // All four elements update in one go
op.status = 'error';    // All four elements switch to error state
```

**What just changed?**

```
Before:
  "What does error state look like?"
  → Read through scattered lines in a function

After:
  "What does error state look like?"
  → Read the 'error' block — one self-contained object
```

**Benefits:**
✅ Each visual state is a complete, readable block
✅ Adding a new element = one line per state block
✅ Adding a new state = one new block
✅ No manual `renderStatus()` calls — Conditions + Reactive handles it
✅ Impossible to have a "missing state" — the shape is always complete

---

## Mental Model

### A Decision Table

`Conditions.whenState()` is like a **lookup table** or **routing table** for visual states.

```
Regular JavaScript (switch/if):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (status === 'idle')    → scattered property assignments
  if (status === 'loading') → more scattered assignments
  if (status === 'error')   → more scattered assignments
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Pattern: "for each property, what happens in each state?"

Conditions.whenState (lookup table):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'idle':    { all elements in idle configuration }
  'loading': { all elements in loading configuration }
  'error':   { all elements in error configuration }
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Pattern: "for each state, what does the whole UI look like?"
```

The lookup table approach is easier to read, extend, and debug. You look up a row by state name and see the complete picture.

### A Hotel Key Card System

Think of it like a hotel key card that controls what's accessible:

```
Key Card = 'guest'
→ Room door: unlocked
→ Gym: unlocked
→ Admin office: locked
→ Server room: locked

Key Card = 'admin'
→ Room door: unlocked
→ Gym: unlocked
→ Admin office: unlocked
→ Server room: locked

Changing the card changes everything at once.
You don't flip each lock manually.
```

`Conditions.whenState()` works the same way — changing the state value **switches the whole configuration** in one step, not property by property.

---

## How Does It Work?

### Internal Flow

```
Conditions.whenState(() => app.status, conditions)
                  ↓
If Reactive is loaded: wraps in effect()
                  ↓
effect(() => {
  const value = getValue();          // Read current state value (reactive)
                  ↓
  For each key in conditions:
    Does matchesCondition(value, key) return true?
                  ↓
    YES → for each selector in that condition block:
            getElements(selector) → get DOM elements
            applyConfig(element, updateObject) → apply updates
          break — only first match applies
                  ↓
    NO → try next condition key
})
                  ↓
When app.status changes → effect re-runs → new condition matched → DOM updates
```

### Condition Matching

Every key in your conditions object goes through the **condition matcher system**. The system tries each registered matcher in order and uses the first one that recognizes the key format:

```
Key: 'loading'     → stringEquality matcher → value === 'loading'
Key: 'true'        → booleanTrue matcher   → value === true
Key: 'truthy'      → truthy matcher        → !!value === true
Key: '>10'         → greaterThan matcher   → value > 10
Key: '/^err/i'     → regex matcher         → /^err/i.test(value)
Key: 'includes:@'  → includes matcher      → value.includes('@')
Key: 'default'     → catch-all (via extension) → always matches if last
```

This is what makes Conditions so flexible — the same system handles strings, booleans, numbers, patterns, and custom logic through a consistent matcher interface.

---

## Basic Usage: Three Scenarios

### Scenario 1 — Fixed State Values (Most Common)

When your state has a known set of values like `'idle' | 'loading' | 'success' | 'error'`:

```javascript
const fetch = state({ status: 'idle' });

Conditions.whenState(
  () => fetch.status,
  {
    'idle': {
      '#fetch-btn': { disabled: false, textContent: 'Fetch Data' },
      '#spinner':   { hidden: true }
    },
    'loading': {
      '#fetch-btn': { disabled: true,  textContent: 'Loading…' },
      '#spinner':   { hidden: false }
    },
    'success': {
      '#fetch-btn': { disabled: false, textContent: 'Refresh' },
      '#spinner':   { hidden: true }
    },
    'error': {
      '#fetch-btn': { disabled: false, textContent: 'Retry' },
      '#spinner':   { hidden: true }
    }
  }
);

document.getElementById('fetch-btn').addEventListener('click', async () => {
  fetch.status = 'loading';
  try {
    await loadData();
    fetch.status = 'success';
  } catch {
    fetch.status = 'error';
  }
});
```

### Scenario 2 — Boolean State

When state is a simple true/false:

```javascript
const sidebar = state({ isOpen: false });

Conditions.whenState(
  () => sidebar.isOpen,
  {
    'true': {
      '#sidebar':       { className: 'sidebar open' },
      '#overlay':       { hidden: false },
      '#toggle-btn':    { setAttribute: { 'aria-expanded': 'true' } }
    },
    'false': {
      '#sidebar':       { className: 'sidebar closed' },
      '#overlay':       { hidden: true },
      '#toggle-btn':    { setAttribute: { 'aria-expanded': 'false' } }
    }
  }
);

document.getElementById('toggle-btn').addEventListener('click', () => {
  sidebar.isOpen = !sidebar.isOpen;
});
```

### Scenario 3 — User Role / Permission Level

When state is one of several named roles:

```javascript
const auth = state({ role: 'guest' });

Conditions.whenState(
  () => auth.role,
  {
    'guest': {
      '#nav-home':    { hidden: false },
      '#nav-profile': { hidden: true },
      '#nav-admin':   { hidden: true },
      '#login-btn':   { hidden: false },
      '#logout-btn':  { hidden: true }
    },
    'user': {
      '#nav-home':    { hidden: false },
      '#nav-profile': { hidden: false },
      '#nav-admin':   { hidden: true },
      '#login-btn':   { hidden: true },
      '#logout-btn':  { hidden: false }
    },
    'admin': {
      '#nav-home':    { hidden: false },
      '#nav-profile': { hidden: false },
      '#nav-admin':   { hidden: false },
      '#login-btn':   { hidden: true },
      '#logout-btn':  { hidden: false }
    }
  }
);

function loginAsUser()  { auth.role = 'user'; }
function loginAsAdmin() { auth.role = 'admin'; }
function logout()       { auth.role = 'guest'; }
```

---

## What Conditions Is NOT

It's important to understand what Conditions is designed for, so you reach for the right tool:

**Conditions IS for:**
- Finite, enumerable visual states (`loading | success | error`)
- UI that switches between clearly defined modes
- Replacing `if/else` chains that update multiple DOM elements
- Keeping each visual state self-contained and readable

**Conditions is NOT for:**
- Dynamic content that changes continuously (use `effect()`)
- Displaying a computed number or name (use `effect()` + `.update()`)
- Rendering lists of items (use `effect()` + array distribution)

**Rule of thumb:**

```
"When status is X, show this configuration"  → Conditions
"Whenever value changes, show the current value" → effect()
```

They are **complementary** — use both together in real apps.

---

## Works With or Without Reactive

Conditions can work in two modes:

### Reactive Mode (Recommended)

When Reactive is loaded, `whenState()` wraps itself in an `effect()`:

```javascript
// Reactive loaded → automatic updates
Conditions.whenState(
  () => app.status,   // Reactive state read — tracked automatically
  { ... }
);

app.status = 'error';  // → Conditions re-evaluates → DOM updates
```

### Static Mode (No Reactive)

Without Reactive, `whenState()` runs once and returns a manual update function:

```javascript
// No Reactive loaded → run once
const control = Conditions.whenState(
  () => currentStatus,
  { ... }
);

// Manually update when needed
currentStatus = 'error';
control.update();  // Re-apply manually
```

### `Conditions.apply()` — Always Static

For one-time, snapshot-style application regardless of Reactive:

```javascript
Conditions.apply('error', conditions);  // Apply once for value 'error'
```

---

## The Full Public API

```javascript
// Primary method — reactive or static depending on environment
Conditions.whenState(getValue, conditions)
Conditions.whenState(getValue, conditions, options)

// One-shot — apply once for a given value
Conditions.apply(value, conditions)

// Explicit reactive watch (same as whenState in reactive mode)
Conditions.watch(getValue, conditions)

// Batch DOM updates inside conditions
Conditions.batch(fn)

// Extend the system
Conditions.registerMatcher(name, { test, match })
Conditions.registerHandler(name, { test, apply })

// Introspect
Conditions.getMatchers()    // List all condition matcher names
Conditions.getHandlers()    // List all property handler names
Conditions.hasReactivity    // Boolean — is Reactive available?
Conditions.mode             // 'reactive' or 'static'
```

---

## Summary

- **Conditions** is a declarative conditional-rendering module — you describe what the DOM looks like for each state value, and the system applies the right one
- **`whenState(getValue, conditions)`** is the primary method — reactive when Reactive is loaded, static otherwise
- Conditions are matched using a **strategy-pattern matcher system** — strings, booleans, numbers, patterns, and custom matchers all supported
- Each condition block contains **CSS selectors → update objects** — any property the core `.update()` method supports
- The `default` key (when the default extension is loaded) catches any value not explicitly matched
- Conditions complements `effect()` — use Conditions for finite states, `effect()` for dynamic values

**The mental model:**
> Write a lookup table. "When value is X, the UI looks like this." Conditions reads the table and applies the right row — automatically, every time the value changes.

---

Continue to: [02 — `whenState()` Syntax and Basic Usage](./02_whenState-syntax-and-basic-usage.md)