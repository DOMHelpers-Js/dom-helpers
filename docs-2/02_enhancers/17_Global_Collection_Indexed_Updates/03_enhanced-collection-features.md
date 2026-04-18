[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Enhanced Collection Features

## Quick Start (30 seconds)

```javascript
const buttons = ClassName.btn;

// Index access — each element auto-enhanced with .update()
buttons[0].update({ textContent: 'First' });

// Array methods
buttons.forEach((btn, i) => console.log(i, btn.textContent));
const texts = buttons.map(btn => btn.textContent);
const active = buttons.filter(btn => !btn.disabled);

// Iteration
for (const btn of buttons) {
  console.log(btn.textContent);
}
```

---

## What Gets Added to Collections?

When this module wraps a collection, it creates an **enhanced collection object** with several features beyond the indexed `.update()` method:

```
Enhanced Collection
├── .update({...})   — Bulk + indexed update
├── .length          — Number of elements
├── [0], [1], ...    — Index access (auto-enhanced)
├── .forEach()       — Execute for each element
├── .map()           — Transform elements
├── .filter()        — Filter elements
├── for...of         — Iterator support
└── _hasIndexedUpdateSupport — Enhancement flag
```

---

## Index Access

You can access individual elements by numeric index. Each element is **automatically enhanced** with `.update()`:

```javascript
const cards = ClassName.card;

// Access by index
cards[0].update({ textContent: 'First Card' });
cards[1].update({ style: { color: 'blue' } });

// Last element
cards[cards.length - 1].update({ classList: { add: ['last'] } });
```

If the `EnhancedUpdateUtility` is available, each element accessed by index gets the `.update()` method automatically — no manual enhancement needed.

---

## Array Methods

### .forEach(callback)

Execute a function for each element in the collection:

```javascript
ClassName.card.forEach((card, index) => {
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
const texts = ClassName.btn.map(btn => btn.textContent);
console.log(texts);  // ['Save', 'Cancel', 'Reset']

// Get all data attributes
const ids = ClassName.card.map(card => card.dataset.id);
console.log(ids);  // ['1', '2', '3']
```

### .filter(callback)

Get only elements that match a condition:

```javascript
// Get only enabled buttons
const enabled = ClassName.btn.filter(btn => !btn.disabled);
console.log(enabled.length);  // Number of enabled buttons

// Get only visible items
const visible = ClassName.item.filter(item => !item.hidden);
```

---

## Iteration

Enhanced collections work with `for...of` loops and the spread operator:

### for...of

```javascript
for (const card of ClassName.card) {
  card.update({ style: { margin: '8px' } });
}
```

### Spread Operator

```javascript
const elements = [...ClassName.btn];
console.log(Array.isArray(elements));  // true
```

---

## Combining Array Methods with Indexed Updates

You can use array methods to process the collection and indexed updates for specific targeting:

```javascript
// Use forEach for logic-driven updates
ClassName.card.forEach((card, i) => {
  if (i % 2 === 0) {
    card.update({ style: { backgroundColor: '#f9f9f9' } });
  }
});

// Use .update() for known positions
ClassName.card.update({
  style: { padding: '16px' },
  [0]: { classList: { add: ['first'] } },
  [-1]: { classList: { add: ['last'] } }
});
```

---

## The .length Property

Access the number of elements in the collection:

```javascript
const buttons = ClassName.btn;
console.log(buttons.length);  // 5

if (buttons.length === 0) {
  console.log('No buttons found');
}
```

---

## Auto-Enhancement of Individual Elements

When you access an element by index (`collection[0]`, `collection[1]`, etc.), the module automatically enhances it with `.update()` if `EnhancedUpdateUtility` is available:

```javascript
const firstCard = ClassName.card[0];

// .update() is already available — no manual enhancement needed
firstCard.update({
  textContent: 'Enhanced Card',
  style: { color: 'blue' },
  classList: { add: ['highlight'] }
});
```

---

## Summary

| Feature | Description |
|---------|-------------|
| `.update({...})` | Bulk + indexed updates on the collection |
| `[index]` | Access element by position (auto-enhanced) |
| `.length` | Number of elements |
| `.forEach()` | Execute callback for each element |
| `.map()` | Transform each element into a new value |
| `.filter()` | Get elements matching a condition |
| `for...of` | Iterate with a loop |
| `[...collection]` | Spread into an array |

> **Simple Rule to Remember:** Enhanced collections from `ClassName`, `TagName`, and `Name` behave like arrays — you get `.forEach()`, `.map()`, `.filter()`, and `for...of` out of the box. Every element accessed by index is auto-enhanced with `.update()`.