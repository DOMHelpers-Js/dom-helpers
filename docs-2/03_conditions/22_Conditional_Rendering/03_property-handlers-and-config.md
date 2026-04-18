[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Property Handlers — What You Can Put Inside a Config

## Quick Start (30 seconds)

```javascript
// Each condition's value is a config object — here's everything you can put in it
Conditions.apply('active', {
  'active': {
    textContent: 'Online',                              // Direct property
    style: { color: 'green', fontWeight: 'bold' },      // Style object
    classList: { add: 'active', remove: 'inactive' },    // ClassList operations
    dataset: { status: 'active' },                       // Data attributes
    setAttribute: { 'aria-label': 'Online status' },     // HTML attributes
    disabled: false,                                     // Native property
    addEventListener: { click: handleClick }              // Event listeners
  }
}, '#badge');
```

---

## What Are Property Handlers?

When a condition matches, the module applies a **config object** to the target element. Each key in that config object is a property to set — `textContent`, `style`, `classList`, etc.

**Property handlers** are the rules that know how to apply each type of property. The module comes with handlers for all common DOM operations — styles, classes, attributes, datasets, events, and native properties.

---

## How Config Application Works

```
applyConfig(element, config)
   ↓
1️⃣ Does the element have .update()? (DOMHelpers enhanced)
   ├── Yes → element.update(config) — let DOMHelpers handle it
   └── No → Manual application below
   ↓
2️⃣ For each key-value in the config:
   Walk through property handlers:
   ├── key === 'style'? → Apply style handler
   ├── key === 'classList'? → Apply classList handler
   ├── key === 'setAttribute'? → Apply attribute handler
   ├── key === 'dataset'? → Apply dataset handler
   ├── key === 'addEventListener'? → Apply event handler
   ├── key starts with 'on'? → Set event property
   ├── key exists on element? → Set native property
   └── fallback → setAttribute
```

**Key Insight:** If the element is enhanced by DOMHelpers (has `.update()`), the module prefers to use that. The manual handlers are a fallback for plain DOM elements.

---

## All Supported Properties

### Native DOM Properties

Any property that exists directly on the element can be set in the config:

```javascript
{
  'active': {
    textContent: 'Hello World',
    innerHTML: '<strong>Bold text</strong>',
    value: 'Input value',
    disabled: false,
    checked: true,
    placeholder: 'Enter text...',
    title: 'Tooltip text',
    hidden: false
  }
}
```

These are set directly: `element.textContent = 'Hello World'`.

---

### Style Object

Pass an object of CSS properties to apply:

```javascript
{
  'warning': {
    style: {
      color: 'orange',
      backgroundColor: '#fff3cd',
      fontSize: '16px',
      fontWeight: 'bold',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ffc107'
    }
  }
}
```

**How it works:** Each property is set individually — `element.style.color = 'orange'`, `element.style.backgroundColor = '#fff3cd'`, etc. Properties with `null` or `undefined` values are skipped.

---

### ClassList Operations

Pass an object with methods (`add`, `remove`, `toggle`, `replace`):

```javascript
{
  'active': {
    classList: {
      add: ['highlight', 'visible'],    // Add one or more classes
      remove: ['hidden', 'faded'],       // Remove one or more classes
      toggle: 'selected',                // Toggle a class
      replace: ['old-class', 'new-class'] // Replace one class with another
    }
  }
}
```

Each method accepts a single string or an array of strings:

```javascript
// Single class
{ classList: { add: 'active' } }

// Multiple classes
{ classList: { add: ['active', 'visible', 'highlighted'] } }
```

**Special case — Array as classList value (replace all):**

```javascript
{
  'reset': {
    classList: ['base-class', 'default']
    // Clears ALL classes, then adds these
  }
}
```

---

### Attributes (setAttribute / attrs)

Set or remove HTML attributes:

```javascript
{
  'accessible': {
    setAttribute: {
      'aria-label': 'Submit button',
      'aria-expanded': 'true',
      'data-id': '123',
      'role': 'button'
    }
  }
}
```

**Removing attributes:** Set the value to `null`, `undefined`, or `false`:

```javascript
{
  'enabled': {
    setAttribute: {
      'disabled': false,    // Removes the 'disabled' attribute
      'aria-hidden': null   // Removes 'aria-hidden'
    }
  }
}
```

You can also use `attrs` as a shorter alias:

```javascript
{
  'active': {
    attrs: { 'data-active': 'true', 'aria-selected': 'true' }
  }
}
```

---

### Remove Attributes

Explicitly remove attributes by name:

```javascript
{
  'clean': {
    removeAttribute: ['disabled', 'readonly', 'aria-hidden']
  }
}

// Or remove a single attribute
{
  'clean': {
    removeAttribute: 'disabled'
  }
}
```

---

### Dataset

Set `data-*` attributes via the dataset API:

```javascript
{
  'admin': {
    dataset: {
      userId: '123',
      role: 'admin',
      active: 'true'
    }
  }
}
```

This sets `data-user-id="123"`, `data-role="admin"`, `data-active="true"` on the element.

---

### Event Listeners (addEventListener)

Attach event handlers that automatically clean up when the condition changes:

```javascript
{
  'edit': {
    addEventListener: {
      click: handleEditClick,
      keydown: handleKeyPress
    }
  },
  'view': {
    addEventListener: {
      click: handleViewClick
    }
  }
}
```

**With options:**

```javascript
{
  'active': {
    addEventListener: {
      click: {
        handler: handleClick,
        options: { once: true }
      },
      scroll: {
        handler: handleScroll,
        options: { passive: true }
      }
    }
  }
}
```

**Automatic cleanup:** When the condition changes (e.g., from `'edit'` to `'view'`), the module **automatically removes** the previous condition's event listeners before adding new ones. This prevents listener accumulation.

```
Condition changes: 'edit' → 'view'
   ↓
1️⃣ Remove listeners from 'edit': click(handleEditClick), keydown(handleKeyPress)
   ↓
2️⃣ Add listeners from 'view': click(handleViewClick)
```

---

### Event Properties (on*)

Set event handler properties directly:

```javascript
{
  'interactive': {
    onclick: (e) => console.log('Clicked!'),
    onmouseover: (e) => console.log('Hovered!'),
    onchange: (e) => console.log('Changed!')
  }
}
```

These are set as `element.onclick = handler`. Note that unlike `addEventListener`, only one handler per event type is supported this way.

---

## Combining Properties in a Config

A single config object can use any combination of properties:

```javascript
Conditions.apply('loading', {
  'loading': {
    // Native properties
    textContent: 'Processing...',
    disabled: true,

    // Style
    style: {
      opacity: '0.7',
      cursor: 'wait'
    },

    // Classes
    classList: {
      add: 'btn-loading',
      remove: 'btn-primary'
    },

    // Attributes
    setAttribute: {
      'aria-busy': 'true',
      'aria-disabled': 'true'
    },

    // Dataset
    dataset: {
      state: 'loading',
      timestamp: Date.now().toString()
    }
  },

  'ready': {
    textContent: 'Submit',
    disabled: false,
    style: {
      opacity: '1',
      cursor: 'pointer'
    },
    classList: {
      add: 'btn-primary',
      remove: 'btn-loading'
    },
    setAttribute: {
      'aria-busy': 'false',
      'aria-disabled': 'false'
    },
    dataset: {
      state: 'ready'
    },
    addEventListener: {
      click: handleSubmit
    }
  }
}, '#submitBtn');
```

---

## Real-World Examples

### Example 1: Button State Machine

```javascript
const status = state('idle');

Conditions.whenState(
  () => status.value,
  {
    'idle': {
      textContent: 'Start',
      disabled: false,
      style: { backgroundColor: '#007bff', color: 'white' },
      classList: { add: 'btn-primary' }
    },
    'loading': {
      textContent: 'Loading...',
      disabled: true,
      style: { backgroundColor: '#6c757d', color: 'white' },
      classList: { add: 'btn-secondary', remove: 'btn-primary' }
    },
    'success': {
      textContent: 'Done!',
      disabled: true,
      style: { backgroundColor: '#28a745', color: 'white' },
      classList: { add: 'btn-success', remove: 'btn-secondary' }
    }
  },
  '#actionBtn'
);
```

### Example 2: Notification Banner

```javascript
Conditions.apply(notificationType, {
  'info': {
    textContent: 'Information',
    style: { backgroundColor: '#d1ecf1', color: '#0c5460', padding: '12px' },
    classList: { add: 'alert-info' },
    setAttribute: { role: 'status' }
  },
  'warning': {
    textContent: 'Warning',
    style: { backgroundColor: '#fff3cd', color: '#856404', padding: '12px' },
    classList: { add: 'alert-warning' },
    setAttribute: { role: 'alert' }
  },
  'error': {
    textContent: 'Error',
    style: { backgroundColor: '#f8d7da', color: '#721c24', padding: '12px' },
    classList: { add: 'alert-danger' },
    setAttribute: { role: 'alert', 'aria-live': 'assertive' }
  }
}, '#notification');
```

### Example 3: Interactive Mode Switch

```javascript
const mode = state('view');

Conditions.whenState(
  () => mode.value,
  {
    'view': {
      classList: { add: 'read-only', remove: 'editable' },
      setAttribute: { contenteditable: 'false' },
      style: { border: 'none', backgroundColor: 'transparent' }
    },
    'edit': {
      classList: { add: 'editable', remove: 'read-only' },
      setAttribute: { contenteditable: 'true' },
      style: { border: '1px solid #007bff', backgroundColor: '#f8f9fa' },
      addEventListener: {
        blur: () => { mode.value = 'view'; }
      }
    }
  },
  '#editableContent'
);
```

---

## Property Handler Lookup Order

When applying each property, the handlers are checked in this order:

```
1. style         → key === 'style' and value is object
2. classList      → key === 'classList' and value is object
3. setAttribute   → key === 'setAttribute' or 'attrs', value is object
4. removeAttribute → key === 'removeAttribute'
5. dataset        → key === 'dataset' and value is object
6. addEventListener → key === 'addEventListener' and value is object
7. removeEventListener → key === 'removeEventListener' and value is array
8. eventProperty  → key starts with 'on' and value is function
9. nativeProperty → key exists on the element (key in element)
10. fallback      → set as attribute for strings/numbers/booleans
```

---

## Summary

| Property Type | Config Key | Example Value |
|--------------|-----------|--------------|
| **Text/HTML** | `textContent`, `innerHTML` | `'Hello World'` |
| **Style** | `style` | `{ color: 'red', fontSize: '16px' }` |
| **Classes** | `classList` | `{ add: 'active', remove: 'hidden' }` |
| **Attributes** | `setAttribute` / `attrs` | `{ 'aria-label': 'Button' }` |
| **Remove Attrs** | `removeAttribute` | `['disabled', 'readonly']` |
| **Dataset** | `dataset` | `{ userId: '123', role: 'admin' }` |
| **Events** | `addEventListener` | `{ click: handler }` |
| **Event Props** | `onclick`, `onchange`, etc. | `(e) => { ... }` |
| **Native Props** | `disabled`, `checked`, `value`, etc. | `true`, `false`, `'text'` |

> **Simple Rule to Remember:** The config object mirrors how you'd update an element manually — `style` for CSS, `classList` for classes, `dataset` for data attributes, and plain properties like `textContent` or `disabled` directly. Event listeners added by one condition are automatically cleaned up when a different condition takes over.