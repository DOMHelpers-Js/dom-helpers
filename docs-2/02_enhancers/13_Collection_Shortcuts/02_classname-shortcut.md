[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# ClassName — Access Elements by Class Name

## Quick Start (30 seconds)

```javascript
// Get all elements with class "btn"
const buttons = ClassName.btn;
console.log(buttons.length);  // Number of .btn elements

// Get specific elements
ClassName.btn[0]    // First button
ClassName.btn[1]    // Second button
ClassName.btn[-1]   // Last button

// Update the first button
ClassName.btn[0].update({
  textContent: "Click Me",
  style: { backgroundColor: "blue" }
});
```

---

## What is ClassName?

`ClassName` is a **global shortcut** for `Collections.ClassName`. It returns all elements that have a specific CSS class, and lets you pick individual elements by index.

Simply put, `ClassName.btn` finds every element on the page that has `class="btn"` (or includes `btn` in its class list).

---

## Syntax

```javascript
// Dot notation — for simple class names
ClassName.btn                    // All elements with class "btn"
ClassName.card                   // All elements with class "card"
ClassName.active                 // All elements with class "active"

// Bracket notation — for class names with special characters
ClassName['nav-item']            // Class name with a dash
ClassName['container fluid']     // Multiple classes (space-separated)
ClassName['btn.btn-primary']     // Multiple classes (dot notation)

// Function call — alternative syntax
ClassName('btn')                 // Same as ClassName.btn
```

**Returns:** A collection (like an array of elements), enhanced with index support and negative indices.

---

## Dot Notation vs Bracket Notation

| Syntax | Use When | Example |
|--------|---------|---------|
| `ClassName.btn` | Simple class names (letters, numbers) | `ClassName.card`, `ClassName.active` |
| `ClassName['nav-item']` | Class names with dashes or special characters | `ClassName['btn-primary']` |
| `ClassName['a b']` | Multiple classes (space-separated) | `ClassName['container fluid']` |

```javascript
// ✅ Simple class name — dot notation works
ClassName.btn

// ❌ Dashes break dot notation — use brackets
// ClassName.nav-item    ← JavaScript reads this as ClassName.nav minus item
ClassName['nav-item']    // ✅ Correct

// ✅ Multiple classes — use brackets with spaces
ClassName['container fluid']   // Elements that have BOTH classes
```

---

## Basic Examples

### Get All Elements of a Class

```javascript
const cards = ClassName.card;
console.log(cards.length);  // e.g., 5

// The collection behaves like an array
cards.forEach((card, index) => {
  console.log(`Card ${index}:`, card.textContent);
});
```

### Access by Index

```javascript
const buttons = ClassName.btn;

buttons[0]    // First .btn element
buttons[1]    // Second .btn element
buttons[2]    // Third .btn element
buttons[-1]   // Last .btn element
buttons[-2]   // Second to last .btn element
```

### Update Specific Elements

```javascript
// Update the first card
ClassName.card[0].update({
  textContent: "Featured Card",
  style: { border: "2px solid gold" }
});

// Update the last card
ClassName.card[-1].update({
  textContent: "See More...",
  style: { opacity: "0.7" }
});
```

---

## Class Names with Dashes

Many CSS frameworks use dashed class names. Use bracket notation:

```javascript
// Bootstrap-style classes
ClassName['btn-primary']         // All primary buttons
ClassName['btn-primary'][0]      // First primary button

ClassName['nav-link']            // All nav links
ClassName['nav-link'][-1]        // Last nav link

ClassName['card-body']           // All card bodies
ClassName['alert-success']       // All success alerts
```

---

## Multiple Classes

To find elements that have **multiple classes**, separate them with a space inside brackets:

```javascript
// Find elements with BOTH "btn" AND "primary" classes
ClassName['btn primary']

// Find elements with BOTH "container" AND "fluid" classes
ClassName['container fluid']
```

You can also use dot notation inside brackets:

```javascript
// Same as above — dots are converted to spaces
ClassName['btn.primary']
ClassName['container.fluid']
```

---

## Real-World Examples

### Example 1: Style a Button Group

```javascript
const buttons = ClassName.btn;

// Style the first, middle, and last differently
buttons[0].update({
  textContent: "Success",
  style: { backgroundColor: "green", color: "white" }
});

buttons[1].update({
  textContent: "Info",
  style: { backgroundColor: "blue", color: "white" }
});

buttons[-1].update({
  textContent: "Danger",
  style: { backgroundColor: "red", color: "white" }
});
```

### Example 2: Alternate Row Colors

```javascript
const rows = ClassName['table-row'];

for (let i = 0; i < rows.length; i++) {
  rows[i].update({
    style: {
      backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9"
    }
  });
}
```

### Example 3: Highlight Active Navigation

```javascript
function setActiveNavItem(index) {
  const navItems = ClassName['nav-item'];

  // Remove active from all
  navItems.forEach(item => {
    item.update({
      classList: { remove: ['active'] }
    });
  });

  // Add active to the selected one
  navItems[index].update({
    classList: { add: ['active'] }
  });
}

setActiveNavItem(2);  // Third nav item becomes active
```

### Example 4: Card Grid Setup

```javascript
const cards = ClassName.card;

// Make the first card featured
cards[0].update({
  style: { gridColumn: "span 2", border: "2px solid gold" },
  classList: { add: ['featured'] }
});

// Add data attributes to all cards
cards.forEach((card, i) => {
  card.update({
    dataset: { cardIndex: String(i) }
  });
});
```

### Example 5: Form Field Validation

```javascript
const fields = ClassName['form-field'];

function validateField(index) {
  const field = fields[index];
  const value = field.value.trim();

  if (value === '') {
    field.update({
      style: { borderColor: "red" },
      classList: { add: ['invalid'], remove: ['valid'] }
    });
    return false;
  } else {
    field.update({
      style: { borderColor: "green" },
      classList: { add: ['valid'], remove: ['invalid'] }
    });
    return true;
  }
}
```

---

## Empty Collections

If no elements have the specified class, the collection is empty:

```javascript
const missing = ClassName.doesNotExist;
console.log(missing.length);    // 0
console.log(missing[0]);        // undefined
console.log(missing[-1]);       // undefined
```

This doesn't throw an error — you just get an empty collection. Always check `.length` if you're unsure:

```javascript
const items = ClassName.special;

if (items.length > 0) {
  items[0].update({ textContent: "Found it!" });
} else {
  console.log("No elements with class 'special'");
}
```

---

## Live Collections

Collections returned by `ClassName` are **live** — they automatically reflect DOM changes:

```javascript
const buttons = ClassName.btn;
console.log(buttons.length);  // e.g., 3

// Add a new button to the DOM
const newBtn = document.createElement('button');
newBtn.className = 'btn';
document.body.appendChild(newBtn);

// Collection automatically updated
console.log(buttons.length);  // Now 4
console.log(buttons[-1]);     // The new button
```

---

## Comparison: ClassName vs Collections.ClassName

| Feature | `ClassName` | `Collections.ClassName` |
|---------|------------|------------------------|
| Access | Global — no prefix | Requires `Collections.` prefix |
| Result | Enhanced collection (index + negative index support) | Standard collection |
| Index access | `ClassName.btn[0]` with auto-enhancement | `Collections.ClassName.btn[0]` |
| Negative indices | ✅ `ClassName.btn[-1]` | ❌ Not available |
| Function call | ✅ `ClassName('btn')` | ✅ `Collections.ClassName('btn')` |

---

## Summary

| Aspect | Detail |
|--------|--------|
| **What** | Global shortcut for finding elements by CSS class |
| **Syntax** | `ClassName.btn` or `ClassName['nav-item']` or `ClassName('btn')` |
| **Returns** | Enhanced collection with index and negative index support |
| **Index access** | `[0]` first, `[1]` second, `[-1]` last, `[-2]` second to last |
| **Auto-enhanced** | Elements accessed by index have `.update()` automatically |
| **Live collection** | Automatically reflects DOM additions and removals |
| **Bracket notation** | Required for dashed names (`'nav-item'`) and multi-class (`'btn primary'`) |

> **Simple Rule to Remember:** `ClassName.btn` gets all elements with class `"btn"`. Add `[0]` for the first one, `[-1]` for the last one. Use bracket notation `['nav-item']` for class names that contain dashes.