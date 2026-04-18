[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# The .update() Method

You've seen `.update()` appear throughout the previous guides — now let's understand exactly what it does, how it works under the hood, and how to use all of its capabilities.

`.update()` is the single most important method in DOMHelpers Core. Every element and collection you get back from `Elements`, `Collections`, and `Selector` has it automatically attached — and it's far more powerful than just setting properties.

---

## Quick Start (30 Seconds)

```javascript
// Get any element — .update() is already built in
Elements.myBtn.update({
  textContent: 'Saved!',                         // Change text
  disabled:    false,                            // Set a property
  style:       { color: 'green', opacity: '1' }, // Change styles
  classList:   { add: 'done', remove: 'loading' }, // Modify classes
  setAttribute: { 'aria-label': 'Saved' },       // Set attributes
  dataset:     { status: 'saved' }               // Set data attributes
});
```

That's **six different types of updates** — all in one call, all applied only if they actually changed.

---

## What is `.update()`?

**`.update()`** is a universal DOM update method that is automatically added to every element or collection returned by `Elements`, `Collections`, and `Selector`.

Think of it as a **smart patch system** for the DOM. You describe the desired state of an element — what text it should show, what styles it should have, what classes it should carry — and `.update()` figures out the minimal set of DOM writes needed to get there.

Here's the key insight:

```
You call: element.update({ textContent: 'Hello' })
                       ↓
1️⃣  What's the current value? "Hello" (same as before)
                       ↓
2️⃣  Same value — skip the write ✨
                       ↓
DOM unchanged — no redundant paint
```

vs.

```
You call: element.update({ textContent: 'World' })
                       ↓
1️⃣  Current value: "Hello". New value: "World". Different!
                       ↓
2️⃣  Apply: element.textContent = 'World'
                       ↓
3️⃣  Store "World" as the previous value (for next comparison)
```

This **fine-grained change detection** is what separates `.update()` from just assigning properties directly.

---

## Why Does This Exist?

### The Challenge with Regular DOM Updates

In plain JavaScript, every property assignment writes to the DOM — even if the value is the same:

```javascript
// Standard property assignment — always writes
element.textContent = 'Hello';   // Write to DOM
element.textContent = 'Hello';   // Writes again — even though nothing changed
element.textContent = 'Hello';   // And again — no memory of previous writes
```

This creates unnecessary work for the browser — triggering layout recalculations and repaints even when nothing actually changed.

Also, adding event listeners has a well-known pitfall:

```javascript
// Standard addEventListener — can add the same handler multiple times!
function render() {
  element.addEventListener('click', handleClick);
}

render(); // Adds listener
render(); // Adds SAME listener again → now fires twice!
render(); // Fires THREE times!
```

### The Solution: Smart Detection and Deduplication

`.update()` solves both problems:

```javascript
// With .update() — only writes when value actually changes
function updateUI() {
  element.update({ textContent: 'Hello' });
}

updateUI(); // Writes 'Hello'
updateUI(); // Detects same value → skips write ✨
updateUI(); // Skips again ✨

// With .update() — event listeners never duplicated
function render() {
  element.update({
    addEventListener: ['click', handleClick]
  });
}

render(); // Adds listener
render(); // Same handler detected → skips ✨
render(); // Skips again ✨ — only one listener, ever
```

**Benefits:**
✅ One call — describe all the changes you want in one object
✅ Change detection — skips DOM writes for unchanged values
✅ No duplicate listeners — same handler added only once, no matter how many times you call it
✅ Fine-grained style updates — only changed CSS properties are written
✅ Returns the element — enabling method chaining

---

## Mental Model — The Smart Painter

Imagine `.update()` as a smart painter who:
1. Checks what color the wall currently is before painting
2. If the wall is already the right color, puts the brush down
3. If it's different, paints with precision — only the wall, not the floor
4. Keeps notes so they never apply the same paint twice unnecessarily

```
element.update({ style: { color: 'red', fontSize: '16px' } })
                   ↓
"Is color already red?"
   [YES] → Don't paint color ✨
   [NO]  → Paint color
"Is fontSize already 16px?"
   [YES] → Don't paint fontSize ✨
   [NO]  → Paint fontSize
```

Only the changed parts get written. The rest stay untouched.

---

## How Does It Work? — Internal Mechanics

### The WeakMap Memory System

The change-detection system uses two internal `WeakMap` structures:

```
elementPreviousProps  (WeakMap)
   Key:   HTMLElement reference
   Value: { textContent: 'prev text', color: 'prev color', ... }

elementEventListeners (WeakMap)
   Key:   HTMLElement reference
   Value: Map of { eventType → Map of { handlerFn → { handler, options } } }
```

A `WeakMap` is used instead of a regular `Map` because it allows JavaScript to automatically garbage-collect the data when the element is removed from the page. No memory leaks, ever.

### The Update Pipeline

```
element.update(updates)
   ↓
For each key-value pair in updates:
   ↓
┌──────────────────────────────────────────────────┐
│ Is key 'textContent' or 'innerText'?             │ → Compare + write if different
│ Is key 'innerHTML'?                              │ → Compare + write if different
│ Is key 'style' and value is object?              │ → Granular style comparison
│ Is key 'classList' and value is object?          │ → add/remove/toggle/replace
│ Is key 'setAttribute'?                           │ → Object or array format
│ Is key 'removeAttribute'?                        │ → Remove one or many
│ Is key 'getAttribute'?                           │ → Read and log (debug)
│ Is key 'addEventListener'?                       │ → Add only if not already added
│ Is key 'removeEventListener'?                    │ → Remove tracked listener
│ Is key 'dataset' and value is object?            │ → Set data-* attributes
│ Is element[key] a function?                      │ → Call it with value as args
│ Does element have property key?                  │ → Compare + write if different
│ Fallback: setAttribute(key, String(value))       │ → For unknown properties
└──────────────────────────────────────────────────┘
   ↓
Returns element (for chaining)
```

---

## All 13 Update Types

### 1. `textContent` — Change Visible Text

Sets the text content of an element. Only updates if the text actually changed.

```javascript
element.update({ textContent: 'New text here' });
```

> `innerText` works the same way — use whichever you prefer.

---

### 2. `innerHTML` — Set Raw HTML Content

Sets the innerHTML. Compared before writing — only updates if HTML changed.

```javascript
element.update({
  innerHTML: '<strong>Bold</strong> and <em>italic</em>'
});
```

> ⚠️ Use with caution when inserting user-provided content — always sanitize first to prevent XSS.

---

### 3. `style` — Object-Based Style Updates

Pass an object with CSS property names (in camelCase). Only the **changed** style properties are written — not the entire style attribute.

```javascript
element.update({
  style: {
    color:           '#333',
    fontSize:        '18px',
    backgroundColor: '#f0f0f0',
    borderRadius:    '8px',
    display:         'flex',
    alignItems:      'center'
  }
});
```

**How granular it is:**

```
Previous styles: { color: '#333', fontSize: '16px' }
New styles:      { color: '#333', fontSize: '18px' }

color:    '#333' === '#333'  → SKIP (unchanged)
fontSize: '16px' !== '18px' → WRITE element.style.fontSize = '18px'
```

Only `fontSize` gets written to the DOM. `color` stays untouched.

---

### 4. `classList` — Class Management

Add, remove, toggle, or replace classes. Each operation is independent:

```javascript
element.update({
  classList: {
    add:     'active',              // Add one class
    add:     ['active', 'visible'], // OR add multiple
    remove:  'loading',             // Remove one
    remove:  ['loading', 'hidden'], // OR remove multiple
    toggle:  'selected',            // Toggle one
    replace: ['old-class', 'new-class']  // Replace [from, to]
  }
});
```

**Typical state-transition pattern:**

```javascript
// Transition from "loading" to "success"
element.update({
  classList: {
    add:    'success',
    remove: ['loading', 'error']
  }
});
```

---

### 5. `setAttribute` — Set HTML Attributes

Two supported formats:

```javascript
// Object format (recommended — multiple at once)
element.update({
  setAttribute: {
    src:          'photo.jpg',
    alt:          'A photo',
    'data-id':    '123',
    'aria-label': 'Close dialog'
  }
});

// Array format (legacy — single attribute)
element.update({
  setAttribute: ['src', 'photo.jpg']
});
```

Attributes are only set if the current value is different.

---

### 6. `removeAttribute` — Remove HTML Attributes

```javascript
// Remove one attribute
element.update({
  removeAttribute: 'disabled'
});

// Remove multiple attributes
element.update({
  removeAttribute: ['disabled', 'readonly', 'aria-hidden']
});
```

Only removes if the attribute actually exists — no errors if missing.

---

### 7. `getAttribute` — Read an Attribute (Debug)

```javascript
// Logs the value to console — useful for debugging
element.update({
  getAttribute: 'data-id'
});
// Console: [DOM Helpers] getAttribute('data-id'): '42'
```

This is a **read-only** operation — it doesn't change the DOM.

---

### 8. `addEventListener` — Attach Events Without Duplicates ✨

This is one of the most powerful features of `.update()`. It tracks event listeners using the internal WeakMap and **never adds the same handler twice** — even if you call `.update()` multiple times with the same handler.

**Object format (multiple events):**

```javascript
element.update({
  addEventListener: {
    click:     (e) => console.log('clicked'),
    mouseover: (e) => e.target.classList.add('hovered'),
    mouseout:  (e) => e.target.classList.remove('hovered')
  }
});
```

**Array format (single event, with optional options):**

```javascript
element.update({
  addEventListener: ['click', myHandler]
});

// With options
element.update({
  addEventListener: ['click', myHandler, { once: true }]
});
```

**Why no-duplicate matters — real example:**

```javascript
// In a render function that runs many times:
function render() {
  Elements.btn.update({
    addEventListener: ['click', handleClick]
  });
}

render(); // Adds listener
render(); // Same handler detected → skips ✨
render(); // Skips again ✨

// Result: exactly ONE click listener, no matter how many renders
```

In plain JavaScript, calling `addEventListener` twice with the same handler would add it twice, and your handler would fire twice per click.

---

### 9. `removeEventListener` — Remove a Tracked Listener

```javascript
element.update({
  removeEventListener: ['click', myHandler]
});

// With options (must match options used when adding)
element.update({
  removeEventListener: ['click', myHandler, { once: true }]
});
```

Works with the same tracking system — only removes if the handler was actually added.

---

### 10. `dataset` — Set `data-*` Attributes

A clean shorthand for setting data attributes:

```javascript
element.update({
  dataset: {
    userId:    '42',
    action:    'delete',
    confirmed: 'false'
  }
});

// Equivalent to:
// element.dataset.userId    = '42';
// element.dataset.action    = 'delete';
// element.dataset.confirmed = 'false';
```

Only sets the data attribute if the value changed.

---

### 11. DOM Method Calls — Call Native Element Methods

If the key matches a method on the element, it gets called with the value as argument(s):

```javascript
// Call element.focus()
element.update({ focus: [] });

// Call element.scrollIntoView({ behavior: 'smooth' })
element.update({ scrollIntoView: [{ behavior: 'smooth' }] });

// Call element.click()
element.update({ click: [] });
```

Array values are spread as arguments: `element.method(...value)`.
Non-array values are passed directly: `element.method(value)`.

---

### 12. Regular DOM Properties — Generic Property Assignment

For any property that exists directly on the element — with change detection:

```javascript
element.update({
  value:     'new input value',   // input.value
  checked:   true,                // checkbox.checked
  disabled:  false,               // button.disabled
  href:      '/new-link',         // anchor.href
  src:       'image.jpg',         // img.src
  selected:  true,                // option.selected
  hidden:    false,               // element.hidden
  tabIndex:  0                    // element.tabIndex
});
```

The comparison checks both the current DOM value and the previously stored value. If both differ from the new value, the write happens.

---

### 13. Fallback: `setAttribute` for Unknown Keys

If you pass a key that doesn't match any property or method on the element, `.update()` falls back to `setAttribute`:

```javascript
element.update({
  'data-custom':   'value',    // Not a DOM property → setAttribute('data-custom', 'value')
  'role':          'button',   // Might not be a DOM property → setAttribute('role', 'button')
  'aria-expanded': 'true'      // → setAttribute('aria-expanded', 'true')
});
```

Only works for string, number, or boolean values. Other types are skipped.

---

## Chaining `.update()` Calls

`.update()` always returns the element itself (or collection), so you can chain calls:

```javascript
Elements.myBtn
  .update({ textContent: 'Processing...', disabled: true })
  .update({ classList: { add: 'loading' } });
```

Or combine with native DOM methods:

```javascript
Elements.myInput
  .update({ value: '', classList: { add: 'cleared' } })
  .focus();
```

---

## `.update()` on Collections

When you call `.update()` on a collection, the same update is applied to **every element** in the collection:

```javascript
Collections.ClassName.btn.update({
  disabled:  true,
  classList: { add: 'loading' }
});
// Every .btn element gets: disabled = true, class 'loading' added
```

The change-detection system works **per-element** — so if one button's `disabled` was already `true`, it won't write it again for that specific button. Each element tracks its own previous state independently.

---

## Change Detection Summary

| Property type | How comparison works |
|--------------|---------------------|
| `textContent` / `innerText` | `element[key] !== value && prevProps[key] !== value` |
| `innerHTML` | `element.innerHTML !== value && prevProps.innerHTML !== value` |
| `style.property` | `element.style[prop] !== value && prevProps.style[prop] !== value` |
| `setAttribute` | `element.getAttribute(attr) !== value` |
| `dataset.key` | `element.dataset[key] !== value` |
| Regular property | Deep equality check: `!isEqual(element[key], value) && !isEqual(prevProps[key], value)` |
| `addEventListener` | Handler tracked in WeakMap — added only if not already registered |

---

## Real-World Examples

### Example 1: Form State Machine

```javascript
function setFormState(state) {
  const states = {
    loading: {
      submitBtn:  { disabled: true,  textContent: 'Loading...' },
      emailInput: { disabled: true },
      errorMsg:   { style: { display: 'none' } }
    },
    ready: {
      submitBtn:  { disabled: false, textContent: 'Submit' },
      emailInput: { disabled: false },
      errorMsg:   { style: { display: 'none' } }
    },
    error: {
      submitBtn:  { disabled: false, textContent: 'Try Again' },
      emailInput: { disabled: false },
      errorMsg:   { textContent: 'An error occurred', style: { display: 'block', color: 'red' } }
    },
    success: {
      submitBtn:  { disabled: true,  textContent: 'Submitted!' },
      emailInput: { disabled: true },
      errorMsg:   { style: { display: 'none' } }
    }
  };

  Elements.update(states[state]);
}

// Transition through states
setFormState('loading');   // Show loading UI
setFormState('ready');     // Form is ready
setFormState('error');     // Show error
setFormState('success');   // All done
```

---

### Example 2: Form Validation with Aria Accessibility

```javascript
function showFieldError(fieldId, message) {
  const field   = Elements[fieldId];
  const errorId = fieldId + 'Error';

  field.update({
    classList:    { add: 'field-error', remove: 'field-valid' },
    setAttribute: { 'aria-invalid': 'true', 'aria-describedby': errorId }
  });

  Elements[errorId].update({
    textContent: message,
    style:       { display: 'block', color: 'red' }
  });
}

function clearFieldError(fieldId) {
  const errorId = fieldId + 'Error';

  Elements[fieldId].update({
    classList:       { add: 'field-valid', remove: 'field-error' },
    setAttribute:    { 'aria-invalid': 'false' },
    removeAttribute: 'aria-describedby'
  });

  Elements[errorId].update({
    textContent: '',
    style:       { display: 'none' }
  });
}

// Usage
showFieldError('email', 'Please enter a valid email address');
// ... user fixes it ...
clearFieldError('email');
```

---

### Example 3: Button with Loading State (No Duplicate Listeners)

```javascript
function initializeSubmitButton() {
  const btn = Elements.submitBtn;

  // Safe to call this function multiple times — listener won't be added twice
  btn.update({
    textContent:  'Submit',
    disabled:     false,
    addEventListener: {
      click: async (e) => {
        // Immediately show loading state
        btn.update({
          textContent: 'Saving...',
          disabled:    true,
          classList:   { add: 'loading' }
        });

        try {
          await saveData();

          // Success
          btn.update({
            textContent: 'Saved! ✓',
            disabled:    true,
            classList:   { remove: 'loading', add: 'success' }
          });

          // Reset after 2 seconds
          setTimeout(() => {
            btn.update({
              textContent: 'Submit',
              disabled:    false,
              classList:   { remove: 'success' }
            });
          }, 2000);

        } catch (err) {
          btn.update({
            textContent: 'Try Again',
            disabled:    false,
            classList:   { remove: 'loading', add: 'error' }
          });
        }
      }
    }
  });
}

// This can be called multiple times safely
initializeSubmitButton();
initializeSubmitButton(); // ← Won't add duplicate click listener
```

---

## Common Mistakes to Avoid

### ❌ Passing Strings for style Instead of Objects

```javascript
// Wrong — style must be an object with camelCase properties
element.update({
  style: 'color: red; font-size: 18px;'  // ❌ Not supported
});

// Right — pass an object
element.update({
  style: { color: 'red', fontSize: '18px' }  // ✅
});
```

### ❌ Expecting classList to Be Additive Without Specifying

```javascript
// This does NOT add 'active' and remove 'loading' in a single key
// (object keys must be unique — the second 'add' would override the first)
element.update({
  classList: {
    add:    'active',
    add:    'visible',  // ❌ This overrides the first 'add'
  }
});

// Right — use arrays for multiple classes
element.update({
  classList: {
    add:    ['active', 'visible'],  // ✅ Both classes added
    remove: ['loading', 'hidden']   // ✅ Both classes removed
  }
});
```

### ❌ Using innerHTML with User Content Without Sanitizing

```javascript
// DANGEROUS — never do this with user-provided content
const userInput = '<script>alert("XSS!")</script>';
element.update({ innerHTML: userInput });  // ❌ XSS vulnerability!

// Right — sanitize first, or use textContent
element.update({ textContent: userInput });  // ✅ Escaped automatically
// Or sanitize: element.update({ innerHTML: DOMPurify.sanitize(userInput) });
```

---

## Summary — Key Takeaways

1. **Universal** — `.update()` is added to every element/collection returned by `Elements`, `Collections`, or `Selector`
2. **13 update types** — text, innerHTML, styles, classList, attributes, events, dataset, method calls, and more
3. **Fine-grained change detection** — values are compared before writing; unchanged properties are skipped
4. **No duplicate listeners** — `addEventListener` is tracked per handler; the same function is never added twice
5. **Style is granular** — only changed CSS properties are written, not the entire style block
6. **Returns the element** — enabling method chaining: `.update({...}).focus()`
7. **Works on collections too** — same update applied to every element in the collection, with per-element change detection

---

## What's Next?

Now let's bring everything together. The final file shows **seven complete real-world examples** using all three helpers working together — and provides the full API reference for the entire library.

Continue to **[06 — Real-World Examples & API Reference](./06_real-world-examples-and-api-reference.md)** →