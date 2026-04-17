# Working with Selector

The Selector helper lets you query DOM elements using CSS selectors — single elements with `Selector.query()` and collections with `Selector.queryAll()`. It adds caching with smart MutationObserver invalidation, a scoped query API, enhanced property-name syntax, async waiting, and bulk update across multiple selectors.

---

## Prerequisites

The `Selector` API is part of the **core** module. Index-based updates and array distribution require **enhancers** on top.

**ESM:**
```html
<script type="module">
  import { load } from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js';

  await load('core');       // Selector.query / queryAll / Scoped / waitFor
  await load('enhancers');  // index-based access + array distribution on results
</script>
```

**Classic script:**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.min.js"></script>
<script>
  DOMHelpersLoader.load('enhancers').then(function() { ... });
  // enhancers auto-loads core
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

Every `queryAll`, `withinAll`, and `queryAllWithin` call returns the same enhanced collection with the full set of methods.

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

## Global Shorthand Functions

When the **Enhancers** module is loaded, four functions are placed directly on `window` so you can call them without any `Selector.` prefix. They are also available as `queryWithin` and `queryAllWithin` for scoped lookups.

| Global | Description |
|---|---|
| `query(selector)` | Single element — first match, enhanced with `.update()` |
| `querySelector(selector)` | Alias for `query` |
| `queryAll(selector)` | All matches as enhanced collection |
| `querySelectorAll(selector)` | Alias for `queryAll` |
| `queryWithin(container, selector)` | Single element scoped to a container |
| `queryAllWithin(container, selector)` | Collection scoped to a container |

All six also live on `window.DOMHelpers.*` and on `window.GlobalQuery.*`.

### `query` / `querySelector`

Returns the first matching element enhanced with `.update()`, or `null`.

```js
const btn   = query('#saveBtn');
const title = querySelector('h1.page-title');
const input = query('form input[required]');

// Use .update() immediately
query('#modal').update({ hidden: false });
```

An optional second argument scopes the search to a container:

```js
const nested = query('.btn', document.getElementById('sidebar'));
```

### `queryAll` / `querySelectorAll`

Returns an enhanced collection. Always returns an object — never `null`.

```js
const cards  = queryAll('.card');
const inputs = querySelectorAll('input[type="text"]');

console.log(cards.length);
cards.update({ classList: { add: 'visible' } });
```

An optional second argument scopes the search:

```js
const items = queryAll('li', document.querySelector('#menu'));
```

### `queryWithin` / `queryAllWithin`

Explicit scoped queries — container comes first, selector second. Accept either an `Element` reference or a CSS selector string for the container.

```js
const label  = queryWithin('#checkout-form', 'label[for="email"]');
const fields = queryAllWithin('#checkout-form', 'input, select, textarea');

fields.update({ disabled: false });

const sidebar = document.getElementById('sidebar');
const links   = queryAllWithin(sidebar, 'a');
```

> **`query` / `queryAll` vs `Selector.query` / `Selector.queryAll`**
>
> The global shortcuts come from the Enhancers module and do **not** use the Selector caching system. Each call runs a live DOM lookup. Use `Selector.query` / `Selector.queryAll` when you want caching and MutationObserver invalidation. Use the global shortcuts when you need a quick one-off query or want to avoid the cache entirely.

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
Selector.clear();    // clear all cached entries
Selector.destroy();  // full teardown — disconnects MutationObserver and timers
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

  const title    = Selector.Scoped.within(container, 'h2');
  const body     = Selector.Scoped.within(container, '.modal-body');
  const closeBtn = Selector.Scoped.within(container, '.btn-close');
  const inputs   = Selector.Scoped.withinAll(container, 'input');

  title.update({ textContent: 'Confirm Action' });
  inputs.update({ disabled: false, value: '' });
  closeBtn.on('click', () => container.update({ hidden: true }));
}
```

### Toggle all items with one call

```js
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
  'header':          { style: { backgroundColor: theme.primary } },
  'footer':          { style: { backgroundColor: theme.dark } },
  '.btn-primary':    { style: { backgroundColor: theme.accent } },
  'a':               { style: { color: theme.link } },
  'input, textarea': { style: { borderColor: theme.border } }
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

---

## Choosing Between Selector and Collections

| Situation | Use |
|---|---|
| Simple class/tag/name access | `Collections.ClassName`, `TagName`, `Name` — faster, cached |
| Complex CSS selector | `Selector.query` / `Selector.queryAll` |
| Same, without caching, shortest possible syntax | `query()` / `queryAll()` globals |
| Scoped query within a container | `Selector.Scoped.within` / `withinAll` or `queryWithin` / `queryAllWithin` |
| Pseudo-classes, combinators, attributes | `Selector.queryAll` |

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
| `query` / `queryAll` globals (no prefix) | `enhancers` |
| `querySelector` / `querySelectorAll` globals (no prefix) | `enhancers` |
| `queryWithin` / `queryAllWithin` globals | `enhancers` |
