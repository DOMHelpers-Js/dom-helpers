# Native Enhance — Enhanced Native DOM Methods

The native-enhance module patches six of the browser's built-in DOM methods so they return enhanced objects instead of plain elements and NodeLists. Existing code that already calls `document.getElementById`, `document.querySelector`, and so on gains `.update()` and all collection capabilities without any changes.

All six patched methods go through the same enhancement pipeline as the rest of DOM Helpers, so the objects they return behave identically to those returned by `Elements`, `Selector.query`, and `Collections`.

---

## Methods Patched

| Native method | Returns | Function-level shorthands |
|---|---|---|
| `document.getElementById` | Enhanced element | Yes — keys are element IDs |
| `document.getElementsByClassName` | Enhanced collection | Yes — keys are class names |
| `document.getElementsByTagName` | Enhanced collection | Yes — keys are tag names |
| `document.getElementsByName` | Enhanced collection | Yes — keys are `name` attribute values |
| `document.querySelector` | Enhanced element | No |
| `document.querySelectorAll` | Enhanced collection | No |

---

## Prerequisites

The native-enhance module must be loaded **after** core and enhancers. It depends on both.

```
core → enhancers → native-enhance
```

**ESM — via loader:**
```html
<script type="module">
  import { load } from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js';
  await load('native-enhance'); // auto-loads core + enhancers first
</script>
```

**ESM — direct import:**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.esm.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.native-enhance.esm.min.js"></script>
```

**Classic script:**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.enhancers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.native-enhance.min.js"></script>
```

**Full bundle (includes everything):**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js"></script>
```

---

## `document.getElementById` — enhanced

Returns the matched element enhanced with `.update()`, or `null`. The function itself also gains bulk shorthand methods that operate by ID.

### Single element

```js
const btn = document.getElementById('saveBtn');

btn.update({
  textContent: 'Saving…',
  disabled:    true,
  style:       { opacity: '0.7' },
  classList:   { add: 'loading', remove: 'idle' }
});
```

Returns `null` if no element with that ID exists — same as the native function.

### `document.getElementById.update(updates)`

Update multiple elements by ID in one call. Keys are element IDs, values are update objects.

```js
document.getElementById.update({
  pageTitle:   { textContent: 'Dashboard' },
  saveBtn:     { disabled: false },
  errorMsg:    { hidden: true },
  userAvatar:  { setAttribute: { src: '/images/alice.jpg', alt: 'Alice' } }
});
```

### `document.getElementById.textContent(updates)`

Set `textContent` for multiple elements by ID.

```js
document.getElementById.textContent({
  pageTitle:   'Welcome back, Alice',
  userRole:    'Administrator',
  itemCount:   '42 items',
  lastLogin:   'Today at 09:14'
});
```

### All shorthand methods

Every shorthand takes `{ id: value }` pairs. All are applied via `.update()` under the hood, so complex values like objects for `style` and `classList` work exactly as they do in `.update()`.

| Method | What it sets | Value type |
|---|---|---|
| `.textContent(updates)` | Text content | string |
| `.innerHTML(updates)` | HTML content | string |
| `.innerText(updates)` | Visible text | string |
| `.value(updates)` | Input value | string |
| `.placeholder(updates)` | Placeholder text | string |
| `.title(updates)` | Title attribute | string |
| `.disabled(updates)` | Disabled state | boolean |
| `.checked(updates)` | Checked state | boolean |
| `.readonly(updates)` | Read-only state | boolean |
| `.hidden(updates)` | Hidden state | boolean |
| `.selected(updates)` | Selected state | boolean |
| `.src(updates)` | src attribute | string |
| `.href(updates)` | href attribute | string |
| `.alt(updates)` | alt attribute | string |
| `.style(updates)` | Inline styles | `{ id: { prop: value } }` |
| `.classes(updates)` | classList operations | `{ id: { add, remove, toggle } }` |
| `.attrs(updates)` | HTML attributes | `{ id: { attr: value } }` |
| `.dataset(updates)` | data-* attributes | `{ id: { key: value } }` |
| `.prop(path, updates)` | Any property | `path` string + `{ id: value }` |

```js
document.getElementById.disabled({ saveBtn: true, cancelBtn: false });
document.getElementById.hidden({ spinner: false, content: true });
document.getElementById.value({ emailInput: '', passwordInput: '' });

document.getElementById.style({
  hero:    { backgroundImage: 'url(/images/hero.jpg)', height: '400px' },
  sidebar: { width: '280px', borderRight: '1px solid #eee' }
});

document.getElementById.classes({
  navMenu:    { add: 'open',     remove: 'closed' },
  overlay:    { add: 'visible',  toggle: 'animated' },
  submitBtn:  { replace: ['idle', 'loading'] }
});

document.getElementById.attrs({
  emailInput: { autocomplete: 'email', 'aria-required': 'true' },
  fileUpload: { accept: 'image/*', multiple: 'true' }
});

document.getElementById.dataset({
  productCard: { id: '101', category: 'electronics', inStock: 'true' },
  userProfile: { userId: '42', role: 'admin' }
});

// Generic property path
document.getElementById.prop('style.color', {
  heroTitle: 'white',
  heroSubtitle: 'rgba(255,255,255,0.8)'
});
```

---

## `document.getElementsByClassName` — enhanced

Returns an enhanced collection. The function itself gains the same bulk shorthand methods as `getElementById`, but keys are **class names** instead of IDs.

### Single collection

```js
const cards = document.getElementsByClassName('card');

// Full collection API
cards.forEach(el => console.log(el.textContent));
cards.update({ classList: { add: 'loaded' } });
cards[0].update({ style: { border: '2px solid gold' } });
cards.at(-1).update({ hidden: true });

// Index-based
cards.update({
  [0]: { classList: { add: 'featured' } },
  [1]: { classList: { add: 'secondary' } }
});

// Array distribution
cards.update({
  textContent: ['Card one', 'Card two', 'Card three']
});
```

### `document.getElementsByClassName.update(updates)`

Update multiple class groups in one call. Keys are class names.

```js
document.getElementsByClassName.update({
  btn:     { disabled: false, classList: { remove: 'loading' } },
  card:    { style: { opacity: '1' }, classList: { add: 'visible' } },
  badge:   { textContent: 'New' },
  overlay: { hidden: true }
});
```

### All shorthand methods

Keys are class names. The same full set of shorthands as `getElementById`.

```js
document.getElementsByClassName.textContent({
  'page-title':    'Dashboard',
  'user-greeting': 'Welcome back'
});

document.getElementsByClassName.disabled({
  btn:         false,
  'form-input': false
});

document.getElementsByClassName.hidden({
  spinner: true,
  content: false
});

document.getElementsByClassName.value({
  'form-input': ''
});

document.getElementsByClassName.style({
  btn:    { backgroundColor: '#007bff', color: '#fff' },
  card:   { borderRadius: '8px', padding: '16px' },
  header: { position: 'sticky', top: '0' }
});

document.getElementsByClassName.classes({
  btn:    { add: 'active',   remove: 'disabled' },
  card:   { add: 'visible',  toggle: 'highlighted' },
  nav:    { replace: ['collapsed', 'expanded'] }
});

document.getElementsByClassName.attrs({
  btn:  { 'aria-pressed': 'true', role: 'button' },
  link: { target: '_blank', rel: 'noopener noreferrer' }
});

document.getElementsByClassName.dataset({
  card:    { loaded: 'true', version: '2' },
  product: { category: 'electronics' }
});

document.getElementsByClassName.src({
  avatar:    '/images/default-avatar.png',
  thumbnail: '/images/placeholder.jpg'
});

document.getElementsByClassName.href({
  'nav-link': '/dashboard',
  'cta-btn':  '/signup'
});

document.getElementsByClassName.placeholder({
  'search-input': 'Search…',
  'email-input':  'you@example.com'
});

document.getElementsByClassName.prop('style.display', {
  sidebar:  'block',
  overlay:  'none'
});
```

---

## `document.getElementsByTagName` — enhanced

Returns an enhanced collection. Function-level shorthands use **tag names** as keys.

### Single collection

```js
const paragraphs = document.getElementsByTagName('p');
paragraphs.update({ style: { lineHeight: '1.8' } });

const inputs = document.getElementsByTagName('input');
inputs.update({ disabled: false });
inputs.forEach(input => console.log(input.name, input.value));
```

### `document.getElementsByTagName.update(updates)`

```js
document.getElementsByTagName.update({
  p:     { style: { lineHeight: '1.8', marginBottom: '1em' } },
  h2:    { style: { color: '#333', fontWeight: '600' } },
  input: { disabled: false, classList: { remove: 'error' } },
  a:     { setAttribute: { target: '_blank', rel: 'noopener' } }
});
```

### Shorthand methods

```js
document.getElementsByTagName.style({
  p:    { fontSize: '16px', color: '#444' },
  li:   { marginBottom: '8px' },
  h1:   { fontSize: '2rem' },
  h2:   { fontSize: '1.5rem' }
});

document.getElementsByTagName.classes({
  button: { add: 'btn' },
  a:      { add: 'link' }
});

document.getElementsByTagName.disabled({
  input:  false,
  button: false,
  select: false
});

document.getElementsByTagName.attrs({
  img:    { loading: 'lazy', decoding: 'async' },
  iframe: { loading: 'lazy' }
});
```

---

## `document.getElementsByName` — enhanced

Returns an enhanced collection. Function-level shorthands use the **`name` attribute value** as keys. Particularly useful for radio button groups, checkboxes, and form fields.

### Single collection

```js
const radios = document.getElementsByName('paymentMethod');

radios.forEach(radio => console.log(radio.value, radio.checked));

// Disable all radios in the group
radios.update({ disabled: true });

// Check the one matching a value
radios.forEach(radio => {
  radio.update({ checked: radio.value === 'credit-card' });
});
```

### `document.getElementsByName.update(updates)`

```js
document.getElementsByName.update({
  paymentMethod: { disabled: false },
  newsletter:    { checked: false },
  shippingSpeed: { disabled: true }
});
```

### Shorthand methods

```js
document.getElementsByName.disabled({
  paymentMethod: false,
  newsletter:    false,
  shippingSpeed: true
});

document.getElementsByName.checked({
  newsletter:    true,
  termsAccepted: false
});

document.getElementsByName.value({
  country:  'US',
  currency: 'USD'
});

document.getElementsByName.attrs({
  paymentMethod: { 'aria-required': 'true' },
  newsletter:    { 'aria-label': 'Subscribe to newsletter' }
});
```

---

## `document.querySelector` — enhanced

Returns the first matching element enhanced with `.update()`, or `null`. No function-level shorthands.

```js
const btn  = document.querySelector('#saveBtn');
const card = document.querySelector('.card.active');
const nav  = document.querySelector('nav[aria-label="main"]');

// Use .update() immediately
document.querySelector('#modal').update({ hidden: false });

document.querySelector('.alert').update({
  textContent: 'Something went wrong.',
  classList:   { add: 'alert--error', remove: 'alert--info' },
  hidden:      false
});
```

Returns `null` if nothing matched — same as native.

---

## `document.querySelectorAll` — enhanced

Returns an enhanced collection with the full `.update()` pipeline — same as `Selector.queryAll`. No function-level shorthands on the function itself.

```js
const btns  = document.querySelectorAll('.btn');
const cards = document.querySelectorAll('[data-type="product"]');

// Full collection API
btns.forEach(btn => console.log(btn.textContent));
btns.update({ disabled: false });
btns[0].update({ classList: { add: 'primary' } });
btns.at(-1).update({ hidden: true });

// Index-based
btns.update({
  [0]: { textContent: 'First' },
  [1]: { textContent: 'Second' },
  [-1]: { classList: { add: 'last' } }
});

// Array distribution
btns.update({
  textContent: ['Save', 'Cancel', 'Reset']
});

// Iteration
const texts   = cards.map(el => el.dataset.type);
const visible = cards.filter(el => !el.hidden);
```

---

## Function-Level Shorthands — Full Reference

`getElementById`, `getElementsByClassName`, `getElementsByTagName`, and `getElementsByName` all share the same set of shorthands. The only difference is what the **key** represents:

| Method | Key is |
|---|---|
| `document.getElementById.*` | Element ID |
| `document.getElementsByClassName.*` | Class name |
| `document.getElementsByTagName.*` | Tag name |
| `document.getElementsByName.*` | `name` attribute value |

### Complete shorthand list

```
.update(updates)              { key: updateObject }
.textContent(updates)         { key: string }
.innerHTML(updates)           { key: string }
.innerText(updates)           { key: string }
.value(updates)               { key: string }
.placeholder(updates)         { key: string }
.title(updates)               { key: string }
.disabled(updates)            { key: boolean }
.checked(updates)             { key: boolean }
.readonly(updates)            { key: boolean }
.hidden(updates)              { key: boolean }
.selected(updates)            { key: boolean }
.src(updates)                 { key: string }
.href(updates)                { key: string }
.alt(updates)                 { key: string }
.style(updates)               { key: { cssProperty: value } }
.classes(updates)             { key: { add, remove, toggle, replace } }
.attrs(updates)               { key: { attributeName: value } }
.dataset(updates)             { key: { dataKey: value } }
.prop(propertyPath, updates)  propertyPath: string, { key: value }
```

---

## The Collection Object

All four `getElementsBy*` methods and `querySelectorAll` return the same enhanced collection. A brief summary:

```js
const col = document.getElementsByClassName('card');

col.length        // number of elements
col[0]            // element at index 0
col.at(-1)        // last element (negative index)
col.first()       // first element or null
col.last()        // last element or null
col.isEmpty()     // true if length === 0
col.toArray()     // plain Array of enhanced elements

col.forEach((el, i) => { ... })
col.map((el, i)    => { ... })
col.filter((el, i) => { ... })
col.find((el, i)   => { ... })
col.some((el, i)   => { ... })
col.every((el, i)  => { ... })
col.reduce((acc, el, i) => { ... }, initial)

for (const el of col) { ... }   // for...of supported
const arr = [...col];

// Bulk DOM
col.addClass('active')
col.removeClass('loading')
col.toggleClass('highlight')
col.setProperty('disabled', true)
col.setAttribute('aria-busy', 'true')
col.setStyle({ opacity: '0.6' })
col.on('click', handler)
col.off('click', handler)

// .update() with all modes
col.update({ style: { color: 'red' } })                  // bulk
col.update({ [0]: { textContent: 'First' } })            // index-based
col.update({ textContent: ['A', 'B', 'C'] })             // array distribution
```

---

## Practical Patterns

### Apply a theme in one pass

```js
document.getElementsByTagName.style({
  body:   { fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb' },
  h1:     { fontSize: '2rem', fontWeight: '700', color: '#111827' },
  h2:     { fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' },
  p:      { lineHeight: '1.75', color: '#374151' },
  a:      { color: '#2563eb', textDecoration: 'none' },
  button: { cursor: 'pointer', borderRadius: '6px' }
});
```

### Reset a form

```js
document.getElementsByTagName.update({
  input:    { value: '', disabled: false, classList: { remove: 'error', add: '' } },
  textarea: { value: '', disabled: false },
  select:   { selectedIndex: 0, disabled: false }
});

document.getElementsByClassName.update({
  'form-error': { hidden: true, textContent: '' },
  'form-group': { classList: { remove: 'has-error' } }
});
```

### Toggle a loading state across a page

```js
function setLoading(isLoading) {
  document.getElementsByClassName.disabled({
    btn:         isLoading,
    'form-input': isLoading
  });

  document.getElementsByClassName.hidden({
    spinner:  !isLoading,
    content:  isLoading
  });

  document.getElementById.update({
    submitBtn: {
      textContent: isLoading ? 'Saving…' : 'Save',
      classList:   { toggle: 'loading' }
    }
  });
}
```

### Update radio button groups

```js
// Disable all payment options, then enable only card
document.getElementsByName.disabled({
  paymentMethod: true
});

const radios = document.getElementsByName('paymentMethod');
radios.forEach(radio => {
  if (radio.value === 'card') radio.update({ disabled: false, checked: true });
});
```

### Progressively reveal a list

```js
const items = document.querySelectorAll('.product-card');

// Stagger reveal using index-based updates
const staggerUpdates = {};
items.forEach((_, i) => {
  staggerUpdates[i] = {
    style:     { transitionDelay: `${i * 80}ms` },
    classList: { add: 'visible' }
  };
});
items.update(staggerUpdates);
```

### Set image sources for a gallery

```js
document.getElementsByClassName.src({
  'gallery-thumb': '/images/thumb-placeholder.jpg'
});

// Or per-element via array distribution
document.querySelectorAll('.gallery-thumb').update({
  src: ['/img/01.jpg', '/img/02.jpg', '/img/03.jpg', '/img/04.jpg']
});
```

---

## Module Requirements Summary

| Feature | Requires |
|---|---|
| `document.getElementById` enhanced | `core` + `native-enhance` |
| `document.getElementById.*` shorthands | `core` + `enhancers` + `native-enhance` |
| `document.getElementsByClassName` enhanced | `core` + `native-enhance` |
| `document.getElementsByClassName.*` shorthands | `core` + `enhancers` + `native-enhance` |
| `document.getElementsByTagName` enhanced | `core` + `native-enhance` |
| `document.getElementsByTagName.*` shorthands | `core` + `enhancers` + `native-enhance` |
| `document.getElementsByName` enhanced | `core` + `native-enhance` |
| `document.getElementsByName.*` shorthands | `core` + `enhancers` + `native-enhance` |
| `document.querySelector` enhanced | `core` + `native-enhance` |
| `document.querySelectorAll` enhanced | `core` + `native-enhance` |
| Index-based updates on collections | `core` + `enhancers` + `native-enhance` |
| Array distribution on collections | `core` + `enhancers` + `native-enhance` |
