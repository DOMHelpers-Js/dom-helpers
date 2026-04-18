[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# The Collection Extension (`03_dh-conditions-collection-extension.js`)

## Quick Start (30 seconds)

```javascript
const cards = state({ filter: 'all' });

// Apply conditions to a COLLECTION of elements at once
Conditions.whenCollection(
  () => cards.filter,
  {
    'all':      { classList: { remove: 'hidden' } },              // show every card
    'featured': { [0]: { classList: { add: 'highlighted' } },     // highlight first
                  [-1]: { classList: { add: 'highlighted' } },    // and last
                  classList: { remove: 'hidden' } },
    'archived': { classList: { add: 'hidden' } }                  // hide every card
  },
  '.product-card'   // ← the COLLECTION selector (all elements with this class)
);

cards.filter = 'featured';  // → all cards shown, first and last highlighted ✨
cards.filter = 'archived';  // → all cards hidden ✨
```

One call. One condition match. The whole collection updates.

---

## What Is This Extension?

`03_dh-conditions-collection-extension.js` adds two new methods to the `Conditions` object:

```javascript
Conditions.whenStateCollection(getValue, conditions, selector, options)
Conditions.whenCollection(getValue, conditions, selector, options)  // alias
```

Both are identical — `whenCollection` is simply a shorter name for the same function.

### How It Differs from `whenState()`

`whenState()` and `whenCollection()` solve the same fundamental problem — "apply the right DOM configuration when a value matches" — but they target **different DOM structures**.

```
whenState():
  conditions object maps: conditionKey → { selector → updateObject }
  → You specify which elements to update INSIDE each condition block
  → Different elements can be updated per condition

whenCollection():
  conditions object maps: conditionKey → updateObject (sent to the collection)
  → You specify the TARGET COLLECTION as a third parameter
  → The same collection receives the update for every condition
```

Think of it this way:

```
whenState()       → "When loading: update #spinner, #btn, #panel each differently"
whenCollection()  → "When loading: update ALL .card elements with this config"
```

---

## Syntax

```javascript
Conditions.whenCollection(getValue, conditions, selector)
Conditions.whenCollection(getValue, conditions, selector, options)

// Long-form alias (identical)
Conditions.whenStateCollection(getValue, conditions, selector, options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `getValue` | `Function` or value | ✅ Yes | Returns the value to match. Function is called reactively. |
| `conditions` | `Object` or `Function` | ✅ Yes | Maps condition keys → update objects for the collection |
| `selector` | String / Element / NodeList / Array | ✅ Yes | The collection to update |
| `options` | `Object` | ❌ No | `{ reactive: boolean }` — set to `false` to force static mode |

### Return Value

In **reactive mode** (default when Reactive is loaded):
```javascript
const stop = Conditions.whenCollection(getValue, conditions, selector);
stop();  // detach the reactive watcher
```

In **static mode** (no Reactive, or `options.reactive: false`):
```javascript
const control = Conditions.whenCollection(getValue, conditions, selector);
control.update();   // re-evaluate and re-apply manually
control.destroy();  // no-op, included for API consistency
```

---

## Parameter 1: `getValue`

Same as `whenState()` — a function that returns the current value to match:

```javascript
// Arrow function wrapping reactive state
() => app.filter

// Any expression
() => items.length > 0 ? 'has-items' : 'empty'

// Can also pass a value directly (static/non-reactive)
'loading'
```

---

## Parameter 2: The Conditions Object

This is the key difference from `whenState()`. Here, each condition key maps to an **update object that is applied directly to the collection** — not a nested `{ selector: updateObject }` structure.

### Structure

```javascript
{
  'conditionKey': updateObjectForTheCollection,
  'conditionKey': updateObjectForTheCollection
}
```

The update object is the same format the collection's `.update()` method accepts — supporting both **bulk updates** (applied to all elements) and **index-based updates** (applied to specific elements by position).

### Bulk Updates (Applied to All Elements)

Non-numeric keys in the update object are applied to every element in the collection:

```javascript
{
  'active': {
    classList: { add: 'active', remove: 'inactive' },  // all elements
    style: { opacity: '1' }                            // all elements
  },
  'inactive': {
    classList: { add: 'inactive', remove: 'active' },  // all elements
    style: { opacity: '0.5' }                          // all elements
  }
}
```

### Index-Based Updates (Applied to Specific Elements)

Numeric string keys target specific elements by index. **Negative indices count from the end.**

```javascript
{
  'featured': {
    classList: { remove: 'dim' },         // bulk: all elements
    [0]:  { classList: { add: 'first' } }, // index 0: first element only
    [1]:  { classList: { add: 'second' } },// index 1: second element only
    [-1]: { classList: { add: 'last'  } }  // index -1: last element only
  }
}
```

**Two-phase application:** Bulk updates are applied to all elements first, then index-specific updates are applied as overrides. This lets you set a baseline for every element and then customize specific positions.

```
Phase 1 — Bulk:
  All elements receive: { classList: { remove: 'dim' } }

Phase 2 — Index-specific:
  Element [0]  receives: { classList: { add: 'first' } }
  Element [1]  receives: { classList: { add: 'second' } }
  Element [-1] receives: { classList: { add: 'last' } }
```

---

## Parameter 3: `selector` — The Collection

The third parameter identifies **which elements form the collection**. Several formats are supported:

### CSS Class Selector (`.className`)

```javascript
Conditions.whenCollection(getValue, conditions, '.product-card');
// → all elements with class 'product-card'
```

When a `.class` selector is given and the `ClassName` global shortcut is available, the extension uses it directly. Otherwise it falls back to `document.querySelectorAll`.

### `#id` Selector (Treated as Single Element)

```javascript
Conditions.whenCollection(getValue, conditions, '#my-panel');
// → delegates to regular Conditions.whenState() for single-element behavior
```

When an `#id` selector is detected, the extension automatically hands off to `whenState()` — there's no meaningful "collection" to apply index-based updates to.

### CSS Selector (Any)

```javascript
Conditions.whenCollection(getValue, conditions, '[data-card]');
Conditions.whenCollection(getValue, conditions, 'li.nav-item');
Conditions.whenCollection(getValue, conditions, 'section > .card');
// → matched via document.querySelectorAll(selector)
```

### `NodeList` or `HTMLCollection`

```javascript
const items = document.querySelectorAll('.item');
Conditions.whenCollection(getValue, conditions, items);
```

### Array of Elements

```javascript
const elements = [el1, el2, el3];
Conditions.whenCollection(getValue, conditions, elements);
```

### Direct `Element` Reference

```javascript
const panel = document.getElementById('panel');
Conditions.whenCollection(getValue, conditions, panel);
// → treated as a single-element collection
```

---

## Parameter 4: Options (Optional)

```javascript
Conditions.whenCollection(getValue, conditions, selector, { reactive: false });
// Forces static mode even when Reactive is loaded
```

The only current option is `reactive` — set to `false` to opt out of automatic reactive wrapping.

---

## How the Condition Matching Works

The extension uses the **same condition matcher system** as the core Conditions module. If `Conditions._matchCondition` is available (the internal matcher API), it delegates to it — meaning all 17 built-in matchers work exactly as documented:

```javascript
{
  'true':        { ... },   // boolean true
  'false':       { ... },   // boolean false
  'truthy':      { ... },   // any truthy value
  '>5':          { ... },   // numeric greater than
  '1-10':        { ... },   // numeric range
  '/^err/i':     { ... },   // regex
  'includes:@':  { ... },   // substring check
  'loading':     { ... }    // string equality (fallback)
}
```

If the internal API is not accessible, the extension falls back to basic matching: `true`, `false`, `truthy`, `falsy`, and string equality. In practice, with the standard load order, the full matcher system is always available.

---

## Basic Usage Examples

### Example 1: Filter Cards (Show/Hide)

```html
<div class="card" data-category="featured">Card A</div>
<div class="card" data-category="featured">Card B</div>
<div class="card" data-category="normal">Card C</div>
<div class="card" data-category="normal">Card D</div>
<div class="card" data-category="archived">Card E</div>
```

```javascript
const gallery = state({ view: 'all' });

Conditions.whenCollection(
  () => gallery.view,
  {
    'all':      { classList: { remove: 'hidden', remove: 'dim' } },
    'featured': { classList: { add: 'dim' },
                  [0]: { classList: { remove: 'dim', add: 'spotlight' } },
                  [1]: { classList: { remove: 'dim', add: 'spotlight' } } },
    'archived': { classList: { add: 'hidden' } }
  },
  '.card'
);

gallery.view = 'featured';
// → All cards get 'dim' class
// → Card[0] and Card[1] then get 'spotlight', losing 'dim'
```

### Example 2: List Item States

```javascript
const todo = state({ mode: 'active' });

Conditions.whenCollection(
  () => todo.mode,
  {
    'active': {
      style: { opacity: '1', textDecoration: 'none' },
      removeAttribute: ['aria-disabled']
    },
    'completed': {
      style: { opacity: '0.6', textDecoration: 'line-through' },
      setAttribute: { 'aria-disabled': 'true' }
    },
    'paused': {
      style: { opacity: '0.8', textDecoration: 'none' },
      classList: { add: 'paused' }
    }
  },
  '.todo-item'
);
```

### Example 3: Carousel / Slideshow

```javascript
const carousel = state({ activeIndex: 0 });

// Show all slides as inactive by default, highlight the active one
Conditions.whenCollection(
  () => carousel.activeIndex,
  {
    '0': {
      classList:  { remove: 'active', add: 'inactive' },  // bulk: all slides
      [0]: { classList: { add: 'active', remove: 'inactive' } }  // override: slide 0
    },
    '1': {
      classList:  { remove: 'active', add: 'inactive' },
      [1]: { classList: { add: 'active', remove: 'inactive' } }
    },
    '2': {
      classList:  { remove: 'active', add: 'inactive' },
      [2]: { classList: { add: 'active', remove: 'inactive' } }
    }
  },
  '.slide'
);

document.getElementById('next-btn').addEventListener('click', () => {
  const slides = document.querySelectorAll('.slide').length;
  set(carousel, { activeIndex: prev => (prev + 1) % slides });
});
```

### Example 4: Table Row Highlighting

```javascript
const table = state({ status: 'normal' });

Conditions.whenCollection(
  () => table.status,
  {
    'normal': {
      classList: { remove: 'error-row', remove: 'warning-row' },
      style: { backgroundColor: '' }
    },
    'has-errors': {
      classList: { add: 'error-row' },
      [0]: { style: { backgroundColor: '#ffebee' },   // first row with error
             classList: { add: 'error-row', add: 'error-primary' } }
    },
    'loading': {
      classList: { add: 'skeleton' },
      style: { opacity: '0.5' }
    }
  },
  'tbody tr'
);
```

### Example 5: Navigation Tabs

```javascript
const nav = state({ page: 'home' });

Conditions.whenCollection(
  () => nav.page,
  {
    'home': {
      classList: { remove: 'active' },
      [0]: { classList: { add: 'active' } }
    },
    'about': {
      classList: { remove: 'active' },
      [1]: { classList: { add: 'active' } }
    },
    'contact': {
      classList: { remove: 'active' },
      [2]: { classList: { add: 'active' } }
    }
  },
  '.nav-tab'
);
```

---

## Combining `whenCollection()` with `whenState()`

These two methods are complementary — use both in the same feature when needed:

```javascript
const products = state({ sort: 'price', items: [] });

// whenCollection() — controls the LIST of product cards
Conditions.whenCollection(
  () => products.sort,
  {
    'price':    { classList: { remove: 'sort-name', remove: 'sort-rating' }, [0]: { classList: { add: 'sort-indicator' } } },
    'name':     { classList: { remove: 'sort-price', remove: 'sort-rating' }, [0]: { classList: { add: 'sort-indicator' } } },
    'rating':   { classList: { remove: 'sort-price', remove: 'sort-name' }, [0]: { classList: { add: 'sort-indicator' } } }
  },
  '.product-card'
);

// whenState() — controls sort BUTTONS and header (individual elements)
Conditions.whenState(
  () => products.sort,
  {
    'price':  { '#sort-price-btn': { classList: { add: 'active' } }, '#sort-name-btn': { classList: { remove: 'active' } } },
    'name':   { '#sort-name-btn':  { classList: { add: 'active' } }, '#sort-price-btn': { classList: { remove: 'active' } } },
    'rating': { '#sort-rating-btn': { classList: { add: 'active' } }, '#sort-price-btn': { classList: { remove: 'active' } } }
  }
);
```

---

## Reactive vs Static Mode

### Reactive (Default — Reactive loaded)

```javascript
const stop = Conditions.whenCollection(
  () => app.mode,
  { 'on': { classList: { add: 'on' } }, 'off': { classList: { remove: 'on' } } },
  '.toggle-card'
);

app.mode = 'on';   // → all .toggle-card elements get class 'on' ✨
stop();            // → stop watching
```

The extension wraps `applyToCollection` in `ReactiveUtils.effect()` (or `Elements.effect()` as a fallback). When the reactive value changes, the whole application logic re-runs.

### Static (Forced, or No Reactive)

```javascript
const control = Conditions.whenCollection(
  () => currentMode,
  { 'on': { classList: { add: 'on' } }, 'off': { classList: { remove: 'on' } } },
  '.toggle-card',
  { reactive: false }  // or simply: no Reactive loaded
);

currentMode = 'on';
control.update();  // re-apply manually
```

---

## Error Handling

The extension handles problems gracefully — it never throws, only logs:

```javascript
// Collection not found
Conditions.whenCollection(getValue, conditions, '.nonexistent');
// → console.warn: '[Conditions.Collection] No elements found'

// Value function throws
Conditions.whenCollection(() => { throw new Error('oops'); }, conditions, '.cards');
// → console.error: '[Conditions.Collection] Error getting value: ...'

// No condition matches (not an error — just info)
Conditions.whenCollection(() => 'unknown', { 'loading': { ... } }, '.cards');
// → console.info: '[Conditions.Collection] No matching condition for value: unknown'

// collection.update() fails (falls back to manual application)
// → console.warn: '[Conditions.Collection] Error using collection.update(): ...'
//   then applies manually as fallback
```

---

## Load Order

```html
<!-- 1. Core DOM Helpers (optional — enables .update() on collections) -->
<script src="01_dh-core.js"></script>

<!-- 2. Reactive (optional — enables automatic re-evaluation) -->
<script src="01_dh-reactive.js"></script>
<script src="09_dh-reactiveUtils-shortcut.js"></script>

<!-- 3. Conditions — required -->
<script src="01_dh-conditional-rendering.js"></script>

<!-- 4. Default branch extension (optional) -->
<script src="02_dh-conditions-default.js"></script>

<!-- 5. Collection extension — adds whenCollection() -->
<script src="03_dh-conditions-collection-extension.js"></script>

<!-- 6. Your code -->
<script src="app.js"></script>
```

If Conditions is not loaded when this file runs, it logs an error and exits cleanly.

---

## Console Output on Load

```
[Conditions.Collection] v1.0.0 loaded
[Conditions.Collection] ✓ Supports bulk + index updates in conditions
```

---

## `whenState()` vs `whenCollection()` — Decision Guide

```
┌─────────────────────────────────────────────────────────────────────┐
│ Are you targeting DIFFERENT elements per condition?                  │
│   YES → use whenState()                                             │
│         (each condition block lists its own selectors)              │
│                                                                     │
│ Are you targeting the SAME GROUP of elements for every condition?   │
│   YES → use whenCollection()                                        │
│         (one selector, conditions describe what to do with it)      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Do you need index-based targeting (first, last, nth element)?       │
│   YES → use whenCollection()                                        │
│         (numeric keys in update objects = index targeting)          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ whenState() — good for:                                             │
│   Multiple unrelated elements: #nav, #btn, #panel                   │
│   Per-element customization within a condition                      │
│                                                                     │
│ whenCollection() — good for:                                        │
│   A repeating group: .card, .tab, li, tr                            │
│   Bulk + selective index overrides in one atomic update             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Summary

- **`Conditions.whenCollection()`** (and its alias `Conditions.whenStateCollection()`) apply conditional DOM updates to a **collection** of elements — all elements matching a selector
- The **conditions object** maps condition keys → **update objects** passed directly to the collection; non-numeric keys apply to all elements, numeric keys target specific indices (negative indices count from end)
- **Two-phase application**: bulk updates run first, index-specific overrides run second
- **Selector formats**: `.class` string, `#id` string (delegates to `whenState()`), any CSS selector, `NodeList`, `HTMLCollection`, `Array`, or direct `Element`
- Uses the **full Conditions matcher system** (all 17 matchers) when available, with a simple fallback for edge cases
- **Reactive by default** when Reactive is loaded — wraps in `ReactiveUtils.effect()`; returns a stop function
- **Static fallback** when Reactive isn't loaded — returns `{ update(), destroy() }`; call `update()` manually
- Use `whenCollection()` for repeating groups (cards, tabs, rows, slides); use `whenState()` for individual named elements

---

Back to: [07 — Extending Conditions](./07_extending-conditions.md) | [08 — Real-World Patterns](./08_real-world-patterns.md)