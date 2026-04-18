[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Utility Methods

## Quick Start (30 Seconds)

```javascript
const items = Collections.ClassName.item;

// Get the first element
const first = items.first();
console.log('First:', first?.textContent);

// Get the last element
const last = items.last();
console.log('Last:', last?.textContent);

// Get by index (supports negative indices!)
const third = items.at(2);      // Third element (0-based)
const fromEnd = items.at(-1);   // Last element (negative index)
const secondLast = items.at(-2); // Second to last

// Check if the collection is empty
if (items.isEmpty()) {
  console.log('No items found');
} else {
  console.log(`Found ${items.length} items`);
}
```

Named methods that make your intent crystal clear.

---

## What Are Utility Methods?

Utility methods are convenience tools for **accessing individual elements** from a collection and **inspecting the collection's state**.

They replace raw index notation with named methods that express intent:

```javascript
// Raw index notation — works, but reads like internal code
const first = buttons[0];
const last = buttons[buttons.length - 1];
const isEmpty = buttons.length === 0;

// Utility methods — reads like what you intend
const first = buttons.first();
const last = buttons.last();
const isEmpty = buttons.isEmpty();
```

Same result. The utility methods version communicates intent immediately.

---

## Syntax Reference

```javascript
collection.first()          // Get first element (or undefined)
collection.last()           // Get last element (or undefined)
collection.at(index)        // Get by index, supports negative (or undefined)
collection.isEmpty()        // Returns boolean: true if empty
collection.item(index)      // Get by index, returns null if not found (legacy)
collection.namedItem(name)  // Get by name attribute (or null)
```

---

## Why These Methods Exist?

### Approach 1 — When Clarity Is Your Priority

When reading code, named methods communicate intent immediately. You don't have to mentally decode index arithmetic.

```javascript
// This: what does [buttons.length - 1] mean?
const last = buttons[buttons.length - 1];

// vs This: instantly clear
const last = buttons.last();
```

### Approach 2 — When Negative Indices Are Needed

The `at()` method adds a feature that doesn't exist with raw bracket notation: **negative indices**. In standard JavaScript, you can't write `array[-1]` to mean "last element". With `at()`, you can.

```javascript
// Without at() — verbose
const last = items[items.length - 1];
const secondLast = items[items.length - 2];

// With at() — clean
const last = items.at(-1);
const secondLast = items.at(-2);
```

**The Choice Is Yours:**
- Use `first()` and `last()` when clarity and readability are the priority
- Use `at(index)` when you need a specific position or want negative index support
- Use `isEmpty()` when you want self-documenting empty checks
- All approaches are valid; the utility methods just add expressiveness

---

## Complete Method Overview

| Method | Returns | Use Case |
|--------|---------|----------|
| `first()` | First element or `undefined` | Get the first item, focus first field |
| `last()` | Last element or `undefined` | Get the most recent item, scroll to end |
| `at(index)` | Element at index or `undefined` | Get by position, negative indices |
| `isEmpty()` | `boolean` | Check before using, conditional UI |
| `item(index)` | Element or `null` | Legacy compatibility |
| `namedItem(name)` | Element or `null` | Find form element by name |

---

## 1. first() — Get the First Element

Returns the first element in the collection, or `undefined` if the collection is empty.

### Syntax

```javascript
collection.first()
// Returns: first element or undefined
```

---

### Basic Usage

```javascript
const buttons = Collections.ClassName.btn;

const firstButton = buttons.first();

if (firstButton) {
  console.log('First button:', firstButton.textContent);
  firstButton.focus(); // Focus it
} else {
  console.log('No buttons found');
}
```

---

### first() vs [0]

```javascript
const buttons = Collections.ClassName.btn;

// Both get the first button
const a = buttons[0];        // Raw index
const b = buttons.first();   // Named method — same result, clearer intent

// Key difference: first() returns undefined if empty, [0] also returns undefined
// But first() communicates the intent more clearly
```

---

### Examples

**Example 1: Focus the First Input on Page Load**

```javascript
function focusFirstInput() {
  const inputs = Collections.TagName.input;
  const first = inputs.first();

  if (first) {
    first.focus();
    console.log('Focused first input:', first.name || first.id);
  } else {
    console.warn('No inputs found on page');
  }
}

document.addEventListener('DOMContentLoaded', focusFirstInput);
```

---

**Example 2: Set the First Item as Active**

```javascript
function activateFirstItem() {
  const items = Collections.ClassName.item;
  const first = items.first();

  if (first) {
    // Clear all active states
    items.removeClass('active');
    items.forEach(item => item.setAttribute('aria-selected', 'false'));

    // Set first as active
    first.classList.add('active');
    first.setAttribute('aria-selected', 'true');
    first.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    console.log('First item activated:', first.dataset.id);
  }
}
```

---

**Example 3: Get Header from a Table**

```javascript
const rows = Collections.ClassName['data-row'];

// The first row is often the header
const headerRow = rows.first();
if (headerRow) {
  const headers = Array.from(headerRow.querySelectorAll('th'))
    .map(th => th.textContent.trim());
  console.log('Table headers:', headers);
}
```

---

**Example 4: Scroll to the First Error**

```javascript
function scrollToFirstError() {
  const errorFields = Collections.ClassName['error-field'];
  const first = errorFields.first();

  if (first) {
    first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    first.focus();
    console.log('Scrolled to first error field');
  } else {
    console.log('No error fields found');
  }
}
```

---

## 2. last() — Get the Last Element

Returns the last element in the collection, or `undefined` if the collection is empty.

### Syntax

```javascript
collection.last()
// Returns: last element or undefined
```

---

### Basic Usage

```javascript
const items = Collections.ClassName.item;

const lastItem = items.last();

if (lastItem) {
  console.log('Last item:', lastItem.textContent);
  lastItem.scrollIntoView(); // Scroll to it
}
```

---

### last() vs [length - 1]

```javascript
const items = Collections.ClassName.item;

// Both get the last item
const a = items[items.length - 1];  // Verbose index arithmetic
const b = items.last();              // Clean, self-documenting

// Or with at():
const c = items.at(-1);             // Also clean (negative index)
```

All three are equivalent. `last()` is the most readable; `at(-1)` is useful when you want to be consistent with other negative index accesses.

---

### Examples

**Example 1: Scroll to Last Added Item**

```javascript
function addItemAndScroll(content) {
  // Add a new item to the container
  const container = Elements.itemContainer;
  const newItem = document.createElement('div');
  newItem.className = 'item';
  newItem.textContent = content;
  container.appendChild(newItem);

  // Get fresh collection and scroll to the new item (which is now last)
  const items = Collections.ClassName.item; // Fresh access to include new item
  const last = items.last();

  if (last) {
    last.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    last.classList.add('new-item');
    console.log('Scrolled to new item:', content);
  }
}
```

---

**Example 2: Highlight the Most Recently Updated Row**

```javascript
function highlightLatest() {
  const rows = Collections.ClassName['table-row'];
  const last = rows.last();

  if (last) {
    // Remove highlight from all
    rows.removeClass('highlight');
    rows.forEach(row => row.removeAttribute('data-latest'));

    // Highlight the last one
    last.classList.add('highlight');
    last.setAttribute('data-latest', 'true');
    last.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    console.log('Highlighted latest row');
  }
}
```

---

**Example 3: Insert After the Last Item**

```javascript
function appendAfterLast(newContent) {
  const items = Collections.ClassName.item;
  const last = items.last();
  const container = Elements.itemContainer;

  const newItem = document.createElement('div');
  newItem.className = 'item';
  newItem.innerHTML = newContent;

  if (last) {
    // Insert after the last item
    last.insertAdjacentElement('afterend', newItem);
    console.log('Appended after last item');
  } else {
    // Collection is empty — just append to container
    container.appendChild(newItem);
    console.log('Collection was empty — appended to container');
  }
}
```

---

## 3. at(index) — Get Element by Index (with Negative Support)

Returns the element at a specific position. Supports **negative indices** — `-1` means last, `-2` means second to last, and so on.

### Syntax

```javascript
collection.at(index)
// Returns: element at that position, or undefined if out of range
```

**Parameters:**
- `index` (number) — Position (0-based for positive, counted from end for negative)

---

### Understanding Negative Indices

```javascript
const items = Collections.ClassName.item;
// Assume items = [A, B, C, D, E]  (5 items)

// Positive indices (from start)
items.at(0);   // A  (first)
items.at(1);   // B  (second)
items.at(2);   // C  (third)
items.at(3);   // D  (fourth)
items.at(4);   // E  (fifth / last)

// Negative indices (from end)
items.at(-1);  // E  (last)
items.at(-2);  // D  (second to last)
items.at(-3);  // C  (third to last)
items.at(-4);  // B  (fourth to last)
items.at(-5);  // A  (fifth to last / first)

// Out of range — returns undefined
items.at(5);   // undefined
items.at(-6);  // undefined
```

**Visual representation:**

```
Index:    0    1    2    3    4
         [A]  [B]  [C]  [D]  [E]
          -5   -4   -3   -2   -1
```

---

### Basic Usage

```javascript
const buttons = Collections.ClassName.btn;

// Positive index
const second = buttons.at(1);
const third = buttons.at(2);

// Negative index
const last = buttons.at(-1);
const secondToLast = buttons.at(-2);

// Safe access with optional chaining
buttons.at(2)?.classList.add('selected');
buttons.at(-1)?.scrollIntoView();
```

---

### Examples

**Example 1: Carousel — Next and Previous**

```javascript
class Carousel {
  constructor() {
    this.slides = Collections.ClassName.slide;
    this.currentIndex = 0;
  }

  show(index) {
    const slide = this.slides.at(index);
    if (!slide) return;

    this.slides.removeClass('active');
    slide.classList.add('active');
    this.currentIndex = index;

    console.log(`Showing slide ${index + 1} of ${this.slides.length}`);
  }

  next() {
    const nextIndex = this.currentIndex + 1;

    if (nextIndex < this.slides.length) {
      this.show(nextIndex);
    } else {
      this.show(0); // Loop back to first
    }
  }

  prev() {
    const prevIndex = this.currentIndex - 1;

    if (prevIndex >= 0) {
      this.show(prevIndex);
    } else {
      this.show(-1); // Loop to last (negative index!) ✨
    }
  }

  showLast() {
    this.show(-1); // Clean syntax for last slide
  }
}
```

**What's happening in `prev()`:** When we're at index 0 and go back, we want the last slide. `this.show(-1)` passes the negative index to `at(-1)`, which returns the last element cleanly — no `length - 1` math needed.

---

**Example 2: Access Middle Element**

```javascript
function scrollToMiddle() {
  const items = Collections.ClassName.item;

  if (items.isEmpty()) return;

  const middleIndex = Math.floor(items.length / 2);
  const middle = items.at(middleIndex);

  if (middle) {
    middle.scrollIntoView({ behavior: 'smooth', block: 'center' });
    middle.classList.add('highlighted');
    console.log(`Scrolled to middle item (index ${middleIndex})`);
  }
}
```

---

**Example 3: Pagination Display**

```javascript
class Paginator {
  constructor(itemClass, itemsPerPage = 10) {
    this.items = Collections.ClassName[itemClass];
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 0;
  }

  getPageItems() {
    const start = this.currentPage * this.itemsPerPage;
    const pageItems = [];

    for (let i = 0; i < this.itemsPerPage; i++) {
      const item = this.items.at(start + i);
      if (item) pageItems.push(item);
      else break; // No more items
    }

    return pageItems;
  }

  showPage(pageNum) {
    const totalPages = Math.ceil(this.items.length / this.itemsPerPage);
    if (pageNum < 0 || pageNum >= totalPages) return;

    // Hide all items
    this.items.addClass('hidden');

    // Show only the items for this page
    this.currentPage = pageNum;
    const pageItems = this.getPageItems();
    pageItems.forEach(item => item.classList.remove('hidden'));

    console.log(`Page ${pageNum + 1} of ${totalPages} (${pageItems.length} items)`);
  }

  get totalPages() {
    return Math.ceil(this.items.length / this.itemsPerPage);
  }
}
```

---

**Example 4: Every Nth Element**

```javascript
const items = Collections.ClassName.item;

// Get every 3rd item (indices 0, 3, 6, 9...)
const everyThird = [];
for (let i = 0; i < items.length; i += 3) {
  const item = items.at(i);
  if (item) everyThird.push(item);
}

// Highlight them
everyThird.forEach(item => item.classList.add('featured'));
console.log(`Highlighted ${everyThird.length} featured items`);
```

---

## 4. isEmpty() — Check if the Collection Is Empty

Returns `true` if the collection has zero elements, `false` otherwise.

### Syntax

```javascript
collection.isEmpty()
// Returns: boolean
```

---

### Basic Usage

```javascript
const items = Collections.ClassName.item;

if (items.isEmpty()) {
  console.log('No items found');
  showEmptyState();
} else {
  console.log(`Found ${items.length} items`);
  showItems();
}
```

---

### isEmpty() vs length === 0

```javascript
const items = Collections.ClassName.item;

// Both check the same thing
const a = items.length === 0;     // Works
const b = items.isEmpty();        // Same result, clearer intent

// isEmpty() reads like natural language:
if (items.isEmpty()) { ... }
// vs the slightly more technical:
if (items.length === 0) { ... }
```

---

### Examples

**Example 1: Conditional UI — Show Empty State**

```javascript
function updateContentArea() {
  const cards = Collections.ClassName.card;
  const emptyState = Elements.emptyState;
  const cardsGrid = Elements.cardsGrid;

  if (cards.isEmpty()) {
    // No cards — show the empty state
    emptyState.style.display = 'flex';
    cardsGrid.style.display = 'none';
    console.log('Showing empty state');
  } else {
    // Cards exist — show them
    emptyState.style.display = 'none';
    cardsGrid.style.display = 'grid';
    console.log(`Showing ${cards.length} cards`);
  }
}

// Update UI after any data change
updateContentArea();
```

---

**Example 2: Guard Before Processing**

```javascript
function processAllItems() {
  const items = Collections.ClassName.item;

  // Guard: don't proceed if there's nothing to process
  if (items.isEmpty()) {
    console.warn('Nothing to process — collection is empty');
    return;
  }

  console.log(`Processing ${items.length} items...`);

  items.forEach((item, index) => {
    processItem(item);
    console.log(`  Processed item ${index + 1}/${items.length}`);
  });

  console.log('All items processed');
}
```

---

**Example 3: Validate a Selection Exists**

```javascript
function validateAtLeastOneSelected() {
  const selected = Collections.ClassName.selected;

  if (selected.isEmpty()) {
    showError('Please select at least one item to continue');
    return false;
  }

  console.log(`${selected.length} items selected — proceeding`);
  return true;
}

// On submit
Elements.submitBtn.addEventListener('click', () => {
  if (validateAtLeastOneSelected()) {
    processSelection();
  }
});
```

---

**Example 4: Check Search Results**

```javascript
function displaySearchResults(query) {
  const results = Collections.ClassName['search-result'];
  const container = Elements.resultsContainer;
  const noResultsMsg = Elements.noResults;
  const resultsCount = Elements.resultsCount;

  if (results.isEmpty()) {
    noResultsMsg.textContent = `No results found for "${query}"`;
    noResultsMsg.style.display = 'block';
    container.style.display = 'none';
    resultsCount.textContent = '0 results';
  } else {
    noResultsMsg.style.display = 'none';
    container.style.display = 'block';
    resultsCount.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;
  }
}
```

---

## 5. item(index) — Legacy Index Access

Returns the element at a specific index. Returns `null` if the index is out of range (instead of `undefined`). This method matches the behavior of the native `HTMLCollection.item()` method.

### Syntax

```javascript
collection.item(index)
// Returns: element at index, or null if not found
```

---

### When to Use item()

`item()` exists for **compatibility with code that expects the HTMLCollection interface**. If you're writing new code, prefer `at()` for its cleaner syntax and negative index support.

```javascript
const buttons = Collections.ClassName.btn;

// Legacy style — still works
const first = buttons.item(0);
const second = buttons.item(1);
const last = buttons.item(buttons.length - 1);

// Modern style — preferred for new code
const first = buttons.first();
const second = buttons.at(1);
const last = buttons.last();  // or buttons.at(-1)
```

---

### item() vs at()

| | `item(index)` | `at(index)` |
|-|---------------|-------------|
| Negative indices | ❌ Not supported | ✅ Supported |
| Out of range | Returns `null` | Returns `undefined` |
| Modern API | No | Yes |
| Use when... | Legacy code / compatibility | New code |

---

### Example: Adapting Legacy Code

```javascript
// Old code using item() — still works
const items = Collections.ClassName.item;
const third = items.item(2);
if (third !== null) {
  third.classList.add('selected');
}

// New code — preferred
const third = items.at(2);
third?.classList.add('selected'); // Optional chaining handles undefined
```

---

## 6. namedItem(name) — Get Element by Name Attribute

Searches the collection for the first element whose `name` attribute matches the given string. Returns `null` if not found.

### Syntax

```javascript
collection.namedItem('attributeName')
// Returns: matching element or null
```

---

### Basic Usage

```javascript
const inputs = Collections.TagName.input;

// Find the input with name="email"
const emailInput = inputs.namedItem('email');

if (emailInput) {
  console.log('Email value:', emailInput.value);
  emailInput.focus();
}
```

---

### When to Use namedItem()

`namedItem()` is useful when you have a **collection of form inputs** and want to look up a specific one by its `name` attribute — without using `find()`.

```javascript
const inputs = Collections.TagName.input;

// Using namedItem() — concise
const emailInput = inputs.namedItem('email');

// Using find() — equivalent, more explicit
const emailInput = inputs.find(input => input.name === 'email');

// Both work — namedItem() is more concise for this specific case
```

---

### Examples

**Example 1: Access Specific Form Fields**

```javascript
function getFormField(fieldName) {
  const inputs = Collections.TagName.input;
  const selects = Collections.TagName.select;
  const textareas = Collections.TagName.textarea;

  // Search each collection for the field
  return (
    inputs.namedItem(fieldName) ||
    selects.namedItem(fieldName) ||
    textareas.namedItem(fieldName) ||
    null
  );
}

// Usage
const emailField = getFormField('email');
if (emailField) {
  console.log('Email:', emailField.value);
  emailField.style.borderColor = '#10b981'; // Green border
}

const cityField = getFormField('city');
if (cityField) {
  cityField.value = 'New York'; // Pre-fill
}
```

---

**Example 2: Pre-fill Known Fields**

```javascript
function prefillForm(userData) {
  const inputs = Collections.TagName.input;

  // For each key in userData, find the matching input and set its value
  Object.entries(userData).forEach(([fieldName, value]) => {
    const field = inputs.namedItem(fieldName);
    if (field) {
      field.value = value;
      console.log(`Pre-filled "${fieldName}" with "${value}"`);
    } else {
      console.warn(`Field "${fieldName}" not found in form`);
    }
  });
}

// Usage
prefillForm({
  username: 'alice',
  email: 'alice@example.com',
  phone: '555-1234'
});
```

---

**Example 3: Validate a Specific Field by Name**

```javascript
function validateField(fieldName) {
  const inputs = Collections.TagName.input;
  const field = inputs.namedItem(fieldName);

  if (!field) {
    console.warn(`Field "${fieldName}" not found`);
    return null;
  }

  const isValid = field.validity.valid;

  if (!isValid) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    console.error(`Field "${fieldName}" is invalid: ${field.validationMessage}`);
  } else {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    console.log(`Field "${fieldName}" is valid`);
  }

  return isValid;
}

validateField('email');
validateField('password');
```

---

## Combining Utility Methods

Utility methods work naturally together:

```javascript
const items = Collections.ClassName.item;

// Guard: only proceed if there are items
if (!items.isEmpty()) {
  // Get and process specific elements
  const first = items.first();
  const last = items.last();
  const middle = items.at(Math.floor(items.length / 2));

  // Mark them
  first?.classList.add('first');
  last?.classList.add('last');
  middle?.classList.add('middle');

  console.log(`Marked ${items.length} items: first, middle at ${Math.floor(items.length / 2)}, last`);
}
```

---

## Real-World Patterns

### Pattern 1: List Navigator

```javascript
class ListNavigator {
  constructor(itemClass) {
    this.items = Collections.ClassName[itemClass];
    this.currentIndex = 0;
  }

  get hasItems() {
    return !this.items.isEmpty();
  }

  get total() {
    return this.items.length;
  }

  getCurrent() {
    return this.items.at(this.currentIndex);
  }

  goFirst() {
    if (!this.hasItems) return null;
    this.currentIndex = 0;
    return this.items.first();
  }

  goLast() {
    if (!this.hasItems) return null;
    this.currentIndex = this.items.length - 1;
    return this.items.last();
  }

  goNext() {
    if (!this.hasItems) return null;
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    return this.getCurrent();
  }

  goPrev() {
    if (!this.hasItems) return null;
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    return this.getCurrent();
  }

  goTo(index) {
    if (!this.hasItems) return null;
    const item = this.items.at(index);
    if (item) {
      this.currentIndex = index < 0
        ? this.items.length + index
        : index;
    }
    return item;
  }
}

// Usage
const navigator = new ListNavigator('slide');
navigator.goFirst()?.classList.add('active');

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') navigator.goNext()?.scrollIntoView();
  if (e.key === 'ArrowLeft') navigator.goPrev()?.scrollIntoView();
  if (e.key === 'Home') navigator.goFirst()?.scrollIntoView();
  if (e.key === 'End') navigator.goLast()?.scrollIntoView();
});
```

---

### Pattern 2: Range Selector

```javascript
class RangeSelector {
  constructor(itemClass) {
    this.items = Collections.ClassName[itemClass];
  }

  selectRange(startIndex, endIndex) {
    if (this.items.isEmpty()) return;

    // Normalize negative indices
    const total = this.items.length;
    const start = startIndex < 0 ? total + startIndex : startIndex;
    const end = endIndex < 0 ? total + endIndex : endIndex;
    const from = Math.min(start, end);
    const to = Math.max(start, end);

    // Clear previous selection
    this.items.removeClass('selected');

    // Select the range
    for (let i = from; i <= to; i++) {
      const item = this.items.at(i);
      if (item) item.classList.add('selected');
    }

    console.log(`Selected items from index ${from} to ${to}`);
  }

  selectFirst() {
    if (this.items.isEmpty()) return;
    this.items.removeClass('selected');
    this.items.first()?.classList.add('selected');
  }

  selectLast() {
    if (this.items.isEmpty()) return;
    this.items.removeClass('selected');
    this.items.last()?.classList.add('selected');
  }

  getSelected() {
    return this.items.filter(item => item.classList.contains('selected'));
  }
}

// Usage
const selector = new RangeSelector('row');
selector.selectRange(0, 4);      // Select first 5
selector.selectRange(-3, -1);    // Select last 3 (negative indices!)
console.log('Selected:', selector.getSelected().length);
```

---

### Pattern 3: Conditional UI Manager

```javascript
class ContentManager {
  constructor(itemClass) {
    this.items = Collections.ClassName[itemClass];
    this.emptyStateEl = Elements.emptyState;
    this.loadingEl = Elements.loadingSpinner;
    this.contentEl = Elements.contentContainer;
  }

  refresh() {
    // Re-access to get fresh collection
    this.items = Collections.ClassName[this.itemClass];
  }

  updateUI() {
    if (this.items.isEmpty()) {
      this.showEmptyState();
    } else {
      this.showContent();
    }
  }

  showEmptyState() {
    this.emptyStateEl.style.display = 'flex';
    this.contentEl.style.display = 'none';
    this.loadingEl.style.display = 'none';
    console.log('Empty state shown');
  }

  showContent() {
    this.emptyStateEl.style.display = 'none';
    this.contentEl.style.display = 'block';
    this.loadingEl.style.display = 'none';

    // Scroll to most recently added (last) item
    this.items.last()?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    console.log(`Content shown: ${this.items.length} items`);
  }

  showLoading() {
    this.emptyStateEl.style.display = 'none';
    this.contentEl.style.display = 'none';
    this.loadingEl.style.display = 'flex';
  }
}
```

---

## Best Practices

### ✅ Always Check Before Using

```javascript
// Good — check for undefined before accessing properties
const first = items.first();
if (first) {
  first.focus();
  first.classList.add('active');
}

// Or use optional chaining for one-liners
items.first()?.focus();
items.at(2)?.classList.add('selected');
```

### ✅ Use isEmpty() for Clarity

```javascript
// Clear intent
if (items.isEmpty()) {
  showEmptyState();
  return;
}

// Process items knowing the collection is non-empty
const first = items.first();
// ... no need for null check — we know it exists
```

### ✅ Use Negative Indices with at() for "from end" access

```javascript
// Clean syntax for accessing from the end
const last = items.at(-1);          // Last
const secondLast = items.at(-2);    // Second to last
const thirdLast = items.at(-3);     // Third to last

// Better than the verbose alternative:
const last = items[items.length - 1];
const secondLast = items[items.length - 2];
```

### ✅ Prefer Modern Methods for New Code

```javascript
// Modern — expressive and feature-rich
const first = items.first();
const last = items.last();
const third = items.at(2);
const lastThird = items.at(-3);

// Legacy — still valid but less expressive
const first = items.item(0);
const last = items.item(items.length - 1);
// (item() doesn't support negative indices)
```

### ❌ Don't Assume Elements Exist

```javascript
// ❌ Dangerous — may throw if collection is empty
items.first().focus();        // TypeError if undefined
items.at(5).textContent;      // TypeError if out of range

// ✅ Safe access
items.first()?.focus();       // Optional chaining
const el = items.at(5);
if (el) el.textContent = '...';
```

---

## Key Takeaways

1. **first()** — Get the first element (cleaner than `[0]`, returns `undefined` if empty)
2. **last()** — Get the last element (cleaner than `[length-1]`, returns `undefined` if empty)
3. **at(index)** — Get by index with negative index support (`-1` = last, `-2` = second to last)
4. **isEmpty()** — Check if collection has zero elements (cleaner than `length === 0`)
5. **item(index)** — Legacy method for compatibility; prefer `at()` for new code
6. **namedItem(name)** — Find form element by its `name` attribute
7. **Always check** — `first()`, `last()`, and `at()` return `undefined` for empty/out-of-range; check before using
8. **Use isEmpty() as a guard** — call it before accessing elements to avoid errors

---

## What's Next?

Now let's explore the advanced helper methods for cache management, batch operations, and configuration:

- **stats()** — Monitor cache performance
- **clear()** — Manually reset the cache
- **destroy()** — Full cleanup
- **isCached()** — Check cache status
- **getMultiple()** — Get multiple collections at once
- **waitFor()** — Wait for dynamically loaded elements
- **configure()** — Customize Collections behavior

Continue to **Helper Methods** →