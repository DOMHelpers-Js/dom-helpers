[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Basic Access Methods — ClassName, TagName, and Name

## Quick Start (30 Seconds)

```javascript
// Access a group of elements — pick the method that fits your HTML:

// By CSS class → most common
const buttons = Collections.ClassName.btn;

// By HTML tag → target all elements of a type
const paragraphs = Collections.TagName.p;

// By name attribute → form element groups
const emailInputs = Collections.Name.email;

// Now use them like arrays
buttons.forEach(btn => console.log(btn.textContent));
// Output: Save, Cancel, Delete

// Or apply bulk changes to all at once
buttons.addClass('ready').setProperty('disabled', false);
```

Three ways in, all returning the same powerful collection object. Pick the one that matches your HTML.

---

## What Are the Three Access Methods?

The Collections Helper has three "doors" into the DOM, each finding elements a different way:

| Method | How It Finds Elements | Best For |
|--------|-----------------------|----------|
| `Collections.ClassName` | CSS class attribute | Styled groups: buttons, cards, list items |
| `Collections.TagName` | HTML tag type | Semantic targets: all `<p>`, all `<img>`, all `<input>` |
| `Collections.Name` | `name` attribute | Form groups: radio buttons, checkboxes, repeated inputs |

All three return the same thing: an **Enhanced Collection** — an array-like object with every array method plus built-in DOM methods.

---

## Syntax

```javascript
// === ClassName ===

// Property access (recommended — simple names)
const collection = Collections.ClassName.className;

// Bracket notation (required for hyphenated names)
const collection = Collections.ClassName['class-name'];

// Method call (works for any name)
const collection = Collections.ClassName('className');
const collection = Collections.ClassName('class-name');


// === TagName ===

// Property access (lowercase tag name)
const collection = Collections.TagName.tagname;

// Method call
const collection = Collections.TagName('tagname');


// === Name ===

// Property access
const collection = Collections.Name.attributeName;

// Bracket notation (for hyphenated names)
const collection = Collections.Name['attribute-name'];

// Method call
const collection = Collections.Name('attributeName');
```

---

## Why Do These Three Methods Exist?

### `Collections.ClassName` — When Styling Groups Is Your Priority

In modern HTML, elements are often grouped by their CSS class. A row of cards, a group of action buttons, a set of form fields — they all share a class. `ClassName` is designed exactly for this situation.

```javascript
// HTML:
// <button class="btn">Save</button>
// <button class="btn">Cancel</button>
// <button class="btn">Delete</button>

const buttons = Collections.ClassName.btn;

// Update them all instantly
buttons.addClass('active')
       .setStyle({ backgroundColor: '#2563eb' });
```

This method is **great when you need**:
✅ The most common collection type in UI development
✅ Accessing elements by their visual or semantic role
✅ Groups where elements share a purpose (all "card" elements, all "btn" elements)
✅ Both simple names (`btn`) and hyphenated names (`user-card`)

---

### `Collections.TagName` — When Tag Type Is Your Priority

Sometimes you want all elements of a specific HTML type regardless of their class. All images, all links, all inputs, all paragraphs. `TagName` is the direct way to do that.

```javascript
// HTML: any combination of <a> tags on the page

const links = Collections.TagName.a;

// Make all external links open in new tab
links.setAttribute('target', '_blank')
     .setAttribute('rel', 'noopener noreferrer');
```

This method is **especially useful when**:
✅ Targeting all elements of a type regardless of their class
✅ Applying accessibility attributes across all instances of a tag
✅ Semantic operations — "all images", "all inputs", "all links"
✅ When elements don't have or need a distinguishing class

---

### `Collections.Name` — When Form Grouping Is Your Priority

In forms, related inputs share a `name` attribute — especially radio buttons and checkboxes. `Collections.Name` finds them all together, making group operations trivial.

```javascript
// HTML:
// <input type="radio" name="color" value="red">
// <input type="radio" name="color" value="blue">
// <input type="radio" name="color" value="green">

const colorOptions = Collections.Name.color;

// Find which one is selected
const selected = colorOptions.find(r => r.checked);
console.log('Chosen:', selected?.value); // 'blue' (or whichever)
```

This method is **especially useful when**:
✅ Working with radio button groups
✅ Working with checkbox groups
✅ Multiple inputs sharing the same `name` in a form
✅ Querying which value is currently selected

**The Choice Is Yours:**
- Use `ClassName` when elements share a CSS class
- Use `TagName` when you want all elements of a specific HTML type
- Use `Name` when you're working with named form element groups
- All three are valid and can be combined freely in the same page

---

## 1. Collections.ClassName — Deep Dive

### Basic Usage

```html
<button class="btn">Save</button>
<button class="btn">Cancel</button>
<button class="btn">Delete</button>
```

```javascript
// Get all elements with class="btn"
const buttons = Collections.ClassName.btn;

// How many?
console.log(buttons.length); // 3

// Read their text content
buttons.forEach((btn, index) => {
  console.log(`Button ${index + 1}: ${btn.textContent}`);
});
// Output:
// Button 1: Save
// Button 2: Cancel
// Button 3: Delete
```

**What's happening:**
- `Collections.ClassName.btn` tells the library "find all elements with `class="btn"` in the current DOM"
- The result is an Enhanced Collection with 3 elements
- `forEach` works just like on a regular array — `index` is the position, `btn` is the actual DOM element

---

### Handling Multi-Word (Hyphenated) Class Names

CSS classes often use hyphens: `user-card`, `nav-link`, `submit-btn`. You can't use dot notation for these — use bracket notation or the method call.

```html
<div class="user-card">Alice</div>
<div class="user-card">Bob</div>
<div class="user-card">Charlie</div>
```

```javascript
// ❌ Won't work — hyphens break dot notation in JavaScript
// Collections.ClassName.user-card

// ✅ Bracket notation — recommended for hyphenated names
const cards = Collections.ClassName['user-card'];
console.log(cards.length); // 3

// ✅ Method call — also works
const cards2 = Collections.ClassName('user-card');
console.log(cards.length === cards2.length); // true
```

**Simple rule:** Use dot notation for simple names. Use bracket notation `['class-name']` when there's a hyphen.

---

### Examples

**Example 1: Highlight All Cards**

```html
<div class="card">Product A - $19.99</div>
<div class="card">Product B - $29.99</div>
<div class="card">Product C - $9.99</div>
```

```javascript
const cards = Collections.ClassName.card;

// Add visual styles to all cards at once
cards.setStyle({
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s'
});

// Add hover interaction to all cards
cards.on('mouseenter', function() {
  this.style.transform = 'translateY(-4px)';
});

cards.on('mouseleave', function() {
  this.style.transform = 'translateY(0)';
});

// Mark them all as initialized
cards.addClass('initialized');
```

**What happened:** Three separate operations (style, mouseenter listener, mouseleave listener) applied to every card — no manual loops needed.

---

**Example 2: Toggle Section Visibility**

```html
<section class="collapsible">Section 1 content...</section>
<section class="collapsible">Section 2 content...</section>
<section class="collapsible">Section 3 content...</section>
```

```javascript
const sections = Collections.ClassName.collapsible;

// Show all sections
function showAll() {
  sections.removeClass('hidden').addClass('visible');
}

// Hide all sections
function hideAll() {
  sections.addClass('hidden').removeClass('visible');
}

// Toggle all sections
function toggleAll() {
  sections.toggleClass('collapsed');
  // Each section: if it has 'collapsed' → removes it. If it doesn't → adds it.
}
```

---

**Example 3: Bulk Form Reset**

```html
<input class="form-field" type="text" name="username">
<input class="form-field" type="email" name="email">
<input class="form-field" type="password" name="password">
```

```javascript
const fields = Collections.ClassName['form-field'];

function resetForm() {
  // Clear all values
  fields.setProperty('value', '');

  // Remove error and success states
  fields.removeClass('error').removeClass('success');

  // Re-enable all fields
  fields.setProperty('disabled', false);

  console.log(`Reset ${fields.length} form fields`);
}
```

---

### When to Use ClassName

**✅ Use ClassName when:**
- Elements are grouped by a shared CSS class
- You're working with UI components (cards, buttons, form fields, tabs)
- The class name describes their role or style

**Consider alternatives when:**
- Elements are all the same HTML tag with no class → `TagName` is more natural
- Elements are grouped by a form `name` attribute → `Name` is the right tool
- You need one specific element by its `id` → use the Elements Helper

---

## 2. Collections.TagName — Deep Dive

### Basic Usage

```html
<p>First paragraph about DOMHelpers.</p>
<p>Second paragraph with more details.</p>
<p>Third paragraph with examples.</p>
```

```javascript
// Get all <p> elements on the page
const paragraphs = Collections.TagName.p;

console.log(paragraphs.length); // 3

// Apply consistent typography to all paragraphs
paragraphs.setStyle({
  lineHeight: '1.7',
  marginBottom: '16px',
  color: '#374151'
});
```

**Important:** `TagName` searches the **entire document** for that tag type. If you have `<p>` tags in multiple sections, they're all included.

---

### Common Tags Reference

```javascript
const paragraphs  = Collections.TagName.p;        // <p>
const divs        = Collections.TagName.div;       // <div>
const buttons     = Collections.TagName.button;    // <button>
const inputs      = Collections.TagName.input;     // <input>
const links       = Collections.TagName.a;         // <a>
const images      = Collections.TagName.img;       // <img>
const listItems   = Collections.TagName.li;        // <li>
const spans       = Collections.TagName.span;      // <span>
const headings    = Collections.TagName.h2;        // <h2>
const selects     = Collections.TagName.select;    // <select>
const textareas   = Collections.TagName.textarea;  // <textarea>
```

---

### Examples

**Example 1: Style All Links**

```javascript
const links = Collections.TagName.a;

// Apply base link styles
links.setStyle({
  color: '#2563eb',
  textDecoration: 'none',
  transition: 'color 0.2s'
});

// Add underline on hover
links.on('mouseenter', function() {
  this.style.textDecoration = 'underline';
});

links.on('mouseleave', function() {
  this.style.textDecoration = 'none';
});

// Make external links open in new tab
const externalLinks = links.filter(link => {
  const href = link.getAttribute('href') || '';
  return href.startsWith('http://') || href.startsWith('https://');
});

externalLinks.forEach(link => {
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
});
```

**What happened:** We got all links, applied styles to all, then filtered to just external links and configured those separately.

---

**Example 2: Lazy Loading for All Images**

```html
<img src="/images/hero.jpg" alt="Hero image">
<img src="/images/product1.jpg" alt="Product 1">
<img src="/images/product2.jpg" alt="Product 2">
```

```javascript
const images = Collections.TagName.img;

// Set lazy loading on all images at once
images.setAttribute('loading', 'lazy')
      .setAttribute('decoding', 'async');

// Accessibility check — find images missing alt text
const noAlt = images.filter(img => !img.getAttribute('alt'));
if (noAlt.length > 0) {
  console.warn(`${noAlt.length} images are missing alt text!`);
}
```

---

**Example 3: Disable/Enable All Form Controls**

```javascript
const inputs = Collections.TagName.input;
const buttons = Collections.TagName.button;
const selects = Collections.TagName.select;

function disableAllFormControls() {
  inputs.setProperty('disabled', true);
  buttons.setProperty('disabled', true);
  selects.setProperty('disabled', true);
  console.log('All form controls disabled');
}

function enableAllFormControls() {
  inputs.setProperty('disabled', false);
  buttons.setProperty('disabled', false);
  selects.setProperty('disabled', false);
  console.log('All form controls enabled');
}
```

---

**Example 4: Validate All Required Inputs**

```javascript
const inputs = Collections.TagName.input;

// Find inputs that are required AND empty
const emptyRequired = inputs.filter(input =>
  input.hasAttribute('required') && !input.value.trim()
);

if (emptyRequired.length > 0) {
  // Highlight them all
  emptyRequired.forEach(input => {
    input.style.borderColor = '#ef4444';
    input.setAttribute('aria-invalid', 'true');
  });
  console.error(`${emptyRequired.length} required fields are empty`);
} else {
  console.log('All required fields are filled');
}
```

---

### When to Use TagName

**✅ Use TagName when:**
- Targeting all elements of a specific HTML type
- Applying accessibility attributes across all instances
- Setting global styles for a tag type
- Elements don't have or need a distinguishing class

**Consider alternatives when:**
- You want a subset of a tag type (e.g., "buttons with class `primary`") → Use `ClassName`
- Elements are grouped by a form `name` → Use `Name`
- You need one specific element → Use Elements Helper

---

## 3. Collections.Name — Deep Dive

### Basic Usage

```html
<input type="radio" name="size" value="small"> Small
<input type="radio" name="size" value="medium"> Medium
<input type="radio" name="size" value="large"> Large
```

```javascript
// Get all elements with name="size"
const sizeOptions = Collections.Name.size;

console.log(sizeOptions.length); // 3

// Find which radio is currently selected
const selected = sizeOptions.find(radio => radio.checked);
console.log('Selected size:', selected?.value);
// Output: "Selected size: medium" (or whichever is checked)
```

---

### Working with Radio Button Groups

Radio buttons sharing the same `name` are mutually exclusive — selecting one deselects the others. `Collections.Name` gives you the whole group at once.

```html
<label><input type="radio" name="plan" value="free"> Free</label>
<label><input type="radio" name="plan" value="pro"> Pro</label>
<label><input type="radio" name="plan" value="enterprise"> Enterprise</label>
```

```javascript
const planOptions = Collections.Name.plan;

// Get the currently selected plan
function getSelectedPlan() {
  const selected = planOptions.find(radio => radio.checked);
  return selected ? selected.value : null;
}

// Set a specific plan as selected programmatically
function selectPlan(planValue) {
  planOptions.forEach(radio => {
    radio.checked = radio.value === planValue;
    // Only the matching radio gets checked = true
  });
}

// React to selection changes
planOptions.on('change', () => {
  console.log('Plan changed to:', getSelectedPlan());
});

// Check initial state
console.log('Current plan:', getSelectedPlan());
// Output: "Current plan: free" (or whichever is currently checked)
```

---

### Working with Checkbox Groups

Multiple checkboxes can share the same `name` to form a logical group. Users can select multiple options.

```html
<label><input type="checkbox" name="feature" value="wifi"> WiFi</label>
<label><input type="checkbox" name="feature" value="parking"> Parking</label>
<label><input type="checkbox" name="feature" value="pool"> Pool</label>
<label><input type="checkbox" name="feature" value="gym"> Gym</label>
```

```javascript
const features = Collections.Name.feature;

// Get all currently selected features
function getSelectedFeatures() {
  return features
    .filter(cb => cb.checked)
    .map(cb => cb.value);
}
// Returns something like: ['wifi', 'pool']

// Select all features at once
function selectAll() {
  features.setProperty('checked', true);
  console.log('All features selected');
}

// Clear all selections at once
function clearAll() {
  features.setProperty('checked', false);
  console.log('All features cleared');
}

// Toggle each feature
function toggleAll() {
  features.forEach(cb => {
    cb.checked = !cb.checked;
  });
}

// Check if at least one is selected
function hasSelection() {
  return features.some(cb => cb.checked);
}

console.log('Selected features:', getSelectedFeatures());
// Output: "Selected features: ['wifi', 'pool']"
```

---

### Examples

**Example 1: Dynamic Radio Group with Live Preview**

```html
<div id="colorPicker">
  <input type="radio" name="color" value="red"> Red
  <input type="radio" name="color" value="green"> Green
  <input type="radio" name="color" value="blue"> Blue
</div>
<div id="colorPreview" style="width: 100px; height: 100px;"></div>
```

```javascript
const colorOptions = Collections.Name.color;
const preview = Elements.colorPreview;

// Update preview whenever selection changes
colorOptions.on('change', function() {
  // `this` is the radio button that was just changed
  preview.style.backgroundColor = this.value;
  console.log('Color set to:', this.value);
});

// Select a specific color programmatically
function selectColor(colorValue) {
  colorOptions.forEach(radio => {
    radio.checked = radio.value === colorValue;
  });
  preview.style.backgroundColor = colorValue;
}

selectColor('blue');
// Blue radio is now checked, preview turns blue
// Console: "Color set to: blue"
```

---

**Example 2: Multi-Checkbox Preferences Form**

```html
<p>Notification preferences:</p>
<label><input type="checkbox" name="notify" value="email"> Email</label>
<label><input type="checkbox" name="notify" value="sms"> SMS</label>
<label><input type="checkbox" name="notify" value="push"> Push notifications</label>
```

```javascript
const notifyOptions = Collections.Name.notify;

// Get selected values ready for API submission
function getPreferences() {
  const selected = notifyOptions
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  return { notifications: selected };
}

// Pre-populate from saved settings
function loadPreferences(savedValues) {
  notifyOptions.forEach(cb => {
    cb.checked = savedValues.includes(cb.value);
  });
}

// Usage
loadPreferences(['email', 'push']);
// 'email' and 'push' checkboxes are now checked

console.log(getPreferences());
// Output: { notifications: ['email', 'push'] }
```

---

**Example 3: Multiple Text Inputs with the Same Name**

```html
<input type="text" name="tag" placeholder="Tag 1">
<input type="text" name="tag" placeholder="Tag 2">
<input type="text" name="tag" placeholder="Tag 3">
```

```javascript
const tagInputs = Collections.Name.tag;

// Collect all non-empty tag values
function getAllTags() {
  return tagInputs
    .map(input => input.value.trim())
    .filter(value => value !== '');
}

// Clear all tag inputs
function clearTags() {
  tagInputs.setProperty('value', '');
}

// Check if any tag has been entered
function hasTags() {
  return tagInputs.some(input => input.value.trim() !== '');
}

console.log('Current tags:', getAllTags());
// Output: "Current tags: ['javascript', 'css']" (filled ones only)
```

---

### When to Use Name

**✅ Use Name when:**
- Working with radio button groups
- Working with checkbox groups
- Multiple inputs sharing the same `name` attribute
- Need to get or set values for an entire named group

**Consider alternatives when:**
- Elements don't have a `name` attribute → Use `ClassName` or `TagName`
- You need one specific input → Use Elements Helper

---

## Comparing the Three Methods

| | ClassName | TagName | Name |
|-|-----------|---------|------|
| **Finds by...** | `class="btn"` | `<button>` tag | `name="email"` |
| **Best for...** | Styled groups | Tag-level operations | Form groups |
| **Hyphenated names** | Bracket notation | N/A | Bracket notation |
| **Returns** | Enhanced Collection | Enhanced Collection | Enhanced Collection |
| **Cached** | ✅ Yes | ✅ Yes | ✅ Yes |

---

## Automatic Caching — How It Works

All three methods use the same caching system:

```javascript
// First access — queries the DOM
const buttons1 = Collections.ClassName.btn;
// Under the hood: "Is 'class:btn' in cache? No → query DOM → store in cache"

// Second access — returns from cache instantly
const buttons2 = Collections.ClassName.btn;
// Under the hood: "Is 'class:btn' in cache? Yes → return cached collection"

// They are the same reference
console.log(buttons1 === buttons2); // true

// Performance difference
console.time('first-access');
const a = Collections.ClassName.btn;
console.timeEnd('first-access'); // ~0.5ms (DOM query)

console.time('second-access');
const b = Collections.ClassName.btn;
console.timeEnd('second-access'); // ~0.01ms (cache hit — 50x faster)
```

The cache is automatically invalidated when the DOM structure changes — using a `MutationObserver` internally. You don't need to manage it manually.

---

## Static Snapshots — What This Means for You

Each access returns a **static snapshot** of the matching elements at that moment:

```javascript
const items = Collections.ClassName.item;
console.log(items.length); // 3

// Add a new item to the DOM
const newItem = document.createElement('div');
newItem.className = 'item';
document.body.appendChild(newItem);

// The existing snapshot is unchanged
console.log(items.length); // Still 3

// Access again to get an updated snapshot
const freshItems = Collections.ClassName.item;
console.log(freshItems.length); // 4 — includes the new one
```

**Why is this good?** When you iterate with `forEach`, the collection won't change underneath you. Static snapshots keep iteration safe and predictable.

**When you need fresh data:** Simply access the collection again — `Collections.ClassName.item` — and you'll get an updated snapshot reflecting the current DOM.

---

## Common Patterns

### Pattern 1: Chain Multiple Operations

```javascript
// Configure all buttons with one expression
Collections.ClassName.btn
  .addClass('initialized')
  .setProperty('disabled', false)
  .setStyle({ cursor: 'pointer' })
  .on('click', handleButtonClick);
// All four operations applied to every button ✨
```

### Pattern 2: Filter Then Process

```javascript
const buttons = Collections.ClassName.btn;

// Get only enabled buttons
const enabledButtons = buttons.filter(btn => !btn.disabled);

// Process just the enabled ones
enabledButtons.forEach(btn => {
  console.log('Active button:', btn.textContent);
});

console.log(`${enabledButtons.length} of ${buttons.length} buttons are active`);
```

### Pattern 3: Extract Data from All Elements

```javascript
const cards = Collections.ClassName.card;

// Extract structured data from each card
const cardData = cards.map(card => ({
  id: card.dataset.id,
  title: card.querySelector('h3')?.textContent,
  price: card.dataset.price
}));

console.log(cardData);
// Output: [{ id: '1', title: 'Item A', price: '19.99' }, ...]
```

### Pattern 4: Combine Multiple Collections

```javascript
// Get form fields using different methods
const textInputs = Collections.TagName.input;
const radioGroup = Collections.Name.size;
const checkGroup = Collections.Name.features;

// Disable everything at once
textInputs.setProperty('disabled', true);
radioGroup.setProperty('disabled', true);
checkGroup.setProperty('disabled', true);
```

---

## Best Practices

### ✅ Store the Reference — Access Once, Use Many Times

```javascript
// Good — access once, store, reuse
const buttons = Collections.ClassName.btn;
buttons.addClass('initialized');
buttons.on('click', handleClick);
buttons.setStyle({ cursor: 'pointer' });
```

### ✅ Chain Related Operations

```javascript
// Clean — related operations chained together
Collections.ClassName.card
  .addClass('active')
  .setStyle({ opacity: '1' })
  .setAttribute('data-status', 'ready');
```

### ✅ Choose the Right Method

```javascript
// Use ClassName for styled groups
const cards = Collections.ClassName.card;

// Use TagName for all-elements-of-type
const allLinks = Collections.TagName.a;

// Use Name for form groups
const radioGroup = Collections.Name.plan;
```

### ❌ Don't Access Collections in Tight Loops

```javascript
// Avoid — accessing inside a loop is unnecessary
for (let i = 0; i < 100; i++) {
  Collections.ClassName.btn.forEach(btn => process(btn));
}

// Better — access once before the loop
const buttons = Collections.ClassName.btn;
for (let i = 0; i < 100; i++) {
  buttons.forEach(btn => process(btn));
}
```

### ❌ Don't Forget Bracket Notation for Hyphenated Names

```javascript
// ❌ Will cause a JavaScript syntax error
// Collections.ClassName.nav-link

// ✅ Use bracket notation
const navLinks = Collections.ClassName['nav-link'];

// ✅ Or method call
const navLinks2 = Collections.ClassName('nav-link');
```

---

## Real-World Example: Page Setup

Here's how all three methods work together in a real page initialization:

```html
<!-- Navigation links -->
<a class="nav-link" href="/home">Home</a>
<a class="nav-link" href="/about">About</a>
<a class="nav-link" href="/contact">Contact</a>

<!-- Product cards -->
<div class="card" data-id="1" data-price="19.99">Product A</div>
<div class="card" data-id="2" data-price="29.99">Product B</div>

<!-- Quantity inputs -->
<input type="number" name="quantity" min="1" max="99" value="1">
<input type="number" name="quantity" min="1" max="99" value="1">
```

```javascript
function initializePage() {
  // 1. Set up navigation with ClassName
  const navLinks = Collections.ClassName['nav-link'];
  navLinks.on('click', function(e) {
    navLinks.removeClass('active');       // Clear all active states
    this.classList.add('active');         // Set clicked one as active
  });

  // 2. Set up cards with ClassName
  const cards = Collections.ClassName.card;
  cards.setStyle({ cursor: 'pointer' })
       .on('click', function() {
         console.log('Card clicked, ID:', this.dataset.id);
       });

  // 3. Set up quantity inputs with Name
  const quantities = Collections.Name.quantity;
  quantities.on('change', function() {
    console.log('Quantity changed to:', this.value);
    updateCartTotal();
  });

  // 4. Ensure all images load lazily (TagName)
  Collections.TagName.img.setAttribute('loading', 'lazy');

  console.log('Page initialized:');
  console.log('  Nav links:', navLinks.length);
  console.log('  Cards:', cards.length);
  console.log('  Quantity inputs:', quantities.length);
}

initializePage();
```

---

## Key Takeaways

1. **Three access methods** — `ClassName`, `TagName`, `Name` — each for a different HTML grouping
2. **Same return type** — all three give you an Enhanced Collection with array methods + DOM methods
3. **Property access** for simple names, **bracket notation** for hyphenated names
4. **Automatically cached** — first access is slower (DOM query), subsequent ones are instant
5. **Static snapshots** — collections don't auto-update; access again when you need fresh data
6. **Chainable** — all bulk methods return the collection, allowing clean method chaining
7. **Choose the right method** — `ClassName` for CSS groups, `TagName` for tag types, `Name` for form groups

---

## What's Next?

With the three access methods mastered, explore what you can do with the collections they return:

- **Array-Like Methods** — forEach, map, filter, find, some, every, reduce
- **DOM Manipulation Methods** — addClass, setProperty, setStyle, on, off
- **Filtering Methods** — visible(), hidden(), enabled(), disabled()

Continue to **Array-Like Methods** →