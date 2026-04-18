[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# query() and queryAll() — Finding Elements by CSS Selector

## Quick Start (30 seconds)

```javascript
// Find one element
const title = query('#pageTitle');
title.update({ textContent: 'Welcome!' });

// Find all matching elements
const cards = queryAll('.card');
cards.forEach(card => {
  card.update({ style: { padding: '16px' } });
});
```

---

## What Are These Functions?

| Function | Alias For | Finds | Returns |
|----------|----------|-------|---------|
| `query(selector)` | `querySelector(selector)` | **One** element (the first match) | Enhanced element or `null` |
| `queryAll(selector)` | `querySelectorAll(selector)` | **All** matching elements | Enhanced collection |

Both accept any valid **CSS selector** — IDs, classes, tags, attributes, pseudo-selectors, and combinations.

---

## Syntax

### query() / querySelector()

```javascript
query(selector)
query(selector, context)

// Long form — identical behavior
querySelector(selector)
querySelector(selector, context)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `selector` | String | Yes | Any CSS selector |
| `context` | Element | No | Element to search within (default: `document`) |

**Returns:** The first matching element (enhanced with `.update()`), or `null` if nothing matches.

### queryAll() / querySelectorAll()

```javascript
queryAll(selector)
queryAll(selector, context)

// Long form — identical behavior
querySelectorAll(selector)
querySelectorAll(selector, context)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `selector` | String | Yes | Any CSS selector |
| `context` | Element | No | Element to search within (default: `document`) |

**Returns:** An enhanced collection of all matching elements, with `.update()` and array methods.

---

## query() — Finding One Element

`query()` returns the **first element** that matches the selector:

### By ID

```javascript
const header = query('#header');
header.update({ textContent: 'My App' });
```

### By Class

```javascript
// Returns the FIRST element with class "btn"
const firstBtn = query('.btn');
firstBtn.update({ style: { backgroundColor: 'blue' } });
```

### By Tag

```javascript
const firstParagraph = query('p');
firstParagraph.update({ style: { fontSize: '18px' } });
```

### By Attribute

```javascript
const emailInput = query('input[type="email"]');
emailInput.update({ placeholder: 'Enter your email' });
```

### Complex Selectors

```javascript
// Descendant selector
query('#nav .active');

// Child selector
query('ul > li:first-child');

// Attribute selector
query('a[href^="https"]');

// Pseudo-selector
query('.list li:nth-child(2)');
```

### When Nothing Matches

If no element matches the selector, `query()` returns `null`:

```javascript
const result = query('#nonexistent');
console.log(result);  // null

// Always check before using
const element = query('.maybe-exists');
if (element) {
  element.update({ textContent: 'Found it!' });
}
```

---

## queryAll() — Finding Multiple Elements

`queryAll()` returns **all elements** that match the selector:

### Basic Usage

```javascript
const allButtons = queryAll('.btn');
console.log(allButtons.length);  // Number of matches

// Update all at once
allButtons.update({
  style: { borderRadius: '4px' }
});
```

### Iterate with forEach

```javascript
queryAll('.card').forEach((card, index) => {
  card.update({
    textContent: `Card ${index + 1}`,
    dataset: { index: String(index) }
  });
});
```

### Filter and Process

```javascript
// Find only active items
const active = queryAll('.item')
  .filter(el => el.classList.contains('active'));

active.forEach(el => {
  el.update({ style: { fontWeight: 'bold' } });
});
```

### When Nothing Matches

If no elements match, `queryAll()` returns an empty collection (not `null`):

```javascript
const results = queryAll('.nonexistent');
console.log(results.length);   // 0
console.log(results.isEmpty()); // true

// forEach on empty collection is safe — just does nothing
results.forEach(el => {
  // This never executes
});
```

---

## CSS Selector Examples

Here's a quick reference of common selectors you can use:

| Selector | What It Finds |
|----------|--------------|
| `'#myId'` | Element with `id="myId"` |
| `'.myClass'` | Elements with `class="myClass"` |
| `'div'` | All `<div>` elements |
| `'div.card'` | `<div>` elements with class `card` |
| `'.parent .child'` | `.child` elements inside `.parent` |
| `'.parent > .child'` | Direct `.child` children of `.parent` |
| `'input[type="text"]'` | Text inputs |
| `'a[href^="https"]'` | Links starting with `https` |
| `'li:first-child'` | First `<li>` in each list |
| `'li:nth-child(2)'` | Second `<li>` in each list |
| `'button:not(.disabled)'` | Buttons without class `disabled` |
| `'.card, .panel'` | Elements with class `card` OR `panel` |

---

## How It Works Under the Hood

### query()

```
query('#header')
   ↓
1️⃣ Call document.querySelector('#header')
   ↓
2️⃣ Got an element? → Yes
   ↓
3️⃣ Enhance with .update() via EnhancedUpdateUtility
   ↓
4️⃣ Return the enhanced element
```

### queryAll()

```
queryAll('.card')
   ↓
1️⃣ Call document.querySelectorAll('.card')
   ↓
2️⃣ Wrap the NodeList in an enhanced collection:
   ├── Add array methods: forEach, map, filter, find, some, every, reduce
   ├── Add helper methods: addClass, setStyle, on, off
   ├── Add navigation: first(), last(), at(), isEmpty()
   ├── Add .update() to the collection itself
   └── Index access auto-enhances each element with .update()
   ↓
3️⃣ Return the enhanced collection
```

---

## Real-World Examples

### Example 1: Quick Page Setup

```javascript
// Set up the entire page in a few lines
query('#title').update({ textContent: 'Dashboard' });
query('#subtitle').update({ textContent: 'Welcome back, Alice' });
query('#avatar').update({ src: 'images/alice.jpg' });

queryAll('.nav-link').forEach((link, i) => {
  if (i === 0) link.update({ classList: { add: ['active'] } });
});
```

### Example 2: Form Handling

```javascript
// Collect form values
const name = query('#nameInput').value;
const email = query('#emailInput').value;

// Disable form during submission
queryAll('#myForm input, #myForm button').update({
  disabled: true
});
```

### Example 3: Dynamic Content

```javascript
// Style all cards that have a high price
queryAll('.product-card')
  .filter(card => parseFloat(card.dataset.price) > 100)
  .forEach(card => {
    card.update({
      classList: { add: ['premium'] },
      style: { borderColor: 'gold' }
    });
  });
```

### Example 4: Event Binding

```javascript
// Add click handlers to all buttons
queryAll('.action-btn').forEach(btn => {
  btn.update({
    addEventListener: ['click', () => {
      console.log('Button clicked:', btn.textContent);
    }]
  });
});
```

---

## Error Handling

### Invalid Selector

If the selector is invalid, the function warns you and returns safely:

```javascript
const result = query('###invalid');
// Console: [Global Query] Invalid selector "###invalid": ...
// result === null

const results = queryAll('###invalid');
// Console: [Global Query] Invalid selector "###invalid": ...
// results.length === 0
```

### Non-String Selector

```javascript
query(123);
// Console: [Global Query] querySelector requires a string selector
// Returns null

queryAll(null);
// Console: [Global Query] querySelectorAll requires a string selector
// Returns empty collection
```

---

## query() vs queryAll() — Quick Decision

```
Need ONE element?     → query('#id')     or query('.class')
Need ALL elements?    → queryAll('.class') or queryAll('tag')
```

| Scenario | Use |
|----------|-----|
| Get a specific element by ID | `query('#myId')` |
| Get the first match of a class | `query('.myClass')` |
| Get all elements of a class | `queryAll('.myClass')` |
| Get all inputs in a form | `queryAll('#form input')` |
| Get all visible cards | `queryAll('.card:not(.hidden)')` |

---

## Summary

| Function | Finds | Returns | When None Found |
|----------|-------|---------|----------------|
| `query(selector)` | First match | Enhanced element | `null` |
| `queryAll(selector)` | All matches | Enhanced collection | Empty collection (length 0) |

> **Simple Rule to Remember:** `query()` finds one, `queryAll()` finds all. Both use CSS selectors and both auto-enhance with `.update()`. Always check `query()` for `null` before using. `queryAll()` is always safe — empty collections don't cause errors.