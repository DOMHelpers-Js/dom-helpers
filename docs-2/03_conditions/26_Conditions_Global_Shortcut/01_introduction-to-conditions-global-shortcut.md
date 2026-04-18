[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Conditions Global Shortcut — Introduction

## Quick Start (30 seconds)

```javascript
// Instead of Conditions.whenState(...)
whenState(() => theme.value, {
  'dark':  { style: { backgroundColor: '#1a1a1a', color: '#fff' } },
  'light': { style: { backgroundColor: '#fff', color: '#000' } }
}, 'body');
```

---

## What Is the Conditions Global Shortcut?

The Conditions Global Shortcut module creates **direct global aliases** for the most commonly used `Conditions` methods. Instead of typing `Conditions.whenState(...)`, you can simply write `whenState(...)`.

It exposes four shortcuts:

| Shortcut | Maps To | Purpose |
|----------|---------|---------|
| `whenState()` | `Conditions.whenState()` | Auto-reactive conditional rendering |
| `whenWatch()` | `Conditions.watch()` | Explicitly reactive watching |
| `whenApply()` | `Conditions.apply()` | One-time static application |
| `whenBatch()` | `Conditions.batch()` | Batch multiple condition updates |

These are **pure aliases** — they call the original methods directly with no extra logic, no wrapping, and no overhead.

---

## Syntax

```javascript
// Global shortcuts (primary mode)
whenState(valueFn, conditions, selector, options);
whenWatch(valueFn, conditions, selector);
whenApply(value, conditions, selector);
whenBatch(fn);

// Fallback namespace (if conflicts detected)
CondShortcuts.whenState(valueFn, conditions, selector, options);
CondShortcuts.whenWatch(valueFn, conditions, selector);
CondShortcuts.whenApply(value, conditions, selector);
CondShortcuts.whenBatch(fn);

// Always available via Conditions object
Conditions.shortcuts.whenState(valueFn, conditions, selector, options);
Conditions.shortcuts.whenWatch(valueFn, conditions, selector);
Conditions.shortcuts.whenApply(value, conditions, selector);
Conditions.shortcuts.whenBatch(fn);
```

**Parameters:** Identical to the original `Conditions` methods — the shortcuts pass all arguments through unchanged.

**Returns:** Whatever the original method returns.

---

## Why Does This Exist?

### The Situation: Frequent Conditions Calls

When you're building a UI with many conditional elements, you'll be writing `Conditions.whenState(...)` over and over:

```javascript
Conditions.whenState(() => theme.value, themeConditions, 'body');
Conditions.whenState(() => status.value, statusConditions, '#badge');
Conditions.whenState(() => layout.value, layoutConditions, '.items');
Conditions.watch(() => user.value, userConditions, '#profile');
Conditions.apply('active', btnConditions, '.btn');
```

The `Conditions.` prefix is needed every time. It's not a problem, but it adds repetition.

### With Shortcuts

The same code, shorter and cleaner:

```javascript
whenState(() => theme.value, themeConditions, 'body');
whenState(() => status.value, statusConditions, '#badge');
whenState(() => layout.value, layoutConditions, '.items');
whenWatch(() => user.value, userConditions, '#profile');
whenApply('active', btnConditions, '.btn');
```

Same functionality, less typing. The shortcuts are especially useful when you have many condition calls in a single file.

---

## Mental Model

Think of it like **speed dial on a phone**.

```
Full dialing (namespace):
├── Conditions.whenState()   → Dial the full number every time
├── Conditions.watch()       → Dial the full number every time
├── Conditions.apply()       → Dial the full number every time
└── Conditions.batch()       → Dial the full number every time

Speed dial (shortcuts):
├── whenState()   → Press 1 → connects to Conditions.whenState()
├── whenWatch()   → Press 2 → connects to Conditions.watch()
├── whenApply()   → Press 3 → connects to Conditions.apply()
└── whenBatch()   → Press 4 → connects to Conditions.batch()
```

The call goes to the same place — the shortcut just saves you from typing the prefix.

---

## How Does It Work?

```
Module loads
   ↓
1️⃣ Dependency check
   ├── Conditions global exists? → Continue
   └── Missing? → Error and stop
   ↓
2️⃣ Validate required methods
   ├── whenState, apply, watch all exist? → Continue
   └── Missing methods? → Error and stop
   ↓
3️⃣ Conflict detection
   ├── Check: do whenState, whenWatch, whenApply already exist globally?
   ├── No conflicts → Export to global scope directly
   └── Conflicts found → Export to CondShortcuts namespace instead
   ↓
4️⃣ Create pure alias functions
   ├── whenState(...)  → return Conditions.whenState(...)
   ├── whenWatch(...)  → return Conditions.watch(...)
   ├── whenApply(...)  → return Conditions.apply(...)
   └── whenBatch(...)  → return Conditions.batch(...)
   ↓
5️⃣ Export
   ├── Global mode: window.whenState, window.whenWatch, etc.
   └── Namespace mode: window.CondShortcuts = { whenState, whenWatch, ... }
   ↓
6️⃣ Always: Conditions.shortcuts = { all four methods }
```

### Key Detail: Conflict Detection

Before placing shortcuts on the global scope, the module checks whether those names are already taken:

```javascript
const shortcuts = ['whenState', 'whenWatch', 'whenApply'];
const conflicts = shortcuts.filter(name => name in global);
```

If **any** of these names already exist globally (from another library, a custom function, etc.), the module switches to **namespace mode** — placing all shortcuts under `CondShortcuts` instead of polluting the global scope.

```
No conflicts:
├── window.whenState = function(...)
├── window.whenWatch = function(...)
├── window.whenApply = function(...)
└── window.whenBatch = function(...)

Conflicts detected:
└── window.CondShortcuts = {
      whenState: function(...),
      whenWatch: function(...),
      whenApply: function(...),
      whenBatch: function(...)
    }
```

Either way, `Conditions.shortcuts` always holds all four methods for programmatic access.

---

## Basic Usage

### whenState() — Auto-Reactive Conditions

```javascript
const status = state('idle');

// Auto-detects reactivity: if state is reactive, auto-updates
whenState(() => status.value, {
  'idle':    { textContent: 'Waiting...', style: { color: 'gray' } },
  'loading': { textContent: 'Loading...',  style: { color: 'blue' } },
  'success': { textContent: 'Done!',       style: { color: 'green' } },
  'error':   { textContent: 'Failed',      style: { color: 'red' } }
}, '#statusDisplay');
```

### whenWatch() — Explicitly Reactive

```javascript
const count = state(0);

// Always reactive — requires reactive library
whenWatch(() => count.value, {
  '0':       { textContent: 'No items' },
  '1-5':     { textContent: 'A few items' },
  '>5':      { textContent: 'Many items' }
}, '#counter');
```

### whenApply() — One-Time Static

```javascript
// Apply once — no reactivity, no auto-updates
whenApply('premium', {
  'premium': { textContent: 'PRO', style: { color: 'gold' } },
  'free':    { textContent: 'FREE', style: { color: 'gray' } }
}, '#planBadge');
```

### whenBatch() — Batch Updates

```javascript
whenBatch(() => {
  whenApply('dark', themeConditions, 'body');
  whenApply('compact', layoutConditions, '.content');
  whenApply('admin', roleConditions, '#badge');
});
```

---

## Naming Convention

Notice the naming pattern — all shortcuts start with `when`:

| Shortcut | Original | Why the Name |
|----------|----------|-------------|
| `whenState` | `Conditions.whenState` | Same name — direct alias |
| `whenWatch` | `Conditions.watch` | Added `when` prefix for consistency |
| `whenApply` | `Conditions.apply` | Added `when` prefix for consistency |
| `whenBatch` | `Conditions.batch` | Added `when` prefix for consistency |

The `when` prefix makes all shortcuts read naturally: "when state is X, do Y" / "when apply this value, do Y".

---

## Fallback Namespace Mode

If conflicts are detected, use the `CondShortcuts` namespace:

```javascript
// If another library already defines window.whenState:
CondShortcuts.whenState(() => theme.value, {
  'dark':  { style: { backgroundColor: '#1a1a1a' } },
  'light': { style: { backgroundColor: '#fff' } }
}, 'body');

CondShortcuts.whenApply('active', conditions, '.btn');
CondShortcuts.whenWatch(() => count.value, conditions, '#counter');
CondShortcuts.whenBatch(() => { /* ... */ });
```

You can also always use `Conditions.shortcuts`:

```javascript
// Always available, regardless of mode
Conditions.shortcuts.whenState(() => theme.value, conditions, 'body');
```

---

## Checking Current Mode

```javascript
// Check which mode is active
console.log(Conditions.extensions.shortcuts);
// { version: '1.0.0', mode: 'global', conflicts: null }
// or
// { version: '1.0.0', mode: 'namespace', conflicts: ['whenState'] }
```

### Development Helper: printShortcuts()

In non-production environments, a diagnostic method is available:

```javascript
Conditions.printShortcuts();
// [Conditions.Shortcuts] Configuration
//   Version: 1.0.0
//   Mode: global
//   Conflicts: None
//   Available methods: ['whenState', 'whenWatch', 'whenApply', 'whenBatch']
//   Reactivity: Available
```

---

## Cleanup: Removing Shortcuts

If you need to remove the shortcuts (for testing, debugging, or conflict resolution):

```javascript
// Remove all shortcuts from global scope
Conditions.removeShortcuts();

// After removal:
typeof whenState;  // 'undefined' (in global mode)
typeof CondShortcuts;  // 'undefined' (in namespace mode)
```

This removes:
- Global functions (`whenState`, `whenWatch`, `whenApply`, `whenBatch`) in global mode
- The `CondShortcuts` namespace in namespace mode
- `Conditions.shortcuts` reference
- `Conditions.extensions.shortcuts` metadata

---

## Load Order

```html
<!-- 1. Core Conditions module (required) -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- 2. Optional extensions (loaded before shortcuts) -->
<script src="02_dh-conditions-default.js"></script>
<script src="03_dh-conditions-collection-extension.js"></script>

<!-- 3. Shortcuts (after Conditions and any extensions) -->
<script src="05_dh-conditions-global-shortcut.js"></script>
```

The shortcuts alias whatever version of the methods exists at load time. If the Default Branch Extension or Collection Extension have already wrapped the original methods, the shortcuts will use those wrapped versions automatically.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Global aliases for Conditions methods — skip the `Conditions.` prefix |
| **whenState()** | Alias for `Conditions.whenState()` — auto-reactive |
| **whenWatch()** | Alias for `Conditions.watch()` — explicitly reactive |
| **whenApply()** | Alias for `Conditions.apply()` — one-time static |
| **whenBatch()** | Alias for `Conditions.batch()` — batch updates |
| **Pure aliases** | No extra logic — call the original methods directly |
| **Conflict-safe** | Auto-detects naming conflicts, falls back to `CondShortcuts` namespace |
| **Always available** | `Conditions.shortcuts.whenState()` works regardless of mode |
| **Removable** | `Conditions.removeShortcuts()` cleans up all globals |
| **Requires** | `Conditions.js` must be loaded first |

> **Simple Rule to Remember:** The Conditions Global Shortcut module lets you write `whenState(...)` instead of `Conditions.whenState(...)`. It's pure convenience — same methods, shorter names. If another library conflicts with the names, it automatically falls back to `CondShortcuts.whenState(...)` so nothing breaks.