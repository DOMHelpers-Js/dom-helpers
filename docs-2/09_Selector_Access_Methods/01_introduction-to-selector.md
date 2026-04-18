[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Introduction to Selector Helper

## Quick Start (30 Seconds)

```javascript
// Query a single element with a complex CSS selector
const activeButton = Selector.query('.btn.primary:not(.disabled)');

// Query multiple elements — array methods work natively
const cards = Selector.queryAll('.card:not(.hidden)');
cards.addClass('highlighted').on('click', handleClick);

// Query within a specific container only
const modal = Elements.userModal;
const inputs = Selector.Scoped.withinAll(modal, 'input[required]');

// Wait for dynamically loaded content
const list = await Selector.waitForAll('.list-item', 5);
```

That's it. Full CSS selector power, automatic caching, array methods built-in, scoped queries, and async waiting — all in one unified helper.

---

## What Is the Selector Helper?

The **Selector Helper** is a powerful DOM querying system that wraps `querySelector` and `querySelectorAll` with intelligent caching, array-like methods, and built-in DOM manipulation tools.

Simply put: it gives you the full power of CSS selectors — combined with performance caching and a rich set of utility methods — through one clean API.

Think of it this way:

> **Vanilla `querySelectorAll`** is like calling a directory operator every single time you want a phone number.
>
> **Selector Helper** is like having a smart contact list that remembers every number you've looked up, gives you all the tools to manage them, and also lets you search within specific groups.

Every time you call `Selector.query()` or `Selector.queryAll()`, the result is automatically cached. The next time you use the same query, it returns instantly from cache — no DOM traversal needed.

---

## Syntax

```javascript
// Query one element (like querySelector)
Selector.query(cssSelector)

// Query multiple elements (like querySelectorAll)
Selector.queryAll(cssSelector)

// Query within a container — single result
Selector.Scoped.within(container, cssSelector)

// Query within a container — multiple results
Selector.Scoped.withinAll(container, cssSelector)

// Wait for a single element to appear (async)
await Selector.waitFor(cssSelector, timeout?)

// Wait for multiple elements to appear (async)
await Selector.waitForAll(cssSelector, minCount?, timeout?)
```

**All CSS selectors are supported:** class selectors, pseudo-classes, attribute selectors, combinators, `:not()`, `:nth-child()`, and more.

---

## Why Does This Exist?

### `query()` and `queryAll()` — When Selector Precision Is Your Priority

In scenarios where you need precise, complex CSS selectors — multi-class conditions, pseudo-classes, attribute matchers, or deeply nested structures — the Selector Helper provides the most direct and expressive approach:

```javascript
// A complex selector — targeting only visible, enabled, non-loading buttons
const actionButtons = Selector.queryAll(
  'button.btn:not(.hidden):not(.disabled):not(.loading)'
);

// Deeply nested structure
const nestedLinks = Selector.queryAll('.sidebar .menu li:nth-child(odd) a.active');

// Attribute-based targeting
const emailInputs = Selector.queryAll('input[type="email"][required]:not([readonly])');
```

This approach is **great when you need:**
✅ Multi-condition selectors (multiple classes, pseudo-classes, attribute checks)
✅ Structural precision (combinators like `>`, `+`, `~`, `:nth-child()`)
✅ Dynamic attribute targeting (`[data-*]`, `[aria-*]`, `:checked`, `:invalid`)
✅ Automatic caching of complex queries for repeat access

### When Simple Class or ID Access Is Your Goal

In scenarios where you just need elements by class, tag, or ID, the other helpers provide a more streamlined approach:

```javascript
// Simple class group → use Collections
const buttons = Collections.ClassName.btn;

// Unique ID element → use Elements
const header = Elements.pageHeader;
```

**Selector is especially useful when:**
✅ The selector is too specific or complex for Collections
✅ You need pseudo-classes, attribute matchers, or combinators
✅ You're targeting nested, conditional, or state-based elements
✅ You're working with dynamic content that needs async waiting
✅ You need scoped queries limited to a specific container

**The Choice Is Yours:**
- Use `Elements` when accessing by unique ID
- Use `Collections` when accessing by class, tag, or name attribute
- Use `Selector` when your selector is complex, conditional, or structural
- All three helpers share the same enhanced methods after element access

**Benefits of the Selector approach:**
✅ Full CSS selector expressiveness
✅ Automatic intelligent caching (no repeat DOM traversal)
✅ Scoped queries for performance and component isolation
✅ Async waiting for dynamically loaded content
✅ Enhanced array-like methods and bulk DOM manipulation built-in

---

## Mental Model

Think of the Selector Helper as a **smart search engine for your page**.

Imagine your webpage is a large office building with thousands of rooms and items. You need to find very specific things — "all fire extinguishers in odd-numbered rooms on the east wing that aren't currently in use."

**Without Selector Helper:**
You'd physically walk through every room every time you need to find those extinguishers. Same walk, every time, even when nothing has changed.

**With Selector Helper:**
The first time you search, you get a directory. After that, the directory is cached — you just pull up the result instantly. The search engine also lets you filter those results, update all of them at once, and narrow your search to just one section of the building.

```
Your CSS Selector
       ↓
[ Selector Helper ]
       ↓
 Is it cached? ──── YES ──→ Return instantly from cache ✨
       │
      NO
       ↓
 Query the DOM (querySelectorAll)
       ↓
 Cache the result
       ↓
 Return enhanced collection
       ↓
[ Array methods + DOM methods + Utility methods available ]
```

---

## How Does It Work?

Under the hood, the Selector Helper uses a **Map-based cache** to store query results keyed by selector string.

Here's the full internal flow:

```
Selector.queryAll('.btn.active')
            │
            ▼
  Check cache map for '.btn.active'
            │
   ┌────────┴────────┐
   │                 │
CACHE HIT        CACHE MISS
   │                 │
   ▼                 ▼
Return cached    Run document.querySelectorAll('.btn.active')
collection                   │
                             ▼
                   Wrap results in enhanced collection
                   (adds array methods + DOM methods)
                             │
                             ▼
                   Store in cache map
                             │
                             ▼
                   Return enhanced collection
```

**For Scoped Queries (`Selector.Scoped.withinAll`):**

```
Selector.Scoped.withinAll(container, '.btn')
            │
            ▼
  Cache key = container + selector
            │
   ┌────────┴────────┐
   │                 │
CACHE HIT        CACHE MISS
   │                 │
   ▼                 ▼
Return cached    container.querySelectorAll('.btn')
collection                   │
                             ▼
                   Wrap + cache + return
```

**For Async Waiting (`Selector.waitFor`):**

```
await Selector.waitFor('.dynamic-item', 5000)
            │
            ▼
  Check if element exists right now
            │
   ┌────────┴────────┐
   │                 │
FOUND           NOT YET FOUND
   │                 │
   ▼                 ▼
Return element   Set up MutationObserver
                 (watch for DOM changes)
                         │
                    Element appears
                         │
                         ▼
                Resolve promise + return element
                         │
                (if timeout reached first → throw Error)
```

---

## Basic Usage

### Step 1: Query a Single Element

```javascript
// Get the first element matching the selector
const activeButton = Selector.query('.btn.active');

// Always check the result — query() returns null if not found
if (activeButton) {
  activeButton.textContent = 'Processing...';
  activeButton.disabled = true;
} else {
  console.warn('No active button found');
}

// Or use optional chaining for simple one-liners
Selector.query('.submit-btn')?.classList.add('ready');
```

**What's happening:**
- `Selector.query()` runs `document.querySelector()` internally
- The first matching element is returned
- If nothing matches, it returns `null` — always check!

---

### Step 2: Query Multiple Elements

```javascript
// Get all elements matching the selector
const cards = Selector.queryAll('.card:not(.hidden)');

// The result is array-like — forEach, map, filter all work natively
cards.forEach(card => {
  console.log(card.dataset.id);
});

// Or use the built-in bulk methods
cards.addClass('initialized');
cards.on('click', handleCardClick);

// Check if any were found
if (cards.isEmpty()) {
  console.log('No visible cards found');
} else {
  console.log(`Found ${cards.length} visible cards`);
}
```

**What's happening:**
- `Selector.queryAll()` runs `document.querySelectorAll()` internally
- The result is an **enhanced collection** — not a plain NodeList
- Array methods (`forEach`, `map`, `filter`, etc.) are available natively
- DOM methods (`addClass`, `on`, `setStyle`, etc.) are built right in

---

### Step 3: Scope Your Query to a Container

```javascript
// Get a container element first
const sidebar = Elements.sidebar;

// Find ALL navigation links within the sidebar only
const navLinks = Selector.Scoped.withinAll(sidebar, 'a.nav-link');

// These are ONLY the links inside .sidebar — nothing from outside
navLinks.on('click', (e) => {
  navLinks.removeClass('active');
  e.target.classList.add('active');
});

// Find a single element within a container
const sidebarTitle = Selector.Scoped.within(sidebar, '.sidebar-title');
if (sidebarTitle) {
  sidebarTitle.textContent = 'Navigation';
}
```

**What's happening:**
- `Selector.Scoped.withinAll(container, selector)` limits the search to within the container
- This is much faster for large pages — it doesn't search the entire DOM
- It also prevents interference between components (sidebar links vs header links)

---

### Step 4: Wait for Dynamic Content

```javascript
async function afterDataLoads() {
  // Fetch data from an API
  await fetch('/api/items').then(r => r.json());

  try {
    // Wait until the list items appear in the DOM (up to 8 seconds)
    const items = await Selector.waitForAll('.list-item', 3, 8000);

    console.log(`Loaded ${items.length} items`);

    // Initialize them immediately
    items.addClass('ready').on('click', handleItemClick);

  } catch (error) {
    console.error('Items never appeared — showing empty state');
    showEmptyState();
  }
}
```

**What's happening:**
- `waitForAll()` uses a `MutationObserver` internally to watch for DOM changes
- When the minimum count of elements appears, the promise resolves
- If the timeout expires before they appear, the promise rejects — handle it with `try/catch`

---

## When to Use Selector vs Elements vs Collections

A common question — let's settle it cleanly.

| Helper | Best For | Example |
|--------|----------|---------|
| **Elements** | Unique IDs | `Elements.submitBtn` |
| **Collections** | Simple class / tag / name groups | `Collections.ClassName.card` |
| **Selector** | Complex CSS selectors, pseudo-classes, combinator queries | `Selector.query('.modal.visible .btn.primary')` |

### Quick Decision Guide

```javascript
// Does your element have a unique ID?
// → Use Elements
const header = Elements.pageHeader;

// Do you need all elements sharing a class or tag?
// → Use Collections
const cards = Collections.ClassName.card;
const paragraphs = Collections.TagName.p;

// Do you need pseudo-classes, attribute matchers, or combinators?
// → Use Selector
const checkedInputs = Selector.queryAll('input:checked');
const oddRows = Selector.queryAll('tr:nth-child(odd)');
const nestedBtn = Selector.query('.modal > .footer .btn.primary');

// Do you need to search only within one section?
// → Use Selector.Scoped
const modal = Elements.confirmModal;
const confirmBtn = Selector.Scoped.within(modal, '.btn.confirm');

// Is the content loaded dynamically (AJAX, SPA)?
// → Use Selector.waitFor / waitForAll
const results = await Selector.waitForAll('.search-result', 1, 5000);
```

---

## Key Features Overview

### 1. Full CSS Selector Power

```javascript
// Pseudo-classes
const firstItem = Selector.query('.list-item:first-child');
const oddRows   = Selector.queryAll('tr:nth-child(odd)');
const notHidden = Selector.queryAll('.btn:not(.hidden)');

// Attribute selectors
const emails    = Selector.queryAll('input[type="email"]');
const httpLinks = Selector.queryAll('a[href^="https"]');
const dataBtns  = Selector.queryAll('[data-action="submit"]');

// Combinators
const directKids  = Selector.queryAll('.parent > .child');
const nestedBtns  = Selector.queryAll('.card .btn.primary');
const nextSibling = Selector.query('.error + .help-text');

// Complex combined
const precise = Selector.queryAll(
  'form.checkout input[type="text"]:not([readonly]):not(:disabled)'
);
```

### 2. Automatic Caching

```javascript
// First call — queries the DOM
const buttons1 = Selector.queryAll('.btn');  // Cache miss → DOM query

// Second call — same selector → from cache instantly
const buttons2 = Selector.queryAll('.btn');  // Cache hit ✨

// They reference the same object
console.log(buttons1 === buttons2);  // true

// Performance difference
console.time('no-cache');
for (let i = 0; i < 1000; i++) document.querySelectorAll('.btn');
console.timeEnd('no-cache');  // ~50ms

console.time('with-cache');
for (let i = 0; i < 1000; i++) Selector.queryAll('.btn');
console.timeEnd('with-cache');  // ~1ms
```

### 3. Array-Like Enhanced Results

```javascript
const items = Selector.queryAll('.item');

// Standard JavaScript array methods work natively
items.forEach(item => console.log(item.textContent));
const texts = items.map(item => item.textContent);
const visible = items.filter(item => item.offsetParent !== null);
const first = items.find(item => item.classList.contains('featured'));
const hasActive = items.some(item => item.classList.contains('active'));
const allReady = items.every(item => item.dataset.ready === 'true');
const total = items.reduce((sum, item) => sum + parseInt(item.dataset.value), 0);
const plain = items.toArray(); // Convert to plain array
```

### 4. Built-In DOM Manipulation

```javascript
const cards = Selector.queryAll('.card');

// Bulk class operations
cards.addClass('highlighted');
cards.removeClass('loading');
cards.toggleClass('selected');

// Bulk property and attribute setting
cards.setProperty('hidden', false);
cards.setAttribute('aria-expanded', 'true');
cards.setStyle({ opacity: '1', transform: 'translateY(0)' });

// Bulk event binding — all chainable
cards
  .addClass('ready')
  .setStyle({ cursor: 'pointer' })
  .on('click', handleCardClick)
  .on('mouseenter', handleHover);
```

### 5. Filtering Methods

```javascript
const inputs = Selector.queryAll('input');

// Filter by visibility state
const visibleInputs = inputs.visible();
const hiddenInputs  = inputs.hidden();

// Filter by enabled/disabled state
const activeInputs   = inputs.enabled();
const inactiveInputs = inputs.disabled();

// Filter by ancestor (unique to Selector)
const formInputs = inputs.within('form:not(.hidden)');
```

### 6. Utility Methods

```javascript
const items = Selector.queryAll('.item');

const first  = items.first();     // First element
const last   = items.last();      // Last element
const third  = items.at(2);       // By index (supports negative!)
const second = items.at(-2);      // Second from last
const empty  = items.isEmpty();   // Boolean — is the collection empty?
```

---

## Real-World Example: Filterable Card Grid

Let's see how Selector brings clarity to a common UI pattern.

### HTML Structure

```html
<div class="filters">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="new">New</button>
  <button class="filter-btn" data-filter="sale">Sale</button>
</div>

<div class="grid">
  <div class="card" data-category="new">
    <img class="card-image" src="product1.jpg" alt="Product 1">
    <h3 class="card-title">Product 1</h3>
    <button class="card-btn">Buy Now</button>
  </div>
  <div class="card" data-category="sale">
    <img class="card-image" src="product2.jpg" alt="Product 2">
    <h3 class="card-title">Product 2</h3>
    <button class="card-btn">Buy Now</button>
  </div>
</div>
```

### Traditional Approach (Verbose)

```javascript
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

filterButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    filterButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const filter = this.dataset.filter;
    const cards = Array.from(document.querySelectorAll('.card'));

    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

const cardButtons = Array.from(document.querySelectorAll('.card-btn'));
cardButtons.forEach(btn => {
  btn.style.backgroundColor = '#2563eb';
  btn.style.color = 'white';
  btn.style.borderRadius = '4px';
});
```

**Problems:**
❌ Verbose `document.querySelectorAll` calls everywhere
❌ Must manually convert NodeList to array
❌ No caching — queries DOM every click
❌ Repetitive `forEach` loops for styling

### Selector Approach (Clean)

```javascript
// Get filter buttons and cards once (cached automatically)
const filterButtons = Selector.queryAll('.filter-btn');
const cards = Selector.queryAll('.card');

// Setup filter interaction
filterButtons.on('click', function () {
  filterButtons.removeClass('active');
  this.classList.add('active');

  const filter = this.dataset.filter;

  if (filter === 'all') {
    cards.removeClass('hidden');
  } else {
    cards.forEach(card => {
      card.classList.toggle('hidden', card.dataset.category !== filter);
    });
  }
});

// Style all card buttons in one chain
Selector.queryAll('.card-btn').setStyle({
  backgroundColor: '#2563eb',
  color: 'white',
  borderRadius: '4px'
});
```

**Benefits:**
✅ Clean, readable code
✅ Results cached automatically
✅ Bulk DOM operations with built-in methods
✅ No manual array conversion needed

---

## Complete Method Categories

### Query Methods
| Method | Description |
|--------|-------------|
| `Selector.query(selector)` | Single element — like `querySelector` |
| `Selector.queryAll(selector)` | Multiple elements — like `querySelectorAll` |

### Scoped Methods
| Method | Description |
|--------|-------------|
| `Selector.Scoped.within(container, selector)` | Single element within container |
| `Selector.Scoped.withinAll(container, selector)` | Multiple elements within container |

### Async Methods
| Method | Description |
|--------|-------------|
| `Selector.waitFor(selector, timeout?)` | Wait for single element to appear |
| `Selector.waitForAll(selector, minCount?, timeout?)` | Wait for multiple elements |

### Array-Like Methods (on results)
`forEach` · `map` · `filter` · `find` · `findIndex` · `some` · `every` · `reduce` · `toArray`

### DOM Manipulation Methods (on results)
`addClass` · `removeClass` · `toggleClass` · `setProperty` · `setAttribute` · `setStyle` · `on` · `off`

### Filtering Methods (on results)
`visible()` · `hidden()` · `enabled()` · `disabled()` · `within(selector)`

### Utility Methods (on results)
`first()` · `last()` · `at(index)` · `isEmpty()` · `item(index)` · `namedItem(name)`

### Helper / Lifecycle Methods
`stats()` · `clear()` · `destroy()` · `configure()`

---

## Summary

The **Selector Helper** is your go-to tool whenever you need the precision of CSS selectors combined with the convenience of enhanced, cached, array-like results.

**Key Points to Remember:**

1️⃣ **Use `Selector.query()`** for a single element — returns the element or `null`

2️⃣ **Use `Selector.queryAll()`** for multiple elements — returns an enhanced collection

3️⃣ **Results are cached automatically** — the same selector returns the same object from cache on the next call

4️⃣ **Results are array-like** — `forEach`, `map`, `filter`, and all array methods work directly

5️⃣ **Results have built-in DOM methods** — `addClass`, `on`, `setStyle`, etc. are available on every result

6️⃣ **Scoped queries** limit the search to within a container — faster and component-safe

7️⃣ **Async waiting** handles dynamically loaded content gracefully

8️⃣ **Choose the right helper:** Elements for IDs, Collections for simple groups, Selector for complex queries

Ready to explore the individual methods in depth? Let's dive in.