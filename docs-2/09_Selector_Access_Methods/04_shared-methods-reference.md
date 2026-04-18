[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Shared Methods Reference

## Quick Start (30 Seconds)

```javascript
// Selector results have ALL the same methods as Collections
const buttons = Selector.queryAll('.btn:not(.disabled)');

// Array methods — built-in natively
const enabledBtns = buttons.filter(btn => !btn.disabled);
const labels      = buttons.map(btn => btn.textContent.trim());

// DOM manipulation methods — bulk operations
buttons.addClass('initialized').setStyle({ opacity: '1' }).on('click', handleClick);

// Filtering methods
const visible  = buttons.visible();
const enabled  = buttons.enabled();

// Utility methods
const first  = buttons.first();
const last   = buttons.last();
const second = buttons.at(1);
const empty  = buttons.isEmpty();
```

Whether you get your elements from `Collections.ClassName.btn` or `Selector.queryAll('.btn')`, the methods you can call on the result are **exactly the same**.

---

## What Are Shared Methods?

Both Collections and Selector return **enhanced array-like collections** — objects that behave like arrays but come equipped with additional utility and DOM manipulation methods.

The key insight is this:

> **The method of access (Collections vs Selector) does not affect what you can do with the result.** Both give you the same powerful toolkit.

```javascript
// From Collections — simple class access
const cards = Collections.ClassName.card;

// From Selector — complex selector
const cards = Selector.queryAll('.card:not(.hidden)');

// Both results support the exact same methods:
cards.addClass('highlighted');      // ✅ Works on both
cards.on('click', handleClick);     // ✅ Works on both
cards.filter(c => c.offsetParent);  // ✅ Works on both
cards.first();                      // ✅ Works on both
```

This means you only need to learn the methods once — they apply everywhere.

---

## Why Does This Exist?

### Collections vs Selector — When Each Method of Access Shines

In scenarios where you want simple, clean access to grouped elements, Collections provides the most readable approach:

```javascript
// Simple, clean — great for standard class groups
const cards    = Collections.ClassName.card;
const headers  = Collections.TagName.h2;
const radios   = Collections.Name.theme;
```

This approach is **great when you need:**
✅ Access to all elements of a simple class, tag, or name attribute
✅ Maximum readability and brevity
✅ Proxy-based property access for named groups

### Selector — When CSS Selector Precision Is Your Goal

In scenarios where your query involves conditions, pseudo-classes, or structural selectors, `Selector.queryAll()` provides the most expressive approach:

```javascript
// Complex conditions — great for state-based or structural queries
const activePrimary = Selector.queryAll('.btn.primary:not(.disabled)');
const evenRows      = Selector.queryAll('tr:nth-child(even)');
const formInputs    = Selector.queryAll('input[required]:not([readonly])');
```

**In both cases, the result object is the same.** You choose the helper based on how you want to query — not on what you want to do with the results afterward.

**Benefits of shared methods:**
✅ Learn the API once, use it everywhere
✅ Consistent behavior between Collections and Selector results
✅ Full array-like capabilities without manual `.toArray()` conversion
✅ Bulk DOM operations in one call instead of manual loops

---

## Mental Model

Think of shared methods like a **universal remote control**.

No matter which TV brand you have (Samsung vs LG — or Collections vs Selector), the remote has the same buttons: power, volume, channels. Once you know the remote, you can use it with any TV.

```
Collections.ClassName.card  ──┐
                               │
Selector.queryAll('.card')  ──┤  →  [ Enhanced Collection ]
                               │              │
Selector.Scoped.withinAll(     │         ┌────┴────────────────────────────┐
  container, '.card'        ──┘         │  .forEach()   .addClass()       │
                                        │  .map()       .removeClass()     │
                                        │  .filter()    .toggleClass()     │
                                        │  .find()      .setProperty()     │
                                        │  .some()      .setAttribute()    │
                                        │  .every()     .setStyle()        │
                                        │  .reduce()    .on()              │
                                        │  .toArray()   .off()             │
                                        │  .first()     .visible()         │
                                        │  .last()      .hidden()          │
                                        │  .at()        .enabled()         │
                                        │  .isEmpty()   .disabled()        │
                                        └─────────────────────────────────┘
```

---

## Complete Method Reference

### Array-Like Methods

These methods work exactly like their JavaScript array counterparts.

| Method | What It Does | Returns |
|--------|-------------|---------|
| `forEach(callback)` | Iterate each element | `undefined` |
| `map(callback)` | Transform elements to a new array | `Array` |
| `filter(callback)` | Keep only elements that pass the test | `Array` |
| `find(callback)` | First element that passes the test | `Element` or `undefined` |
| `findIndex(callback)` | Index of first element that passes the test | `number` (-1 if not found) |
| `some(callback)` | Test if at least one element passes | `boolean` |
| `every(callback)` | Test if all elements pass | `boolean` |
| `reduce(callback, initial)` | Accumulate values across elements | `any` |
| `toArray()` | Convert collection to a plain array | `Array` |

> **Note:** `map()`, `filter()`, `find()`, and `reduce()` return plain JavaScript arrays or values — **not** enhanced collections. If you need to chain DOM methods after filtering, use `.forEach()` or loop the result yourself.

---

### DOM Manipulation Methods

These methods apply changes to **all elements in the collection** at once. They all **return the collection itself**, so you can chain them.

| Method | What It Does |
|--------|-------------|
| `addClass(className)` | Add a CSS class to all elements |
| `removeClass(className)` | Remove a CSS class from all elements |
| `toggleClass(className)` | Toggle a CSS class on all elements |
| `setProperty(property, value)` | Set a JavaScript property on all elements |
| `setAttribute(attr, value)` | Set an HTML attribute on all elements |
| `setStyle(stylesObject)` | Apply inline styles to all elements |
| `on(event, handler, options?)` | Attach an event listener to all elements |
| `off(event, handler?, options?)` | Remove an event listener from all elements |

---

### Filtering Methods

These methods filter the collection by a DOM state condition. They return **plain arrays** (not enhanced collections).

| Method | What It Filters For |
|--------|---------------------|
| `visible()` | Elements that are currently visible |
| `hidden()` | Elements that are currently hidden |
| `enabled()` | Form elements that are not disabled |
| `disabled()` | Form elements that are disabled |

> **Important:** Because `visible()`, `hidden()`, `enabled()`, and `disabled()` return plain arrays, you cannot call `.addClass()` or other collection methods directly on their result. Use `.forEach()` on the result instead.

---

### Utility Methods

| Method | What It Does | Returns |
|--------|-------------|---------|
| `first()` | Get the first element | `Element` or `undefined` |
| `last()` | Get the last element | `Element` or `undefined` |
| `at(index)` | Get element at index (negative supported) | `Element` or `undefined` |
| `isEmpty()` | Check if the collection has no elements | `boolean` |
| `item(index)` | Get element by numeric index (legacy) | `Element` or `null` |
| `namedItem(name)` | Get element by `name` attribute | `Element` or `null` |

---

## The One Unique Addition: `within(selector)`

Selector results have **one additional filtering method** that Collections results do not:

### `collection.within(selector)`

Filter the collection to only include elements that are **descendants of elements matching the given selector**.

```javascript
// Get all buttons on the page
const buttons = Selector.queryAll('.btn');

// Filter to only buttons inside visible cards
const cardButtons = buttons.within('.card:not(.hidden)');

console.log(`${cardButtons.length} buttons are inside visible cards`);
```

**Another example:**

```javascript
// Get all form inputs
const inputs = Selector.queryAll('input');

// Keep only inputs inside non-hidden forms
const activeFormInputs = inputs.within('form:not(.hidden)');

// Validate only those
activeFormInputs.forEach(input => {
  if (!input.value.trim() && input.required) {
    input.classList.add('error');
  }
});
```

**Use case:** This is especially useful when you've queried a broad set of elements and want to narrow down to those within a certain context, without having to write a more complex selector upfront.

---

## Detailed Usage Examples

### Array-Like Methods

#### `forEach()` — Iterate Each Element

```javascript
const buttons = Selector.queryAll('.btn');

buttons.forEach((btn, index) => {
  console.log(`Button ${index}:`, btn.textContent.trim());
  btn.dataset.index = index;
});
```

#### `map()` — Transform to a New Array

```javascript
const inputs = Selector.queryAll('input[name]');

// Build a list of all input names
const names = inputs.map(input => input.name);
console.log(names);  // ['username', 'email', 'password']

// Build objects from elements
const data = inputs.map(input => ({
  name:  input.name,
  value: input.value,
  valid: input.validity.valid
}));
```

#### `filter()` — Keep Only Matching Elements

```javascript
const cards = Selector.queryAll('.card');

// Filter to only featured cards
const featured = cards.filter(card => card.dataset.featured === 'true');

// Process the filtered plain array
featured.forEach(card => card.classList.add('highlighted'));

// Count enabled buttons
const buttons = Selector.queryAll('.btn');
const enabledCount = buttons.filter(btn => !btn.disabled).length;
console.log(`${enabledCount} buttons are enabled`);
```

#### `find()` and `findIndex()`

```javascript
const items = Selector.queryAll('.list-item');

// Find the first selected item
const selected = items.find(item => item.classList.contains('selected'));
if (selected) {
  console.log('Selected item:', selected.textContent);
}

// Find its position
const selectedIndex = items.findIndex(item => item.classList.contains('selected'));
console.log(`Selected at index ${selectedIndex}`);  // e.g., 2
```

#### `some()` and `every()`

```javascript
const checkboxes = Selector.queryAll('input[type="checkbox"]');

// Check if any are checked
const anyChecked = checkboxes.some(cb => cb.checked);
console.log('Any checked:', anyChecked);  // true or false

// Check if all are checked
const allChecked = checkboxes.every(cb => cb.checked);
console.log('All checked:', allChecked);  // true or false

// Practical: submit only if all required fields are filled
const required = Selector.queryAll('input[required]');
const allFilled = required.every(input => input.value.trim() !== '');

if (!allFilled) {
  console.warn('Some required fields are empty');
}
```

#### `reduce()` — Accumulate Values

```javascript
// Sum all numeric inputs
const numbers = Selector.queryAll('input[type="number"]');
const total = numbers.reduce((sum, input) => sum + parseFloat(input.value || 0), 0);
console.log('Total:', total);

// Collect all checked checkbox values into an array
const checkboxes = Selector.queryAll('input[type="checkbox"]:checked');
const selectedValues = checkboxes.reduce((arr, cb) => {
  arr.push(cb.value);
  return arr;
}, []);
console.log('Selected:', selectedValues);
```

#### `toArray()` — Convert to Plain Array

```javascript
const items = Selector.queryAll('.item');

// Convert when you need a plain array for external APIs
const plainItems = items.toArray();

// Use with spread
const [first, second, ...rest] = items.toArray();

// Pass to functions expecting arrays
processArray(items.toArray());
```

---

### DOM Manipulation Methods

#### `addClass()`, `removeClass()`, `toggleClass()`

```javascript
const cards = Selector.queryAll('.card');

// Add to all
cards.addClass('highlighted');

// Remove from all
cards.removeClass('loading');

// Toggle on all (on→off or off→on for each)
cards.toggleClass('selected');
```

#### `setProperty()` — JavaScript Property Values

```javascript
const inputs = Selector.queryAll('input');

// Disable all inputs
inputs.setProperty('disabled', true);

// Set values
inputs.setProperty('value', '');

// Note: use setProperty for JS properties (disabled, value, checked, tabIndex)
// Use setAttribute for HTML attributes (data-*, aria-*, role)
```

#### `setAttribute()` — HTML Attributes

```javascript
const buttons = Selector.queryAll('button');

// Set ARIA attributes
buttons.setAttribute('aria-pressed', 'false');

// Set data attributes
buttons.setAttribute('data-initialized', 'true');

// Set role
buttons.setAttribute('role', 'button');
```

#### `setStyle()` — Apply Inline Styles

```javascript
const cards = Selector.queryAll('.card');

// Apply multiple styles at once
cards.setStyle({
  opacity: '1',
  transform: 'translateY(0)',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
});
```

#### `on()` and `off()` — Event Listeners

```javascript
const buttons = Selector.queryAll('.btn');

// Add event listeners to all
buttons.on('click', handleClick);
buttons.on('mouseenter', handleHover, { passive: true });

// Remove event listeners from all
buttons.off('click', handleClick);
buttons.off('mouseenter');  // Remove all mouseenter handlers
```

---

### Filtering Methods

#### `visible()` and `hidden()`

```javascript
const panels = Selector.queryAll('.panel');

// Get only visible panels
const visible = panels.visible();
console.log(`${visible.length} panels are visible`);

// Get only hidden panels
const hidden = panels.hidden();
console.log(`${hidden.length} panels are hidden`);

// Process the filtered arrays
visible.forEach(panel => panel.classList.add('in-view'));

// ⚠️ visible() returns a plain array — not an enhanced collection
// ❌ This won't work: panels.visible().addClass('in-view')
// ✅ Do this instead:
panels.visible().forEach(panel => panel.classList.add('in-view'));
```

#### `enabled()` and `disabled()`

```javascript
const inputs = Selector.queryAll('input, button, select');

// Filter to only enabled form elements
const enabled = inputs.enabled();
console.log(`${enabled.length} inputs are enabled`);

// Filter to only disabled form elements
const disabled = inputs.disabled();
console.log(`${disabled.length} inputs are disabled`);

// Process
enabled.forEach(input => input.classList.add('active'));
disabled.forEach(input => input.setAttribute('aria-disabled', 'true'));
```

---

### Utility Methods

#### `first()`, `last()`, `at()`

```javascript
const items = Selector.queryAll('.menu-item');

const firstItem = items.first();   // First element
const lastItem  = items.last();    // Last element
const thirdItem = items.at(2);     // Third (index 2)
const penultimate = items.at(-2);  // Second from last (negative index)

// Always safe — returns undefined if index is out of range
const outOfRange = items.at(999);
console.log(outOfRange);  // undefined (no error)
```

#### `isEmpty()`

```javascript
const results = Selector.queryAll('.search-result');

if (results.isEmpty()) {
  // No results found
  Elements.emptyState.classList.remove('hidden');
  Elements.resultsList.classList.add('hidden');
} else {
  // Results available
  Elements.emptyState.classList.add('hidden');
  Elements.resultsList.classList.remove('hidden');
  console.log(`Showing ${results.length} results`);
}
```

---

## Chaining DOM Methods

DOM manipulation methods all return the collection, so you can chain multiple operations:

```javascript
Selector.queryAll('.notification')
  .addClass('visible')
  .setAttribute('aria-live', 'polite')
  .setStyle({ opacity: '1', transform: 'translateX(0)' })
  .on('click', dismissNotification);
```

```javascript
// Setup form fields in one chain
Selector.queryAll('input[required]')
  .removeClass('error')
  .removeAttribute?.('aria-invalid')
  .setStyle({ borderColor: '' });
// Note: addClass/setStyle/on/off are chainable; filter methods are not
```

---

## Combining Methods Together

```javascript
const cards = Selector.queryAll('.product-card');

// Step 1: Filter to only featured, visible cards (plain array)
const featured = cards.filter(card =>
  card.dataset.featured === 'true' &&
  card.offsetParent !== null
);

// Step 2: Iterate with forEach and use per-card scoped queries
featured.forEach((card, index) => {
  const title = Selector.Scoped.within(card, '.card-title');
  const price = Selector.Scoped.within(card, '.card-price');
  const btn   = Selector.Scoped.within(card, '.btn.buy');

  if (title) title.dataset.rank = index + 1;
  if (btn)   btn.addEventListener('click', () => addToCart(card.dataset.id));
});

// Step 3: Bulk DOM ops on the entire collection
cards
  .setAttribute('data-initialized', 'true')
  .on('mouseenter', highlightCard)
  .on('mouseleave', unhighlightCard);
```

---

## When to Use Each Helper

The shared methods are identical — your choice of helper depends on **how** you want to access elements:

```javascript
// Use Collections when selector is simple (class/tag/name)
const cards = Collections.ClassName.card;
cards.addClass('loaded');  // Same methods available

// Use Selector when selector is complex or conditional
const activeCards = Selector.queryAll('.card.active:not(.hidden)');
activeCards.addClass('loaded');  // Same methods available
```

**Summary table:**

| Scenario | Helper to Use |
|----------|--------------|
| By unique ID | `Elements.id` |
| All elements with a class | `Collections.ClassName.name` |
| All elements of a tag type | `Collections.TagName.tag` |
| Elements with a name attribute | `Collections.Name.name` |
| Complex CSS selector | `Selector.queryAll(selector)` |
| Single element, complex selector | `Selector.query(selector)` |
| Elements within a container | `Selector.Scoped.withinAll(container, selector)` |

In all cases after access, the same shared methods apply.

---

## Key Takeaways

1. **Collections and Selector results share all methods** — array-like, DOM manipulation, filtering, and utility methods work identically on both.

2. **Array methods** (`forEach`, `map`, `filter`, etc.) are available natively — no `.toArray()` required for iteration.

3. **`map()`, `filter()`, `find()` return plain arrays** — not enhanced collections. Use `forEach` if you need to call DOM methods afterward.

4. **DOM methods are chainable** — `addClass`, `removeClass`, `setStyle`, `on`, `off`, etc. all return the collection for chaining.

5. **Filtering methods return plain arrays** — `visible()`, `hidden()`, `enabled()`, `disabled()` return regular arrays. Call `.forEach()` on them, not collection methods.

6. **`within(selector)` is unique to Selector** — this extra filtering method is not available on Collections results.

7. **Choose by access pattern** — use the helper that best matches how you're finding elements, not by what you plan to do with the result.