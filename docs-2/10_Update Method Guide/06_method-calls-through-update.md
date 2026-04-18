[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Method Calls Through `.update()`

One of `.update()`'s unique features is the ability to **call DOM methods** using the same declarative syntax as everything else. No need to break out of your update object just to call `.focus()` or `.scrollIntoView()`.

---

## Quick Start (30 Seconds)

```javascript
// Call DOM methods using array syntax inside update objects
element.update({
  value: '',           // Set a property
  disabled: false,     // Set a property
  focus: []            // Call element.focus() — empty array = no arguments
});

// With arguments
element.update({
  scrollIntoView: [{ behavior: 'smooth', block: 'center' }]
  //               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //               Arguments passed to scrollIntoView()
});
```

The rule: **array value = method call**. The array items become the arguments.

---

## What Are Method Calls Through `.update()`?

Every DOM element has **methods** — built-in functions you can call on it. Things like:

- `element.focus()` — move keyboard focus to the element
- `element.blur()` — remove focus
- `element.click()` — programmatically click it
- `element.scrollIntoView()` — scroll the page to show it
- `element.animate()` — run a Web Animations API animation
- `element.dispatchEvent(event)` — fire a custom event

Normally you'd call these separately after updating properties:

```javascript
// Old pattern — property updates then method call
Elements.myInput.update({ value: '', disabled: false });
Elements.myInput.focus();  // Separate call
```

With method calls through `.update()`, you do it all in one place:

```javascript
// New pattern — everything in one update object
Elements.myInput.update({
  value: '',
  disabled: false,
  focus: []   // Called as part of the same update
});
```

---

## Syntax

### No-Argument Methods (Empty Array)

```javascript
element.update({
  methodName: []   // Calls: element.methodName()
});
```

### Methods with Arguments (Populated Array)

```javascript
element.update({
  methodName: [arg1, arg2, arg3]   // Calls: element.methodName(arg1, arg2, arg3)
});
```

### Combined with Property Updates

```javascript
element.update({
  // Properties first (order doesn't technically matter, but readable convention)
  value: 'cleared',
  disabled: false,
  classList: { remove: 'error' },

  // Methods at the end
  focus: [],
  scrollIntoView: [{ behavior: 'smooth' }]
});
```

---

## Why Does This Exist?

### When Separate Method Calls Are Your Starting Point

When you need to update several properties *and* call a method, vanilla JavaScript splits these into two steps:

```javascript
// Step 1: Update properties
const input = document.getElementById('emailInput');
input.value = '';
input.disabled = false;
input.classList.remove('error');

// Step 2: Call methods
input.focus();
input.scrollIntoView({ behavior: 'smooth' });
```

This approach works well for clear, step-by-step control. But the property changes and the method calls are **conceptually part of the same action** (e.g., "reset and focus the input"), yet they're split across multiple statements.

### When Unified Declarative Updates Are Your Goal

In scenarios where you want to describe a complete action in one place — especially when that action involves both state changes and behavior triggers — the unified approach provides a cleaner expression:

```javascript
Elements.emailInput.update({
  value: '',
  disabled: false,
  classList: { remove: 'error' },
  focus: [],
  scrollIntoView: [{ behavior: 'smooth' }]
});
```

**This is especially useful when:**
✅ You store state configurations as objects (method calls travel with the config)
✅ You pass update objects between functions
✅ You want all related changes visible in one block
✅ You're building state machines where a state transition includes behavior

**The Choice Is Yours:**
- Use separate method calls when clarity of sequence is important
- Use unified update objects when the action is one conceptual unit
- Both styles work equally well and can coexist in the same codebase

---

## Mental Model: The To-Do List

Think of an update object as a **to-do list** you hand to `.update()`:

```
To-Do List for "Reset and focus input"
────────────────────────────────────────
☐ Set value to ''
☐ Set disabled to false
☐ Remove class 'error'
☐ Call focus()
☐ Call scrollIntoView({ behavior: 'smooth' })
```

All five items are on the same list. `.update()` reads through the list and executes each item. Whether an item is a property assignment or a method call, it goes on the same list.

The array syntax `focus: []` is just how you write "call this method" on the list.

---

## How Does It Work?

### The Detection Logic

When `.update()` processes each key in the update object, it checks the value type:

```
Processing key: "focus"
Value: []
        │
        ▼
Is value an Array?
        │
    ┌───┴───┐
   YES       NO
    │         │
    ▼         ▼
Call method:  Assign property:
element.focus()  element.focus = value
```

The dispatcher:

```
Key: "focus",  Value: []
→ Array detected
→ Is element.focus a function? Yes
→ Call: element.focus(...[])  = element.focus()

Key: "scrollIntoView", Value: [{ behavior: 'smooth' }]
→ Array detected
→ Is element.scrollIntoView a function? Yes
→ Call: element.scrollIntoView(...[{ behavior: 'smooth' }])
      = element.scrollIntoView({ behavior: 'smooth' })

Key: "textContent", Value: "Hello"
→ Not an array
→ Assign: element.textContent = "Hello"
```

### Why Arrays?

You might wonder: why use an array `[]` to indicate a method call? Why not a special keyword or symbol?

The answer is **elegance and simplicity**. Arrays serve double duty here:

1. `[]` (empty array) = "call this method with no arguments"
2. `[arg1, arg2]` (non-empty array) = "call this method with these arguments"

It maps perfectly to how method calls work: `element.focus()` vs `element.scrollIntoView({ behavior: 'smooth' })`.

And since DOM properties are never naturally set to arrays (there's no `element.textContent = [1, 2, 3]` scenario that makes sense), arrays are a clean signal for method calls.

---

## Complete Method Call Reference

### Focus & Interaction

```javascript
element.update({
  focus: [],                    // element.focus()
  focus: [{ preventScroll: true }],  // element.focus({ preventScroll: true })
  blur: [],                     // element.blur()
  click: [],                    // element.click()
  select: []                    // element.select() — selects all text in input
});
```

### Scrolling

```javascript
element.update({
  scrollIntoView: [],            // element.scrollIntoView()
  scrollIntoView: [true],        // element.scrollIntoView(true) — align to top
  scrollIntoView: [false],       // element.scrollIntoView(false) — align to bottom
  scrollIntoView: [{
    behavior: 'smooth',          // Smooth scroll animation
    block: 'center',             // Vertical alignment: start|center|end|nearest
    inline: 'nearest'            // Horizontal alignment
  }]
});
```

### DOM Manipulation

```javascript
element.update({
  remove: [],                    // element.remove() — removes from DOM
  before: [newElement],          // element.before(newElement) — insert before
  after: [newElement],           // element.after(newElement) — insert after
  append: [child],               // element.append(child) — append child
  prepend: [child],              // element.prepend(child) — prepend child
  replaceWith: [newElement],     // element.replaceWith(newElement)
  insertAdjacentHTML: ['beforeend', '<li>Item</li>'],
  insertAdjacentText: ['afterbegin', 'Prefix: ']
});
```

### Attributes (Method Form)

```javascript
element.update({
  setAttribute: ['aria-hidden', 'true'],  // element.setAttribute('aria-hidden', 'true')
  removeAttribute: ['disabled'],          // element.removeAttribute('disabled')
  toggleAttribute: ['open'],              // element.toggleAttribute('open')
  toggleAttribute: ['open', true],        // element.toggleAttribute('open', true)
});
```

### Form Elements

```javascript
formElement.update({
  reset: [],    // form.reset() — clears all form fields
  submit: [],   // form.submit() — submits the form
  checkValidity: [],  // form.checkValidity()
  reportValidity: []  // form.reportValidity() — shows browser validation UI
});
```

### Events

```javascript
element.update({
  dispatchEvent: [new Event('change')],
  dispatchEvent: [new CustomEvent('my-event', { detail: { value: 42 } })],
  dispatchEvent: [new MouseEvent('click', { bubbles: true })]
});
```

### Web Animations API

```javascript
element.update({
  animate: [
    // Keyframes
    [
      { opacity: '0', transform: 'translateY(-10px)' },
      { opacity: '1', transform: 'translateY(0)' }
    ],
    // Options
    {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    }
  ]
});
```

---

## Deep Dive: Ordering Matters for Methods

Methods are executed in the **order they appear** in the update object. However, note that JavaScript objects don't always guarantee key order (though modern engines do maintain insertion order for string keys that aren't array indices).

For safety and clarity, it's best practice to put methods **after** property assignments in your update object:

```javascript
// ✅ Good order — properties first, then methods
element.update({
  value: '',          // 1. Clear value
  disabled: false,    // 2. Enable input
  focus: []           // 3. Focus it (after it's enabled)
});

// The sequence makes logical sense:
// Set properties → then trigger behavior
```

---

## Deep Dive: Combining Multiple Methods

You can include multiple method calls in one update:

```javascript
Elements.searchInput.update({
  // Reset the field
  value: '',
  classList: { remove: 'has-results', 'has-error' },

  // Trigger methods
  focus: [],                    // Move cursor into input
  select: [],                   // Select any remaining text
  scrollIntoView: [{            // Make sure it's visible
    behavior: 'smooth',
    block: 'center'
  }]
});
```

Note: `select: []` after `value: ''` would select nothing (empty value). The order matters — properties are applied before methods in the same update object pass.

---

## Practical Examples

### Example 1: Modal Open

```javascript
function openModal(title, message) {
  Elements.update({
    modalTitle: { textContent: title },
    modalMessage: { textContent: message },
    modalOverlay: {
      style: { display: 'flex' },
      classList: { add: 'open', remove: 'closed' },
      setAttribute: { 'aria-hidden': 'false' }
    },
    modalCloseBtn: {
      focus: []  // Move focus into modal (accessibility)
    }
  });
}
```

### Example 2: Form Reset and Refocus

```javascript
function resetAndFocusForm() {
  // Reset all fields
  Elements.update({
    emailInput: { value: '', classList: { remove: 'error', 'success' } },
    passwordInput: { value: '', classList: { remove: 'error', 'success' } },
    errorMessage: { style: { display: 'none' }, textContent: '' }
  });

  // Focus the first field
  Elements.emailInput.update({ focus: [] });
}
```

### Example 3: Smooth Navigation

```javascript
function navigateToSection(sectionId) {
  // Update active nav link
  Selector.queryAll('.nav-link').update({
    classList: { remove: 'active' }
  });

  Elements[`nav-${sectionId}`].update({
    classList: { add: 'active' }
  });

  // Scroll to section
  Elements[sectionId].update({
    scrollIntoView: [{ behavior: 'smooth', block: 'start' }]
  });
}
```

### Example 4: Validation Feedback with Focus

```javascript
function showValidationError(fieldId, message) {
  Elements.update({
    [fieldId]: {
      classList: { add: 'error', remove: 'success' },
      setAttribute: { 'aria-invalid': 'true' },
      focus: []  // Return focus to invalid field
    },
    [`${fieldId}Error`]: {
      textContent: message,
      style: { display: 'block' }
    }
  });
}
```

### Example 5: Copy to Clipboard Pattern

```javascript
function copiedFeedback(buttonId) {
  Elements[buttonId].update({
    textContent: 'Copied!',
    classList: { add: 'copied', remove: 'idle' },
    disabled: true
  });

  setTimeout(() => {
    Elements[buttonId].update({
      textContent: 'Copy',
      classList: { add: 'idle', remove: 'copied' },
      disabled: false
    });
  }, 2000);
}
```

### Example 6: Input with Event Dispatch

```javascript
function setSelectValue(selectId, value) {
  // Set value and dispatch change event
  // (useful for libraries that listen for change events)
  Elements[selectId].update({
    value: value,
    dispatchEvent: [new Event('change', { bubbles: true })]
  });
}
```

### Example 7: Animate In and Focus

```javascript
function showNotification(message) {
  Elements.notification.update({
    textContent: message,
    style: { display: 'block' },
    setAttribute: { 'aria-live': 'polite', 'role': 'alert' },
    animate: [
      [
        { opacity: '0', transform: 'translateY(-20px)' },
        { opacity: '1', transform: 'translateY(0)' }
      ],
      { duration: 300, easing: 'ease-out', fill: 'forwards' }
    ]
  });
}
```

---

## Common Mistakes

### Mistake 1: Forgetting the Array

```javascript
// ❌ WRONG — no array = property assignment, not method call
element.update({
  focus    // SyntaxError (shorthand property)
});

element.update({
  focus: true  // Wrong! Assigns true to element.focus
});

// ✅ CORRECT — empty array for no-argument methods
element.update({
  focus: []  // Calls element.focus()
});
```

### Mistake 2: Using Nested Object Instead of Array

```javascript
// ❌ WRONG — objects are not method calls
element.update({
  scrollIntoView: { behavior: 'smooth' }  // Assigns object, doesn't call
});

// ✅ CORRECT — wrap in array
element.update({
  scrollIntoView: [{ behavior: 'smooth' }]  // Calls with object as argument
});
```

### Mistake 3: Expecting Method Results

Method calls through `.update()` are **fire and forget** — you can't capture their return values:

```javascript
// ❌ Can't do this
const animation = element.update({ animate: [[...], {}] });
animation.pause();  // animation is the element, not the Animation object!

// ✅ For methods that return values, call them directly
const animation = element.animate([...], {});
animation.pause();
```

Use method calls through `.update()` when you don't need the return value. For methods where the return matters (like `animate()` → `Animation` object, or `getBoundingClientRect()`), call them directly on the element.

### Mistake 4: Non-Existent Methods

If the key doesn't match an existing method on the element, `.update()` will log a warning but won't throw:

```javascript
// ❌ 'show' is not a native DOM method
element.update({ show: [] });  // Warning: 'show' is not a function on element

// ✅ Use a real DOM method
element.update({ style: { display: 'block' } });  // Correct way to "show"
```

---

## When to Use Method Calls vs Direct Calls

| Scenario | Use Method in Update Object | Use Direct Call |
|----------|---------------------------|----------------|
| Focus after resetting a field | ✅ | Both OK |
| Scroll after navigation | ✅ | Both OK |
| Animate as part of a state change | ✅ | Both OK |
| Need the return value (e.g., `animate()` object) | ❌ | ✅ |
| Methods returning measurements (`getBoundingClientRect`) | ❌ | ✅ |
| Calling methods in stored state configs | ✅ | Not possible |
| Debugging/tracing exact method call | Both OK | ✅ (clearer) |

---

## Summary

Method calls through `.update()` bring behavior into your declarative update objects:

- **Array syntax**: `methodName: []` = call with no args; `methodName: [a, b]` = call with args
- **Auto-detected**: if the value is an array and the key is a function on the element, it's called
- **Unified API**: properties, special handlers, and methods — all in one object
- **Order matters**: properties are applied before methods in the same update pass
- **Fire and forget**: you can't capture return values of methods called this way
- **Forgiving**: if the method doesn't exist, logs a warning but doesn't throw

The most common use cases: `focus: []`, `blur: []`, `click: []`, `scrollIntoView: [options]`, `select: []`, `reset: []`, `dispatchEvent: [event]`

---

## What's Next?

Next chapter: **Advanced Patterns & Techniques** — state machines, factories, composition patterns, debouncing, observables, and more.