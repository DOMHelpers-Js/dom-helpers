[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# The `createElement.bulk()` Result Object

## Quick Start (30 seconds)

```javascript
const elements = createElement.bulk({
  H1:     { textContent: 'Title' },
  P:      { textContent: 'Description' },
  BUTTON: { textContent: 'Click Me' }
});

// Direct element access
elements.H1      // → <h1>Title</h1>
elements.P       // → <p>Description</p>
elements.BUTTON  // → <button>Click Me</button>

// Helper methods
elements.all                              // → [h1, p, button]
elements.count                            // → 3
elements.keys                             // → ['H1', 'P', 'BUTTON']
elements.appendTo(document.body)          // Append all to body
elements.forEach((el, key) => {           // Iterate over all
  console.log(key, el);
});
```

---

## What is the Result Object?

When you call `createElement.bulk()`, it does not just give you back a plain object of elements. It gives you an **enhanced result object** — an object that contains your elements as named properties, plus a set of helpful methods for working with the collection.

Think of the result object as a **smart container** for your elements. It gives you:
1. Direct access to each element by its key name
2. Helper methods for appending, iterating, filtering, and updating elements

Understanding the result object deeply means understanding how to get the most out of the `createElement.bulk()` system.

---

## Direct Element Access

The most fundamental feature: each element is available by its key name as a direct property on the result object.

```javascript
const elements = createElement.bulk({
  HEADER:       { className: 'header' },
  MAIN_CONTENT: { className: 'main-content' },
  FOOTER:       { className: 'footer' }
});

// Access directly
const header  = elements.HEADER;
const main    = elements.MAIN_CONTENT;
const footer  = elements.FOOTER;

// Or use inline
elements.HEADER.style.background = '#333';
elements.FOOTER.textContent = '© 2025';
```

---

## The `.all` Property

Returns all created elements as an array, in **creation order** (the order they appear in your config object).

```javascript
const elements = createElement.bulk({
  H1:     { textContent: 'Title' },
  P:      { textContent: 'Intro' },
  BUTTON: { textContent: 'Action' }
});

const allElements = elements.all;
// → [<h1>, <p>, <button>]

// Spread into append — append all elements at once
document.body.append(...elements.all);

// Or use with forEach
elements.all.forEach(el => el.classList.add('fade-in'));
```

**When to use `.all`:** When you want all elements in creation order and plan to iterate or spread them.

---

## The `.count` Property

Returns the total number of elements created.

```javascript
const elements = createElement.bulk({
  DIV_1: {},
  DIV_2: {},
  DIV_3: {}
});

console.log(elements.count); // 3

// Useful for conditional logic
if (elements.count > 0) {
  elements.appendTo(Elements.container);
}
```

---

## The `.keys` Property

Returns an array of all key names.

```javascript
const elements = createElement.bulk({
  HEADER: {},
  BODY:   {},
  FOOTER: {}
});

console.log(elements.keys); // ['HEADER', 'BODY', 'FOOTER']

// Useful for programmatic access
elements.keys.forEach(key => {
  console.log(`Key: ${key}, Element: ${elements[key].tagName}`);
});
// "Key: HEADER, Element: DIV"
// "Key: BODY, Element: DIV"
// "Key: FOOTER, Element: DIV"
```

---

## The `.has(key)` Method

Checks whether an element with the given key exists in the result.

**Returns:** `true` or `false`

```javascript
const elements = createElement.bulk({
  BUTTON: { textContent: 'Click' }
});

console.log(elements.has('BUTTON'));  // true
console.log(elements.has('INPUT'));   // false

// Safe access pattern
if (elements.has('MODAL')) {
  elements.MODAL.style.display = 'flex';
}
```

**When to use `.has()`:** When you build the config object conditionally and are not certain which keys will be present.

```javascript
function buildNotification(type, icon) {
  const config = {
    CONTAINER: { className: 'notification' },
    TEXT: { textContent: message }
  };

  // Icon is optional
  if (icon) {
    config.ICON = { textContent: icon, className: 'notification__icon' };
  }

  const elements = createElement.bulk(config);

  if (elements.has('ICON')) {
    elements.CONTAINER.prepend(elements.ICON);
  }
  elements.CONTAINER.appendChild(elements.TEXT);

  return elements.CONTAINER;
}
```

---

## The `.get(key, fallback)` Method

Gets an element by key. If the key does not exist, returns the fallback value (default: `null`).

**Parameters:**
- `key` — the element key (string)
- `fallback` — value to return if not found (optional, default `null`)

```javascript
const elements = createElement.bulk({
  DIV: { className: 'wrapper' }
});

const div  = elements.get('DIV');              // Returns the div element
const span = elements.get('SPAN', null);       // Returns null (not found)
const missing = elements.get('P', 'N/A');      // Returns 'N/A'

// Null-safe usage
const icon = elements.get('ICON');
if (icon) {
  icon.textContent = '🔔';
}
```

---

## The `.appendTo(container)` Method

Appends **all elements** to a container, in creation order.

**Parameters:**
- `container` — a DOM element, or a CSS selector string

**Returns:** the result object (for chaining)

```javascript
const elements = createElement.bulk({
  H1:     { textContent: 'Heading' },
  P:      { textContent: 'Paragraph' },
  BUTTON: { textContent: 'Action' }
});

// Append to a DOM element reference
elements.appendTo(document.body);

// Append using a CSS selector
elements.appendTo('#my-container');

// Append to an Elements helper reference
elements.appendTo(Elements.mainContent);
```

**What it does internally:**
```
For each element in creation order:
  container.appendChild(element)
```

---

## The `.appendToOrdered(container, ...keys)` Method

Appends **specific elements** to a container, in the order you specify.

**Parameters:**
- `container` — a DOM element or CSS selector
- `...keys` — element keys in the desired append order

**Returns:** the result object (for chaining)

```javascript
const elements = createElement.bulk({
  FOOTER: { textContent: 'Footer' },
  HEADER: { textContent: 'Header' },
  MAIN:   { textContent: 'Main' }
});

// Append in logical document order — regardless of creation order
elements.appendToOrdered(document.body, 'HEADER', 'MAIN', 'FOOTER');
// Result: Header appears first, Main second, Footer third

// Append only specific elements — omit the rest
const tabs = createElement.bulk({
  TAB_home:     { textContent: 'Home' },
  TAB_about:    { textContent: 'About' },
  TAB_services: { textContent: 'Services' },
  TAB_contact:  { textContent: 'Contact' }
});

// Only append home and about for now
tabs.appendToOrdered(Elements.navBar, 'TAB_home', 'TAB_about');
```

---

## The `.toArray(...keys)` Method

Returns a selection of elements as a plain array.

**Parameters:**
- `...keys` — element keys to include (optional; if none provided, returns all)

**Returns:** Array of elements

```javascript
const elements = createElement.bulk({
  H1:     {},
  P:      {},
  DIV:    {},
  BUTTON: {}
});

// Get all elements as an array
const all = elements.toArray();
// → [h1, p, div, button]

// Get specific elements
const subset = elements.toArray('H1', 'P');
// → [h1, p]

// Spread into container.append()
container.append(...elements.toArray('H1', 'P', 'BUTTON'));
```

---

## The `.ordered(...keys)` Method

Returns elements in a **custom order** as an array. This is an alias for `.toArray()` but the name communicates intent more clearly when order matters.

```javascript
const sections = createElement.bulk({
  SIDEBAR: { className: 'sidebar' },
  HEADER:  { className: 'header' },
  MAIN:    { className: 'main' }
});

// Creation order: SIDEBAR, HEADER, MAIN
// Desired page order: HEADER, MAIN, SIDEBAR

const pageOrder = sections.ordered('HEADER', 'MAIN', 'SIDEBAR');
document.body.append(...pageOrder);
// Result: header appears first, then main, then sidebar
```

---

## The `.forEach(callback)` Method

Iterates over all elements in creation order, calling your callback for each one.

**Parameters:**
- `callback(element, key, index)` — function called for each element
  - `element` — the DOM element
  - `key` — the element's key string
  - `index` — the iteration index (0-based)

```javascript
const elements = createElement.bulk({
  CARD_1: { className: 'card' },
  CARD_2: { className: 'card' },
  CARD_3: { className: 'card' }
});

// Iterate and configure each element
elements.forEach((element, key, index) => {
  element.dataset.index = String(index);
  element.textContent = `Card ${index + 1}`;
  console.log(`Processed: ${key}`);
});
// Logs: "Processed: CARD_1", "Processed: CARD_2", "Processed: CARD_3"
```

---

## The `.map(callback)` Method

Like `Array.prototype.map()` — iterates over all elements and returns a new array with the return values.

**Parameters:**
- `callback(element, key, index)` — function to call for each element

**Returns:** Array of return values

```javascript
const elements = createElement.bulk({
  LI_1: { textContent: 'Apple' },
  LI_2: { textContent: 'Banana' },
  LI_3: { textContent: 'Cherry' }
});

// Map to extract text content
const labels = elements.map(element => element.textContent);
console.log(labels); // ['Apple', 'Banana', 'Cherry']

// Map to create wrapper elements
const wrappedElements = elements.map((element, key) => {
  const wrapper = createElement('div', { className: 'wrapper' });
  wrapper.appendChild(element);
  return wrapper;
});
```

---

## The `.filter(callback)` Method

Like `Array.prototype.filter()` — returns only elements for which your callback returns `true`.

**Parameters:**
- `callback(element, key, index)` — function returning true/false

**Returns:** Array of matching elements

```javascript
const elements = createElement.bulk({
  BTN_1: { textContent: 'Active',   classList: { add: ['active'] } },
  BTN_2: { textContent: 'Inactive', classList: {} },
  BTN_3: { textContent: 'Active',   classList: { add: ['active'] } },
  BTN_4: { textContent: 'Inactive', classList: {} }
});

// Get only active buttons
const activeButtons = elements.filter(element => {
  return element.classList.contains('active');
});

console.log(activeButtons.length); // 2

// Append only active buttons
activeButtons.forEach(btn => Elements.toolbar.appendChild(btn));
```

---

## The `.updateMultiple(updates)` Method

Updates multiple elements at once using the `.update()` method on each.

**Parameters:**
- `updates` — an object where each key is an element key and each value is an update config

**Returns:** the result object (for chaining)

```javascript
const elements = createElement.bulk({
  TITLE:    { textContent: 'Loading...' },
  SUBTITLE: { textContent: 'Please wait' },
  PROGRESS: { style: { width: '0%' } },
  BUTTON:   { textContent: 'Start', disabled: false }
});

elements.appendTo(document.body);

// Update multiple elements at once
function setLoadingState() {
  elements.updateMultiple({
    TITLE:    { textContent: 'Processing...' },
    SUBTITLE: { textContent: 'This may take a moment' },
    PROGRESS: { style: { width: '50%', background: '#007bff' } },
    BUTTON:   { disabled: true, textContent: 'Working...' }
  });
}

function setCompleteState() {
  elements.updateMultiple({
    TITLE:    { textContent: 'Complete!' },
    SUBTITLE: { textContent: 'All done.' },
    PROGRESS: { style: { width: '100%', background: '#28a745' } },
    BUTTON:   { disabled: false, textContent: 'Done' }
  });
}
```

---

## Chaining Methods

Several methods return the result object, so you can chain them:

```javascript
const elements = createElement.bulk({
  H1:     { textContent: 'Header' },
  P:      { textContent: 'Body' },
  BUTTON: { textContent: 'Action' }
});

// Chain: update multiple, then append all
elements
  .updateMultiple({
    H1:     { style: { color: '#007bff' } },
    BUTTON: { classList: { add: ['btn-lg'] } }
  })
  .appendTo(document.body);
```

---

## Complete API Reference

| Property / Method | Description | Returns |
|-------------------|-------------|---------|
| `elements.KEY` | Direct element access | DOM Element |
| `elements.all` | All elements as array (creation order) | Array |
| `elements.count` | Number of elements | Number |
| `elements.keys` | Array of all key names | Array of strings |
| `elements.has(key)` | Check if key exists | Boolean |
| `elements.get(key, fallback)` | Get element or fallback | Element or fallback |
| `elements.appendTo(container)` | Append all to container | Result object |
| `elements.appendToOrdered(container, ...keys)` | Append specific elements in order | Result object |
| `elements.toArray(...keys)` | Get elements as array | Array |
| `elements.ordered(...keys)` | Get elements in custom order | Array |
| `elements.forEach(callback)` | Iterate over all elements | undefined |
| `elements.map(callback)` | Map over all elements | Array |
| `elements.filter(callback)` | Filter elements by condition | Array |
| `elements.updateMultiple(updates)` | Update multiple elements at once | Result object |

---

## Practical Example: Putting It All Together

```javascript
function buildProductGrid(products) {
  // Create the grid container
  const grid = createElement('div', {
    className: 'product-grid',
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px'
    }
  });

  // Create all product elements at once using a loop
  const definitions = {};
  products.forEach((product, i) => {
    definitions[`CARD_${i + 1}`] = {
      className: 'product-card',
      innerHTML: `
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <p class="stock">${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
      `,
      dataset: { productId: product.id },
      style: {
        background: 'white',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }
    };
  });

  const elements = createElement.bulk(definitions);

  // Filter to in-stock items only if needed
  const inStockCards = elements.filter((element) => {
    const idx = parseInt(element.dataset.productId) - 1;
    return products[idx]?.inStock;
  });

  // Add click handlers to each card
  elements.forEach((element, key) => {
    const match = key.match(/CARD_(\d+)/);
    if (match) {
      const product = products[parseInt(match[1]) - 1];
      element.addEventListener('click', () => openProductPage(product.id));
    }
  });

  // Append all to grid
  elements.appendTo(grid);

  return grid;
}
```

---

## Summary

The `createElement.bulk()` result object is the hub of the bulk creation system. Understanding its methods gives you complete control over your created elements.

**The most-used properties and methods:**
- `elements.KEY` — direct access to any element by key
- `elements.all` — all elements as an array
- `elements.appendTo()` — append all elements to a container
- `elements.appendToOrdered()` — append in custom order
- `elements.forEach()` — iterate over all elements
- `elements.updateMultiple()` — update several elements at once

---

## What's Next?

- **[12 — Append Methods](./12_append-methods.md)** — Every way to add elements to the DOM
- **[13 — Additional Patterns](./13_additional-patterns.md)** — Methods 5, 6, 7, 10, and 12