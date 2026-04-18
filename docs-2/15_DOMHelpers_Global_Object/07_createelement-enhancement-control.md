[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Controlling the createElement Enhancement

## Quick Start (30 seconds)

```javascript
// Enable enhanced document.createElement
DOMHelpers.enableCreateElementEnhancement();

// Now every created element automatically has .update()
const button = document.createElement('button');
button.update({ textContent: 'Click Me', className: 'btn' });

// Disable it — restore the original document.createElement
DOMHelpers.disableCreateElementEnhancement();
```

---

## What Are These Methods?

The DOM Helpers library can **enhance** the native `document.createElement()` method so that every element you create automatically comes with the `.update()` method. These two methods let you **turn that enhancement on and off**:

| Method | What It Does |
|--------|-------------|
| `enableCreateElementEnhancement()` | Replaces `document.createElement` with the enhanced version |
| `disableCreateElementEnhancement()` | Restores the original `document.createElement` |

---

## Syntax

```javascript
DOMHelpers.enableCreateElementEnhancement()     // returns DOMHelpers
DOMHelpers.disableCreateElementEnhancement()    // returns DOMHelpers
```

**Parameters:** None for either method.

**Returns:** The `DOMHelpers` object itself (for chaining).

---

## Why Do These Exist?

### The Situation They Address

When you use the native `document.createElement()`, the element you get back is a plain DOM element. It doesn't have the `.update()` method:

```javascript
// Without enhancement
const div = document.createElement('div');
div.update({ textContent: 'Hello' });  // ❌ TypeError: div.update is not a function
```

To use `.update()`, you'd have to set properties the traditional way:

```javascript
const div = document.createElement('div');
div.textContent = 'Hello';
div.className = 'container';
div.style.padding = '20px';
div.style.backgroundColor = '#f0f0f0';
```

### With Enhancement Enabled

When the createElement enhancement is enabled, every element automatically gets `.update()`:

```javascript
DOMHelpers.enableCreateElementEnhancement();

const div = document.createElement('div');
div.update({
  textContent: 'Hello',
  className: 'container',
  style: { padding: '20px', backgroundColor: '#f0f0f0' }
});
// ✅ Works! The element was automatically enhanced
```

✅ **Every element gets `.update()`** — no extra steps
✅ **Seamless** — use `document.createElement` as normal
✅ **Configuration object support** — pass options as the second parameter

---

## How Does It Work?

### enableCreateElementEnhancement()

```
DOMHelpers.enableCreateElementEnhancement()
   ↓
Replaces document.createElement with enhanced version
   ↓
Now, every call to document.createElement():
   1. Creates the element using the original method
   2. Adds the .update() method to the element
   3. Returns the enhanced element
```

### disableCreateElementEnhancement()

```
DOMHelpers.disableCreateElementEnhancement()
   ↓
Restores document.createElement to the original browser method
   ↓
Now, document.createElement() works exactly as the browser intended
   — no .update() method added
```

Behind the scenes, the library stores a reference to the original `document.createElement` when it loads. `enableCreateElementEnhancement()` swaps in the enhanced version, and `disableCreateElementEnhancement()` swaps back the original.

---

## What Does the Enhanced createElement Do?

When enhancement is enabled, `document.createElement()` gains two extra powers:

### Power 1: Every Element Gets .update()

```javascript
DOMHelpers.enableCreateElementEnhancement();

// Every element automatically has .update()
const p = document.createElement('p');
p.update({ textContent: 'Hello World', style: { color: 'blue' } });

const input = document.createElement('input');
input.update({ type: 'email', placeholder: 'Enter email' });
```

### Power 2: Configuration Object as Second Parameter

```javascript
DOMHelpers.enableCreateElementEnhancement();

// Pass a configuration object directly
const button = document.createElement('button', {
  textContent: 'Submit',
  className: 'btn primary',
  disabled: false,
  style: { padding: '10px 20px', borderRadius: '5px' }
});

// The element is created AND configured in one call
console.log(button.textContent);  // "Submit"
console.log(button.className);   // "btn primary"
```

**What's happening here:**
- The enhanced `createElement` detects that the second parameter is a configuration object (not the native `options` parameter)
- It creates the element, then applies the configuration using `.update()`
- The result is a fully configured element in a single line

---

## Basic Usage

### Example 1: Enable for Your Entire App

```javascript
// At the top of your application
DOMHelpers.enableCreateElementEnhancement();

// Now use document.createElement normally — elements are enhanced
function createCard(title, text) {
  const card = document.createElement('div');
  card.update({
    className: 'card',
    style: { padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }
  });

  const heading = document.createElement('h3');
  heading.update({ textContent: title });

  const body = document.createElement('p');
  body.update({ textContent: text, style: { color: '#666' } });

  card.appendChild(heading);
  card.appendChild(body);

  return card;
}

const card = createCard('Welcome', 'Thanks for visiting!');
document.body.appendChild(card);
```

**What's happening here:**
- Enhancement is enabled once at the top of the app
- Every `document.createElement` call returns an enhanced element
- We use `.update()` to configure each element cleanly

---

### Example 2: Temporary Enhancement

```javascript
// Enable just for a specific task
DOMHelpers.enableCreateElementEnhancement();

const elements = buildComplexUI();

// Restore original behavior when done
DOMHelpers.disableCreateElementEnhancement();
```

**What's happening here:**
- We enable enhancement for a specific section of code
- After we're done creating elements, we restore the original `document.createElement`
- This is useful if you're concerned about the enhancement affecting third-party libraries

---

### Example 3: Using the Global createElement Shortcut

The library also exposes a `createElement` global that is always the enhanced version:

```javascript
// This is always enhanced — no need to call enableCreateElementEnhancement()
const div = createElement('div', {
  textContent: 'Hello',
  className: 'container'
});

// Bulk creation is also available
const ui = createElement.bulk({
  H1:     { textContent: 'Dashboard' },
  P:      { textContent: 'Welcome back!', className: 'subtitle' },
  BUTTON: { textContent: 'Get Started', className: 'btn primary' }
});

ui.H1;      // The <h1> element
ui.BUTTON;  // The <button> element
ui.all;     // Array of all three elements
```

**What's happening here:**
- The global `createElement` function (without `document.`) is always the enhanced version
- It supports both the configuration object and the `.bulk()` method
- You can use this instead of enabling/disabling the enhancement on `document.createElement`

---

### Example 4: Chaining with Other DOMHelpers Methods

```javascript
// Enable enhancement and configure in one chain
DOMHelpers
  .enableCreateElementEnhancement()
  .configure({ enableLogging: true });

// Create and configure elements
const nav = document.createElement('nav', {
  className: 'main-nav',
  style: { display: 'flex', gap: '16px' }
});
```

**What's happening here:**
- Both `enableCreateElementEnhancement()` and `configure()` return `DOMHelpers`
- This lets you chain multiple setup calls in a single statement

---

## When Enhancement is Already Enabled

By default, the library has `autoEnhanceCreateElement` set to `true` in its configuration. This means the enhancement is **already active** when the library loads.

```javascript
// Check: is it already enhanced?
const div = document.createElement('div');
console.log(typeof div.update);  // "function" — already enhanced!
```

If the enhancement is already enabled, calling `enableCreateElementEnhancement()` again is harmless — it simply reassigns the same enhanced function.

---

## Enhanced vs Original: Side-by-Side

```javascript
// ── With Enhancement (enabled by default) ──
const btn = document.createElement('button');
btn.update({
  textContent: 'Click Me',
  className: 'btn',
  style: { padding: '10px' },
  addEventListener: ['click', () => console.log('Clicked!')]
});

// ── Without Enhancement ──
DOMHelpers.disableCreateElementEnhancement();

const btn2 = document.createElement('button');
btn2.textContent = 'Click Me';
btn2.className = 'btn';
btn2.style.padding = '10px';
btn2.addEventListener('click', () => console.log('Clicked!'));
```

Both produce the same result. The enhanced version groups all configuration into a single `.update()` call.

---

## Common Questions

### "Does this affect third-party libraries?"

When `enableCreateElementEnhancement()` is active, **all** calls to `document.createElement` go through the enhanced version — including those from third-party libraries. The enhanced version adds a non-enumerable `.update()` property to elements, which shouldn't interfere with other code. However, if you're concerned:

```javascript
// Option 1: Use the global createElement shortcut instead
// (doesn't modify document.createElement)
const el = createElement('div');

// Option 2: Disable for safety, enable only when you need it
DOMHelpers.disableCreateElementEnhancement();
```

---

### "What happens to elements created before I disable?"

Elements that were already created with the enhanced `createElement` **keep** their `.update()` method. Disabling the enhancement only affects elements created *after* the call:

```javascript
DOMHelpers.enableCreateElementEnhancement();
const div1 = document.createElement('div');  // Has .update()

DOMHelpers.disableCreateElementEnhancement();
const div2 = document.createElement('div');  // No .update()

div1.update({ textContent: 'Still works!' });  // ✅ Works
div2.update({ textContent: 'Nope' });          // ❌ TypeError
```

---

## Summary

| Method | What It Does | Returns |
|--------|-------------|---------|
| `enableCreateElementEnhancement()` | Makes `document.createElement` add `.update()` to every element | `DOMHelpers` |
| `disableCreateElementEnhancement()` | Restores the original `document.createElement` | `DOMHelpers` |

| Alternative | When to Use |
|-------------|-------------|
| `createElement()` global | Always enhanced — no enable/disable needed |
| `createElement.bulk()` | Create multiple elements with configuration at once |

> **Simple Rule to Remember:** The enhancement is **on by default**. Use `disableCreateElementEnhancement()` only if you need to restore the original browser behavior. Use the global `createElement` shortcut if you want enhancement without modifying `document.createElement`.