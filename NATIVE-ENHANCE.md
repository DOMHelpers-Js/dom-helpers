# Native Enhance — DOM Helpers JS

Transparently patches `document.getElementById`, `document.getElementsByClassName`, `document.getElementsByTagName`, `document.getElementsByName`, `document.querySelector`, and `document.querySelectorAll` so every element and collection they return is automatically enhanced with the full DOM Helpers API — no code changes required.

---

## Installation

### CDN (recommended)

Load Native Enhance **after** Core and Enhancers:

```html
<!-- Core -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.5.2/dist/dom-helpers.core.min.js"></script>
<!-- Enhancers -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.5.2/dist/dom-helpers.enhancers.min.js"></script>
<!-- Native Enhance -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.5.2/dist/dom-helpers.native-enhance.min.js"></script>
```

Or drop it on top of the Full Bundle:

```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.5.2/dist/dom-helpers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.5.2/dist/dom-helpers.native-enhance.min.js"></script>
```

### npm / ESM

```bash
npm install dom-helpers-js
```

```js
import 'dom-helpers-js/native-enhance';
```

---

## What gets patched

| Native method | Returns | Enhancement |
|---|---|---|
| `document.getElementById(id)` | Single element | `.update()` + all bulk shorthands |
| `document.getElementsByClassName(name)` | HTMLCollection | Full collection pipeline |
| `document.getElementsByTagName(name)` | HTMLCollection | Full collection pipeline |
| `document.getElementsByName(name)` | NodeList | Full collection pipeline |
| `document.querySelector(selector)` | Single element | `.update()` + all shorthands |
| `document.querySelectorAll(selector)` | NodeList | Full collection pipeline |

All original behaviour is preserved — these are thin wrappers that call the original methods internally.

---

## Module 1 — `getElementById` Enhance

### Basic usage

```js
// Returns an enhanced element — call .update() directly
const btn = document.getElementById('submit-btn');

btn.update({
  textContent: 'Submitting…',
  disabled: true,
  style: { opacity: '0.7' }
});
```

### Bulk `.update()` — update multiple IDs at once

```js
document.getElementById.update({
  title:    { textContent: 'Welcome back!', style: { color: '#333' } },
  subtitle: { textContent: 'Here is your dashboard' },
  saveBtn:  { disabled: false, textContent: 'Save' },
  cancelBtn:{ disabled: false }
});
```

### Property shorthands

All shorthands accept `{ id: value }` maps:

```js
// Text content
document.getElementById.textContent({ heading: 'Hello', footer: 'Goodbye' });
document.getElementById.innerHTML({ panel: '<b>Bold</b>' });
document.getElementById.innerText({ label: 'Plain text only' });

// Form fields
document.getElementById.value({ username: 'john_doe', email: 'john@example.com' });
document.getElementById.placeholder({ username: 'Enter username', email: 'Enter email' });
document.getElementById.disabled({ submitBtn: true, resetBtn: false });
document.getElementById.checked({ agreeBox: true });
document.getElementById.readonly({ refCode: true });
document.getElementById.selected({ defaultOpt: true });
document.getElementById.hidden({ errorMsg: true });

// Media / links
document.getElementById.src({ avatar: '/images/user.png', banner: '/images/hero.jpg' });
document.getElementById.href({ homeLink: '/', backLink: '/dashboard' });
document.getElementById.alt({ avatar: 'User avatar' });

// Styles — value is a style object per element
document.getElementById.style({
  card:   { backgroundColor: '#fff', borderRadius: '8px' },
  modal:  { display: 'flex', zIndex: '1000' }
});

// Classes — value is a classList config per element
document.getElementById.classes({
  card:  { add: 'active', remove: 'inactive' },
  modal: { toggle: 'open' }
});

// Attributes
document.getElementById.attrs({
  form:  { 'data-submitting': 'true', 'aria-busy': 'true' },
  input: { autocomplete: 'off', maxlength: '100' }
});

// Dataset
document.getElementById.dataset({
  card:  { userId: '42', role: 'admin' },
  modal: { state: 'open' }
});

// Generic property (dot-path supported)
document.getElementById.prop('title', { card: 'Card tooltip', btn: 'Button tooltip' });
document.getElementById.prop('style.color', { heading: 'blue', para: 'gray' });
```

---

## Module 2 — `getElementsBy*` Enhance

Covers `getElementsByClassName`, `getElementsByTagName`, and `getElementsByName`. All three work identically.

### Basic usage — returned collection is enhanced

```js
// Returns an enhanced HTMLCollection
const buttons = document.getElementsByClassName('btn');

buttons.update({
  style: { padding: '10px 20px', borderRadius: '4px' }
});

// Iterate
buttons.forEach(btn => console.log(btn.textContent));

// Index access
buttons[0].update({ textContent: 'First button' });
```

### Bulk `.update()` — update multiple collections at once

```js
// getElementsByClassName
document.getElementsByClassName.update({
  'btn':   { style: { backgroundColor: '#007bff', color: '#fff' } },
  'card':  { style: { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
  'label': { style: { fontWeight: 'bold' } }
});

// getElementsByTagName
document.getElementsByTagName.update({
  'p':      { style: { lineHeight: '1.6' } },
  'button': { disabled: false },
  'input':  { style: { borderColor: '#ccc' } }
});

// getElementsByName
document.getElementsByName.update({
  'size':   { disabled: false },
  'colour': { style: { opacity: '1' } }
});
```

### Property shorthands

The value can be a **scalar** (applied to every element in the collection) or an **index map** (`{ 0: val, 1: val }`):

```js
// Scalar — same value for every element in the collection
document.getElementsByClassName.textContent({ 'card-title': 'Updated Title' });
document.getElementsByTagName.disabled({ 'button': true });

// Index map — different value per element
document.getElementsByClassName.textContent({
  'nav-item': { 0: 'Home', 1: 'About', 2: 'Contact' }
});

// Style
document.getElementsByClassName.style({
  'card': { backgroundColor: '#f9f9f9', padding: '16px' },
  'pill': { borderRadius: '999px' }
});

// Classes
document.getElementsByClassName.classes({
  'card': { add: 'shadow', remove: 'flat' },
  'btn':  { toggle: 'active' }
});

// Attributes
document.getElementsByTagName.attrs({
  'a':      { target: '_blank', rel: 'noopener' },
  'button': { type: 'button' }
});

// Dataset
document.getElementsByClassName.dataset({
  'item': { category: 'product', version: '2' }
});

// Generic property
document.getElementsByClassName.prop('title', { 'icon-btn': 'Click me' });
```

---

## Module 3 — `querySelector` / `querySelectorAll` Enhance

### `querySelector` — single element

```js
// Returns an enhanced element
const hero = document.querySelector('.hero-section');

hero.update({
  style: { backgroundImage: 'url(/hero.jpg)', minHeight: '400px' },
  classList: { add: 'loaded' }
});

// All the same shorthands work on the element itself
hero.textContent = 'Updated via native selector';
```

### `querySelectorAll` — collection

```js
// Returns an enhanced NodeList — full collection API available
const cards = document.querySelectorAll('.card');

// Bulk update
cards.update({
  style: { borderRadius: '8px', overflow: 'hidden' },
  classList: { add: 'animated' }
});

// Iterate
cards.forEach((card, i) => {
  card.update({ dataset: { index: String(i) } });
});

// Index access
cards[0].update({ classList: { add: 'featured' } });
```

### Practical patterns

```js
// Update a form section
document.querySelectorAll('input[required]').update({
  classList: { add: 'required-field' },
  setAttribute: { 'aria-required': 'true' }
});

// Reset all error states
document.querySelectorAll('.error').update({
  classList: { remove: 'error' },
  style: { borderColor: '' }
});

// Target scoped elements
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  if (link.href === location.href) {
    link.update({ classList: { add: 'active' } });
  }
});
```

---

## Enhancement pipeline

When a collection is returned, it passes through the full DOM Helpers enhancement pipeline in order:

1. `EnhancedUpdateUtility` — adds `.update()` to every element
2. `BulkPropertyUpdaters` — adds index-based shorthands (`textContent`, `style`, `classes`, `attrs`, `dataset`, `prop`)
3. `ArrayBasedUpdates` — adds array distribution methods (`forEach`, `map`, `filter`, etc.)
4. `IndexedUpdates` — adds index-specific update targeting

Each step is guarded — if a module isn't loaded, that step is silently skipped without breaking the others.

---

## Already-enhanced elements

If an element has already been enhanced by any part of the library (e.g. via `Elements`, `Selector.query`, or a previous call), the enhancer detects the flag and returns it as-is — no double-wrapping, no overhead.

---

## Size

| File | Raw | Gzipped |
|------|-----|---------|
| `dom-helpers.native-enhance.min.js` | 8.6 KB | ~2.0 KB |

---

## Rules

- **Load order matters** — always load Core and Enhancers before Native Enhance
- **No breaking changes** — all original return types and selector behaviour are preserved
- **Safe to add to existing projects** — existing code using `Elements`, `Collections`, or `Selector` continues to work unchanged
- **Already-enhanced elements are not double-wrapped**
