[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Enhanced `document.querySelector` and `document.querySelectorAll`

This guide covers how DOMHelpers silently upgrades the browser's two query selector methods so that every element and collection they return comes fully equipped with DOMHelpers enhancement — `.update()`, shorthand methods, and full collection support — without any changes to your existing code.

---

## Quick Start (30 seconds)

You already know these:

```javascript
const hero    = document.querySelector('.hero-section');
const buttons = document.querySelectorAll('button.primary');
```

Once the Native Enhance module is loaded, those same calls work exactly as before — but what comes back has DOMHelpers superpowers:

```javascript
// querySelector — single element, now with .update() ✨
const hero = document.querySelector('.hero-section');
hero.update({
  textContent: 'Welcome',
  style: { background: '#1e40af', color: 'white' }
});

// querySelectorAll — full collection, now with .update() ✨
const buttons = document.querySelectorAll('button.primary');
buttons.update({
  disabled: false,
  style: { opacity: '1' }
});
```

Same selectors. Same syntax. Just more capable results.

---

## What is the Enhanced Query API?

When DOMHelpers loads `dh-document-query-enhance.js`, it quietly replaces two native browser methods:

- `document.querySelector(selector)` → returns an enhanced element
- `document.querySelectorAll(selector)` → returns an enhanced collection

**`querySelector`** is for selecting a single element using any CSS selector — the first matching element is returned, enhanced with `.update()` and all other DOMHelpers element methods.

**`querySelectorAll`** is for selecting a group of elements using any CSS selector — the full NodeList is returned, enhanced with `.update()`, index-based shorthands, array distribution support, and the rest of the DOMHelpers collection pipeline.

Think of this module as **the CSS selector entry point into DOMHelpers** — it gives you the full expressive power of CSS selectors, combined with the update and manipulation capabilities of the library, using the exact same syntax you already know.

---

## Syntax

```javascript
// querySelector — single element
const element = document.querySelector(cssSelector);
element.update({ ... });
element.update({ style: { ... }, classList: { ... } });

// querySelectorAll — collection of elements
const collection = document.querySelectorAll(cssSelector);
collection.update({ ... });                          // apply to all elements
collection.update({ 0: { ... }, 2: { ... } });       // apply to specific indexes
```

Any valid CSS selector works — the same selectors supported by the native browser methods:

```javascript
// By class
document.querySelector('.hero');
document.querySelectorAll('.card');

// By ID
document.querySelector('#mainNav');

// By tag
document.querySelector('header');
document.querySelectorAll('li');

// Complex selectors
document.querySelector('.container > .row:first-child');
document.querySelectorAll('input[type="text"]:not([disabled])');
document.querySelectorAll('.sidebar .nav-link.active');
document.querySelector('[data-role="admin"]');
```

---

## Why Does This Exist?

### When You Need CSS Selector Power with DOMHelpers Enhancement

`Elements` accesses elements by `id`. `Collections` accesses them by class name, tag name, or name attribute. But sometimes neither of those is specific enough. You need a complex CSS selector — nesting, pseudo-classes, attribute selectors, combinators — and you also want `.update()` and the rest of DOMHelpers on the result.

That is exactly the gap this module fills.

```javascript
// Elements can do this:
Elements.mainNav;                     // by ID only

// Collections can do this:
Collections.ClassName.card;           // by class name only

// Enhanced querySelector can do this:
document.querySelector('.sidebar .nav-link.active[data-page="home"]');
// ↑ Complex selector — and the result has .update() ✨
```

**This module is especially useful when:**
✅ You need complex CSS selectors that go beyond a single class or ID
✅ You have existing code using `querySelector` or `querySelectorAll` that you want to gradually enhance
✅ You are working with nested structures, pseudo-classes, or attribute selectors
✅ You want the CSS selector syntax you already know, plus DOMHelpers update capabilities
✅ You are integrating DOMHelpers into an existing project without restructuring access patterns

**The Choice is Yours:**
- Use `Elements.id` when the element has a unique `id` — it is the most direct and offers caching
- Use `Collections.ClassName` or `Collections.TagName` when working with groups by class or tag
- Use enhanced `querySelector` / `querySelectorAll` when you need the full power of CSS selectors or already have selector-based code
- All three produce equally enhanced elements and collections — the choice is about what selector style fits the situation

---

## Mental Model

**Think of CSS selectors as a precise address system for your page.**

`Elements.header` is like saying "go to house number 42" — fast and direct, works when you know the exact ID.

`Collections.ClassName.card` is like saying "find all houses on Maple Street" — works when elements share a known class.

`document.querySelector('.container > .card:first-child')` is like saying "find the first house on Maple Street, inside the Oak Avenue block, with a blue door" — when you need to be very specific about exactly which element or elements you mean.

```
querySelector — finds the FIRST match:

document.querySelector('.sidebar .link.active')
                ↓
   Scans the DOM for elements matching the CSS rule
                ↓
   Finds the first matching element
                ↓
   Passes it through the DOMHelpers element enhancer
                ↓
   Returns enhanced element with .update() ✅


querySelectorAll — finds ALL matches:

document.querySelectorAll('.card:not(.hidden)')
                ↓
   Scans the DOM for all elements matching the CSS rule
                ↓
   Collects them into a NodeList
                ↓
   Passes the NodeList through the full collection pipeline
                ↓
   Returns enhanced collection with .update() and shorthands ✅
```

---

## How Does It Work?

When `dh-document-query-enhance.js` loads, it saves references to the original `querySelector` and `querySelectorAll`, then replaces each with an enhanced wrapper.

### `querySelector` — Element Enhancement

```
Your code calls:  document.querySelector('.hero-section')
                              ↓
        Enhanced function intercepts the call
                              ↓
        Calls the original native querySelector internally
                              ↓
        Browser returns the first matching raw element (or null)
                              ↓
        Null check:
        ├─ null → return null immediately (element not found)
        └─ element found → continue
                              ↓
        Already enhanced check:
        ├─ YES → Return as-is (no double-enhancement)
        └─ NO  → Pass through EnhancedUpdateUtility pipeline
                              ↓
        Element now has .update() and all shorthand methods
                              ↓
        Your code receives the enhanced element ✅
```

### `querySelectorAll` — Collection Enhancement

```
Your code calls:  document.querySelectorAll('button.primary')
                              ↓
        Enhanced function intercepts the call
                              ↓
        Calls the original native querySelectorAll internally
                              ↓
        Browser returns a raw NodeList
                              ↓
        Enhancement pipeline runs in order:

        Step 1 — EnhancedUpdateUtility
                 Adds .update() to the NodeList

        Step 2 — BulkPropertyUpdaters
                 Adds index-based shorthand methods
                 (.textContent, .style, .classes, etc.)

        Step 3 — ArrayBasedUpdates
                 Adds array-distribution support
                 (apply to all, or spread by index)

        Step 4 — IndexedUpdates
                 Patches additional indexed update patterns

                              ↓
        Your code receives the fully enhanced NodeList ✅
```

### Error Handling

Both methods are wrapped in try/catch. If an invalid CSS selector is passed, the error is caught, a console message is shown, and `null` (for `querySelector`) or an empty collection (for `querySelectorAll`) is returned — no unhandled exceptions:

```javascript
// Invalid selector
const el = document.querySelector('!!!invalid');
// Console: [dh-document-query] querySelector error: ...
// el === null — safe to check

const list = document.querySelectorAll('!!!invalid');
// Console: [dh-document-query] querySelectorAll error: ...
// list is an empty enhanced collection — safe to iterate
```

### NodeList Passed Directly — No Array Conversion

A key implementation detail: the NodeList from `querySelectorAll` is passed to the enhancement pipeline as-is, without being converted to an Array first. This preserves the live/static NodeList characteristics of the browser and keeps the result consistent with the native API behavior.

---

## Basic Usage

### `querySelector` — Single Element

```javascript
// HTML: <header class="site-header">...</header>

const header = document.querySelector('.site-header');

// Standard DOM properties still work exactly as before
console.log(header.tagName);    // "HEADER"
console.log(header.className);  // "site-header"

// And now .update() is available ✨
header.update({
  style: { background: '#1e293b', color: 'white' },
  classList: { add: 'scrolled' }
});
```

### `querySelector` — Complex Selectors

```javascript
// Nested selector — first active nav link inside the sidebar
const activeLink = document.querySelector('.sidebar .nav-link.active');
activeLink.update({
  style: { fontWeight: 'bold', color: '#2563eb' },
  setAttribute: { 'aria-current': 'page' }
});

// Attribute selector — first text input that is not disabled
const firstInput = document.querySelector('input[type="text"]:not([disabled])');
firstInput.update({
  value: '',
  style: { borderColor: '#3b82f6' }
});

// Data attribute selector
const adminRow = document.querySelector('[data-role="admin"]');
adminRow.update({
  classList: { add: 'admin-highlight' },
  dataset:   { verified: 'true' }
});
```

### `querySelector` — Null Safety

```javascript
// If no element matches, querySelector returns null
// Always check before using .update()
const modal = document.querySelector('.modal.open');

if (modal) {
  modal.update({ hidden: false, classList: { add: 'visible' } });
}

// Or use optional chaining
document.querySelector('.optional-banner')?.update({ textContent: 'Hello' });
```

### `querySelectorAll` — All Matching Elements

```javascript
// HTML: multiple <div class="card"> elements

const cards = document.querySelectorAll('.card');

// Apply to ALL cards at once
cards.update({
  style:     { borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  classList: { add: 'styled' }
});
```

### `querySelectorAll` — Index-Based Updates

```javascript
const items = document.querySelectorAll('.menu-item');

// Update specific items by index
items.update({
  0: { classList: { add: 'first' }, textContent: 'Home' },
  1: { textContent: 'About' },
  2: { classList: { add: 'active' } }
});
```

### `querySelectorAll` — Complex Selectors

```javascript
// All visible buttons inside forms
const formButtons = document.querySelectorAll('form button:not([hidden])');
formButtons.update({ disabled: true });

// All images missing an alt attribute
const unnamedImages = document.querySelectorAll('img:not([alt])');
unnamedImages.update({ setAttribute: { alt: '' } });

// All checked checkboxes
const checked = document.querySelectorAll('input[type="checkbox"]:checked');
checked.update({ checked: false });  // uncheck all

// Direct children of a specific container
const directChildren = document.querySelectorAll('.grid > .grid-item');
directChildren.update({ style: { padding: '1rem' } });
```

---

## Using `.update()` on Collections

The `.update()` method on a `querySelectorAll` result works in two modes:

### Mode 1 — Apply to All Elements

Pass a flat update object (no numeric keys) and it applies to every element in the collection:

```javascript
const paragraphs = document.querySelectorAll('article p');

// Apply to every <p> inside <article>
paragraphs.update({
  style:       { lineHeight: '1.75', color: '#374151' },
  classList:   { add: 'formatted' }
});
```

### Mode 2 — Apply by Index

Pass an object with numeric keys to target specific elements:

```javascript
const cells = document.querySelectorAll('table td');

cells.update({
  0: { textContent: 'Row 1, Col 1', style: { fontWeight: 'bold' } },
  1: { textContent: 'Row 1, Col 2' },
  4: { style: { background: '#fef3c7' } }  // fifth cell
});
```

---

## Deep Dive: Real-World Patterns

### Pattern 1 — Dynamic Component Initialization

```javascript
// Initialize all accordion components on the page
function initAccordions() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  const panels   = document.querySelectorAll('.accordion-panel');

  // Set initial state for all
  panels.update({
    hidden:    true,
    classList: { remove: 'open' }
  });

  triggers.update({
    setAttribute: { 'aria-expanded': 'false' }
  });

  // Attach click handlers (standard DOM)
  for (let i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('click', () => toggleAccordion(i));
  }
}

function toggleAccordion(index) {
  const triggers = document.querySelectorAll('.accordion-trigger');
  const panels   = document.querySelectorAll('.accordion-panel');

  const isOpen = !panels[index].hidden;

  // Close all
  panels.update({ hidden: true, classList: { remove: 'open' } });
  triggers.update({ setAttribute: { 'aria-expanded': 'false' } });

  // Open the clicked one (if it was closed)
  if (!isOpen) {
    panels[index].update({
      hidden:    false,
      classList: { add: 'open' }
    });
    triggers[index].update({
      setAttribute: { 'aria-expanded': 'true' }
    });
  }
}
```

### Pattern 2 — Form Validation Feedback

```javascript
function showValidationErrors(errors) {
  // Reset all fields first
  document.querySelectorAll('.field-input').update({
    classList: { remove: 'error', remove: 'valid' },
    style:     { borderColor: '' }
  });
  document.querySelectorAll('.field-error').update({
    textContent: '',
    hidden:      true
  });

  // Apply errors to specific fields
  errors.forEach(({ fieldId, message }) => {
    const input    = document.querySelector(`#${fieldId}`);
    const errorMsg = document.querySelector(`#${fieldId}-error`);

    if (input) {
      input.update({
        classList: { add: 'error' },
        style:     { borderColor: '#ef4444' },
        setAttribute: { 'aria-invalid': 'true' }
      });
    }

    if (errorMsg) {
      errorMsg.update({
        textContent: message,
        hidden:      false
      });
    }
  });
}
```

### Pattern 3 — Search Filter

```javascript
function filterCards(searchTerm) {
  const cards = document.querySelectorAll('.product-card');
  const term  = searchTerm.toLowerCase();

  for (let i = 0; i < cards.length; i++) {
    const card  = cards[i];
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const matches = title.includes(term);

    card.update({
      hidden:    !matches,
      classList: {
        add:    matches ? 'visible' : 'hidden',
        remove: matches ? 'hidden'  : 'visible'
      }
    });
  }

  // Update result count
  const visible = document.querySelectorAll('.product-card:not([hidden])');
  document.querySelector('.result-count')?.update({
    textContent: `${visible.length} result${visible.length !== 1 ? 's' : ''}`
  });
}
```

### Pattern 4 — Accessibility Enhancement

```javascript
// Add ARIA attributes to all interactive elements missing them
function enhanceAccessibility() {
  // Images without alt text
  document.querySelectorAll('img:not([alt])').update({
    setAttribute: { alt: '' }
  });

  // Buttons without accessible labels
  document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').update({
    setAttribute: { 'aria-label': 'Button' }
  });

  // Links that open in new tabs
  document.querySelectorAll('a[target="_blank"]').update({
    setAttribute: { rel: 'noopener noreferrer' }
  });

  // Inputs without associated labels — add aria-label based on placeholder
  const unlabelledInputs = document.querySelectorAll(
    'input:not([aria-label]):not([aria-labelledby])[placeholder]'
  );
  for (let i = 0; i < unlabelledInputs.length; i++) {
    const placeholder = unlabelledInputs[i].placeholder;
    unlabelledInputs[i].update({
      setAttribute: { 'aria-label': placeholder }
    });
  }
}
```

### Pattern 5 — Gradual Enhancement of Existing Code

```javascript
// BEFORE — existing code in your project
function resetForm() {
  const inputs   = document.querySelectorAll('#checkoutForm input');
  const selects  = document.querySelectorAll('#checkoutForm select');
  const errors   = document.querySelectorAll('.error-msg');

  inputs.forEach(el => { el.value = ''; el.classList.remove('invalid'); });
  selects.forEach(el => { el.selectedIndex = 0; });
  errors.forEach(el => { el.textContent = ''; el.style.display = 'none'; });
}

// AFTER — same selectors, enhanced with .update() where convenient
function resetForm() {
  document.querySelectorAll('#checkoutForm input').update({
    value:     '',
    classList: { remove: 'invalid' }
  });

  document.querySelectorAll('#checkoutForm select').update({
    selectedIndex: 0
  });

  document.querySelectorAll('.error-msg').update({
    textContent: '',
    style:       { display: 'none' }
  });
}
```

The logic is the same. The enhanced version is shorter and more readable.

---

## Comparing querySelector vs querySelectorAll

```
querySelector — ONE element:
─────────────────────────────────────────────────────────
document.querySelector('.hero')
  ↓ returns first match only
  ↓ enhanced element with .update()
  ↓ returns null if nothing matches


querySelectorAll — ALL matching elements:
─────────────────────────────────────────────────────────
document.querySelectorAll('.card')
  ↓ returns all matches as a NodeList
  ↓ enhanced collection with .update(), shorthands
  ↓ returns empty enhanced collection if nothing matches
  ↓ never null — always safe to iterate
```

**Simple rule:**
- Use `querySelector` when you want **one specific element** — the first match
- Use `querySelectorAll` when you want **all matching elements**

---

## Quick Comparison

| | Plain `querySelector` / `querySelectorAll` | Enhanced versions | `Elements` / `Collections` |
|--|--|--|--|
| **Syntax** | `document.querySelector(css)` | Same | `Elements.id` / `Collections.ClassName.x` |
| **Selector power** | Full CSS | Full CSS | ID / class / tag / name only |
| **Returns enhanced element** | ❌ | ✅ | ✅ |
| **`.update()` available** | ❌ | ✅ | ✅ |
| **Caching** | ❌ | ❌ | ✅ (Elements) |
| **Zero code change needed** | — | ✅ (drop-in) | ❌ (new syntax) |
| **Best for** | Existing code | Gradual adoption / complex selectors | New code with simple access patterns |

---

## Common Pitfalls

### Pitfall 1 — Not Checking for `null` with `querySelector`

`querySelector` returns `null` when nothing matches. Calling `.update()` on `null` will throw an error:

```javascript
// ❌ Dangerous — may throw if element is not in the DOM
document.querySelector('.optional-modal').update({ hidden: false });

// ✅ Always guard against null
const modal = document.querySelector('.optional-modal');
if (modal) modal.update({ hidden: false });

// ✅ Or use optional chaining
document.querySelector('.optional-modal')?.update({ hidden: false });
```

### Pitfall 2 — `querySelectorAll` Never Returns `null`

Unlike `querySelector`, `querySelectorAll` always returns a collection — even if nothing matches. The collection will just have `length === 0`. You do not need a null check:

```javascript
const cards = document.querySelectorAll('.card');
// cards is always a collection — never null
// cards.length === 0 if no cards exist
cards.update({ ... });  // safe even with 0 elements — just does nothing
```

### Pitfall 3 — Treating `querySelectorAll` Results Like Arrays

The returned NodeList is enhanced but is not a native JavaScript Array. Standard array methods like `.map()`, `.filter()`, `.forEach()` are not available unless the enhancement adds them:

```javascript
const buttons = document.querySelectorAll('button');

// ❌ May not work
buttons.map(btn => btn.update({ ... }));
buttons.filter(btn => btn.disabled);

// ✅ Use .update() for changes
buttons.update({ disabled: false });

// ✅ Or use a standard for loop for conditional logic
for (let i = 0; i < buttons.length; i++) {
  if (buttons[i].dataset.type === 'primary') {
    buttons[i].update({ classList: { add: 'main-action' } });
  }
}
```

### Pitfall 4 — Load Order

The module must load after all DOMHelpers core modules it depends on:

```html
<!-- ✅ Correct load order -->
<script src="01_dh-core.js"></script>
<script src="01_dh-bulk-property-updaters.js"></script>
<script src="10_dh-array-based-updates.js"></script>
<script src="06_dh-document-query-enhance.js"></script>
<script src="my-app.js"></script>
```

### Pitfall 5 — No Caching

Neither enhanced method caches its results. Each call performs a fresh DOM scan. If you are calling `querySelector` or `querySelectorAll` frequently with the same selector, store the result in a variable or switch to `Elements` / `Collections` which offer caching:

```javascript
// ❌ Repeated DOM scanning
function update() {
  document.querySelector('.hero').update({ textContent: 'A' });   // scan
  document.querySelector('.hero').update({ style: { ... } });     // scan again
}

// ✅ Store the result
function update() {
  const hero = document.querySelector('.hero');  // scan once
  hero.update({ textContent: 'A', style: { ... } });
}

// ✅ Or use Elements for automatic caching (if the element has an ID)
Elements.hero.update({ textContent: 'A', style: { ... } });
```

---

## Plain JavaScript vs Enhanced Query API

This section puts both approaches side by side on real scenarios — so you can see exactly what the library eliminates and what it gives you in return.

---

### Scenario 1 — Update a complex nested element

**Plain JavaScript**

```javascript
const activeLink = document.querySelector('.sidebar .nav-link.active');

activeLink.style.fontWeight = 'bold';
activeLink.style.color      = '#2563eb';
activeLink.setAttribute('aria-current', 'page');
activeLink.dataset.visited  = 'true';
```

One `querySelector` call, then four separate property statements. The element access and its updates are disconnected — you have to read all four lines to understand the full change.

**Enhanced `querySelector`**

```javascript
document.querySelector('.sidebar .nav-link.active').update({
  style:        { fontWeight: 'bold', color: '#2563eb' },
  setAttribute: { 'aria-current': 'page' },
  dataset:      { visited: 'true' }
});
```

One call. Everything about this element's update is in one place. The selector and the changes are expressed together as a single intention.

---

### Scenario 2 — Apply styles to a filtered group of elements

**Plain JavaScript**

```javascript
const visibleCards = document.querySelectorAll('.product-card:not(.hidden)');

for (let i = 0; i < visibleCards.length; i++) {
  visibleCards[i].style.borderRadius = '8px';
  visibleCards[i].style.boxShadow    = '0 2px 8px rgba(0,0,0,0.1)';
  visibleCards[i].classList.add('styled');
}
```

A `querySelectorAll`, then a loop, then three property assignments per element inside the loop. The loop is pure scaffolding — it contributes no logic, only repetition.

**Enhanced `querySelectorAll`**

```javascript
document.querySelectorAll('.product-card:not(.hidden)').update({
  style:     { borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  classList: { add: 'styled' }
});
```

One call. No loop. The CSS selector does the filtering; `.update()` does the changes. The reader sees immediately: "for all visible product cards, apply these styles."

---

### Scenario 3 — Reset a form

**Plain JavaScript**

```javascript
const inputs  = document.querySelectorAll('#checkoutForm input');
const selects = document.querySelectorAll('#checkoutForm select');
const errors  = document.querySelectorAll('.error-msg');

inputs.forEach(el => {
  el.value = '';
  el.classList.remove('invalid');
});

selects.forEach(el => {
  el.selectedIndex = 0;
});

errors.forEach(el => {
  el.textContent        = '';
  el.style.display      = 'none';
});
```

3 `querySelectorAll` calls. 3 `forEach` loops. 6 property assignments spread across them. Every property change requires writing a loop callback.

**Enhanced `querySelectorAll`**

```javascript
document.querySelectorAll('#checkoutForm input').update({
  value:     '',
  classList: { remove: 'invalid' }
});

document.querySelectorAll('#checkoutForm select').update({
  selectedIndex: 0
});

document.querySelectorAll('.error-msg').update({
  textContent: '',
  style:       { display: 'none' }
});
```

3 calls. No loops. No callbacks. Each call is a direct statement: selector → what changes. The form reset logic is now readable at a glance.

---

### Scenario 4 — Add accessibility attributes to all matching elements

**Plain JavaScript**

```javascript
const images  = document.querySelectorAll('img:not([alt])');
const newTabs = document.querySelectorAll('a[target="_blank"]');
const buttons = document.querySelectorAll('button:not([aria-label])');

for (let i = 0; i < images.length;  i++) images[i].setAttribute('alt', '');
for (let i = 0; i < newTabs.length; i++) newTabs[i].setAttribute('rel', 'noopener noreferrer');
for (let i = 0; i < buttons.length; i++) buttons[i].setAttribute('aria-label', 'Button');
```

3 `querySelectorAll` calls. 3 loops. 3 `setAttribute` calls inside each loop. Nine statements to express three straightforward attribute assignments.

**Enhanced `querySelectorAll`**

```javascript
document.querySelectorAll('img:not([alt])').update({
  setAttribute: { alt: '' }
});

document.querySelectorAll('a[target="_blank"]').update({
  setAttribute: { rel: 'noopener noreferrer' }
});

document.querySelectorAll('button:not([aria-label])').update({
  setAttribute: { 'aria-label': 'Button' }
});
```

3 calls. No loops. Each one reads like a sentence: "for these elements, set this attribute."

---

### Scenario 5 — Initialize an accordion component

**Plain JavaScript**

```javascript
const triggers = document.querySelectorAll('.accordion-trigger');
const panels   = document.querySelectorAll('.accordion-panel');

for (let i = 0; i < panels.length; i++) {
  panels[i].hidden = true;
  panels[i].classList.remove('open');
}

for (let i = 0; i < triggers.length; i++) {
  triggers[i].setAttribute('aria-expanded', 'false');
}
```

2 `querySelectorAll` calls. 2 loops. 3 property assignments spread across them. The "set initial state" logic is split into two loops with no obvious grouping.

**Enhanced `querySelectorAll`**

```javascript
const triggers = document.querySelectorAll('.accordion-trigger');
const panels   = document.querySelectorAll('.accordion-panel');

panels.update({
  hidden:    true,
  classList: { remove: 'open' }
});

triggers.update({
  setAttribute: { 'aria-expanded': 'false' }
});
```

2 `querySelectorAll` calls. 2 `.update()` calls. The loops are gone. Each update block tells you exactly what that group of elements starts as — at a glance.

---

### Scenario 6 — Update specific elements by index inside a selection

**Plain JavaScript**

```javascript
const items = document.querySelectorAll('.menu-item');

items[0].classList.add('first');
items[0].textContent = 'Home';
items[1].textContent = 'About';
items[2].classList.add('active');
```

Four separate indexed statements. Reading them, you have to track the index manually to build a mental picture of what each item looks like.

**Enhanced `querySelectorAll`**

```javascript
document.querySelectorAll('.menu-item').update({
  0: { classList: { add: 'first' }, textContent: 'Home' },
  1: { textContent: 'About' },
  2: { classList: { add: 'active' } }
});
```

One call. Each index is a key — all changes for that element are grouped together. The structure itself shows you the menu item layout.

---

### What the pattern shows

```
Plain JavaScript                       Enhanced querySelector / querySelectorAll
────────────────────────────────       ──────────────────────────────────────────
querySelectorAll + forEach/for loop    .update() — no loop needed
  for every batch of changes
Separate statements per property       All property changes grouped in one object
  across loop iterations                 per element or per collection
Intent split across multiple loops     Intent expressed in a single call
Variable declarations to hold          Chain directly: querySelectorAll().update()
  intermediate results                   no intermediate variable required
Adding a new property = new line       Adding a new property = new key in the
  inside a loop                           existing object
Complex selectors work but             Complex selectors work AND the result
  result is a plain NodeList             is immediately ready to update
```

The CSS selector power was always there. The library adds the ability to act on the results immediately, declaratively, without the mechanical loop scaffolding that plain JavaScript requires.

---

## Summary

1. **Two methods upgraded** — `querySelector` and `querySelectorAll` are both enhanced by a single module load
2. **Full CSS selector power** — any valid CSS selector works, including complex nested, pseudo-class, and attribute selectors
3. **Element enhancement** — `querySelector` returns an element with `.update()` and all shorthand methods, or `null` if nothing matches
4. **Collection enhancement** — `querySelectorAll` returns a fully enhanced NodeList with `.update()`, index-based shorthands, and array distribution support
5. **Error safe** — invalid selectors are caught cleanly; no unhandled exceptions
6. **Same pipeline as `Collections`** — EnhancedUpdateUtility, BulkPropertyUpdaters, ArrayBasedUpdates, and IndexedUpdates all run in order
7. **No caching** — fresh DOM scan on every call; store results in variables or use `Elements` / `Collections` when caching matters
8. **Gradual adoption friendly** — drop the module in, and existing `querySelector` / `querySelectorAll` code immediately benefits from `.update()` and collection methods
