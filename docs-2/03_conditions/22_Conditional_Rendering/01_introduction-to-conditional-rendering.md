[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Conditional Rendering — Introduction

## Quick Start (30 seconds)

```javascript
// Apply different styles based on a value
Conditions.apply('active', {
  'active':   { style: { color: 'green' }, textContent: 'Online' },
  'inactive': { style: { color: 'gray' },  textContent: 'Offline' }
}, '#statusBadge');

// Reactive: auto-updates when state changes
const status = state('idle');

Conditions.whenState(
  () => status.value,
  {
    'idle':    { textContent: 'Start',      disabled: false },
    'loading': { textContent: 'Loading...', disabled: true },
    'done':    { textContent: 'Complete!',  disabled: true }
  },
  '#submitBtn'
);

status.value = 'loading';  // Button updates automatically!
```

---

## What Is the Conditional Rendering Module?

The Conditional Rendering module lets you **describe what an element should look like for each possible value** — and the module handles applying the right configuration automatically.

Simply put, instead of writing `if/else` chains to update your UI, you write a **condition map** — an object where each key is a condition and each value is the set of DOM updates to apply when that condition is met.

```javascript
// The condition map: "when the value is X, apply this config"
{
  'active':   { textContent: 'Online',  style: { color: 'green' } },
  'inactive': { textContent: 'Offline', style: { color: 'gray' } }
}
```

The module checks the current value against each condition key (top to bottom), and applies the **first matching** configuration to the target element(s).

---

## Syntax

### Conditions.apply() — Run Once

```javascript
Conditions.apply(value, conditionsMap, selector);
```

### Conditions.whenState() — Auto-Update (Reactive)

```javascript
Conditions.whenState(valueFn, conditionsMap, selector, options);
```

### Conditions.watch() — Shortcut for Reactive

```javascript
Conditions.watch(valueFn, conditionsMap, selector);
```

**Common Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` / `valueFn` | `any` or `Function` | The value to match, or a function returning it |
| `conditionsMap` | `object` or `Function` | Keys are conditions, values are update configs |
| `selector` | `string`, `Element`, `NodeList`, `Array` | Target element(s) |
| `options` | `object` (optional) | `{ reactive: true/false }` |

---

## Why Does This Exist?

### The Manual Way — if/else Chains

When your UI needs to reflect different states, you'd normally write:

```javascript
function updateButton(status) {
  const btn = document.getElementById('submitBtn');

  if (status === 'idle') {
    btn.textContent = 'Start';
    btn.disabled = false;
    btn.style.backgroundColor = '#007bff';
    btn.classList.remove('btn-success', 'btn-danger');
    btn.classList.add('btn-primary');
  } else if (status === 'loading') {
    btn.textContent = 'Loading...';
    btn.disabled = true;
    btn.style.backgroundColor = '#6c757d';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
  } else if (status === 'success') {
    btn.textContent = 'Done!';
    btn.disabled = true;
    btn.style.backgroundColor = '#28a745';
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-success');
  } else if (status === 'error') {
    btn.textContent = 'Failed';
    btn.disabled = false;
    btn.style.backgroundColor = '#dc3545';
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-danger');
  }
}
```

This works, but notice:

- A lot of repetitive code
- The `if/else` structure mixes **logic** (which state?) with **DOM updates** (what to change)
- Adding a new state means adding another `else if` block
- You have to call `updateButton()` manually every time the status changes

### The Conditions Way — Declarative Map

```javascript
const status = state('idle');

Conditions.whenState(
  () => status.value,
  {
    'idle': {
      textContent: 'Start',
      disabled: false,
      style: { backgroundColor: '#007bff' },
      classList: { add: 'btn-primary', remove: ['btn-success', 'btn-danger'] }
    },
    'loading': {
      textContent: 'Loading...',
      disabled: true,
      style: { backgroundColor: '#6c757d' },
      classList: { add: 'btn-secondary', remove: 'btn-primary' }
    },
    'success': {
      textContent: 'Done!',
      disabled: true,
      style: { backgroundColor: '#28a745' },
      classList: { add: 'btn-success', remove: 'btn-secondary' }
    },
    'error': {
      textContent: 'Failed',
      disabled: false,
      style: { backgroundColor: '#dc3545' },
      classList: { add: 'btn-danger', remove: 'btn-secondary' }
    }
  },
  '#submitBtn'
);

// Now just change the state — the UI updates automatically
status.value = 'loading';
```

**What changed?**

- Each state's config is **clearly separated** — easy to read and modify
- No `if/else` logic — the module handles matching
- Adding a new state is just adding another key to the object
- With reactive state, the UI updates **automatically** when the value changes

---

## Mental Model

Think of it like a **jukebox with preset buttons**.

```
You select a song (the value)
   ↓
The jukebox finds the matching preset (condition matching)
   ↓
It plays that configuration (applies DOM updates)

Conditions.whenState(
  () => status.value,       ← Which song is selected?
  {
    'idle': { ... },        ← Preset 1
    'loading': { ... },     ← Preset 2
    'success': { ... }      ← Preset 3
  },
  '#submitBtn'              ← Which speaker to play through?
);
```

- The **value** is which button you press
- The **condition map** is the list of presets
- The **selector** is which element(s) get updated
- In reactive mode, changing the value is like pressing a different button — the output changes automatically

---

## How Does It Work?

```
Conditions.whenState(valueFn, conditions, selector)
   ↓
1️⃣ Get target elements from selector
   ├── '#id' → document.getElementById / Elements helper
   ├── '.class' → getElementsByClassName / Collections helper
   ├── 'css selector' → querySelectorAll / Selector helper
   ├── Element → use directly
   └── NodeList/Array → use as-is
   ↓
2️⃣ Get the current value: valueFn()
   ↓
3️⃣ Walk through condition keys (top to bottom):
   ├── Does 'idle' match the value? → Yes → apply config, STOP
   ├── Does 'loading' match? → skipped (already matched)
   └── ...
   ↓
4️⃣ Apply the matching config to each target element:
   ├── Use element.update() if available (DOMHelpers enhanced)
   └── Otherwise apply properties manually (style, classList, etc.)
   ↓
5️⃣ If reactive mode:
   └── Wrap steps 2-4 in effect() → auto-reruns when value changes
```

**Key Insight:** Only the **first matching condition** is applied. The module stops as soon as it finds a match, so the order of conditions matters.

---

## Basic Usage

### Static Mode: Apply Once

```javascript
// Apply based on a direct value
Conditions.apply('premium', {
  'free':    { textContent: 'Free Plan',    style: { color: 'gray' } },
  'premium': { textContent: 'Premium Plan', style: { color: 'gold' } }
}, '#planBadge');
```

### Static Mode with a Function

```javascript
// Value comes from a function (called once)
Conditions.apply(
  () => getUserRole(),
  {
    'admin': { classList: { add: 'admin-badge' } },
    'user':  { classList: { add: 'user-badge' } }
  },
  '.role-indicator'
);
```

### Reactive Mode: Auto-Update

```javascript
const theme = state('light');

Conditions.whenState(
  () => theme.value,
  {
    'light': {
      style: { backgroundColor: '#fff', color: '#000' },
      classList: { add: 'light-theme', remove: 'dark-theme' }
    },
    'dark': {
      style: { backgroundColor: '#1a1a1a', color: '#fff' },
      classList: { add: 'dark-theme', remove: 'light-theme' }
    }
  },
  'body'
);

// Change the state — body updates automatically
theme.value = 'dark';
```

### Multiple Target Elements

```javascript
const connectionStatus = state('connecting');

Conditions.whenState(
  () => connectionStatus.value,
  {
    'connecting':   { textContent: 'Connecting...', style: { color: 'orange' } },
    'connected':    { textContent: 'Connected',     style: { color: 'green' } },
    'disconnected': { textContent: 'Disconnected',  style: { color: 'red' } }
  },
  '.status-indicator'  // ALL elements with this class get updated
);
```

---

## Selector Types

The module accepts many selector formats:

```javascript
// CSS selectors (string)
Conditions.apply(value, conditions, '#myButton');           // ID
Conditions.apply(value, conditions, '.btn');                 // Class
Conditions.apply(value, conditions, 'input[type="email"]');  // Complex CSS

// Direct elements
const btn = document.getElementById('btn');
Conditions.apply(value, conditions, btn);

// Collections
const buttons = document.querySelectorAll('.btn');
Conditions.apply(value, conditions, buttons);

// Arrays
Conditions.apply(value, conditions, [element1, element2]);
```

When a string selector is provided, the module uses DOMHelpers (`Elements`, `Collections`, `Selector`) if available for optimized lookups, and falls back to native DOM methods otherwise.

---

## The Three API Methods

| Method | When to Use | Reactivity |
|--------|------------|------------|
| `Conditions.apply()` | Run once, immediate result | No (one-time) |
| `Conditions.whenState()` | Smart mode — auto-detects reactivity | Auto |
| `Conditions.watch()` | Explicitly reactive — re-runs on changes | Yes (requires reactive library) |

```javascript
// apply() — run once, done
Conditions.apply('active', conditions, '#badge');

// whenState() — reactive if state is reactive, otherwise one-time
Conditions.whenState(() => status.value, conditions, '#badge');

// watch() — always reactive, falls back to apply() if no reactivity
Conditions.watch(() => status.value, conditions, '#badge');
```

---

## Return Values

### Reactive Mode (whenState / watch with reactive state)

Returns a cleanup function from `effect()`:

```javascript
const cleanup = Conditions.whenState(
  () => status.value,
  conditions,
  '#badge'
);

// Later: stop watching
cleanup();
```

### Static Mode (apply / whenState without reactive state)

Returns an object with an `update()` method for manual re-evaluation:

```javascript
const result = Conditions.apply('active', conditions, '#badge');

// Later: re-evaluate conditions
result.update();
```

---

## Access Points

```javascript
// Global
Conditions.whenState(...);
Conditions.apply(...);
Conditions.watch(...);

// Via Elements helper (if loaded)
Elements.whenState(...);
Elements.whenApply(...);
Elements.whenWatch(...);

// Via Collections helper (if loaded)
Collections.whenState(...);
Collections.whenApply(...);
Collections.whenWatch(...);

// Via Selector helper (if loaded)
Selector.whenState(...);
Selector.whenApply(...);
Selector.whenWatch(...);
```

---

## Two Operating Modes

The module auto-detects which mode to run in:

```
Module loads
   ↓
Is ReactiveUtils / Elements.effect available?
   ├── Yes → Mode: 'reactive' (auto-updates supported)
   └── No  → Mode: 'static'  (one-time apply only)
```

```javascript
// Check the mode
console.log(Conditions.mode);          // 'reactive' or 'static'
console.log(Conditions.hasReactivity); // true or false
```

The module works perfectly in **static mode** without any reactive library — `Conditions.apply()` doesn't need reactivity at all. Reactive features (`whenState`, `watch`) gracefully fall back to one-time application in static mode.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Map values to DOM configurations — the right config is applied automatically |
| **Condition map** | Object where keys are conditions, values are update configs |
| **First match wins** | Conditions are checked top-to-bottom; first match applies |
| **Selectors** | Strings, elements, collections, arrays — all supported |
| **Reactive mode** | With reactive state, UI updates automatically on state change |
| **Static mode** | Without reactive state, applies once; use `.update()` to re-run |
| **Integration** | Available via `Conditions`, `Elements`, `Collections`, `Selector` |

> **Simple Rule to Remember:** Write a condition map that says "when the value is X, apply this config." The module matches the value, finds the right config, and applies it to your elements. With reactive state, it re-runs automatically whenever the value changes.