[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# The Selector Helper

You've learned `Elements` for finding one element by ID, and `Collections` for finding groups by class, tag, or name. Now meet the third helper: **Selector**.

Selector gives you the full power of CSS selectors — combinators, pseudo-classes, attribute selectors, complex chains — anything that `querySelector` and `querySelectorAll` support. With caching and `.update()` built right in.

---

## Quick Start (30 Seconds)

```javascript
// Find ONE element — any CSS selector
const header     = Selector.query('#site-header');
const firstBtn   = Selector.query('button');
const emailInput = Selector.query('input[type="email"]');

// Find ALL matching elements
const allBtns     = Selector.queryAll('.btn');
const allRequired = Selector.queryAll('input[required]');
const paragraphs  = Selector.queryAll('section > p');

// Update what you found
header.update({ textContent: 'Welcome!' });
allBtns.update({ disabled: false });

// Search inside a specific container
const formInput = Selector.Scoped.within('#loginForm', 'input[type="email"]');
const formBtns  = Selector.Scoped.withinAll('#loginForm', 'button');

// Bulk update with CSS selectors as keys
Selector.update({
  '#hero h1':        { textContent: 'New Title' },
  '.card':           { classList: { add: 'loaded' } },
  'input[required]': { classList: { add: 'required-mark' } }
});
```

---

## What is the Selector Helper?

**The Selector Helper** gives you the full power of CSS selectors — `querySelector` and `querySelectorAll` — with caching and `.update()` added on top.

Here's how it fits alongside the other two helpers:

| Helper | Targets | CSS Power |
|--------|---------|-----------|
| `Elements` | One element by ID | IDs only |
| `Collections` | Groups by class / tag / name | Three basic options |
| `Selector` | Any CSS selector | Full CSS: combinators, pseudo-classes, attributes, etc. |

**Think of it like this:**
- `Elements` is for named elements you know and control
- `Collections` is for groups that share a common trait
- `Selector` is for when you need precision targeting with the full power of CSS

---

## Why Does This Exist?

### When Elements and Collections Already Cover Most Cases

For the majority of DOM access, `Elements` and `Collections` are the right tools:

```javascript
// Know the ID? → Elements is the cleanest choice
Elements.submitBtn.update({ disabled: false });

// Need all elements of a class? → Collections is purpose-built
Collections.ClassName.btn.update({ disabled: false });
```

These methods are **great when you need**:
✅ Fast, straightforward access by ID or class
✅ Clean, readable syntax that maps directly to your HTML structure
✅ The most common patterns in everyday DOM work

### When Selector Provides the Most Direct Path

In scenarios where you need complex CSS targeting — relationships between elements, pseudo-classes, attribute combinations — `Selector` provides the precision that the other helpers can't:

```javascript
// Need the first button inside a specific form?
Selector.query('#loginForm button[type="submit"]');

// Need all required fields inside one particular section?
Selector.queryAll('#billingSection input[required]');

// Need all active nav links that aren't disabled?
Selector.queryAll('nav li.active > a:not([disabled])');
```

**Selector is especially useful when:**
✅ You need CSS combinator targeting (descendant, child, sibling)
✅ You need pseudo-class selectors (`:first-child`, `:not()`, `:focus`)
✅ You need attribute selectors (`[type="email"]`, `[data-role]`, `[aria-hidden="true"]`)
✅ Your selector logic is more complex than a single class or ID

**The Choice is Yours:**
- Use `Elements` when you know the element's ID
- Use `Collections` when you want all elements of a class/tag/name
- Use `Selector` when you need the full power of CSS targeting
- All three work together and complement each other

---

## Mental Model — A Spotlight of Any Shape

Think of CSS selectors like a spotlight on a stage. `Elements` is a pinpoint spotlight on one known actor (by ID badge). `Collections` is a broad spotlight covering everyone wearing the same costume (by class). `Selector` is a **spotlight of any shape you can describe in CSS** — you define the shape, it illuminates what matches.

```
Selector.query('form button[type="submit"]')
   ↓
CSS spotlight: "show me buttons of type submit, inside a form"
   ↓
Scans the DOM with that shape
   ↓
Returns the first match (with .update() attached)
```

---

## `Selector.query()` — Find One Element

Like `document.querySelector()` — finds the **first** element that matches the CSS selector. Returns the element (with `.update()` attached) or `null` if nothing matches.

### Syntax

```javascript
Selector.query(cssSelector)
```

### Examples

```javascript
// By ID (though Elements would be simpler here)
Selector.query('#myHeader')

// By class — first match only
Selector.query('.primary-btn')

// By attribute
Selector.query('input[type="submit"]')
Selector.query('[data-action="delete"]')

// By relationship (CSS combinators)
Selector.query('form > .submit-area button')
Selector.query('nav li:first-child a')

// Pseudo-classes
Selector.query('input:focus')
Selector.query('li:nth-child(2)')
Selector.query('input:not([disabled])')
```

### Using the Result

```javascript
const input = Selector.query('input[type="email"]');

if (input) {
  input.value = '';
  input.update({
    classList:    { add: 'validated' },
    setAttribute: { 'aria-invalid': 'false' }
  });
}
```

---

## `Selector.queryAll()` — Find All Matching Elements

Like `document.querySelectorAll()` — finds **all** elements matching the selector. Returns an enhanced collection with `.update()` and array methods.

### Syntax

```javascript
Selector.queryAll(cssSelector)
```

### Examples

```javascript
// All elements with a class
const cards = Selector.queryAll('.card');

// All inputs of a specific type
const textInputs = Selector.queryAll('input[type="text"]');

// Child combinator
const directChildren = Selector.queryAll('section > p');

// Multiple selectors (comma-separated)
const headings = Selector.queryAll('h1, h2, h3');

// Attribute presence check
const withDataId = Selector.queryAll('[data-id]');

// Complex selectors
const activeNavLinks = Selector.queryAll('nav ul li.active > a');
```

### Using the Result

```javascript
const cards = Selector.queryAll('.card');

// Behaves like a collection — same array methods as Collections
console.log(cards.length);          // how many
cards.forEach(card => { ... });     // iterate
const texts = cards.map(c => c.textContent);

// Has .update() — applies to all elements
cards.update({
  classList: { add: 'animated' },
  style:     { opacity: '1' }
});

// Navigate
const firstCard = cards.first();
const lastCard  = cards.last();
```

---

## `Selector.Scoped` — Search Inside a Container

`Selector.Scoped` runs a CSS selector query **within a specific container element** — not the entire document. This is the equivalent of `container.querySelector()` and `container.querySelectorAll()`.

### Why This Is Useful

```
Without scoping:
Selector.query('input')
   → searches entire document
   → might find the wrong input if there are many forms on the page

With scoping:
Selector.Scoped.within('#loginForm', 'input')
   → searches ONLY inside #loginForm
   → finds exactly the input you intended
```

### `Selector.Scoped.within(container, selector)` — One Element

```javascript
// container can be a CSS selector string or an HTMLElement:
const submitBtn = Selector.Scoped.within('#loginForm', 'button[type="submit"]');
const errorMsg  = Selector.Scoped.within('#loginForm', '.error-message');

// Using an element reference as the container:
const form  = Elements.loginForm;
const input = Selector.Scoped.within(form, 'input[name="email"]');
```

### `Selector.Scoped.withinAll(container, selector)` — All Matching Elements

```javascript
// All inputs inside a specific form
const formInputs = Selector.Scoped.withinAll('#signupForm', 'input, select, textarea');

// All active links inside a nav
const activeLinks = Selector.Scoped.withinAll('#mainNav', 'a.active');

// Update them
formInputs.update({ disabled: true });
```

### Real Example: Multi-Step Form Validation

```javascript
function validateStep(stepId) {
  // Only validate inputs IN this specific step
  const inputs = Selector.Scoped.withinAll('#' + stepId, 'input[required]');

  const allFilled = inputs.every(input => input.value.trim() !== '');

  // Only update the next button for THIS step
  const nextBtn = Selector.Scoped.within('#' + stepId, '.next-btn');
  if (nextBtn) {
    nextBtn.update({ disabled: !allFilled });
  }
}

validateStep('step1');
validateStep('step2');
```

---

## `Selector.update()` — Bulk Update with CSS Selectors

Updates multiple groups of elements — each targeted by a CSS selector — in a single call. This is the most powerful bulk-update method in the library.

### Syntax

```javascript
Selector.update({
  'css-selector-1': { /* update object */ },
  'css-selector-2': { /* update object */ }
});
```

### Example: Dark Mode Activation

```javascript
function activateDarkMode() {
  Selector.update({
    // Update by ID
    '#siteHeader': { style: { backgroundColor: '#1a1a2e' } },

    // Update by class
    '.card': {
      classList: { add: 'dark-mode' },
      style:     { backgroundColor: '#16213e', color: '#eee' }
    },

    // Update by tag + type
    'input, textarea': {
      style: { backgroundColor: '#0f3460', color: '#eee', borderColor: '#444' }
    },

    // Update by relationship
    'nav > ul > li > a': {
      style: { color: '#e94560' }
    }
  });
}
```

### The Return Value

```javascript
const results = Selector.update({
  '.btn':          { disabled: false },
  '#nonExistentId': { textContent: 'test' }
});

console.log(results['.btn']);
// { success: true, elements: ..., elementsUpdated: 3 }

console.log(results['#nonExistentId']);
// { success: true, elements: null, elementsUpdated: 0,
//   warning: 'No elements found matching selector' }
```

---

## Waiting for Elements — Async Methods

### `Selector.waitFor(selector, timeout)` — Wait for One Element

```javascript
// Wait up to 5 seconds (default) for an element to appear
const modal = await Selector.waitFor('.modal');

// Custom timeout (3 seconds)
const lazyContent = await Selector.waitFor('#lazy-content', 3000);
lazyContent.update({ classList: { add: 'visible' } });
```

### `Selector.waitForAll(selector, minCount, timeout)` — Wait for Multiple

```javascript
// Wait until at least 3 .card elements are in the DOM
const cards = await Selector.waitForAll('.card', 3);
cards.forEach(card => card.classList.add('loaded'));

// With custom timeout (10 seconds)
const items = await Selector.waitForAll('.item', 5, 10000);
```

---

## How Does Caching Work in Selector?

The Selector helper caches both `query` (single) and `queryAll` (multiple) results by selector string.

```
Selector.query('#hero h1') called first time:
   ↓
Creates cache key: "single:#hero h1"
   ↓
document.querySelector('#hero h1')  ← DOM lookup
   ↓
Element found → enhances with .update() → stores in cache
   ↓
Returns enhanced element

Selector.query('#hero h1') called again:
   ↓
Looks up "single:#hero h1" in cache
   ↓
Found! Is it still in document? → YES ✨
   ↓
Returns from cache (no DOM lookup)
```

### Why the Selector Cache Is More Conservative

Because CSS selectors can depend on many aspects of the DOM (structure, classes, attributes, pseudo-states), Selector uses a **more aggressive invalidation strategy**:

```
DOM structural change (nodes added/removed)
   → Entire cache cleared (can't know which selectors are affected)

Attribute change (id, class, style, hidden)
   → Selectors that reference those attributes are invalidated
```

The Selector cache clears more readily than Elements/Collections — because CSS selectors can be affected by so many DOM changes. This keeps results accurate.

### Cache Utilities

```javascript
// Check performance
const stats = Selector.stats();
console.log(stats.hitRate);           // 0.0 to 1.0
console.log(stats.selectorBreakdown);
// { id: 5, class: 12, tag: 3, attribute: 2, complex: 1 }
// Shows what types of selectors you're using most

// Clear cache
Selector.clear();
```

---

## Comparing All Three Helpers

Let's say you want to find a submit button. Here's how each helper approaches it:

```javascript
// 1. You know the ID → Elements (fastest, simplest)
Elements.submitBtn
// → Direct getElementById. Use this when you have an id.

// 2. You know the class → Collections (fast, great for groups)
Collections.ClassName['submit-btn'].first()
// → getElementsByClassName. Optimized in browsers.

// 3. You need CSS targeting → Selector (most flexible)
Selector.query('form button[type="submit"]')
// → querySelector. Handles any CSS relationship.
```

**The simple rule:**
- Know the ID? → `Elements`
- Need all elements of a class/tag/name? → `Collections`
- Need complex CSS targeting? → `Selector`

---

## Common Mistakes to Avoid

### ❌ Using query() When You Need queryAll()

```javascript
// Wrong — query returns ONE element only
const btns = Selector.query('.btn');
btns.forEach(btn => btn.textContent = 'Click'); // ❌ forEach doesn't exist on one element

// Right — use queryAll for multiple
const btns = Selector.queryAll('.btn');
btns.forEach(btn => btn.textContent = 'Click'); // ✅
```

### ❌ Not Checking for null After query()

```javascript
// Risky — query returns null if nothing matches
const el = Selector.query('.might-not-exist');
el.update({ textContent: 'test' }); // ❌ TypeError if el is null

// Good — check first
const el = Selector.query('.might-not-exist');
if (el) {
  el.update({ textContent: 'test' }); // ✅
}

// Also good — optional chaining
Selector.query('.might-not-exist')?.update({ textContent: 'test' }); // ✅
```

### ❌ Using Selector When Elements Would Be Simpler

```javascript
// Over-engineered — using Selector for an ID lookup
Selector.query('#submitBtn').update({ textContent: 'Done' });

// Simpler — use Elements for IDs
Elements.submitBtn.update({ textContent: 'Done' }); // ✅ More readable
```

### ❌ Using Collections Syntax Inside Selector

```javascript
// Wrong — "class:btn" is Collections syntax, not valid CSS
Selector.query('class:btn');   // ❌ Invalid selector

// Right — use proper CSS class selector
Selector.query('.btn');         // ✅
Selector.queryAll('.btn');      // ✅ for all
```

---

## Real-World Example: Scoped Form Validation

```javascript
async function submitForm(formId) {
  // Get all required fields INSIDE this specific form
  const requiredInputs = Selector.Scoped.withinAll('#' + formId, 'input[required], textarea[required]');

  // Validate each one
  const errors = [];
  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      errors.push(input.name || input.id || 'Unknown field');

      // Mark the field as invalid
      input.update({
        classList:    { add: 'field-error' },
        setAttribute: { 'aria-invalid': 'true' }
      });
    } else {
      // Mark as valid
      input.update({
        classList:    { remove: 'field-error' },
        setAttribute: { 'aria-invalid': 'false' }
      });
    }
  });

  if (errors.length > 0) {
    // Show error banner — scoped to this form
    const errorBanner = Selector.Scoped.within('#' + formId, '.error-banner');
    if (errorBanner) {
      errorBanner.update({
        textContent: `Please fill in: ${errors.join(', ')}`,
        style:       { display: 'block' }
      });
    }
    return false;
  }

  return true;
}
```

---

## Summary — Key Takeaways

1. **`Selector.query(css)`** — finds the **first** element matching a CSS selector; returns element or `null`
2. **`Selector.queryAll(css)`** — finds **all** elements matching; returns enhanced collection with `.update()` and array methods
3. **`Selector.Scoped.within(container, css)`** — search inside a specific container; scoped to avoid accidental matches
4. **`Selector.Scoped.withinAll(container, css)`** — find all matches inside a container
5. **`Selector.update({})`** — bulk update using CSS selectors as keys; returns per-selector results
6. **Caching is smart** — results are cached by selector string; cache clears when DOM structure changes
7. **`waitFor` / `waitForAll`** — async methods to wait for dynamically injected content
8. **Full CSS power** — combinators, pseudo-classes, attribute selectors, complex chains — anything valid CSS can do
9. **Use Selector when** you need complex targeting; when `Elements` (ID) or `Collections` (class/tag/name) aren't precise enough

---

## What's Next?

Now let's go deep on the thing that ties all three helpers together: the **`.update()` method** — the universal DOM update system that every element and collection receives.

Continue to **[05 — The .update() Method](./05_the-update-method.md)** →