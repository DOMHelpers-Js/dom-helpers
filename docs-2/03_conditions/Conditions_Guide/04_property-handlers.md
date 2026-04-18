[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Property Handlers

## Quick Start (30 seconds)

```javascript
Conditions.whenState(
  () => app.status,
  {
    'active': {
      '#card': {
        textContent: 'Active',                          // text
        className: 'card card-active',                 // class string
        classList: { add: 'highlight', remove: 'dim' }, // class operations
        style: { color: 'green', fontWeight: 'bold' }, // CSS styles
        setAttribute: { 'data-state': 'active', 'aria-pressed': 'true' },
        hidden: false                                   // direct property
      }
    },
    'inactive': {
      '#card': {
        textContent: 'Inactive',
        className: 'card card-inactive',
        classList: { remove: 'highlight', add: 'dim' },
        style: { color: 'gray', fontWeight: 'normal' },
        setAttribute: { 'data-state': 'inactive', 'aria-pressed': 'false' },
        hidden: false
      }
    }
  }
);
```

One update object. Every kind of DOM change.

---

## What Are Property Handlers?

Inside each condition block, you write **update objects** for each selector:

```javascript
{
  'loading': {
    '#panel': { hidden: false, textContent: 'Loading…', className: 'panel loading' }
  }
}
```

The keys inside that update object — `hidden`, `textContent`, `className` — are processed by **property handlers**. Just as condition matchers decide *how to interpret condition keys*, property handlers decide *how to apply each update property to a DOM element*.

The system checks each property key against a registry of handlers:

```
Property key: 'style'
→ Is it 'style'? YES → handle as CSS properties object

Property key: 'classList'
→ Is it 'classList'? YES → handle as class operations (add/remove/toggle)

Property key: 'hidden'
→ Not a special key
→ Is it an event name? No
→ Is it a known native property? YES → assign directly

Property key: 'customProp'
→ None of the above → fallback → direct property assignment
```

This is what makes the update object so expressive — one uniform syntax handles everything from text to styles to events to arbitrary properties.

---

## All Built-In Property Handlers

### Handler Priority Order

```
1.  style             — key === 'style'
2.  classList         — key === 'classList'
3.  setAttribute      — key === 'setAttribute'
4.  removeAttribute   — key === 'removeAttribute'
5.  dataset           — key === 'dataset'
6.  addEventListener  — key === 'addEventListener'
7.  removeEventListener — key === 'removeEventListener'
8.  eventProperty     — key starts with 'on' (e.g., 'onclick', 'onchange')
9.  nativeProperty    — key is a known DOM property
10. fallback          — anything else → direct assignment
```

---

## 1. `style` — Inline CSS Properties

Applies individual CSS properties to the element. Only changed properties are updated.

```javascript
// Set multiple CSS properties at once
{ style: { color: 'red', backgroundColor: '#fff', fontSize: '16px' } }

// Use camelCase for CSS properties
{ style: { fontWeight: 'bold', borderRadius: '8px', zIndex: '100' } }

// Remove a property by setting it to empty string or null
{ style: { display: '', color: null } }
```

**In a `whenState()` context:**

```javascript
Conditions.whenState(
  () => alert.type,
  {
    'info': {
      '#alert-box': {
        style: { backgroundColor: '#e3f2fd', borderColor: '#1976d2', color: '#0d47a1' }
      }
    },
    'error': {
      '#alert-box': {
        style: { backgroundColor: '#ffebee', borderColor: '#d32f2f', color: '#b71c1c' }
      }
    },
    'success': {
      '#alert-box': {
        style: { backgroundColor: '#e8f5e9', borderColor: '#388e3c', color: '#1b5e20' }
      }
    }
  }
);
```

**Key details:**
- Values are CSS strings (`'16px'`, `'bold'`, `'#fff'`)
- Property names are camelCase (`backgroundColor`, not `background-color`)
- Only changed properties are touched — other style properties on the element remain

---

## 2. `classList` — Class Operations

Provides fine-grained control over CSS classes without replacing the entire `className` string.

```javascript
// Add one or more classes
{ classList: { add: 'active' } }
{ classList: { add: ['active', 'highlighted'] } }

// Remove one or more classes
{ classList: { remove: 'inactive' } }
{ classList: { remove: ['inactive', 'dim', 'hidden'] } }

// Toggle with a condition
{ classList: { toggle: ['visible', isVisible] } }
// → adds 'visible' if isVisible is true, removes it if false

// Replace one class with another
{ classList: { replace: ['old-class', 'new-class'] } }

// Multiple operations together
{
  classList: {
    add: 'active',
    remove: ['inactive', 'loading'],
    toggle: ['highlighted', someCondition]
  }
}
```

**In a `whenState()` context:**

```javascript
Conditions.whenState(
  () => tab.active,
  {
    'home':     { '.nav-link': { classList: { remove: 'active' } }, '#nav-home':     { classList: { add: 'active' } } },
    'profile':  { '.nav-link': { classList: { remove: 'active' } }, '#nav-profile':  { classList: { add: 'active' } } },
    'settings': { '.nav-link': { classList: { remove: 'active' } }, '#nav-settings': { classList: { add: 'active' } } }
  }
);
```

**Key details:**
- `add` and `remove` accept a string or array of strings
- `toggle: [className, condition]` — the second element is the boolean condition
- `replace: [from, to]` — replaces `from` with `to` if `from` exists
- Unlike `className`, this **does not replace** the full class list — it surgically adds/removes

---

## 3. `setAttribute` — HTML Attributes

Sets one or more HTML attributes on the element.

```javascript
// Set one attribute
{ setAttribute: { 'aria-label': 'Close dialog' } }

// Set multiple attributes
{
  setAttribute: {
    'role': 'alert',
    'aria-live': 'polite',
    'aria-atomic': 'true',
    'data-id': '42',
    'tabindex': '0'
  }
}
```

**In a `whenState()` context:**

```javascript
Conditions.whenState(
  () => modal.isOpen,
  {
    'true': {
      '#modal': {
        setAttribute: { 'aria-hidden': 'false', 'aria-modal': 'true' },
        hidden: false
      },
      '#overlay': { hidden: false }
    },
    'false': {
      '#modal': {
        setAttribute: { 'aria-hidden': 'true' },
        hidden: true
      },
      '#overlay': { hidden: true }
    }
  }
);
```

**Key details:**
- All attribute values are strings (as per the HTML spec)
- Use `setAttribute` for ARIA attributes, `data-*` attributes, and any non-property attributes
- For boolean attributes like `disabled`, prefer direct property assignment (`{ disabled: true }`) over `setAttribute`

---

## 4. `removeAttribute` — Remove HTML Attributes

Removes one or more HTML attributes from the element.

```javascript
// Remove one attribute
{ removeAttribute: 'disabled' }

// Remove multiple attributes
{ removeAttribute: ['disabled', 'readonly', 'aria-invalid'] }
```

**In a `whenState()` context:**

```javascript
Conditions.whenState(
  () => input.hasError,
  {
    'true': {
      '#email-input': {
        setAttribute: { 'aria-invalid': 'true', 'aria-describedby': 'email-error' },
        classList: { add: 'input-error' }
      }
    },
    'false': {
      '#email-input': {
        removeAttribute: ['aria-invalid', 'aria-describedby'],
        classList: { remove: 'input-error' }
      }
    }
  }
);
```

**Key details:**
- Accepts a string (single attribute) or array of strings (multiple)
- Removing a non-existent attribute is safe — no error thrown

---

## 5. `dataset` — Data Attributes

Sets `data-*` attributes through the element's `dataset` property. Values are assigned as `element.dataset.key = value`.

```javascript
// Set data attributes
{ dataset: { userId: '42', role: 'admin', lastSeen: '2024-01-01' } }
// → sets data-user-id="42", data-role="admin", data-last-seen="2024-01-01"
```

**Key naming:** Use camelCase in the object — the browser automatically converts to kebab-case in the HTML.

```javascript
{ dataset: { itemId: '5' } }
// → element.dataset.itemId = '5'
// → HTML: data-item-id="5"
```

**In a `whenState()` context:**

```javascript
Conditions.whenState(
  () => user.role,
  {
    'admin': {
      '#user-card': {
        dataset: { role: 'admin', accessLevel: '3' },
        classList: { add: 'admin-highlight' }
      }
    },
    'user': {
      '#user-card': {
        dataset: { role: 'user', accessLevel: '1' },
        classList: { remove: 'admin-highlight' }
      }
    }
  }
);
```

---

## 6. `addEventListener` — Attach Event Listeners

Adds event listeners to the element. Duplicate prevention is automatic — the same function will not be added twice even if the condition re-applies.

```javascript
// Attach one listener
{ addEventListener: { click: handleClick } }

// Attach multiple listeners
{
  addEventListener: {
    click: handleClick,
    mouseover: handleHover,
    focus: handleFocus
  }
}
```

**In a `whenState()` context:**

```javascript
Conditions.whenState(
  () => form.mode,
  {
    'editing': {
      '#save-btn': {
        addEventListener: { click: saveChanges },
        disabled: false
      },
      '#cancel-btn': {
        addEventListener: { click: cancelEditing },
        disabled: false
      }
    },
    'viewing': {
      '#save-btn': { disabled: true },
      '#cancel-btn': { disabled: true }
    }
  }
);
```

**Key details:**
- The system tracks which `(element, event, handler)` triples have been registered — the same handler is never registered twice
- Listeners added via this method persist across condition changes (they're not removed when the condition changes unless you use `removeEventListener`)
- For listeners that should be conditionally active, use `removeEventListener` in the other state

---

## 7. `removeEventListener` — Remove Event Listeners

Removes event listeners previously added to the element.

```javascript
{ removeEventListener: { click: handleClick } }
{ removeEventListener: { click: handleClick, mouseover: handleHover } }
```

**In a `whenState()` context — toggling interactivity:**

```javascript
Conditions.whenState(
  () => overlay.blocking,
  {
    'true': {
      '#action-btn': {
        removeEventListener: { click: handleAction },
        classList: { add: 'btn-disabled' }
      }
    },
    'false': {
      '#action-btn': {
        addEventListener: { click: handleAction },
        classList: { remove: 'btn-disabled' }
      }
    }
  }
);
```

---

## 8. `eventProperty` — Inline Event Handlers (`on*` properties)

Handles properties that start with `on` — the inline event handler API (`onclick`, `onchange`, `oninput`, etc.).

```javascript
{ onclick: handleClick }
{ onchange: handleChange }
{ oninput: handleInput }
{ onfocus: handleFocus }
{ onblur: handleBlur }
```

These are set directly as element properties: `element.onclick = handler`.

**In a `whenState()` context:**

```javascript
Conditions.whenState(
  () => widget.mode,
  {
    'interactive': {
      '#widget': { onclick: handleWidgetClick, onkeydown: handleKeyDown }
    },
    'readonly': {
      '#widget': { onclick: null, onkeydown: null }
    }
  }
);
```

**Key details:**
- These are element **properties** (not addEventListener) — setting to `null` removes the handler
- Only one handler per event type (unlike `addEventListener` which allows multiple)
- Prefer `addEventListener` for most event handling; use `on*` properties when you specifically need the single-handler behavior

---

## 9. `nativeProperty` — Direct DOM Properties

Handles recognized native DOM properties directly — properties that exist directly on the element object rather than as HTML attributes.

Common native properties handled this way:

```javascript
// Boolean properties
{ disabled: true }
{ hidden: false }
{ checked: true }
{ readOnly: true }
{ required: true }
{ multiple: true }

// String properties
{ textContent: 'Hello World' }
{ innerText: 'Formatted Text' }
{ innerHTML: '<strong>Bold</strong>' }
{ value: 'input text' }
{ placeholder: 'Enter text…' }
{ src: '/images/photo.jpg' }
{ href: '/page' }
{ alt: 'Description' }
{ className: 'card active' }
{ id: 'my-id' }
{ title: 'Tooltip text' }

// Numeric properties
{ tabIndex: 0 }
{ maxLength: 100 }
{ rows: 5 }
{ cols: 40 }
{ min: 0 }
{ max: 100 }
{ step: 1 }
```

**In a `whenState()` context:**

```javascript
Conditions.whenState(
  () => step.current,
  {
    '1': {
      '#next-btn':  { disabled: false, textContent: 'Next: Details' },
      '#back-btn':  { disabled: true },
      '#progress':  { value: 1, max: 3 }
    },
    '2': {
      '#next-btn':  { disabled: false, textContent: 'Next: Review' },
      '#back-btn':  { disabled: false },
      '#progress':  { value: 2, max: 3 }
    },
    '3': {
      '#next-btn':  { disabled: false, textContent: 'Submit' },
      '#back-btn':  { disabled: false },
      '#progress':  { value: 3, max: 3 }
    }
  }
);
```

**Key details:**
- These are compared against their previous values — only set if the value actually changed
- For `textContent`, `innerHTML`, and similar, change detection prevents unnecessary DOM reflows

---

## 10. `fallback` — Arbitrary Property Assignment

If none of the above handlers claim a property key, the fallback handler assigns it directly as an element property.

```javascript
// Any property not recognized by other handlers
{ customProperty: 'value' }
{ scrollTop: 0 }
{ selectionStart: 0 }
{ indeterminate: true }   // checkbox indeterminate state
```

The fallback uses direct assignment: `element[key] = value`.

---

## Using Multiple Handlers Together

The real power is combining handlers in one update object:

```javascript
Conditions.whenState(
  () => notification.type,
  {
    'success': {
      '#toast': {
        textContent: 'Saved successfully!',         // nativeProperty
        className: 'toast toast-success',           // nativeProperty
        setAttribute: { role: 'status' },           // setAttribute
        style: { borderLeftColor: '#4caf50' },      // style
        hidden: false                               // nativeProperty
      }
    },
    'error': {
      '#toast': {
        textContent: 'Something went wrong.',       // nativeProperty
        className: 'toast toast-error',             // nativeProperty
        setAttribute: { role: 'alert',              // setAttribute
                        'aria-live': 'assertive' },
        style: { borderLeftColor: '#f44336' },      // style
        hidden: false                               // nativeProperty
      }
    },
    'idle': {
      '#toast': {
        hidden: true                                // nativeProperty
      }
    }
  }
);
```

One block handles text, class, ARIA, style, and visibility — all at once, all correctly.

---

## Complete Handler Reference

```javascript
// style
{ style: { color: 'red', fontSize: '16px' } }

// classList
{ classList: { add: 'cls', remove: 'old', toggle: ['active', bool], replace: ['a', 'b'] } }

// setAttribute
{ setAttribute: { 'aria-label': 'Close', role: 'button' } }

// removeAttribute
{ removeAttribute: ['disabled', 'aria-invalid'] }

// dataset
{ dataset: { userId: '5', category: 'admin' } }

// addEventListener
{ addEventListener: { click: fn, focus: fn2 } }

// removeEventListener
{ removeEventListener: { click: fn } }

// eventProperty (inline handlers)
{ onclick: handleClick }
{ onchange: null }  // remove by setting null

// nativeProperty (direct assignment with change detection)
{ textContent: 'text' }
{ innerHTML: '<b>bold</b>' }
{ hidden: true }
{ disabled: false }
{ checked: true }
{ value: 'input text' }
{ className: 'card active' }
{ src: '/img.jpg' }

// fallback (anything else)
{ indeterminate: true }
{ scrollTop: 0 }
```

---

## What Happens When a Property Is Unknown

If you write a property that no handler recognizes and the fallback doesn't produce a sensible result, the assignment simply sets `element.customKey = value`. This is safe — browsers ignore unknown properties gracefully. No error is thrown.

---

## Summary

- **Property handlers** are the bridge between the update objects in your conditions and the actual DOM API calls
- **10 built-in handlers** cover every common DOM update type: CSS styles, class operations, HTML attributes, data attributes, event listeners, inline event properties, and direct element properties
- **`style`** handles granular CSS property updates — only changed properties are touched
- **`classList`** enables surgical class operations without replacing the full class string
- **`setAttribute` / `removeAttribute`** manage HTML attribute presence
- **`dataset`** sets `data-*` attributes through the `dataset` API
- **`addEventListener` / `removeEventListener`** manage event listener registration with automatic duplicate prevention
- **`nativeProperty`** handles direct element properties (`disabled`, `hidden`, `textContent`, `value`, etc.) with change detection
- **`fallback`** catches anything unrecognized via direct property assignment
- Handlers can be freely **combined** in a single update object — one block can set text, style, class, aria, and events all at once

---

Continue to: [05 — `apply()` and `watch()`](./05_apply-and-watch.md)