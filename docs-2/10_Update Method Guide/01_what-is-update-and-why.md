[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# What Is `.update()` and Why Does It Exist?

## Quick Start (30 Seconds)

```javascript
// Without .update() — scattered, repetitive
const btn = document.getElementById('loginBtn');
btn.textContent = 'Logging in...';
btn.disabled = true;
btn.style.backgroundColor = '#9ca3af';
btn.style.cursor = 'not-allowed';

// With .update() — one call, grouped, readable
Elements.loginBtn.update({
  textContent: 'Logging in...',
  disabled: true,
  style: { backgroundColor: '#9ca3af', cursor: 'not-allowed' }
});

// Update multiple elements at once
Elements.update({
  loginBtn: { textContent: 'Logging in...', disabled: true },
  errorMsg: { textContent: '', style: { display: 'none' } },
  spinner:  { style: { display: 'block' } }
});
```

One method. Any element. Any property. Any number of changes. That's `.update()`.

---

## What Is `.update()`?

`.update()` is the **core DOM manipulation method** of the DOMHelpers library. It gives you a single, unified interface for applying any kind of change to any DOM element — text content, inline styles, CSS classes, HTML attributes, event listeners, and even DOM method calls — all through one consistent syntax.

Simply put: instead of calling `textContent =`, then `style.color =`, then `classList.add()`, then `setAttribute()` one at a time, you describe everything you want changed in a single object and pass it to `.update()`.

Think of it as the difference between:

> **Old way:** "First set the text. Then change the color. Then add the class. Then set the attribute."
>
> **`.update()` way:** "Here's how this element should look now. Make it happen."

You're describing the **destination**, not the **journey** to get there.

---

## Syntax

### Single Element

```javascript
element.update(updatesObject)
```

```javascript
Elements.loginBtn.update({
  textContent: 'Submit',
  disabled: false,
  style: { backgroundColor: '#3b82f6' }
});
```

### Multiple Elements (Bulk Update)

```javascript
Elements.update({
  elementId1: { /* updates */ },
  elementId2: { /* updates */ }
});
```

### Collection

```javascript
Collections.ClassName.btn.update({
  disabled: true,
  style: { opacity: '0.5' }
});
```

---

## Why Does This Exist?

### Vanilla JavaScript — When Explicit Per-Property Control Is Your Priority

In simple scenarios — one property, one element — plain JavaScript is perfectly direct:

```javascript
const button = document.getElementById('loginBtn');
button.textContent = 'Logging in...';
button.disabled = true;
button.style.backgroundColor = '#9ca3af';
```

This approach works well for isolated one-liners. But as your UI state transitions grow, this pattern doesn't scale:

```
Related changes get scattered across many lines
Multiple DOM reads (getElementById repeated)
No change detection — DOM updated even when value is the same
Hard to tell at a glance what the "end state" looks like
```

### `.update()` — When Clarity, Grouping, and Scalability Are Your Priority

In scenarios where you need to apply several related changes together — form state transitions, loading states, error feedback, theme switching — `.update()` keeps everything grouped, readable, and performant:

```javascript
Elements.update({
  loginBtn: {
    textContent: 'Logging in...',
    disabled: true,
    style: { backgroundColor: '#9ca3af', cursor: 'not-allowed' }
  },
  errorMsg: {
    textContent: '',
    style: { display: 'none' }
  },
  spinner: {
    style: { display: 'block' }
  }
});
```

**This method is especially useful when:**
✅ Multiple properties need to change at the same time
✅ Several elements need to update together (UI state transitions)
✅ You want change detection — only touching the DOM when values actually differ
✅ You want updates that read like a description of the desired result
✅ You want safe, forgiving behavior that doesn't crash on edge cases

**The Choice Is Yours:**
- Use vanilla assignment for quick single-property one-liners
- Use `.update()` for grouped, multi-property changes — especially across multiple elements
- Both are valid; `.update()` brings structure and safety to larger updates

**Benefits of `.update()`:**
✅ Declarative — describe the desired state, not the steps
✅ Grouped — all changes for an element in one object
✅ Change-detected — skips DOM writes when values haven't changed
✅ Forgiving — warnings on invalid properties, no crashes
✅ Versatile — text, styles, classes, attributes, events, methods — one API

---

## Mental Model

### The Coffee Analogy

There are two ways to get coffee made.

**Imperative (step-by-step):**
1. Walk to the kitchen
2. Open the cabinet
3. Take out a cup
4. Pour coffee
5. Add milk and sugar

**Declarative (describe the result):**
> "I'd like a coffee with milk and two sugars."

Plain DOM manipulation is **imperative** — step-by-step instructions.

`.update()` is **declarative** — you describe what you want, and it figures out the steps.

```
Imperative (Vanilla JS)              Declarative (.update())
───────────────────────              ───────────────────────
element.textContent = 'Hello';       element.update({
element.style.color = 'red';           textContent: 'Hello',
element.classList.add('active');       style: { color: 'red' },
element.disabled = false;              classList: { add: 'active' },
                                       disabled: false
                                     });
```

Same result — but the declarative form shows you the **destination** at a glance.

---

## How Does It Work?

When you call `element.update(updatesObject)`, the method reads each key in your object and determines what kind of DOM operation it maps to:

```
element.update({ textContent: 'Hello', style: { color: 'red' }, focus: [] })
                          │
                          ▼
         For each key-value pair in the update object:
                          │
       ┌──────────────────┼──────────────────────┐
       │                  │                      │
 Known property?    Special handler?      Function on element?
 (textContent,      (style, classList,    (focus, scrollIntoView,
  disabled, value)   setAttribute,         click, select...)
       │             dataset, etc.)               │
       ▼                  │                      ▼
element.textContent       ▼               element.focus()
     = 'Hello'     Apply each sub-prop    element.scrollIntoView(...)
                   individually
                          │
                          ▼
              Built-in Change Detection
              ─────────────────────────
              Compare new value vs stored previous value
              Same? → SKIP DOM write  ✨
              Different? → Apply + store new value
```

**The key insight:** Every property update goes through change detection. If the value hasn't changed since the last `.update()` call, the DOM isn't touched at all. This makes `.update()` safe to call repeatedly from event handlers, timers, or state change callbacks.

---

## Basic Usage

### Single Property Update

```javascript
Elements.pageTitle.update({
  textContent: 'Welcome Back!'
});
```

### Multiple Properties — One Element

```javascript
Elements.submitBtn.update({
  textContent: 'Submit',
  disabled: false,
  style: {
    backgroundColor: '#3b82f6',
    color: 'white',
    cursor: 'pointer'
  },
  classList: {
    add: 'btn-ready',
    remove: 'btn-loading'
  }
});
```

### Multiple Elements — One Call

```javascript
Elements.update({
  header: {
    textContent: 'Order Confirmed'
  },
  orderNumber: {
    textContent: '#ORD-2024-00123',
    style: { fontWeight: 'bold', color: '#059669' }
  },
  submitBtn: {
    textContent: 'Place New Order',
    disabled: false
  },
  loadingSpinner: {
    style: { display: 'none' }
  }
});
```

### Leverage Change Detection

```javascript
// Safe to call on every keystroke — DOM touched only when value actually changes
function syncPreview(text) {
  Elements.preview.update({
    textContent: text,
    style: { color: text.length > 0 ? '#1f2937' : '#9ca3af' }
  });
}

syncPreview('Hello');       // Applied — both properties
syncPreview('Hello');       // SKIPPED — nothing changed ✨
syncPreview('Hello World'); // textContent applied — color unchanged, SKIPPED ✨
```

---

## Real-World Example: Form Validation Feedback

### Without `.update()` — 21 Scattered Lines

```javascript
const emailInput = document.getElementById('emailInput');
emailInput.style.borderColor = '#ef4444';
emailInput.style.borderWidth = '2px';
emailInput.classList.add('error');
emailInput.setAttribute('aria-invalid', 'true');

const emailError = document.getElementById('emailError');
emailError.textContent = 'Please enter a valid email';
emailError.style.display = 'block';
emailError.style.color = '#dc2626';

const passwordInput = document.getElementById('passwordInput');
passwordInput.style.borderColor = '#ef4444';
passwordInput.style.borderWidth = '2px';
passwordInput.classList.add('error');
passwordInput.setAttribute('aria-invalid', 'true');

const passwordError = document.getElementById('passwordError');
passwordError.textContent = 'Password must be at least 8 characters';
passwordError.style.display = 'block';
passwordError.style.color = '#dc2626';

const submitBtn = document.getElementById('submitBtn');
submitBtn.textContent = 'Fix errors';
submitBtn.disabled = true;
submitBtn.style.opacity = '0.5';
```

**Problems:**
❌ 21 lines for 5 elements — doesn't scale
❌ Intent obscured across scattered assignments
❌ Each `getElementById` is a separate DOM read

### With `.update()` — One Readable Call

```javascript
Elements.update({
  emailInput: {
    style: { borderColor: '#ef4444', borderWidth: '2px' },
    classList: { add: 'error' },
    setAttribute: { 'aria-invalid': 'true' }
  },
  emailError: {
    textContent: 'Please enter a valid email',
    style: { display: 'block', color: '#dc2626' }
  },
  passwordInput: {
    style: { borderColor: '#ef4444', borderWidth: '2px' },
    classList: { add: 'error' },
    setAttribute: { 'aria-invalid': 'true' }
  },
  passwordError: {
    textContent: 'Password must be at least 8 characters',
    style: { display: 'block', color: '#dc2626' }
  },
  submitBtn: {
    textContent: 'Fix errors',
    disabled: true,
    style: { opacity: '0.5' }
  }
});
```

**Result:** Crystal-clear intent. Each element's changes are grouped together. Easy to modify or extend any part.

---

## What `.update()` Can Change

Everything you can include in an update object at a glance:

```javascript
element.update({
  // Text
  textContent: 'Safe plain text (XSS-safe)',
  innerHTML:   '<strong>Formatted</strong> HTML',

  // Basic properties
  value:       'input text',
  disabled:    true,
  checked:     false,
  placeholder: 'Enter text...',
  href:        'https://example.com',
  src:         'image.jpg',

  // Inline styles (always camelCase)
  style: {
    color:           'red',
    fontSize:        '18px',
    backgroundColor: '#f0f0f0',
    display:         'flex',
    transition:      'all 0.3s ease'
  },

  // CSS class operations
  classList: {
    add:     ['visible', 'animated'],
    remove:  'hidden',
    toggle:  'expanded',
    replace: ['btn-old', 'btn-new']
  },

  // HTML attributes
  setAttribute: {
    'data-id':      '123',
    'aria-label':   'Close',
    'aria-expanded':'true'
  },

  // Data attributes (camelCase → data-kebab-case automatically)
  dataset: {
    userId: '42',
    action: 'submit'
  },

  // Event listeners
  addEventListener: ['click', handleClick],

  // DOM method calls — array = arguments passed to the method
  focus:          [],
  scrollIntoView: [{ behavior: 'smooth' }],
  select:         []
});
```

---

## Key Principles

### 1. One Method, All Operations

You don't need to remember whether to use `element.textContent`, `element.style.color`, `element.classList.add()`, or `element.setAttribute()`. Everything goes through `.update()`.

### 2. Object-Based Configuration

Your update object is a description of desired state. Keys are what to change; values are what to change them to.

```javascript
{
  propertyName: newValue,
  anotherProperty: anotherValue,
  nestedObject: { subProp: value }  // For style, classList, setAttribute, etc.
}
```

### 3. Safe and Forgiving

```javascript
// Missing element? Returns null and warns — doesn't crash
Elements.nonExistent.update({ textContent: 'Hello' });

// Invalid updates object? Warning logged, nothing applied
element.update(null);     // Warns: "invalid updates object"
element.update('string'); // Warns: "invalid updates object"

// Unknown property? Warning logged, other updates continue
element.update({
  textContent: 'works fine',
  fakeProp:    'logs warning, skipped'
  // ↑ Other updates still applied
});
```

### 4. Built-In Change Detection

```javascript
// Call 100 times — DOM written only once (on first call)
for (let i = 0; i < 100; i++) {
  element.update({ textContent: 'Hello', style: { color: 'red' } });
}
// Calls 2-100: all SKIPPED — values unchanged ✨
```

---

## Summary

`.update()` is the **unified, declarative, change-detecting DOM manipulation method** that makes managing complex UI state clean and readable.

**Key Points:**

1️⃣ **Declarative** — describe the desired state, not the steps

2️⃣ **Grouped** — all changes for an element in one object

3️⃣ **Atomic** — one call, all updates applied together

4️⃣ **Change-detected** — skips unnecessary DOM writes automatically

5️⃣ **Forgiving** — invalid input logs warnings but doesn't crash

6️⃣ **Versatile** — text, styles, classes, attributes, events, methods — one API

7️⃣ **Scalable** — `Elements.update({})` updates dozens of elements in one expressive call

The mental shift to declarative, grouped updates makes your code easier to read, easier to modify, and more maintainable as your UI grows.