[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Understanding the Type:Value Format

## Quick Start (30 seconds)

Collection identifiers follow a simple pattern. Once you see it, you'll recognize it instantly every time:

```javascript
Collections.update({
  'btn'          : { disabled: true },  // shorthand — class="btn"
  'class:card'   : { style: { opacity: '0.8' } },  // explicit class
  'tag:p'        : { style: { lineHeight: '1.6' } },  // HTML tag
  'name:email'   : { placeholder: 'Enter email' }   // name attribute
});
```

That's it. Four formats. Learn them once, use them forever.

---

## What Is the Type:Value Format?

Every collection identifier in `Collections.update()` follows this pattern:

```
'type:value'
  │    │
  │    └── The specific identifier to match against (class name, tag name, or attribute value)
  └──────── What kind of thing you're matching (class, tag, or name)
```

Think of it like a **filing system with labeled folders**:

```
Filing Cabinet (your HTML page)
├── 📁 CLASS folder
│     ├── 'btn'      → all elements where class includes "btn"
│     ├── 'card'     → all elements where class includes "card"
│     └── 'alert'    → all elements where class includes "alert"
│
├── 📁 TAG folder
│     ├── 'tag:p'      → all <p> elements
│     ├── 'tag:button' → all <button> elements
│     └── 'tag:img'    → all <img> elements
│
└── 📁 NAME folder
      ├── 'name:email'    → all elements where name="email"
      ├── 'name:username' → all elements where name="username"
      └── 'name:phone'    → all elements where name="phone"
```

When you write a collection identifier, you're telling the library which folder to open and which file to pull from it.

---

## Syntax: All Four Formats

```javascript
// FORMAT 1: Shorthand class (no prefix)
Collections.update({
  'btn': { /* ... */ }            // class="btn"
});

// FORMAT 2: Explicit class (with 'class:' prefix)
Collections.update({
  'class:btn': { /* ... */ }      // same result as 'btn'
});

// FORMAT 3: Tag name (with 'tag:' prefix)
Collections.update({
  'tag:p': { /* ... */ }          // all <p> elements
});

// FORMAT 4: Name attribute (with 'name:' prefix)
Collections.update({
  'name:email': { /* ... */ }     // all elements with name="email"
});
```

---

## Type 1: Class Collections

### The format

```javascript
'className'        // shorthand
'class:className'  // explicit — identical result
```

### What it targets

Every element where the `class` attribute **contains** that class name. An element can have many classes — as long as the target class is one of them, it matches.

```html
<button class="btn">Save</button>            ← matched by 'btn'
<button class="btn primary large">Send</button>  ← also matched (has "btn")
<button class="submit">Submit</button>        ← NOT matched (no "btn")
<a class="btn link-btn">Click</a>            ← matched (has "btn")
```

```javascript
Collections.update({
  'btn': { style: { padding: '10px 20px' } }
});
// Updates: Save, Send, Click — not Submit
```

### Real examples

```javascript
// Disable all primary action buttons
Collections.update({
  'btn-primary': { disabled: true }
});

// Highlight all error-state inputs
Collections.update({
  'error-input': {
    style: { borderColor: '#ef4444' },
    setAttribute: { 'aria-invalid': 'true' }
  }
});

// Hide all notification banners
Collections.update({
  'notification': { style: { display: 'none' } }
});
```

### When to use class collections

✅ When elements share a styling or behavioral purpose (all buttons, all cards, all alerts)
✅ The most common use case — default for a reason
✅ When your group membership is defined by CSS class in HTML

---

## Type 2: Tag Collections

### The format

```javascript
'tag:tagName'      // standard prefix
'tagname:tagName'  // alternative prefix — identical result
```

### What it targets

Every element with that HTML tag, regardless of their classes or IDs.

```html
<p>First paragraph.</p>           ← matched by 'tag:p'
<p class="intro">Second.</p>      ← also matched (class doesn't matter)
<p id="special">Third.</p>        ← also matched (ID doesn't matter)
<div>A div element.</div>          ← NOT matched (different tag)
<span>A span element.</span>       ← NOT matched (different tag)
```

```javascript
Collections.update({
  'tag:p': { style: { lineHeight: '1.6' } }
});
// Updates all three <p> elements
```

### Real examples

```javascript
// Style all paragraph text on the page
Collections.update({
  'tag:p': {
    style: { lineHeight: '1.6', marginBottom: '1rem', color: '#374151' }
  }
});

// Disable all form inputs during submission
Collections.update({
  'tag:input': { disabled: true },
  'tag:textarea': { disabled: true },
  'tag:select': { disabled: true }
});

// Add lazy loading to every image
Collections.update({
  'tag:img': {
    setAttribute: { loading: 'lazy', decoding: 'async' }
  }
});

// Open all links in new tab
Collections.update({
  'tag:a': {
    setAttribute: { target: '_blank', rel: 'noopener noreferrer' }
  }
});
```

### When to use tag collections

✅ When you want to affect all elements of a semantic HTML type
✅ For form field management (disable all inputs, all selects)
✅ For page-wide typographic changes (all paragraphs, all headings)
✅ When the group is defined by element type, not by styling class

---

## Type 3: Name Attribute Collections

### The format

```javascript
'name:attributeValue'
```

### What it targets

Every form element where the `name` attribute equals the given value exactly.

```html
<input type="email" name="email">        ← matched by 'name:email'
<input type="text" name="email">         ← also matched (same name)
<input type="email" name="user-email">   ← NOT matched (different name)
<input type="text" name="username">      ← NOT matched (different name)
```

```javascript
Collections.update({
  'name:email': { placeholder: 'your.email@example.com' }
});
// Updates both email inputs
```

### Real examples

```javascript
// Set placeholders on all email fields
Collections.update({
  'name:email': { placeholder: 'your.email@example.com', required: true }
});

// Validate all phone number fields
Collections.update({
  'name:phone': {
    style: { borderColor: '#ef4444' },
    setAttribute: { 'aria-invalid': 'true' }
  }
});

// Mark all terms-agreement checkboxes
Collections.update({
  'name:terms': { required: true }
});

// Update all quantity fields in a cart
Collections.update({
  'name:quantity': {
    setAttribute: { min: '1', max: '99' }
  }
});
```

### When to use name collections

✅ For form field validation that spans multiple forms
✅ When multiple forms on the same page have identically-named fields
✅ For radio button groups (radio buttons share the same name)
✅ When your grouping logic is based on what data the field represents

---

## Visual Comparison: How Each Type Selects Differently

This example makes the difference unmistakable. Same HTML, three different collection types, three different sets of elements selected:

**HTML:**
```html
<div class="container">
  <button class="btn" name="submit">Button A</button>
  <button class="btn-large" name="submit">Button B</button>
  <button class="btn" name="cancel">Button C</button>
  <input class="btn" name="submit" type="submit">
</div>
```

**Targeting by class `'btn'`:**
```
┌──────────────────────────────────┐
│ ✅ Button A  (class includes btn) │
│ ❌ Button B  (no btn class)       │
│ ✅ Button C  (class includes btn) │
│ ✅ Input     (class includes btn) │
└──────────────────────────────────┘
Selected: Button A, Button C, Input
```

**Targeting by tag `'tag:button'`:**
```
┌──────────────────────────────────┐
│ ✅ Button A  (<button> tag)       │
│ ✅ Button B  (<button> tag)       │
│ ✅ Button C  (<button> tag)       │
│ ❌ Input     (<input> tag)        │
└──────────────────────────────────┘
Selected: Button A, Button B, Button C
```

**Targeting by name `'name:submit'`:**
```
┌──────────────────────────────────┐
│ ✅ Button A  (name="submit")      │
│ ✅ Button B  (name="submit")      │
│ ❌ Button C  (name="cancel")      │
│ ✅ Input     (name="submit")      │
└──────────────────────────────────┘
Selected: Button A, Button B, Input
```

Each type draws a different boundary around "which elements belong to this collection."

---

## Combining All Three Types in One Call

The real power emerges when you mix all three types in a single `Collections.update()` call:

```javascript
// Form submission state — disable and indicate loading across all field types
Collections.update({
  // By class: the submit button specifically
  'btn-submit': {
    disabled: true,
    textContent: 'Submitting...',
    style: { backgroundColor: '#9ca3af', cursor: 'not-allowed' }
  },

  // By tag: every input and textarea regardless of class
  'tag:input': {
    disabled: true,
    style: { opacity: '0.6' }
  },
  'tag:textarea': {
    disabled: true,
    style: { opacity: '0.6' }
  },

  // By name: show error specifically on email fields
  'name:email': {
    style: { borderColor: '#ef4444' }
  }
});
```

This single call coordinates changes across class-based groups, tag-based groups, and name-based groups simultaneously.

---

## When to Use Which Type

### Decision guide:

```
Question: What defines membership in this group?

  The elements share a CSS class?
  └─→ Use class: (or shorthand)
      Examples: 'btn', 'card', 'class:alert'

  The elements are the same HTML tag type?
  └─→ Use tag:
      Examples: 'tag:p', 'tag:button', 'tag:input'

  The elements share a form name attribute?
  └─→ Use name:
      Examples: 'name:email', 'name:phone', 'name:quantity'
```

### A more detailed breakdown:

| Use class when... | Use tag when... | Use name when... |
|-------------------|-----------------|------------------|
| Elements are grouped by visual role (btn, card, alert) | You want all elements of a semantic type | Elements are form fields representing the same data |
| The group is defined in your CSS | You want to affect entire HTML categories | The group spans multiple forms |
| Membership is explicitly assigned via class attribute | All instances should change regardless of class | Radio button groups (share same name) |

---

## Edge Cases and Gotchas

### Gotcha 1: Class names are case-sensitive

```javascript
'btn': {}        // Matches class="btn"    ✅
'Btn': {}        // Matches class="Btn"    ← different!
'BTN': {}        // Matches class="BTN"    ← also different!
```

Always match the exact casing used in your HTML.

```javascript
// ✅ Correct — matches exactly
Collections.update({ 'error-message': { style: { display: 'block' } } });

// ❌ Won't find anything if HTML uses lowercase
Collections.update({ 'Error-Message': { style: { display: 'block' } } });
```

### Gotcha 2: Tag names are case-insensitive in HTML

```javascript
'tag:button': {}   // ✅ Works — matches <button>, <BUTTON>, <Button>
'tag:p': {}        // ✅ Works — matches <p>, <P>
```

HTML tag names are not case-sensitive. However, by convention, always write them lowercase in your collection identifiers.

### Gotcha 3: name: only works with form elements

The `name:` prefix uses `getElementsByName()` internally, which matches only form-associated elements:

```html
<input name="submit">     ✅  matched
<button name="submit">    ✅  matched
<textarea name="submit">  ✅  matched
<select name="submit">    ✅  matched
<div name="submit">       ❌  NOT matched (not a form element)
<p name="submit">         ❌  NOT matched (not a form element)
```

### Gotcha 4: An element with multiple classes matches if any one matches

```html
<button class="btn primary large featured">Click</button>
```

```javascript
Collections.update({ 'btn': { disabled: true } })     // ✅ matches
Collections.update({ 'primary': { disabled: true } }) // ✅ also matches
Collections.update({ 'large': { disabled: true } })   // ✅ also matches
```

The class check asks "does this element have this class?" not "is this the only class?"

### Gotcha 5: Do not use CSS selector syntax

```javascript
// ❌ These are CSS selector formats — they won't work as expected here
Collections.update({ '.btn': {} })         // dot prefix has no meaning
Collections.update({ '#myId': {} })        // hash prefix has no meaning
Collections.update({ 'p.intro': {} })      // compound selector won't work

// ✅ Use Collections.update() format
Collections.update({ 'btn': {} })          // class name directly
// For ID-targeting, use Elements.update()
// For compound selectors, use Selector.update()
```

---

## Quick Reference Table

| Format | What it matches | Case sensitive? | Notes |
|--------|-----------------|-----------------|-------|
| `'name'` | `class="name"` (shorthand) | Yes | Most common format |
| `'class:name'` | `class="name"` (explicit) | Yes | Same as shorthand |
| `'tag:name'` | All `<name>` elements | No | Matches any element of that tag |
| `'tagname:name'` | All `<name>` elements | No | Alternative to `tag:` |
| `'name:value'` | `name="value"` attribute | Yes | Form elements only |

---

## Mental Model: Three Different Filing Systems

Think of the three types as three separate ways to organize the same group of employees:

```
The same group of employees organized three different ways:

📁 BY JOB TITLE (class)
   └── "Find everyone whose title includes 'Engineer'"
       ← class="engineer senior-engineer" matches
       ← class="manager" does NOT match

📁 BY SPECIES (tag — humorous analogy for structure)
   └── "Find everyone who is human" (vs robot, cat, etc.)
       ← <human> tag matches regardless of title
       ← <robot> tag does NOT match

📁 BY FIRST NAME (name attribute)
   └── "Find everyone named 'John'"
       ← name="John" matches
       ← name="Jane" does NOT match
```

Each system organizes the same population differently. Collections.update() lets you look them up by whichever categorization makes sense for the task at hand.

---

## Key Takeaways

1. **Four formats, three types:** shorthand class, explicit class, tag, and name.
2. **No prefix = class by default.** `'btn'` is shorthand for `'class:btn'`.
3. **`tag:` targets by HTML element type**, not by class or attribute.
4. **`name:` targets by name attribute**, primarily for form fields.
5. **Class names are case-sensitive.** Tag names are not.
6. **Multiple types can be mixed** freely in a single `Collections.update()` call.
7. **`name:` only matches form-associated elements** (input, button, textarea, select).
8. **No CSS selector syntax** — no dots, no hashes, no combinators.

---

**Up next:** Real-world examples putting all three types into practice across 10 practical scenarios.