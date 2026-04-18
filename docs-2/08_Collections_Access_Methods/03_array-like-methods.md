[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Array-Like Methods

## Quick Start (30 Seconds)

```javascript
const buttons = Collections.ClassName.btn;

// Iterate over all buttons
buttons.forEach(btn => console.log(btn.textContent));
// Output: Save, Cancel, Delete

// Extract data from all buttons
const texts = buttons.map(btn => btn.textContent);
console.log(texts); // ['Save', 'Cancel', 'Delete']

// Get only the enabled buttons
const enabled = buttons.filter(btn => !btn.disabled);
console.log('Enabled:', enabled.length); // 2 (if 1 is disabled)

// Find the first disabled button
const firstDisabled = buttons.find(btn => btn.disabled);
console.log('First disabled:', firstDisabled?.textContent); // 'Delete'
```

No `Array.from()` needed — these methods work directly on Collections.

---

## What Are Array-Like Methods?

When you access a collection with Collections Helper, you get back an **Enhanced Collection** — an object that behaves like an array. All standard JavaScript array methods are built right in.

Think of it like this: every collection you get from Collections Helper already comes with a full toolbox of array operations. You don't need to convert anything first.

```
Native HTMLCollection            Enhanced Collection
───────────────────              ──────────────────────────────────
buttons.forEach(...)  ❌         buttons.forEach(...)  ✅
buttons.map(...)      ❌         buttons.map(...)      ✅
buttons.filter(...)   ❌         buttons.filter(...)   ✅
buttons.find(...)     ❌         buttons.find(...)     ✅
buttons.some(...)     ❌         buttons.some(...)     ✅
buttons.every(...)    ❌         buttons.every(...)    ✅
buttons.reduce(...)   ❌         buttons.reduce(...)   ✅
Array.from() needed   ❌         No conversion needed  ✅
```

---

## Syntax Reference

```javascript
collection.forEach(callback)                 // Iterate
collection.map(callback)                     // Transform
collection.filter(callback)                  // Subset
collection.find(callback)                    // First match
collection.findIndex(callback)               // Index of first match
collection.some(callback)                    // Test if any match
collection.every(callback)                   // Test if all match
collection.reduce(callback, initialValue)    // Aggregate
collection.toArray()                         // Convert to plain array
```

All callbacks receive: `(element, index, array)`

---

## Why Do These Methods Exist?

### The Challenge with Native Collections

JavaScript's built-in DOM collection methods (`getElementsByClassName`, etc.) return `HTMLCollection` objects — and `HTMLCollection` doesn't support modern array methods. You always need an extra conversion step.

```javascript
// Native approach — extra step required every time
const buttons = document.getElementsByClassName('btn');
const buttonArray = Array.from(buttons);  // Must convert first

buttonArray.forEach(btn => console.log(btn.textContent));  // Works
buttonArray.map(btn => btn.textContent);                    // Works
```

**This approach has a workflow cost:**
❌ Must remember to call `Array.from()` every time
❌ Extra variable clutters the code
❌ Easy to forget and get confusing errors

### The Collections Helper Approach

Collections returns an Enhanced Collection that already has all these methods built in:

```javascript
// Collections approach — methods work directly
const buttons = Collections.ClassName.btn;

buttons.forEach(btn => console.log(btn.textContent));  // Works directly ✅
buttons.map(btn => btn.textContent);                    // Works directly ✅
```

**Benefits:**
✅ No conversion step — methods work on the collection directly
✅ Cleaner, more readable code
✅ One less thing to remember
✅ Same interface as regular JavaScript arrays — knowledge transfers instantly

---

## Mental Model

**Think of a Collection like a Playlist.**

A music playlist is a list of songs. You can:
- **Loop through it** — play each song one by one (`forEach`)
- **Get song titles** — extract just the names (`map`)
- **Filter by genre** — get only the rock songs (`filter`)
- **Find a specific song** — the first one by a certain artist (`find`)
- **Check if there's any song over 5 minutes** — (`some`)
- **Check if all songs are under 5 minutes** — (`every`)
- **Calculate total playtime** — add up all durations (`reduce`)

A Collection of DOM elements works the same way — you iterate, transform, filter, and query it using the same familiar methods.

---

## Complete Method Reference

| Method | What It Does | Returns |
|--------|-------------|---------|
| `forEach()` | Execute code for each element | `undefined` |
| `map()` | Create new array by transforming each element | New array |
| `filter()` | Create new array with elements that pass a test | New array |
| `find()` | Get the first element that passes a test | Element or `undefined` |
| `findIndex()` | Get the index of the first element that passes a test | Number or `-1` |
| `some()` | Check if at least one element passes a test | `boolean` |
| `every()` | Check if all elements pass a test | `boolean` |
| `reduce()` | Combine all elements into one value | Any value |
| `toArray()` | Convert to a plain JavaScript array | Array |

---

## 1. forEach() — Iterate Over Elements

Run a function once for each element in the collection. Use this when you want to **do something** with each element — update it, log it, or process it.

### Syntax

```javascript
collection.forEach(callback)
// callback receives: (element, index, array)
```

**Returns:** `undefined` (not chainable)

---

### Basic Usage

```javascript
const buttons = Collections.ClassName.btn;

// Simple loop — print each button's text
buttons.forEach(btn => {
  console.log(btn.textContent);
});
// Output:
// Save
// Cancel
// Delete

// With index — know the position
buttons.forEach((btn, index) => {
  console.log(`Button ${index + 1} of ${buttons.length}: ${btn.textContent}`);
});
// Output:
// Button 1 of 3: Save
// Button 2 of 3: Cancel
// Button 3 of 3: Delete

// With all three parameters
buttons.forEach((btn, index, array) => {
  console.log(`${index + 1}/${array.length}: ${btn.textContent}`);
});
```

---

### Examples

**Example 1: Add Data Attributes to Each Element**

```javascript
const cards = Collections.ClassName.card;

// Add position data to each card
cards.forEach((card, index) => {
  card.dataset.index = index;                              // 0, 1, 2...
  card.setAttribute('aria-posinset', index + 1);          // 1, 2, 3...
  card.setAttribute('aria-setsize', cards.length);        // Total count
});
```

**What's happening:** For each card, we set three attributes — `data-index`, `aria-posinset` (1-based position), and `aria-setsize` (total count). This is useful for accessibility and JavaScript logic.

---

**Example 2: Collect Form Data**

```javascript
const inputs = Collections.TagName.input;
const formData = {};

inputs.forEach(input => {
  if (input.name) {
    // Use the input's name as the key, its value as the value
    formData[input.name] = input.value;
  }
});

console.log(formData);
// Output: { username: 'Alice', email: 'alice@example.com', password: '...' }
```

**What's happening:** We loop over all inputs, and for each one that has a `name` attribute, we store `name → value` in our object.

---

**Example 3: Apply Different Styles Based on Position**

```javascript
const items = Collections.ClassName.item;

// Give every other item a different background (zebra striping)
items.forEach((item, index) => {
  if (index % 2 === 0) {
    item.classList.add('even');    // 0, 2, 4...
  } else {
    item.classList.add('odd');     // 1, 3, 5...
  }
});
```

---

### Key Insight: forEach vs Built-In Methods

`forEach` is for custom logic per element. When you're just applying the same operation to all elements, use the built-in bulk methods instead:

```javascript
// With forEach — fine, but more code
buttons.forEach(btn => btn.classList.add('active'));

// With built-in addClass — shorter, same result
buttons.addClass('active');  // Applies to all ✅
```

Use `forEach` when each element needs **individual treatment** based on its own properties.

---

## 2. map() — Transform Elements

Create a new array by applying a transformation to each element. Use this when you want to **extract data** from elements or **create new values** based on them.

### Syntax

```javascript
collection.map(callback)
// callback receives: (element, index, array)
// callback should return: the transformed value
```

**Returns:** New plain array (not a collection)

---

### Basic Usage

```javascript
const buttons = Collections.ClassName.btn;

// Get the text content of each button
const texts = buttons.map(btn => btn.textContent);
console.log(texts); // ['Save', 'Cancel', 'Delete']

// Get the IDs
const ids = buttons.map(btn => btn.id);
console.log(ids); // ['save-btn', 'cancel-btn', 'delete-btn']

// Get data attributes
const userIds = buttons.map(btn => btn.dataset.userId);
console.log(userIds); // ['101', '102', '103']
```

**Key point:** `map()` always returns a **new plain array** — not a Collection. The original collection is unchanged.

---

### Examples

**Example 1: Extract Form Values**

```javascript
const inputs = Collections.ClassName['form-input'];

// Get detailed info about each input
const fieldInfo = inputs.map(input => ({
  name: input.name,
  value: input.value,
  type: input.type,
  isValid: input.validity.valid,
  isEmpty: input.value.trim() === ''
}));

console.log(fieldInfo);
// Output:
// [
//   { name: 'email', value: 'alice@example.com', type: 'email', isValid: true, isEmpty: false },
//   { name: 'password', value: '...', type: 'password', isValid: true, isEmpty: false },
//   { name: 'bio', value: '', type: 'text', isValid: true, isEmpty: true }
// ]
```

**What's happening:** For each input, we create an object with five pieces of information. The result is an array of these objects — ready for validation logic or API submission.

---

**Example 2: Get Element Positions**

```javascript
const items = Collections.ClassName.item;

// Get the bounding rectangle of each item
const positions = items.map(item => ({
  id: item.id,
  x: item.offsetLeft,
  y: item.offsetTop,
  width: item.offsetWidth,
  height: item.offsetHeight
}));

console.log(positions);
// Output: [{ id: 'item-1', x: 0, y: 100, width: 300, height: 50 }, ...]
```

---

**Example 3: Create a Summary Report**

```javascript
const products = Collections.ClassName['product-card'];

// Extract data for a report
const summary = products.map((product, index) => ({
  position: index + 1,
  name: product.querySelector('h3').textContent,
  price: parseFloat(product.dataset.price),
  inStock: product.dataset.stock !== '0'
}));

// Calculate total value
const totalValue = summary.reduce((sum, p) => sum + p.price, 0);

console.log('Products:', summary);
console.log('Total catalog value: $' + totalValue.toFixed(2));
```

---

## 3. filter() — Get Elements That Match a Condition

Create a new array containing only the elements that pass your test. Use this when you want a **subset** of the collection based on some condition.

### Syntax

```javascript
collection.filter(callback)
// callback receives: (element, index, array)
// callback should return: true to keep the element, false to exclude it
```

**Returns:** New plain array (not a Collection)

---

### Basic Usage

```javascript
const buttons = Collections.ClassName.btn;

// Get only enabled buttons (where disabled is false)
const enabled = buttons.filter(btn => !btn.disabled);
console.log('Enabled buttons:', enabled.length);

// Get buttons with a specific class
const primary = buttons.filter(btn =>
  btn.classList.contains('primary')
);
console.log('Primary buttons:', primary.length);

// Get buttons with text content
const withText = buttons.filter(btn =>
  btn.textContent.trim() !== ''
);
```

---

### Examples

**Example 1: Find Invalid Form Inputs**

```javascript
const inputs = Collections.TagName.input;

// Get only inputs that are NOT valid
const invalidInputs = inputs.filter(input => !input.validity.valid);

// Highlight all invalid ones
invalidInputs.forEach(input => {
  input.style.borderColor = '#ef4444';
  input.setAttribute('aria-invalid', 'true');
});

console.log(`Found ${invalidInputs.length} invalid inputs`);
// Output: "Found 2 invalid inputs"
```

**What's happening:** We check `input.validity.valid` — the browser's built-in validity property. Only inputs that fail validation are included. Then we loop over just those and style them.

---

**Example 2: Search — Highlight Matching Items**

```javascript
const items = Collections.ClassName.item;

function searchItems(searchTerm) {
  // Find items that contain the search term (case-insensitive)
  const matches = items.filter(item =>
    item.textContent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Clear previous highlights
  items.forEach(item => item.classList.remove('highlight'));

  // Add highlights to matches
  matches.forEach(item => item.classList.add('highlight'));

  console.log(`Found ${matches.length} items matching "${searchTerm}"`);
  return matches;
}

searchItems('important');
// Output: "Found 2 items matching 'important'"
```

---

**Example 3: External Links**

```javascript
const links = Collections.TagName.a;

// Filter to only external links (those starting with http)
const externalLinks = links.filter(link => {
  const href = link.getAttribute('href') || '';
  return href.startsWith('http://') || href.startsWith('https://');
});

// Configure all external links
externalLinks.forEach(link => {
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('title', link.title || 'Opens in new tab');
});

console.log(`Configured ${externalLinks.length} external links`);
```

---

**Example 4: Filter Empty Inputs Before Submission**

```javascript
const inputs = Collections.TagName.input;

// Before submitting, find any required empty fields
const emptyRequired = inputs.filter(input =>
  input.hasAttribute('required') && !input.value.trim()
);

if (emptyRequired.length > 0) {
  emptyRequired.forEach(input => input.classList.add('error'));
  console.error(`${emptyRequired.length} required fields are empty — cannot submit`);
} else {
  console.log('All required fields are filled — ready to submit');
  submitForm();
}
```

---

## 4. find() — Get the First Matching Element

Search through the collection and return the **first** element that passes your test. If nothing matches, you get `undefined`.

### Syntax

```javascript
collection.find(callback)
// callback receives: (element, index, array)
// callback should return: true when you've found the element you want
```

**Returns:** The first matching element, or `undefined` if nothing matches

---

### Basic Usage

```javascript
const buttons = Collections.ClassName.btn;

// Find the first disabled button
const firstDisabled = buttons.find(btn => btn.disabled);

// Find a button by its text
const saveBtn = buttons.find(btn => btn.textContent.trim() === 'Save');

// Find a button by ID
const specificBtn = buttons.find(btn => btn.id === 'submit-btn');
```

---

### Why find() Instead of filter()[0]?

```javascript
// ❌ Less efficient — filter() checks ALL elements, then you grab the first
const firstMatch = buttons.filter(btn => btn.disabled)[0];

// ✅ More efficient — find() STOPS as soon as it finds the first match
const firstMatch = buttons.find(btn => btn.disabled);
```

`find()` is faster because it short-circuits — it stops checking as soon as it finds a match.

---

### Examples

**Example 1: Find the Checked Radio Button**

```javascript
const radios = Collections.Name.color;

const selected = radios.find(radio => radio.checked);

if (selected) {
  console.log('Selected color:', selected.value);
  // Output: "Selected color: blue"
} else {
  console.log('No color selected yet');
}
```

**What's happening:** We search through the radio group for the one with `checked === true`. Since only one can be checked at a time, `find()` is perfect here.

---

**Example 2: Find the Active Tab**

```javascript
const tabs = Collections.ClassName.tab;

const activeTab = tabs.find(tab =>
  tab.classList.contains('active')
);

if (activeTab) {
  console.log('Active tab ID:', activeTab.dataset.tabId);
  loadTabContent(activeTab.dataset.tabId);
} else {
  // No active tab — show the first one
  const firstTab = tabs.first();
  if (firstTab) {
    firstTab.classList.add('active');
    loadTabContent(firstTab.dataset.tabId);
  }
}
```

---

**Example 3: Find a Card by Data Attribute**

```javascript
const cards = Collections.ClassName.card;

function findCardById(cardId) {
  const card = cards.find(card => card.dataset.id === cardId);

  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('highlighted');
    console.log('Found card:', card.textContent.trim());
    return card;
  } else {
    console.warn(`No card with ID "${cardId}" found`);
    return null;
  }
}

findCardById('42');
```

---

## 5. findIndex() — Get the Position of the First Match

Like `find()`, but returns the **index (position)** of the first matching element instead of the element itself.

### Syntax

```javascript
collection.findIndex(callback)
// Returns: number (index) or -1 if nothing matches
```

---

### Basic Usage

```javascript
const items = Collections.ClassName.item;

// Find position of the active item
const activeIndex = items.findIndex(item =>
  item.classList.contains('active')
);

console.log('Active item is at position:', activeIndex);
// Output: "Active item is at position: 2"

// No match returns -1
const missingIndex = items.findIndex(item =>
  item.classList.contains('nonexistent')
);
console.log(missingIndex); // -1
```

---

### Example: Pagination Logic

```javascript
const slides = Collections.ClassName.slide;

// Find which slide is currently active
const currentIndex = slides.findIndex(slide =>
  slide.classList.contains('active')
);

// Move to the next slide
function goNext() {
  const current = slides.findIndex(s => s.classList.contains('active'));
  if (current === -1) return; // No active slide

  const nextIndex = (current + 1) % slides.length; // Wrap around

  slides.forEach(s => s.classList.remove('active'));   // Deactivate all
  slides.at(nextIndex).classList.add('active');         // Activate next

  console.log(`Moved from slide ${current} to slide ${nextIndex}`);
}
```

---

## 6. some() — Check If Any Element Matches

Returns `true` if **at least one** element passes your test. Stops checking as soon as it finds a match — so it's efficient.

### Syntax

```javascript
collection.some(callback)
// Returns: boolean (true if ANY element passes the test)
```

---

### Basic Usage

```javascript
const inputs = Collections.TagName.input;

// Is there any invalid input?
const hasInvalid = inputs.some(input => !input.validity.valid);

// Is there any input with a value?
const hasValue = inputs.some(input => input.value.trim() !== '');

// Is any checkbox checked?
const anyChecked = inputs.some(input =>
  input.type === 'checkbox' && input.checked
);
```

---

### some() vs filter().length > 0

```javascript
// ❌ Less efficient — filter() checks ALL elements
const hasError = items.filter(item =>
  item.classList.contains('error')
).length > 0;

// ✅ More efficient — some() stops at first match
const hasError = items.some(item =>
  item.classList.contains('error')
);
```

`some()` is the right tool when you only care about **whether** a match exists — not how many.

---

### Examples

**Example 1: Form Validation Gate**

```javascript
const requiredFields = Collections.ClassName.required;

function canSubmitForm() {
  // Check if any required field is empty
  const hasEmptyField = requiredFields.some(field =>
    field.value.trim() === ''
  );

  if (hasEmptyField) {
    console.warn('Cannot submit — some required fields are empty');
    return false;
  }

  console.log('All required fields are filled — ready to submit');
  return true;
}

// Example usage
document.getElementById('submitBtn').addEventListener('click', () => {
  if (canSubmitForm()) {
    submitFormData();
  }
});
```

---

**Example 2: Check for Errors Before Navigating Away**

```javascript
const sections = Collections.ClassName.section;

window.addEventListener('beforeunload', (e) => {
  // Check if any section has unsaved changes
  const hasUnsaved = sections.some(section =>
    section.dataset.modified === 'true'
  );

  if (hasUnsaved) {
    e.preventDefault();
    e.returnValue = ''; // Browser shows "Are you sure?" dialog
  }
});
```

---

## 7. every() — Check If All Elements Match

Returns `true` if **every** element passes your test. Stops checking as soon as it finds one that fails.

### Syntax

```javascript
collection.every(callback)
// Returns: boolean (true only if ALL elements pass the test)
```

---

### Basic Usage

```javascript
const inputs = Collections.ClassName['form-input'];

// Are ALL inputs valid?
const allValid = inputs.every(input => input.validity.valid);

// Are ALL inputs filled?
const allFilled = inputs.every(input =>
  input.value.trim() !== ''
);

// Are ALL checkboxes checked?
const allChecked = inputs.every(input => input.checked);
```

---

### some() vs every() — When to Use Each

```
some()  → "Is there at least one that...?"
every() → "Are all of them...?"

Example:
  some(btn => btn.disabled)   → "Is any button disabled?"
  every(btn => btn.disabled)  → "Are all buttons disabled?"
```

---

### Examples

**Example 1: Enable Submit Only When All Fields Are Filled**

```javascript
const requiredInputs = Collections.ClassName.required;
const submitBtn = Elements.submitBtn;

function updateSubmitButton() {
  const allFilled = requiredInputs.every(input =>
    input.value.trim() !== ''
  );

  // Enable submit only when everything is filled
  submitBtn.disabled = !allFilled;

  if (allFilled) {
    submitBtn.classList.add('ready');
  } else {
    submitBtn.classList.remove('ready');
  }
}

// Re-check every time a field changes
requiredInputs.on('input', updateSubmitButton);

// Check initial state
updateSubmitButton();
```

**What's happening:** Every time any required input changes, we re-check whether ALL of them are filled. The submit button is enabled only when the answer is yes.

---

**Example 2: Check if All Sections Are Complete**

```javascript
const sections = Collections.ClassName['wizard-step'];

function isFormComplete() {
  const allComplete = sections.every(section =>
    section.dataset.status === 'complete'
  );

  if (allComplete) {
    console.log('All steps complete! You can submit.');
    Elements.finalSubmitBtn.disabled = false;
  } else {
    const remaining = sections.filter(s => s.dataset.status !== 'complete');
    console.log(`${remaining.length} steps still need completion`);
  }

  return allComplete;
}
```

---

## 8. reduce() — Combine All Elements Into One Value

`reduce()` takes a collection and boils it down to a **single value** — a sum, an object, a count, anything you want. It works by running a function on each element, passing the result forward each time.

### Syntax

```javascript
collection.reduce(callback, initialValue)
// callback receives: (accumulator, element, index, array)
// accumulator: the running result from the previous step
// Returns: the final accumulated value
```

---

### Mental Model for reduce()

Think of it like a snowball rolling down a hill:
- You start with a small snowball (the `initialValue`)
- For each element, you roll it past that element and it picks up more snow
- At the end, you have one big snowball (the final value)

```
initialValue = 0
[10, 20, 30].reduce((total, n) => total + n, 0)

Step 1: total=0,  n=10  → returns 10
Step 2: total=10, n=20  → returns 30
Step 3: total=30, n=30  → returns 60

Final result: 60
```

---

### Basic Usage

```javascript
const items = Collections.ClassName.item;

// Count items (same as items.length, but shows the pattern)
const total = items.reduce((count, item) => count + 1, 0);

// Sum up numeric data attributes
const sum = items.reduce((total, item) => {
  return total + Number(item.dataset.value || 0);
}, 0);

// Build an object from the collection
const itemMap = items.reduce((map, item) => {
  map[item.id] = item.textContent.trim();
  return map;
}, {});
```

---

### Examples

**Example 1: Calculate Cart Total**

```javascript
const cartItems = Collections.ClassName['cart-item'];

const cartTotal = cartItems.reduce((sum, item) => {
  const price = parseFloat(item.dataset.price);     // e.g., 19.99
  const quantity = parseInt(item.dataset.quantity); // e.g., 2
  return sum + (price * quantity);                  // e.g., 39.98
}, 0);

console.log(`Cart total: $${cartTotal.toFixed(2)}`);
// Output: "Cart total: $87.94"
```

**What's happening:**
1. We start with `sum = 0`
2. For each cart item, we read its price and quantity from `data-` attributes
3. We add `price × quantity` to the running sum
4. After the last item, we have the complete total

---

**Example 2: Group Elements by Category**

```javascript
const items = Collections.ClassName.item;

// Group items by their data-category attribute
const grouped = items.reduce((groups, item) => {
  const category = item.dataset.category || 'uncategorized';

  // If this category hasn't been seen yet, create an empty array for it
  if (!groups[category]) {
    groups[category] = [];
  }

  groups[category].push(item);
  return groups;
}, {});

console.log(grouped);
// Output:
// {
//   'electronics': [<div>, <div>],
//   'books': [<div>, <div>, <div>],
//   'clothing': [<div>]
// }

// Now you can process each group
Object.entries(grouped).forEach(([category, elements]) => {
  console.log(`${category}: ${elements.length} items`);
});
```

---

**Example 3: Build a Statistics Report**

```javascript
const responses = Collections.ClassName['survey-response'];

const stats = responses.reduce((acc, response) => {
  const rating = parseInt(response.dataset.rating); // 1-5

  acc.total++;
  acc.sum += rating;

  // Count each rating level
  acc.ratings[rating] = (acc.ratings[rating] || 0) + 1;

  return acc;
}, { total: 0, sum: 0, ratings: {} });

// Calculate average
stats.average = stats.total > 0 ? (stats.sum / stats.total).toFixed(1) : 0;

console.log(stats);
// Output:
// {
//   total: 50,
//   sum: 215,
//   ratings: { 1: 3, 2: 5, 3: 12, 4: 20, 5: 10 },
//   average: '4.3'
// }
```

---

## 9. toArray() — Convert to a Plain Array

Returns a standard JavaScript array containing the same elements. Useful when you need array-specific features that Collections doesn't provide, or when passing to functions that expect plain arrays.

### Syntax

```javascript
collection.toArray()
// Returns: plain JavaScript Array
```

---

### When to Use toArray()

```javascript
const buttons = Collections.ClassName.btn;

// Verify it's a plain array
const arr = buttons.toArray();
console.log(Array.isArray(arr)); // true

// Now you can use methods like sort(), splice(), indexOf()
const sorted = arr.sort((a, b) =>
  a.textContent.localeCompare(b.textContent)
);
```

**✅ Use toArray() when:**
- You need `sort()`, `splice()`, `indexOf()`, or `reverse()` on the collection
- Passing to a third-party library that expects a plain array
- You want to modify the array itself (the collection is immutable)

**✅ You don't need toArray() for:**
- `forEach`, `map`, `filter`, `find` — all these work directly on Collections

---

### Example: Sort and Re-render Items

```javascript
const items = Collections.ClassName.item;
const container = Elements.itemContainer;

// Convert to array so we can sort
const sorted = items.toArray().sort((a, b) => {
  // Sort by data-date attribute, newest first
  const dateA = new Date(a.dataset.date);
  const dateB = new Date(b.dataset.date);
  return dateB - dateA;
});

// Clear the container and re-append in sorted order
container.innerHTML = '';
sorted.forEach(item => container.appendChild(item));

console.log(`Re-rendered ${sorted.length} items sorted by date`);
```

---

## Chaining Array Methods Together

You can chain array methods for powerful one-expression operations. Each method returns a new array, so you can call the next method on it immediately.

```javascript
const items = Collections.ClassName.item;

// Chain: filter → map → reduce
// "Calculate the total price of all active items"
const activeTotalPrice = items
  .filter(item => item.classList.contains('active'))  // Only active
  .map(item => parseFloat(item.dataset.price))        // Get price numbers
  .reduce((sum, price) => sum + price, 0);            // Sum them up

console.log(`Active items total: $${activeTotalPrice.toFixed(2)}`);

// Chain: filter → forEach
// "Process all unprocessed items"
items
  .filter(item => !item.classList.contains('processed'))
  .forEach(item => {
    processItem(item);
    item.classList.add('processed');
  });

// Chain: map → filter
// "Get all valid email addresses from inputs"
const validEmails = Collections.ClassName['email-input']
  .map(input => input.value.trim())
  .filter(email => email.includes('@') && email.includes('.'));
```

---

## Performance Tips

### Use the Right Method for the Job

```javascript
// ❌ Slow — filter checks ALL elements, then grabs [0]
const firstActive = items.filter(item =>
  item.classList.contains('active')
)[0];

// ✅ Fast — find() stops at the first match
const firstActive = items.find(item =>
  item.classList.contains('active')
);

// ❌ Slow — filter checks ALL, then checks if result has items
const hasActive = items.filter(item =>
  item.classList.contains('active')
).length > 0;

// ✅ Fast — some() stops at the first match
const hasActive = items.some(item =>
  item.classList.contains('active')
);
```

### Combine Filters in One Pass

```javascript
// ❌ Less efficient — two separate filter passes
const visible = items.visible();
const enabled = visible.filter(i => !i.disabled);

// ✅ More efficient — one filter with both conditions
const visibleAndEnabled = items.filter(item =>
  item.offsetParent !== null && !item.disabled
);
```

### Don't Convert Unnecessarily

```javascript
// ❌ Unnecessary — forEach works directly on Collections
const arr = buttons.toArray();
arr.forEach(btn => console.log(btn));

// ✅ Direct — no conversion needed
buttons.forEach(btn => console.log(btn));
```

---

## Real-World Patterns

### Pattern 1: Validation Summary

```javascript
const inputs = Collections.ClassName['form-input'];

function getValidationSummary() {
  return {
    total: inputs.length,
    valid: inputs.filter(i => i.validity.valid).length,
    invalid: inputs.filter(i => !i.validity.valid).length,
    empty: inputs.filter(i => !i.value.trim()).length,
    errors: inputs
      .filter(i => !i.validity.valid)
      .map(i => ({
        field: i.name,
        message: i.validationMessage
      }))
  };
}

const summary = getValidationSummary();
console.log(summary);
// Output:
// {
//   total: 5,
//   valid: 3,
//   invalid: 2,
//   empty: 1,
//   errors: [
//     { field: 'email', message: 'Please enter a valid email address.' },
//     { field: 'phone', message: 'Please match the requested format.' }
//   ]
// }
```

### Pattern 2: Table Data Extraction

```javascript
const rows = Collections.ClassName['data-row'];

// Extract structured data from a table
const tableData = rows.map(row => {
  const cells = Array.from(row.querySelectorAll('td'));
  return {
    id: row.dataset.id,
    name: cells[0]?.textContent.trim(),
    email: cells[1]?.textContent.trim(),
    status: cells[2]?.textContent.trim(),
    isSelected: row.classList.contains('selected')
  };
});

// Get only selected rows
const selectedRows = tableData.filter(row => row.isSelected);
console.log(`${selectedRows.length} rows selected`);
```

### Pattern 3: Batch Processing

```javascript
const items = Collections.ClassName.item;

// Process items in batches of 10 (to avoid blocking the UI)
async function processBatch() {
  const batchSize = 10;
  const allItems = items.toArray(); // Need plain array for slice()
  const batches = [];

  for (let i = 0; i < allItems.length; i += batchSize) {
    batches.push(allItems.slice(i, i + batchSize));
  }

  for (let i = 0; i < batches.length; i++) {
    console.log(`Processing batch ${i + 1} of ${batches.length}...`);
    batches[i].forEach(item => processItem(item));
    await new Promise(resolve => setTimeout(resolve, 0)); // Yield to browser
  }

  console.log(`Processed ${allItems.length} items in ${batches.length} batches`);
}
```

---

## Common Pitfalls

### Pitfall 1: Don't Modify the DOM During Iteration

```javascript
// ❌ Dangerous — removing elements while iterating can skip elements
buttons.forEach(btn => {
  if (btn.disabled) {
    btn.remove(); // DOM changes mid-iteration — unpredictable!
  }
});

// ✅ Safe — collect what to remove, then remove after
const toRemove = buttons.filter(btn => btn.disabled);
toRemove.forEach(btn => btn.remove()); // Safe — iteration is already done
```

### Pitfall 2: map() and filter() Return Plain Arrays, Not Collections

```javascript
const buttons = Collections.ClassName.btn;
const enabled = buttons.filter(btn => !btn.disabled);

// ❌ Won't work — filter() returns a plain array, not a Collection
enabled.addClass('ready'); // Error: enabled.addClass is not a function

// ✅ Use forEach on the plain array
enabled.forEach(btn => btn.classList.add('ready'));
```

### Pitfall 3: find() Returns Undefined When Nothing Matches

```javascript
const buttons = Collections.ClassName.btn;
const hidden = buttons.find(btn => btn.style.display === 'none');

// ❌ Error if nothing is hidden!
hidden.classList.add('show'); // TypeError: Cannot read properties of undefined

// ✅ Always check before using
if (hidden) {
  hidden.classList.add('show');
}

// ✅ Or use optional chaining
buttons.find(btn => btn.style.display === 'none')?.classList.add('show');
```

---

## Key Takeaways

1. **No Array.from() needed** — all standard array methods work directly on Collections
2. **forEach** — for iterating and doing something with each element (returns `undefined`)
3. **map** — for extracting or transforming data (returns new plain array)
4. **filter** — for getting a subset that matches a condition (returns new plain array)
5. **find** — for getting the first match (returns element or `undefined`)
6. **some** — for checking if any match exists (returns boolean, stops early)
7. **every** — for checking if all match (returns boolean, stops at first failure)
8. **reduce** — for combining all elements into one value
9. **toArray** — for converting to a plain array when you need `sort()`, `splice()`, etc.
10. **Chaining** — `filter()`, `map()`, `reduce()` can be chained together

---

## What's Next?

Now that you can work with collections like arrays, let's explore the built-in DOM manipulation methods:

- **addClass, removeClass, toggleClass** — Class management
- **setProperty, setAttribute** — Property and attribute updates
- **setStyle** — Bulk style changes
- **on, off** — Event listener management

Continue to **DOM Manipulation Methods** →