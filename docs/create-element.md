# createElement — Building and Configuring DOM Elements

`createElement` is an enhanced version of the browser's native `document.createElement`. It does everything the native function does, and adds two things on top: a configuration object you can pass at creation time to set up the element in one call, and a `.update()` method on every element it returns so you can change anything about it later without re-querying the DOM.

---

## Contents

1. [How it works](#how-it-works)
2. [Basic usage](#basic-usage)
3. [Configuration options reference](#configuration-options-reference)
4. [The `.update()` method](#the-update-method)
5. [Bulk creation — `createElement.bulk()`](#bulk-creation--createelementbulk)
6. [Bulk result object reference](#bulk-result-object-reference)
7. [Enabling and disabling the enhancement](#enabling-and-disabling-the-enhancement)
8. [Global availability and imports](#global-availability-and-imports)
9. [Practical patterns](#practical-patterns)

---

## How it works

When the Core module loads, it patches `document.createElement` with an enhanced version. Every element you create — whether through the global `createElement` shorthand or through `document.createElement` directly — automatically gets a `.update()` method attached to it.

You can pass a configuration object as the second argument to set up the element at creation time. The function recognises its own config format and handles it — if you pass a native browser option like `{ is: 'my-element' }` for custom elements, the native behaviour is preserved.

```js
// These are equivalent:
const btn = createElement('button', { textContent: 'Save', className: 'btn' });
const btn = document.createElement('button', { textContent: 'Save', className: 'btn' });
```

---

## Basic usage

```js
// No options — just creates a div with .update() attached
const div = createElement('div');

// With a configuration object
const btn = createElement('button', {
  textContent: 'Click me',
  className: 'btn btn-primary',
  id: 'submit-btn',
  disabled: false,
  addEventListener: ['click', () => console.log('clicked')]
});

document.body.appendChild(btn);
```

The returned value is a real `HTMLElement`. It passes `instanceof` checks, works with all native DOM APIs, and integrates with every other DOM Helpers module.

```js
console.log(btn instanceof HTMLElement); // true
console.log(typeof btn.update);          // 'function'
```

---

## Configuration options reference

All options are optional. Pass only what you need.

### Content

| Key | Type | Description |
|---|---|---|
| `textContent` | string | Sets the text content of the element. HTML is treated as plain text. |
| `innerHTML` | string | Sets raw HTML content. Use with care — only with trusted strings. |
| `value` | string | Sets the `value` property. Useful for `<input>`, `<textarea>`, `<select>`. |

```js
createElement('p', { textContent: 'Hello, world' });
createElement('div', { innerHTML: '<strong>Bold</strong> text' });
createElement('input', { value: 'prefilled text' });
```

### Identity and classes

| Key | Type | Description |
|---|---|---|
| `id` | string | Sets the element's `id`. |
| `className` | string | Sets the full `className` string (space-separated). |
| `classList` | object | Applies class operations. Keys: `add`, `remove`, `toggle`, `replace`. |

```js
// className — replaces the entire class list
createElement('button', { className: 'btn btn-primary active' });

// classList — granular operations
createElement('button', {
  classList: {
    add: ['btn', 'btn-primary'],      // string or array
    remove: 'disabled',               // string or array
    toggle: 'active',                 // string or array
    replace: ['old-class', 'new-class'] // must be a 2-element array
  }
});
```

### State

| Key | Type | Description |
|---|---|---|
| `disabled` | boolean | Sets the `disabled` property. |
| `checked` | boolean | Sets the `checked` property on checkbox/radio inputs. |
| `hidden` | boolean | Sets the `hidden` property. |

```js
createElement('button', { disabled: true });
createElement('input', { type: 'checkbox', checked: true });
```

### Styles

| Key | Type | Description |
|---|---|---|
| `style` | object | CSS properties as camelCase key-value pairs. |

```js
createElement('div', {
  style: {
    color: 'white',
    backgroundColor: '#1a1a2e',
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }
});
```

### Attributes

| Key | Type | Description |
|---|---|---|
| `setAttribute` | object or array | Sets one or more HTML attributes. |
| `removeAttribute` | string or array | Removes one or more HTML attributes. |

```js
// Object format — preferred for multiple attributes
createElement('img', {
  setAttribute: {
    src: '/images/hero.jpg',
    alt: 'Hero image',
    loading: 'lazy',
    width: '800',
    height: '400'
  }
});

// Array format — for a single attribute
createElement('input', {
  setAttribute: ['autocomplete', 'off']
});

// Remove attributes
createElement('button', {
  setAttribute: { 'aria-expanded': 'false' },
  removeAttribute: ['tabindex', 'data-legacy']
  // or a single: removeAttribute: 'tabindex'
});
```

### Data attributes

| Key | Type | Description |
|---|---|---|
| `dataset` | object | Sets `data-*` attributes. Keys are camelCase and auto-converted to kebab-case. |

```js
createElement('li', {
  dataset: {
    userId: '42',        // → data-user-id="42"
    role: 'admin',       // → data-role="admin"
    isActive: 'true'     // → data-is-active="true"
  }
});
```

### Event listeners

| Key | Type | Description |
|---|---|---|
| `addEventListener` | array | A single listener: `[eventType, handler]` or `[eventType, handler, options]`. |

```js
// Single event
createElement('button', {
  addEventListener: ['click', handleClick]
});

// With options (passive, once, capture)
createElement('div', {
  addEventListener: ['scroll', onScroll, { passive: true }]
});

// With once
createElement('button', {
  addEventListener: ['click', () => console.log('fired once'), { once: true }]
});
```

> To attach multiple events at creation time, use `createElement.bulk()` — its `addEventListener` option accepts an object with multiple event names as keys.

### Any DOM property or attribute

Any key you pass that matches a property on the element is assigned directly. If the key is unknown but its value is a string, number, or boolean, it falls back to `setAttribute`.

```js
// Direct property assignment
createElement('input', {
  type: 'email',         // element.type = 'email'
  placeholder: 'you@example.com',
  required: true,
  maxLength: 254         // element.maxLength = 254
});

// aria-* attributes via setAttribute fallback
createElement('button', {
  'aria-label': 'Close dialog',
  'aria-expanded': 'false'
});
```

---

## The `.update()` method

Every element created by `createElement` (or by the patched `document.createElement`) has a `.update()` method. It accepts the same configuration keys listed above and returns the element for chaining.

```js
const card = createElement('div', { className: 'card' });
document.body.appendChild(card);

// Later — update anything about it
card.update({
  textContent: 'Updated content',
  className: 'card card--highlighted',
  style: { borderColor: '#ff6b6b' }
});
```

### Chaining

`.update()` returns the element, so you can chain calls:

```js
createElement('button')
  .update({ textContent: 'Save', className: 'btn' })
  .update({ disabled: false, dataset: { action: 'save' } });
```

### After DOM insertion

`.update()` works on any element that was created by the enhanced `createElement`, whether it's in the DOM or not:

```js
const btn = createElement('button', { textContent: 'Loading…', disabled: true });
document.body.appendChild(btn);

fetch('/api/data').then(() => {
  btn.update({ textContent: 'Done', disabled: false });
});
```

### `.update()` supports all the same options

The full options table from the creation-time section applies identically to `.update()`. The only difference is that `addEventListener` in `.update()` only accepts the array format `[type, handler, options?]` — the object (multi-event) format is only available in `createElement.bulk()`.

---

## Bulk creation — `createElement.bulk()`

`createElement.bulk()` creates multiple elements in a single call. You pass an object where each key is the name you want to refer to the element by, and each value is the same configuration object used in `createElement()`.

```js
const els = createElement.bulk({
  H1:    { textContent: 'Welcome', className: 'page-title' },
  P:     { textContent: 'Get started below.', className: 'subtitle' },
  BTN:   { textContent: 'Get started', className: 'btn btn-primary',
           addEventListener: ['click', onStart] },
  FORM:  { className: 'signup-form' }
});
```

### Tag names and suffixes

The key determines the HTML tag name. It is parsed with `^([A-Z]+)(_\d+)?$`, so:

- `DIV` → `<div>`
- `BUTTON` → `<button>`
- `DIV_1`, `DIV_2` → both `<div>` — the suffix lets you create multiple elements of the same tag without key collisions

```js
const els = createElement.bulk({
  DIV_1: { className: 'col col-left' },
  DIV_2: { className: 'col col-right' },
  DIV_3: { className: 'col col-footer' }
});
```

### Multiple events in bulk

`addEventListener` in `createElement.bulk()` accepts either the single-event array format or an object for multiple events at once:

```js
const els = createElement.bulk({
  INPUT: {
    addEventListener: {
      focus: () => console.log('focused'),
      blur:  () => console.log('blurred'),
      input: [handleInput, { passive: true }]  // with options
    }
  }
});
```

---

## Bulk result object reference

`createElement.bulk()` returns a plain object that contains every created element directly by key, plus a set of helper methods.

### Direct element access

```js
const els = createElement.bulk({ H1: {}, P: {}, BTN: {} });

els.H1   // the <h1> element
els.P    // the <p> element
els.BTN  // the <button> element
```

### Getters

| Property | Type | Description |
|---|---|---|
| `els.all` | Array | All created elements in the order they were defined. |
| `els.count` | number | Number of elements created. |
| `els.keys` | Array | Array of all key strings. |

```js
console.log(els.count);  // 3
console.log(els.keys);   // ['H1', 'P', 'BTN']
els.all.forEach(el => document.body.appendChild(el));
```

### Retrieval methods

| Method | Returns | Description |
|---|---|---|
| `els.toArray()` | Array | All elements in creation order. |
| `els.toArray('H1', 'P')` | Array | Specific elements in the order given. |
| `els.ordered('H1', 'P')` | Array | Alias for `toArray` with arguments. |
| `els.has('BTN')` | boolean | Returns `true` if the key exists. |
| `els.get('BTN')` | Element\|null | Returns the element or `null`. |
| `els.get('BTN', fallback)` | Element\|any | Returns the element or `fallback`. |

```js
// Put H1 before P before BTN in the DOM
const ordered = els.toArray('H1', 'P', 'BTN');
ordered.forEach(el => container.appendChild(el));

// Check before accessing
if (els.has('ASIDE')) {
  els.ASIDE.update({ hidden: true });
}
```

### Iteration methods

| Method | Description |
|---|---|
| `els.forEach(fn)` | Calls `fn(element, key, index)` for each element. |
| `els.map(fn)` | Returns an array of `fn(element, key, index)` results. |
| `els.filter(fn)` | Returns an array of elements where `fn(element, key, index)` is truthy. |

```js
// Add a shared data attribute to every element
els.forEach((el, key) => {
  el.update({ dataset: { component: key.toLowerCase() } });
});

// Get only elements that are currently disabled
const disabled = els.filter(el => el.disabled);
```

### Append methods

Both methods accept either an `Element` reference or a CSS selector string for the container.

| Method | Description |
|---|---|
| `els.appendTo(container)` | Appends all elements to `container`. Returns the bulk object for chaining. |
| `els.appendToOrdered(container, ...keys)` | Appends specific elements in the order given. Returns the bulk object for chaining. |

```js
// Append everything in creation order
els.appendTo(document.body);
els.appendTo('#main-content');  // selector string also works

// Append specific elements in a specific order
els.appendToOrdered('#header', 'LOGO', 'NAV', 'BTN');
```

### Batch update

`updateMultiple()` accepts an object where each key matches a bulk key and each value is a configuration object for that element's `.update()` call.

```js
els.updateMultiple({
  H1:  { textContent: 'New title', style: { color: '#333' } },
  BTN: { disabled: true, textContent: 'Please wait…' }
});
```

Returns the bulk object for chaining:

```js
els
  .appendTo('#app')
  .updateMultiple({ BTN: { disabled: false } });
```

---

## Enabling and disabling the enhancement

By default (`DEFAULTS.autoEnhanceCreateElement = true`), the library patches `document.createElement` on load so that native calls are also enhanced. You can turn this on or off at runtime.

### Disable the enhancement

```js
DOMHelpers.disableCreateElementEnhancement();

// document.createElement now returns plain elements (no .update() method)
const plain = document.createElement('div');
console.log(typeof plain.update); // 'undefined'
```

### Re-enable the enhancement

```js
DOMHelpers.enableCreateElementEnhancement();

// Back to enhanced behaviour
const enhanced = document.createElement('div');
console.log(typeof enhanced.update); // 'function'
```

### Restore the original function

`document.createElement.restore()` is a permanent escape hatch that reverts the function to the browser's original implementation. Unlike `disableCreateElementEnhancement()`, it removes the patched function entirely. You can still call the global `createElement` shorthand after this — it still uses the enhanced version — but `document.createElement` will behave as if the library was never loaded.

```js
document.createElement.restore();

document.createElement('div').update; // undefined — back to native
createElement('div').update;          // still a function — shorthand unchanged
```

---

## Global availability and imports

`createElement` is part of the **Core** module.

### Classic and Deferred loading

When you load the Core module with a `<script>` tag (classic or `type="module"`), `createElement` is available as a global function and as a method on `DOMHelpers`:

```js
window.createElement          // global shorthand
window.DOMHelpers.createElement  // namespace access
```

```html
<!-- Classic -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script>
  const btn = createElement('button', { textContent: 'Hello' });
</script>

<!-- Deferred -->
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module">
  const btn = createElement('button', { textContent: 'Hello' });
</script>
```

### Named import (ESM)

```js
import { createElement }
  from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js';

const btn = createElement('button', { textContent: 'Hello' });
```

Or from the full bundle:

```js
import { createElement, Elements, Collections }
  from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js';
```

---

## Practical patterns

### Building a card component

```js
function createCard({ title, body, onAction }) {
  const els = createElement.bulk({
    ARTICLE: { className: 'card' },
    H2:      { className: 'card__title', textContent: title },
    P:       { className: 'card__body',  textContent: body },
    BUTTON:  {
      className: 'card__action btn',
      textContent: 'View details',
      addEventListener: ['click', onAction]
    }
  });

  els.appendToOrdered(els.ARTICLE, 'H2', 'P', 'BUTTON');
  return els.ARTICLE;
}

const card = createCard({
  title:    'Getting started',
  body:     'Read the quick-start guide to learn the basics.',
  onAction: () => router.navigate('/docs/start')
});

document.querySelector('#cards').appendChild(card);
```

### Building a form row

```js
function createField({ label, name, type = 'text', required = false }) {
  const els = createElement.bulk({
    DIV:   { className: 'form-group' },
    LABEL: {
      textContent: label,
      setAttribute: { for: name }
    },
    INPUT: {
      setAttribute: { type, name, id: name },
      required,
      className: 'form-control'
    }
  });

  els.LABEL.appendChild(els.INPUT);  // nest input inside label
  els.DIV.appendChild(els.LABEL);
  return els.DIV;
}

const emailRow = createField({ label: 'Email', name: 'email', type: 'email', required: true });
document.querySelector('form').appendChild(emailRow);
```

### Updating elements in response to state

```js
const spinner = createElement('div', {
  className: 'spinner',
  setAttribute: { 'aria-label': 'Loading', role: 'status' },
  hidden: true
});

const btn = createElement('button', {
  textContent: 'Load data',
  className: 'btn',
  addEventListener: ['click', async () => {
    btn.update({ disabled: true, textContent: 'Loading…' });
    spinner.update({ hidden: false });

    try {
      const data = await fetchData();
      renderData(data);
    } finally {
      btn.update({ disabled: false, textContent: 'Load data' });
      spinner.update({ hidden: true });
    }
  }]
});
```

### Rendering a list dynamically

```js
function renderList(items, container) {
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const li = createElement('li', {
      className: 'list-item',
      textContent: item.label,
      dataset: { id: String(item.id) },
      addEventListener: ['click', () => onSelect(item)]
    });
    fragment.appendChild(li);
  });

  container.appendChild(fragment);
}
```

### Building UI without a framework

```js
function buildDashboard() {
  const els = createElement.bulk({
    MAIN:         { className: 'dashboard' },
    HEADER:       { className: 'dashboard__header' },
    H1:           { className: 'dashboard__title', textContent: 'Dashboard' },
    NAV:          { className: 'dashboard__nav' },
    SECTION:      { className: 'dashboard__content' },
    ASIDE:        { className: 'dashboard__sidebar' },
    FOOTER:       { className: 'dashboard__footer',
                    textContent: '© 2025 My App' }
  });

  // Assemble structure
  els.HEADER.appendChild(els.H1);
  els.MAIN.append(els.HEADER, els.NAV, els.SECTION, els.ASIDE, els.FOOTER);

  document.body.appendChild(els.MAIN);
  return els;
}

const ui = buildDashboard();

// Later — update any piece of it
ui.H1.update({ textContent: 'Welcome back, Alice' });
ui.ASIDE.update({ hidden: true });
```

### Using `.update()` for animations (with classList)

```js
const notification = createElement('div', {
  className: 'notification',
  textContent: 'Changes saved.',
  dataset: { type: 'success' }
});

document.body.appendChild(notification);

// Show
notification.update({ classList: { add: 'notification--visible' } });

// Hide after 3 seconds
setTimeout(() => {
  notification.update({ classList: { remove: 'notification--visible' } });
}, 3000);
```

---

## Summary

| | Details |
|---|---|
| **Module** | Core |
| **CDN (classic)** | `dom-helpers.core.min.js` |
| **CDN (ESM)** | `dom-helpers.core.esm.min.js` |
| **Global** | `window.createElement`, `window.DOMHelpers.createElement` |
| **Named export** | `import { createElement } from '...'` |
| **Returns** | Real `HTMLElement` with `.update()` method |
| **Bulk method** | `createElement.bulk(definitions)` |
| **Patches native** | `document.createElement` (opt-in, enabled by default) |
| **Restore native** | `document.createElement.restore()` |
| **Toggle** | `DOMHelpers.enableCreateElementEnhancement()` / `disableCreateElementEnhancement()` |
