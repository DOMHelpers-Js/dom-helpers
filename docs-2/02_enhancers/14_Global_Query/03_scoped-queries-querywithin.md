[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Scoped Queries — queryWithin() and queryAllWithin()

## Quick Start (30 seconds)

```javascript
// Find an element INSIDE a specific container
queryWithin('#sidebar', '.menu-link').update({
  style: { fontWeight: 'bold' }
});

// Find all elements INSIDE a specific container
queryAllWithin('#modal', 'input').update({
  classList: { add: ['form-control'] }
});
```

---

## What Are Scoped Queries?

Scoped queries let you **search for elements inside a specific container** rather than the entire page. Instead of searching the whole document, you narrow the search to a specific section.

Simply put, `queryWithin()` and `queryAllWithin()` are like saying **"find this, but only look inside that container."**

---

## Syntax

### queryWithin()

```javascript
queryWithin(container, selector)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `container` | Element or String | Yes | The container to search within (element or CSS selector) |
| `selector` | String | Yes | CSS selector for the element to find |

**Returns:** The first matching element (enhanced) inside the container, or `null`.

### queryAllWithin()

```javascript
queryAllWithin(container, selector)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `container` | Element or String | Yes | The container to search within (element or CSS selector) |
| `selector` | String | Yes | CSS selector for the elements to find |

**Returns:** An enhanced collection of all matching elements inside the container.

---

## Why Use Scoped Queries?

### The Problem: Ambiguous Selectors

When your page has repeated structures, a global query might find the wrong element:

```html
<div id="sidebar">
  <h3 class="title">Sidebar Title</h3>
</div>
<div id="main">
  <h3 class="title">Main Title</h3>
</div>
```

```javascript
// ❌ Which .title does this find? The first one on the page (sidebar)
query('.title');

// ✅ Specific — find .title only inside #main
queryWithin('#main', '.title');
```

### Scoped queries let you be precise about WHERE to search.

---

## How Does It Work?

```
queryWithin('#sidebar', '.menu-link')
   ↓
1️⃣ Is the container a string? → Yes → document.querySelector('#sidebar')
   ↓
2️⃣ Got the container element? → Yes
   ↓
3️⃣ Search within: container.querySelector('.menu-link')
   ↓
4️⃣ Enhance the result with .update()
   ↓
5️⃣ Return the enhanced element
```

---

## Container: String or Element

The container parameter accepts **either** a CSS selector string **or** a direct element reference:

### String Container

```javascript
// Pass a CSS selector as the container
queryWithin('#sidebar', '.link');
queryAllWithin('.modal', 'input');
```

### Element Container

```javascript
// Pass an element reference
const sidebar = document.getElementById('sidebar');
queryWithin(sidebar, '.link');

// Or use query() to get the container first
const modal = query('#modal');
queryAllWithin(modal, 'input');
```

Both approaches work identically — strings are converted to elements internally.

---

## Basic Examples

### Find One Element Inside a Container

```javascript
// Find the title inside the sidebar
const sidebarTitle = queryWithin('#sidebar', 'h3');
sidebarTitle.update({ textContent: 'Navigation' });

// Find the submit button inside a form
const submitBtn = queryWithin('#contactForm', 'button[type="submit"]');
submitBtn.update({ disabled: false, textContent: 'Send' });
```

### Find All Elements Inside a Container

```javascript
// Find all inputs inside a modal
const modalInputs = queryAllWithin('#modal', 'input');
modalInputs.forEach(input => {
  input.update({ value: '', placeholder: 'Enter value...' });
});

// Find all links inside the navigation
const navLinks = queryAllWithin('#nav', 'a');
console.log(navLinks.length);  // Number of links in #nav
```

---

## Real-World Examples

### Example 1: Modal Form Setup

```javascript
function setupModalForm() {
  // Set up all inputs inside the modal
  queryAllWithin('#signupModal', 'input').forEach(input => {
    input.update({
      classList: { add: ['form-control'] },
      value: ''
    });
  });

  // Set up the submit button
  queryWithin('#signupModal', '.submit-btn').update({
    textContent: 'Sign Up',
    disabled: false
  });

  // Set up the cancel button
  queryWithin('#signupModal', '.cancel-btn').update({
    textContent: 'Cancel'
  });
}
```

### Example 2: Card Content

```javascript
function updateCard(cardId, data) {
  const card = `#${cardId}`;

  queryWithin(card, '.card-title').update({
    textContent: data.title
  });

  queryWithin(card, '.card-body').update({
    textContent: data.description
  });

  queryWithin(card, '.card-image').update({
    src: data.imageUrl,
    alt: data.title
  });
}

updateCard('product-1', {
  title: 'Widget Pro',
  description: 'The best widget ever made.',
  imageUrl: 'images/widget.jpg'
});
```

### Example 3: Table Section

```javascript
// Style the header row inside a specific table
queryWithin('#userTable', 'thead tr').update({
  style: { backgroundColor: '#333', color: 'white' }
});

// Style all data rows
queryAllWithin('#userTable', 'tbody tr').forEach((row, i) => {
  row.update({
    style: { backgroundColor: i % 2 === 0 ? '#fff' : '#f9f9f9' }
  });
});
```

### Example 4: Navigation Section

```javascript
function setActiveSection(sectionId) {
  // Remove active from all links in the nav
  queryAllWithin('#mainNav', '.nav-link').forEach(link => {
    link.update({ classList: { remove: ['active'] } });
  });

  // Add active to the matching link
  const activeLink = queryWithin('#mainNav', `a[href="#${sectionId}"]`);
  if (activeLink) {
    activeLink.update({ classList: { add: ['active'] } });
  }
}
```

---

## When the Container Doesn't Exist

If the container can't be found, the functions handle it gracefully:

```javascript
// Container not found
const result = queryWithin('#nonexistent', '.link');
// Console: [Global Query] Container not found
// result === null

const results = queryAllWithin('#nonexistent', '.link');
// Console: [Global Query] Container not found
// results.length === 0
```

---

## queryWithin vs query with Descendant Selector

You can achieve similar results with a descendant selector in `query()`:

```javascript
// These are equivalent:
queryWithin('#sidebar', '.link');
query('#sidebar .link');

// These are equivalent:
queryAllWithin('#modal', 'input');
queryAll('#modal input');
```

**When to prefer `queryWithin()`:**

- When you already have a **container element reference** (not a string)
- When you want to make the **scoping explicit** and readable
- When the container might not exist and you want a clean warning

```javascript
// Useful when you already have the element
const mySection = query('#content');

// Later, search within it
const title = queryWithin(mySection, 'h2');
const links = queryAllWithin(mySection, 'a');
```

---

## Summary

| Function | Finds | Inside | Returns |
|----------|-------|--------|---------|
| `queryWithin(container, selector)` | One element | A specific container | Enhanced element or `null` |
| `queryAllWithin(container, selector)` | All elements | A specific container | Enhanced collection |

| Container Parameter | Example |
|--------------------|---------|
| CSS selector string | `queryWithin('#sidebar', '.link')` |
| Element reference | `queryWithin(sidebarElement, '.link')` |

> **Simple Rule to Remember:** `queryWithin()` and `queryAllWithin()` work just like `query()` and `queryAll()`, but they only search inside a specific container. The container can be a CSS selector string or an element reference. Use these when you need to be specific about where to look.