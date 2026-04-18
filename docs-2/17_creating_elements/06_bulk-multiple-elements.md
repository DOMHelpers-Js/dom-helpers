[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# `createElement.bulk()` — Multiple Elements (Method 3)

## Quick Start (30 seconds)

```javascript
// Create four elements with one call
const elements = createElement.bulk({
  H1: {
    textContent: 'Product Dashboard',
    style: { color: '#007bff' }
  },
  P: {
    textContent: 'Manage your products below.',
    classList: { add: ['subtitle'] }
  },
  BUTTON_ADD: {
    textContent: 'Add Product',
    classList: { add: ['btn', 'btn-success'] },
    addEventListener: ['click', openAddModal]
  },
  BUTTON_EXPORT: {
    textContent: 'Export CSV',
    classList: { add: ['btn'] },
    addEventListener: ['click', exportData]
  }
});

// Append all to the page header
elements.H1.after(elements.P);
Elements.pageHeader.append(elements.H1, elements.P, elements.BUTTON_ADD, elements.BUTTON_EXPORT);
```

---

## What is Method 3?

Method 3 is the core use case for `createElement.bulk()`: creating **multiple elements at once** from a single configuration object.

Instead of creating each element separately and managing individual variables, you describe all your elements in one object and get them all back in a single result. Each element is accessible by its key name, and you also have access to the entire collection via helper methods.

This is the approach you will use most often when building real UI components with Dom Helpers.

---

## Syntax

```javascript
const elements = createElement.bulk({
  KEY_1: { /* config for element 1 */ },
  KEY_2: { /* config for element 2 */ },
  KEY_3: { /* config for element 3 */ },
  // ... as many as you need
});

// Access each element by key
elements.KEY_1
elements.KEY_2
elements.KEY_3
```

---

## Why Does This Exist?

### The Problem with Multiple Separate Variables

When you create elements one by one, your code becomes scattered and hard to follow:

```javascript
// Plain JavaScript — 4 elements, 16+ lines
const header = document.createElement('div');
header.className = 'card-header';

const title = document.createElement('h3');
title.textContent = 'User Profile';
title.style.margin = '0';

const body = document.createElement('div');
body.className = 'card-body';

const footer = document.createElement('div');
footer.className = 'card-footer';
footer.style.display = 'flex';
footer.style.justifyContent = 'flex-end';

// Now assemble them...
// Now remember which variable is which...
// Now make sure you didn't miss any...
```

The elements are scattered across the file, connected only by the developer's mental model.

### The Solution: Grouped Creation

```javascript
// Dom Helpers — 4 elements, clear grouping
const card = createElement.bulk({
  HEADER: { className: 'card-header' },
  TITLE:  { tagName: 'h3', textContent: 'User Profile', style: { margin: '0' } },
  BODY:   { className: 'card-body' },
  FOOTER: {
    className: 'card-footer',
    style: { display: 'flex', justifyContent: 'flex-end' }
  }
});

// All elements are accessible on one object
card.HEADER.appendChild(card.TITLE);
```

**Benefits of grouped creation:**
✅ All related elements are defined together — easy to read as a unit
✅ Named access makes the code self-documenting
✅ No risk of mixing up variable names
✅ Helper methods on the result object simplify assembly

---

## Mental Model: A Casting Call

Think of `createElement.bulk()` like a casting call for a play.

You write a list of all the roles you need — Actor A (plays the header), Actor B (plays the title), Actor C (plays the footer). You hand the list to the director (Dom Helpers). The director casts all the roles at once and hands you back a complete cast list — where every name maps to a real actor, ready to perform.

```
Your config object:
{
  HEADER: { ... },   ← "I need a header div"
  TITLE:  { ... },   ← "I need a title h3"
  FOOTER: { ... }    ← "I need a footer div"
}
         ↓ Dom Helpers casts them all
Result object:
{
  HEADER: <div class="card-header">,
  TITLE:  <h3>User Profile</h3>,
  FOOTER: <div class="card-footer">
}
```

Every name maps to the real element, ready to use.

---

## How Does It Work?

```
1️⃣  Dom Helpers receives the config object

2️⃣  For each key in the object:
    → Parses the tag name from the key (e.g., "BUTTON_ADD" → "button")
    → Calls document.createElement('button')
    → Enhances the element with .update()
    → Applies the configuration: element.update({ ... })
    → Stores the element with its key

3️⃣  Builds the result object:
    {
      KEY_1: element1,
      KEY_2: element2,
      KEY_3: element3,
      all: [element1, element2, element3],
      count: 3,
      keys: ['KEY_1', 'KEY_2', 'KEY_3'],
      appendTo(container),
      appendToOrdered(container, ...keys),
      forEach(callback),
      map(callback),
      filter(callback),
      updateMultiple(updates),
      has(key),
      get(key, fallback),
      toArray(...keys),
      ordered(...keys)
    }

4️⃣  Returns the result object
```

The result object is a regular JavaScript object with direct element access via property names, plus a set of helper methods for working with the collection.

---

## Basic Usage

### Page Header Section

```javascript
const header = createElement.bulk({
  SECTION: {
    className: 'page-header',
    style: {
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      textAlign: 'center'
    }
  },
  H1: {
    textContent: 'Welcome Back',
    style: { fontSize: '2.5rem', margin: '0 0 10px' }
  },
  P: {
    textContent: 'Your personalized dashboard',
    style: { fontSize: '1.1rem', opacity: '0.9' }
  }
});

header.SECTION.append(header.H1, header.P);
document.body.appendChild(header.SECTION);
```

---

### Navigation Bar

```javascript
const nav = createElement.bulk({
  NAV: {
    className: 'navbar',
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px 30px',
      background: '#333'
    }
  },
  LOGO: {
    textContent: 'MyApp',
    style: { color: 'white', fontSize: '22px', fontWeight: 'bold', marginRight: 'auto' }
  },
  LINK_HOME:    { innerHTML: '<a href="/">Home</a>',    style: { color: 'white', marginLeft: '20px' } },
  LINK_ABOUT:   { innerHTML: '<a href="/about">About</a>',   style: { color: 'white', marginLeft: '20px' } },
  LINK_CONTACT: { innerHTML: '<a href="/contact">Contact</a>', style: { color: 'white', marginLeft: '20px' } }
});

nav.NAV.append(nav.LOGO, nav.LINK_HOME, nav.LINK_ABOUT, nav.LINK_CONTACT);
document.body.prepend(nav.NAV);
```

---

### Feature Card

```javascript
const card = createElement.bulk({
  ARTICLE: {
    className: 'feature-card',
    style: {
      background: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }
  },
  ICON: {
    textContent: '🚀',
    style: { fontSize: '2.5rem', display: 'block', marginBottom: '15px' }
  },
  H3: {
    textContent: 'Blazing Fast',
    style: { margin: '0 0 10px', color: '#1a1a2e' }
  },
  DESCRIPTION: {
    textContent: 'Optimized for performance at every level.',
    style: { color: '#666', lineHeight: '1.6', margin: '0' }
  },
  BUTTON: {
    textContent: 'Learn More',
    classList: { add: ['btn', 'btn-link'] },
    addEventListener: ['click', () => navigateTo('features/speed')]
  }
});

card.ARTICLE.append(
  card.ICON,
  card.H3,
  card.DESCRIPTION,
  card.BUTTON
);

Elements.featuresGrid.appendChild(card.ARTICLE);
```

---

### Form with Multiple Fields

```javascript
const loginForm = createElement.bulk({
  FORM: {
    id: 'loginForm',
    style: { maxWidth: '400px', margin: '0 auto', padding: '30px' }
  },
  HEADING: {
    textContent: 'Sign In',
    style: { textAlign: 'center', marginBottom: '25px' }
  },
  LABEL_EMAIL: {
    textContent: 'Email Address',
    setAttribute: { for: 'email' },
    style: { display: 'block', marginBottom: '6px', fontWeight: '600' }
  },
  INPUT_EMAIL: {
    type: 'email',
    id: 'email',
    placeholder: 'you@example.com',
    required: true,
    style: {
      width: '100%',
      padding: '10px 14px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      marginBottom: '15px'
    }
  },
  LABEL_PASSWORD: {
    textContent: 'Password',
    setAttribute: { for: 'password' },
    style: { display: 'block', marginBottom: '6px', fontWeight: '600' }
  },
  INPUT_PASSWORD: {
    type: 'password',
    id: 'password',
    placeholder: '••••••••',
    required: true,
    style: {
      width: '100%',
      padding: '10px 14px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      marginBottom: '20px'
    }
  },
  BUTTON_SUBMIT: {
    type: 'submit',
    textContent: 'Sign In',
    classList: { add: ['btn', 'btn-primary', 'btn-full'] },
    style: {
      width: '100%',
      padding: '12px',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer'
    }
  }
});

// Assemble the form
loginForm.FORM.append(
  loginForm.HEADING,
  loginForm.LABEL_EMAIL,
  loginForm.INPUT_EMAIL,
  loginForm.LABEL_PASSWORD,
  loginForm.INPUT_PASSWORD,
  loginForm.BUTTON_SUBMIT
);

// Add submit handler
loginForm.FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  const email    = loginForm.INPUT_EMAIL.value;
  const password = loginForm.INPUT_PASSWORD.value;
  handleLogin(email, password);
});

document.body.appendChild(loginForm.FORM);
```

---

### Appending All Elements at Once

When all elements should go directly into a container in creation order, use `appendTo()`:

```javascript
const dashboard = createElement.bulk({
  HEADER: { innerHTML: '<h1>Dashboard</h1>', className: 'dashboard-header' },
  STATS:  { className: 'stats-row' },
  TABLE:  { className: 'data-table' },
  FOOTER: { textContent: '© 2025', className: 'page-footer' }
});

// Append all elements in their creation order
dashboard.appendTo(document.body);

// Or append to a specific element using a selector
dashboard.appendTo('#app');
dashboard.appendTo(Elements.mainWrapper);
```

---

### Appending in Custom Order

Sometimes you want to append elements in a different order than they were defined:

```javascript
const sections = createElement.bulk({
  FOOTER:  { textContent: 'Footer' },    // Defined first
  HEADER:  { textContent: 'Header' },    // Defined second
  CONTENT: { textContent: 'Content' }    // Defined third
});

// Append in logical page order (not definition order)
sections.appendToOrdered(document.body, 'HEADER', 'CONTENT', 'FOOTER');
```

---

## Key Naming Strategies

Good key names make your code readable at a glance. Here are patterns that work well:

```javascript
// Pattern 1: TAGNAME — simple, when only one of each tag
const result = createElement.bulk({
  HEADER: {},
  MAIN:   {},
  FOOTER: {}
});

// Pattern 2: TAGNAME_ROLE — when role matters more than tag
const result = createElement.bulk({
  DIV_SIDEBAR:  {},
  DIV_CONTENT:  {},
  DIV_OVERLAY:  {}
});

// Pattern 3: TYPE_IDENTIFIER — very descriptive
const result = createElement.bulk({
  BUTTON_SAVE:   { textContent: 'Save' },
  BUTTON_CANCEL: { textContent: 'Cancel' },
  BUTTON_DELETE: { textContent: 'Delete' }
});

// Pattern 4: SECTION_ELEMENT — for nested structures
const result = createElement.bulk({
  FORM_CONTAINER:    {},
  FORM_TITLE:        {},
  FORM_INPUT_EMAIL:  {},
  FORM_INPUT_NAME:   {},
  FORM_BUTTON:       {}
});
```

Choose names that make the purpose of each element obvious to anyone reading the code.

---

## Batch Updating Multiple Elements

After creation, you can update multiple elements in one call using `updateMultiple()`:

```javascript
const ui = createElement.bulk({
  TITLE:  { textContent: 'Processing...' },
  STATUS: { textContent: 'Idle',          style: { color: '#999' } },
  BAR:    { className: 'progress-bar',    style: { width: '0%' } }
});

document.body.append(...ui.all);

// Update multiple elements at once
function setProcessing(percent) {
  ui.updateMultiple({
    TITLE:  { textContent: `Processing: ${percent}%` },
    STATUS: { textContent: 'Running...', style: { color: '#007bff' } },
    BAR:    { style: { width: `${percent}%` } }
  });
}
```

---

## Comparison: Before and After

### Before: Plain JavaScript

```javascript
// Creating a notification component — plain JS
const container = document.createElement('div');
container.className = 'notification';

const icon = document.createElement('span');
icon.textContent = '🔔';
icon.style.fontSize = '20px';
icon.style.marginRight = '10px';

const message = document.createElement('p');
message.textContent = 'You have 3 new messages';
message.style.margin = '0';
message.style.flex = '1';

const closeBtn = document.createElement('button');
closeBtn.textContent = '×';
closeBtn.style.background = 'none';
closeBtn.style.border = 'none';
closeBtn.style.fontSize = '20px';
closeBtn.style.cursor = 'pointer';
closeBtn.addEventListener('click', () => container.remove());

container.style.display = 'flex';
container.style.alignItems = 'center';
container.style.padding = '12px 16px';
container.style.background = '#e3f2fd';
container.style.borderRadius = '8px';

container.append(icon, message, closeBtn);
document.body.appendChild(container);
```

### After: Dom Helpers Method 3

```javascript
const notification = createElement.bulk({
  CONTAINER: {
    className: 'notification',
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      background: '#e3f2fd',
      borderRadius: '8px'
    }
  },
  ICON: {
    textContent: '🔔',
    style: { fontSize: '20px', marginRight: '10px' }
  },
  MESSAGE: {
    textContent: 'You have 3 new messages',
    style: { margin: '0', flex: '1' }
  },
  CLOSE: {
    textContent: '×',
    style: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
    addEventListener: ['click', () => notification.CONTAINER.remove()]
  }
});

notification.CONTAINER.append(
  notification.ICON,
  notification.MESSAGE,
  notification.CLOSE
);

document.body.appendChild(notification.CONTAINER);
```

**Result:** Same component. The Dom Helpers version groups all elements together, makes each element's config clear, and gives you meaningful names to work with.

---

## Common Pitfall: Keys are Case-Sensitive

```javascript
const result = createElement.bulk({
  BUTTON: { textContent: 'Click' }
});

// ✅ Correct — matches the key exactly
result.BUTTON;

// ❌ Wrong — lowercase is not the same key
result.button;   // undefined

// ❌ Wrong — mixed case
result.Button;   // undefined
```

Key names must match exactly as you wrote them in the config object.

---

## Summary

Method 3 — `createElement.bulk()` with multiple elements — is the most powerful and commonly used way to create elements in Dom Helpers.

**Key points:**
- ✅ Create all related elements in one clear, grouped configuration object
- ✅ Access each element by its descriptive key name
- ✅ Suffix names (e.g., `DIV_SIDEBAR`) give elements meaningful identifiers
- ✅ The result object includes `appendTo()`, `appendToOrdered()`, `updateMultiple()`, and more
- ✅ All elements are automatically enhanced with `.update()`
- ✅ Assembly is explicit — you control which elements go where

---

## What's Next?

- **[07 — Numbered Instances](./07_numbered-instances.md)** — Create multiple elements of the same type using `DIV_1`, `DIV_2`, etc.
- **[11 — The Result Object](./11_result-object-methods.md)** — Complete reference for all result object methods