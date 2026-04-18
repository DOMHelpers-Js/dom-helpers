[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Conditions Default Branch — Introduction

## Quick Start (30 seconds)

```javascript
// Add a 'default' key to catch ANY value that doesn't match other conditions
Conditions.whenState(
  () => status.value,
  {
    'active':   { style: { color: 'green' },  textContent: 'Online' },
    'inactive': { style: { color: 'red' },    textContent: 'Offline' },
    'default':  { style: { color: 'orange' }, textContent: 'Unknown' }  // Fallback!
  },
  '#statusBadge'
);

// If status is 'active' → green, 'Online'
// If status is 'inactive' → red, 'Offline'
// If status is ANYTHING ELSE → orange, 'Unknown'
```

---

## What Is the Conditions Default Extension?

The Conditions Default module adds support for a **`'default'` key** in your condition maps. It works just like `default` in a JavaScript `switch` statement — if no other condition matches the current value, the `default` config is applied as a fallback.

Simply put, it's a safety net. Without it, if the value doesn't match any condition, **nothing happens** and the element keeps its previous state. With it, you always have a guaranteed fallback.

---

## Syntax

Just add `'default'` as a key in your condition map:

```javascript
Conditions.whenState(valueFn, {
  'condition1': { /* config */ },
  'condition2': { /* config */ },
  'default':    { /* fallback config */ }
}, selector);
```

Works with all three core methods:

```javascript
Conditions.whenState(valueFn, conditions, selector);
Conditions.apply(value, conditions, selector);
Conditions.watch(valueFn, conditions, selector);
```

---

## Why Does This Exist?

### The Problem: Unmatched Values

Consider a status badge that handles three known states:

```javascript
Conditions.whenState(
  () => status.value,
  {
    'active':  { textContent: 'Online',  style: { color: 'green' } },
    'idle':    { textContent: 'Idle',    style: { color: 'orange' } },
    'offline': { textContent: 'Offline', style: { color: 'red' } }
  },
  '#statusBadge'
);
```

This works perfectly for `'active'`, `'idle'`, and `'offline'`. But what happens if the status becomes `'connecting'`, `'error'`, or any other unexpected value?

**Nothing.** No condition matches, so the element keeps whatever state it had before. This can leave the UI in an inconsistent state.

### The Solution: A Default Fallback

```javascript
Conditions.whenState(
  () => status.value,
  {
    'active':  { textContent: 'Online',  style: { color: 'green' } },
    'idle':    { textContent: 'Idle',    style: { color: 'orange' } },
    'offline': { textContent: 'Offline', style: { color: 'red' } },
    'default': { textContent: 'Unknown', style: { color: 'gray' } }
  },
  '#statusBadge'
);
```

Now **every possible value** is handled. Known states get their specific configs, and anything unexpected gets a clean fallback.

---

## Mental Model

Think of it like a **train station destination board**.

```
Incoming train destination: "Paris"

Board rules:
├── "London"  → Platform 1
├── "Paris"   → Platform 2  ✅ Match!
├── "Berlin"  → Platform 3
└── "default" → Platform 0 (General Waiting Area)

Incoming train destination: "Tokyo"

Board rules:
├── "London"  → Platform 1  ✗
├── "Paris"   → Platform 2  ✗
├── "Berlin"  → Platform 3  ✗
└── "default" → Platform 0 (General Waiting Area)  ✅ Fallback!
```

Without `default`, the train with destination "Tokyo" would have no platform assigned — passengers would be stuck. With `default`, there's always a place to go.

---

## How Does It Work?

The extension is a **non-invasive wrapper** — it wraps the original `whenState()`, `apply()`, and `watch()` methods without modifying their internal logic.

```
You write:
{
  'active':  { style: { color: 'green' } },
  'inactive': { style: { color: 'red' } },
  'default':  { style: { color: 'gray' } }
}
   ↓
Module transforms to:
{
  'active':       { style: { color: 'green' } },
  'inactive':     { style: { color: 'red' } },
  '/^[\\s\\S]*$/': { style: { color: 'gray' } }   ← catch-all regex
}
   ↓
Passed to the original Conditions method
```

**What's happening?**

1. The module checks if `'default'` exists in your condition map
2. If it does, it **removes** the `'default'` key
3. It **replaces** it with a regex pattern `/^[\s\S]*$/` — a pattern that matches **any string**
4. This regex is placed **last** in the object, so it only triggers if nothing else matches
5. The transformed conditions are passed to the original method

Since all the condition matchers run in order and the regex catch-all is last, it acts exactly like a `default` branch.

---

## Basic Usage

### With Conditions.apply() — One-Time

```javascript
Conditions.apply(apiResponse.status, {
  'success': {
    textContent: 'Data loaded',
    classList: { add: 'alert-success' }
  },
  'error': {
    textContent: 'Failed to load',
    classList: { add: 'alert-error' }
  },
  'default': {
    textContent: 'Unexpected status',
    classList: { add: 'alert-warning' }
  }
}, '#apiMessage');
```

### With Conditions.whenState() — Reactive

```javascript
const userRole = state('guest');

Conditions.whenState(
  () => userRole.value,
  {
    'admin': {
      textContent: 'Admin Access',
      style: { backgroundColor: 'red', color: 'white' }
    },
    'moderator': {
      textContent: 'Moderator Access',
      style: { backgroundColor: 'blue', color: 'white' }
    },
    'user': {
      textContent: 'User Access',
      style: { backgroundColor: 'green', color: 'white' }
    },
    'default': {
      textContent: 'Limited Access',
      style: { backgroundColor: 'gray', color: 'white' }
    }
  },
  '#roleBadge'
);

// 'guest' doesn't match admin/moderator/user → default applies
userRole.value = 'guest';     // "Limited Access" (gray)
userRole.value = 'admin';     // "Admin Access" (red)
userRole.value = 'unknown';   // "Limited Access" (gray) — default catches it
```

### With Conditions.watch() — Explicitly Reactive

```javascript
const connectionState = state('connecting');

Conditions.watch(
  () => connectionState.value,
  {
    'connected':    { textContent: 'Connected',    style: { color: 'green' } },
    'disconnected': { textContent: 'Disconnected', style: { color: 'red' } },
    'default':      { textContent: 'Connecting...', style: { color: 'gray' } }
  },
  '#connectionStatus'
);
```

---

## Works with All Matcher Types

The `'default'` key works alongside any built-in or custom condition matchers:

```javascript
// With numeric ranges
Conditions.whenState(
  () => temperature.value,
  {
    '<0':     { textContent: 'Freezing' },
    '0-10':   { textContent: 'Cold' },
    '11-20':  { textContent: 'Cool' },
    '21-30':  { textContent: 'Warm' },
    '>30':    { textContent: 'Hot' },
    'default': { textContent: 'Unknown' }   // NaN, null, etc.
  },
  '#tempDisplay'
);

// With regex and string patterns
Conditions.apply(fileName, {
  'endsWith:.pdf': { classList: { add: 'icon-pdf' } },
  'endsWith:.doc': { classList: { add: 'icon-doc' } },
  '/\\.(jpg|png|gif)$/': { classList: { add: 'icon-image' } },
  'default': { classList: { add: 'icon-generic' } }
}, '#fileIcon');

// With boolean matchers
Conditions.apply(isEnabled, {
  'true':    { textContent: 'Enabled',  style: { color: 'green' } },
  'false':   { textContent: 'Disabled', style: { color: 'red' } },
  'default': { textContent: 'Unknown',  style: { color: 'gray' } }
}, '#featureToggle');
```

---

## Works with Dynamic Conditions

The `'default'` key works inside function-based conditions too:

```javascript
const mode = state('view');
const hasPermission = state(false);

Conditions.whenState(
  () => mode.value,
  () => ({
    'edit': hasPermission.value
      ? { textContent: 'Edit Mode', disabled: false }
      : { textContent: 'Edit (No Permission)', disabled: true },
    'view': {
      textContent: 'View Mode'
    },
    'default': {
      textContent: 'Unknown Mode'
    }
  }),
  '#modeIndicator'
);
```

---

## Load Order

```html
<!-- 1. Core Conditions module (required) -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- 2. Default extension (after Conditions) -->
<script src="02_dh-conditions-default.js"></script>
```

If the Conditions module is not loaded, the extension logs an error and exits:

```
[Conditions.Default] Requires Conditions.js to be loaded first
```

---

## restoreOriginal() — Reverting the Extension

If you need to remove the default branch support (for debugging or testing):

```javascript
Conditions.restoreOriginal();
// Original methods restored — 'default' key no longer works as a fallback
```

After calling `restoreOriginal()`, the `'default'` key would be treated like any other string condition (matching only when the value is literally the string `"default"`).

---

## Checking if the Extension Is Loaded

```javascript
// Check version
console.log(Conditions.extensions.defaultBranch);  // '1.0.0'

// If undefined, the extension is not loaded
if (Conditions.extensions && Conditions.extensions.defaultBranch) {
  console.log('Default branch support is active');
}
```

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Adds a `'default'` key to condition maps as a catch-all fallback |
| **How** | Replaces `'default'` with a catch-all regex, passed to original methods |
| **When it triggers** | Only when no other condition matches |
| **Works with** | `whenState()`, `apply()`, `watch()` — all three |
| **Compatibility** | Works alongside all matchers (string, numeric, regex, etc.) |
| **Non-invasive** | Original methods preserved; revert with `restoreOriginal()` |
| **Requires** | `Conditions.js` must be loaded first |

> **Simple Rule to Remember:** Add `'default': { ... }` as the last key in your condition map — it catches any value that no other condition handles. It's the `else` clause for your conditions.