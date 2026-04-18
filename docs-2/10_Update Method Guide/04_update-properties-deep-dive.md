[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Update Properties: Deep Dive

Every key you can put in an update object — what it does, how it behaves, and when to use each one.

---

## Quick Start (30 Seconds)

```javascript
element.update({
  // 1. Text Content
  textContent: 'Safe plain text',

  // 2. Basic Properties
  disabled: true,
  value: 'input value',
  checked: false,

  // 3. Styles
  style: { backgroundColor: 'blue', fontSize: '16px' },

  // 4. Classes
  classList: { add: 'active', remove: 'hidden' },

  // 5. HTML Attributes
  setAttribute: { 'aria-label': 'Close', 'role': 'button' },

  // 6. Data Attributes
  dataset: { userId: '42', section: 'header' },

  // 7. Events
  addEventListener: ['click', handleClick],

  // 8. DOM Methods
  focus: []
});
```

That covers all 8 categories. Let's explore each in depth.

---

## Overview: The 8 Property Categories

```
Update Object Keys
├─→ 1. Text Properties   (textContent, innerHTML, innerText)
├─→ 2. Basic Properties  (value, disabled, checked, href, ...)
├─→ 3. style             (nested object: { color, fontSize, ... })
├─→ 4. classList         (nested object: { add, remove, toggle, replace })
├─→ 5. setAttribute      (nested object: { 'aria-*', 'role', ... })
├─→ 6. dataset           (nested object: { camelCase keys })
├─→ 7. addEventListener / removeEventListener
└─→ 8. DOM Methods       (focus, blur, click, scrollIntoView, ...)
```

---

## Category 1: Text Properties

Three ways to set an element's text or HTML content.

### `textContent`

Sets the **plain text** content of an element. All HTML tags are treated as literal characters (not rendered). The safest option for displaying user-generated content.

```javascript
element.update({ textContent: 'Hello, World!' });
// element.textContent = 'Hello, World!'

// With user input — safe from XSS
element.update({ textContent: userInput });
// Even if userInput = '<script>alert("xss")</script>'
// It displays literally — not executed
```

**When to use:**
✅ Displaying user-provided text
✅ Dynamic labels, counters, messages
✅ Anything where security matters (which is everything)

---

### `innerHTML`

Sets the **HTML content** of an element. HTML tags are parsed and rendered as real DOM elements.

```javascript
element.update({
  innerHTML: '<strong>Bold text</strong> and <em>italic</em>'
});
// Renders actual bold and italic HTML
```

**When to use:**
✅ Setting trusted HTML from your own code
✅ Templates, rich text display
❌ Never use with user input — XSS risk

```javascript
// ❌ DANGEROUS — user input + innerHTML
element.update({ innerHTML: userComment });  // Never do this!

// ✅ SAFE — user input + textContent
element.update({ textContent: userComment });
```

---

### `innerText`

Sets the **rendered text** of an element, respecting CSS visibility. Similar to `textContent` but aware of styling (hidden elements don't contribute to `innerText`).

```javascript
element.update({ innerText: 'Visible text only' });
```

**When to use:**
✅ When you need text that matches what the user visually sees
✅ Copy-paste scenarios where hidden text should be excluded
✅ Most cases where `textContent` also works — they're interchangeable for setting

---

### Quick Comparison

| Property | HTML Rendered? | XSS Safe? | Use When |
|----------|---------------|-----------|----------|
| `textContent` | No | ✅ Yes | User input, plain text |
| `innerHTML` | Yes | ❌ No | Trusted HTML from code |
| `innerText` | No | ✅ Yes | Visibility-aware text |

---

## Category 2: Basic DOM Properties

These map directly to DOM element properties via assignment.

### Value Properties

```javascript
// Text input value
inputElement.update({ value: 'new value' });

// Textarea
textareaElement.update({ value: 'multi-line content' });

// Select dropdown
selectElement.update({ value: 'option-value' });  // Selects matching option
```

### Boolean Properties

```javascript
element.update({
  disabled: true,     // element.disabled = true
  checked: false,     // element.checked = false (checkboxes, radios)
  required: true,     // element.required = true (form inputs)
  readOnly: true,     // element.readOnly = true
  hidden: false,      // element.hidden = false
  multiple: true,     // element.multiple = true (select, file input)
  autofocus: true     // element.autofocus = true
});
```

### String Properties

```javascript
element.update({
  href: 'https://example.com',      // anchor links
  src: '/images/photo.jpg',         // images, scripts
  alt: 'Profile photo',             // images (accessibility)
  title: 'Tooltip text',            // hover tooltips
  placeholder: 'Enter your email',  // input placeholders
  type: 'email',                    // input types
  name: 'emailField',               // form field names
  id: 'uniqueId',                   // element ID (use carefully)
  className: 'btn btn-primary',     // Full class string (prefer classList)
  tabIndex: 0                       // keyboard navigation order
});
```

### Numeric Properties

```javascript
element.update({
  tabIndex: -1,     // Remove from tab order
  maxLength: 100,   // Max input length
  min: 0,           // Range/number min
  max: 100,         // Range/number max
  step: 5           // Range/number step
});
```

**Key Insight:** Any valid DOM property that accepts direct assignment can be used here. If `element.someProperty = value` works in vanilla JavaScript, then `{ someProperty: value }` works in an update object.

---

## Category 3: `style`

The `style` key takes a **nested object** of CSS properties in camelCase notation.

### Basic Usage

```javascript
element.update({
  style: {
    color: 'red',
    backgroundColor: '#3b82f6',  // Note: camelCase, not kebab-case
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 20px',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    opacity: '0.5',
    transform: 'translateX(100px)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    pointerEvents: 'none'
  }
});
```

### camelCase Rule

Always use **camelCase** for multi-word CSS properties (never kebab-case):

```javascript
// ❌ WRONG — kebab-case doesn't work
element.update({
  style: {
    'background-color': 'red',   // ❌
    'font-size': '16px',         // ❌
    'border-radius': '8px'       // ❌
  }
});

// ✅ CORRECT — camelCase
element.update({
  style: {
    backgroundColor: 'red',      // ✅
    fontSize: '16px',            // ✅
    borderRadius: '8px'          // ✅
  }
});
```

### Removing Styles

Set a style property to an empty string to remove it (revert to stylesheet):

```javascript
element.update({
  style: {
    color: '',        // Remove color override, inherit from CSS
    display: '',      // Remove display override
    fontWeight: ''    // Remove font-weight override
  }
});
```

### Common Style Patterns

```javascript
// Show/hide
element.update({ style: { display: 'block' } });   // Show
element.update({ style: { display: 'none' } });    // Hide

// Visibility (keeps layout space)
element.update({ style: { visibility: 'visible' } });
element.update({ style: { visibility: 'hidden' } });

// Opacity
element.update({ style: { opacity: '1' } });
element.update({ style: { opacity: '0' } });

// Position
element.update({
  style: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
});

// Transitions
element.update({
  style: {
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    opacity: '0',
    transform: 'translateY(-10px)'
  }
});
```

---

## Category 4: `classList`

The `classList` key manages CSS classes with four operations.

### Operations Overview

```javascript
element.update({
  classList: {
    add: 'active',           // Add one class
    remove: 'hidden',        // Remove one class
    toggle: 'open',          // Toggle one class
    replace: ['old', 'new']  // Replace old with new
  }
});
```

### `add` — Add Classes

```javascript
// Add one class
element.update({ classList: { add: 'active' } });

// Add multiple classes (array)
element.update({ classList: { add: ['active', 'visible', 'animated'] } });
```

### `remove` — Remove Classes

```javascript
// Remove one class
element.update({ classList: { remove: 'hidden' } });

// Remove multiple classes
element.update({ classList: { remove: ['hidden', 'inactive', 'disabled'] } });
```

### `toggle` — Toggle Classes

```javascript
// Toggle a class (removes if present, adds if absent)
element.update({ classList: { toggle: 'open' } });

// Toggle with forced value
element.update({ classList: { toggle: { class: 'active', force: true } } });
// force: true — always adds
// force: false — always removes
```

### `replace` — Swap Classes

```javascript
// Replace 'old-class' with 'new-class'
element.update({ classList: { replace: ['old-class', 'new-class'] } });
```

### Combining Operations

```javascript
// All four operations in one update
element.update({
  classList: {
    add: ['active', 'visible'],
    remove: ['hidden', 'inactive'],
    toggle: 'open',
    replace: ['btn-default', 'btn-primary']
  }
});
```

### Why classList Over className?

```javascript
// ❌ Less ideal — string manipulation, error-prone
element.update({
  className: element.className
    .split(' ')
    .filter(c => c !== 'hidden')
    .concat(['visible', 'animated'])
    .join(' ')
});

// ✅ Better — clean operations
element.update({
  classList: {
    add: ['visible', 'animated'],
    remove: 'hidden'
  }
});
```

---

## Category 5: `setAttribute`

The `setAttribute` key sets HTML attributes using the standard `element.setAttribute(name, value)` API.

### Basic Usage

```javascript
element.update({
  setAttribute: {
    'aria-label': 'Close dialog',
    'aria-hidden': 'false',
    'aria-expanded': 'true',
    'aria-selected': 'false',
    'role': 'button',
    'tabindex': '0',
    'data-custom': 'value',
    'type': 'submit'
  }
});
```

### vs Array Format

You can also use an array for a single attribute:

```javascript
// Object format — multiple attributes at once
element.update({
  setAttribute: {
    'aria-hidden': 'true',
    'role': 'dialog'
  }
});

// Array format — single attribute call
element.update({
  setAttribute: ['aria-hidden', 'true']
});
```

### Removing Attributes

Use `removeAttribute` key:

```javascript
element.update({
  removeAttribute: 'aria-hidden'
  // Or for multiple: removeAttribute: ['aria-hidden', 'disabled']
});
```

### setAttribute vs Direct Property Assignment

Some attributes have DOM property equivalents. Both approaches work:

```javascript
// These are equivalent
element.update({ disabled: true });                          // Property
element.update({ setAttribute: { 'disabled': '' } });       // Attribute

// But for ARIA and custom attributes, always use setAttribute
element.update({ setAttribute: { 'aria-label': 'Close' } }); // ✅
element.update({ ariaLabel: 'Close' });                       // ❌ Doesn't work
```

**Rule of thumb:**
- Use direct properties for: `disabled`, `checked`, `value`, `href`, `src`, etc.
- Use `setAttribute` for: ARIA attributes, `role`, custom attributes, `data-*`

---

## Category 6: `dataset`

The `dataset` key manages `data-*` attributes using **camelCase** property names that are automatically converted to kebab-case HTML attribute names.

### Basic Usage

```javascript
element.update({
  dataset: {
    userId: '42',          // Sets: data-user-id="42"
    postType: 'article',   // Sets: data-post-type="article"
    isActive: 'true',      // Sets: data-is-active="true"
    maxItems: '10',        // Sets: data-max-items="10"
    sectionName: 'header'  // Sets: data-section-name="header"
  }
});
```

### Naming Convention

```
JavaScript key     →    HTML attribute
───────────────────────────────────────
userId             →    data-user-id
postType           →    data-post-type
isActive           →    data-is-active
trackingId         →    data-tracking-id
```

camelCase → lowercase-with-dashes, automatically.

### Reading Back Data

After setting via dataset, read back normally:

```javascript
element.update({ dataset: { userId: '42' } });

// Read back:
element.dataset.userId;         // '42'
element.getAttribute('data-user-id');  // '42'
```

### Removing Data Attributes

Set to `null` or `undefined` to remove:

```javascript
element.update({
  dataset: {
    userId: null,       // Removes data-user-id
    section: undefined  // Also removes
  }
});
```

### Practical Use Cases

```javascript
// Track state for CSS selectors
element.update({ dataset: { state: 'loading' } });
// CSS: [data-state="loading"] { opacity: 0.5; }

// Store IDs for event handlers
element.update({ dataset: { itemId: item.id.toString() } });
// Later: element.dataset.itemId → item.id

// Pass data to analytics
element.update({
  dataset: {
    trackEvent: 'button_click',
    trackCategory: 'navigation',
    trackLabel: 'header_cta'
  }
});
```

---

## Category 7: `addEventListener` and `removeEventListener`

Attach and detach event listeners through the update object.

### `addEventListener`

```javascript
// Attach an event listener
element.update({
  addEventListener: ['click', handleClick]
});

// With options
element.update({
  addEventListener: ['click', handleClick, { once: true }]
});

// With passive option (scroll performance)
element.update({
  addEventListener: ['scroll', handleScroll, { passive: true }]
});
```

### `removeEventListener`

```javascript
// Remove a previously attached listener
element.update({
  removeEventListener: ['click', handleClick]
});
```

**Important:** To remove a listener, you must pass the **same function reference** that was used to add it.

```javascript
// ❌ WRONG — anonymous function can't be removed
element.update({
  addEventListener: ['click', () => doSomething()]
});
element.update({
  removeEventListener: ['click', () => doSomething()]  // Different reference!
});

// ✅ CORRECT — named reference can be removed
function handleClick() { doSomething(); }

element.update({ addEventListener: ['click', handleClick] });
// ... later ...
element.update({ removeEventListener: ['click', handleClick] });
```

### Multiple Listeners

Combine multiple event bindings using chaining or separate updates:

```javascript
// Chaining
element
  .update({ addEventListener: ['click', onClick] })
  .update({ addEventListener: ['focus', onFocus] })
  .update({ addEventListener: ['blur', onBlur] });

// Or use a loop
['click', 'focus', 'blur'].forEach(event => {
  element.update({ addEventListener: [event, handlers[event]] });
});
```

---

## Category 8: DOM Methods (Array Values)

Any key whose value is an **array** is treated as a DOM method call. The array items become the arguments.

### No-Argument Methods (Empty Array)

```javascript
element.update({
  focus: [],     // element.focus()
  blur: [],      // element.blur()
  click: [],     // element.click()
  select: [],    // element.select() — selects all text in input
  reset: [],     // element.reset() — for form elements
  submit: [],    // element.submit() — for form elements
  remove: []     // element.remove() — removes from DOM
});
```

### Methods with Arguments

```javascript
element.update({
  scrollIntoView: [],                          // Default scroll
  scrollIntoView: [{ behavior: 'smooth' }],   // Smooth scroll
  scrollIntoView: [{ block: 'center' }],       // Scroll to center

  setAttribute: ['aria-hidden', 'true'],       // Single attribute
  removeAttribute: ['disabled'],               // Remove attribute

  insertAdjacentHTML: ['beforeend', '<li>New item</li>'],
  insertAdjacentText: ['afterbegin', 'Prefix: '],

  dispatchEvent: [new CustomEvent('change', { detail: { value: 42 } })],

  animate: [[
    { opacity: '0', transform: 'translateY(-10px)' },
    { opacity: '1', transform: 'translateY(0)' }
  ], { duration: 300, fill: 'forwards' }]
});
```

### The Array Rule

This is the key rule for method calls:

```
Value is array?  →  Call as method:  element[key](...value)
Value is NOT array? →  Assign as property: element[key] = value
```

```javascript
// These look similar but behave differently:
element.update({ focus: [] });    // Calls element.focus()
element.update({ focus: true });  // Assigns element.focus = true (wrong!)

// Always use [] for method calls
element.update({ scrollIntoView: [] });           // ✅ Calls the method
element.update({ scrollIntoView: 'smooth' });     // ❌ Assigns a string to scrollIntoView
```

---

## Complete Property Reference

| Key | Value Type | Example | Maps To |
|-----|-----------|---------|---------|
| `textContent` | string | `'Hello'` | `element.textContent = 'Hello'` |
| `innerHTML` | string | `'<b>Hi</b>'` | `element.innerHTML = '<b>Hi</b>'` |
| `innerText` | string | `'Hi'` | `element.innerText = 'Hi'` |
| `value` | string | `'input text'` | `element.value = 'input text'` |
| `disabled` | boolean | `true` | `element.disabled = true` |
| `checked` | boolean | `false` | `element.checked = false` |
| `required` | boolean | `true` | `element.required = true` |
| `href` | string | `'/page'` | `element.href = '/page'` |
| `src` | string | `'/img.jpg'` | `element.src = '/img.jpg'` |
| `placeholder` | string | `'Enter...'` | `element.placeholder = 'Enter...'` |
| `style` | object | `{ color: 'red' }` | `element.style.color = 'red'` |
| `classList` | object | `{ add: 'active' }` | `element.classList.add('active')` |
| `setAttribute` | object/array | `{ 'aria-label': 'X' }` | `element.setAttribute(...)` |
| `removeAttribute` | string/array | `'disabled'` | `element.removeAttribute('disabled')` |
| `dataset` | object | `{ userId: '1' }` | `element.dataset.userId = '1'` |
| `addEventListener` | array | `['click', fn]` | `element.addEventListener(...)` |
| `removeEventListener` | array | `['click', fn]` | `element.removeEventListener(...)` |
| `focus` | array | `[]` | `element.focus()` |
| `blur` | array | `[]` | `element.blur()` |
| `click` | array | `[]` | `element.click()` |
| `scrollIntoView` | array | `[{behavior:'smooth'}]` | `element.scrollIntoView(...)` |
| `select` | array | `[]` | `element.select()` |
| `remove` | array | `[]` | `element.remove()` |
| `dispatchEvent` | array | `[event]` | `element.dispatchEvent(event)` |
| `animate` | array | `[[...], {}]` | `element.animate(...)` |

---

## Real-World Example: Complete Form Field Update

```javascript
function updateFormField(fieldId, config) {
  const {
    value,
    isValid,
    errorMessage,
    label,
    isRequired
  } = config;

  Elements.update({
    [fieldId]: {
      value: value,
      required: isRequired,
      setAttribute: {
        'aria-invalid': (!isValid).toString(),
        'aria-describedby': `${fieldId}-error`
      },
      classList: {
        add: isValid ? 'field-valid' : 'field-error',
        remove: isValid ? 'field-error' : 'field-valid'
      }
    },

    [`${fieldId}Label`]: {
      textContent: label + (isRequired ? ' *' : ''),
      classList: {
        toggle: 'required-label'
      }
    },

    [`${fieldId}Error`]: {
      textContent: isValid ? '' : errorMessage,
      style: {
        display: isValid ? 'none' : 'block',
        color: '#dc2626'
      },
      setAttribute: {
        'role': 'alert',
        'aria-live': 'polite'
      }
    }
  });
}

// Usage
updateFormField('email', {
  value: 'user@example.com',
  isValid: true,
  errorMessage: '',
  label: 'Email Address',
  isRequired: true
});

updateFormField('password', {
  value: '',
  isValid: false,
  errorMessage: 'Password must be at least 8 characters',
  label: 'Password',
  isRequired: true
});
```

---

## Summary

The 8 property categories cover every common DOM operation:

1. **Text** (`textContent`, `innerHTML`, `innerText`) — use `textContent` for user input, `innerHTML` for trusted HTML
2. **Basic Properties** — any DOM property that accepts direct assignment
3. **`style`** — CSS properties in camelCase nested object; empty string to remove
4. **`classList`** — `add`, `remove`, `toggle`, `replace` operations
5. **`setAttribute`** — HTML attributes via nested object or array
6. **`dataset`** — data attributes via camelCase (auto-converted to kebab-case)
7. **`addEventListener` / `removeEventListener`** — event binding via `[event, handler]` array
8. **DOM Methods** — any method call via `methodName: [args]` array syntax

The key rules to remember:
- ✅ camelCase for `style` properties
- ✅ Array for method calls (`focus: []`)
- ✅ `textContent` for user input (security)
- ✅ `setAttribute` for ARIA attributes

---

## What's Next?

Next chapter: **Fine-Grained Updates & Change Detection** — how `.update()` knows when to skip DOM writes and why this makes your app faster.