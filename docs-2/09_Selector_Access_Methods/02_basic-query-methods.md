[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Basic Query Methods — `query()` and `queryAll()`

## Quick Start (30 Seconds)

```javascript
// Get ONE element — like querySelector, but cached
const modal = Selector.query('.modal.visible');

// Get MANY elements — like querySelectorAll, but array-ready
const buttons = Selector.queryAll('.btn:not(.disabled)');

// Results have built-in methods — no conversion needed
buttons.addClass('ready').on('click', handleClick);

// Always check query() for null
if (modal) {
  modal.classList.add('active');
}
```

Two methods. All the CSS selector power you know. Plus caching, array methods, and DOM helpers built right in.

---

## What Are `query()` and `queryAll()`?

`Selector.query()` and `Selector.queryAll()` are the two primary methods for finding elements in the DOM using CSS selectors. They work exactly like `document.querySelector` and `document.querySelectorAll` — but with three significant enhancements:

1. **Automatic caching** — results are stored after the first call and returned instantly on repeat calls
2. **Array-like results** — `queryAll()` returns an enhanced collection that supports `forEach`, `map`, `filter`, and all standard array methods natively
3. **Built-in DOM methods** — both results have `addClass`, `on`, `setStyle`, and other manipulation tools available directly

Think of it as upgrading the browser's built-in `querySelector` from a basic tool into a full-featured, intelligent querying system.

---

## Syntax

### `Selector.query()`

```javascript
Selector.query(selector)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `selector` | `string` | Any valid CSS selector |

**Returns:** The first matching `Element`, or `null` if nothing matches.

---

### `Selector.queryAll()`

```javascript
Selector.queryAll(selector)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `selector` | `string` | Any valid CSS selector |

**Returns:** An **enhanced collection** — array-like object with all array methods and DOM manipulation methods built in. Returns an empty collection (length 0) if nothing matches.

---

## Why Does This Exist?

### `query()` — When Precision Over a Single Target Is Your Priority

In scenarios where you're targeting one specific element with a complex selector, `Selector.query()` provides the most direct, cached approach:

```javascript
// Target the primary action button inside a visible modal
const confirmBtn = Selector.query('.modal.visible .footer .btn.primary');

// Target the first invalid input in a form
const firstError = Selector.query('input:invalid, textarea:invalid');

// Target a specific state-based element
const loadingSpinner = Selector.query('[data-state="loading"] .spinner');
```

This approach is **great when you need:**
✅ A single, specific element with a multi-condition selector
✅ The result to be cached automatically for repeated access
✅ The ability to use optional chaining without conversion

### `queryAll()` — When Working with Multiple Matched Elements

In scenarios where you need to find and work with a group of elements that share complex conditions, `queryAll()` gives you the enhanced result collection directly:

```javascript
// All enabled, visible form inputs
const activeInputs = Selector.queryAll('input:not([disabled]):not([readonly])');

// All odd-numbered rows in a table
const oddRows = Selector.queryAll('table tbody tr:nth-child(odd)');

// All cards that are not hidden and have a specific data tag
const featured = Selector.queryAll('.card:not(.hidden)[data-featured="true"]');
```

**This method is especially useful when:**
✅ You need to iterate, transform, or filter the result set
✅ You want to apply bulk DOM updates to all matched elements
✅ You need a static snapshot of the current matching elements
✅ You want the result cached for fast repeat access

**The Choice Is Yours:**
- Use `query()` when you need exactly one element from a complex selector
- Use `queryAll()` when you need a group of elements to iterate or bulk-update
- Both methods cache results and return enhanced objects

**Benefits of both:**
✅ Full CSS selector support (pseudo-classes, attributes, combinators)
✅ Results cached automatically after first query
✅ No NodeList-to-array conversion needed
✅ Enhanced methods available directly on the result

---

## Mental Model

### `query()` is a Smart Spotlight

`query()` is like shining a spotlight on a stage — it finds and highlights the **first** matching performer, then remembers who it was so you don't have to look again.

### `queryAll()` is a Smart Casting Net

`queryAll()` is like casting a net that captures **all** matching performers at once — then hands you a toolkit to work with all of them at the same time (apply a class, attach events, read their values).

```
Selector.query('.btn.active')          Selector.queryAll('.btn')
         │                                      │
         ▼                                      ▼
  [ First Match ]                    [ All Matches Collection ]
         │                                      │
   element or null              forEach / map / filter / addClass / on
```

---

## How Does It Work?

Both methods use the same internal caching mechanism:

```
Call Selector.query(selector) or Selector.queryAll(selector)
                     │
                     ▼
         Check cache map: Is selector already cached?
                     │
          ┌──────────┴──────────┐
          │                     │
       YES (hit)             NO (miss)
          │                     │
          ▼                     ▼
   Return cached result    Run document.querySelector(All)(selector)
                                 │
                                 ▼
                          Wrap result in enhanced object
                          (adds array + DOM + utility methods)
                                 │
                                 ▼
                          Store in cache map (keyed by selector)
                                 │
                                 ▼
                          Return enhanced result
```

**Cache invalidation** happens automatically via a `MutationObserver` watching the DOM. When elements are added or removed in ways that affect a cached selector, the cache entry for that selector is cleared and rebuilt on the next access.

---

## Deep Dive: `Selector.query()`

### Basic Examples

```javascript
// Simple class selector
const button = Selector.query('.btn');

// Multiple classes (all must match)
const activeBtn = Selector.query('.btn.primary.active');

// Pseudo-class selectors
const firstCard = Selector.query('.card:first-child');
const lastItem  = Selector.query('.menu-item:last-child');

// Attribute selectors
const emailInput   = Selector.query('input[type="email"]');
const withDataId   = Selector.query('[data-id="user-123"]');

// Complex combinators
const nestedButton = Selector.query('.container > .row .btn');
```

---

### Handling `null` Results

`query()` returns `null` when no element matches. **Always check before using the result.**

```javascript
// ❌ Incorrect — will throw if element doesn't exist
Selector.query('.submit-btn').classList.add('active');  // TypeError if null!

// ✅ Correct — check first
const submitBtn = Selector.query('.submit-btn');
if (submitBtn) {
  submitBtn.classList.add('active');
}

// ✅ Also correct — optional chaining for one-liners
Selector.query('.submit-btn')?.classList.add('active');

// ✅ With a fallback
const btn = Selector.query('.primary-btn') ?? Selector.query('.secondary-btn');
if (btn) {
  btn.disabled = false;
}
```

---

### Real-World Examples

#### Example 1: Find and Update an Active Element

```javascript
// Find the currently active tab
const activeTab = Selector.query('.tab.active');

if (activeTab) {
  // Deactivate it
  activeTab.classList.remove('active');
  activeTab.setAttribute('aria-selected', 'false');

  // Show which tab was deactivated
  console.log('Deactivated tab:', activeTab.textContent.trim());
}
```

#### Example 2: Focus the First Invalid Input

```javascript
function focusFirstError() {
  // Target the first invalid field in the form
  const firstInvalid = Selector.query('input:invalid, textarea:invalid, select:invalid');

  if (firstInvalid) {
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid.classList.add('error-highlight');
    return false; // Validation failed
  }

  return true; // Validation passed
}
```

#### Example 3: Access a Component's Primary Action

```javascript
function openModal(modalElement) {
  modalElement.classList.add('visible');

  // Find the modal's primary confirm button
  const confirmBtn = Selector.query('.modal.visible .btn.confirm');

  if (confirmBtn) {
    confirmBtn.disabled = false;
    confirmBtn.focus();
  }
}
```

#### Example 4: Conditional State Targeting

```javascript
// Get the loading overlay only if it's currently visible
const loader = Selector.query('.loader:not(.hidden)');

if (loader) {
  // It's currently shown — hide it
  loader.classList.add('hidden');
  loader.setAttribute('aria-hidden', 'true');
} else {
  console.log('Loader is not currently visible');
}
```

---

## Deep Dive: `Selector.queryAll()`

### Basic Examples

```javascript
// All elements with a class
const buttons = Selector.queryAll('.btn');

// Multiple class conditions
const primaryBtns = Selector.queryAll('.btn.primary');

// Pseudo-class selectors
const oddItems   = Selector.queryAll('.item:nth-child(odd)');
const evenRows   = Selector.queryAll('tr:nth-child(even)');
const lastCards  = Selector.queryAll('.card:last-child');

// Attribute selectors
const required   = Selector.queryAll('input[required]');
const checked    = Selector.queryAll('input[type="checkbox"]:checked');

// Complex combined selectors
const complex = Selector.queryAll('.card:not(.hidden)[data-category="new"] .btn.primary');
```

---

### Using Array Methods on Results

```javascript
const buttons = Selector.queryAll('.btn');

// Iterate all
buttons.forEach((btn, index) => {
  console.log(`Button ${index}: ${btn.textContent}`);
});

// Transform to a new array
const labels = buttons.map(btn => btn.textContent.trim());
console.log(labels);  // ['Submit', 'Cancel', 'Reset']

// Filter by condition
const enabled = buttons.filter(btn => !btn.disabled);
console.log(`${enabled.length} of ${buttons.length} buttons are enabled`);

// Find the first matching
const submitBtn = buttons.find(btn => btn.type === 'submit');

// Check if any match
const hasLoading = buttons.some(btn => btn.classList.contains('loading'));

// Check if all match
const allEnabled = buttons.every(btn => !btn.disabled);

// Accumulate a value
const totalWidth = buttons.reduce((sum, btn) => {
  return sum + btn.offsetWidth;
}, 0);
console.log(`Total button width: ${totalWidth}px`);

// Convert to a plain array (for use with APIs that expect arrays)
const plainArray = buttons.toArray();
```

---

### Using DOM Methods on Results

```javascript
const cards = Selector.queryAll('.card:not(.hidden)');

// Class manipulation — all cards at once
cards.addClass('highlighted');
cards.removeClass('loading');
cards.toggleClass('selected');

// Properties — set on all elements
cards.setProperty('hidden', false);
cards.setProperty('tabIndex', 0);

// Attributes — set on all elements
cards.setAttribute('aria-expanded', 'false');
cards.setAttribute('data-initialized', 'true');

// Styles — set on all elements
cards.setStyle({
  opacity: '1',
  transform: 'translateY(0)',
  transition: 'all 0.3s ease'
});

// Events — bind to all elements
cards.on('click', handleCardClick);
cards.on('mouseenter', handleHover);
cards.on('mouseleave', handleHoverEnd);

// Chain it all together
cards
  .addClass('ready')
  .setAttribute('data-initialized', 'true')
  .setStyle({ opacity: '1' })
  .on('click', handleCardClick);
```

---

### Handling Empty Results

```javascript
const items = Selector.queryAll('.item');

// isEmpty() is the cleanest check
if (items.isEmpty()) {
  console.log('No items found');
  showEmptyState();
  return;
}

// Process normally
console.log(`Processing ${items.length} items`);
items.forEach(item => processItem(item));
```

---

### Real-World Examples

#### Example 1: Bulk Form Reset

```javascript
function resetForm(formId) {
  const form = Elements[formId];

  // Get all inputs, selects, and textareas in the form
  const fields = Selector.queryAll(`#${formId} input, #${formId} select, #${formId} textarea`);

  fields.forEach(field => {
    if (field.type === 'checkbox' || field.type === 'radio') {
      field.checked = false;
    } else {
      field.value = '';
    }
    field.classList.remove('error', 'success', 'dirty');
  });

  console.log(`Reset ${fields.length} fields`);
}
```

#### Example 2: Collect Form Data

```javascript
function collectFormData() {
  // Get all named form inputs with values
  const inputs = Selector.queryAll('input[name], select[name], textarea[name]');

  const data = {};
  inputs.forEach(input => {
    if (input.type === 'checkbox') {
      data[input.name] = input.checked;
    } else if (input.type === 'radio') {
      if (input.checked) data[input.name] = input.value;
    } else {
      data[input.name] = input.value;
    }
  });

  return data;
}
```

#### Example 3: Filter and Process

```javascript
function processActiveItems() {
  const allItems = Selector.queryAll('.list-item');

  // Filter to only visible, active items
  const activeItems = allItems.filter(item =>
    item.classList.contains('active') &&
    item.offsetParent !== null  // is visible
  );

  if (activeItems.length === 0) {
    console.log('No active visible items to process');
    return;
  }

  // Process each active item
  activeItems.forEach((item, index) => {
    item.dataset.priority = index + 1;
    item.classList.add('processing');
  });

  console.log(`Processing ${activeItems.length} active items`);
}
```

#### Example 4: Interactive Elements Manager

```javascript
class InteractiveManager {
  constructor() {
    this.buttons = Selector.queryAll('button:not([disabled])');
    this.links   = Selector.queryAll('a[href]:not([disabled])');
    this.inputs  = Selector.queryAll('input:not([disabled]), textarea:not([disabled])');
  }

  initialize() {
    // Track all button clicks
    this.buttons.on('click', (e) => {
      console.log('Button:', e.target.textContent.trim());
    });

    // Track all link clicks
    this.links.on('click', (e) => {
      console.log('Link:', e.target.href);
    });

    // Track all input changes
    this.inputs.on('change', (e) => {
      console.log('Input changed:', e.target.name, '=', e.target.value);
    });

    console.log(`Initialized: ${this.buttons.length} buttons, ${this.links.length} links, ${this.inputs.length} inputs`);
  }

  disable() {
    this.buttons.setProperty('disabled', true);
    this.inputs.setProperty('disabled', true);
  }

  enable() {
    this.buttons.setProperty('disabled', false);
    this.inputs.setProperty('disabled', false);
  }
}

const manager = new InteractiveManager();
manager.initialize();
```

---

## Complex Selector Examples

### Pseudo-Classes

```javascript
// Child position selectors
const first     = Selector.query('.list-item:first-child');
const last      = Selector.query('.list-item:last-child');
const oddItems  = Selector.queryAll('.list-item:nth-child(odd)');
const every3rd  = Selector.queryAll('.list-item:nth-child(3n)');

// Negation
const notDisabled = Selector.queryAll('.btn:not([disabled])');
const notHidden   = Selector.queryAll('.card:not(.hidden):not(.loading)');

// Form state selectors
const checkedBoxes = Selector.queryAll('input[type="checkbox"]:checked');
const invalidInputs = Selector.queryAll('input:invalid');
const requiredEmpty = Selector.queryAll('input[required]:placeholder-shown');
```

### Attribute Selectors

```javascript
// Exact match
const emailField = Selector.query('input[type="email"]');

// Starts with
const httpsLinks = Selector.queryAll('a[href^="https://"]');
const externalLinks = Selector.queryAll('a[href^="http"]');

// Ends with
const pdfLinks  = Selector.queryAll('a[href$=".pdf"]');
const imageLinks = Selector.queryAll('a[href$=".jpg"], a[href$=".png"]');

// Contains
const userLinks = Selector.queryAll('[data-id*="user"]');

// Has attribute (any value)
const withTitle   = Selector.queryAll('[title]');
const withDataKey = Selector.queryAll('[data-key]');
```

### Combinators

```javascript
// Descendant (any depth)
const nested = Selector.queryAll('.parent .child');

// Direct child only
const directKids = Selector.queryAll('.parent > .child');

// Adjacent sibling (immediately after)
const nextSibling = Selector.query('.input-field + .error-message');

// General siblings (all after)
const allSiblings = Selector.queryAll('.first-item ~ .sibling-item');
```

### Fully Complex Combined

```javascript
// Cards that are visible, have a specific category, and contain enabled buttons
const complex = Selector.queryAll(
  'div.card:not(.hidden)[data-category="featured"] > .card-footer .btn:enabled'
);

// Required text inputs that aren't readonly and haven't been filled yet
const unfilled = Selector.queryAll(
  'input[type="text"][required]:not([readonly]):placeholder-shown'
);

// Deeply nested navigation active links
const activeNavLinks = Selector.queryAll(
  '.sidebar .nav-group:not(.collapsed) .nav-item.active > a'
);
```

---

## Caching Behavior

### How Caching Works

```javascript
// 1️⃣ First call — cache miss → DOM query runs
const btns1 = Selector.queryAll('.btn');
// Internal: selector not in cache → document.querySelectorAll('.btn') → cache result

// 2️⃣ Second call — cache hit → returned instantly
const btns2 = Selector.queryAll('.btn');
// Internal: found in cache → return same object immediately

// 3️⃣ Same reference — confirms caching
console.log(btns1 === btns2);  // true
```

### Performance Comparison

```javascript
// Without caching — DOM queried 1000 times
console.time('no-cache');
for (let i = 0; i < 1000; i++) {
  document.querySelectorAll('.btn');
}
console.timeEnd('no-cache');  // ~50ms

// With Selector — DOM queried only once, rest from cache
console.time('with-cache');
for (let i = 0; i < 1000; i++) {
  Selector.queryAll('.btn');  // Cache hit after first call
}
console.timeEnd('with-cache');  // ~1ms

// Result: ~50x faster
```

### When Cache Is Cleared

The cache is automatically cleared for a selector when:
- Elements matching that selector are added to or removed from the DOM
- `Selector.clear()` is called manually
- A SPA navigation or major DOM restructure happens

You don't need to manage this manually — the `MutationObserver` handles it.

---

## Static Snapshot Behavior

Both methods return a **static snapshot** — a fixed collection of elements at the time of the query.

```javascript
// Snapshot taken now — 3 items
const items = Selector.queryAll('.list-item');
console.log(items.length);  // 3

// Add a new item to the DOM
document.querySelector('.list').insertAdjacentHTML('beforeend', '<li class="list-item">New</li>');

// The existing snapshot does NOT update
console.log(items.length);  // Still 3

// Re-query to get the new snapshot (cache was cleared by MutationObserver)
const updatedItems = Selector.queryAll('.list-item');
console.log(updatedItems.length);  // 4
```

**Why this is useful:** It prevents bugs during iteration where adding/removing elements mid-loop could cause skipped or double-processed elements.

---

## Performance Tips

### 1. Be Specific with Selectors

```javascript
// Slower — checks all elements
const all = Selector.queryAll('[data-active]');

// Faster — narrows the scope
const btns = Selector.queryAll('button[data-active="true"]');
```

### 2. Store Results You Use Repeatedly

```javascript
// Less efficient — multiple cache lookups inside a loop
items.forEach(item => {
  const btns = Selector.queryAll('.btn');  // Cache lookup each iteration
  btns.first().click();
});

// Better — single lookup, stored
const btns = Selector.queryAll('.btn');
items.forEach(item => {
  btns.first().click();  // Direct reference
});
```

### 3. Use Scoped Queries for Large Pages

```javascript
// Searches the entire document
const buttons = Selector.queryAll('.btn');

// Only searches within the modal — much faster on large pages
const modal = Elements.confirmModal;
const buttons = Selector.Scoped.withinAll(modal, '.btn');
```

### 4. Avoid Universal Selectors

```javascript
// Slow — matches everything, then filters by descendant
const all = Selector.queryAll('* .btn');

// Fast — specific path from container
const btns = Selector.queryAll('.toolbar .btn');
```

---

## Common Pitfalls

### Pitfall 1: Using `query()` on Results That May Not Exist

```javascript
// ❌ Will throw TypeError if element is null
Selector.query('.notification').textContent = 'Done!';

// ✅ Safe approach
const notification = Selector.query('.notification');
if (notification) notification.textContent = 'Done!';
```

### Pitfall 2: Forgetting `queryAll()` Returns Empty (Not Null)

```javascript
// ❌ This will always be truthy — empty collection is still an object
const items = Selector.queryAll('.item');
if (items) {  // Always true, even when empty!
  processItems(items);
}

// ✅ Use isEmpty() to check properly
const items = Selector.queryAll('.item');
if (!items.isEmpty()) {
  processItems(items);
}
```

### Pitfall 3: Mutating the DOM While Iterating

```javascript
// ❌ Modifying structure mid-loop can cause unexpected behavior
const items = Selector.queryAll('.item');
items.forEach(item => {
  if (someCondition) {
    item.parentNode.removeChild(item);  // Modifying DOM while iterating!
  }
});

// ✅ Collect first, then modify
const items = Selector.queryAll('.item');
const toRemove = items.filter(item => someCondition);
toRemove.forEach(item => item.parentNode.removeChild(item));
```

---

## Key Takeaways

1. **`query(selector)`** — Returns one element or `null`. Always check the result before using it.

2. **`queryAll(selector)`** — Returns an enhanced collection. Use `isEmpty()` to check if any were found.

3. **Any CSS selector works** — pseudo-classes, attribute selectors, combinators, `:not()`, `:nth-child()`, everything.

4. **Results are cached automatically** — the same selector returns the same object instantly on repeated calls.

5. **Results are array-like** — `forEach`, `map`, `filter`, and all array methods work natively without conversion.

6. **Results have DOM methods** — `addClass`, `on`, `setStyle`, and more are available directly.

7. **Static snapshots** — The collection won't change if the DOM changes. Re-query to get fresh results.

8. **Use `query()` for one target, `queryAll()` for groups** — and choose the right helper overall: Elements for IDs, Collections for simple class/tag groups, Selector for complex queries.