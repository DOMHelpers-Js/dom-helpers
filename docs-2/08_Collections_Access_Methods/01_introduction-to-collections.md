[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Introduction to the Collections Helper

## Quick Start (30 Seconds)

Copy this and run it — you'll instantly understand what Collections does:

```javascript
// Get all buttons with class "btn" — all of them, at once
const buttons = Collections.ClassName.btn;

// Loop over them just like a regular array
buttons.forEach(btn => {
  console.log(btn.textContent);
});
// Output:
// Save
// Cancel
// Delete

// Or apply a class to ALL of them in one line
buttons.addClass('loading');

// Or chain multiple operations together
buttons.addClass('loading').setProperty('disabled', true);
// Every button is now loading AND disabled ✨
```

That's it. Collections gives you **all elements of a type**, ready to use like an array — with bonus superpowers built in.

---

## What Is the Collections Helper?

The **Collections Helper** is a tool that finds and returns **groups of DOM elements** — multiple elements at once.

Think of it this way:

- The **Elements Helper** is for **one specific element** (like finding a person by their ID card)
- The **Collections Helper** is for **a group of elements** (like finding everyone who wears a blue uniform)

It gives you three ways to find groups:

| Collection Type | Finds Elements By... | Example |
|----------------|---------------------|---------|
| `Collections.ClassName` | CSS class name | All elements with class `"btn"` |
| `Collections.TagName` | HTML tag type | All `<p>` tags on the page |
| `Collections.Name` | `name` attribute | All inputs with `name="email"` |

**What you get back** is an **enhanced collection** — something that works like an array (you can use `.forEach`, `.map`, `.filter` on it directly) but also has extra built-in methods like `.addClass()`, `.setStyle()`, and `.on()`.

---

## Syntax

```javascript
// Property access style (recommended — most readable)
Collections.ClassName.btn          // All elements with class "btn"
Collections.TagName.p              // All <p> elements
Collections.Name.email             // All elements with name="email"

// Method call style (useful for dynamic names or hyphenated names)
Collections.ClassName('btn')       // Same as above
Collections.TagName('p')           // Same as above
Collections.Name('email')          // Same as above

// Hyphenated class names — must use bracket notation or method call
Collections.ClassName['user-card'] // All elements with class "user-card"
Collections.ClassName('user-card') // Exact same result
```

**Simple Rule:** Use property access (`Collections.ClassName.btn`) for simple names. Use bracket notation (`Collections.ClassName['user-card']`) or the method call style when the name has hyphens.

---

## Why Does the Collections Helper Exist?

### The Challenge with Native DOM Collection Methods

JavaScript already has `getElementsByClassName`, `getElementsByTagName`, and `getElementsByName`. They work — but they have some rough edges that make everyday use a little clunky.

```javascript
// Step 1: Get all buttons (the native way)
const buttons = document.getElementsByClassName('btn');

// Step 2: Try to use a forEach...
buttons.forEach(btn => btn.disabled = true);
// ❌ TypeError: buttons.forEach is not a function
// HTMLCollection doesn't support array methods!

// Step 3: You have to convert it first
const buttonArray = Array.from(buttons);
buttonArray.forEach(btn => btn.disabled = true);
// ✅ Works... but you had to add an extra step every time

// Step 4: What about applying multiple operations?
buttonArray.forEach(btn => btn.classList.add('loading'));
buttonArray.forEach(btn => btn.style.opacity = '0.5');
// Two separate loops for two operations...
```

**What's happening here?**

```
Native HTMLCollection
    ↓
document.getElementsByClassName('btn')
    ↓
Returns HTMLCollection (NOT an array)
    ↓
Can't use .forEach, .map, .filter directly ❌
    ↓
Must convert with Array.from() first ❌
    ↓
No built-in bulk methods (addClass, setStyle) ❌
    ↓
No caching — every call re-queries the DOM ❌
    ↓
Live collection — changes unexpectedly as DOM mutates ❌
```

**The problems:**
❌ Not a real array — can't use `.forEach`, `.map`, `.filter` directly
❌ Verbose conversion step required every time
❌ No built-in bulk operations — must loop manually for each change
❌ No caching — re-queries DOM on every access
❌ Live updates — the collection can change mid-iteration, causing bugs

### The Collections Helper Solution

```javascript
// Step 1: Get all buttons
const buttons = Collections.ClassName.btn;

// Step 2: Array methods work directly — no conversion needed
buttons.forEach(btn => btn.disabled = true);   // ✅ Works!
buttons.map(btn => btn.textContent);            // ✅ Works!
buttons.filter(btn => !btn.disabled);           // ✅ Works!

// Step 3: Built-in bulk methods too
buttons.addClass('loading')                     // ✅ Adds class to ALL
       .setStyle({ opacity: '0.5' })            // ✅ Styles ALL
       .setProperty('disabled', true);          // ✅ Sets property on ALL
// All in one chained expression!
```

**What changed:**

```
Collections Helper
    ↓
Collections.ClassName.btn
    ↓
Returns Enhanced Collection (array-like)
    ↓
All array methods work natively ✅
    ↓
Built-in bulk methods (addClass, setStyle, on) ✅
    ↓
Automatic caching — instant on repeat access ✅
    ↓
Static snapshot — won't change mid-iteration ✅
```

**Benefits:**
✅ Array methods work directly — no conversion needed
✅ Built-in bulk operations — one call updates all elements
✅ Clean, readable property access syntax
✅ Automatic caching — first access queries DOM, subsequent ones are instant
✅ Static snapshot — safe to iterate without surprise changes
✅ Chainable — stack multiple operations in one expression

---

## Mental Model

**Think of it like a Staff Roster at a company.**

Imagine a company with many employees. The HR manager has different rosters:

- **"Everyone in the Sales department"** → like `Collections.ClassName.sales-team`
- **"Everyone with the title 'Engineer'"** → like `Collections.TagName.engineer` (if it were a tag)
- **"Everyone named on the 'Project Alpha' roster"** → like `Collections.Name.projectAlpha`

When the HR manager gets a roster, they can:
- **Read it** — see who's on it (`.forEach`, `.map`)
- **Ask questions** — "Is anyone absent?" (`.some`, `.every`)
- **Find someone specific** — "Who's the first one here?" (`.first()`, `.find()`)
- **Issue a bulk instruction** — "Everyone on this list, attend the meeting" (`.on()`, `.addClass()`)

The roster is a **snapshot** — it was printed this morning. If someone joins the company today, they won't appear on this morning's roster. That's intentional — it prevents the roster from changing while you're reading it.

```
Company Roster System          Collections Helper
─────────────────────          ──────────────────
HR creates roster          →   Collections.ClassName.btn
Printed snapshot           →   Static collection (no mid-iteration changes)
Bulk instruction to all    →   .addClass(), .setStyle(), .on()
Find one person            →   .first(), .find(), .at(2)
Check if anyone is present →   .isEmpty(), .some(), .every()
New hires not on roster    →   New DOM elements don't appear automatically
Get updated roster         →   Access again: Collections.ClassName.btn
```

---

## How Does It Work?

Under the hood, Collections uses a **Proxy + Map cache** system. Here's exactly what happens when you write `Collections.ClassName.btn`:

```
You write: Collections.ClassName.btn
                    ↓
        Proxy intercepts the property access
                    ↓
        Checks the cache: is 'class:btn' already stored?
           ↓                              ↓
        CACHE HIT                     CACHE MISS
        (used before)                 (first time)
           ↓                              ↓
        Returns instantly          Runs DOM query:
        from Map cache             document.getElementsByClassName('btn')
                                          ↓
                                   Converts to static array
                                   (no more live updates)
                                          ↓
                                   Wraps in Enhanced Collection
                                   (adds forEach, addClass, setStyle, etc.)
                                          ↓
                                   Stores in Map cache for next time
                                          ↓
                                   Returns Enhanced Collection
```

**What is the Enhanced Collection?**

It's an object that:
- Looks and behaves like an array (has `.length`, supports `[0]`, `[1]`, etc.)
- Has all standard array methods built in (`.forEach`, `.map`, `.filter`, `.find`, `.some`, `.every`, `.reduce`)
- Has extra DOM-specific methods (`.addClass`, `.removeClass`, `.setStyle`, `.setProperty`, `.setAttribute`, `.on`, `.off`)
- Has utility methods (`.first()`, `.last()`, `.at()`, `.isEmpty()`)
- Has filtering methods (`.visible()`, `.hidden()`, `.enabled()`, `.disabled()`)

**Static vs Live — Why It Matters:**

```javascript
// Native HTMLCollection — LIVE (dangerous during iteration)
const nativeButtons = document.getElementsByClassName('btn');
nativeButtons.forEach((btn, i) => {
  if (i === 1) {
    document.body.removeChild(btn); // Remove an element mid-loop
    // Now the collection shifts — button at index 2 is now at index 1
    // You might skip elements or process the wrong ones!
  }
});

// Collections — STATIC SNAPSHOT (safe)
const buttons = Collections.ClassName.btn;
// This is a frozen snapshot of the DOM at access time.
// Removing or adding elements to the DOM won't change `buttons`.
buttons.forEach((btn, i) => {
  if (i === 1) {
    btn.remove(); // Safe — the snapshot stays the same
    // forEach still runs for all original elements
  }
});
```

**The Caching System:**

```javascript
// First access — DOM is queried and result is cached
const buttons1 = Collections.ClassName.btn;
// Under the hood: cache miss → DOM query → store in cache

// Second access — returns from cache instantly
const buttons2 = Collections.ClassName.btn;
// Under the hood: cache hit → return stored collection (no DOM query)

// They are the same reference
console.log(buttons1 === buttons2); // true

// Cache is automatically invalidated when DOM changes
// (using a MutationObserver that watches for structural DOM changes)
```

---

## Three Collection Types

### 1. `Collections.ClassName` — By CSS Class

**Best for:** Groups of elements that share a styling class — cards, buttons, list items, tabs, form fields.

```html
<div class="card">Card 1</div>
<div class="card">Card 2</div>
<div class="card">Card 3</div>
```

```javascript
// Property access — simple class names
const cards = Collections.ClassName.card;

// Bracket notation — hyphenated class names
const userCards = Collections.ClassName['user-card'];

// How many cards are there?
console.log(cards.length); // 3

// Apply a style to all cards
cards.setStyle({
  padding: '20px',
  borderRadius: '8px'
});

// Add a click listener to all cards at once
cards.on('click', function() {
  console.log('Card clicked:', this.textContent);
});
```

**When to use ClassName:**
✅ Elements styled with a shared CSS class
✅ Groups like buttons, cards, list items, tabs
✅ The most common collection type

---

### 2. `Collections.TagName` — By HTML Tag

**Best for:** Targeting all elements of a given tag type — all paragraphs, all images, all links, all inputs.

```html
<p>First paragraph</p>
<p>Second paragraph</p>
<p>Third paragraph</p>
```

```javascript
const paragraphs = Collections.TagName.p;

console.log(paragraphs.length); // 3

// Set a style on all paragraphs
paragraphs.setStyle({
  lineHeight: '1.6',
  color: '#333'
});

// Make all external links open in a new tab
const links = Collections.TagName.a;
links.setAttribute('target', '_blank')
     .setAttribute('rel', 'noopener noreferrer');
```

**When to use TagName:**
✅ Targeting all elements of a specific HTML type
✅ Semantic operations (all links, all images, all inputs)
✅ When elements don't have a shared class

---

### 3. `Collections.Name` — By Name Attribute

**Best for:** Form elements that share a `name` attribute — radio button groups, checkbox groups, repeated input fields.

```html
<input type="radio" name="color" value="red"> Red
<input type="radio" name="color" value="blue"> Blue
<input type="radio" name="color" value="green"> Green
```

```javascript
const colorOptions = Collections.Name.color;

console.log(colorOptions.length); // 3

// Find which radio is currently selected
const selected = colorOptions.find(radio => radio.checked);
console.log('Selected color:', selected?.value);
// Output: "Selected color: blue" (or whichever is checked)

// Listen for any change in the group
colorOptions.on('change', () => {
  const now = colorOptions.find(r => r.checked);
  console.log('New selection:', now.value);
});
```

**When to use Name:**
✅ Radio button groups
✅ Checkbox groups
✅ Multiple form inputs sharing the same `name`

---

## Key Features

### Feature 1: Array Methods Work Natively

You don't need `Array.from()` — all standard array methods work directly on the collection.

```javascript
const buttons = Collections.ClassName.btn;

// forEach — run code for each element
buttons.forEach((btn, index) => {
  console.log(`Button ${index}:`, btn.textContent);
});
// Output:
// Button 0: Save
// Button 1: Cancel
// Button 2: Delete

// map — extract data from each element
const texts = buttons.map(btn => btn.textContent);
console.log(texts); // ['Save', 'Cancel', 'Delete']

// filter — get only elements that match a condition
const enabled = buttons.filter(btn => !btn.disabled);
console.log('Enabled buttons:', enabled.length);

// find — get the first element that matches
const saveBtn = buttons.find(btn => btn.textContent === 'Save');
console.log('Save button found:', saveBtn !== undefined); // true

// some — check if any element matches
const hasDisabled = buttons.some(btn => btn.disabled);
console.log('Any disabled?', hasDisabled); // true or false

// every — check if all elements match
const allEnabled = buttons.every(btn => !btn.disabled);
console.log('All enabled?', allEnabled); // true or false
```

---

### Feature 2: Bulk DOM Operations

Instead of manually looping to update each element, Collections has built-in methods that apply the change to **all elements at once**.

```javascript
const cards = Collections.ClassName.card;

// Add a CSS class to ALL cards
cards.addClass('highlighted');
// Every card now has class="card highlighted"

// Remove a CSS class from ALL cards
cards.removeClass('highlighted');

// Toggle a CSS class on ALL cards
cards.toggleClass('selected');

// Set a property on ALL cards
cards.setProperty('draggable', true);
// Every card is now draggable

// Set an attribute on ALL cards
cards.setAttribute('data-status', 'ready');

// Set styles on ALL cards
cards.setStyle({
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
});

// Add an event listener to ALL cards
cards.on('click', function() {
  this.classList.toggle('selected');
});
```

---

### Feature 3: Method Chaining

All bulk methods return the collection, so you can chain them:

```javascript
// All in one clean expression
Collections.ClassName.card
  .addClass('active')
  .setStyle({ opacity: '1', transform: 'scale(1)' })
  .setAttribute('aria-selected', 'true')
  .on('click', handleCardClick);
// Done! All four operations applied to every card.
```

**What's happening:**
1. `Collections.ClassName.card` → returns the collection
2. `.addClass('active')` → adds class, then **returns the collection**
3. `.setStyle({...})` → sets style, then **returns the collection**
4. `.setAttribute(...)` → sets attribute, then **returns the collection**
5. `.on(...)` → adds listener, then **returns the collection**

Because each method returns the same collection, you can keep chaining.

---

### Feature 4: Automatic Caching

The first access queries the DOM. Every subsequent access returns the cached result instantly — no repeated DOM queries.

```javascript
// First access — queries DOM (slightly slower)
const cards = Collections.ClassName.card;
// Cache stores: 'class:card' → [card1, card2, card3]

// Second access — returns from cache (instant)
const sameCards = Collections.ClassName.card;

// Proof they are the same
console.log(cards === sameCards); // true

// Performance comparison
console.time('no-cache');
for (let i = 0; i < 1000; i++) {
  document.getElementsByClassName('btn'); // Queries DOM every time
}
console.timeEnd('no-cache'); // ~15ms

console.time('with-cache');
for (let i = 0; i < 1000; i++) {
  Collections.ClassName.btn; // Returns from cache after first
}
console.timeEnd('with-cache'); // ~1ms — about 15x faster
```

---

## Real-World Example: Todo List

Let's see Collections in action on a realistic page. Here's the HTML:

```html
<div class="todo-list">
  <div class="todo-item">
    <input type="checkbox" name="todo" class="todo-checkbox">
    <span class="todo-text">Buy groceries</span>
    <button class="todo-delete">Delete</button>
  </div>
  <div class="todo-item">
    <input type="checkbox" name="todo" class="todo-checkbox">
    <span class="todo-text">Walk the dog</span>
    <button class="todo-delete">Delete</button>
  </div>
  <div class="todo-item">
    <input type="checkbox" name="todo" class="todo-checkbox">
    <span class="todo-text">Read a book</span>
    <button class="todo-delete">Delete</button>
  </div>
</div>
```

### Before — Native JavaScript (verbose)

```javascript
// 1. Get all checkboxes and add listeners
const checkboxes = document.querySelectorAll('.todo-checkbox');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    const item = this.closest('.todo-item');
    if (this.checked) {
      item.classList.add('completed');
    } else {
      item.classList.remove('completed');
    }
  });
});

// 2. Get all delete buttons and add listeners
const deleteButtons = document.querySelectorAll('.todo-delete');
deleteButtons.forEach(button => {
  button.addEventListener('click', function() {
    this.closest('.todo-item').remove();
  });
});

// 3. "Mark All Complete" function
function completeAll() {
  document.querySelectorAll('.todo-item').forEach(item => {
    item.classList.add('completed');
  });
  document.querySelectorAll('.todo-checkbox').forEach(cb => {
    cb.checked = true;
  });
}
```

**What's tedious here:** Multiple `querySelectorAll` calls, multiple `forEach` loops, repetitive code patterns.

---

### After — Collections Helper (clean)

```javascript
// 1. Get collections once
const checkboxes = Collections.ClassName['todo-checkbox'];
const items = Collections.ClassName['todo-item'];
const deleteButtons = Collections.ClassName['todo-delete'];

// 2. Set up checkbox listeners — one line per concern
checkboxes.on('change', function() {
  const item = this.closest('.todo-item');
  item.classList.toggle('completed', this.checked);
});

// 3. Set up delete listeners — one line
deleteButtons.on('click', function() {
  this.closest('.todo-item').remove();
});

// 4. "Mark All Complete" — two lines, no loops
function completeAll() {
  items.addClass('completed');
  checkboxes.setProperty('checked', true);
}
```

**Much cleaner!** Collections eliminated the repetitive loops and made the intent clear.

---

## Collections vs Elements — When to Use Each

| Situation | Use | Example |
|-----------|-----|---------|
| One specific element with a unique ID | Elements | `Elements.mainHeader` |
| All buttons on the page | Collections.ClassName | `Collections.ClassName.btn` |
| All `<p>` tags on the page | Collections.TagName | `Collections.TagName.p` |
| All radio buttons in a group | Collections.Name | `Collections.Name.color` |
| Applying the same change to multiple elements | Collections | Any of the three above |
| Updating one specific element | Elements | `Elements.submitButton` |

**Quick decision rule:**

```javascript
// Multiple similar elements? → Collections
<div class="card">...</div>
<div class="card">...</div>
<div class="card">...</div>
const cards = Collections.ClassName.card;

// Single specific element? → Elements
<header id="mainHeader">...</header>
const header = Elements.mainHeader;
```

---

## Performance

### Caching Makes Repeat Access Fast

```javascript
// Without Collections — 1,000 DOM queries
console.time('no-cache');
for (let i = 0; i < 1000; i++) {
  const btns = document.getElementsByClassName('btn');
  // DOM is queried every single time
}
console.timeEnd('no-cache'); // ~15ms

// With Collections — 1 DOM query + 999 cache hits
console.time('with-cache');
for (let i = 0; i < 1000; i++) {
  const btns = Collections.ClassName.btn;
  // Only the first iteration queries DOM — rest hit cache
}
console.timeEnd('with-cache'); // ~1ms (15x faster)
```

### Static Snapshots Prevent Iteration Bugs

```javascript
const items = Collections.ClassName.item;
console.log(items.length); // 5

// Add new item to the DOM
document.body.innerHTML += '<div class="item">New Item</div>';

// The snapshot doesn't change
console.log(items.length); // Still 5 — snapshot from before the addition

// Access again to get the updated list
const updatedItems = Collections.ClassName.item;
console.log(updatedItems.length); // 6
```

This is intentional. During a loop, you don't want the collection to grow or shrink unexpectedly. Access again when you specifically want a fresh count.

---

## Complete Feature Overview

**Access Methods:**
- ✅ `Collections.ClassName` — Get elements by CSS class
- ✅ `Collections.TagName` — Get elements by HTML tag
- ✅ `Collections.Name` — Get elements by name attribute

**Array-Like Methods (work natively):**
- ✅ `forEach`, `map`, `filter`, `find`, `findIndex`
- ✅ `some`, `every`, `reduce`
- ✅ `toArray()` — Convert to a plain JavaScript array

**Bulk DOM Methods (apply to all elements at once):**
- ✅ `addClass`, `removeClass`, `toggleClass`
- ✅ `setProperty`, `setAttribute`, `setStyle`
- ✅ `on`, `off` — Event listeners

**Filtering Methods:**
- ✅ `visible()` — Only visible elements
- ✅ `hidden()` — Only hidden elements
- ✅ `enabled()` — Only enabled form elements
- ✅ `disabled()` — Only disabled form elements

**Utility Methods:**
- ✅ `first()`, `last()` — Get the first or last element
- ✅ `at(index)` — Get by index (supports negative indices like `-1` for last)
- ✅ `isEmpty()` — Check if collection is empty
- ✅ `item(index)`, `namedItem(name)` — Legacy access

**Helper Methods:**
- ✅ `stats()` — Cache performance statistics
- ✅ `clear()` — Manually clear the cache
- ✅ `destroy()` — Clean up all resources
- ✅ `isCached(type, value)` — Check if a collection is cached
- ✅ `getMultiple(requests)` — Get multiple collections at once
- ✅ `waitFor(type, value, minCount, timeout)` — Wait for dynamic elements
- ✅ `configure(options)` — Customize behavior

---

## Summary — Key Takeaways

1. **Three collection types** — `ClassName`, `TagName`, `Name` — each finds elements a different way
2. **Enhanced collections** — what you get back works like an array, plus has bulk DOM methods
3. **Array methods work natively** — no `Array.from()` conversion needed
4. **Bulk operations** — `addClass`, `setStyle`, `on` etc. apply to all elements in one call
5. **Chainable** — all bulk methods return the collection, so you can stack operations
6. **Auto-caching** — first access queries DOM, every subsequent access is instant from cache
7. **Static snapshots** — collections don't change mid-iteration, preventing subtle bugs

**What's coming next:**

1. **Basic Access Methods** — Deep dive into ClassName, TagName, Name and their options
2. **Array-Like Methods** — Master forEach, map, filter, find and their patterns
3. **DOM Manipulation Methods** — Bulk updates with chaining
4. **Filtering Methods** — visible, hidden, enabled, disabled
5. **Utility Methods** — first, last, at, isEmpty and more
6. **Helper Methods** — Cache management, waitFor, configure
7. **Best Practices** — Decision trees, performance patterns, production tips