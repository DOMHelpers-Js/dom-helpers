[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# `apply()`, `watch()`, and `batch()`

## Quick Start (30 seconds)

```javascript
// apply() — one-shot, no reactivity
Conditions.apply('error', {
  'error': { '#msg': { textContent: 'Failed', className: 'msg error' } },
  'success': { '#msg': { textContent: 'Done!', className: 'msg success' } }
});
// → applies 'error' block once, immediately, regardless of reactive state

// watch() — explicit reactive watcher
const stop = Conditions.watch(
  () => app.status,
  {
    'loading': { '#spinner': { hidden: false } },
    'done':    { '#spinner': { hidden: true  } }
  }
);
stop();  // stop watching

// batch() — defer DOM updates until all conditions have been applied
Conditions.batch(() => {
  Conditions.apply('loading', conditionsA);
  Conditions.apply('loading', conditionsB);
  // DOM updated once at the end, not twice
});
```

---

## Three Methods, Three Modes

`whenState()` is the star of the show — but Conditions offers two companion methods that serve specific situations:

```
Conditions.apply()     — one-shot static application (no reactivity ever)
Conditions.watch()     — always reactive (explicit, regardless of mode)
Conditions.batch()     — group multiple applications into one DOM flush
```

Understanding when to reach for each is what this guide is about.

---

## `Conditions.apply()` — One-Shot Application

### What It Does

`apply()` takes a **value** and a **conditions object**, finds the matching condition, and applies it to the DOM — **once**. It doesn't watch anything. It doesn't wrap in an effect. It simply evaluates and applies, then it's done.

### Syntax

```javascript
Conditions.apply(value, conditions)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `any` | The value to match against the conditions |
| `conditions` | `Object` | The same conditions object format as `whenState()` |

### Why Use `apply()`?

`apply()` shines in situations where you want the **power of the conditions system** (matchers, multi-element updates, property handlers) but you're managing reactivity yourself — or you don't need reactivity at all.

### Scenario 1: Initial Page Setup

Apply a condition once when the page loads based on a value from the server:

```javascript
// Server rendered the page with a status code in a data attribute
const statusCode = parseInt(document.body.dataset.statusCode);

Conditions.apply(statusCode, {
  '200': { '#status-banner': { hidden: true  } },
  '404': {
    '#status-banner': { hidden: false, textContent: 'Page not found', className: 'banner error' }
  },
  '500': {
    '#status-banner': { hidden: false, textContent: 'Server error', className: 'banner critical' }
  }
});
// Applied once — matches against the server value
```

### Scenario 2: Event Handler-Driven Updates

When you're already in an event handler and managing state manually:

```javascript
document.getElementById('theme-btn').addEventListener('click', () => {
  const currentTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = currentTheme;

  Conditions.apply(currentTheme, {
    'light': {
      'body':         { className: 'theme-light' },
      '#theme-icon':  { textContent: '🌙' }
    },
    'dark': {
      'body':         { className: 'theme-dark' },
      '#theme-icon':  { textContent: '☀️' }
    }
  });
});
```

No reactive state needed — the button click drives everything.

### Scenario 3: Applying One Specific State Directly

Sometimes you just need to apply a known state immediately:

```javascript
// Show the error state right now
Conditions.apply('error', {
  'idle':    { '#panel': { hidden: true  } },
  'loading': { '#panel': { textContent: 'Loading…', hidden: false } },
  'error':   { '#panel': { textContent: 'Something went wrong', className: 'panel error', hidden: false } }
});
```

This is equivalent to writing `Conditions.whenState(() => 'error', conditions)` — but cleaner because `apply()` signals intent: "apply once, right now."

### Scenario 4: Works in Static Mode (No Reactive Loaded)

In a project without the Reactive library at all, `apply()` is your primary tool:

```javascript
// No reactive state — just plain JS variables
let currentPage = 'home';

function navigate(page) {
  currentPage = page;
  Conditions.apply(currentPage, {
    'home':     { '#content': { innerHTML: homePageHTML     } },
    'about':    { '#content': { innerHTML: aboutPageHTML    } },
    'contact':  { '#content': { innerHTML: contactPageHTML  } }
  });
}

document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    navigate(e.currentTarget.dataset.page);
  });
});
```

### `apply()` vs `whenState()`

```
Conditions.apply(value, conditions)
  → Evaluates once, immediately
  → No watching, no reactivity
  → You call it whenever you need it
  → Perfect for event-driven or one-time setup

Conditions.whenState(() => value, conditions)
  → Evaluates now and watches for changes
  → In reactive mode: re-runs automatically
  → In static mode: returns control.update()
  → Perfect for state-driven UIs
```

---

## `Conditions.watch()` — Always Reactive

### What It Does

`watch()` is identical to `whenState()` — **except it always wraps in an `effect()`**, regardless of whether Reactive is available.

### Syntax

```javascript
const stop = Conditions.watch(getValue, conditions)
```

Returns a stop function.

### Why Use `watch()` Instead of `whenState()`?

`whenState()` is reactive when Reactive is loaded and static when it isn't — it adapts to the environment. This is the recommended default behavior.

`watch()` is for when you **know** you want reactive behavior and want to make that intent explicit in your code. It's a signal to readers: "this always watches, never static."

```javascript
// whenState() — adapts to environment
Conditions.whenState(() => app.mode, conditions);

// watch() — explicitly reactive always
Conditions.watch(() => app.mode, conditions);
```

Both are functionally equivalent when Reactive is loaded.

### Practical Use: Always-On Watchers

`watch()` is useful when you're writing code that will always be used with Reactive and you want the signature to be clear:

```javascript
// In a module that requires Reactive — use watch() for clarity
export function setupStatusIndicator(app) {
  return Conditions.watch(
    () => app.status,
    {
      'online':  { '#status-dot': { className: 'dot dot-green', title: 'Online'  } },
      'offline': { '#status-dot': { className: 'dot dot-red',   title: 'Offline' } },
      'away':    { '#status-dot': { className: 'dot dot-yellow', title: 'Away'   } }
    }
  );
  // Returns stop function — caller can stop the watcher when done
}
```

### Stopping a `watch()`

```javascript
const stopWatcher = Conditions.watch(() => data.phase, conditions);

// Later, when this feature is torn down
stopWatcher();
```

---

## `Conditions.batch()` — Group DOM Updates

### What It Does

`batch()` wraps multiple Conditions operations so that all DOM writes happen in a **single flush** instead of immediately on each call.

### Syntax

```javascript
Conditions.batch(fn)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `fn` | `Function` | A function containing multiple Conditions calls |

### Why Does This Matter?

Without batching, each `apply()` immediately writes to the DOM:

```javascript
// Without batch — DOM updated twice
Conditions.apply('loading', conditionsA);   // → DOM write 1
Conditions.apply('loading', conditionsB);   // → DOM write 2
```

With batching, the DOM is updated once at the end:

```javascript
// With batch — DOM updated once
Conditions.batch(() => {
  Conditions.apply('loading', conditionsA);  // queued
  Conditions.apply('loading', conditionsB);  // queued
});
// → DOM write happens here, once
```

For most day-to-day use, you won't notice a difference. Batching is most valuable when:
- Applying conditions to **many elements** at once
- Running multiple `apply()` calls back-to-back in a tight loop
- You want to avoid intermediate visual states where element A is updated but element B hasn't been yet

### Example: Coordinated Multi-Panel Update

```javascript
function switchMode(mode) {
  Conditions.batch(() => {
    Conditions.apply(mode, headerConditions);
    Conditions.apply(mode, sidebarConditions);
    Conditions.apply(mode, mainPanelConditions);
    Conditions.apply(mode, footerConditions);
  });
  // All four panels update atomically — no partial renders
}
```

### Example: Initializing Multiple Conditions at Once

```javascript
function initializeDashboard(appState) {
  Conditions.batch(() => {
    Conditions.apply(appState.theme, themeConditions);
    Conditions.apply(appState.role, permissionConditions);
    Conditions.apply(appState.status, statusConditions);
    Conditions.apply(appState.notification, notificationConditions);
  });
}
```

### `batch()` and `whenState()`

`batch()` is primarily useful with `apply()`. When using `whenState()` reactively with Reactive loaded, the Reactive system's own `batch()` (`batch()` from the reactive API) handles batching at the state level — you typically don't need `Conditions.batch()` in that case.

However, if you have many `apply()` calls to coordinate manually, `Conditions.batch()` is the right tool.

---

## `Conditions.mode` and `Conditions.hasReactivity`

Two read-only properties that let you inspect the current environment:

```javascript
// Is Reactive available?
Conditions.hasReactivity   // true or false

// Which mode is active?
Conditions.mode            // 'reactive' or 'static'
```

Use these to write code that adapts to the environment:

```javascript
if (Conditions.hasReactivity) {
  // Use whenState() — it will auto-track
  Conditions.whenState(() => app.status, conditions);
} else {
  // Use apply() + manual calls
  Conditions.apply(currentStatus, conditions);
  // Wire up manual updates elsewhere
}
```

Or log for debugging:

```javascript
console.log('Conditions running in mode:', Conditions.mode);
// → 'reactive' or 'static'
```

---

## Putting It All Together: Choosing the Right Method

```
┌─────────────────────────────────────────────────────────────────┐
│ Do you want automatic updates when state changes?               │
│                                                                 │
│  YES → Does your project use Reactive?                          │
│          YES → Use whenState() (adapts automatically)           │
│          YES, explicitly → Use watch() (always reactive)        │
│          NO  → Use apply() + call it manually when needed       │
│                                                                 │
│  NO  → Use apply() — one-shot, no watching                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Are you applying multiple conditions at once?                    │
│                                                                 │
│  YES → Wrap in Conditions.batch() to avoid partial renders      │
│  NO  → No batching needed                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Decision Matrix

| Situation | Best Method |
|-----------|-------------|
| Reactive loaded, state-driven UI | `whenState()` |
| Explicitly always reactive | `watch()` |
| One-time initial setup | `apply()` |
| Event-driven (no reactive state) | `apply()` inside event handler |
| No Reactive loaded at all | `apply()` + manual calls |
| Multiple `apply()` calls at once | `Conditions.batch(fn)` |
| State-driven with Reactive | Use Reactive's `batch()` for state, `whenState()` for conditions |

---

## Real-World: Combining All Three

```javascript
const app = state({ theme: 'light', status: 'idle', role: 'guest' });

// 1. Initial setup — apply all at once to avoid staggered initial render
Conditions.batch(() => {
  Conditions.apply(app.theme, themeConditions);
  Conditions.apply(getRaw(app).status, statusConditions);
  Conditions.apply(getRaw(app).role, roleConditions);
});

// 2. Theme — explicitly reactive with watch()
const stopTheme = Conditions.watch(() => app.theme, themeConditions);

// 3. Status — reactive via whenState() (adapts to environment)
const stopStatus = Conditions.whenState(() => app.status, statusConditions);

// 4. Role — handled by a one-time apply() on login/logout
function onLogin(role) {
  app.role = role;
  Conditions.apply(role, roleConditions);  // immediate update
}

function onLogout() {
  app.role = 'guest';
  Conditions.apply('guest', roleConditions);
}

// 5. Cleanup on teardown
function destroy() {
  stopTheme();
  stopStatus();
}
```

---

## Summary

- **`Conditions.apply(value, conditions)`** — one-shot evaluation with no reactivity; applies the matching condition immediately and stops. Use for initial setup, event-driven updates, or when Reactive isn't loaded.

- **`Conditions.watch(getValue, conditions)`** — always reactive; wraps in an `effect()` regardless of environment. Use when you want explicit reactive semantics that are visible in the code.

- **`Conditions.batch(fn)`** — groups multiple Conditions operations into a single DOM flush. Use when applying multiple `apply()` calls back-to-back to prevent intermediate partial renders.

- **`Conditions.hasReactivity`** — boolean, read-only; tells you if Reactive is available.

- **`Conditions.mode`** — `'reactive'` or `'static'`; tells you which mode is active.

**The simple rule:**
```
Most cases     → whenState()   (smart, adapts to environment)
Always reactive → watch()       (explicit intent)
Once only      → apply()       (no watching, just apply)
Many at once   → batch(fn)     (atomic DOM update)
```

---

Continue to: [06 — The `default` Branch](./06_default-branch.md)