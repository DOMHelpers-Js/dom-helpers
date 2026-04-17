# Working with Collections

Collections let you access and manipulate groups of DOM elements — by class name, tag name, name attribute, or CSS selector. Every collection the library returns comes with array-style iteration, bulk DOM manipulation, index-based updates, and array value distribution built in.

---

## Prerequisites

Collections are part of the **core** module. The global shortcuts (`ClassName`, `TagName`, `Name`) and indexed/array update features require additional modules.

**ESM:**
```html
<script type="module">
  import { load } from 'https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.esm.min.js';

  await load('core');                        // Collections.ClassName / TagName / Name
  await load('enhancers');                   // ClassName, TagName, Name global shortcuts
  await load('native-enhance');             // enhanced querySelectorAll / querySelector
</script>
```

**Classic script:**
```html
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.loader.min.js"></script>
<script>
  DOMHelpersLoader.load('enhancers').then(function() { ... });
</script>
```

**Full bundle:**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/dom-helpers-js@2.9.2/dist/dom-helpers.full-spa.esm.min.js"></script>
```

---

## The Three Access Types

The library groups elements in three ways — by **class name**, **tag name**, and **name attribute**. Each one is available both through `Collections` and as a standalone global shortcut.

---

## Method 1 — `Collections.ClassName` (By Class Name)

Access all elements that share a CSS class.

```js
// Property access
const buttons  = Collections.ClassName.btn;
const cards    = Collections.ClassName.card;
const navItems = Collections.ClassName['nav-item']; // hyphenated names use bracket notation

// Function call — identical result
const buttons  = Collections.ClassName('btn');
```

**Returns:** Enhanced collection of all elements with that class.

---

## Method 2 — `Collections.TagName` (By Tag Name)

Access all elements of a given HTML tag.

```js
const paragraphs = Collections.TagName.p;
const divs       = Collections.TagName.div;
const inputs     = Collections.TagName.input;
const buttons    = Collections.TagName.button;
```

**Returns:** Enhanced collection of all elements with that tag.

---

## Method 3 — `Collections.Name` (By Name Attribute)

Access all elements sharing a `name` attribute — most commonly radio buttons and form fields.

```js
const radios    = Collections.Name.paymentMethod;
const checkboxes = Collections.Name.interests;
```

**Returns:** Enhanced collection of all elements with `name="value"`.

---

## Global Shortcuts — `ClassName`, `TagName`, `Name`

When the **enhancers** module is loaded, `ClassName`, `TagName` and `Name` become available directly on `window` — no `Collections.` prefix needed.

```js
// These are identical to Collections.ClassName / TagName / Name
const buttons   = ClassName.btn;
const divs      = TagName.div;
const radios    = Name.paymentMethod;

// Function call syntax also works
const buttons   = ClassName('btn');
const divs      = TagName('div');
```

Index access on global shortcuts also works:

```js
ClassName.btn[0]   // first .btn element
ClassName.btn[1]   // second .btn element
ClassName.btn[-1]  // last .btn element (negative indexing supported)

TagName.p[0]       // first <p>
Name.role[-1]      // last element with name="role"
```

---

## The Collection Object

Every access method returns an enhanced collection. Here is everything you can do with it.

### Length and Element Access

```js
const btns = ClassName.btn;

btns.length      // number of matched elements
btns[0]          // first element (enhanced with .update())
btns[1]          // second element
btns[-1]         // last element (negative indexing)
btns.at(-2)      // second-to-last element
btns.item(0)     // same as btns[0]
btns.isEmpty()   // true if no elements matched
btns.first()     // first element, enhanced
btns.last()      // last element, enhanced
```

### Iteration

All standard array iteration methods are available:

```js
const items = ClassName['list-item'];

// forEach
items.forEach((el, index) => {
  console.log(index, el.textContent);
});

// map — returns a plain array
const texts = items.map(el => el.textContent);

// filter — returns a plain array
const visible = items.filter(el => !el.hidden);

// find — returns first match
const active = items.find(el => el.classList.contains('active'));

// some / every
const anyDisabled = items.some(el => el.disabled);
const allVisible  = items.every(el => !el.hidden);

// reduce
const totalHeight = items.reduce((sum, el) => sum + el.offsetHeight, 0);

// for...of loop
for (const el of items) {
  console.log(el.textContent);
}

// spread into an array
const arr = [...items];

// convert to array
const arr = items.toArray();
```

### Bulk DOM Manipulation

These methods apply the same change to **every element** in the collection and return `this` for chaining.

```js
const cards = ClassName.card;

cards.addClass('highlighted');
cards.removeClass('muted');
cards.toggleClass('expanded');

cards.setProperty('hidden', false);
cards.setAttribute('aria-selected', 'false');
cards.setStyle({ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' });

cards.on('click', function(e) { console.log('card clicked', e.target); });
cards.off('click', previousHandler);
```

### Filtering by State

```js
const inputs = TagName.input;

inputs.visible()   // Array — only elements currently visible
inputs.hidden()    // Array — only hidden elements
inputs.enabled()   // Array — only non-disabled elements
inputs.disabled()  // Array — only disabled elements
```

---

## Updating Collections — `.update()`

The `.update()` method is the primary way to modify elements in a collection. It supports four distinct update modes.

---

### Mode 1 — Bulk Update (same change to all elements)

Pass an update object without numeric keys — every element receives the same change.

```js
ClassName.btn.update({
  style:     { backgroundColor: '#007bff', color: '#fff' },
  classList: { add: 'active', remove: 'disabled' }
});

TagName.p.update({
  style: { lineHeight: '1.8', fontSize: '16px' }
});

ClassName.input.update({
  disabled: false,
  classList: { remove: 'error' }
});
```

`.update()` accepts the same keys as a single element's `.update()`:

```js
collection.update({
  textContent:     'New text',
  innerHTML:       '<strong>Bold</strong>',
  style:           { color: 'red', fontSize: '14px' },
  classList:       { add: 'active', remove: ['old', 'muted'], toggle: 'expanded' },
  setAttribute:    { 'aria-expanded': 'true' },
  removeAttribute: 'disabled',
  dataset:         { status: 'loaded' },
  hidden:          false,
  disabled:        true,
  value:           ''
});
```

---

### Mode 2 — Index-Based Update (different change per element)

Use numeric keys to target specific elements by position. Negative indices count from the end.

```js
ClassName.step.update({
  [0]: { textContent: 'Step 1 — Done',    classList: { add: 'complete' } },
  [1]: { textContent: 'Step 2 — Current', classList: { add: 'active' } },
  [2]: { textContent: 'Step 3 — Pending', classList: { add: 'pending' } },
  [-1]: { style: { borderBottom: 'none' } }  // last element
});
```

Index-based and bulk updates can be **mixed**. Bulk is applied first, then index-specific changes override:

```js
ClassName.card.update({
  // Bulk — applied to all cards
  style:     { padding: '16px', borderRadius: '8px' },
  classList: { add: 'loaded' },

  // Index-specific — override for individual cards
  [0]: { classList: { add: 'featured' }, style: { border: '2px solid gold' } },
  [-1]: { hidden: true }
});
```

---

### Mode 3 — Array Distribution (different value per element from an array)

Pass an **array** as a value — each element in the collection receives the corresponding array item. If the collection has more elements than the array has values, the last array value is reused for the remainder.

```js
// Each <li> gets its own text
TagName.li.update({
  textContent: ['Home', 'About', 'Services', 'Contact']
});

// Each .card gets a different colour
ClassName.card.update({
  style: {
    backgroundColor: ['#e8f5e9', '#e3f2fd', '#fce4ec', '#f3e5f5'],
    color:           '#333'  // single value — applied to all
  }
});

// Each button gets its own label and style
ClassName.btn.update({
  textContent: ['Save', 'Cancel', 'Delete'],
  style: {
    backgroundColor: ['#4CAF50', '#9E9E9E', '#f44336'],
    color:           '#fff'
  }
});
```

Array distribution also works inside `classList`:

```js
ClassName.tab.update({
  classList: {
    add:    [['tab-home'], ['tab-about'], ['tab-contact']],
    remove: 'inactive'   // single value — removed from all
  }
});
```

---

### Mode 4 — Bulk Update via `Collections.update()`

Update multiple different collection types in a single call using type-prefixed identifiers.

```js
Collections.update({
  'class:btn':      { style: { padding: '10px 20px' } },
  'class:card':     { style: { borderRadius: '8px' } },
  'tag:p':          { style: { lineHeight: '1.6' } },
  'name:subscribe': { disabled: false }
});
```

Identifier format: `'type:value'`

| Prefix | Targets |
|---|---|
| `class:` | Elements with that class |
| `tag:` | Elements with that tag |
| `name:` | Elements with that name attribute |

**Returns:** `{ identifier: { success: boolean, collection, elementsUpdated?, error? }, ... }`

---

## Property Shorthand Methods

The enhancers module adds shorthand methods for common properties directly on collections. Each shorthand accepts an object of `{ index: value }` pairs.

```js
const items = ClassName['list-item'];

// Text content
items.textContent({ 0: 'First',  1: 'Second', 2: 'Third' });
items.innerHTML({   0: '<b>Bold</b>', 1: 'Normal' });
items.innerText({   0: 'Plain text' });

// Form controls
items.value({       0: 'alice@example.com', 1: 'bob@example.com' });
items.placeholder({ 0: 'Enter email', 1: 'Confirm email' });
items.disabled({    0: true,  1: false });
items.checked({     0: true });
items.readonly({    0: true });
items.hidden({      0: false, 1: true });
items.selected({    0: true });

// Media and links
items.src({  0: '/img/a.png', 1: '/img/b.png' });
items.href({ 0: '/page-a',   1: '/page-b' });
items.alt({  0: 'Image A',   1: 'Image B' });
items.title({0: 'Tooltip A', 1: 'Tooltip B' });

// Style
items.style({
  0: { color: 'red',  fontSize: '14px' },
  1: { color: 'blue', fontSize: '16px' }
});

// Dataset
items.dataset({
  0: { userId: '1', role: 'admin' },
  1: { userId: '2', role: 'user' }
});

// Attributes
items.attrs({
  0: { 'aria-selected': 'true',  'data-id': '1' },
  1: { 'aria-selected': 'false', 'data-id': '2' }
});

// Classes
items.classes({
  0: { add: 'active',   remove: 'inactive' },
  1: { add: 'inactive', remove: 'active' }
});

// Nested property path
items.prop('style.color', { 0: 'red', 1: 'blue', 2: 'green' });
items.prop('dataset.loaded', { 0: 'true', 1: 'false' });
```

All shorthand methods return `this` for chaining:

```js
ClassName.btn
  .textContent({ 0: 'Save', 1: 'Cancel' })
  .disabled({ 0: false, 1: false })
  .style({ 0: { backgroundColor: 'green' }, 1: { backgroundColor: 'grey' } });
```

---

## Selector-Based Collections — `querySelectorAll` / `queryAll`

When the **native-enhance** or **enhancers** module is loaded, `querySelectorAll` and its alias `queryAll` return fully enhanced collections with all the same methods.

```js
// querySelectorAll — enhanced
const activeCards = querySelectorAll('.card.active');
const formInputs  = querySelectorAll('form input[required]');

// queryAll — alias, identical
const items = queryAll('.list-item');

// Full collection API available on the result
activeCards.forEach(el => console.log(el.textContent));
activeCards.update({ classList: { add: 'highlighted' } });
activeCards[0].update({ style: { border: '2px solid gold' } });
```

### Scoped queries — `queryWithin` / `queryAllWithin`

Query elements within a specific container.

```js
// By element reference
const form   = Elements.signupForm;
const inputs = queryAllWithin(form, 'input[required]');

// By selector string — container is looked up first
const firstInput = queryWithin('#signupForm', 'input');

// Full collection API
inputs.update({ classList: { add: 'validated' } });
inputs.forEach(input => console.log(input.name));
```

### `querySelector` / `query`

Returns a single enhanced element — identical to `document.querySelector` but with `.update()` attached.

```js
const el = querySelector('.card.active');
const el = query('.sidebar nav a.current');

el.update({ classList: { add: 'focused' } });
```

---

## Async — Waiting for Dynamic Collections

When elements are injected dynamically (after fetch, animation, or third-party scripts), wait for them before working with them.

### `Collections.waitForElements(type, value, minCount, timeout)`

```js
// Wait for at least 1 element with class 'widget' (default)
const widgets = await Collections.waitForElements('className', 'widget');

// Wait for at least 3 items before proceeding
const items = await Collections.waitForElements('className', 'list-item', 3);

// Custom timeout (ms)
const rows = await Collections.waitForElements('tagName', 'tr', 5, 10000);

// By name attribute
const radios = await Collections.waitForElements('name', 'paymentMethod', 2);
```

**Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `type` | `'className'` \| `'tagName'` \| `'name'` | required | How to select |
| `value` | string | required | The class, tag, or name to match |
| `minCount` | number | `1` | Minimum elements before resolving |
| `timeout` | number | `5000` | Milliseconds before throwing |

**Throws:** Error if timeout reached before `minCount` elements exist.

---

## Multiple Collections at Once — `Collections.getMultiple()`

Retrieve several different collections in one call.

```js
const result = Collections.getMultiple([
  { type: 'className', value: 'btn',        as: 'buttons' },
  { type: 'className', value: 'card',       as: 'cards' },
  { type: 'tagName',   value: 'input',      as: 'inputs' },
  { type: 'name',      value: 'newsletter', as: 'checkboxes' }
]);

result.buttons.update({ disabled: false });
result.cards.update({ classList: { add: 'loaded' } });
result.inputs.forEach(input => input.value = '');
```

---

## Caching

Collections are cached after the first access. The cache is invalidated automatically by a MutationObserver when the DOM changes.

```js
Collections.ClassName.btn;   // live DOM lookup, stored in cache
Collections.ClassName.btn;   // cache hit — no DOM lookup

// Cache key format: "type:value"
// e.g. "className:btn", "tagName:div", "name:email"
```

**Validation:** Before returning a cached collection, the library checks that the first element still exists in the DOM. If it has been removed, the cache entry is discarded and a fresh lookup is performed.

**MutationObserver** watches for:
- Elements added or removed (`childList`, `subtree`)
- `class` and `name` attribute changes

### Cache statistics

```js
const stats = Collections.getStats();
// {
//   hits:      312,
//   misses:     44,
//   cacheSize:   9,
//   hitRate:   0.88,
//   uptime:  86400
// }
```

### Cache configuration

```js
Collections.configure({
  enableLogging:   false,   // log cache hits/misses
  autoCleanup:     true,    // periodic stale-entry removal
  cleanupInterval: 30000,   // ms between cleanup runs
  maxCacheSize:    1000,    // max cached collections
  debounceDelay:   16       // ms to debounce MutationObserver
});
```

### Manual cache control

```js
Collections.isCached('className', 'btn');  // true after first access
Collections.getCacheSnapshot();            // ['className:btn', 'tagName:p', ...]
Collections.clearCache();                  // clear all entries
Collections.destroy();                     // full teardown — disconnects observer
```

---

## Practical Patterns

### Apply a style change to all elements of a type

```js
TagName.p.update({
  style: { lineHeight: '1.8', fontSize: '16px', color: '#333' }
});
```

### Reset all form inputs

```js
TagName.input.update({ value: '', classList: { remove: 'error' } });
TagName.select.update({ selectedIndex: 0 });
TagName.textarea.update({ value: '' });
```

### Enable / disable a set of buttons

```js
ClassName.btn.update({ disabled: true,  classList: { add: 'loading' } });
// ... after async operation:
ClassName.btn.update({ disabled: false, classList: { remove: 'loading' } });
```

### Populate a list from data

```js
const names  = ['Alice', 'Bob', 'Carol', 'Dave'];
const emails = ['alice@co.com', 'bob@co.com', 'carol@co.com', 'dave@co.com'];

ClassName['user-name'].update({ textContent: names });
ClassName['user-email'].update({ textContent: emails });
```

### Style each item differently

```js
ClassName.badge.update({
  textContent: ['New', 'Hot', 'Sale'],
  style: {
    backgroundColor: ['#4CAF50', '#FF5722', '#2196F3'],
    color: '#fff'
  }
});
```

### Mark a specific step as active

```js
ClassName.step.update({
  classList: { remove: 'active' }    // clear all first
});

ClassName.step.update({
  [currentStep]: { classList: { add: 'active' } }
});
```

### Query and manipulate inside a container

```js
const sidebar = Elements.sidebar;

// All links inside the sidebar
queryAllWithin(sidebar, 'a').update({
  style: { textDecoration: 'none', color: '#333' }
});

// Only the active link
querySelector('#sidebar a.active').update({
  style: { color: '#007bff', fontWeight: 'bold' }
});
```

### React to state changes

```js
await load('reactive');

const state = ReactiveUtils.state({ activeTab: 0, loading: false });

ReactiveUtils.effect(() => {
  // All tabs reset
  ClassName.tab.update({ classList: { remove: 'active' } });

  // Active tab highlighted
  ClassName.tab.update({
    [state.activeTab]: { classList: { add: 'active' } }
  });

  // Loading indicator
  ClassName['btn-submit'].update({
    disabled:    state.loading,
    textContent: state.loading ? ['Saving...'] : ['Save']
  });
});
```

### Wait for dynamic content then manipulate it

```js
// Items rendered after an API call
const items = await Collections.waitForElements('className', 'product-card', 3);

items.update({
  classList: { add: 'visible' },
  style: { opacity: '1', transition: 'opacity 0.3s' }
});
```

---

## Update Format Reference

### Bulk update — same change to every element

```js
collection.update({
  textContent: 'Same for all',
  style:       { color: 'red' },
  classList:   { add: 'active' },
  disabled:    false
});
```

### Index-based — different change per position

```js
collection.update({
  [0]:  { textContent: 'First' },
  [1]:  { textContent: 'Second' },
  [-1]: { textContent: 'Last' }
});
```

### Mixed — bulk + index override

```js
collection.update({
  style: { padding: '8px' },     // all
  [0]:   { style: { fontWeight: 'bold' } }  // first only
});
```

### Array distribution — one array value per element

```js
collection.update({
  textContent: ['One', 'Two', 'Three']  // distributed
});
```

---

## Module Requirements Summary

| Feature | Requires |
|---|---|
| `Collections.ClassName / TagName / Name` | `core` |
| `Collections.update()` | `core` |
| `Collections.getMultiple()` / `waitForElements()` | `core` |
| `ClassName` / `TagName` / `Name` global shortcuts | `core` + `enhancers` |
| Index-based updates on shortcuts | `core` + `enhancers` |
| Array distribution updates | `core` + `enhancers` |
| Property shorthands (`.textContent()`, `.style()` etc.) | `core` + `enhancers` |
| `querySelectorAll` / `queryAll` enhanced | `core` + `enhancers` |
| `queryWithin` / `queryAllWithin` | `core` + `enhancers` |
| `document.querySelectorAll` enhanced (native patch) | `core` + `enhancers` + `native-enhance` |
