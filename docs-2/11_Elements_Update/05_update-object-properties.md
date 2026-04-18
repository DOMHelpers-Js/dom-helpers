[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Update Object Properties

The update object is where you specify **what** changes to make to each element. This chapter explains every property type available — with examples specific to `Elements.update()`.

---

## Quick Start (30 Seconds)

```javascript
Elements.update({
  myBtn: {
    textContent: 'Click me',              // Text
    disabled: false,                      // Property
    style: { color: 'blue' },             // Styles
    classList: { add: 'active' },         // Classes
    setAttribute: { 'aria-label': 'Go' },// Attributes
    dataset: { trackId: '42' },           // Data attributes
    focus: []                             // DOM method call
  }
});
```

Those 7 keys cover the full spectrum of DOM updates.

---

## What Is the Update Object?

The update object is the **value** side of each element entry in `Elements.update()`:

```javascript
Elements.update({
  elementId: { /* ← THIS is the update object */ },
  anotherId:  { /* ← THIS is the update object */ }
});
```

A plain JavaScript object where keys tell `.update()` what to change and values tell it what to set.

---

## Property Overview

```
Update Object Keys
├─→ textContent / innerHTML / innerText  (text content)
├─→ value / disabled / checked / ...     (basic DOM properties)
├─→ style                                (CSS properties object)
├─→ classList                            (add/remove/toggle/replace)
├─→ setAttribute / removeAttribute       (HTML attributes)
├─→ dataset                              (data-* attributes)
├─→ addEventListener / removeEventListener (event handlers)
└─→ methodName: []                       (DOM method calls)
```

---

## Category 1: Text Content

```javascript
Elements.update({
  // XSS-safe — treats everything as plain text
  messageBox: { textContent: userMessage },

  // Parses HTML — use only with trusted, hardcoded content
  iconArea: { innerHTML: '<svg aria-hidden="true">...</svg>' },

  // Visibility-aware rendering
  copyTarget: { innerText: 'Displayed text' }
});
```

**Rule:** Use `textContent` for any external or user-supplied data. Use `innerHTML` only for your own hardcoded HTML.

---

## Category 2: Basic DOM Properties

```javascript
Elements.update({
  emailInput:    { value: 'user@example.com' },
  searchField:   { value: '' },              // Clear it
  submitBtn:     { disabled: true },
  termsCheckbox: { checked: false },
  emailField:    { required: true, readOnly: false },
  logoImage:     { src: '/logo.png', alt: 'Logo' },
  navLink:       { href: '/dashboard' },
  inputHint:     { placeholder: 'Enter email...' },
  firstTabEl:    { tabIndex: 0 },
  hiddenEl:      { tabIndex: -1 }            // Remove from tab order
});
```

Any DOM property that accepts direct assignment (`element.property = value`) can be used here.

---

## Category 3: `style`

Apply CSS styles using **camelCase** property names:

```javascript
Elements.update({
  header: {
    style: {
      backgroundColor: '#1f2937',  // Not 'background-color'
      color: 'white',
      padding: '20px 40px',
      fontSize: '24px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    }
  },

  // Show/hide
  spinner: { style: { display: 'flex' } },
  content: { style: { display: 'none' } },

  // Remove style override (revert to stylesheet)
  overridden: { style: { color: '' } }  // Empty string removes it
});
```

**camelCase rule:**

| CSS | JavaScript (in style object) |
|-----|------------------------------|
| `background-color` | `backgroundColor` |
| `font-size` | `fontSize` |
| `border-top-left-radius` | `borderTopLeftRadius` |

---

## Category 4: `classList`

Manage CSS classes with four operations:

```javascript
Elements.update({
  menuBtn: {
    classList: {
      add: 'active',                      // One class
      add: ['active', 'highlighted'],     // Multiple classes
      remove: 'hidden',                   // One class
      remove: ['hidden', 'inactive'],     // Multiple classes
      toggle: 'open',                     // Toggle (add if absent, remove if present)
      replace: ['btn-default', 'btn-primary'] // Replace old with new
    }
  }
});
```

**Why not just use `className`?**

```javascript
// ❌ Less ideal — fragile string manipulation
element: { className: el.className.split(' ').filter(c => c !== 'hidden').concat('visible').join(' ') }

// ✅ Better — clean declarative operations
element: { classList: { add: 'visible', remove: 'hidden' } }
```

---

## Category 5: `setAttribute` and `removeAttribute`

Set HTML attributes — especially for ARIA and non-property attributes:

```javascript
Elements.update({
  modal: {
    setAttribute: {
      'aria-hidden': 'false',
      'aria-modal': 'true',
      'aria-labelledby': 'modalTitle',
      'role': 'dialog'
    }
  },

  externalLink: {
    setAttribute: {
      href: 'https://example.com',
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  },

  // Remove attributes
  inputField: { removeAttribute: 'disabled' },
  formEl:     { removeAttribute: ['aria-invalid', 'aria-describedby'] }
});
```

**When to use `setAttribute` vs direct property:**

| Use case | Approach |
|----------|----------|
| `disabled`, `checked`, `value` | Direct property: `{ disabled: true }` |
| `aria-*`, `role` | setAttribute: `{ setAttribute: { 'aria-hidden': 'true' } }` |
| `data-*` attributes | Use `dataset` instead |

---

## Category 6: `dataset`

Set `data-*` attributes using camelCase keys (auto-converted to kebab-case):

```javascript
Elements.update({
  userCard: {
    dataset: {
      userId: '12345',       // Sets data-user-id="12345"
      status: 'active',      // Sets data-status="active"
      role: 'admin'          // Sets data-role="admin"
    }
  },
  productItem: {
    dataset: {
      productId: '67890',    // Sets data-product-id="67890"
      price: '29.99',        // Sets data-price="29.99"
      inStock: 'true'        // Sets data-in-stock="true"
    }
  }
});
```

---

## Category 7: `addEventListener`

Attach event handlers within the update object:

```javascript
Elements.update({
  saveBtn: {
    addEventListener: ['click', handleSave]
  },
  searchInput: {
    addEventListener: ['input', (e) => performSearch(e.target.value)]
  },
  scrollContainer: {
    addEventListener: ['scroll', handleScroll, { passive: true }]
  }
});
```

---

## Category 8: DOM Method Calls (Array Syntax)

Call DOM methods using an array as the value:

```javascript
Elements.update({
  // No-argument methods — empty array
  searchInput:  { focus: [] },     // element.focus()
  formEl:       { reset: [] },     // element.reset()
  textField:    { select: [] },    // element.select()

  // Methods with arguments
  notification: {
    scrollIntoView: [{ behavior: 'smooth', block: 'center' }]
  },

  // Dispatch events
  formEl2: {
    dispatchEvent: [new CustomEvent('validate', { bubbles: true })]
  }
});
```

**The rule:** `methodName: []` = call the method. `methodName: value` = assign to property.

---

## Combining Properties

The real power is combining all property types for each element:

```javascript
Elements.update({
  confirmModal: {
    style: { display: 'flex' },
    classList: { add: 'modal-open', remove: 'modal-closed' },
    setAttribute: { 'aria-hidden': 'false', 'role': 'dialog' },
    addEventListener: ['keydown', handleModalKeydown]
  },

  emailInput: {
    classList: { add: 'field-error', remove: 'field-valid' },
    setAttribute: { 'aria-invalid': 'true', 'aria-describedby': 'emailErrorMsg' }
  },

  emailErrorMsg: {
    textContent: 'Please enter a valid email address',
    style: { display: 'block', color: '#dc2626', fontSize: '14px' },
    setAttribute: { 'role': 'alert', 'aria-live': 'assertive' }
  }
});
```

---

## Key Difference from Collections.update()

The update objects are **identical in structure** across all three update methods:

| Aspect | `Elements.update()` | `Collections.update()` |
|--------|---------------------|----------------------|
| **Targets** | Specific elements by ID | All elements in a group |
| **Per element** | Each gets unique updates | Same update applied to all |
| **Update object** | Identical | Identical |

---

## Quick Reference

```javascript
Elements.update({
  elementId: {
    textContent: 'string',           // Plain text (XSS-safe)
    innerHTML: '<b>HTML</b>',        // Rendered HTML (trusted only)
    disabled: true / false,
    value: 'string',
    checked: true / false,
    href: '/url',
    src: '/image.jpg',
    style: {
      display: 'block',
      color: '#value',
      backgroundColor: '#value',
      fontSize: '16px',
    },
    classList: {
      add: 'class' / ['class1', 'class2'],
      remove: 'class' / ['class1', 'class2'],
      toggle: 'class',
      replace: ['oldClass', 'newClass']
    },
    setAttribute: { 'attr-name': 'value' },
    removeAttribute: 'attrName' / ['attr1', 'attr2'],
    dataset: { camelKey: 'value' },
    addEventListener: ['event', handler, options],
    focus: [],
    scrollIntoView: [options],
    dispatchEvent: [eventObject]
  }
});
```

---

## What's Next?

- **Chapter 6**: The return value — how to use `{ success, element, error }` for verification and follow-up operations