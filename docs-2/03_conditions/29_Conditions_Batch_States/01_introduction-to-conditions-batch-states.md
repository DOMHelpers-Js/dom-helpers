[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Conditions Batch States — Introduction

## Quick Start (30 seconds)

```javascript
// Set up multiple conditional watchers in one call
const cleanup = Conditions.whenWatches([
  [() => status.value,  { 'online': { style: { color: 'green' } }, 'offline': { style: { color: 'red' } } }, '#statusBadge'],
  [() => theme.value,   { 'dark': { style: { backgroundColor: '#1a1a1a' } }, 'light': { style: { backgroundColor: '#fff' } } }, 'body'],
  [() => count.value,   { '>0': { textContent: 'Has items' }, '0': { textContent: 'Empty' } }, '#counter']
]);

// Later: cleanup everything at once
cleanup.destroy();
```

---

## What Is the Batch States Extension?

The Batch States extension lets you declare **multiple conditional watchers in a single call** instead of writing separate `Conditions.whenState()` calls for each one.

It provides three batch methods:

| Method | Mode | Description |
|--------|------|-------------|
| `Conditions.whenStates()` | Mixed | Each config can be reactive or static independently |
| `Conditions.whenWatches()` | All Reactive | Forces `{ reactive: true }` on every config |
| `Conditions.whenApplies()` | All Static | Uses `Conditions.apply()` for each — no reactivity |

Plus two utility methods:

| Method | Description |
|--------|-------------|
| `Conditions.createBatchConfig()` | Create a reusable batch function |
| `Conditions.combineBatches()` | Merge multiple config arrays into one batch |

All batch methods return a **combined cleanup object** — one `destroy()` call cleans up everything.

---

## Syntax

```javascript
// Each config is an array: [valueFn, conditions, selector, options?]

// Mixed mode — per-config reactivity control
Conditions.whenStates([
  [valueFn, conditions, selector, { reactive: true }],
  [value,   conditions, selector, { reactive: false }]
]);

// All reactive — no options needed
Conditions.whenWatches([
  [valueFn, conditions, selector],
  [valueFn, conditions, selector]
]);

// All static — direct values, one-time application
Conditions.whenApplies([
  [value, conditions, selector],
  [value, conditions, selector]
]);
```

**Config Array Format:** `[valueFn, conditions, selector, options?]`

| Position | Parameter | Type | Description |
|----------|-----------|------|-------------|
| 0 | `valueFn` | `Function` or `any` | State value or function returning value |
| 1 | `conditions` | `object` or `Function` | Condition mappings |
| 2 | `selector` | `string`, `Element`, `NodeList`, `Array` | Target elements |
| 3 | `options` | `object` (optional) | `{ reactive: boolean }` — only for `whenStates()` |

**Returns:** Combined cleanup object with `update()`, `destroy()`, `count`, and `getCleanups()`.

---

## Why Does This Exist?

### The Situation: Multiple Watchers

A typical UI page has many conditional bindings — status badges, theme settings, layout toggles, validation states. Each one needs its own `whenState()` call and its own cleanup:

```javascript
// Without batch — managing many individual watchers
const cleanup1 = Conditions.whenState(() => status.value, statusCond, '#status');
const cleanup2 = Conditions.whenState(() => theme.value, themeCond, 'body');
const cleanup3 = Conditions.whenState(() => count.value, countCond, '#counter');
const cleanup4 = Conditions.whenState(() => role.value, roleCond, '#badge');

// Cleaning up — must remember every single one
cleanup1.destroy();
cleanup2.destroy();
cleanup3.destroy();
cleanup4.destroy();
```

It works, but it's verbose. You end up with many separate cleanup variables, and forgetting one causes a memory leak.

### With Batch States

One call, one cleanup:

```javascript
const cleanup = Conditions.whenWatches([
  [() => status.value, statusCond, '#status'],
  [() => theme.value,  themeCond,  'body'],
  [() => count.value,  countCond,  '#counter'],
  [() => role.value,   roleCond,   '#badge']
]);

// One call cleans up everything
cleanup.destroy();
```

**What changed?**
- All watchers declared in one place — easy to see the full picture
- One cleanup object — no risk of forgetting one
- Automatically wrapped in `Conditions.batch()` — optimized execution
- Input validation — invalid configs are skipped with warnings, not errors

---

## Mental Model

Think of it like a **TV remote control** vs individual power switches.

```
Without batch (individual switches):
├── Walk to TV → press power
├── Walk to speakers → press power
├── Walk to lights → press switch
└── Walk to fan → press switch
   → 4 separate actions, 4 things to remember to turn off

With batch (remote control):
└── Press "All On" → everything turns on
└── Press "All Off" → everything turns off
   → 1 action for all, 1 action to clean up
```

The batch methods are your remote control for conditional watchers.

---

## How Does It Work?

```
Conditions.whenStates([ config1, config2, config3 ])
   ↓
1️⃣ Validate input is an array (non-empty)
   ↓
2️⃣ Wrap everything in Conditions.batch() for optimization
   ↓
3️⃣ For each config in the array:
   ├── Validate: is it an array with at least 3 elements?
   ├── Validate: valueFn not null/undefined?
   ├── Validate: conditions is an object or function?
   ├── Validate: selector exists?
   ├── Invalid? → Skip with warning, continue to next
   └── Valid? → Call Conditions.whenState(valueFn, conditions, selector, options)
       └── Store cleanup object
   ↓
4️⃣ Create combined cleanup from all stored cleanups
   ├── update()  → calls update() on each individual cleanup
   ├── destroy() → calls destroy() on each, then clears the array
   ├── count     → number of active cleanups
   └── getCleanups() → returns copy of all cleanup objects
```

### whenWatches() — How It Differs

`whenWatches()` maps over the configs and adds `{ reactive: true }` to each before passing them to `whenStates()`:

```
whenWatches(configs)
   ↓
Add { reactive: true } to each config's options
   ↓
Call whenStates(modifiedConfigs)
```

### whenApplies() — How It Differs

`whenApplies()` uses `Conditions.apply()` instead of `Conditions.whenState()`:

```
whenApplies(configs)
   ↓
For each config:
   └── Call Conditions.apply(value, conditions, selector)
       └── Create manual cleanup with update() that re-applies
```

---

## Basic Usage

### whenWatches() — All Reactive

The most common pattern. All watchers auto-update when state changes:

```javascript
const status = state('idle');
const theme = state('light');

const cleanup = Conditions.whenWatches([
  [
    () => status.value,
    {
      'idle':    { textContent: 'Ready', style: { color: 'gray' } },
      'loading': { textContent: 'Loading...', style: { color: 'blue' } },
      'done':    { textContent: 'Complete', style: { color: 'green' } }
    },
    '#statusBadge'
  ],
  [
    () => theme.value,
    {
      'dark':  { style: { backgroundColor: '#1a1a1a', color: '#fff' } },
      'light': { style: { backgroundColor: '#fff', color: '#000' } }
    },
    'body'
  ]
]);

// State changes trigger automatic updates
status.value = 'loading';  // #statusBadge updates
theme.value = 'dark';      // body updates

// Cleanup all at once
cleanup.destroy();
```

### whenApplies() — All Static

One-time setup. No reactivity, no auto-updates:

```javascript
const cleanup = Conditions.whenApplies([
  [
    new Date().getHours() < 18 ? 'light' : 'dark',
    {
      'light': { setAttribute: { 'data-theme': 'light' } },
      'dark':  { setAttribute: { 'data-theme': 'dark' } }
    },
    'body'
  ],
  [
    navigator.language.startsWith('fr') ? 'fr' : 'en',
    {
      'fr': { setAttribute: { lang: 'fr' } },
      'en': { setAttribute: { lang: 'en' } }
    },
    'html'
  ]
]);
```

### whenStates() — Mixed Mode

Some watchers reactive, some static:

```javascript
const cleanup = Conditions.whenStates([
  // Reactive — auto-updates when count changes
  [() => count.value, countCond, '#counter', { reactive: true }],

  // Static — applied once
  ['admin', roleCond, '#badge', { reactive: false }]
]);
```

---

## The Cleanup Object

Every batch method returns a combined cleanup object:

```javascript
const cleanup = Conditions.whenWatches([...configs]);

// Properties
cleanup.count;           // Number of active cleanups (e.g., 4)

// Methods
cleanup.update();        // Manually re-evaluate all watchers
cleanup.destroy();       // Stop all watchers and free resources
cleanup.getCleanups();   // Get array of individual cleanup objects

// After destroy:
cleanup.count;           // 0
```

### update() vs destroy()

```
update()  → Re-evaluates all watchers (they stay active)
destroy() → Stops all watchers permanently (can't be re-used)
```

---

## Utility Methods

### createBatchConfig(configs, mode)

Create a reusable function that sets up a batch:

```javascript
const setupDashboard = Conditions.createBatchConfig([
  [() => userCount.value, userCond, '.user-count'],
  [() => revenue.value,   revCond,  '.revenue'],
  [() => status.value,    statCond, '.system-status']
], 'watch');

// Execute it whenever needed — each call creates independent watchers
const cleanup1 = setupDashboard();
const cleanup2 = setupDashboard();

// Cleanup independently
cleanup1.destroy();
cleanup2.destroy();
```

**Mode options:** `'state'` (default), `'watch'`, `'apply'`

### combineBatches(...configArrays)

Merge multiple config arrays into a single batch:

```javascript
const userConfigs = [
  [() => userName.value, nameCond, '.username'],
  [() => userRole.value, roleCond, '.user-role']
];

const uiConfigs = [
  [() => theme.value,    themeCond,    'body'],
  [() => sidebar.value,  sidebarCond,  '.sidebar']
];

// Combine and execute as one batch
const cleanup = Conditions.combineBatches(userConfigs, uiConfigs);

// One cleanup for everything
cleanup.destroy();
```

---

## Input Validation

The module validates each config and **skips invalid ones** with console warnings. Valid configs still execute:

```javascript
const cleanup = Conditions.whenStates([
  [() => count.value, countCond, '.counter'],   // Valid — runs
  [() => name.value, nameCond],                  // Invalid (no selector) — skipped
  [null, roleCond, '#badge'],                    // Invalid (null valueFn) — skipped
  [() => theme.value, themeCond, 'body']         // Valid — runs
]);

// Console:
// [Conditions.BatchStates] Config at index 1 must have at least 3 elements...
// [Conditions.BatchStates] Config at index 2: valueFn is required
// [Conditions.BatchStates] ✓ Initialized 2 state watchers

cleanup.count;  // 2 (only valid configs)
```

---

## Integration

### Global Shortcuts

If the Conditions Shortcuts module (file 05) is loaded, batch methods are also available globally:

```javascript
// Global shortcuts
whenStates([...configs]);
whenWatches([...configs]);
whenApplies([...configs]);

// Or via CondShortcuts if conflicts exist
CondShortcuts.whenStates([...configs]);
```

### DOMHelpers Integration

The methods are also added to `Elements`, `Collections`, and `Selector` if they exist:

```javascript
Elements.whenWatches([...configs]);
Collections.whenStates([...configs]);
Selector.whenApplies([...configs]);
```

---

## Load Order

```html
<!-- 1. Core Conditions module (required) -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- 2. Optional extensions (loaded before batch) -->
<script src="02_dh-conditions-default.js"></script>
<script src="03_dh-conditions-collection-extension.js"></script>

<!-- 3. Batch States (after Conditions) -->
<script src="08_dh-conditions-batch-states.js"></script>
```

Requires `Conditions.whenState()` and `Conditions.batch()` — both part of Conditions v4.0.0+.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Batch multiple conditional watchers into one call with unified cleanup |
| **whenStates()** | Mixed mode — each config controls its own reactivity |
| **whenWatches()** | All reactive — auto-updates on state changes |
| **whenApplies()** | All static — one-time application, no reactivity |
| **createBatchConfig()** | Create reusable batch functions |
| **combineBatches()** | Merge multiple config arrays into one batch |
| **Config format** | `[valueFn, conditions, selector, options?]` |
| **Cleanup object** | `update()`, `destroy()`, `count`, `getCleanups()` |
| **Validation** | Invalid configs skipped with warnings, valid ones still run |
| **Performance** | All calls wrapped in `Conditions.batch()` automatically |
| **Integration** | Available on `Conditions`, `Elements`, `Collections`, `Selector`, and as global shortcuts |

> **Simple Rule to Remember:** Instead of writing multiple separate `Conditions.whenState()` calls and tracking each cleanup individually, use `whenWatches([...])` to declare them all at once and get a single cleanup object. Use `whenApplies` for one-time setup, `whenWatches` for reactive updates, and `whenStates` when you need a mix of both.