[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Global Query — Introduction

## Quick Start (30 seconds)

```javascript
// Find a single element by CSS selector — auto-enhanced with .update()
query('#title').update({
  textContent: 'Hello World',
  style: { color: 'blue' }
});

// Find multiple elements — enhanced collection with array methods
queryAll('.card').update({
  style: { padding: '20px', borderRadius: '8px' }
});
```

---

## What is Global Query?

Global Query provides **global functions** for finding DOM elements using CSS selectors — just like `document.querySelector()` and `document.querySelectorAll()`, but with two key upgrades:

1. **Every element returned has `.update()`** — no manual enhancement needed
2. **Collections come with array methods** — `.forEach()`, `.map()`, `.filter()`, `.find()`, and more

Simply put, Global Query is like having **jQuery-style querying** powered by the DOM Helpers `.update()` system.

---

## Why Does This Exist?

### The Core Library's Approach

The core DOM Helpers library provides access through specific helpers:

```javascript
// Elements — by ID
Elements.header.update({ textContent: "Hello" });

// Collections — by class, tag, or name
Collections.ClassName.btn;

// Selector — by CSS selector
Selector.query('#header');
```

These work well for their specific use cases. But sometimes you want to quickly grab **any element using a CSS selector** and immediately update it — without thinking about which helper to use.

### The Global Query Approach

```javascript
// One function for everything — CSS selectors just work
query('#header').update({ textContent: "Hello" });
query('.nav-link').update({ style: { color: "blue" } });
query('button[type="submit"]').update({ disabled: false });

// Multiple elements — clean and familiar
queryAll('.card').forEach(card => {
  card.update({ classList: { add: ['shadow'] } });
});
```

---

## Mental Model: A Universal Search Tool

Think of the core helpers as **specialized departments** — each one knows how to find a specific type of thing:

```
Elements     → "Find by ID"
Collections  → "Find by class, tag, or name"
Selector     → "Find by CSS selector"
```

Global Query is like a **universal search desk** — you give it any CSS selector and it finds what you need:

```
query('.anything')     → finds it, enhanced, ready to use
queryAll('.anything')  → finds all of them, enhanced, ready to use
```

---

## The Six Global Functions

| Function | What It Does | Returns |
|----------|-------------|---------|
| `querySelector(selector)` | Find one element | Enhanced element or `null` |
| `querySelectorAll(selector)` | Find all matching elements | Enhanced collection |
| `query(selector)` | Alias for `querySelector` | Enhanced element or `null` |
| `queryAll(selector)` | Alias for `querySelectorAll` | Enhanced collection |
| `queryWithin(container, selector)` | Find one element inside a container | Enhanced element or `null` |
| `queryAllWithin(container, selector)` | Find all elements inside a container | Enhanced collection |

### Short Aliases

`query` and `queryAll` are shorter aliases for `querySelector` and `querySelectorAll`:

```javascript
// These pairs are identical:
querySelector('#title')  ===  query('#title')
querySelectorAll('.btn') ===  queryAll('.btn')
```

---

## What Makes This Different from document.querySelector?

| Feature | `document.querySelector()` | Global Query `query()` |
|---------|--------------------------|----------------------|
| Returns | Raw DOM element | Enhanced element with `.update()` |
| Collections | Raw NodeList (no `.map`, `.filter`) | Enhanced collection with array methods |
| Error handling | Throws on invalid selector | Warns and returns `null` / empty collection |
| Scoped search | `container.querySelector()` | `queryWithin(container, selector)` |

```javascript
// Native — raw element, no .update()
const btn = document.querySelector('#btn');
btn.textContent = 'Click';
btn.style.color = 'red';
btn.classList.add('active');

// Global Query — enhanced, one call does it all
query('#btn').update({
  textContent: 'Click',
  style: { color: 'red' },
  classList: { add: ['active'] }
});
```

---

## Key Features

### Every Element Has .update()

```javascript
query('#header').update({ textContent: "Welcome" });
query('.nav-link').update({ style: { fontWeight: "bold" } });
```

### Collections Have Array Methods

```javascript
const items = queryAll('.item');

items.forEach((el, i) => console.log(i, el.textContent));
items.map(el => el.textContent);
items.filter(el => el.classList.contains('active'));
items.find(el => el.dataset.id === '42');
items.first();    // First element
items.last();     // Last element
items.at(-1);     // Negative index support
```

### Collections Have Helper Methods

```javascript
queryAll('.btn')
  .addClass('primary')
  .setStyle({ padding: '10px' })
  .on('click', handleClick);
```

### Scoped Queries

```javascript
// Search within a specific container
queryWithin('#sidebar', '.menu-link');
queryAllWithin('#modal', 'input');
```

### Safe Error Handling

```javascript
// Invalid selector — returns null with a warning, no crash
const result = query('###invalid');
// Console: [Global Query] Invalid selector "###invalid": ...
// result === null
```

---

## This Module Is an Enhancer

Load it after the core DOM Helpers library:

```html
<!-- 1. Core library first -->
<script src="01_dh-core.js"></script>

<!-- 2. Global Query enhancer -->
<script src="03_dh-global-query.js"></script>

<!-- 3. Your code -->
<script>
  query('#title').update({ textContent: 'Ready!' });
</script>
```

The module also integrates with `DOMHelpers`:

```javascript
DOMHelpers.query('#title');
DOMHelpers.queryAll('.card');
DOMHelpers.queryWithin('#sidebar', '.link');
```

---

## Summary

| Concept | Key Takeaway |
|---------|-------------|
| **What** | Global functions for CSS selector queries with auto-enhancement |
| **Core functions** | `query()` / `querySelector()` for one, `queryAll()` / `querySelectorAll()` for many |
| **Scoped** | `queryWithin()` and `queryAllWithin()` for searching inside containers |
| **Auto-enhanced** | Every element has `.update()`, every collection has array methods |
| **Helper methods** | Collections also get `.addClass()`, `.setStyle()`, `.on()`, and more |
| **Safe** | Invalid selectors return `null` / empty collection with a warning |

> **Simple Rule to Remember:** `query()` finds one element, `queryAll()` finds many. Both auto-enhance everything with `.update()`. Collections also get array methods like `.forEach()`, `.map()`, and `.filter()` — plus helpers like `.addClass()` and `.on()`.