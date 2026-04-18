[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Index Access & Negative Indices

## Quick Start (30 seconds)

```javascript
const buttons = ClassName.btn;

// Positive indices — count from the start
buttons[0]     // First element
buttons[1]     // Second element
buttons[2]     // Third element

// Negative indices — count from the end
buttons[-1]    // Last element
buttons[-2]    // Second to last
buttons[-3]    // Third from the end
```

---

## What is Index Access?

Index access lets you pick **a single element** from a collection by its position (index). Instead of getting all `.btn` elements, you get just the first one, or the third one, or the last one.

```
Collection: [btn0, btn1, btn2, btn3, btn4]
              ↑                        ↑
            [0]                      [-1]
```

---

## Positive Indices — Count from the Start

Positive indices start at `0` for the first element:

```
Index:     [0]    [1]    [2]    [3]    [4]
            ↓      ↓      ↓      ↓      ↓
Elements:  btn0   btn1   btn2   btn3   btn4
```

```javascript
const items = ClassName.item;

items[0]    // First element
items[1]    // Second element
items[2]    // Third element
items[3]    // Fourth element
```

---

## Negative Indices — Count from the End

Negative indices count backwards from the end. `-1` is the **last** element, `-2` is the second to last, and so on:

```
Negative:  [-5]   [-4]   [-3]   [-2]   [-1]
             ↓      ↓      ↓      ↓      ↓
Elements:  btn0   btn1   btn2   btn3   btn4
             ↑      ↑      ↑      ↑      ↑
Positive:   [0]    [1]    [2]    [3]    [4]
```

```javascript
const items = ClassName.item;

items[-1]   // Last element    (same as items[items.length - 1])
items[-2]   // Second to last  (same as items[items.length - 2])
items[-3]   // Third from end  (same as items[items.length - 3])
```

### Why Negative Indices Are Useful

Without negative indices, getting the last element requires calculating the length:

```javascript
// ❌ Verbose — need to calculate the index
const last = items[items.length - 1];
const secondLast = items[items.length - 2];

// ✅ Clean — negative index does the math for you
const last = items[-1];
const secondLast = items[-2];
```

---

## How Negative Indices Work Internally

The calculation is simple: `actualIndex = collection.length + negativeIndex`

```
Collection has 5 elements (length = 5):

items[-1]  →  5 + (-1)  =  4  →  items[4]   (last element)
items[-2]  →  5 + (-2)  =  3  →  items[3]   (second to last)
items[-3]  →  5 + (-3)  =  2  →  items[2]   (third from end)
items[-4]  →  5 + (-4)  =  1  →  items[1]
items[-5]  →  5 + (-5)  =  0  →  items[0]   (first element)
```

---

## Collection vs Element: What You Get Back

This is an important distinction:

| Access | Returns | Type |
|--------|---------|------|
| `ClassName.btn` | All matching elements | **Collection** |
| `ClassName.btn[0]` | One specific element | **Single Element** |
| `ClassName.btn[-1]` | One specific element | **Single Element** |

```javascript
// Collection — has .length, .forEach, etc.
const allButtons = ClassName.btn;
console.log(allButtons.length);        // e.g., 5
allButtons.forEach(btn => { ... });    // Iterate all

// Single element — has .update(), .textContent, etc.
const firstButton = ClassName.btn[0];
console.log(firstButton.textContent);  // "Click Me"
firstButton.update({ ... });           // Update this one element
```

---

## Practical Examples

### First and Last

```javascript
// Style the first and last items differently
ClassName.item[0].update({
  style: { borderTop: "none" }
});

ClassName.item[-1].update({
  style: { borderBottom: "none" }
});
```

### Header and Footer Rows

```javascript
// Table: first row is header, last row is footer
TagName.tr[0].update({
  style: { backgroundColor: "#333", color: "white" }
});

TagName.tr[-1].update({
  style: { backgroundColor: "#eee", fontStyle: "italic" }
});
```

### Active Navigation

```javascript
function setActiveTab(index) {
  const tabs = ClassName.tab;

  // Remove active from all
  tabs.forEach(tab => {
    tab.update({ classList: { remove: ['active'] } });
  });

  // Add active to the selected one
  tabs[index].update({
    classList: { add: ['active'] }
  });
}

setActiveTab(2);  // Activate the third tab
```

### Conditional Last Element

```javascript
const cards = ClassName.card;

// Only style the last card if there are multiple
if (cards.length > 1) {
  cards[-1].update({
    textContent: "View All...",
    style: { opacity: "0.7", cursor: "pointer" }
  });
}
```

---

## Edge Cases

### Out-of-Range Index

If the index is beyond the collection's range, you get `undefined`:

```javascript
const items = ClassName.item;  // 3 elements

items[0]     // ✅ First element
items[2]     // ✅ Last element (index 2 for 3 items)
items[5]     // undefined — only 3 elements exist
items[-4]    // undefined — collection too small
```

### Empty Collection

```javascript
const missing = ClassName.nonexistent;
console.log(missing.length);    // 0
console.log(missing[0]);        // undefined
console.log(missing[-1]);       // undefined
```

### Single-Element Collection

```javascript
const unique = ClassName.unique;  // Only 1 element
console.log(unique[0]);          // The element
console.log(unique[-1]);         // Same element (first = last)
```

### Safe Access Pattern

Always check before using an indexed element:

```javascript
const items = ClassName.item;

// Option 1: Check length first
if (items.length > 0) {
  items[0].update({ textContent: "First!" });
}

// Option 2: Check the result
const last = items[-1];
if (last) {
  last.update({ textContent: "Last!" });
}
```

---

## Index Access Works on All Three Shortcuts

| Shortcut | Index Example |
|----------|--------------|
| `ClassName` | `ClassName.btn[0]`, `ClassName.btn[-1]` |
| `TagName` | `TagName.div[0]`, `TagName.p[-1]` |
| `Name` | `Name.email[0]`, `Name.country[-1]` |

---

## Summary

| Index | What It Returns |
|-------|----------------|
| `[0]` | First element |
| `[1]` | Second element |
| `[n]` | Element at position n (0-based) |
| `[-1]` | Last element |
| `[-2]` | Second to last |
| `[-n]` | n-th element from the end |
| Out of range | `undefined` |

> **Simple Rule to Remember:** Positive indices count from the start (0 = first), negative indices count from the end (-1 = last). Always get back a single element, not a collection. Check for `undefined` if you're unsure the index exists.