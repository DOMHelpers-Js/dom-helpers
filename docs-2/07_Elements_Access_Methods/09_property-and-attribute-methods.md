[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Property and Attribute Methods

Beyond accessing elements, the Elements helper provides four shortcut methods for reading and writing element properties and attributes **directly by ID** — without needing to store the element in a variable first.

---

## Quick Start (30 Seconds)

```javascript
// Set a property by element ID
Elements.setProperty('submitBtn', 'disabled', true);
// Same as: document.getElementById('submitBtn').disabled = true;

// Get a property by element ID
const isDisabled = Elements.getProperty('submitBtn', 'disabled', false);
// Same as: document.getElementById('submitBtn')?.disabled ?? false;

// Set an HTML attribute by element ID
Elements.setAttribute('menuBtn', 'aria-expanded', 'true');
// Same as: document.getElementById('menuBtn').setAttribute('aria-expanded', 'true');

// Get an HTML attribute by element ID
const label = Elements.getAttribute('menuBtn', 'aria-label', 'Menu');
// Same as: document.getElementById('menuBtn')?.getAttribute('aria-label') ?? 'Menu';
```

Four methods, one consistent pattern: **ID first, then what you want to do, then a fallback if needed**.

---

## What Are These Methods?

These four methods let you work with element properties and attributes directly through the Elements helper:

| Method | What it does |
|--------|-------------|
| `Elements.setProperty(id, property, value)` | Sets a JavaScript property on an element |
| `Elements.getProperty(id, property, fallback)` | Gets a JavaScript property from an element |
| `Elements.setAttribute(id, attribute, value)` | Sets an HTML attribute on an element |
| `Elements.getAttribute(id, attribute, fallback)` | Gets an HTML attribute from an element |

Before diving into each method, let's understand the key distinction between **properties** and **attributes** — because knowing which one to use matters.

---

## Properties vs. Attributes — The Essential Difference

This is one of the most common sources of confusion in DOM programming. Here's a clear breakdown:

**Attributes** are what you write in HTML — they're strings in the HTML markup.

**Properties** are JavaScript object properties on the DOM element — they can be any type (booleans, numbers, objects).

```html
<input id="myCheckbox" type="checkbox" checked value="yes">
```

```javascript
const input = document.getElementById('myCheckbox');

// ATTRIBUTE — what's in the HTML markup
input.getAttribute('checked'); // → "" (empty string, means it's present)
input.getAttribute('value');   // → "yes"

// PROPERTY — the live JavaScript value
input.checked; // → true (boolean!)
input.value;   // → "yes" (current value, can change as user types)
```

**Key rule:**
- Use **setProperty/getProperty** for: current state, boolean values, live form values, anything that changes dynamically
- Use **setAttribute/getAttribute** for: data attributes (`data-*`), ARIA attributes, metadata that belongs in the HTML markup

```
                Properties                    Attributes
                ──────────────────            ──────────────────
Type            Any JS type                   Always strings
Sync            Live, reflects now            Often static/initial
Examples        .checked, .value, .disabled   data-id, aria-label, href
Use for         Dynamic state                 Metadata & HTML markup
```

---

## Syntax Overview

```javascript
// setProperty — returns true if element found, false if not
const success = Elements.setProperty(id, property, value);

// getProperty — returns the property value, or fallback if element missing
const value = Elements.getProperty(id, property, fallback);

// setAttribute — returns true if element found, false if not
const success = Elements.setAttribute(id, attribute, value);

// getAttribute — returns the attribute value (string), or fallback if missing
const value = Elements.getAttribute(id, attribute, fallback);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The element's ID |
| `property` | string | The JavaScript property name |
| `attribute` | string | The HTML attribute name |
| `value` | any | The value to set |
| `fallback` | any | Value to return if element not found (default: `undefined` for getProperty, `null` for getAttribute) |

---

## Why Do These Methods Exist?

### When Elements.{id} Is Your Starting Point

The most direct approach to changing an element's property is to access the element and set the property yourself:

```javascript
// Access the element, then set properties
const btn = Elements.submitBtn;
if (btn) {
  btn.disabled = true;
  btn.textContent = 'Processing...';
}
```

This approach is **great when you need**:
✅ Multiple properties on the same element
✅ Complex logic based on the element's current state
✅ Method chaining with `.update()`

### When setProperty/getProperty Are a More Direct Approach

In scenarios where you only need to set or read a **single property on a single element** — especially inside utility functions or helpers where you only have the ID — these methods provide a more direct path:

```javascript
// More direct for single-property operations
Elements.setProperty('submitBtn', 'disabled', true);
// vs.
const btn = Elements.submitBtn;
if (btn) btn.disabled = true;

// Very useful in utility functions that work with IDs
function resetField(fieldId) {
  Elements.setProperty(fieldId, 'value', '');
  Elements.setProperty(fieldId, 'disabled', false);
  Elements.setAttribute(fieldId, 'aria-invalid', 'false');
}

resetField('emailInput');
resetField('passwordInput');
resetField('usernameInput');
```

**This method is especially useful when:**
✅ Working with element IDs from configuration or data
✅ Building utility functions that accept IDs as parameters
✅ Setting single properties without storing element references
✅ Needing the boolean return value to know if the element was found

**The Choice is Yours:**
- Use `Elements.{id}` + direct property access when you need multiple operations on the same element
- Use `setProperty/getProperty` when working with single properties, especially in ID-based utility patterns
- Both approaches are valid and can be combined freely

---

## Mental Model — "Room Service by Room Number"

Think of these methods like calling room service at a hotel. You give your room number (the element ID), and tell them exactly what you need (the property or attribute). You don't have to go pick it up yourself (access the element) — just call with the room number.

```
Elements.setProperty('submitBtn', 'disabled', true)
         ↓
  "Room 'submitBtn' — please set disabled to true"
         ↓
  Find the element (from cache or DOM)
         ↓
  element.disabled = true
         ↓
  Return true (service delivered ✅)
  or false (room not found ❌)
```

---

## Elements.setProperty()

Sets a JavaScript property on an element, accessed by its ID.

### Basic Usage

```javascript
// Text content
Elements.setProperty('pageTitle', 'textContent', 'Welcome Back!');
// Same as: Elements.pageTitle.textContent = 'Welcome Back!'

// Disable a button
Elements.setProperty('submitBtn', 'disabled', true);
// Same as: Elements.submitBtn.disabled = true

// Set input value
Elements.setProperty('emailInput', 'value', 'user@example.com');
// Same as: Elements.emailInput.value = 'user@example.com'

// Set inner HTML
Elements.setProperty('statusMessage', 'innerHTML', '<b>Success!</b>');
```

### The Return Value — Did It Work?

`setProperty()` returns `true` if the element was found and the property was set, `false` if the element wasn't found:

```javascript
// Check if the operation succeeded
const success = Elements.setProperty('myButton', 'textContent', 'Updated');

if (success) {
  console.log('✅ Button text updated');
} else {
  console.warn('⚠ Button not found — cannot update');
}

// Short-circuit pattern — stop if element isn't there
if (!Elements.setProperty('criticalBtn', 'disabled', false)) {
  console.error('Critical button is missing!');
  return;
}
```

### Common Properties

```javascript
// Text and HTML
Elements.setProperty('title',   'textContent', 'New Title');
Elements.setProperty('summary', 'innerText',   'Plain text (no HTML)');
Elements.setProperty('card',    'innerHTML',   '<span>HTML content</span>');

// Form controls
Elements.setProperty('emailInput',    'value',    'default@example.com');
Elements.setProperty('rememberMe',    'checked',  true);
Elements.setProperty('agreeCheckbox', 'checked',  false);
Elements.setProperty('submitBtn',     'disabled', true);
Elements.setProperty('submitBtn',     'disabled', false);

// Element state
Elements.setProperty('details',  'open', true);   // Expand <details>
Elements.setProperty('dialog',   'open', true);   // Open <dialog>

// Links and media
Elements.setProperty('profilePic',  'src',  '/images/avatar.jpg');
Elements.setProperty('homeLink',    'href', '/dashboard');
Elements.setProperty('searchInput', 'placeholder', 'Search anything...');
```

### Example: Form Reset Utility

```javascript
// A reusable function that takes a form prefix and resets its fields
function resetLoginForm(prefix = 'login') {
  // Reset all fields by ID
  Elements.setProperty(`${prefix}Email`,    'value',   '');
  Elements.setProperty(`${prefix}Password`, 'value',   '');
  Elements.setProperty(`${prefix}Remember`, 'checked', false);

  // Re-enable the submit button
  Elements.setProperty(`${prefix}SubmitBtn`, 'disabled', false);
  Elements.setProperty(`${prefix}SubmitBtn`, 'textContent', 'Login');

  // Clear status message
  Elements.setProperty(`${prefix}Status`, 'textContent', '');
  Elements.setProperty(`${prefix}Status`, 'className', '');

  console.log('Form reset complete');
}

// Use it
resetLoginForm('login');    // Resets: loginEmail, loginPassword, etc.
resetLoginForm('register'); // Resets: registerEmail, registerPassword, etc.
```

---

## Elements.getProperty()

Gets a JavaScript property value from an element, with an optional fallback for when the element isn't found.

### Basic Usage

```javascript
// Get current text content
const buttonText = Elements.getProperty('submitBtn', 'textContent', '');
console.log(buttonText); // "Submit" (or '' if element not found)

// Get input value
const email = Elements.getProperty('emailInput', 'value', '');
console.log(email); // "user@example.com" (or '' if not found)

// Get checked state
const isChecked = Elements.getProperty('rememberMe', 'checked', false);
console.log(isChecked); // true or false

// Get disabled state
const isDisabled = Elements.getProperty('submitBtn', 'disabled', false);
```

### The Fallback — Safety Net

The third argument is your fallback — what to return if the element doesn't exist:

```javascript
// Without fallback — might get undefined
const value = Elements.getProperty('maybeExists', 'value');
// undefined if element not found → could cause bugs

// With fallback — always get a usable value
const value = Elements.getProperty('maybeExists', 'value', '');
// '' if element not found → safe to use as a string

// Use appropriate fallbacks for the type you expect
const text    = Elements.getProperty('title', 'textContent', 'Untitled'); // string fallback
const isOpen  = Elements.getProperty('menu',  'open', false);             // boolean fallback
const tabIdx  = Elements.getProperty('btn',   'tabIndex', 0);             // number fallback
const dataset = Elements.getProperty('widget','dataset', {});             // object fallback
```

### Example: Collecting Form Data

```javascript
// Read all form values in one clean function
function getLoginData() {
  return {
    email:    Elements.getProperty('loginEmail',    'value',   '').trim(),
    password: Elements.getProperty('loginPassword', 'value',   ''),
    remember: Elements.getProperty('loginRemember', 'checked', false)
  };
}

const data = getLoginData();
// → { email: 'user@example.com', password: '****', remember: true }

// Now validate
if (!data.email || !data.email.includes('@')) {
  Elements.setProperty('loginError', 'textContent', 'Please enter a valid email');
  return;
}
```

### Example: Reading State Before Toggling

```javascript
// Read the current state, then toggle it
function togglePanel(panelId) {
  const isCurrentlyOpen = Elements.getProperty(panelId, 'open', false);

  // Toggle to the opposite state
  Elements.setProperty(panelId, 'open', !isCurrentlyOpen);

  // Update the button label to match
  const newLabel = isCurrentlyOpen ? 'Expand' : 'Collapse';
  Elements.setProperty(`${panelId}ToggleBtn`, 'textContent', newLabel);

  // Update ARIA attribute to match
  Elements.setAttribute(`${panelId}ToggleBtn`, 'aria-expanded', String(!isCurrentlyOpen));
}

// Toggle the FAQ panel
togglePanel('faqPanel');
```

---

## Elements.setAttribute()

Sets an HTML attribute on an element. All values are stored as strings (that's how HTML attributes work).

### Basic Usage

```javascript
// ARIA attributes — for accessibility
Elements.setAttribute('menuBtn',     'aria-expanded', 'false');
Elements.setAttribute('searchInput', 'aria-label',   'Search the site');
Elements.setAttribute('errorMsg',    'aria-live',    'polite');
Elements.setAttribute('emailField',  'aria-invalid', 'false');

// Data attributes — for storing data in the DOM
Elements.setAttribute('userCard', 'data-user-id', '12345');
Elements.setAttribute('widget',   'data-theme',   'dark');
Elements.setAttribute('item',     'data-state',   'active');

// Standard HTML attributes
Elements.setAttribute('externalLink', 'target', '_blank');
Elements.setAttribute('externalLink', 'rel',    'noopener noreferrer');
Elements.setAttribute('emailInput',   'type',   'email');
Elements.setAttribute('submitBtn',    'type',   'submit');
```

### When to Use setAttribute vs. setProperty

```javascript
// Use setAttribute for ARIA attributes — these are always HTML attributes
Elements.setAttribute('button', 'aria-pressed', 'true');   // ✅ ARIA = attribute
Elements.setAttribute('nav',    'aria-hidden',  'false');  // ✅ ARIA = attribute

// Use setAttribute for data-* attributes
Elements.setAttribute('card', 'data-product-id', '42');  // ✅ data-* = attribute

// Use setProperty for boolean states — these are JavaScript properties
Elements.setProperty('checkbox', 'checked',  true);  // ✅ boolean = property
Elements.setProperty('button',   'disabled', false); // ✅ boolean = property

// Use setProperty for current form values
Elements.setProperty('input', 'value', 'Hello'); // ✅ current value = property
```

### Example: Making Elements Accessible

```javascript
// A utility function to set up proper ARIA attributes
function makeButtonAccessible(buttonId, {
  label,
  expanded = false,
  controls = null,
  pressed = null
}) {
  // Set the accessible label
  Elements.setAttribute(buttonId, 'aria-label', label);

  // Set expanded state (for dropdowns, accordions)
  Elements.setAttribute(buttonId, 'aria-expanded', String(expanded));

  // Set which element this button controls (if any)
  if (controls) {
    Elements.setAttribute(buttonId, 'aria-controls', controls);
  }

  // Set pressed state (for toggle buttons)
  if (pressed !== null) {
    Elements.setAttribute(buttonId, 'aria-pressed', String(pressed));
  }

  // Make it keyboard-accessible if it's not a native button
  if (Elements.getProperty(buttonId, 'tagName', '') !== 'BUTTON') {
    Elements.setAttribute(buttonId, 'role', 'button');
    Elements.setAttribute(buttonId, 'tabindex', '0');
  }

  return Elements.getAttribute(buttonId, 'aria-label', null) !== null;
}

// Usage
makeButtonAccessible('menuToggle', {
  label: 'Open navigation menu',
  expanded: false,
  controls: 'mainNav'
});

makeButtonAccessible('darkModeToggle', {
  label: 'Toggle dark mode',
  pressed: false
});
```

### Example: Storing Configuration in Data Attributes

```javascript
// Store complex configuration as JSON in a data attribute
function configureWidget(widgetId, config) {
  // Store the full config as JSON
  Elements.setAttribute(widgetId, 'data-config', JSON.stringify(config));

  // Store individual settings as separate attributes for quick access
  Elements.setAttribute(widgetId, 'data-theme',    config.theme || 'light');
  Elements.setAttribute(widgetId, 'data-version',  '2.0');
  Elements.setAttribute(widgetId, 'data-ready',    'false');

  // Mark widget as configured
  console.log(`Widget '${widgetId}' configured with theme: ${config.theme}`);
}

configureWidget('statsWidget', {
  theme: 'dark',
  refreshInterval: 5000,
  showTrends: true,
  maxItems: 10
});
```

---

## Elements.getAttribute()

Gets an HTML attribute value from an element. Always returns a string (or your fallback).

### Basic Usage

```javascript
// Get data attributes
const userId   = Elements.getAttribute('userCard',  'data-user-id', '');
const theme    = Elements.getAttribute('dashboard', 'data-theme',   'light');
const configStr = Elements.getAttribute('widget',   'data-config',  '{}');

// Get ARIA attributes
const isExpanded = Elements.getAttribute('menuBtn',  'aria-expanded', 'false');
const label      = Elements.getAttribute('closeBtn', 'aria-label',    'Close');

// Get standard attributes
const href   = Elements.getAttribute('homeLink',   'href',   '#');
const target = Elements.getAttribute('extLink',    'target', '_self');
const rel    = Elements.getAttribute('extLink',    'rel',    '');
```

### Remember: Attribute Values Are Always Strings

```javascript
// Even boolean attributes come back as strings!
Elements.setAttribute('details', 'data-expanded', 'true');

const expanded = Elements.getAttribute('details', 'data-expanded', 'false');
console.log(expanded);          // "true" (a string, not a boolean)
console.log(typeof expanded);   // "string"

// Convert to the type you need
const isExpanded = expanded === 'true'; // → true (now a boolean)
const count      = parseInt(Elements.getAttribute('list', 'data-count', '0'), 10);
```

### Example: Reading Widget Configuration

```javascript
function readWidgetConfig(widgetId) {
  // Get the JSON config string
  const configStr = Elements.getAttribute(widgetId, 'data-config', '{}');

  // Parse it safely
  try {
    return JSON.parse(configStr);
  } catch (error) {
    console.warn(`Invalid JSON config for '${widgetId}':`, error.message);
    return {}; // Return empty object as fallback
  }
}

// Read and use the config
const config = readWidgetConfig('statsWidget');
console.log(config.theme);    // 'dark'
console.log(config.maxItems); // 10

// Check initialization status
const isReady = Elements.getAttribute('statsWidget', 'data-ready', 'false') === 'true';
if (!isReady) {
  initializeWidget('statsWidget', config);
  Elements.setAttribute('statsWidget', 'data-ready', 'true');
}
```

---

## Deep Dive — Real-World Patterns

### Pattern 1: Form Manager Class

A clean utility class that uses all four methods to manage form state by ID:

```javascript
class FormManager {
  constructor(formPrefix) {
    this.prefix = formPrefix;
  }

  // Set a field's value
  setValue(fieldName, value) {
    return Elements.setProperty(`${this.prefix}${fieldName}`, 'value', value);
  }

  // Get a field's value
  getValue(fieldName, fallback = '') {
    return Elements.getProperty(`${this.prefix}${fieldName}`, 'value', fallback);
  }

  // Mark a field as invalid with ARIA
  setError(fieldName, message) {
    const fieldId = `${this.prefix}${fieldName}`;
    const errorId = `${this.prefix}${fieldName}Error`;

    Elements.setAttribute(fieldId, 'aria-invalid', 'true');
    Elements.setAttribute(fieldId, 'aria-describedby', errorId);
    Elements.setProperty(errorId, 'textContent', message);
  }

  // Clear a field's error state
  clearError(fieldName) {
    const fieldId = `${this.prefix}${fieldName}`;
    const errorId = `${this.prefix}${fieldName}Error`;

    Elements.setAttribute(fieldId, 'aria-invalid', 'false');
    Elements.setAttribute(fieldId, 'aria-describedby', '');
    Elements.setProperty(errorId, 'textContent', '');
  }

  // Get all form data at once
  getData(fields) {
    const data = {};
    for (const field of fields) {
      const type = Elements.getProperty(`${this.prefix}${field}`, 'type', 'text');

      if (type === 'checkbox') {
        data[field] = Elements.getProperty(`${this.prefix}${field}`, 'checked', false);
      } else {
        data[field] = Elements.getProperty(`${this.prefix}${field}`, 'value', '');
      }
    }
    return data;
  }

  // Reset all fields
  reset(fields) {
    for (const field of fields) {
      this.setValue(field, '');
      this.clearError(field);
    }
  }
}

// Usage
const loginForm = new FormManager('login');

loginForm.setValue('Email', 'prefilled@example.com');

const data = loginForm.getData(['Email', 'Password', 'Remember']);
// → { Email: 'prefilled@example.com', Password: '', Remember: false }

if (!data.Email.includes('@')) {
  loginForm.setError('Email', 'Please enter a valid email address');
}

// On success
loginForm.reset(['Email', 'Password']);
```

---

### Pattern 2: Accessibility Helper

```javascript
const A11y = {
  // Expand/collapse toggle (for dropdowns, accordions)
  setExpanded(triggerId, targetId, isExpanded) {
    Elements.setAttribute(triggerId, 'aria-expanded', String(isExpanded));
    Elements.setAttribute(triggerId, 'aria-controls', targetId);
  },

  // Show/hide from screen readers
  setHidden(id, isHidden) {
    Elements.setAttribute(id, 'aria-hidden', String(isHidden));
  },

  // Mark field as invalid/valid
  setValidity(id, isInvalid, errorId = null) {
    Elements.setAttribute(id, 'aria-invalid', String(isInvalid));
    if (errorId) {
      Elements.setAttribute(id, 'aria-describedby', isInvalid ? errorId : '');
    }
  },

  // Make a non-button element keyboard-accessible
  makeInteractive(id, role = 'button') {
    Elements.setAttribute(id, 'role',     role);
    Elements.setAttribute(id, 'tabindex', '0');
  },

  // Check current expanded state
  isExpanded(id) {
    return Elements.getAttribute(id, 'aria-expanded', 'false') === 'true';
  },

  // Toggle expanded state
  toggleExpanded(triggerId, targetId) {
    const currentlyExpanded = this.isExpanded(triggerId);
    this.setExpanded(triggerId, targetId, !currentlyExpanded);
    return !currentlyExpanded;
  }
};

// Usage
A11y.makeInteractive('customDropdownBtn');
A11y.setExpanded('customDropdownBtn', 'dropdownMenu', false);

// When user clicks:
customDropdownBtn.addEventListener('click', () => {
  const isNowOpen = A11y.toggleExpanded('customDropdownBtn', 'dropdownMenu');
  Elements.dropdownMenu.update({
    style: { display: isNowOpen ? 'block' : 'none' }
  });
});
```

---

### Pattern 3: Data Store in DOM

Using data attributes to associate data with elements — useful for frameworks that render lists:

```javascript
// Store item data in the DOM when rendering
function renderProductList(products) {
  const list = Elements.productList;
  if (!list) return;

  list.innerHTML = products.map(product => `
    <li id="product-${product.id}"
        data-product-id="${product.id}"
        data-category="${product.category}"
        data-price="${product.price}">
      <h3>${product.name}</h3>
      <button id="addToCart-${product.id}">Add to Cart</button>
    </li>
  `).join('');
}

// Later, when a button is clicked, retrieve the data
function handleAddToCart(productId) {
  const elementId = `product-${productId}`;

  const id       = Elements.getAttribute(elementId, 'data-product-id', '');
  const category = Elements.getAttribute(elementId, 'data-category', '');
  const price    = parseFloat(Elements.getAttribute(elementId, 'data-price', '0'));

  addToCart({ id, category, price });

  // Visual feedback
  Elements.setProperty(`addToCart-${productId}`, 'textContent', 'Added! ✅');
  Elements.setProperty(`addToCart-${productId}`, 'disabled', true);
}
```

---

## Best Practices

### ✅ DO: Provide Fallbacks for Getters

```javascript
// Without fallback — risky if element doesn't exist
const value = Elements.getProperty('input', 'value');
// → undefined if element not found

// With fallback — always safe
const value = Elements.getProperty('input', 'value', '');
// → '' if element not found
```

### ✅ DO: Check Return Values for Setters

```javascript
// Know when an operation fails
if (!Elements.setProperty('criticalBtn', 'disabled', true)) {
  console.error('criticalBtn not found — something is wrong');
  reportError('missing-element', 'criticalBtn');
}
```

### ✅ DO: Use Appropriate Method for the Task

```javascript
// ✅ Properties for live state
Elements.setProperty('checkbox', 'checked',  true);   // boolean → property
Elements.setProperty('input',    'value',    'text');  // live value → property
Elements.setProperty('button',   'disabled', false);   // state → property

// ✅ Attributes for metadata and ARIA
Elements.setAttribute('button', 'aria-label', 'Submit form');  // ARIA → attribute
Elements.setAttribute('item',   'data-id',    '123');           // data-* → attribute
Elements.setAttribute('link',   'rel',        'noopener');      // HTML metadata → attribute
```

### ✅ DO: Use .update() for Multiple Changes on the Same Element

```javascript
// ❌ Verbose — three separate calls for the same element
Elements.setProperty('submitBtn', 'textContent', 'Processing...');
Elements.setProperty('submitBtn', 'disabled',    true);
Elements.setAttribute('submitBtn', 'aria-busy',  'true');

// ✅ Clean — one .update() call for the same element
Elements.submitBtn?.update({
  textContent: 'Processing...',
  disabled:    true,
  setAttribute: ['aria-busy', 'true']
});
```

### ❌ DON'T: Confuse Properties and Attributes

```javascript
// ❌ Using setAttribute for current checked state — doesn't work as expected
Elements.setAttribute('myCheckbox', 'checked', 'true');
// This sets the initial/default checked attribute, not the current state

// ✅ Use setProperty for current state
Elements.setProperty('myCheckbox', 'checked', true);
// This changes the checkbox's actual current checked state

// ❌ Using setProperty for ARIA (these are attributes, not properties)
Elements.setProperty('button', 'aria-expanded', 'true');  // Won't work correctly
// ✅ ARIA always uses setAttribute
Elements.setAttribute('button', 'aria-expanded', 'true'); // Correct
```

---

## Summary — Key Takeaways

1. **Four methods, one pattern:** ID first, then property/attribute name, then value (or fallback for getters).

2. **Properties vs. Attributes — the key distinction:**
   - Properties: live JavaScript values (boolean, number, string) — use `setProperty/getProperty`
   - Attributes: HTML markup strings — use `setAttribute/getAttribute`

3. **Setters return `true/false`** — check them when you need to know if the element exists.

4. **Always provide fallbacks for getters** — so you get a usable value even when the element isn't found.

5. **Attribute values are always strings** — convert with `=== 'true'`, `parseInt()`, `parseFloat()`, or `JSON.parse()` as needed.

6. **For multiple changes on one element, use `.update()`** — it's cleaner and more concise.

7. **ARIA attributes always use `setAttribute`** — they're HTML attributes, not JavaScript properties.

---

## What's Next?

Continue to **Utility Methods** (`10_utility-methods.md`) — for `configure()`, `stats()`, `clear()`, and `destroy()`.