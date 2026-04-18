[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# `createElement.bulk()` — Single Element (Method 2)

## Quick Start (30 seconds)

```javascript
// Create one element using createElement.bulk()
const elements = createElement.bulk({
  P: {
    id: 'myParagraph',
    textContent: 'Hello from bulk!',
    classList: { add: ['dynamic'] },
    style: { color: '#333', fontSize: '16px' }
  }
});

// Access it by its key
Elements.container.appendChild(elements.P);

// Update it later
elements.P.update({ style: { color: 'blue' } });
```

---

## What is Method 2?

Method 2 is using `createElement.bulk()` to create a **single element**.

At first, this might seem unusual. Why use a "bulk" function for just one element?

The answer is: `createElement.bulk()` is not just about quantity. It is about a **consistent, declarative style** of element creation. Whether you need one element today and ten elements tomorrow, you write configuration objects the same way every time.

Method 2 gives you:
- The full declarative power of the `bulk` system for a single element
- The returned result object, with its helpful methods
- Named access to your element (`elements.P`, `elements.BUTTON`, etc.)
- Consistency — the same pattern whether creating one or many

---

## Syntax

```javascript
const elements = createElement.bulk({
  TAGNAME: {
    // configuration properties
  }
});

// Access the element by its key name
elements.TAGNAME
```

**The key name is the element's identifier — not necessarily its tag.**

```javascript
// Simple: key matches the tag name
const result = createElement.bulk({
  BUTTON: { textContent: 'Click' }
});
// result.BUTTON → <button>

// Key with custom suffix: still creates the right tag
const result = createElement.bulk({
  BUTTON_SUBMIT: { textContent: 'Submit' }
});
// result.BUTTON_SUBMIT → <button>
// The underscore and everything after it is a suffix — the tag is still BUTTON
```

---

## How Tag Names Are Parsed

This is important to understand: the key in your configuration object determines the **tag name**, but only the part before the first underscore.

```
Key             →  Tag Created    →  Access Via
─────────────────────────────────────────────────
P               →  <p>            →  elements.P
DIV             →  <div>          →  elements.DIV
H1              →  <h1>           →  elements.H1
BUTTON          →  <button>       →  elements.BUTTON
IMG             →  <img>          →  elements.IMG
BUTTON_SUBMIT   →  <button>       →  elements.BUTTON_SUBMIT
DIV_HEADER      →  <div>          →  elements.DIV_HEADER
INPUT_EMAIL     →  <input>        →  elements.INPUT_EMAIL
LABEL_NAME      →  <label>        →  elements.LABEL_NAME
```

**The suffix after `_` is purely an identifier — it helps you give descriptive names to your elements without losing the tag-name-based creation.**

---

## Why Does This Exist?

### The Consistency Argument

When you are working on a project, consistency in code style reduces cognitive load. If you use `createElement.bulk()` throughout your codebase, you can read any element creation and immediately understand its structure — regardless of whether it creates one element or ten.

Using Method 2 means your single-element creation code looks just like your multi-element creation code:

```javascript
// Creating one element
const singleResult = createElement.bulk({
  BUTTON: { textContent: 'Click' }
});

// Creating multiple elements
const multiResult = createElement.bulk({
  H1:     { textContent: 'Title' },
  P:      { textContent: 'Description' },
  BUTTON: { textContent: 'Click' }
});

// Both follow the exact same pattern — easy to read and maintain
```

### The Named Access Argument

When you use `createElement.bulk()`, the result is an object with named properties. This gives your elements **semantic names** that carry meaning:

```javascript
const result = createElement.bulk({
  BUTTON_SUBMIT: { textContent: 'Submit', type: 'submit' }
});

// You can refer to the element by its meaningful name
result.BUTTON_SUBMIT.style.display = 'none';
result.BUTTON_SUBMIT.update({ disabled: true });
```

Compare this to a plain variable:

```javascript
const submitButton = document.createElement('button');
// You know what it is only because of the variable name
```

With `bulk`, the name is part of the structure — not just a convention.

---

## Mental Model: A Named Slot System

Think of `createElement.bulk()` like a set of named slots.

You describe what goes in each slot. After the call, you can reach into any slot by name and get the element out.

```
createElement.bulk({
  ┌───────────────────────────────────┐
  │  BUTTON_PRIMARY: { ... }          │  ← Slot named BUTTON_PRIMARY
  └───────────────────────────────────┘
})

Result:
  elements.BUTTON_PRIMARY  ← <button> with your config applied
```

Even when there is only one slot, the naming system is still useful. It makes it immediately clear what kind of element you are getting back.

---

## How Does It Work?

When you call `createElement.bulk({ P: { textContent: 'Hello' } })`:

```
1️⃣  Dom Helpers reads the key: "P"
    → Extracts the tag name: "p" (lowercase)
    → Stores the key as the element's identifier

2️⃣  Calls document.createElement('p') internally

3️⃣  Enhances the element with .update()

4️⃣  Applies the configuration object: element.update({ textContent: 'Hello' })

5️⃣  Creates the result object:
    {
      P: <p>Hello</p>,   ← Direct access
      all: [<p>],        ← Array of all elements
      count: 1,          ← Number of elements
      keys: ['P'],       ← Array of key names
      appendTo(),        ← Helper method
      forEach(),         ← Helper method
      // ... other helpers
    }

6️⃣  Returns the result object
```

---

## Basic Usage

### Creating a Paragraph

```javascript
const result = createElement.bulk({
  P: {
    textContent: 'This is a paragraph created with bulk.',
    style: { lineHeight: '1.6', color: '#555' }
  }
});

document.body.appendChild(result.P);
```

---

### Creating a Heading with ID and Classes

```javascript
const result = createElement.bulk({
  H2: {
    id: 'section-title',
    textContent: 'About Our Product',
    classList: { add: ['section-heading', 'text-center'] },
    style: { color: '#007bff', marginBottom: '20px' }
  }
});

Elements.content.appendChild(result.H2);
```

---

### Creating a Button with Events

```javascript
const result = createElement.bulk({
  BUTTON: {
    textContent: 'Add to Cart',
    classList: { add: ['btn', 'btn-success'] },
    style: {
      padding: '12px 24px',
      background: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    addEventListener: ['click', (e) => {
      addToCart(productId);
      e.target.update({
        textContent: '✓ Added!',
        style: { background: '#155724' }
      });
    }]
  }
});

Elements.productActions.appendChild(result.BUTTON);
```

---

### Descriptive Key Names

Key names with suffixes let you describe what an element is, not just what tag it uses:

```javascript
// Without suffix — works, but less descriptive when you have many divs
const a = createElement.bulk({ DIV: { className: 'header' } });

// With suffix — immediately clear what this div represents
const b = createElement.bulk({ DIV_HEADER: { className: 'header' } });
const c = createElement.bulk({ DIV_SIDEBAR: { className: 'sidebar' } });
const d = createElement.bulk({ DIV_FOOTER: { className: 'footer' } });
```

This becomes especially valuable when you look at code months later — the key name tells you the element's role, not just its HTML tag.

---

### Accessing the Element Multiple Ways

The result object gives you several ways to get to your element:

```javascript
const result = createElement.bulk({
  CARD: { className: 'card', style: { padding: '20px' } }
});

// Direct access by key — most common
const card1 = result.CARD;

// Via .get() — with a fallback if missing
const card2 = result.get('CARD', null);

// Via .all — as an array
const [card3] = result.all;

// Check it exists before using it
if (result.has('CARD')) {
  Elements.container.appendChild(result.CARD);
}
```

---

### Updating After Creation

```javascript
const result = createElement.bulk({
  STATUS_DOT: {
    className: 'status-indicator',
    style: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#999',
      display: 'inline-block'
    }
  }
});

Elements.header.appendChild(result.STATUS_DOT);

// Later, when connected:
function setConnected(isConnected) {
  result.STATUS_DOT.update({
    style: {
      background: isConnected ? '#28a745' : '#dc3545'
    }
  });
}
```

---

## Comparison: Method 2 vs Method 13

Both methods create a single configured element. Here is when each one shines:

### Method 13 — Direct reference

```javascript
const button = createElement('button', {
  textContent: 'Click',
  classList: { add: ['btn'] }
});

// button is the element directly
Elements.container.appendChild(button);
```

**Best for:** When you want the element reference immediately, without going through a result object. Compact and direct.

### Method 2 — Named in result object

```javascript
const result = createElement.bulk({
  BUTTON_SUBMIT: {
    textContent: 'Click',
    classList: { add: ['btn'] }
  }
});

// Access via the named key
Elements.container.appendChild(result.BUTTON_SUBMIT);
```

**Best for:** When you want to store the result object and access the element by name later, or when you plan to add more elements and want a consistent naming structure.

**The Choice is Yours:**
- Use Method 13 when you need the element immediately and directly
- Use Method 2 when named access, consistency with bulk patterns, or result-object helpers matter
- Both produce the same enhanced DOM element

---

## Real-World Example: Dynamic Alert Banner

```javascript
function createAlert(message, type) {
  const bgColors = {
    success: '#d4edda',
    error:   '#f8d7da',
    warning: '#fff3cd',
    info:    '#d1ecf1'
  };

  const textColors = {
    success: '#155724',
    error:   '#721c24',
    warning: '#856404',
    info:    '#0c5460'
  };

  const result = createElement.bulk({
    ALERT: {
      role: 'alert',
      classList: { add: ['alert', `alert-${type}`] },
      style: {
        padding: '12px 20px',
        marginBottom: '16px',
        border: '1px solid transparent',
        borderRadius: '4px',
        background: bgColors[type] || bgColors.info,
        color: textColors[type] || textColors.info
      }
    }
  });

  result.ALERT.textContent = message;
  return result.ALERT;
}

// Use it
Elements.messages.appendChild(createAlert('Profile saved.', 'success'));
Elements.messages.appendChild(createAlert('Invalid email.', 'error'));
```

---

## Summary

Method 2 — `createElement.bulk()` with a single element — gives you the full declarative power of the bulk system for a single element.

**Key points:**
- ✅ Create one element with a declarative configuration object
- ✅ The key name becomes the accessor on the result object
- ✅ The tag is derived from the key (everything before the first `_`)
- ✅ Suffixes (e.g., `BUTTON_SUBMIT`) give your element a descriptive name
- ✅ The result object includes helpers like `.all`, `.get()`, `.has()`, `.appendTo()`
- ✅ The element is automatically enhanced with `.update()`

---

## What's Next?

- **[06 — Bulk: Multiple Elements](./06_bulk-multiple-elements.md)** — The main event: creating many elements at once with one call