[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# createElement — Building DOM Elements

## Quick Start (30 seconds)

```javascript
// Create ONE element — fully configured in one call
const btn = createElement('button', {
  textContent: 'Save Changes',
  className: 'btn-primary',
  addEventListener: { click: saveData }
});

// Create MANY elements at once
const { HEADER, NAV, MAIN, FOOTER } = createElement.bulk({
  HEADER: { className: 'site-header' },
  NAV:    { className: 'site-nav', setAttribute: { role: 'navigation' } },
  MAIN:   { id: 'main-content', className: 'content-area' },
  FOOTER: { textContent: '© 2024', className: 'site-footer' }
});

document.body.append(HEADER, NAV, MAIN, FOOTER);
```

Two tools, one familiar name. Create one element or fifty — fully configured, instantly ready.

---

## What is `createElement`?

`createElement` is DOMHelpers' enhanced version of the browser's built-in `document.createElement`. It does everything the original does, but every element it creates comes with a **`.update()` method already attached** — and it accepts a **configuration object** so you can set properties, classes, styles, and events all in one step.

It also has a companion method:

- **`createElement.bulk()`** — creates multiple elements from a single definitions object, returning all of them together as a named package with built-in helpers.

Think of the two together like this:

```
createElement(tag, config)      →  single element, fully configured, .update() ready
createElement.bulk({ ... })     →  many elements, fully configured, returned as a package
```

Both are available globally — you can call them anywhere without needing to import or prefix anything.

---

## Syntax

### Single Element

```javascript
// Bare creation (same as document.createElement)
const div = createElement('div');

// With configuration
const div = createElement('div', {
  id: 'app',
  className: 'container',
  textContent: 'Hello'
});
```

### Bulk Creation

```javascript
const elements = createElement.bulk({
  TAGNAME:   { /* config */ },
  TAGNAME_2: { /* config for second element of same tag */ }
});

// Access each element by its key
elements.TAGNAME       // → the DOM element
elements.all           // → array of all elements
elements.toArray(...)  // → selected elements as array
```

### Aliases

`createElement.bulk` and `createElement.update` are the **exact same function**:

```javascript
createElement.bulk({ ... })    // ← standard name
createElement.update({ ... })  // ← exact alias, same behavior
```

---

## Why Does This Exist?

### When Building Elements One at a Time Is Your Starting Point

For simple, one-off elements, direct DOM manipulation is clear and familiar:

```javascript
const btn = document.createElement('button');
btn.textContent = 'Save';
btn.className = 'btn-save';
btn.addEventListener('click', saveData);
document.body.appendChild(btn);
```

This approach is **great when you need:**
✅ A quick, single-property element
✅ Total compatibility with any environment
✅ No dependency on any library

### When Inline Configuration Is Your Goal

In scenarios where you're building a component with multiple properties, classes, styles, and listeners at creation time, `createElement` with a config object provides a more direct approach — everything described in one readable block:

```javascript
const btn = createElement('button', {
  textContent: 'Save',
  className: 'btn-save',
  addEventListener: { click: saveData }
});
```

And when building a full component with many elements, `createElement.bulk()` shines:

```javascript
const { CARD, IMG, H3, P, BTN } = createElement.bulk({
  CARD: { className: 'product-card' },
  IMG:  { setAttribute: { src: product.image, alt: product.name } },
  H3:   { textContent: product.name, className: 'product-title' },
  P:    { textContent: product.price, className: 'product-price' },
  BTN:  { textContent: 'Add to Cart', className: 'btn-cart',
          addEventListener: { click: () => addToCart(product.id) } }
});

CARD.append(IMG, H3, P, BTN);
container.appendChild(CARD);
```

**This method is especially useful when:**
✅ You want all properties defined in one readable block
✅ You're building reusable component factories
✅ A component needs 3 or more related elements
✅ You need `.update()` available immediately after creation
✅ You want all elements co-located and visible at a glance

**The Choice is Yours:**
- Use plain `document.createElement` when a simple element with one or two properties is all you need
- Use `createElement(tag, config)` when multiple properties need to be set at creation time
- Use `createElement.bulk()` when building multi-element components or UI patterns
- All approaches can be mixed freely

---

## Mental Model

**Think of `createElement.bulk()` as filling out a factory order form.**

When you order furniture from a factory, you don't call them once per piece of furniture, then again to paint each one, then again to deliver each one. You fill out **one order form** with all the items and their specifications — and the factory delivers everything together, ready to use.

```
Your Order Form (definitions object)
├─→ Item: HEADER  →  "className: site-header"
├─→ Item: NAV     →  "role: navigation"
├─→ Item: MAIN    →  "id: main-content"
└─→ Item: FOOTER  →  "text: © 2024"

Factory Output (result object)
├─→ HEADER  →  <header class="site-header">  ← ready to use
├─→ NAV     →  <nav role="navigation">        ← ready to use
├─→ MAIN    →  <main id="main-content">       ← ready to use
├─→ FOOTER  →  <footer>© 2024</footer>        ← ready to use
└─→ .all    →  [all four as an array]
```

The factory handles all the wiring. You just describe what you want.

---

## How Does It Work?

### Enhanced Single `createElement`

When you call `createElement('div', config)`:

```
createElement('div', config)
   ↓
1️⃣ Is config a DOMHelpers config object?
   (has textContent, className, style, id, classList, or setAttribute?)
   ↓
   YES → Create bare element: document.createElement(tag)
       → Attach .update() to the element
       → Apply config properties one by one
       → Return the configured element ✅

   NO  → Call original document.createElement(tag, config)
       → Attach .update() to the element
       → Return the enhanced element ✅
```

**Key insight:** Even with no config at all — `createElement('div')` — the returned element still has `.update()`. You never need to manually enhance elements created this way.

### Bulk `createElement.bulk()`

When you call `createElement.bulk({ ... })`:

```
createElement.bulk(definitions)
   ↓
1️⃣ Validate input (must be a plain object)

2️⃣ Loop through each key in definitions object

3️⃣ For each key:
   Parse tag name  →  "DIV_2" → actual tag is "div"
   Create element  →  enhanced createElement (with .update())
   Apply config    →  each property handled by type

4️⃣ Collect all elements into result object
   { DIV: el1, P: el2, BUTTON: el3, ... }

5️⃣ Add helper methods to result
   .all, .count, .keys
   .toArray(), .ordered()
   .has(), .get()
   .forEach(), .map(), .filter()
   .appendTo(), .appendToOrdered()
   .updateMultiple()

6️⃣ Return the enriched result object
```

### The Tag Naming System

Object keys follow this pattern:

```
Definitions key    →  tag created    →  access via
─────────────────────────────────────────────────────
DIV                →  <div>          →  result.DIV
P                  →  <p>            →  result.P
BUTTON             →  <button>       →  result.BUTTON
DIV_1              →  <div>          →  result.DIV_1
DIV_2              →  <div>          →  result.DIV_2
SPAN_header        →  <span>         →  result.SPAN_header
SPAN_badge         →  <span>         →  result.SPAN_badge
```

The `_N` suffix (any numbers or letters after the underscore) is stripped for tag creation — but your access key keeps the full name. This lets you create multiple elements of the same tag without key collisions.

---

## Basic Usage

### Simple Element Creation

```javascript
// Just a tag — same as document.createElement('div')
const wrapper = createElement('div');
// wrapper is a <div> with .update() already attached

// With text content
const heading = createElement('h1', { textContent: 'Welcome!' });
// <h1>Welcome!</h1>

// With class
const card = createElement('div', { className: 'card shadow-lg' });
// <div class="card shadow-lg">

// With ID and class
const panel = createElement('section', {
  id: 'main-panel',
  className: 'panel'
});
// <section id="main-panel" class="panel">
```

### Adding Styles, Events, and Attributes

```javascript
// Inline styles via style object (camelCase keys)
const banner = createElement('div', {
  className: 'banner',
  style: {
    backgroundColor: '#0070f3',
    color: '#fff',
    padding: '16px',
    borderRadius: '8px'
  }
});

// Event listeners
const btn = createElement('button', {
  textContent: 'Submit',
  addEventListener: {
    click: handleSubmit,
    mouseenter: () => btn.classList.add('hovered'),
    mouseleave: () => btn.classList.remove('hovered')
  }
});

// Attributes and data attributes
const item = createElement('li', {
  textContent: 'Product Name',
  setAttribute: { role: 'listitem', 'aria-label': 'Product' },
  dataset: {
    productId: '12345',
    category: 'electronics'
  }
  // → data-product-id="12345" data-category="electronics"
});
```

### Bulk Creation — Simple Structures

```javascript
// Two-element form group
const { LABEL, INPUT } = createElement.bulk({
  LABEL: { textContent: 'Email:', setAttribute: { for: 'email-input' } },
  INPUT: { setAttribute: { type: 'email', id: 'email-input', placeholder: 'you@example.com' } }
});

const formGroup = createElement('div', { className: 'form-group' });
formGroup.append(LABEL, INPUT);
```

### Bulk Creation — Multiple of the Same Tag

```javascript
// Use TAG_N naming when you need several of the same element
const { DIV_1, DIV_2, DIV_3 } = createElement.bulk({
  DIV_1: { className: 'col col-1' },
  DIV_2: { className: 'col col-2' },
  DIV_3: { className: 'col col-3' }
});

const row = createElement('div', { className: 'row' });
row.append(DIV_1, DIV_2, DIV_3);
```

The `_N` can be anything meaningful:

```javascript
const { SPAN_icon, SPAN_label, SPAN_badge } = createElement.bulk({
  SPAN_icon:  { className: 'icon', innerHTML: '★' },
  SPAN_label: { textContent: 'Featured' },
  SPAN_badge: { textContent: '3', className: 'badge' }
});
```

---

## Deep Dive: The Configuration Object

The configuration object is the same syntax for three places:

1. `createElement(tag, config)` — initial config at creation time
2. `createElement.bulk({ KEY: config })` — config for each element in a bulk operation
3. `element.update(config)` — update an existing element after creation

Learn it once, use it everywhere.

### Config Properties Reference

| Config Key | What it Does | Example Value |
|---|---|---|
| `textContent` | Sets plain text (HTML-safe) | `'Hello World'` |
| `innerHTML` | Sets HTML content (trusted only) | `'<b>Bold</b>'` |
| `className` | Replaces entire class attribute | `'card active'` |
| `id` | Sets element ID | `'main-panel'` |
| `style` | Sets inline CSS (camelCase object) | `{ color: 'red', fontSize: '16px' }` |
| `classList` | Adds/removes/toggles classes | `{ add: 'visible', remove: 'loading' }` |
| `setAttribute` | Sets HTML attributes | `{ role: 'button', 'aria-label': 'Close' }` |
| `removeAttribute` | Removes attributes | `'disabled'` or `['readonly', 'disabled']` |
| `dataset` | Sets `data-*` attributes | `{ userId: '42' }` → `data-user-id="42"` |
| `addEventListener` | Attaches event listeners | `{ click: handler }` or `{ click: [handler, { once: true }] }` |
| Any DOM property | Sets directly on the element | `checked: true`, `value: 'hello'`, `href: '/page'` |

### `classList` Methods

```javascript
createElement('div', {
  className: 'card loading error',
  classList: {
    add: ['visible', 'animated'],    // adds classes
    remove: ['loading', 'error'],    // removes classes
    toggle: 'highlighted',           // toggles class
    replace: ['card', 'panel']       // replaces card → panel
  }
});
```

### `addEventListener` with Options

```javascript
createElement('div', {
  addEventListener: {
    scroll: [handleScroll, { passive: true }],  // [handler, options]
    click:  [handleClick,  { once: true }]
  }
});
```

### Priority Order (how config keys are resolved)

```
config key
   ↓
1️⃣ Is it 'style'?           → Object.assign(element.style, value)
2️⃣ Is it 'classList'?        → call classList methods
3️⃣ Is it 'setAttribute'?     → setAttribute (object or array format)
4️⃣ Is it 'dataset'?          → element.dataset[key] = value
5️⃣ Is it 'addEventListener'? → addEventListener (function or [fn, options])
6️⃣ Is it 'removeAttribute'?  → removeAttribute (string or array)
7️⃣ Is element[key] a function? → call it with value as arguments
8️⃣ Is key 'in' element?       → element[key] = value (direct property)
9️⃣ Value is primitive?        → element.setAttribute(key, String(value))
```

---

## Deep Dive: Post-Creation Updates with `.update()`

Every element created by `createElement` has a `.update()` method. It accepts the same config-style object as at creation time:

```javascript
const notification = createElement('div', {
  className: 'notification',
  textContent: 'Loading...',
  style: { opacity: '0' }
});

// Later, when data loads:
notification.update({
  textContent: 'Done! 3 items found.',
  style: { opacity: '1', color: 'green' },
  classList: { add: 'success', remove: 'loading' }
});
```

`.update()` returns the element itself — so you can chain:

```javascript
const el = createElement('div')
  .update({ className: 'panel' })
  .update({ textContent: 'Hello' })
  .update({ style: { color: 'blue' } });
```

---

## Deep Dive: Bulk Result Methods

The object returned by `createElement.bulk()` is not a plain object — it's an **enriched container** with built-in helpers.

### Accessing Elements

```javascript
const els = createElement.bulk({
  HEADER: { className: 'header' },
  MAIN:   { className: 'main' },
  FOOTER: { className: 'footer' }
});

// Destructuring (recommended)
const { HEADER, MAIN, FOOTER } = els;

// Dot access
els.HEADER.textContent = 'Hello';

// All elements as array
container.append(...els.all);

// Specific elements in a specific order
const [first, last] = els.toArray('HEADER', 'FOOTER');
```

### Inspection

```javascript
els.all       // [<header>, <main>, <footer>] — in creation order
els.count     // 3
els.keys      // ['HEADER', 'MAIN', 'FOOTER']
```

### Safe Lookup

```javascript
els.has('HEADER')          // true
els.has('ASIDE')           // false

els.get('HEADER')          // → <header> element
els.get('ASIDE')           // → null (default fallback)
els.get('ASIDE', false)    // → false (custom fallback)
```

### Iteration

```javascript
// Side effects
els.forEach((el, key, index) => {
  console.log(`${index}: ${key}`);
});

// Transform
const classNames = els.map(el => el.className);
// ['header', 'main', 'footer']

// Filter
const withClass = els.filter(el => el.classList.contains('active'));
```

### DOM Insertion

```javascript
// Append all elements (in creation order)
els.appendTo('#container');
els.appendTo(document.getElementById('app'));

// Append specific elements in a specific order
els.appendToOrdered(document.body, 'HEADER', 'MAIN', 'FOOTER');

// Chain — bulk → update → append
createElement.bulk({
  H1:  { textContent: 'Hello' },
  P:   { textContent: 'World' }
})
.updateMultiple({ H1: { style: { color: 'blue' } } })
.appendTo('#main');
```

### Batch Updates

```javascript
// Update multiple elements at once
els.updateMultiple({
  HEADER: { textContent: 'Updated Title', style: { color: 'green' } },
  FOOTER: { textContent: 'New Footer' }
  // MAIN is untouched — only include what you want to change
});
```

### All Result Methods at a Glance

```
result.KEY                          →  direct access to element by key
result.all                          →  all elements as array (creation order)
result.count                        →  number of elements created
result.keys                         →  array of all key names

result.toArray(...keys)             →  get elements as array (specific or all)
result.ordered(...keys)             →  alias for toArray

result.has(key)                     →  check if a key exists (boolean)
result.get(key, fallback)           →  safe access with optional fallback

result.forEach(fn)                  →  loop: fn(element, key, index)
result.map(fn)                      →  transform: fn(element, key, index) → array
result.filter(fn)                   →  filter: fn(element, key, index) → array

result.appendTo(container)          →  append all to container (chainable)
result.appendToOrdered(c, ...keys)  →  append specific elements in order (chainable)
result.updateMultiple(updates)      →  update multiple elements at once (chainable)
```

---

## Deep Dive: Real-World Component Example

### Card Component Factory

```javascript
function createProductCard(product) {
  const { ARTICLE, IMG, H3, P, BUTTON } = createElement.bulk({
    ARTICLE: {
      className: 'product-card',
      dataset: { productId: product.id },
      setAttribute: { role: 'article', 'aria-label': `Product: ${product.name}` }
    },
    IMG: {
      setAttribute: { src: product.image, alt: product.name, loading: 'lazy' }
    },
    H3: {
      textContent: product.name,
      className: 'product-title'
    },
    P: {
      textContent: `$${product.price}`,
      className: 'product-price'
    },
    BUTTON: {
      textContent: 'Add to Cart',
      className: 'btn-cart',
      addEventListener: { click: () => addToCart(product.id) }
    }
  });

  ARTICLE.append(IMG, H3, P, BUTTON);
  return ARTICLE;
}

// Use it
const cards = products.map(createProductCard);
container.append(...cards);
```

### Navigation Menu

```javascript
function buildNav(links) {
  const { NAV, UL } = createElement.bulk({
    NAV: { setAttribute: { role: 'navigation', 'aria-label': 'Main menu' } },
    UL:  { className: 'nav-list' }
  });

  links.forEach(({ href, label }) => {
    const li = createElement('li', { className: 'nav-item' });
    const a  = createElement('a', {
      textContent: label,
      setAttribute: { href },
      addEventListener: { click: (e) => handleNavClick(e, href) }
    });
    li.appendChild(a);
    UL.appendChild(li);
  });

  NAV.appendChild(UL);
  return NAV;
}
```

### Page Skeleton with Insertion Order Control

```javascript
// Define elements in any order — insert them in the right order
const els = createElement.bulk({
  FOOTER:  { className: 'site-footer', textContent: '© 2024' },
  HEADER:  { className: 'site-header' },
  SIDEBAR: { className: 'sidebar' },
  MAIN:    { id: 'main-content' }
});

// Insert in logical DOM order, regardless of definition order
els.appendToOrdered(document.body, 'HEADER', 'MAIN', 'SIDEBAR', 'FOOTER');
```

---

## Enabling Global Enhancement

By default, DOMHelpers does **not** replace `document.createElement` globally. That's an opt-in:

```javascript
// Option 1: Use createElement directly (always available as a global)
const el = createElement('div');  // ← DOMHelpers version

// Option 2: Opt in to replacing document.createElement globally
DOMHelpers.enableCreateElementEnhancement();
// Now document.createElement === DOMHelpers' version
const el = document.createElement('div');  // ← also DOMHelpers version now

// Option 3: Restore the original if needed
DOMHelpers.disableCreateElementEnhancement();
// or:
document.createElement.restore();
```

This design means DOMHelpers never surprises your code — you choose when and where the enhancement is active.

---

## Common Mistakes

### ❌ Using a String for `style`

```javascript
// ❌ Avoid — sets the attribute as a raw string
const el = createElement('div', {
  style: 'color: red; font-size: 16px'
});

// ✅ Use an object — properties are merged cleanly
const el = createElement('div', {
  style: { color: 'red', fontSize: '16px' }
});
```

### ❌ Using Hyphenated Names in `style` Object

```javascript
// ❌ Hyphenated names don't work in JavaScript style objects
const el = createElement('div', {
  style: { 'background-color': 'blue' }  // ← may not work as expected
});

// ✅ Use camelCase
const el = createElement('div', {
  style: { backgroundColor: 'blue' }
});
```

### ❌ Using the Same Key Twice in Bulk

```javascript
// ❌ Second DIV overwrites the first — JavaScript objects have unique keys
const { DIV } = createElement.bulk({
  DIV: { className: 'col-1' },
  DIV: { className: 'col-2' }  // ← this replaces the first silently
});

// ✅ Use numbered keys
const { DIV_1, DIV_2 } = createElement.bulk({
  DIV_1: { className: 'col-1' },
  DIV_2: { className: 'col-2' }
});
```

### ❌ Passing a String Instead of a Function to `addEventListener`

```javascript
// ❌ String — not a function
const el = createElement('button', {
  addEventListener: { click: 'handleClick' }  // ← won't work
});

// ✅ Pass the function reference
const el = createElement('button', {
  addEventListener: { click: handleClick }
});
```

### ❌ Confusing `.all` (getter) with `.toArray()` (method)

```javascript
// ✅ .all is a getter — no parentheses
elements.all         // → [el1, el2, el3]

// ✅ .toArray() is a method — use parentheses
elements.toArray('H1', 'P')  // → [H1, P]

// ❌ Wrong:
elements.all()       // TypeError — .all is not a function
elements.toArray     // → function reference, not the array
```

### ❌ Mixing Native Web Component Options with Config

```javascript
// ❌ The { is: '...' } key triggers the native path — className is ignored
const el = createElement('button', {
  is: 'my-button',
  className: 'fancy'  // ← this gets ignored
});

// ✅ Use separate calls
const el = createElement('button', { is: 'my-button' });
el.update({ className: 'fancy' });
```

---

## Key Takeaways

1. `createElement(tag)` with no config works exactly like `document.createElement(tag)` — just adds `.update()` automatically
2. `createElement(tag, config)` creates and configures in one step — the same as multiple separate property assignments
3. `createElement.bulk({ KEY: config })` creates many elements at once — keys are UPPERCASE tag names, returned as named properties on the result object
4. Use `TAG_N` keys (`DIV_1`, `DIV_2`, `SPAN_header`) when you need multiple elements of the same tag
5. The config object is shared syntax for `createElement`, bulk definitions, and `element.update()` — learn it once, use it everywhere
6. The bulk result object is both a map of your elements and a toolbox of helpers: `.appendTo()`, `.updateMultiple()`, `.forEach()`, and more
7. `document.createElement` is only replaced globally if you explicitly opt in via `DOMHelpers.enableCreateElementEnhancement()`

---

## What's Next?

- **[06 — Full createElement Documentation](../06_createElement/01_what-is-createElement.md)** — the complete deep-dive series covering every aspect of createElement
- **[05 — The `.update()` Method](./05_the-update-method.md)** — all 13 update types, change detection, and chaining
- **[06 — Real-World Examples & API Reference](./06_real-world-examples-and-api-reference.md)** — complete patterns and full API tables