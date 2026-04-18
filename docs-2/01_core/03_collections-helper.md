[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# The Collections Helper

Now that you understand `Elements` — your tool for accessing one specific element by its ID — let's talk about `Collections`. This is your tool for working with **groups of elements** that share a common trait.

If you've ever written a loop like `document.querySelectorAll('.btn').forEach(...)`, Collections replaces that pattern with something much cleaner.

---

## Quick Start (30 Seconds)

```html
<button class="btn">Save</button>
<button class="btn">Cancel</button>
<button class="btn">Delete</button>

<p>First paragraph</p>
<p>Second paragraph</p>

<input name="email" type="email">
<input name="password" type="password">
```

```javascript
// All elements with class "btn" — one call, all of them
Collections.ClassName.btn.update({ disabled: true });

// All <p> tags on the page
Collections.TagName.p.update({ style: { lineHeight: '1.6' } });

// All inputs with name="email"
Collections.Name.email.update({ style: { border: '2px solid red' } });

// Or update everything at once with a single call
Collections.update({
  'class:btn':   { disabled: false },
  'tag:p':       { style: { lineHeight: '1.6' } },
  'name:email':  { disabled: false }
});
```

---

## What is the Collections Helper?

**The Collections Helper** lets you access **groups of DOM elements** — all elements that share a class name, tag name, or `name` attribute — and work with all of them at once.

Think of it as the difference between:

- **Elements** — *"Give me this specific employee by name"* (one element by ID)
- **Collections** — *"Give me everyone in the Marketing department"* (many elements by shared trait)

When you need to disable all form inputs, highlight all selected cards, or style all headings at once, Collections is the right tool.

```
Elements    → One specific element, by ID
Collections → A group of elements, by shared class / tag / name
Selector    → Any elements, by CSS selector
```

---

## The Three Sub-Helpers

Collections has three sub-helpers, each using a different native DOM lookup:

### `Collections.ClassName` — By CSS Class

Finds all elements that have a specific CSS class. Internally uses `getElementsByClassName()` — the fastest DOM lookup for classes.

```javascript
// All elements with class "active"
Collections.ClassName.active

// All elements with class "btn-primary" (bracket notation for hyphens)
Collections.ClassName['btn-primary']

// Three identical ways to write the same thing:
Collections.ClassName.card              // property access
Collections.ClassName['card']           // bracket notation
Collections.ClassName('card')           // function call
```

---

### `Collections.TagName` — By HTML Tag

Finds all elements of a specific tag type. Internally uses `getElementsByTagName()`.

```javascript
// All <button> elements
Collections.TagName.button

// All <input> elements
Collections.TagName.input

// All <p> elements
Collections.TagName.p

// All <div> elements
Collections.TagName.div
```

---

### `Collections.Name` — By name Attribute

Finds all elements with a specific `name` attribute. Common with form elements. Internally uses `getElementsByName()`.

```javascript
// <input name="username">
Collections.Name.username

// <select name="country">
Collections.Name.country

// <input name="agree" type="checkbox">
Collections.Name.agree
```

---

## Why Does This Exist?

### When Working with Individual Elements is the Starting Point

For elements you know by name, `Elements` is perfect:

```javascript
// Direct, clean access to specific elements
const title  = Elements.pageTitle;
const header = Elements.siteHeader;

title.textContent = 'Welcome!';
header.style.backgroundColor = '#333';
```

This approach is **great when you need**:
✅ One specific element you know by ID
✅ Maximum speed — getElementById is the fastest DOM query
✅ The element is unique on the page

### When Working with Groups Is a Better Fit

In scenarios where you need to affect multiple related elements at once, `Collections` provides a more direct approach:

```javascript
// Without Collections — manual loop
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
  btn.disabled = true;
  btn.classList.add('loading');
});

// With Collections — one expressive call
Collections.ClassName.btn.update({
  disabled:  true,
  classList: { add: 'loading' }
});
```

**Collections is especially useful when:**
✅ You need to affect all elements of a type (disable all inputs, hide all modals)
✅ Your elements share a class, tag, or name — no need for IDs
✅ You want to chain operations across an entire group
✅ You want array methods (`forEach`, `map`, `filter`) on your element groups

**The Choice is Yours:**
- Use `Elements` when you need one specific element by its ID
- Use `Collections` when you need to work with all elements sharing a trait
- Both approaches complement each other and are often used together

---

## Mental Model — Departments in a Company

Imagine your page as a company. Every element is an employee.

- **Elements** is the HR directory — you find *one specific person* by their employee ID
- **Collections** is the org chart — you find *everyone in a department* by their department name

```
Elements.submitBtn
   → "Give me the employee with badge ID 'submitBtn'"

Collections.ClassName.btn
   → "Give me everyone in the 'btn' department"
   → Returns a group of all matching elements
   → You can issue instructions to the whole group at once
```

When you call `.update()` on a collection, every member of that group gets the same instruction applied.

---

## How Does It Work? — Under the Hood

### The Double Proxy System

Collections uses a two-layer proxy:

```
Layer 1: Access proxy
   Collections.ClassName.btn
         ↓
   Proxy intercepts: "accessed .btn on ClassName"
         ↓
   Calls: _getCollection('className', 'btn')
         ↓
   Returns: Enhanced collection proxy (with .update() and array methods)

Layer 2: Index access proxy (for the elements inside)
   const collection = Collections.ClassName.btn;
   collection[0]  ← returns the first .btn element (enhanced)
   collection[1]  ← returns the second .btn element
```

### Live Collections

The underlying `getElementsByClassName()`, `getElementsByTagName()`, and `getElementsByName()` return **live HTMLCollections** — they automatically reflect DOM changes. DOMHelpers Core wraps these in a cache for performance, but the underlying live collection is always preserved.

```
HTMLCollection (live, from DOM API)
   ↓ wrapped by
Enhanced Collection (cached by DOMHelpers, adds .update() and array methods)
   ↓
Your code: Collections.ClassName.btn.forEach(el => ...)
```

---

## Working with Collections — All Available Methods

Once you get a collection back, it has **array-like methods** AND **DOM manipulation helpers** AND `.update()` — all built in.

### Array Methods — Iterate and Transform

```javascript
const cards = Collections.ClassName.card;

// forEach — iterate over all elements
cards.forEach((el) => {
  console.log(el.textContent);
});

// map — transform each element into a new array
const texts = cards.map((el) => el.textContent);
// → ['Card 1', 'Card 2', 'Card 3']

// filter — narrow down elements
const activeCards = cards.filter((el) => el.classList.contains('active'));

// find — get the first matching element
const firstActive = cards.find((el) => el.classList.contains('active'));

// some — check if any element matches
const hasActiveCard = cards.some((el) => el.classList.contains('active'));

// every — check if all elements match
const allVisible = cards.every((el) => el.style.display !== 'none');

// reduce — compute a value across all elements
const totalHeight = cards.reduce((sum, el) => sum + el.offsetHeight, 0);

// toArray — get a plain JavaScript array
const asArray = cards.toArray();  // [ HTMLElement, HTMLElement, ... ]
```

---

### Utility Methods — Navigate the Collection

```javascript
const items = Collections.ClassName.item;

items.first()     // → first element or null
items.last()      // → last element or null
items.at(2)       // → element at index 2
items.at(-1)      // → last element (negative indexing)
items.isEmpty()   // → true if no elements found
items.length      // → count of elements
items.item(0)     // → element at index 0
```

---

### DOM Manipulation Helpers — Chainable

These methods apply an action to **every element** in the collection. They all return the collection, so you can chain them:

```javascript
const buttons = Collections.ClassName.btn;

// Add class to ALL elements
buttons.addClass('highlighted');

// Remove class from ALL elements
buttons.removeClass('loading');

// Toggle class on ALL elements
buttons.toggleClass('active');

// Set a property on ALL elements
buttons.setProperty('disabled', true);

// Set an attribute on ALL elements
buttons.setAttribute('data-role', 'action');

// Set styles on ALL elements
buttons.setStyle({ color: 'white', backgroundColor: '#007bff' });

// Add event listener to ALL elements
buttons.on('click', (e) => {
  console.log('Button clicked:', e.target.textContent);
});

// Remove event listener from ALL elements
buttons.off('click', myHandler);
```

**Chaining — all helpers return the collection:**

```javascript
Collections.ClassName.btn
  .addClass('ready')
  .setProperty('disabled', false)
  .setStyle({ opacity: '1' });
```

---

### Filter Helpers — Narrow Down by State

```javascript
const inputs = Collections.TagName.input;

// Only visible elements
const visibleInputs  = inputs.visible();

// Only hidden elements
const hiddenInputs   = inputs.hidden();

// Only enabled elements
const enabledInputs  = inputs.enabled();

// Only disabled elements
const disabledInputs = inputs.disabled();
```

---

### The `.update()` Method — The Most Powerful Option

`.update()` applies the same update object to **every element** in the collection:

```javascript
Collections.ClassName.card.update({
  style: {
    border:       '2px solid blue',
    borderRadius: '8px',
    padding:      '16px'
  },
  classList: {
    add:    'highlight',
    remove: 'default'
  }
});
```

This single call updates **every element** in the `.card` collection.

---

### Indexed Access — Like an Array

Collections also support index access:

```javascript
const cards = Collections.ClassName.card;

console.log(cards[0]);      // First card element
console.log(cards[1]);      // Second card element
console.log(cards.length);  // Number of cards

// Iterate with for...of
for (const card of cards) {
  console.log(card.textContent);
}
```

---

## `Collections.update()` — Bulk Update Multiple Collections

`Collections.update()` lets you update multiple different collections in a single call using a special identifier format:

```javascript
Collections.update({
  'class:identifier':  { /* update object */ },
  'tag:tagName':       { /* update object */ },
  'name:nameValue':    { /* update object */ }
});
```

### The Identifier Format

| Prefix | Example | What it finds |
|--------|---------|--------------|
| `class:` | `'class:btn'` | All elements with class `btn` |
| `classname:` | `'classname:card'` | Alias for `class:` |
| `tag:` | `'tag:p'` | All `<p>` elements |
| `tagname:` | `'tagname:div'` | Alias for `tag:` |
| `name:` | `'name:email'` | All elements with `name="email"` |
| *(no prefix)* | `'btn'` | Treated as class name |

### Example: Resetting a Form

```html
<input class="form-input" name="username">
<input class="form-input" name="email">
<input class="form-input" name="password">
<button class="form-btn" type="submit">Submit</button>
<button class="form-btn" type="reset">Reset</button>
<p class="error-msg" style="display: none;"></p>
```

```javascript
// Reset the entire form in one call
Collections.update({
  'class:form-input': {
    value:     '',
    disabled:  false,
    classList: { remove: 'error', add: 'default' }
  },
  'class:form-btn': {
    disabled:  false,
    classList: { remove: 'loading' }
  },
  'class:error-msg': {
    textContent: '',
    style:       { display: 'none' }
  }
});
```

### The Return Value

```javascript
const results = Collections.update({
  'class:btn':            { disabled: true },
  'tag:nonexistentTag':   { textContent: 'test' }
});

console.log(results['class:btn']);
// { success: true, collection: ..., elementsUpdated: 3 }

console.log(results['tag:nonexistentTag']);
// { success: true, collection: ..., elementsUpdated: 0, warning: "Collection is empty" }
```

---

## Real-World Examples

### Example 1: Disable All Form Inputs During Submit

```javascript
async function submitForm(formData) {
  // Disable everything while submitting
  Collections.update({
    'class:form-field': { disabled: true },
    'class:form-btn':   { disabled: true, classList: { add: 'submitting' } }
  });

  try {
    await fetch('/api/submit', { method: 'POST', body: formData });
    // Success
    Collections.ClassName['form-btn'].update({
      classList: { add: 'success', remove: 'submitting' }
    });
  } catch (err) {
    // Error — re-enable everything
    Collections.update({
      'class:form-field': { disabled: false },
      'class:form-btn':   { disabled: false, classList: { remove: 'submitting' } }
    });
  }
}
```

---

### Example 2: Highlight the Selected Item in a List

```javascript
function selectItem(selectedId) {
  // Remove selection from all items
  Collections.ClassName.item.removeClass('selected');

  // Add selection to the clicked one
  Collections.ClassName.item
    .find(el => el.dataset.id === selectedId)
    ?.classList.add('selected');
}
```

---

### Example 3: Make All Images Lazy-Load

```javascript
// Add loading="lazy" to every image on the page
Collections.TagName.img.setAttribute('loading', 'lazy');
```

---

### Example 4: Count Visible Cards

```javascript
const cards = Collections.ClassName.card;
const visibleCount = cards.visible().length;
console.log(`${visibleCount} of ${cards.length} cards showing`);
```

---

### Example 5: Attach Click Handler to All Menu Items

```javascript
Collections.ClassName['menu-item'].on('click', function(e) {
  // Remove active from all
  Collections.ClassName['menu-item'].removeClass('active');
  // Add to clicked
  e.target.classList.add('active');
});
```

---

## Cache Management

Like `Elements`, Collections caches its lookups using keys like `className:btn` or `tagName:div`.

A MutationObserver watches for:
- Elements being added or removed → affected caches invalidated
- `class` attribute changes → `className:*` caches invalidated
- `name` attribute changes → `name:*` caches invalidated

```javascript
// Check performance
const stats = Collections.stats();
console.log(stats.hitRate); // e.g., 0.75 = 75% cache hit rate

// Force clear cache
Collections.clear();

// Check if a specific collection is cached
Collections.isCached('className', 'btn'); // true or false
```

---

## Common Mistakes to Avoid

### ❌ Using Collections When You Need One Specific Element

```javascript
// Over-engineered — using Collections for a single known element
Collections.ClassName.submitBtn.first().textContent = 'Done';

// Simpler — use Elements for IDs
Elements.submitBtn.textContent = 'Done'; // ✅
```

### ❌ Forgetting to Handle Empty Collections

```javascript
// Risky — .first() returns null if collection is empty
const first = Collections.ClassName.card.first();
first.textContent = 'First card'; // TypeError if no .card elements!

// Good — check first
const first = Collections.ClassName.card.first();
if (first) {
  first.textContent = 'First card';
}
```

### ❌ Mixing Up Class and ID Access

```javascript
// Wrong — elements don't have a class named "submitBtn" here
// HTML: <button id="submitBtn">
Collections.ClassName.submitBtn; // ❌ This won't find the button by ID

// Right — use Elements for IDs
Elements.submitBtn; // ✅
```

---

## Summary — Key Takeaways

1. **Three sub-helpers** — `ClassName`, `TagName`, and `Name` — each maps to a native DOM method
2. **All return enhanced collections** with `.update()`, array methods, and DOM helpers
3. **`Collections.update({})`** — bulk update multiple collections using `'class:'`, `'tag:'`, `'name:'` prefixes
4. **Array methods** — `forEach`, `map`, `filter`, `find`, `some`, `every`, `reduce` — same as native Array
5. **Utility methods** — `first()`, `last()`, `at()`, `isEmpty()`, `toArray()`
6. **DOM helpers** — `addClass()`, `removeClass()`, `toggleClass()`, `setStyle()`, `on()`, `off()` — all chainable
7. **Filter helpers** — `visible()`, `hidden()`, `enabled()`, `disabled()` — returns subsets
8. **Indexed access** — `collection[0]`, `collection[1]`, iterable with `for...of`
9. **Smart caching** — same mechanism as Elements, with automatic class/name-based invalidation

---

## What's Next?

Now let's explore the third helper — **Selector** — the most flexible of the three. It gives you the full power of CSS selectors: combinators, pseudo-classes, attribute selectors, and complex chains.

Continue to **[04 — The Selector Helper](./04_selector-helper.md)** →