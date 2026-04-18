[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Numbered Instances — Method 4

## Quick Start (30 seconds)

```javascript
// Create three boxes — same tag, different identifiers
const boxes = createElement.bulk({
  DIV_1: { textContent: 'Box One',   classList: { add: ['box'] } },
  DIV_2: { textContent: 'Box Two',   classList: { add: ['box'] } },
  DIV_3: { textContent: 'Box Three', classList: { add: ['box'] } }
});

// Style each one differently
boxes.DIV_1.update({ style: { background: '#ff6b6b' } });
boxes.DIV_2.update({ style: { background: '#4ecdc4' } });
boxes.DIV_3.update({ style: { background: '#45b7d1' } });

// Append all
boxes.appendTo(Elements.container);
```

---

## What is Method 4?

Method 4 is the technique of creating **multiple elements of the same tag type** within a single `createElement.bulk()` call, by using numbered suffixes in your keys.

Without numbered suffixes, you cannot have two elements with the same key name in a JavaScript object:

```javascript
// This does NOT work — JavaScript objects cannot have duplicate keys
createElement.bulk({
  DIV: { textContent: 'First' },
  DIV: { textContent: 'Second' }  // Overwrites the first!
});
```

Numbered instances solve this:

```javascript
// This DOES work — each key is unique
createElement.bulk({
  DIV_1: { textContent: 'First' },
  DIV_2: { textContent: 'Second' }
});
// Both create <div> elements, both are accessible separately
```

---

## Syntax

```javascript
// Number suffix
const result = createElement.bulk({
  TAGNAME_1: { /* config */ },
  TAGNAME_2: { /* config */ },
  TAGNAME_3: { /* config */ }
});

// Named suffix (any string after underscore)
const result = createElement.bulk({
  BUTTON_save:   { /* config */ },
  BUTTON_cancel: { /* config */ },
  BUTTON_delete: { /* config */ }
});

// Access each element by its full key
result.TAGNAME_1
result.BUTTON_save
```

The suffix can be **any string** — a number, a word, or a combination. The only requirement is that each key in the object is unique.

---

## How Tag Names are Parsed

This is the same rule as always, but it is especially important to understand with numbered instances:

```
Key            →  Tag Created  →  Suffix (identifier only)
──────────────────────────────────────────────────────────
DIV_1          →  <div>        →  1
DIV_2          →  <div>        →  2
P_intro        →  <p>          →  intro
P_body         →  <p>          →  body
SPAN_label     →  <span>       →  label
SPAN_value     →  <span>       →  value
BUTTON_save    →  <button>     →  save
BUTTON_cancel  →  <button>     →  cancel
LI_1           →  <li>         →  1
LI_2           →  <li>         →  2
LI_3           →  <li>         →  3
```

Everything before the first `_` is the tag name. Everything after is just an identifier that becomes part of the key name on the result object.

---

## Why Does This Exist?

### Creating Multiple Elements of the Same Type

The most common scenario is creating several divs, paragraphs, list items, or buttons that have the same HTML tag but different content or styling.

In plain JavaScript:

```javascript
// Creating 4 tab buttons — repetitive
const tab1 = document.createElement('button');
tab1.textContent = 'Overview';
tab1.className = 'tab';
tab1.dataset.panel = 'overview';

const tab2 = document.createElement('button');
tab2.textContent = 'Details';
tab2.className = 'tab';
tab2.dataset.panel = 'details';

const tab3 = document.createElement('button');
tab3.textContent = 'Reviews';
tab3.className = 'tab';
tab3.dataset.panel = 'reviews';

const tab4 = document.createElement('button');
tab4.textContent = 'FAQ';
tab4.className = 'tab';
tab4.dataset.panel = 'faq';
```

With numbered instances:

```javascript
const tabs = createElement.bulk({
  BUTTON_1: { textContent: 'Overview', classList: { add: ['tab'] }, dataset: { panel: 'overview' } },
  BUTTON_2: { textContent: 'Details',  classList: { add: ['tab'] }, dataset: { panel: 'details' } },
  BUTTON_3: { textContent: 'Reviews',  classList: { add: ['tab'] }, dataset: { panel: 'reviews' } },
  BUTTON_4: { textContent: 'FAQ',      classList: { add: ['tab'] }, dataset: { panel: 'faq' } }
});
```

Same information. The second version groups all related elements together, makes the structure scannable, and keeps everything accessible by name.

### Why Named Suffixes are Often Better Than Numbers

Numbers are fine, but **descriptive names** are often more readable:

```javascript
// Numbers — works, but requires remembering which number is which
const result = createElement.bulk({
  BUTTON_1: { textContent: 'Save' },
  BUTTON_2: { textContent: 'Cancel' },
  BUTTON_3: { textContent: 'Delete' }
});
result.BUTTON_1  // What was this? I have to scroll up to check.

// Descriptive names — immediately clear
const result = createElement.bulk({
  BUTTON_save:   { textContent: 'Save' },
  BUTTON_cancel: { textContent: 'Cancel' },
  BUTTON_delete: { textContent: 'Delete' }
});
result.BUTTON_save  // Crystal clear.
```

Use numbers when the elements are truly interchangeable (like list items), and use descriptive names when each element has a specific role.

---

## Mental Model: A Numbered Factory

Think of numbered instances like a stamp press that produces multiple parts of the same shape.

You define the stamp (the tag name), and each press of the stamp produces a uniquely numbered part (the suffix). All parts are the same type, but each one is individually tracked and accessible.

```
Stamp: DIV
  Press 1 → DIV_1  → <div>First content</div>
  Press 2 → DIV_2  → <div>Second content</div>
  Press 3 → DIV_3  → <div>Third content</div>

All stored in one result object — each accessible by number.
```

---

## Basic Usage

### Creating Multiple Cards

```javascript
const cards = createElement.bulk({
  DIV_1: {
    className: 'card',
    innerHTML: '<h3>Feature One</h3><p>Fast and reliable</p>',
    style: { padding: '20px', background: 'white', borderRadius: '8px' }
  },
  DIV_2: {
    className: 'card',
    innerHTML: '<h3>Feature Two</h3><p>Simple to use</p>',
    style: { padding: '20px', background: 'white', borderRadius: '8px' }
  },
  DIV_3: {
    className: 'card',
    innerHTML: '<h3>Feature Three</h3><p>Fully featured</p>',
    style: { padding: '20px', background: 'white', borderRadius: '8px' }
  }
});

// Access individually
cards.DIV_1.style.borderTop = '3px solid #007bff';
cards.DIV_2.style.borderTop = '3px solid #28a745';
cards.DIV_3.style.borderTop = '3px solid #ffc107';

// Append all
cards.appendTo(Elements.featuresSection);
```

---

### Navigation Tabs

```javascript
const tabs = createElement.bulk({
  BUTTON_overview: {
    textContent: 'Overview',
    classList: { add: ['tab', 'tab--active'] },
    dataset: { panel: 'overview' },
    addEventListener: ['click', switchTab]
  },
  BUTTON_specs: {
    textContent: 'Specifications',
    classList: { add: ['tab'] },
    dataset: { panel: 'specs' },
    addEventListener: ['click', switchTab]
  },
  BUTTON_reviews: {
    textContent: 'Reviews',
    classList: { add: ['tab'] },
    dataset: { panel: 'reviews' },
    addEventListener: ['click', switchTab]
  },
  BUTTON_faq: {
    textContent: 'FAQ',
    classList: { add: ['tab'] },
    dataset: { panel: 'faq' },
    addEventListener: ['click', switchTab]
  }
});

function switchTab(e) {
  // Remove active from all tabs
  tabs.forEach((element) => {
    element.classList.remove('tab--active');
  });
  // Set active on clicked tab
  e.target.classList.add('tab--active');
  // Show the relevant panel
  showPanel(e.target.dataset.panel);
}

tabs.appendTo(Elements.tabBar);
```

---

### Color Swatches

```javascript
const swatches = createElement.bulk({
  SWATCH_red:   {
    classList: { add: ['swatch'] },
    dataset: { color: '#ff6b6b' },
    style: { background: '#ff6b6b', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' },
    addEventListener: ['click', selectColor]
  },
  SWATCH_teal:  {
    classList: { add: ['swatch'] },
    dataset: { color: '#4ecdc4' },
    style: { background: '#4ecdc4', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' },
    addEventListener: ['click', selectColor]
  },
  SWATCH_blue:  {
    classList: { add: ['swatch'] },
    dataset: { color: '#45b7d1' },
    style: { background: '#45b7d1', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' },
    addEventListener: ['click', selectColor]
  },
  SWATCH_green: {
    classList: { add: ['swatch'] },
    dataset: { color: '#96ceb4' },
    style: { background: '#96ceb4', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' },
    addEventListener: ['click', selectColor]
  }
});

function selectColor(e) {
  Elements.colorPreview.update({
    style: { background: e.target.dataset.color }
  });
}

swatches.appendTo(Elements.colorPicker);
```

---

### Dynamic List Items

When the number of items is known in advance, numbered instances are clean and readable:

```javascript
const menuItems = ['Dashboard', 'Analytics', 'Reports', 'Settings', 'Help'];

const menu = createElement.bulk(
  menuItems.reduce((config, label, index) => {
    config[`LI_${index + 1}`] = {
      textContent: label,
      classList: { add: ['menu-item'] },
      addEventListener: ['click', () => navigateTo(label.toLowerCase())]
    };
    return config;
  }, {})
);

// Append all list items to the UL
menu.forEach((element) => {
  Elements.mainMenu.appendChild(element);
});
```

---

## Iterating Over Numbered Instances

The result object's `forEach()` method iterates over all created elements. This works perfectly with numbered instances:

```javascript
const indicators = createElement.bulk({
  SPAN_1: { className: 'dot' },
  SPAN_2: { className: 'dot' },
  SPAN_3: { className: 'dot' },
  SPAN_4: { className: 'dot' },
  SPAN_5: { className: 'dot' }
});

// Iterate over all elements
indicators.forEach((element, key, index) => {
  element.dataset.slide = String(index);
  element.addEventListener('click', () => goToSlide(index));
});

indicators.appendTo(Elements.carousel);
```

---

## Filtering Numbered Instances

The `filter()` method works with the same callback pattern as `Array.prototype.filter`:

```javascript
const items = createElement.bulk({
  DIV_1: { textContent: 'Item 1', dataset: { active: 'true' } },
  DIV_2: { textContent: 'Item 2', dataset: { active: 'false' } },
  DIV_3: { textContent: 'Item 3', dataset: { active: 'true' } },
  DIV_4: { textContent: 'Item 4', dataset: { active: 'false' } }
});

// Get only active items
const activeItems = items.filter(
  (element) => element.dataset.active === 'true'
);

console.log(activeItems.length); // 2
```

---

## Updating Multiple Numbered Instances

Use `updateMultiple()` to update several elements at once:

```javascript
const steps = createElement.bulk({
  STEP_1: { textContent: 'Step 1', className: 'step' },
  STEP_2: { textContent: 'Step 2', className: 'step' },
  STEP_3: { textContent: 'Step 3', className: 'step' }
});

steps.appendTo(Elements.wizard);

// Mark steps 1 and 2 as complete
steps.updateMultiple({
  STEP_1: { classList: { add: ['step--complete'] } },
  STEP_2: { classList: { add: ['step--complete'] } },
  STEP_3: { classList: { add: ['step--active'] } }
});
```

---

## Common Pitfall: Plain Numbers in Keys Without Underscore

```javascript
// ❌ Wrong — key starts with a digit, which is invalid as a JavaScript identifier
const result = createElement.bulk({
  1_DIV: { textContent: 'Bad' }  // Syntax error!
});

// ✅ Correct — underscore separates the tag from the number suffix
const result = createElement.bulk({
  DIV_1: { textContent: 'Good' }  // Works perfectly
});
```

Always put the tag name first, then the underscore, then the identifier.

---

## Common Pitfall: Duplicate Suffixes

```javascript
// ❌ Wrong — duplicate keys! The second overwrites the first
const result = createElement.bulk({
  DIV_1: { textContent: 'First' },
  DIV_1: { textContent: 'Second' }  // Overwrites DIV_1!
});

// ✅ Correct — unique keys
const result = createElement.bulk({
  DIV_1: { textContent: 'First' },
  DIV_2: { textContent: 'Second' }
});
```

JavaScript object keys must be unique. If you use the same key twice, only the last definition is kept.

---

## Naming Convention Summary

```
For numbered groups (interchangeable items):
  LI_1, LI_2, LI_3    ← clear, ordinal
  SLIDE_1, SLIDE_2     ← clear, ordinal

For named roles (distinct purposes):
  BUTTON_save, BUTTON_cancel    ← purpose-driven
  SPAN_label, SPAN_value        ← role-driven
  DIV_header, DIV_footer        ← position-driven

For mixed (type + role):
  INPUT_email, INPUT_phone      ← type + role
  BUTTON_primary, BUTTON_ghost  ← type + style variant
```

---

## Summary

Method 4 — Numbered Instances — is the solution to creating multiple elements of the same HTML tag type in a single `createElement.bulk()` call.

**Key points:**
- ✅ Append `_suffix` to any tag name to create unique keys for same-type elements
- ✅ The suffix can be a number (`DIV_1`) or any descriptive string (`BUTTON_save`)
- ✅ The tag is always the part before the first `_`
- ✅ All numbered instances are accessible by their full key name on the result object
- ✅ `forEach()`, `filter()`, and `updateMultiple()` all work naturally with numbered instances

---

## What's Next?

- **[08 — Factory Functions](./08_factory-functions.md)** — Reusable element creation with function-based factories
- **[09 — Component Pattern](./09_component-pattern.md)** — Full component encapsulation with the bulk system