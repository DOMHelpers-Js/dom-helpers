[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Conditions Apply Standalone — Introduction

## Quick Start (30 seconds)

```javascript
// Apply conditions to elements — no dependencies needed!
ConditionsApply.apply('active', {
  'active':   { style: { color: 'green' }, classList: { add: 'active' } },
  'inactive': { style: { color: 'gray' },  classList: { remove: 'active' } },
  'default':  { style: { color: '#333' } }
}, '#statusBadge');
```

---

## What Is Conditions Apply Standalone?

`ConditionsApply.apply()` is a **standalone, zero-dependency** version of `Conditions.apply()`. It takes a value, matches it against a set of conditions, and applies the matching configuration to DOM elements — all without needing any other part of the DOMHelpers library.

It's completely self-contained:
- **Its own condition matching** — all built-in matchers (boolean, string, regex, numeric ranges) are replicated inside
- **Its own property handlers** — style, classList, setAttribute, dataset, event listeners, and more
- **Collection-aware** — supports bulk updates for all elements plus index-specific overrides
- **Built-in default branch** — native `'default'` fallback, no extension needed

Think of it as a portable toolkit you can drop into **any project** — no setup, no dependencies, just include the script and go.

---

## Syntax

```javascript
ConditionsApply.apply(value, conditions, selector);

// Also available on the Conditions global:
Conditions.apply(value, conditions, selector);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `any` | The current value to match against conditions |
| `conditions` | `object` or `Function` | Condition map — keys are patterns, values are config objects |
| `selector` | `string`, `Element`, `NodeList`, `Array` | Target element(s) |

**Returns:** `ConditionsApply` object (for chaining)

---

## Why Does This Exist?

### The Situation: Conditional Updates Without the Full Library

Imagine you have a small project — maybe a landing page, a widget, or a quick prototype. You want to change element styles based on a value (like a status, a score, or a user role), but you don't need the full DOMHelpers reactive system.

### Without ConditionsApply

You'd write manual if/else chains for every element update:

```javascript
const status = getStatus();
const badge = document.getElementById('statusBadge');

if (status === 'active') {
  badge.style.color = 'green';
  badge.classList.add('active');
  badge.classList.remove('inactive');
  badge.textContent = 'Active';
} else if (status === 'inactive') {
  badge.style.color = 'gray';
  badge.classList.add('inactive');
  badge.classList.remove('active');
  badge.textContent = 'Inactive';
} else {
  badge.style.color = '#333';
  badge.textContent = 'Unknown';
}
```

For a collection, this gets much longer — you'd need loops, index checks, and separate logic for individual elements.

### With ConditionsApply

One declarative call handles everything:

```javascript
ConditionsApply.apply(getStatus(), {
  'active':   { style: { color: 'green' },  classList: { add: 'active', remove: 'inactive' }, textContent: 'Active' },
  'inactive': { style: { color: 'gray' },   classList: { add: 'inactive', remove: 'active' }, textContent: 'Inactive' },
  'default':  { style: { color: '#333' },   textContent: 'Unknown' }
}, '#statusBadge');
```

**What changed?**
- No if/else chains — the condition map handles matching
- No manual DOM calls — the module applies properties for you
- Built-in `'default'` — catches any unmatched value automatically
- Works on collections too — with bulk + index support in the same call

---

## Mental Model

Think of it like a **paint-by-numbers kit**.

```
You pick a color number: "3"

The kit's instruction sheet:
├── Color 1 → Paint these areas blue
├── Color 2 → Paint these areas red
├── Color 3 → Paint these areas green  ← Match!
└── Default → Paint these areas gray

Result: All areas for Color 3 get painted green
```

You provide the value ("3"), the instruction sheet (conditions), and the canvas (selector). The module finds the matching instruction and applies it. If nothing matches, the default kicks in.

For collections, it's like painting a row of canvases — the bulk instructions apply to **all** canvases, and index-specific instructions give **individual** canvases their own treatment.

---

## How Does It Work?

```
ConditionsApply.apply(value, conditions, selector)
   ↓
1️⃣ Resolve elements from selector
   ├── '#id' → document.getElementById()
   ├── '.class' → document.getElementsByClassName()
   ├── 'css selector' → document.querySelectorAll()
   ├── Element → wrap in array
   ├── NodeList/HTMLCollection → safeArrayFrom()
   └── Array → filter for Elements
   ↓
2️⃣ Extract 'default' branch from conditions (if present)
   ├── regularConditions = everything except 'default'
   └── defaultConfig = the 'default' branch (saved as fallback)
   ↓
3️⃣ Match value against regular conditions (first match wins)
   ├── Boolean: 'true', 'false', 'truthy', 'falsy'
   ├── Null/Undefined: 'null', 'undefined', 'empty'
   ├── Quoted strings: '"exact"', "'exact'"
   ├── String patterns: 'includes:', 'startsWith:', 'endsWith:'
   ├── Regex: '/pattern/flags'
   ├── Numeric: '5', '10-20', '>50', '>=100', '<10', '<=5'
   └── String equality: 'active', 'pending', etc.
   ↓
4️⃣ No match found? → Use defaultConfig (if available)
   ↓
5️⃣ Apply matching config to collection:
   ├── Separate keys:
   │   ├── Non-numeric → sharedProps (applied to ALL elements)
   │   └── Numeric → indexProps (applied to specific elements)
   ├── Apply sharedProps to every element
   └── Apply indexProps to individual elements
       (negative indices converted: -1 → last element)
```

### Key Detail: How Default Branch Works

Unlike the Default Branch Extension (which transforms `'default'` into a regex), this standalone module handles `'default'` **natively** using destructuring:

```javascript
// Internally:
const { default: defaultConfig, ...regularConditions } = conditionsObj;

// 1. Regular conditions are checked first
// 2. If none match, defaultConfig is used as fallback
```

This means `'default'` is always checked last — regardless of where you write it in your object.

### Key Detail: Safe Array Conversion

The module includes `safeArrayFrom()` — a helper that converts collections to arrays **safely**, handling edge cases like Proxy objects and custom collections that might break `Array.from()`:

```
safeArrayFrom(collection)
   ├── Already an array? → return as-is
   ├── NodeList or HTMLCollection? → Array.from()
   ├── Has 'length' property? → Manual numeric iteration
   │   (only collects actual Element instances)
   └── Otherwise → empty array
```

---

## Basic Usage

### Single Element

```javascript
// Apply styles based on a status value
ConditionsApply.apply('online', {
  'online':  { textContent: 'Online',  style: { color: 'green' } },
  'offline': { textContent: 'Offline', style: { color: 'red' } },
  'away':    { textContent: 'Away',    style: { color: 'orange' } }
}, '#userStatus');
```

### Collection — Bulk Updates

```javascript
// All items get the same styles
ConditionsApply.apply('compact', {
  'compact':  { style: { padding: '5px',  fontSize: '14px' } },
  'spacious': { style: { padding: '20px', fontSize: '18px' } }
}, '.list-item');
```

### Collection — Bulk + Index Updates

```javascript
// All items get shared styles, first item gets special treatment
ConditionsApply.apply('grid', {
  'grid': {
    // Shared: all elements
    style: { display: 'inline-block', width: '200px', margin: '10px' },

    // Index-specific: individual elements
    0:  { style: { width: '420px' }, classList: { add: 'featured' } },
    -1: { style: { marginRight: '0' } }
  },
  'list': {
    style: { display: 'block', width: '100%', margin: '5px 0' }
  }
}, '.item');
```

### With Default Branch

```javascript
ConditionsApply.apply(getUserRole(), {
  'admin':   { textContent: 'Admin',   style: { color: 'red' } },
  'editor':  { textContent: 'Editor',  style: { color: 'blue' } },
  'default': { textContent: 'Viewer',  style: { color: 'gray' } }
}, '#roleBadge');

// 'viewer', 'guest', 'moderator', null → all show "Viewer" in gray
```

---

## Chaining

`apply()` returns the `ConditionsApply` object, so you can chain multiple calls:

```javascript
ConditionsApply
  .apply('dark', themeConditions, 'body')
  .apply('compact', layoutConditions, '.content')
  .apply('admin', roleConditions, '#badge');
```

---

## Batch

Group multiple apply calls for clarity:

```javascript
ConditionsApply.batch(() => {
  ConditionsApply.apply('dark', themeConditions, 'body');
  ConditionsApply.apply('compact', layoutConditions, '.content');
  ConditionsApply.apply('active', statusConditions, '.items');
});
```

---

## Condition Matchers

The module includes **all built-in condition matchers** — replicated inline so it works without the full Conditions module:

| Matcher | Syntax | Matches When |
|---------|--------|-------------|
| **Boolean** | `'true'`, `'false'` | `value === true` or `value === false` |
| **Truthy/Falsy** | `'truthy'`, `'falsy'` | `!!value` or `!value` |
| **Null/Undefined** | `'null'`, `'undefined'` | `value === null` or `value === undefined` |
| **Empty** | `'empty'` | Empty string, empty array, empty object, null, undefined |
| **Quoted String** | `'"exact"'`, `"'exact'"` | Exact string match (without quotes) |
| **Includes** | `'includes:text'` | `String(value).includes('text')` |
| **Starts With** | `'startsWith:pre'` | `String(value).startsWith('pre')` |
| **Ends With** | `'endsWith:fix'` | `String(value).endsWith('fix')` |
| **Regex** | `'/pattern/flags'` | `new RegExp(pattern, flags).test(value)` |
| **Numeric Range** | `'10-20'` | `value >= 10 && value <= 20` |
| **Comparison** | `'>5'`, `'>=10'`, `'<3'`, `'<=0'` | Numeric comparison |
| **Exact Number** | `'42'` | `value === 42` (when value is a number) |
| **String Equality** | `'active'` | `String(value) === 'active'` (fallback) |

---

## Property Handlers

The module handles these property types independently — no external helpers needed:

### style
```javascript
{ style: { color: 'red', fontSize: '16px', backgroundColor: '#fff' } }
```

### classList
```javascript
// Add, remove, or toggle classes
{ classList: { add: 'active', remove: 'old-class', toggle: 'visible' } }

// Arrays work too
{ classList: { add: ['class1', 'class2'], remove: ['old1', 'old2'] } }

// Replace all classes
{ classList: ['new-class-1', 'new-class-2'] }
```

### setAttribute / attrs
```javascript
{ setAttribute: { 'data-id': '123', 'aria-label': 'Button' } }
{ attrs: { 'data-role': 'admin' } }  // 'attrs' is an alias

// Setting to null/undefined/false removes the attribute
{ setAttribute: { disabled: false } }  // Removes 'disabled' attribute
```

### removeAttribute
```javascript
{ removeAttribute: 'disabled' }
{ removeAttribute: ['disabled', 'readonly'] }
```

### dataset
```javascript
{ dataset: { userId: '123', role: 'admin' } }
```

### addEventListener
```javascript
{ addEventListener: {
    click: (e) => console.log('Clicked'),
    mouseover: { handler: (e) => highlight(e), options: { once: true } }
} }
```

### Event Properties (on*)
```javascript
{ onclick: (e) => handleClick(e), onchange: (e) => handleChange(e) }
```

### Native DOM Properties
```javascript
{ textContent: 'Hello', value: 'input text', disabled: true, checked: false }
```

---

## Selector Types

```javascript
// ID selector
ConditionsApply.apply(value, conditions, '#myElement');

// Class selector
ConditionsApply.apply(value, conditions, '.items');

// CSS selector
ConditionsApply.apply(value, conditions, 'table tbody tr');

// Single element
ConditionsApply.apply(value, conditions, document.getElementById('el'));

// NodeList
ConditionsApply.apply(value, conditions, document.querySelectorAll('.item'));

// Array of elements
ConditionsApply.apply(value, conditions, [el1, el2, el3]);
```

---

## Debugging Helpers

### getElements(selector)

Test which elements a selector resolves to:

```javascript
const elements = ConditionsApply.getElements('.items');
console.log(elements);        // [div.items, div.items, div.items]
console.log(elements.length); // 3
```

### testCondition(value, condition)

Test whether a value matches a condition pattern:

```javascript
ConditionsApply.testCondition(5, '>3');            // true
ConditionsApply.testCondition(5, '10-20');          // false
ConditionsApply.testCondition('hello', '/^he/');    // true
ConditionsApply.testCondition('test', 'includes:es'); // true
ConditionsApply.testCondition(true, 'truthy');      // true
ConditionsApply.testCondition(null, 'null');        // true
```

---

## How It Integrates

The module exports in two ways:

```javascript
// 1. Standalone global
global.ConditionsApply = ConditionsApply;

// 2. Merges into Conditions global (creates it if needed)
global.Conditions.apply = ConditionsApply.apply;
global.Conditions.batch = ConditionsApply.batch;
```

If the full Conditions module is loaded, this **overrides** `Conditions.apply()` with the collection-aware version. If it's not loaded, the module creates the `Conditions` global itself.

---

## Standalone vs Full Conditions Module

| Feature | Full Conditions Module | Standalone Apply |
|---------|----------------------|-----------------|
| **Dependencies** | Requires DOMHelpers ecosystem | None — works alone |
| **Reactive mode** | Yes (`whenState`, `watch`) | No — static only |
| **Custom matchers** | Yes (`registerMatcher()`) | No — built-in only |
| **Custom handlers** | Yes (`registerHandler()`) | No — built-in only |
| **Collection support** | Via Collection Extension | Built-in natively |
| **Default branch** | Via Default Extension | Built-in natively |
| **Index updates** | Via Collection Extension | Built-in natively |
| **Condition matching** | Full matcher registry | All matchers replicated inline |
| **Property handling** | Full handler registry | All handlers replicated inline |

---

## Load Order

```html
<!-- Standalone — no other scripts needed -->
<script src="04_dh-conditions-apply-index-support.js"></script>

<!-- Or alongside the full Conditions module -->
<script src="01_dh-conditional-rendering.js"></script>
<script src="04_dh-conditions-apply-index-support.js"></script>
<!-- ↑ This overrides Conditions.apply() with the collection-aware version -->
```

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Standalone, zero-dependency `Conditions.apply()` with collection + index + default support |
| **No dependencies** | Works without any other DOMHelpers modules |
| **Condition matchers** | All built-in matchers replicated (boolean, string, regex, numeric) |
| **Property handlers** | All handlers replicated (style, classList, setAttribute, dataset, events, DOM properties) |
| **Collection-aware** | Non-numeric keys = bulk (all elements), numeric keys = index-specific |
| **Default branch** | Native support — extracted before matching, used as fallback |
| **Negative indices** | `-1` = last element, `-2` = second to last |
| **Chainable** | `apply()` returns self for chaining |
| **Debugging** | `getElements()` and `testCondition()` exposed for testing |
| **Static only** | No reactive mode — apply once, not auto-updating |

> **Simple Rule to Remember:** `ConditionsApply.apply()` is the **portable** version of conditional rendering — it packs everything it needs inside itself. Give it a value, a condition map, and a selector, and it handles matching, property application, and collection indexing all on its own. Drop it into any project and it just works.