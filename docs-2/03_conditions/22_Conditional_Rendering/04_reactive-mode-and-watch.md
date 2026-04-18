[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Reactive Mode, Watch, and Batch Updates

## Quick Start (30 seconds)

```javascript
// Reactive: UI auto-updates when state changes
const theme = state('light');

Conditions.whenState(
  () => theme.value,
  {
    'light': { style: { backgroundColor: '#fff', color: '#000' } },
    'dark':  { style: { backgroundColor: '#1a1a1a', color: '#fff' } }
  },
  'body'
);

theme.value = 'dark';  // Body updates automatically — no extra code needed!

// Batch: group multiple state changes into one update
Conditions.batch(() => {
  status.value = 'loading';
  progress.value = 0;
  // DOM updates once after the batch completes
});
```

---

## What Is Reactive Mode?

In **static mode**, `Conditions.apply()` runs once and is done. If the value changes later, you have to manually call `.update()` to re-evaluate.

In **reactive mode**, the module wraps its logic inside an `effect()` — a function from the reactive library that **automatically re-runs** whenever the reactive state it reads changes. This means the UI stays in sync with your state without any manual intervention.

```
Static Mode:
   apply(value, conditions, selector)
   → Evaluate once → Done

Reactive Mode:
   effect(() => {
     apply(getValue(), conditions, selector)
   })
   → Evaluate now
   → State changes? → Re-evaluate automatically
   → State changes again? → Re-evaluate again
   → ...forever, until cleanup is called
```

---

## whenState() — Smart Auto-Detection

`Conditions.whenState()` is the primary API. It automatically detects whether to use reactive or static mode:

```
whenState(valueFn, conditions, selector)
   ↓
Is reactive library available?
   ├── No → Static mode (run once)
   └── Yes:
       ├── Is valueFn a function? → Reactive mode
       └── Is valueFn a static value? → Static mode
```

### Reactive Example

```javascript
const count = state(0);

// valueFn is a function that reads reactive state → reactive mode
Conditions.whenState(
  () => count.value,       // Function reading reactive state
  {
    '0':    { textContent: 'Empty' },
    '1-9':  { textContent: 'Few items' },
    '>=10': { textContent: 'Many items' }
  },
  '#itemCount'
);

// Change state → UI updates automatically
count.value = 5;    // '#itemCount' shows 'Few items'
count.value = 15;   // '#itemCount' shows 'Many items'
count.value = 0;    // '#itemCount' shows 'Empty'
```

### Static Example

```javascript
// Direct value (not a function) → static mode
Conditions.whenState(
  'premium',                    // Direct value, not a function
  {
    'free':    { textContent: 'Free Plan' },
    'premium': { textContent: 'Premium Plan' }
  },
  '#planBadge'
);
// Runs once. No auto-updates.
```

### Forcing a Mode

Use the `options` parameter to override auto-detection:

```javascript
// Force static mode even with a function
Conditions.whenState(
  () => status.value,
  conditions,
  '#badge',
  { reactive: false }    // Force static — run once only
);
```

---

## watch() — Explicitly Reactive

`Conditions.watch()` is a shortcut that **always** uses reactive mode. It's clearer about your intent:

```javascript
const connectionStatus = state('connecting');

Conditions.watch(
  () => connectionStatus.value,
  {
    'connecting':   { textContent: 'Connecting...', style: { color: 'orange' } },
    'connected':    { textContent: 'Connected',     style: { color: 'green' } },
    'disconnected': { textContent: 'Disconnected',  style: { color: 'red' } }
  },
  '.status-indicator'
);

// State changes → all .status-indicator elements update
connectionStatus.value = 'connected';
```

If the reactive library is not available, `watch()` gracefully falls back to `apply()` (one-time execution) and logs a warning.

---

## apply() — Explicitly Static

`Conditions.apply()` always runs **once** and returns immediately. No watching, no reactivity:

```javascript
// Run once
Conditions.apply('admin', {
  'admin': { classList: { add: 'admin-badge' } },
  'user':  { classList: { add: 'user-badge' } }
}, '#roleBadge');
```

You can use a function as the value — it's called once:

```javascript
Conditions.apply(
  () => getUserRole(),    // Called once, result used
  {
    'admin': { ... },
    'user': { ... }
  },
  '#roleBadge'
);
```

### Manual Re-Evaluation

`apply()` returns an object with an `update()` method for manual re-runs:

```javascript
const result = Conditions.apply(
  () => getUserStatus(),
  {
    'active':   { classList: { add: 'user-active' } },
    'inactive': { classList: { add: 'user-inactive' } }
  },
  '#userStatus'
);

// Later: manually re-evaluate
result.update();

// Re-evaluate on a button click
document.getElementById('refreshBtn').addEventListener('click', () => {
  result.update();
});
```

---

## Cleanup (Stopping Reactive Watching)

In reactive mode, `whenState()` and `watch()` return a **cleanup function**. Call it to stop watching:

```javascript
const cleanup = Conditions.whenState(
  () => theme.value,
  {
    'light': { style: { backgroundColor: '#fff' } },
    'dark':  { style: { backgroundColor: '#1a1a1a' } }
  },
  'body'
);

// Later: stop watching theme changes
cleanup();
// After this, changing theme.value no longer updates the body
```

This is important for single-page apps where you navigate away from a view — you should clean up watchers to avoid memory leaks.

---

## Event Listener Auto-Cleanup

When a condition changes in reactive mode, the module automatically cleans up event listeners from the **previous** condition before applying the new one:

```javascript
const mode = state('view');

Conditions.whenState(
  () => mode.value,
  {
    'view': {
      addEventListener: { click: handleViewClick, dblclick: handleViewDblClick }
    },
    'edit': {
      addEventListener: { click: handleEditClick, keydown: handleEditKeydown }
    }
  },
  '#content'
);
```

```
mode.value = 'view':
   → Adds: click(handleViewClick), dblclick(handleViewDblClick)

mode.value = 'edit':
   → Removes: click(handleViewClick), dblclick(handleViewDblClick)  ← auto cleanup
   → Adds: click(handleEditClick), keydown(handleEditKeydown)

mode.value = 'view':
   → Removes: click(handleEditClick), keydown(handleEditKeydown)    ← auto cleanup
   → Adds: click(handleViewClick), dblclick(handleViewDblClick)
```

Without this automatic cleanup, event listeners would pile up every time the condition changes.

---

## batch() — Group State Changes

When you change multiple reactive states at once, each change triggers a re-evaluation. `Conditions.batch()` groups them so the DOM updates only **once** after all changes:

```javascript
const status = state('idle');
const message = state('');
const progress = state(0);

// Without batch: 3 separate DOM updates
status.value = 'loading';   // UI re-evaluates
message.value = 'Starting'; // UI re-evaluates again
progress.value = 0;         // UI re-evaluates again

// With batch: 1 DOM update
Conditions.batch(() => {
  status.value = 'loading';
  message.value = 'Starting';
  progress.value = 0;
  // DOM updates once after this function returns
});
```

If the reactive library is not available, `batch()` simply executes the function immediately.

---

## Dynamic Conditions

The conditions map can be a **function** that returns an object. This lets the conditions themselves depend on reactive state:

```javascript
const user = state({ role: 'guest', verified: false });

Conditions.whenState(
  () => user.value.role,
  () => ({
    'admin': {
      textContent: 'Administrator',
      style: {
        backgroundColor: user.value.verified ? 'gold' : 'orange'
      }
    },
    'user': {
      textContent: 'User',
      style: {
        backgroundColor: user.value.verified ? 'blue' : 'gray'
      }
    },
    'guest': {
      textContent: 'Guest'
    }
  }),
  '#userBadge'
);
```

Here, both the value (`user.value.role`) and the conditions config (`user.value.verified`) are reactive. When either changes, the effect re-runs.

---

## Real-World Examples

### Example 1: Theme Switcher

```javascript
const theme = state('light');

Conditions.whenState(
  () => theme.value,
  {
    'light': {
      style: { backgroundColor: '#ffffff', color: '#000000' },
      dataset: { theme: 'light' },
      classList: { add: 'light-theme', remove: 'dark-theme' }
    },
    'dark': {
      style: { backgroundColor: '#1a1a1a', color: '#ffffff' },
      dataset: { theme: 'dark' },
      classList: { add: 'dark-theme', remove: 'light-theme' }
    }
  },
  'body'
);

// Toggle theme on button click
document.getElementById('themeToggle').addEventListener('click', () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
});
```

### Example 2: Form Submission Flow

```javascript
const formStatus = state('idle');

Conditions.whenState(
  () => formStatus.value,
  {
    'idle': {
      textContent: 'Submit',
      disabled: false,
      style: { opacity: '1' }
    },
    'validating': {
      textContent: 'Validating...',
      disabled: true,
      style: { opacity: '0.7' }
    },
    'submitting': {
      textContent: 'Submitting...',
      disabled: true,
      style: { opacity: '0.5' }
    },
    'success': {
      textContent: 'Submitted!',
      disabled: true,
      style: { opacity: '1' },
      classList: { add: 'btn-success' }
    },
    'error': {
      textContent: 'Try Again',
      disabled: false,
      style: { opacity: '1' },
      classList: { add: 'btn-danger' }
    }
  },
  '#submitBtn'
);

// Drive the flow by changing state
async function submitForm(data) {
  formStatus.value = 'validating';

  if (!validate(data)) {
    formStatus.value = 'error';
    return;
  }

  formStatus.value = 'submitting';

  try {
    await sendToServer(data);
    formStatus.value = 'success';
  } catch (e) {
    formStatus.value = 'error';
  }
}
```

### Example 3: Reactive Score Display

```javascript
const score = state(0);

Conditions.whenState(
  () => score.value,
  {
    '<50':   { textContent: 'Fail',      style: { color: 'red', fontWeight: 'bold' } },
    '50-69': { textContent: 'Pass',      style: { color: 'orange' } },
    '70-89': { textContent: 'Good',      style: { color: 'blue' } },
    '>=90':  { textContent: 'Excellent', style: { color: 'green', fontWeight: 'bold' } }
  },
  '#scoreDisplay'
);

// Score changes → display updates automatically
score.value = 45;   // 'Fail' in red
score.value = 72;   // 'Good' in blue
score.value = 95;   // 'Excellent' in green
```

---

## Comparison: apply vs whenState vs watch

| Feature | `apply()` | `whenState()` | `watch()` |
|---------|----------|--------------|----------|
| **Runs** | Once | Once or continuously | Continuously |
| **Reactivity** | No | Auto-detected | Always |
| **Value type** | Any | Any | Function |
| **Returns** | `{ update() }` | Cleanup fn or `{ update() }` | Cleanup fn |
| **Use case** | One-time setup | General purpose | Explicit watching |

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **Reactive mode** | Wraps logic in `effect()` — auto-reruns when reactive state changes |
| **Static mode** | Runs once; use `.update()` for manual re-evaluation |
| **whenState()** | Auto-detects: function + reactive library → reactive; otherwise static |
| **watch()** | Always reactive; falls back to `apply()` if no reactive library |
| **apply()** | Always one-time; returns `{ update() }` for manual re-runs |
| **Cleanup** | Call the returned function to stop watching in reactive mode |
| **Event cleanup** | Listeners from previous conditions are auto-removed |
| **batch()** | Group state changes → single DOM update |
| **Dynamic conditions** | Pass a function instead of object for reactive condition configs |

> **Simple Rule to Remember:** Use `apply()` for one-time setup, `whenState()` for smart auto-detection, and `watch()` when you explicitly want reactive updates. In reactive mode, just change the state value — the UI follows automatically.