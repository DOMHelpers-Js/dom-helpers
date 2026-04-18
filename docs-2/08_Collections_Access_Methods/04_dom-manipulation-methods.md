[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# DOM Manipulation Methods

## Quick Start (30 Seconds)

```javascript
const buttons = Collections.ClassName.btn;

// Add a class to ALL buttons at once
buttons.addClass('active');

// Set a property on ALL buttons at once
buttons.setProperty('disabled', false);

// Apply styles to ALL buttons at once
buttons.setStyle({ backgroundColor: '#2563eb', color: 'white' });

// Add an event listener to ALL buttons at once
buttons.on('click', function() {
  console.log('Clicked:', this.textContent);
});

// Chain multiple operations in one expression
buttons.addClass('initialized')
       .setStyle({ cursor: 'pointer' })
       .on('click', handleClick);
// All three operations applied to every button ✨
```

No manual loops. Every operation applies to all elements in the collection.

---

## What Are DOM Manipulation Methods?

These are **built-in methods on Collections** that let you make the same change to every element in a collection — all at once.

Think of it this way: if you have 50 buttons and you want to disable them all, you have two choices:

```javascript
// Choice 1: Manual loop (the traditional way)
const buttons = document.getElementsByClassName('btn');
Array.from(buttons).forEach(btn => {
  btn.disabled = true;
  btn.classList.add('loading');
  btn.addEventListener('click', handler);
});

// Choice 2: Collections bulk methods (the DOMHelpers way)
const buttons = Collections.ClassName.btn;
buttons.setProperty('disabled', true)
       .addClass('loading')
       .on('click', handler);
```

Both do the same thing. The Collections approach is shorter, reads like English, and chains naturally.

---

## Why These Methods Exist

### When Looping Is Repetitive

Imagine you're building a form with multiple input fields. When the user submits, you want to:
1. Disable all inputs (so they can't edit while submitting)
2. Add a "loading" class to all inputs
3. Set a specific style on all inputs

Without bulk methods, that's three separate loops. With them, it's three chained calls.

```javascript
// Without bulk methods — three loops
const inputs = Collections.ClassName['form-input'];
inputs.forEach(input => input.disabled = true);
inputs.forEach(input => input.classList.add('loading'));
inputs.forEach(input => input.style.opacity = '0.5');

// With bulk methods — one expression
const inputs = Collections.ClassName['form-input'];
inputs.setProperty('disabled', true)
      .addClass('loading')
      .setStyle({ opacity: '0.5' });
```

**Benefits of bulk methods:**
✅ Less code — one operation per concern
✅ Chainable — all operations in sequence
✅ Readable — reads like what you intend
✅ Consistent — the same pattern works for any bulk change

---

## Complete Method Overview

| Method | What It Does | Returns |
|--------|-------------|---------|
| `addClass(className)` | Add a CSS class to all elements | Collection (chainable) |
| `removeClass(className)` | Remove a CSS class from all elements | Collection (chainable) |
| `toggleClass(className)` | Toggle a CSS class on all elements | Collection (chainable) |
| `setProperty(prop, value)` | Set a DOM property on all elements | Collection (chainable) |
| `setAttribute(attr, value)` | Set an HTML attribute on all elements | Collection (chainable) |
| `setStyle(stylesObject)` | Set CSS styles on all elements | Collection (chainable) |
| `on(event, handler, options)` | Add event listener to all elements | Collection (chainable) |
| `off(event, handler, options)` | Remove event listener from all elements | Collection (chainable) |

**Key design:** Every single method returns the collection — so you can always chain the next operation.

---

## Syntax Reference

```javascript
collection.addClass('className')
collection.removeClass('className')
collection.toggleClass('className')
collection.setProperty('propertyName', value)
collection.setAttribute('attributeName', 'value')
collection.setStyle({ property: 'value', anotherProp: 'value' })
collection.on('eventName', handlerFunction, optionalOptions)
collection.off('eventName', handlerFunction, optionalOptions)
```

---

## Mental Model

**Think of it as a Radio Tower Broadcasting to All Radios.**

Normally (without bulk methods), you'd walk to each radio one by one and turn the dial. With bulk methods, you broadcast from a tower — one signal, all radios respond.

```
Manual loop (door-to-door)       Bulk methods (broadcast)
──────────────────────────       ────────────────────────
Walk to radio 1 → set volume     One broadcast →
Walk to radio 2 → set volume       All radios change ✨
Walk to radio 3 → set volume
...
Walk to radio N → set volume
```

Each bulk method is a broadcast — one instruction, every element in the collection responds.

---

## Class Management Methods

### 1. addClass(className) — Add a Class to All Elements

Adds the specified CSS class to every element in the collection.

#### Syntax

```javascript
collection.addClass('className')
```

**Parameters:**
- `className` (string) — The class name to add (no dot prefix)

**Returns:** The collection (for chaining)

---

#### Basic Usage

```javascript
const cards = Collections.ClassName.card;

// Add a single class to all cards
cards.addClass('active');
// Every card now has class="card active"

// Add multiple classes by chaining
cards.addClass('active')
     .addClass('visible')
     .addClass('initialized');
```

---

#### How It Works Internally

```
collection.addClass('active')
    ↓
For each element in collection:
    element.classList.add('active')
    ↓
Returns the collection (for chaining)
```

---

#### Examples

**Example 1: Show Loading State**

```javascript
function showLoadingState() {
  Collections.ClassName.card
    .addClass('loading')
    .addClass('skeleton');
  // Every card now shows a loading skeleton
  console.log('Loading state applied to all cards');
}

function hideLoadingState() {
  Collections.ClassName.card
    .removeClass('loading')
    .removeClass('skeleton');
  // Every card is back to normal
  console.log('Loading state removed from all cards');
}
```

---

**Example 2: Mark All Items as Initialized**

```javascript
// After setting up event listeners and data, mark everything as ready
function finishSetup() {
  Collections.ClassName.item
    .addClass('initialized')
    .addClass('ready');

  console.log('All items are initialized and ready');
}
```

---

**Example 3: Highlight Search Results**

```javascript
function highlightResults(results) {
  // Remove previous highlights
  Collections.ClassName.item.removeClass('highlight');

  // Add highlight to matching items
  results.forEach(item => item.classList.add('highlight'));

  // Or if results is also a collection:
  // results.addClass('highlight');
}
```

---

### 2. removeClass(className) — Remove a Class from All Elements

Removes the specified CSS class from every element in the collection.

#### Syntax

```javascript
collection.removeClass('className')
```

---

#### Basic Usage

```javascript
const items = Collections.ClassName.item;

// Remove a single class from all items
items.removeClass('hidden');

// Chain multiple removals
items.removeClass('hidden')
     .removeClass('inactive')
     .addClass('visible');
```

---

#### Examples

**Example 1: Clear All Selected States**

```javascript
function clearSelection() {
  Collections.ClassName.item
    .removeClass('selected')
    .removeClass('highlighted')
    .setAttribute('aria-selected', 'false');

  console.log('Selection cleared from all items');
}

// Usage: call this before setting a new selection
clearSelection();
someItem.classList.add('selected');
```

---

**Example 2: Reset All Form Field Styles**

```javascript
function resetFormStyles() {
  Collections.TagName.input
    .removeClass('error')
    .removeClass('success')
    .removeClass('warning');

  console.log('Form field styles reset');
}

// Call this when resetting the form
resetFormStyles();
```

---

**Example 3: Close All Dropdowns**

```javascript
function closeAllDropdowns() {
  Collections.ClassName.dropdown
    .removeClass('open')
    .setAttribute('aria-expanded', 'false');

  Collections.ClassName['dropdown-menu']
    .addClass('hidden');

  console.log('All dropdowns closed');
}

// Close all dropdowns when user clicks elsewhere
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    closeAllDropdowns();
  }
});
```

---

### 3. toggleClass(className) — Toggle a Class on All Elements

If the element **has** the class, remove it. If it **doesn't have** the class, add it. Applies to every element in the collection.

#### Syntax

```javascript
collection.toggleClass('className')
```

---

#### Basic Usage

```javascript
const sections = Collections.ClassName.section;

// Toggle collapsed state on all sections
sections.toggleClass('collapsed');
// Each section: if it had 'collapsed' → now it doesn't
//              if it didn't have 'collapsed' → now it does
```

---

#### Examples

**Example 1: Expand / Collapse All**

```javascript
let allExpanded = false;

function toggleAllAccordions() {
  Collections.ClassName['accordion-item']
    .toggleClass('expanded');

  allExpanded = !allExpanded;
  Elements.toggleAllBtn.textContent = allExpanded ? 'Collapse All' : 'Expand All';
}
```

---

**Example 2: Toggle Dark Mode on All Cards**

```javascript
function toggleTheme() {
  Collections.ClassName.card.toggleClass('dark');
  Collections.TagName.button.toggleClass('dark');
  Collections.TagName.a.toggleClass('dark');
  document.body.classList.toggle('dark-mode');
}
```

---

**Example 3: Toggle Section Visibility**

```javascript
function toggleAllSections() {
  Collections.ClassName.collapsible
    .toggleClass('hidden');

  const anyHidden = Collections.ClassName.collapsible.some(s =>
    s.classList.contains('hidden')
  );

  Elements.showHideBtn.textContent = anyHidden ? 'Show All' : 'Hide All';
}
```

---

## Property and Attribute Methods

### 4. setProperty(property, value) — Set a DOM Property on All Elements

Sets a JavaScript **property** on every element in the collection. Properties are the live JavaScript values on DOM objects — `disabled`, `value`, `checked`, `textContent`, `innerHTML`, etc.

#### Syntax

```javascript
collection.setProperty('propertyName', value)
```

**Parameters:**
- `property` (string) — The JavaScript property name
- `value` (any) — The value to set

**Returns:** The collection (for chaining)

---

#### Properties vs Attributes — What's the Difference?

This is a common point of confusion. Let's break it down:

```
Properties                        Attributes
─────────────────────             ──────────────────────────────
JavaScript values on the object   HTML values in the markup
Live, can be any JS type          Strings in HTML
element.disabled = true           element.setAttribute('disabled', '')
element.value = 'hello'           element.setAttribute('value', 'hello')
element.checked = true            element.setAttribute('checked', '')

Use setProperty() for:            Use setAttribute() for:
  disabled, checked, value          data-*, aria-*, custom attributes
  textContent, innerHTML            role, target, rel
  className, id                     Any HTML attribute
```

In practice: `setProperty` for things like `disabled`, `value`, `checked`, `textContent`. Use `setAttribute` for HTML attributes like `data-*`, `aria-*`, `role`, `target`.

---

#### Basic Usage

```javascript
const inputs = Collections.TagName.input;

// Disable all inputs
inputs.setProperty('disabled', true);

// Clear all input values
inputs.setProperty('value', '');

// Set checked state on checkboxes
inputs.setProperty('checked', false);

// Update text content
Collections.ClassName.label
  .setProperty('textContent', 'Loading...');
```

---

#### Examples

**Example 1: Form State Management**

```javascript
function disableForm() {
  // Disable all interactive elements at once
  Collections.TagName.input.setProperty('disabled', true);
  Collections.TagName.button.setProperty('disabled', true);
  Collections.TagName.select.setProperty('disabled', true);
  Collections.TagName.textarea.setProperty('disabled', true);

  console.log('Form disabled');
}

function enableForm() {
  Collections.TagName.input.setProperty('disabled', false);
  Collections.TagName.button.setProperty('disabled', false);
  Collections.TagName.select.setProperty('disabled', false);
  Collections.TagName.textarea.setProperty('disabled', false);

  console.log('Form enabled');
}
```

---

**Example 2: Submit Button State**

```javascript
const submitBtns = Collections.ClassName['submit-btn'];

// When form is submitting
function onFormSubmit() {
  submitBtns
    .setProperty('textContent', 'Submitting...')
    .setProperty('disabled', true)
    .addClass('loading');
}

// When submission succeeds
function onSuccess() {
  submitBtns
    .setProperty('textContent', 'Saved!')
    .setProperty('disabled', false)
    .removeClass('loading')
    .addClass('success');

  // Reset after 2 seconds
  setTimeout(() => {
    submitBtns
      .setProperty('textContent', 'Submit')
      .removeClass('success');
  }, 2000);
}

// When submission fails
function onError() {
  submitBtns
    .setProperty('textContent', 'Try Again')
    .setProperty('disabled', false)
    .removeClass('loading')
    .addClass('error');
}
```

---

**Example 3: Clear All Checkboxes**

```javascript
const checkboxes = Collections.Name.features;

// Select all
function selectAll() {
  checkboxes.setProperty('checked', true);
}

// Deselect all
function deselectAll() {
  checkboxes.setProperty('checked', false);
}

// Get selected count
function getSelectedCount() {
  return checkboxes.filter(cb => cb.checked).length;
}

console.log('Selected:', getSelectedCount()); // 0, 2, etc.
```

---

### 5. setAttribute(attribute, value) — Set an HTML Attribute on All Elements

Sets an HTML **attribute** on every element in the collection. Attributes are things like `data-*`, `aria-*`, `role`, `target`, `rel`, `src`, `href`.

#### Syntax

```javascript
collection.setAttribute('attributeName', 'value')
```

**Parameters:**
- `attribute` (string) — The attribute name
- `value` (string) — The attribute value

**Returns:** The collection (for chaining)

---

#### Basic Usage

```javascript
const links = Collections.TagName.a;

// Set target on all links
links.setAttribute('target', '_blank');

// Set rel for security
links.setAttribute('rel', 'noopener noreferrer');

// Chain multiple attributes
links.setAttribute('target', '_blank')
     .setAttribute('rel', 'noopener noreferrer');
```

---

#### Examples

**Example 1: Accessibility Setup**

```javascript
const buttons = Collections.ClassName.btn;

// Set accessibility attributes on all buttons
buttons.setAttribute('role', 'button')
       .setAttribute('tabindex', '0')
       .setAttribute('aria-pressed', 'false');

// When a button is activated
buttons.on('click', function() {
  const isPressed = this.getAttribute('aria-pressed') === 'true';
  this.setAttribute('aria-pressed', String(!isPressed));
});
```

---

**Example 2: Lazy Loading Images**

```javascript
const images = Collections.TagName.img;

// Configure all images for performance
images.setAttribute('loading', 'lazy')
      .setAttribute('decoding', 'async');

console.log(`Configured lazy loading for ${images.length} images`);
```

---

**Example 3: Set Data Attributes**

```javascript
const items = Collections.ClassName.item;

// Mark all items as initialized
items.setAttribute('data-initialized', 'true');
items.setAttribute('data-version', '2.0');

// Also give each one an individual index
items.forEach((item, index) => {
  item.setAttribute('data-index', String(index));
  item.setAttribute('data-position', String(index + 1));
});
```

---

**Example 4: Form Validation Attributes**

```javascript
const inputs = Collections.ClassName['required-input'];

// Mark all required inputs
inputs.setAttribute('required', '')
      .setAttribute('aria-required', 'true');

// After validation fails
function markAllInvalid() {
  inputs.setAttribute('aria-invalid', 'true');
  inputs.addClass('error');
}

// After form is reset
function clearValidationState() {
  inputs.setAttribute('aria-invalid', 'false');
  inputs.removeClass('error');
}
```

---

### 6. setStyle(stylesObject) — Set CSS Styles on All Elements

Applies CSS styles to every element in the collection using an object.

#### Syntax

```javascript
collection.setStyle({
  propertyName: 'value',
  anotherProperty: 'value'
})
```

**Parameters:**
- `styles` (object) — CSS property/value pairs. Use camelCase for multi-word properties: `backgroundColor`, `borderRadius`, `boxShadow`

**Returns:** The collection (for chaining)

---

#### Basic Usage

```javascript
const cards = Collections.ClassName.card;

// Single style
cards.setStyle({ backgroundColor: '#f0f0f0' });

// Multiple styles
cards.setStyle({
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease'
});
```

---

#### camelCase vs kebab-case

```javascript
// ✅ Use camelCase (JavaScript style)
cards.setStyle({ backgroundColor: 'red', borderRadius: '8px' });

// ❌ Don't use kebab-case (CSS style) — won't work in JavaScript objects
// cards.setStyle({ 'background-color': 'red', 'border-radius': '8px' });
```

---

#### Examples

**Example 1: Theme Switching**

```javascript
function applyDarkTheme() {
  Collections.ClassName.card.setStyle({
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    borderColor: '#374151'
  });

  Collections.TagName.a.setStyle({
    color: '#60a5fa'
  });

  Collections.TagName.button.setStyle({
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#2563eb'
  });

  console.log('Dark theme applied');
}

function applyLightTheme() {
  Collections.ClassName.card.setStyle({
    backgroundColor: '#ffffff',
    color: '#1f2937',
    borderColor: '#e5e7eb'
  });

  Collections.TagName.a.setStyle({
    color: '#2563eb'
  });

  Collections.TagName.button.setStyle({
    backgroundColor: '#2563eb',
    color: 'white',
    borderColor: '#1d4ed8'
  });

  console.log('Light theme applied');
}
```

---

**Example 2: Fade-In Animation**

```javascript
const items = Collections.ClassName.item;

// Start from invisible and shifted down
items.setStyle({
  opacity: '0',
  transform: 'translateY(20px)',
  transition: 'opacity 0.5s ease, transform 0.5s ease'
});

// Trigger the animation (small delay to ensure transition applies)
setTimeout(() => {
  items.setStyle({
    opacity: '1',
    transform: 'translateY(0)'
  });
}, 50);

console.log('Fade-in animation started');
```

---

**Example 3: Loading Overlay (Blur + Disable)**

```javascript
function showLoadingOverlay() {
  Collections.ClassName.content.setStyle({
    opacity: '0.5',
    pointerEvents: 'none',    // Prevent interaction
    filter: 'blur(2px)',
    transition: 'all 0.3s'
  });
  console.log('Loading overlay shown');
}

function hideLoadingOverlay() {
  Collections.ClassName.content.setStyle({
    opacity: '1',
    pointerEvents: 'auto',
    filter: 'none'
  });
  console.log('Loading overlay hidden');
}
```

---

## Event Handling Methods

### 7. on(event, handler, options) — Add Event Listener to All Elements

Adds the same event listener to every element in the collection. This is like calling `addEventListener` on each element individually, but in one line.

#### Syntax

```javascript
collection.on('eventName', handlerFunction)
collection.on('eventName', handlerFunction, { once: true, passive: true })
```

**Parameters:**
- `event` (string) — The event name: `'click'`, `'input'`, `'change'`, `'mouseenter'`, etc.
- `handler` (function) — The function to call when the event fires
- `options` (object, optional) — Same options as `addEventListener`: `{ once, passive, capture }`

**Returns:** The collection (for chaining)

**Inside the handler:** `this` refers to the element that fired the event (when using regular `function`, not arrow function).

---

#### Basic Usage

```javascript
const buttons = Collections.ClassName.btn;

// Add click handler to all buttons
buttons.on('click', function() {
  console.log('Button clicked:', this.textContent);
  // `this` is the specific button that was clicked
});

// Arrow function (no `this` binding — use event.target instead)
buttons.on('click', (event) => {
  console.log('Button clicked:', event.target.textContent);
});

// With options
buttons.on('click', handleClick, { once: true }); // Fires only once per element
```

---

#### `this` vs Arrow Functions

```javascript
// Regular function — `this` is the element that was clicked
buttons.on('click', function() {
  this.classList.add('clicked'); // 'this' = the clicked button ✅
});

// Arrow function — `this` is NOT the element (inherits from outer scope)
buttons.on('click', () => {
  this.classList.add('clicked'); // 'this' is NOT the button ❌
  event.target.classList.add('clicked'); // Use event.target instead ✅
});
```

**Simple rule:** Use regular `function` when you need `this` to refer to the element. Use arrow functions when you need to reference variables from the outer scope.

---

#### Examples

**Example 1: Form Validation on Blur**

```javascript
const inputs = Collections.ClassName.required;

// Validate each field when user leaves it
inputs.on('blur', function() {
  if (!this.value.trim()) {
    this.classList.add('error');
    this.setAttribute('aria-invalid', 'true');

    // Show error message (if there's a sibling error element)
    const errorMsg = this.nextElementSibling;
    if (errorMsg?.classList.contains('error-msg')) {
      errorMsg.textContent = 'This field is required';
      errorMsg.style.display = 'block';
    }
  }
});

// Clear error when user starts typing
inputs.on('input', function() {
  if (this.value.trim()) {
    this.classList.remove('error');
    this.setAttribute('aria-invalid', 'false');

    const errorMsg = this.nextElementSibling;
    if (errorMsg?.classList.contains('error-msg')) {
      errorMsg.style.display = 'none';
    }
  }
});
```

---

**Example 2: Interactive Cards**

```javascript
const cards = Collections.ClassName.card;

// Lift card on hover
cards.on('mouseenter', function() {
  this.style.transform = 'translateY(-6px)';
  this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
});

cards.on('mouseleave', function() {
  this.style.transform = 'translateY(0)';
  this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
});

// Select card on click
cards.on('click', function() {
  // Deselect all cards
  cards.removeClass('selected');
  cards.setAttribute('aria-selected', 'false');

  // Select the clicked one
  this.classList.add('selected');
  this.setAttribute('aria-selected', 'true');

  console.log('Selected card ID:', this.dataset.id);
});
```

---

**Example 3: Delegated-Style Event**

```javascript
// Give each item selection toggle behavior
const items = Collections.ClassName.item;

items.on('click', function(e) {
  // Toggle selection
  const wasSelected = this.classList.contains('selected');
  this.classList.toggle('selected');

  // Notify other parts of the app
  const event = new CustomEvent('itemSelectionChanged', {
    bubbles: true,
    detail: {
      id: this.dataset.id,
      selected: !wasSelected
    }
  });
  this.dispatchEvent(event);
});

// Listen for changes at the document level
document.addEventListener('itemSelectionChanged', (e) => {
  console.log(`Item ${e.detail.id}: ${e.detail.selected ? 'selected' : 'deselected'}`);
});
```

---

### 8. off(event, handler, options) — Remove Event Listener from All Elements

Removes an event listener from every element in the collection. You must pass the **same function reference** that was used with `on()`.

#### Syntax

```javascript
collection.off('eventName', handlerFunction)
collection.off('eventName', handlerFunction, options)
```

**Important:** The `handler` must be the exact same function reference as what you passed to `on()`. Anonymous functions or arrow functions created inline cannot be removed.

---

#### Basic Usage

```javascript
const buttons = Collections.ClassName.btn;

// Define the handler as a named function (so you can reference it later)
function handleClick(e) {
  console.log('Clicked:', e.target.textContent);
}

// Add listener
buttons.on('click', handleClick);

// Remove listener (must use the same reference)
buttons.off('click', handleClick);
```

---

#### Why You Can't Remove Anonymous Functions

```javascript
// ❌ This handler can never be removed — no reference to it!
buttons.on('click', () => {
  console.log('Clicked');
});
// buttons.off('click', ???); // No way to reference this function

// ✅ Store the reference — can be removed later
const clickHandler = () => {
  console.log('Clicked');
};
buttons.on('click', clickHandler);
buttons.off('click', clickHandler); // Works! Same reference.
```

---

#### Examples

**Example 1: Cleanup on Component Destroy**

```javascript
class InteractiveList {
  constructor(itemClass) {
    this.items = Collections.ClassName[itemClass];

    // Store handler references so we can remove them later
    this.clickHandler = this.handleClick.bind(this);
    this.hoverHandler = this.handleHover.bind(this);

    // Add listeners
    this.items.on('click', this.clickHandler);
    this.items.on('mouseenter', this.hoverHandler);

    console.log('InteractiveList initialized');
  }

  handleClick(e) {
    console.log('Item clicked:', e.target.textContent);
  }

  handleHover(e) {
    e.target.classList.add('hovered');
  }

  destroy() {
    // Clean up — remove all listeners to prevent memory leaks
    this.items.off('click', this.clickHandler);
    this.items.off('mouseenter', this.hoverHandler);

    console.log('InteractiveList destroyed — listeners removed');
  }
}

// Usage
const list = new InteractiveList('item');
// ... user interaction ...
list.destroy(); // Clean up when done
```

---

**Example 2: Temporarily Disable Listeners**

```javascript
const cards = Collections.ClassName.card;

function hoverIn() {
  this.classList.add('hover');
}

// Enable hover effects
function enableHoverEffects() {
  cards.on('mouseenter', hoverIn);
  console.log('Hover effects enabled');
}

// Disable hover effects (e.g., during drag-and-drop)
function disableHoverEffects() {
  cards.off('mouseenter', hoverIn);
  console.log('Hover effects disabled');
}

// Usage
enableHoverEffects();
document.addEventListener('dragstart', disableHoverEffects);
document.addEventListener('dragend', enableHoverEffects);
```

---

## Method Chaining — The Full Power

All 8 methods return the collection, which means you can chain any combination:

```javascript
const buttons = Collections.ClassName.btn;

// Full setup in one expression
buttons
  .addClass('initialized')
  .setProperty('disabled', false)
  .setStyle({
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  })
  .setAttribute('role', 'button')
  .setAttribute('tabindex', '0')
  .on('click', handleClick)
  .on('mouseenter', function() {
    this.style.backgroundColor = '#1d4ed8';
  })
  .on('mouseleave', function() {
    this.style.backgroundColor = '#2563eb';
  });

console.log('All buttons fully set up!');
```

**How chaining works:**

```
buttons.addClass('initialized')
    ↓ returns buttons
.setProperty('disabled', false)
    ↓ returns buttons
.setStyle({...})
    ↓ returns buttons
.on('click', handleClick)
    ↓ returns buttons
// And so on...
```

Each method performs its operation and returns the same collection, allowing the next method call to act on the same elements.

---

## Real-World Patterns

### Pattern 1: Form Loading/Submitting State

```javascript
class FormController {
  constructor(formSelector) {
    this.inputs = Collections.ClassName[`${formSelector}-input`];
    this.buttons = Collections.ClassName[`${formSelector}-button`];
  }

  setSubmitting() {
    this.inputs
      .setProperty('disabled', true)
      .addClass('loading');

    this.buttons
      .setProperty('disabled', true)
      .setProperty('textContent', 'Saving...')
      .addClass('loading');

    console.log('Form: submitting state');
  }

  setSuccess() {
    this.inputs
      .removeClass('loading')
      .setProperty('disabled', false);

    this.buttons
      .setProperty('disabled', false)
      .setProperty('textContent', 'Saved!')
      .removeClass('loading')
      .addClass('success');

    setTimeout(() => {
      this.buttons
        .setProperty('textContent', 'Save')
        .removeClass('success');
    }, 2000);

    console.log('Form: success state');
  }

  setError(message) {
    this.inputs
      .removeClass('loading')
      .setProperty('disabled', false)
      .addClass('error');

    this.buttons
      .setProperty('disabled', false)
      .setProperty('textContent', 'Retry')
      .removeClass('loading')
      .addClass('error');

    console.error('Form error:', message);
  }

  reset() {
    this.inputs
      .setProperty('value', '')
      .setProperty('disabled', false)
      .removeClass('loading', 'error', 'success');

    this.buttons
      .setProperty('disabled', false)
      .setProperty('textContent', 'Save')
      .removeClass('loading', 'error', 'success');

    console.log('Form: reset');
  }
}
```

### Pattern 2: Theme Manager

```javascript
class ThemeManager {
  constructor() {
    this.themes = {
      dark: {
        cards:   { backgroundColor: '#1e293b', color: '#f1f5f9', borderColor: '#334155' },
        buttons: { backgroundColor: '#3b82f6', color: '#ffffff' },
        inputs:  { backgroundColor: '#0f172a', color: '#e2e8f0', borderColor: '#475569' },
        links:   { color: '#60a5fa' }
      },
      light: {
        cards:   { backgroundColor: '#ffffff', color: '#1e293b', borderColor: '#e2e8f0' },
        buttons: { backgroundColor: '#2563eb', color: '#ffffff' },
        inputs:  { backgroundColor: '#ffffff', color: '#1e293b', borderColor: '#cbd5e1' },
        links:   { color: '#2563eb' }
      }
    };
  }

  apply(themeName) {
    const theme = this.themes[themeName];
    if (!theme) {
      console.error('Unknown theme:', themeName);
      return;
    }

    Collections.ClassName.card.setStyle(theme.cards);
    Collections.ClassName.btn.setStyle(theme.buttons);
    Collections.TagName.input.setStyle(theme.inputs);
    Collections.TagName.a.setStyle(theme.links);

    document.body.className = `theme-${themeName}`;
    localStorage.setItem('theme', themeName);

    console.log(`Theme applied: ${themeName}`);
  }
}

const themer = new ThemeManager();
themer.apply('dark');
```

### Pattern 3: Event Manager with Cleanup

```javascript
class EventManager {
  constructor() {
    this.registrations = new Map(); // collection → [{ event, handler }]
  }

  add(collection, event, handler) {
    collection.on(event, handler);

    if (!this.registrations.has(collection)) {
      this.registrations.set(collection, []);
    }
    this.registrations.get(collection).push({ event, handler });
  }

  removeAll() {
    this.registrations.forEach((events, collection) => {
      events.forEach(({ event, handler }) => {
        collection.off(event, handler);
      });
    });
    this.registrations.clear();
    console.log('All event listeners removed');
  }
}

// Usage
const manager = new EventManager();

manager.add(Collections.ClassName.btn, 'click', handleClick);
manager.add(Collections.ClassName.card, 'mouseenter', handleHover);
manager.add(Collections.TagName.input, 'input', handleInput);

// When page is being destroyed or navigated away
window.addEventListener('beforeunload', () => {
  manager.removeAll();
});
```

---

## Best Practices

### ✅ Chain Related Operations

```javascript
// Good — all setup for cards in one expression
Collections.ClassName.card
  .addClass('initialized')
  .setStyle({ cursor: 'pointer', transition: 'transform 0.2s' })
  .setAttribute('tabindex', '0')
  .on('click', handleCardClick);
```

### ✅ Store Handler References for Cleanup

```javascript
// Good — handler stored so it can be removed later
const clickHandler = (e) => handleClick(e);
buttons.on('click', clickHandler);

// When cleaning up:
buttons.off('click', clickHandler); // Works!
```

### ✅ Use `this` in Regular Functions, `event.target` in Arrow Functions

```javascript
// Regular function — 'this' is the element
buttons.on('click', function() {
  this.classList.add('clicked'); // ✅
});

// Arrow function — use event.target
buttons.on('click', (e) => {
  e.target.classList.add('clicked'); // ✅
});
```

### ❌ Don't Use Anonymous Functions When You Need to Remove Them

```javascript
// ❌ Can't remove this
buttons.on('click', () => console.log('clicked'));

// ✅ Store the reference
const handler = () => console.log('clicked');
buttons.on('click', handler);
// Later:
buttons.off('click', handler);
```

### ❌ Don't Chain Unrelated Operations

```javascript
// ❌ Mixed concerns — hard to follow
items.addClass('active')
     .setProperty('value', 'test')  // Why is this here?
     .on('click', handler);

// ✅ Separate logical groups
const items = Collections.ClassName.item;
items.addClass('active');                    // Visual state
items.on('click', handler);                  // Behavior
// separately:
Collections.TagName.input.setProperty('value', 'test');  // Form data
```

---

## Key Takeaways

1. **No manual loops** — built-in methods apply changes to all elements at once
2. **All methods return the collection** — you can always chain the next operation
3. **addClass/removeClass/toggleClass** — CSS class management in bulk
4. **setProperty** — for JavaScript properties (`disabled`, `value`, `checked`, `textContent`)
5. **setAttribute** — for HTML attributes (`data-*`, `aria-*`, `role`, `target`)
6. **setStyle** — CSS styles using camelCase property names in an object
7. **on/off** — event listener management; store handler references for cleanup
8. **Chaining** — all operations together in one readable expression

---

## What's Next?

Explore the filtering methods that help you work with subsets of your collections:

- **visible()** — Only elements that are currently visible
- **hidden()** — Only elements that are hidden
- **enabled()** — Only form elements that are enabled
- **disabled()** — Only form elements that are disabled

Continue to **Filtering Methods** →