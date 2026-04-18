[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Enhanced `getElementsByClassName`, `getElementsByTagName`, and `getElementsByName`

This guide covers how DOMHelpers silently upgrades the browser's three "getElements" methods so that every collection they return comes fully equipped with the DOMHelpers enhancement pipeline — `.update()`, index-based shorthands, array distribution, and bulk function-level operations — without any changes to your existing code.

---

## Quick Start (30 seconds)

You already know these:

```javascript
const cards   = document.getElementsByClassName('card');
const buttons = document.getElementsByTagName('button');
const fields  = document.getElementsByName('email');
```

Once the Native Enhance module is loaded, those exact same calls work as before — but the collections you get back now have DOMHelpers superpowers:

```javascript
const cards = document.getElementsByClassName('card');

// Apply the same update to every card in the collection ✨
cards.update({
  style: { opacity: '0.5', pointerEvents: 'none' }
});

// Or target specific cards by index
cards.update({
  0: { textContent: 'First Card' },
  2: { style: { border: '2px solid red' } }
});
```

No new syntax. No restructuring. The collections just get better.

---

## What is the Enhanced `getElementsBy*`?

When DOMHelpers loads `dh-getElementsBy-enhance.js`, it quietly replaces three native browser methods:

- `document.getElementsByClassName(name)` → returns an enhanced collection
- `document.getElementsByTagName(name)` → returns an enhanced collection
- `document.getElementsByName(name)` → returns an enhanced collection

Each enhanced collection passes through the full DOMHelpers enhancement pipeline — the same one used by `Collections`, `querySelectorAll`, and every other DOMHelpers collection accessor. This means every collection you get back has:

- `.update()` — apply changes to all elements or specific indexes at once
- Index-based shorthand methods — `.textContent()`, `.style()`, `.classes()`, `.attrs()`, `.dataset()`, and more, targeting elements by position
- Array distribution — spread values across the collection by index
- Full compatibility with the rest of DOMHelpers

On top of that, the functions themselves gain **function-level bulk shorthands** — so you can update multiple collections by name in a single call.

---

## Syntax

```javascript
// Element collection access — same as always
const byClass = document.getElementsByClassName('card');
const byTag   = document.getElementsByTagName('button');
const byName  = document.getElementsByName('email');

// Collection-level methods — available on every returned collection
byClass.update({ textContent: 'Updated' });          // apply to all elements
byClass.update({ 0: { textContent: 'First' } });     // apply to index 0 only

// Function-level bulk shorthands — keyed by collection name
document.getElementsByClassName.update({
  card:   { style: { opacity: '0.5' } },
  header: { textContent: 'Hello' }
});

document.getElementsByTagName.textContent({
  h1: 'Page Title',
  p:  'Paragraph text'
});

document.getElementsByName.value({
  email:    '',
  password: ''
});
```

There are two levels of API, just like with `getElementById`:

| Level | How to use | What it does |
|-------|-----------|--------------|
| **Collection level** | `document.getElementsByClassName('card').update(...)` | Operates on the returned collection |
| **Function level** | `document.getElementsByClassName.update({ card: {...} })` | Updates multiple collections by name in one call |

---

## Why Does This Exist?

### When Your Project Already Uses `getElementsBy*` Methods

Many projects — especially ones that predate modern frameworks — use `getElementsByClassName`, `getElementsByTagName`, or `getElementsByName` to work with groups of elements. Migrating every call to `Collections.ClassName.card` or `Collections.TagName.button` would require touching each of those lines.

The Native Enhance module meets that code where it already is.

```javascript
// Existing code — you don't touch this
function highlightResults(results) {
  const rows = document.getElementsByClassName('result-row');
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.background = i % 2 === 0 ? '#f9fafb' : '#ffffff';
  }
}
```

Once the module loads, `rows` comes back as an enhanced collection. You can now use `.update()` alongside or instead of the manual loop:

```javascript
function highlightResults() {
  const rows = document.getElementsByClassName('result-row');

  // Still works — the loop is fine
  // But now you can also do this:
  rows.update({ style: { background: '#f9fafb' } }); // applies to all rows ✨
}
```

**This module is especially useful when:**
✅ You have existing code using `getElementsBy*` that you want to gradually enhance
✅ You work across a team where native DOM APIs are the shared baseline
✅ You need DOMHelpers collection features without refactoring access patterns
✅ You want function-level bulk operations across multiple named collections at once
✅ You are integrating DOMHelpers into a project that cannot be restructured immediately

**The Choice is Yours:**
- Use `Collections.ClassName`, `Collections.TagName`, or `Collections.Name` when starting fresh or when you want the full Collections feature set
- Use the enhanced `getElementsBy*` methods when working in existing code or when you prefer the native API feel
- Both approaches produce identically enhanced collections — the choice is about workflow, not capability

---

## Mental Model

**Think of this as upgrading a fleet of delivery vans.**

You have a company with delivery vans — each van already knows its route. One day, the company installs a new onboard system in every van. The vans still drive the same routes. The drivers still use the same keys. But now each van also tracks location, accepts remote instructions, and can report status in real time.

The routes didn't change. The drivers didn't change. The vans just got better.

```
Before the module loads:

document.getElementsByClassName('card')
                ↓
   HTMLCollection [ <div>, <div>, <div> ]
   (plain browser collection — index access only)


After the module loads:

document.getElementsByClassName('card')
                ↓
   Enhanced HTMLCollection [ <div>, <div>, <div> ]
   ├─ .update()       ← apply to all OR specific indexes
   ├─ .textContent()  ← shorthand for all or by index
   ├─ .style()        ← shorthand for all or by index
   ├─ .classes()      ← shorthand for all or by index
   ├─ .attrs()        ← shorthand for all or by index
   ├─ .dataset()      ← shorthand for all or by index
   └─ [0], [1], [2]   ← index access still works as always
```

Nothing breaks. Everything gains.

---

## How Does It Work?

When `dh-getElementsBy-enhance.js` loads, it saves references to the three original native methods, then replaces each one with an enhanced wrapper. The wrapper calls the original, takes the raw `HTMLCollection` it returns, and passes it through the full DOMHelpers enhancement pipeline.

```
Your code calls:  document.getElementsByClassName('card')
                              ↓
        Enhanced function intercepts the call
                              ↓
        Calls the original native getElementsByClassName internally
                              ↓
        Browser returns a raw HTMLCollection
                              ↓
        Enhancement pipeline runs in order:

        Step 1 — EnhancedUpdateUtility
                 Adds .update() to the collection

        Step 2 — BulkPropertyUpdaters
                 Adds index-based shorthand methods
                 (.textContent, .style, .classes, etc.)

        Step 3 — ArrayBasedUpdates
                 Adds array-distribution support
                 (apply same value to all, or spread by index)

        Step 4 — IndexedUpdates
                 Patches additional indexed update patterns

                              ↓
        Your code receives the fully enhanced collection ✅
```

### The Same Pipeline as `Collections`

The enhancement is identical to what `Collections.ClassName.card` applies internally. This means elements from both approaches have the same capabilities:

```javascript
// These produce collections with identical enhancement
const a = Collections.ClassName.card;                      // via Collections helper
const b = document.getElementsByClassName('card');         // via enhanced native method

// Both have .update() — same behavior
a.update({ style: { opacity: '0.8' } });
b.update({ style: { opacity: '0.8' } });
```

### Graceful Failure per Step

Each enhancement step is wrapped in its own try/catch. If any step fails (because a dependency is not loaded), that step is skipped with a console warning and the pipeline continues. The collection is always returned — even if partially enhanced.

```
EnhancedUpdateUtility missing?
  → Warning logged, step 1 skipped, continue with step 2

BulkPropertyUpdaters missing?
  → Warning logged, step 2 skipped, continue with step 3

...and so on
```

Your code never breaks. It may just have fewer methods available if a dependency is missing.

---

## Basic Usage

### Accessing a Collection

```javascript
// HTML:
// <div class="card">Card 1</div>
// <div class="card">Card 2</div>
// <div class="card">Card 3</div>

const cards = document.getElementsByClassName('card');

// Standard index access still works exactly as before
console.log(cards[0].textContent);  // "Card 1"
console.log(cards.length);          // 3

// And now .update() is available on the whole collection ✨
cards.update({ style: { border: '1px solid #e5e7eb' } });
// Applies to ALL three cards
```

### Applying an Update to All Elements

```javascript
const buttons = document.getElementsByTagName('button');

// Apply the same change to every button on the page
buttons.update({ disabled: true });

// Or multiple properties at once
buttons.update({
  disabled: true,
  style:    { opacity: '0.5', cursor: 'not-allowed' }
});
```

### Applying Updates by Index

```javascript
const items = document.getElementsByClassName('list-item');

// Update specific items by their position in the collection
items.update({
  0: { classList: { add: 'first-item' } },
  1: { style: { fontWeight: 'bold' } },
  2: { textContent: 'Last visible item' }
});
```

### Using Index-Based Shorthands

```javascript
const inputs = document.getElementsByTagName('input');

// Set textContent on specific indexes
inputs.textContent({
  0: 'First input label',
  1: 'Second input label'
});

// Set value by index
inputs.value({
  0: 'john@example.com',
  1: ''
});
```

### Using `getElementsByTagName`

```javascript
// HTML: multiple <p> elements throughout the page

const paragraphs = document.getElementsByTagName('p');

paragraphs.update({
  style: { lineHeight: '1.75', color: '#374151' }
});
// All <p> elements get the same line-height and color
```

### Using `getElementsByName`

```javascript
// HTML: <input name="quantity"> (multiple instances in a form)

const quantityFields = document.getElementsByName('quantity');

// Reset all quantity fields at once
quantityFields.value({ /* spread by index or apply to all */ });

// Or via .update()
quantityFields.update({ value: '0' });
```

---

## Function-Level Bulk Operations

Just as with the enhanced `getElementById`, the three functions themselves gain bulk shorthand methods. These let you update multiple named collections in a single call.

The key is how you identify the collection — by the **name** you would normally pass to the function:

```javascript
// Instead of:
document.getElementsByClassName('card').update({ ... });
document.getElementsByClassName('header').update({ ... });

// You can write:
document.getElementsByClassName.update({
  card:   { ... },
  header: { ... }
});
```

### `getElementsByClassName` — Function-Level Shorthands

```javascript
// Bulk update — multiple class collections at once
document.getElementsByClassName.update({
  card:   { style: { opacity: '0.5' } },
  badge:  { textContent: 'New' },
  alert:  { hidden: true }
});

// Bulk textContent
document.getElementsByClassName.textContent({
  'section-title': 'Updated Title',
  'status-label':  'Active'
});

// Bulk style
document.getElementsByClassName.style({
  card:    { background: '#f8fafc', borderRadius: '8px' },
  overlay: { background: 'rgba(0,0,0,0.5)' }
});

// Bulk classes
document.getElementsByClassName.classes({
  card:    { add: 'highlighted', remove: 'dimmed' },
  sidebar: { add: 'collapsed' }
});

// Bulk attrs
document.getElementsByClassName.attrs({
  'btn-primary': { disabled: true, 'aria-busy': 'true' },
  'nav-link':    { 'aria-current': 'page' }
});

// Bulk dataset
document.getElementsByClassName.dataset({
  'list-item': { category: 'featured', visible: 'true' },
  'user-row':  { status: 'active' }
});
```

### `getElementsByTagName` — Function-Level Shorthands

```javascript
// Update all elements of a given tag
document.getElementsByTagName.update({
  button: { disabled: false, style: { cursor: 'pointer' } },
  input:  { disabled: false },
  select: { disabled: false }
});

// Set textContent on all headings
document.getElementsByTagName.textContent({
  h1: 'Main Title',
  h2: 'Section Title'
});

// Apply styles to tag groups
document.getElementsByTagName.style({
  p:    { lineHeight: '1.75', color: '#374151' },
  li:   { marginBottom: '0.5rem' },
  code: { fontFamily: 'monospace', background: '#f1f5f9' }
});
```

### `getElementsByName` — Function-Level Shorthands

```javascript
// Reset multiple named form fields at once
document.getElementsByName.value({
  email:    '',
  password: '',
  quantity: '1',
  notes:    ''
});

// Disable named groups of inputs
document.getElementsByName.disabled({
  email:    true,
  password: true,
  quantity: false
});

// Set placeholder on named inputs
document.getElementsByName.placeholder({
  email:    'Enter your email',
  password: 'Enter your password'
});
```

---

## Full Shorthand Reference

All three enhanced functions share the same set of shorthand methods:

| Method | Usage | Applies to |
|--------|-------|------------|
| `.update({ name: {...} })` | Multi-property update | All elements in each named collection |
| `.textContent({ name: value })` | Quick text update | `element.textContent` |
| `.innerHTML({ name: value })` | Quick HTML update | `element.innerHTML` |
| `.innerText({ name: value })` | Quick visible text | `element.innerText` |
| `.value({ name: value })` | Quick value update | `element.value` |
| `.placeholder({ name: value })` | Quick placeholder | `element.placeholder` |
| `.title({ name: value })` | Quick title update | `element.title` |
| `.disabled({ name: bool })` | Enable/disable | `element.disabled` |
| `.checked({ name: bool })` | Check/uncheck | `element.checked` |
| `.readonly({ name: bool })` | Read-only state | `element.readOnly` |
| `.hidden({ name: bool })` | Show/hide | `element.hidden` |
| `.selected({ name: bool })` | Select/deselect | `element.selected` |
| `.src({ name: value })` | Update source | `element.src` |
| `.href({ name: value })` | Update link | `element.href` |
| `.alt({ name: value })` | Update alt text | `element.alt` |
| `.style({ name: {...} })` | Apply inline styles | `element.style.*` |
| `.classes({ name: {...} })` | Manage class list | `element.classList` |
| `.attrs({ name: {...} })` | Set/remove attributes | `setAttribute / removeAttribute` |
| `.dataset({ name: {...} })` | Set data attributes | `element.dataset.*` |
| `.prop(path, { name: value })` | Set any property | Any property path |

---

## Deep Dive: Real-World Patterns

### Pattern 1 — Page Loading State

```javascript
// Show loading state across multiple element groups
function setLoadingState(isLoading) {
  document.getElementsByClassName.update({
    'data-cell':    { textContent: isLoading ? '...' : '' },
    'action-btn':   { disabled: isLoading },
    'loading-icon': { hidden: !isLoading }
  });

  document.getElementsByTagName.update({
    button: { disabled: isLoading },
    input:  { disabled: isLoading },
    select: { disabled: isLoading }
  });
}

setLoadingState(true);   // lock the UI
// ... fetch data ...
setLoadingState(false);  // unlock the UI
```

### Pattern 2 — Multi-Step Form

```javascript
// HTML:
// <div class="step" data-step="1">...</div>
// <div class="step" data-step="2">...</div>
// <div class="step" data-step="3">...</div>

function goToStep(stepNumber) {
  const steps = document.getElementsByClassName('step');

  // Hide all steps
  steps.update({ hidden: true, classList: { remove: 'active' } });

  // Show the target step
  steps[stepNumber - 1].update({
    hidden:    false,
    classList: { add: 'active' }
  });

  // Update progress indicators
  document.getElementsByClassName.update({
    'step-indicator': { classList: { remove: 'current', remove: 'completed' } }
  });
}
```

### Pattern 3 — Table Row Management

```javascript
// HTML: <tr class="data-row"> ... </tr> (many rows)

function applyTableFilter(visible) {
  const rows = document.getElementsByClassName('data-row');

  // Hide all rows first
  rows.update({ hidden: true });

  // Then show only matching rows (manual loop for conditional logic)
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].dataset.category === visible) {
      rows[i].update({ hidden: false });
    }
  }
}

function highlightRow(index) {
  const rows = document.getElementsByClassName('data-row');

  // Remove highlight from all
  rows.update({ classList: { remove: 'highlighted' } });

  // Add to the selected row
  rows[index].update({ classList: { add: 'highlighted' } });
}
```

### Pattern 4 — Form Reset

```javascript
// Reset an entire form group by name attributes
function resetCheckoutForm() {
  document.getElementsByName.value({
    'first-name':    '',
    'last-name':     '',
    'email':         '',
    'card-number':   '',
    'expiry':        '',
    'cvv':           '',
    'billing-zip':   ''
  });

  document.getElementsByName.checked({
    'save-card':     false,
    'same-address':  true,
    'subscribe':     false
  });

  // Clear all error states
  document.getElementsByClassName.update({
    'field-error':   { textContent: '', hidden: true },
    'input-invalid': { classList: { remove: 'input-invalid' } }
  });
}
```

### Pattern 5 — Gradual Enhancement of Existing Code

```javascript
// BEFORE — existing code, already in your project
function updatePriceDisplay(prices) {
  const cells = document.getElementsByClassName('price-cell');
  for (let i = 0; i < cells.length; i++) {
    cells[i].textContent = `$${prices[i].toFixed(2)}`;
    if (prices[i] < 0) {
      cells[i].style.color = 'red';
    }
  }
}

// AFTER — same access pattern, now with collection methods where convenient
function updatePriceDisplay(prices) {
  const cells = document.getElementsByClassName('price-cell');

  // The loop is still valid and still works fine
  // But you can also mix in collection-level calls:
  cells.update({ style: { color: '#111827' } });  // reset color for all

  for (let i = 0; i < cells.length; i++) {
    cells[i].update({
      textContent: `$${prices[i].toFixed(2)}`,
      style: { color: prices[i] < 0 ? 'red' : '#111827' }
    });
  }
}
```

---

## Understanding the Two APIs Side by Side

```
COLLECTION LEVEL — operates on one returned collection
──────────────────────────────────────────────────────────────
const cards = document.getElementsByClassName('card');

cards.update({ style: { opacity: '0.5' } });   // all elements
cards.update({ 0: { textContent: 'First' } });  // index 0 only
          ↑
     The enhanced collection has .update() and shorthands


FUNCTION LEVEL — operates on many named collections at once
──────────────────────────────────────────────────────────────
document.getElementsByClassName.update({
  card:    { style: { opacity: '0.5' } },
  header:  { textContent: 'Hello' },
  sidebar: { hidden: true }
});
          ↑
     The function itself has .update() and shorthands
     Keys are class/tag/name strings — values are update objects
```

---

## Common Pitfalls

### Pitfall 1 — Passing a Non-Object to Function-Level Shorthands

Function-level shorthands expect an object of `{ collectionName: value }` pairs:

```javascript
// ❌ This will not work
document.getElementsByClassName.textContent('Hello');

// ✅ Always pass an object keyed by collection name
document.getElementsByClassName.textContent({ 'section-title': 'Hello' });
```

### Pitfall 2 — Updating a Collection That Does Not Exist

If a class name, tag name, or name attribute is not found, a console warning is shown and the call is skipped gracefully:

```javascript
document.getElementsByClassName.update({ 'ghost-class': { hidden: true } });
// Console: [dh-getElementsBy] 'ghost-class' not found
// The rest of the batch continues normally
```

### Pitfall 3 — Assuming Index Methods Work Like Arrays

The collection shorthands at the collection level use index-keyed objects, not array methods:

```javascript
const cards = document.getElementsByClassName('card');

// ❌ Not how it works
cards.map(card => card.update({ ... }));   // no .map() on HTMLCollection

// ✅ Use index-based update object
cards.update({
  0: { textContent: 'First' },
  1: { textContent: 'Second' }
});

// ✅ Or apply to all elements at once
cards.update({ style: { color: 'red' } });
```

### Pitfall 4 — Load Order

The module must load after all DOMHelpers core modules it depends on:

```html
<!-- ✅ Correct load order -->
<script src="01_dh-core.js"></script>
<script src="01_dh-bulk-property-updaters.js"></script>
<script src="10_dh-array-based-updates.js"></script>
<script src="06_dh-getElementsBy-enhance.js"></script>
<script src="my-app.js"></script>
```

### Pitfall 5 — No Caching

Like the enhanced `getElementById`, these methods do **not** cache collections. Each call performs a real DOM lookup:

```javascript
// Collections helper — may use caching internally
const a = Collections.ClassName.card;

// Enhanced native method — no cache, fresh lookup every time
const b = document.getElementsByClassName('card');
const c = document.getElementsByClassName('card');  // DOM lookup again
```

If caching is important for your use case, `Collections.ClassName`, `Collections.TagName`, or `Collections.Name` is the better choice.

---

## Quick Comparison

| | Plain `getElementsBy*` | Enhanced `getElementsBy*` | `Collections` helper |
|--|--|--|--|
| **Syntax** | `document.getElementsByClassName('x')` | Same | `Collections.ClassName.x` |
| **Returns** | Plain HTMLCollection | Enhanced collection | Enhanced collection |
| **`.update()` on collection** | ❌ | ✅ | ✅ |
| **Index-based shorthands** | ❌ | ✅ | ✅ |
| **Bulk function shorthands** | ❌ | ✅ | ✅ via `Collections.update()` |
| **Zero code change needed** | — | ✅ (drop-in) | ❌ (new syntax) |
| **Best for** | Existing plain JS | Gradual adoption | New code |

---

## Plain JavaScript vs Enhanced `getElementsBy*`

This section puts both approaches side by side on real scenarios — so you can see exactly what the library eliminates and what it gives you in return.

---

### Scenario 1 — Disable all buttons on the page during a request

**Plain JavaScript**

```javascript
const buttons = document.getElementsByTagName('button');

for (let i = 0; i < buttons.length; i++) {
  buttons[i].disabled            = true;
  buttons[i].style.opacity       = '0.5';
  buttons[i].style.cursor        = 'not-allowed';
}
```

A loop. Three property assignments per element. Every iteration repeats the same indexed access. The intent — "lock all buttons" — takes a loop and three lines inside it to express.

**Enhanced `getElementsByTagName`**

```javascript
document.getElementsByTagName('button').update({
  disabled: true,
  style:    { opacity: '0.5', cursor: 'not-allowed' }
});
```

One call. No loop. The intent is the code.

---

### Scenario 2 — Reset all form fields by name

**Plain JavaScript**

```javascript
const emailFields    = document.getElementsByName('email');
const passwordFields = document.getElementsByName('password');
const quantityFields = document.getElementsByName('quantity');
const notesFields    = document.getElementsByName('notes');

for (let i = 0; i < emailFields.length;    i++) emailFields[i].value    = '';
for (let i = 0; i < passwordFields.length; i++) passwordFields[i].value = '';
for (let i = 0; i < quantityFields.length; i++) quantityFields[i].value = '1';
for (let i = 0; i < notesFields.length;    i++) notesFields[i].value    = '';
```

4 variable declarations. 4 separate loops. 8 lines to express one idea: "reset the form fields."

**Enhanced `getElementsByName`**

```javascript
document.getElementsByName.value({
  email:    '',
  password: '',
  quantity: '1',
  notes:    ''
});
```

One call. No loops. No variables. The form field names map directly to their new values — the structure is the documentation.

---

### Scenario 3 — Update badge text and card styles across multiple groups

**Plain JavaScript**

```javascript
const badges    = document.getElementsByClassName('badge');
const cards     = document.getElementsByClassName('card');
const overlays  = document.getElementsByClassName('overlay');

for (let i = 0; i < badges.length;   i++) badges[i].textContent          = 'New';
for (let i = 0; i < cards.length;    i++) {
  cards[i].style.background   = '#f8fafc';
  cards[i].style.borderRadius = '8px';
}
for (let i = 0; i < overlays.length; i++) overlays[i].style.background   = 'rgba(0,0,0,0.5)';
```

3 variable declarations. 3 loops. 5 property assignments spread across them. A reader has to trace the loop variables to understand which element gets what.

**Enhanced `getElementsByClassName`**

```javascript
document.getElementsByClassName.update({
  badge:   { textContent: 'New' },
  card:    { style: { background: '#f8fafc', borderRadius: '8px' } },
  overlay: { style: { background: 'rgba(0,0,0,0.5)' } }
});
```

One call. Three elements. Every element's update is right next to its name. Add a new element group — add one line.

---

### Scenario 4 — Set a loading state across the entire UI

**Plain JavaScript**

```javascript
const dataCells   = document.getElementsByClassName('data-cell');
const actionBtns  = document.getElementsByClassName('action-btn');
const loadIcons   = document.getElementsByClassName('loading-icon');
const allButtons  = document.getElementsByTagName('button');
const allInputs   = document.getElementsByTagName('input');
const allSelects  = document.getElementsByTagName('select');

for (let i = 0; i < dataCells.length;  i++) dataCells[i].textContent  = '...';
for (let i = 0; i < actionBtns.length; i++) actionBtns[i].disabled    = true;
for (let i = 0; i < loadIcons.length;  i++) loadIcons[i].hidden        = false;
for (let i = 0; i < allButtons.length; i++) allButtons[i].disabled     = true;
for (let i = 0; i < allInputs.length;  i++) allInputs[i].disabled      = true;
for (let i = 0; i < allSelects.length; i++) allSelects[i].disabled     = true;
```

6 variable declarations. 6 loops. 6 property assignments. A wall of code to express one idea: "the page is loading, lock everything."

**Enhanced `getElementsBy*`**

```javascript
document.getElementsByClassName.update({
  'data-cell':    { textContent: '...' },
  'action-btn':   { disabled: true },
  'loading-icon': { hidden: false }
});

document.getElementsByTagName.update({
  button: { disabled: true },
  input:  { disabled: true },
  select: { disabled: true }
});
```

Two calls. The grouping by selector type (`byClass` vs `byTag`) makes the intent crystal clear. Adding or removing a group is one line change.

---

### Scenario 5 — Highlight a selected table row, clear the rest

**Plain JavaScript**

```javascript
const rows = document.getElementsByClassName('data-row');

for (let i = 0; i < rows.length; i++) {
  rows[i].classList.remove('highlighted');
  rows[i].style.background = '';
}

rows[selectedIndex].classList.add('highlighted');
rows[selectedIndex].style.background = '#eff6ff';
```

A loop to clear all rows, then two extra statements for the selected one. The logic is split across three places in the code.

**Enhanced `getElementsByClassName`**

```javascript
const rows = document.getElementsByClassName('data-row');

// Remove highlight from all
rows.update({ classList: { remove: 'highlighted' }, style: { background: '' } });

// Apply to the selected row by index
rows[selectedIndex].update({
  classList: { add: 'highlighted' },
  style:     { background: '#eff6ff' }
});
```

Two clear statements. The first says "clear all." The second says "highlight this one." No loop needed for the reset — `.update()` handles all elements at once.

---

### What the pattern shows

```
Plain JavaScript                     Enhanced getElementsBy*
────────────────────────────────     ──────────────────────────────────────
Loop over every collection           .update() applies to all elements
  to apply changes                     without a loop
Separate variable declaration        Access and update in a single expression
  for every collection
One loop per collection group        One call for multiple collection groups
  even for simple changes              via function-level shorthands
Property assignments scattered       All updates for a group grouped
  across loop bodies                   in one readable object
Adding a new group = new variable    Adding a new group = one new line
  + new loop + new assignments          inside the existing call
```

The library does not remove logic. It removes the mechanical scaffolding around the logic — the loops, the repeated variable names, the indexed access — so that what remains is a direct expression of intent.

---

## Summary

1. **Three methods upgraded at once** — `getElementsByClassName`, `getElementsByTagName`, and `getElementsByName` are all enhanced by a single module load
2. **Full pipeline enhancement** — every returned collection passes through EnhancedUpdateUtility, BulkPropertyUpdaters, ArrayBasedUpdates, and IndexedUpdates — identical to `Collections`
3. **Collection-level methods** — `.update()` and all shorthand methods apply to the whole collection or to specific indexes
4. **Function-level bulk shorthands** — update multiple named collections in a single call using the function's own `.update()`, `.textContent()`, `.style()`, and 17 more methods
5. **Graceful degradation** — if any dependency is missing, that enhancement step is skipped cleanly; the collection is always returned
6. **Gradual adoption friendly** — drop the module in, and existing code immediately benefits; adopt the new methods only where they make sense
