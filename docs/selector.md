# Working with Selector

The Selector helper lets you query DOM elements using CSS selectors — single elements with `Selector.query()` and collections with `Selector.queryAll()`. It adds caching with smart MutationObserver invalidation, a scoped query API, enhanced property-name syntax, async waiting, and bulk update across multiple selectors. When the native-enhance module is loaded, the browser's own `document.querySelector`, `document.querySelectorAll`, `getElementsByClassName`, `getElementsByTagName` and `getElementsByName` are all enhanced to return the same enriched objects.

---

## Prerequisites

The core `Selector` API is part of the **core** module. Extra features require additional modules.

**ESM:**
```html
<script type="module">
  import { load } from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js';

  await load('core');           // Selector.query / queryAll / Scoped / waitFor
  await load('enhancers');      // index-based access + array distribution on results
  await load('native-enhance'); // enhanced document.querySelector / querySelectorAll / getElementsBy*
</script>
```

**Classic script:**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.min.js"></script>
<script>
  DOMHelpersLoader.load('native-enhance').then(function() { ... });
  // native-enhance auto-loads core + enhancers
</script>
```

**Full bundle:**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js"></script>
```

---

## Method 1 — `Selector.query()` (Single Element)

Returns the first element matching a CSS selector, enhanced with `.update()`.

```js
const btn     = Selector.query('#saveBtn');
const heading = Selector.query('h1');
const active  = Selector.query('.nav-item.active');
const input   = Selector.query('form input[required]');
```

**Returns:** `HTMLElement` with `.update()` — or `null` if nothing matched.

**Caching:** Results are stored with the selector as key. Subsequent calls with the same selector return the cached element instantly. The cache is automatically invalidated when the matched element is removed from the DOM.

```js
Selector.query('.card.featured');  // DOM lookup + cached
Selector.query('.card.featured');  // cache hit — no DOM lookup
```

---

## Method 2 — `Selector.queryAll()` (Collection)

Returns all elements matching a CSS selector as an enhanced collection.

```js
const cards   = Selector.queryAll('.card');
const inputs  = Selector.queryAll('form input');
const visible = Selector.queryAll('[data-visible="true"]');
const checked = Selector.queryAll('input[type="checkbox"]:checked');
```

**Returns:** Enhanced collection — always returns an object (never `null`), even if nothing matched (empty collection with `length === 0`).

**Caching:** Same mechanism as `query()`. Cache key is the selector string. Validated by checking if the first matched element is still in the DOM.

---

## Method 3 — Enhanced Property Syntax

When `enableEnhancedSyntax` is on (the default), `Selector.query` and `Selector.queryAll` become Proxies that convert property names into CSS selectors automatically — so you can write element access like property access.

### `Selector.query` — property name rules

| Property written | Selector used | Rule |
|---|---|---|
| `Selector.query.idSaveBtn` | `#save-btn` | Starts with `id` + camelCase → ID selector |
| `Selector.query.classBtnPrimary` | `.btn-primary` | Starts with `class` + camelCase → class selector |
| `Selector.query.btnPrimary` | `.btn-primary` | camelCase with uppercase → assumed class |
| `Selector.query.button` | `button` | Single lowercase word (< 10 chars) → tag selector |
| `Selector.query.saveBtn` | `#saveBtn` | Other patterns → ID selector |

```js
// ID selectors
const modal   = Selector.query.idConfirmModal;   // → #confirm-modal
const sidebar = Selector.query.idMainSidebar;    // → #main-sidebar

// Class selectors
const btns    = Selector.queryAll.classBtnPrimary; // → .btn-primary
const cards   = Selector.queryAll.classCardActive; // → .card-active

// Tag selectors
const heading = Selector.query.h1;               // → h1
const inputs  = Selector.queryAll.input;         // → input

// camelCase → class
const items   = Selector.queryAll.listItem;      // → .list-item
const tabs    = Selector.queryAll.navTab;        // → .nav-tab
```

### Enabling / disabling enhanced syntax

```js
Selector.enableEnhancedSyntax();   // on (default)
Selector.disableEnhancedSyntax();  // off — query and queryAll become plain functions
```

---

## Method 4 — `Selector.Scoped` (Queries Within a Container)

Query elements within a specific container instead of the whole document. Useful for components, modals, and repeated UI patterns.

### `Selector.Scoped.within(container, selector)` — single element

```js
// Container as element reference
const form  = Elements.signupForm;
const email = Selector.Scoped.within(form, 'input[type="email"]');

// Container as CSS selector string — looked up automatically
const email = Selector.Scoped.within('#signupForm', 'input[type="email"]');
const label = Selector.Scoped.within('.modal.active', 'h2');
```

**Returns:** `HTMLElement` with `.update()` — or `null` if not found.

**Cache key format:** `"scoped:{container.id}:{selector}"` — or `"scoped:anonymous:{selector}"` if the container has no `id`.

---

### `Selector.Scoped.withinAll(container, selector)` — collection

```js
// All required inputs inside the active form
const inputs = Selector.Scoped.withinAll('#checkoutForm', 'input[required]');

// All list items inside a specific nav
const navItems = Selector.Scoped.withinAll(Elements.primaryNav, 'a');

inputs.update({ classList: { add: 'validated' } });
inputs.forEach(input => console.log(input.name, input.value));
```

**Returns:** Enhanced collection — empty collection if container not found.

---

## The Collection Object

Every `queryAll`, `withinAll`, and `querySelectorAll` call returns the same enhanced collection with the full set of methods.

### Length and element access

```js
const items = Selector.queryAll('.list-item');

items.length      // number of matched elements
items[0]          // first element (enhanced with .update())
items[1]          // second element
items[-1]         // NOT supported via bracket notation — use .at() instead
items.at(-1)      // last element (negative index supported)
items.at(-2)      // second-to-last
items.item(0)     // same as items[0]
items.first()     // first element, enhanced
items.last()      // last element, enhanced
items.isEmpty()   // true if length === 0
```

### Iteration

```js
const cards = Selector.queryAll('.card');

cards.forEach((el, index) => console.log(index, el.textContent));

const texts   = cards.map(el => el.textContent);
const visible = cards.filter(el => !el.hidden);
const active  = cards.find(el => el.classList.contains('active'));
const anyErr  = cards.some(el => el.classList.contains('error'));
const allOk   = cards.every(el => !el.classList.contains('error'));
const total   = cards.reduce((sum, el) => sum + el.offsetHeight, 0);

for (const card of cards) { console.log(card.textContent); }

const arr = [...cards];
const arr = cards.toArray();
```

### Bulk DOM manipulation

These apply the same change to every element and return `this` for chaining:

```js
const btns = Selector.queryAll('.btn');

btns.addClass('loading');
btns.removeClass('idle');
btns.toggleClass('expanded');
btns.setProperty('disabled', true);
btns.setAttribute('aria-busy', 'true');
btns.setStyle({ opacity: '0.6', cursor: 'not-allowed' });
btns.on('click', handleClick);
btns.off('click', handleClick);
```

### Filtering by state

```js
const inputs = Selector.queryAll('form input');

inputs.visible()   // Array — only currently visible elements
inputs.hidden()    // Array — only hidden elements
inputs.enabled()   // Array — only non-disabled elements
inputs.disabled()  // Array — only disabled elements
```

### Querying within results

```js
const sections = Selector.queryAll('section');

// Query within every element in the collection
const headings = sections.within('h2');  // returns collection of all h2 inside every section
```

---

## Updating Elements and Collections

### Single element `.update()`

```js
const btn = Selector.query('#saveBtn');

btn.update({
  textContent:     'Saving...',
  disabled:        true,
  style:           { opacity: '0.7' },
  classList:       { add: 'loading', remove: 'idle' },
  setAttribute:    { 'aria-busy': 'true' },
  removeAttribute: 'data-error',
  dataset:         { status: 'pending' }
});
```

### Collection — bulk update (same change to all)

```js
Selector.queryAll('.card').update({
  style:     { borderRadius: '8px', padding: '16px' },
  classList: { add: 'loaded', remove: 'skeleton' }
});
```

### Collection — index-based update (different change per element)

Numeric keys target elements by position. Negative indices count from the end.

```js
Selector.queryAll('.step').update({
  [0]: { textContent: 'Done',    classList: { add: 'complete' } },
  [1]: { textContent: 'Current', classList: { add: 'active' } },
  [2]: { textContent: 'Pending', classList: { add: 'upcoming' } },
  [-1]: { style: { borderBottom: 'none' } }
});
```

### Collection — mixed (bulk + index override)

```js
Selector.queryAll('.card').update({
  // Bulk — all cards
  style:     { padding: '16px' },
  classList: { add: 'visible' },

  // Index override
  [0]:  { classList: { add: 'featured' } },
  [-1]: { hidden: true }
});
```

### Collection — array distribution (one value per element)

```js
Selector.queryAll('.label').update({
  textContent: ['Home', 'About', 'Services', 'Contact']
});

Selector.queryAll('.btn').update({
  textContent: ['Save', 'Cancel', 'Delete'],
  style: {
    backgroundColor: ['#4CAF50', '#9E9E9E', '#f44336'],
    color: '#fff'
  }
});
```

---

## `Selector.update()` — Bulk Update by Selector

Update multiple selector targets in a single call.

```js
Selector.update({
  '#pageTitle':        { textContent: 'Dashboard' },
  '.btn-primary':      { style: { backgroundColor: '#007bff' } },
  'form input':        { disabled: false, classList: { remove: 'error' } },
  '[data-role="nav"]': { classList: { add: 'ready' } }
});
```

**Returns:**
```js
{
  '#pageTitle': {
    success: true,
    elements: collection,
    elementsUpdated: 1
  },
  '.btn-primary': {
    success: true,
    elements: collection,
    elementsUpdated: 3
  },
  'bad..selector': {
    success: false,
    error: 'Failed to execute querySelector'
  }
}
```

---

## Async — Waiting for Dynamic Elements

### `Selector.waitFor(selector, timeout)` — single element

Wait for an element to appear in the DOM. Useful for content injected by third-party scripts or async rendering.

```js
// Default 5 second timeout
const modal = await Selector.waitFor('.modal.active');

// Custom timeout
const widget = await Selector.waitFor('#chatWidget', 10000);

widget.update({ style: { bottom: '80px' } });
```

**Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `selector` | string | required | CSS selector to wait for |
| `timeout` | number | `5000` | Milliseconds before throwing |

**Poll interval:** Every 100ms.
**Throws:** Error if timeout reached — `"Timeout waiting for selector: .modal.active"`

---

### `Selector.waitForAll(selector, minCount, timeout)` — collection

Wait until at least `minCount` elements matching the selector exist.

```js
// Wait for at least 1 result (default)
const cards = await Selector.waitForAll('.product-card');

// Wait for at least 5 rows
const rows = await Selector.waitForAll('table tbody tr', 5);

// Custom timeout
const items = await Selector.waitForAll('.lazy-item', 3, 10000);

cards.update({ classList: { add: 'visible' } });
```

**Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `selector` | string | required | CSS selector to wait for |
| `minCount` | number | `1` | Minimum elements before resolving |
| `timeout` | number | `5000` | Milliseconds before throwing |

**Throws:** Error if timeout reached.

---

## Enhanced Native Methods (native-enhance module)

When **native-enhance** is loaded, the browser's standard DOM methods are enhanced to return objects with the full `.update()` and collection API. Existing code needs no changes — it just gains extra capabilities.

### `document.querySelector(selector)` — enhanced

```js
const btn = document.querySelector('#saveBtn');
btn.update({ textContent: 'Click me', disabled: false });

const card = document.querySelector('.card.active');
card.update({ classList: { add: 'highlighted' } });
```

**Returns:** `HTMLElement` with `.update()` — or `null`.

---

### `document.querySelectorAll(selector)` — enhanced

```js
const btns = document.querySelectorAll('.btn');

// Full collection API available
btns.forEach(btn => console.log(btn.textContent));
btns.update({ disabled: false });
btns[0].update({ classList: { add: 'primary' } });
btns.at(-1).update({ hidden: true });

// Index-based
btns.update({
  [0]: { textContent: 'First' },
  [1]: { textContent: 'Second' }
});

// Array distribution
btns.update({
  textContent: ['Save', 'Cancel', 'Reset']
});
```

---

### `document.getElementsByClassName(name)` — enhanced

```js
const cards = document.getElementsByClassName('card');

// All collection methods available
cards.forEach(el => console.log(el.textContent));
cards.update({ classList: { add: 'loaded' } });
cards[0].update({ style: { border: '2px solid gold' } });
```

**Bulk methods on the function itself:**

```js
// Update multiple class groups in one call
document.getElementsByClassName.update({
  btn:    { disabled: false },
  card:   { style: { opacity: '1' } },
  badge:  { textContent: 'New' }
});

document.getElementsByClassName.textContent({
  'user-name':  'Alice',
  'user-email': 'alice@example.com'
});

document.getElementsByClassName.style({
  btn:  { backgroundColor: '#007bff', color: '#fff' },
  card: { borderRadius: '8px', padding: '16px' }
});

document.getElementsByClassName.classes({
  btn:  { add: 'active', remove: 'disabled' },
  card: { add: 'visible' }
});

document.getElementsByClassName.attrs({
  btn:  { 'aria-pressed': 'true' },
  link: { target: '_blank', rel: 'noopener' }
});

document.getElementsByClassName.dataset({
  card: { loaded: 'true', version: '2' }
});

document.getElementsByClassName.disabled({ btn: false, input: true });
document.getElementsByClassName.hidden({ overlay: false, spinner: true });
document.getElementsByClassName.value({ 'form-input': '' });
document.getElementsByClassName.placeholder({ 'form-input': 'Enter value' });
document.getElementsByClassName.src({ avatar: '/images/default.png' });
document.getElementsByClassName.href({ 'nav-link': '/dashboard' });
```

---

### `document.getElementsByTagName(name)` — enhanced

```js
const paragraphs = document.getElementsByTagName('p');
paragraphs.update({ style: { lineHeight: '1.8' } });

// Bulk on the function
document.getElementsByTagName.update({
  p:    { style: { lineHeight: '1.8' } },
  h2:   { style: { color: '#333' } },
  input: { disabled: false }
});

document.getElementsByTagName.style({
  p:   { fontSize: '16px', color: '#444' },
  li:  { marginBottom: '8px' }
});
```

---

### `document.getElementsByName(name)` — enhanced

Particularly useful for radio buttons and checkboxes.

```js
const radios = document.getElementsByName('paymentMethod');
radios.forEach(radio => console.log(radio.value, radio.checked));

// Bulk
document.getElementsByName.update({
  paymentMethod: { disabled: false },
  newsletter:    { checked: false }
});

document.getElementsByName.disabled({
  paymentMethod: true,
  newsletter:    false
});
```

---

## The Caching System

`Selector.query` and `Selector.queryAll` both cache results against their selector strings.

### How it works

1. **First call** — runs `document.querySelector` / `document.querySelectorAll`, stores result.
2. **Subsequent calls** — checks cache first. Validates that the element is still in the DOM (`document.contains()`). Returns cached result if valid.
3. **Invalidation** — a MutationObserver watches for DOM mutations and marks affected cache entries as stale:
   - Elements added or removed → all entries invalidated
   - `id` attribute changes → ID-selector entries invalidated
   - `class` attribute changes → class-selector entries invalidated
   - Any attribute change → attribute-selector entries invalidated
4. **Auto-cleanup** — runs every 30 seconds (configurable) to remove stale entries.

**MutationObserver watches:**
- `childList: true, subtree: true` — any added or removed elements
- `attributes: true` — with `attributeFilter: ['id', 'class', 'style', 'hidden', 'disabled']`

### Cache statistics

```js
const stats = Selector.stats();
// {
//   hits:             243,
//   misses:            31,
//   cacheSize:         14,
//   hitRate:         0.89,
//   uptime:         86400,
//   selectorBreakdown: {
//     id:        8,   // how many #id queries
//     class:    12,   // how many .class queries
//     tag:       3,   // how many tag queries
//     attribute: 2,   // how many [attr] queries
//     other:     6    // complex selectors
//   }
// }
```

### Configuration

```js
Selector.configure({
  enableLogging:      false,  // log cache hits/misses
  autoCleanup:        true,   // periodic stale-entry removal
  cleanupInterval:    30000,  // ms between cleanup runs
  maxCacheSize:       1000,   // max cached selectors
  debounceDelay:      16,     // ms to debounce MutationObserver callbacks
  enableSmartCaching: true,   // MutationObserver-based invalidation
  enableEnhancedSyntax: true  // proxy property-name access
});
```

### Manual cache control

```js
Selector.clear();             // clear all cached entries
Selector.destroy();           // full teardown — disconnects MutationObserver and timers
```

---

## Practical Patterns

### Query and immediately update

```js
Selector.query('#hero h1').update({
  textContent: 'Welcome back',
  style: { color: '#1a1a2e' }
});

Selector.queryAll('.card').update({
  classList: { add: 'visible' },
  style: { opacity: '1', transition: 'opacity 0.3s' }
});
```

### Work with a scoped component

```js
function initModal(modalId) {
  const container = Elements[modalId];

  const title   = Selector.Scoped.within(container, 'h2');
  const body    = Selector.Scoped.within(container, '.modal-body');
  const closeBtn = Selector.Scoped.within(container, '.btn-close');
  const inputs  = Selector.Scoped.withinAll(container, 'input');

  title.update({ textContent: 'Confirm Action' });
  inputs.update({ disabled: false, value: '' });
  closeBtn.on('click', () => container.update({ hidden: true }));
}
```

### Toggle all items with one call

```js
// Show all, then mark only active one
Selector.queryAll('.tab-panel').update({ hidden: true });
Selector.query(`.tab-panel[data-tab="${activeId}"]`).update({ hidden: false });
```

### Populate dynamic content then reveal

```js
const items = await Selector.waitForAll('.product-card', 4);

items.update({
  classList: { add: 'loaded' },
  style: { opacity: '1' }
});
```

### Bulk update across many selectors

```js
Selector.update({
  'header':              { style: { backgroundColor: theme.primary } },
  'footer':              { style: { backgroundColor: theme.dark } },
  '.btn-primary':        { style: { backgroundColor: theme.accent } },
  'a':                   { style: { color: theme.link } },
  'input, textarea':     { style: { borderColor: theme.border } }
});
```

### React to state changes

```js
await load('reactive');

const state = ReactiveUtils.state({ loading: false, error: null, count: 0 });

ReactiveUtils.effect(() => {
  Selector.query('#submitBtn').update({
    disabled: state.loading,
    textContent: state.loading ? 'Saving...' : 'Save'
  });

  Selector.query('#errorMsg').update({
    hidden:      !state.error,
    textContent: state.error ?? ''
  });

  Selector.queryAll('.item-count').update({
    textContent: String(state.count)
  });
});
```

### Enhanced property syntax for quick access

```js
// Equivalent to Selector.query('#page-title')
Selector.query.idPageTitle.update({ textContent: 'Dashboard' });

// Equivalent to Selector.queryAll('.nav-tab')
Selector.queryAll.navTab.update({ classList: { remove: 'active' } });

// Tag selector — Selector.query('h1')
Selector.query.h1.update({ style: { fontSize: '2rem' } });
```

### Use native methods where familiar

```js
// All these are enhanced when native-enhance is loaded
document.querySelector('.modal').update({ hidden: false });
document.querySelectorAll('.card').update({ classList: { add: 'visible' } });
document.getElementsByClassName('btn').update({ disabled: false });
document.getElementsByTagName('input').update({ value: '' });
document.getElementsByName('role').update({ checked: false });
```

---

## Choosing Between Selector and Collections

| Situation | Use |
|---|---|
| Simple class/tag/name access | `Collections.ClassName`, `TagName`, `Name` — faster, cached |
| Complex CSS selector | `Selector.query` / `Selector.queryAll` |
| Scoped query within a container | `Selector.Scoped.within` / `withinAll` |
| Native code you don't want to change | `document.querySelector` / `querySelectorAll` (enhanced) |
| Pseudo-classes, combinators, attributes | `Selector.queryAll` or `document.querySelectorAll` |

---

## Module Requirements Summary

| Feature | Requires |
|---|---|
| `Selector.query` / `queryAll` | `core` |
| `Selector.Scoped.within` / `withinAll` | `core` |
| `Selector.waitFor` / `waitForAll` | `core` |
| `Selector.update()` (bulk by selector) | `core` |
| Enhanced property syntax (`Selector.query.idMyEl`) | `core` |
| Index-based updates on query results | `core` + `enhancers` |
| Array distribution on query results | `core` + `enhancers` |
| `document.querySelector` enhanced | `core` + `enhancers` + `native-enhance` |
| `document.querySelectorAll` enhanced | `core` + `enhancers` + `native-enhance` |
| `document.getElementsByClassName` enhanced | `core` + `enhancers` + `native-enhance` |
| `document.getElementsByTagName` enhanced | `core` + `enhancers` + `native-enhance` |
| `document.getElementsByName` enhanced | `core` + `enhancers` + `native-enhance` |
| Function-level shorthands on `getElementsBy*` | `core` + `enhancers` + `native-enhance` |
