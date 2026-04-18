[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Enhanced Collections — Array Methods on queryAll() Results

## Quick Start (30 seconds)

```javascript
const items = queryAll('.item');

// Array methods — built in
items.forEach(el => console.log(el.textContent));
items.map(el => el.dataset.id);
items.filter(el => !el.classList.contains('hidden'));
items.find(el => el.dataset.id === '42');

// Navigation helpers
items.first();       // First element
items.last();        // Last element
items.at(-1);        // Last element (negative index)
items.isEmpty();     // true if no elements
items.toArray();     // Convert to real Array
```

---

## What Are Enhanced Collections?

When you call `queryAll()` or `queryAllWithin()`, you don't get a raw browser `NodeList`. Instead, you get an **enhanced collection** — a wrapper that adds:

1. **Array methods** — `.forEach()`, `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, `.reduce()`
2. **Navigation helpers** — `.first()`, `.last()`, `.at()`, `.isEmpty()`
3. **Collection .update()** — update all elements at once
4. **Index access** — `collection[0]`, `collection[1]`, etc.
5. **Iteration** — works with `for...of` and spread `[...]`

Simply put, enhanced collections behave like **arrays with superpowers**.

---

## Why Enhanced Collections?

### The Problem with Raw NodeLists

Browser's `querySelectorAll()` returns a `NodeList`, which is missing many useful array methods:

```javascript
// ❌ Raw NodeList — limited methods
const items = document.querySelectorAll('.item');
items.map(el => el.textContent);      // ERROR — .map() doesn't exist
items.filter(el => el.disabled);      // ERROR — .filter() doesn't exist
items.find(el => el.id === 'main');   // ERROR — .find() doesn't exist

// You have to convert to array first
Array.from(items).map(el => el.textContent);  // Works but verbose
```

### Enhanced Collections — It Just Works

```javascript
// ✅ Enhanced collection — array methods built in
const items = queryAll('.item');
items.map(el => el.textContent);      // ✅ Works directly
items.filter(el => el.disabled);      // ✅ Works directly
items.find(el => el.id === 'main');   // ✅ Works directly
```

---

## Array Methods

Every enhanced collection has these standard array methods. All elements passed to callbacks are **auto-enhanced** with `.update()`.

### .forEach(callback)

Execute a function for each element:

```javascript
queryAll('.card').forEach((card, index) => {
  card.update({
    textContent: `Card ${index + 1}`,
    dataset: { position: String(index) }
  });
});
```

### .map(callback)

Create a new array by transforming each element:

```javascript
// Get all text contents
const texts = queryAll('.item').map(el => el.textContent);
console.log(texts);  // ["Item 1", "Item 2", "Item 3"]

// Get all data attributes
const ids = queryAll('.card').map(el => el.dataset.id);
console.log(ids);  // ["1", "2", "3"]
```

### .filter(callback)

Get only elements that match a condition:

```javascript
// Get only active items
const active = queryAll('.item')
  .filter(el => el.classList.contains('active'));

console.log(active.length);  // Number of active items

// Get only visible inputs
const visible = queryAll('input')
  .filter(el => !el.hidden);
```

### .find(callback)

Find the first element that matches a condition:

```javascript
// Find the element with a specific data attribute
const target = queryAll('.card')
  .find(el => el.dataset.id === '42');

if (target) {
  target.update({ classList: { add: ['highlighted'] } });
}
```

### .some(callback)

Check if **at least one** element matches:

```javascript
const hasDisabled = queryAll('.btn')
  .some(el => el.disabled);

console.log(hasDisabled);  // true or false
```

### .every(callback)

Check if **all** elements match:

```javascript
const allValid = queryAll('.form-input')
  .every(el => el.value.trim() !== '');

console.log(allValid);  // true if all inputs have values
```

### .reduce(callback, initialValue)

Accumulate a value across all elements:

```javascript
// Sum all prices
const total = queryAll('.product')
  .reduce((sum, el) => sum + parseFloat(el.dataset.price), 0);

console.log(total);  // e.g., 149.97

// Collect all IDs
const allIds = queryAll('.card')
  .reduce((ids, el) => [...ids, el.id], []);

console.log(allIds);  // ["card1", "card2", "card3"]
```

---

## Navigation Helpers

### .first()

Returns the first element (enhanced), or `null` if empty:

```javascript
const first = queryAll('.item').first();
first.update({ classList: { add: ['first-item'] } });
```

### .last()

Returns the last element (enhanced), or `null` if empty:

```javascript
const last = queryAll('.item').last();
last.update({ classList: { add: ['last-item'] } });
```

### .at(index)

Returns the element at a specific index. Supports **negative indices**:

```javascript
const items = queryAll('.item');

items.at(0);    // First element
items.at(1);    // Second element
items.at(-1);   // Last element
items.at(-2);   // Second to last
```

Returns `null` if the index is out of range:

```javascript
items.at(999);  // null
items.at(-999); // null
```

### .isEmpty()

Returns `true` if the collection has no elements:

```javascript
const results = queryAll('.search-result');

if (results.isEmpty()) {
  query('#noResults').update({ hidden: false });
} else {
  results.forEach(r => r.update({ hidden: false }));
}
```

### .toArray()

Converts the collection to a real JavaScript `Array`:

```javascript
const arr = queryAll('.item').toArray();
console.log(Array.isArray(arr));  // true

// Useful when you need actual Array methods not on the collection
arr.sort((a, b) => a.textContent.localeCompare(b.textContent));
```

---

## Index Access

You can access elements by numeric index directly:

```javascript
const cards = queryAll('.card');

cards[0]    // First card (enhanced with .update())
cards[1]    // Second card
cards[2]    // Third card

cards[0].update({ textContent: 'First Card' });
```

---

## Iteration

Enhanced collections work with `for...of` loops and the spread operator:

### for...of

```javascript
for (const card of queryAll('.card')) {
  card.update({ style: { margin: '8px' } });
}
```

### Spread Operator

```javascript
const elements = [...queryAll('.item')];
console.log(Array.isArray(elements));  // true
```

---

## Collection .update()

The collection itself has an `.update()` method that applies updates to **all elements at once**:

```javascript
// Update every .card element
queryAll('.card').update({
  style: { padding: '16px', borderRadius: '8px' },
  classList: { add: ['shadow'] }
});
```

This is equivalent to:

```javascript
queryAll('.card').forEach(card => {
  card.update({
    style: { padding: '16px', borderRadius: '8px' },
    classList: { add: ['shadow'] }
  });
});
```

---

## Real-World Examples

### Example 1: Filter and Highlight

```javascript
// Highlight all products over $50
queryAll('.product')
  .filter(el => parseFloat(el.dataset.price) > 50)
  .forEach(el => {
    el.update({
      classList: { add: ['premium'] },
      style: { borderColor: 'gold' }
    });
  });
```

### Example 2: Collect Form Data

```javascript
// Get all form field values as an object
const formData = queryAll('#myForm input').reduce((data, input) => {
  data[input.name] = input.value;
  return data;
}, {});

console.log(formData);
// { username: "Alice", email: "alice@example.com", ... }
```

### Example 3: Check If All Fields Valid

```javascript
const allFilled = queryAll('.required-field')
  .every(field => field.value.trim() !== '');

if (allFilled) {
  query('#submitBtn').update({ disabled: false });
} else {
  query('#submitBtn').update({ disabled: true });
}
```

---

## Summary

| Category | Methods |
|----------|---------|
| **Array methods** | `.forEach()`, `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, `.reduce()` |
| **Navigation** | `.first()`, `.last()`, `.at(index)`, `.isEmpty()`, `.toArray()` |
| **Bulk update** | `.update({...})` — applies to all elements |
| **Index access** | `collection[0]`, `collection[1]`, etc. |
| **Iteration** | `for...of`, spread `[...]` |

> **Simple Rule to Remember:** Enhanced collections from `queryAll()` work like arrays — you get `.forEach()`, `.map()`, `.filter()`, and `.find()` out of the box. Every element inside is auto-enhanced with `.update()`. Use `.first()`, `.last()`, and `.at(-1)` for quick access to specific positions.