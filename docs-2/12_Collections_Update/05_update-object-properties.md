[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Update Object Properties

## Quick Start (30 seconds)

The update object is the second half of every `Collections.update()` entry. It's where you describe **what changes to make** to every element in a collection. Here's how rich it can be:

```javascript
Collections.update({
  'notification': {
    textContent: 'Upload complete!',          // category 1: text content
    style: { backgroundColor: '#10b981' },    // category 3: styles
    classList: { add: 'visible', remove: 'hidden' }, // category 4: classes
    setAttribute: { role: 'alert' },          // category 5: attributes
    dataset: { dismissible: 'true' },         // category 6: data attributes
    addEventListener: ['click', handleDismiss] // category 7: events
  }
});
```

All of these changes apply to **every element** in the `'notification'` collection simultaneously.

This chapter covers all 8 property categories in full detail, specific to the `Collections.update()` context.

---

## The Fundamental Rule: Same Update, Every Element

Before diving into properties, here is the most important thing to understand about update objects inside `Collections.update()`:

```
The same update object is applied to EVERY element in the collection.

Collections.update({
  'btn': { textContent: 'Click Me' }
});

If 'btn' has 10 buttons → all 10 will say "Click Me"
If 'btn' has 1 button  → that 1 button will say "Click Me"
If 'btn' has 0 buttons → nothing happens, no error
```

This broadcast behavior is the defining characteristic of `Collections.update()`. Plan your update objects with this in mind.

**When you need per-element variation** (each button gets different text), use `Elements.update()` instead, which targets individual registered elements by name.

---

## Category 1: Text Content

Three properties let you set the text or HTML content of elements.

### `textContent` — Safe plain text

```javascript
Collections.update({
  'btn': { textContent: 'Loading...' }
});
// Sets the visible text of every .btn element to "Loading..."
// Any existing HTML inside the element is replaced with plain text
```

**When to use:** Any time you're setting text that does not contain HTML tags. This is the safe default.

### `innerHTML` — HTML content

```javascript
Collections.update({
  'card-header': {
    innerHTML: '<strong>Featured</strong> <span class="badge">New</span>'
  }
});
// Parses the string as HTML and sets the inner content
```

**When to use:** When you need to embed HTML tags inside the element. Use with caution — only use with trusted content you control, never with user-supplied data.

> **XSS Rule:** Never set `innerHTML` to a value that comes from user input, URL parameters, or any external source. Always use `textContent` for user-supplied text.

### `innerText` — Rendered text (respects CSS visibility)

```javascript
Collections.update({
  'label': { innerText: 'Required Field' }
});
// Similar to textContent, but respects CSS visibility and white-space rendering
```

**When to use:** When you need the text to behave exactly as it would render visually, preserving CSS-defined line breaks and hidden elements.

**Quick comparison:**

```
textContent  → fastest, ignores CSS, safe for plain text   ← use this most of the time
innerHTML    → parses HTML, allows tags, XSS risk if misused
innerText    → respects CSS rendering, slightly slower
```

---

## Category 2: Basic DOM Properties

These properties map directly to DOM element properties — set them as you would `element.propertyName = value`.

### Common properties

```javascript
Collections.update({
  'tag:input': {
    value: '',               // Clears all input field values
    disabled: true,          // Disables interactive elements
    checked: false,          // Unchecks checkboxes/radio buttons
    placeholder: 'Type here...',  // Sets placeholder hint text
    tabIndex: -1             // Removes elements from tab order
  }
});
```

### `disabled` — Enable or disable interaction

```javascript
// Disable all form fields
Collections.update({
  'tag:input':    { disabled: true },
  'tag:button':   { disabled: true },
  'tag:select':   { disabled: true },
  'tag:textarea': { disabled: true }
});

// Re-enable them
Collections.update({
  'tag:input':    { disabled: false },
  'tag:button':   { disabled: false },
  'tag:select':   { disabled: false },
  'tag:textarea': { disabled: false }
});
```

### `value` — Set input field values

```javascript
// Clear all form fields
Collections.update({
  'tag:input':    { value: '' },
  'tag:textarea': { value: '' }
});

// Pre-fill all quantity fields with default
Collections.update({
  'name:quantity': { value: '1' }
});
```

### `checked` — Checkboxes and radio buttons

```javascript
// Uncheck all checkboxes
Collections.update({
  'tag:input': { checked: false }
});

// Check all "remember me" checkboxes
Collections.update({
  'name:remember': { checked: true }
});
```

### `href` and `src` — Link and media sources

```javascript
// Update all placeholder image sources
Collections.update({
  'product-image': { src: '/images/placeholder.png' }
});

// Update all download links to new path
Collections.update({
  'download-link': { href: '/downloads/v2/' }
});
```

### `placeholder` — Input hint text

```javascript
Collections.update({
  'name:email':    { placeholder: 'you@example.com' },
  'name:phone':    { placeholder: '+1 (555) 000-0000' },
  'name:username': { placeholder: 'Choose a username' }
});
```

---

## Category 3: Style

The `style` property takes an object of CSS property names written in **camelCase**.

```javascript
Collections.update({
  'card': {
    style: {
      backgroundColor: '#1e293b',   // background-color
      borderRadius: '8px',          // border-radius
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',  // box-shadow
      fontSize: '0.875rem',         // font-size
      lineHeight: '1.5',            // line-height
      marginBottom: '16px',         // margin-bottom
      padding: '16px 24px'          // padding
    }
  }
});
```

### camelCase conversion reference

| CSS property | camelCase in update object |
|---|---|
| `background-color` | `backgroundColor` |
| `border-radius` | `borderRadius` |
| `box-shadow` | `boxShadow` |
| `font-size` | `fontSize` |
| `font-weight` | `fontWeight` |
| `line-height` | `lineHeight` |
| `margin-bottom` | `marginBottom` |
| `padding-top` | `paddingTop` |
| `text-decoration` | `textDecoration` |
| `z-index` | `zIndex` |
| `pointer-events` | `pointerEvents` |
| `page-break-inside` | `pageBreakInside` |

### Resetting styles

Set a property to an empty string (`''`) to remove an inline style, letting your CSS file take over:

```javascript
// Remove all inline color overrides — let CSS handle it
Collections.update({
  'tag:a': { style: { color: '' } }
});
```

### Practical example: Theme switch

```javascript
Collections.update({
  'card': {
    style: {
      backgroundColor: '#1e293b',
      color: '#e2e8f0',
      borderColor: '#334155',
      boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
    }
  }
});
```

---

## Category 4: classList

The `classList` property lets you add, remove, toggle, and replace CSS classes on every element in the collection.

```javascript
Collections.update({
  'btn': {
    classList: {
      add: 'loading',          // add one class
      remove: 'ready',         // remove one class
      toggle: 'active',        // add if absent, remove if present
      replace: ['old', 'new']  // replace one class with another
    }
  }
});
```

You can use any combination of these four operations in a single `classList` object.

### `add` — Add one or more classes

```javascript
// Add a single class
Collections.update({
  'card': { classList: { add: 'highlighted' } }
});

// Add multiple classes
Collections.update({
  'card': { classList: { add: ['highlighted', 'featured', 'visible'] } }
});
```

### `remove` — Remove one or more classes

```javascript
// Remove a single class
Collections.update({
  'card': { classList: { remove: 'loading' } }
});

// Remove multiple classes at once
Collections.update({
  'card': { classList: { remove: ['loading', 'error', 'stale'] } }
});
```

### `toggle` — Add if missing, remove if present

```javascript
// Toggle the 'expanded' class on all accordion panels
Collections.update({
  'accordion-panel': { classList: { toggle: 'expanded' } }
});
```

### `replace` — Replace one class with another

```javascript
// Replace 'btn-primary' with 'btn-secondary' on all matching elements
Collections.update({
  'btn-primary': { classList: { replace: ['btn-primary', 'btn-secondary'] } }
});
```

### Combining operations

```javascript
Collections.update({
  'tag:button': {
    classList: {
      add: ['active', 'visible'],
      remove: 'hidden',
      toggle: 'focus-ring'
    }
  }
});
```

---

## Category 5: setAttribute and removeAttribute

### `setAttribute` — Set HTML attributes

```javascript
Collections.update({
  'tag:img': {
    setAttribute: {
      loading: 'lazy',
      decoding: 'async',
      alt: 'Product image'
    }
  }
});
```

```javascript
// ARIA accessibility attributes
Collections.update({
  'tag:button': {
    setAttribute: {
      role: 'button',
      'aria-pressed': 'false',
      type: 'button'
    }
  }
});
```

```javascript
// Form validation attributes
Collections.update({
  'name:email': {
    setAttribute: {
      required: 'true',
      'aria-invalid': 'false',
      autocomplete: 'email'
    }
  }
});
```

### `removeAttribute` — Remove HTML attributes

Pass an array of attribute names to remove them entirely:

```javascript
// Remove all disabled attributes (re-enable elements)
Collections.update({
  'form-field': {
    removeAttribute: ['disabled', 'aria-disabled']
  }
});
```

```javascript
// Remove data attributes that are no longer relevant
Collections.update({
  'card': {
    removeAttribute: ['data-loading', 'data-error', 'data-stale']
  }
});
```

### Combining setAttribute and removeAttribute

```javascript
Collections.update({
  'tag:input': {
    setAttribute: { 'aria-invalid': 'true', required: 'true' },
    removeAttribute: ['disabled', 'readonly']
  }
});
```

---

## Category 6: dataset

The `dataset` property sets `data-*` attributes on elements. Write keys in **camelCase** — the library automatically converts them to `kebab-case` HTML attribute names.

```javascript
Collections.update({
  'product-card': {
    dataset: {
      price: '29.99',          // becomes data-price="29.99"
      category: 'electronics', // becomes data-category="electronics"
      inStock: 'true',         // becomes data-in-stock="true"  ← camelCase → kebab-case
      itemId: '12345'          // becomes data-item-id="12345"
    }
  }
});
```

### camelCase to kebab-case conversion

| `dataset` key | HTML attribute |
|---|---|
| `price` | `data-price` |
| `category` | `data-category` |
| `inStock` | `data-in-stock` |
| `itemId` | `data-item-id` |
| `userId` | `data-user-id` |
| `pageCount` | `data-page-count` |

### Practical use cases

```javascript
// Mark all notification cards with timeout values
Collections.update({
  'notification': {
    dataset: {
      timeout: '5000',
      dismissible: 'true'
    }
  }
});

// Tag all product cards with tracking data
Collections.update({
  'product-card': {
    dataset: {
      trackingId: 'prod-featured',
      section: 'hero'
    }
  }
});
```

---

## Category 7: addEventListener

Add an event listener to every element in the collection.

```javascript
Collections.update({
  'clickable-card': {
    addEventListener: ['click', (event) => {
      console.log('Card clicked:', event.currentTarget.textContent);
    }]
  }
});
```

### Format

```javascript
addEventListener: [eventName, handlerFunction]
// or with options:
addEventListener: [eventName, handlerFunction, optionsObject]
```

### Examples

```javascript
// Add click handlers to all buttons
Collections.update({
  'tag:button': {
    addEventListener: ['click', handleButtonClick]
  }
});

// Add input events to all text fields
Collections.update({
  'tag:input': {
    addEventListener: ['input', handleInputChange]
  }
});

// Add with capture option
Collections.update({
  'modal-overlay': {
    addEventListener: ['click', handleOverlayClick, { capture: true }]
  }
});
```

### Important consideration: Each element gets its own listener

When you add an event listener via `Collections.update()`, **each element in the collection gets its own independent listener**. If you call `Collections.update()` again with the same listener, each element will have the listener added a second time.

```javascript
// First call: each .btn gets 1 click listener
Collections.update({
  'btn': { addEventListener: ['click', handleClick] }
});

// Second call: each .btn now has 2 click listeners
Collections.update({
  'btn': { addEventListener: ['click', handleClick] }
});
```

For event listeners that should run once, use the `{ once: true }` option:

```javascript
Collections.update({
  'btn': {
    addEventListener: ['click', handleClick, { once: true }]
  }
});
```

---

## Category 8: DOM Method Calls

Call native DOM methods directly on every element in the collection using array syntax.

```javascript
Collections.update({
  'focus-target': {
    focus: []          // calls element.focus()
  }
});

Collections.update({
  'scroll-target': {
    scrollIntoView: [{ behavior: 'smooth', block: 'center' }]
  }
});
```

### Format

```javascript
methodName: []                    // call with no arguments
methodName: [arg1, arg2, ...]     // call with arguments
```

### Examples

```javascript
// Focus the first form field (works on each element in the collection)
Collections.update({
  'first-field': {
    focus: []
  }
});

// Scroll all highlighted elements into view
Collections.update({
  'highlighted': {
    scrollIntoView: [{ behavior: 'smooth', block: 'nearest' }]
  }
});

// Request pointer lock (gaming/fullscreen interactions)
Collections.update({
  'game-canvas': {
    requestPointerLock: []
  }
});
```

### Common DOM methods you can call

```javascript
focus: []
blur: []
click: []
scrollIntoView: [{ behavior: 'smooth' }]
scrollTo: [{ top: 0, behavior: 'smooth' }]
setAttribute: [/* note: also available as its own category */]
removeAttribute: ['name']
```

---

## Combining All Categories

The true power of update objects comes from combining multiple categories in a single, atomic update:

```javascript
Collections.update({
  'notification': {
    // Category 1: Text content
    textContent: 'Your file has been uploaded successfully.',

    // Category 3: Styles
    style: {
      backgroundColor: '#10b981',
      color: '#ffffff',
      padding: '12px 16px',
      borderRadius: '6px',
      display: 'flex'
    },

    // Category 4: Classes
    classList: {
      add: 'visible',
      remove: ['hidden', 'error', 'warning']
    },

    // Category 5: Attributes
    setAttribute: {
      role: 'alert',
      'aria-live': 'polite',
      'aria-atomic': 'true'
    },

    // Category 6: Dataset
    dataset: {
      type: 'success',
      dismissible: 'true',
      timeout: '5000'
    },

    // Category 8: DOM method
    scrollIntoView: [{ behavior: 'smooth', block: 'nearest' }]
  }
});
```

Every element with the `notification` class receives all of these changes simultaneously.

---

## The "Every Element Gets the Same Update" Consideration

This is worth repeating with a specific example to make the implication concrete:

```javascript
Collections.update({
  'btn': { textContent: 'Save' }
});
```

If your page has this HTML:

```html
<button class="btn">Submit Form</button>
<button class="btn">Delete Account</button>
<button class="btn">Export Data</button>
```

After the call, all three buttons will say "Save". This may or may not be what you want.

**When it IS what you want** (broadcast pattern):
```javascript
// Setting all buttons to loading state — same text is correct
Collections.update({
  'btn': { textContent: 'Loading...', disabled: true }
});
```

**When it is NOT what you want** (individual addressing):
```javascript
// Use Elements.update() when buttons need different content
Elements.update({
  submitBtn:  { textContent: 'Submit Form' },
  deleteBtn:  { textContent: 'Delete Account' },
  exportBtn:  { textContent: 'Export Data' }
});
```

Knowing this distinction helps you choose between `Collections.update()` and `Elements.update()` for the right situations.

---

## Quick Reference

```javascript
Collections.update({
  'collection-name': {

    // CATEGORY 1: Text Content
    textContent: 'Plain text (safe)',
    innerHTML: '<strong>HTML content</strong>',
    innerText: 'CSS-aware text',

    // CATEGORY 2: Basic DOM Properties
    value: 'input value',
    disabled: true / false,
    checked: true / false,
    placeholder: 'Hint text',
    href: 'https://...',
    src: '/path/to/file',
    tabIndex: 0,

    // CATEGORY 3: Styles (camelCase CSS)
    style: {
      backgroundColor: '#fff',
      fontSize: '1rem',
      display: 'none',
      // any CSS property in camelCase
    },

    // CATEGORY 4: Class List
    classList: {
      add: 'className' or ['class1', 'class2'],
      remove: 'className' or ['class1', 'class2'],
      toggle: 'className',
      replace: ['oldClass', 'newClass']
    },

    // CATEGORY 5: Attributes
    setAttribute: {
      'attr-name': 'value',
      'aria-label': 'description',
      role: 'button'
    },
    removeAttribute: ['attr1', 'attr2'],

    // CATEGORY 6: Dataset (camelCase → data-kebab-case)
    dataset: {
      key: 'value',        // → data-key="value"
      myKey: 'value'       // → data-my-key="value"
    },

    // CATEGORY 7: Event Listeners
    addEventListener: ['eventName', handlerFn],
    addEventListener: ['eventName', handlerFn, { once: true }],

    // CATEGORY 8: DOM Method Calls
    focus: [],
    blur: [],
    scrollIntoView: [{ behavior: 'smooth' }],
    click: []
  }
});
```

---

## Key Difference From Elements.update()

| Aspect | Elements.update() | Collections.update() |
|---|---|---|
| **Target** | One specific registered element per key | Multiple elements sharing a class, tag, or name |
| **Update object** | Applied to that one element | Applied identically to every element in the group |
| **Best for** | Unique per-element content and behavior | Uniform group changes |
| **Categories available** | All 8 categories | All 8 categories — identical API |

The update object categories themselves are identical between the two methods. The difference is purely in how many elements receive the update, and whether they're targeted by name or by group membership.

---

## Key Takeaways

1. **8 categories:** text content, basic DOM props, style, classList, setAttribute/removeAttribute, dataset, addEventListener, DOM method calls.
2. **Same update → every element.** The update object broadcasts to all collection members.
3. **camelCase for style properties.** `background-color` becomes `backgroundColor`.
4. **camelCase for dataset keys.** `inStock` becomes `data-in-stock`.
5. **classList supports 4 operations:** add, remove, toggle, replace.
6. **Empty string resets a style** to its CSS-defined value.
7. **DOM method calls** use array syntax: `focus: []`, `scrollIntoView: [opts]`.
8. **addEventListener** attaches to each element individually — be mindful of duplicate handlers.

---

**Up next:** Understanding the return value — the detailed report that `Collections.update()` sends back after every call.