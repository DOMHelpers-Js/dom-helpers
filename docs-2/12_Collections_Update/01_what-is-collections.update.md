[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Collections.update()

## Quick Start (30 seconds)

Copy this, run it, and watch multiple groups of DOM elements update all at once:

```javascript
// Update three different groups of elements in a single call
Collections.update({
  'btn': {
    disabled: true,
    textContent: 'Loading...',
    style: { backgroundColor: '#9ca3af', cursor: 'not-allowed' }
  },
  'tag:p': {
    style: { lineHeight: '1.6', color: '#374151' }
  },
  'name:email': {
    placeholder: 'Enter your email address'
  }
});
```

That one call:
- Disables and grays out every element with `class="btn"`
- Sets comfortable line spacing on every `<p>` element
- Adds a placeholder to every input with `name="email"`

No loops. No manual DOM queries. One clear statement.

---

## What is Collections.update()?

`Collections.update()` is a method that lets you **update multiple groups of DOM elements at once**, all in a single function call.

Instead of targeting individual elements by their IDs (the job of `Elements.update()`), you target **collections** — groups of similar elements that share a common characteristic:

- All elements that wear the CSS class `btn`
- All `<p>` paragraph elements on the page
- All form inputs that carry the `name="email"` attribute

Think of it as the difference between sending a personal letter to one person versus broadcasting a radio message that everyone tuned to that frequency receives simultaneously. `Collections.update()` is the broadcast.

**The fundamental role it plays:**

In web development, you constantly need to apply the same change to multiple elements at once — disable all form fields during submission, switch all card backgrounds during a theme change, highlight all validation errors at once. `Collections.update()` is purpose-built for exactly this pattern.

---

## Syntax

**Basic call:**

```javascript
Collections.update({
  collectionIdentifier: updateObject,
  anotherIdentifier: updateObject,
  // ... as many collections as you need
});
```

**With return value:**

```javascript
const results = Collections.update({
  'btn': { disabled: true },
  'tag:p': { style: { color: '#374151' } }
});

// results shape:
// {
//   'btn':   { success: true, collection: EnhancedCollection, elementsUpdated: 5 },
//   'tag:p': { success: true, collection: EnhancedCollection, elementsUpdated: 12 }
// }
```

**Collection identifier formats:**

```javascript
Collections.update({
  'btn'          // shorthand — targets class="btn"
  'class:btn'    // explicit class — same result
  'tag:p'        // targets all <p> elements
  'name:email'   // targets all elements with name="email"
});
```

---

## Why Does This Exist?

### Single-Collection Direct Access — When One Group at a Time Is Your Priority

When you've already registered a collection and need to work with just that one group, direct access through the collection itself is a clean and focused approach:

```javascript
// Direct access to one collection
Collections.btn.update({
  disabled: true,
  style: { backgroundColor: '#9ca3af' }
});
```

This approach is great when you need:
✅ Focused, targeted updates to one specific group
✅ Chaining behavior directly on the collection object
✅ Working within a specific component's scope
✅ Code that reads as "update this one thing"

### Bulk Multi-Collection Updates — When `Collections.update()` Shines

In scenarios where multiple groups need coordinated updates at the same moment, `Collections.update()` provides a unified, declarative approach:

```javascript
// Update three separate groups in one atomic call
Collections.update({
  'btn': {
    disabled: true,
    textContent: 'Saving...',
    style: { backgroundColor: '#9ca3af' }
  },
  'form-field': {
    disabled: true,
    style: { opacity: '0.6' }
  },
  'tag:select': {
    disabled: true,
    style: { cursor: 'not-allowed' }
  }
});
```

This method is especially useful when:
✅ You need to update multiple groups simultaneously (form submissions, theme switching)
✅ You want a single visual statement of intent — "here's everything that changes"
✅ You're managing state that spans several different element types
✅ You want zero loops and zero manual DOM queries

**The Choice is Yours:**
- Use direct collection access (`Collections.btn.update()`) when working with a single known group
- Use `Collections.update({})` when coordinating changes across multiple groups at once
- Both approaches are valid and complement each other naturally

**Benefits of the bulk `Collections.update({})` form:**
✅ Atomic multi-group updates in one statement
✅ Self-documenting — the entire change set is visible at a glance
✅ No intermediate variables or separate DOM queries needed
✅ Easy to compare "before" and "after" states in code reviews

---

## Mental Model: The Radio Broadcast

Think of `Collections.update()` like a **radio broadcast system**.

```
                    You (the DJ)
                        │
                        │  sends one broadcast
                        │
              ┌─────────▼──────────┐
              │   Radio Station    │
              │  Collections.update│
              └─────────┬──────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
    📻 Frequency     📻 Frequency  📻 Frequency
      'btn'          'tag:p'      'name:email'
          │             │             │
     ┌────┴────┐   ┌────┴────┐   ┌───┴────┐
     │ btn 1   │   │  <p> 1  │   │ input 1│
     │ btn 2   │   │  <p> 2  │   │ input 2│
     │ btn 3   │   │  <p> 3  │   │ input 3│
     └─────────┘   └─────────┘   └────────┘
```

You don't send individual messages to each element. You broadcast once to a frequency, and every element tuned to that frequency receives the update simultaneously.

- **You** = the JavaScript code calling `Collections.update()`
- **The radio station** = the `Collections.update()` method itself
- **A frequency** = a collection identifier like `'btn'` or `'tag:p'`
- **Listeners on that frequency** = all the DOM elements that match

**That's exactly how `Collections.update()` works.**

---

## How Does It Work?

Here's what happens inside `Collections.update()` from the moment you call it to the moment every element is updated:

```
Collections.update({
  'btn': { disabled: true, textContent: 'Loading...' },
  'tag:p': { style: { color: '#374151' } }
})
         │
         ▼
1️⃣  READ THE BULK OBJECT
    Loop through each key: 'btn', 'tag:p'
         │
         ▼
2️⃣  PARSE THE COLLECTION IDENTIFIER
    'btn'   → type: class,  value: 'btn'
    'tag:p' → type: tag,    value: 'p'
         │
         ▼
3️⃣  FIND MATCHING ELEMENTS IN THE DOM
    class 'btn'  → getElementsByClassName('btn')  → [btn1, btn2, btn3]
    tag   'p'    → getElementsByTagName('p')       → [p1, p2, p3, p4...]
         │
         ▼
4️⃣  APPLY THE UPDATE OBJECT TO EVERY ELEMENT
    For each element in the collection:
      Apply textContent, style, classList, etc.
         │
         ▼
5️⃣  BUILD AND RETURN THE RESULTS OBJECT
    {
      'btn':   { success: true, collection: [...], elementsUpdated: 3 },
      'tag:p': { success: true, collection: [...], elementsUpdated: 7 }
    }
```

**Key insight:** The same update object gets applied to every element in the collection. If you have 20 buttons, they all receive the identical set of changes. This is intentional — it's what makes bulk updates so efficient.

---

## The Three Types of Collections

`Collections.update()` recognizes three ways to identify a group of elements:

### 1. By Class Name

Target all elements that carry a specific CSS class — the most common approach.

```javascript
// Shorthand (omit 'class:' — it's the default)
Collections.update({
  'btn': { disabled: true }
});

// Explicit form (same result)
Collections.update({
  'class:btn': { disabled: true }
});
```

**Targets in HTML:**
```html
<button class="btn">Save</button>      ← matched
<button class="btn primary">Send</button>  ← matched (has "btn" among its classes)
<button class="submit">Submit</button>  ← NOT matched (no "btn" class)
```

### 2. By Tag Name

Target all elements of a specific HTML tag type, regardless of their classes or IDs.

```javascript
Collections.update({
  'tag:p': { style: { lineHeight: '1.6' } },
  'tag:button': { disabled: false },
  'tag:img': { setAttribute: { loading: 'lazy' } }
});
```

**Targets in HTML:**
```html
<p>First paragraph</p>             ← matched by 'tag:p'
<p class="intro">Second</p>        ← also matched (tag type wins)
<div>A div element</div>            ← NOT matched
```

### 3. By Name Attribute

Target all form elements that share the same `name` attribute value.

```javascript
Collections.update({
  'name:email': { placeholder: 'your.email@example.com' },
  'name:phone': { placeholder: '+1 (555) 000-0000' }
});
```

**Targets in HTML:**
```html
<input type="text" name="email">    ← matched
<input type="email" name="email">   ← also matched (same name)
<input type="text" name="username"> ← NOT matched (different name)
```

---

## Basic Usage

### Starting Simple: One Collection

```javascript
// HTML: <button class="btn">Save</button> × 3

Collections.update({
  'btn': {
    disabled: true,
    style: { backgroundColor: '#9ca3af' }
  }
});

// Before: 3 active, colored buttons
// After:  3 disabled, gray buttons
```

### Scaling Up: Multiple Collections at Once

```javascript
Collections.update({
  'btn': {
    disabled: true,
    textContent: 'Please wait...'
  },
  'tag:input': {
    disabled: true,
    style: { opacity: '0.6' }
  },
  'tag:select': {
    disabled: true
  }
});

// All three groups updated simultaneously — one call
```

### Using All Four Identifier Formats

```javascript
Collections.update({
  'card'        : { style: { opacity: '0.8' } },       // shorthand class
  'class:badge' : { style: { display: 'none' } },      // explicit class
  'tag:a'       : { style: { color: '#60a5fa' } },     // by tag
  'name:email'  : { placeholder: 'Enter email...' }    // by name attribute
});
```

---

## Deep Dive: Key Principles

### Principle 1: Every Element in the Collection Gets the Identical Update

```javascript
Collections.update({
  'btn': { textContent: 'Click Me' }
});

// If 'btn' has 10 buttons, ALL 10 will say "Click Me"
// There is no per-element differentiation within one collection call
```

This is the defining characteristic of `Collections.update()`. It is a broadcast, not individual addressing.

**When you need different text per button,** use `Elements.update()` instead:

```javascript
Elements.update({
  saveBtn:   { textContent: 'Save' },
  cancelBtn: { textContent: 'Cancel' },
  deleteBtn: { textContent: 'Delete' }
});
```

### Principle 2: Multiple Collections in a Single Call

```javascript
Collections.update({
  'card':       { /* all .card elements */ },
  'tag:h2':     { /* all <h2> elements */ },
  'name:phone': { /* all [name="phone"] elements */ }
});
```

There's no practical limit on how many collections you include in one call.

### Principle 3: Empty Collections Are Silent — Not Errors

If no elements match a collection identifier, the update simply does nothing for that collection. You will not get an error. You will get a result with `success: true` and `elementsUpdated: 0`.

```javascript
const results = Collections.update({
  'nonexistent-class': { textContent: 'Hello' }
});

// results['nonexistent-class']:
// { success: true, collection: EmptyCollection, elementsUpdated: 0 }
```

### Principle 4: Class Names Are Case-Sensitive

```javascript
'btn': {}    // Matches class="btn"
'Btn': {}    // Matches class="Btn" — completely different!
'BTN': {}    // Matches class="BTN" — also different!
```

Tag names are case-insensitive in HTML, but class names are case-sensitive. Always match the exact casing of your HTML.

---

## Comparison: When to Use Which Update Method

| Method | Targets | Best For | Example Key |
|--------|---------|----------|-------------|
| **Elements.update()** | Individual elements by registered name | Updating specific named elements with unique content | `saveBtn`, `headerTitle` |
| **Collections.update()** | Groups of elements by class, tag, or name | Applying the same change to multiple similar elements | `'btn'`, `'tag:input'`, `'name:email'` |
| **Selector.update()** | Any CSS selector | Complex, precise targeting with attribute or pseudo-selectors | `'input[type="email"]'`, `'tr:nth-child(even)'` |

**Choosing is straightforward:**
- One specific element → `Elements.update()`
- A group sharing a class, tag, or name → `Collections.update()`
- A complex CSS pattern → `Selector.update()`

---

## Real-World Scenarios Where Collections.update() Shines

**Theme switching:**
```javascript
function enableDarkMode() {
  Collections.update({
    'card':     { style: { backgroundColor: '#1f2937', color: '#f9fafb' } },
    'sidebar':  { style: { backgroundColor: '#111827' } },
    'tag:a':    { style: { color: '#60a5fa' } }
  });
}
```

**Form submission state:**
```javascript
function setSubmitting() {
  Collections.update({
    'tag:input':    { disabled: true, style: { opacity: '0.6' } },
    'tag:button':   { disabled: true },
    'submit-btn':   { textContent: 'Submitting...', classList: { add: 'loading' } }
  });
}
```

**Validation feedback:**
```javascript
function showErrors() {
  Collections.update({
    'error-input': {
      style: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
      setAttribute: { 'aria-invalid': 'true' }
    },
    'error-message': {
      style: { display: 'block', color: '#dc2626' }
    }
  });
}
```

---

## Summary

`Collections.update()` is the tool you reach for whenever you need to apply the same changes to a group of elements.

**The key points to remember:**

1. **It updates groups, not individuals.** Class, tag, and name attributes define the group.
2. **One call can update many groups at once.** Pass as many collection identifiers as you need.
3. **Every element in a group gets the same update.** No per-element variation within a single collection.
4. **Empty collections don't cause errors.** Silent operation with `success: true` and `elementsUpdated: 0`.
5. **Four identifier formats:** `'name'` (shorthand class), `'class:name'` (explicit class), `'tag:name'`, `'name:value'`.

**The simple rule to remember:**

> "When you want every member of a group to change the same way, that's `Collections.update()`."

---

**Up next:** Understanding the basic example line by line, and then deep-diving into the `type:value` format.