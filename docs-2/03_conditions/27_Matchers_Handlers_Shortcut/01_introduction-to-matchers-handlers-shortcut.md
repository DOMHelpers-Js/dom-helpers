[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Matchers & Handlers Global Shortcut — Introduction

## Quick Start (30 seconds)

```javascript
// Register a custom matcher — globally, no namespace needed
registerMatcher('positive', {
  test: (condition) => condition === 'positive',
  match: (value) => value > 0
});

// Use it immediately in conditions
Conditions.whenState(() => balance.value, {
  'positive': { textContent: 'In credit', style: { color: 'green' } },
  'default':  { textContent: 'No balance', style: { color: 'gray' } }
}, '#balanceBadge');
```

---

## What Is the Matchers & Handlers Shortcut?

The Conditions module lets you extend its behavior by registering **custom matchers** (new condition patterns) and **custom handlers** (new property types). Normally, you'd do this through `Conditions.registerMatcher()` and `Conditions.registerHandler()`.

This shortcut module provides **direct global functions** for all registration and inspection tasks — so you can write `registerMatcher(...)` instead of `Conditions.registerMatcher(...)`.

It exposes **11 global functions**:

| Function | Purpose |
|----------|---------|
| `registerMatcher()` | Register a single custom matcher |
| `registerHandler()` | Register a single custom handler |
| `registerMatchers()` | Register multiple matchers at once |
| `registerHandlers()` | Register multiple handlers at once |
| `getMatchers()` | List all registered matcher names |
| `getHandlers()` | List all registered handler names |
| `hasMatcher()` | Check if a matcher exists |
| `hasHandler()` | Check if a handler exists |
| `createSimpleMatcher()` | Quick helper to create a keyword matcher |
| `createSimpleHandler()` | Quick helper to create a property handler |
| `listExtensions()` | Print all registered matchers and handlers |

All functions are also available via the `ConditionsExtensions` namespace and `Conditions.extensions`.

---

## Syntax

```javascript
// Global shortcuts (primary)
registerMatcher(name, { test, match });
registerHandler(name, { test, apply });

// Namespaced access
ConditionsExtensions.registerMatcher(name, { test, match });
ConditionsExtensions.registerHandler(name, { test, apply });

// Via Conditions object
Conditions.extensions.registerMatcher(name, { test, match });
Conditions.extensions.registerHandler(name, { test, apply });
```

---

## Why Does This Exist?

### The Situation: Extending Conditions

When you need a condition pattern that isn't built-in — like checking if a date is a weekday, or if a user has a specific permission — you register a custom matcher. When you need a property type that isn't built-in — like triggering an animation or updating a canvas — you register a custom handler.

### Without Shortcuts

Every registration call needs the `Conditions.` prefix:

```javascript
Conditions.registerMatcher('weekday', { test: ..., match: ... });
Conditions.registerMatcher('weekend', { test: ..., match: ... });
Conditions.registerHandler('animate', { test: ..., apply: ... });
Conditions.registerHandler('canvas',  { test: ..., apply: ... });
console.log(Conditions.getMatchers());
console.log(Conditions.getHandlers());
```

### With Shortcuts

Shorter, cleaner, and with extra convenience methods:

```javascript
registerMatcher('weekday', { test: ..., match: ... });
registerMatcher('weekend', { test: ..., match: ... });
registerHandler('animate', { test: ..., apply: ... });
registerHandler('canvas',  { test: ..., apply: ... });
console.log(getMatchers());
console.log(getHandlers());

// Plus extras not available on the core module:
createSimpleMatcher('positive', 'positive', val => val > 0);
createSimpleHandler('fadeIn', 'fadeIn', (el, ms) => { ... });
registerMatchers({ matcher1: {...}, matcher2: {...} });
hasMatcher('weekday');  // true
listExtensions();       // prints everything to console
```

---

## Mental Model

Think of it like a **workshop tool bench**.

```
Full path (Conditions.registerMatcher):
├── Walk to the workshop
├── Open the toolbox
├── Find the registration drawer
└── Add the new tool

Global shortcut (registerMatcher):
└── Hand reaches directly into the drawer — same result, fewer steps

Extra convenience:
├── createSimpleMatcher → Pre-built template, just fill in the blanks
├── registerMatchers → Add a whole set of tools at once
├── hasMatcher → "Is this tool already in the drawer?"
└── listExtensions → "Show me everything in the toolbox"
```

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
   ├── Conditions.registerMatcher exists? → Continue
   ├── Conditions.registerHandler exists? → Continue
   └── Missing? → Error ("version too old")
   ↓
3️⃣ Create wrapper functions
   ├── registerMatcher(name, matcher) → validates, then calls Conditions.registerMatcher()
   ├── registerHandler(name, handler) → validates, then calls Conditions.registerHandler()
   ├── Batch helpers: registerMatchers(), registerHandlers()
   ├── Quick creators: createSimpleMatcher(), createSimpleHandler()
   ├── Inspectors: getMatchers(), getHandlers(), hasMatcher(), hasHandler()
   └── Diagnostic: listExtensions()
   ↓
4️⃣ Export everywhere
   ├── Global scope: window.registerMatcher, window.registerHandler, etc.
   ├── Namespace: window.ConditionsExtensions = { all methods }
   ├── Conditions: Conditions.extensions = { all methods }
   ├── Elements: Elements.registerMatcher, Elements.registerHandler (if available)
   └── Collections: Collections.registerMatcher, Collections.registerHandler (if available)
```

### Key Detail: Input Validation

Unlike the core `Conditions.registerMatcher()`, the shortcut wrappers **validate the input** before passing it through:

```
registerMatcher(name, matcher)
   ↓
   Is matcher an object? → No → Error, return
   ↓
   Is matcher.test a function? → No → Error, return
   ↓
   Is matcher.match a function? → No → Error, return
   ↓
   Call Conditions.registerMatcher(name, matcher)
   ↓
   Return chainable API
```

This catches common mistakes early with clear error messages.

### Key Detail: Chainable API

All registration functions return the same `API` object, so you can chain them:

```javascript
registerMatcher('positive', { test: ..., match: ... })
  .registerMatcher('negative', { test: ..., match: ... })
  .registerHandler('animate', { test: ..., apply: ... });
```

---

## Understanding Matchers vs Handlers

Before diving into the API, let's clarify the two concepts:

### Matchers — "Does This Condition Apply?"

A **matcher** determines whether a value satisfies a condition pattern. It has two functions:

```javascript
{
  test: (condition) => boolean,  // Does this matcher handle this condition string?
  match: (value, condition) => boolean  // Does the value satisfy the condition?
}
```

```
Example: 'weekday' matcher

Value: new Date('2024-01-15')   ← a Monday
Condition string: 'weekday'

Step 1 — test('weekday') → true (this matcher handles 'weekday')
Step 2 — match(date, 'weekday') → true (Monday is a weekday)
```

### Handlers — "How Do I Apply This Property?"

A **handler** determines how to apply a property to a DOM element. It has two functions:

```javascript
{
  test: (key, val) => boolean,  // Does this handler handle this property key?
  apply: (element, val, key) => void  // Apply the property to the element
}
```

```
Example: 'animate' handler

Config: { animate: { type: 'fadeIn', duration: 300 } }
Element: <div id="box">

Step 1 — test('animate', {...}) → true (this handler handles 'animate')
Step 2 — apply(element, { type: 'fadeIn', duration: 300 }) → runs animation
```

---

## Core API

### registerMatcher(name, matcher)

Register a single custom condition matcher.

```javascript
registerMatcher('even', {
  test: (condition) => condition === 'even',
  match: (value) => typeof value === 'number' && value % 2 === 0
});

// Now you can use it:
Conditions.whenState(() => count.value, {
  'even': { textContent: 'Even number' },
  'default': { textContent: 'Odd number' }
}, '#display');
```

### registerHandler(name, handler)

Register a single custom property handler.

```javascript
registerHandler('tooltip', {
  test: (key) => key === 'tooltip',
  apply: (element, val) => {
    element.setAttribute('title', val);
    element.setAttribute('data-tooltip', val);
  }
});

// Now you can use it in configs:
Conditions.whenState(() => status.value, {
  'error': { tooltip: 'Something went wrong', style: { color: 'red' } }
}, '#badge');
```

### registerMatchers(matchersMap)

Register multiple matchers at once.

```javascript
registerMatchers({
  even: {
    test: (condition) => condition === 'even',
    match: (value) => value % 2 === 0
  },
  odd: {
    test: (condition) => condition === 'odd',
    match: (value) => value % 2 !== 0
  },
  positive: {
    test: (condition) => condition === 'positive',
    match: (value) => value > 0
  }
});
// [registerMatchers] ✓ Registered 3 matchers
```

### registerHandlers(handlersMap)

Register multiple handlers at once.

```javascript
registerHandlers({
  tooltip: {
    test: (key) => key === 'tooltip',
    apply: (el, val) => el.setAttribute('title', val)
  },
  visibility: {
    test: (key) => key === 'visibility',
    apply: (el, val) => { el.style.display = val ? 'block' : 'none'; }
  }
});
// [registerHandlers] ✓ Registered 2 handlers
```

### getMatchers() / getHandlers()

List all registered matcher or handler names.

```javascript
console.log(getMatchers());
// ['booleanTrue', 'booleanFalse', 'truthy', 'falsy', ..., 'even', 'odd']

console.log(getHandlers());
// ['style', 'classList', 'setAttribute', ..., 'tooltip', 'visibility']
```

### hasMatcher(name) / hasHandler(name)

Check if a specific matcher or handler is already registered.

```javascript
hasMatcher('even');     // true (we registered it above)
hasMatcher('weekday');  // false

hasHandler('style');     // true (built-in)
hasHandler('tooltip');   // true (we registered it above)
hasHandler('canvas');    // false
```

### listExtensions()

Print all registered matchers and handlers to the console — useful for debugging:

```javascript
listExtensions();
// [Conditions.Extensions] Registered Extensions
//   Matchers (20): ['booleanTrue', 'booleanFalse', 'truthy', ...]
//   Handlers (12): ['style', 'classList', 'setAttribute', ...]
```

---

## Quick Creator Helpers

### createSimpleMatcher(name, keyword, checkFn)

A shorthand for creating matchers that match a single keyword:

```javascript
// Instead of this:
registerMatcher('positive', {
  test: (condition) => condition === 'positive',
  match: (value) => value > 0
});

// Write this:
createSimpleMatcher('positive', 'positive', val => val > 0);
```

The three parameters:
1. `name` — internal name for the matcher
2. `keyword` — the condition string it responds to
3. `checkFn` — `(value) => boolean` — the actual check

```javascript
// More examples:
createSimpleMatcher('negative', 'negative', val => val < 0);
createSimpleMatcher('zero', 'zero', val => val === 0);
createSimpleMatcher('adult', 'adult', val => val >= 18);
createSimpleMatcher('even', 'even', val => val % 2 === 0);
```

### createSimpleHandler(name, propertyKey, applyFn)

A shorthand for creating handlers that match a single property key:

```javascript
// Instead of this:
registerHandler('fadeIn', {
  test: (key) => key === 'fadeIn',
  apply: (element, val) => {
    element.style.transition = `opacity ${val}ms`;
    element.style.opacity = '1';
  }
});

// Write this:
createSimpleHandler('fadeIn', 'fadeIn', (el, duration) => {
  el.style.transition = `opacity ${duration}ms`;
  el.style.opacity = '1';
});
```

The three parameters:
1. `name` — internal name for the handler
2. `propertyKey` — the config key it responds to
3. `applyFn` — `(element, value) => void` — the application logic

---

## Access Paths

The API is available through multiple paths:

```javascript
// 1. Global functions (primary)
registerMatcher(name, matcher);
getMatchers();

// 2. ConditionsExtensions namespace
ConditionsExtensions.registerMatcher(name, matcher);
ConditionsExtensions.getMatchers();

// 3. Conditions.extensions
Conditions.extensions.registerMatcher(name, matcher);
Conditions.extensions.getMatchers();

// 4. Elements (if DOMHelpers is loaded)
Elements.registerMatcher(name, matcher);
Elements.getMatchers();

// 5. Collections (if DOMHelpers is loaded)
Collections.registerMatcher(name, matcher);
```

### Aliases

Some methods have convenience aliases on the API object:

| Primary | Alias |
|---------|-------|
| `registerMatcher` | `addMatcher` |
| `registerHandler` | `addHandler` |
| `getMatchers` | `listMatchers` |
| `getHandlers` | `listHandlers` |

```javascript
// These are identical:
ConditionsExtensions.registerMatcher('even', matcher);
ConditionsExtensions.addMatcher('even', matcher);
```

---

## Load Order

```html
<!-- 1. Core Conditions module (required) -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- 2. Optional extensions -->
<script src="02_dh-conditions-default.js"></script>

<!-- 3. Matchers & Handlers Shortcut (after Conditions) -->
<script src="06_dh-matchers-handlers-shortcut.js"></script>
```

The module requires `Conditions.registerMatcher()` and `Conditions.registerHandler()` to exist — these are part of Conditions v4.0.0+.

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Global shortcuts for registering custom matchers and handlers |
| **registerMatcher()** | Register a custom condition pattern |
| **registerHandler()** | Register a custom property type |
| **registerMatchers/Handlers()** | Batch registration for multiple at once |
| **createSimpleMatcher()** | Quick helper — just provide keyword and check function |
| **createSimpleHandler()** | Quick helper — just provide key and apply function |
| **getMatchers/Handlers()** | List all registered names |
| **hasMatcher/Handler()** | Check if one exists |
| **listExtensions()** | Print everything to console |
| **Chainable** | All registration methods return the API for chaining |
| **Multi-access** | Global, `ConditionsExtensions`, `Conditions.extensions`, `Elements`, `Collections` |
| **Validation** | Input is validated before passing to Conditions core |

> **Simple Rule to Remember:** This module puts `registerMatcher()` and `registerHandler()` on the global scope so you can extend the Conditions system without typing `Conditions.` every time. It also adds batch registration, existence checks, quick creator helpers, and a diagnostic tool — all chainable, all globally accessible.